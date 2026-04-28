# /aura:plan

**Hierarchical planning entry point.** Interview-bootstraps T0 (Mission) → T1 (Initiative) → T2 (Feature) for the current project.

**Category:** Planning (v3.7.0+)
**Scope:** Project-local

---

## EXECUTION PROTOCOL — FOLLOW IN ORDER

When the user types `/aura:plan` (no args), Claude MUST:

1. **Check for existing plan tree.** Run `bash aura-frog/scripts/plans/new-plan.sh` (idempotent — does nothing if `.aura/plans/` already exists).
2. **Validate.** Run `bash aura-frog/scripts/plans/validate-plan-tree.sh` — abort if any invariant fails.
3. **Read** `.aura/plans/mission.md` and `.aura/plans/active.json`.
4. **If mission.md is the default stub** → interview the user for the actual mission (1–3 sentences). Write to mission.md.
5. **If no T1 (Initiative) exists** → interview for the active initiative. Mint INIT-001 (or next available counter), write `.aura/plans/initiatives/INIT-001.md` per spec §6.3.
6. **If no T2 (Feature) exists under the active T1** → interview for the active feature. Mint FEAT-NNN, create `.aura/plans/features/FEAT-NNN/feature.md` per spec §6.4.
7. **Update active.json** — point at the new active T2.
8. **Append to history.jsonl** — `event: plan_init` with timestamp + nodes created.
9. **Render** the plan tree: `bash aura-frog/scripts/plans/render-plan-tree.sh`.
10. **Announce next:** "Plan initialized. Run `/aura:plan:expand FEAT-NNN` to decompose into Stories, or `/aura:plan:status` for the current tree."

If any step fails, surface the error to the user — do NOT silently fall through.

---

## Subcommands

```
/aura:plan                       # Interview T0/T1/T2 (this file's protocol)
/aura:plan:expand <id>           # Decompose node one tier down (Story/Task)
/aura:plan:next                  # Return next ready T4 leaf
/aura:plan:status                # Render plan tree as ASCII
```

Additional commands ship in later milestones: `replan`, `promote`, `archive`, `undo`, `freeze`, `thaw`, `conflicts`.

---

## Interview Style

Ask one question at a time. Keep questions concrete:

- **Mission:** "In one sentence, what does this project exist to do?"
- **Initiative:** "What multi-week effort are you currently driving toward? (e.g., 'Ship v2.0 with auth + billing')"
- **Feature:** "What single user-facing capability are you working on now?"

Don't fabricate answers. If user is uncertain, save what they DO know and mark `status: planned` so they can refine later.

---

## Tie-Ins

- **Skill:** `plan-loader` (auto-invoke) — loads context every turn
- **Skill:** `plan-validator` (on-demand) — runs `validate-plan-tree.sh`
- **Agents:** `master-planner`, `feature-architect`, `story-planner`
- **Spec:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §10.1
