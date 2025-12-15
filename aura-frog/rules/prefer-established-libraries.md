# Prefer Established Libraries Rule

**Category:** Quality
**Priority:** High
**Version:** 1.0.0
**Applies To:** All utility functions, data manipulation, common operations

---

## Overview

Use established, well-tested libraries instead of writing custom utility functions. This reduces bugs, improves maintainability, and leverages battle-tested code.

---

## Core Principle

```
Before writing a utility function, ask:
"Does lodash, es-toolkit, or another established library already do this?"

If YES → Use the library
If NO → Write custom code (with tests)
```

---

## Recommended Libraries

```toon
libraries[12]{category,library,use_for}:
  Utilities,lodash,Array/object/string manipulation
  Utilities,es-toolkit,Modern lodash alternative (tree-shakeable)
  Utilities,ramda,Functional programming utilities
  Dates,date-fns,Date manipulation (tree-shakeable)
  Dates,dayjs,Lightweight moment.js alternative
  Validation,zod,Schema validation + TypeScript
  Validation,yup,Schema validation
  HTTP,axios,HTTP requests
  HTTP,ky,Lightweight fetch wrapper
  Async,p-limit,Concurrency control
  Async,p-retry,Retry with exponential backoff
  Strings,validator,String validation (email/URL/etc)
```

---

## Common Patterns - Use Libraries

### Array Operations

```typescript
// ❌ DON'T: Write custom array utilities
function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// ✅ DO: Use lodash or es-toolkit
import { uniq, chunk, groupBy } from 'lodash';
// or
import { uniq, chunk, groupBy } from 'es-toolkit';

const uniqueItems = uniq(items);
const chunkedItems = chunk(items, 10);
const groupedItems = groupBy(items, 'category');
```

### Object Operations

```typescript
// ❌ DON'T: Write custom deep clone/merge
function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target: any, source: any): any {
  // Complex recursive logic...
}

// ✅ DO: Use lodash
import { cloneDeep, merge, pick, omit } from 'lodash';

const cloned = cloneDeep(original);
const merged = merge(defaults, options);
const subset = pick(user, ['id', 'name', 'email']);
const sanitized = omit(data, ['password', 'token']);
```

### String Operations

```typescript
// ❌ DON'T: Write custom string utilities
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

// ✅ DO: Use lodash
import { capitalize, kebabCase, truncate, camelCase, snakeCase } from 'lodash';

const title = capitalize(name);
const slug = kebabCase(title);
const preview = truncate(description, { length: 100 });
```

### Debounce/Throttle

```typescript
// ❌ DON'T: Write custom debounce
function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ✅ DO: Use lodash
import { debounce, throttle } from 'lodash';

const debouncedSearch = debounce(search, 300);
const throttledScroll = throttle(onScroll, 100);
```

### Date Operations

```typescript
// ❌ DON'T: Write custom date utilities
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ✅ DO: Use date-fns or dayjs
import { format, addDays, differenceInDays, isAfter } from 'date-fns';

const formatted = format(date, 'yyyy-MM-dd');
const nextWeek = addDays(date, 7);
const daysDiff = differenceInDays(end, start);
```

### Validation

```typescript
// ❌ DON'T: Write custom validation
function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// ✅ DO: Use validator or zod
import validator from 'validator';

const valid = validator.isEmail(email);
const validUrl = validator.isURL(url);

// Or with zod for schema validation
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  url: z.string().url(),
  age: z.number().min(0).max(120),
});
```

### Async Utilities

```typescript
// ❌ DON'T: Write custom async utilities
async function retry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Unreachable');
}

// ✅ DO: Use p-retry
import pRetry from 'p-retry';

const result = await pRetry(() => fetchData(), {
  retries: 3,
  onFailedAttempt: error => {
    console.log(`Attempt ${error.attemptNumber} failed`);
  },
});
```

---

## When Custom Code Is Acceptable

### 1. Domain-Specific Logic

```typescript
// ✅ OK: Business logic specific to your domain
function calculateOrderTotal(items: OrderItem[], discounts: Discount[]): number {
  // Complex business rules that no library handles
}

function validateBusinessRule(data: BusinessData): ValidationResult {
  // Domain-specific validation
}
```

### 2. Performance-Critical Paths

```typescript
// ✅ OK: When you've profiled and library is too slow
// Document why custom implementation is needed
/**
 * Custom implementation for hot path.
 * lodash.groupBy was 3x slower in our benchmark (see /docs/perf/groupBy.md)
 */
function fastGroupBy<T>(items: T[], key: keyof T): Map<string, T[]> {
  // Optimized implementation
}
```

### 3. Trivial One-Liners

```typescript
// ✅ OK: Simple enough that a library import is overkill
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const isEmpty = (arr: unknown[]) => arr.length === 0;
```

### 4. No Suitable Library Exists

```typescript
// ✅ OK: When no library handles your use case
// But first, search npm and GitHub!
function customUtility() {
  // Document: "Searched npm, no suitable library found for X"
}
```

---

## Library Selection Guide

```toon
selection_criteria[5]{factor,guidance}:
  Bundle size,Prefer tree-shakeable (es-toolkit > lodash full)
  Maintenance,Check npm downloads + last publish date
  TypeScript,Prefer libraries with built-in types
  Dependencies,Fewer dependencies = better
  Performance,Check benchmarks for hot paths
```

### lodash vs es-toolkit

```typescript
// lodash: Mature, comprehensive, larger bundle
import { groupBy } from 'lodash'; // Pulls more code

// es-toolkit: Modern, tree-shakeable, smaller bundle
import { groupBy } from 'es-toolkit'; // Only imports what you use

// Recommendation: Use es-toolkit for new projects
// Use lodash if already in project or need specific features
```

---

## Enforcement

### Code Review Checklist

- [ ] No reinventing lodash/es-toolkit utilities
- [ ] No custom date formatting (use date-fns/dayjs)
- [ ] No custom validation regex (use validator/zod)
- [ ] No custom debounce/throttle
- [ ] Custom utilities have justification in comments

### ESLint Rule (Optional)

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'FunctionDeclaration[id.name=/^(debounce|throttle|groupBy|chunk|uniq)$/]',
        message: 'Use lodash or es-toolkit instead of custom implementation',
      },
    ],
  },
};
```

---

## Checklist Before Writing Utility

- [ ] Searched lodash/es-toolkit documentation
- [ ] Searched npm for existing packages
- [ ] Checked if date-fns/dayjs handles date operations
- [ ] Verified no team member already wrote this utility
- [ ] If writing custom: documented reason why

---

## Related Rules

- `yagni-principle.md` - Don't add unused features
- `dry-with-caution.md` - Avoid premature abstraction
- `dependency-management.md` - Version pinning and audits
- `code-quality.md` - TypeScript strict mode

---

**Version:** 1.0.0 | **Last Updated:** 2025-12-11
