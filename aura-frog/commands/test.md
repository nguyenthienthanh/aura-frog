# Command: /test

**Category:** Testing (Bundled)
**Scope:** Session
**Version:** 2.0.0

---

## Purpose

Unified testing command with intelligent test type detection. Replaces individual test commands with a single entry point.

---

## Usage

```bash
# Auto-detect and run appropriate tests
/test

# Specific test types
/test unit [path]
/test e2e [path]
/test coverage [path]
/test watch [path]

# Documentation
/test docs
```

---

## Subcommands

| Subcommand | Description | Example |
|------------|-------------|---------|
| `unit [path]` | Run unit tests | `/test unit src/services/` |
| `e2e [path]` | Run E2E tests | `/test e2e` |
| `coverage [path]` | Run with coverage report | `/test coverage src/` |
| `watch [path]` | Run in watch mode | `/test watch` |
| `docs` | Generate test documentation | `/test docs` |
| `snapshot` | Update snapshots | `/test snapshot` |
| `debug <test>` | Debug specific test | `/test debug "user login"` |

---

## Auto-Detection

When called without subcommand, detects:

1. **Test Framework:** Jest, Vitest, Pytest, PHPUnit, Go testing
2. **Test Type:** Based on file patterns and config
3. **Scope:** Changed files or full suite

```
🧪 Test Commands

Detected: vitest (coverage: 78%)

Quick Actions:
  [1] Run all tests
  [2] Run changed tests only
  [3] Run with coverage

Test Types:
  [4] Unit tests
  [5] Integration tests
  [6] E2E tests

Utilities:
  [7] Watch mode
  [8] Debug failing test
  [9] Update snapshots

Select [1-9] or type command:
```

---

## Framework Support

```toon
frameworks[6]{framework,runner,coverage}:
  Vitest,npx vitest,@vitest/coverage-v8
  Jest,npx jest,--coverage
  Pytest,pytest,pytest-cov
  PHPUnit,./vendor/bin/phpunit,--coverage-html
  Go,go test,go test -cover
  Cypress,npx cypress run,--
```

---

## Coverage Output

```markdown
## 📊 Test Coverage Report

**Overall:** 78% (target: 80%)

| File | Lines | Branches | Functions |
|------|-------|----------|-----------|
| auth.service.ts | 92% | 85% | 100% |
| user.service.ts | 75% | 70% | 80% |
| api.controller.ts | 68% | 60% | 75% |

### Uncovered Lines
- `auth.service.ts:45-48` - Error handling branch
- `user.service.ts:120-125` - Edge case validation

### Recommendations
1. Add test for auth error handling
2. Cover user validation edge cases
```

---

## Related Files

- **Test Writer Skill:** `skills/test-writer/SKILL.md`
- **Testing Patterns:** `skills/testing-patterns/SKILL.md`
- **TDD Rule:** `rules/tdd-workflow.md`
- **Legacy Commands:** `commands/test/unit.md`, `commands/test/e2e.md`

---

**Version:** 2.0.0 | **Last Updated:** 2026-01-21
