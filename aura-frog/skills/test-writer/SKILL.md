---
name: test-writer
description: "Write tests with TDD. Supports Jest, Cypress, Detox, PHPUnit, PyTest, Go testing."
autoInvoke: true
priority: medium
triggers:
  - "add tests"
  - "test coverage"
  - "unit test"
  - "E2E test"
  - "write tests"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Aura Frog Test Writer

**Priority:** MEDIUM - Use for test-related requests
**Version:** 1.0.0

---

## When to Use

**USE for:**
- Adding tests to existing code
- Improving test coverage
- Creating test suites
- TDD implementation (Phase 5a)
- Writing specific test types (unit, integration, E2E)

**DON'T use for:**
- Bug fixes without explicit test request → use `bugfix-quick`
- Full feature implementation → use `workflow-orchestrator`

---

## Test Writing Process

### 1. Analyze Target Code
```
1. Read file with Read tool
2. Identify testable units:
   - Functions/methods
   - Components
   - API endpoints
   - Data transformations
3. List dependencies to mock
```

### 2. Plan Strategy

| Type | Use For | Scope |
|------|---------|-------|
| Unit | Individual functions/components | Single unit, mocked deps |
| Integration | Module interactions, API calls | Multiple units together |
| E2E | Complete user flows | Full system, real deps |

### 3. Write Tests

**For NEW code (TDD - Phase 5a):**
```
1. Write failing tests (RED)
   → Tests MUST fail
   → If they pass, tests are wrong
2. Implement code (GREEN)
   → Minimal code to pass
3. Refactor (REFACTOR)
   → Tests must stay green
```

**For EXISTING code:**
```
1. Write tests that pass (validate current behavior)
2. Add edge case tests
3. Add negative tests (error handling)
```

### 4. Verify Coverage
```bash
# Check target: 80% or project-specific
npm test -- --coverage          # JavaScript/TypeScript
pytest --cov=. --cov-report=html # Python
./vendor/bin/phpunit --coverage-html coverage # PHP
go test -coverprofile=coverage.out ./... # Go
```

---

## Framework-Specific Templates

### JavaScript/TypeScript - Jest

**Unit Test (Function):**
```typescript
describe('calculateDiscount', () => {
  it('should apply 10% discount for orders over $100', () => {
    expect(calculateDiscount(150)).toBe(135);
  });

  it('should return original price for orders under $100', () => {
    expect(calculateDiscount(50)).toBe(50);
  });

  it('should throw error for negative amounts', () => {
    expect(() => calculateDiscount(-10)).toThrow('Invalid amount');
  });
});
```

**Unit Test (React Component):**
```typescript
import { render, fireEvent, screen } from '@testing-library/react';
import { LoginButton } from './LoginButton';

describe('LoginButton', () => {
  it('should call onLogin when clicked', () => {
    const onLogin = jest.fn();
    render(<LoginButton onLogin={onLogin} />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<LoginButton isLoading={true} />);

    expect(screen.getByTestId('loading-spinner')).toBeVisible();
  });

  it('should be disabled when loading', () => {
    render(<LoginButton isLoading={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### React Native - Jest + React Native Testing Library

**Component Test:**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { PaymentCard } from './PaymentCard';

describe('PaymentCard', () => {
  it('should display amount in correct format', () => {
    const { getByTestId } = render(<PaymentCard amount={1500.50} />);

    expect(getByTestId('amount-display')).toHaveTextContent('$1,500.50');
  });

  it('should call onPay when pay button pressed', () => {
    const onPay = jest.fn();
    const { getByTestId } = render(<PaymentCard onPay={onPay} />);

    fireEvent.press(getByTestId('pay-button'));

    expect(onPay).toHaveBeenCalledTimes(1);
  });
});
```

### React Native - Detox E2E

**E2E Test:**
```typescript
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('securePassword123');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@email.com');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});
```

### PHP - PHPUnit

**Unit Test:**
```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\OrderCalculator;

class OrderCalculatorTest extends TestCase
{
    private OrderCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new OrderCalculator();
    }

    public function test_calculates_subtotal_correctly(): void
    {
        $items = [
            ['price' => 100, 'quantity' => 2],
            ['price' => 50, 'quantity' => 1],
        ];

        $result = $this->calculator->calculateSubtotal($items);

        $this->assertEquals(250, $result);
    }

    public function test_applies_discount_percentage(): void
    {
        $result = $this->calculator->applyDiscount(100, 10);

        $this->assertEquals(90, $result);
    }

    public function test_throws_exception_for_negative_discount(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Discount cannot be negative');

        $this->calculator->applyDiscount(100, -5);
    }
}
```

**Laravel Feature Test:**
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'user']);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Invalid credentials']);
    }
}
```

### Python - PyTest

**Unit Test:**
```python
import pytest
from app.services.calculator import OrderCalculator


