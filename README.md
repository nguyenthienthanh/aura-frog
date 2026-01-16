<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### A Plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Code with main character energy**

AI-powered development plugin for **Claude Code** with 15 specialized agents, 9-phase TDD workflow, self-improving learning system, and bundled MCP servers.

[![Version](https://img.shields.io/badge/version-1.15.0-blue.svg)](aura-frog/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#quick-start) | [Features](#key-features) | [Documentation](#documentation) | [Contributing](#contributing)

</div>

---

## At a Glance

<div align="center">

| **Agents** | **Skills** | **Rules** | **Phases** | **Commands** | **MCP Servers** |
|:----------:|:----------:|:---------:|:----------:|:------------:|:---------------:|
| **15** | **48** | **49** | **9** | **82** | **6** |

</div>

**What's Inside:**
- **15 Specialized Agents** — Mobile, Web, Backend, QA, Security, DevOps, Game Dev experts
- **48 Skills** — 28 auto-invoking + 20 reference/command skills for specialized tasks
- **6 Bundled MCP Servers** — Context7, Playwright, Vitest, Firebase + 2 optional (Figma, Slack)
- **49 Quality Rules** — System, code quality, architecture, workflow, documentation
- **9-Phase Workflow** — From requirements to deployment with quality gates
- **82 Commands** — Full workflow control at your fingertips
- **Learning System** — Self-improvement via Supabase (NEW)

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
| Generic AI responses | 15 specialized agents auto-selected |
| Testing as afterthought | TDD enforced (RED → GREEN → REFACTOR) |
| Ad-hoc code review | Multi-agent cross-review built-in |
| Context switching | CLI-first with 82 commands |
| Manual documentation | Auto-generated docs |
| Manual integrations | Bundled MCP servers (Figma, Slack, etc.) |

**Result:** 60-70% reduction in PM overhead while improving code quality.

---

## Key Features

### 15 Specialized Agents

Agents auto-activate based on your prompt context:

<details>
<summary><b>Development (4)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `backend-expert` | Node.js, Python, Laravel, Go — Express, Django, FastAPI, Gin |
| `web-expert` | React, Vue, Angular, Next.js — SSR, SSG, state management |
| `mobile-expert` | React Native, Flutter — Expo, cross-platform, NativeWind |
| `game-developer` | Godot game development, multi-platform export |

</details>

<details>
<summary><b>Quality & Security (3)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `security-expert` | OWASP audits, vulnerability scanning |
| `qa-automation` | Jest, Cypress, Detox, testing strategies |
| `ui-designer` | UI/UX, Figma integration, accessibility |

</details>

<details>
<summary><b>Infrastructure (3)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `devops-cicd` | Docker, K8s, CI/CD, monitoring |
| `database-specialist` | Schema design, query optimization |
| `voice-operations` | ElevenLabs AI narration |

</details>

<details>
<summary><b>System (5)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `smart-agent-detector` | Intelligent agent selection |
| `pm-operations-orchestrator` | Workflow coordination |
| `project-detector` | Auto-detect project type |
| `project-config-loader` | Load configurations |
| `project-context-manager` | Context persistence |

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

### 48 Skills (28 Auto-Invoking + 20 Reference/Command)

Skills activate automatically based on your message context:

```
User: "Implement user profile screen"
         ↓
Auto-invokes:
  1. agent-detector         → Selects mobile-expert agent
  2. project-context-loader → Loads your conventions
  3. workflow-orchestrator  → Executes 9-phase workflow
```

| Skill | Triggers | Purpose |
|-------|----------|---------|
| `agent-detector` | **Every message** | Select appropriate agent |
| `workflow-orchestrator` | "implement", "build", "create" | Execute 9-phase workflow |
| `workflow-fasttrack` | Pre-approved specs | Skip phases 1-3, auto-execute |
| `project-context-loader` | Before code generation | Load project conventions |
| `bugfix-quick` | "fix", "error", "broken" | Fast TDD bug fixes |
| `test-writer` | "add tests", "coverage" | Generate comprehensive tests |
| `code-reviewer` | After implementation | Multi-agent quality review |
| `learning-analyzer` | Pattern analysis | Analyze feedback patterns (NEW) |
| `self-improve` | Apply learnings | Apply learned improvements (NEW) |

**Expert Skills:** typescript, react, react-native, vue, nextjs, nodejs, python, laravel, go, flutter, angular, godot

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

### 49 Quality Rules

Aura Frog enforces consistent quality through comprehensive rules:

<details>
<summary><b>System Rules (9)</b></summary>

| Rule | Purpose |
|------|---------|
| `agent-identification-banner` | Show agent banner every response |
| `env-loading` | Load .envrc at session start |
| `execution-rules` | ALWAYS/NEVER execution rules |
| `priority-hierarchy` | Config priority order |
| `dual-file-architecture` | Plugin + project structure |
| `token-time-awareness` | Monitor token usage |
| `project-linting-precedence` | Merge project + Aura Frog rules |
| `codebase-consistency` | Learn patterns before writing code |
| `mcp-response-logging` | Save MCP responses to logs |

</details>

<details>
<summary><b>Code Quality Rules (10)</b></summary>

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

</details>

<details>
<summary><b>Workflow Rules (11)</b></summary>

| Rule | Purpose |
|------|---------|
| `tdd-workflow` | RED → GREEN → REFACTOR |
| `cross-review-workflow` | Multi-agent review |
| `approval-gates` | Human approval required |
| `git-workflow` | Commit conventions |
| `safety-rules` | Security guidelines |
| `next-step-guidance` | Always show next steps |
| `workflow-navigation` | Progress tracking |
| `feedback-brainstorming` | Brainstorm before feedback |
| `impact-analysis` | Analyze usages before modifying |
| `workflow-deliverables` | Verify all phase docs created |
| `verification` | Fresh verification before done |

</details>

**See:** [aura-frog/rules/](aura-frog/rules/) for all rule definitions

---

### Learning System (NEW in 1.9.0)

Aura Frog can now learn and improve over time via Supabase:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Collect Data   │ →   │ Analyze Patterns │ →   │ Apply Learnings │
│  (feedback,     │     │  (success/fail   │     │  (auto-improve  │
│   metrics)      │     │   patterns)      │     │   plugin)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Command | Description |
|---------|-------------|
| `learn:status` | Show learning system status |
| `learn:analyze` | Run pattern analysis |
| `learn:apply` | Apply learned improvements |

**Features:**
- Feedback collection (corrections, approvals, rejections)
- Workflow metrics tracking
- Agent performance monitoring
- Pattern recognition and insights

**See:** [aura-frog/docs/LEARNING_SYSTEM.md](aura-frog/docs/LEARNING_SYSTEM.md) for setup

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

## Commands Reference

<details>
<summary><b>Workflow Commands</b></summary>

| Command | Description |
|---------|-------------|
| `workflow:start <task>` | Start full 9-phase workflow |
| `workflow:status` | Show current progress |
| `workflow:approve` | Approve current phase |
| `workflow:reject <reason>` | Reject and restart phase |
| `workflow:handoff` | Save for session continuation |
| `workflow:resume [id]` | Resume saved workflow |

</details>

<details>
<summary><b>Quick Commands</b></summary>

| Command | Description |
|---------|-------------|
| `bugfix:quick <desc>` | Quick bug fix with TDD |
| `bugfix:hotfix <desc>` | Emergency hotfix |
| `refactor <file>` | Code refactoring |
| `planning <task>` | Create execution plan |
| `document <feature>` | Generate documentation |

</details>

<details>
<summary><b>Testing Commands</b></summary>

| Command | Description |
|---------|-------------|
| `test:unit <file>` | Generate unit tests |
| `test:e2e <flow>` | Generate E2E tests |
| `test:coverage` | Check coverage |

</details>

<details>
<summary><b>Project Commands</b></summary>

| Command | Description |
|---------|-------------|
| `project:init` | Initialize Aura Frog for project |
| `project:detect` | Auto-detect project type |
| `project:regen` | Re-generate context |
| `project:reload-env` | Load/reload .envrc variables |
| `agent:list` | Show all agents |
| `agent:info <name>` | Show agent details |

</details>

**See:** [aura-frog/commands/README.md](aura-frog/commands/README.md) for all 82 commands

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

## Learning System (Supabase)

Aura Frog can **learn and improve** over time using Supabase as a persistent memory store.

### What It Does

| Feature | Description |
|---------|-------------|
| **Auto-Collect Feedback** | Captures corrections, approvals, rejections |
| **Pattern Analysis** | Identifies what works and what doesn't |
| **Memory Across Sessions** | Remembers patterns for future sessions |
| **Self-Improvement** | Applies insights to improve responses |

### Quick Setup

```bash
# 1. Create free Supabase project at supabase.com
# 2. Add to .envrc:
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="eyJ..."
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

**Optional feature** - Aura Frog works fine without Supabase.

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

### Reference

| Document | Description |
|----------|-------------|
| [aura-frog/commands/README.md](aura-frog/commands/README.md) | All 82 commands |
| [aura-frog/agents/](aura-frog/agents/) | All agent definitions |
| [aura-frog/rules/](aura-frog/rules/) | Core quality rules |
| [aura-frog/scripts/README.md](aura-frog/scripts/README.md) | Utility scripts (integrations, workflows) |
| [aura-frog/docs/LEARNING_SYSTEM.md](aura-frog/docs/LEARNING_SYSTEM.md) | Supabase learning system |

---

## Architecture

```
aura-frog/                           # Repository root
├── aura-frog/                       # Main plugin directory
│   ├── .mcp.json                    # Bundled MCP servers config
│   ├── agents/                      # 15 specialized agents
│   ├── skills/                      # 48 skills (28 auto + 20 reference)
│   ├── commands/                    # 82 workflow commands
│   ├── rules/                       # 49 quality rules
│   ├── docs/                        # Comprehensive documentation
│   │   ├── phases/                  # 9 phase guides
│   │   └── MCP_GUIDE.md             # MCP setup guide
│   ├── hooks/                       # Lifecycle hooks
│   ├── scripts/                     # Utility scripts
│   └── templates/                   # Document templates
├── assets/                          # Logo and images
└── README.md                        # This file
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
