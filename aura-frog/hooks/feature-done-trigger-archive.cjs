#!/usr/bin/env node
/**
 * Aura Frog — Feature Done → Archive Trigger
 *
 * Fires: PostToolUse (Edit | Write)
 * Purpose: When a T2 (Feature) plan node transitions to status: done, emit a
 *          hint that epic-summarizer + plan-archivist should run (master-planner
 *          decides actual invocation; this hook only signals the boundary).
 *
 * Behavior:
 *   - Silent if .claude/plans/active.json missing or active.feature null
 *   - Reads the active feature node; checks status field
 *   - On done transition (compared against last-seen status in history.jsonl):
 *     - Append history.jsonl event: feature_done_detected
 *     - Emit stderr suggestion: "T2 done — invoke /aura-frog:reset-session to distill Epic"
 *
 * Detection method:
 *   - Tail history.jsonl for the most recent {node: <FEAT-ID>, status_to: ...} event
 *   - If most recent shows transition to "done" AND no later "epic_summarized" event,
 *     surface the suggestion
 *
 * Exit codes:
 *   0 — always (informational)
 *
 * @version 1.0.0 (v3.7.0-alpha.4)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');

function safeExit(code = 0) { process.exit(code); }

if (!fs.existsSync(ACTIVE_FILE) || !fs.existsSync(HISTORY_FILE)) safeExit(0);

let active;
try {
  active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8'));
} catch {
  safeExit(0);
}

const featureId = active.active && active.active.feature;
if (!featureId) safeExit(0);

let lines = [];
try {
  lines = fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean);
} catch {
  safeExit(0);
}

let mostRecentTransitionDone = false;
let alreadySummarized = false;

for (let i = lines.length - 1; i >= 0; i--) {
  let evt;
  try { evt = JSON.parse(lines[i]); } catch { continue; }

  if (evt.node !== featureId) continue;

  if (evt.event === 'epic_summarized' && !mostRecentTransitionDone) {
    alreadySummarized = true;
    break;
  }

  if (evt.event === 'status_transition' || evt.from || evt.to) {
    if (evt.to === 'done') {
      mostRecentTransitionDone = true;
      break;
    } else if (evt.to) {
      break;
    }
  }
}

if (!mostRecentTransitionDone || alreadySummarized) safeExit(0);

try {
  fs.appendFileSync(HISTORY_FILE, JSON.stringify({
    ts: new Date().toISOString(),
    node: featureId,
    event: 'feature_done_detected',
    actor: 'feature-done-trigger-archive',
  }) + '\n');
} catch {/* best-effort */}

process.stderr.write(
  `[feature-done] ${featureId} reached status: done\n` +
  `  Run /aura-frog:reset-session to distill into permanent_memory and start fresh.\n`
);

safeExit(0);
