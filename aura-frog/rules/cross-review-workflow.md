# Cross-Review Workflow Rules

**Category:** Workflow Quality  
**Priority:** Critical  
**Applies To:** Phase 1 (Understand + Design), Phase 2 (Test RED), Phase 4 (Refactor + Review)

---

## Overview

Cross-review ensures quality by having multiple agents review deliverables before proceeding. This catches issues early and improves overall quality.

---

## Phase 1: Requirements & Design Review (Understand + Design)

### Who Reviews?

**Primary Author:** PM Orchestrator  
**Reviewers:**
1. **Dev Agent(s)** - Technical feasibility review
2. **QA Agent** - Testability and acceptance criteria review
3. **UI Designer** - Design requirements review (if UI involved)

### Review Process

```markdown
┌─────────────────────────────────────────┐
│  Phase 1: Requirements Analysis         │
│  (PM Orchestrator creates document)     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CHECKPOINT 1: Dev Technical Review     │
│  Duration: 10-15 minutes                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CHECKPOINT 2: QA Testability Review    │
│  Duration: 10-15 minutes                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CHECKPOINT 3: UI Design Review         │
│  Duration: 10 minutes (if applicable)   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Consolidate Feedback                   │
│  (PM Orchestrator)                      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Present to User for Approval           │
└─────────────────────────────────────────┘
```

### Dev Technical Review Checklist

**Dev Agent reviews for:**

```markdown
## Dev Technical Review - Requirements Analysis

**Reviewer:** [mobile-react-native / web-vuejs / backend-laravel]  
**Review Date:** [Date]

### Technical Feasibility ✅/❌
- [ ] Requirements are technically achievable
- [ ] Technology stack is appropriate
- [ ] Integration points are clearly defined
- [ ] Performance requirements are realistic
- [ ] No conflicting requirements

### Clarity & Completeness ✅/❌
- [ ] Technical requirements are clear
- [ ] Edge cases are identified
- [ ] Data flow is understood
- [ ] API contracts are defined (if applicable)
- [ ] Error scenarios are covered

### Scope & Estimation ✅/❌
- [ ] Scope is well-defined
- [ ] Breaking into subtasks is possible
- [ ] Dependencies are identified
- [ ] Complexity is reasonable

### Technical Concerns ⚠️
[List any technical concerns or risks]

### Suggestions 💡
[Provide technical suggestions or alternatives]

### Approval Status
- [ ] ✅ Approved - Ready to proceed
- [ ] ⚠️ Approved with minor concerns
- [ ] ❌ Needs revision - Major issues found

**Comments:**
[Additional feedback]
```

### QA Testability Review Checklist

**QA Agent reviews for:**

```markdown
## QA Testability Review - Requirements Analysis

**Reviewer:** qa-automation  
**Review Date:** [Date]

### Acceptance Criteria Quality ✅/❌
- [ ] Acceptance criteria are measurable
- [ ] Success criteria are clearly defined
- [ ] Edge cases are documented
- [ ] Error scenarios are specified
- [ ] No ambiguous requirements

### Testability ✅/❌
- [ ] Requirements are testable
- [ ] Test data requirements are clear
- [ ] Test environments are identified
- [ ] Testing approach is feasible
- [ ] Automation is possible

### Quality Requirements ✅/❌
- [ ] Performance criteria defined
- [ ] Security requirements specified
- [ ] Accessibility requirements stated
- [ ] Cross-browser/device requirements clear
- [ ] Data validation rules defined

### Test Coverage Concerns ⚠️
[Areas that may be difficult to test]

### Testing Suggestions 💡
[Recommendations for better testability]

### Approval Status
- [ ] ✅ Approved - Testable as-is
- [ ] ⚠️ Approved with test strategy notes
- [ ] ❌ Needs revision - Not testable

**Comments:**
[Additional feedback]
```

### Consolidation & User Approval

After all reviews, PM Orchestrator creates summary:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: Requirements Analysis - Review Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Review Summary

**Total Reviewers:** 3
**Status:** ✅ 3 Approved, ⚠️ 0 With Concerns, ❌ 0 Rejected

---

### Dev Review (mobile-react-native)
**Status:** ✅ Approved  
**Key Points:**
- Technical approach is sound
- Zustand for state management
- React Query for API calls
- Estimated 8 story points

**Concerns:** None

---

### QA Review (qa-automation)
**Status:** ✅ Approved  
**Key Points:**
- Acceptance criteria are testable
- Can achieve 85% coverage target
- E2E tests feasible with Detox

**Concerns:** None

---

### UI Design Review (ui-expert)
**Status:** ⚠️ Approved with notes  
**Key Points:**
- Figma designs available
- Design tokens extracted
- Responsive requirements clear

**Concerns:**
- Need tablet layout clarification
- Dark mode specs missing

