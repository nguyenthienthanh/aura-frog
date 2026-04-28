#!/usr/bin/env node
/**
 * Aura Frog — Pre-Execute: Load Plan Context
 *
 * Fires: PreToolUse (Bash | Edit | Write | Read)
 * Purpose: Load minimum hierarchical plan context (.aura/plans/) so the
 *          executing agent has current focus + ancestors.
 *
 * Behavior:
 *   - If .aura/plans/active.json doesn't exist → exit silently (no plan = no overhead)
 *   - Otherwise, read active.json and emit a brief context block to stderr
 *     (Claude sees stderr; user usually doesn't unless verbose)
 *   - Stamp loaded plan content with `trust: plan` semantically (rule reference)
 *
 * Token budget target: ≤800 tokens always-loaded (per spec §9.1).
 *
 * Exit codes:
 *   0 — success (silent or with context output)
 *   never blocks (this is a context-loader, not a guard)
 *
 * @version 1.0.0 (v3.7.0-alpha.1)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PLANS_DIR = path.join(process.cwd(), '.aura', 'plans');
const ACTIVE_FILE = path.join(PLANS_DIR, 'active.json');

function safeExit(code = 0) {
  process.exit(code);
}

// Silent exit when no plan tree
if (!fs.existsSync(ACTIVE_FILE)) {
  safeExit(0);
}

let active;
try {
  active = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf8'));
} catch (err) {
  // Malformed active.json — log to stderr but don't block
  process.stderr.write(`[plan-context] WARN: active.json malformed: ${err.message}\n`);
  safeExit(0);
}

// Compose minimal context block
const lines = [];
const a = active.active || {};

if (a.mission) lines.push(`Mission: ${a.mission}`);
if (a.initiative) lines.push(`Initiative: ${a.initiative}`);
if (a.feature) lines.push(`Feature: ${a.feature}`);
if (a.story) lines.push(`Story: ${a.story}`);
if (a.task) lines.push(`Task: ${a.task}`);

if (active.context_anchors && active.context_anchors.current_phase) {
  lines.push(`Phase: ${active.context_anchors.current_phase}`);
}

if (Array.isArray(active.frozen) && active.frozen.length > 0) {
  lines.push(`Frozen: ${active.frozen.length} node(s) — see /aura:plan:conflicts`);
}

if (Array.isArray(active.ready_queue) && active.ready_queue.length > 0) {
  lines.push(`Ready: ${active.ready_queue.length} task(s) queued`);
}

// Output as a single compact block to stderr (Claude reads stderr; user doesn't see by default)
if (lines.length > 0) {
  process.stderr.write(`[plan-context | trust:plan]\n  ${lines.join('\n  ')}\n`);
}

safeExit(0);
