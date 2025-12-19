<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### A Plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Code with main character energy**

AI-powered development plugin for **Claude Code** with 14 specialized agents, 9-phase TDD workflow, and bundled MCP servers.

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](aura-frog/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#-quick-start) • [Features](#-key-features) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## At a Glance

<div align="center">

| **Agents** | **Skills** | **Rules** | **Phases** | **Commands** | **MCP Servers** |
|:----------:|:----------:|:---------:|:----------:|:------------:|:---------------:|
| **14** | **35** | **39** | **9** | **70+** | **6** |

</div>

**What's Inside:**
- **14 Specialized Agents** — Mobile, Web, Backend, QA, Security, DevOps experts
- **35 Skills** — 22 auto-invoking + 13 reference skills for specialized tasks
- **6 Bundled MCP Servers** — Context7, Playwright, Vitest, Atlassian, Figma, Slack
- **39 Quality Rules** — System, code quality, architecture, workflow, documentation
- **9-Phase Workflow** — From requirements to deployment with quality gates
- **70+ Commands** — Full workflow control at your fingertips
- **Multi-Model Support** — Use Gemini, OpenAI, DeepSeek per phase

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

**See:** [aura-frog/GET_STARTED.md](aura-frog/GET_STARTED.md) for complete guide

---

## Overview

**Aura Frog** is a plugin for **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** (Anthropic's official CLI for Claude) that transforms it into a **structured development platform** with specialized agents, enforced TDD, and quality gates at every step.

> **What is Claude Code?** Claude Code is Anthropic's agentic coding tool that operates in your terminal, understands your codebase, and helps you code faster through natural conversation. Aura Frog extends Claude Code with structured workflows and specialized agents.

### Why Aura Frog?

| Traditional Development | With Aura Frog |
|------------------------|----------------|
| Manual task management | AI-powered 9-phase workflow |
| Generic AI responses | 14 specialized agents auto-selected |
| Testing as afterthought | TDD enforced (RED → GREEN → REFACTOR) |
| Ad-hoc code review | Multi-agent cross-review built-in |
| Context switching | CLI-first with 70 commands |
| Manual documentation | Auto-generated docs |
| Manual integrations | Bundled MCP servers (JIRA, Figma, Slack) |

**Result:** 60-70% reduction in PM overhead while improving code quality.

---

## Key Features

### 14 Specialized Agents

Agents auto-activate based on your prompt context:

<details>
<summary><b>Expert Agents (3)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `backend-expert` | Node.js, Python, Laravel, Go — Express, Django, FastAPI, Gin |
| `web-expert` | React, Vue, Angular, Next.js — SSR, SSG, state management |
| `mobile-expert` | React Native, Flutter — Expo, cross-platform, NativeWind |

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
<summary><b>Operations (3)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `devops-cicd` | Docker, K8s, CI/CD, monitoring |
| `database-specialist` | Schema design, query optimization |
| `voice-operations` | ElevenLabs AI narration |

</details>

<details>
<summary><b>Infrastructure (5)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `smart-agent-detector` | Intelligent agent selection |
| `pm-operations-orchestrator` | Workflow coordination |
| `project-detector` | Auto-detect project type |
| `project-config-loader` | Load configurations |
| `project-context-manager` | Context persistence |

</details>

---

### 6 Bundled MCP Servers

MCP (Model Context Protocol) servers auto-invoke based on context — no setup required:

| MCP Server | Purpose | Auto-Triggers |
|------------|---------|---------------|
| **context7** | Library documentation | "Build with MUI", "Tailwind", library names |
| **playwright** | Browser automation, E2E | "Test the login page", browser automation |
| **vitest** | Test execution, coverage | "Run tests", "Check coverage" |
| **atlassian** | JIRA + Confluence | Ticket IDs (PROJ-123) |
| **figma** | Design file fetching | Figma URLs |
| **slack** | Notifications | Phase 9 completion |

```bash
# Context7 auto-fetches React docs
"Build a form with Material UI"

# Atlassian MCP auto-fetches ticket
"Implement PROJ-1234"

# Playwright runs E2E test
"Test the checkout flow in browser"
```

**See:** [aura-frog/docs/MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) for setup and creating custom MCP servers

---

### 35 Skills (22 Auto-Invoking + 13 Reference)

Skills activate automatically based on your message context — no commands needed:

```
User: "Implement user profile from PROJ-1234"
         ↓
Auto-invokes:
  1. agent-detector      → Selects mobile-expert agent
  2. atlassian MCP       → Fetches PROJ-1234 requirements
  3. project-context-loader → Loads your conventions
  4. workflow-orchestrator  → Executes 9-phase workflow
```

| Skill | Triggers | Purpose |
|-------|----------|---------|
| `agent-detector` | **Every message** | Select appropriate agent |
| `workflow-orchestrator` | "implement", "build", "create" | Execute 9-phase workflow |
| `project-context-loader` | Before code generation | Load project conventions |
| `session-continuation` | Token limit (150K+) | Workflow state & handoff |
| `bugfix-quick` | "fix", "error", "broken" | Fast TDD bug fixes |
| `test-writer` | "add tests", "coverage" | Generate comprehensive tests |
| `code-reviewer` | After implementation | Multi-agent quality review |
| `lazy-agent-loader` | Agent loading | 94% token savings on agent defs |
| `response-analyzer` | Large outputs | Save verbose output to temp |
| `state-persistence` | Session handoff | File-based state management |

**Expert Skills:** typescript-expert, react-expert, vue-expert, nextjs-expert, nodejs-expert, python-expert, laravel-expert, go-expert, flutter-expert, angular-expert, react-native-expert

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

**Quality Gates:** Human approval required after every phase — no auto-progression!

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

### 39 Quality Rules

Aura Frog enforces consistent quality through comprehensive rules:

<details>
<summary><b>System & Session Rules (8)</b></summary>

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

</details>

<details>
<summary><b>Code Quality Rules (9)</b></summary>

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
| `prefer-established-libraries` | Use lodash/es-toolkit over custom utils |

</details>

<details>
<summary><b>Workflow Rules (10)</b></summary>

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

</details>

**See:** [aura-frog/rules/](aura-frog/rules/) for all rule definitions

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

**See:** [aura-frog/commands/README.md](aura-frog/commands/README.md) for all 70+ commands

---

## MCP Integrations

Aura Frog bundles 6 MCP servers that auto-invoke based on context:

| MCP | Purpose | Setup Required |
|-----|---------|----------------|
| **context7** | Library docs (React, MUI, Tailwind) | None (public) |
| **playwright** | E2E browser testing | `npx playwright install` |
| **vitest** | Unit test execution | Project with vitest |
| **atlassian** | JIRA + Confluence | `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |
| **figma** | Design extraction | `FIGMA_API_TOKEN` |
| **slack** | Team notifications | `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` |

### Environment Setup

Copy `.envrc.template` and set your tokens:

```bash
# Atlassian (JIRA + Confluence)
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"

# Figma
export FIGMA_API_TOKEN="your-figma-token"

# Slack
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_CHANNEL_ID="C0123456789"
```

**See:** [aura-frog/docs/MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) for complete setup and custom MCP creation

---

## Documentation

### Getting Started

| Document | Description |
|----------|-------------|
| [aura-frog/GET_STARTED.md](aura-frog/GET_STARTED.md) | Quick start guide (5 minutes) |
| [aura-frog/docs/PLUGIN_INSTALLATION.md](aura-frog/docs/PLUGIN_INSTALLATION.md) | Official installation guide |
| [aura-frog/TESTING_GUIDE.md](aura-frog/TESTING_GUIDE.md) | Testing workflows |

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
| [aura-frog/commands/README.md](aura-frog/commands/README.md) | All 70 commands |
| [aura-frog/agents/](aura-frog/agents/) | All agent definitions |
| [aura-frog/rules/](aura-frog/rules/) | Core quality rules |

---

## Architecture

```
aura-frog/                           # Repository root
├── aura-frog/                       # Main plugin directory
│   ├── .mcp.json                    # Bundled MCP servers config
│   ├── agents/                      # 14 specialized agents
│   ├── skills/                      # 35 skills (22 auto + 13 reference)
│   ├── commands/                    # 70+ workflow commands
│   ├── rules/                       # 39 quality rules
│   ├── docs/                        # Comprehensive documentation
│   │   ├── phases/                  # 9 phase guides
│   │   ├── MCP_GUIDE.md             # MCP setup & custom servers
│   │   └── WORKFLOW_DIAGRAMS.md     # 10 Mermaid diagrams
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
