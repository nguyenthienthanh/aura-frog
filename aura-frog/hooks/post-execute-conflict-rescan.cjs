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
 *   - Silent if no .claude/plans/conflicts.jsonl / history.jsonl or no recent
 *     execution_completed event in history.jsonl
 *   - For each conflict in conflicts.jsonl with resolution: null AND a
 *     participant whose status just transitioned to done → run compatibility
 *     check via git diff
 *   - Emit recommendation to stderr (auto_thaw or auto_discard); actual
 *     mutation is conflict-arbiter's job
 *
 * Exit codes:
 *   0 — always (advisory; doesn't block)
 *
 * @version 1.1.0 (FEAT-007 / issue #5 — importable + pure logic extracted)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const resolvePlansDir = require('./lib/plans-dir.cjs');

const PLANS_DIR = resolvePlansDir();
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');
const CONFLICTS_FILE = path.join(PLANS_DIR, 'conflicts.jsonl');
const RESCAN_WINDOW_MS = 60 * 1000;

// Pure: newest-first scan of history lines for execution_completed(exit 0) events
// within the window. Returns a Set of node ids. History is chronological (newest
// last), so the scan stops at the first out-of-window event. The exit_code gate
// only became meaningful once post-execute-update-node read the real exit code
// from stdin (STORY-0010) — before that every event carried a bogus 0.
function collectRecentDoneTasks(historyLines, { now, windowMs }) {
  const done = new Set();
  for (let i = historyLines.length - 1; i >= 0; i--) {
    let evt;
    try { evt = JSON.parse(historyLines[i]); } catch { continue; }
    const ts = Date.parse(evt.ts || '');
    if (!Number.isFinite(ts) || (now - ts) > windowMs) break;
    if (evt.event === 'execution_completed' && evt.exit_code === 0 && evt.node) {
      done.add(evt.node);
    }
  }
  return done;
}

// Pure: fold conflicts.jsonl (append-only, may have many lines per conflict) to
// the latest record per conflict_id. Malformed / id-less lines are skipped.
function foldLatestConflicts(conflictLines) {
  const latest = new Map();
  for (const line of conflictLines) {
    try {
      const c = JSON.parse(line);
      if (c.conflict_id) latest.set(c.conflict_id, c);
    } catch {/* skip */}
  }
  return latest;
}

// Pure: given a conflict and the set of just-done tasks, identify the blocker
// (a participant that just finished) and its frozen pending-confirm sibling.
// Returns {blocker, frozen} or null when this conflict isn't actionable (already
// resolved, no just-done participant, or no frozen sibling).
function findRescanPair(conflict, recentDoneTasks) {
  if (!conflict || conflict.resolution) return null;
  const participants = conflict.participants || [];
  const blocker = participants.find(p => p && recentDoneTasks.has(p.task));
  if (!blocker) return null;
  const frozen = participants.find(p =>
    p && p.task !== blocker.task && p.role === 'pending-confirm'
  );
  if (!frozen) return null;
  return { blocker, frozen };
}

// Pure: map a compatibility verdict (true / false / null-unknown) to the
// recommendation string.
function recommendationFor(compatible) {
  if (compatible === true) return 'auto_thaw';
  if (compatible === false) return 'auto_discard';
  return 'inconclusive — manual /aura-frog:plan-thaw recommended';
}

// Pure: build the advisory history event for a recommendation.
function buildRescanEvent({ conflictId, blocker, frozen, recommendation, ts }) {
  return {
    ts,
    conflict_id: conflictId,
    event: 'conflict_rescan_recommendation',
    blocker,
    frozen,
    recommendation,
    actor: 'post-execute-conflict-rescan',
  };
}

// I/O: compatibility check — did the blocker's actual output (git diff since its
// latest checkpoint) still touch the frozen sibling's planned files? Returns
// true (compatible), false (still overlaps), or null (couldn't determine).
function checkCompatibility(plansDir, blockerTask, plannedFiles) {
  try {
    const checkpointsDir = path.join(plansDir, 'checkpoints');
    if (!fs.existsSync(checkpointsDir)) return null;
    const checkpoints = fs.readdirSync(checkpointsDir)
      .filter(f => f.startsWith(`${blockerTask}.`))
      .sort()
      .reverse();
    if (checkpoints.length === 0) return null;
    const cp = JSON.parse(fs.readFileSync(path.join(checkpointsDir, checkpoints[0]), 'utf8'));
    if (!cp.git_sha) return null;
    const diff = execSync(`git diff --name-only ${cp.git_sha}..HEAD 2>/dev/null`, { encoding: 'utf8' }).trim();
    const changed = diff.split('\n').filter(Boolean);
    return !changed.some(f => plannedFiles.includes(f));
  } catch {
    return null;
  }
}

function main() {
  if (!fs.existsSync(CONFLICTS_FILE) || !fs.existsSync(HISTORY_FILE)) return;

  let historyLines = [];
  try { historyLines = fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean); }
  catch { return; }

  const recentDoneTasks = collectRecentDoneTasks(historyLines, { now: Date.now(), windowMs: RESCAN_WINDOW_MS });
  if (recentDoneTasks.size === 0) return;

  let conflictLines = [];
  try { conflictLines = fs.readFileSync(CONFLICTS_FILE, 'utf8').split('\n').filter(Boolean); }
  catch { return; }

  const recommendations = [];
  for (const [cid, conflict] of foldLatestConflicts(conflictLines)) {
    const pair = findRescanPair(conflict, recentDoneTasks);
    if (!pair) continue;
    const plannedFiles = (conflict.overlap && conflict.overlap.files) || [];
    const compatible = checkCompatibility(PLANS_DIR, pair.blocker.task, plannedFiles);
    recommendations.push({
      conflict_id: cid,
      blocker: pair.blocker.task,
      frozen: pair.frozen.task,
      recommendation: recommendationFor(compatible),
    });
  }

  if (recommendations.length === 0) return;

  const lines = recommendations.map(r =>
    `  ${r.conflict_id}: blocker=${r.blocker} done; frozen=${r.frozen} → ${r.recommendation}`
  );
  process.stderr.write(`[conflict-rescan] ${recommendations.length} pending decision(s):\n${lines.join('\n')}\n`);

  // Append advisory history events (arbiter agent applies the actual mutation).
  const ts = new Date().toISOString();
  for (const r of recommendations) {
    try {
      fs.appendFileSync(HISTORY_FILE, JSON.stringify(buildRescanEvent({
        conflictId: r.conflict_id, blocker: r.blocker, frozen: r.frozen, recommendation: r.recommendation, ts,
      })) + '\n');
    } catch {/* best-effort */}
  }
}

// Run as a hook; stay importable for tests. Previously the entire rescan ran at
// module scope with process.exit() on require. FEAT-007 / issue #5.
if (require.main === module) {
  main();
} else {
  module.exports = {
    collectRecentDoneTasks, foldLatestConflicts, findRescanPair, recommendationFor, buildRescanEvent,
  };
}
