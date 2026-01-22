#!/usr/bin/env node
/**
 * Aura Frog - Learning System Utilities
 *
 * Handles learning storage with dual-mode support:
 * - Supabase: Cloud storage for cross-session memory
 * - Local: File-based storage when Supabase not configured
 *
 * Features:
 * - Feedback collection
 * - Workflow metrics
 * - Agent performance tracking
 * - Pattern queries
 * - Local fallback with MD file generation
 *
 * @version 2.0.0
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Local storage paths
const LEARNING_DIR = path.join(process.cwd(), '.claude', 'learning');
const LOCAL_FEEDBACK_FILE = path.join(LEARNING_DIR, 'feedback.json');
const LOCAL_PATTERNS_FILE = path.join(LEARNING_DIR, 'patterns.json');
const LOCAL_METRICS_FILE = path.join(LEARNING_DIR, 'metrics.json');
const LOCAL_WORKFLOW_EVENTS_FILE = path.join(LEARNING_DIR, 'workflow-events.json');
const LEARNED_RULES_MD = path.join(LEARNING_DIR, 'learned-rules.md');
const MAIN_INSTRUCTION_LINK = path.join(process.cwd(), '.claude', 'LEARNED_PATTERNS.md');

/**
 * Check if Supabase is configured
 * @returns {boolean}
 */
function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

/**
 * Check if learning system is enabled
 * Learning is ALWAYS enabled by default (uses local storage)
 * Set AF_LEARNING_DISABLED=true to disable completely
 * @returns {boolean}
 */
function isLearningEnabled() {
  // User can explicitly disable all learning
  if (process.env.AF_LEARNING_DISABLED === 'true') {
    return false;
  }
  // Otherwise, learning is always enabled (local or Supabase)
  return true;
}

/**
 * Check if using local storage mode
 * Local mode when: Supabase NOT configured
 * Supabase mode when: Supabase IS configured
 * @returns {boolean}
 */
function isLocalMode() {
  // If Supabase is configured, use Supabase (not local)
  if (isSupabaseConfigured()) {
    return false;
  }
  // No Supabase = use local storage
  return true;
}

/**
 * Check if feedback collection is enabled
 * @returns {boolean}
 */
function isFeedbackEnabled() {
  return isLearningEnabled() && process.env.AF_FEEDBACK_COLLECTION !== 'false';
}

/**
 * Check if metrics collection is enabled
 * @returns {boolean}
 */
function isMetricsEnabled() {
  return isLearningEnabled() && process.env.AF_METRICS_COLLECTION !== 'false';
}

/**
 * Ensure learning directory exists
 */
function ensureLearningDir() {
  try {
    if (!fs.existsSync(LEARNING_DIR)) {
      fs.mkdirSync(LEARNING_DIR, { recursive: true });
    }
  } catch { /* ignore */ }
}

/**
 * Load local JSON file
 * @param {string} filePath
 * @returns {Array|object}
 */
function loadLocalFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch { /* ignore */ }
  return [];
}

/**
 * Save to local JSON file
 * @param {string} filePath
 * @param {Array|object} data
 */
