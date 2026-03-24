# Aura Frog Skills

**Total Skills:** 43 (8 auto-invoking + 35 reference)
**Platform:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) Plugin
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)

> **Note:** Integration skills (JIRA, Figma, Confluence, Slack) have been replaced with bundled MCP servers. See `.mcp.json` for configuration.

---

## New in 1.17.0 - Context Optimization

**Auto-invoke reduced from 28 → 8** through consolidation:

- **framework-expert** - Unified framework bundle with lazy loading. Replaces 12 individual framework skills in auto-invoke (~80% token reduction).
- **testing-patterns** - Unified testing patterns across all frameworks.

**Note:** Individual framework skills remain as reference documentation, loaded on-demand by the bundle skills. SEO/GEO and Godot skills have been externalized as separate addons.

**Docs:** `docs/REFACTOR_ANALYSIS.md` for full optimization guide.

---

## New in 1.16.0

- SEO/GEO skills (seo-expert, ai-discovery-expert, seo-check, seo-schema, seo-geo) have been **externalized as a separate addon**.

---

## New in 1.12.0

- **code-simplifier** - Detect and simplify overly complex code. Apply KISS principle - less is more.

---

## New in 1.9.0

- **learning-analyzer** - Analyze feedback patterns and generate insights from Supabase
- **self-improve** - Apply learned improvements to plugin configuration and rules

---

## New in 1.8.1

- **workflow-orchestrator** - Streamlined workflow with only 2 approval gates (Phase 1 Design, Phase 3 Build GREEN). Other phases auto-continue unless blockers hit.

## New in 1.7.0

- **workflow-orchestrator** now includes fast-track mode for pre-approved specs (merged from workflow-fasttrack)

## New in 1.6.0

- **godot-expert** has been **externalized as a separate addon**.

## New in 1.5.0

- **stitch-design** - Generate UI designs using Google Stitch AI with optimized prompts

## New in 1.4.0

- **git-workflow** - Token-efficient git operations with security scanning
- **debugging** - Systematic debugging with root cause investigation
- **sequential-thinking** - Structured thinking process for complex analysis
- **problem-solving** - 5 techniques for different problem types

---

## What Are Skills?

Skills are **model-invoked** capabilities that Claude automatically activates based on context matching. Unlike commands (which you explicitly call), Skills are discovered and used by Claude when your message matches their description.

---

## Available Skills

### 1. **workflow-orchestrator** (Priority: CRITICAL)

**Auto-invokes when:** User requests to implement new features, build functionality, or create something complex

**Triggers:**
- "implement", "build", "create feature", "add new", "develop"
- "workflow:start <task>"
- Complex tasks requiring multiple phases

**What it does:**
- Executes Aura Frog's 5-phase workflow
- Enforces TDD (RED → GREEN → REFACTOR)
- Multi-agent collaboration
- Quality gates at every phase

---

### 2. **agent-detector** (Priority: HIGHEST - ALWAYS RUNS)

**Auto-invokes when:** EVERY single user message

**Triggers:** ALL messages (no exceptions)

**What it does:**
- Analyzes message for keywords and intent
- Scores all available agents
- Selects Primary (≥80), Secondary (50-79), Optional (30-49)
- Shows agent identification banner
- Proceeds as detected agent

**⚠️ CRITICAL:** This skill MUST run FIRST before any other action

---

### 3. **project-context-loader** (Priority: HIGH)

**Auto-invokes when:** Before workflows, implementations, or code generation

**Triggers:**
- Before "workflow:start"
- Before "implement", "build", "create"
- When project-specific behavior needed

**What it does:**
- Loads `.claude/project-contexts/[project]/`
- Reads conventions.md, rules.md, examples.md
- Applies YOUR project standards (not generic defaults)
- Merges project rules with Aura Frog core rules

---

### 4. **bugfix-quick** (Priority: MEDIUM)

**Auto-invokes when:** Bug fixes and issues mentioned

