# /aura-frog:plan-next

**Return and activate the next ready T4 task.** Alias for `/aura-frog:plan next` (v3.7.2+).

---

## Usage

```
/aura-frog:plan-next
```

## Delegation

```bash
bash aura-frog/scripts/plans/next-task.sh [--plans-dir <path>] [--dry-run]
```

The script pops `active.json#ready_queue` (refilling from active T3 if empty — collect T4 children with `status: planned` AND all `depends_on` in `{done, active}`), mutates the task to `status: active`, sets `active.task`, and appends `history.jsonl event=next`.

Then surface to the user: `Next ready: <TASK-ID> (<intent>). To execute: /aura-frog:run <one-line description> — auto-anchors via the Run ↔ Plan bridge.`

Full protocol in `commands/plan.md`. Frozen tasks are excluded — thaw via `/aura-frog:plan thaw` first.

**Deprecation timeline:** soft-deprecated v3.7.2, warning v4.0, removed v5.0.
