# Run Commands

The universal entry point. Type `/run <task>` and Aura Frog auto-detects intent: feature, bugfix, refactor, test, deploy, review — then runs the right flow.

**Category:** Core
**Scope:** Session

---

## /run <task>

Start a new run. Auto-detects intent from task description:

```toon
detection[8]{keywords,intent,flow}:
  "fix/bug/broken/crash/error/not working",bugfix,"4-step TDD: investigate → test RED → fix GREEN → verify"
  "implement/build/create/add feature/new",feature,"5-phase: design → test → build → review → finalize"
  "refactor/cleanup/restructure/improve code",refactor,"Analyze → plan → test → refactor → verify"
  "test/coverage/unit test/e2e/add tests",test,"Detect framework → analyze → write tests → verify coverage"
  "security/audit/vulnerability/scan/owasp",security,"Deps + SAST + secrets + OWASP Top 10 → report"
  "review/check code/code review",review,"6-aspect review: security/arch/errors/tests/types/simplify"
  "deploy/docker/cicd/kubernetes",deploy,"Platform detect → config → scripts → guide"
  "quality/lint/complexity/debt",quality,"Lint + format + type check + coverage + complexity → report"
```

- Generates a run ID from ticket number (e.g., `JIRA-123`) or short name + date (e.g., `fix-payment-0420`)
- State files: `.claude/logs/runs/{run-id}/run-state.json`
- Feature runs get 2 approval gates (Phase 1 design, Phase 3 build)
- Bugfix/refactor/test runs are lighter — fewer gates

**Usage:** `/run implement user profile with avatar upload`, `/run fix login button not disabling`

---

## Context-Aware Actions

When a run is active (`run-state.json` exists with `status: in_progress`), **type bare words** — no `/run` prefix needed:

```toon
actions[8]{input,action}:
  approve,"Approve current gate → advance to next phase"
  reject <reason>,"Reject → brainstorm alternatives → redo"
  modify <changes>,"Adjust deliverables without restarting phase"
  handoff,"Save state for next session"
  status,"Show current run progress"
  progress,"Visual timeline + token usage"
  rollback,"Revert to last checkpoint"
  stop,"Cancel current run"
```

Force mode (skip brainstorming): prefix with `must do:`, `just do:`, `exactly:`.

---

## /run status

Show active run: phase, progress %, deliverables, agents, time elapsed, token usage, next actions. `--detailed` for per-phase timestamps.

---

## /run resume <id>

Resume a saved run. Loads `run-state.json`, validates git state, restores context, continues from last phase.

---

## /run progress

Visual timeline: progress bar, phase completion, velocity (phases/hr), token usage %, estimated time remaining.

---

## /run rollback [phase]

Revert to a git checkpoint. `--list` shows available checkpoints. Requires user confirmation.

---

## Feature Run: 5-Phase Workflow

```toon
phases[5]{phase,name,gate}:
  1,"Understand + Design",APPROVAL
  2,"Test RED",Auto
  3,"Build GREEN",APPROVAL
  4,"Refactor + Review",Auto
  5,"Finalize",Auto
```

- Sprint Contract negotiated after Phase 1 approval
- Builder ≠ Reviewer enforced in Phase 4
- Auto-stop: tests pass in RED, tests fail after refactor, coverage <80%, token limit
- Fast-track: `/run fasttrack: <specs>` skips Phase 1

---

## Bugfix Run: 4-Step TDD

1. **Investigate** — read error, reproduce, trace root cause
2. **Test RED** — write failing test that reproduces bug
3. **Fix GREEN** — minimal fix at root cause
4. **Verify** — full test suite, no regressions

Escalate to `skills/deep-debugging/SKILL.md` when the bug is intermittent, race-condition-flavored, or resists quick fix.

---

## Auto-Loaded Skills Based on Repo

When a run starts, `run-orchestrator` detects repo traits and loads relevant skills:

- Detects `pnpm-workspace.yaml` / `turbo.json` / `nx.json` / `lerna.json` / `go.work` → loads `skills/monorepo/SKILL.md` for package-scope discipline
- Performance keywords in task ("slow", "latency", "optimize speed") → loads `skills/perf-profiling/SKILL.md`
- Detection happens via `skills/agent-detector/SKILL.md` every message

---

## Related

- **Skill:** `run-orchestrator` (feature runs), `bugfix-quick` (bugfix runs), `test-writer` (test runs)
- **Session:** `session-continuation` (handoff/resume)
- **Phase guides:** `docs/phases/PHASE_[N]_*.MD`
