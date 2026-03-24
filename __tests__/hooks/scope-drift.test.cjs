/**
 * Tests for scope-drift.cjs
 *
 * Tests: keyword extraction, overlap calculation, drift detection
 */

// Replicate pure functions from source for unit testing

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'that',
  'this', 'it', 'not', 'but', 'and', 'or', 'if', 'then', 'so', 'no',
  'yes', 'just', 'now', 'please', 'thanks', 'thank', 'ok', 'okay',
  'i', 'me', 'my', 'we', 'you', 'your', 'use', 'make', 'get', 'set',
]);

const FEATURE_TRIGGERS = [
  /\balso\s+(?:add|create|implement|build)\b/i,
  /\bwhile\s+(?:you're|we're|you are)\s+at\s+it\b/i,
  /\bcan\s+you\s+also\b/i,
  /\blet'?s\s+also\b/i,
  /\band\s+(?:add|create|implement|build)\s+a?\s*(?:new\s+)?(?!test)/i,
  /\bnew\s+feature\b/i,
  /\bseparate\s+(?:task|feature|thing)\b/i,
];

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function calculateOverlap(taskKeywords, promptKeywords) {
  if (taskKeywords.length === 0 || promptKeywords.length === 0) return 1;
  const taskSet = new Set(taskKeywords);
  const matched = promptKeywords.filter(k => taskSet.has(k));
  return matched.length / promptKeywords.length;
}

describe('scope-drift', () => {
  describe('extractKeywords', () => {
    it('extracts meaningful words', () => {
      const result = extractKeywords('implement login authentication');
      expect(result).toEqual(['implement', 'login', 'authentication']);
    });

    it('filters out stopwords', () => {
      const result = extractKeywords('the quick fox is a nice animal');
      // 'the' (stop), 'quick' (keep), 'fox' (keep), 'is' (stop), 'a' (stop), 'nice' (keep), 'animal' (keep)
      expect(result).toEqual(['quick', 'fox', 'nice', 'animal']);
    });

    it('filters out short words (2 chars or less)', () => {
      const result = extractKeywords('go to my app');
      // 'go' (2 chars, filtered), 'to' (stop), 'my' (stop), 'app' (keep)
      expect(result).toEqual(['app']);
    });

    it('lowercases all words', () => {
      const result = extractKeywords('Implement LOGIN Auth');
      expect(result).toEqual(['implement', 'login', 'auth']);
    });

    it('strips punctuation', () => {
      const result = extractKeywords('hello, world! test.');
      expect(result).toEqual(['hello', 'world', 'test']);
    });

    it('handles empty string', () => {
      expect(extractKeywords('')).toEqual([]);
    });

    it('preserves hyphens in words', () => {
      const result = extractKeywords('server-side rendering');
      expect(result).toEqual(['server-side', 'rendering']);
    });

    it('handles numbers', () => {
      const result = extractKeywords('version 123 release');
      expect(result).toEqual(['version', '123', 'release']);
    });
  });

  describe('calculateOverlap', () => {
    it('returns 1 when all prompt keywords match task keywords', () => {
      const task = ['login', 'authentication', 'user'];
      const prompt = ['login', 'authentication'];
      expect(calculateOverlap(task, prompt)).toBe(1);
    });

    it('returns 0 when no keywords overlap', () => {
      const task = ['login', 'authentication'];
      const prompt = ['database', 'migration'];
      expect(calculateOverlap(task, prompt)).toBe(0);
    });

    it('returns fractional overlap', () => {
      const task = ['login', 'authentication', 'user'];
      const prompt = ['login', 'database', 'migration', 'schema'];
      // 1 out of 4 = 0.25
      expect(calculateOverlap(task, prompt)).toBe(0.25);
    });

    it('returns 1 when task keywords are empty', () => {
      expect(calculateOverlap([], ['login', 'auth'])).toBe(1);
    });

    it('returns 1 when prompt keywords are empty', () => {
      expect(calculateOverlap(['login', 'auth'], [])).toBe(1);
    });

    it('returns 1 when both are empty', () => {
      expect(calculateOverlap([], [])).toBe(1);
    });

    it('calculates ratio based on prompt keywords length', () => {
      const task = ['api', 'endpoint', 'rest'];
      const prompt = ['api', 'endpoint'];
      // 2 out of 2 = 1
      expect(calculateOverlap(task, prompt)).toBe(1);
    });

    it('handles partial overlap correctly', () => {
      const task = ['react', 'component', 'button'];
      const prompt = ['react', 'migration', 'database'];
      // 1 out of 3
      expect(calculateOverlap(task, prompt)).toBeCloseTo(0.333, 2);
    });
  });

  describe('FEATURE_TRIGGERS', () => {
    it('detects "also add"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('also add a sidebar'))).toBe(true);
    });

    it('detects "also create"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('also create a dashboard'))).toBe(true);
    });

    it('detects "also implement"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('also implement caching'))).toBe(true);
    });

    it('detects "while you\'re at it"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test("while you're at it, fix the header"))).toBe(true);
    });

    it('detects "while we\'re at it"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test("while we're at it, add logging"))).toBe(true);
    });

    it('detects "can you also"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('can you also update the styles'))).toBe(true);
    });

    it('detects "let\'s also"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test("let's also refactor this"))).toBe(true);
    });

    it('detects "lets also"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('lets also clean up'))).toBe(true);
    });

    it('detects "and add a new"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('and add a new component'))).toBe(true);
    });

    it('detects "new feature"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('this is a new feature request'))).toBe(true);
    });

    it('detects "separate task"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('this should be a separate task'))).toBe(true);
    });

    it('detects "separate feature"', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('that is a separate feature'))).toBe(true);
    });

    it('does not trigger on normal prompts', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('fix the login button color'))).toBe(false);
    });

    it('does not trigger on "and add test" (excluded by negative lookahead)', () => {
      expect(FEATURE_TRIGGERS.some(re => re.test('and add test coverage'))).toBe(false);
    });
  });

  describe('drift detection (combined logic)', () => {
    function detectDrift(taskDescription, userPrompt) {
      const hasFeatureTrigger = FEATURE_TRIGGERS.some(re => re.test(userPrompt));
      const taskKeywords = extractKeywords(taskDescription);
      const promptKeywords = extractKeywords(userPrompt);
      const overlap = calculateOverlap(taskKeywords, promptKeywords);
      return hasFeatureTrigger && overlap < 0.2;
    }

    it('detects drift when feature trigger + low overlap', () => {
      const task = 'implement user authentication with JWT tokens';
      const prompt = 'can you also build a payment gateway with Stripe integration';
      expect(detectDrift(task, prompt)).toBe(true);
    });

    it('no drift when topic overlaps even with feature trigger', () => {
      const task = 'implement user authentication with JWT tokens';
      const prompt = 'can you also add JWT token refresh for authentication';
      expect(detectDrift(task, prompt)).toBe(false);
    });

    it('no drift without feature trigger even with low overlap', () => {
      const task = 'implement user authentication';
      const prompt = 'build a payment gateway with Stripe';
      expect(detectDrift(task, prompt)).toBe(false);
    });

    it('no drift on related follow-up work', () => {
      const task = 'create REST API endpoints for user management';
      const prompt = 'also add validation for the user API endpoints';
      expect(detectDrift(task, prompt)).toBe(false);
    });
  });
});