class TestOrderCalculator:
    @pytest.fixture
    def calculator(self):
        return OrderCalculator()

    def test_calculate_subtotal(self, calculator):
        items = [
            {"price": 100, "quantity": 2},
            {"price": 50, "quantity": 1},
        ]

        result = calculator.calculate_subtotal(items)

        assert result == 250

    def test_apply_discount_percentage(self, calculator):
        result = calculator.apply_discount(100, 10)

        assert result == 90

    def test_raises_error_for_negative_discount(self, calculator):
        with pytest.raises(ValueError, match="Discount cannot be negative"):
            calculator.apply_discount(100, -5)

    @pytest.mark.parametrize("amount,discount,expected", [
        (100, 0, 100),
        (100, 10, 90),
        (100, 50, 50),
        (100, 100, 0),
    ])
    def test_discount_edge_cases(self, calculator, amount, discount, expected):
        assert calculator.apply_discount(amount, discount) == expected
```

**FastAPI Integration Test:**
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import User


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def test_user(db_session):
    user = User(email="test@example.com", password="hashed_password")
    db_session.add(user)
    db_session.commit()
    return user


class TestAuthenticationAPI:
    def test_login_success(self, client, test_user):
        response = client.post("/api/login", json={
            "email": "test@example.com",
            "password": "password123"
        })

        assert response.status_code == 200
        assert "token" in response.json()
        assert "user" in response.json()

    def test_login_wrong_password(self, client, test_user):
        response = client.post("/api/login", json={
            "email": "test@example.com",
            "password": "wrongpassword"
        })

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid credentials"

    def test_login_missing_fields(self, client):
        response = client.post("/api/login", json={})

        assert response.status_code == 422
```

### Go - Go Testing

**Unit Test:**
```go
package calculator

import (
    "testing"
)

func TestCalculateSubtotal(t *testing.T) {
    calc := NewOrderCalculator()
    items := []Item{
        {Price: 100, Quantity: 2},
        {Price: 50, Quantity: 1},
    }

    result := calc.CalculateSubtotal(items)

    if result != 250 {
        t.Errorf("Expected 250, got %d", result)
    }
}

func TestApplyDiscount(t *testing.T) {
    calc := NewOrderCalculator()

    result := calc.ApplyDiscount(100, 10)

    if result != 90 {
        t.Errorf("Expected 90, got %d", result)
    }
}

func TestApplyDiscountNegative(t *testing.T) {
    calc := NewOrderCalculator()

    defer func() {
        if r := recover(); r == nil {
            t.Errorf("Expected panic for negative discount")
        }
    }()

    calc.ApplyDiscount(100, -5)
}

// Table-driven test
func TestApplyDiscountEdgeCases(t *testing.T) {
    calc := NewOrderCalculator()

    tests := []struct {
        name     string
        amount   int
        discount int
        expected int
    }{
        {"no discount", 100, 0, 100},
        {"10% discount", 100, 10, 90},
        {"50% discount", 100, 50, 50},
        {"full discount", 100, 100, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := calc.ApplyDiscount(tt.amount, tt.discount)
            if result != tt.expected {
                t.Errorf("Expected %d, got %d", tt.expected, result)
            }
        })
    }
}
```

---

## Coverage Targets

| Type | Target | Rationale |
|------|--------|-----------|
| Critical paths | 100% | Auth, payment, security |
| Business logic | 90% | Core domain logic |
| UI/Utilities | 80% | User-facing components |
| Overall | 80% | Project minimum (or custom) |

---

## Test File Naming Conventions

| Framework | Test File | Location |
|-----------|-----------|----------|
| Jest | `*.test.ts`, `*.spec.ts` | `__tests__/` or alongside |
| PHPUnit | `*Test.php` | `tests/Unit/`, `tests/Feature/` |
| PyTest | `test_*.py`, `*_test.py` | `tests/` |
| Go | `*_test.go` | Same package |
| Detox | `*.e2e.ts` | `e2e/` |
| Cypress | `*.cy.ts` | `cypress/e2e/` |

---

## Running Tests by Framework

```bash
# JavaScript/TypeScript (Jest)
npm test
npm test -- --coverage
npm test -- --watch

# PHP (PHPUnit)
./vendor/bin/phpunit
./vendor/bin/phpunit --coverage-html coverage
./vendor/bin/phpunit --filter TestClassName

# Python (PyTest)
pytest
pytest --cov=. --cov-report=html
pytest -k "test_function_name"

# Go
go test ./...
go test -v ./...
go test -coverprofile=coverage.out ./...

# React Native (Detox)
detox test --configuration ios.sim.debug
detox test --configuration android.emu.debug
```

---

**Remember:**
- Tests are documentation - write clear, maintainable tests
- Follow AAA pattern: Arrange, Act, Assert
- One assertion concept per test (can have multiple expects)
- Test behavior, not implementation
- Mock external dependencies
