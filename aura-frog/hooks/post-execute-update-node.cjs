#!/usr/bin/env node
/**
 * Aura Frog — Post-Execute: Update Node Status
 *
 * Fires: PostToolUse (Bash | Edit | Write | Read)
 * Purpose: When a tool execution completes, update the active T4 task's status
 *          and trigger failure-classifier on non-zero exit.
 *
 * Behavior:
 *   - Silent exit if .aura/plans/active.json missing or active.task null
 *   - On exit_code === 0 → optionally promote status if acceptance hook says so
 *     (acceptance check is a downstream concern — this hook only records execution)
 *   - On exit_code !== 0 → increment failed_attempts, append history.jsonl event,
 *     and emit a hint to stderr suggesting failure-classifier invocation
 *
 * Exit codes:
 *   0 — success (always; this is a recorder, not a guard)
 *
 * @version 1.0.0 (v3.7.0-alpha.2)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');

function safeExit(code = 0) {
  process.exit(code);
}

if (!fs.existsSync(ACTIVE_FILE)) safeExit(0);

let active;
try {
  active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8'));
} catch (err) {
  process.stderr.write(`[post-execute] WARN: active.json malformed: ${err.message}\n`);
  safeExit(0);
}

const taskId = active.active && active.active.task;
if (!taskId) safeExit(0);

const exitCode = parseInt(process.env.CLAUDE_TOOL_EXIT_CODE || '0', 10);
const toolName = process.env.CLAUDE_TOOL_NAME || 'unknown';

const ts = new Date().toISOString();

function appendHistory(event) {
  try {
    fs.appendFileSync(HISTORY_FILE, JSON.stringify(event) + '\n');
  } catch (err) {
    process.stderr.write(`[post-execute] WARN: history append failed: ${err.message}\n`);
  }
}

if (exitCode !== 0) {
  appendHistory({
    ts,
    node: taskId,
    event: 'execution_failed',
    tool: toolName,
    exit_code: exitCode,
    actor: 'post-execute-update-node'
  });
  process.stderr.write(
    `[post-execute] task=${taskId} tool=${toolName} exit=${exitCode}\n` +
    `  invoke failure-classifier skill to classify (F1-F5) before retry/replan\n`
  );
} else {
  appendHistory({
    ts,
    node: taskId,
    event: 'execution_completed',
    tool: toolName,
    exit_code: 0,
    actor: 'post-execute-update-node'
  });
}

safeExit(0);
