# Tester Agent - Full Reference Patterns

**Source Agent:** `agents/tester.md`
**Load:** On-demand when deep testing expertise needed

---

## Testing Frameworks by Platform

### Mobile (React Native + Expo)
```yaml
unit: Jest + React Native Testing Library
integration: Jest + API mocks
e2e: Detox 20.x
component: @testing-library/react-native
automation: Appium (cross-platform)
```

### Web (Vue.js)
```yaml
unit: Vitest + Vue Test Utils
component: @testing-library/vue
e2e: Playwright / Cypress
```

### Web (React / Next.js)
```yaml
unit: Jest / Vitest
component: @testing-library/react
e2e: Playwright / Cypress
```

### Backend (Laravel)
```yaml
unit: PHPUnit
integration: PHPUnit + Database
api: Pest / PHPUnit Feature tests
```

---

## Test Planning Templates

### Test Plan (`test_plan.md`)
```markdown
# Test Plan: [Feature Name]

## 1. Objectives
- Primary goal
- Success criteria
- Acceptance criteria verification

## 2. Scope
### In Scope
- Feature areas to test
- Platforms to cover
- Test types to execute

### Out of Scope
- Future enhancements
- External dependencies
- Known limitations

## 3. Test Strategy
### Unit Tests (Target: X%)
- What to test
- Framework & tools
- Mock strategy

### Integration Tests
- Integration points
- Test data strategy
- Environment setup

### E2E Tests (Critical Flows)
- User journeys
- Happy paths
- Error scenarios

### Performance Tests (if applicable)
- Load benchmarks
- Response time targets
- Resource usage limits

### Security Tests (if applicable)
- Auth/authorization
- Input validation
- Data protection

## 4. Test Environment
- Platforms: iOS 14+, Android 8+, Chrome/Safari/Firefox
- Devices: iPhone 12+, iPad Pro, Android phones/tablets
- APIs: Staging environment
- Test data: Seeded database

## 5. Test Data
- Sample data sets
- Edge case data
- Invalid data for negative tests
- Test accounts

## 6. Automation Strategy
- Framework choice & rationale
- CI/CD integration plan
- Parallel execution
- Reporting

## 7. Entry Criteria
- Code implementation complete
- Test environment ready
- Test data prepared
- Blockers resolved

## 8. Exit Criteria
- All tests executed
- Coverage >= target
- No critical/high bugs
- Performance benchmarks met

## 9. Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Flaky tests | Medium | High | Implement retries, stable selectors |

## 10. Schedule
- Test planning: Day 1
- Test implementation: Day 2-3
- Test execution: Day 4
- Bug fixes: Day 5
- Regression: Day 6

## 11. Roles & Responsibilities
- Test design: Tester Agent
- Test implementation: QA + Dev Agents
- Test execution: Tester Agent
- Bug triage: Lead
```

### Test Cases (`test_cases.md`)
```markdown
# Test Cases: [Feature Name]

## TC-001: [Test Case Name]
**Priority:** High
**Type:** E2E
**Preconditions:**
- User logged in
- Test data exists

**Steps:**
1. Navigate to Feature screen
2. Click "Share" button
3. Select "Facebook" platform
4. Enter post content: "Test post"
5. Click "Post" button

**Expected Result:**
- Post successfully published to Facebook
- Success message displayed
- Post appears in history

**Actual Result:** [To be filled during execution]
**Status:** [Pass / Fail / Blocked]
**Attachments:** [Screenshots, logs]
```

---

## Automation Strategy Details

### Mocking Strategy

**API Mocks:**
```typescript
jest.mock('api/socialMediaApi', () => ({
  postToFacebook: jest.fn().mockResolvedValue({
    id: 'post-123',
    status: 'published',
  }),
}));
```

**Navigation Mocks:**
```typescript
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
```

**Store Mocks:**
```typescript
jest.mock('hooks/useBoundStore', () => ({
  useBoundStore: () => ({
    user: { id: '1', name: 'Test User' },
    setUser: jest.fn(),
  }),
}));
```

### Test Data Management - Factory Pattern

```typescript
// testUtils/factories.ts
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

export const createMockPost = (overrides = {}) => ({
  id: 'post-123',
  content: 'Test content',
  platform: 'facebook',
  ...overrides,
});
```

### CI/CD Integration

**Azure Pipelines:**
```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: |
    yarn install --frozen-lockfile
    yarn test --coverage --maxWorkers=2
  displayName: 'Run Tests'

- task: PublishCodeCoverageResults@1
  inputs:
    codeCoverageTool: 'Cobertura'
    summaryFileLocation: 'coverage/cobertura-coverage.xml'
```

### Coverage Thresholds Config

```json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "statements": 80,
      "branches": 75,
      "functions": 80,
      "lines": 80
    },
    "src/features/": {
      "statements": 85
    }
  }
}
```

### Parallel Execution

**Jest Configuration:**
```json
{
  "maxWorkers": "50%",
  "testTimeout": 10000
}
```

