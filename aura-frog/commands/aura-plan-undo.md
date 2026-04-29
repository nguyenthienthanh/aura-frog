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
5. **Compute current state.** Read the node file, hash body, capture frontmatter. Read `git rev-parse HEAD` and `git status --porcelain`.
6. **No-op detection.** If current node state matches `node_state_before` AND current `git_sha` matches checkpoint's `git_sha` → print `already at checkpoint state` and exit 0.
7. **Detect git divergence.** If checkpoint has `git_sha` and current `HEAD != git_sha`, mark `requires_git_reset: true` for step 8.
8. **Confirm with user** (skip if `--force`). Show:
   - Checkpoint timestamp + trigger
   - One-line plan-tree diff summary (status before → after, lines changed)
   - Children list before/after if differs
   - **If `requires_git_reset: true`:** show `git diff --stat <git_sha>..HEAD` (file change blast radius). If checkpoint had `git_dirty: false` but current tree IS dirty → bold WARNING that uncommitted changes will be lost.
9. **On confirmation OR `--dry-run` (preview only):**
   - If `--dry-run`: print restore plan (plan-tree changes + git changes if any), exit 0 (no writes).
   - Else, in order:
     a. **Restore plan tree** — write `node_state_before.body + frontmatter` to the node file. Restore parent's `children` array if `parent_children_before` differs from current parent.
     b. **Restore git state** (per spec §17.2 step 2) — if `requires_git_reset: true`:
        - Run `git reset --hard <checkpoint.git_sha>` ONLY after explicit user confirmation
        - If checkpoint also tracked a different branch (`git_branch`), warn and refuse (cross-branch undo is unsupported in alpha.2)
10. **Append history.jsonl** event with both plan and git state:
    ```json
    {"ts":"<ISO>","node":"<NODE_ID>","event":"undo_restored","restored_from":"<checkpoint_id>","git_reset_to":"<sha or null>","actor":"master-planner"}
    ```
11. **Do NOT delete the checkpoint** — leaves `/aura:plan:undo` itself idempotent (re-running on same state is a no-op per step 6).
12. **Render** the post-undo node summary: `id, status, revision, children_count` and (if git was reset) `git: HEAD now at <git_sha>`.

## Multi-step undo

LIFO — call again to undo further. Retention cap is 5 checkpoints per node (per `checkpoint-discipline.md`); after 5 undos older history is gone.

## What can be undone

- Status transitions caused by master-planner / replanner
- `revision` increments from content edits made by feature-architect / story-planner
- Children list reorder, add, remove
- Replanner-applied proposals
- `/aura:plan:promote` tier change
- **File mutations on tracked git branch** — via `git reset --hard <git_sha>` from checkpoint (with explicit user confirmation)

## What CANNOT be undone

- Trace appends or history.jsonl entries (append-only by design)
- Archived nodes — `archived` is terminal (per `plan-lifecycle.md`)
- Mutations older than 5 checkpoints (or 30 days, whichever comes first)
- Cross-branch undo — checkpoint records `git_branch`; refuses if current branch differs (unsupported in alpha.2)
- Untracked files — `git reset` only affects tracked changes; untracked files persist
- Uncommitted work when checkpoint had `git_dirty: false` but current tree is dirty — user must stash first or accept loss

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
