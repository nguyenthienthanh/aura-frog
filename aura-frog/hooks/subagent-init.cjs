#!/usr/bin/env node
/**
 * SubagentStart Hook - Auto inject context for subagents
 *
 * Injects: workflow phase, approval status, project context (type, PM, framework)
 * Output via stderr for Claude to receive
 *
 * Uses session state populated by session-start.cjs hook
 *
 * @version 1.2.0
 */

const fs = require('fs');
const path = require('path');

const {
  readSessionState,
  writeSessionState
} = require('./lib/af-config-utils.cjs');

// Default state (used when no session exists)
const DEFAULT_STATE = {
  startedAt: new Date().toISOString(),
  phase: null,
  approvalStatus: {},
  activePlan: null,
  suggestedPlan: null,
  agents: [],
  tokenEstimate: 0,
  complexity: null,
  projectType: null,
  packageManager: null,
  framework: null
};

// Load or create session state
function loadSessionState() {
  const sessionId = process.ppid?.toString();
  const state = readSessionState(sessionId);
  return state || { ...DEFAULT_STATE };
}

// Save session state
function saveSessionState(state) {
  const sessionId = process.ppid?.toString();
  return writeSessionState(sessionId, state);
}

// Detect current workflow phase from environment or files
function detectPhase() {
  // Check env var first
  if (process.env.AF_CURRENT_PHASE) {
    return process.env.AF_CURRENT_PHASE;
  }

  // Check for phase markers in CWD
  const phaseFiles = [
    { file: '.claude/workflows/current-phase.txt', read: true },
    { file: 'docs/phases/PHASE_1_REQUIREMENTS_ANALYSIS.MD', phase: '1' },
    { file: 'docs/phases/PHASE_2_TECHNICAL_PLANNING.MD', phase: '2' },
  ];

  for (const pf of phaseFiles) {
    if (fs.existsSync(pf.file)) {
      if (pf.read) {
        try {
          return fs.readFileSync(pf.file, 'utf8').trim();
        } catch (e) { /* ignore */ }
      }
      return pf.phase;
    }
  }

  return null;
}

// Get project name from package.json or similar
function getProjectName() {
  const files = ['package.json', 'composer.json', 'Cargo.toml', 'go.mod', 'pubspec.yaml'];

  for (const file of files) {
    if (fs.existsSync(file)) {
      try {
        if (file === 'package.json' || file === 'composer.json') {
          const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
          return pkg.name;
        }
        if (file === 'go.mod') {
          const content = fs.readFileSync(file, 'utf8');
          const match = content.match(/^module\s+(.+)$/m);
          return match ? match[1].split('/').pop() : null;
        }
        if (file === 'pubspec.yaml') {
          const content = fs.readFileSync(file, 'utf8');
          const match = content.match(/^name:\s*(.+)$/m);
          return match ? match[1].trim() : null;
        }
      } catch (e) { /* ignore */ }
    }
  }

  // Fallback to directory name
  return path.basename(process.cwd());
}

// Track agent usage for learning system
function trackAgentUsage(state, agentType) {
  if (!state.agentUsage) {
    state.agentUsage = [];
  }

  // Parse agent type from stdin if available
  let agentName = agentType || 'unknown';
  let taskType = null;

  try {
    const stdin = require('fs').readFileSync(0, 'utf-8').trim();
    if (stdin) {
      const data = JSON.parse(stdin);
      agentName = data.subagent_type || data.agent_type || agentName;
      taskType = data.task_type || data.description;
    }
  } catch (e) { /* ignore */ }

  state.agentUsage.push({
    name: agentName,
    taskType,
    timestamp: Date.now(),
    metricsSent: false
  });

  // Keep only last 50 entries
  if (state.agentUsage.length > 50) {
    state.agentUsage = state.agentUsage.slice(-50);
  }
}

// Main execution
function main() {
  const state = loadSessionState();
  const phase = detectPhase();
  const projectName = getProjectName();

  // Track agent usage for learning
  trackAgentUsage(state);

  // Update state
  if (phase) state.phase = phase;

  // Build context injection
  const context = [];

  // Phase info
  if (state.phase) {
    context.push(`📍 Phase: ${state.phase}`);
  }

  // Active plan (takes precedence)
  if (state.activePlan) {
    context.push(`📋 Plan: ${path.basename(state.activePlan)}`);
  } else if (state.suggestedPlan) {
    context.push(`💡 Suggested: ${path.basename(state.suggestedPlan)}`);
  }

  // Approval status
  const pendingApprovals = Object.entries(state.approvalStatus || {})
    .filter(([_, v]) => v === 'pending')
    .map(([k]) => k);

  if (pendingApprovals.length > 0) {
    context.push(`⏳ Pending: ${pendingApprovals.join(', ')}`);
  }

  // Project context - now includes framework and PM
  const projectInfo = [];
  if (projectName) projectInfo.push(projectName);
  if (state.framework) projectInfo.push(state.framework);
  if (state.packageManager) projectInfo.push(state.packageManager);

  if (projectInfo.length > 0) {
    context.push(`📦 Project: ${projectInfo.join(' | ')}`);
  }

  // Active agents
  if (state.agents && state.agents.length > 0) {
    context.push(`🤖 Agents: ${state.agents.join(', ')}`);
  }

  // Output context if any
  if (context.length > 0) {
    console.error('\n--- Aura Frog Context ---');
    context.forEach(c => console.error(c));
    console.error('-------------------------\n');
  }

  // Save updated state
  saveSessionState(state);
}

main();
