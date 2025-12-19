# Rule: Codebase Consistency - Learn Before Acting

**Priority:** High
**Applies To:** All phases (analysis, design, implementation)

---

## Core Principles

### 1. Learn Before Acting
**Before any work, study existing patterns in the codebase.**

### 2. Reuse Before Creating
**Search for existing code before writing new. Extend or compose existing solutions.**

This applies to:
- **Phase 1 (Requirements):** Check if feature already exists or can be extended
- **Phase 2 (Tech Planning):** Reuse existing services, APIs, patterns
- **Phase 3 (UI Breakdown):** Use existing components, extend if needed
- **Phase 4 (Test Planning):** Reuse test utilities, fixtures, helpers
- **Phase 5 (Implementation):** Reuse hooks, utils, components before creating new

---

## Quick Reference

```toon
consistency_steps[5]{step,action,how}:
  1,Search existing,"Grep/Glob for similar code"
  2,Evaluate reuse,"Can existing code be used or extended?"
  3,Check naming,"Look at adjacent files"
  4,Match imports,"Copy import style from nearby"
  5,Follow structure,"Mirror existing file organization"
```

---

## What to Check by Phase

### Phase 1-2: Analysis & Tech Specs

```bash
# Understand existing architecture
Glob: src/**/README.md
Glob: docs/**/*.md

# Find similar features
Grep: "similar feature keyword"

# Check existing APIs/services
Glob: src/services/*.ts
Glob: src/api/*.ts
```

### Phase 3: UI Breakdown

```bash
# Find existing components
Glob: src/components/**/*.tsx

# Check component patterns
Read: src/components/[SimilarComponent].tsx

# Check design system usage
Grep: "className=|styled|theme"
```

### Phase 4-5: Tests & Implementation

```bash
# Find similar files
Glob: src/**/*Similar*.tsx

# Check test patterns
Glob: **/*.test.ts
Read: tests/[similar].test.ts

# Check error handling pattern
Grep: "catch|throw|Error"
```

---

## Reuse Before Create

### Before Creating New Component

```bash
# Search for similar components
Glob: src/components/**/*Card*.tsx
Glob: src/components/**/*List*.tsx
Grep: "export.*Card|export.*List"

# Found similar? → Extend or compose it
# Not found? → Create new (following patterns)
```

### Before Creating New Hook

```bash
# Search for similar hooks
Glob: src/hooks/use*.ts
Grep: "export.*use.*Auth|use.*User"

# Found similar? → Add to existing or compose
# Not found? → Create new hook
```

### Before Creating New Utility

```bash
# Search existing utils
Glob: src/utils/*.ts
Glob: src/lib/*.ts
Grep: "export.*format|export.*validate"

# Also check: Does lodash/es-toolkit have this?
```

### Before Creating New Service/API

```bash
# Search for similar services
Glob: src/services/*.ts
Glob: src/api/*.ts
Grep: "class.*Service|export.*api"

# Found similar? → Extend existing service
# Not found? → Create following existing patterns
```

### Reuse Decision Flow

```
Need new code?
├── Search for existing similar code
│   ├── Found exact match → USE IT
│   ├── Found similar → Can extend?
│   │   ├── YES → EXTEND IT
│   │   └── NO → Can compose?
│   │       ├── YES → COMPOSE IT
│   │       └── NO → CREATE NEW (following patterns)
│   └── Not found → CREATE NEW (following patterns)
```

---

## Pattern Matching Guide

```toon
patterns[6]{check,look_for,match}:
  File naming,"PascalCase or kebab-case",Adjacent files
  Imports,"Absolute @/ or relative ./",Same folder files
  Exports,"Named or default",Similar file types
  Error handling,"try/catch or Result type",Service layer
  Logging,"console or logger",Existing utils
  Testing,"describe/it or test()",Test folder
```

---

## When Session Starts

If `.claude/session-context.toon` exists:
- Read it first for cached patterns
- Skip redundant scans

If not exists:
- Scan codebase briefly
- Generate `.claude/session-context.toon`

---

## Dynamic Scan (Only When Needed)

