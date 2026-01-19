#!/usr/bin/env node
/**
 * Aura Frog - Compact Handoff Hook
 *
 * Fires: Stop (before compact) and SessionStart (after compact)
 * Purpose: Auto-save workflow state before compacting, auto-resume after
 *
 * Usage:
 *   - On Stop: Saves current workflow state to handoff file
 *   - On SessionStart (with --resume): Detects saved state and injects resume context
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// File paths
const WORKFLOW_DIR = path.join(process.cwd(), '.claude', 'logs', 'workflows');
const HANDOFF_FILE = path.join(process.cwd(), '.claude', 'cache', 'compact-handoff.json');
const WORKFLOW_STATE_FILE = path.join(process.cwd(), '.claude', 'cache', 'workflow-state.json');
const CACHE_DIR = path.join(process.cwd(), '.claude', 'cache');

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch { /* ignore */ }
}

/**
 * Get current workflow state
 */
function getCurrentWorkflowState() {
  try {
    // Check for workflow state in various locations
    const locations = [
      WORKFLOW_STATE_FILE,
      path.join(WORKFLOW_DIR, 'current', 'workflow-state.json')
    ];

    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        const state = JSON.parse(fs.readFileSync(loc, 'utf-8'));
        if (state && state.workflow_id) {
          return state;
        }
      }
    }

    // Check environment variables for workflow info
    if (process.env.AF_WORKFLOW_ID || process.env.AF_CURRENT_PHASE) {
      return {
        workflow_id: process.env.AF_WORKFLOW_ID || `session-${Date.now()}`,
        current_phase: parseInt(process.env.AF_CURRENT_PHASE || '1', 10),
        current_sub_phase: process.env.AF_CURRENT_SUBPHASE || null,
        status: 'in_progress',
        task: {
          description: process.env.AF_TASK_DESCRIPTION || 'Workflow in progress'
        },
        agents: {
          primary: process.env.AF_CURRENT_AGENT || 'general-purpose'
        }
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get session context for handoff
 */
function getSessionContext() {
  return {
    project_name: process.env.PROJECT_NAME || process.env.AF_PROJECT_NAME,
    project_type: process.env.AF_PROJECT_TYPE,
    framework: process.env.AF_FRAMEWORK,
    git_branch: process.env.AF_GIT_BRANCH,
    active_plan: process.env.AF_ACTIVE_PLAN,
    suggested_plan: process.env.AF_SUGGESTED_PLAN,
    current_agent: process.env.AF_CURRENT_AGENT,
    complexity: process.env.AF_COMPLEXITY
  };
}

/**
 * Save handoff state before compact
 */
function saveHandoff() {
  try {
    ensureDir(CACHE_DIR);

    const workflowState = getCurrentWorkflowState();
    const sessionContext = getSessionContext();

    // Only save if there's something to save
    if (!workflowState && !sessionContext.project_name) {
      return false;
    }

    const handoff = {
      version: '1.0.0',
      saved_at: new Date().toISOString(),
      reason: 'compact',
      workflow: workflowState,
      context: sessionContext,
      resume_hint: workflowState
        ? `workflow:resume ${workflowState.workflow_id}`
        : null
    };

    fs.writeFileSync(HANDOFF_FILE, JSON.stringify(handoff, null, 2));

    // Also save to workflow-specific location if workflow exists
    if (workflowState && workflowState.workflow_id) {
      const workflowDir = path.join(WORKFLOW_DIR, workflowState.workflow_id);
      ensureDir(workflowDir);

      // Update workflow state with paused status
      const pausedState = {
        ...workflowState,
        status: 'paused',
        paused_at: new Date().toISOString(),
        paused_reason: 'compact'
      };

      fs.writeFileSync(
        path.join(workflowDir, 'workflow-state.json'),
        JSON.stringify(pausedState, null, 2)
      );
    }

    console.log('💾 Workflow state saved for compact handoff');
    return true;
  } catch (error) {
    console.error(`Handoff save error: ${error.message}`);
    return false;
  }
}

/**
 * Check for and load handoff state after compact
 */
function loadHandoff() {
  try {
    if (!fs.existsSync(HANDOFF_FILE)) {
      return null;
    }

    const handoff = JSON.parse(fs.readFileSync(HANDOFF_FILE, 'utf-8'));

    // Check if handoff is recent (within last 30 minutes)
    const savedAt = new Date(handoff.saved_at);
    const ageMs = Date.now() - savedAt.getTime();
    const maxAgeMs = 30 * 60 * 1000; // 30 minutes

    if (ageMs > maxAgeMs) {
      // Old handoff, clean up
      fs.unlinkSync(HANDOFF_FILE);
      return null;
    }

    return handoff;
  } catch {
    return null;
  }
}

/**
 * Generate resume context message
 */
function generateResumeContext(handoff) {
  let message = '\n';
  message += '═══════════════════════════════════════════════════════════\n';
  message += '🔄 SESSION RESUMED AFTER COMPACT\n';
  message += '═══════════════════════════════════════════════════════════\n\n';

  if (handoff.workflow) {
    const wf = handoff.workflow;
    message += `📋 **Workflow:** ${wf.workflow_id}\n`;
    message += `📝 **Task:** ${wf.task?.description || 'In progress'}\n`;
    message += `📍 **Phase:** ${wf.current_phase}${wf.current_sub_phase || ''}\n`;
    message += `🤖 **Agent:** ${wf.agents?.primary || 'general-purpose'}\n\n`;
  }

  if (handoff.context) {
    const ctx = handoff.context;
    if (ctx.project_name) message += `📦 **Project:** ${ctx.project_name}\n`;
    if (ctx.framework) message += `🛠️ **Framework:** ${ctx.framework}\n`;
    if (ctx.git_branch) message += `🌿 **Branch:** ${ctx.git_branch}\n`;
    if (ctx.active_plan) message += `📋 **Active Plan:** ${ctx.active_plan}\n`;
    message += '\n';
  }

  if (handoff.resume_hint) {
    message += '───────────────────────────────────────────────────────────\n';
    message += `📥 **To fully resume workflow:**\n`;
    message += `   ${handoff.resume_hint}\n\n`;
  }

  message += '💡 Context has been restored. Type "continue" to proceed.\n';
  message += '═══════════════════════════════════════════════════════════\n';

  return message;
}

/**
 * Inject resume context into session
 */
function injectResumeContext(handoff) {
  try {
    // Write resume context to a file that session-start can read
    const resumeContextFile = path.join(CACHE_DIR, 'resume-context.md');
    const context = generateResumeContext(handoff);

    fs.writeFileSync(resumeContextFile, context);

    // Output to console for immediate display
    console.log(context);

    // Set environment variables for other hooks to use
    if (handoff.workflow) {
      console.log(`AF_WORKFLOW_ID=${handoff.workflow.workflow_id}`);
      console.log(`AF_CURRENT_PHASE=${handoff.workflow.current_phase}`);
      console.log(`AF_RESUME_FROM_COMPACT=true`);
    }

    // Clean up handoff file after successful resume
    if (fs.existsSync(HANDOFF_FILE)) {
      fs.unlinkSync(HANDOFF_FILE);
    }

    return true;
  } catch (error) {
    console.error(`Resume inject error: ${error.message}`);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'save';

  if (mode === '--resume' || mode === 'resume') {
    // SessionStart mode - check for handoff and inject resume context
    const handoff = loadHandoff();
    if (handoff) {
      injectResumeContext(handoff);
    }
  } else {
    // Stop mode - save handoff state
    saveHandoff();
  }

  process.exit(0);
}

module.exports = { saveHandoff, loadHandoff, generateResumeContext };

if (require.main === module) {
  main();
}
