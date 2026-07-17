/**
 * Tests for the pure history-scan logic of two trigger hooks made importable by
 * FEAT-007 / issue #5: feature-done-trigger-archive and session-reset-trigger.
 */

const { shouldTriggerArchive } = require('../../aura-frog/hooks/feature-done-trigger-archive.cjs');
const { findPromptableSummarize } = require('../../aura-frog/hooks/session-reset-trigger.cjs');

const jl = (events) => events.map((e) => JSON.stringify(e));

describe('feature-done-trigger-archive — shouldTriggerArchive', () => {
  it('triggers when the feature\'s latest transition is to done and it is un-summarized', () => {
    const h = jl([
      { node: 'FEAT-A', event: 'status_transition', to: 'in_progress' },
      { node: 'FEAT-A', event: 'status_transition', to: 'done' },
    ]);
    expect(shouldTriggerArchive(h, 'FEAT-A')).toBe(true);
  });

  it('does not trigger when the feature was already epic-summarized', () => {
    const h = jl([
      { node: 'FEAT-A', event: 'status_transition', to: 'done' },
      { node: 'FEAT-A', event: 'epic_summarized' },
    ]);
    expect(shouldTriggerArchive(h, 'FEAT-A')).toBe(false);
  });

  it('does not trigger when the latest transition is not done', () => {
    const h = jl([
      { node: 'FEAT-A', event: 'status_transition', to: 'done' },
      { node: 'FEAT-A', event: 'status_transition', to: 'in_progress' },
    ]);
    expect(shouldTriggerArchive(h, 'FEAT-A')).toBe(false);
  });

  it('ignores events for other features', () => {
    const h = jl([
      { node: 'FEAT-A', event: 'status_transition', to: 'done' },
      { node: 'FEAT-B', event: 'status_transition', to: 'in_progress' },
      { node: 'FEAT-B', event: 'epic_summarized' },
    ]);
    expect(shouldTriggerArchive(h, 'FEAT-A')).toBe(true);
  });

  it('is false when the feature never appears', () => {
    expect(shouldTriggerArchive(jl([{ node: 'X', event: 'status_transition', to: 'done' }]), 'FEAT-A'))
      .toBe(false);
  });

  it('skips malformed lines without throwing', () => {
    const h = ['{bad json', JSON.stringify({ node: 'FEAT-A', event: 'status_transition', to: 'done' })];
    expect(shouldTriggerArchive(h, 'FEAT-A')).toBe(true);
  });

  it('is false for empty history', () => {
    expect(shouldTriggerArchive([], 'FEAT-A')).toBe(false);
  });
});

describe('session-reset-trigger — findPromptableSummarize', () => {
  const NOW = 1_700_000_000_000;
  const WINDOW = 60 * 1000;
  const at = (msAgo) => new Date(NOW - msAgo).toISOString();

  it('returns a recent epic_summarized event', () => {
    const h = jl([{ event: 'epic_summarized', feature: 'FEAT-A', ts: at(1000) }]);
    expect(findPromptableSummarize(h, NOW, WINDOW)).toMatchObject({ feature: 'FEAT-A' });
  });

  it('is null when the summarize is older than the window', () => {
    const h = jl([{ event: 'epic_summarized', feature: 'FEAT-A', ts: at(WINDOW + 1) }]);
    expect(findPromptableSummarize(h, NOW, WINDOW)).toBeNull();
  });

  it('is null when a session_reset came after the summarize (seen first, newest-first)', () => {
    const h = jl([
      { event: 'epic_summarized', feature: 'FEAT-A', ts: at(2000) },
      { event: 'session_reset' },
    ]);
    expect(findPromptableSummarize(h, NOW, WINDOW)).toBeNull();
  });

  it('is null when there is no summarize at all', () => {
    expect(findPromptableSummarize(jl([{ event: 'status_transition', to: 'done' }]), NOW, WINDOW))
      .toBeNull();
  });

  it('is null on an unparseable summarize timestamp', () => {
    const h = jl([{ event: 'epic_summarized', feature: 'FEAT-A', ts: 'not-a-date' }]);
    expect(findPromptableSummarize(h, NOW, WINDOW)).toBeNull();
  });

  it('skips malformed lines without throwing', () => {
    const h = ['{bad', JSON.stringify({ event: 'epic_summarized', feature: 'FEAT-A', ts: at(1000) })];
    expect(findPromptableSummarize(h, NOW, WINDOW)).toMatchObject({ feature: 'FEAT-A' });
  });
});