**Triggers:**
- "fix bug", "error", "not working", "broken", "issue"
- "crash", "fails", "problem"
- "bugfix:quick" command

**What it does:**
- Lightweight fix process (skips full 5-phase workflow)
- Still enforces TDD: write failing test → implement fix → verify
- 3 approval gates (vs 5 in full workflow)
- Much faster for simple bugs

---

### 5. **test-writer** (Priority: MEDIUM)

**Auto-invokes when:** Test-related requests

**Triggers:**
- "add tests", "write tests", "test coverage"
- "unit test", "integration test", "E2E test"
- "test:unit", "test:e2e" commands

**What it does:**
- Creates comprehensive tests (unit, integration, E2E)
- Enforces TDD when possible
- Supports Jest, Cypress, Detox, PHPUnit, PyTest
- Ensures coverage meets target (default 80%)

---

### 6. **code-reviewer** (Priority: HIGH)

**Auto-invokes when:** After code implementation or review requested

**Triggers:**
- "review code", "code review", "check my code"
- After Phase 4 (Refactor + Review) in workflow
- Before merging pull requests

**What it does:**
- Multi-agent review (Security, Performance, Quality, Testing)
- OWASP Top 10 security checks
- Performance analysis
- Test coverage verification
- Generates comprehensive review report

---

### 7. **session-continuation** (Priority: HIGH)

**Auto-invokes when:** Token limit warning triggered

**Triggers:**
- Token count exceeds 150K (75% of limit)
- User requests `workflow:handoff`
- User requests `workflow:resume`
- Long-running workflow needs state save

**What it does:**
- Monitors token usage
- Saves workflow state to `.claude/logs/workflows/`
- Enables workflow resume across sessions
- Warns user before token exhaustion
- Detailed handoff/resume flows

**Thresholds:**
- 150K tokens - Consider handoff
- 175K tokens - Recommend handoff
- 190K tokens - Urgent handoff

**📚 Details:** `skills/session-continuation/SKILL.md`

---

### 8. **lazy-agent-loader** (Priority: HIGH)

**Auto-invokes when:** Agent detection runs (integrated with agent-detector)

**Triggers:**
- When agent is selected
- "agent:load" command

**What it does:**
- Loads only agent **summaries** initially (~50 tokens each)
- Loads **full definition** only when agent is activated (≥80 score)
- Reduces context bloat from 48K to ~2.7K tokens (94% savings)

**📚 Details:** `skills/lazy-agent-loader/SKILL.md`

---

### 9. **response-analyzer** (Priority: MEDIUM)

**Auto-invokes when:** Large command outputs or API responses

**Triggers:**
- Command output >100 lines
- API response >5KB
- File search results >50 files

**What it does:**
- Writes large responses to `/tmp/aura-frog/`
- Loads only **summaries** into conversation context
- References full data when needed
- 95% token savings on verbose outputs

**📚 Details:** `skills/response-analyzer/SKILL.md`

---

## Skill Invocation Flow

```
1. User sends message
   ↓
2. agent-detector skill auto-invokes (ALWAYS)
   ↓
3. Detects appropriate agent
   ↓
4. Checks message intent
   ↓
5. Other skills auto-invoke based on context:
   - "implement feature" → workflow-orchestrator
   - "fix bug" → bugfix-quick
   - "add tests" → test-writer
   - JIRA/Figma/Confluence → MCP tools (bundled)
   ↓
6. Skills load project-context-loader if needed
   ↓
7. Execute skill logic
   ↓
8. code-reviewer auto-invokes after implementation
```

---

## How Skills Work

### Auto-Invocation

Claude reads all skill descriptions and uses LLM reasoning to match your message to the appropriate skill(s). Multiple skills can activate for a single message.

**Example 1:**
```
User: "Implement user profile screen from PROJ-1234 Figma design"

Auto-invokes:
1. agent-detector (ALWAYS)
2. MCP: atlassian (JIRA ticket fetch)
3. MCP: figma (design fetch)
4. project-context-loader (before implementation)
5. workflow-orchestrator (complex feature)
```

