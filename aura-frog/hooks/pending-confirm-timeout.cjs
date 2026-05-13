#!/usr/bin/env node
/**
 * Aura Frog — Pending-Confirm Timeout Warning
 *
 * Fires: SessionStart (and as a periodic check via session-start cascade)
 * Purpose: Warn the user about T4 tasks that have been in pending-confirm
 *          status for more than the configured timeout (default 24h).
 *          Stale pending tasks block dispatch of new sibling tasks via
 *          conflict detection — easy to forget about.
 *
 * Configuration env:
 *   AF_PENDING_TIMEOUT_HOURS=24  — threshold (default 24h)
 *
 * Behavior:
 *   - Silent if no .claude/plans/
 *   - Walk all T4 task files, check status + ages
 *   - For tasks in status: planned (interpreted as pending-confirm in this
 *     codebase) older than threshold, emit a warning
 *   - For tasks in status: frozen older than threshold, also warn
 *   - Cap at 5 surfaced items (the rest get a "+N more" tail)
 *
 * Exit codes:
 *   0 — always
 *
 * @version 1.0.0 (v3.7.0-beta.2)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const resolvePlansDir = require('./lib/plans-dir.cjs');

const PLANS_DIR = resolvePlansDir();
const FEATURES_DIR = path.join(PLANS_DIR, 'features');
const TIMEOUT_HOURS = parseInt(process.env.AF_PENDING_TIMEOUT_HOURS || '24', 10);
const TIMEOUT_MS = TIMEOUT_HOURS * 3600 * 1000;
const MAX_SHOWN = 5;

function safeExit(code = 0) { process.exit(code); }

if (!fs.existsSync(FEATURES_DIR)) safeExit(0);

const now = Date.now();
const stale = []; // { id, status, age_hours, file }

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && e.name.endsWith('.md')) checkFile(p);
  }
}

function parseFrontmatterField(content, field) {
  const re = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const m = content.match(re);
  return m ? m[1].trim() : null;
}

function checkFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch { return; }
  if (!content.startsWith('---')) return;

  const status = parseFrontmatterField(content, 'status');
  const tier = parseFrontmatterField(content, 'tier');
  const updatedAt = parseFrontmatterField(content, 'updated_at');
  const id = parseFrontmatterField(content, 'id');

  if (!id) return;
  if (tier !== '4') return; // only check T4 tasks
  if (status !== 'planned' && status !== 'frozen' && status !== 'blocked') return;

  if (!updatedAt) return;
  const ts = Date.parse(updatedAt);
  if (!Number.isFinite(ts)) return;

  const ageMs = now - ts;
  if (ageMs < TIMEOUT_MS) return;

  stale.push({
    id,
    status,
    age_hours: Math.round(ageMs / 3600000),
    file: path.relative(process.cwd(), filePath),
  });
}

walk(FEATURES_DIR);

if (stale.length === 0) safeExit(0);

stale.sort((a, b) => b.age_hours - a.age_hours);

const shown = stale.slice(0, MAX_SHOWN);
const lines = shown.map(s =>
  `  ${s.id} [${s.status}] ${s.age_hours}h old (${s.file})`
);
if (stale.length > MAX_SHOWN) {
  lines.push(`  ... +${stale.length - MAX_SHOWN} more stale T4 task(s)`);
}

process.stderr.write(
  `[pending-confirm-timeout] ${stale.length} T4 task(s) idle > ${TIMEOUT_HOURS}h:\n` +
  lines.join('\n') + '\n' +
  `  Resolve via /aura-frog:plan-status, /aura-frog:plan-thaw, or /aura-frog:plan-replan.\n`
);

safeExit(0);
