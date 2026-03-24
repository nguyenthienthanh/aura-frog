# Aura Frog Quality Rules

**Total Rules:** 45 (13 core + 15 agent + 17 workflow)
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)

---

## 3-Tier Rule Architecture

Rules are organized into tiers to reduce context overhead. Only load what's needed.

```toon
tiers[3]{tier,dir,count,when_loaded}:
  Core,rules/core/,13,ALWAYS — every session
  Agent,rules/agent/,15,Per-agent — only when agent activates
  Workflow,rules/workflow/,17,Per-phase — only during active workflow
```

**Token savings:** ~30-50% reduction vs loading all 45 rules every message.

---

## Core Rules (13) — Always Loaded

```toon
core[13]{rule,priority,purpose}:
  execution-rules,critical,ALWAYS/NEVER execution rules
  tdd-workflow,critical,RED → GREEN → REFACTOR
  approval-gates,critical,Human approval required
  context-management,high,Token optimization + model selection + lazy loading
  code-quality,high,TypeScript strict + no any
  naming-conventions,medium,Consistent naming patterns
  simplicity-over-complexity,critical,YAGNI + DRY + KISS consolidated
  verification,critical,Fresh verification before claiming done
  env-loading,critical,Load .envrc at session start
  agent-identification-banner,critical,Show agent banner every response
  correct-file-extensions,medium,Proper file naming
  prefer-established-libraries,high,Use lodash/es-toolkit over custom utils
  direct-hook-access,medium,Lifecycle hooks
```

---

## Agent Rules (15) — Loaded Per Agent

```toon
agent[15]{rule,priority,agents}:
  frontend-excellence,critical,frontend/mobile
  design-system-usage,high,frontend
  theme-consistency,medium,frontend
  api-design-rules,high,architect
  structured-data-schema,high,architect/frontend
  performance-rules,medium,All dev agents
  sast-security-scanning,critical,security
  safety-rules,critical,security/devops
  accessibility-rules,high,frontend
  state-management,high,frontend/mobile
  dual-file-architecture,high,scanner/lead
  logging-standards,high,architect/devops
  error-handling-standard,critical,All dev agents
  dependency-management,high,architect/devops
  codebase-consistency,high,All agents
```

---

## Workflow Rules (17) — Loaded Per Phase

```toon
workflow[17]{rule,priority,phases}:
  workflow-deliverables,critical,All phases
  requirement-challenger,high,Phase 1
  collaborative-planning,high,Phase 1 (Deep only)
  feedback-brainstorming,high,Phase 1
  cross-review-workflow,high,Phase 4
  next-step-guidance,critical,All phases
  workflow-navigation,high,All phases
  impact-analysis,critical,Phase 1 + Phase 3
  estimation,high,Phase 1
  priority-hierarchy,critical,Phase 1
  post-implementation-linting,high,Phase 3 + Phase 4
  smart-commenting,medium,Phase 3
  diagram-requirements,medium,Phase 1
  token-time-awareness,high,All phases
  git-workflow,high,Phase 5
  mcp-response-logging,medium,All phases
  project-linting-precedence,critical,Phase 3
```

---

## Rule Loading Strategy

```toon
loading[4]{scenario,rules_loaded,est_tokens}:
  Quick fix (no workflow),Core only (13),~2000
  Standard (Phase 1),Core + relevant Agent + Phase 1 Workflow,~4000
  Standard (Phase 3),Core + relevant Agent + Phase 3 Workflow,~3500
  Deep (full workflow),Core + all Agent + current Phase Workflow,~5000
```

**Agent detection determines which agent rules to load:**
- `frontend` agent → loads: frontend-excellence, design-system-usage, theme-consistency, accessibility-rules, state-management
- `architect` agent → loads: api-design-rules, structured-data-schema, logging-standards, error-handling-standard, dependency-management
- `security` agent → loads: sast-security-scanning, safety-rules

---

## Priority Levels

```toon
priorities[3]{level,meaning,enforcement}:
  critical,Must follow,Blocks workflow progression
  high,Should follow,Generates warnings
  medium,Recommended,Best practices
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

See: `workflow/project-linting-precedence.md`

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
| *seo-expert* | *Available as addon* | *SEO module externalized* |
| *ai-discovery-expert* | *Available as addon* | *AI discovery module externalized* |

These skills auto-invoke when working with the respective framework.

---

## Related Documentation

- **Skills:** `skills/README.md` - Auto-invoking capabilities
- **Phases:** `docs/phases/` - 5-phase workflow guides
- **Agents:** `agents/` - Agent definitions

---

