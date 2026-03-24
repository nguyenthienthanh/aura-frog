# Skill: Project Planning

**Category:** PM Expert
**Version:** 1.0.0
**Used By:** lead

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

## 2. Test RED (Phase 2)
├── 2.1 Write failing tests
├── 2.2 Define test cases
└── 2.3 Verify tests fail

## 3. Build GREEN (Phase 3)
├── 3.1 Implement to pass tests
├── 3.2 Meet coverage threshold
└── 3.3 Linter clean
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
| 1 | Understand + Design | 10h | Day 1 | Day 2 | ✅ |
| 2 | Test RED | 8h | Day 3 | Day 4 | 🔄 |
| 3 | Build GREEN | 16h | Day 4 | Day 6 | ⏳ |
| 4 | Refactor + Review | 6h | Day 6 | Day 7 | ⏳ |
| 5 | Finalize | 4h | Day 7 | Day 8 | ⏳ |

**Total:** 44 hours (~7-8 days with buffer)
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

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
