# Aura Frog - Changelog

All notable changes to Aura Frog will be documented in this file.

---

## [1.2.5] - 2025-12-17

### Workflow & Comment Quality Improvements

Enhanced workflow visibility and comment quality standards.

#### New Features
- **Phase transition banner** - Show agent banner before each workflow phase
- **Agent visibility** - Users see which agent handles each phase

#### Rule Updates
- **smart-commenting.md** - Strengthened to "meaningful comments only"
  - Priority raised: Medium → High
  - Added anti-patterns: "new test", "new branch", "add coverage"
  - Added JSDoc rules section
- **execution-rules.md** - Added "show banner before each phase" requirement
- **agent-identification-banner.md** - Added "Phase Transition Banner" section

---

## [1.2.4] - 2025-12-17

### Plugin Optimization - Massive Token Reduction

Condensed verbose agents and commands to reduce plugin size by ~60%.

#### Condensed Agents (5 files)
- **backend-nodejs.md** - 1,182 → 100 lines (92% reduction)
- **backend-python.md** - 781 → 91 lines (88% reduction)
- **backend-laravel.md** - 766 → 95 lines (88% reduction)
- **backend-go.md** - 753 → 79 lines (89% reduction)
- **mobile-react-native.md** - 1,318 → 109 lines (92% reduction)

#### Condensed Commands (10 files)
- **project/init.md** - 1,095 → 115 lines (89% reduction)
- **refactor.md** - 932 → 95 lines (90% reduction)
- **test/document.md** - 808 → 87 lines (89% reduction)
- **review/fix.md** - 799 → 93 lines (88% reduction)
- **test/unit.md** - 702 → 102 lines (85% reduction)
- **document.md** - 697 → 87 lines (88% reduction)
- **bugfix/fix.md** - 645 → 93 lines (86% reduction)
- **setup/integrations.md** - 646 → 94 lines (85% reduction)
- **workflow/start.md** - 137 → 81 lines (41% reduction)
- **test/e2e.md** - 638 → 97 lines (85% reduction)

#### Architecture
- Agents now defer to expert skills for detailed patterns
- Commands use TOON format for compact structured data
- Removed redundant examples (users can ask for examples)
- Focused on essential information only

#### Stats (Before → After)
- **Agent lines:** ~8,500 → ~4,800 (44% reduction)
- **Command lines:** ~22,000 → ~16,600 (25% reduction)
- **Total estimated:** ~5,100 fewer lines

---

## [1.2.3] - 2025-12-16

### Session Context & Codebase Consistency

Token-efficient session context with TOON format and codebase pattern learning.

#### New Features
- **codebase-consistency rule** - Learn patterns before writing code
- **session-context.toon** - Cached codebase patterns (~150 tokens vs ~600)
- **TOON state format** - 73% token savings for workflow state

#### Updated Skills
- **project-context-loader** - Now generates session-context.toon automatically
- **state-persistence** - Migrated to TOON format for all state files

#### Updated Scripts
- **context-compress.sh** - Generates session-context.toon with pattern detection

#### Architecture
- `.claude/session-context.toon` - Cached patterns + workflow state
- `.claude/workflow-state.toon` - Detailed workflow (TOON format)
- Dynamic pattern scanning with caching (regenerate if > 1 hour)

#### Stats
- **Total Skills:** 38+ (25 auto-invoking + 13 reference)
- **Total Rules:** 38
- **Total Hooks:** 15

---

## [1.2.2] - 2025-12-15

### Backend Expert Skills & Rule Optimization

Expanded expert skills system with backend frameworks and significantly condensed verbose rules.

#### New Expert Skills (6)
- **nodejs-expert** - Express, NestJS, Fastify, async patterns, Prisma/TypeORM
- **python-expert** - Django, FastAPI, Flask, SQLAlchemy 2.0, async/await
- **laravel-expert** - Eloquent, service pattern, DTOs, queues, caching
- **go-expert** - Gin, Echo, Fiber, goroutines, channels, interfaces
- **flutter-expert** - Widgets, Riverpod, Bloc, GoRouter, forms
- **angular-expert** - Signals, RxJS, NgRx, reactive forms, OnPush

#### Rule Optimization (~85% reduction in verbose rules)
- Condensed `theme-consistency.md`: 961 → 134 lines
- Condensed `direct-hook-access.md`: 820 → 131 lines
- Condensed `smart-commenting.md`: 769 → 130 lines
- Condensed `correct-file-extensions.md`: 732 → 117 lines
- Total savings: ~2,770 lines

#### Stats
- **Total Skills:** 38+ (25 auto-invoking + 13 reference)
- **Total Rules:** 37
- **Total Hooks:** 15

---

## [1.2.1] - 2025-12-15

### Expert Skills System & Enhanced Hooks

Major update introducing framework-specific expert skills for on-demand loading and enhanced lifecycle hooks.

#### New Expert Skills (5)
- **typescript-expert** - Strict types, ESLint config, nullish handling, modern patterns
- **react-expert** - Components, hooks, performance, state management, forms
- **react-native-expert** - FlatList optimization, navigation, platform code, animations
- **vue-expert** - Composition API, script setup, Pinia, reactivity patterns
- **nextjs-expert** - App Router, Server Components, caching, Server Actions

