#!/usr/bin/env node
/**
 * token-tracker.cjs - Track and display estimated token usage
 *
 * PostToolUse hook (all tools). Runs async.
 * Estimates cumulative token usage and warns at thresholds.
 *
 * Estimation: Tracks tool calls and file sizes to approximate token consumption.
 * Displays warnings at 50%, 70%, 85% of estimated 200K limit.
 *
 * Exit codes:
 * - 0: Always (informational only)
 */

const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(process.cwd(), '.claude', 'cache', 'token-tracker.json');
const CONTEXT_LIMIT = 200000;

// Token estimation per operation type
const TOKEN_COSTS = {
  Read: 800,       // Average file read
  Write: 500,      // Average file write
  Edit: 300,       // Average edit
  Bash: 400,       // Average command output
  Glob: 100,       // File listing
  Grep: 200,       // Search results
  Task: 2000,      // Subagent overhead
  default: 200,    // Other tools
};

const THRESHOLDS = [
  { pct: 85, icon: '🔴', label: 'CRITICAL', msg: 'Strongly recommend /compact or session handoff' },
  { pct: 70, icon: '🟠', label: 'HIGH', msg: 'Consider /compact with focus instructions' },
  { pct: 50, icon: '🟡', label: 'MODERATE', msg: 'Context filling up, stay focused' },
];

function loadTracker() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch { /* ignore */ }
  return {
    sessionId: process.ppid?.toString(),
    totalEstimate: 5000, // Base system prompt estimate
    toolCalls: 0,
    lastWarningPct: 0,
    startedAt: Date.now(),
  };
}

function saveTracker(tracker) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(tracker, null, 2));
  } catch { /* ignore */ }
}

function estimateFileTokens(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      // ~4 chars per token for code
      return Math.min(Math.ceil(stat.size / 4), 10000);
    }
  } catch { /* ignore */ }
  return 0;
}

try {
  const input = fs.readFileSync(0, 'utf-8').trim();
  if (!input) process.exit(0);

  const data = JSON.parse(input);
  const toolName = data.tool_name || 'default';
  const toolInput = data.tool_input || {};

  const tracker = loadTracker();

  // Reset if new session
  const currentSession = process.ppid?.toString();
  if (tracker.sessionId !== currentSession) {
    tracker.sessionId = currentSession;
    tracker.totalEstimate = 5000;
    tracker.toolCalls = 0;
    tracker.lastWarningPct = 0;
    tracker.startedAt = Date.now();
  }

  // Estimate tokens for this operation
  let tokensUsed = TOKEN_COSTS[toolName] || TOKEN_COSTS.default;

  // Add file-specific estimate for Read operations
  if (toolName === 'Read') {
    tokensUsed += estimateFileTokens(toolInput.file_path);
  }

  // Add response estimate (tool output)
  tokensUsed += 200; // Average Claude response per tool call

  tracker.totalEstimate += tokensUsed;
  tracker.toolCalls++;

  // Check thresholds
  const currentPct = Math.round((tracker.totalEstimate / CONTEXT_LIMIT) * 100);

  for (const threshold of THRESHOLDS) {
    if (currentPct >= threshold.pct && tracker.lastWarningPct < threshold.pct) {
      console.error(`${threshold.icon} Token usage: ~${Math.round(tracker.totalEstimate / 1000)}K / 200K (${currentPct}%) [${threshold.label}]`);
      console.error(`   ${threshold.msg}`);
      tracker.lastWarningPct = threshold.pct;
      break;
    }
  }

  saveTracker(tracker);
  process.exit(0);

} catch (error) {
  process.exit(0); // Fail open
}
