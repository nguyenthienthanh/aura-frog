# Agent Teams Guide

**Version:** 1.18.0
**Purpose:** Enable and use Claude Agent Teams with Aura Frog

---

## What is Agent Teams?

Agent Teams is an experimental Claude Code feature that enables **real multi-agent orchestration**. Instead of spawning subagents that report back to a single session, teammates are:

- **Independent Claude Code instances** with separate context windows
- **Persistent** until explicitly shut down
- **Peer-to-peer** - teammates can message each other directly
- **Coordinated** via shared task lists with dependency tracking

---

## Enabling Agent Teams

### 1. Settings.json

Add to your Claude Code settings:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### 2. Environment Variable

Or set directly:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### 3. Verify

The `isAgentTeamsEnabled()` utility in `hooks/lib/af-config-utils.cjs` checks both locations.

---

## How It Works with Aura Frog

### Team vs Subagent Mode

```toon
mode_decision[4]{condition,mode}:
  Agent Teams disabled,subagent (standard Task tool)
  Quick/Standard + single domain,subagent
  Standard + 2+ domains + Agent Teams enabled,team
  Deep complexity + Agent Teams enabled,team
```

### Team Lifecycle

```
1. agent-detector detects multi-domain task
2. Selects team mode (if enabled)
3. pm-operations-orchestrator becomes team lead
4. Lead creates teammates matching phase requirements
5. Lead distributes work via shared task list
6. Teammates work in parallel on claimed tasks
7. TeammateIdle hook assigns cross-review work
8. TaskCompleted hook validates quality gates
9. Lead manages phase transitions
10. Teammates exit when phase work complete
```

---

## Phase Team Composition

```toon
phase_teams[11]{phase,lead,primary,secondary,team_size}:
  1-Understand,pm-operations-orchestrator,architect,qa-automation,3
  2-Design,architect,ui-expert,qa-automation,3
  3-UI,ui-expert,mobile-expert,-,2
  4-Test Plan,qa-automation,architect,-,2
  5a-TDD RED,qa-automation,architect,-,2
  5b-TDD GREEN,architect,ui-expert+qa-automation,-,3
  5c-TDD REFACTOR,architect,-,qa-automation(reviewer),2
  6-Review,security-expert,architect+qa-automation,-,3
  7-Verify,qa-automation,-,-,1
  8-Document,pm-operations-orchestrator,-,-,1
  9-Share,voice-operations,-,-,1
```

---

## Team Rules

### ALWAYS

1. **Max 3 teammates per phase** - Prevents coordination overhead
2. **Pass complete context** - Teammates don't share conversation history
3. **Use shared task list** - Prevents duplicate work
4. **Claim files before editing** - Prevents merge conflicts
5. **Only lead manages phases** - Single source of truth for workflow state

### NEVER

1. **Teammates commit independently** - Only lead manages git
2. **Skip file claiming** - Causes merge conflicts
3. **Create more than 3 teammates** - Diminishing returns
4. **Let teammates advance phases** - Lead-only responsibility

---

## Display Modes

### In-Process (Default)

All teammates run in the main terminal. Switch between them with `Shift+Up`/`Shift+Down`.

### Split Panes

Each teammate gets its own terminal pane. Requires:
- **tmux** - `brew install tmux`
- **iTerm2** - macOS terminal with split pane support

---

## File Ownership Conventions

Each agent type claims specific directories to prevent conflicts:

```toon
file_ownership[5]{agent,directories}:
  architect,"src/api/ src/services/ src/repositories/ migrations/"
  ui-expert,"src/components/ src/ui/ src/views/ *.css *.scss"
  qa-automation,"tests/ __tests__/ spec/ *.test.* *.spec.*"
  mobile-expert,"src/screens/ src/navigation/ *.ios.* *.android.*"
  security-expert,"Reviews only (no file ownership)"
```

---

## Hooks

### TeammateIdle

Fires when a teammate has no tasks. Checks for:
- Unclaimed tasks matching specialization
- Cross-review work from completed phases
- Pending quality gates

**Exit codes:** 2 = keep alive (feedback), 0 = let exit

### TaskCompleted

Fires when a teammate marks a task done. Validates:
- TDD phase test references
- Approval gate status

**Exit codes:** 2 = reject (needs revision), 0 = accept

---

## Troubleshooting

### Agent Teams not activating

1. Check `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings or env
2. Verify complexity is Deep or multi-domain Standard
3. Check agent-detector output for `Mode: team`

### Teammates not seeing context

- Teammates have empty conversation history
- Include all relevant info in task descriptions
- Use teammate messages for specific context

### File conflicts

- Ensure agents follow file ownership conventions
- Use teammate messaging before editing shared files
- Only lead should commit changes

---

## Backward Compatibility

All Agent Teams features are gated on `isAgentTeamsEnabled()`:
- When disabled: identical to v1.17.0 subagent behavior
- New hooks (TeammateIdle, TaskCompleted) never fire when off
- All skill/agent/rule changes add new sections without modifying existing ones

---

**Version:** 1.18.0 | **Last Updated:** 2026-02-09
