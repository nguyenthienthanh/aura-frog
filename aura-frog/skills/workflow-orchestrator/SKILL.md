---
name: workflow-orchestrator
description: "Execute 5-phase TDD workflow for complex features. Enforces phase gates, sprint contracts, and builder!=reviewer discipline. Without this skill, complex tasks skip TDD, lack approval gates, and have no scope control."
autoInvoke: true
priority: high
triggers:
  - "build feature"
  - "create feature"
  - "workflow:start"
  - "complex task"
  - "fasttrack:"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
effort: high
---

# Workflow Orchestrator

For complex features / multi-file changes requiring TDD. NOT for: bug fixes (bugfix-quick), quick edits (direct).

## Pre-Execution

1. agent-detector → select lead
2. Load project context
3. Verify complexity — suggest lighter approach if simple
4. Socratic brainstorming (Standard/Deep)
5. Challenge requirements (`rules/workflow/requirement-challenger.md`)
6. **Sprint Contract** — negotiate "done" criteria before Phase 2

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

## Phase Transitions

- P1→P2: Approval required. Blocker: no design approved.
- P2→P3: Auto if tests fail as expected. Blocker: tests pass.
- P3→P4: Approval required. Blocker: tests still failing.
- P4→P5: Auto if tests pass + no critical issues.
- P5→Done: Auto. Blocker: coverage <80%.

## Approval Gates (Phase 1 & 3 only)

Show deliverables → options: `/workflow approve` / `/workflow reject` / `/workflow modify`.
On reject: brainstorm first. On modify: light brainstorm. Force skip with "must do:" / "just do:".

## Auto-Stop Triggers

P2: tests pass when should fail. P4: tests fail after refactor. P5: coverage <80%. Any: token limit 75%→warn, 85%→handoff, 90%→force.

## Files

Load phase guide on-demand: `docs/phases/PHASE_[N]_*.MD`. Load rules only if referenced.

## Fast-Track

`fasttrack: <specs>` — skips P1, auto-executes P2-P5 without gates. Requires: Overview, Requirements, Technical Design, API, Data Model, Acceptance Criteria.
