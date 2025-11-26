# Command: quality:complexity

**Command:** `quality:complexity [target]`
**Agent:** qa-automation
**Version:** 5.0.0

---

## 🎯 Purpose

Analyze code complexity using cyclomatic complexity, cognitive complexity, maintainability index, and identify functions/classes that need refactoring.

---

## 📋 Usage

```bash
# Analyze entire project
quality:complexity

# Analyze specific file
quality:complexity src/services/auth.ts

# Show only high complexity (>10)
quality:complexity --threshold 10

# Export detailed report
quality:complexity --export complexity-report.json
```

---

## 🔧 Complexity Metrics

### 1. Cyclomatic Complexity
Measures number of linearly independent paths through code.

**Scale:**
- 1-5: ✅ Simple (low risk)
- 6-10: 🟡 Moderate (medium risk)
- 11-20: 🟠 Complex (high risk)
- 21+: 🔴 Very complex (very high risk)

```typescript
// Complexity: 1 (linear flow)
function greet(name: string) {
  return `Hello, ${name}`;
}

// Complexity: 3 (if/else + return paths)
function getDiscount(amount: number) {
  if (amount > 100) {
    return 0.2;
  } else if (amount > 50) {
    return 0.1;
  }
  return 0;
}

// Complexity: 15 (many conditions)
function validateForm(form) {
  if (!form.email) return false;
  if (!form.password) return false;
  if (form.password.length < 8) return false;
  if (!form.email.includes('@')) return false;
  // ... 10 more conditions
  return true;
}
```

### 2. Cognitive Complexity
Measures how hard code is to understand (considers nesting).

```typescript
// Cyclomatic: 4, Cognitive: 7 (nested conditions harder to understand)
function processOrder(order) {
  if (order.items.length > 0) {            // +1
    for (let item of order.items) {         // +2 (nested)
      if (item.quantity > 10) {             // +3 (double nested)
        if (item.price > 100) {             // +4 (triple nested)
          applyBulkDiscount(item);
        }
      }
    }
  }
}
```

### 3. Maintainability Index
Combines complexity, lines of code, and Halstead volume.

**Scale:**
- 85-100: ✅ Highly maintainable
- 65-84: 🟡 Moderately maintainable
- 0-64: 🔴 Difficult to maintain

---

## 🔧 Tools Used

### JavaScript/TypeScript
```bash
# ESLint complexity plugin
npx eslint --rule 'complexity: [error, 10]' src/

# ts-complexity
npx ts-complexity src/**/*.ts
```

### Python
```bash
# Radon (cyclomatic complexity)
radon cc src/ -a -s

# Cognitive complexity
flake8 --max-cognitive-complexity 10 src/

# Maintainability index
radon mi src/ -s
```

### PHP
```bash
# PHPMD (complexity)
./vendor/bin/phpmd src/ text codesize

# PHPMetrics
phpmetrics --report-html=report/ src/
```

### Go
```bash
# Gocyclo
gocyclo -over 10 .

# Gocognit
gocognit -over 15 .
```

---

## 📊 Output

```markdown
# Code Complexity Report

**Project:** my-project
**Date:** 2025-11-26
**Files Analyzed:** 145

---

## Summary

**Average Complexity:** 6.2 (✅ Target: <10)
**High Complexity Functions:** 8 (🟠 Needs attention)
**Very High Complexity:** 2 (🔴 Critical)

| Metric | Value | Status |
|--------|-------|--------|
| Avg Cyclomatic Complexity | 6.2 | ✅ Good |
| Avg Cognitive Complexity | 8.1 | 🟡 Fair |
| Avg Maintainability Index | 72 | 🟡 Fair |
| Functions >10 complexity | 8 | 🟠 Warning |
| Functions >20 complexity | 2 | 🔴 Critical |

---

## 🔴 Critical Complexity (2 functions)

### 1. validateUserForm()
**File:** `src/utils/validation.ts:45`
**Cyclomatic Complexity:** 24
**Cognitive Complexity:** 31
**Lines:** 85
**Maintainability:** 42 (🔴 Low)

```typescript
function validateUserForm(form: UserForm): ValidationResult {
  const errors: string[] = [];

  if (!form.email) {
    errors.push('Email required');
  } else if (!form.email.includes('@')) {
    errors.push('Invalid email');
  } else if (form.email.length > 255) {
    errors.push('Email too long');
  }

  if (!form.password) {
    errors.push('Password required');
  } else if (form.password.length < 8) {
    errors.push('Password too short');
  } else if (!/[A-Z]/.test(form.password)) {
    errors.push('Password needs uppercase');
  } else if (!/[0-9]/.test(form.password)) {
    errors.push('Password needs number');
  }

  // ... 15 more similar conditions

  return { valid: errors.length === 0, errors };
}
```

**Refactoring Suggestion:**
```typescript
// Split into smaller validators (complexity: 2-3 each)
function validateEmail(email: string): string | null {
  if (!email) return 'Email required';
  if (!email.includes('@')) return 'Invalid email';
  if (email.length > 255) return 'Email too long';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password required';
  if (password.length < 8) return 'Password too short';
  if (!/[A-Z]/.test(password)) return 'Password needs uppercase';
  if (!/[0-9]/.test(password)) return 'Password needs number';
  return null;
}

