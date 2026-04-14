---
name: test-writer
description: "Write tests with TDD following structured patterns. Ensures consistent AAA structure, proper coverage targets, and framework-specific conventions. Without this skill, tests lack consistent naming, miss coverage targets, and skip anti-pattern checks."
autoInvoke: true
priority: medium
triggers:
  - "add tests"
  - "test coverage"
  - "write tests"
  - "TDD"
  - "E2E test"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Test Writer

## When to Use

Adding tests, improving coverage, TDD (Phase 2/3). NOT for: bug fixes (bugfix-quick), features (workflow-orchestrator).

---

## Process

1. **Detect framework** from package.json / pyproject.toml / go.mod
2. **Analyze target** — read file, identify testable units, list deps to mock
3. **Write tests** — TDD: RED (failing) → GREEN (implement) → refactor. Existing code: passing → edge cases → errors
4. **Verify coverage** — run with coverage flag, check against targets

## Principles

```toon
principles[5]{principle}:
  AAA pattern: Arrange → Act → Assert
  "should [action] when [condition]" naming
  One concern per test — no shared state
  Test behavior not implementation
  Mock external deps only — use fakes for complex deps
```

## Coverage Targets

```toon
coverage[4]{scope,target}:
  Critical paths (auth/payment),100%
  Business logic,90%
  UI / utilities,80%
  Overall minimum,80%
```

## Anti-Patterns

```toon
avoid[5]{pattern,fix}:
  Test implementation details,Test behavior/output only
  Shared state between tests,Reset in beforeEach
  Sleep/delays,Use waitFor/polling
  Giant multi-assertion tests,One concern per test
  No assertions,Always assert expected outcomes
```

## Framework Detection

```toon
frameworks[6]{framework,file_pattern,runner}:
  Jest/Vitest,"*.test.ts *.spec.ts","npm test / npx vitest"
  PHPUnit,"*Test.php","./vendor/bin/phpunit"
  Pytest,"test_*.py","pytest --cov=."
  Go,"*_test.go","go test -cover ./..."
  Cypress,"*.cy.ts","npx cypress"
  Detox,"*.e2e.ts","detox test"
```
