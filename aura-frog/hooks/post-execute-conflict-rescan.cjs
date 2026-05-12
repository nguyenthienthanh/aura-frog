#!/usr/bin/env node
/**
 * Aura Frog — Post-Execute Conflict Rescan
 *
 * Fires: PostToolUse (Edit | Write) async
 * Purpose: When a blocker task transitions to `done`, scan frozen siblings
 *          that conflict with it. Auto-thaw if compatible, mark replan_required
 *          if incompatible (per spec §21.6).
 *
 * Behavior:
 *   - Silent if no .claude/plans/active.json or no recent execution_completed
 *     event in history.jsonl
 *   - For each conflict in conflicts.jsonl with resolution: null AND a
 *     participant whose status just transitioned to done → run compatibility
 *     check via git diff
 *   - Emit recommendation to stderr (auto_thaw or auto_discard); actual
 *     mutation is conflict-arbiter's job
 *
 * Exit codes:
 *   0 — always (advisory; doesn't block)
 *
 * @version 1.0.0 (v3.7.0-beta.2)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');
const CONFLICTS_FILE = path.join(PLANS_DIR, 'conflicts.jsonl');
const RESCAN_WINDOW_MS = 60 * 1000;

function safeExit(code = 0) { process.exit(code); }

if (!fs.existsSync(CONFLICTS_FILE) || !fs.existsSync(HISTORY_FILE)) safeExit(0);

// Find recent execution_completed events for tasks that match a conflict participant
let historyLines = [];
try { historyLines = fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean); }
catch { safeExit(0); }

const now = Date.now();
const recentDoneTasks = new Set();
for (let i = historyLines.length - 1; i >= 0; i--) {
  let evt;
  try { evt = JSON.parse(historyLines[i]); } catch { continue; }
  const ts = Date.parse(evt.ts || '');
  if (!Number.isFinite(ts) || (now - ts) > RESCAN_WINDOW_MS) break;
  if (evt.event === 'execution_completed' && evt.exit_code === 0 && evt.node) {
    recentDoneTasks.add(evt.node);
  }
}

if (recentDoneTasks.size === 0) safeExit(0);

// Parse conflicts.jsonl, fold to latest per conflict_id
let conflictLines = [];
try { conflictLines = fs.readFileSync(CONFLICTS_FILE, 'utf8').split('\n').filter(Boolean); }
catch { safeExit(0); }

const latestConflicts = new Map();
for (const line of conflictLines) {
  try {
    const c = JSON.parse(line);
    if (c.conflict_id) latestConflicts.set(c.conflict_id, c);
  } catch {/* skip */}
}

const recommendations = [];

for (const [cid, conflict] of latestConflicts) {
  if (conflict.resolution) continue; // already resolved

  // Find which participant just transitioned to done — that's the blocker
  const doneParticipant = (conflict.participants || []).find(p => recentDoneTasks.has(p.task));
  if (!doneParticipant) continue;

  // Find frozen sibling
  const frozenSibling = (conflict.participants || []).find(p =>
    p.task !== doneParticipant.task && p.role === 'pending-confirm'
  );
  if (!frozenSibling) continue;

  // Compatibility check: did the actual blocker output overlap the frozen
  // sibling's planned artifacts? Use git diff against checkpoint git_sha.
  let compatible = null;
  try {
    // Find the most recent checkpoint for the blocker
    const checkpointsDir = path.join(PLANS_DIR, 'checkpoints');
    if (fs.existsSync(checkpointsDir)) {
      const checkpoints = fs.readdirSync(checkpointsDir)
        .filter(f => f.startsWith(`${doneParticipant.task}.`))
        .sort()
        .reverse();
      if (checkpoints.length > 0) {
        const cp = JSON.parse(fs.readFileSync(path.join(checkpointsDir, checkpoints[0]), 'utf8'));
        if (cp.git_sha) {
          const diff = execSync(`git diff --name-only ${cp.git_sha}..HEAD 2>/dev/null`, { encoding: 'utf8' }).trim();
          const changed = diff.split('\n').filter(Boolean);
          const plannedFiles = (conflict.overlap && conflict.overlap.files) || [];
          const stillOverlaps = changed.some(f => plannedFiles.includes(f));
          compatible = !stillOverlaps;
        }
      }
    }
  } catch {/* git unavailable or other failure */}

  const recommendation = compatible === true
    ? 'auto_thaw'
    : compatible === false
      ? 'auto_discard'
      : 'inconclusive — manual /aura-frog:plan-thaw recommended';

  recommendations.push({
    conflict_id: cid,
    blocker: doneParticipant.task,
    frozen: frozenSibling.task,
    recommendation,
  });
}

if (recommendations.length === 0) safeExit(0);

const lines = recommendations.map(r =>
  `  ${r.conflict_id}: blocker=${r.blocker} done; frozen=${r.frozen} → ${r.recommendation}`
);
process.stderr.write(`[conflict-rescan] ${recommendations.length} pending decision(s):\n${lines.join('\n')}\n`);

// Append history events (advisory only — arbiter agent applies the mutation)
const ts = new Date().toISOString();
for (const r of recommendations) {
  try {
    fs.appendFileSync(HISTORY_FILE, JSON.stringify({
      ts,
      conflict_id: r.conflict_id,
      event: 'conflict_rescan_recommendation',
      blocker: r.blocker,
      frozen: r.frozen,
      recommendation: r.recommendation,
      actor: 'post-execute-conflict-rescan',
    }) + '\n');
  } catch {/* best-effort */}
}

safeExit(0);
