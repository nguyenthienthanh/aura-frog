#!/usr/bin/env node
/**
 * Aura Frog - Post Compact Hook
 *
 * Fires: PostCompact (after context compaction completes)
 * Purpose: Verify workflow state survived compaction
 *
 * Checks:
 * 1. Workflow state file exists and is valid JSON
 * 2. Phase information preserved
 * 3. Agent assignment preserved
 * 4. Emits warning to Claude if state appears corrupted
 *
 * Exit codes:
 *   0 - State OK or no active workflow
 *   2 - State corrupted — stderr shown to Claude
 */

const fs = require('fs');
const path = require('path');

const STATE_PATHS = [
  '.claude/workflow-state.json',
  '.claude/compact-handoff.json'
];

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  const warnings = [];

  for (const rel of STATE_PATHS) {
    const abs = path.resolve(process.cwd(), rel);
    if (!fs.existsSync(abs)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(abs, 'utf8'));

      // Check required fields
      if (rel.includes('workflow-state')) {
        if (!data.phase) warnings.push(`${rel}: missing phase`);
        if (!data.agent) warnings.push(`${rel}: missing agent`);
      }
      if (rel.includes('compact-handoff')) {
        if (!data.summary && !data.decisions) {
          warnings.push(`${rel}: missing summary and decisions — handoff may be empty`);
        }
      }
    } catch (e) {
      warnings.push(`${rel}: corrupted JSON — ${e.message}`);
    }
  }

  if (warnings.length > 0) {
    process.stderr.write(
      `⚠️ Post-compact state check:\n${warnings.map(w => `  - ${w}`).join('\n')}\n` +
      `Action: Re-read workflow state files and verify before continuing.`
    );
    process.exit(2);
  }

  process.exit(0);
});
