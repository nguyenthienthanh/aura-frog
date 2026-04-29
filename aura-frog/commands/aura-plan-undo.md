# /aura:plan:undo

**Restore the latest checkpoint** for a node. LIFO order — each invocation undoes one mutation.

---

## Usage

```
/aura:plan:undo                          # undo active node (active.task → active.story → active.feature)
/aura:plan:undo <NODE_ID>                # undo a specific node
/aura:plan:undo --dry-run                # preview without applying
/aura:plan:undo --list                   # list available checkpoints for the node
```

## Protocol (imperative)

1. **Resolve target NODE_ID.** If positional arg given, use it. Else: read `.aura/plans/active.json` and pick the deepest non-null active path member (task → story → feature). Refuse if all are null.
2. **List checkpoints.** Glob `.aura/plans/checkpoints/{NODE_ID}.*.json`. Sort lexicographically — ISO-8601 in filenames sorts correctly. Pick the latest.
3. **Refuse if no checkpoint.** Print `no checkpoint exists for {NODE_ID}; nothing to undo` and exit 0.
4. **Refuse if `--list`.** Print all matching checkpoint files (filename only, sorted desc) and exit 0.
5. **Compute current state.** Read the node file, hash body, capture frontmatter.
6. **No-op detection.** If current state matches `node_state_before` in the checkpoint → print `already at checkpoint state` and exit 0.
7. **Confirm with user** (skip if `--force`). Show:
   - Checkpoint timestamp + trigger
   - One-line diff summary (status before → after, lines changed)
   - Children list before/after if differs
8. **On confirmation OR `--dry-run` (preview only):**
   - If `--dry-run`: print restore plan, exit 0 (no writes).
   - Else: write `node_state_before.body + frontmatter` to the node file. Restore parent's `children` array if `parent_children_before` differs from current parent.
9. **Append history.jsonl** event:
   ```json
   {"ts":"<ISO>","node":"<NODE_ID>","event":"undo_restored","restored_from":"<checkpoint_id>","actor":"master-planner"}
   ```
10. **Do NOT delete the checkpoint** — leaves `/aura:plan:undo` itself idempotent (re-running on same state is a no-op per step 6).
11. **Render** the post-undo node summary: `id, status, revision, children_count`.

## Multi-step undo

LIFO — call again to undo further. Retention cap is 5 checkpoints per node (per `checkpoint-discipline.md`); after 5 undos older history is gone.

## What can be undone

- Status transitions caused by master-planner / replanner
- `revision` increments from content edits made by feature-architect / story-planner
- Children list reorder, add, remove
- Replanner-applied proposals
- `/aura:plan:promote` tier change

## What CANNOT be undone

- Code changes outside `.aura/plans/` (use git for that — undo is plan-tree-only)
- Trace appends or history.jsonl entries (append-only by design)
- Archived nodes — `archived` is terminal (per `plan-lifecycle.md`)
- Mutations older than 5 checkpoints (or 30 days, whichever comes first)

## Failure modes

| Failure | Behavior |
|---------|----------|
| Checkpoint JSON corrupt | Try the previous one; if all fail, print error and exit 1 |
| Disk full when restoring | Refuse; the in-flight node remains in current state |
| Concurrent mutation during undo | First-writer-wins via `.counters.json` advisory lock |

## Tie-Ins

- **Spec:** §10.1, §11.3 (checkpoint discipline)
- **Rule:** `rules/workflow/checkpoint-discipline.md` — defines retention, format, restore semantics
- **Rule:** `rules/workflow/plan-lifecycle.md` — forbidden transitions still apply (cannot undo into a forbidden state)
- **Agent:** `master-planner` — only writer of checkpoints (this command is the only consumer)
- **Companion:** `/aura:plan:replan` — every replan creates a checkpoint that this undoes
- **Companion:** `/aura:trace` — for code-level rollback (separate concern; this is plan-only)
