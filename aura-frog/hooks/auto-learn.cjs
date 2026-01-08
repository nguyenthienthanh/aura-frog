#!/usr/bin/env node
/**
 * Aura Frog - Auto-Learn Hook
 *
 * Fires: UserPromptSubmit
 * Purpose: Automatically detect corrections/feedback in user messages and record them
 *
 * Features:
 * - Deduplication: Skips similar feedback within 24h
 * - Pattern detection: Auto-creates patterns after 3+ similar corrections
 * - Local cache: Stores feedback locally + Supabase
 * - Combines with project context
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 *
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { recordFeedback, recordPattern, isFeedbackEnabled } = require('./lib/af-learning.cjs');

// Cache file paths
const CACHE_DIR = path.join(process.cwd(), '.claude', 'cache');
const FEEDBACK_CACHE_FILE = path.join(CACHE_DIR, 'auto-learn-cache.json');
const PATTERNS_FILE = path.join(CACHE_DIR, 'learned-patterns.md');

// Deduplication window (24 hours)
const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

// Pattern threshold (corrections needed to auto-create pattern)
const PATTERN_THRESHOLD = 3;

// Correction detection patterns
const CORRECTION_PATTERNS = [
  /^no[,.\s!]/i,
  /^nope/i,
  /^wrong/i,
  /^incorrect/i,
  /^that's not (right|correct|what)/i,
  /^that was wrong/i,
  /^actually[,\s]/i,
  /should (be|have|use|not)/i,
  /shouldn't (be|have|use|do)/i,
  /instead of/i,
  /not like that/i,
  /don't (do|add|use|put|include|create|make|write)/i,
  /do not (do|add|use|put|include|create|make|write)/i,
  /never (add|use|do|include|create|make|write)/i,
  /stop (adding|using|doing|including|creating|making|writing)/i,
  /^(change|fix|update|modify|correct|adjust|remove|delete|undo) (that|this|it)/i,
  /^(change|fix|update|modify|correct) the/i,
  /^that should/i,
  /^it should/i,
  /^please (don't|do not|stop|change|fix|remove)/i,
  /^i (prefer|want|need|like)/i,
  /^always (use|add|include)/i,
  /^(too|very) (verbose|long|short|complex|simple)/i,
  /^(why did you|why are you)/i,
  /^that's (too|unnecessary|overkill|wrong)/i,
  /^(remove|delete|get rid of) (the|all|those|these) (comments?|jsdoc|docstrings?|annotations?)/i
];

const APPROVAL_PATTERNS = [
  /^(good|great|perfect|excellent|nice|awesome|well done)/i,
  /^that's (good|great|perfect|right|correct|what i wanted)/i,
  /^(yes|yep|yeah)[,.\s!]/i,
  /^exactly/i,
  /^looks good/i,
  /^thank(s| you)/i
];

const CORRECTION_KEYWORDS = [
  'wrong', 'incorrect', 'mistake', 'error', 'fix', 'change', 'update',
  'don\'t', 'dont', 'shouldn\'t', 'shouldnt', 'never', 'stop',
  'remove', 'delete', 'undo', 'revert', 'actually', 'instead',
  'too much', 'too many', 'unnecessary', 'overkill', 'verbose',
  'not like', 'not what', 'prefer', 'want you to', 'need you to'
];

/**
 * Ensure cache directory exists
 */
function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch { /* ignore */ }
}

/**
 * Load feedback cache
 */
function loadCache() {
  try {
    if (fs.existsSync(FEEDBACK_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(FEEDBACK_CACHE_FILE, 'utf-8'));
      // Clean old entries
      const cutoff = Date.now() - DEDUP_WINDOW_MS;
      data.entries = (data.entries || []).filter(e => e.timestamp > cutoff);
      data.patterns = data.patterns || {};
      return data;
    }
  } catch { /* ignore */ }
  return { entries: [], patterns: {} };
}

/**
 * Save feedback cache
 */
