# Aura Frog OS — Plugin for Claude Code

**System:** Aura Frog v3.7.0 | **Format:** [TOON](https://github.com/toon-format/toon)
**Purpose:** 9 agents + 44 skills + 6 commands + 5-phase TDD workflow + 6 MCP servers

---

## OS Mental Model

Claude is the **kernel** — orchestrates, dispatches, verifies. Does not execute everything directly.

```toon
os_map[5]{concept,implementation}:
  Kernel,Claude + orchestrator rules
  Processes,9 agents (PID + state + budget)
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

CRITICAL: Check env FIRST. If missing → `/project env`.

---

## Golden Rules

```toon
rules[8]{rule,detail}:
  Never assume,"Ask when in doubt — see rules/core/no-assumption.md"
  Lazy load,"KERNEL on start — everything else on demand"
  One agent at a time,"Save state before switching"
  TOON for data,"Run state + handoffs + MCP responses"
  Compact proactively,"MicroCompact every 10 turns — AutoCompact at 80%"
  TDD mandatory,"RED → GREEN → REFACTOR"
  Memory as hint,"Verify against actual files before acting"
  Write after verify,"No state updates until confirmed successful"
```

---

## Status Line (0 tokens)

```
🐸 AF v3.7.0 │ lead │ P1 │ Opus │ 12% ctx │ $0.05
```

Do NOT render banners in conversation. Auto-refresh: 30s (set `refreshInterval` in settings). Setup: `/project sync`

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
agents[9]{pid,name,domain,budget}:
  01,lead,Workflow coordination,3K
  02,architect,System design + DB + backend,4K
  03,frontend,React/Vue/Angular/Next.js,4K
  04,mobile,React Native/Flutter/Expo,4K
  05,strategist,ROI + MVP + scope creep,3K
  06,security,OWASP + vulnerability + SAST,3K
  07,tester,Jest/Cypress/Playwright + coverage,4K
  08,devops,Docker/K8s/CI-CD,3K
  09,scanner,Project detection + context,2K
```

Agent selection handled by `skills/agent-detector/SKILL.md` (haiku, priority highest, auto-invoke every message).

---

## Auto-Invoke Skills

Only skills with `autoInvoke: true` in frontmatter fire on every message.

```toon
skills[5]{name,trigger}:
  agent-detector,Every message (priority highest, haiku)
  bugfix-quick,Bug fix request
  test-writer,Test request
  code-reviewer,Code review
  code-simplifier,Simplify/KISS
```

**`run-orchestrator` is NOT auto-invoke** — it fires on `/run` command or intent-detected via description match (complex feature, multi-file work, `fasttrack:` prefix). Listed separately to avoid confusion.

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
  Quick,Direct edit — no run
  Standard,plan mode → /run
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
  Core (rules/core/),18,Every session
  Agent (rules/agent/),17,Per-agent type
  Workflow (rules/workflow/),22,Per-phase
```

**Core rule paths (read on-demand when the topic comes up):**

```toon
core_paths[18]{topic,path}:
  TDD discipline,rules/core/tdd-workflow.md
  Approval gates,rules/core/approval-gates.md
  Execution rules,rules/core/execution-rules.md
  No assumption,rules/core/no-assumption.md
  Prompt validation (6-dim),rules/core/prompt-validation.md
  Contextual separation (injection defense),rules/core/contextual-separation.md
  Recursion limit,rules/core/recursion-limit.md
  Observer role,rules/core/observer-agent.md
  Memory trust,rules/core/memory-trust-policy.md
  Context mgmt,rules/core/context-management.md
  Prompt caching,rules/core/prompt-caching.md
  Small-to-large routing,rules/core/small-to-large-routing.md
  Code quality,rules/core/code-quality.md
  Naming,rules/core/naming-conventions.md
  Simplicity,rules/core/simplicity-over-complexity.md
  Verification,rules/core/verification.md
  Env loading,rules/core/env-loading.md
  Library choice,rules/core/prefer-established-libraries.md
```

**Agent & workflow rules:** listed in each agent's "Related Rules" section and in `run-orchestrator` SKILL.md per-phase index. Model loads them when the agent/phase activates.

---

## Commands

```toon
commands[6]{cmd,subs}:
  /run,"<task> (auto-detect intent) + context-aware: approve/reject/modify/handoff/status/progress/rollback/stop"
  /check,"(all)/security/perf/complexity/debt/coverage/deps"
  /design,"api/db/doc"
  /project,"init/detect/status/list/switch/refresh/regen/env/sync"
  /af,"status/agents/metrics/learn/setup/update/mcp/prompts/skill"
  /help,"<topic> — plugin overview, per-command help, agent routing guide, hook reference"
```

---

## Agent Teams (Experimental)

Gate: Deep + 2+ domains → team. Otherwise → subagent.
Guide: `docs/guides/AGENT_TEAMS_GUIDE.md` (repo root, not shipped with plugin)

## Learning System

`/af learn status` | `/af learn feedback` | `/af learn analyze` | `/af learn apply`

---

## Resources

```toon
resources[8]{name,location}:
  Agents (9),agents/
  Commands (6),commands/
  Rules (45),rules/{core|agent|workflow}/
  Skills (38),skills/
  Hooks (28),hooks/
  MCP (6),.mcp.json
  AI References,docs/
  Human Docs,docs/README.md (repo root)
```

---

**Version:** 3.7.0
