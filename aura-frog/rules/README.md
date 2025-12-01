# Aura Frog Quality Rules

**Version:** 1.0.0
**Total Rules:** 27
**Purpose:** Enforce consistent quality across all development

---

## Rule Categories

### System & Session (6)

| Rule | Priority | Purpose |
|------|----------|---------|
| [agent-identification-banner](agent-identification-banner.md) | Critical | Show agent banner every response |
| [env-loading](env-loading.md) | Critical | Load .envrc at session start |
| [execution-rules](execution-rules.md) | Critical | ALWAYS/NEVER execution rules |
| [priority-hierarchy](priority-hierarchy.md) | Critical | Config priority order |
| [dual-file-architecture](dual-file-architecture.md) | High | Plugin + project structure |
| [token-time-awareness](token-time-awareness.md) | High | Monitor token usage |

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
2. Aura Frog core rules (this directory)
3. Generic defaults

Project rules OVERRIDE Aura Frog rules when conflicts exist.
```

---

## Quick Reference

### Session Start (CRITICAL)
- [ ] Follow `agent-identification-banner` - Show banner every response
- [ ] Follow `env-loading` - Load .envrc if exists
- [ ] Follow `execution-rules` - Load project context first

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

**Version:** 1.0.0 | **Last Updated:** 2025-12-01
