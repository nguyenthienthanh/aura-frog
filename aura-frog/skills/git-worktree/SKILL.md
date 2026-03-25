---
name: git-worktree
description: "Auto-create git worktrees for workflows. Isolate changes, merge on success, discard on failure."
autoInvoke: false
priority: medium
triggers:
  - "workflow:start"
  - "worktree"
  - "isolated branch"
allowed-tools: Bash, Read, Write
---

# Git Worktree Integration

**Priority:** MEDIUM — Enhances workflow safety

---

## Purpose

Automatically create a git worktree when starting a workflow, so all changes happen on an isolated branch. If the workflow fails, discard the worktree — zero damage to the main codebase.

---

## When to Use

- **Auto-activate:** When `workflow:start` is called and `AF_WORKTREE=true` is set
- **Manual:** User says "use a worktree" or "work in isolation"
- **Skip:** Quick bug fixes, config changes, single-file edits

---

## Workflow Integration

```toon
worktree_lifecycle[5]{event,action}:
  workflow:start,"Create worktree: git worktree add .worktrees/[workflow-id] -b af/[workflow-id]"
  Phase 1 approved,"Worktree ready — all edits happen in worktree directory"
  Phase 5 complete,"Offer: merge to main / create PR / keep branch / discard"
  workflow:cancel,"Discard worktree: git worktree remove .worktrees/[workflow-id]"
  workflow failed,"Discard worktree — main branch untouched"
```

---

## Commands

### Create Worktree (at workflow start)

```bash
WORKFLOW_ID="$1"
BRANCH_NAME="af/$WORKFLOW_ID"
WORKTREE_DIR=".worktrees/$WORKFLOW_ID"

# Create worktree on new branch from current HEAD
git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME"

echo "Created worktree: $WORKTREE_DIR (branch: $BRANCH_NAME)"
```

### Complete Worktree (at Phase 5)

```bash
WORKFLOW_ID="$1"
WORKTREE_DIR=".worktrees/$WORKFLOW_ID"
BRANCH_NAME="af/$WORKFLOW_ID"

# Options presented to user:
# 1. Merge to current branch
git merge "$BRANCH_NAME"
git worktree remove "$WORKTREE_DIR"
git branch -d "$BRANCH_NAME"

# 2. Create PR
gh pr create --head "$BRANCH_NAME" --title "[Aura Frog] $WORKFLOW_ID"

# 3. Keep branch (manual merge later)
git worktree remove "$WORKTREE_DIR"
echo "Branch $BRANCH_NAME kept. Merge manually when ready."

# 4. Discard
git worktree remove "$WORKTREE_DIR" --force
git branch -D "$BRANCH_NAME"
```

### Discard Worktree (on cancel/failure)

```bash
WORKFLOW_ID="$1"
WORKTREE_DIR=".worktrees/$WORKFLOW_ID"
BRANCH_NAME="af/$WORKFLOW_ID"

if [ -d "$WORKTREE_DIR" ]; then
  git worktree remove "$WORKTREE_DIR" --force
  git branch -D "$BRANCH_NAME" 2>/dev/null
  echo "Discarded worktree: $WORKTREE_DIR"
fi
```

---

## Configuration

```bash
# Enable in .envrc or settings
export AF_WORKTREE=true          # Enable worktree for workflows
export AF_WORKTREE_DIR=".worktrees"  # Custom worktree directory (default: .worktrees)
```

Add to `.gitignore`:
```
.worktrees/
```

---

## Safety Rules

```toon
safety[4]{rule,reason}:
  Never force-delete worktrees with uncommitted changes,User may lose work
  Always offer merge/PR/keep/discard options,User decides what to do with changes
  Auto-discard only on explicit cancel or workflow failure,Don't assume
  Checkpoint commits before discarding,Last chance to recover
```

---

## Integration with Phase Checkpoints

Works with `phase-checkpoint.cjs`:
- Checkpoints are commits on the worktree branch
- Rollback reverts to checkpoint on the worktree branch
- Main branch is never affected until explicit merge

---