function saveLocalFile(filePath, data) {
  try {
    ensureLearningDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch { /* ignore */ }
}

/**
 * Update the learned rules MD file and link to main instruction
 */
function updateLearnedRulesMD() {
  try {
    ensureLearningDir();

    const patterns = loadLocalFile(LOCAL_PATTERNS_FILE);
    const feedback = loadLocalFile(LOCAL_FEEDBACK_FILE);

    // Group patterns by category
    const groupedPatterns = {};
    patterns.forEach(p => {
      const cat = p.category || 'general';
      if (!groupedPatterns[cat]) groupedPatterns[cat] = [];
      groupedPatterns[cat].push(p);
    });

    // Count corrections by category
    const correctionCounts = {};
    feedback.filter(f => f.feedback_type === 'correction').forEach(f => {
      const cat = f.metadata?.category || 'general';
      correctionCounts[cat] = (correctionCounts[cat] || 0) + 1;
    });

    let content = `# Learned Patterns & Rules\n\n`;
    content += `**Auto-generated from user corrections and feedback**\n`;
    content += `**Last Updated:** ${new Date().toISOString()}\n\n`;
    content += `---\n\n`;
    content += `## Summary\n\n`;
    content += `- **Total Patterns:** ${patterns.length}\n`;
    content += `- **Total Feedback:** ${feedback.length}\n\n`;

    // Add patterns by category
    for (const [category, categoryPatterns] of Object.entries(groupedPatterns)) {
      content += `## ${category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}\n\n`;
      content += `*${correctionCounts[category] || 0} corrections in this category*\n\n`;

      categoryPatterns.forEach(p => {
        content += `### ${p.description || p.rule || 'Pattern'}\n\n`;
        if (p.evidence && p.evidence.length > 0) {
          content += `**Examples:**\n`;
          p.evidence.slice(0, 3).forEach(e => {
            content += `- ${e.substring(0, 100)}${e.length > 100 ? '...' : ''}\n`;
          });
          content += `\n`;
        }
        content += `**Frequency:** ${p.frequency || 1} occurrences\n\n`;
      });
    }

    // Add recent corrections as examples
    const recentCorrections = feedback
      .filter(f => f.feedback_type === 'correction')
      .slice(-10);

    if (recentCorrections.length > 0) {
      content += `---\n\n## Recent Corrections\n\n`;
      content += `*Things the user has corrected recently - avoid repeating these mistakes*\n\n`;

      recentCorrections.forEach(c => {
        content += `- **${c.metadata?.category || 'general'}:** ${(c.reason || '').substring(0, 150)}${(c.reason || '').length > 150 ? '...' : ''}\n`;
      });
      content += `\n`;
    }

    content += `---\n\n`;
    content += `*This file is auto-updated. Do not edit manually.*\n`;

    // Write the learned rules file
    fs.writeFileSync(LEARNED_RULES_MD, content);

    // Create symlink/reference in main .claude directory
    const linkContent = `# Learned Patterns\n\n`;
    const linkRef = `**IMPORTANT:** Read and apply the patterns from:\n\n`;
    const linkPath = `\`\`\`\n.claude/learning/learned-rules.md\n\`\`\`\n\n`;
    const linkNote = `These are patterns learned from user corrections. Apply them to avoid repeating mistakes.\n`;

    fs.writeFileSync(MAIN_INSTRUCTION_LINK, linkContent + linkRef + linkPath + linkNote);

  } catch (error) {
    console.error(`Failed to update learned rules MD: ${error.message}`);
  }
}

/**
 * Make a request to Supabase REST API
 * @param {string} table - Table name
 * @param {string} method - HTTP method
 * @param {object} data - Request body
 * @param {object} params - Query parameters
 * @returns {Promise<object>}
 */
async function supabaseRequest(table, method = 'POST', data = null, params = {}) {
  const url = new URL(`${process.env.SUPABASE_URL}/rest/v1/${table}`);

  // Add query params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    }
  };

  return new Promise((resolve, reject) => {
    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            resolve({ raw: body });
          }
        } else {
          reject(new Error(`Supabase error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Supabase request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Record user feedback (to Supabase or local storage)
 * @param {object} feedback
 * @param {string} feedback.type - 'correction' | 'approval' | 'rejection' | 'rating' | 'agent_switch'
 * @param {string} [feedback.sessionId]
 * @param {string} [feedback.workflowId]
 * @param {string} [feedback.projectName]
 * @param {string} [feedback.phase]
 * @param {string} [feedback.original]
 * @param {string} [feedback.corrected]
 * @param {string} [feedback.reason]
 * @param {number} [feedback.rating]
 * @param {object} [feedback.metadata]
 * @returns {Promise<object|null>}
 */
async function recordFeedback(feedback) {
  if (!isFeedbackEnabled()) {
    return null;
  }

  const data = {
    session_id: feedback.sessionId || process.env.AF_SESSION_ID,
    workflow_id: feedback.workflowId,
    project_name: feedback.projectName || process.env.PROJECT_NAME,
    phase: feedback.phase,
    feedback_type: feedback.type,
    original_response: feedback.original,
    corrected_response: feedback.corrected,
    reason: feedback.reason,
    rating: feedback.rating,
    metadata: feedback.metadata || {},
    created_at: new Date().toISOString()
  };

  // Use local storage if Supabase not configured
  if (isLocalMode()) {
    try {
      const allFeedback = loadLocalFile(LOCAL_FEEDBACK_FILE);
      allFeedback.push(data);
      // Keep only last 500 entries
      const trimmed = allFeedback.slice(-500);
      saveLocalFile(LOCAL_FEEDBACK_FILE, trimmed);
      // Update the MD file
      updateLearnedRulesMD();
      return data;
    } catch (error) {
      console.error(`Learning: Failed to record local feedback: ${error.message}`);
      return null;
    }
  }

  // Use Supabase
  try {
    return await supabaseRequest('af_feedback', 'POST', data);
  } catch (error) {
    console.error(`Learning: Failed to record feedback: ${error.message}`);
    return null;
  }
}

/**
 * Record workflow metrics to Supabase
 * @param {object} metrics
 * @returns {Promise<object|null>}
 */
async function recordWorkflowMetrics(metrics) {
  if (!isMetricsEnabled()) {
    return null;
  }

  try {
    const data = {
      workflow_id: metrics.workflowId,
      project_name: metrics.projectName || process.env.PROJECT_NAME,
      project_type: metrics.projectType || process.env.AF_PROJECT_TYPE,
      framework: metrics.framework || process.env.AF_FRAMEWORK,
      workflow_type: metrics.workflowType || 'full',
      total_phases: metrics.totalPhases || 9,
      completed_phases: metrics.completedPhases || 0,
      success: metrics.success,
      failure_reason: metrics.failureReason,
      auto_stop_phase: metrics.autoStopPhase,
      auto_stop_reason: metrics.autoStopReason,
      total_tokens: metrics.totalTokens || 0,
      tokens_by_phase: metrics.tokensByPhase || {},
      duration_seconds: metrics.durationSeconds,
      duration_by_phase: metrics.durationByPhase || {},
      test_pass_rate: metrics.testPassRate,
      code_coverage: metrics.codeCoverage,
      retries: metrics.retries || 0,
      metadata: metrics.metadata || {},
      started_at: metrics.startedAt,
      completed_at: metrics.completedAt || new Date().toISOString()
    };

    return await supabaseRequest('af_workflow_metrics', 'POST', data);
  } catch (error) {
    console.error(`Learning: Failed to record workflow metrics: ${error.message}`);
    return null;
  }
}

/**
 * Record agent performance to Supabase
 * @param {object} performance
 * @returns {Promise<object|null>}
 */
async function recordAgentPerformance(performance) {
  if (!isMetricsEnabled()) {
    return null;
  }

  try {
    const data = {
      session_id: performance.sessionId || process.env.AF_SESSION_ID,
      workflow_id: performance.workflowId,
      agent_name: performance.agentName,
      task_type: performance.taskType,
      task_description: performance.taskDescription,
      confidence_score: performance.confidenceScore,
      detection_method: performance.detectionMethod,
      success: performance.success,
      user_override: performance.userOverride || false,
      override_to_agent: performance.overrideToAgent,
      duration_ms: performance.durationMs,
      tokens_used: performance.tokensUsed,
      error_message: performance.errorMessage,
      metadata: performance.metadata || {}
    };

    return await supabaseRequest('af_agent_performance', 'POST', data);
  } catch (error) {
    console.error(`Learning: Failed to record agent performance: ${error.message}`);
    return null;
  }
}

/**
 * Record workflow event (approve/reject/modify/cancel) to Supabase and local storage
 * @param {object} event
 * @param {string} event.workflowId - Workflow identifier
 * @param {string} event.eventType - 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'CANCELLED' | 'PHASE_START' | 'WORKFLOW_COMPLETE'
 * @param {number} event.phase - Phase number (1-9)
 * @param {string} [event.reason] - Reason for rejection/modification
 * @param {number} [event.attemptCount] - Rejection/modification count for this phase
 * @param {object} [event.metadata] - Additional metadata
 * @returns {Promise<object|null>}
 */
async function recordWorkflowEvent(event) {
  if (!isLearningEnabled()) {
    return null;
  }

  const eventData = {
    workflow_id: event.workflowId,
    event_type: event.eventType,
    phase: event.phase,
    reason: event.reason,
    attempt_count: event.attemptCount || 1,
    project_name: event.projectName || process.env.PROJECT_NAME,
    session_id: event.sessionId || process.env.AF_SESSION_ID,
    metadata: event.metadata || {},
    created_at: new Date().toISOString()
  };

  // Always save to local storage
  try {
    const allEvents = loadLocalFile(LOCAL_WORKFLOW_EVENTS_FILE);
    allEvents.push(eventData);
    // Keep only last 1000 events
    const trimmed = allEvents.slice(-1000);
    saveLocalFile(LOCAL_WORKFLOW_EVENTS_FILE, trimmed);
  } catch (error) {
    console.error(`Learning: Failed to record local workflow event: ${error.message}`);
  }

  // Also save to Supabase if configured
  if (!isLocalMode()) {
    try {
      await supabaseRequest('af_workflow_events', 'POST', eventData);
    } catch (error) {
      console.error(`Learning: Failed to record Supabase workflow event: ${error.message}`);
    }
  }

  // If rejection or modification, also record as feedback for learning
  if (event.eventType === 'REJECTED' || event.eventType === 'MODIFIED') {
    await recordFeedback({
      type: event.eventType.toLowerCase(),
      workflowId: event.workflowId,
      phase: event.phase.toString(),
      reason: event.reason,
      metadata: {
        event_type: event.eventType,
        attempt_count: event.attemptCount,
        ...event.metadata
      }
    });
  }

  return eventData;
}

/**
 * Get workflow events for a specific workflow
 * @param {string} workflowId
 * @returns {Array}
 */
function getWorkflowEvents(workflowId) {
  const allEvents = loadLocalFile(LOCAL_WORKFLOW_EVENTS_FILE);
  return allEvents.filter(e => e.workflow_id === workflowId);
}

/**
 * Get workflow event statistics
 * @param {string} [workflowId] - Optional filter by workflow
 * @returns {object}
 */
function getWorkflowEventStats(workflowId = null) {
  let events = loadLocalFile(LOCAL_WORKFLOW_EVENTS_FILE);

  if (workflowId) {
    events = events.filter(e => e.workflow_id === workflowId);
  }

  const stats = {
    total: events.length,
    byType: {},
    byPhase: {},
    recentEvents: events.slice(-10)
  };

  events.forEach(e => {
    stats.byType[e.event_type] = (stats.byType[e.event_type] || 0) + 1;
    const phaseKey = `phase_${e.phase}`;
    if (!stats.byPhase[phaseKey]) {
      stats.byPhase[phaseKey] = { approved: 0, rejected: 0, modified: 0 };
    }
    if (e.event_type === 'APPROVED') stats.byPhase[phaseKey].approved++;
    if (e.event_type === 'REJECTED') stats.byPhase[phaseKey].rejected++;
    if (e.event_type === 'MODIFIED') stats.byPhase[phaseKey].modified++;
  });

  return stats;
}

/**
 * Update or create a learned pattern (to Supabase or local storage)
 * @param {object} pattern
 * @returns {Promise<object|null>}
 */
async function recordPattern(pattern) {
  if (!isLearningEnabled()) {
    return null;
  }

  const patternData = {
    type: pattern.type,
    category: pattern.category,
    description: pattern.description,
    evidence: pattern.evidence || [],
    rule: pattern.rule,
    frequency: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Use local storage if Supabase not configured
  if (isLocalMode()) {
    try {
      const allPatterns = loadLocalFile(LOCAL_PATTERNS_FILE);

      // Check if pattern exists (by category + description or rule)
      const existingIndex = allPatterns.findIndex(p =>
        p.category === pattern.category &&
        (p.description === pattern.description || p.rule === pattern.rule)
      );

      if (existingIndex >= 0) {
        // Update existing pattern
        allPatterns[existingIndex].frequency = (allPatterns[existingIndex].frequency || 0) + 1;
        allPatterns[existingIndex].updated_at = new Date().toISOString();
        if (pattern.evidence && pattern.evidence.length > 0) {
          allPatterns[existingIndex].evidence = [
            ...(allPatterns[existingIndex].evidence || []),
            ...pattern.evidence
          ].slice(-10); // Keep last 10 evidence items
        }
      } else {
        // Add new pattern
        allPatterns.push(patternData);
      }

      saveLocalFile(LOCAL_PATTERNS_FILE, allPatterns);
      // Update the MD file
      updateLearnedRulesMD();
      return patternData;
    } catch (error) {
      console.error(`Learning: Failed to record local pattern: ${error.message}`);
      return null;
    }
  }

  // Use Supabase
  try {
    // Use RPC function to update frequency or create new
    const url = new URL(`${process.env.SUPABASE_URL}/rest/v1/rpc/update_pattern_frequency`);

    const data = {
      p_pattern_type: pattern.type,
      p_category: pattern.category,
      p_description: pattern.description,
      p_evidence: pattern.evidence || []
    };

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SECRET_KEY}`
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body ? JSON.parse(body) : {});
          } else {
            reject(new Error(`Pattern update error ${res.statusCode}: ${body}`));
          }
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify(data));
      req.end();
    });
  } catch (error) {
    console.error(`Learning: Failed to record pattern: ${error.message}`);
    return null;
  }
}

