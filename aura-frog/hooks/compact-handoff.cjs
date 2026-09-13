#!/usr/bin/env node
/**
 * Aura Frog - Compact Handoff Hook
 *
 * Fires:
 *   - PreCompact (--pre-compact)  → always save a handoff (trigger: manual|auto)
 *   - Stop (no args, via dispatch) → save only when context usage ≥ threshold,
 *                                    so a handoff exists before auto-compact
 *   - SessionStart (--resume)      → inject the handoff as additionalContext
 *
 * State sources (newest schema first):
 *   1. .claude/logs/runs/<id>/run-state.json  — what /run writes today
 *   2. .claude/plans/active.json               — hierarchical plan anchor
 *   3. .claude/cache/workflow-state.json + AF_WORKFLOW_ID env — legacy workflows
 *
 * Context usage comes from .claude/cache/context-usage.json, written by
 * scripts/statusline.sh (the only surface Claude Code hands used_percentage to).
 *
 * Env:
 *   AF_HANDOFF_THRESHOLD=70    Stop-save threshold (percent)
 *   AF_COMPACT_HANDOFF_DISABLED=true
 *
 * Exit Codes:
 *   0 - always (non-blocking)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { findProjectRoot } = require('./lib/hook-runtime.cjs');

const DEFAULT_THRESHOLD = 70;
const USAGE_MAX_AGE_MS = 10 * 60 * 1000;
// A Stop-save at 70% can precede the actual auto-compact by many turns.
const COMPACT_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const RESUME_MAX_AGE_MS = 30 * 60 * 1000;
const OPEN_RUN_STATUSES = new Set(['in_progress', 'paused', 'active', 'blocked']);

// Resolved per call (not at module load) so AF_PROJECT_ROOT can redirect tests.
function getPaths(root = findProjectRoot()) {
  const cache = path.join(root, '.claude', 'cache');
  return {
    root,
    cache,
    runsDir: path.join(root, '.claude', 'logs', 'runs'),
    workflowsDir: path.join(root, '.claude', 'logs', 'workflows'),
    handoff: path.join(cache, 'compact-handoff.json'),
    workflowState: path.join(cache, 'workflow-state.json'),
    contextUsage: path.join(cache, 'context-usage.json'),
  };
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return null; }
}

function readHookInput() {
  try {
    const { readStdinSafely } = require('./lib/safe-stdin.cjs');
    const raw = readStdinSafely();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Newest open run (by mtime) under .claude/logs/runs, or null. */
function findActiveRun(p = getPaths()) {
  let best = null;
  let entries;
  try { entries = fs.readdirSync(p.runsDir, { withFileTypes: true }); } catch { return null; }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const file = path.join(p.runsDir, e.name, 'run-state.json');
    let mtime;
    try { mtime = fs.statSync(file).mtimeMs; } catch { continue; }
    const state = readJson(file);
    if (!state || !OPEN_RUN_STATUSES.has(state.status)) continue;
    if (!best || mtime > best.mtime) {
      best = { run_id: state.run_id || e.name, file: path.relative(p.root, file), mtime, state };
    }
  }
  if (!best) return null;
  const s = best.state;
  return {
    run_id: best.run_id,
    state_file: best.file,
    task: s.task,
    status: s.status,
    complexity: s.complexity,
    flow: s.flow,
    current_phase: s.current_phase,
    current_step: s.current_step || s.step,
    active_agent: s.active_agent,
    next_action: s.next_action || s.next_step,
  };
}

function readActivePlan() {
  try {
    const resolvePlansDir = require('./lib/plans-dir.cjs');
    const active = readJson(path.join(resolvePlansDir(), 'active.json'));
    const a = active && active.active;
    return a && (a.feature || a.initiative || a.mission) ? a : null;
  } catch {
    return null;
  }
}

/** Legacy workflow state (pre-/run). */
function getLegacyWorkflowState(p = getPaths()) {
  for (const loc of [p.workflowState, path.join(p.workflowsDir, 'current', 'workflow-state.json')]) {
    const state = readJson(loc);
    if (state && state.workflow_id) return state;
  }
  if (process.env.AF_WORKFLOW_ID || process.env.AF_CURRENT_PHASE) {
    return {
      workflow_id: process.env.AF_WORKFLOW_ID || `session-${Date.now()}`,
      current_phase: parseInt(process.env.AF_CURRENT_PHASE || '1', 10),
      current_sub_phase: process.env.AF_CURRENT_SUBPHASE || null,
      status: 'in_progress',
      task: { description: process.env.AF_TASK_DESCRIPTION || 'Workflow in progress' },
      agents: { primary: process.env.AF_CURRENT_AGENT || 'general-purpose' },
    };
  }
  return null;
}