**Example 2:**
```
User: "Fix the login button bug"

Auto-invokes:
1. agent-detector (ALWAYS)
2. project-context-loader (before fix)
3. bugfix-quick (bug detected)
```

### Skill Loading Sequence

1. **Claude reads skill description** from plugin.json
2. **Matches context** using LLM reasoning
3. **Loads SKILL.md** with full instructions
4. **Injects as user message** into conversation
5. **Executes skill logic** following instructions
6. **Returns results** to user

---

## Skill File Structure

Each skill follows this structure:

```
skills/
└── [skill-name]/
    ├── SKILL.md (required) - Main skill instructions with frontmatter
    ├── [reference].md (optional) - Additional reference docs
    └── scripts/ (optional) - Bash scripts for integrations
```

**Skill file format (SKILL.md):**
```markdown
---
name: skill-name
description: "Clear description with TRIGGER words"
autoInvoke: true|false
priority: highest|high|medium|low
triggers:
  - "trigger phrase 1"
  - "trigger phrase 2"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Skill Name

## Overview
## When to Use This Skill
## When NOT to Use
## How It Works
## Examples
## Related Skills
```

---

## Skill Descriptions - The Key to Auto-Invocation

**Good descriptions (80%+ success rate):**
- ✅ Use action words: "PROACTIVELY use when..."
- ✅ List specific triggers: "Triggers: 'implement', 'build', 'create'"
- ✅ Specify WHEN to use
- ✅ Specify WHEN NOT to use
- ✅ Include example phrases users say

**Bad descriptions (20% success rate):**
- ❌ Vague: "Helps with coding"
- ❌ No triggers listed
- ❌ No examples
- ❌ Doesn't specify exclusions

---

## Skill Dependencies

**Skill usage patterns:**

```
agent-detector (ALWAYS FIRST)
↓
project-context-loader (Before major actions)
↓
workflow-orchestrator, bugfix-quick, or test-writer
↓
code-reviewer (After implementation)
↓
MCP tools: atlassian / figma / slack (When mentioned)
```

---

## Skill Priorities (TOON)

```toon
auto_invoke_skills[8]{name,priority,trigger}:
  agent-detector,highest,ALWAYS (100%) - includes lazy-agent-loader
  workflow-orchestrator,critical,Complex tasks - includes fasttrack mode
  framework-expert,high,Framework task - lazy loads specific patterns
  testing-patterns,high,Test task - unified testing patterns
  code-reviewer,high,After implementation
  bugfix-quick,medium,Bug mentions
  test-writer,medium,Test requests
  code-simplifier,medium,Simplify/KISS/complexity
```

**Reference Skills (35)** - Loaded on-demand by bundles or commands:
- Framework experts: react, react-native, vue, angular, nextjs, nodejs, python, laravel, go, flutter, typescript (11)
- Design: design-system-library, stitch-design, design-expert (3)
- Learning: learning-analyzer, self-improve (2)
- Workflow: lazy-agent-loader, phase1-lite (2)
- Context: project-context-loader, session-continuation, response-analyzer (3)
- Others: api-designer, debugging, migration-helper, performance-optimizer, pm-expert, qa-expert, refactor-expert, sequential-thinking, problem-solving, scalable-thinking, dev-expert, documentation, git-workflow, git-worktree (14)

> **Externalized addons:** Godot (godot-expert) and SEO/GEO (seo-bundle, seo-expert, ai-discovery-expert, seo-check, seo-schema, seo-geo) are available as separate addons.

> **MCP Integrations:** JIRA, Figma, Confluence, and Slack are now handled via bundled MCP servers. Configure in `.mcp.json`.
---

## Using Skills

**You don't need to call skills explicitly!** Just describe what you want in natural language:

**Instead of:**
```
/workflow-orchestrator implement user profile
```

**Just say:**
```
Implement a user profile screen
```

Claude will automatically invoke the `workflow-orchestrator` skill.

---

## Documentation

