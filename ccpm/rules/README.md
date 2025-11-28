# CCPM Quality Rules

**Version:** 5.2.0
**Total Rules:** 21
**Purpose:** Enforce consistent quality across all development

---

## Rule Categories

### Code Quality (8)

| Rule | Priority | Purpose |
|------|----------|---------|
| [yagni-principle](yagni-principle.md) | Critical | Only implement what's needed now |
| [dry-with-caution](dry-with-caution.md) | High | Rule of Three before abstracting |
| [kiss-avoid-over-engineering](kiss-avoid-over-engineering.md) | Critical | Keep implementations simple |
| [error-handling-standard](error-handling-standard.md) | Critical | Typed errors, structured responses |
| [logging-standards](logging-standards.md) | High | Structured logging, sanitization |
| [code-quality](code-quality.md) | High | TypeScript strict, no any |
| [naming-conventions](naming-conventions.md) | Medium | Consistent naming patterns |
| [smart-commenting](smart-commenting.md) | Medium | Comment why, not what |

### Architecture (5)

| Rule | Priority | Purpose |
|------|----------|---------|
| [api-design-rules](api-design-rules.md) | High | RESTful conventions, versioning |
| [state-management](state-management.md) | High | React/Vue state patterns |
| [dependency-management](dependency-management.md) | High | Version pinning, security audits |
| [performance-rules](performance-rules.md) | Medium | Optimization guidelines |
| [theme-consistency](theme-consistency.md) | Medium | Design system adherence |

### Workflow (5)

| Rule | Priority | Purpose |
|------|----------|---------|
| [tdd-workflow](tdd-workflow.md) | Critical | RED → GREEN → REFACTOR |
| [cross-review-workflow](cross-review-workflow.md) | High | Multi-agent review process |
| [approval-gates](approval-gates.md) | Critical | Human approval required |
| [git-workflow](git-workflow.md) | High | Commit conventions |
| [safety-rules](safety-rules.md) | Critical | Security guidelines |

### Accessibility & UI (3)

| Rule | Priority | Purpose |
|------|----------|---------|
| [accessibility-rules](accessibility-rules.md) | High | WCAG compliance, ARIA |
| [correct-file-extensions](correct-file-extensions.md) | Medium | Proper file naming |
| [direct-hook-access](direct-hook-access.md) | Medium | Lifecycle hooks |

---

## Priority Levels

| Priority | Meaning | Enforcement |
|----------|---------|-------------|
| **Critical** | Must follow | Blocks workflow progression |
| **High** | Should follow | Generates warnings |
| **Medium** | Recommended | Best practices |

---

## Rule Loading Order

```
1. Project rules (.claude/project-contexts/[project]/rules.md)
2. CCPM core rules (this directory)
3. Generic defaults

Project rules OVERRIDE CCPM rules when conflicts exist.
```

---

## Quick Reference

### Before Coding
- [ ] Read `yagni-principle` - Don't add unused features
- [ ] Read `dry-with-caution` - Don't abstract prematurely
- [ ] Read `kiss-avoid-over-engineering` - Keep it simple

### During Coding
- [ ] Follow `code-quality` - TypeScript strict mode
- [ ] Follow `naming-conventions` - Consistent names
- [ ] Follow `error-handling-standard` - Proper error types
- [ ] Follow `logging-standards` - Structured logs

### For APIs
- [ ] Follow `api-design-rules` - RESTful conventions

### For Frontend
- [ ] Follow `state-management` - Proper state patterns
- [ ] Follow `accessibility-rules` - WCAG compliance

### For Testing
- [ ] Follow `tdd-workflow` - Tests first

### For Review
- [ ] Follow `cross-review-workflow` - Multi-agent review

---

## Related Documentation

- **Skills:** `skills/README.md` - Auto-invoking capabilities
- **Phases:** `docs/phases/` - 9-phase workflow guides
- **Agents:** `agents/` - Agent definitions

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
