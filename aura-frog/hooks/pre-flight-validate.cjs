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

const BYPASS_FLAG = path.join(process.cwd(), '.claude', 'logs', '.preflight-bypass');
const BYPASS_COUNT_FILE = path.join(process.cwd(), '.claude', 'logs', '.preflight-bypass-count');

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

if (consumeBypassFlag()) process.exit(0);

const toolName = process.env.CLAUDE_TOOL_NAME || '';
if (!toolName) process.exit(0);

const result = spawnSync('bash', [RUN_ALL], {
  encoding: 'utf-8',
  env: process.env,
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
