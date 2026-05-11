# Aura Frog System Commands

Plugin management, learning system, metrics, agents, and setup.

**Category:** System
**Scope:** Session

---

## /af status

Show plugin status: version, active project, MCP server health, env vars loaded, component counts (agents/skills/rules), and session stats.

---

## /af agents

List all available agents with capabilities, or show details for a specific agent.

**Usage:** `/af agents`, `/af agents security`

---

## /af metrics

Show metrics dashboard: token usage, workflow completion rates, agent usage, phase durations vs budget, session stats. Aggregates from `.claude/metrics/`.

**Usage:** `/af metrics`, `/af metrics --hooks` (profile hooks), `/af metrics --performance` (plugin overhead)

---

## /af learn

Learning system management. Requires Supabase (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `AF_LEARNING_ENABLED=true`).

```toon
subs[5]{sub,purpose}:
  "/af learn status","Show learning system status + statistics"
  "/af learn feedback","Submit manual feedback (success/correction/issue/suggestion)"
  "/af learn analyze","Analyze patterns from Supabase (agents/workflows/feedback)"
  "/af learn apply","Review and apply pending improvements"
  "/af learn setup","First-time Supabase schema creation"
```

---

## /af setup

Plugin setup and configuration.

```toon
subs[3]{sub,purpose}:
  "/af setup activate","Quick-activate Aura Frog in current project"
  "/af setup integrations","Configure JIRA/Confluence/Slack/Figma tokens"
  "/af setup cli","Install af CLI globally"
```

---

## /af update

Check for plugin updates and install latest version.

---

## /af mcp

Show MCP server status: connected/disconnected, last response time, error count.

---

## /af prompts

Evaluate prompt quality and Claude Code feature utilization. Scores 0-100 with improvement suggestions.

**Usage:** `/af prompts`, `/af prompts --days 30 --focus efficiency`

---

## /af skill create

Create a new reusable skill template.

**Usage:** `/af skill create "my-skill-name"`

---

## Related

- **Skills:** `prompt-evaluator`, `learning-analyzer`, `self-improve`, `lazy-agent-loader`
