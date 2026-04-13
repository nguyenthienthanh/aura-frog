# Aura Frog OS — Plugin for Claude Code

**System:** Aura Frog v3.2.1 | **Format:** [TOON](https://github.com/toon-format/toon)
**Purpose:** 10 agents + 44 skills + 90 commands + 5-phase TDD workflow + 6 MCP servers

---

## OS Mental Model

Claude is the **kernel** — orchestrates, dispatches, verifies. Does not execute everything directly.

```toon
os_map[5]{concept,implementation}:
  Kernel,Claude + orchestrator rules
  Processes,10 agents (PID + state + budget)
  RAM,Context window (managed segments)
  Scheduler,5-phase TDD workflow
  Drivers,6 MCP servers (auto-invoked)
```

---

## Boot Sequence

```toon
boot[5]{step,action,cost}:
  1,Check & load .envrc,~0
  2,Load KERNEL rules (core/),~2000
  3,Detect agent + model,~200
  4,Load project context (on demand),~500-2000
  5,Verify MCP servers,~100
```

CRITICAL: Check env FIRST. If missing → `project:reload-env`.

---

## Golden Rules

```toon
rules[7]{rule,detail}:
  Lazy load,"KERNEL on start — everything else on demand"
  One agent at a time,"Save state before switching"
  TOON for data,"Workflow state + handoffs + MCP responses"
  Compact proactively,"MicroCompact every 10 turns — AutoCompact at 80%"
  TDD mandatory,"RED → GREEN → REFACTOR"
  Memory as hint,"Verify against actual files before acting"
  Write after verify,"No state updates until confirmed successful"
```

---

## Status Line (0 tokens)

```
🐸 AF v3.2.1 │ lead │ P1 │ Opus │ 12% ctx │ $0.05
```

Do NOT render banners in conversation. Auto-refresh: 30s (set `refreshInterval` in settings). Setup: `project:sync-settings`

---

## MCP Servers

```toon
mcp[6]{name,purpose,requires}:
  context7,Library docs,None
  playwright,Browser automation + E2E,None
  vitest,Test execution + coverage,None
  firebase,Firebase management,firebase login
  figma,Design files,FIGMA_API_TOKEN
  slack,Notifications,SLACK_BOT_TOKEN
```

Auto-invoked by context. Config: `.mcp.json`

---

## Process Table

```toon
agents[10]{pid,name,domain,budget}:
  01,lead,Workflow coordination,3K
  02,architect,System design + DB + backend,4K
  03,frontend,React/Vue/Angular/Next.js,4K
  04,mobile,React Native/Flutter/Expo,4K
  05,strategist,ROI + MVP + scope creep,3K
  06,security,OWASP + vulnerability + SAST,3K
  07,tester,Jest/Cypress/Playwright + coverage,4K
  08,devops,Docker/K8s/CI-CD,3K
  09,scanner,Project detection + context,2K
  10,router,Agent + model selection,2K
```

---

## Auto-Invoke Skills

```toon
skills[8]{name,trigger}:
  agent-detector,Every message
  framework-expert,Framework task (lazy-loads patterns)
  testing-patterns,Test task
  workflow-orchestrator,Complex feature
  bugfix-quick,Bug fix request
  test-writer,Test request
  code-reviewer,Code review
  code-simplifier,Simplify/KISS
```

36 reference skills loaded on-demand. Full list: `skills/README.md`

---

## Orchestrator Principles

```toon
principles[5]{principle}:
  Orchestrate not execute — dispatch to right agent
  Review agent output before advancing phases
  Specify exactly — no vague delegation
  One agent RUNNING — save state before switching
  Verify then write — no updates until confirmed
```

---

## 5-Phase Workflow

```toon
phases[5]{phase,name,gate,budget}:
  1,Understand + Design,APPROVAL,3500
  2,Test RED,Auto,1500
  3,Build GREEN,APPROVAL,4000
  4,Refactor + Review,Auto,1500
  5,Finalize,Auto,800
```

2 gates only (P1 & P3). Target: ≤30K tokens.

## Complexity Routing

```toon
routing[3]{level,approach}:
  Quick,Direct edit — no workflow
  Standard,plan mode → workflow:start or bugfix:quick
  Deep,Full 5-phase + collaborative planning
```

---

## Context Management

```toon
segments[4]{segment,budget}:
  KERNEL + INDEX,~3K (never evict)
  STACK (agent),4K (evict on switch)
  HEAP (project),8K (LRU compact)
  BUFFER (tools),4K (evict after use)
```

Compression: MicroCompact (10 turns / >60%) → AutoCompact (>80% /compact) → ManualCompact (handoff).
Details: `rules/core/context-management.md`

## Rule Loading

```toon
tiers[3]{tier,count,when}:
  Core (rules/core/),13,Every session
  Agent (rules/agent/),15,Per-agent type
  Workflow (rules/workflow/),17,Per-phase
```

---

## Bundled Commands

```toon
commands[5]{cmd,subs}:
  /workflow,"start/status/approve/handoff/resume"
  /test,"unit/e2e/coverage"
  /project,"status/init/switch/sync-settings"
  /quality,"lint/complexity/review"
  /bugfix,"quick/full/hotfix"
```

---

## Agent Teams (Experimental)

Gate: Deep + 2+ domains → team. Otherwise → subagent.
Guide: `docs/guides/AGENT_TEAMS_GUIDE.md` (repo root, not shipped with plugin)

## Learning System

`/learn:status` | `/learn:feedback` | `/learn:analyze` | `/learn:apply`

---

## Resources

```toon
resources[8]{name,location}:
  Agents (10),agents/
  Commands (90),commands/
  Rules (45),rules/{core|agent|workflow}/
  Skills (44),skills/
  Hooks (28),hooks/
  MCP (6),.mcp.json
  AI References,docs/
  Human Docs,docs/README.md (repo root)
```

---

**Version:** 3.2.1
