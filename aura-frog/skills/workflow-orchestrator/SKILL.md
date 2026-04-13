---
name: workflow-orchestrator
description: "Execute 5-phase workflow for complex features. Includes fasttrack mode for pre-approved specs. DO NOT use for simple bug fixes."
autoInvoke: true
priority: high
triggers:
  - "implement"
  - "build feature"
  - "create feature"
  - "workflow:start"
  - "complex task"
  - "fasttrack:"
  - "fast-track"
  - "just build it"
  - "execute from specs"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
effort: high
---

# Workflow Orchestrator

## When to Use

New features, complex implementations, multi-file changes, tasks requiring TDD.
NOT for: bug fixes (→ bugfix-quick), quick refactors/config (→ direct edit), simple questions.

---

## Pre-Execution

1. agent-detector → select lead agent
2. Load project context
3. Verify complexity — suggest lighter approach if simple
4. Socratic brainstorming (Standard/Deep only) — ask before building
5. Challenge requirements (see `rules/workflow/requirement-challenger.md`)

---

## Token Budget (Target: ≤30K total)

```toon
budget[5]{phase,max,format}:
  1,2000,"TOON tables + minimal prose"
  2,1500,"Test code only"
  3,2500,"Implementation code"
  4,1000,"Refactor summary + review in TOON"
  5,500,"Status only"
```

---

## 5-Phase Workflow

```toon
phases[5]{phase,name,gate,deliverable}:
  1,"Understand + Design",APPROVAL,"Requirements (TOON) + technical design"
  2,"Test RED",Auto,"Failing tests (TDD RED)"
  3,"Build GREEN",APPROVAL,"Implementation (TDD GREEN)"
  4,"Refactor + Review","Auto*","Clean code + quality/security check"
  5,"Finalize",Auto,"Coverage ≥80% + docs + notification"
```

**Deep tasks:** Phase 1 uses collaborative planning (3-perspective deliberation). Details: `rules/workflow/collaborative-planning.md`

## Phase Transitions

- P1→P2: Approval required. Blocker: no design approved.
- P2→P3: Auto-continue if tests fail as expected. Blocker: tests pass (not testing new code).
- P3→P4: Approval required. Blocker: tests still failing.
- P4→P5: Auto-continue if tests pass + no critical issues. Blocker: tests broken or critical security.
- P5→Done: Auto-complete. Blocker: coverage <80%.

**Invalid:** Skip P1→P3 (no tests), P3 without P2 (no TDD), P5 with failing tests.

---

## Approval Gates (Only 2: Phase 1 & 3)

Show deliverables → progress % → what auto-continues next → options (approve/reject/modify/stop).

On reject: brainstorm first, then redo. On modify: light brainstorm, then adjust.
Force skip brainstorming with "must do:" / "just do:".
Details: `rules/workflow/feedback-brainstorming.md`

## Auto-Stop Triggers

- P2: Tests pass when should fail
- P4: Tests fail after refactor, critical security issues
- P5: Coverage <80%
- Any: Token limit (75%→warn, 85%→suggest handoff, 90%→force handoff)

---

## Files to Load (ON-DEMAND)

Load phase guide only when entering that phase: `docs/phases/PHASE_[N]_*.MD`
Load project config once at workflow start. Load rules only if referenced.

---

## State Management

- `workflow:handoff` → save state to `.claude/logs/workflows/[id]/`
- `workflow:resume <id>` → load state, continue from last phase
- `workflow:status` → show current phase + progress

---

## Fast-Track Mode

Trigger: `fasttrack: <specs>` — skips Phase 1, auto-executes P2-P5 without gates.

Required spec sections: Overview, Requirements, Technical Design, API/Interfaces, Data Model, Acceptance Criteria. Ask if missing.

Stops on: tests pass in RED, 3 failed attempts in GREEN, critical security in P4, coverage <80% in P5.

---

## Agent Teams Mode

Activates ONLY for Deep + 2+ domains + Agent Teams enabled. Otherwise: standard subagent behavior.

```toon
teams[5]{phase,lead,teammates}:
  1,lead → architect,"frontend + tester"
  2,tester,architect
  3,architect,"frontend + tester"
  4,"architect + security","tester (reviewer)"
  5,lead,—
```

Teammate pattern: TaskList → claim → work → TaskUpdate(completed) → SendMessage(lead).
Details: `rules/core/execution-rules.md` (Team Mode section)
