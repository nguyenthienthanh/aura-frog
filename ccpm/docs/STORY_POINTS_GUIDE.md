# Story Points Estimation Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-27

---

## Overview

Story points are a unit of measure for expressing the overall effort required to fully implement a feature or task. CCPM uses the Fibonacci sequence for story point estimation.

---

## Fibonacci Scale

```
1, 2, 3, 5, 8, 13, 21
```

**Why Fibonacci?**
- Reflects increasing uncertainty at higher estimates
- Forces meaningful differentiation
- Prevents false precision
- Industry standard in Agile teams

---

## Story Point Scale Reference

### 1 Point - Trivial
**Effort:** 1-2 hours
**Complexity:** Very simple, well-understood task
**Risk:** Almost none
**Examples:**
- Update text content in a file
- Add a simple CSS style
- Fix a typo in code
- Add a missing import
- Update documentation

**Characteristics:**
- No unknowns
- No dependencies
- Single file change
- No testing complexity
- Can be done in one sitting

---

### 2 Points - Simple
**Effort:** 2-4 hours
**Complexity:** Straightforward with minor complexity
**Risk:** Very low
**Examples:**
- Add a simple UI component (button, input)
- Create a basic API endpoint (CRUD)
- Write unit tests for existing function
- Simple bug fix with clear root cause
- Add form validation

**Characteristics:**
- Minor unknowns
- Few dependencies
- 2-3 file changes
- Standard patterns apply
- Requires some testing

---

### 3 Points - Moderate
**Effort:** 4-6 hours (half day)
**Complexity:** Moderate complexity with some unknowns
**Risk:** Low to medium
**Examples:**
- Implement medium-complexity UI (form with validation)
- Add API with business logic
- Integrate with existing service
- Moderate refactoring
- Bug fix requiring investigation

**Characteristics:**
- Some unknowns
- Multiple dependencies
- 3-5 file changes
- Requires careful testing
- May need design review

---

### 5 Points - Complex
**Effort:** 8-16 hours (1-2 days)
**Complexity:** Significant complexity and effort
**Risk:** Medium
**Examples:**
- Complex feature implementation
- New page/screen with multiple components
- API integration with third-party service
- Database schema changes
- Complex bug requiring refactoring

**Characteristics:**
- Several unknowns
- Many dependencies
- 5-10 file changes
- Comprehensive testing needed
- Design and code review required

---

### 8 Points - Very Complex
**Effort:** 16-24 hours (2-3 days)
**Complexity:** High complexity with uncertainty
**Risk:** Medium to high
**Examples:**
- Large feature spanning multiple modules
- Complex integration with multiple services
- Major refactoring
- Performance optimization across codebase
- Complex state management implementation

**Characteristics:**
- Many unknowns
- Cross-cutting concerns
- 10-20 file changes
- Extensive testing (unit, integration, e2e)
- Multiple review cycles likely
- May require spike/investigation

---

### 13 Points - Extensive
**Effort:** 24-40 hours (3-5 days)
**Complexity:** Very high complexity
**Risk:** High
**Examples:**
- Multi-component feature
- New major module
- Complete workflow implementation
- Migration to new framework/library
- Large-scale refactoring

**Characteristics:**
- Significant unknowns
- Many cross-cutting concerns
- 20+ file changes
- May need breaking into smaller tasks
- Requires spike or proof-of-concept
- Multiple developers may be needed

---

### 21 Points - Epic
**Effort:** 40+ hours (1-2 weeks)
**Complexity:** Extremely complex
**Risk:** Very high
**Recommendation:** **Break down into smaller tasks**

**Examples:**
- Complete feature set
- System redesign
- Migration project
- Multi-phase implementation

**Action:** Don't estimate as single task - break down into:
- Multiple 5-8 point tasks, OR
- Create separate workflow for each sub-feature

---

## Story Point Components

Story points account for:

### 1. Effort (40%)
- How much work is needed?
- How many files to change?
- How much code to write?

### 2. Complexity (30%)
- How hard is the logic?
- How many edge cases?
- How intricate is the solution?

### 3. Uncertainty (20%)
- How many unknowns?
- How familiar is the tech?
- How stable are requirements?

### 4. Risk (10%)
- What can go wrong?
- How critical is the code?
- How hard to test?

---

## Estimation Process

### Phase 1: Initial Rough Estimate
- Based on requirements understanding
- High-level complexity assessment
- Confidence: Low to Medium
- Purpose: Planning and prioritization

### Phase 2: Detailed Estimation
- After technical design
- Component-level breakdown
- File change count known
- Confidence: Medium to High
- Purpose: Sprint planning

### Refinement During Implementation
- Adjust as unknowns are resolved
- Update if scope changes
- Retrospective for accuracy

---

## Story Point Breakdown by Phase

For an **8-point task** (Complex):

```yaml
Total: 8 points

Breakdown:
  Phase 1 (Understand): 0.5 points
  Phase 2 (Design): 1 point
  Phase 3 (UI Breakdown): 0.5 points
  Phase 4 (Plan Tests): 1 point
  Phase 5a (Write Tests): 1.5 points
  Phase 5b (Implementation): 2.5 points
  Phase 5c (Refactor): 0.5 points
  Phase 6 (Code Review): 0.25 points
  Phase 7 (QA Verification): 0.25 points
  Phase 8 (Documentation): 0.5 points
  Phase 9 (Share): 0 points (automated)
```

**Note:** Phase breakdown is for planning only. Story points represent total effort.

---

## Converting Story Points to Hours

**⚠️ Important:** Story points are NOT hours. However, teams often convert for planning.

### Team Velocity Based Conversion