**Detox Configuration:**
```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "behavior": {
    "init": {
      "exposeGlobals": false
    }
  },
  "configurations": {
    "ios.sim": {
      "device": { "type": "iPhone 14" }
    }
  }
}
```

### Reporting
- **Coverage Reports:** HTML + Cobertura XML → `coverage/`
- **Test Results:** JUnit XML → `test-results/`
- **E2E Reports:** Screenshots on failure + video recording + logs

### Flaky Test Management
1. Identify flaky tests (failure rate > 5%)
2. Add to `flakyTests.json` for tracking
3. Implement retry logic (max 2 retries)
4. Fix root cause within 1 sprint

---

## Test Execution Report Template

```markdown
# Test Execution Report: [Feature Name]

## Summary
**Execution Date:** YYYY-MM-DD
**Environment:** Staging
**Executed By:** Tester Agent

| Metric | Value | Status |
|--------|-------|--------|
| Total Tests | N | - |
| Passed | N | Pass/Fail |
| Failed | N | Pass/Fail |
| Skipped | N | Pass/Fail |
| Coverage | X% | Pass/Fail (Target: 80%) |
| Duration | Xm Xs | Pass/Fail |

## Test Results by Type
[Unit / Integration / E2E tables]

## Coverage Report
[Overall + by file]

## Bugs Found
[Count + details]

## Recommendations
[Go/no-go + improvements]
```

---

## Test Case Writing Guidelines

### Good Test Structure
```typescript
describe('useSocialMediaPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when posting to Facebook', () => {
    it('should successfully post with valid content', async () => {
      // Arrange
      const { result } = renderHook(() => useSocialMediaPost());
      const mockPost = createMockPost({ platform: 'facebook' });

      // Act
      await act(async () => {
        await result.current.post(mockPost);
      });

      // Assert
      expect(result.current.status).toBe('success');
      expect(facebookApi.post).toHaveBeenCalledWith(mockPost);
    });
  });
});
```

### Test Naming Convention
```
Pattern: should [expected behavior] when [condition]

Good:
- should display error message when API returns 400
- should disable submit button when form is invalid
- should retry post when network error occurs

Bad:
- test post
- error handling
- it works
```

### Coverage of Edge Cases
```typescript
// Happy path
it('should post successfully with valid data', ...)

// Validation
it('should reject empty content', ...)
it('should reject content exceeding 5000 chars', ...)

// Error scenarios
it('should handle network timeout', ...)
it('should handle API rate limit (429)', ...)
it('should handle unauthorized (401)', ...)

// Edge cases
it('should handle posting to disconnected platform', ...)
it('should handle media upload failure', ...)
it('should handle multi-platform partial failure', ...)

// Concurrency
it('should prevent duplicate posts when clicked multiple times', ...)

// Accessibility
it('should have proper ARIA labels', ...)
it('should be keyboard navigable', ...)
```

---

## Test Review Checklist

### Structure
- [ ] Tests are organized by feature/behavior
- [ ] Descriptive test names (should...when...)
- [ ] Proper setup/teardown (beforeEach, afterEach)
- [ ] No test interdependencies

### Quality
- [ ] Tests are independent and isolated
- [ ] Mocks are properly reset between tests
- [ ] No hard-coded values (use factories)
- [ ] No test.skip or test.only (except WIP)

### Coverage
- [ ] Happy path covered
- [ ] Error scenarios covered
- [ ] Edge cases covered
- [ ] Coverage meets threshold

### Maintainability
- [ ] Tests are readable
- [ ] Comments explain "why" not "what"
- [ ] Reusable test utilities extracted
- [ ] No flaky tests (timing issues, race conditions)

### Performance
- [ ] Tests run in reasonable time (< 5s per suite)
- [ ] Expensive operations mocked
- [ ] No unnecessary delays

---

## Common Testing Anti-Patterns

### Anti-Pattern 1: Testing Implementation Details
```typescript
// BAD
it('should call useState hook', () => {
  expect(mockUseState).toHaveBeenCalled();
});

// GOOD
it('should display username when provided', () => {
  const { getByText } = render(<User name="John" />);
  expect(getByText('John')).toBeTruthy();
});
```

### Anti-Pattern 2: Flaky Tests with Timers
```typescript
// BAD
it('should show message after delay', () => {
  renderComponent();
  setTimeout(() => {
    expect(getByText('Message')).toBeTruthy();
  }, 1000); // Flaky!
});

// GOOD
it('should show message after delay', async () => {
  renderComponent();
  await waitFor(() => {
    expect(getByText('Message')).toBeTruthy();
  });
});
```

### Anti-Pattern 3: Testing Multiple Things in One Test
```typescript
// BAD
it('should do everything', () => {
  // Tests 10 different things
});

// GOOD
it('should validate email format', () => { ... });
it('should submit form when valid', () => { ... });
it('should display error when invalid', () => { ... });
```

---

## Testing Resources & Tools

### Mobile Testing
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Jest Documentation](https://jestjs.io/)

### Web Testing
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Cypress Documentation](https://www.cypress.io/)

### Best Practices
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)
