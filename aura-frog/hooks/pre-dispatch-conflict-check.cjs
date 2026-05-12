#!/usr/bin/env node
/**
 * Aura Frog — Pre-Dispatch Conflict Check
 *
 * Fires: PreToolUse (Edit | Write | Bash) — when proposed tool calls would
 *        mutate files that a pending-confirm sibling task also targets.
 * Purpose: Run conflict-detector L1+L2 before T4 dispatch. If conflict
 *          detected and confidence is high, write a CONFLICT-NNNNN record
 *          to .claude/plans/conflicts.jsonl and emit a hint to invoke
 *          conflict-arbiter.
 *
 * Behavior:
 *   - Silent if no .claude/plans/active.json or active.task null
 *   - Resolve siblings under same parent T3 with status: planned (pending-confirm)
 *   - Run scripts/conflicts/check-l1-files.sh
 *   - On L1 overlap with confidence < 0.95 → also run check-l2-syntactic.sh
 *   - On any conflict → mint CONFLICT-NNNNN, append conflicts.jsonl, emit
 *     stderr hint + history.jsonl event
 *
 * Anti-block: this hook is informational + state-recording. Actual blocking
 * happens through master-planner reading the conflicts.jsonl record. This
 * keeps the hook fast and the policy in one place (conflict-arbiter).
 *
 * Exit codes:
 *   0 — always (records state; doesn't block tool calls directly)
 *
 * @version 1.0.0 (v3.7.0-beta.2)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');
const CONFLICTS_FILE = path.join(PLANS_DIR, 'conflicts.jsonl');
const COUNTERS_FILE = path.join(PLANS_DIR, '.counters.json');
const L1_SCRIPT = path.join(PLUGIN_ROOT, 'scripts', 'conflicts', 'check-l1-files.sh');
const L2_SCRIPT = path.join(PLUGIN_ROOT, 'scripts', 'conflicts', 'check-l2-syntactic.sh');

function safeExit(code = 0) { process.exit(code); }

if (!fs.existsSync(ACTIVE_FILE)) safeExit(0);

let active;
try { active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8')); }
catch { safeExit(0); }

const taskId = active.active && active.active.task;
const storyId = active.active && active.active.story;
if (!taskId || !storyId) safeExit(0);

if (!fs.existsSync(L1_SCRIPT)) safeExit(0);

// Find sibling tasks under the same Story
function findSiblings() {
  const storyDir = path.join(PLANS_DIR, 'features', '*', 'stories', storyId, 'tasks');
  const siblings = [];
  try {
    const featuresDir = path.join(PLANS_DIR, 'features');
    if (!fs.existsSync(featuresDir)) return [];
    for (const featDir of fs.readdirSync(featuresDir)) {
      const tasksDir = path.join(featuresDir, featDir, 'stories', storyId, 'tasks');
      if (!fs.existsSync(tasksDir)) continue;
      for (const f of fs.readdirSync(tasksDir)) {
        if (!f.endsWith('.md')) continue;
        const sid = f.replace(/\.md$/, '');
        if (sid === taskId) continue;
        // Check status
        const content = fs.readFileSync(path.join(tasksDir, f), 'utf8');
        const m = content.match(/^status:[\s]*(\w+)/m);
        const status = m ? m[1] : 'unknown';
        if (status === 'planned' || status === 'blocked' || status === 'blocked-on-confirm') {
          siblings.push(sid);
        }
      }
    }
  } catch {/* best-effort */}
  return siblings;
}

const siblings = findSiblings();
if (siblings.length === 0) safeExit(0);

// Run L1 detector
const l1Result = spawnSync('bash', [
  L1_SCRIPT,
  '--task', taskId,
  '--siblings', siblings.join(','),
], { encoding: 'utf-8', timeout: 1000, cwd: process.cwd() });

let l1Output;
try { l1Output = JSON.parse(l1Result.stdout || '{}'); }
catch { safeExit(0); }

if (!l1Output.overlap) safeExit(0);

let detectedLayer = 'L1';
let conflictPayload = l1Output;

// If L1 confidence not high enough, drill into L2
if (l1Output.confidence < 0.95 && fs.existsSync(L2_SCRIPT) && l1Output.files) {
  const l2Result = spawnSync('bash', [
    L2_SCRIPT,
    '--files', l1Output.files.join(','),
  ], { encoding: 'utf-8', timeout: 2000, cwd: process.cwd() });

  let l2Output;
  try { l2Output = JSON.parse(l2Result.stdout || '{}'); }
  catch { l2Output = {}; }

  if (l2Output.overlap) {
    detectedLayer = 'L2';
    conflictPayload = { ...l1Output, ...l2Output };
  }
}

// Mint CONFLICT-NNNNN
function nextConflictId() {
  let counters = {};
  try { counters = JSON.parse(fs.readFileSync(COUNTERS_FILE, 'utf8')); }
  catch { counters = { counters: { CONFLICT: 0 } }; }
  if (!counters.counters) counters.counters = {};
  counters.counters.CONFLICT = (counters.counters.CONFLICT || 0) + 1;
  counters.updated_at = new Date().toISOString();
  try { fs.writeFileSync(COUNTERS_FILE, JSON.stringify(counters, null, 2)); }
  catch {/* best-effort */}
  return `CONFLICT-${String(counters.counters.CONFLICT).padStart(5, '0')}`;
}

const conflictId = nextConflictId();
const ts = new Date().toISOString();

const record = {
  conflict_id: conflictId,
  detected_at: ts,
  detected_by: 'pre-dispatch-conflict-check.cjs',
  layer: detectedLayer,
  type: detectedLayer === 'L1' ? 'file_overlap' : 'function_overlap',
  participants: [
    { task: taskId, role: 'proposed' },
    ...(conflictPayload.with || []).map(s => ({ task: s, role: 'pending-confirm' })),
  ],
  overlap: {
    files: conflictPayload.files || null,
    functions: conflictPayload.functions || null,
    schema_elements: null,
  },
  confidence: conflictPayload.confidence || 1.0,
  arbitration: null,
  actions_taken: [],
  resolution: null,
  resolved_at: null,
};

try {
  fs.appendFileSync(CONFLICTS_FILE, JSON.stringify(record) + '\n');
} catch (err) {
  process.stderr.write(`[pre-dispatch-conflict] WARN: conflicts.jsonl append failed: ${err.message}\n`);
  safeExit(0);
}

try {
  fs.appendFileSync(HISTORY_FILE, JSON.stringify({
    ts,
    node: taskId,
    event: 'conflict_detected',
    conflict_id: conflictId,
    layer: detectedLayer,
    actor: 'pre-dispatch-conflict-check',
  }) + '\n');
} catch {/* best-effort */}

process.stderr.write(
  `[conflict-detected] ${conflictId} (${detectedLayer}) — ${taskId} overlaps ${(conflictPayload.with || []).join(', ')}\n` +
  `  files: ${(conflictPayload.files || []).join(', ')}\n` +
  `  Run /aura-frog:plan-conflicts show ${conflictId} for details, or wait for conflict-arbiter to decide.\n`
);

safeExit(0);
