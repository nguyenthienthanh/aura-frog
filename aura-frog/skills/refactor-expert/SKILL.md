---
name: refactor-expert
description: "Guide safe, incremental refactoring that improves code quality without changing behavior."
autoInvoke: false
priority: medium
triggers:
  - "refactor"
  - "code cleanup"
  - "improve code"
  - "refactor:analyze"
  - "refactor:plan"
---

# Skill: Refactor Expert

**Category:** Dev Expert
**Version:** 1.1.0
**Used By:** All development agents

---

## Overview

Guide safe, incremental refactoring that improves code quality without changing behavior.

---

## Documentation Commands

Generate analysis and implementation plans before refactoring:

| Command | Purpose | Output |
|---------|---------|--------|
| `refactor:analyze <file>` | Code analysis document | `.claude/logs/refactors/{target}-analysis.md` |
| `refactor:plan <file>` | Implementation plan | `.claude/logs/refactors/{target}-plan.md` |
| `refactor:docs <file>` | Both documents | Analysis + Plan + Summary |

**Templates:** `templates/refactor-analysis.md`, `templates/refactor-plan.md`

---

## 1. Refactoring Decision

| Signal | Action |
|--------|--------|
| Code smell detected | Identify specific smell |
| Tests passing | Safe to refactor |
| No tests | Write tests FIRST |
| Large change needed | Break into small steps |

**Golden Rule:** Never refactor and add features simultaneously.

---

## 2. Common Refactoring Patterns

### Extract Method
```typescript
// Before
function processOrder(order: Order) {
  // validate
  if (!order.items.length) throw new Error('Empty')
  if (!order.customer) throw new Error('No customer')
  // calculate
  let total = 0
  for (const item of order.items) {
    total += item.price * item.qty
  }
  return total
}

// After
function processOrder(order: Order) {
  validateOrder(order)
  return calculateTotal(order.items)
}
```

### Replace Conditional with Polymorphism
```typescript
// Before
function getPrice(type: string, base: number) {
  if (type === 'premium') return base * 0.8
  if (type === 'vip') return base * 0.7
  return base
}

// After
interface PricingStrategy { calculate(base: number): number }
class PremiumPricing implements PricingStrategy { calculate(base: number) { return base * 0.8 } }
```

### Simplify Conditional
```typescript
// Before
if (date.before(SUMMER_START) || date.after(SUMMER_END)) { charge = qty * winterRate }
else { charge = qty * summerRate }

// After
const isSummer = !date.before(SUMMER_START) && !date.after(SUMMER_END)
charge = qty * (isSummer ? summerRate : winterRate)
```

---

## 3. Code Smells → Refactoring

| Smell | Refactoring |
|-------|-------------|
| Long Method | Extract Method |
| Large Class | Extract Class |
| Long Parameter List | Introduce Parameter Object |
| Duplicate Code | Extract Method/Class |
| Feature Envy | Move Method |
| Data Clumps | Extract Class |
| Primitive Obsession | Replace with Object |
| Switch Statements | Replace with Polymorphism |
| Speculative Generality | Remove unused abstraction |
| Dead Code | Delete it |

---

## 4. Safe Refactoring Steps

```
1. Ensure tests pass ✅
2. Make ONE small change
3. Run tests ✅
4. Commit
5. Repeat
```

**Never:** Multiple changes between test runs.

---

## 5. Refactoring Checklist

Before:
- [ ] Tests exist and pass
- [ ] Understand current behavior
- [ ] Identify specific smell

During:
- [ ] One change at a time
- [ ] Tests after each change
- [ ] Commit frequently

After:
- [ ] All tests pass
- [ ] Code cleaner
- [ ] Behavior unchanged

---

## Best Practices

### Do's
- Test first, refactor second
- Small, incremental changes
- Commit after each successful refactor
- Use IDE refactoring tools
- Document why (not what)

### Don'ts
- Refactor without tests
- Mix refactoring with features
- Make large changes at once
- Refactor code you don't understand
- Over-refactor working code

---

## Related Commands

- `refactor <file>` - Full refactoring workflow
- `refactor:analyze <file>` - Analysis document only
- `refactor:plan <file>` - Implementation plan only
- `refactor:docs <file>` - Both documents
- `refactor:quick <file>` - Skip approvals
- `refactor:performance <file>` - Performance-focused
- `refactor:structure <file>` - Structure-focused

---

**Version:** 1.1.0 | **Last Updated:** 2025-12-04
