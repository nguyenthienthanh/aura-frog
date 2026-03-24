# Aura Frog — 60-Second Quickstart

## Install

```bash
# In Claude Code terminal:
/plugin marketplace add nguyenthienthanh/aura-frog
/plugin install aura-frog@aurafrog
```

## Use

```bash
# Initialize project context (recommended, run once)
project:init

# Start a workflow
workflow:start "Your task description"

# At approval gates:
# approve     → continue
# reject      → redo with feedback
# modify      → adjust deliverables
```

## Update

```bash
# Check current version
plugin:update

# Update to latest
/plugin marketplace update aurafrog

# Restart Claude Code after update
/exit
```

**Auto-check:** Aura Frog checks for updates daily. Set `AF_UPDATE_CHECK=false` to disable.

## Essential Commands

| Command | What it does |
|---------|-------------|
| `workflow:start <task>` | Full 5-phase TDD workflow |
| `bugfix:quick <desc>` | Quick bug fix with tests |
| `project:init` | Scan repo, generate context |
| `workflow:approve` | Approve current phase |
| `agent:list` | Show available agents |

## Learn More

- [GET_STARTED.md](GET_STARTED.md) — Full setup guide
- [commands/README.md](commands/README.md) — All 86 commands
- [docs/MCP_GUIDE.md](docs/MCP_GUIDE.md) — MCP server setup
- [docs/AGENT_TEAMS_GUIDE.md](docs/AGENT_TEAMS_GUIDE.md) — Multi-agent orchestration

---