**Example Team Velocity:** 1 point = 2 hours

| Story Points | Time Estimate |
|--------------|---------------|
| 1 point | ~2 hours |
| 2 points | ~4 hours |
| 3 points | ~6 hours |
| 5 points | ~10 hours (1.25 days) |
| 8 points | ~16 hours (2 days) |
| 13 points | ~26 hours (3.25 days) |
| 21 points | ~42 hours (5+ days) |

**Your Team's Velocity May Differ:**
- Junior developers: 1 point = 3-4 hours
- Senior developers: 1 point = 1.5-2 hours
- Team average: Track over time

---

## Confidence Levels

### High Confidence
- Requirements are clear
- Technology is familiar
- No major dependencies
- Standard patterns apply
- **Estimate:** ±20%

### Medium Confidence
- Some unclear requirements
- Some new technology
- Few external dependencies
- **Estimate:** ±40%

### Low Confidence
- Many unknowns
- New technology
- Many dependencies
- Unclear requirements
- **Recommendation:** Do spike/investigation first
- **Estimate:** ±60%+

---

## Estimation Examples

### Example 1: Add Share Button (Mobile)
```yaml
Task: Add share functionality to post screen

Effort:
  - Create ShareButton component
  - Implement share logic
  - Add tests
  - Files: 3-4 changes

Complexity:
  - Standard React Native pattern
  - Use existing share API
  - Simple state management

Uncertainty:
  - Share API behavior (minor)
  - Platform differences (minor)

Risk:
  - Low risk
  - Non-critical feature

Story Points: 3 points (Moderate)
Time Estimate: 4-6 hours
Confidence: High
```

---

### Example 2: User Authentication System
```yaml
Task: Implement complete authentication flow

Effort:
  - Login/Register screens
  - API integration
  - Token management
  - Protected routes
  - Error handling
  - Files: 15+ changes

Complexity:
  - State management (Redux/Context)
  - Secure token storage
  - API error handling
  - Refresh token logic

Uncertainty:
  - Backend API contract (medium)
  - Security requirements (medium)
  - Token refresh strategy

Risk:
  - High - security critical
  - Complex testing needed

Story Points: 13 points (Extensive)
Time Estimate: 24-32 hours (3-4 days)
Confidence: Medium

Recommendation: Break down into:
  - Login screen (5 points)
  - Register screen (3 points)
  - Token management (5 points)
```

---

### Example 3: Fix Login Button Alignment
```yaml
Task: Center the login button on mobile devices

Effort:
  - Update CSS/styles
  - Test on devices
  - Files: 1 change

Complexity:
  - Trivial styling change

Uncertainty:
  - None

Risk:
  - None

Story Points: 1 point (Trivial)
Time Estimate: 1-2 hours
Confidence: High
```

---

## Common Estimation Pitfalls

### ❌ Pitfall 1: Estimating in Hours
**Problem:** Story points ≠ hours
**Solution:** Think in relative complexity, not time

### ❌ Pitfall 2: Over-Precision
**Problem:** Trying to estimate exactly
**Solution:** Use Fibonacci - embrace uncertainty

### ❌ Pitfall 3: Ignoring Unknowns
**Problem:** Estimating only known work
**Solution:** Add points for investigation/learning

### ❌ Pitfall 4: Not Breaking Down Large Tasks
**Problem:** 21+ point tasks
**Solution:** Break into smaller deliverables

### ❌ Pitfall 5: Individual Estimates
**Problem:** One person estimates
**Solution:** Team discussion (planning poker)

---

## Best Practices

### ✅ DO
- Use Fibonacci scale consistently
- Consider all four components (effort, complexity, uncertainty, risk)
- Break down 13+ point tasks
- Track velocity over time
- Adjust estimates as you learn
- Use team consensus for estimates
- Include testing and review in estimate
- Document assumptions

### ❌ DON'T
- Don't treat story points as hours
- Don't estimate in isolation
- Don't ignore uncertainty
- Don't forget testing effort
- Don't rush estimation
- Don't compare developers by velocity
- Don't change scale mid-project

---

## Planning Poker (Team Estimation)

If working with a team:

1. **Present Task:** PM explains requirements
2. **Discussion:** Team asks clarifying questions
3. **Private Estimate:** Each member selects points (1,2,3,5,8,13,21)
4. **Reveal:** Everyone shows estimate simultaneously
5. **Discuss Differences:** Why highest/lowest?
6. **Re-estimate:** Repeat until consensus
7. **Record:** Document final estimate and assumptions

---

## Tracking & Improving

### Retrospective Questions
- Was estimate accurate?
- What did we miss?
- What caused variance?
- How can we improve?

### Metrics to Track
- Estimated vs. actual story points
- Velocity per sprint
- Confidence level accuracy
- Most common estimation errors

### Improving Estimates
- Review past similar tasks
- Document patterns
- Build estimation library
- Refine velocity over time

---

## CCPM Integration

### Phase 1 (Understand)
- **Initial rough estimate** (Low confidence)
- Based on requirements only
- Used for prioritization

### Phase 2 (Design)
- **Detailed estimate** (Medium-High confidence)
- Based on technical design
- Per-component breakdown
- Used for sprint planning

### Throughout Workflow
- Update if scope changes
- Adjust for discovered complexity
- Track actual time spent
- Learn for future estimates

---

## Related Documentation

- **Phase 1 Guide:** `commands/workflow/phase-1.md`
- **Phase 2 Guide:** `commands/workflow/phase-2.md`
- **Agile Methodology:** `skills/pm-expert/agile-methodology.md`
- **Project Planning:** `skills/pm-expert/project-planning.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-11-27
