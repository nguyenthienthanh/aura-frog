#!/usr/bin/env node
/**
 * commit-attribution.cjs - Enforce Co-Authored-By in AI-assisted commits
 *
 * PreToolUse hook on Bash commands.
 * Warns if a git commit is missing AI attribution.
 *
 * Exit codes:
 * - 0: Allowed (not a commit, or attribution present)
 * - 1: Warning (commit missing attribution)
 */

const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8').trim();
  if (!input) process.exit(0);

  const data = JSON.parse(input);
  const command = (data.tool_input || {}).command || '';

  // Only check git commit commands
  if (!command.match(/git\s+commit/)) {
    process.exit(0);
  }

  // Skip amend-only commands (no new message)
  if (command.match(/--amend\s+--no-edit/)) {
    process.exit(0);
  }

  // Check for Co-Authored-By in the commit message
  if (/co-authored-by/i.test(command)) {
    process.exit(0);
  }

  // Check if using a message file (-F) that might contain attribution
  if (command.match(/\s-F\s/)) {
    process.exit(0);
  }

  console.error('💡 Missing AI attribution. Add to commit message:');
  console.error('   Co-Authored-By: Claude <noreply@anthropic.com>');
  process.exit(1); // Warning, don't block

} catch (error) {
  process.exit(0); // Fail open
}
