#!/usr/bin/env node
/**
 * Aura Frog - Feedback Capture Hook
 *
 * Fires: PostToolUse (after Edit, Write operations)
 * Purpose: Detect when user corrects AI output and record as feedback
 *
 * Detection Patterns:
 * 1. User edits a file that AI just wrote/edited (correction)
 * 2. User switches agent after AI suggested one (agent_switch)
 * 3. Explicit feedback commands (/learn:feedback)
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { recordFeedback, recordAgentPerformance, isFeedbackEnabled } = require('./lib/af-learning.cjs');

// Track recent AI operations for correction detection
const STATE_FILE = path.join(process.env.HOME || '/tmp', '.aura-frog-recent-ops.json');

/**
 * Load recent operations state
 */
function loadRecentOps() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      // Only return ops from last 10 minutes
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      return data.filter(op => op.timestamp > tenMinutesAgo);
    }
  } catch { /* ignore */ }
  return [];
}

/**
 * Save recent operations state
 */
function saveRecentOps(ops) {
  try {
    // Keep only last 50 operations
    const trimmed = ops.slice(-50);
    fs.writeFileSync(STATE_FILE, JSON.stringify(trimmed));
  } catch { /* ignore */ }
}

/**
 * Record an AI operation (called when AI writes/edits)
 */
function recordAiOperation(operation) {
  const ops = loadRecentOps();
  ops.push({
    ...operation,
    timestamp: Date.now(),
    source: 'ai'
  });
  saveRecentOps(ops);
}

/**
 * Check if this is a user correction of AI output
 */
function detectCorrection(userOp, recentOps) {
  // Look for AI operation on same file within last 5 minutes
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

  for (const aiOp of recentOps) {
    if (aiOp.source === 'ai' &&
        aiOp.timestamp > fiveMinutesAgo &&
        aiOp.filePath === userOp.filePath &&
        aiOp.tool !== userOp.tool) {
      return {
        isCorrection: true,
        aiOperation: aiOp
      };
    }
  }

  return { isCorrection: false };
}

/**
 * Main hook execution
 */
async function main() {
  if (!isFeedbackEnabled()) {
    process.exit(0);
  }

  try {
    // Read stdin for tool use data
    let data = {};
    try {
      const stdin = fs.readFileSync(0, 'utf-8').trim();
      if (stdin) data = JSON.parse(stdin);
    } catch { /* ignore */ }

    const { tool, input, output, session_id: sessionId } = data;

    // Skip if not a file operation
    if (!['Edit', 'Write'].includes(tool)) {
      process.exit(0);
    }

    const filePath = input?.file_path || input?.path;
    if (!filePath) {
      process.exit(0);
    }

    const recentOps = loadRecentOps();

    // Check if this is AI operation or user correction
    const isAiOperation = data.source === 'assistant' || data.is_assistant;

    if (isAiOperation) {
      // Record AI operation for future correction detection
      recordAiOperation({
        tool,
        filePath,
        content: input?.content || input?.new_string,
        workflowId: process.env.AF_WORKFLOW_ID
      });
    } else {
      // This might be a user correction
      const correction = detectCorrection({ tool, filePath }, recentOps);

      if (correction.isCorrection) {
        // Record as feedback
        await recordFeedback({
          type: 'correction',
          sessionId,
          workflowId: process.env.AF_WORKFLOW_ID,
          original: correction.aiOperation.content?.substring(0, 1000),
          corrected: (input?.content || input?.new_string)?.substring(0, 1000),
          metadata: {
            file: filePath,
            aiTool: correction.aiOperation.tool,
            userTool: tool,
            timeSinceAiOp: Date.now() - correction.aiOperation.timestamp
          }
        });

        console.log('🐸 Learning: Recorded correction feedback');
      }
    }

    process.exit(0);
  } catch (error) {
    // Non-blocking - don't fail the tool use
    console.error(`🐸 Feedback hook error: ${error.message}`);
    process.exit(0);
  }
}

// Export for testing
module.exports = { recordAiOperation, detectCorrection };

// Run if called directly
if (require.main === module) {
  main();
}
