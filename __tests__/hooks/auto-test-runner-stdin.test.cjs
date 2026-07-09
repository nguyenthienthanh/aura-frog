/**
 * FEAT-007 / STORY-0009+0010 — auto-test-runner reads the edited file from stdin.
 * main() read process.env.CLAUDE_FILE_PATHS (never set) → auto-test-running
 * never fired. Now resolves from tool_input; module is require-safe for tests.
 */

const { resolveFilePath, isTestRelevant } = require('../../aura-frog/hooks/auto-test-runner.cjs');

describe('auto-test-runner.resolveFilePath', () => {
  it('reads tool_input.file_path from stdin', () => {
    expect(resolveFilePath({ tool_input: { file_path: '/x.test.js' } })).toBe('/x.test.js');
  });
  it('reads tool_input.path', () => {
    expect(resolveFilePath({ tool_input: { path: '/y.spec.ts' } })).toBe('/y.spec.ts');
  });
  it('falls back to CLAUDE_FILE_PATHS env', () => {
    const prev = process.env.CLAUDE_FILE_PATHS;
    process.env.CLAUDE_FILE_PATHS = '/legacy.py';
    try { expect(resolveFilePath({})).toBe('/legacy.py'); }
    finally { if (prev === undefined) delete process.env.CLAUDE_FILE_PATHS; else process.env.CLAUDE_FILE_PATHS = prev; }
  });
  it('returns empty for no source', () => {
    const prev = process.env.CLAUDE_FILE_PATHS;
    delete process.env.CLAUDE_FILE_PATHS;
    try { expect(resolveFilePath({})).toBe(''); }
    finally { if (prev !== undefined) process.env.CLAUDE_FILE_PATHS = prev; }
  });
});

describe('auto-test-runner.isTestRelevant', () => {
  it('true for code extensions', () => {
    expect(isTestRelevant('a.ts')).toBe(true);
    expect(isTestRelevant('b.py')).toBe(true);
  });
  it('false for non-code', () => {
    expect(isTestRelevant('README.md')).toBe(false);
  });
});
