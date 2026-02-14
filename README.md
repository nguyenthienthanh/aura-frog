<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### A Plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Code with main character energy**

AI-powered development plugin for **Claude Code** with 10 specialized agents, 53 skills, 9-phase TDD workflow, auto model routing (Haiku/Sonnet/Opus), Agent Teams orchestration, self-improving learning system, and bundled MCP servers.

[![Version](https://img.shields.io/badge/version-1.18.0-blue.svg)](aura-frog/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#quick-start) | [Features](#key-features) | [Documentation](#documentation) | [Contributing](#contributing)

</div>

---

## At a Glance

<div align="center">

| **Agents** | **Skills** | **Commands** | **Rules** | **Hooks** | **MCP Servers** |
|:----------:|:----------:|:--------------------:|:---------:|:---------:|:---------------:|
| **10** | **53** | **91** | **50** | **20** | **6** |

</div>

**What's Inside:**
- **10 Specialized Agents** — Consolidated: architect, ui-expert, mobile-expert, game-developer, qa, security, devops
- **91 Commands** — 6 bundled (`/workflow`, `/test`, `/project`, `/quality`, `/bugfix`, `/seo`) + 85 individual commands
- **13 Auto-Invoking Skills** — Agent detection, model routing, workflow, testing, SEO bundles
- **40 Reference Skills** — Framework experts, SEO experts, design, loaded on-demand by bundles
- **6 MCP Servers** — Context7, Playwright, Vitest, Firebase, Figma, Slack
- **50 Quality Rules** — System, code quality, architecture, workflow, UI, SEO
- **20 Lifecycle Hooks** — Safety guards, auto-learning, teammate orchestration
- **9-Phase Workflow** — From requirements to deployment with only 2 approval gates
- **Agent Teams** — Real multi-agent orchestration with persistent teammates (experimental)
- **Model Routing** — Auto-select Haiku/Sonnet/Opus for 30-50% cost savings
- **Learning System** — Self-improvement via local storage or Supabase

---

## Quick Start

### Prerequisites

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — Install Anthropic's CLI first
- **Git** — Version control
- **Node.js 18+** or your project's runtime

### Installation

In Claude Code terminal:

```bash
# Step 1: Add Aura Frog Marketplace (one-time)
/plugin marketplace add nguyenthienthanh/aura-frog

# Step 2: Install Aura Frog Plugin
/plugin install aura-frog@aurafrog

# Step 3: Create local settings (required)
cd ~/.claude/plugins/marketplaces/aurafrog/aura-frog/
cp settings.example.json settings.local.json
```

### Updating

```bash
# Update to latest version
/plugin marketplace update aurafrog
```

### First Workflow

```bash
# Initialize your project (recommended)
project:init

# Start your first workflow
workflow:start "Implement user authentication"
```

### Follow the Flow

At each phase, review and respond:
- `approve` or `yes` — Continue to next phase
- `reject: <reason>` — Restart current phase
- `modify: <changes>` — Adjust deliverables

**See:** [aura-frog/QUICKSTART.md](aura-frog/QUICKSTART.md) for quickstart | [aura-frog/GET_STARTED.md](aura-frog/GET_STARTED.md) for full guide

---

## Overview

**Aura Frog** is a plugin for **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** (Anthropic's official CLI for Claude) that transforms it into a **structured development platform** with specialized agents, enforced TDD, and quality gates at every step.

> **What is Claude Code?** Claude Code is Anthropic's agentic coding tool that operates in your terminal, understands your codebase, and helps you code faster through natural conversation. Aura Frog extends Claude Code with structured workflows and specialized agents.

### Why Aura Frog?

| Traditional Development | With Aura Frog |
|------------------------|----------------|
| Manual task management | AI-powered 9-phase workflow |
| Generic AI responses | 10 specialized agents auto-selected |
| Single AI session | Agent Teams with persistent teammates |
| Testing as afterthought | TDD enforced (RED → GREEN → REFACTOR) |
| Ad-hoc code review | Multi-agent cross-review built-in |
| Context switching | CLI-first with 91 commands |
| Manual documentation | Auto-generated docs |
| Manual integrations | Bundled MCP servers (Figma, Slack, etc.) |

**Result:** 60-70% reduction in PM overhead while improving code quality.

---

## Key Features

### 10 Specialized Agents (Consolidated in v1.17.0)

Agents auto-activate based on your prompt context. v1.17.0 consolidated 15 agents into 10 for better routing:

<details>
<summary><b>Development (4)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `architect` | System design, database, backend (Node.js, Python, Laravel, Go) — **NEW: replaces backend-expert + database-specialist** |
| `ui-expert` | Frontend (React, Vue, Angular, Next.js) + design systems — **NEW: replaces web-expert + ui-designer** |
| `mobile-expert` | React Native, Flutter — Expo, cross-platform, NativeWind |
| `game-developer` | Godot game development, multi-platform export |

</details>

<details>
<summary><b>Quality & Security (2)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `security-expert` | OWASP audits, vulnerability scanning |
| `qa-automation` | Jest, Cypress, Detox, testing strategies |

</details>

<details>
<summary><b>Infrastructure (1)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `devops-cicd` | Docker, K8s, CI/CD, monitoring |

</details>

<details>
<summary><b>System (3)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `project-manager` | Project detection, config loading, context — **NEW: replaces 3 agents** |
| `smart-agent-detector` | Intelligent agent + model selection |
| `pm-operations-orchestrator` | Workflow coordination |

</details>

---

### 6 MCP Servers

MCP (Model Context Protocol) servers auto-invoke based on context:

| MCP Server | Purpose | Auto-Triggers | Setup |
|------------|---------|---------------|-------|
| **context7** | Library documentation | "Build with MUI", library names | None |
| **playwright** | Browser automation, E2E | "Test the login page" | None |
| **vitest** | Test execution, coverage | "Run tests", "Check coverage" | None |
| **firebase** | Firebase services | "Set up Firestore", "Firebase Auth" | `firebase login` |
| **figma** | Design file fetching | Figma URLs | `FIGMA_API_TOKEN` |
| **slack** | Notifications | Phase 9 completion | `SLACK_BOT_TOKEN` |

MCPs requiring tokens will silently skip if not configured.

```bash
# Context7 auto-fetches React docs
"Build a form with Material UI"

# Firebase manages your project
"Set up Firestore for my app"
```

**See:** [aura-frog/docs/MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) for setup

---

### Skills System (Optimized in v1.17.0)

**53 skills** (13 auto-invoke + 40 reference) activate automatically based on your message context. v1.17.0 introduced **skill bundles** that lazy-load patterns on-demand:

```
User: "Implement user profile screen"
         ↓
Auto-invokes:
  1. agent-detector         → Selects mobile-expert + model
  2. model-router           → Picks Sonnet (standard task)
  3. project-context-loader → Loads your conventions
  4. workflow-orchestrator  → Executes 9-phase workflow
```

**13 Auto-Invoking Skills:**

| Skill | Triggers | Purpose |
|-------|----------|---------|
| `agent-detector` | **Every message** | Select agent + complexity |
| `model-router` | After agent detection | Select Haiku/Sonnet/Opus |
| `workflow-orchestrator` | "implement", "build", "create" | 9-phase workflow |
| `project-context-loader` | Before code generation | Load conventions |
| `framework-expert` | Framework tasks | Lazy-load React/Vue/etc patterns |
| `seo-bundle` | SEO/GEO tasks | Lazy-load SEO patterns |
| `testing-patterns` | Test tasks | Universal testing patterns |
| `bugfix-quick` | "fix", "error", "broken" | Fast TDD bug fixes |
| `test-writer` | "add tests", "coverage" | Generate tests |
| `code-reviewer` | After implementation | Multi-agent review |
| `session-continuation` | Token warning | Handoff/resume |
| `response-analyzer` | Large outputs | Token optimization |
| `code-simplifier` | "simplify", "too complex" | KISS enforcement |

**40 Reference Skills** — Loaded on-demand by bundles:
- Framework experts: react, react-native, vue, angular, nextjs, nodejs, python, laravel, go, flutter, godot, typescript (12)
- SEO experts: seo-expert, ai-discovery-expert, seo-check, seo-schema, seo-geo (5)
- Design: design-system-library, stitch-design, visual-pixel-perfect, design-expert (4)
- Others: api-designer, debugging, migration-helper, performance-optimizer, etc. (19)

**See:** [aura-frog/skills/README.md](aura-frog/skills/README.md) for complete documentation

---

### 9-Phase Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Understand    →  "What are we building?"          │
│  Phase 2: Design        →  "How will we build it?"          │
│  Phase 3: UI Breakdown  →  "What does it look like?"        │
│  Phase 4: Plan Tests    →  "How will we test it?"           │
├─────────────────────────────────────────────────────────────┤
│  Phase 5a: Write Tests  →  TDD RED - Tests must FAIL        │
│  Phase 5b: Build        →  TDD GREEN - Tests must PASS      │
│  Phase 5c: Polish       →  TDD REFACTOR - Stay green        │
├─────────────────────────────────────────────────────────────┤
│  Phase 6: Review        →  Multi-agent code review          │
│  Phase 7: Verify        →  QA validation                    │
│  Phase 8: Document      →  Auto-generate docs               │
│  Phase 9: Share         →  Team notification                │
└─────────────────────────────────────────────────────────────┘
```

**Quality Gates:** Only 2 approval gates (Phase 2 & 5b) — other phases auto-continue after showing deliverables!

---

### TDD Enforcement

TDD is **non-negotiable** in Aura Frog:

```
┌─────────┐    ┌─────────┐    ┌───────────┐
│   RED   │ →  │  GREEN  │ →  │ REFACTOR  │
│  Write  │    │  Make   │    │  Improve  │
│  Tests  │    │  Pass   │    │   Code    │
└─────────┘    └─────────┘    └───────────┘
   FAIL           PASS            PASS
```

- Cannot implement without tests
- Cannot proceed if tests don't fail (RED)
- Cannot proceed if tests don't pass (GREEN)
- Cannot proceed if coverage below 80%

---

### 50 Quality Rules

Aura Frog enforces consistent quality through comprehensive rules organized by category:

<details>
<summary><b>System Rules (10)</b></summary>

| Rule | Purpose |
|------|---------|
| `agent-identification-banner` | Show agent banner every response |
| `env-loading` | Load .envrc at session start |
| `execution-rules` | ALWAYS/NEVER execution rules |
| `priority-hierarchy` | Config priority order |
| `context-management` | **NEW:** Token optimization + model selection |
| `dual-file-architecture` | Plugin + project structure |
| `token-time-awareness` | Monitor token usage |
| `project-linting-precedence` | Merge project + Aura Frog rules |
| `codebase-consistency` | Learn patterns before writing code |
| `mcp-response-logging` | Save MCP responses to logs |

</details>

<details>
<summary><b>Code Quality Rules (13)</b></summary>

| Rule | Purpose |
|------|---------|
| `yagni-principle` | Only implement what's needed now |
| `dry-with-caution` | Rule of Three before abstracting |
| `kiss-avoid-over-engineering` | Keep it simple |
| `error-handling-standard` | Typed errors, proper logging |
| `logging-standards` | Structured logging, sanitization |
| `code-quality` | TypeScript strict, no any |
| `naming-conventions` | Consistent naming |
| `smart-commenting` | Why, not what |
| `prefer-established-libraries` | Use lodash/es-toolkit over custom |
| `post-implementation-linting` | Run lint after implementation |
| `seo-technical-requirements` | Meta tags, Core Web Vitals |
| `structured-data-schema` | JSON-LD Schema.org |
| `ai-discovery-optimization` | AI search optimization |

</details>

<details>
<summary><b>Workflow Rules (10)</b></summary>

| Rule | Purpose |
|------|---------|
| `tdd-workflow` | RED → GREEN → REFACTOR |
| `cross-review-workflow` | Multi-agent review |
| `approval-gates` | Only Phase 2 & 5b require approval |
| `git-workflow` | Commit conventions |
| `safety-rules` | Security guidelines |
| `next-step-guidance` | Always show next steps |
| `workflow-navigation` | Progress tracking |
| `feedback-brainstorming` | Brainstorm before feedback |
| `impact-analysis` | Analyze usages before modifying |
| `verification` | Fresh verification before done |

</details>

**See:** [aura-frog/rules/](aura-frog/rules/) for all rule definitions

---

### Learning System (Enhanced in v1.16.0)

Aura Frog learns and improves over time. **Works out of the box with local storage**, optionally syncs to Supabase:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Collect Data   │ →   │ Analyze Patterns │ →   │ Apply Learnings │
│  (auto-detect   │     │  (success/fail   │     │  (auto-improve  │
│   patterns)     │     │   patterns)      │     │   plugin)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Command | Description |
|---------|-------------|
| `/learn:status` | Show learning system status |
| `/learn:analyze` | Run pattern analysis |
| `/learn:apply` | Apply learned improvements |

**Features (v1.16.0):**
- **Local storage by default** — No setup required!
- **Smart Learn** — Auto-detect patterns from successful operations
- **Workflow Edit Detection** — Learn from your direct edits
- **Learned Rules MD** — Human-readable file auto-linked

**See:** [aura-frog/docs/LEARNING_SYSTEM.md](aura-frog/docs/LEARNING_SYSTEM.md) for setup

---

### Agent Teams (NEW in v1.18.0)

When enabled, Aura Frog uses Claude's **Agent Teams** feature for real multi-agent orchestration with persistent teammates, peer-to-peer messaging, and shared task lists.

```
┌─────────────────────────────────────────────────────────┐
│  pm-operations-orchestrator (Team Lead)                  │
│                                                          │
│  Creates teammates per phase:                            │
│  ├── architect      — System design, backend, DB         │
│  ├── ui-expert      — Frontend, design systems           │
│  ├── qa-automation   — Testing, quality gates             │
│  └── security-expert — Security review                   │
│                                                          │
│  Shared task list + peer messaging + cross-review        │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- **Phase-based teams** — Each workflow phase gets the right team composition (2-3 agents)
- **Parallel work** — Teammates work concurrently on separate files
- **Cross-review via messaging** — Real peer reviews between teammates
- **Quality hooks** — `TeammateIdle` assigns work, `TaskCompleted` validates output

**Enable:**
```json
// .claude/settings.local.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Backward compatible:** When disabled, standard subagent behavior applies (no change from v1.17.0).

**See:** [aura-frog/docs/AGENT_TEAMS_GUIDE.md](aura-frog/docs/AGENT_TEAMS_GUIDE.md) for full guide

---

## Workflow Modes

### Full 9-Phase Workflow

```bash
workflow:start "Your complex task"
```

**Best for:** New features, complex changes, production code
**Quality:** Maximum

### Lightweight Commands

```bash
bugfix:quick "Fix login button"    # Fast TDD bug fix
refactor "src/utils/api.ts"        # Code refactoring
planning "new feature"             # Create plan
document "API endpoints"           # Generate docs
```

**Best for:** Small bugs, documentation, simple refactors

---

## Commands Reference (Bundled in v1.17.0)

v1.17.0 introduces **6 bundled commands** with interactive submenus. Each bundled command replaces multiple individual commands:

<details>
<summary><b>Bundled Commands (6 entry points)</b></summary>

| Command | Subcommands | Replaces |
|---------|-------------|----------|
| `/workflow` | start, status, phase, next, approve, handoff, resume | 22 workflow commands |
| `/test` | unit, e2e, coverage, watch, docs | 4 test commands |
| `/project` | status, refresh, init, switch, list, config | 6 project commands |
| `/quality` | lint, complexity, review, fix | 3 quality commands |
| `/bugfix` | quick, full, hotfix | 3 bugfix commands |
| `/seo` | check, schema, geo | 3 seo commands |

**Usage:** `/workflow` shows menu, `/workflow start "task"` uses direct subcommand.

</details>

<details>
<summary><b>Common Standalone Commands</b></summary>

| Command | Description |
|---------|-------------|
| `refactor <file>` | Code refactoring |
| `planning <task>` | Create execution plan |
| `document <feature>` | Generate documentation |
| `agent:list` | Show all agents |
| `agent:info <name>` | Show agent details |
| `/learn:status` | Learning system status |

</details>

**See:** [aura-frog/commands/README.md](aura-frog/commands/README.md) for complete command reference

---

## MCP Integrations

All 6 MCP servers are configured in `.mcp.json` and auto-invoke based on context:

| MCP | Purpose | Setup Required |
|-----|---------|----------------|
| **context7** | Library docs (React, MUI, Tailwind) | None |
| **playwright** | E2E browser testing | None (auto-installs) |
| **vitest** | Unit test execution | Project with vitest |
| **firebase** | Firebase project management | `firebase login` |
| **figma** | Design extraction | `FIGMA_API_TOKEN` in `.envrc` |
| **slack** | Team notifications | `SLACK_BOT_TOKEN` + `SLACK_TEAM_ID` in `.envrc` |

MCPs requiring tokens will silently skip if not configured - no errors.

### Environment Setup (for Figma & Slack)

Copy `.envrc.template` and set your tokens:

```bash
export FIGMA_API_TOKEN="your-figma-token"
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_TEAM_ID="T0123456789"
```

**See:** [aura-frog/docs/MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) for complete setup

---

## Learning System

Aura Frog **learns and improves** over time. Works out of the box with **local storage** (no setup required), optionally syncs to Supabase for cross-machine memory.

### What It Does

| Feature | Description |
|---------|-------------|
| **Smart Learn** | Auto-detects successful code patterns (no feedback needed) |
| **Auto-Learn** | Captures corrections from user messages |
| **Workflow Edit Detection** | Learns from your direct edits to workflow files |
| **Pattern Creation** | After 3+ similar corrections, creates a learned pattern |
| **Memory Across Sessions** | Remembers patterns for future sessions (local or cloud) |

### Local Learning (Default - No Setup)

Learning works immediately with local file storage:
```
.claude/learning/
├── feedback.json      # All feedback entries
├── patterns.json      # Learned patterns
├── metrics.json       # Workflow metrics
└── learned-rules.md   # Human-readable rules
```

### Cloud Learning (Optional - Supabase)

For cross-machine memory, add Supabase:
```bash
# 1. Create free Supabase project at supabase.com
# 2. Add to .envrc:
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SECRET_KEY="eyJ..."
export AF_LEARNING_ENABLED="true"

# 3. Run setup script:
./scripts/supabase/setup.sh

# 4. Verify:
learn:status
```

### Commands

| Command | Description |
|---------|-------------|
| `learn:status` | Check learning system status |
| `learn:analyze` | Analyze patterns and generate insights |
| `learn:apply` | Apply learned improvements |

**See:** [aura-frog/docs/LEARNING_SYSTEM.md](aura-frog/docs/LEARNING_SYSTEM.md) for complete setup

---

## Documentation

### Getting Started

| Document | Description |
|----------|-------------|
| [aura-frog/QUICKSTART.md](aura-frog/QUICKSTART.md) | 2-minute quickstart |
| [aura-frog/GET_STARTED.md](aura-frog/GET_STARTED.md) | Complete getting started guide |
| [aura-frog/docs/USAGE_GUIDE.md](aura-frog/docs/USAGE_GUIDE.md) | Best practices & clarifications |

### Core Documentation

| Document | Description |
|----------|-------------|
| [aura-frog/CLAUDE.md](aura-frog/CLAUDE.md) | AI instructions (for Claude) |
| [aura-frog/docs/phases/](aura-frog/docs/phases/) | 9 detailed phase guides |
| [aura-frog/docs/MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) | MCP servers guide |
| [aura-frog/skills/README.md](aura-frog/skills/README.md) | Skills system guide |
| [aura-frog/docs/WORKFLOW_DIAGRAMS.md](aura-frog/docs/WORKFLOW_DIAGRAMS.md) | 10 visual workflow diagrams |
| [aura-frog/docs/AGENT_TEAMS_GUIDE.md](aura-frog/docs/AGENT_TEAMS_GUIDE.md) | Agent Teams guide (NEW) |

### Reference

| Document | Description |
|----------|-------------|
| [aura-frog/commands/README.md](aura-frog/commands/README.md) | 91 commands (6 bundled + 85 individual) |
| [aura-frog/agents/](aura-frog/agents/) | 10 agent definitions |
| [aura-frog/rules/](aura-frog/rules/) | 50 quality rules |
| [aura-frog/scripts/README.md](aura-frog/scripts/README.md) | Utility scripts (integrations, workflows) |
| [aura-frog/docs/LEARNING_SYSTEM.md](aura-frog/docs/LEARNING_SYSTEM.md) | Learning system (local + Supabase) |
| [aura-frog/hooks/README.md](aura-frog/hooks/README.md) | 20 lifecycle hooks |
| [aura-frog/docs/REFACTOR_ANALYSIS.md](aura-frog/docs/REFACTOR_ANALYSIS.md) | Optimization guide |

---

## Architecture

```
aura-frog/                           # Repository root
├── aura-frog/                       # Main plugin directory
│   ├── .mcp.json                    # Bundled MCP servers config
│   ├── agents/                      # 10 specialized agents (consolidated)
│   ├── skills/                      # 53 skills (13 auto + 40 reference)
│   ├── commands/                    # 91 commands (6 bundled + 85 individual)
│   ├── rules/                       # 50 quality rules
│   ├── docs/                        # Comprehensive documentation
│   │   ├── phases/                  # 9 phase guides
│   │   ├── MCP_GUIDE.md             # MCP setup guide
│   │   └── REFACTOR_ANALYSIS.md     # Optimization guide (NEW)
│   ├── hooks/                       # 20 lifecycle hooks (safety, learning, teams)
│   ├── scripts/                     # Utility scripts
│   └── templates/                   # Document templates
├── assets/                          # Logo and images
└── README.md                        # This file
```

### Model Routing (NEW in v1.17.0)

```
Trivial tasks → Haiku (30-50% cost savings)
Standard tasks → Sonnet (default)
Architecture/Security → Opus (when needed)
```

### Rules Priority

```
Project Context > Aura Frog Core Rules > Generic Defaults
```

Your project conventions always win over Aura Frog defaults.

---

## Contributing

Contributions welcome! Here's how you can help:

| Priority | Area | Description |
|----------|------|-------------|
| High | MCP | Add new MCP server integrations |
| High | Agents | Add new specialized agents |
| High | Skills | Create new auto-invoking skills |
| Medium | Commands | Add workflow commands |
| Medium | Docs | Improve documentation |
| Low | Templates | Add document templates |

Submit issues or pull requests to [GitHub](https://github.com/nguyenthienthanh/aura-frog)

---

## License

MIT License — See [LICENSE](LICENSE) for details

---

## Acknowledgments

- **[Claude Code](https://claude.ai)** — AI-powered development platform
- **[duongdev/ccpm](https://github.com/duongdev/ccpm)** — Original inspiration
- **Contributors** — Development and testing

---

<div align="center">

**Code with main character energy!**

[Get Started](aura-frog/GET_STARTED.md) • [Documentation](aura-frog/docs/) • [Report Issue](https://github.com/nguyenthienthanh/aura-frog/issues)

---

*Built with love by [@nguyenthienthanh](https://github.com/nguyenthienthanh)*

</div>
