#!/usr/bin/env node
/**
 * Aura Frog - Auto-Learn Hook
 *
 * Fires: UserPromptSubmit
 * Purpose: Automatically detect corrections/feedback in user messages and record them
 *
 * Detection Patterns:
 * 1. Explicit corrections: "no", "wrong", "actually", "should be", "not like that"
 * 2. Modification requests: "change that", "fix that", "don't do that", "remove that"
 * 3. Preferences: "I prefer", "always use", "never use", "don't add"
 * 4. Ratings: "good job", "great", "terrible", "bad"
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { recordFeedback, isFeedbackEnabled } = require('./lib/af-learning.cjs');

// Correction detection patterns
const CORRECTION_PATTERNS = [
  // Direct negations
  /^no[,.\s!]/i,
  /^nope/i,
  /^wrong/i,
  /^incorrect/i,
  /^that's not (right|correct|what)/i,
  /^that was wrong/i,

  // Correction phrases
  /^actually[,\s]/i,
  /should (be|have|use|not)/i,
  /shouldn't (be|have|use|do)/i,
  /instead of/i,
  /not like that/i,
  /don't (do|add|use|put|include|create|make|write)/i,
  /do not (do|add|use|put|include|create|make|write)/i,
  /never (add|use|do|include|create|make|write)/i,
  /stop (adding|using|doing|including|creating|making|writing)/i,

  // Modification requests
  /^(change|fix|update|modify|correct|adjust|remove|delete|undo) (that|this|it)/i,
  /^(change|fix|update|modify|correct) the/i,
  /^that should/i,
  /^it should/i,
  /^please (don't|do not|stop|change|fix|remove)/i,

  // Preference statements
  /^i (prefer|want|need|like)/i,
  /^always (use|add|include)/i,
  /^(too|very) (verbose|long|short|complex|simple)/i,

  // Critique patterns
  /^(why did you|why are you)/i,
  /^that's (too|unnecessary|overkill|wrong)/i,
  /^(remove|delete|get rid of) (the|all|those|these) (comments?|jsdoc|docstrings?|annotations?)/i
];

// Positive feedback patterns
const APPROVAL_PATTERNS = [
  /^(good|great|perfect|excellent|nice|awesome|well done)/i,
  /^that's (good|great|perfect|right|correct|what i wanted)/i,
  /^(yes|yep|yeah)[,.\s!]/i,
  /^exactly/i,
  /^looks good/i,
  /^thank(s| you)/i
];

// Keywords that might indicate correction context
const CORRECTION_KEYWORDS = [
  'wrong', 'incorrect', 'mistake', 'error', 'fix', 'change', 'update',
  'don\'t', 'dont', 'shouldn\'t', 'shouldnt', 'never', 'stop',
  'remove', 'delete', 'undo', 'revert', 'actually', 'instead',
  'too much', 'too many', 'unnecessary', 'overkill', 'verbose',
  'not like', 'not what', 'prefer', 'want you to', 'need you to'
];

/**
 * Analyze user input for correction patterns
 */
function analyzeInput(userInput) {
  if (!userInput || userInput.length < 3) {
    return { type: null, confidence: 0 };
  }

  const input = userInput.trim();
  const inputLower = input.toLowerCase();

  // Check for explicit correction patterns
  for (const pattern of CORRECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        type: 'correction',
        confidence: 0.9,
        matchedPattern: pattern.toString()
      };
    }
  }

  // Check for approval patterns
  for (const pattern of APPROVAL_PATTERNS) {
    if (pattern.test(input)) {
      return {
        type: 'approval',
        confidence: 0.8,
        matchedPattern: pattern.toString()
      };
    }
  }

  // Check for correction keywords (lower confidence)
  const keywordMatches = CORRECTION_KEYWORDS.filter(kw => inputLower.includes(kw));
  if (keywordMatches.length >= 2) {
    return {
      type: 'correction',
      confidence: 0.7,
      matchedKeywords: keywordMatches
    };
  } else if (keywordMatches.length === 1) {
    return {
      type: 'correction',
      confidence: 0.5,
      matchedKeywords: keywordMatches
    };
  }

  return { type: null, confidence: 0 };
}

/**
 * Extract the core correction reason from input
 */
function extractReason(userInput) {
  // Take first 500 chars as reason
  const reason = userInput.trim().substring(0, 500);
  return reason;
}

/**
 * Categorize the feedback
 */
function categorizeCorrection(userInput) {
  const inputLower = userInput.toLowerCase();

  if (/comment|jsdoc|docstring|annotation/i.test(inputLower)) {
    return { category: 'code_style', rule: 'minimal_comments' };
  }
  if (/type|typescript|any\b/i.test(inputLower)) {
    return { category: 'code_style', rule: 'type_safety' };
  }
  if (/test|spec|coverage/i.test(inputLower)) {
    return { category: 'testing', rule: 'test_quality' };
  }
  if (/import|export|module/i.test(inputLower)) {
    return { category: 'code_style', rule: 'imports' };
  }
  if (/naming|name|variable|function/i.test(inputLower)) {
    return { category: 'code_style', rule: 'naming' };
  }
  if (/complex|simple|refactor|clean/i.test(inputLower)) {
    return { category: 'code_quality', rule: 'complexity' };
  }
  if (/error|exception|catch|throw/i.test(inputLower)) {
    return { category: 'error_handling', rule: 'error_handling' };
  }
  if (/security|auth|password|token/i.test(inputLower)) {
    return { category: 'security', rule: 'security' };
  }

  return { category: 'general', rule: 'general' };
}

/**
 * Main hook execution
 */
async function main() {
  if (!isFeedbackEnabled()) {
    process.exit(0);
  }

  try {
    const userInput = process.env.CLAUDE_USER_INPUT || '';

    if (!userInput || userInput.length < 5) {
      process.exit(0);
    }

    // Skip if it's a command
    if (userInput.startsWith('/')) {
      process.exit(0);
    }

    const analysis = analyzeInput(userInput);

    // Only record if confidence is high enough
    if (analysis.type && analysis.confidence >= 0.5) {
      const { category, rule } = categorizeCorrection(userInput);

      const feedbackData = {
        type: analysis.type,
        projectName: process.env.PROJECT_NAME || process.env.AF_PROJECT_NAME,
        reason: extractReason(userInput),
        rating: analysis.type === 'approval' ? 5 : (analysis.type === 'correction' ? 3 : 4),
        metadata: {
          source: 'auto_detect',
          confidence: analysis.confidence,
          category,
          rule,
          matchedPattern: analysis.matchedPattern,
          matchedKeywords: analysis.matchedKeywords,
          inputLength: userInput.length,
          agent: process.env.AF_CURRENT_AGENT || 'unknown'
        }
      };

      await recordFeedback(feedbackData);

      // Output a subtle indicator (not blocking)
      if (analysis.type === 'correction' && analysis.confidence >= 0.7) {
        console.log(`🧠 Learning: Captured ${analysis.type} (${Math.round(analysis.confidence * 100)}% confidence)`);
      }
    }

    process.exit(0);
  } catch (error) {
    // Non-blocking - don't fail user input
    // Silently fail to avoid interrupting user
    process.exit(0);
  }
}

// Export for testing
module.exports = { analyzeInput, extractReason, categorizeCorrection };

// Run if called directly
if (require.main === module) {
  main();
}
