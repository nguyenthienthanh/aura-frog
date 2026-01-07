#!/usr/bin/env node
/**
 * Aura Frog - Learning System Utilities
 *
 * Handles Supabase interactions for the learning system:
 * - Feedback collection
 * - Workflow metrics
 * - Agent performance tracking
 * - Pattern queries
 *
 * @version 1.0.0
 */

const https = require('https');
const http = require('http');

/**
 * Check if learning system is enabled
 * @returns {boolean}
 */
function isLearningEnabled() {
  return process.env.AF_LEARNING_ENABLED === 'true' &&
         process.env.SUPABASE_URL &&
         process.env.SUPABASE_SECRET_KEY;
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
 * Record user feedback to Supabase
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

  try {
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
      metadata: feedback.metadata || {}
    };

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
 * Update or create a learned pattern
 * @param {object} pattern
 * @returns {Promise<object|null>}
 */
async function recordPattern(pattern) {
  if (!isLearningEnabled()) {
    return null;
  }

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
    supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY),
    autoAnalyze: process.env.AF_AUTO_ANALYZE || 'disabled'
  };

  if (status.enabled) {
    try {
      // Get counts from views
      const feedbackSummary = await supabaseRequest('v_feedback_summary', 'GET', null, { select: '*' });
      const patternCount = await supabaseRequest('af_learned_patterns', 'GET', null, {
        select: 'count',
        active: 'eq.true'
      });

      status.stats = {
        feedbackCount: feedbackSummary?.reduce((sum, f) => sum + (f.total_count || 0), 0) || 0,
        activePatterns: patternCount?.[0]?.count || 0
      };
    } catch {
      status.stats = { error: 'Could not fetch stats' };
    }
  }

  return status;
}

module.exports = {
  isLearningEnabled,
  isFeedbackEnabled,
  isMetricsEnabled,
  supabaseRequest,
  recordFeedback,
  recordWorkflowMetrics,
  recordAgentPerformance,
  recordPattern,
  getAgentSuccessRates,
  getImprovementSuggestions,
  getLearningStatus
};
