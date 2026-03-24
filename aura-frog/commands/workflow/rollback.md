# Command: workflow:rollback

**Category:** Workflow
**Priority:** Medium
**Syntax:** `workflow:rollback [phase]`

---

## Purpose

Revert to a checkpoint created before a specific phase. Uses git commits created by `phase-checkpoint.cjs`.

---

## Usage

```bash
# Rollback to before Phase 3 (undo Build GREEN)
workflow:rollback 3

# Rollback to before Phase 2 (undo Test RED)
workflow:rollback 2

# Show available checkpoints
workflow:rollback --list
```

---

## Execution

### List Checkpoints

```bash
git log --oneline --grep="\[aura-frog\] checkpoint" | head -5
```

### Rollback to Checkpoint

```bash
PHASE="$1"

# Find the checkpoint commit
CHECKPOINT=$(git log --oneline --grep="\[aura-frog\] checkpoint: pre-phase-$PHASE" -1 --format="%H")

if [ -z "$CHECKPOINT" ]; then
  echo "No checkpoint found for phase $PHASE"
  exit 1
fi

# Show what will be reverted
echo "Rolling back to: [aura-frog] checkpoint: pre-phase-$PHASE"
echo "Commits to revert:"
git log --oneline "$CHECKPOINT"..HEAD

# Confirm with user before proceeding
echo ""
echo "This will revert all changes since pre-phase-$PHASE."
echo "Proceed? [y/N]"
```

**After user confirms:**
```bash
git reset --hard "$CHECKPOINT"
echo "Rolled back to pre-phase-$PHASE checkpoint"
```

---

## Safety

- Always show what will be reverted before executing
- Require explicit user confirmation
- If on a worktree branch, rollback is safe (main untouched)
- If on main branch, warn user about destructive reset

---

