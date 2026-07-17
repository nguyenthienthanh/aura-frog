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

// These must match where compact-handoff.cjs actually writes them
// (.claude/cache/…) — the old paths omitted /cache/, so verification never
// found the files and corrupted handoffs passed silently.
const STATE_PATHS = [
  '.claude/cache/workflow-state.json',
  '.claude/cache/compact-handoff.json'
];

// Pure: which required fields is a parsed state file missing? The check depends
// on WHICH state file it is (matched by the `rel` path), so both are passed in.
function validateStateFile(rel, data) {
  const warnings = [];
  if (rel.includes('workflow-state')) {
    if (!data.phase) warnings.push(`${rel}: missing phase`);
    if (!data.agent) warnings.push(`${rel}: missing agent`);
  }
  if (rel.includes('compact-handoff')) {
    if (!data.summary && !data.decisions) {
      warnings.push(`${rel}: missing summary and decisions — handoff may be empty`);
    }
  }
  return warnings;
}

// Collect warnings across every configured state path. I/O wrapper.
function collectWarnings(statePaths) {
  const warnings = [];
  for (const rel of statePaths) {
    const abs = path.resolve(process.cwd(), rel);
    if (!fs.existsSync(abs)) continue;
    try {
      warnings.push(...validateStateFile(rel, JSON.parse(fs.readFileSync(abs, 'utf8'))));
    } catch (e) {
      warnings.push(`${rel}: corrupted JSON — ${e.message}`);
    }
  }
  return warnings;
}

function main() {
  let input = '';
  process.stdin.on('data', (d) => { input += d; });
  process.stdin.on('end', () => {
    const warnings = collectWarnings(STATE_PATHS);
    if (warnings.length > 0) {
      process.stderr.write(
        `⚠️ Post-compact state check:\n${warnings.map((w) => `  - ${w}`).join('\n')}\n` +
        'Action: Re-read workflow state files and verify before continuing.',
      );
      process.exit(2);
    }
    process.exit(0);
  });
}

// Run as a hook; stay importable for tests. FEAT-007 / issue #5.
if (require.main === module) {
  main();
} else {
  module.exports = { STATE_PATHS, validateStateFile, collectWarnings };
}
