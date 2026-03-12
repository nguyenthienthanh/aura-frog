# TDD Workflow Rules

**Version:** 1.0.0  
**Purpose:** Enforce Test-Driven Development workflow

---

## 🔴🟢♻️ TDD Cycle

### Mandatory Workflow

```
🔴 RED Phase (Phase 2): Write Failing Test
   ↓ (auto-continue)
🟢 GREEN Phase (Phase 3): Make Test Pass
   ↓
   [APPROVAL GATE]
   ↓
♻️ REFACTOR Phase (Phase 4): Improve Code
   ↓ (auto-continue)
✅ DONE
```

---

## 🛑 Blocking Rules

### BLOCK Code Generation If:

1. **No test file exists**
   ```
   ❌ Cannot generate src/features/sharing/ShareModal.tsx
   
   Reason: No test file found
   Required: src/features/sharing/ShareModal.test.tsx
   
   Please write tests first (TDD workflow)
   ```

2. **Tests don't fail in RED phase**
   ```
   ❌ Cannot proceed to implementation
   
   Reason: All tests passing (expected to fail in RED phase)
   
   Tests must fail before writing implementation
   ```

3. **Coverage below threshold**
   ```
   ❌ Cannot complete implementation
   
   Current coverage: 65%
   Required: 80%
   
   Please add more tests to reach threshold
   ```

4. **Tests broken after refactoring**
   ```
   ❌ Refactoring failed
   
   Reason: Tests failing after refactor
   Status: 45/53 passing (8 failures)
   
   Please fix tests before proceeding
   ```

---

## ✅ Required in Each Phase

### RED Phase Requirements

- [ ] Test file created
- [ ] Test cases cover all requirements
- [ ] Tests are runnable
- [ ] **All tests FAIL** (expected)
- [ ] Failure reasons are correct
- [ ] User approves test quality

**Deliverables:**
- `*.test.tsx` / `*.test.ts` / `*.spec.php`
- Test execution report showing failures

---

### GREEN Phase Requirements

- [ ] Minimum code to pass tests
- [ ] **All tests PASS**
- [ ] No test modifications (unless fixing test bugs)
- [ ] Coverage meets threshold
- [ ] Linter passes
- [ ] User approves implementation

**Deliverables:**
- Implementation files
- Test execution report showing success
- Coverage report

---

### REFACTOR Phase Requirements

- [ ] Code quality improved
- [ ] **All tests STILL PASS**
- [ ] No behavior changes
- [ ] Linter passes (0 warnings)
- [ ] Coverage maintained or improved
- [ ] User approves refactoring

**Deliverables:**
- Refactored code
- Test execution report (still passing)
- Code quality metrics

---

## 📊 Coverage Thresholds

### Default Thresholds
```yaml
overall: 80%
statements: 80%
branches: 75%
functions: 80%
lines: 80%
```

### By File Type
```yaml
critical_business_logic: 90%
ui_components: 70%
utility_functions: 95%
api_clients: 85%
hooks: 85%
```

### Exemptions
```yaml
exempt_from_coverage:
  - config files (*.config.ts)
  - type definitions (*.d.ts)
  - constants (constants/*.ts)
  - mock data (mocks/*.ts)
  - test utilities (__tests__/utils/*.ts)
```

---

## 🧪 Test Quality Standards

### Test Structure
```typescript
describe('Feature/Component Name', () => {
  // Setup
  beforeEach(() => {
    // Reset state, clear mocks
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  // Group by scenario
  describe('when user is logged in', () => {
    it('should display user profile', () => {
      // Arrange
      const user = createMockUser();
      
      // Act
      render(<Profile user={user} />);
      
      // Assert
      expect(screen.getByText(user.name)).toBeInTheDocument();
    });
  });
  
  describe('when user is not logged in', () => {
    it('should redirect to login', () => {
      // Test
    });
  });
});
```

### Test Naming
```typescript
// ✅ GOOD: Descriptive, follows "should...when..." pattern
it('should display error when API returns 400', () => {});
it('should disable submit when form is invalid', () => {});
it('should retry request when network error occurs', () => {});

// ❌ BAD: Vague, unclear
it('test error', () => {});
it('form validation', () => {});
it('works', () => {});
```

### Test Coverage
```typescript
// Must test:
✅ Happy path
✅ Error scenarios
✅ Edge cases
✅ Boundary conditions
✅ Validation rules
✅ State transitions

// Example:
describe('age validation', () => {
  it('should accept age 18 (minimum)', () => {});
  it('should accept age 65 (maximum)', () => {});
  it('should reject age 17 (below minimum)', () => {});
  it('should reject age 66 (above maximum)', () => {});
  it('should reject negative age', () => {});
  it('should reject non-numeric age', () => {});
});
```

---

## 🚫 Anti-Patterns

### Don't Test Implementation Details
```typescript
// ❌ BAD: Testing internal state
expect(component.state.count).toBe(1);
expect(mockSetState).toHaveBeenCalled();

// ✅ GOOD: Testing behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### Don't Have Flaky Tests
```typescript
// ❌ BAD: Time-dependent, flaky
setTimeout(() => {
  expect(result).toBe(expected);
}, 1000);

// ✅ GOOD: Use proper async utilities
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Don't Test Multiple Things
```typescript
// ❌ BAD: Testing too much in one test
it('should handle everything', () => {
  // Tests 10 different scenarios
});

// ✅ GOOD: One test, one concern
it('should validate email format', () => {});
it('should submit form when valid', () => {});
it('should display error when invalid', () => {});
```

---

## 📈 Continuous Testing

### Run Tests Automatically
```yaml
When to run tests:
  - Before commit (pre-commit hook)
  - On file save (watch mode)
  - Before push (pre-push hook)
  - In CI/CD pipeline
  - Before deployment
```

### Test Reports
```yaml
Required reports:
  - Test execution results (pass/fail)
  - Coverage report (HTML + XML)
  - Performance metrics
  - Flaky test detection
```

---

## ⚠️ Warnings & Errors

### Warning: Low Coverage
```
⚠️ Warning: Coverage below target

File: ShareModal.tsx
Coverage: 75%
Target: 80%

Uncovered lines:
- Line 45-52 (error handling)
- Line 89-95 (edge case)

Recommendation: Add tests for uncovered code
```

### Error: Tests Failing
```
❌ Error: Cannot proceed - tests failing

Failed tests: 3/53
- ShareModal: should handle timeout (line 145)
- ShareModal: should retry on error (line 178)  
- useSocialMedia: should cache results (line 234)

Action required: Fix failing tests before continuing
```

---

## ✅ TDD Checklist

Before marking phase complete:

### RED Phase ✅
- [ ] Test file created
- [ ] All test cases written
- [ ] Tests are executable
- [ ] All tests FAIL (expected)
- [ ] Failure messages are clear
- [ ] Coverage goals defined

### GREEN Phase ✅
- [ ] Implementation complete
- [ ] All tests PASS
- [ ] Coverage meets threshold
- [ ] Linter passes
- [ ] No shortcuts taken

### REFACTOR Phase ✅
- [ ] Code improved
- [ ] Tests still PASS
- [ ] Coverage maintained
- [ ] No behavior changes
- [ ] Documentation updated

---

**Remember:** Tests are not just validation - they're specifications! Write them first! 🧪

