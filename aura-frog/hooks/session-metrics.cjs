#!/usr/bin/env node
/**
 * Aura Frog - Session Metrics Hook
 *
 * Fires: On session Stop
 * Purpose: Collect and send session metrics to Supabase learning system
 *
 * Automatically tracks:
 * - Workflow completions
 * - Agent usage patterns
 * - Session duration
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const {
  isMetricsEnabled,
  recordWorkflowMetrics,
  recordAgentPerformance
} = require('./lib/af-learning.cjs');

/**
 * Find active workflow state file
 */
function findActiveWorkflow() {
  const workflowsDir = path.join(process.cwd(), '.claude/logs/workflows');

  if (!fs.existsSync(workflowsDir)) {
    return null;
  }

  // Check for active-workflow.txt pointer
  const activeFile = path.join(workflowsDir, 'active-workflow.txt');
  if (fs.existsSync(activeFile)) {
    const workflowId = fs.readFileSync(activeFile, 'utf-8').trim();
    const stateFile = path.join(workflowsDir, workflowId, 'workflow-state.json');
    if (fs.existsSync(stateFile)) {
      return { workflowId, stateFile };
    }
  }

  // Fallback: find most recent workflow
  const dirs = fs.readdirSync(workflowsDir)
    .filter(d => fs.statSync(path.join(workflowsDir, d)).isDirectory())
    .map(d => ({
      name: d,
      mtime: fs.statSync(path.join(workflowsDir, d)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (dirs.length > 0) {
    const stateFile = path.join(workflowsDir, dirs[0].name, 'workflow-state.json');
    if (fs.existsSync(stateFile)) {
      return { workflowId: dirs[0].name, stateFile };
    }
  }

  return null;
}

/**
 * Load and send workflow metrics
 */
async function sendWorkflowMetrics(workflowId, stateFile) {
  try {
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));

    // Skip if already sent
    if (state.metricsSent) {
      return false;
    }

    // Calculate token usage from logs
    const tokensFile = path.join(path.dirname(stateFile), 'tokens.log');
    let totalTokens = 0;
    const tokensByPhase = {};

    if (fs.existsSync(tokensFile)) {
      const content = fs.readFileSync(tokensFile, 'utf-8');
      const lines = content.split('\n').filter(Boolean);

      for (const line of lines) {
        const match = line.match(/Phase\s+(\d+):\s*(\d+)\s*tokens/i);
        if (match) {
          const phase = `phase_${match[1]}`;
          const tokens = parseInt(match[2], 10);
          tokensByPhase[phase] = (tokensByPhase[phase] || 0) + tokens;
          totalTokens += tokens;
        }
      }
    }

    // Build metrics
    const metrics = {
      workflowId,
      projectName: state.projectName || process.env.PROJECT_NAME,
      projectType: state.projectType || process.env.AF_PROJECT_TYPE,
      framework: state.framework || process.env.AF_FRAMEWORK,
      workflowType: state.workflowType || 'full',
      totalPhases: state.totalPhases || 9,
      completedPhases: state.currentPhase || 0,
      success: state.status === 'completed',
      failureReason: state.error,
      autoStopPhase: state.autoStopPhase,
      autoStopReason: state.autoStopReason,
      totalTokens,
      tokensByPhase,
      startedAt: state.startedAt,
      completedAt: state.completedAt || new Date().toISOString()
    };

    await recordWorkflowMetrics(metrics);

    // Mark as sent
    state.metricsSent = true;
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));

    return true;
  } catch (error) {
    console.error(`Learning: Failed to send workflow metrics: ${error.message}`);
    return false;
  }
}

/**
 * Track agent usage from session state
 */
async function sendAgentMetrics() {
  // Try to read from Aura Frog session state
  const { readSessionState, writeSessionState } = require('./lib/af-config-utils.cjs');
  const sessionId = process.ppid?.toString();

  const state = readSessionState(sessionId);
  if (!state || !state.agentUsage) {
    return 0;
  }

  try {
    const agents = state.agentUsage || [];
    let sent = 0;

    for (const agent of agents) {
      if (!agent.metricsSent) {
        await recordAgentPerformance({
          sessionId,
          agentName: agent.name,
          taskType: agent.taskType,
          confidenceScore: agent.confidence,
          detectionMethod: agent.method,
          success: agent.success !== false,
          tokensUsed: agent.tokens
        });
        agent.metricsSent = true;
        sent++;
      }
    }

    // Save updated state
    writeSessionState(sessionId, state);
    return sent;
  } catch (error) {
    console.error(`Learning: Failed to send agent metrics: ${error.message}`);
    return 0;
  }
}

/**
 * Main hook execution
 */
async function main() {
  if (!isMetricsEnabled()) {
    process.exit(0);
  }

  try {
    let sent = false;

    // Send workflow metrics
    const workflow = findActiveWorkflow();
    if (workflow) {
      const workflowSent = await sendWorkflowMetrics(workflow.workflowId, workflow.stateFile);
      if (workflowSent) {
        console.log('🐸 Learning: Session metrics recorded');
        sent = true;
      }
    }

    // Send agent metrics
    const agentCount = await sendAgentMetrics();
    if (agentCount > 0) {
      console.log(`🐸 Learning: ${agentCount} agent metrics recorded`);
      sent = true;
    }

    process.exit(0);
  } catch (error) {
    console.error(`🐸 Session metrics error: ${error.message}`);
    process.exit(0);
  }
}

main();
