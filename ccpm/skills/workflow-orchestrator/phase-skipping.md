# Skill: Smart Phase Skipping

**Category:** Workflow Optimization
**Version:** 5.2.0
**Used By:** pm-operations-orchestrator, workflow-orchestrator

---

## Overview

Intelligently skip workflow phases that don't apply to the current task context.

---

## 1. Phase Skip Rules

| Condition | Skip Phases | Reason |
|-----------|-------------|--------|
| Backend-only task | Phase 3 (UI) | No UI to design |
| Prototype/POC requested | Phase 4, 5a | Quick validation |
| "No tests" explicitly stated | Phase 4, 5a | User preference |
| Bug fix (small) | Phase 2, 3, 4 | Direct to implementation |
| Documentation only | Phase 3, 4, 5 | No code changes |
| Config change only | Phase 2, 3, 4, 5a | Simple update |

---

## 2. Detection Logic

### Backend-Only Indicators
```
Keywords: API, endpoint, service, database, migration, cron, queue
File patterns: /services/, /api/, /models/, /migrations/
No mention of: UI, screen, component, page, form, button
```

### Prototype Indicators
```
Keywords: POC, prototype, spike, experiment, quick test
Phrases: "just want to try", "proof of concept", "see if it works"
```

### Bug Fix Indicators
```
Keywords: bug, fix, broken, not working, error, crash
Scope: Single file, specific function, known cause
```

---

## 3. Skip Confirmation Format

When skipping phases, always confirm with user:

```markdown
## Phase Skip Recommendation

Based on your task: **[task description]**

**Detected context:** Backend-only API endpoint

**Proposed workflow:**
- Phase 1: Understand ✅
- Phase 2: Design ✅
- Phase 3: UI Breakdown ⏭️ *Skipped (no UI)*
- Phase 4: Plan Tests ✅
- Phase 5: Implementation ✅
- Phase 6-9: Review → Document ✅

**Approve this workflow?** (or request changes)
```

---

## 4. Skip Combinations

### Full Workflow (Default)
All 9 phases - complex features with UI

### Backend Feature
```
Phase 1 → Phase 2 → Phase 4 → Phase 5 → Phase 6-9
Skip: Phase 3 (UI)
```

### Quick Prototype
```
Phase 1 → Phase 2 → Phase 5b → Phase 6
Skip: Phase 3, 4, 5a, 5c, 7, 8, 9
```

### Bug Fix
```
Phase 1 (brief) → Phase 5b → Phase 6 → Phase 7
Skip: Phase 2, 3, 4, 5a, 5c, 8, 9
```

### Documentation Only
```
Phase 1 → Phase 8 → Phase 9
Skip: Phase 2-7
```

### Config/Environment
```
Phase 1 → Phase 5b → Phase 7
Skip: Phase 2, 3, 4, 5a, 5c, 6, 8, 9
```

---

## 5. Override Rules

User can always override:
- "Include tests" → Re-enable Phase 4, 5a
- "Full workflow" → No skipping
- "Skip review" → Skip Phase 6 (not recommended)

---

## 6. Decision Tree

```
Is there UI involved?
├── No → Skip Phase 3
└── Yes → Include Phase 3

Is this a prototype/POC?
├── Yes → Skip Phase 4, 5a
└── No → Include tests

Is this a simple bug fix?
├── Yes → Skip Phase 2, 3, 4
└── No → Full planning

Is this documentation only?
├── Yes → Jump to Phase 8
└── No → Continue workflow
```

---

## 7. Logging Skipped Phases

```markdown
## Workflow Log

**Task:** Add user authentication API
**Skipped Phases:**
- Phase 3 (UI Breakdown): No UI components in scope
- Phase 5c (Refactor): Deferred to tech debt sprint

**Rationale:** Backend-only feature, clean implementation
```

---

## Best Practices

### Do's
- Confirm skip decisions with user
- Log skipped phases with reasons
- Allow user override
- Maintain minimum quality (Phase 6, 7)
- Re-evaluate if scope changes

### Don'ts
- Skip Phase 1 (always understand first)
- Skip Phase 6 for production code
- Auto-skip without user awareness
- Skip tests without explicit request
- Skip documentation for public APIs

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
