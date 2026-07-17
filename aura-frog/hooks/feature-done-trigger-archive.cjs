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
const resolvePlansDir = require('./lib/plans-dir.cjs');

const PLANS_DIR = resolvePlansDir();
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');

function safeExit(code = 0) { process.exit(code); }

// Pure: walking history newest-first, has this feature's most recent status
// transition landed on `done`, and has it NOT already been epic-summarized?
// Returns true only when the feature is freshly done and un-summarized.
function shouldTriggerArchive(historyLines, featureId) {
  let mostRecentTransitionDone = false;
  let alreadySummarized = false;

  for (let i = historyLines.length - 1; i >= 0; i--) {
    let evt;
    try { evt = JSON.parse(historyLines[i]); } catch { continue; }
    if (evt.node !== featureId) continue;

    if (evt.event === 'epic_summarized' && !mostRecentTransitionDone) {
      alreadySummarized = true;
      break;
    }

    if (evt.event === 'status_transition' || evt.from || evt.to) {
      if (evt.to === 'done') { mostRecentTransitionDone = true; break; }
      if (evt.to) break; // a more recent non-done transition supersedes
    }
  }

  return mostRecentTransitionDone && !alreadySummarized;
}

function main() {
  if (!fs.existsSync(ACTIVE_FILE) || !fs.existsSync(HISTORY_FILE)) return;

  let active;
  try { active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8')); }
  catch { return; }

  const featureId = active.active && active.active.feature;
  if (!featureId) return;

  let lines = [];
  try { lines = fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean); }
  catch { return; }

  if (!shouldTriggerArchive(lines, featureId)) return;

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
    '  Run /aura-frog:reset-session to distill into permanent_memory and start fresh.\n',
  );
}

// Run as a hook; stay importable for tests. FEAT-007 / issue #5.
if (require.main === module) {
  main();
} else {
  module.exports = { shouldTriggerArchive };
}
