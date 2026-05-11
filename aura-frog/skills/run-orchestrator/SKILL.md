---
name: run-orchestrator
description: "Execute 5-phase TDD workflow for complex features. Use when the user invokes /run, asks to build/create/implement a feature, requests a complex multi-file change, or types 'fasttrack:'. Enforces phase gates, sprint contracts, and builder!=reviewer discipline."
when_to_use: "/run, build feature, create feature, implement feature, complex task, multi-file implementation, fasttrack: <spec>"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
effort: high
user-invocable: false
---

# Run Orchestrator

For complex features / multi-file changes requiring TDD. NOT for: bug fixes (bugfix-quick), quick edits (direct).

## Step 0 — Create the Run State (MANDATORY, BEFORE ANY OTHER WORK)

The moment you decide a `/run` invocation will use this orchestrator, write the initial state file. **Do NOT proceed without it.** Without the file, `/run status`, `/run resume`, and `/run handoff` cannot work — they all read from this file.

```bash
# Generate run-id: ticket prefix (JIRA-123) or short-name + YYMMDD (auth-260424)
RUN_ID="<derived from task or ticket>"
mkdir -p ".claude/logs/runs/${RUN_ID}"
```

Then write `.claude/logs/runs/${RUN_ID}/run-state.json` with this skeleton:

```json
{
  "run_id": "<RUN_ID>",
  "task": "<verbatim user task>",
  "status": "in_progress",
  "complexity": "<Quick|Standard|Deep — from agent-detector>",
  "flow": "<direct|bugfix|refactor|test|feature-standard|feature-deep>",
  "started_at": "<ISO 8601 UTC>",
  "current_phase": 1,
  "phases": {},
  "agents": [],
  "deliverables": [],
  "observations": [],
  "approvals": [],
  "tokens_used": 0
}
```

**Announce to user transparently:**

> "Detected: `<complexity>` complexity → `<flow>` flow. State file: `.claude/logs/runs/${RUN_ID}/run-state.json`. Say `deep` to escalate, `quick` to downgrade, or proceed."

This step is non-negotiable. If you skip it, /run status will show nothing and the user loses observability.

---

## Pre-Execution (Phase 1 setup)

1. agent-detector → select lead, complexity, model
2. **Apply context-economy** — locate before Read, use Glob/Grep first, slice large files with `offset`+`limit`, delegate broad exploration to Explore subagent. See `rules/core/context-economy.md`. **If you hit `overloaded_error`, do NOT retry with the same context — distill, then resume.**
3. **Validate prompt (6-dim benchmark)** — score per `rules/core/prompt-validation.md`. If below threshold, ask focused questions before proceeding (see `rules/core/no-assumption.md`)
4. **Check for JIRA ticket context** — if user prompt or `RUN_ID` matches a JIRA ticket pattern, the `jira-auto-fetch` hook will have written `.claude/logs/jira/{TICKET_ID}.json`. Read it as the canonical requirements source (description + comments). Reference the ticket key in run-state under `context.jira_ticket`.
5. **Run ↔ Plan bridge** — apply `rules/workflow/run-plan-bridge.md`:
   - If `.aura/plans/active.json#active.task` is set → **auto-anchor** run-state to that T4; Sprint Contract seeds from the task's acceptance criteria; Phase 5 syncs status back to the plan tree.
   - If `active.feature` is set but `active.task` is null → suggest `/aura-frog:plan-next` to claim a task first (user may reply `proceed` to run inline).
   - If no plan exists and the task description triggers ≥3 escalation weight (multi-feature, multi-week, shipping/rollout/epic keywords) → suggest `/aura-frog:plan` to bootstrap T0-T2 first. Honor `proceed` to run inline.
   - Disable with `AF_RUN_PLAN_BRIDGE_DISABLED=true`. Force-mode prefixes (`must do:`, `just do:`, `exactly:`) skip the bridge.
6. Load project context
7. Verify complexity — suggest lighter approach if simple
8. Socratic brainstorming (Standard/Deep only)
9. Challenge requirements (`rules/workflow/requirement-challenger.md`)
10. **Sprint Contract** — negotiate "done" criteria before Phase 2 (anchor-aware: cannot weaken plan acceptance without `manual_override.json` audit entry)

## 5-Phase Workflow

```toon
phases[5]{phase,name,builder,reviewer,gate}:
  1,"Understand + Design",architect,"tester+security+strategist",APPROVAL
  2,"Test RED",tester,"architect (feasibility)",Auto
  3,"Build GREEN","architect/frontend/mobile","tester+security",APPROVAL
  4,"Refactor + Review","P3 builder refactors","security+tester (NOT P3 builder)",Auto
  5,"Finalize",lead,—,Auto
```

**Builder != Reviewer.** Details: `rules/workflow/cross-review-workflow.md`

## Execution Model — Subagent Isolation (Deep tasks)

Context pollution is the #1 failure mode for multi-phase TDD: P1 research artifacts still live in the window when P3 tries to build, so the model gets distracted by outdated design notes.

**For Deep complexity runs, each phase spawns a fresh subagent via the Agent tool.** The orchestrator (main thread) stays lean — it dispatches, verifies deliverables, and holds approval gates. It does NOT do the phase work itself.

> **Critical: plugin agents are namespaced — by the plugin's runtime name, not a hardcoded string.** When you invoke the Agent tool, `subagent_type` is `${PLUGIN_PREFIX}:<id>` where `PLUGIN_PREFIX` comes from `plugin.json#name` (or run `bash scripts/get-plugin-prefix.sh`). Bare `architect` is NOT valid — the tool errors with `agent type 'architect' not found`. Built-in Claude Code agents (general-purpose, Explore, Plan, statusline-setup) stay unprefixed. See `rules/core/agent-namespacing.md` for full details.

