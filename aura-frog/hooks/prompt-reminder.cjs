#!/usr/bin/env node
/**
 * UserPromptSubmit Hook - Inject reminders each prompt
 *
 * Reminds: TDD principles, current phase, approval gates
 * Lightweight: ~50 tokens max
 *
 * @version 1.1.0
 */

const { readSessionState } = require('./lib/af-config-utils.cjs');

// Load session state
function loadSessionState() {
  const sessionId = process.ppid?.toString();
  return readSessionState(sessionId) || {};
}

// Check if TDD reminder needed
function needsTddReminder(userPrompt) {
  const codeKeywords = /\b(implement|create|add|build|fix|code|function|component|api)\b/i;
  return codeKeywords.test(userPrompt || '');
}

// Check if approval reminder needed
function needsApprovalReminder(state) {
  const approvalPhases = ['3', '6', '7', '9'];
  return state.phase && approvalPhases.includes(state.phase);
}

// Main execution
function main() {
  const state = loadSessionState();
  const userPrompt = process.env.CLAUDE_USER_PROMPT || '';
  const reminders = [];

  // TDD reminder for code tasks
  if (needsTddReminder(userPrompt)) {
    reminders.push('🧪 TDD: Write tests first');
  }

  // Approval gate reminder
  if (needsApprovalReminder(state)) {
    reminders.push(`🚦 Phase ${state.phase}: Requires approval`);
  }

  // Security reminder for sensitive operations
  if (/\b(auth|password|token|secret|api.?key|credential)\b/i.test(userPrompt)) {
    reminders.push('🔒 Security: Review before commit');
  }

  // Output reminders
  if (reminders.length > 0) {
    console.error(`\n💡 ${reminders.join(' | ')}\n`);
  }
}

main();