/**
 * Query agent success rates
 * @param {string} [taskType] - Filter by task type
 * @returns {Promise<Array|null>}
 */
async function getAgentSuccessRates(taskType = null) {
  if (!isLearningEnabled()) {
    return null;
  }

  try {
    const params = { select: '*' };
    if (taskType) {
      params['task_type'] = `eq.${taskType}`;
    }
    return await supabaseRequest('v_agent_success_rates', 'GET', null, params);
  } catch (error) {
    console.error(`Learning: Failed to get agent success rates: ${error.message}`);
    return null;
  }
}

/**
 * Get improvement suggestions
 * @param {number} [limit] - Max suggestions to return
 * @returns {Promise<Array|null>}
 */
async function getImprovementSuggestions(limit = 10) {
  if (!isLearningEnabled()) {
    return null;
  }

  try {
    const params = {
      select: '*',
      limit: limit.toString(),
      order: 'confidence.desc'
    };
    return await supabaseRequest('v_improvement_suggestions', 'GET', null, params);
  } catch (error) {
    console.error(`Learning: Failed to get improvement suggestions: ${error.message}`);
    return null;
  }
}

/**
 * Get learning system status
 * @returns {Promise<object>}
 */
async function getLearningStatus() {
  const status = {
    enabled: isLearningEnabled(),
    feedbackEnabled: isFeedbackEnabled(),
    metricsEnabled: isMetricsEnabled(),
    supabaseConfigured: isSupabaseConfigured(),
    localMode: isLocalMode(),
    autoAnalyze: process.env.AF_AUTO_ANALYZE || 'disabled'
  };

  if (status.enabled) {
    if (status.localMode) {
      // Get counts from local files
      try {
        const feedback = loadLocalFile(LOCAL_FEEDBACK_FILE);
        const patterns = loadLocalFile(LOCAL_PATTERNS_FILE);
        status.stats = {
          feedbackCount: feedback.length,
          activePatterns: patterns.length,
          storageMode: 'local',
          learningDir: LEARNING_DIR
        };
      } catch {
        status.stats = { error: 'Could not read local files' };
      }
    } else {
      // Get counts from Supabase
      try {
        const feedbackSummary = await supabaseRequest('v_feedback_summary', 'GET', null, { select: '*' });
        const patternCount = await supabaseRequest('af_learned_patterns', 'GET', null, {
          select: 'count',
          active: 'eq.true'
        });

        status.stats = {
          feedbackCount: feedbackSummary?.reduce((sum, f) => sum + (f.total_count || 0), 0) || 0,
          activePatterns: patternCount?.[0]?.count || 0,
          storageMode: 'supabase'
        };
      } catch {
        status.stats = { error: 'Could not fetch stats' };
      }
    }
  }

  return status;
}

/**
 * Get local learned patterns for session context
 * @returns {Array}
 */
function getLocalPatterns() {
  return loadLocalFile(LOCAL_PATTERNS_FILE);
}

/**
 * Get recent feedback for context
 * @param {number} limit
 * @returns {Array}
 */
function getRecentFeedback(limit = 20) {
  const feedback = loadLocalFile(LOCAL_FEEDBACK_FILE);
  return feedback.slice(-limit);
}

module.exports = {
  isLearningEnabled,
  isFeedbackEnabled,
  isMetricsEnabled,
  isSupabaseConfigured,
  isLocalMode,
  supabaseRequest,
  recordFeedback,
  recordWorkflowMetrics,
  recordAgentPerformance,
  recordWorkflowEvent,
  getWorkflowEvents,
  getWorkflowEventStats,
  recordPattern,
  getAgentSuccessRates,
  getImprovementSuggestions,
  getLearningStatus,
  getLocalPatterns,
  getRecentFeedback,
  updateLearnedRulesMD,
  LEARNING_DIR,
  LEARNED_RULES_MD,
  MAIN_INSTRUCTION_LINK,
  LOCAL_WORKFLOW_EVENTS_FILE
};
