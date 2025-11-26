# Command: quality:check

**Command:** `quality:check [target]`
**Agent:** qa-automation
**Version:** 5.0.0

---

## 🎯 Purpose

Run comprehensive code quality checks including linting, formatting, type checking, and test coverage analysis.

---

## 📋 Usage

```bash
# Check entire project
quality:check

# Check specific directory
quality:check src/components

# Check specific file
quality:check src/utils/helpers.ts

# Skip tests (linting only)
quality:check --skip-tests
```

---

## 🔧 Checks Performed

### 1. Linting
```bash
# JavaScript/TypeScript
npx eslint . --ext .js,.jsx,.ts,.tsx

# Python
pylint **/*.py
flake8 .

# PHP
./vendor/bin/phpcs

# Go
golangci-lint run
```

### 2. Formatting
```bash
# Prettier (JS/TS/CSS)
npx prettier --check .

# Black (Python)
black --check .

# gofmt (Go)
gofmt -l .
```

### 3. Type Checking
```bash
# TypeScript
npx tsc --noEmit

# Python
mypy .

# PHP
./vendor/bin/phpstan analyze
```

### 4. Test Coverage
```bash
# Jest (JavaScript/TypeScript)
npm test -- --coverage

# pytest (Python)
pytest --cov=. --cov-report=term

# PHPUnit (PHP)
./vendor/bin/phpunit --coverage-text

# Go
go test -cover ./...
```

### 5. Complexity Analysis
```bash
# JavaScript/TypeScript (eslint-plugin-complexity)
npx eslint --rule 'complexity: [error, 10]'

# Python (radon)
radon cc . -a

# PHP (phpmd)
./vendor/bin/phpmd . text codesize,controversial,design
```

---

## 📊 Output

```markdown
# Code Quality Report

**Project:** my-project
**Date:** 2025-11-26
**Branch:** feature/user-auth

---

## Summary

✅ **Overall:** PASS
- Linting: ✅ PASS (0 errors, 0 warnings)
- Formatting: ✅ PASS (all files formatted)
- Type Checking: ✅ PASS (no type errors)
- Test Coverage: ⚠️ WARNING (78% coverage, target 80%)
- Complexity: ✅ PASS (avg complexity: 6)

---

## Linting Results

**ESLint:** 0 errors, 0 warnings

```

**Pylint:** Score 9.5/10

---

## Formatting Issues

✅ All files properly formatted

---

## Type Checking

✅ No type errors found

---

## Test Coverage

**Overall Coverage:** 78% (⚠️ Below 80% target)

| File | Coverage | Lines | Missing |
|------|----------|-------|---------|
| src/utils/helpers.ts | 95% | 100 | 5 |
| src/services/auth.ts | 65% | 200 | 70 |
| src/components/UserProfile.tsx | 80% | 150 | 30 |

**Recommendations:**
- Add tests for auth.ts (65% coverage)
- Cover edge cases in UserProfile.tsx

---

## Complexity Analysis

**Average Complexity:** 6 (✅ Target: <10)

**High Complexity Functions:**
- `src/utils/validation.ts:validateForm` - Complexity: 15 (⚠️)
- `src/services/api.ts:handleResponse` - Complexity: 12 (⚠️)

**Recommendations:**
- Refactor validateForm() to reduce complexity
- Split handleResponse() into smaller functions

---

## Issues Found: 2

### ⚠️ WARNING: Low test coverage in auth.ts
- **Location:** src/services/auth.ts
- **Coverage:** 65% (target: 80%)
- **Missing:** Error handling, token refresh logic
- **Action:** Add unit tests for auth flows

### ⚠️ WARNING: High complexity in validateForm
- **Location:** src/utils/validation.ts:validateForm
- **Complexity:** 15 (target: <10)
- **Action:** Refactor into smaller validation functions

---

## Next Steps

1. Add tests for auth.ts to reach 80% coverage
2. Refactor validateForm() to reduce complexity
3. Re-run quality:check to verify improvements

**Estimated time:** 1-2 hours
```

---

## 🎨 Configuration

**ESLint (.eslintrc.json):**
```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "complexity": ["error", 10],
    "max-lines-per-function": ["warn", 50],
    "no-console": "warn"
  }
}
```

**Prettier (.prettierrc):**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Jest (package.json):**
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 🚨 Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 1 | Linting errors found |
| 2 | Formatting issues found |
| 3 | Type errors found |
| 4 | Coverage below threshold |
| 5 | High complexity detected |

---

**Command:** quality:check
**Version:** 5.0.0
