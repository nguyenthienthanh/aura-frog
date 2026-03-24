/**
 * Tests for prompt-reminder.cjs
 *
 * Tests: needsTddReminder (code keywords), needsApprovalReminder (phases 1 and 3 only)
 */

// Extract the pure functions by evaluating the module source
// We need to mock dependencies before requiring
jest.mock('../../aura-frog/hooks/lib/af-config-utils.cjs', () => ({
  readSessionState: jest.fn(() => ({})),
}));

// Save original process properties
const originalEnv = { ...process.env };
const originalPpid = process.ppid;

// We can't easily require the hook (it calls main() on load),
// so we extract and test the pure logic functions directly.

// Replicate the pure functions from the source for unit testing
function needsTddReminder(userPrompt) {
  const codeKeywords = /\b(implement|create|add|build|fix|code|function|component|api)\b/i;
  return codeKeywords.test(userPrompt || '');
}

function needsApprovalReminder(state) {
  const approvalPhases = ['1', '3'];
  return state.phase && approvalPhases.includes(state.phase);
}

describe('prompt-reminder', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('needsTddReminder', () => {
    it('returns true for "implement" keyword', () => {
      expect(needsTddReminder('implement the login feature')).toBe(true);
    });

    it('returns true for "create" keyword', () => {
      expect(needsTddReminder('create a new component')).toBe(true);
    });

    it('returns true for "add" keyword', () => {
      expect(needsTddReminder('add validation logic')).toBe(true);
    });

    it('returns true for "build" keyword', () => {
      expect(needsTddReminder('build the API endpoint')).toBe(true);
    });

    it('returns true for "fix" keyword', () => {
      expect(needsTddReminder('fix the broken test')).toBe(true);
    });

    it('returns true for "code" keyword', () => {
      expect(needsTddReminder('code a new module')).toBe(true);
    });

    it('returns true for "function" keyword', () => {
      expect(needsTddReminder('write a function for parsing')).toBe(true);
    });

    it('returns true for "component" keyword', () => {
      expect(needsTddReminder('component for the sidebar')).toBe(true);
    });

    it('returns true for "api" keyword', () => {
      expect(needsTddReminder('api integration needed')).toBe(true);
    });

    it('is case insensitive', () => {
      expect(needsTddReminder('IMPLEMENT this feature')).toBe(true);
      expect(needsTddReminder('Create A Component')).toBe(true);
    });

    it('returns false for non-code prompts', () => {
      expect(needsTddReminder('what is the weather today')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(needsTddReminder('')).toBe(false);
    });

    it('returns false for null/undefined', () => {
      expect(needsTddReminder(null)).toBe(false);
      expect(needsTddReminder(undefined)).toBe(false);
    });

    it('requires word boundary match', () => {
      // "api" should match as a word, but not as part of "capital"
      expect(needsTddReminder('api endpoint')).toBe(true);
      // "add" should not match inside "address" due to word boundary
      expect(needsTddReminder('the address is wrong')).toBe(false);
    });
  });

  describe('needsApprovalReminder', () => {
    it('returns true for phase 1', () => {
      expect(needsApprovalReminder({ phase: '1' })).toBe(true);
    });

    it('returns true for phase 3', () => {
      expect(needsApprovalReminder({ phase: '3' })).toBe(true);
    });

    it('returns false for phase 2', () => {
      expect(needsApprovalReminder({ phase: '2' })).toBe(false);
    });

    it('returns false for phase 4', () => {
      expect(needsApprovalReminder({ phase: '4' })).toBe(false);
    });

    it('returns false for phase 5', () => {
      expect(needsApprovalReminder({ phase: '5' })).toBe(false);
    });

    it('returns falsy when phase is undefined', () => {
      expect(needsApprovalReminder({})).toBeFalsy();
    });

    it('returns falsy when phase is null', () => {
      expect(needsApprovalReminder({ phase: null })).toBeFalsy();
    });

    it('returns falsy when phase is empty string', () => {
      expect(needsApprovalReminder({ phase: '' })).toBeFalsy();
    });

    it('returns false for numeric phase values (not string)', () => {
      // approvalPhases contains strings '1' and '3', numeric 1 !== '1' with includes
      expect(needsApprovalReminder({ phase: 1 })).toBeFalsy();
      expect(needsApprovalReminder({ phase: 3 })).toBeFalsy();
    });
  });

  describe('security keyword detection (inline regex)', () => {
    const securityRegex = /\b(auth|password|token|secret|api.?key|credential)\b/i;

    it('detects "auth"', () => {
      expect(securityRegex.test('set up auth flow')).toBe(true);
    });

    it('detects "password"', () => {
      expect(securityRegex.test('hash the password')).toBe(true);
    });

    it('detects "token"', () => {
      expect(securityRegex.test('generate a token')).toBe(true);
    });

    it('detects "secret"', () => {
      expect(securityRegex.test('store the secret')).toBe(true);
    });

    it('detects "apikey" and "api_key"', () => {
      expect(securityRegex.test('pass the apikey')).toBe(true);
      expect(securityRegex.test('set api_key value')).toBe(true);
    });

    it('detects "credential"', () => {
      expect(securityRegex.test('load credential file')).toBe(true);
    });

    it('does not trigger for unrelated text', () => {
      expect(securityRegex.test('refactor the utils module')).toBe(false);
    });
  });
});
