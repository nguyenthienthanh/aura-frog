---
name: qa-expert
description: "QA expertise - unit testing, e2e testing, accessibility testing, performance testing, test strategies"
autoInvoke: false
priority: medium
triggers:
  - "testing strategy"
  - "test plan"
  - "unit test"
  - "e2e test"
  - "accessibility"
---

# Skill: QA Expert

**Category:** Reference Skill
**Used By:** qa-automation agent

---

## Sub-Skills

| File | Purpose |
|------|---------|
| `test-strategies.md` | Testing pyramid, coverage goals |
| `unit-testing.md` | Jest, Vitest, PHPUnit patterns |
| `e2e-testing.md` | Cypress, Playwright, Detox |
| `accessibility-testing.md` | WCAG compliance, a11y testing |
| `performance-testing.md` | Load testing, benchmarks |

---

## When to Use

- Phase 4 (Test Planning) - Test strategy
- Phase 5a (TDD Red) - Writing tests first
- Phase 7 (Verify) - QA validation
- Accessibility audits

---

## Quick Reference

**Testing Pyramid:**
```
      E2E (10%)
     /        \
   Integration (20%)
  /              \
 Unit Tests (70%)
```

**Coverage Targets:**
- Statements: 80%
- Branches: 75%
- Functions: 80%

---

**Load sub-skills for detailed testing guidance.**
