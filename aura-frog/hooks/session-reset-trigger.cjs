#!/usr/bin/env node
/**
 * Aura Frog — Session Reset Trigger
 *
 * Fires: PostToolUse (Write)
 * Purpose: After epic-summarizer writes a new section to permanent_memory.md,
 *          surface a one-line prompt suggesting the user run /aura:reset-session.
 *
 * Detection:
 *   - Tail history.jsonl for the most recent epic_summarized event
 *   - If timestamp is within the last 60 seconds AND no later session_reset event
 *     for the same feature, emit the prompt
 *
 * Anti-spam:
 *   - Cap: emit at most once per feature_id (tracked via SESSION_FLAG file)
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
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');
const SESSION_FLAG_DIR = path.join(process.cwd(), '.claude', 'logs');
const SESSION_FLAG_PREFIX = '.session-reset-prompt-shown-';

const PROMPT_WINDOW_MS = 60 * 1000;

function safeExit(code = 0) { process.exit(code); }

if (!fs.existsSync(HISTORY_FILE)) safeExit(0);

let lines = [];
try {
  lines = fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean);
} catch {
  safeExit(0);
}

let recentSummarize = null;
let resetSeen = false;

for (let i = lines.length - 1; i >= 0; i--) {
  let evt;
  try { evt = JSON.parse(lines[i]); } catch { continue; }

  if (evt.event === 'session_reset' && !recentSummarize) {
    resetSeen = true;
    break;
  }

  if (evt.event === 'epic_summarized') {
    const ts = Date.parse(evt.ts || '');
    if (Number.isFinite(ts) && (Date.now() - ts) <= PROMPT_WINDOW_MS) {
      recentSummarize = evt;
    }
    break;
  }
}

if (!recentSummarize || resetSeen) safeExit(0);

const featureId = recentSummarize.feature || recentSummarize.node || 'unknown';
const flagPath = path.join(SESSION_FLAG_DIR, SESSION_FLAG_PREFIX + featureId);

if (fs.existsSync(flagPath)) safeExit(0);

try {
  if (!fs.existsSync(SESSION_FLAG_DIR)) fs.mkdirSync(SESSION_FLAG_DIR, { recursive: true });
  fs.writeFileSync(flagPath, new Date().toISOString());
} catch {/* best-effort */}

process.stderr.write(
  `[session-reset] Epic ${featureId} distilled to permanent_memory.md\n` +
  `  Run /aura:reset-session to clear conversation context (history + memory + plan tree preserved).\n`
);

safeExit(0);
