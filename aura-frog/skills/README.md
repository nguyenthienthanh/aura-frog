# Aura Frog Skills

**Total Skills:** 38 (6 auto-invoking + 32 reference)
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)

---

## Auto-Invoke Skills (6)

Loaded every session. Target budget: ~2,000 tokens.

```toon
auto_invoke[6]{name,priority,trigger,tokens}:
  agent-detector,highest,ALWAYS — every message,~500
  workflow-orchestrator,high,Complex features / multi-file,~700
  bugfix-quick,medium,Bug fixes / errors / crashes,~400
  test-writer,medium,Test writing / TDD / coverage,~500
  code-reviewer,high,Code review / after implementation,~450
  code-simplifier,medium,Simplify / KISS / complexity,~300
```

---

## Reference Skills (32)

Loaded on-demand when triggered.

### Framework Experts (11)

Gotchas & decision criteria only. Use Context7 for full docs.

```toon
experts[11]{name,focus}:
  react-expert,Conditional rendering traps + state decisions + hooks pitfalls
  react-native-expert,FlatList optimization + storage hierarchy + platform gotchas
  vue-expert,Reactivity traps + Composition API pitfalls + Pinia patterns
  angular-expert,Signals vs observables + standalone patterns + DI gotchas
  nextjs-expert,Server/client boundary + caching strategy + data fetching
  nodejs-expert,Async pitfalls + Express/NestJS patterns + ESM gotchas
  python-expert,Async pitfalls + FastAPI/Django patterns + type hint traps
  laravel-expert,N+1 prevention + Eloquent traps + migration safety
  go-expert,Error handling + concurrency pitfalls + interface design
  flutter-expert,Riverpod vs BLoC + widget optimization + platform gotchas
  typescript-expert,Nullish traps + strict config + type guard patterns
```

### Framework Bundle (1)

```toon
bundle[1]{name,purpose}:
  framework-expert,Core patterns + lazy detection → loads individual experts on demand
```

### Design & UI (2)

```toon
design[2]{name,purpose}:
  design-expert,Component design + design system selection + responsive layout
  stitch-design,Google Stitch AI prompt generation
```

### Workflow & Infrastructure (8)

```toon
workflow[8]{name,purpose}:
  project-context-loader,Load project conventions and context
  session-continuation,Workflow state handoff and resume
  phase1-lite,Ultra-compact Phase 1 requirements (500 token cap)
  lazy-agent-loader,Load agent definitions on-demand
  response-analyzer,Write large responses to temp files
  self-improve,Apply learned improvements to plugin
  learning-analyzer,Analyze session feedback from Supabase
  prompt-evaluator,Evaluate prompt patterns and feature usage
```

### Code Quality (5)

```toon
quality[5]{name,purpose}:
  refactor-expert,Safe incremental refactoring
  api-designer,API design principles and conventions
  performance-optimizer,Profiling and bottleneck resolution
  scalable-thinking,Design for scale while building simple
  migration-helper,Zero-downtime database/code migrations
```

### Dev Tools (3)

```toon
tools[3]{name,purpose}:
  git-workflow,Token-efficient git with security scanning
  git-worktree,Auto-create worktrees for isolated changes
  documentation,ADR and Runbook templates
```

### Thinking (2)

```toon
thinking[2]{name,purpose}:
  sequential-thinking,Structured analysis with revision and branching
  problem-solving,5 techniques for different problem types
```

---

## Skill File Structure

```
skills/[skill-name]/
  SKILL.md (required) — Main instructions with YAML frontmatter
  [reference].md (optional) — Additional docs
```

## Invocation

Skills auto-invoke based on description matching. Just describe what you want — Claude selects the right skill.

---

> **Externalized:** Godot (aura-frog-godot-addon), SEO/GEO (aura-frog-seo-addon)
> **MCP:** JIRA, Figma, Slack, Firebase handled via bundled MCP servers (`.mcp.json`)
