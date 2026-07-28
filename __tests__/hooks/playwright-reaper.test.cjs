'use strict';

/**
 * playwright-reaper.cjs — SessionStart janitor that kills ORPHANED playwright
 * processes (a headless Chrome whose MCP server died, reparented to launchd).
 *
 * The safety contract is the whole point: reap only when a process is BOTH
 * orphaned (ppid === 1) AND playwright-launched. A live session's browser
 * (ppid !== 1) and the user's ordinary Chrome (default profile) must survive.
 */

const { parsePsLines, selectOrphans, PLAYWRIGHT_PATTERN } = require('../../aura-frog/hooks/playwright-reaper.cjs');

// A real orphaned playwright Chrome argv (trimmed) — the exact shape the reaper targets.
const PW_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless '
  + '--user-data-dir=/var/folders/9c/T/playwright_chromiumdev_profile-ykjWIP --remote-debugging-pipe';
const PW_SERVER = 'node /Users/x/.npm/_npx/abc/node_modules/.bin/playwright-mcp';
// A user's ordinary Chrome — MUST never match (default profile, no playwright dir).
const USER_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

describe('parsePsLines', () => {
  it('parses pid/ppid/command rows and drops non-matching lines', () => {
    const out = [
      '  PID  PPID COMMAND',        // header → dropped
      ' 21217     1 ' + PW_CHROME,
      ' 27669 27638 ' + PW_SERVER,
      'garbage line',               // dropped
    ].join('\n');
    const recs = parsePsLines(out);
    expect(recs).toHaveLength(2);
    expect(recs[0]).toMatchObject({ pid: 21217, ppid: 1 });
    expect(recs[1]).toMatchObject({ pid: 27669, ppid: 27638 });
    expect(recs[0].command).toContain('playwright_chromiumdev_profile');
  });

  it('is null-safe / empty-safe', () => {
    expect(parsePsLines('')).toEqual([]);
    expect(parsePsLines(null)).toEqual([]);
  });
});

describe('selectOrphans', () => {
  it('reaps an orphaned (ppid 1) playwright Chrome', () => {
    const procs = [{ pid: 21217, ppid: 1, command: PW_CHROME }];
    expect(selectOrphans(procs)).toEqual([21217]);
  });

  it('reaps an orphaned playwright-mcp server', () => {
    expect(selectOrphans([{ pid: 999, ppid: 1, command: PW_SERVER }])).toEqual([999]);
  });

  it('NEVER reaps a playwright browser with a live parent (ppid !== 1)', () => {
    const procs = [{ pid: 500, ppid: 27638, command: PW_CHROME }];
    expect(selectOrphans(procs)).toEqual([]);
  });

  it("NEVER reaps the user's ordinary Chrome, even when orphaned", () => {
    const procs = [{ pid: 700, ppid: 1, command: USER_CHROME }];
    expect(selectOrphans(procs)).toEqual([]);
  });

  it('excludes the reaper process itself', () => {
    const procs = [{ pid: 42, ppid: 1, command: PW_SERVER }];
    expect(selectOrphans(procs, { selfPid: 42 })).toEqual([]);
  });

  it('picks only the qualifying pids from a mixed table', () => {
    const procs = [
      { pid: 1, ppid: 0, command: '/sbin/launchd' },
      { pid: 21217, ppid: 1, command: PW_CHROME },       // reap
      { pid: 500, ppid: 27638, command: PW_CHROME },     // live parent → keep
      { pid: 700, ppid: 1, command: USER_CHROME },       // user chrome → keep
      { pid: 999, ppid: 1, command: PW_SERVER },         // reap
    ];
    expect(selectOrphans(procs).sort((a, b) => a - b)).toEqual([999, 21217].sort((a, b) => a - b));
  });

  it('is null-safe', () => {
    expect(selectOrphans(null)).toEqual([]);
    expect(selectOrphans([{ pid: 1, ppid: 1, command: null }])).toEqual([]);
  });
});

describe('PLAYWRIGHT_PATTERN', () => {
  it('matches playwright temp profile, ms-playwright, and the mcp server; not plain Chrome', () => {
    expect(PLAYWRIGHT_PATTERN.test(PW_CHROME)).toBe(true);
    expect(PLAYWRIGHT_PATTERN.test('/x/ms-playwright/chromium-1234/chrome')).toBe(true);
    expect(PLAYWRIGHT_PATTERN.test('npm exec @playwright/mcp@latest')).toBe(true);
    expect(PLAYWRIGHT_PATTERN.test(USER_CHROME)).toBe(false);
  });
});
