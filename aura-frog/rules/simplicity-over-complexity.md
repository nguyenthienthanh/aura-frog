# Simplicity Over Complexity (YAGNI + DRY + KISS)

**Category:** Code Quality & Architecture
**Priority:** Critical
**Version:** 1.19.0
**Applies To:** All phases, especially Phase 2 (Design), Phase 5b (Implementation), Phase 5c (Refactor)

---

## Core Principles

```toon
principles[3]{principle,rule,when}:
  YAGNI,"Only implement what's needed RIGHT NOW. No speculative features.",Always
  DRY,"Wait for Rule of Three (3 occurrences) before abstracting.",Phase 5c
  KISS,"Choose simplest solution that solves the problem. No over-engineering.",Always
```

---

## Decision Flowchart

```
Is this in current requirements?
├── NO → Don't implement (YAGNI)
└── YES → Is there a simpler approach?
    ├── YES → Use the simpler one (KISS)
    └── NO → Is this duplicated 3+ times?
        ├── NO → Keep duplicate (DRY caution)
        └── YES → Abstract it (Safe DRY)
```

---

## Anti-Patterns

```toon
anti_patterns[6]{pattern,problem,fix}:
  Speculative features,"Adding unused methods 'just in case'",Only add when there's a ticket/story
  Premature abstraction,"Generic interface for 1-2 use cases",Wait for 3rd occurrence
  Excessive config,"20+ env vars for 3 endpoints",Only configure what varies
  Future-proof params,"options?: { role? dept? metadata? }",Only current-need params
  Unnecessary layers,"Controller→Service→Repository for simple CRUD",Direct implementation
  Over-generic code,"processData<T K V> with 5 type params",Specific named functions
```

---

## Good vs Bad Abstractions

### Abstract These (Safe DRY)

| Pattern | Example |
|---------|---------|
| Pure utilities | `formatDate()`, `slugify()`, `debounce()` |
| Business rules | Tax calculation, discount logic |
| API clients | `apiClient.get()`, `apiClient.post()` |
| Design tokens | Colors, spacing, typography |

### Keep Duplicated (Intentional WET)

| Pattern | Why |
|---------|-----|
| Similar UI components | They'll diverge by context |
| Similar validations | Business rules differ per domain |
| Similar tests | Tests should be independent |
| Similar error messages | Context-specific is better |

---

## Checklist Before Adding Code

```toon
checklist[5]{question,if_no}:
  "Is this in current requirements?",Don't add it
  "Does a test exist for this feature?",Write test first or skip
  "Will this be used in current sprint?",Defer to when needed
  "Can I explain why this is needed NOW?",Remove it
  "Is there a simpler alternative?",Use the simpler one
```

**If any answer is NO → Don't add it.**

---

## Phase-Specific Guidelines

| Phase | Focus |
|-------|-------|
| Phase 2 (Design) | Challenge every abstraction layer. Question "might need in future." |
| Phase 5b (Build) | Start with naive implementation. Don't optimize until measured. |
| Phase 5c (Refactor) | Apply Rule of Three. Only abstract proven patterns. |
| Phase 6 (Review) | Flag over-engineering. Suggest simpler alternatives. |

---

## Warning Signs of Over-Engineering

- "We might need this later" → YAGNI
- "This is more flexible" → Flexibility without use case = complexity
- "It's more enterprise-grade" → Enterprise doesn't mean complex
- Many parameters or type switches → Abstraction too broad
- More configuration than code → Over-configurable
- Code needs comments to understand → Not self-explanatory

---

**Key Insight:** You can **design** for extensibility without **implementing** extensions. Three similar lines of code is better than a premature abstraction.

---

**Version:** 1.19.0 | **Replaces:** yagni-principle.md + dry-with-caution.md + kiss-avoid-over-engineering.md
