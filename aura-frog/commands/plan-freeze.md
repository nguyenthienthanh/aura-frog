# /aura-frog:plan-freeze

**Manually freeze a plan node.** Cascades to descendants only (not siblings) per spec §13.1.

---

## Usage

```
/aura-frog:plan-freeze <NODE_ID> [reason]                # freeze with optional reason
/aura-frog:plan-freeze <NODE_ID> --conflict <CONFLICT-ID>  # link to detected conflict
/aura-frog:plan-freeze --active                          # freeze the active.task node
```

## Protocol (imperative)

1. **Resolve target.** If `--active`, read `.aura/plans/active.json` and pick `active.task`. Refuse if no node specified.
2. **Validate current status.** Refuse if status is `done` or `archived` (terminal states cannot freeze).
3. **Refuse if already frozen** (no-op; print existing `freeze_reason` and `frozen_at` instead).
4. **Save checkpoint** (per `rules/workflow/checkpoint-discipline.md`) before status mutation.
5. **Confirm with user** (skip with `--force`). Show:
   - Node ID + current status + intent (≤120 chars)
   - List of descendants that will cascade-freeze
   - Reason (if provided) or prompt for one
6. **Mutate frontmatter** on confirmation:
   ```yaml
   status: frozen
   freeze_reason: <reason or "manual">
   frozen_at: <ISO-8601>
   frozen_by: user
   conflict_id: <CONFLICT-ID or null>
   freeze_propagated_to: [<descendant ids>]
   ```
7. **Cascade to descendants.** For each descendant T4/T3 (depth-first), set:
   ```yaml
   status: frozen
   frozen_by_ancestor: <NODE_ID>
   ```
8. **Append history.jsonl** events: one `event: freeze_applied` for the target + one `event: freeze_cascaded` per descendant.
9. **Render** summary: `<NODE_ID> + N descendants frozen`.

## What freezes propagate to (spec §13.1)

- **Descendants only** (decision Q10): T4 children freeze when parent T3 freezes; T3 grandchildren freeze when T2 freezes.
- **NOT siblings**: a frozen task does NOT cause its siblings to freeze.
- **NOT ancestors**: freezing a T4 does not freeze the parent T3.

## Forbidden states for freeze

- `done` — already finished; no execution to halt
- `archived` — terminal; cannot transition further
- `discarded` — already removed from active set

## Failure modes

| Failure | Behavior |
|---|---|
| Node not found | Refuse with file-listing of plan tree |
| Already frozen | Print existing freeze info, exit 0 |
| Mid-mutation crash | Checkpoint preserved; partial state via plan-validator can detect |
| Reason missing on a forbidden context | Refuse — freeze without reason is forbidden by `conflict-arbitration-policy.md` |

## Tie-Ins

- **Spec:** §13.1 (freeze cascade), §10.2 (manual commands)
- **Decision Q10:** descendants only, not siblings
- **Companion command:** `/aura-frog:plan-thaw` — reverses freeze
- **Companion command:** `/aura-frog:plan-conflicts list` — shows all CONFLICT-NNNNN records and which freezes they triggered
- **Rule:** `rules/workflow/plan-lifecycle.md` — frozen state semantics
- **Rule:** `rules/workflow/conflict-arbitration-policy.md` — auto-freeze paths (vs. manual)
- **Rule:** `rules/workflow/checkpoint-discipline.md` — pre-mutation checkpoint
- **Agent:** `conflict-arbiter` — auto-invokes the same mutation logic from detected conflicts