function saveCache(cache) {
  try {
    ensureCacheDir();
    // Keep only last 100 entries
    cache.entries = (cache.entries || []).slice(-100);
    fs.writeFileSync(FEEDBACK_CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch { /* ignore */ }
}

/**
 * Generate hash for deduplication
 */
function generateHash(content) {
  // Normalize: lowercase, remove extra spaces, take first 200 chars
  const normalized = content.toLowerCase().replace(/\s+/g, ' ').trim().substring(0, 200);
  return crypto.createHash('md5').update(normalized).digest('hex').substring(0, 12);
}

/**
 * Check if feedback is duplicate
 */
function isDuplicate(cache, hash) {
  return cache.entries.some(e => e.hash === hash);
}

/**
 * Check for similar patterns and return count
 */
function getSimilarPatternCount(cache, category, rule) {
  const key = `${category}:${rule}`;
  return cache.patterns[key] || 0;
}

/**
 * Increment pattern count
 */
function incrementPatternCount(cache, category, rule) {
  const key = `${category}:${rule}`;
  cache.patterns[key] = (cache.patterns[key] || 0) + 1;
  return cache.patterns[key];
}

/**
 * Update local patterns file
 */
function updateLocalPatternsFile(category, rule, reason, count) {
  try {
    ensureCacheDir();

    let content = '';
    if (fs.existsSync(PATTERNS_FILE)) {
      content = fs.readFileSync(PATTERNS_FILE, 'utf-8');
    } else {
      content = `# Learned Patterns\n\nAuto-generated from user corrections. Updated: ${new Date().toISOString()}\n\n---\n\n`;
    }

    // Check if pattern already exists
    const patternMarker = `<!-- PATTERN:${category}:${rule} -->`;
    if (content.includes(patternMarker)) {
      // Update existing pattern
      const regex = new RegExp(`${patternMarker}[\\s\\S]*?(?=<!-- PATTERN:|$)`, 'g');
      content = content.replace(regex, `${patternMarker}\n## ${category}: ${rule}\n\n**Occurrences:** ${count}\n**Latest:** ${reason.substring(0, 100)}...\n\n---\n\n`);
    } else {
      // Add new pattern
      content += `${patternMarker}\n## ${category}: ${rule}\n\n**Occurrences:** ${count}\n**Latest:** ${reason.substring(0, 100)}...\n\n---\n\n`;
    }

    // Update timestamp
    content = content.replace(/Updated: .+/, `Updated: ${new Date().toISOString()}`);

    fs.writeFileSync(PATTERNS_FILE, content);
  } catch { /* ignore */ }
}

/**
 * Analyze user input for correction patterns
 */
function analyzeInput(userInput) {
  if (!userInput || userInput.length < 3) {
    return { type: null, confidence: 0 };
  }

  const input = userInput.trim();
  const inputLower = input.toLowerCase();

  for (const pattern of CORRECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { type: 'correction', confidence: 0.9, matchedPattern: pattern.toString() };
    }
  }

  for (const pattern of APPROVAL_PATTERNS) {
    if (pattern.test(input)) {
      return { type: 'approval', confidence: 0.8, matchedPattern: pattern.toString() };
    }
  }

  const keywordMatches = CORRECTION_KEYWORDS.filter(kw => inputLower.includes(kw));
  if (keywordMatches.length >= 2) {
    return { type: 'correction', confidence: 0.7, matchedKeywords: keywordMatches };
  } else if (keywordMatches.length === 1) {
    return { type: 'correction', confidence: 0.5, matchedKeywords: keywordMatches };
  }

  return { type: null, confidence: 0 };
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

    // Skip commands
    if (userInput.startsWith('/')) {
      process.exit(0);
    }

    const analysis = analyzeInput(userInput);

    if (!analysis.type || analysis.confidence < 0.5) {
      process.exit(0);
    }

    const { category, rule } = categorizeCorrection(userInput);
    const reason = userInput.trim().substring(0, 500);
    const hash = generateHash(userInput);

    // Load cache
    const cache = loadCache();

    // Check for duplicate
    if (isDuplicate(cache, hash)) {
      // Skip duplicate, but still count for pattern detection
      process.exit(0);
    }

    // Increment pattern count
    const patternCount = incrementPatternCount(cache, category, rule);

    // Add to cache
    cache.entries.push({
      hash,
      type: analysis.type,
      category,
      rule,
      timestamp: Date.now()
    });

    // Save cache
    saveCache(cache);

    // Record to Supabase
    const feedbackData = {
      type: analysis.type,
      projectName: process.env.PROJECT_NAME || process.env.AF_PROJECT_NAME,
      reason,
      rating: analysis.type === 'approval' ? 5 : 3,
      metadata: {
        source: 'auto_detect',
        confidence: analysis.confidence,
        category,
        rule,
        hash,
        patternCount,
        matchedPattern: analysis.matchedPattern,
        matchedKeywords: analysis.matchedKeywords,
        agent: process.env.AF_CURRENT_AGENT || 'unknown'
      }
    };

    await recordFeedback(feedbackData);

    // Update local patterns file
    updateLocalPatternsFile(category, rule, reason, patternCount);

    // Auto-create learned pattern if threshold reached
    if (patternCount === PATTERN_THRESHOLD && analysis.type === 'correction') {
      await recordPattern({
        type: 'preference',
        category,
        description: `User prefers: ${rule} (auto-detected from ${patternCount} corrections)`,
        evidence: [reason.substring(0, 200)]
      });
      console.log(`🧠 Learning: Pattern detected! "${category}:${rule}" (${patternCount} occurrences)`);
    } else if (analysis.type === 'correction' && analysis.confidence >= 0.7) {
      console.log(`🧠 Learning: Captured ${analysis.type} [${category}:${rule}] (${patternCount}x)`);
    }

    process.exit(0);
  } catch (error) {
    process.exit(0);
  }
}

module.exports = { analyzeInput, categorizeCorrection, generateHash, loadCache };

if (require.main === module) {
  main();
}
