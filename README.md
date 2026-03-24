<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### Stop prompting. Start shipping.

The most powerful plugin for **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — turns your AI into a structured development team with agents, TDD workflows, and real multi-agent orchestration.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](aura-frog/CHANGELOG.md)
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
| **Planning** | One perspective, hope for the best | **3 agents debate** your plan before building |
| **Teams** | One agent at a time | **Multi-agent orchestration** with cross-review |
| **Integrations** | Copy-paste from docs | **6 MCP servers** auto-invoked |

</div>

---

## The Numbers

<div align="center">

| 10 Agents | 43 Skills | 86 Commands | 45 Rules | 24 Hooks | 6 MCPs |
|:-:|:-:|:-:|:-:|:-:|:-:|
| Auto-selected per task | 8 auto-invoke | 5 bundled menus | Quality enforcement | Lifecycle automation | Zero-config |

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
"Build a React dashboard"     → frontend activates
"Optimize the SQL queries"    → architect activates
"Set up CI/CD pipeline"       → devops activates
"Fix the login screen crash"  → mobile activates
"Run a security audit"        → security activates
```

<details>
<summary>See all 10 agents</summary>

| Agent | Specialization |
|-------|---------------|
| `architect` | System design, database, backend (Node.js, Python, Laravel, Go) |
| `frontend` | Frontend (React, Vue, Angular, Next.js) + design systems |
| `mobile` | React Native, Flutter, Expo, NativeWind |
| `strategist` | Business strategy, ROI evaluation, MVP scoping |
| `security` | OWASP audits, vulnerability scanning, SAST |
| `tester` | Jest, Cypress, Playwright, Detox, coverage |
| `devops` | Docker, K8s, CI/CD, monitoring |
| `scanner` | Project detection, config, context |
| `router` | Intelligent agent + model selection |
| `lead` | Workflow coordination, team lead |

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
lead (Lead)
├── architect          → Designs the system
├── frontend          → Builds the frontend
├── tester      → Writes tests
└── security    → Reviews for vulnerabilities

All working in parallel. Cross-reviewing each other's work.
```

**Complexity gate:** Only activates for tasks that actually need it. Simple tasks stay single-agent (saves ~3x tokens).

### Collaborative Planning (Deep Tasks)

For complex tasks, Phase 1 doesn't just analyze — it **debates**.

```
Round 1: Four agents independently analyze the same task
         📐 Architect (Builder)    — "How to build it"
         🔍 Tester (Breaker)      — "How it can fail"
         👤 Frontend (User)       — "How it's experienced"
         💼 Strategist (Why)      — "Should we even build this?"

Round 2: Each reviews the other three — flags disagreements + gaps
         architect:   "JWT with refresh tokens, monolith architecture"
         tester:      "Nobody addressed rate limiting or token rotation"
         frontend:    "Users expect social login, not just email"
         strategist:  "Start with email-only MVP. Social login Phase 2."

Round 3: Simulate real scenarios against the proposed plan
         ✅ Happy path signup        — all 4 handle it
         ❌ Brute force login        — nobody addressed it → added
         💼 Low signup conversion    — strategist added tracking

Round 4: Lead converges on the optimal plan
         Scope reduced 40% (strategist challenged). Risks documented.
         Plan is battle-tested before a single line of code.
```

**Result:** Plans that survive scrutiny from 4 perspectives — including "should we build this at all?" Catches scope creep and wasted effort before it happens.

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
| **All Commands (84)** | [commands/README.md](aura-frog/commands/README.md) |
| **All Skills (43)** | [skills/README.md](aura-frog/skills/README.md) |
| **Agent Teams** | [AGENT_TEAMS_GUIDE.md](aura-frog/docs/AGENT_TEAMS_GUIDE.md) |
| **MCP Setup** | [MCP_GUIDE.md](aura-frog/docs/MCP_GUIDE.md) |
| **Lifecycle Hooks** | [hooks/README.md](aura-frog/hooks/README.md) |
| **Changelog** | [CHANGELOG.md](aura-frog/CHANGELOG.md) |
| **Tutorial** | [FIRST_WORKFLOW_TUTORIAL.md](aura-frog/docs/guides/FIRST_WORKFLOW_TUTORIAL.md) |
| **Troubleshooting** | [TROUBLESHOOTING.md](aura-frog/docs/TROUBLESHOOTING.md) |
| **Release Notes** | [RELEASE_NOTES.md](aura-frog/docs/RELEASE_NOTES.md) |

---

## Architecture

```
aura-frog/
├── agents/         10 specialized agents (auto-selected)
├── skills/         43 skills (8 auto-invoke + 35 reference)
├── commands/       86 commands (5 bundled menus)
├── rules/          45 quality rules (TOON-optimized)
├── hooks/          24 lifecycle hooks
├── scripts/        37 utility scripts
├── templates/      Document templates
├── docs/           Guides & references
└── .mcp.json       6 bundled MCP servers
```

---

## Good to Know

- **Agents are persona-based** — same Claude instance with different instructions, not separate AI models
- **Agent Teams requires experimental flag** — `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- **Token savings** are from structured TOON format and smart context loading, not model switching
- **Collaborative planning** adds ~8.5K tokens to Phase 1 for Deep tasks (justified by catching expensive mistakes early)

---

## Contributing

We welcome contributions! The highest-impact areas:

- **New MCP integrations** — connect more tools
- **New agents** — add domain expertise
- **New skills** — extend capabilities
- **Bug fixes & docs** — always appreciated

See [CONTRIBUTING.md](CONTRIBUTING.md) or submit an issue.

> **Godot and SEO modules available as separate addons.**

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
