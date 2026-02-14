---
name: testing-patterns
description: "Unified testing patterns across all frameworks. Provides consistent test structure, naming, and best practices for Jest, Vitest, Pytest, PHPUnit, Go testing, and more."
autoInvoke: true
priority: 50
triggers:
  - "test"
  - "spec"
  - "coverage"
  - "mock"
  - "fixture"
  - "TDD"
  - "unit test"
  - "e2e"
---

# Skill: Testing Patterns

**Skill ID:** testing-patterns
**Version:** 1.0.0
**Priority:** 50
**Auto-Invoke:** Yes (when test task detected)

---

## Purpose

Unified testing patterns across all frameworks. Provides consistent test structure, naming, and best practices regardless of the testing framework (Jest, Vitest, Pytest, PHPUnit, Go testing, etc.).

**Consolidates testing knowledge from:**
- test-writer skill
- qa-automation agent patterns
- Framework-specific test patterns

---

## Triggers

- Test keywords: test, spec, coverage, mock, fixture, TDD
- Test file patterns: *.test.ts, *.spec.ts, *_test.go, test_*.py
- Commands: /test:unit, /test:e2e, /test:coverage

---

## Universal Test Principles

```toon
test_principles[8]{principle,description}:
  AAA Pattern,Arrange → Act → Assert (every test)
  Single Assertion,One logical assertion per test
  Descriptive Names,"should [action] when [condition]"
  No Test Logic,No conditionals in tests
  Isolated Tests,Each test independent - no shared state
  Fast Execution,Unit tests <100ms each
  Deterministic,Same result every run - no flaky tests
  Test Behavior,Test what not how - avoid implementation details
```

---

## Test Types

```toon
test_types[4]{type,scope,speed,when}:
  Unit,Single function/class,<100ms,Always - 80% of tests
  Integration,Multiple units together,<1s,API endpoints + DB queries
  E2E,Full user flow,<30s,Critical paths only
  Snapshot,UI output comparison,<500ms,Component rendering
```

---

## Framework Detection

```toon
test_frameworks[8]{framework,detect_by,runner,assertion}:
  Jest,jest.config.js OR package.json jest,npx jest,expect()
  Vitest,vitest.config.ts,npx vitest,expect()
  Pytest,pytest.ini OR conftest.py,pytest,assert
  PHPUnit,phpunit.xml,./vendor/bin/phpunit,$this->assert*
  Go,*_test.go files,go test,t.Error/t.Fatal
  RSpec,spec/ directory + Gemfile,bundle exec rspec,expect().to
  Cypress,cypress.config.ts,npx cypress,cy.*
  Detox,.detoxrc.js,detox test,expect(element)
```

---

## Test File Structure

### JavaScript/TypeScript (Jest/Vitest)

```typescript
// user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test' };

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
    });

    it('should throw error when email is invalid', async () => {
      // Arrange
      const userData = { email: 'invalid', name: 'Test' };

      // Act & Assert
      await expect(service.createUser(userData))
        .rejects.toThrow('Invalid email');
    });
  });
});
```

### Python (Pytest)

```python
# test_user_service.py
import pytest
from user_service import UserService

class TestUserService:
    @pytest.fixture
    def service(self):
        return UserService()

    def test_create_user_with_valid_data(self, service):
        # Arrange
        user_data = {"email": "test@example.com", "name": "Test"}

        # Act
        result = service.create_user(user_data)

        # Assert
        assert result.id is not None
        assert result.email == user_data["email"]

    def test_create_user_raises_on_invalid_email(self, service):
        # Arrange
        user_data = {"email": "invalid", "name": "Test"}

        # Act & Assert
        with pytest.raises(ValueError, match="Invalid email"):
            service.create_user(user_data)
```

### PHP (PHPUnit)

```php
// UserServiceTest.php
class UserServiceTest extends TestCase
{
    private UserService $service;

    protected function setUp(): void
    {
        $this->service = new UserService();
    }

    public function test_create_user_with_valid_data(): void
    {
        // Arrange
        $userData = ['email' => 'test@example.com', 'name' => 'Test'];

        // Act
        $result = $this->service->createUser($userData);

        // Assert
        $this->assertNotNull($result->id);
        $this->assertEquals($userData['email'], $result->email);
    }

    public function test_create_user_throws_on_invalid_email(): void
    {
        // Arrange
        $userData = ['email' => 'invalid', 'name' => 'Test'];

        // Assert
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid email');

        // Act
        $this->service->createUser($userData);
    }
}
```

