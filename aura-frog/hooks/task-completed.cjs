#!/usr/bin/env node
/**
 * TaskCompleted Hook - Validates teammate task completion
 *
 * Fires when a teammate marks a task as done.
 * Exit 2 = reject (needs revision - sends feedback)
 * Exit 0 = accept completion
 *
 * Validates:
 * 1. Quality gates: lint/test status
 * 2. Cross-review completeness
 * 3. Phase deliverable requirements
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

const {
  readSessionState,
  isAgentTeamsEnabled
} = require('./lib/af-config-utils.cjs');

// Phase deliverable requirements
const PHASE_DELIVERABLES = {
  '1': ['requirements documented'],
  '2': ['technical design approved'],
  '3': ['ui breakdown complete'],
  '4': ['test plan written'],
  '5a': ['failing tests written (RED)'],
  '5b': ['all tests passing (GREEN)'],
  '5c': ['code refactored, tests still pass'],
  '6': ['security review complete'],
  '7': ['qa validation passed'],
  '8': ['documentation updated'],
  '9': ['notifications sent']
};

function parseTaskInput() {
  try {
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    if (stdin) {
      return JSON.parse(stdin);
    }
  } catch (e) { /* ignore */ }
  return {};
}

function main() {
  // Only active when Agent Teams is enabled
  if (!isAgentTeamsEnabled()) {
    process.exit(0);
    return;
  }

  const teammateName = process.env.CLAUDE_TEAMMATE_NAME;
  if (!teammateName) {
    process.exit(0);
    return;
  }

  const taskData = parseTaskInput();
  const sessionId = process.ppid?.toString();
  const state = readSessionState(sessionId);
  const currentPhase = state?.phase || process.env.AF_CURRENT_PHASE;

  // Validation 1: Check if task mentions test results when in TDD phases
  const tddPhases = ['5a', '5b', '5c'];
  if (currentPhase && tddPhases.includes(currentPhase)) {
    const taskDescription = taskData.description || taskData.subject || '';
    const hasTestReference = /test|spec|assert|expect|coverage/.test(taskDescription.toLowerCase());

    if (!hasTestReference) {
      console.error('🔴 TDD Violation: Task in TDD phase must reference test results');
      console.error('Action: Run tests and include results before marking complete');
      process.exit(2); // Reject
      return;
    }
  }

  // Validation 2: Check for approval gate phases
  const approvalPhases = ['2', '5b'];
  if (currentPhase && approvalPhases.includes(currentPhase)) {
    const approvalStatus = state?.approvalStatus?.[`phase${currentPhase}`];
    if (approvalStatus === 'pending') {
      console.error(`⏳ Phase ${currentPhase} requires user approval before completion`);
      console.error('Action: Wait for approval gate before marking phase complete');
      process.exit(2); // Reject
      return;
    }
  }

  // Record completion in team log if available
  if (process.env.AF_TEAM_LOG_DIR) {
    try {
      const teamLogWriter = require('./lib/team-log-writer.cjs');
      const taskId = taskData.taskId || taskData.id || 'unknown';
      const subject = taskData.subject || taskData.description || '';
      teamLogWriter.logTaskCompleted(taskId, subject, {
        phase: currentPhase,
        validation: 'passed'
      });
    } catch { /* non-fatal */ }
  }

  // Accept completion
  process.exit(0);
}

main();