Scan codebase when:
- Starting any workflow phase
- Creating new file type (first component, first hook, etc.)
- Proposing architecture decisions
- Patterns unclear from context

Skip scan when:
- Similar code visible in recent reads
- Pattern obvious from context
- `.claude/session-context.toon` has the pattern

---

## What NOT to Do

### Tech Specs / Analysis

```markdown
❌ BAD - Proposing new patterns without checking existing
"Let's use Redux for state management"
(When project already uses Zustand)

❌ BAD - Suggesting new folder structure
"Create src/modules/ folder"
(When project uses src/features/)

❌ BAD - Recommending different testing approach
"We should use Cypress for this"
(When project uses Playwright)
```

### Reuse

```markdown
❌ BAD - Creating duplicate component
"I'll create a new ProductCard component"
(When UserCard exists and can be generalized to Card)

❌ BAD - Creating duplicate hook
"I'll create useProductData hook"
(When useEntityData exists and can handle products)

❌ BAD - Creating duplicate utility
"I'll write a formatCurrency function"
(When formatMoney already exists in utils/)
```

### Code

```typescript
// ❌ BAD - Ignoring existing patterns
// Existing: src/components/UserCard.tsx (PascalCase)
// New file: src/components/product-list.tsx (kebab-case)

// ❌ BAD - Different import style
// Existing: import { Button } from '@/components/Button'
// New code: import { Button } from '../../components/Button'

// ❌ BAD - Inconsistent error handling
// Existing: Returns Result<T, Error> type
// New code: Throws exceptions

// ❌ BAD - Duplicate logic
// Existing: src/hooks/useAuth.ts has user fetching logic
// New code: Writing same fetch logic in new component
```

---

## What TO Do

### Tech Specs / Analysis

```markdown
✅ GOOD - Reference existing patterns
"The project uses Zustand for state management (found in src/store/).
We should follow this pattern for the new feature."

✅ GOOD - Align with existing structure
"Following the existing src/features/ structure,
the new auth feature should be at src/features/auth/"

✅ GOOD - Match existing test approach
"The project uses Playwright for E2E tests (found in e2e/).
We'll add new E2E tests following this pattern."
```

### Reuse

```markdown
✅ GOOD - Extend existing component
"UserCard already handles this pattern. I'll extend it to
support products by adding a generic Card component."

✅ GOOD - Compose existing hooks
"useAuth already fetches user data. I'll compose it with
usePermissions for the new feature."

✅ GOOD - Use existing utility
"Found formatMoney in src/utils/format.ts.
Using that instead of creating new formatter."
```

### Code

```typescript
// ✅ GOOD - Reuse existing component
import { Card } from '@/components/Card';
const ProductCard = (props) => <Card type="product" {...props} />;

// ✅ GOOD - Compose existing hooks
const useProductWithAuth = () => {
  const auth = useAuth();
  const products = useProducts(auth.userId);
  return { ...auth, products };
};

// ✅ GOOD - Use existing utility
import { formatMoney } from '@/utils/format';
const price = formatMoney(product.price);

// ✅ GOOD - Match existing patterns
// Existing: return { ok: true, data }
// New code: return { ok: true, data: newData }
```

---

## Review Checklist

### Analysis & Design Phases
- [ ] Checked existing architecture before proposing new
- [ ] Searched for existing features that can be extended
- [ ] Referenced existing patterns in recommendations
- [ ] Folder structure aligns with project conventions
- [ ] Tech choices match existing stack

### Before Creating New Code
- [ ] Searched for existing similar components
- [ ] Searched for existing similar hooks
- [ ] Searched for existing utilities (and lodash/es-toolkit)
- [ ] Evaluated if existing code can be extended/composed
- [ ] If creating new: documented why reuse wasn't possible

### Implementation Phase
- [ ] File naming matches existing convention
- [ ] Import style consistent with codebase
- [ ] Export pattern matches similar files
- [ ] Error handling follows established pattern
- [ ] Test structure matches existing tests
- [ ] No duplicate logic (reused existing where possible)

---

**Version:** 1.3.0 | **Priority:** High