### Go

```go
// user_service_test.go
func TestUserService_CreateUser(t *testing.T) {
    t.Run("should create user with valid data", func(t *testing.T) {
        // Arrange
        service := NewUserService()
        userData := UserData{Email: "test@example.com", Name: "Test"}

        // Act
        result, err := service.CreateUser(userData)

        // Assert
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if result.ID == "" {
            t.Error("expected ID to be set")
        }
        if result.Email != userData.Email {
            t.Errorf("expected email %s, got %s", userData.Email, result.Email)
        }
    })

    t.Run("should return error when email is invalid", func(t *testing.T) {
        // Arrange
        service := NewUserService()
        userData := UserData{Email: "invalid", Name: "Test"}

        // Act
        _, err := service.CreateUser(userData)

        // Assert
        if err == nil {
            t.Error("expected error, got nil")
        }
    })
}
```

---

## Mocking Patterns

```toon
mock_patterns[5]{pattern,when,example}:
  Spy,Track calls without changing behavior,vi.spyOn(obj 'method')
  Stub,Replace with fixed return value,vi.fn().mockReturnValue(x)
  Mock,Replace with custom implementation,vi.fn().mockImplementation(fn)
  Fake,In-memory implementation,new FakeUserRepository()
  Fixture,Predefined test data,fixtures/users.json
```

### Mock Example (Vitest)

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('./email.service', () => ({
  EmailService: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({ sent: true }),
  })),
}));

// Spy on method
const spy = vi.spyOn(userService, 'validate');
await userService.createUser(data);
expect(spy).toHaveBeenCalledWith(data.email);
```

---

## Coverage Targets

```toon
coverage_targets[4]{metric,minimum,good,excellent}:
  Line coverage,70%,80%,90%
  Branch coverage,60%,70%,80%
  Function coverage,80%,90%,95%
  Statement coverage,70%,80%,90%
```

---

## TDD Workflow

```
1. RED: Write failing test first
   ↓
2. GREEN: Write minimum code to pass
   ↓
3. REFACTOR: Improve code quality
   ↓
4. REPEAT for next requirement
```

**TDD Rules:**
- Never write production code without a failing test
- Write only enough test to fail (compilation counts)
- Write only enough code to pass the test

---

## E2E Testing Patterns

### Cypress (Web)

```typescript
describe('Login Flow', () => {
  it('should login with valid credentials', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome"]').should('contain', 'Welcome');
  });
});
```

### Detox (Mobile)

```typescript
describe('Login Flow', () => {
  it('should login with valid credentials', async () => {
    await element(by.id('email')).typeText('user@example.com');
    await element(by.id('password')).typeText('password123');
    await element(by.id('submit')).tap();
    await expect(element(by.id('dashboard'))).toBeVisible();
  });
});
```

---

## Test Naming Convention

```toon
naming[4]{format,example,use_when}:
  should_when,"should return user when id exists",Behavior description
  method_scenario_result,"createUser_validData_returnsUser",Method-focused
  given_when_then,"givenValidUser_whenCreate_thenSuccess",BDD style
  test_method,"test_create_user_with_valid_data",Python/PHP style
```

---

## Anti-Patterns to Avoid

```toon
antipatterns[6]{pattern,problem,solution}:
  Test implementation,Brittle tests break on refactor,Test behavior/output only
  Shared state,Tests affect each other,Reset state in beforeEach
  Sleep/delays,Slow flaky tests,Use waitFor/polling
  Too many mocks,Tests don't reflect reality,Use fakes for complex deps
  Giant tests,Hard to debug failures,One assertion per test
  No assertions,Test always passes,Assert expected outcomes
```

---

## Integration with Project Cache

```javascript
const detection = getCachedDetection();
if (detection.testInfra) {
  // Load patterns for detected test framework
  loadPatterns('testing', detection.testInfra.framework);
}
```

---

## Related Files

- `skills/test-writer/SKILL.md` - Test generation skill
- `agents/qa-automation.md` - QA agent
- `rules/tdd-workflow.md` - TDD enforcement rule
- `commands/test/unit.md`, `commands/test/e2e.md`

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-21
