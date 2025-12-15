# TypeScript Strict Practices Rule

**Priority:** HIGH
**Enforcement:** Always
**Applies to:** React, React Native, Vue, Next.js, Node.js projects

---

## Rule

**Handle nullish/empty values explicitly. Never rely on implicit type coercion in conditionals.**

---

## Core Principles

### 1. Explicit Nullish Handling

```toon
nullish_patterns[5]{bad,good,reason}:
  if (str),if (str != null && str !== ''),String could be empty ''
  if (arr),if (arr != null && arr.length > 0),Array could be empty []
  if (obj),if (obj != null && Object.keys(obj).length > 0),Object could be empty {}
  if (num),if (num != null && num !== 0),Number could be 0
  if (bool),if (bool === true),Boolean should be explicit
```

### 2. String Conditionals

```typescript
// ❌ BAD - Empty string '' is falsy but might be valid
if (userName) {
  doSomething(userName);
}

// ✅ GOOD - Explicit null/undefined check
if (userName != null && userName !== '') {
  doSomething(userName);
}

// ✅ ALSO GOOD - Using optional chaining + nullish coalescing
const displayName = userName?.trim() || 'Anonymous';
```

### 3. Array Conditionals

```typescript
// ❌ BAD - Empty array [] is truthy but has no items
if (items) {
  items.map(renderItem);
}

// ✅ GOOD - Check length explicitly
if (items != null && items.length > 0) {
  items.map(renderItem);
}

// ✅ ALSO GOOD - Optional chaining with fallback
{items?.map(renderItem) ?? <EmptyState />}
```

### 4. Number Conditionals

```typescript
// ❌ BAD - 0 is falsy but might be valid value
if (count) {
  showCount(count);
}

// ✅ GOOD - Explicit null check
if (count != null) {
  showCount(count);
}

// ✅ GOOD - Check for specific invalid values
if (typeof count === 'number' && !isNaN(count)) {
  showCount(count);
}
```

### 5. Object Conditionals

```typescript
// ❌ BAD - Empty object {} is truthy
if (config) {
  applyConfig(config);
}

// ✅ GOOD - Check for null and non-empty
if (config != null && Object.keys(config).length > 0) {
  applyConfig(config);
}
```

---

## ESLint Rules to Enable

```json
{
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowString": false,
      "allowNumber": false,
      "allowNullableObject": false,
      "allowNullableBoolean": false,
      "allowNullableString": false,
      "allowNullableNumber": false,
      "allowAny": false
    }],
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "eqeqeq": ["error", "always", { "null": "ignore" }],
    "no-implicit-coercion": "error"
  }
}
```

---

## React/React Native Patterns

### Conditional Rendering

```tsx
// ❌ BAD - Shows "0" when count is 0
{count && <Badge count={count} />}

// ✅ GOOD - Explicit boolean conversion
{count > 0 && <Badge count={count} />}

// ❌ BAD - Shows nothing for empty string
{title && <Header title={title} />}

// ✅ GOOD - Explicit check
{title != null && title !== '' && <Header title={title} />}

// ✅ BETTER - Ternary for clarity
{title ? <Header title={title} /> : null}
```

### Optional Props

```tsx
// ❌ BAD - Implicit optional handling
interface Props {
  name?: string;
}
const Component = ({ name }: Props) => {
  return <div>{name}</div>; // Could render undefined
};

// ✅ GOOD - Explicit default
const Component = ({ name = 'Unknown' }: Props) => {
  return <div>{name}</div>;
};

// ✅ ALSO GOOD - Nullish coalescing
const Component = ({ name }: Props) => {
  return <div>{name ?? 'Unknown'}</div>;
};
```

---

## Vue Patterns

### Template Conditionals

```vue
<!-- ❌ BAD - Implicit truthy check -->
<template>
  <div v-if="userName">{{ userName }}</div>
</template>

<!-- ✅ GOOD - Explicit check -->
<template>
  <div v-if="userName != null && userName !== ''">{{ userName }}</div>
</template>

<!-- ✅ GOOD - Computed property -->
<template>
  <div v-if="hasUserName">{{ userName }}</div>
</template>

<script setup lang="ts">
const hasUserName = computed(() => userName.value != null && userName.value !== '');
</script>
```

### List Rendering

```vue
<!-- ❌ BAD - v-for on potentially null array -->
<template>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</template>

<!-- ✅ GOOD - Guard with v-if -->
<template>
  <template v-if="items != null && items.length > 0">
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </template>
  <EmptyState v-else />
</template>
```

---

## TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Common Patterns Reference

```toon
safe_patterns[8]{scenario,pattern}:
  String display,{str ?? 'default'}
  String conditional,{str != null && str !== '' && <Component />}
  Array render,{arr?.length > 0 && arr.map(...)}
  Array fallback,{arr?.map(...) ?? <Empty />}
  Number display,{num ?? 0}
  Number conditional,{num != null && num > 0 && <Component />}
  Object access,{obj?.property ?? 'default'}
  Nested access,{obj?.nested?.deep?.value ?? 'default'}
```

---

## Checklist

Before committing, verify:

- [ ] No implicit string conditionals (`if (str)` → `if (str != null && str !== '')`)
- [ ] No implicit array conditionals (`if (arr)` → `if (arr?.length > 0)`)
- [ ] No implicit number conditionals (`if (num)` → `if (num != null)`)
- [ ] JSX/TSX uses explicit boolean for `&&` rendering
- [ ] Optional props have defaults or nullish coalescing
- [ ] ESLint strict-boolean-expressions enabled (if applicable)

---

**Version:** 1.2.1
**Category:** quality
