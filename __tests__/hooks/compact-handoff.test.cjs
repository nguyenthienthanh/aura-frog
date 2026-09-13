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

  describe('shouldSaveOnStop', () => {
    const { shouldSaveOnStop } = require('../../aura-frog/hooks/compact-handoff.cjs');

    it('saves at or above the threshold', () => {
      expect(shouldSaveOnStop({ usage: 70, threshold: 70 })).toBe(true);
      expect(shouldSaveOnStop({ usage: 69.9, threshold: 70, hasOpenWork: true })).toBe(false);
    });

    it('falls back to open work when usage is unknown', () => {
      expect(shouldSaveOnStop({ usage: null, hasOpenWork: true })).toBe(true);
      expect(shouldSaveOnStop({ usage: null, hasOpenWork: false })).toBe(false);
    });
  });

  describe('run-state based save → resume (tmp project root)', () => {
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const { spawnSync } = require('child_process');
    const HOOK = path.join(__dirname, '..', '..', 'aura-frog', 'hooks', 'compact-handoff.cjs');

    let root;
    let savedEnv;

    function writeRun(id, status, extra = {}) {
      const dir = path.join(root, '.claude', 'logs', 'runs', id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'run-state.json'), JSON.stringify({
        run_id: id, status, task: `task ${id}`, current_phase: 3, active_agent: 'tester', ...extra,
      }));
    }

    function writeTranscript(entries) {
      const file = path.join(root, 'transcript.jsonl');
      fs.writeFileSync(file, entries.map((e) => JSON.stringify(e)).join('\n'));
      return file;
    }

    function run(args, input, env = {}) {
      return spawnSync('node', [HOOK, ...args], {
        input: JSON.stringify(input),
        encoding: 'utf8',
        env: { ...process.env, AF_PROJECT_ROOT: root, ...env },
      });
    }

    beforeEach(() => {
      root = fs.mkdtempSync(path.join(os.tmpdir(), 'af-handoff-'));
      savedEnv = { ...process.env };
      process.env.AF_PROJECT_ROOT = root;
      for (const k of ['AF_WORKFLOW_ID', 'AF_CURRENT_PHASE', 'PROJECT_NAME', 'AF_PROJECT_NAME']) delete process.env[k];
    });

    afterEach(() => {
      process.env = savedEnv;
      fs.rmSync(root, { recursive: true, force: true });
    });

    it('findActiveRun ignores completed runs', () => {
      const { findActiveRun } = require('../../aura-frog/hooks/compact-handoff.cjs');
      writeRun('done-run', 'completed');
      expect(findActiveRun()).toBeNull();
      writeRun('live-run', 'in_progress', { next_action: 'write RED tests' });
      const r = findActiveRun();
      expect(r.run_id).toBe('live-run');
      expect(r.next_action).toBe('write RED tests');
      expect(r.state_file).toBe(path.join('.claude', 'logs', 'runs', 'live-run', 'run-state.json'));
    });

    it('recentUserPrompts keeps real prompts and skips tool results + injected tags', () => {
      const { recentUserPrompts } = require('../../aura-frog/hooks/compact-handoff.cjs');
      const file = writeTranscript([
        { type: 'user', message: { content: 'first ask' } },
        { type: 'assistant', message: { content: [{ type: 'text', text: 'ok' }] } },
        { type: 'user', message: { content: [{ type: 'tool_result', content: 'x' }] } },
        { type: 'user', message: { content: '<command-name>/model</command-name>' } },
        { type: 'user', message: { content: [{ type: 'text', text: 'second ask' }] } },
      ]);
      expect(recentUserPrompts(file)).toEqual(['first ask', 'second ask']);
      expect(recentUserPrompts(path.join(root, 'missing.jsonl'))).toEqual([]);
    });

    it('PreCompact saves, SessionStart(compact) injects additionalContext and consumes the handoff', () => {
      writeRun('fix-0913', 'in_progress');
      const transcript = writeTranscript([{ type: 'user', message: { content: 'fix the resume' } }]);

      expect(run(['--pre-compact'], { trigger: 'auto', transcript_path: transcript }).status).toBe(0);
      const handoffFile = path.join(root, '.claude', 'cache', 'compact-handoff.json');
      const saved = JSON.parse(fs.readFileSync(handoffFile, 'utf8'));
      expect(saved.run.run_id).toBe('fix-0913');
      expect(saved.reason).toBe('compact-auto');
      expect(saved.recent_prompts).toEqual(['fix the resume']);

      const r = run(['--resume'], { source: 'compact' });
      const out = JSON.parse(r.stdout);
      expect(out.hookSpecificOutput.hookEventName).toBe('SessionStart');
      expect(out.hookSpecificOutput.additionalContext).toContain('fix-0913');
      expect(out.hookSpecificOutput.additionalContext).toContain('run-state.json');
      expect(out.hookSpecificOutput.additionalContext).toContain('fix the resume');
      expect(fs.existsSync(handoffFile)).toBe(false);
    });

    it('SessionStart(clear) does not inject', () => {
      writeRun('fix-0913', 'in_progress');
      run(['--pre-compact'], { trigger: 'manual' });
      expect(run(['--resume'], { source: 'clear' }).stdout).toBe('');
    });

    it('Stop saves only when statusline usage crosses the threshold', () => {
      writeRun('fix-0913', 'in_progress');
      const cache = path.join(root, '.claude', 'cache');
      fs.mkdirSync(cache, { recursive: true });
      const usageFile = path.join(cache, 'context-usage.json');
      const handoffFile = path.join(cache, 'compact-handoff.json');
      const now = Math.floor(Date.now() / 1000);

      fs.writeFileSync(usageFile, JSON.stringify({ used_percentage: 40, ts: now }));
      run([], {});
      expect(fs.existsSync(handoffFile)).toBe(false);

      fs.writeFileSync(usageFile, JSON.stringify({ used_percentage: 82, ts: now }));
      run([], {});
      expect(JSON.parse(fs.readFileSync(handoffFile, 'utf8')).reason).toBe('stop-threshold');
    });

    it('AF_COMPACT_HANDOFF_DISABLED=true writes nothing', () => {
      writeRun('fix-0913', 'in_progress');
      run(['--pre-compact'], { trigger: 'auto' }, { AF_COMPACT_HANDOFF_DISABLED: 'true' });
      expect(fs.existsSync(path.join(root, '.claude', 'cache', 'compact-handoff.json'))).toBe(false);
    });
  });
});
