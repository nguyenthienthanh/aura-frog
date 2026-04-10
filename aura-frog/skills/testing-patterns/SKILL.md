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
context: fork
---

# Testing Patterns

## Principles

```toon
principles[8]{principle,detail}:
  AAA Pattern,"Arrange → Act → Assert"
  Single Assertion,One logical assertion per test
  Descriptive Names,"should [action] when [condition]"
  No Test Logic,No conditionals in tests
  Isolated Tests,Independent — no shared state
  Fast Execution,Unit <100ms each
  Deterministic,Same result every run
  Test Behavior,"Test what not how"
```

## Test Types

```toon
types[4]{type,scope,speed,ratio}:
  Unit,Single function/class,<100ms,80% of tests
  Integration,Multiple units + API/DB,<1s,As needed
  E2E,Full user flow,<30s,Critical paths only
  Snapshot,UI output comparison,<500ms,Components
```

## Framework Detection

```toon
frameworks[8]{framework,detect_by,runner}:
  Jest,jest.config.js / package.json,npx jest
  Vitest,vitest.config.ts,npx vitest
  Pytest,pytest.ini / conftest.py,pytest
  PHPUnit,phpunit.xml,./vendor/bin/phpunit
  Go,*_test.go files,go test
  RSpec,spec/ + Gemfile,bundle exec rspec
  Cypress,cypress.config.ts,npx cypress
  Detox,.detoxrc.js,detox test
```

## Test Structure (Universal)

All frameworks follow AAA pattern with describe/context grouping:

```
describe('Module')
  describe('when condition')
    it('should behavior') → Arrange → Act → Assert
```

Adapt syntax per framework (describe/it for JS, class/def for Python, t.Run for Go).

## Mocking Patterns

```toon
patterns[5]{pattern,when}:
  Spy,Track calls without changing behavior
  Stub,Replace with fixed return value
  Mock,Replace with custom implementation
  Fake,In-memory implementation for complex deps
  Fixture,Predefined test data files
```

## Coverage Targets

```toon
coverage[4]{metric,minimum,good}:
  Line,70%,80%
  Branch,60%,70%
  Function,80%,90%
  Statement,70%,80%
```

## Anti-Patterns

```toon
avoid[6]{pattern,fix}:
  Test implementation details,Test behavior/output only
  Shared state between tests,Reset in beforeEach
  Sleep/delays,Use waitFor/polling
  Too many mocks,Use fakes for complex deps
  Giant multi-assertion tests,One concern per test
  No assertions,Always assert expected outcomes
```

## Naming Conventions

```toon
naming[4]{format,example}:
  should_when,"should return user when id exists"
  method_scenario_result,"createUser_validData_returnsUser"
  given_when_then,"givenValidUser_whenCreate_thenSuccess"
  test_method,"test_create_user_with_valid_data"
```
