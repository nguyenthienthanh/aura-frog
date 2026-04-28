#!/usr/bin/env node
/**
 * Aura Frog — SessionStart: Restore Active Plan
 *
 * Fires: SessionStart (startup, resume, clear, compact)
 * Purpose: On every new session, re-announce the active plan focus so the
 *          model picks up where it left off — survives /compact and session
 *          reset gracefully.
 *
 * Behavior:
 *   - If .aura/plans/ doesn't exist → silent
 *   - Otherwise, read active.json and emit a single banner line to stderr
 *   - Append a session_start event to history.jsonl (audit trail)
 *
 * Exit codes:
 *   0 — always (never blocks session start)
 *
 * @version 1.0.0 (v3.7.0-alpha.1)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');
const HISTORY_FILE = path.join(PLANS_DIR, 'history.jsonl');

if (!fs.existsSync(ACTIVE_FILE)) {
  process.exit(0);
}

let active;
try {
  active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8'));
} catch (err) {
  process.stderr.write(`[plan-restore] WARN: active.json malformed: ${err.message}\n`);
  process.exit(0);
}

const a = active.active || {};

// Compose the banner
const banner = [];
if (a.feature) {
  banner.push(`🐸 Active plan: ${a.feature}`);
  if (a.story) banner.push(`Story: ${a.story}`);
  if (a.task) banner.push(`Task: ${a.task}`);
} else if (a.initiative) {
  banner.push(`🐸 Active plan: ${a.initiative}`);
} else if (a.mission) {
  banner.push(`🐸 Active mission: ${a.mission}`);
}

if (banner.length > 0) {
  process.stderr.write(`${banner.join(' · ')}\n`);
  process.stderr.write(`Run /aura:plan:status for tree, /aura:plan:next for next ready task.\n`);
}

// Append session_start event to history.jsonl (audit trail)
try {
  const event = {
    ts: new Date().toISOString(),
    event: 'session_start',
    active: a,
  };
  fs.appendFileSync(HISTORY_FILE, JSON.stringify(event) + '\n');
} catch (_err) {
  // Don't block session start on log write failure
}

process.exit(0);
