#!/usr/bin/env node
/**
 * Aura Frog — TDD RED Failure Tracker
 *
 * Fires: PostToolUse on Bash when the command looks like a test runner
 * Purpose: In Phase 2 (RED), tests are EXPECTED to fail. This hook distinguishes
 *          "RED as designed (✓)" from "GREEN when should fail (F2)".
 *
 * Behavior:
 *   - Silent if no active task or current_phase !== 'P2_RED'
 *   - Heuristic test detection: command matches /test|jest|vitest|pytest|cargo test|go test/i
 *   - exit_code !== 0 in RED → expected; emit decision event with grounded:true
 *   - exit_code === 0 in RED → unexpected; emit decision event flagging F2 candidate
 *
 * Exit codes:
 *   0 — success (records observations, never blocks)
 *
 * @version 1.0.0 (v3.7.0-alpha.2)
 */

'use strict';

const fs = require('fs');
const path = require('path');

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

const phase = active.context_anchors && active.context_anchors.current_phase;
if (phase !== 'P2_RED') safeExit(0);

const taskId = active.active && active.active.task;
if (!taskId) safeExit(0);

const cmd = process.env.CLAUDE_TOOL_COMMAND || '';
const TEST_RUNNER = /\b(test|jest|vitest|pytest|cargo\s+test|go\s+test|rspec|phpunit|mocha)\b/i;
if (!TEST_RUNNER.test(cmd)) safeExit(0);

const exitCode = parseInt(process.env.CLAUDE_TOOL_EXIT_CODE || '0', 10);
const ts = new Date().toISOString();

if (!fs.existsSync(TRACES_DIR)) fs.mkdirSync(TRACES_DIR, { recursive: true });
const traceFile = path.join(TRACES_DIR, `${taskId}.jsonl`);

function nextEventId() {
  let n = 0;
  if (fs.existsSync(traceFile)) {
    n = fs.readFileSync(traceFile, 'utf8').split('\n').filter(Boolean).length;
  }
  return `TR-${taskId.replace(/[^0-9]/g, '')}-${String(n + 1).padStart(3, '0')}`;
}

const expected = exitCode !== 0;
const event = {
  ts,
  event_id: nextEventId(),
  task_id: taskId,
  type: 'decision',
  payload: {
    decision: expected ? 'red_as_designed' : 'red_unexpectedly_green',
    phase: 'P2_RED',
    exit_code: exitCode,
    cmd_match: cmd.slice(0, 80),
    classifier_hint: expected ? null : 'F2_local_logic'
  }
};

try {
  fs.appendFileSync(traceFile, JSON.stringify(event) + '\n');
} catch (err) {
  process.stderr.write(`[tdd-red-tracker] WARN: trace append failed: ${err.message}\n`);
}

if (!expected) {
  process.stderr.write(
    `[tdd-red-tracker] RED test passed unexpectedly — task=${taskId}\n` +
    `  this is a F2 candidate; the test may not exercise the new behavior\n`
  );
}

safeExit(0);
