/**
 * Tests for aura-frog/hooks/phase-checkpoint.cjs
 *
 * createCheckpoint and writeCache are NOT exported and must never be called from
 * a test: createCheckpoint runs `git add -A` + `git commit` against the real
 * working tree, and writeCache writes the real .claude/cache.
 *
 * What is left is read-only, so these assert the "best-effort, never block"
 * contract rather than machine-specific values.
 */

const path = require('path');

const {
  getWorkflowState,
  hasUncommittedChanges,
  getCacheFile,
  readCache,
} = require('../../aura-frog/hooks/phase-checkpoint.cjs');

describe('phase-checkpoint', () => {
  it('does not export the repo-mutating helpers', () => {
    const api = require('../../aura-frog/hooks/phase-checkpoint.cjs');
    expect(api.createCheckpoint).toBeUndefined();
    expect(api.writeCache).toBeUndefined();
  });

  describe('getCacheFile', () => {
    it('is an absolute path to the project-scoped cache file', () => {
      const p = getCacheFile();
      expect(path.isAbsolute(p)).toBe(true);
      expect(path.basename(p)).toBe('af-phase-checkpoint-cache.json');
    });
    it('lives under .claude/cache', () => {
      expect(getCacheFile().replace(/\\/g, '/')).toContain('.claude/cache');
    });
    it('is stable across calls', () => {
      expect(getCacheFile()).toBe(getCacheFile());
    });
  });

  describe('getWorkflowState', () => {
    it('returns an object and never throws when no session state exists', () => {
      let out;
      expect(() => { out = getWorkflowState(); }).not.toThrow();
      expect(typeof out).toBe('object');
      expect(out).not.toBeNull();
    });
  });

  describe('hasUncommittedChanges', () => {
    // Read-only `git status --porcelain`; the value depends on the tree, the
    // contract is that it always answers with a boolean and never throws.
    it('returns a boolean and never throws', () => {
      let out;
      expect(() => { out = hasUncommittedChanges(); }).not.toThrow();
      expect(typeof out).toBe('boolean');
    });
  });

  describe('readCache', () => {
    it('returns an object and never throws', () => {
      let out;
      expect(() => { out = readCache(); }).not.toThrow();
      expect(typeof out).toBe('object');
      expect(out).not.toBeNull();
    });
  });
});
