# DRY with Caution

**Category:** Code Quality & Architecture
**Priority:** High
**Version:** 5.2.0
**Applies To:** Phase 5b (Implementation), Phase 5c (Refactor)

---

## Overview

**DRY (Don't Repeat Yourself)** is valuable, but premature DRY creates worse problems than duplication. Wait for the **Rule of Three** before abstracting.

---

## The Rule of Three

```
1st occurrence → Just write it
2nd occurrence → Note the duplication, keep it
3rd occurrence → NOW refactor to remove duplication
```

**Why?** The first two occurrences rarely have the same abstraction. By the third, you understand the real pattern.

---

## When DRY Goes Wrong

### 1. Premature Abstraction

```typescript
// ❌ Wrong DRY: Abstract too early
// You see similar code twice and immediately create:
function processEntity<T extends BaseEntity>(
  entity: T,
  processor: EntityProcessor<T>,
  validator: EntityValidator<T>,
  options: ProcessOptions
): ProcessResult<T> {
  // Complex generic implementation
}

// Now both callers are coupled to this complex abstraction
// and neither fits it perfectly

// ✅ Better: Keep separate until pattern is clear
function processUser(user: User): UserResult {
  // User-specific logic
}

function processOrder(order: Order): OrderResult {
  // Order-specific logic (looks similar but has different needs)
}
```

### 2. Wrong Abstraction

```typescript
// ❌ Wrong DRY: Forcing unrelated things together
function formatDisplayValue(
  value: string | number | Date | User | Product,
  type: 'currency' | 'date' | 'user' | 'product' | 'text'
): string {
  switch (type) {
    case 'currency': return `$${value}`
    case 'date': return formatDate(value as Date)
    case 'user': return (value as User).name
    case 'product': return (value as Product).title
    default: return String(value)
  }
}

// ✅ Better: Separate functions for different domains
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}
```

### 3. Shared Code That Shouldn't Be

```typescript
// ❌ Wrong DRY: Coupling unrelated features
// utils/shared.ts
export function validateAndProcess(data: unknown) {
  // Used by both UserModule and PaymentModule
  // Now changes to one break the other
}

// ✅ Better: Each module owns its logic
// users/validation.ts
export function validateUser(data: UserInput) { ... }

// payments/validation.ts
export function validatePayment(data: PaymentInput) { ... }

// They might look similar, but they evolve differently
```

---

## Good DRY vs Bad DRY

### Good DRY (Abstract These)

| Pattern | Example |
|---------|---------|
| True utilities | `formatDate()`, `slugify()`, `debounce()` |
| Business rules | Tax calculation, discount logic |
| API clients | `apiClient.get()`, `apiClient.post()` |
| Design tokens | Colors, spacing, typography |
| Configuration | Environment variables, feature flags |

### Bad DRY (Keep Duplicated)

| Pattern | Why Keep Separate |
|---------|-------------------|
| Similar UI components | They'll diverge based on context |
| Similar validations | Business rules differ per domain |
| Similar tests | Tests should be independent |
| Similar error messages | Context-specific is better |

---

## WET Code Can Be Better

**WET = Write Everything Twice** (intentionally)

```typescript
// Sometimes duplication is better than the wrong abstraction

// ✅ Acceptable duplication (different contexts)
// components/UserCard.tsx
function UserCard({ user }: Props) {
  return (
    <div className="card">
      <img src={user.avatar} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// components/ProductCard.tsx
function ProductCard({ product }: Props) {
  return (
    <div className="card">
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  )
}

// ❌ Over-abstraction that hurts both
function GenericCard<T>({ item, renderImage, renderTitle, renderSubtitle }: Props<T>) {
  return (
    <div className="card">
      {renderImage(item)}
      {renderTitle(item)}
      {renderSubtitle(item)}
    </div>
  )
}
// Now neither card is simple to use or modify
```

---

## Signs of Wrong Abstraction

| Sign | Problem |
|------|---------|
| Many parameters | Abstraction is too broad |
| `type` or `mode` switches | Different things forced together |
| Frequent modifications | Abstraction doesn't fit use cases |
| Shotgun surgery | Changes ripple everywhere |
| Hard to name | Unclear what it actually does |

---

## Refactoring Strategy

### When You See Duplication

```
1. WAIT - Don't abstract immediately
2. COUNT - Is this the 3rd occurrence?
3. COMPARE - Are they truly the same?
4. EVOLVE - Will they change together?
5. ABSTRACT - Only if all above are YES
```

### Safe Abstractions

```typescript
// ✅ Safe: Pure utility, no business logic
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ✅ Safe: Well-defined business rule
function calculateTax(amount: number, rate: number): number {
  return amount * rate
}

// ✅ Safe: Thin wrapper around external API
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json()
}
```

---

## DRY Decision Checklist

Before creating an abstraction:

- [ ] Have I seen this 3+ times?
- [ ] Is the duplication truly identical (not just similar)?
- [ ] Will changes to one always apply to others?
- [ ] Can I name the abstraction clearly?
- [ ] Will the abstraction be simpler than the duplicates?

**If any answer is NO → Keep the duplication**

---

## Best Practices

### Do's ✅
- Apply Rule of Three
- Keep domain logic separate
- Abstract pure utilities
- Prefer composition over inheritance
- Accept some duplication

### Don'ts ❌
- Abstract after 2 occurrences
- Create "god" utility functions
- Share code between unrelated modules
- Add parameters to "generalize"
- Force similar-looking code together

---

## Related Rules

- **YAGNI Principle** - Don't add unused abstractions
- **KISS Principle** - Simpler is better
- **Single Responsibility** - Each function/class has one job

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