function validateUserForm(form: UserForm): ValidationResult {
  const errors = [
    validateEmail(form.email),
    validatePassword(form.password),
    validateName(form.name),
    // ...
  ].filter(Boolean);

  return { valid: errors.length === 0, errors };
}
```

**Impact:** Complexity 24 → 3 per function

---

### 2. processOrderPayment()
**File:** `src/services/payment.ts:120`
**Cyclomatic Complexity:** 21
**Cognitive Complexity:** 28
**Lines:** 120
**Maintainability:** 48 (🔴 Low)

**Refactoring Suggestion:**
- Extract payment validation
- Extract payment provider logic
- Extract error handling
- Use strategy pattern for different payment types

---

## 🟠 High Complexity (8 functions)

### handleApiResponse()
**File:** `src/services/api.ts:200`
**Complexity:** 15
**Refactor:** Extract error handling by status code

### generateReport()
**File:** `src/utils/reports.ts:80`
**Complexity:** 14
**Refactor:** Split into smaller report generation functions

### calculateShipping()
**File:** `src/services/shipping.ts:45`
**Complexity:** 13
**Refactor:** Use lookup table for shipping rules

---

## 📈 Complexity Distribution

```
Complexity Range | Functions | Percentage
-----------------+-----------+-----------
1-5 (Simple)     | 112       | 77%   ✅
6-10 (Moderate)  | 23        | 16%   🟡
11-20 (Complex)  | 8         | 5.5%  🟠
21+ (Very High)  | 2         | 1.5%  🔴
```

---

## 📊 Complexity by Directory

| Directory | Avg Complexity | High Risk Files |
|-----------|----------------|-----------------|
| src/services/ | 8.5 | 4 |
| src/utils/ | 7.2 | 3 |
| src/components/ | 4.1 | 1 |
| src/hooks/ | 3.8 | 0 |

**Most Complex Area:** `src/services/` (needs refactoring)

---

## 🎯 Refactoring Priorities

### Sprint 1 (Critical - 8 hours)
1. ✅ Refactor validateUserForm() → 24 to ~3
2. ✅ Refactor processOrderPayment() → 21 to ~5

### Sprint 2 (High - 6 hours)
3. Refactor handleApiResponse() → 15 to ~6
4. Refactor generateReport() → 14 to ~6
5. Refactor calculateShipping() → 13 to ~5

---

## 📚 Refactoring Patterns

### 1. Extract Method
Break large functions into smaller ones.

### 2. Replace Conditional with Polymorphism
Use strategy pattern for complex if/else chains.

### 3. Introduce Parameter Object
Group related parameters into objects.

### 4. Replace Nested Conditional with Guard Clauses
Early returns to reduce nesting.

```typescript
// ❌ Nested (cognitive complexity: 8)
function process(data) {
  if (data) {
    if (data.valid) {
      if (data.items.length > 0) {
        return processItems(data.items);
      }
    }
  }
  return null;
}

// ✅ Guard clauses (cognitive complexity: 3)
function process(data) {
  if (!data) return null;
  if (!data.valid) return null;
  if (data.items.length === 0) return null;
  return processItems(data.items);
}
```

---

## 📝 Next Steps

1. Review 2 critical complexity functions
2. Create refactoring tickets in JIRA
3. Estimate effort (14 hours total)
4. Schedule refactoring for next 2 sprints
5. Set up pre-commit hook to prevent complexity >15

---

## 🔧 Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Check complexity before commit
npx ts-complexity --threshold 15 src/**/*.ts

if [ $? -ne 0 ]; then
  echo "❌ Commit blocked: Functions with complexity >15 detected"
  echo "Please refactor before committing"
  exit 1
fi
```

---

**Command:** quality:complexity
**Version:** 5.0.0
