# Rule: Smart Commenting - Avoid Redundant Comments

**Priority:** Medium
**Applies To:** All code

---

## Core Principle

**Comments should explain WHY, not WHAT.**

---

## Quick Reference

```toon
comment_types[2]{type,rule}:
  Bad,"Describes what code does (obvious from reading)"
  Good,"Explains WHY business rules or non-obvious decisions"
```

---

## What NOT to Comment

### Self-Explanatory Code

```typescript
// ❌ BAD - Obvious
// Set user name to John
const userName = 'John';

// Loop through users
users.forEach(user => {
  // Print user name
  console.log(user.name);
});
```

```typescript
// ✅ GOOD - No comments needed
const userName = 'John';

users.forEach(user => {
  console.log(user.name);
});
```

### Standard Patterns

```typescript
// ❌ BAD - Standard React patterns
// useEffect hook to fetch data on mount
useEffect(() => {
  fetchUserData();
}, []);

// useState hook for loading state
const [loading, setLoading] = useState(false);
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
anti_patterns[5]{pattern,problem}:
  "// Set x to 5",Describes obvious assignment
  "// Loop through array",Describes standard iteration
  "// Check if null",Describes obvious null check
  "// Return value",Describes obvious return
  "// Import React",Describes obvious import
```

---

## Code Review Checklist

- [ ] No comments describing obvious code
- [ ] Complex logic has WHY explanation
- [ ] Workarounds documented with context
- [ ] TODOs reference ticket numbers
- [ ] No commented-out code (delete it)

---

**Version:** 1.2.1 | **Priority:** Medium