- **Skills Overview:** `skills/README.md` (this file)
- **Individual Skills:** `skills/[skill-name]/SKILL.md`
- **Main CLAUDE.md:** Overview and skill coordination
- **Plugin Manifest:** `.claude-plugin/plugin.json` (skill registration)

---

## Important Notes

1. **agent-detector ALWAYS runs first** - No exceptions
2. **Multiple skills can activate** for a single message
3. **Skills are auto-invoked** - You don't call them manually
4. **project-context-loader should run** before code generation
5. **MCP integrations require env vars** - Set tokens in `.envrc` (see `.mcp.json`)

---

## Reference Skills (Non-Auto-Invoking)

These skills provide guidance documents that agents reference during workflows:

```toon
reference_skills[9]{name,purpose,location}:
  design-system-library,Design system patterns (MUI Ant Tailwind),skills/design-system-library/
  refactor-expert,Safe refactoring patterns,skills/refactor-expert/
  api-designer,RESTful API design,skills/api-designer/
  performance-optimizer,Performance profiling + optimization,skills/performance-optimizer/
  migration-helper,Database/code migrations,skills/migration-helper/
  phase-skipping,Smart phase skip rules,skills/workflow-orchestrator/
  estimation,Effort estimation techniques,skills/pm-expert/
  documentation,ADR + Runbook templates,skills/documentation/
  code-simplifier,KISS principle + complexity reduction,skills/code-simplifier/
```

### 11. **design-system-library** (Priority: HIGH)

**Auto-invokes when:** Building UI components or user mentions design system

**Triggers:**
- "material ui", "mui", "ant design", "tailwind", "shadcn", "chakra"
- "design system", "component library", "ui library"
- Building web/mobile app UI

**What it does:**
- Auto-detects project's design system from package.json
- Loads appropriate design system patterns
- Generates code using correct component library
- Ensures theme consistency

**Supported Systems:**
- Material UI (MUI)
- Ant Design
- Tailwind CSS
- shadcn/ui
- Chakra UI
- NativeWind
- Bootstrap
- Mantine
- Radix UI
- Headless UI

**📚 Details:** `skills/design-system-library/SKILL.md`

---

### 12. **stitch-design** (Priority: MEDIUM)

**Auto-invokes when:** User requests AI-generated UI designs

**Triggers:**
- "stitch", "AI design", "generate UI", "design with AI"
- "stitch design", "create UI with Stitch"
- `/design:stitch` command

**What it does:**
- Generates optimized prompts for Google Stitch AI
- Creates review documents for stakeholder approval
- Guides users through Stitch workflow (no API, manual interaction)
- Processes exported code for integration
- Supports 5 design types: Dashboard, Landing, Mobile, E-commerce, Forms

