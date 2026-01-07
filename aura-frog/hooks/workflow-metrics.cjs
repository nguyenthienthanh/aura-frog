#!/usr/bin/env node
/**
 * Aura Frog - Workflow Metrics Hook
 *
 * Fires: After workflow completion or phase transition
 * Purpose: Send workflow metrics to Supabase learning system
 *
 * Called by: post-phase.md skill or workflow completion
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const {
  recordWorkflowMetrics,
  recordAgentPerformance,
  recordPattern,
  isMetricsEnabled
} = require('./lib/af-learning.cjs');

/**
 * Load workflow state from local file
 */
function loadWorkflowState(workflowId) {
  const stateFile = path.join(
    process.cwd(),
    '.claude/logs/workflows',
    workflowId,
    'workflow-state.json'
  );

  try {
    if (fs.existsSync(stateFile)) {
      return JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
    }
  } catch { /* ignore */ }

  return null;
}

/**
 * Parse tokens log to get per-phase token usage
 */
function parseTokensLog(workflowId) {
  const tokensFile = path.join(
    process.cwd(),
    '.claude/logs/workflows',
    workflowId,
    'tokens.log'
  );

  const tokensByPhase = {};
  let totalTokens = 0;

  try {
    if (fs.existsSync(tokensFile)) {
      const content = fs.readFileSync(tokensFile, 'utf-8');
      const lines = content.split('\n').filter(Boolean);

      for (const line of lines) {
        // Parse format: [timestamp] Phase N: XXXXX tokens
        const match = line.match(/Phase\s+(\d+):\s*(\d+)\s*tokens/i);
        if (match) {
          const phase = `phase_${match[1]}`;
          const tokens = parseInt(match[2], 10);
          tokensByPhase[phase] = (tokensByPhase[phase] || 0) + tokens;
          totalTokens += tokens;
        }
      }
    }
  } catch { /* ignore */ }

  return { tokensByPhase, totalTokens };
}

/**
 * Extract patterns from workflow execution
 */
function extractPatterns(state, metrics) {
  const patterns = [];

  // Pattern: Workflow completed successfully
  if (state.success) {
    patterns.push({
      type: 'success',
      category: 'workflow',
      description: `Successful ${state.workflowType || 'full'} workflow for ${state.framework || 'unknown'} project`,
      evidence: [{
        workflowId: state.workflowId,
        duration: metrics.durationSeconds,
        coverage: state.codeCoverage,
        testPassRate: state.testPassRate
      }]
    });
  }

  // Pattern: Auto-stop triggered
  if (state.autoStopPhase) {
    patterns.push({
      type: 'failure',
      category: 'workflow',
      description: `Auto-stop at ${state.autoStopPhase}: ${state.autoStopReason}`,
      evidence: [{
        workflowId: state.workflowId,
        phase: state.autoStopPhase,
        reason: state.autoStopReason
      }]
    });
  }

  // Pattern: High token usage phase
  const tokenThreshold = 50000;
  for (const [phase, tokens] of Object.entries(metrics.tokensByPhase || {})) {
    if (tokens > tokenThreshold) {
      patterns.push({
        type: 'optimization',
        category: 'phase',
        description: `High token usage in ${phase}: ${tokens} tokens`,
        evidence: [{
          workflowId: state.workflowId,
          phase,
          tokens,
          projectType: state.projectType
        }]
      });
    }
  }

  // Pattern: Low code coverage
  if (state.codeCoverage && state.codeCoverage < 70) {
    patterns.push({
      type: 'anti_pattern',
      category: 'quality',
      description: `Low code coverage: ${state.codeCoverage}%`,
      evidence: [{
        workflowId: state.workflowId,
        coverage: state.codeCoverage
      }]
    });
  }

  return patterns;
}

/**
 * Main hook execution
 */
async function main() {
  if (!isMetricsEnabled()) {
    process.exit(0);
  }

  try {
    // Read stdin for workflow data
    let data = {};
    try {
      const stdin = fs.readFileSync(0, 'utf-8').trim();
      if (stdin) data = JSON.parse(stdin);
    } catch { /* ignore */ }

    const workflowId = data.workflow_id || process.env.AF_WORKFLOW_ID;
    if (!workflowId) {
      process.exit(0);
    }

    // Load workflow state
    const state = loadWorkflowState(workflowId);
    if (!state) {
      console.error('🐸 Learning: No workflow state found');
      process.exit(0);
    }

    // Parse token usage
    const { tokensByPhase, totalTokens } = parseTokensLog(workflowId);

    // Calculate duration
    const startedAt = state.startedAt || data.started_at;
    const completedAt = data.completed_at || new Date().toISOString();
    const durationSeconds = startedAt
      ? Math.floor((new Date(completedAt) - new Date(startedAt)) / 1000)
      : null;

    // Build metrics object
    const metrics = {
      workflowId,
      projectName: state.projectName || process.env.PROJECT_NAME,
      projectType: state.projectType || process.env.AF_PROJECT_TYPE,
      framework: state.framework || process.env.AF_FRAMEWORK,
      workflowType: state.workflowType || data.workflow_type || 'full',
      totalPhases: state.totalPhases || 9,
      completedPhases: state.completedPhases || data.completed_phases || 0,
      success: state.success ?? data.success,
      failureReason: state.failureReason || data.failure_reason,
      autoStopPhase: state.autoStopPhase || data.auto_stop_phase,
      autoStopReason: state.autoStopReason || data.auto_stop_reason,
      totalTokens,
      tokensByPhase,
      durationSeconds,
      durationByPhase: state.durationByPhase || {},
      testPassRate: state.testPassRate || data.test_pass_rate,
      codeCoverage: state.codeCoverage || data.code_coverage,
      retries: state.retries || data.retries || 0,
      startedAt,
      completedAt,
      metadata: {
        agents: state.agents || [],
        deliverables: state.deliverables || []
      }
    };

    // Record workflow metrics
    await recordWorkflowMetrics(metrics);
    console.log('🐸 Learning: Recorded workflow metrics');

    // Extract and record patterns
    const patterns = extractPatterns(state, metrics);
    for (const pattern of patterns) {
      await recordPattern(pattern);
    }

    if (patterns.length > 0) {
      console.log(`🐸 Learning: Recorded ${patterns.length} patterns`);
    }

    // Record agent performance if available
    if (state.agents && Array.isArray(state.agents)) {
      for (const agent of state.agents) {
        await recordAgentPerformance({
          workflowId,
          agentName: agent.name,
          taskType: agent.taskType,
          confidenceScore: agent.confidence,
          detectionMethod: agent.detectionMethod,
          success: agent.success ?? state.success,
          tokensUsed: agent.tokensUsed
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(`🐸 Workflow metrics error: ${error.message}`);
    process.exit(0); // Non-blocking
  }
}

// Export for testing
module.exports = { loadWorkflowState, parseTokensLog, extractPatterns };

// Run if called directly
if (require.main === module) {
  main();
}