The dispatch table below uses **bare agent IDs**. Apply the runtime prefix at the moment you call the Agent tool — don't bake the literal "aura-frog" into your call.

```toon
execution[5]{phase,agent_id,main_thread_role}:
  1,architect,"dispatch + hold gate"
  2,tester,"verify tests fail as expected"
  3,"architect or frontend or mobile (per artifact)","dispatch + hold gate"
  4,"security (primary) + tester","verify builder≠reviewer"
  5,inline (lead),"finalize — no fork needed"
```

When you call Agent: read the prefix once per session (cheapest: from the session-start banner emitted by `hooks/session-start.cjs`), then compose `subagent_type: ${prefix}:${agent_id}`.

Each subagent returns a concise report. Main thread does NOT re-read phase research files. For Standard/Quick runs, inline execution is fine — the isolation cost only pays off when phases would otherwise compete for the same context budget.

## Phase Transitions

- P1→P2: Approval required. Blocker: no design approved.
- P2→P3: Auto if tests fail as expected. Blocker: tests pass.
- P3→P4: Approval required. Blocker: tests still failing.
- P4→P5: Auto if tests pass + no critical issues.
- P5→Done: Auto. Blocker: coverage <80%.

## Approval Gates (Phase 1 & 3 only)

Show deliverables → user types `approve` / `reject <reason>` / `modify <changes>` (context-aware, no prefix needed).
Force skip brainstorming with "must do:" / "just do:".

## Auto-Stop Triggers

P2: tests pass when should fail. P4: tests fail after refactor. P5: coverage <80%. Any: token limit 75%→warn, 85%→handoff, 90%→force.

## State

Run state: `.claude/logs/runs/{run-id}/run-state.json`. Load phase guide on-demand: `docs/phases/PHASE_[N]_*.MD`.

## Fast-Track

`/run fasttrack: <specs>` — skips P1, auto-executes P2-P5 without gates. Requires: Overview, Requirements, Technical Design, API, Data Model, Acceptance Criteria.

---

## Reasoning Techniques (opt-in via `reason:` prefix)

Advanced reasoning techniques for high-stakes or branching decisions. Auto-enabled only when complexity = Deep AND the task matches the trigger (see each rule). Otherwise opt-in.

| Prefix | Fires | Where | Cost |
|--------|-------|-------|------|
| `/run reason: sc <task>` | Self-Consistency (3 paths vote) | Phase 1 design | ~3× base |
| `/run reason: tot <task>` | Tree of Thoughts (branch/prune) | Phase 1 + Phase 4 | ~3–4× base |
| `/run reason: cove <task>` | Chain-of-Verification | Phase 4 claims | ~2–3× base |
| `/run reason: all <task>` | All three, auto-routed per phase | As above | ~5–7× base |

**Phase 4 always runs CoVe on factual claims** ("tests pass", "coverage X%", "0 critical findings") — this is non-negotiable per `rules/workflow/chain-of-verification.md`.

Full rules:
- `rules/workflow/self-consistency.md`
- `rules/workflow/tree-of-thoughts.md`
- `rules/workflow/chain-of-verification.md`

Skills (playbooks):
- `skills/self-consistency/SKILL.md`
- `skills/tree-of-thoughts/SKILL.md`
- `skills/chain-of-verification/SKILL.md`

---

## Related Rules (load per phase as needed)

**Core (applies every phase):**
- `rules/core/tdd-workflow.md` — RED → GREEN → REFACTOR discipline
- `rules/core/approval-gates.md` — Human-in-the-loop enforcement
- `rules/core/execution-rules.md` — ALWAYS/NEVER orchestration rules
- `rules/core/verification.md` — Verify before claiming done

**Phase 1 (Understand + Design):**
- `rules/workflow/requirement-challenger.md` — Challenge assumptions
- `rules/workflow/collaborative-planning.md` — Deep-task 3-perspective deliberation
- `rules/workflow/impact-analysis.md` — Impact/effort matrix
- `rules/workflow/estimation.md` — Scope estimation
- `rules/workflow/priority-hierarchy.md` — Prioritization
- `rules/workflow/diagram-requirements.md` — Mermaid diagrams for complex phases

**Phase 3 (Build GREEN):**
- `rules/workflow/project-linting-precedence.md` — Project config wins
- `rules/workflow/post-implementation-linting.md` — Lint after each file
- `rules/workflow/smart-commenting.md` — WHY not WHAT

**Phase 4 (Refactor + Review):**
- `rules/workflow/cross-review-workflow.md` — Builder ≠ Reviewer
- `rules/workflow/post-implementation-linting.md` — Final lint gate

**Phase 5 (Finalize):**
- `rules/workflow/git-workflow.md` — Commit + push discipline

**Cross-phase:**
- `rules/workflow/workflow-deliverables.md` — What each phase must produce
- `rules/workflow/workflow-navigation.md` — Phase transition rules
- `rules/workflow/next-step-guidance.md` — What to show at gates
- `rules/workflow/token-time-awareness.md` — Budget tracking
- `rules/workflow/feedback-brainstorming.md` — On reject/modify
- `rules/workflow/mcp-response-logging.md` — Log large MCP responses
- `rules/workflow/immutable-workflow.md` — Approved phases are append-only
- `rules/workflow/dual-llm-review.md` — Second LLM review for destructive ops / security-critical writes