**Workflow:**
1. Gather requirements (app type, theme, features)
2. Generate optimized Stitch prompt
3. Create review doc (saved to `.claude/workflow/`)
4. Guide user through Stitch (https://stitch.withgoogle.com)
5. Process exported code/Figma

**Commands:**
- `/design:stitch "requirements"` - Generate Stitch prompt
- `/design:stitch-review` - Process exported code

**📚 Details:** `skills/stitch-design/SKILL.md`

---

---

## Expert Skills (Framework-Specific)

Expert skills provide comprehensive best practices for specific frameworks. They auto-invoke when working with the respective technology:

### 14. **typescript-expert** (Priority: HIGH)

**Auto-invokes when:** Working with TypeScript files, type errors, ESLint issues

**Triggers:** .ts, .tsx, type errors, eslint, strict mode

**What it does:**
- Strict null handling (no implicit truthiness)
- ESLint best practices configuration
- Type guards and validation patterns
- Modern JavaScript/TypeScript patterns
- Error handling with typed errors

---

### 15. **react-expert** (Priority: HIGH)

**Auto-invokes when:** Working with React components, hooks

**Triggers:** React, JSX, useState, useEffect, hooks, component

**What it does:**
- Function component patterns
- Hooks best practices (useState, useEffect, useMemo, useCallback)
- Performance optimization (React.memo, code splitting)
- State management patterns
- Form handling with validation

---

### 16. **react-native-expert** (Priority: HIGH)

**Auto-invokes when:** Working with React Native, mobile apps

**Triggers:** react-native, expo, mobile, iOS, Android, NativeWind

**What it does:**
- FlatList/FlashList optimization
- Navigation (React Navigation) patterns
- Platform-specific code handling
- Animation with Reanimated
- Storage patterns (AsyncStorage, SecureStore, MMKV)

---

### 17. **vue-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Vue 3, Composition API

**Triggers:** vue, composition api, pinia, nuxt, ref, reactive

**What it does:**
- Script setup patterns
- Reactivity best practices (ref vs reactive)
- Composables (custom hooks)
- Pinia state management
- VeeValidate + Zod forms

---

### 18. **nextjs-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Next.js projects

**Triggers:** nextjs, app router, server component, api route

**What it does:**
- App Router structure and conventions
- Server vs Client Components
- Data fetching and caching strategies
- Server Actions for forms
- Middleware and API routes

---

### 19. **nodejs-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Node.js backend, Express, NestJS, Fastify

**Triggers:** nodejs, express, nestjs, fastify, api route, backend

**What it does:**
- Express/NestJS/Fastify patterns
- Async error handling and typed errors
- Database patterns (Prisma, TypeORM)
- Validation with Zod
- Security (Helmet, rate limiting, CORS)

---

### 20. **python-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Python backend, Django, FastAPI, Flask

**Triggers:** python, django, fastapi, flask, pydantic, sqlalchemy

**What it does:**
- FastAPI Pydantic patterns
- Django ORM best practices (N+1 prevention)
- SQLAlchemy 2.0 async patterns
- Async programming with asyncio
- Type hints and testing

---

### 21. **laravel-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Laravel/PHP projects

**Triggers:** laravel, php, eloquent, artisan, blade, sanctum

**What it does:**
- Eloquent best practices (eager loading)
- Service pattern with DTOs
- Request validation and API Resources
- Queue jobs and caching
- Testing with PHPUnit/Pest

---

### 22. **go-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Go/Golang projects

**Triggers:** golang, go, gin, echo, fiber, goroutine

**What it does:**
- Gin/Echo/Fiber patterns
- Error handling and interfaces
- Concurrency (goroutines, channels)
- Database with sqlx/GORM
- Testing patterns

---

### 23. **flutter-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Flutter/Dart projects

**Triggers:** flutter, dart, widget, bloc, riverpod, pubspec

**What it does:**
- Widget best practices (const, extraction)
- State management (Riverpod, Bloc)
- Navigation with GoRouter
- Forms and validation
- Performance optimization

---

### 24. **angular-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Angular projects

**Triggers:** angular, ngrx, rxjs, component.ts, ng serve

**What it does:**
- Standalone components with signals
- RxJS best practices
- NgRx state management
- Reactive forms
- Performance (OnPush, trackBy, defer)

---

### 25. **code-simplifier** (Priority: HIGH)

**Auto-invokes when:** Code is overly complex, deep nesting, or user asks to simplify

**Triggers:** simplify, too complex, make simpler, reduce complexity, KISS, over-engineered

**What it does:**
- Quick reference for KISS principle application
- References comprehensive `rules/core/simplicity-over-complexity.md`
- Provides complexity targets checklist
- Links to `quality:complexity` command for analysis

**📚 Details:** `skills/code-simplifier/SKILL.md`
**📚 Full Guide:** `rules/core/simplicity-over-complexity.md`

---

> **Note:** SEO/GEO skills (seo-expert, ai-discovery-expert, seo-check, seo-schema, seo-geo) and Godot skill (godot-expert) are available as separate addons.

---

**Last Updated:** 2026-02-09
**Format:** TOON (Token-Optimized)
**Total Skills:** 43 (8 auto-invoking + 35 reference)
