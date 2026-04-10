---
name: typescript-expert
description: "TypeScript best practices expert. PROACTIVELY use when working with TypeScript/JavaScript files. Triggers: .ts, .tsx, .js, .jsx files, type errors, ESLint issues, strict mode"
autoInvoke: false
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

TypeScript patterns: strict types, ESLint, null handling.

---

## 1. Strict Null Handling

```toon
nullish_patterns[6]{bad,good,why}:
  if (str),if (str != null && str !== ''),Empty string '' is falsy
  if (arr),if (arr?.length > 0),Empty array [] is truthy
  if (num),if (num != null),Zero 0 is falsy but valid
  if (obj),if (obj != null),Check null not emptiness
  {count && <X/>},{count > 0 && <X/>},Renders "0" if count=0
  value || default,value ?? default,|| treats '' and 0 as falsy
```

---

## 2. Type Safety

**Strict config:** Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`.

**Type guards over assertions:**
```typescript
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data && 'name' in data;
}
```

**Discriminated unions** with exhaustive `switch` + `never` check.

**Zod** for runtime validation: `const user = UserSchema.parse(data)`.

---

## 3. ESLint

Key rules: `strict-boolean-expressions`, `no-floating-promises`, `no-misused-promises`, `no-explicit-any`, `no-unsafe-*`, `consistent-type-imports`, `prefer-nullish-coalescing`.

---

## 4. Modern Patterns

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

Async: Always `try/catch`, `instanceof` for error types, `Promise.all` for parallel.

---

## 5. Error Handling

Typed error classes: `ValidationError` (field, code), `ApiError` (statusCode, response). Handle `unknown` errors with `instanceof` chain.

---

## 6. Functions

**Overloads** for multiple signatures. **Generic constraints:** `<T, K extends keyof T>`. **Default generics:** `<T = string>`.

---

## 7. Imports

`import type { X }` for types. Named exports over default (easier refactoring).

---

## 8. Utility Types

`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `NonNullable`, `Extract`. Conditional types: `T extends Error ? { error: T } : { data: T }`.

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
