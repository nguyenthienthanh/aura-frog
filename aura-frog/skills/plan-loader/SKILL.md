---
name: plan-loader
description: "Loads minimum hierarchical plan context (.aura/plans/) for current execution focus. Auto-invokes every session when plans exist. Stays under 800 always-loaded tokens regardless of plan tree size."
autoInvoke: true
when_to_use: "Every Claude turn when .aura/plans/ exists in project; loads mission + active node + ancestors only"
allowed-tools: Read, Glob, Bash
effort: low
user-invocable: false
---

# Plan Loader

**STATUS — v3.7.0-alpha.1.** Provides plan context for hierarchical planning system.

## Behavior (in order)

1. **Detect**: if `.aura/plans/` does NOT exist → exit silently (no plan = no overhead)
2. **Read** `.aura/plans/active.json` — get current focus pointer
3. **Load mission.md** — T0 (always loaded if exists)
4. **Load active T1** (Initiative) if `active.initiative` set
5. **Load active T2** (Feature) if `active.feature` set
6. **Load active T3** (Story) if `active.story` set, plus sibling T4 summaries (id + intent + status only — not full body)
7. **Load active T4** (Task) if `active.task` set
8. Stamp loaded plan nodes with `trust: plan` for `memory-trust-policy.md` discipline

## Token budget

```toon
budget[5]{layer,target,hard_cap}:
  always_loaded,800,1000
  active_T1+T2,1500,2500
  active_T3+T4,5000,7000
  sibling_T4_summaries,500,800
  total_with_plan,~7800,~11300
```

## Auto-degradation rules (per spec §9.1)

When always-loaded budget approaches 13,500 tokens:

1. **First trim:** skip permanent-memory summary lines → saves ~150 tokens
2. **Second trim:** skip mission.md content (keep only ID) → saves ~50 tokens
3. **Third trim:** load only `active.json` (no node bodies) → log warning

## What this skill does NOT do

- Does NOT modify plan files (read-only)
- Does NOT trigger replan or status changes
- Does NOT load sibling T3s, T2s, T1s outside active path
- Does NOT load archive/, traces/, history.jsonl, conflicts.jsonl

## Detection logic (bash one-liner the model can run)

```bash
[ -f .aura/plans/active.json ] && echo "plan-active" || echo "no-plan"
```

## Tie-Ins

- **Owns:** `.aura/plans/active.json` (read), `.aura/plans/mission.md` (read), `.aura/plans/<active path>/*.md` (read)
- **Skill spec:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §9.1
- **Rule:** `rules/core/plan-trust-policy.md` — content loaded by this skill is `trust: plan`
- **Hook:** `hooks/pre-execute-load-plan-context.cjs` (Milestone A part 2) — invokes this skill on every PreToolUse
- **Companion:** `skills/plan-validator/SKILL.md` — runs `validate-plan-tree.sh` on demand
