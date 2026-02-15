<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### The Most Comprehensive Plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Code with main character energy**

Transform Claude Code into a **structured AI development platform** with specialized agents, enforced TDD workflows, real multi-agent orchestration, self-improving learning, and auto model routing.

[![Version](https://img.shields.io/badge/version-1.19.0-blue.svg)](aura-frog/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#-quick-start) | [Why Aura Frog](#-why-aura-frog) | [Features](#-key-features) | [Documentation](#-documentation) | [Contributing](#contributing)

</div>

---

## At a Glance

<div align="center">

| **10 Agents** | **52 Skills** | **91 Commands** | **48 Rules** | **21 Hooks** | **6 MCP Servers** |
|:-:|:-:|:-:|:-:|:-:|:-:|
| Auto-selected | 13 auto-invoke | 6 bundled | TOON-optimized | Lifecycle | Auto-invoked |

</div>

### Standout Features

| Feature | What It Does | Why It Matters |
|---------|-------------|----------------|
| **9-Phase TDD Workflow** | Requirements -> Design -> UI -> Test Plan -> RED -> GREEN -> REFACTOR -> Review -> QA -> Docs | Enforced quality at every step. Only 2 approval gates. |
| **Agent Teams** | Real multi-agent orchestration with persistent teammates, peer messaging, shared tasks | Parallel work, cross-review, 2-3x faster for complex features |
| **Model Routing** | Auto-select Haiku/Sonnet/Opus based on task complexity | 30-50% cost savings on trivial tasks |
| **Fast-Track Mode** | Skip phases 1-3 when specs are ready, auto-execute 4-9 | Zero approval gates for pre-approved specs |
| **Self-Improving Learning** | Auto-detect patterns, corrections, create learned rules | Gets smarter with every session (local or Supabase) |
| **Context-Fork Skills** | Heavy skills run in forked context to protect main window | No context bloat from framework docs or analysis |
| **PreCompact Hook** | Auto-save workflow state before Claude compacts context | Never lose progress on long tasks |
| **6 Bundled MCPs** | Context7, Playwright, Vitest, Firebase, Figma, Slack | Auto-invoke based on context, zero config for most |

---

## Why Aura Frog?

<div align="center">

| Without Aura Frog | With Aura Frog |
|:---|:---|
| Generic AI responses | **10 specialized agents** auto-selected per task |
| No quality enforcement | **TDD enforced** (RED -> GREEN -> REFACTOR) |
| Single AI session | **Agent Teams** with parallel work + cross-review |
| Same model for everything | **Model routing** saves 30-50% on simple tasks |
| Context window fills up | **Context-fork** keeps heavy skills isolated |
| Manual documentation | **Auto-generated** docs, notifications, metrics |
| Ad-hoc integrations | **6 MCP servers** bundled and auto-invoked |
| Starts from scratch each time | **Learning system** remembers your patterns |

</div>

**Result:** Structured development with 60-70% less overhead and consistently higher quality.

---

## Quick Start

### Prerequisites

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** (Anthropic's official CLI)
- **Node.js 18+**

### Install (30 seconds)

```bash
# In Claude Code terminal:
/plugin marketplace add nguyenthienthanh/aura-frog
/plugin install aura-frog@aurafrog
```

### First Workflow

```bash
# Initialize your project (recommended)
project:init

# Start your first workflow
workflow:start "Implement user authentication"
```

At each approval gate, respond with:
- `approve` / `yes` — Continue
- `reject: <reason>` — Redo with feedback
- `modify: <changes>` — Adjust deliverables

**See:** [GET_STARTED.md](aura-frog/GET_STARTED.md) for the full guide

---

## Key Features

### 10 Specialized Agents

Agents auto-activate based on your prompt context. Consolidated from 15 in v1.17.0:

<details>
<summary><b>Development (4)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `architect` | System design, database, backend (Node.js, Python, Laravel, Go) |
| `ui-expert` | Frontend (React, Vue, Angular, Next.js) + design systems |
| `mobile-expert` | React Native, Flutter, Expo, NativeWind |
| `game-developer` | Godot, GDScript, multi-platform export |

</details>

<details>
<summary><b>Quality & Security (2)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `security-expert` | OWASP audits, vulnerability scanning, SAST |
| `qa-automation` | Jest, Cypress, Playwright, Detox, coverage |

</details>

<details>
<summary><b>Infrastructure + System (4)</b></summary>

| Agent | Specialization |
|-------|---------------|
| `devops-cicd` | Docker, K8s, CI/CD, monitoring |
| `project-manager` | Project detection, config, context management |
| `smart-agent-detector` | Intelligent agent + model selection |
| `pm-operations-orchestrator` | Workflow coordination, team lead |

</details>

---

### 9-Phase TDD Workflow

```
  Phase 1: Understand       "What are we building?"           ⚡ Auto
  Phase 2: Design           "How will we build it?"           ✋ APPROVAL
  Phase 3: UI Breakdown     "What does it look like?"         ⚡ Auto
  Phase 4: Plan Tests       "How will we test it?"            ⚡ Auto
  ─────────────────────────────────────────────────────────────────
  Phase 5a: Write Tests     TDD RED - Tests must FAIL         ⚡ Auto
  Phase 5b: Build           TDD GREEN - Tests must PASS       ✋ APPROVAL
  Phase 5c: Polish          TDD REFACTOR - Stay green         ⚡ Auto
  ─────────────────────────────────────────────────────────────────
  Phase 6: Review           Multi-agent code review           ⚡ Auto*
  Phase 7: Verify           QA validation + coverage          ⚡ Auto
  Phase 8: Document         Auto-generate docs                ⚡ Auto
  Phase 9: Share            Team notification                 ⚡ Auto
```

**Only 2 approval gates** (Phase 2 & 5b). All other phases auto-continue.

**Fast-Track Mode:** Have specs ready? `fasttrack: <specs>` skips phases 1-3 and removes all approval gates.

---

### Agent Teams (Experimental)

Real multi-agent orchestration with Claude's Agent Teams feature:

```
 pm-operations-orchestrator (Team Lead)
 ├── architect        System design, backend, DB
 ├── ui-expert        Frontend, design systems
 ├── qa-automation    Testing, quality gates
 └── security-expert  Security review

 Shared task list + peer messaging + cross-review
```

**Complexity gate:** Teams only activate for Deep + multi-domain tasks. Quick/Standard tasks use single-agent mode (saves ~3x tokens).

```json
// Enable in .claude/settings.local.json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

---

### Model Routing

```
Trivial tasks (typo, rename)    → Haiku    (30-50% savings)
Standard tasks (feature, bugfix) → Sonnet   (default)
Architecture / Security audit    → Opus     (when needed)
```

Auto-selected by the `model-router` skill based on task complexity analysis.

---

### 52 Skills (13 Auto-Invoke + 39 Reference)

Skills activate automatically based on message context:

```
User: "Implement user profile screen"
       ↓
1. agent-detector         → Selects mobile-expert
2. model-router           → Picks Sonnet (standard task)
3. project-context-loader → Loads your conventions
4. workflow-orchestrator   → Executes 9-phase workflow
```

**v1.19.0:** Heavy skills (`framework-expert`, `seo-bundle`, `testing-patterns`, `learning-analyzer`) now run with `context: fork` to protect main context window.

---

### 6 MCP Servers

Auto-invoke based on context — zero config for most:

| MCP | Purpose | Triggers | Setup |
|-----|---------|----------|-------|
| **context7** | Library docs | "Build with MUI", library names | None |
| **playwright** | E2E testing | "Test the login page" | None |
| **vitest** | Unit tests | "Run tests", "Check coverage" | None |
| **firebase** | Firebase services | "Set up Firestore" | `firebase login` |
| **figma** | Design extraction | Figma URLs | `FIGMA_API_TOKEN` |
| **slack** | Notifications | Phase 9 completion | `SLACK_BOT_TOKEN` |

---

### 21 Lifecycle Hooks

| Hook Type | Count | Purpose |
|-----------|-------|---------|
| SessionStart | 5 | Env loading, visual init, memory, workflow resume |
| PreToolUse | 4 | Safety guards, destructive command blocking, secrets detection |
| PostToolUse | 5 | Command logging, learning, lint autofix |
| UserPromptSubmit | 2 | Prompt reminders, auto-learning |
| SubagentStart | 1 | Context injection for subagents |
| TeammateIdle | 1 | Auto-assign idle teammates to cross-review |
| TaskCompleted | 1 | Validate task output quality |
| Stop | 2 | Workflow state save, session metrics |
| **PreCompact** | 1 | **NEW:** Save state before auto-compact |

---

### Learning System

Self-improvement through pattern detection — works out of the box with local storage:

```
.claude/learning/
├── feedback.json      # All feedback entries
├── patterns.json      # Learned patterns
├── metrics.json       # Workflow metrics
└── learned-rules.md   # Human-readable rules
```

Optionally syncs to **Supabase** for cross-machine memory.

---

## Workflow Modes

| Mode | Command | Best For |
|------|---------|----------|
| **Full 9-Phase** | `workflow:start "task"` | New features, production code |
| **Fast-Track** | `fasttrack: <specs>` | Pre-approved specs, no approval gates |
| **Quick Bug Fix** | `bugfix:quick "fix"` | Small TDD bug fixes |
| **Refactor** | `refactor "file"` | Code refactoring |
| **Planning** | `planning "feature"` | Create execution plan |

---

## Commands (91 total, 6 bundled)

| Bundled | Subcommands | Replaces |
|---------|-------------|----------|
| `/workflow` | start, status, approve, reject, handoff, resume | 22 commands |
| `/test` | unit, e2e, coverage, watch, docs | 4 commands |
| `/project` | status, refresh, init, switch, list, config | 7 commands |
| `/quality` | lint, complexity, review, fix | 3 commands |
| `/bugfix` | quick, full, hotfix | 3 commands |
| `/seo` | check, schema, geo | 3 commands |

---

## Architecture

```
aura-frog/
├── .claude-plugin/        plugin.json (manifest + capabilities)
├── agents/                10 specialized agents
├── skills/                52 skills (13 auto + 39 reference)
├── commands/              91 commands (6 bundled + 85 individual)
├── rules/                 48 quality rules (TOON-optimized)
├── hooks/                 21 lifecycle hooks
├── docs/                  Phase guides, MCP guide, team guide
├── scripts/               Utility scripts (integrations, workflows)
├── templates/             Document templates
├── .mcp.json              6 bundled MCP servers
├── CLAUDE.md              AI instructions (for Claude)
└── GET_STARTED.md         Getting started guide
```

---

## What's New in v1.19.0

| Change | Impact |
|--------|--------|
| Banner rule optimized (19KB -> 5KB) | ~70% less tokens per session |
| YAGNI+DRY+KISS consolidated into 1 rule | 3 verbose rules -> 1 compact TOON rule |
| Workflow-fasttrack merged into orchestrator | Simpler skill tree, one entry point |
| Approval gates doc slimmed (558 -> 96 lines) | 83% reduction, points to orchestrator |
| PreCompact hook added | Never lose workflow state on compaction |
| `context: fork` for heavy skills | Protect main context from bloat |
| New plugin.json fields | `engines`, `capabilities`, `stats` |
| Deprecated code cleaned | Removed legacy cache functions |

---

## Documentation

| Document | Description |
|----------|-------------|
| [GET_STARTED.md](aura-frog/GET_STARTED.md) | Complete getting started guide |
| [CLAUDE.md](aura-frog/CLAUDE.md) | AI instructions (read by Claude) |
| [docs/phases/](aura-frog/docs/phases/) | 9 detailed phase guides |
| [docs/MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) | MCP servers setup |
| [docs/AGENT_TEAMS_GUIDE.md](aura-frog/docs/AGENT_TEAMS_GUIDE.md) | Agent Teams guide |
| [docs/BANNER_EXAMPLES.md](aura-frog/docs/BANNER_EXAMPLES.md) | Banner format examples |
| [skills/README.md](aura-frog/skills/README.md) | 52 skills reference |
| [commands/README.md](aura-frog/commands/README.md) | 91 commands reference |
| [rules/README.md](aura-frog/rules/README.md) | 48 quality rules |
| [hooks/README.md](aura-frog/hooks/README.md) | 21 lifecycle hooks |

---

## Community Comparison

| Feature | Aura Frog | Superpowers | CCPM | The Deep Trilogy |
|---------|:---------:|:-----------:|:----:|:----------------:|
| Specialized agents | 10 | - | - | 3 modes |
| Skills (auto-invoke) | 13 | 3 | - | - |
| TDD workflow | 9-phase | - | - | - |
| Agent Teams | Yes | - | - | - |
| Model routing | Yes | - | - | - |
| MCP servers | 6 bundled | - | - | - |
| Learning system | Yes | - | - | - |
| Lifecycle hooks | 21 | - | - | - |
| Context optimization | TOON + fork | - | - | - |
| Game development | Godot agent | - | - | - |

---

## Contributing

| Priority | Area | Description |
|----------|------|-------------|
| High | MCP | Add new MCP server integrations |
| High | Agents | Add new specialized agents |
| High | Skills | Create new auto-invoking skills |
| Medium | Commands | Add workflow commands |
| Medium | Docs | Improve documentation |
| Low | Templates | Add document templates |

Submit issues or PRs to [GitHub](https://github.com/nguyenthienthanh/aura-frog)

---

## License

MIT License — See [LICENSE](LICENSE) for details

---

## Acknowledgments

- **[Claude Code](https://claude.ai)** — AI-powered development platform by Anthropic
- **[duongdev/ccpm](https://github.com/duongdev/ccpm)** — Original inspiration
- **Contributors** — Development and testing

---

<div align="center">

**Code with main character energy!**

[Get Started](aura-frog/GET_STARTED.md) | [Documentation](aura-frog/docs/) | [Report Issue](https://github.com/nguyenthienthanh/aura-frog/issues)

---

*Built with love by [@nguyenthienthanh](https://github.com/nguyenthienthanh)*

</div>
