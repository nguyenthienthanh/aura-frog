/**
 * Tests for aura-frog/hooks/compact-handoff.cjs
 *
 * Covers generateResumeContext (pure) and loadHandoff (read-only).
 *
 * saveHandoff and generateCompactContext are deliberately NOT called: CACHE_DIR /
 * HANDOFF_FILE are resolved from the real project root at module load and cannot
 * be redirected, so invoking either writes into the working repo's .claude/cache
 * (generateCompactContext also shells out to `git status`). Despite the name it
 * is not a pure builder — it writes compact-context.md and returns a boolean.
 */

const {
  loadHandoff,
  generateResumeContext,
} = require('../../aura-frog/hooks/compact-handoff.cjs');

const HANDOFF = {
  workflow: {
    workflow_id: 'AUTH-123',
    current_phase: 2,
    current_sub_phase: 'b',
    task: { description: 'Implement JWT login' },
    agents: { primary: 'frontend' },
  },
  context: { project_name: 'my-api', framework: 'nextjs', branch: 'feature/auth' },
};

describe('compact-handoff', () => {
  describe('generateResumeContext', () => {
    it('renders the workflow id, task, phase and agent', () => {
      const out = generateResumeContext(HANDOFF);
      expect(out).toContain('AUTH-123');
      expect(out).toContain('Implement JWT login');
      expect(out).toContain('2b');
      expect(out).toContain('frontend');
    });

    it('renders the project context', () => {
      const out = generateResumeContext(HANDOFF);
      expect(out).toContain('my-api');
      expect(out).toContain('nextjs');
    });

    it('falls back when the task description is missing', () => {
      const out = generateResumeContext({ workflow: { workflow_id: 'X', current_phase: 1 } });
      expect(out).toContain('In progress');
    });

    it('falls back to general-purpose when no agent is named', () => {
      const out = generateResumeContext({ workflow: { workflow_id: 'X', current_phase: 1 } });
      expect(out).toContain('general-purpose');
    });

    it('returns a string and does not throw on an empty handoff', () => {
      expect(() => generateResumeContext({})).not.toThrow();
      expect(typeof generateResumeContext({})).toBe('string');
    });
  });

  describe('loadHandoff', () => {
    // Read-only: returns the stored handoff, or null when absent/stale.
    it('returns null or an object without throwing', () => {
      let out;
      expect(() => { out = loadHandoff(); }).not.toThrow();
      expect(out === null || typeof out === 'object').toBe(true);
    });
  });
});
