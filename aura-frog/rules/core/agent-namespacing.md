# Rule: Agent Namespacing (Plugin Agents)

**Priority:** Critical
**Applies To:** Every Agent tool invocation that targets an Aura Frog plugin agent

---

## Core Principle

**Plugin agents are namespaced.** When invoking via the Agent tool, the `subagent_type` MUST be `aura-frog:<name>` — never bare `<name>`.

```
✓ subagent_type: aura-frog:architect
✗ subagent_type: architect          ← errors: "agent type 'architect' not found"
```

Built-in Claude Code agents (`general-purpose`, `Explore`, `Plan`, `statusline-setup`) are NOT namespaced. Only marketplace plugin agents are.

---

## Why this matters

Marketplace plugins live alongside other plugins under `~/.claude/plugins/marketplaces/<owner>/<plugin>/`. If two plugins both shipped a `general-purpose` agent, namespacing prevents collisions — Claude Code looks up `subagent_type` exactly, then falls back to plugin-prefixed lookup.

The error `agent type 'architect' not found` is the symptom: the lookup found nothing at the bare name and didn't auto-namespace. Always pass the prefix.

---

## Authoritative list of plugin subagent_type values

```toon
plugin_agents[14]{name,subagent_type}:
  architect,aura-frog:architect
  frontend,aura-frog:frontend
  mobile,aura-frog:mobile
  strategist,aura-frog:strategist
  tester,aura-frog:tester
  security,aura-frog:security
  devops,aura-frog:devops
  lead,aura-frog:lead
  scanner,aura-frog:scanner
  master-planner,aura-frog:master-planner
  feature-architect,aura-frog:feature-architect
  story-planner,aura-frog:story-planner
  replanner,aura-frog:replanner
  epic-summarizer,aura-frog:epic-summarizer
```

Reference patterns under `agents/reference/` (architect-patterns, frontend-patterns, etc.) are also namespaced: `aura-frog:reference:architect-patterns`.

Built-in agents (use bare names):

```toon
builtin_agents[4]{name,subagent_type}:
  general-purpose,general-purpose
  Explore,Explore
  Plan,Plan
  statusline-setup,statusline-setup
```

---

## When you see "agent type 'X' not found"

1. **Check if X is a plugin agent.** If it's `architect`, `frontend`, `tester`, etc. — prefix with `aura-frog:`.
2. **Check spelling.** Plugin names are kebab-case (`feature-architect`, not `feature_architect` or `featureArchitect`).
3. **Check the agent file exists.** `ls aura-frog/agents/<name>.md` should resolve.
4. **Check plugin is loaded.** `/plugin` in Claude Code shows installed plugins; if Aura Frog isn't there, agent lookup will fail regardless of namespacing.

---

## Anti-patterns

- **Hardcoding bare names in skills/rules** — every dispatch table that references plugin agents must show the namespaced form (e.g., `aura-frog:architect`, not `architect`)
- **Mixed namespacing** — once you adopt the prefix, use it for ALL plugin agents in the same dispatch (don't write `aura-frog:architect` next to bare `tester`)
- **Stripping the prefix when documenting** — "the architect agent" is fine in prose; the literal `subagent_type:` value must keep the prefix
- **Using a different prefix** — Aura Frog agents use `aura-frog:` specifically; not `af:` or `aurafrog:` or `frog:`

---

## Verification before dispatch

When the orchestrator (run-orchestrator, master-planner, lead) is about to invoke Agent:

1. Confirm `subagent_type` starts with `aura-frog:` for plugin agents
2. Confirm the bare name after the colon matches an existing `aura-frog/agents/<name>.md`
3. If unsure, fall back to a built-in agent (`general-purpose` or `Explore`) — those work without prefixing

---

## Tie-Ins

- **Skill:** `run-orchestrator` — execution[5] dispatch table uses namespaced types
- **Skill:** `agent-detector` — recommends agents by bare name in conversation; the AI must prefix when actually invoking
- **Agent:** `master-planner` — dispatches to plan-tier agents (master-planner / feature-architect / story-planner / replanner / epic-summarizer); ALL get the `aura-frog:` prefix
- **Rule:** `rules/core/recursion-limit.md` — agent-spawn depth limits assume successful spawns; failed spawns due to namespacing don't count toward the budget
- **Rule:** `rules/core/no-assumption.md` — when in doubt about a subagent_type, ask or check the agent file
