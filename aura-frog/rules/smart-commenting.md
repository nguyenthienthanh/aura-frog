# Rule: Smart Commenting - Meaningful Comments Only

**Priority:** High
**Applies To:** All code, JSDoc, and commit messages

---

## Core Principle

**Only comment what's HARD TO UNDERSTAND. Never comment the obvious.**

Comments and JSDoc are ONLY for:
- Complex business logic
- Non-obvious decisions
- Workarounds/hacks with context
- Public API documentation (exported functions)

---

## Quick Reference

```toon
comment_rules[4]{type,when,example}:
  JSDoc,Public API + complex functions,"@param user - Must be verified (see auth flow)"
  Inline,Non-obvious WHY,"// Safari bug workaround - see webkit#12345"
  TODO,With ticket reference,"// TODO: Add caching (PROJ-1234)"
  NEVER,Obvious/redundant code,"// New test" "// Create user" "// Loop"
```

---

## NEVER Comment These

### Obvious Code

```typescript
// ❌ BAD - Meaningless comments
// Create new user
const user = createUser();

// New branch for testing
if (isAdmin) { ... }

// New test to increase coverage
it('should return true', () => { ... });

// Set loading to true
setLoading(true);
```

```typescript
// ✅ GOOD - No comments needed, code is self-explanatory
const user = createUser();

if (isAdmin) { ... }

it('should return true', () => { ... });

setLoading(true);
```

### Standard Patterns

```typescript
// ❌ BAD - Never comment standard patterns
// useEffect hook to fetch data on mount
useEffect(() => {
  fetchUserData();
}, []);

// useState hook for loading state
const [loading, setLoading] = useState(false);

// Map users to names
const names = users.map(u => u.name);
```

---

## When TO Comment

### Complex Business Logic

```typescript
// ✅ GOOD - Explains WHY
// Apply 20% discount for premium users who joined before 2020
// This is a grandfather clause from the original pricing model
if (user.isPremium && user.joinDate < new Date('2020-01-01')) {
  applyDiscount(0.20);
}
```

### Non-Obvious Decisions

```typescript
// ✅ GOOD - Explains design decision
// Using setTimeout(0) to defer execution to next event loop tick
// This ensures DOM has finished rendering before measuring
setTimeout(() => measureElement(), 0);
```

### Workarounds/Hacks

```typescript
// ✅ GOOD - Documents workaround
// HACK: iOS Safari doesn't fire blur event on programmatic focus change
// See: https://bugs.webkit.org/show_bug.cgi?id=12345
if (isIOS) {
  manuallyTriggerBlur();
}
```

### TODO/FIXME

```typescript
// ✅ GOOD - Actionable items
// TODO: Implement caching once Redis is set up (PROJ-1234)
// FIXME: Race condition when user clicks rapidly (PROJ-5678)
```

---

## Comment Anti-Patterns

```toon
anti_patterns[10]{pattern,why_bad}:
  "// Set x to 5",Obvious assignment
  "// Loop through array",Standard iteration
  "// Check if null",Obvious null check
  "// Return value",Obvious return
  "// Import React",Obvious import
  "// New test",Meaningless test description
  "// New branch",Meaningless branch description
  "// Add coverage",Coverage is implied
  "// Create function",Obvious function creation
  "// Update state",Obvious state update
```

---

## JSDoc Rules

### When to Use JSDoc

```typescript
// ✅ GOOD - Complex public API
/**
 * Calculates pro-rated subscription cost.
 * Uses billing cycle start date to determine remaining days.
 * @throws {BillingError} If subscription is already cancelled
 */
export function calculateProRatedCost(subscription: Subscription): number

// ✅ GOOD - Non-obvious parameter requirements
/**
 * @param userId - Must be verified user (unverified users throw)
 */
export function fetchUserProfile(userId: string): Promise<Profile>
```

### When NOT to Use JSDoc

```typescript
// ❌ BAD - Obvious from types and naming
/**
 * Gets user by ID
 * @param id - The user ID
 * @returns The user
 */
function getUserById(id: string): User

// ❌ BAD - Simple internal function
/**
 * Formats the date
 */
function formatDate(date: Date): string
```

---

## Code Review Checklist

- [ ] No comments on obvious/self-explanatory code
- [ ] No "new test", "new branch", "add coverage" comments
- [ ] JSDoc only on complex public APIs
- [ ] Complex business logic has WHY explanation
- [ ] Workarounds documented with links/context
- [ ] TODOs reference ticket numbers
- [ ] No commented-out code (delete it)

---

**Version:** 1.2.5 | **Priority:** High