---

## Consolidated Feedback

**Must Address:**
- Clarify tablet layout requirements
- Add dark mode specifications

**Nice to Have:**
- Consider offline mode support
- Add analytics tracking

---

## Updated Requirements Document

[Updated PHASE_1_REQUIREMENTS_ANALYSIS.md with feedback incorporated]

---

✋ **APPROVAL REQUIRED**: Phase 1 Complete

**Options:**
- "approve" → Proceed to Phase 2 (Test RED)
- "reject: [reason]" → Revise requirements
- "modify: [changes]" → Request specific changes
```

---

## Phase 1 (continued): Technical Planning Review

### Who Reviews?

**Primary Author:** Lead Dev Agent  
**Reviewers:**
1. **Secondary Dev Agent(s)** - Architecture review (if multi-platform)
2. **QA Agent** - Test planning feasibility

### Review Process

```markdown
┌─────────────────────────────────────────┐
│  Phase 2: Test RED                      │
│  (Lead Dev Agent creates tech spec)     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CHECKPOINT 1: Secondary Dev Review     │
│  Duration: 15-20 minutes                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CHECKPOINT 2: QA Feasibility Review    │
│  Duration: 10-15 minutes                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Consolidate & Update Tech Spec         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Present to User for Approval           │
└─────────────────────────────────────────┘
```

### Secondary Dev Review Checklist

```markdown
## Secondary Dev Review - Technical Planning

**Primary Author:** [Lead dev agent]  
**Reviewer:** [Secondary dev agent]  
**Review Date:** [Date]

### Architecture Quality ✅/❌
- [ ] Architecture is sound
- [ ] Design patterns are appropriate
- [ ] Component structure is logical
- [ ] State management approach is correct
- [ ] API integration is well-designed

### Code Quality & Best Practices ✅/❌
- [ ] Follows project conventions
- [ ] Naming is clear and consistent
- [ ] Proper separation of concerns
- [ ] Reusability considered
- [ ] Performance considerations addressed

### Maintainability ✅/❌
- [ ] Code will be easy to maintain
- [ ] Proper documentation planned
- [ ] Error handling is comprehensive
- [ ] Logging/debugging considered
- [ ] Future extensibility possible

### Integration & Dependencies ✅/❌
- [ ] Dependencies are minimal
- [ ] Integration points are clear
- [ ] Backward compatibility considered
- [ ] Migration plan (if needed)

### Technical Concerns ⚠️
[List concerns]

### Alternative Approaches 💡
[Suggest alternatives if applicable]

### Approval Status
- [ ] ✅ Approved - Solid technical plan
- [ ] ⚠️ Approved with suggestions
- [ ] ❌ Needs revision - Architecture issues

**Comments:**
[Detailed feedback]
```

### QA Test Planning Feasibility Review

```markdown
## QA Review - Technical Planning Feasibility

**Reviewer:** qa-automation  
**Review Date:** [Date]

### Testability Assessment ✅/❌
- [ ] Components are testable
- [ ] Test isolation is possible
- [ ] Mocking strategy is clear
- [ ] Test data requirements addressed
- [ ] Test environment requirements clear

### Test Planning Feasibility ✅/❌
- [ ] Unit testing is straightforward
- [ ] Integration testing is feasible
- [ ] E2E testing is possible
- [ ] Performance testing can be done
- [ ] Coverage target is achievable

### Quality Assurance ✅/❌
- [ ] Error scenarios are testable
- [ ] Edge cases are covered
- [ ] Regression testing is possible
- [ ] CI/CD integration is feasible

### Testing Concerns ⚠️
[Areas that may be difficult to test]

### Test Strategy Recommendations 💡
[Suggestions for better testability]

### Approval Status
- [ ] ✅ Approved - Ready for test planning
- [ ] ⚠️ Approved with test considerations
- [ ] ❌ Needs revision - Not testable

**Comments:**
[Feedback]
```

---

## Phase 2: Test Plan Review (Test RED)

### Who Reviews?

**Primary Author:** QA Agent  
**Reviewers:**
1. **Dev Agent(s)** - Implementation feasibility review

### Review Process

```markdown
┌─────────────────────────────────────────┐
│  Phase 4: Refactor + Review             │
│  (QA Agent creates test plan)           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CHECKPOINT: Dev Implementation Review  │
│  Duration: 15 minutes                   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Update Test Plan with Dev Feedback     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Present to User for Approval           │
└─────────────────────────────────────────┘
```

### Dev Test Plan Review Checklist

```markdown
## Dev Review - Test Plan Feasibility

**Test Plan Author:** qa-automation  
**Reviewer:** [Dev agent]  
**Review Date:** [Date]

### Test Cases Accuracy ✅/❌
- [ ] Test cases match technical implementation
- [ ] Test scenarios are comprehensive
- [ ] Edge cases are covered
- [ ] Error scenarios are included
- [ ] No redundant test cases

