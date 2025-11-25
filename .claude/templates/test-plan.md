# Test Plan Template

**Feature:** [Feature Name]  
**Date:** [Date]  
**Test Lead:** QA Automation Agent

---

## Test Strategy

### Scope
- In scope: [List features]
- Out of scope: [List exclusions]

### Test Types
- [ ] Unit tests (60%)
- [ ] Integration tests (30%)
- [ ] E2E tests (10%)

### Coverage Goal
**Target:** 85%

---

## Test Environment

- **Device:** iPhone 14, iPad Pro, Android Pixel
- **OS:** iOS 16+, Android 12+
- **Network:** Wi-Fi, 4G
- **Test Data:** Staging environment

---

## Test Cases Summary

| ID | Category | Priority | Count |
|----|----------|----------|-------|
| TC-001-015 | Component Rendering | HIGH | 15 |
| TC-016-030 | User Interactions | HIGH | 15 |
| TC-031-045 | API Integration | MEDIUM | 15 |
| TC-046-053 | Error Handling | MEDIUM | 8 |

**Total:** 53 test cases

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits | HIGH | Implement retry logic |
| Network failures | MEDIUM | Offline mode + queue |

---

## Schedule

- Test planning: Day 1
- Test writing: Days 2-3
- Test execution: Days 4-5
- Bug fixing: Day 6
- Regression: Day 7

