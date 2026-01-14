# Aura Frog Skills

**Version:** 1.13.0
**Total Skills:** 38 (26 auto-invoking + 12 reference)
**Platform:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) Plugin
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)

> **Note:** Integration skills (JIRA, Figma, Confluence, Slack) have been replaced with bundled MCP servers. See `.mcp.json` for configuration.

---

## New in 1.12.0

- **code-simplifier** - Detect and simplify overly complex code. Apply KISS principle - less is more.

---

## New in 1.9.0

- **learning-analyzer** - Analyze feedback patterns and generate insights from Supabase
- **self-improve** - Apply learned improvements to plugin configuration and rules

---

## New in 1.8.1

- **workflow-orchestrator** - Streamlined workflow with only 2 approval gates (Phase 2 Design, Phase 5b Implementation). Other phases auto-continue unless blockers hit.

## New in 1.7.0

- **workflow-fasttrack** - Fast-track workflow for pre-approved specs. Skips phases 1-3, auto-executes 4-9 without approval gates

## New in 1.6.0

- **godot-expert** - Godot game development expert for HTML5, Android, iOS, and desktop exports with GDScript best practices

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
- Executes Aura Frog's 9-phase workflow
- Enforces TDD (RED → GREEN → REFACTOR)
- Multi-agent collaboration
- Quality gates at every phase

---

### 2. **workflow-fasttrack** (Priority: HIGH)

**Auto-invokes when:** User provides complete design/specs and wants execution without approvals

**Triggers:**
- "fasttrack:", "fast-track", "workflow:fasttrack"
- "specs ready", "just build it", "execute from specs"
- Complete specs provided with "just build" intent

**What it does:**
- Validates specs contain required sections
- Skips phases 1-3 (requirements already done)
- Auto-executes phases 4-9 without approval gates
- Only stops on errors (test failures, security issues)
- TDD still enforced (RED → GREEN → REFACTOR)

**Use when:** Design is complete and you want uninterrupted execution

---

### 3. **agent-detector** (Priority: HIGHEST - ALWAYS RUNS)

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
- Lightweight fix process (skips full 9-phase workflow)
- Still enforces TDD: write failing test → implement fix → verify
- 3 approval gates (vs 9 in full workflow)
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
- After Phase 5c in workflow
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
skills[27]{name,priority,trigger}:
  agent-detector,highest,ALWAYS (100%)
  workflow-orchestrator,critical,Complex tasks
  workflow-fasttrack,high,Pre-approved specs / fast execution
  project-context-loader,high,Before code generation
  design-system-library,high,UI components + design system
  code-reviewer,high,After implementation
  session-continuation,high,Token limit warning + handoff/resume
  lazy-agent-loader,high,Agent loading optimization
  sequential-thinking,high,Complex analysis / step by step
  problem-solving,high,Stuck / need breakthrough
  learning-analyzer,high,Pattern analysis / insights
  self-improve,high,Apply learned improvements
  typescript-expert,high,TypeScript/ESLint/type errors
  react-expert,high,React components/hooks
  react-native-expert,high,React Native/Expo/mobile
  vue-expert,high,Vue 3/Composition API/Pinia
  nextjs-expert,high,Next.js/App Router/Server Components
  nodejs-expert,high,Node.js/Express/NestJS/Fastify
  python-expert,high,Python/Django/FastAPI/Flask
  laravel-expert,high,Laravel/PHP/Eloquent
  go-expert,high,Go/Gin/Echo/Fiber
  flutter-expert,high,Flutter/Dart/Bloc/Riverpod
  angular-expert,high,Angular/NgRx/RxJS
  godot-expert,high,Godot/GDScript/game development
  stitch-design,medium,AI design / Stitch prompts
  bugfix-quick,medium,Bug mentions
  test-writer,medium,Test requests
  response-analyzer,medium,Large output handling
```

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

### 25. **godot-expert** (Priority: HIGH)

**Auto-invokes when:** Working with Godot game projects

**Triggers:** godot, gdscript, game, .gd, .tscn, scene, node, project.godot

**What it does:**
- Scene composition patterns
- GDScript typed best practices
- Physics and collision handling
- Input handling (desktop + touch/mobile)
- Animation and audio systems
- Multi-platform export (HTML5, Android, iOS, Desktop)
- Testing with GDUnit

**Export Targets:**
- HTML5 (WebGL, browser games)
- Android (APK/AAB for Google Play)
- iOS (IPA for App Store)
- Windows, macOS, Linux

**📚 Details:** `skills/godot-expert/SKILL.md`

---

### 26. **code-simplifier** (Priority: HIGH)

**Auto-invokes when:** Code is overly complex, deep nesting, or user asks to simplify

**Triggers:** simplify, too complex, make simpler, reduce complexity, KISS, over-engineered

**What it does:**
- Quick reference for KISS principle application
- References comprehensive `rules/kiss-avoid-over-engineering.md`
- Provides complexity targets checklist
- Links to `quality:complexity` command for analysis

**📚 Details:** `skills/code-simplifier/SKILL.md`
**📚 Full KISS Guide:** `rules/kiss-avoid-over-engineering.md`

---

**Version:** 1.13.0
**Last Updated:** 2026-01-12
**Format:** TOON (Token-Optimized)
**Total Skills:** 38 (26 auto-invoking + 12 reference)
