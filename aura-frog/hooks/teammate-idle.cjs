#!/usr/bin/env node
/**
 * TeammateIdle Hook - Handles idle teammate lifecycle
 *
 * Fires when a teammate has no remaining tasks.
 * Exit 2 = send feedback (keep alive with new work)
 * Exit 0 = let teammate exit gracefully
 *
 * Checks for:
 * 1. Unclaimed tasks matching teammate's specialization
 * 2. Cross-review work from completed phases
 * 3. Pending quality gates that need validation
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

const {
  readSessionState,
  isAgentTeamsEnabled
} = require('./lib/af-config-utils.cjs');

// Agent specialization to task keyword mapping
const AGENT_TASK_PATTERNS = {
  'architect': ['api', 'backend', 'database', 'schema', 'migration', 'query', 'architecture', 'design'],
  'ui-expert': ['frontend', 'component', 'css', 'styling', 'layout', 'responsive', 'design-system', 'ui'],
  'qa-automation': ['test', 'coverage', 'e2e', 'unit', 'integration', 'assertion', 'fixture', 'mock'],
  'security-expert': ['security', 'auth', 'vulnerability', 'owasp', 'xss', 'injection', 'audit'],
  'mobile-expert': ['mobile', 'react-native', 'flutter', 'ios', 'android', 'app'],
  'game-developer': ['godot', 'game', 'scene', 'sprite', 'physics', 'gdscript'],
  'devops-cicd': ['deploy', 'ci', 'cd', 'docker', 'pipeline', 'infrastructure'],
  'pm-operations-orchestrator': ['requirement', 'plan', 'coordinate', 'document', 'review']
};

// Cross-review assignments by phase
const CROSS_REVIEW_PHASES = {
  '2': ['qa-automation'],      // QA reviews design
  '5b': ['qa-automation'],     // QA reviews implementation
  '5c': ['security-expert'],   // Security reviews refactored code
  '6': ['architect', 'qa-automation']  // Review phase
};

function getTeammateName() {
  return process.env.CLAUDE_TEAMMATE_NAME || null;
}

function getTeammateRole() {
  // Extract role from teammate name (format: "role-name" or just name)
  const name = getTeammateName();
  if (!name) return null;

  // Match against known agent types
  for (const agent of Object.keys(AGENT_TASK_PATTERNS)) {
    if (name.includes(agent) || agent.includes(name)) {
      return agent;
    }
  }
  return name;
}

function main() {
  // Only active when Agent Teams is enabled
  if (!isAgentTeamsEnabled()) {
    process.exit(0);
    return;
  }

  const teammateName = getTeammateName();
  if (!teammateName) {
    process.exit(0);
    return;
  }

  const role = getTeammateRole();
  const sessionId = process.ppid?.toString();
  const state = readSessionState(sessionId);

  // Check 1: Cross-review work available for this role
  const currentPhase = state?.phase || process.env.AF_CURRENT_PHASE;
  if (currentPhase && CROSS_REVIEW_PHASES[currentPhase]) {
    const reviewers = CROSS_REVIEW_PHASES[currentPhase];
    if (role && reviewers.includes(role)) {
      // Record cross-review assignment in team log
      if (process.env.AF_TEAM_LOG_DIR) {
        try {
          const teamLogWriter = require('./lib/team-log-writer.cjs');
          teamLogWriter.logAction('cross_review_assigned', `${role} assigned cross-review for Phase ${currentPhase}`, {
            phase: currentPhase,
            reviewer: role
          });
        } catch { /* non-fatal */ }
      }

      console.error(`🔍 Cross-review needed: Phase ${currentPhase} output requires ${role} review`);
      console.error(`Action: Review the Phase ${currentPhase} deliverables and provide feedback`);
      process.exit(2); // Keep alive - send feedback
      return;
    }
  }

  // Check 2: Pending approvals that need this role
  const pendingApprovals = Object.entries(state?.approvalStatus || {})
    .filter(([_, v]) => v === 'pending');

  if (pendingApprovals.length > 0 && role === 'pm-operations-orchestrator') {
    console.error(`⏳ Pending approvals: ${pendingApprovals.map(([k]) => k).join(', ')}`);
    console.error('Action: Review and process pending approval gates');
    process.exit(2); // Keep alive
    return;
  }

  // No work found - let teammate exit
  process.exit(0);
}

main();
