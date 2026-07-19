'use strict';

/**
 * post-execute-conflict-rescan.cjs — FEAT-007 / issue #5.
 * The whole rescan used to run at module scope with process.exit() on require;
 * it is now importable with the decision logic extracted as pure functions.
 * These cover the recent-done scan, the conflict fold, the blocker/frozen-pair
 * selection, the recommendation mapping, and the advisory event shape.
 */

const {
  collectRecentDoneTasks,
  foldLatestConflicts,
  findRescanPair,
  recommendationFor,
  buildRescanEvent,
} = require('../../aura-frog/hooks/post-execute-conflict-rescan.cjs');

const NOW = 1_000_000_000_000; // fixed clock; tests pass now explicitly (no Date.now)
const iso = (ms) => new Date(ms).toISOString();

describe('collectRecentDoneTasks', () => {
  it('collects execution_completed(exit 0) nodes within the window', () => {
    const lines = [
      JSON.stringify({ ts: iso(NOW - 5000), event: 'execution_completed', exit_code: 0, node: 'T1' }),
      JSON.stringify({ ts: iso(NOW - 2000), event: 'execution_completed', exit_code: 0, node: 'T2' }),
    ];
    const done = collectRecentDoneTasks(lines, { now: NOW, windowMs: 60000 });
    expect([...done].sort()).toEqual(['T1', 'T2']);
  });

  it('ignores non-zero exits and non-completed events', () => {
    const lines = [
      JSON.stringify({ ts: iso(NOW - 1000), event: 'execution_failed', exit_code: 1, node: 'T1' }),
      JSON.stringify({ ts: iso(NOW - 1000), event: 'execution_completed', exit_code: 2, node: 'T2' }),
      JSON.stringify({ ts: iso(NOW - 1000), event: 'conflict_detected', node: 'T3' }),
    ];
    expect(collectRecentDoneTasks(lines, { now: NOW, windowMs: 60000 }).size).toBe(0);
  });

  it('stops scanning at the first event older than the window (newest-last order)', () => {
    const lines = [
      JSON.stringify({ ts: iso(NOW - 90_000), event: 'execution_completed', exit_code: 0, node: 'OLD' }),
      JSON.stringify({ ts: iso(NOW - 1000), event: 'execution_completed', exit_code: 0, node: 'NEW' }),
    ];
    const done = collectRecentDoneTasks(lines, { now: NOW, windowMs: 60000 });
    expect(done.has('NEW')).toBe(true);
    expect(done.has('OLD')).toBe(false);
  });

  it('skips unparseable lines (continue) but stops at a timestamp-less event (break)', () => {
    // Scan is newest-first (end → start). T1 is newest → processed and collected
    // first; the no-ts event (NaN timestamp) then breaks the scan; the leading
    // 'not json' line is never reached. So T1 is present and OLDER is not.
    const lines = [
      JSON.stringify({ ts: iso(NOW - 2000), event: 'execution_completed', exit_code: 0, node: 'OLDER' }),
      JSON.stringify({ event: 'execution_completed', exit_code: 0, node: 'NO_TS' }), // no ts → break
      JSON.stringify({ ts: iso(NOW - 1000), event: 'execution_completed', exit_code: 0, node: 'T1' }),
    ];
    const done = collectRecentDoneTasks(lines, { now: NOW, windowMs: 60000 });
    expect([...done]).toEqual(['T1']);
  });

  it('skips a single unparseable line and keeps scanning (continue, not break)', () => {
    const lines = [
      JSON.stringify({ ts: iso(NOW - 2000), event: 'execution_completed', exit_code: 0, node: 'T1' }),
      'not json',
      JSON.stringify({ ts: iso(NOW - 1000), event: 'execution_completed', exit_code: 0, node: 'T2' }),
    ];
    // T2 collected, 'not json' skipped (continue), T1 still collected.
    expect([...collectRecentDoneTasks(lines, { now: NOW, windowMs: 60000 })].sort()).toEqual(['T1', 'T2']);
  });
});

describe('foldLatestConflicts', () => {
  it('keeps the latest record per conflict_id', () => {
    const lines = [
      JSON.stringify({ conflict_id: 'C1', resolution: null }),
      JSON.stringify({ conflict_id: 'C1', resolution: 'auto_thaw' }),
      JSON.stringify({ conflict_id: 'C2', resolution: null }),
    ];
    const m = foldLatestConflicts(lines);
    expect(m.size).toBe(2);
    expect(m.get('C1').resolution).toBe('auto_thaw');
  });

  it('skips malformed lines and records without a conflict_id', () => {
    const lines = ['{bad', JSON.stringify({ resolution: null }), JSON.stringify({ conflict_id: 'C9' })];
    const m = foldLatestConflicts(lines);
    expect([...m.keys()]).toEqual(['C9']);
  });
});

describe('findRescanPair', () => {
  const done = new Set(['T1']);
  const conflict = {
    conflict_id: 'C1',
    resolution: null,
    participants: [
      { task: 'T1', role: 'active' },
      { task: 'T2', role: 'pending-confirm' },
    ],
  };

  it('returns the just-done blocker and its frozen pending-confirm sibling', () => {
    expect(findRescanPair(conflict, done)).toEqual({
      blocker: { task: 'T1', role: 'active' },
      frozen: { task: 'T2', role: 'pending-confirm' },
    });
  });

  it('returns null when the conflict is already resolved', () => {
    expect(findRescanPair({ ...conflict, resolution: 'auto_thaw' }, done)).toBeNull();
  });

  it('returns null when no participant just finished', () => {
    expect(findRescanPair(conflict, new Set(['T9']))).toBeNull();
  });

  it('returns null when the sibling is not pending-confirm (not frozen)', () => {
    const c = { ...conflict, participants: [
      { task: 'T1', role: 'active' },
      { task: 'T2', role: 'active' },
    ] };
    expect(findRescanPair(c, done)).toBeNull();
  });

  it('is null-safe on missing participants / conflict', () => {
    expect(findRescanPair({ conflict_id: 'C', resolution: null }, done)).toBeNull();
    expect(findRescanPair(null, done)).toBeNull();
  });
});

describe('recommendationFor', () => {
  it('maps the three compatibility verdicts', () => {
    expect(recommendationFor(true)).toBe('auto_thaw');
    expect(recommendationFor(false)).toBe('auto_discard');
    expect(recommendationFor(null)).toMatch(/^inconclusive/);
    expect(recommendationFor(undefined)).toMatch(/^inconclusive/);
  });
});

describe('buildRescanEvent', () => {
  it('builds the advisory event with the actor stamp', () => {
    const ts = iso(NOW);
    expect(buildRescanEvent({ conflictId: 'C1', blocker: 'T1', frozen: 'T2', recommendation: 'auto_thaw', ts }))
      .toEqual({
        ts,
        conflict_id: 'C1',
        event: 'conflict_rescan_recommendation',
        blocker: 'T1',
        frozen: 'T2',
        recommendation: 'auto_thaw',
        actor: 'post-execute-conflict-rescan',
      });
  });
});
