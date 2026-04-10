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

# Test Writer

## When to Use

- Adding tests, improving coverage, creating test suites, TDD (Phase 2/3)
- NOT for: bug fixes (→ bugfix-quick), full features (→ workflow-orchestrator)

---

## Process

1. **Load test patterns** from `.claude/cache/test-patterns.json` if exists (framework, imports, mock style, naming convention). Otherwise detect from package.json/pyproject.toml.

2. **Analyze target** — read file, identify testable units, list dependencies to mock.

3. **Write tests:**
   - **TDD (new code):** Write failing tests (RED) → implement (GREEN) → refactor
   - **Existing code:** Write passing tests → add edge cases → add error handling tests

4. **Verify coverage** — run tests with coverage flag, check against 80% target (or project-specific).

---

## Test Strategy

```toon
types[3]{type,scope,when}:
  Unit,"Single function/component with mocked deps","Default for most code"
  Integration,"Module interactions + API calls","Data layers + service boundaries"
  E2E,"Complete user flows with real deps","Critical paths (login checkout payment)"
```

## Coverage Targets

```toon
coverage[4]{scope,target}:
  Critical paths (auth/payment),100%
  Business logic,90%
  UI / utilities,80%
  Overall minimum,80%
```

---

## Test Quality Rules

- AAA pattern: Arrange, Act, Assert
- "should...when..." naming: `it('should display error when API returns 400')`
- One concern per test
- Test behavior, not implementation
- Mock external dependencies only
- Cover: happy path + errors + edge cases + boundaries

## File Naming

```toon
naming[6]{framework,pattern,location}:
  Jest,"*.test.ts / *.spec.ts","__tests__/ or alongside"
  PHPUnit,"*Test.php","tests/Unit/ tests/Feature/"
  PyTest,"test_*.py","tests/"
  Go,"*_test.go","Same package"
  Detox,"*.e2e.ts","e2e/"
  Cypress,"*.cy.ts","cypress/e2e/"
```

## Running Tests

```toon
commands[5]{framework,test,coverage}:
  Jest/Vitest,"npm test","npm test -- --coverage"
  PHPUnit,"./vendor/bin/phpunit","--coverage-html coverage"
  PyTest,"pytest","pytest --cov=. --cov-report=html"
  Go,"go test ./...","go test -coverprofile=coverage.out ./..."
  Detox,"detox test --configuration ios.sim.debug",N/A
```