function getSessionContext() {
  return {
    project_name: process.env.PROJECT_NAME || process.env.AF_PROJECT_NAME,
    project_type: process.env.AF_PROJECT_TYPE,
    framework: process.env.AF_FRAMEWORK,
    git_branch: process.env.AF_GIT_BRANCH,
    active_plan: process.env.AF_ACTIVE_PLAN,
    current_agent: process.env.AF_CURRENT_AGENT,
    complexity: process.env.AF_COMPLEXITY,
  };
}

/** used_percentage from the statusline cache, or null when absent/stale. */
function readContextUsage(p = getPaths(), nowMs = Date.now()) {
  const data = readJson(p.contextUsage);
  if (!data || typeof data.used_percentage !== 'number') return null;
  if (data.ts && nowMs - data.ts * 1000 > USAGE_MAX_AGE_MS) return null;
  return data.used_percentage;
}

/**
 * Pure: should a Stop event save a handoff?
 * Known usage → compare with threshold. Unknown usage (no statusline) → save
 * only when there is open work worth resuming.
 */
function shouldSaveOnStop({ usage, threshold = DEFAULT_THRESHOLD, hasOpenWork }) {
  if (typeof usage === 'number') return usage >= threshold;
  return Boolean(hasOpenWork);
}

/** Last N real user prompts from a transcript JSONL (skips tool results + injected tags). */
function recentUserPrompts(transcriptPath, n = 3, maxBytes = 512 * 1024) {
  if (!transcriptPath) return [];
  let text;
  try {
    const fd = fs.openSync(transcriptPath, 'r');
    try {
      const size = fs.fstatSync(fd).size;
      const len = Math.min(size, maxBytes);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, size - len);
      text = buf.toString('utf-8');
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return [];
  }
  const prompts = [];
  for (const line of text.split('\n')) {
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (!entry || entry.type !== 'user' || entry.isMeta) continue;
    let content = entry.message && entry.message.content;
    if (Array.isArray(content)) {
      content = content.filter((c) => c && c.type === 'text').map((c) => c.text).join('\n');
    }
    if (typeof content !== 'string') continue;
    content = content.trim();
    if (!content || content.startsWith('<')) continue;
    prompts.push(content.length > 300 ? `${content.slice(0, 300)}…` : content);
  }
  return prompts.slice(-n);
}

function modifiedFiles(root) {
  try {
    const { execSync } = require('child_process');
    const { TIMEOUT_DEFAULT_MS, MAX_BUFFER_LARGE } = require('./lib/af-exec.cjs');
    const out = execSync('git diff --name-only HEAD 2>/dev/null', {
      cwd: root,
      encoding: 'utf-8',
      timeout: TIMEOUT_DEFAULT_MS,
      killSignal: 'SIGKILL',
      maxBuffer: MAX_BUFFER_LARGE,
    }).trim();
    return out ? out.split('\n').slice(0, 20) : [];
  } catch {
    return [];
  }
}

function buildHandoff({ p = getPaths(), input = {}, reason = 'compact' } = {}) {
  const run = findActiveRun(p);
  const workflow = run ? null : getLegacyWorkflowState(p);
  const plan = readActivePlan();
  const context = getSessionContext();
  let resumeHint = null;
  if (run) resumeHint = `/run resume ${run.run_id}`;
  else if (workflow) resumeHint = `/run resume ${workflow.workflow_id}`;
  return {
    version: '2.0.0',
    saved_at: new Date().toISOString(),
    reason,
    trigger: input.trigger || null,
    context_usage: readContextUsage(p),
    run,
    workflow,
    plan,
    context,
    modified_files: modifiedFiles(p.root),
    recent_prompts: recentUserPrompts(input.transcript_path),
    resume_hint: resumeHint,
  };
}

/** Save a handoff. Returns false when there is nothing worth resuming. */
function saveHandoff({ input = {}, reason = 'compact' } = {}) {
  try {
    const p = getPaths();
    const handoff = buildHandoff({ p, input, reason });
    if (!handoff.run && !handoff.workflow && !handoff.plan &&
        !handoff.context.project_name && handoff.recent_prompts.length === 0) {
      return false;
    }
    fs.mkdirSync(p.cache, { recursive: true });
    fs.writeFileSync(p.handoff, JSON.stringify(handoff, null, 2));

    // Legacy workflows: mark paused so /run resume shows the right status.
    if (handoff.workflow && handoff.workflow.workflow_id) {
      const dir = path.join(p.workflowsDir, handoff.workflow.workflow_id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'workflow-state.json'), JSON.stringify({
        ...handoff.workflow,
        status: 'paused',
        paused_at: handoff.saved_at,
        paused_reason: reason,
      }, null, 2));
    }
    return handoff;
  } catch (error) {
    process.stderr.write(`Handoff save error: ${error.message}\n`);
    return false;
  }
}

