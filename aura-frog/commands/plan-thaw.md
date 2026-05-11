# /aura-frog:plan-thaw

**Reverse a freeze.** Validates the original blocker is resolved + output compatible per spec §21.6.

---

## Usage

```
/aura-frog:plan-thaw <NODE_ID>                       # thaw + auto-cascade descendants
/aura-frog:plan-thaw <NODE_ID> --partial             # thaw NODE_ID only; descendants stay frozen
/aura-frog:plan-thaw <NODE_ID> --discard             # thaw + status: discarded (abandoning, not resuming)
/aura-frog:plan-thaw <NODE_ID> --grant-replan-budget 1   # thaw + grant N additional replan budget
```

## Protocol (imperative)

1. **Resolve target.** Refuse if no NODE_ID.
2. **Validate current status.** Refuse if status is not `frozen`. Print current status if not frozen.
3. **Read freeze metadata.** Capture `freeze_reason`, `conflict_id`, `frozen_by_ancestor`, `frozen_at` from frontmatter.
4. **Validate blocker resolution** when `conflict_id` is set:
   - Look up the conflict in `.aura/plans/conflicts.jsonl`
   - Find the conflicting participant (the one that's not this node)
   - **Status check**: if blocker is not `done`/`archived`, refuse — "blocker still active; cannot thaw safely"
   - **Compatibility check** (spec §21.6): `git diff <blocker.checkpoint_id> HEAD` against this node's planned `artifacts[]`. If overlap remains → mark `replan_required: true` and proceed (auto-discard path).
5. **Save checkpoint** before mutation.
6. **Confirm with user** (skip with `--force`). Show:
   - Node ID + current freeze info
   - Compatibility check verdict (compatible | needs replan)
   - Descendants that will auto-cascade-thaw (unless `--partial`)
7. **Mutate frontmatter:**
   - On `--discard`: `status: discarded` (not `planned`); freeze metadata moved to history
   - On compatible: `status: planned`; clear freeze fields
   - On incompatible (auto-discard): `status: planned`, `replan_required: true`; clear freeze fields
8. **Cascade-thaw descendants** UNLESS `--partial`:
   - For each `frozen_by_ancestor: <NODE_ID>`, restore to its prior status (recorded in checkpoint) or `planned`
9. **Reset replan_budget** if applicable: thawing resets the budget per `rules/workflow/replan-thresholds.md`. Override with `--grant-replan-budget N`.
10. **Append history.jsonl** events: `event: thaw_applied` + `event: thaw_cascaded` per descendant.
11. **Render** summary: `<NODE_ID> + N descendants thawed; <verdict>`.

## What `--partial` is for

When you want to inspect a frozen branch without resuming the whole subtree. Useful for forensics: thaw the blocker, leave dependents frozen until you decide what to do.

## Failure modes

| Failure | Behavior |
|---|---|
| Blocker not yet `done` | Refuse with `still_blocked` reason |
| Conflict file missing | Warn, proceed with manual confirmation |
| Compatibility check fails on git_sha lookup | Treat as incompatible (fail-safe); auto-discard path |
| Partial thaw on already-thawed descendant | Skip silently |

## Tie-Ins

- **Spec:** §10.2, §13 (state machine: frozen → planned), §21.6 (compatibility check)
- **Decision Q10:** descendants only on freeze cascade — also applies to thaw cascade
- **Companion command:** `/aura-frog:plan-freeze` — produces the freeze this command reverses
- **Companion command:** `/aura-frog:plan-conflicts list` — find conflict_id linking this freeze
- **Companion command:** `/aura-frog:plan-replan` — invoked when `replan_required: true` after thaw
- **Rule:** `rules/workflow/plan-lifecycle.md` — frozen → planned transition validity
- **Rule:** `rules/workflow/conflict-arbitration-policy.md` — auto-thaw path for blocker `done` + compatible
- **Rule:** `rules/workflow/replan-thresholds.md` — budget reset on thaw
- **Agent:** `conflict-arbiter` — auto-invokes thaw on `post-execute-conflict-rescan`
