/**
 * FEAT-007 / STORY-0009 — pre-flight-validate reads tool context from stdin.
 * It read process.env.CLAUDE_TOOL_NAME (never set) and exited before running →
 * the BLOCKING pre-flight safety gate validated nothing. Now reads stdin and
 * bridges the tool context to the env vars run-all.sh consumes.
 */

const { buildChildEnv } = require('../../aura-frog/hooks/pre-flight-validate.cjs');

describe('pre-flight-validate.buildChildEnv', () => {
  it('bridges a Write tool_input to the env run-all.sh reads', () => {
    const env = buildChildEnv({ tool_name: 'Write', tool_input: { file_path: '/a.js', content: 'x' } }, { PATH: '/bin' });
    expect(env.CLAUDE_TOOL_NAME).toBe('Write');
    expect(env.CLAUDE_FILE_PATHS).toBe('/a.js');
    expect(JSON.parse(env.CLAUDE_TOOL_INPUT)).toEqual({ file_path: '/a.js', content: 'x' });
    expect(env.PATH).toBe('/bin'); // base env preserved
  });

  it('bridges a Bash command', () => {
    const env = buildChildEnv({ tool_name: 'Bash', tool_input: { command: 'rm -rf /' } }, {});
    expect(env.CLAUDE_TOOL_NAME).toBe('Bash');
    expect(env.CLAUDE_TOOL_COMMAND).toBe('rm -rf /');
  });

  it('leaves the base env untouched when there is no tool context', () => {
    const env = buildChildEnv({}, { HOME: '/h' });
    expect(env.HOME).toBe('/h');
    expect(env.CLAUDE_TOOL_NAME).toBeUndefined();
    expect(env.CLAUDE_TOOL_INPUT).toBeUndefined();
  });

  it('is null-safe', () => {
    expect(buildChildEnv(null, { X: '1' })).toEqual({ X: '1' });
  });
});
