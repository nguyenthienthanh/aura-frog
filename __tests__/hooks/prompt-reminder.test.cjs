/**
 * Tests for aura-frog/hooks/prompt-reminder.cjs
 * Pure-function tests via require()-from-source (no re-declaration).
 */

jest.mock('../../aura-frog/hooks/lib/af-config-utils.cjs', () => ({
  readSessionState: jest.fn(() => ({})),
}));

const {
  needsTddReminder,
  needsApprovalReminder,
} = require('../../aura-frog/hooks/prompt-reminder.cjs');

describe('prompt-reminder', () => {
  describe('needsTddReminder', () => {
    ['implement user login', 'create component', 'add validation', 'build dashboard',
     'fix the bug', 'write a function', 'refactor component', 'design api'].forEach(p => {
      it(`triggers on "${p}"`, () => expect(needsTddReminder(p)).toBe(true));
    });

    it('is case-insensitive', () => {
      expect(needsTddReminder('IMPLEMENT login')).toBe(true);
      expect(needsTddReminder('Build something')).toBe(true);
    });

    it('does NOT trigger without code keywords', () => {
      expect(needsTddReminder('what time is it')).toBe(false);
      expect(needsTddReminder('explain the design pattern')).toBe(false);
    });

    it('handles empty/null input safely', () => {
      expect(needsTddReminder('')).toBe(false);
      expect(needsTddReminder(undefined)).toBe(false);
      expect(needsTddReminder(null)).toBe(false);
    });
  });

  describe('needsApprovalReminder', () => {
    it('triggers on phase 1', () => expect(needsApprovalReminder({ phase: '1' })).toBe(true));
    it('triggers on phase 3', () => expect(needsApprovalReminder({ phase: '3' })).toBe(true));
    it('does NOT trigger on phase 2', () => expect(needsApprovalReminder({ phase: '2' })).toBe(false));
    it('does NOT trigger on phase 4', () => expect(needsApprovalReminder({ phase: '4' })).toBe(false));
    it('does NOT trigger on phase 5', () => expect(needsApprovalReminder({ phase: '5' })).toBe(false));
    it('does NOT trigger when phase missing', () => expect(needsApprovalReminder({})).toBeFalsy());
  });
});