/** Load the handoff if fresh enough for this SessionStart source; null otherwise. */
function loadHandoff({ source = 'unknown', nowMs = Date.now() } = {}) {
  try {
    const p = getPaths();
    if (source === 'clear' || !fs.existsSync(p.handoff)) return null;
    const handoff = JSON.parse(fs.readFileSync(p.handoff, 'utf-8'));
    const maxAge = source === 'compact' ? COMPACT_MAX_AGE_MS : RESUME_MAX_AGE_MS;
    if (nowMs - new Date(handoff.saved_at).getTime() > maxAge) {
      fs.unlinkSync(p.handoff);
      return null;
    }
    return handoff;
  } catch {
    return null;
  }
}

/** Pure: render the resume context injected after compaction. */
function generateResumeContext(handoff = {}) {
  const lines = ['# 🔄 Aura Frog — resumed after compact', ''];

  if (handoff.run) {
    const r = handoff.run;
    lines.push(`## Active run: ${r.run_id}`);
    if (r.task) lines.push(`- **Task:** ${r.task}`);
    const where = [r.complexity, r.flow, r.current_phase != null ? `phase ${r.current_phase}` : null, r.current_step]
      .filter(Boolean).join(' · ');
    if (where) lines.push(`- **Where:** ${where}`);
    if (r.active_agent) lines.push(`- **Agent:** ${r.active_agent}`);
    if (r.next_action) lines.push(`- **Next:** ${r.next_action}`);
    lines.push(`- **State file:** \`${r.state_file}\``);
    lines.push('');
  }

  if (handoff.workflow) {
    const wf = handoff.workflow;
    lines.push(`## Workflow: ${wf.workflow_id}`);
    lines.push(`- **Task:** ${(wf.task && wf.task.description) || 'In progress'}`);
    lines.push(`- **Phase:** ${wf.current_phase}${wf.current_sub_phase || ''}`);
    lines.push(`- **Agent:** ${(wf.agents && wf.agents.primary) || 'general-purpose'}`);
    lines.push('');
  }

  if (handoff.plan) {
    const a = handoff.plan;
    const parts = [a.feature || a.initiative || a.mission, a.story, a.task].filter(Boolean);
    lines.push(`## Plan anchor: ${parts.join(' → ')}`);
    lines.push('');
  }

  const ctx = handoff.context || {};
  const ctxLines = [
    ctx.project_name && `- **Project:** ${ctx.project_name}`,
    ctx.framework && `- **Framework:** ${ctx.framework}`,
    (ctx.git_branch || ctx.branch) && `- **Branch:** ${ctx.git_branch || ctx.branch}`,
  ].filter(Boolean);
  if (ctxLines.length) lines.push('## Session', ...ctxLines, '');

  if (handoff.recent_prompts && handoff.recent_prompts.length) {
    lines.push('## Last user requests (oldest → newest)');
    handoff.recent_prompts.forEach((q) => lines.push(`- ${q.replace(/\n+/g, ' ')}`));
    lines.push('');
  }

  if (handoff.modified_files && handoff.modified_files.length) {
    lines.push('## Uncommitted files');
    handoff.modified_files.forEach((f) => lines.push(`- ${f}`));
    lines.push('');
  }

  lines.push('## How to continue');
  if (handoff.run) {
    lines.push(`Re-read \`${handoff.run.state_file}\` (and its deliverables) before acting, then continue the run from its current phase. Do not restart completed phases.`);
  } else if (handoff.resume_hint) {
    lines.push(`Run \`${handoff.resume_hint}\` or re-read the workflow state, then continue.`);
  } else {
    lines.push('Continue the last user request above; verify file state before editing.');
  }
  return lines.join('\n');
}

function main() {
  if (process.env.AF_COMPACT_HANDOFF_DISABLED === 'true') return;
  const mode = process.argv[2] || 'stop';
  const input = readHookInput();

  if (mode === '--resume' || mode === 'resume') {
    const handoff = loadHandoff({ source: input.source });
    if (!handoff) return;
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: generateResumeContext(handoff),
      },
    }));
    try { fs.unlinkSync(getPaths().handoff); } catch { /* already gone */ }
    return;
  }

  if (mode === '--pre-compact') {
    saveHandoff({ input, reason: `compact-${input.trigger || 'unknown'}` });
    return;
  }

  // Stop: pre-emptive save before auto-compact.
  const p = getPaths();
  const usage = readContextUsage(p);
  const threshold = Number(process.env.AF_HANDOFF_THRESHOLD) || DEFAULT_THRESHOLD;
  if (shouldSaveOnStop({ usage, threshold, hasOpenWork: Boolean(findActiveRun(p)) })) {
    saveHandoff({ input, reason: 'stop-threshold' });
  }
}

module.exports = {
  getPaths,
  findActiveRun,
  readContextUsage,
  shouldSaveOnStop,
  recentUserPrompts,
  buildHandoff,
  saveHandoff,
  loadHandoff,
  generateResumeContext,
};

if (require.main === module) {
  main();
  process.exit(0);
}
