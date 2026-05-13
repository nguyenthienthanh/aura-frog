#!/usr/bin/env node
/**
 * Aura Frog — Tool Call Tracer
 *
 * Fires: PreToolUse + PostToolUse for Bash | Edit | Write | Read | Grep | Glob
 * Purpose: Emit append-only trace events to .claude/plans/traces/{TASK_ID}.jsonl
 *          Used by /aura-frog:trace and grounding-discipline rule.
 *
 * Behavior:
 *   - Silent if no active task
 *   - Pre-phase: emits `tool_call` event with tool_name + args_hash
 *   - Post-phase: emits `tool_result` event with exit_code + result_hash + duration_ms
 *   - For Read: also emits a `file_read` event with path + sha256 (cheap, exact)
 *
 * Disable:
 *   AF_TRACE_DISABLED=true — no trace events emitted; .claude/plans/traces/ stays empty.
 *
 * Exit codes:
 *   0 — success (always; this is a recorder)
 *
 * @version 1.1.0 (AF_TRACE_DISABLED wired)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const resolvePlansDir = require('./lib/plans-dir.cjs');

const PLANS_DIR = resolvePlansDir();
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');

function safeExit(code = 0) { process.exit(code); }

if (process.env.AF_TRACE_DISABLED === 'true') safeExit(0);
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

// v3.7.3+: trace.jsonl lives INSIDE the task folder
// (features/.../stories/.../tasks/{ID}_{slug}/trace.jsonl). Find that folder
// by searching for a file whose `id:` frontmatter matches taskId.
function resolveTaskFolder(plansDir, id) {
  const featuresRoot = path.join(plansDir, 'features');
  if (!fs.existsSync(featuresRoot)) return null;
  const walk = (dir) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return null; }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        // Look for a task.md inside this dir with matching id.
        const candidate = path.join(full, 'task.md');
        if (fs.existsSync(candidate)) {
          try {
            const body = fs.readFileSync(candidate, 'utf8');
            const m = body.match(/^id:\s*(.+?)\s*$/m);
            if (m && m[1].trim().replace(/^["']|["']$/g, '') === id) return full;
          } catch { /* skip */ }
        }
        const sub = walk(full);
        if (sub) return sub;
      }
    }
    return null;
  };
  return walk(featuresRoot);
}

let traceFile, counterFile;
const taskFolder = resolveTaskFolder(PLANS_DIR, taskId);
if (taskFolder) {
  // v3.7.3+ co-located layout.
  traceFile = path.join(taskFolder, 'trace.jsonl');
  counterFile = path.join(taskFolder, '.trace.count');
} else {
  // Legacy fallback: top-level traces/ dir (pre-v3.7.3, or task folder lookup failed).
  const tracesDir = path.join(PLANS_DIR, 'traces');
  if (!fs.existsSync(tracesDir)) fs.mkdirSync(tracesDir, { recursive: true });
  traceFile = path.join(tracesDir, `${taskId}.jsonl`);
  counterFile = path.join(tracesDir, `${taskId}.count`);
}

// Event counter — persisted in a sibling counter file so each fresh Node
// process reads at most 4 bytes (not the full trace). True O(1) per event;
// fixes the prior O(n²) over a task lifetime that the half-measure
// in-memory cache only solved within a single invocation.
// Atomic-ish: read counter → +1 → write counter (no flock; single-driver
// assumption per spec §2.1.6, and the JSONL append below would race anyway).
// taskSlug keeps the id safe for taskIds like "T2.3" vs "T23".
const taskSlug = taskId.replace(/[^A-Za-z0-9]+/g, '-');
function nextEventId() {
  let n = 0;
  try {
    n = parseInt(fs.readFileSync(counterFile, 'utf8'), 10) || 0;
  } catch {/* fresh task or unreadable — start from 0 */}
  n++;
  try {
    // Atomic write so a kill -9 mid-write doesn't corrupt the counter.
    const tmp = `${counterFile}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, String(n));
    fs.renameSync(tmp, counterFile);
  } catch {/* best-effort; never block trace emission on counter persist */}
  return `TR-${taskSlug}-${String(n).padStart(3, '0')}`;
}

// Cap file hashing to keep huge binaries from blocking the hook.
const MAX_HASH_BYTES = 1024 * 1024; // 1 MB
function hashFileBounded(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size > MAX_HASH_BYTES) return `oversize-${stat.size}`;
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').slice(0, 16);
  } catch {
    return null;
  }
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
      const sha = hashFileBounded(filePath);
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
