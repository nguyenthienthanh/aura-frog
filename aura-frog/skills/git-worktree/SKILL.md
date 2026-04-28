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
user-invocable: false
---

# Git Worktree Integration

Auto-create git worktree when starting a workflow. All changes on isolated branch. Discard on failure -- zero damage to main.

---

## When to Use

- **Auto:** `/run` when `AF_WORKTREE=true`
- **Manual:** User says "use a worktree"
- **Skip:** Quick fixes, config changes, single-file edits

---

## Lifecycle

```toon
worktree_lifecycle[5]{event,action}:
  run:start,"git worktree add .worktrees/[id] -b af/[id]"
  Phase 1 approved,All edits in worktree directory
  Phase 5 complete,"Offer: merge / create PR / keep branch / discard"
  run:cancel,"git worktree remove .worktrees/[id]"
  run failed,Discard worktree — main untouched
```

---

## Configuration

```bash
export AF_WORKTREE=true
export AF_WORKTREE_DIR=".worktrees"  # default
```

Add `.worktrees/` to `.gitignore`.

---

## Safety

```toon
safety[4]{rule,reason}:
  Never force-delete with uncommitted changes,User may lose work
  Always offer merge/PR/keep/discard,User decides
  Auto-discard only on explicit cancel/failure,Don't assume
  Checkpoint commits before discarding,Last chance to recover
```

Works with `phase-checkpoint.cjs` -- checkpoints are commits on worktree branch, main never affected until explicit merge.

---
