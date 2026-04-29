---
name: plan-validator
description: "On-demand plan-tree validator. Runs all 8 invariants from spec §6.7 (parent existence, children integrity, no orphans, valid status, monotonic revision, test_ref existence, DAG no-cycles, freeze_reason). Refuses commits on violations."
when_to_use: "Before /aura:plan:expand, /aura:plan:promote, /aura:plan:archive — and as part of pre-commit when .aura/plans/ has uncommitted changes"
allowed-tools: Bash, Read
effort: low
user-invocable: false
---

# Plan Validator

**STATUS — v3.7.0-alpha.2.** Thin wrapper over `aura-frog/scripts/plans/validate-plan-tree.sh`.

## Behavior

1. Detect: if `.aura/plans/` does NOT exist → exit silently
2. Run `bash aura-frog/scripts/plans/validate-plan-tree.sh`
3. If exit_code === 0 → silent (or one-line success when `verbose: true`)
4. If exit_code !== 0 → surface the failing invariant(s) and refuse the calling operation

## The 8 invariants (spec §6.7)

| # | Invariant | Failure mode |
|---|-----------|--------------|
| 1 | parent existence | Every node's `parent` field points to an existing node (or `MISSION` for T1) |
| 2 | children integrity | Every `children: [...]` entry exists as a node file |
| 3 | no orphans | Every non-MISSION node is referenced by exactly one parent |
| 4 | valid status | `status` ∈ {planned, active, done, blocked, frozen, discarded, archived} |
| 5 | monotonic revision | `revision` only increases; never decreases or skips |
| 6 | test_ref existence | When `test_ref:` set, the referenced test file exists |
| 7 | DAG no-cycles | `depends_on:` does not introduce cycles when traversed |
| 8 | freeze_reason | `status: frozen` requires `freeze_reason:` and `frozen_at:` fields |

## When to invoke

- **Before** `/aura:plan:expand`, `/aura:plan:promote`, `/aura:plan:archive`
- **Before** `git commit` when `.aura/plans/` has uncommitted changes
- **After** any direct file edit on `.aura/plans/*.md` (manual override)

## When NOT to invoke

- Read-only commands (`/aura:plan:status`, `/aura:trace`) — running validation on a healthy tree is wasted overhead
- During `/aura:plan:undo` — the post-restore state may transiently violate invariants while restoring
- Inside hooks fired on every PreToolUse — too expensive

## Output discipline

- Exit 0: silent (or `✓ Plan tree valid (8/8 invariants pass)` if verbose)
- Exit 1: enumerate every failing invariant, one per line, with the offending node ID

## Tie-Ins

- **Spec:** §6.7, §9.2
- **Script:** `aura-frog/scripts/plans/validate-plan-tree.sh` — actual implementation
- **Skill:** `plan-loader` — companion (loader is read-only; this is the validator)
- **Agent:** `master-planner` — invokes before mutations
- **Command:** `/aura:plan:expand`, `/aura:plan:promote`, `/aura:plan:archive` — invoke before applying
- **Rule:** `rules/workflow/plan-lifecycle.md` — invariant 4 enforces valid status transitions
