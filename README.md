<div align="center">

![Aura Frog](assets/logo/github_banner.png)

# Aura Frog

### An Operating System for software engineering.

The most powerful plugin for **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — 10 agents, 5-phase TDD workflow, self-healing memory, and multi-agent orchestration. One kernel. Zero untested code.

[![Version](https://img.shields.io/badge/version-3.2.1-blue.svg)](docs/reference/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**LLM OS architecture. Memory that heals itself. TDD that never skips.**

**[Install in 30 seconds](#-install)** · **[See it in action](#-before--after)** · **[Why Aura Frog?](#-the-problem)**

</div>

---

## The Problem

You open Claude Code. You type a prompt. Claude writes code. You *hope* it works.

No structure. No tests. No quality gates. Every session starts from scratch. Every complex feature turns into prompt spaghetti.

**You're the project manager, QA lead, and architect — all while trying to code.**

## The Solution

Aura Frog treats Claude Code as an **Operating System** — Claude is the kernel, agents are processes, and the context window is managed RAM. You describe the feature. Aura Frog dispatches the right agent, enforces a 5-phase TDD workflow, and compresses context automatically so you never lose decisions.

**You approve twice. Aura Frog handles the rest.**

---

## Before & After

<table>
<tr><th width="450">❌ Without Aura Frog</th><th width="450">✅ With Aura Frog</th></tr>
<tr>
<td>

```
You: "Add user authentication"
Claude: *writes 500 lines of untested code*
You: "Wait, that's not what I—"
Claude: *rewrites everything from scratch*
```

</td>
<td>

```
You: "Add user authentication"

🐸 Phase 1: "JWT or OAuth2? Here are trade-offs.
   3 endpoints needed. Approve?"

You: "approve"

🐸 Phase 2-3: 5 tests → all GREEN.
🐸 Phase 4-5: Reviewed. Documented. Done.
```

</td>
</tr>
</table>

**Result:** Production-ready code with tests, security review, and documentation — from a single prompt.

---

## Install

```bash
# In Claude Code (takes 30 seconds):
/plugin marketplace add nguyenthienthanh/aura-frog
/plugin install aura-frog@aurafrog
```

Start your first workflow:

```bash
workflow:start "Your task here"
```

<details>
<summary>Optional: Install the <code>af</code> CLI for health checks outside Claude Code</summary>

```bash
# In Claude Code:
setup:cli

# Or manually:
sudo ln -sf "$HOME/.claude/plugins/marketplaces/aurafrog/scripts/af" /usr/local/bin/af
```

Then use anywhere: `af doctor`, `af setup remote`, `af measure`.

</details>

<details>
<summary>Works on other platforms (skills-only mode)</summary>

| Platform | Install | What Works |
|----------|---------|------------|
| **Claude Code** | `/plugin marketplace add nguyenthienthanh/aura-frog` | Everything |
| **OpenAI Codex** | `cp -r aura-frog/skills/* ~/.codex/skills/` | Skills + commands |
| **Gemini CLI** | `cp -r aura-frog/skills/* ~/.gemini/skills/` | Skills + commands |
| **OpenCode** | `cp -r aura-frog/skills/* .opencode/skills/` | Skills + commands |

Hooks, agent detection, and MCP servers are Claude Code exclusive.

</details>

---

## Why Teams Ship Faster With Aura Frog

### 1. Every Feature Gets a TDD Workflow

No more "write code and hope." Every feature follows RED → GREEN → REFACTOR automatically:

```
  ✋ Phase 1: Understand + Design    → You approve the plan
  ⚡ Phase 2: Test RED               → Failing tests written
  ✋ Phase 3: Build GREEN            → You approve the implementation
  ⚡ Phase 4: Refactor + Review      → Auto quality + security check
  ⚡ Phase 5: Finalize               → Docs + notifications
```

Two approvals. Five phases. Zero untested code.

### 2. The Right Expert for Every Task

10 specialized agents activate automatically — no configuration:

```
"Build a React dashboard"     → frontend
"Optimize the SQL queries"    → architect
"Set up CI/CD pipeline"       → devops
"Fix the login screen crash"  → mobile
"Run a security audit"        → security
```

<details>
<summary>All 10 agents</summary>

| Agent | When it activates |
|-------|-------------------|
| `lead` | Coordinates workflows, team orchestration |
| `architect` | System design, databases, backend (Node, Python, Laravel, Go) |
| `frontend` | React, Vue, Angular, Next.js + design systems |
| `mobile` | React Native, Flutter, Expo, NativeWind |
| `strategist` | ROI evaluation, MVP scoping, scope creep detection |
| `security` | OWASP audits, vulnerability scanning, SAST |
| `tester` | Jest, Cypress, Playwright, Detox, coverage |
| `devops` | Docker, K8s, CI/CD, monitoring |
| `scanner` | Project detection, config, context |
| `router` | Agent + model selection |

</details>

### 3. Complex Features Get Debated Before Built

For deep tasks, 4 agents independently analyze your plan — then challenge each other:

```
📐 Architect    → "How to build it"
🔍 Tester       → "How it can fail"
👤 Frontend     → "How users experience it"
💼 Strategist   → "Should we even build this?"
```

Plans survive 4 rounds of scrutiny before a single line of code. Catches scope creep and wasted effort *before* it happens.

### 4. Your Codebase Loads in Seconds, Not Minutes

Run `project:init` once. Every future session instantly understands your codebase — conventions, architecture, patterns, file relationships. 12 pattern detections. 7 context files generated.

**No more re-explaining your project every session.**

### 5. Multi-Agent Teams for Big Features

For complex work, Aura Frog spins up a real team working in parallel:

```
lead
├── architect     → Designs the system
├── frontend      → Builds the UI
├── tester        → Writes tests
└── security      → Reviews for vulnerabilities

All cross-reviewing each other's work.
```

Only activates when needed. Simple tasks stay single-agent (saves ~3x tokens).

### 6. Context-Aware MCP Servers — Zero Config

6 bundled servers auto-invoke when Claude needs them:

```
"Build with MUI"          → context7 fetches current MUI docs
"Test the login page"     → playwright launches a browser
"Check test coverage"     → vitest runs your suite
"Deploy to Firebase"      → firebase manages the project
```

Plus Figma design fetching and Slack notifications.

<details>
<summary>More features</summary>

#### Self-Improving Learning
Detects your patterns, remembers corrections, creates rules that persist across sessions. Optional Supabase sync for teams.

#### Smart Complexity Routing
Automatically matches effort to task size — typos get direct edits, features get full workflows, architecture gets collaborative planning. No configuration.

#### Built-in Safety Net
Workflow crashed? `workflow:resume`. Context full? Decisions preserved across `/compact`. Need to pause? `workflow:handoff` saves everything.

#### Memory That Heals Itself
All cached context is treated as a hint — agents verify against actual files before acting. State only updates after confirmed success (Strict Write Discipline). No stale assumptions propagate.

#### 3-Tier Context Compression
MicroCompact (free, every 10 turns) → AutoCompact (one /compact call at 80%) → ManualCompact (full session snapshot). Context stays lean. Decisions survive.

#### Performance by Design
3-tier rule loading (~75% less context), conditional hooks (~40% fewer executions), agent detection caching, session start caching (<1s repeat sessions).

</details>

---

## The Numbers

| Component | Count | Why it matters |
|-----------|:-----:|----------------|
| **Agents** | 10 | Right expert auto-selected per task |
| **Skills** | 44 | 8 auto-invoke on context, 36 on-demand |
| **Commands** | 90 | 5 bundled menus — discoverability built in |
| **Rules** | 45 | 3-tier loading — only what's needed per phase |
| **Hooks** | 28 | Conditional — skip processing for non-code files |
| **MCP Servers** | 6 | Zero-config, auto-invoked |

Full workflow target: **≤30K tokens** across all 5 phases.

---

## Workflow Modes

| Mode | Command | Best for |
|------|---------|----------|
| **Full Workflow** | `workflow:start "task"` | New features, production code |
| **Fast-Track** | `fasttrack: <specs>` | Pre-approved specs |
| **Quick Fix** | `bugfix:quick "fix"` | Small bugs with TDD |
| **Refactor** | `refactor "file"` | Code cleanup |

---

## Documentation

| | |
|---|---|
| **All Documentation** | [docs/README.md](docs/README.md) |
| **Getting Started** | [GET_STARTED.md](docs/getting-started/GET_STARTED.md) |
| **First Workflow Tutorial** | [FIRST_WORKFLOW_TUTORIAL.md](docs/getting-started/FIRST_WORKFLOW_TUTORIAL.md) |
| **All Commands (90)** | [commands/README.md](aura-frog/commands/README.md) |
| **All Skills (44)** | [skills/README.md](aura-frog/skills/README.md) |
| **Agent Teams Guide** | [AGENT_TEAMS_GUIDE.md](docs/guides/AGENT_TEAMS_GUIDE.md) |
| **MCP Setup** | [MCP_GUIDE.md](docs/operations/MCP_GUIDE.md) |
| **Hooks & Lifecycle** | [hooks/README.md](aura-frog/hooks/README.md) |
| **Troubleshooting** | [TROUBLESHOOTING.md](docs/operations/TROUBLESHOOTING.md) |
| **Changelog** | [CHANGELOG.md](docs/reference/CHANGELOG.md) |

---

## Architecture — LLM OS

```
Claude = Kernel          Context Window = RAM           Project Files = Disk
Agents = Processes       5-Phase TDD = Scheduler        MCP = Device Drivers
TOON = Compression       Approval Gates = Interrupts    Handoffs = IPC

aura-frog/
├── agents/         10 processes (auto-dispatched per task)
├── skills/         44 skills (8 auto-invoke + 36 on-demand)
├── commands/       90 commands (5 bundled menus)
├── rules/          45 rules (13 core + 15 agent + 17 workflow)
├── hooks/          28 lifecycle hooks (conditional execution)
├── scripts/        43 utility scripts
├── docs/           AI reference docs (phases, TOON refs)
└── .mcp.json       6 device drivers (MCP servers)
```

---

## Contributing

We welcome contributions — especially new MCP integrations, agents, skills, and bug fixes. See [CONTRIBUTING.md](CONTRIBUTING.md) or submit an issue.

> Godot and SEO/GEO modules available as separate addons.

---

## License

MIT — See [LICENSE](LICENSE)

---

<div align="center">

![Aura Frog](assets/logo/mascot_coding_scene.png)

### Your AI writes code. Aura Frog runs the OS.

**[Install Now](#-install)** · **[Tutorial](docs/getting-started/FIRST_WORKFLOW_TUTORIAL.md)** · **[Report Issue](https://github.com/nguyenthienthanh/aura-frog/issues)**

*Built by [@nguyenthienthanh](https://github.com/nguyenthienthanh) · [Changelog](docs/reference/CHANGELOG.md)*

</div>