### Implementation Feasibility ✅/❌
- [ ] Tests can be written as planned
- [ ] Mock data approach is correct
- [ ] Test environment is available
- [ ] Test fixtures are realistic
- [ ] Performance testing is feasible

### Coverage Assessment ✅/❌
- [ ] Coverage target is achievable
- [ ] Critical paths are covered
- [ ] All components are tested
- [ ] Integration points are tested
- [ ] No over-testing

### TDD Compatibility ✅/❌
- [ ] Tests can be written first (TDD RED)
- [ ] Tests will fail correctly (no false positives)
- [ ] Tests will pass when implemented (GREEN)
- [ ] Refactoring won't break tests

### Technical Concerns ⚠️
[List any concerns about test implementation]

### Suggestions 💡
- Additional test cases to consider
- Better testing approaches
- Tools or libraries to use

### Approval Status
- [ ] ✅ Approved - Ready for TDD
- [ ] ⚠️ Approved with adjustments
- [ ] ❌ Needs revision - Tests won't work

**Comments:**
[Detailed feedback]
```

---

## Cross-Review Best Practices

### Do's ✅
- ✅ Be constructive and specific
- ✅ Focus on quality, not perfection
- ✅ Provide alternatives, not just criticism
- ✅ Ask questions for clarification
- ✅ Acknowledge good decisions
- ✅ Consider project constraints
- ✅ Review within time limit

### Don'ts ❌
- ❌ Nitpick minor style issues
- ❌ Reject without explanation
- ❌ Take too long to review
- ❌ Skip the review process
- ❌ Review without understanding context
- ❌ Be overly critical
- ❌ Ignore reviewer feedback

---

## Escalation Process

### When Reviews Conflict

If reviewers disagree:

1. **PM Orchestrator** facilitates discussion
2. **Reviewers** explain their perspectives
3. **Team** discusses trade-offs
4. **User** makes final decision (if needed)

### Example:

```markdown
⚠️ **REVIEW CONFLICT DETECTED**

**Issue:** State management approach

**Dev Review (mobile-react-native):** ✅ Approved - Use Zustand  
**Dev Review (web-reactjs):** ❌ Rejected - Should use Redux for consistency

**PM Orchestrator Analysis:**
- Mobile and web are separate repos
- No shared state between platforms
- Zustand is lighter for mobile
- Redux may be overkill

**Recommendation:** Use Zustand for mobile (as planned)

**User Decision Required:**
Please choose:
1. Zustand (mobile agent recommendation)
2. Redux (web agent recommendation)
3. Alternative approach
```

---

## Timeline Impact

Cross-reviews add time but improve quality:

| Phase | Without Review | With Review | Time Added |
|-------|---------------|-------------|------------|
| Phase 1 (Understand + Design) | 135 min | 185 min | +50 min |
| Phase 2 (Test RED) | 60 min | 75 min | +15 min |
| Phase 4 (Refactor + Review) | 90 min | 120 min | +30 min |

**Total added time:** ~65 minutes  
**Quality improvement:** Significant  
**Issues caught early:** High

---

---

## Team Mode Cross-Review (Agent Teams)

**When:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled.

In team mode, cross-reviews happen **in parallel** via teammate messaging instead of sequential simulation.

### Team Review Process

```toon
team_review[4]{phase,reviewers,mechanism,time_savings}:
  Phase 1 (Understand + Design),Dev + QA + UI teammates,Parallel teammate messages,~60% faster
  Phase 1 (Tech Planning),Secondary Dev + QA teammates,Parallel teammate messages,~60% faster
  Phase 2 (Test RED),Dev teammate(s),Direct teammate message,~50% faster
  Phase 4 (Refactor + Review),All active teammates,Broadcast to team,~70% faster
```

### Teammate Review Message Format

```
From: [reviewer-teammate]
To: [author-teammate]
Subject: Phase [N] Review

**Verdict:** Approve / Request Changes / Comment

**Findings:**
1. [finding-1]
2. [finding-2]

**Suggestions:**
- [suggestion-1]
```

### Time Savings (Team vs Sequential)

| Phase | Sequential | Team Mode | Savings |
|-------|-----------|-----------|---------|
| Phase 1 (Understand + Design) | 185 min | 80 min | 57% |
| Phase 2 (Test RED) | 75 min | 35 min | 53% |
| Phase 4 (Refactor + Review) | 120 min | 40 min | 67% |
| **Total** | **380 min** | **155 min** | **59%** |

### Fallback

When Agent Teams is not enabled, standard sequential cross-review applies (no change).

---

**Applied in:** Phase 1 (Understand + Design), Phase 2 (Test RED), and Phase 4 (Refactor + Review)

