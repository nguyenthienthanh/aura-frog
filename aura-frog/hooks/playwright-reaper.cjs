#!/usr/bin/env node
/**
 * Aura Frog — Playwright Orphan Reaper
 *
 * Fires: SessionStart
 * Purpose: Kill ORPHANED playwright processes left behind by ungraceful exits.
 *          The @playwright/mcp server launches a (headless) Chrome; when the
 *          server dies without calling browser_close (session crash / kill),
 *          that Chrome is reparented to launchd (ppid 1) and runs for days,
 *          silently loading the machine. This janitor reaps exactly those.
 *
 * Safety — a process is reaped ONLY when BOTH hold:
 *   1. its command is playwright-launched (the `playwright_chromiumdev_profile`
 *      temp user-data-dir, an ms-playwright browser, or a playwright-mcp server), AND
 *   2. it is orphaned (ppid === 1) — its launching session/server is dead, so no
 *      live session owns it.
 * A browser owned by a RUNNING session has its server as parent (ppid !== 1) and
 * is never touched. The user's normal Chrome uses the default profile (no
 * playwright_chromiumdev_profile in its argv) and is never matched.
 *
 * Disable: AF_PLAYWRIGHT_REAPER_DISABLED=true
 *
 * Exit codes:
 *   0 — always (best-effort janitor, never blocks a session start)
 *
 * @version 1.0.0
 */

'use strict';

const { execSync } = require('child_process');

// Matches ONLY playwright-launched processes: the temp profile a playwright
// Chrome runs under, the bundled ms-playwright browser path, or the MCP server.
// Deliberately does NOT match a user's ordinary Chrome (default profile).
const PLAYWRIGHT_PATTERN = /playwright_chromiumdev_profile|ms-playwright|playwright-mcp|@playwright\/mcp/i;

// Pure: parse `ps -Ao pid,ppid,command` output into {pid, ppid, command} records.
// The header line and any non-matching lines are dropped.
function parsePsLines(output) {
  const recs = [];
  for (const raw of String(output || '').split('\n')) {
    const m = raw.trim().match(/^(\d+)\s+(\d+)\s+(.*)$/);
    if (m) recs.push({ pid: Number(m[1]), ppid: Number(m[2]), command: m[3] });
  }
  return recs;
}

// Pure: the pids safe to reap — orphaned (ppid === 1) AND playwright-launched,
// excluding this process. Returns [] when nothing qualifies.
function selectOrphans(procs, { selfPid } = {}) {
  return (procs || [])
    .filter(p => p && p.ppid === 1 && p.pid !== selfPid && PLAYWRIGHT_PATTERN.test(p.command))
    .map(p => p.pid);
}

function listProcs() {
  try { return parsePsLines(execSync('ps -Ao pid,ppid,command', { encoding: 'utf8' })); }
  catch { return []; }
}

function reap(pids) {
  const killed = [];
  for (const pid of pids) {
    // SIGKILL: these are confirmed orphans (dead parent) — no graceful shutdown
    // to wait on, and it avoids blocking the session start on a stubborn Chrome.
    try { process.kill(pid, 'SIGKILL'); killed.push(pid); } catch { /* already gone */ }
  }
  return killed;
}

function main() {
  if (process.env.AF_PLAYWRIGHT_REAPER_DISABLED === 'true') return;
  const orphans = selectOrphans(listProcs(), { selfPid: process.pid });
  if (orphans.length === 0) return;
  const killed = reap(orphans);
  if (killed.length > 0) {
    process.stderr.write(
      `[playwright-reaper] reaped ${killed.length} orphaned playwright process(es): ${killed.join(', ')}\n`,
    );
  }
}

// Run as a hook; stay importable for tests. FEAT-007 / issue #5 pattern.
if (require.main === module) {
  main();
} else {
  module.exports = { parsePsLines, selectOrphans, PLAYWRIGHT_PATTERN };
}
