/**
 * Tests for aura-frog/hooks/session-start.cjs — session cache staleness rules.
 *
 * cacheStaleReason is pure (every environment fact is an argument), so these run
 * without touching the real .claude/cache or the working tree's git state.
 *
 * The branch_switched cases are the regression guard that shipped fix `fcd1934`
 * (FEAT-007/STORY-0029, "invalidate session cache on git branch switch") never
 * had — session-start.cjs used to run main() on require, so none of its logic
 * was reachable from a test.
 */

const { cacheStaleReason } = require('../../aura-frog/hooks/session-start.cjs');

const TTL = 60 * 60 * 1000; // 1 hour, mirrors SESSION_CACHE_TTL
const NOW = 1_700_000_000_000;

const env = (over = {}) => ({
  now: NOW,
  ttl: TTL,
  envrcMtime: null,
  currentBranch: 'main',
  ...over,
});

const cacheOn = (branch, over = {}) => ({
  cachedAt: NOW - 1000,
  envVars: branch === undefined ? {} : { AF_GIT_BRANCH: branch },
  ...over,
});

describe('session-start — cacheStaleReason', () => {
  it('reports missing for a null cache', () => {
    expect(cacheStaleReason(null, env())).toBe('missing');
  });

  it('accepts a fresh cache on the same branch', () => {
    expect(cacheStaleReason(cacheOn('main'), env())).toBeNull();
  });

  describe('TTL', () => {
    it('expires a cache older than the TTL', () => {
      const stale = cacheOn('main', { cachedAt: NOW - TTL - 1 });
      expect(cacheStaleReason(stale, env())).toBe('ttl_expired');
    });
    it('keeps a cache exactly at the TTL boundary', () => {
      const edge = cacheOn('main', { cachedAt: NOW - TTL });
      expect(cacheStaleReason(edge, env())).toBeNull();
    });
    it('treats a cache with no cachedAt as expired', () => {
      expect(cacheStaleReason({ envVars: {} }, env())).toBe('ttl_expired');
    });
  });

  describe('.envrc', () => {
    it('invalidates when .envrc changed after the cache was written', () => {
      expect(cacheStaleReason(cacheOn('main'), env({ envrcMtime: NOW })))
        .toBe('envrc_changed');
    });
    it('ignores an .envrc older than the cache', () => {
      expect(cacheStaleReason(cacheOn('main'), env({ envrcMtime: NOW - 50_000 })))
        .toBeNull();
    });
    it('ignores a missing .envrc', () => {
      expect(cacheStaleReason(cacheOn('main'), env({ envrcMtime: null }))).toBeNull();
    });
  });

  // Regression guard for fcd1934 — without this the fast path replays a stale
  // AF_GIT_BRANCH for up to an hour after `git checkout`.
  describe('git branch switch (fcd1934)', () => {
    it('invalidates when the branch changed since caching', () => {
      expect(cacheStaleReason(cacheOn('main'), env({ currentBranch: 'feature/x' })))
        .toBe('branch_switched');
    });
    it('keeps the cache when the branch is unchanged', () => {
      expect(cacheStaleReason(cacheOn('feature/x'), env({ currentBranch: 'feature/x' })))
        .toBeNull();
    });

    // Safe-by-construction: it may only ever invalidate, never assert a wrong
    // branch. An undetectable branch must fall back to TTL-only behaviour.
    it('falls through when the current branch cannot be detected', () => {
      expect(cacheStaleReason(cacheOn('main'), env({ currentBranch: '' }))).toBeNull();
    });
    it('skips the check when the cache recorded no branch', () => {
      expect(cacheStaleReason(cacheOn(undefined), env({ currentBranch: 'main' })))
        .toBeNull();
    });
    it('skips the check when the cache has no envVars at all', () => {
      expect(cacheStaleReason({ cachedAt: NOW - 1000 }, env())).toBeNull();
    });
  });

  describe('precedence', () => {
    it('reports ttl_expired before branch_switched', () => {
      const old = cacheOn('main', { cachedAt: NOW - TTL - 1 });
      expect(cacheStaleReason(old, env({ currentBranch: 'other' }))).toBe('ttl_expired');
    });
    it('reports envrc_changed before branch_switched', () => {
      expect(cacheStaleReason(cacheOn('main'), env({ envrcMtime: NOW, currentBranch: 'other' })))
        .toBe('envrc_changed');
    });
  });
});