#### New Hooks (6)
- **PreToolUse - Secrets Protection** - Warns when writing to files containing secrets
- **PreToolUse - SAST Security** - Detects security anti-patterns
- **PostToolUse - Large File Warning** - Warns when reading files >500 lines
- **UserPromptSubmit - Confluence Detection** - Auto-detects Confluence URLs
- **UserPromptSubmit - GitHub Detection** - Auto-detects GitHub PR/Issue URLs
- **SessionEnd - Uncommitted Changes** - Reminds about staged changes

#### Architecture Change
- Migrated framework-specific rules to expert skills for on-demand loading
- Removed `modern-javascript.md` and `typescript-strict-practices.md` (now in skills)
- Expert skills auto-invoke based on project context

#### Stats
- **Total Skills:** 30+ (19 auto-invoking + 12 reference)
- **Total Rules:** 37
- **Total Hooks:** 15

---

## [1.2.0] - 2025-12-11

### Token Optimization & New Rules

Major update focused on token efficiency, security rules, and multi-session support.

#### New Skills (3)
- **lazy-agent-loader** - Load agent summaries first, full definitions on demand (~94% token savings)
- **response-analyzer** - Save large outputs to temp files, load summaries (~95% savings)
- **state-persistence** - File-based workflow state for session handoffs

#### New Rules (3)
- **diagram-requirements** - Mermaid diagrams required for complex features
- **sast-security-scanning** - OWASP Top 10 + SAST scanning enforcement
- **prefer-established-libraries** - Use lodash/es-toolkit over custom utilities

#### New Documentation
- `docs/WORKFLOW_DIAGRAMS.md` - 10 comprehensive Mermaid diagrams
- `docs/MULTI_SESSION_ARCHITECTURE.md` - Token optimization & session handoff guide

#### New Scripts (5)
- `scripts/validate-toon.sh` - Validate TOON format
- `scripts/context-compress.sh` - Generate compressed project context
- `scripts/response-save.sh` - Save verbose outputs to /tmp/aura-frog/
- `scripts/session-handoff.sh` - Generate human-readable handoff documents
- `scripts/workflow/workflow-export-toon.sh` - Export workflow state in TOON

#### Stats
- **Total Rules:** 38
- **Total Skills:** 26+ (14 auto-invoking + 12 reference)

---

## [1.1.4] - 2025-12-01

### Workflow Navigation

- **New Rule:** `rules/workflow-navigation.md` - Progress bar and next phase visibility after each phase

---

## [1.1.3] - 2025-12-01

### Modern JavaScript

- **New Rule:** `rules/modern-javascript.md` - ES6+ syntax enforcement (optional chaining, nullish coalescing, destructuring, arrow functions, etc.)

---

## [1.1.2] - 2025-12-01

### Feedback Brainstorming

- **New Rule:** `rules/feedback-brainstorming.md` - Agents brainstorm feedback before implementing
- Force mode with "must do:", "just do:", "I insist"

---

## [1.1.1] - 2025-12-01

### Cleanup

- Removed multi-model selection feature (not supported by Claude Code)

---

## [1.1.0] - 2025-12-01

### Skills Standardization

Major update standardizing skill file format and streamlining plugin structure.

#### Changes
- All skills now use `SKILL.md` with frontmatter metadata
- CLAUDE.md reduced from ~190 to ~77 lines (60% reduction)
- Added Confluence integration with full CRUD operations
- Removed multi-model selection feature

#### Stats
- **Auto-Invoke Skills:** 10
- **Reference Skills:** 12+

---

## [1.0.2] - 2025-12-01

### CLAUDE.md Refactoring

- CLAUDE.md reduced from ~580 to ~187 lines (68% reduction)
- New skill: `session-manager`
- New rule: `env-loading`
- New command: `project:reload-env`

---

## [1.0.1] - 2025-11-29

### Voice Notifications: Realtime Streaming

- Voice notifications now use realtime streaming (no files created)
- Lower latency, zero disk usage
- Removed cleanup scripts (no longer needed)

---

## [1.0.0] - 2025-11-28

### Rebranding: CCPM to Aura Frog

**"Code with main character energy!"**

#### Changes
- Project renamed from "CCPM" to "Aura Frog"
- New visual identity with frog mascot
- New agent banner format with aura messages

#### Stats at Launch
- **24** Specialized Agents
- **20** Skills (9 auto-invoking + 11 reference)
- **25** Quality Rules
- **9** Workflow Phases
- **70** Commands
- **4** Integrations (JIRA, Figma, Slack, Confluence)

---

## Pre-1.0 History

### [5.2.0] - 2025-11-28
- Token optimization (30-70% reductions)
- Skills rebuilt with comprehensive content
- README professionalized with badges

### [5.1.0] - 2025-11-27
- Skills system introduced (8 auto-invoking)
- Voiceover notifications (ElevenLabs)
- Hooks system (7 lifecycle hooks)
- Dual-file loader architecture

### [5.0.0-beta] - 2025-11-26
- New agents: backend-nodejs, security-expert, devops-cicd
- 11 new commands (security, performance, deployment)

### [4.6.0] - 2025-11-26
- Auto-approval permissions
- Agent identification system
- Adaptive styling detection

### [4.5.0] - 2025-11-25
- NativeWind integration
- ElevenLabs voice operations
- 70+ language support

### [4.4.0] - 2025-11-24
- Initial release
- 14 specialized agents
- 9-phase workflow with TDD
