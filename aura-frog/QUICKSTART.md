# Aura Frog Quickstart

Get started with Aura Frog in under 2 minutes.

---

## Prerequisites

1. **Claude Code** installed - [Installation Guide](https://docs.anthropic.com/en/docs/claude-code)
2. **Git** installed

---

## Install

Run these commands in Claude Code terminal:

```bash
# Add marketplace (one-time)
/plugin marketplace add nguyenthienthanh/aura-frog

# Install plugin
/plugin install aura-frog@aurafrog
```

Done! Aura Frog is now available in all your projects.

---

## Update

```bash
/plugin marketplace update aurafrog
```

---

## First Workflow

```bash
# Initialize project (optional but recommended)
project:init

# Start a workflow
workflow:start "Your task description"
```

At approval gates:
- `approve` - Continue to next phase
- `reject: <reason>` - Restart current phase
- `modify: <changes>` - Adjust deliverables

---

## Common Commands

| Command | Description |
|---------|-------------|
| `workflow:start <task>` | Start full 9-phase workflow |
| `workflow:status` | Show current progress |
| `workflow:approve` | Approve current phase |
| `bugfix:quick <desc>` | Quick bug fix with TDD |
| `refactor <file>` | Code refactoring |
| `project:init` | Initialize project context |
| `agent:list` | Show all agents |
| `learn:status` | Show learning system status (NEW) |

---

## Learn More

- **Full Guide:** [GET_STARTED.md](GET_STARTED.md)
- **Usage Guide:** [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)
- **Commands:** [commands/README.md](commands/README.md)
- **MCP Setup:** [docs/MCP_GUIDE.md](docs/MCP_GUIDE.md)
- **Learning System:** [docs/LEARNING_SYSTEM.md](docs/LEARNING_SYSTEM.md)
- **Agent Teams:** [docs/AGENT_TEAMS_GUIDE.md](docs/AGENT_TEAMS_GUIDE.md) (NEW)

---

**Version:** 1.19.0
