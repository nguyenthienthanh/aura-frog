/**
 * Tests for the pure logic of post-compact and pre-execute-load-plan-context,
 * made importable by FEAT-007 / issue #5.
 */

const { validateStateFile, collectWarnings, STATE_PATHS } =
  require('../../aura-frog/hooks/post-compact.cjs');
const { composeContextLines } =
  require('../../aura-frog/hooks/pre-execute-load-plan-context.cjs');

describe('post-compact — validateStateFile', () => {
  it('flags a workflow-state file missing phase and agent', () => {
    const w = validateStateFile('.claude/cache/workflow-state.json', {});
    expect(w).toEqual([
      '.claude/cache/workflow-state.json: missing phase',
      '.claude/cache/workflow-state.json: missing agent',
    ]);
  });

  it('passes a complete workflow-state file', () => {
    expect(validateStateFile('.claude/cache/workflow-state.json', { phase: '2', agent: 'frontend' }))
      .toEqual([]);
  });

  it('flags a compact-handoff with neither summary nor decisions', () => {
    const w = validateStateFile('.claude/cache/compact-handoff.json', {});
    expect(w).toHaveLength(1);
    expect(w[0]).toContain('missing summary and decisions');
  });

  it('passes a compact-handoff that has either summary or decisions', () => {
    expect(validateStateFile('compact-handoff.json', { summary: 'x' })).toEqual([]);
    expect(validateStateFile('compact-handoff.json', { decisions: ['y'] })).toEqual([]);
  });

  it('says nothing about an unrelated path', () => {
    expect(validateStateFile('some/other.json', {})).toEqual([]);
  });

  it('exposes the two state paths it checks', () => {
    expect(STATE_PATHS).toContain('.claude/cache/workflow-state.json');
    expect(STATE_PATHS).toContain('.claude/cache/compact-handoff.json');
  });

  it('collectWarnings returns an array without throwing for missing files', () => {
    expect(Array.isArray(collectWarnings(['does/not/exist.json']))).toBe(true);
  });
});

describe('pre-execute-load-plan-context — composeContextLines', () => {
  it('renders every active field in display order', () => {
    const lines = composeContextLines({
      active: { mission: 'M', initiative: 'I', feature: 'F', story: 'S', task: 'T' },
      context_anchors: { current_phase: 'P2_RED' },
    });
    expect(lines).toEqual([
      'Mission: M', 'Initiative: I', 'Feature: F', 'Story: S', 'Task: T', 'Phase: P2_RED',
    ]);
  });

  it('omits fields that are absent', () => {
    expect(composeContextLines({ active: { task: 'T' } })).toEqual(['Task: T']);
  });

  it('summarises frozen and ready queues by count', () => {
    const lines = composeContextLines({
      active: {},
      frozen: ['a', 'b'],
      ready_queue: ['x', 'y', 'z'],
    });
    expect(lines).toContain('Frozen: 2 node(s) — see /aura-frog:plan-conflicts');
    expect(lines).toContain('Ready: 3 task(s) queued');
  });

  it('ignores empty frozen/ready arrays', () => {
    expect(composeContextLines({ active: {}, frozen: [], ready_queue: [] })).toEqual([]);
  });

  it('is empty for an empty or malformed active object', () => {
    expect(composeContextLines({})).toEqual([]);
    expect(composeContextLines(null)).toEqual([]);
    expect(composeContextLines({ active: null })).toEqual([]);
  });
});

const { composeBanner } = require('../../aura-frog/hooks/session-start-restore-active.cjs');

describe('session-start-restore-active — composeBanner', () => {
  it('shows a feature with its story and task', () => {
    expect(composeBanner({ active: { feature: 'FEAT-A', story: 'S1', task: 'T1' } }))
      .toEqual(['🐸 Active plan: FEAT-A', 'Story: S1', 'Task: T1']);
  });

  it('prefers feature over initiative and mission', () => {
    expect(composeBanner({ active: { feature: 'F', initiative: 'I', mission: 'M' } }))
      .toEqual(['🐸 Active plan: F']);
  });

  it('falls back to initiative when there is no feature', () => {
    expect(composeBanner({ active: { initiative: 'INIT-1', mission: 'M' } }))
      .toEqual(['🐸 Active plan: INIT-1']);
  });

  it('falls back to mission when there is neither feature nor initiative', () => {
    expect(composeBanner({ active: { mission: 'Ship it' } })).toEqual(['🐸 Active mission: Ship it']);
  });

  it('is empty for no active anchor or a malformed object', () => {
    expect(composeBanner({ active: {} })).toEqual([]);
    expect(composeBanner({})).toEqual([]);
    expect(composeBanner(null)).toEqual([]);
  });
});
