# Rule: Checkpoint Discipline

**Priority:** High
**Applies To:** master-planner before any plan-tree mutation; `/aura:plan:undo` consumer

---

## Core Principle

**Every plan-tree mutation is preceded by a checkpoint snapshot. `/aura:plan:undo` restores the latest checkpoint.**

Reversibility is not optional — it's the safety net that lets master-planner make autonomous decisions in Milestone B+.

---

## When to checkpoint

Before applying any of these mutations:

1. Status transition that changes more than `frontmatter.updated_at` (e.g., `planned → active`, `active → frozen`)
2. `revision` increment caused by content edit
3. Children list reorder, add, or remove
4. Replanner-applied proposals
5. `/aura:plan:archive` runs (Milestone C)
6. `/aura:plan:promote` tier change

NOT checkpointed (cosmetic):

- Trace/history append-only writes (no rollback semantics)
- Reading nodes (no mutation)
- Counter increments in `.counters.json`

---

## Checkpoint format

Path: `.aura/plans/checkpoints/{NODE_ID}.{R-ISO-8601}.json`

```json
{
  "checkpoint_id": "TASK-00101.R-2026-04-29T14:30:00Z",
  "node_id": "TASK-00101",
  "captured_at": "2026-04-29T14:30:00Z",
  "captured_by": "master-planner",
  "trigger": "status_transition",
  "trigger_detail": "active → frozen (replan_budget_exhausted)",
  "node_state_before": {
    "frontmatter": { ... full YAML ... },
    "body_sha256": "abc123...",
    "body": "... full markdown body ..."
  },
  "siblings_state_before": [
    { "node_id": "TASK-00102", "status": "planned", "revision": 1 }
  ],
  "parent_children_before": ["TASK-00101", "TASK-00102", "TASK-00103"]
}
```

---

## Retention

```toon
retention[3]{rule,limit}:
  per_node,5,"keep last 5 checkpoints per node"
  age_cap,30 days,"checkpoints older than 30 days are pruned"
  size_cap,50 MB,".aura/plans/checkpoints/ total"
```

Pruning runs in `/aura:plan:archive` (lazy, not a daemon). Manual: `aura-frog/scripts/plans/prune-checkpoints.sh` (Milestone C).

---

## Restore semantics

`/aura:plan:undo {NODE_ID}` (or `--active` for active node):

1. Find latest `.aura/plans/checkpoints/{NODE_ID}.*.json` (lexicographic max — ISO timestamps sort correctly)
2. Refuse if file count == 0 → "no checkpoint exists; nothing to undo"
3. Compute current `node_state_now` (frontmatter + body_sha256)
4. If `node_state_now` matches `node_state_before` → no-op, report "already at checkpoint"
5. Replace node file with `node_state_before.body + frontmatter`
6. Restore parent's `children` if `parent_children_before` differs
7. Append history.jsonl: `event: undo_restored`, with `restored_from: <checkpoint_id>`
8. Do NOT delete the checkpoint (so `/aura:plan:undo` is itself idempotent)

---

## Multi-step undo

Each `/aura:plan:undo` restores ONE checkpoint. To undo further, the user runs `/aura:plan:undo` again (LIFO order). After 5 undos (the retention cap), older checkpoints are gone.

---

## Anti-patterns

- **Checkpointing on every read** — only mutations need checkpoints (read-mostly is huge — would explode storage)
- **Mutating without checkpoint** — master-planner MUST checkpoint first; tested in invariant-CI (Milestone E)
- **Restoring across `archived` boundary** — archived nodes don't restore (they're terminal)
- **Hand-editing checkpoint JSON** — never; it's an opaque dump

---

## Failure modes

| Failure | Behavior |
|---------|----------|
| Disk full when writing checkpoint | Refuse mutation; emit `event: checkpoint_failed` |
| Checkpoint JSON corrupt at undo time | Try previous checkpoint; if all corrupt, refuse and escalate |
| Multiple concurrent mutations on same node | First-writer-wins via .counters.json lock; second is rejected |

---

## Tie-Ins

- **Spec:** §11.3 (checkpoint), §15 (storage)
- **Agent:** `master-planner` — only writer of checkpoints
- **Command:** `/aura:plan:undo` — only consumer
- **Rule:** `rules/workflow/replan-thresholds.md` — replan-triggered checkpoints
- **Rule:** `rules/workflow/plan-lifecycle.md` — status-transition triggered checkpoints
- **Script:** `aura-frog/scripts/plans/prune-checkpoints.sh` (Milestone C)
