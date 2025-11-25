# Skill: Code Review

**Skill ID:** `code-review`  
**Category:** Quality  
**Priority:** High

---

## Purpose

Perform comprehensive cross-agent code review with quality checklists, security checks, and consolidated feedback.

---

## Capabilities

### 1. Static Analysis
- Code quality metrics
- Complexity analysis
- Duplication detection
- Dead code identification

### 2. Convention Checking
- Naming conventions
- File structure
- Import order
- Code formatting

### 3. Security Review
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication checks

### 4. Performance Review
- Algorithm efficiency
- Memory usage
- Database queries
- Network calls

### 5. Test Review
- Test coverage
- Test quality
- Edge cases
- Mock usage

---

## Agents with This Skill

- All development agents (cross-review)
- `qa-automation` (Test review)
- `ui-designer` (Design adherence)

---

## Auto-Invoked When

- Phase 6: Code Review
- Pull request created
- `/workflow:review` command

---

## Review Process

### 1. Self-Review (Primary Agent)
```typescript
async function selfReview(code: CodeChanges) {
  return {
    codeQuality: checkCodeQuality(code),
    conventions: checkConventions(code),
    architecture: checkArchitecture(code),
  };
}
```

### 2. Cross-Review (Secondary Agents)
```typescript
async function crossReview(code: CodeChanges, agents: Agent[]) {
  const reviews = await Promise.all(
    agents.map(agent => agent.review(code))
  );
  
  return consolidateReviews(reviews);
}
```

### 3. Consolidation
```typescript
interface CodeReviewReport {
  overall: 'approve' | 'approve_with_comments' | 'request_changes';
  critical: Issue[];      // Blocking issues
  major: Issue[];         // Should fix
  minor: Issue[];         // Nice to have
  positive: string[];     // Good practices
  metrics: {
    codeQuality: number;  // 0-100
    testCoverage: number; // percentage
    complexity: number;   // cyclomatic
  };
}
```

---

## Review Checklist

### Code Quality ✅
- [ ] No ESLint/TSLint warnings
- [ ] TypeScript strict mode compliance
- [ ] No console.logs in production
- [ ] Proper error handling
- [ ] No magic numbers
- [ ] DRY principle followed

### Architecture ✅
- [ ] Proper file structure
- [ ] Single responsibility
- [ ] Dependency injection
- [ ] Separation of concerns
- [ ] SOLID principles

### Testing ✅
- [ ] Coverage >= threshold
- [ ] All tests pass
- [ ] Edge cases covered
- [ ] Integration tests included
- [ ] E2E tests (if applicable)

### Performance ✅
- [ ] No N+1 queries
- [ ] Proper indexing
- [ ] Lazy loading
- [ ] Memoization where needed
- [ ] No memory leaks

### Security ✅
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication checks
- [ ] Authorization checks

### Design Adherence ✅
- [ ] Matches Figma design
- [ ] Uses design tokens
- [ ] Responsive (phone/tablet)
- [ ] Accessibility labels

---

## Issue Categories

### Critical 🔴 (Blocking)
- Security vulnerabilities
- Data corruption risks
- Breaking changes
- Test failures

### Major 🟡 (Should Fix)
- Performance issues
- Convention violations
- Missing tests
- Poor error handling

### Minor 🔵 (Nice to Have)
- Code formatting
- Comment improvements
- Refactoring suggestions
- Optimization opportunities

---

## Output Format

```markdown
# Code Review Report: [Feature Name]

## Summary
✅ **APPROVE with minor comments** (non-blocking)

**Reviewers:**
- mobile-react-native (Self-review)
- ui-designer (Design adherence)
- qa-automation (Test quality)

---

## Critical Issues 🔴 (0)
None

---

## Major Issues 🟡 (0)
None

---

## Minor Issues 🔵 (2)

### 1. Performance Optimization
**File:** `ShareModal.tsx:45`
**Issue:** Consider memoizing expensive calculation
**Suggestion:**
```typescript
const result = useMemo(() => expensiveCalc(data), [data]);
```

### 2. Test Coverage
**File:** `useSocialMediaPost.test.tsx`
**Issue:** Missing error boundary test
**Suggestion:** Add test for error boundary behavior

---

## Positive Feedback ✨
- Excellent TypeScript typing
- Well-structured components
- Comprehensive test coverage (89%)
- Good error handling
- Clean separation of concerns

---

## Metrics
- Code Quality: 95/100
- Test Coverage: 89%
- Complexity: Low (avg cyclomatic: 3)

---

## Recommendation
✅ **APPROVE** with minor improvements (non-blocking)

Code is production-ready. Minor issues can be addressed in follow-up.
```

---

## Related Skills

- `tdd-implementation` - Test enforcement
- `security-audit` - Security checks
- `performance-optimization` - Performance review

---

**Version:** 1.0.0

