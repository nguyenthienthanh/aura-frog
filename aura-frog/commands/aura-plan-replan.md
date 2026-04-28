# /aura:plan:replan &lt;id&gt;

**Force replan of a node and all descendants.** Increments revision, decrements replan_budget.

---

## Usage

```
/aura:plan:replan TASK-00101                    # Replan single task
/aura:plan:replan STORY-0042                    # Replan story (descendants discarded)
/aura:plan:replan FEAT-A --reason "discovered X"  # With justification
/aura:plan:replan TASK-00101 --avoid src/auth.py  # Constrain replan
```

## Protocol

1. **Validate** target ID exists; abort if not found.
2. **Check `replan_budget`** — if `replan_count >= replan_budget`, escalate to user before proceeding.
3. **Snapshot** current node + descendants → `.aura/plans/checkpoints/<id>.R-<timestamp>.json`.
4. **Mark descendants** as `status: discarded` (preserves IDs but excludes from active flow).
5. **Increment** target node's `revision` and `replan_count`.
6. **Dispatch** to replanner agent (Milestone B+) OR escalate to user with template (Milestone A).
7. **Append history.jsonl:** `event: replan` with reason, scope, signals.
8. **Render** new tree showing what changed.

## Constraints

- Cannot replan `status: done` (use `/aura:plan:undo` first to revert)
- Cannot replan `status: archived`
- Replan does NOT delete nodes — descendants get `discarded`, preserve in archive after acceptance
- Each replan counts toward parent's `replan_budget` if escalated upward

## Tie-Ins

- **Spec:** §10.1, §16 (replan decision engine), §17 (checkpoints)
- **Agent:** replanner (Milestone B — full implementation)
- **Companion:** `/aura:plan:undo` — revert the replan
