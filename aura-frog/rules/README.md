# Aura Frog Quality Rules

**Version:** 1.1.9
**Total Rules:** 35
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)

---

## Rule Index (TOON Format)

```toon
rules[35]{category,rule,priority,purpose}:
  system,agent-identification-banner,critical,Show agent banner every response
  system,env-loading,critical,Load .envrc at session start
  system,execution-rules,critical,ALWAYS/NEVER execution rules
  system,priority-hierarchy,critical,Config priority order
  system,dual-file-architecture,high,Plugin + project structure
  system,token-time-awareness,high,Monitor token usage
  system,project-linting-precedence,critical,Merge project + Aura Frog rules
  quality,yagni-principle,critical,Only implement what's needed now
  quality,dry-with-caution,high,Rule of Three before abstracting
  quality,kiss-avoid-over-engineering,critical,Keep implementations simple
  quality,error-handling-standard,critical,Typed errors + structured responses
  quality,logging-standards,high,Structured logging + sanitization
  quality,code-quality,high,TypeScript strict + no any
  quality,naming-conventions,medium,Consistent naming patterns
  quality,smart-commenting,medium,Comment why not what
  quality,modern-javascript,high,ES6+ syntax
  architecture,api-design-rules,high,RESTful conventions + versioning
  architecture,state-management,high,React/Vue state patterns
  architecture,dependency-management,high,Version pinning + security audits
  architecture,performance-rules,medium,Optimization guidelines
  architecture,theme-consistency,medium,Design system adherence
  architecture,design-system-usage,high,Proper design system implementation
  workflow,tdd-workflow,critical,RED → GREEN → REFACTOR
  workflow,cross-review-workflow,high,Multi-agent review process
  workflow,approval-gates,critical,Human approval required
  workflow,git-workflow,high,Commit conventions
  workflow,safety-rules,critical,Security guidelines
  workflow,next-step-guidance,critical,Always show next steps and commands
  workflow,workflow-navigation,high,Progress tracking and phase status
  workflow,feedback-brainstorming,high,Brainstorm before implementing feedback
  workflow,impact-analysis,critical,Analyze all usages before modifying
  workflow,workflow-deliverables,critical,Verify all phase documents created
  ui,accessibility-rules,high,WCAG compliance + ARIA
  ui,correct-file-extensions,medium,Proper file naming
  ui,direct-hook-access,medium,Lifecycle hooks
```

---

## Priority Levels

```toon
priorities[3]{level,meaning,enforcement}:
  critical,Must follow,Blocks workflow progression
  high,Should follow,Generates warnings
  medium,Recommended,Best practices
```

---

## Categories Summary

```toon
categories[5]{name,count,critical_rules}:
  system,7,5
  quality,9,4
  architecture,6,0
  workflow,10,6
  ui,3,0
```

---

## Rule Merge Strategy

```
Project linting ─┬─► MERGE ─► Combined Ruleset
Project rules   ─┤
Aura Frog rules ─┤
Claude defaults ─┘

Conflicts: Higher priority wins
No conflict: All rules apply together
```

**Example:** Project has `semi: false`, Aura Frog has TDD rule
→ Result: No semicolons (project) + TDD (Aura Frog)

See: `project-linting-precedence.md`

---

## Quick Reference

### Session Start (CRITICAL)
- [ ] Follow `agent-identification-banner` - Show banner every response
- [ ] Follow `env-loading` - Load .envrc if exists
- [ ] Follow `execution-rules` - Load project context first
- [ ] Follow `next-step-guidance` - Show next steps every response

### Before Coding
- [ ] Check `project-linting-precedence` - Merge project config with Aura Frog rules
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

### For Refactoring
- [ ] Follow `impact-analysis` - Analyze all usages before modifying
- [ ] Run grep/search to find all references
- [ ] Update all affected files
- [ ] Verify no breaking changes

### For Review
- [ ] Follow `cross-review-workflow` - Multi-agent review

---

## Related Documentation

- **Skills:** `skills/README.md` - Auto-invoking capabilities
- **Phases:** `docs/phases/` - 9-phase workflow guides
- **Agents:** `agents/` - Agent definitions

---

**Version:** 1.1.9 | **Last Updated:** 2025-12-10 | **Format:** TOON
