/**
 * Tests for the pure logic of two STORY-0010-adjacent hooks made importable by
 * FEAT-007 / issue #5: tdd-red-failure-tracker and post-execute-update-node.
 *
 * Both still read CLAUDE_TOOL_* env vars the hook API doesn't set — that stdin
 * migration is STORY-0010 and needs the exit-code probe. Making them importable
 * and testing the pure decision logic lets that migration land safely later.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const tdd = require('../../aura-frog/hooks/tdd-red-failure-tracker.cjs');
const { buildHistoryEvent } = require('../../aura-frog/hooks/post-execute-update-node.cjs');

describe('tdd-red-failure-tracker — isTestRunner', () => {
  it.each([
    'npm test', 'npx jest', 'pnpm vitest run', 'pytest -q', 'cargo test',
    'go test ./...', 'bundle exec rspec', 'phpunit', 'mocha spec/',
  ])('recognises %s', (cmd) => expect(tdd.isTestRunner(cmd)).toBe(true));

  it.each(['git status', 'ls -la', 'node build.js', 'echo hi', ''])(
    'ignores %s', (cmd) => expect(tdd.isTestRunner(cmd)).toBe(false));

  it('does not throw on null/undefined', () => {
    expect(() => tdd.isTestRunner(null)).not.toThrow();
    expect(tdd.isTestRunner(undefined)).toBe(false);
  });
});

describe('tdd-red-failure-tracker — buildDecisionEvent', () => {
  const base = { taskId: 'TASK-1', eventId: 'TR-1-001', cmd: 'npm test', ts: 'T' };

  it('a failing RED test is red_as_designed with no F2 hint', () => {
    const e = tdd.buildDecisionEvent({ ...base, exitCode: 1 });
    expect(e.type).toBe('decision');
    expect(e.payload.decision).toBe('red_as_designed');
    expect(e.payload.classifier_hint).toBeNull();
    expect(e.payload.phase).toBe('P2_RED');
  });

  it('a passing RED test is red_unexpectedly_green and flags F2', () => {
    const e = tdd.buildDecisionEvent({ ...base, exitCode: 0 });
    expect(e.payload.decision).toBe('red_unexpectedly_green');
    expect(e.payload.classifier_hint).toBe('F2_local_logic');
  });

  it('truncates the command match to 80 chars', () => {
    const e = tdd.buildDecisionEvent({ ...base, cmd: 'x'.repeat(200), exitCode: 1 });
    expect(e.payload.cmd_match).toHaveLength(80);
  });

  it('carries the passed id and exit code', () => {
    const e = tdd.buildDecisionEvent({ ...base, exitCode: 2 });
    expect(e.event_id).toBe('TR-1-001');
    expect(e.task_id).toBe('TASK-1');
    expect(e.payload.exit_code).toBe(2);
  });
});

describe('tdd-red-failure-tracker — nextEventId', () => {
  let dir;
  beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tdd-')); });
  afterEach(() => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ } });

  it('numbers from the current line count + 1, digits-only task id', () => {
    const tf = path.join(dir, 't.jsonl');
    expect(tdd.nextEventId(tf, 'TASK-7')).toBe('TR-7-001'); // fresh
    fs.writeFileSync(tf, '{}\n{}\n');
    expect(tdd.nextEventId(tf, 'TASK-7')).toBe('TR-7-003'); // 2 lines -> next is 003
  });
});

describe('post-execute-update-node — buildHistoryEvent', () => {
  const base = { taskId: 'TASK-1', toolName: 'Bash', ts: 'T' };

  it('a non-zero exit is execution_failed', () => {
    const e = buildHistoryEvent({ ...base, exitCode: 1 });
    expect(e.event).toBe('execution_failed');
    expect(e.exit_code).toBe(1);
    expect(e.node).toBe('TASK-1');
    expect(e.actor).toBe('post-execute-update-node');
  });

  it('a zero exit is execution_completed', () => {
    expect(buildHistoryEvent({ ...base, exitCode: 0 }).event).toBe('execution_completed');
  });

  it('records the tool name and timestamp', () => {
    const e = buildHistoryEvent({ ...base, toolName: 'Edit', exitCode: 0 });
    expect(e.tool).toBe('Edit');
    expect(e.ts).toBe('T');
  });
});
