# /aura:plan:undo

**Revert the last master-planner decision.** Restores plan state from checkpoint.

---

## Usage

```
/aura:plan:undo                                  # revert most recent decision
/aura:plan:undo --to-event TR-00101-003          # revert to specific trace event (Milestone B+)
/aura:plan:undo --dry-run                        # preview without applying
```

## Protocol

1. **Read** the most recent entry in `.aura/plans/history.jsonl`.
2. **Surface to user:** what's being undone (decision, file changes, plan state) — REQUIRE confirmation since this is destructive.
3. On confirm:
   - **If decision touched files:** `git reset --hard <git_sha>` from checkpoint (warn — irreversible)
   - **If decision was plan-only:** restore `.aura/plans/active.json` from snapshot
   - **Decrement `revision`** on affected nodes
   - **Append history.jsonl:** `event: undo` with target decision ID, files reverted, plan diff
4. **Render** plan tree showing post-undo state.

## What can be undone

- Last `replan` (restores discarded children)
- Last `expand` (removes generated children, decrements counter)
- Last `promote` (removes discovery from target node)
- Last `archive` (un-archives — moves files back, status: done)
- Last `task_dispatch` (sets task back to `planned`, clears active.task)

## What CANNOT be undone

- Decisions older than the last 30 days (checkpoints pruned per §27)
- Decisions before any `archive` (archive is one-way)
- File changes not committed to git (git reset only affects committed work)
- `history.jsonl` entries themselves (append-only — undo APPENDS a new entry, never deletes)

## Constraints

- Confirmation required (irreversible if file changes involved)
- Warns clearly when git reset will discard uncommitted work
- Skip-confirm with `--force` (logs `force: true` to history)

## Tie-Ins

- **Spec:** §10.1, §17 (checkpoint discipline)
- **Companion:** `/aura:plan:replan` — replan ALSO creates a checkpoint, can be undone
- **Companion:** `/aura:trace` (Milestone B+) — `--to-event` mode uses trace events
