# Aura Frog Quality Rules

**Version:** 1.18.0
**Total Rules:** 50
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)

---

## Rule Index (TOON Format)

```toon
rules[50]{category,rule,priority,purpose}:
  system,agent-identification-banner,critical,Show agent banner every response
  system,mcp-response-logging,medium,Save MCP responses to logs in TOON format
  system,codebase-consistency,high,Learn patterns before writing code
  system,env-loading,critical,Load .envrc at session start
  system,execution-rules,critical,ALWAYS/NEVER execution rules
  system,priority-hierarchy,critical,Config priority order
  system,dual-file-architecture,high,Plugin + project structure
  system,token-time-awareness,high,Monitor token usage
  system,project-linting-precedence,critical,Merge project + Aura Frog rules
  system,context-management,high,Token optimization + model selection + lazy loading
  quality,yagni-principle,critical,Only implement what's needed now
  quality,dry-with-caution,high,Rule of Three before abstracting
  quality,kiss-avoid-over-engineering,critical,Keep implementations simple
  quality,error-handling-standard,critical,Typed errors + structured responses
  quality,logging-standards,high,Structured logging + sanitization
  quality,code-quality,high,TypeScript strict + no any
  quality,naming-conventions,medium,Consistent naming patterns
  quality,smart-commenting,medium,Comment why not what
  quality,prefer-established-libraries,high,Use lodash/es-toolkit over custom utils
  quality,post-implementation-linting,high,Run lint and fix issues after every implementation
  quality,seo-technical-requirements,high,Meta tags + Core Web Vitals + crawlability
  quality,structured-data-schema,high,JSON-LD Schema.org implementation
  quality,ai-discovery-optimization,high,AI search engine + LLM citation optimization
  architecture,api-design-rules,high,RESTful conventions + versioning
  architecture,state-management,high,React/Vue state patterns
  architecture,dependency-management,high,Version pinning + security audits
  architecture,performance-rules,medium,Optimization guidelines
  architecture,theme-consistency,medium,Design system adherence
  architecture,design-system-usage,high,Proper design system implementation
  security,sast-security-scanning,critical,OWASP Top 10 + SAST scanning
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
  documentation,diagram-requirements,medium,Mermaid diagrams for complex features
  ui,accessibility-rules,high,WCAG compliance + ARIA
  ui,frontend-excellence,critical,UX laws + performance + mobile patterns
  ui,visual-pixel-accuracy,critical,Pixel-perfect visual testing hard rules
  ui,correct-file-extensions,medium,Proper file naming
  ui,direct-hook-access,medium,Lifecycle hooks
  workflow,estimation,high,Story points + time + risk assessment
  workflow,verification,critical,Fresh verification before claiming done
  godot,godot-scene-composition,high,When to use scenes vs nodes
  godot,godot-gdscript-typing,high,Type hints and static typing
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
categories[8]{name,count,critical_rules}:
  system,10,5
  quality,13,4
  architecture,6,0
  security,1,1
  workflow,10,6
  documentation,1,0
  ui,5,2
  godot,2,0
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
- [ ] Read `prefer-established-libraries` - Use lodash/es-toolkit first

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

### For SEO & AI Discovery
- [ ] Follow `seo-technical-requirements` - Meta tags, Core Web Vitals, crawlability
- [ ] Follow `structured-data-schema` - JSON-LD Schema.org markup
- [ ] Follow `ai-discovery-optimization` - AI search engines, LLM citation

### For Testing
- [ ] Follow `tdd-workflow` - Tests first

### For Refactoring
- [ ] Follow `impact-analysis` - Analyze all usages before modifying
- [ ] Run grep/search to find all references
- [ ] Update all affected files
- [ ] Verify no breaking changes

### For Security
- [ ] Follow `sast-security-scanning` - OWASP Top 10 checks
- [ ] Follow `safety-rules` - External system safety

### For Review
- [ ] Follow `cross-review-workflow` - Multi-agent review

---

## Related Documentation

- **Skills:** `skills/README.md` - Auto-invoking capabilities
- **Phases:** `docs/phases/` - 9-phase workflow guides
- **Agents:** `agents/` - Agent definitions

---

**Version:** 1.18.0 | **Last Updated:** 2026-01-21 | **Format:** TOON

---

## Framework-Specific Best Practices

Framework-specific rules have been migrated to **Expert Skills** for on-demand loading:

| Skill | Triggers | Content |
|-------|----------|---------|
| `typescript-expert` | .ts, .tsx, type errors | Strict types, ESLint, nullish handling |
| `react-expert` | React, JSX, hooks | Components, hooks, performance |
| `react-native-expert` | RN, Expo, mobile | Lists, navigation, platform code |
| `vue-expert` | Vue, Composition API | Script setup, Pinia, reactivity |
| `nextjs-expert` | Next.js, App Router | Server Components, caching |
| `seo-expert` | SEO, meta tags, schema | Technical SEO, Core Web Vitals |
| `ai-discovery-expert` | Perplexity, ChatGPT | AI search optimization |

These skills auto-invoke when working with the respective framework.
