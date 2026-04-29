#!/usr/bin/env node
/**
 * Aura Frog — Tool Call Tracer
 *
 * Fires: PreToolUse + PostToolUse for Bash | Edit | Write | Read | Grep | Glob
 * Purpose: Emit append-only trace events to .aura/plans/traces/{TASK_ID}.jsonl
 *          Used by /aura:trace and grounding-discipline rule.
 *
 * Behavior:
 *   - Silent if no active task
 *   - Pre-phase: emits `tool_call` event with tool_name + args_hash
 *   - Post-phase: emits `tool_result` event with exit_code + result_hash + duration_ms
 *   - For Read: also emits a `file_read` event with path + sha256 (cheap, exact)
 *
 * Exit codes:
 *   0 — success (always; this is a recorder)
 *
 * @version 1.0.0 (v3.7.0-alpha.2)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const TRACES_DIR = path.join(PLANS_DIR, 'traces');

function safeExit(code = 0) { process.exit(code); }

if (!fs.existsSync(ACTIVE_FILE)) safeExit(0);

let active;
try {
  active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8'));
} catch {
  safeExit(0);
}

const taskId = active.active && active.active.task;
if (!taskId) safeExit(0);

const phase = process.env.CLAUDE_HOOK_PHASE || 'pre'; // 'pre' or 'post'
const toolName = process.env.CLAUDE_TOOL_NAME || 'unknown';
const ts = new Date().toISOString();

if (!fs.existsSync(TRACES_DIR)) fs.mkdirSync(TRACES_DIR, { recursive: true });
const traceFile = path.join(TRACES_DIR, `${taskId}.jsonl`);

function nextEventId() {
  let n = 0;
  if (fs.existsSync(traceFile)) {
    n = fs.readFileSync(traceFile, 'utf8').split('\n').filter(Boolean).length;
  }
  const taskNum = taskId.replace(/[^0-9]/g, '');
  return `TR-${taskNum}-${String(n + 1).padStart(3, '0')}`;
}

function hash(s) {
  return crypto.createHash('sha256').update(s || '').digest('hex').slice(0, 16);
}

function append(evt) {
  try {
    fs.appendFileSync(traceFile, JSON.stringify(evt) + '\n');
  } catch (err) {
    process.stderr.write(`[tool-tracer] WARN: trace append failed: ${err.message}\n`);
  }
}

const argsRaw = process.env.CLAUDE_TOOL_ARGS || '';
const argsHash = hash(argsRaw);

if (phase === 'pre') {
  append({
    ts,
    event_id: nextEventId(),
    task_id: taskId,
    type: 'tool_call',
    payload: { tool_name: toolName, args_hash: argsHash }
  });

  // Special-case: Read tool emits a file_read event with the file path
  if (toolName === 'Read') {
    let filePath = null;
    try {
      const parsed = argsRaw ? JSON.parse(argsRaw) : {};
      filePath = parsed.file_path || parsed.path || null;
    } catch {
      // not JSON — try to extract from raw string
      const m = argsRaw.match(/file_path["\s:]+([^"\s,}]+)/);
      if (m) filePath = m[1];
    }
    if (filePath && fs.existsSync(filePath)) {
      let sha = null;
      try {
        sha = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').slice(0, 16);
      } catch {/* ignore */}
      append({
        ts,
        event_id: nextEventId(),
        task_id: taskId,
        type: 'file_read',
        payload: { path: filePath, sha256: sha }
      });
    }
  }
} else {
  // post
  const exitCode = parseInt(process.env.CLAUDE_TOOL_EXIT_CODE || '0', 10);
  const durationMs = parseInt(process.env.CLAUDE_TOOL_DURATION_MS || '0', 10);
  append({
    ts,
    event_id: nextEventId(),
    task_id: taskId,
    type: 'tool_result',
    payload: { tool_name: toolName, exit_code: exitCode, duration_ms: durationMs }
  });
}

safeExit(0);
