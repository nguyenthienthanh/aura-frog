# Rule: Codebase Consistency - Learn Before Acting

**Priority:** High
**Applies To:** All phases (analysis, design, implementation)

---

## Core Principle

**Before any work, study existing patterns in the codebase.**

This applies to:
- **Phase 1 (Requirements):** Understand existing features before proposing new ones
- **Phase 2 (Tech Planning):** Study current architecture before designing
- **Phase 3 (UI Breakdown):** Check existing components before planning new UI
- **Phase 4 (Test Planning):** Review existing test patterns
- **Phase 5 (Implementation):** Match code style and patterns

---

## Quick Reference

```toon
consistency_steps[4]{step,action,how}:
  1,Find similar code,"Grep for related patterns"
  2,Check naming,"Look at adjacent files"
  3,Match imports,"Copy import style from nearby"
  4,Follow structure,"Mirror existing file organization"
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

### Code

```typescript
// ✅ GOOD - Match existing file naming
// Existing: src/components/UserCard.tsx
// New file: src/components/ProductList.tsx

// ✅ GOOD - Match import style
// Existing: import { Button } from '@/components/Button'
// New code: import { Input } from '@/components/Input'

// ✅ GOOD - Match error handling
// Existing: return { ok: true, data }
// New code: return { ok: true, data: newData }
```

---

## Review Checklist

### Analysis & Design Phases
- [ ] Checked existing architecture before proposing new
- [ ] Referenced existing patterns in recommendations
- [ ] Folder structure aligns with project conventions
- [ ] Tech choices match existing stack

### Implementation Phase
- [ ] File naming matches existing convention
- [ ] Import style consistent with codebase
- [ ] Export pattern matches similar files
- [ ] Error handling follows established pattern
- [ ] Test structure matches existing tests

---

**Version:** 1.2.3 | **Priority:** High
