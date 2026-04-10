# Cross-Review Workflow Rules

**Category:** Workflow Quality
**Priority:** Critical
**Applies To:** Phase 1, Phase 2, Phase 4

---

## Core Principle

**Multiple agents review deliverables before proceeding to catch issues early.**

---

## Review Matrix

```toon
review_matrix[4]{phase,author,reviewers,focus}:
  Phase 1 (Requirements),PM Orchestrator,"Dev (feasibility) + QA (testability) + UI (design, if UI)",Requirements quality
  Phase 1 (Tech Planning),Lead Dev,"Secondary Dev (architecture) + QA (test feasibility)",Technical quality
  Phase 2 (Test Plan),QA Agent,Dev (implementation feasibility),Test quality
  Phase 4 (Code Review),Dev Agent(s),All active agents,Code quality
```

---

## Review Focus Areas

### Dev Review
Feasibility, clarity, scope, integration points, performance, edge cases, dependencies.

### QA Review
Measurable acceptance criteria, testability, test data, coverage achievability, quality requirements.

### Each reviewer produces
Approval status (Approved / Approved with concerns / Needs revision), key points, concerns, suggestions.

---

## Consolidation

PM Orchestrator creates summary: reviewer count, approval status, key feedback, "must address" items, then presents to user for approval.

---

## Conflict Resolution

When reviewers disagree: PM facilitates discussion → reviewers explain perspectives → team discusses trade-offs → user makes final decision.

---

## Timeline Impact

```toon
time_impact[3]{phase,added_time}:
  Phase 1,+50 min
  Phase 2,+15 min
  Phase 4,+30 min
```

Total: ~65 minutes added. Quality improvement: significant.

---

## Team Mode (Agent Teams)

When `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`: reviews happen in parallel via teammate messaging (~60% faster).

```toon
team_savings[3]{phase,sequential,team_mode,savings}:
  Phase 1,185 min,80 min,57%
  Phase 2,75 min,35 min,53%
  Phase 4,120 min,40 min,67%
```

Fallback: Without Agent Teams, standard sequential review applies.

---
