<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### Stop prompting. Start shipping.

The most powerful plugin for **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — turns your AI into a structured development team with agents, TDD workflows, and real multi-agent orchestration.

[![Version](https://img.shields.io/badge/version-1.22.0-blue.svg)](aura-frog/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**[Install in 30 seconds](#-install)** | **[See it in action](#-see-it-in-action)** | **[Why Aura Frog?](#-the-problem)**

</div>

---

## The Problem

You open Claude Code. You type a prompt. Claude writes code. You hope it works.

**No structure. No tests. No quality gates. No memory between sessions.**

Every session starts from scratch. Every complex feature turns into prompt spaghetti. You're the project manager, QA lead, and architect — all while trying to code.

## The Solution

Aura Frog gives Claude Code **structure, memory, and a team.**

```
You: "Implement user authentication with JWT"

Aura Frog:
  1. Analyzes requirements, challenges assumptions     ← Phase 1: Understand
  2. Writes failing tests first                        ← Phase 2: Test RED
  3. Implements code to pass tests                     ← Phase 3: Build GREEN
  4. Refactors + security review                       ← Phase 4: Review
  5. Docs, notifications, done                         ← Phase 5: Finalize
```

**You approve twice. Aura Frog handles the rest.**

---

## Install

```bash
# In Claude Code terminal (takes 30 seconds):
/plugin marketplace add nguyenthienthanh/aura-frog
/plugin install aura-frog@aurafrog
```

That's it. Start your first workflow:

```bash
workflow:start "Your task here"
```

---

## See It In Action

### Before Aura Frog
```
You: "Add user authentication"
Claude: *writes 500 lines of untested code*
You: "Wait, that's not what I—"
Claude: *rewrites everything from scratch*
```

### After Aura Frog
```
You: "Add user authentication"

🐸 Phase 1: "Here's my understanding. You said JWT — did you consider OAuth2?
   Here are the trade-offs. 3 API endpoints needed. Approve?"

You: "approve"

🐸 Phase 2: "5 tests written. All RED (failing). Ready to implement."

🐸 Phase 3: "All 5 tests GREEN. Auth middleware + routes implemented.
   Review the code?"

You: "approve"

🐸 Phase 4-5: "Refactored. Security review passed. Docs generated. Done."
```

**Result:** Production-ready code with tests, documentation, and a security review — from a single prompt.

---

## What You Get

<div align="center">

| | Without Aura Frog | With Aura Frog |
|---|:---|:---|
| **Quality** | Hope and pray | TDD enforced (RED → GREEN → REFACTOR) |
| **Agents** | One generic AI | **10 specialists** auto-selected per task |
| **Cost** | Opus for everything | **Model routing** saves 30-50% |
| **Context** | Re-explain every session | **Deep Project Init** remembers everything |
| **Teams** | One agent at a time | **Multi-agent orchestration** with cross-review |
| **Integrations** | Copy-paste from docs | **6 MCP servers** auto-invoked |

</div>

---

## The Numbers

<div align="center">

| 10 Agents | 52 Skills | 86 Commands | 49 Rules | 27 Hooks | 6 MCPs |
|:-:|:-:|:-:|:-:|:-:|:-:|
| Auto-selected per task | 13 auto-invoke | 6 bundled menus | Quality enforcement | Lifecycle automation | Zero-config |

</div>

---

## Key Features

### Structured TDD Workflow

Every feature goes through 5 phases. Only 2 require your approval:

```
  ✋ Phase 1: Understand + Design    → You approve the plan
  ⚡ Phase 2: Test RED               → Tests written automatically
  ✋ Phase 3: Build GREEN            → You approve the implementation
  ⚡ Phase 4: Refactor + Review      → Auto quality check
  ⚡ Phase 5: Finalize               → Docs + notifications
```

**Fast-Track Mode:** Already have specs? Skip Phase 1 entirely.

### 10 Specialized Agents

Claude stops being a generalist. The right expert activates for every task:

```
"Build a React dashboard"     → ui-expert activates
"Optimize the SQL queries"    → architect activates
"Set up CI/CD pipeline"       → devops-cicd activates
"Fix the login screen crash"  → mobile-expert activates
"Run a security audit"        → security-expert activates
```

<details>
<summary>See all 10 agents</summary>

| Agent | Specialization |
|-------|---------------|
| `architect` | System design, database, backend (Node.js, Python, Laravel, Go) |
| `ui-expert` | Frontend (React, Vue, Angular, Next.js) + design systems |
| `mobile-expert` | React Native, Flutter, Expo, NativeWind |
| `game-developer` | Godot, GDScript, multi-platform export |
| `security-expert` | OWASP audits, vulnerability scanning, SAST |
| `qa-automation` | Jest, Cypress, Playwright, Detox, coverage |
| `devops-cicd` | Docker, K8s, CI/CD, monitoring |
| `project-manager` | Project detection, config, context |
| `smart-agent-detector` | Intelligent agent + model selection |
| `pm-operations-orchestrator` | Workflow coordination, team lead |

</details>

### Model Routing (Save 30-50%)

Stop paying Opus prices for typo fixes:

```
"Fix this typo"              → Haiku   (cheapest)
"Add pagination to the API"  → Sonnet  (balanced)
"Design the auth system"     → Opus    (most capable)
```

Automatic. No configuration needed.

### Agent Teams

For complex features, Aura Frog spins up a real team:

```
pm-operations-orchestrator (Lead)
├── architect          → Designs the system
├── ui-expert          → Builds the frontend
├── qa-automation      → Writes tests
└── security-expert    → Reviews for vulnerabilities

All working in parallel. Cross-reviewing each other's work.
```

**Complexity gate:** Only activates for tasks that actually need it. Simple tasks stay single-agent (saves ~3x tokens).

### Deep Project Init

Run once. Every future session instantly understands your codebase:

```bash
project:init
```

Generates 7 context files:
- **Repo map** — annotated directory tree
- **File registry** — key files with roles & relationships
- **Architecture analysis** — patterns, dependencies, data flow
- **Conventions** — your coding style, patterns, idioms
- **12 pattern detections** — imports, state management, API style, and more

**Result:** 95% fewer tokens wasted on re-scanning. New sessions start working immediately.

### 6 MCP Servers (Zero Config)

Library docs, E2E testing, unit tests, Firebase, Figma designs, Slack notifications — all auto-invoked when Claude needs them.

```
"Build with MUI"          → context7 fetches MUI docs
"Test the login page"     → playwright launches browser
"Check test coverage"     → vitest runs your tests
"Deploy to Firebase"      → firebase manages your project
```

### Self-Improving Learning

Aura Frog learns from every session:

- Detects your patterns and preferences
- Remembers corrections ("don't mock the database")
- Creates learned rules that persist across sessions
- Optional Supabase sync for cross-machine memory

---

## Workflow Modes

| Mode | Command | When to Use |
|------|---------|-------------|
| **Full Workflow** | `workflow:start "task"` | New features, production code |
| **Fast-Track** | `fasttrack: <specs>` | Pre-approved specs |
| **Quick Fix** | `bugfix:quick "fix"` | Small bug fixes with TDD |
| **Refactor** | `refactor "file"` | Code refactoring |

---

## Documentation

| | Link |
|---|---|
| **Getting Started** | [GET_STARTED.md](aura-frog/GET_STARTED.md) |
| **All Commands (86)** | [commands/README.md](aura-frog/commands/README.md) |
| **All Skills (52)** | [skills/README.md](aura-frog/skills/README.md) |
| **Agent Teams** | [AGENT_TEAMS_GUIDE.md](aura-frog/docs/AGENT_TEAMS_GUIDE.md) |
| **MCP Setup** | [MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) |
| **Lifecycle Hooks** | [hooks/README.md](aura-frog/hooks/README.md) |
| **Changelog** | [CHANGELOG.md](aura-frog/CHANGELOG.md) |

---

## Architecture

```
aura-frog/
├── agents/         10 specialized agents (auto-selected)
├── skills/         52 skills (13 auto-invoke + 39 reference)
├── commands/       86 commands (6 bundled menus)
├── rules/          49 quality rules (TOON-optimized)
├── hooks/          27 lifecycle hooks
├── scripts/        37 utility scripts
├── templates/      Document templates
├── docs/           Guides & references
└── .mcp.json       6 bundled MCP servers
```

---

## Contributing

We welcome contributions! The highest-impact areas:

- **New MCP integrations** — connect more tools
- **New agents** — add domain expertise
- **New skills** — extend capabilities
- **Bug fixes & docs** — always appreciated

See [CONTRIBUTING.md](CONTRIBUTING.md) or submit an issue.

---

## License

MIT License — See [LICENSE](LICENSE)

---

<div align="center">

![Aura Frog](assets/logo/mascot_coding_scene.png)

### Code with main character energy.

**[Install Now](#-install)** | **[Documentation](aura-frog/GET_STARTED.md)** | **[Report Issue](https://github.com/nguyenthienthanh/aura-frog/issues)**

*Built by [@nguyenthienthanh](https://github.com/nguyenthienthanh)*

</div>
