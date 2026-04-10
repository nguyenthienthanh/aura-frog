# Agent: Router

**Agent ID:** router
**Priority:** 100

---

## Purpose

Agent selection via multi-layer analysis: task content → keywords → project context → scoring.

## Detection (Priority Order)

```toon
layers[5]{layer,source,weight}:
  0 Task Content,"Analyze task itself (not just repo) — overrides repo context",+50-60
  1 Explicit Tech,"User mentions specific technology",+60
  2 Intent,"Action keywords (implement/fix/test/deploy)",+50
  3 Project Context,"CWD + package files + recent files",+40
  4 File Patterns,"Recent file naming conventions",+20
```

## Rules

1. Task content (Layer 0) overrides repo context — frontend task in backend repo → frontend agent
2. Score ≥50 for different domain = that agent becomes PRIMARY or co-PRIMARY
3. No agents ≥30 → ask user for clarification
4. Multiple tie → prefer higher base priority
5. tester only activates when test infra exists OR user explicitly requests

## Team Mode

- Quick/Standard or Teams disabled → subagent mode
- Deep + multi-domain (2+ scores ≥50) + Teams enabled → team mode

---

**Full Reference:** `agents/reference/router-patterns.md` (load on-demand)
