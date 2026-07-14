#!/usr/bin/env node
/**
 * Aura Frog — Pre-flight Validation
 *
 * Fires: PreToolUse (Bash | Edit | Write | Read)
 * Purpose: Run Tier 1 bash linters before tool execution. Block tool call on
 *          fail (exit 2). Surface warning (exit 1) but allow.
 *
 * Behavior:
 *   - Silent if AF_PREFLIGHT_DISABLED=true
 *   - Silent if scripts/preflight/run-all.sh missing
 *   - Honors per-call bypass via AF_PREFLIGHT_BYPASS=true (set by /aura-frog:preflight bypass)
 *   - On exit 2 from run-all.sh: prints "BLOCKED" message AND exits non-zero
 *     (claude-code blocks the tool when PreToolUse hook exits non-zero)
 *   - On exit 1: prints WARN message, exits 0 (advisory only)
 *
 * Exit codes:
 *   0 — pass through (no findings or warn-only)
 *   2 — block tool call (run-all.sh returned fail)
 *
 * @version 1.0.0 (v3.7.0-beta.1)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

if (process.env.AF_PREFLIGHT_DISABLED === 'true') process.exit(0);

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const RUN_ALL = path.join(PLUGIN_ROOT, 'scripts', 'preflight', 'run-all.sh');

if (!fs.existsSync(RUN_ALL)) process.exit(0);


const { findProjectRoot, readHookInputCompat } = require('./lib/hook-runtime.cjs');

// Bridge the stdin tool context onto the env vars run-all.sh reads (it still
// auto-dispatches from CLAUDE_TOOL_* env). The old code read the tool name from
// a never-set env var, so the pre-flight gate exited before running and
// validated NOTHING. The parent now reads stdin and passes it to the child.
function buildChildEnv(input, baseEnv) {
  const env = { ...baseEnv };
  const ti = (input && input.tool_input) || null;
  if (input && input.tool_name) env.CLAUDE_TOOL_NAME = input.tool_name;
  if (ti && typeof ti === 'object') {
    env.CLAUDE_TOOL_INPUT = JSON.stringify(ti);
    env.CLAUDE_TOOL_ARGS = JSON.stringify(ti);
    const fp = ti.file_path || ti.path;
    if (fp) env.CLAUDE_FILE_PATHS = fp;
    if (ti.command) env.CLAUDE_TOOL_COMMAND = ti.command;
  }
  return env;
}
const BYPASS_FLAG = path.join(findProjectRoot(), '.claude', 'logs', '.preflight-bypass');
const BYPASS_COUNT_FILE = path.join(findProjectRoot(), '.claude', 'logs', '.preflight-bypass-count');
const JQ_WARN_FLAG = path.join(findProjectRoot(), '.claude', 'logs', '.preflight-jq-missing');

// Every Tier-1 shell linter parses the tool payload JSON with `jq`. Without jq on
// PATH, validate-tool-input.sh reads empty fields and FALSELY reports "missing
// command/file_path" — which exits 2 and blocks EVERY tool call, bricking the
// session. Detect the missing dependency up front and skip pre-flight entirely
// (same fail-open philosophy as the missing-run-all.sh guard above), warning once
// so the user can install jq to re-enable the checks.
function jqAvailable() {
  try {
    return spawnSync('jq', ['--version'], { timeout: 2000 }).status === 0;
  } catch {
    return false;
  }
}

function warnJqMissingOnce() {
  try {
    if (fs.existsSync(JQ_WARN_FLAG)) return; // already warned this project — stay quiet
    fs.mkdirSync(path.dirname(JQ_WARN_FLAG), { recursive: true });
    fs.writeFileSync(JQ_WARN_FLAG, 'jq not found on PATH; pre-flight checks skipped\n');
  } catch { /* best-effort — fall through and print anyway */ }
  process.stderr.write(
    '[preflight] jq not found on PATH — Tier-1 pre-flight checks are SKIPPED (not blocking). ' +
    'Install jq (e.g. `brew install jq`) to re-enable input/secret/path validation.\n'
  );
}

// Single-use bypass flag — consume on read
function consumeBypassFlag() {
  if (!fs.existsSync(BYPASS_FLAG)) return false;
  try {
    const meta = fs.readFileSync(BYPASS_FLAG, 'utf-8');
    fs.unlinkSync(BYPASS_FLAG);
    bumpBypassCount();
    process.stderr.write(`[preflight] bypass consumed (${meta.split('\n')[0] || 'reason: unspecified'})\n`);
    return true;
  } catch {
    return false;
  }
}

function bumpBypassCount() {
  let n = 0;
  try { n = parseInt(fs.readFileSync(BYPASS_COUNT_FILE, 'utf-8'), 10) || 0; } catch {}
  n++;
  try {
    fs.mkdirSync(path.dirname(BYPASS_COUNT_FILE), { recursive: true });
    fs.writeFileSync(BYPASS_COUNT_FILE, String(n));
  } catch {/* best-effort */}
  if (n >= 3) {
    process.stderr.write(`[preflight] WARN: ${n} bypasses consumed this session — review whether checks need updating\n`);
  }
}

function main() {
 if (consumeBypassFlag()) process.exit(0);

 if (!jqAvailable()) { warnJqMissingOnce(); process.exit(0); }

 let input = {};
 try { input = readHookInputCompat(); } catch { /* env fallback below */ }
 const toolName = (input && input.tool_name) || process.env.CLAUDE_TOOL_NAME || '';
 if (!toolName) process.exit(0);

 const result = spawnSync('bash', [RUN_ALL], {
  encoding: 'utf-8',
  env: buildChildEnv(input, process.env),
  timeout: 5000,
 });

const exitCode = result.status === null ? 0 : result.status;
const stderr = result.stderr || '';

if (stderr) process.stderr.write(stderr);

if (exitCode === 2) {
  process.stderr.write(
    `[preflight] BLOCKED — pre-flight failure (exit 2). To bypass for the next call only:\n` +
    `  /aura-frog:preflight bypass <reason>\n`
  );
  process.exit(2);
}

if (exitCode === 1) {
  process.stderr.write(`[preflight] WARN (exit 1) — proceeding\n`);
}

process.exit(0);
}

if (require.main === module) main();

module.exports = { buildChildEnv, jqAvailable };
