# Skill: Project Planning

**Category:** PM Expert
**Version:** 5.2.0
**Used By:** pm-operations-orchestrator

---

## Overview

Plan, schedule, and coordinate project activities within scope, time, and quality constraints.

---

## 1. Scope Definition

```markdown
# Project Scope: [Feature Name]

## In Scope ✅
- [Feature 1]
- [Feature 2]

## Out of Scope ❌
- [Excluded item 1] (Phase 2)
- [Excluded item 2] (Future)

## Assumptions
- [Assumption 1]
- [Assumption 2]

## Constraints
- Timeline: [X weeks]
- Team: [N developers]
- Platform support: [versions]
```

---

## 2. Work Breakdown Structure

```markdown
## 1. Requirements (Phase 1)
├── 1.1 Stakeholder interviews
├── 1.2 Documentation
└── 1.3 Acceptance criteria

## 2. Technical Planning (Phase 2)
├── 2.1 Architecture design
├── 2.2 Component breakdown
└── 2.3 API planning

## 3. Implementation (Phase 5)
├── 5.1 TDD RED: Failing tests
├── 5.2 TDD GREEN: Implementation
└── 5.3 TDD REFACTOR: Optimization
```

---

## 3. Estimation

**See:** `skills/pm-expert/estimation.md` for full estimation guide.

Quick reference: Story Points (1-13), T-Shirt Sizing (XS-XL), Three-Point Estimation.

---

## 4. Timeline Template

```markdown
# Project Timeline: [Feature]

| Phase | Task | Est | Start | End | Status |
|-------|------|-----|-------|-----|--------|
| 1 | Requirements | 4h | Day 1 | Day 1 | ✅ |
| 2 | Design | 6h | Day 1 | Day 2 | ✅ |
| 3 | UI Breakdown | 2h | Day 2 | Day 2 | ✅ |
| 4 | Test Planning | 3h | Day 2 | Day 2 | 🔄 |
| 5a | Write Tests | 8h | Day 3 | Day 4 | ⏳ |
| 5b | Implementation | 16h | Day 4 | Day 6 | ⏳ |
| 5c | Refactor | 4h | Day 6 | Day 6 | ⏳ |
| 6 | Code Review | 2h | Day 7 | Day 7 | ⏳ |
| 7 | QA Validation | 4h | Day 7 | Day 8 | ⏳ |
| 8 | Documentation | 2h | Day 8 | Day 8 | ⏳ |

**Total:** 51 hours (~7-8 days with buffer)
```

---

## 5. Progress Tracking

```markdown
# Sprint Progress: Week [N]

## Velocity
- Planned: 21 points
- Completed: 18 points
- Velocity: 86%

## Task Status
- ✅ Completed: 8
- 🔄 In Progress: 3
- ⏳ Pending: 2
- ⚠️ Blocked: 1

## Blockers
1. [Blocker description] - Owner: [Name]
```

---

## 6. Status Report Template

```markdown
# Weekly Status: [Project] - Week [N]

## Summary
[Overall progress in 2-3 sentences]

## Progress
| Phase | Status | % Complete |
|-------|--------|------------|
| Requirements | ✅ Complete | 100% |
| Design | ✅ Complete | 100% |
| Implementation | 🔄 In Progress | 60% |

## This Week
- Completed [items]

## Next Week
- Planned [items]

## Risks/Blockers
- [Risk/Blocker if any]

## Help Needed
- [Assistance required if any]
```

---

## Best Practices

### Do's ✅
- Break work into ≤1 day tasks
- Include buffer time (20%)
- Track progress daily
- Communicate blockers early
- Update estimates as you learn

### Don'ts ❌
- Create tasks > 3 days
- Skip risk assessment
- Ignore dependencies
- Pad estimates excessively
- Change scope without approval

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
