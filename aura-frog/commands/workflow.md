# Workflow Commands

Bundled workflow commands for the 5-phase TDD workflow.

**Category:** Workflow (Bundled)
**Scope:** Session

---

## /workflow:start <task>

Initialize a new 5-phase workflow. Generates a workflow ID from ticket number (e.g., `JIRA-123`) or a short name + date (e.g., `fix-payment-0122`). Detects project type and activates relevant agents. Runs Phase 1 (Understand + Design) automatically.

- Creates state files under `.claude/logs/workflows/{workflow-id}/`
- Challenges requirements before analysis (Standard/Deep complexity only)
- Phase 1 deliverables: requirements analysis, implementation strategy, risk assessment, story points
- Shows approval gate on completion: `approve`, `reject`, `modify`, or cancel
- Auto-runs `workflow:predict` to show token estimate before starting

---

## /workflow:status

Display current workflow state: phase, progress percentage, deliverables count, active agents, time elapsed, and next actions. Reads from `workflow-state.json`.

- `--detailed` flag shows per-phase timestamps, success criteria, and agent involvement
- Shows blocking issues if workflow is stuck
- Lists available quick actions based on current state

---

## /workflow:approve

Approve the current phase and auto-advance to the next one. Only works at approval gates (Phase 1 and Phase 3).

- Validates phase is complete, deliverables exist, and success criteria are met
- Marks phase as "approved" with timestamp, increments `current_phase`
- Auto-executes next phase (pre-hook, execution, post-hook, approval gate)
- Optional comment: `/workflow:approve Looks good, proceed`
- At Phase 5 completion, shows final summary with duration, deliverables, and test coverage

---

## /workflow:modify <instructions>

Apply targeted modifications to current phase deliverables without restarting the phase. Faster than reject -- only changes specific things.

- Default: agent challenges scope impact, does light brainstorming, then applies changes
- Force mode (skip brainstorming): prefix with `just do:`, `must do:`, `exactly:`, or `no discussion`
- Re-saves deliverable files and logs modification in `workflow-state.json`
- Shortcuts: `+tests`, `+coverage`, `+docs`, `+types`, `+a11y`
- Can modify multiple times before approving
- Use `reject` instead when the fundamental approach is wrong

---

## /workflow:reject <reason>

Reject current phase and restart it with feedback context. Tracks retry count per phase.

- Default: agent brainstorms alternatives with pros/cons before reworking
- Force mode: prefix with `must do:`, `just do:`, `work like that`, or `I insist`
- Max 3 rejections per phase before warning (can override)
- Re-saves deliverable files with reworked content
- Be specific in feedback -- vague reasons like "do it better" are ineffective

---

## /workflow:resume <workflow-id>

Resume a workflow from a previous session.

- Loads `workflow-state.json`, `HANDOFF_CONTEXT.md`, `task-context.md`, and deliverables
- Validates git state: branch match, commit existence, conflict detection
- Restores context and continues from last active phase
- Aliases: `resume`, `continue workflow`, `load workflow`

---

## /workflow:handoff

Save workflow state for continuation in a new session.

- Triggers: token usage > 75%, before breaks, multi-day projects
- Saves: workflow state, HANDOFF_CONTEXT.md (human-readable summary), git state, deliverables, pending tasks
- HANDOFF_CONTEXT.md sections: Summary, Current Phase, Pending Tasks, Key Decisions, Next Steps, Resume Command
- Resume with: `workflow:resume {workflow-id}`

---

## /workflow:progress

Show visual progress timeline with phase completion, time estimates, and token usage.

- Displays progress bar, completed/pending phases with durations, milestone checklist
- Calculates velocity (phases/hr) and pace indicator (Fast/Normal/Slow)
- Estimates remaining time based on average phase durations (P1: 20m, P2: 11m, P3: 25m, P4: 15m, P5: 5m)
- Shows token usage as percentage of session limit

---

## /workflow:budget

Show real-time token usage versus prediction during an active workflow.

- Phase-by-phase breakdown: predicted vs actual tokens with variance percentage
- Warning levels: Green (0-70%), Yellow (71-85%), Orange (86-95%), Red (96-100%)
- Projects total token usage and safety margin
- Recommends handoff timing when approaching session limit
- Shows checkpoint history and next auto-checkpoint

---

## /workflow:metrics

Display workflow quality and performance metrics.

- Code quality: test coverage, linter errors, code grade, complexity
- Tests: total/passing/failing, coverage vs target threshold
- Performance: phase duration, velocity, token efficiency
- Workflow health: phases completed, first-time approval rate, rejection count
- `--detailed` flag for expanded breakdown

---

## /workflow:predict <task>

Predict token usage before starting a workflow. Analyzes task type, complexity, scope, and tech stack.

- Complexity tiers: simple (~47K), medium (~100K), complex (~150K total tokens)
- Phase 3 (Build GREEN) consumes ~77% of total tokens
- Scope multipliers: full-stack 1.4x, mobile 1.15x, infrastructure 1.2x
- Shows confidence level based on historical workflow matches
- Recommendations: single-session feasibility, handoff timing, optimal strategy

---

## /workflow:rollback [phase]

Revert to a git checkpoint created before a specific phase.

- Uses commits tagged by `phase-checkpoint.cjs`
- `--list` shows available checkpoints
- Shows commits that will be reverted and requires explicit user confirmation
- Safe on worktree branches; warns about destructive reset on main branch

---

## Related

- **Workflow Orchestrator:** `skills/workflow-orchestrator/SKILL.md` (handles phase-1 through phase-4 execution)
- **Session Continuation:** `skills/session-continuation/SKILL.md`

---
