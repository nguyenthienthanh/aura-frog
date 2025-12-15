---
name: typescript-expert
description: "TypeScript best practices expert. PROACTIVELY use when working with TypeScript/JavaScript files. Triggers: .ts, .tsx, .js, .jsx files, type errors, ESLint issues, strict mode"
autoInvoke: true
priority: high
triggers:
  - "typescript"
  - "type error"
  - "eslint"
  - "strict mode"
  - ".ts file"
  - ".tsx file"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# TypeScript Expert Skill

Expert-level TypeScript patterns, ESLint best practices, and strict type handling.

---

## Auto-Detection

This skill activates when:
- Working with `.ts`, `.tsx`, `.js`, `.jsx` files
- Type errors or ESLint issues detected
- User mentions TypeScript, types, or linting

---

## 1. Strict Null Handling

### NEVER Use Implicit Truthiness

```toon
nullish_patterns[6]{bad,good,why}:
  if (str),if (str != null && str !== ''),Empty string '' is falsy
  if (arr),if (arr?.length > 0),Empty array [] is truthy
  if (num),if (num != null),Zero 0 is falsy but valid
  if (obj),if (obj != null),Check null not emptiness
  {count && <X/>},{count > 0 && <X/>},Renders "0" if count=0
  value || default,value ?? default,|| treats '' and 0 as falsy
```

### Examples

```typescript
// ❌ BAD
if (userName) { }
if (items) { }
if (count) { }
const val = input || 'default';

// ✅ GOOD
if (userName != null && userName !== '') { }
if (items != null && items.length > 0) { }
if (count != null) { }
const val = input ?? 'default';
```

---

## 2. Type Safety Patterns

### Strict TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Assertions

```typescript
// ❌ BAD - Type assertion without validation
const user = data as User;

// ✅ GOOD - Type guard with validation
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  // data is typed as User
}

// ✅ GOOD - Zod schema validation
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
const user = UserSchema.parse(data);
```

### Discriminated Unions

```typescript
// ✅ GOOD - Exhaustive type checking
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'loading' };

function handleResult<T>(result: Result<T>) {
  switch (result.status) {
    case 'success':
      return result.data;
    case 'error':
      throw result.error;
    case 'loading':
      return null;
    default:
      // Exhaustiveness check
      const _exhaustive: never = result;
      return _exhaustive;
  }
}
```

---

## 3. ESLint Best Practices

### Recommended Rules

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowString": false,
      "allowNumber": false,
      "allowNullableObject": false
    }],
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "no-implicit-coercion": "error",
    "eqeqeq": ["error", "always", { "null": "ignore" }]
  }
}
```

---

## 4. Modern JavaScript/TypeScript

### Required Patterns

```toon
modern_patterns[10]{feature,example}:
  Optional chaining,user?.profile?.name
  Nullish coalescing,value ?? 'default'
  Destructuring,const { name, age } = user
  Arrow functions,items.map(x => x.id)
  Template literals,`Hello ${name}`
  Spread operator,{ ...defaults, ...options }
  const/let (no var),const x = 1; let y = 2
  Object shorthand,{ name, email }
  async/await,const data = await fetch()
  Array methods,.map() .filter() .find() .reduce()
```

### Async Patterns

```typescript
// ❌ BAD - Unhandled promise
async function bad() {
  fetchData(); // Promise ignored
}

// ✅ GOOD - Proper async handling
async function good() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      handleApiError(error);
    }
    throw error;
  }
}

// ✅ GOOD - Parallel execution
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);
```

---

## 5. Error Handling

### Typed Errors

```typescript
// ✅ Define error types
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ Type-safe error handling
function handleError(error: unknown): string {
  if (error instanceof ValidationError) {
    return `Validation failed: ${error.field} - ${error.message}`;
  }
  if (error instanceof ApiError) {
    return `API error ${error.statusCode}: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred';
}
```

---

## 6. Function Patterns

### Function Overloads

```typescript
// ✅ GOOD - Clear overloads
function parse(input: string): object;
function parse(input: string, reviver: (key: string, value: unknown) => unknown): object;
function parse(input: string, reviver?: (key: string, value: unknown) => unknown): object {
  return JSON.parse(input, reviver);
}
```

### Generic Constraints

```typescript
// ✅ GOOD - Constrained generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ✅ GOOD - Default generic type
function createState<T = string>(initial: T): [T, (value: T) => void] {
  let state = initial;
  return [state, (value: T) => { state = value; }];
}
```

---

## 7. Import/Export Patterns

```typescript
// ✅ GOOD - Type-only imports
import type { User, Post } from './types';
import { fetchUser } from './api';

// ✅ GOOD - Consistent exports
export type { User, Post };
export { fetchUser, createUser };

// ❌ BAD - Default exports (hard to refactor)
export default function handler() { }

// ✅ GOOD - Named exports
export function handler() { }
```

---

## 8. Utility Types Mastery

```typescript
// Common utility types
type UserPartial = Partial<User>;           // All optional
type UserRequired = Required<User>;         // All required
type UserReadonly = Readonly<User>;         // All readonly
type UserPick = Pick<User, 'id' | 'name'>; // Subset
type UserOmit = Omit<User, 'password'>;    // Exclude
type UserRecord = Record<string, User>;    // Dictionary

// Advanced patterns
type NonNullableUser = NonNullable<User | null>;
type UserKeys = keyof User;
type UserValues = User[keyof User];
type ExtractStrings = Extract<User[keyof User], string>;

// Conditional types
type ApiResponse<T> = T extends Error ? { error: T } : { data: T };
```

---

## Quick Reference

```toon
checklist[8]{check,action}:
  Implicit truthiness,Use explicit null checks
  any type,Replace with unknown or proper type
  Type assertion,Use type guards instead
  Floating promises,Always await or handle
  Optional chaining,Use ?. for nested access
  Nullish coalescing,Use ?? not ||
  Type imports,Use 'import type' for types
  Error handling,Use typed error classes
```

---

**Version:** 1.2.1
