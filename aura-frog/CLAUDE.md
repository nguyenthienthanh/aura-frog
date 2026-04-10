# Aura Frog OS — Plugin for Claude Code

**System:** Aura Frog v3.1.0
**Architecture:** LLM OS — Claude as kernel, agents as processes, context window as RAM
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** 10 agents + 44 skills + 87 commands + 5-phase TDD workflow + 6 MCP servers

---

## OS Mental Model

Claude is the **kernel**. It orchestrates, dispatches, and verifies — it does not execute everything directly.

```toon
os_map[8]{concept,implementation}:
  CPU/Kernel,Claude + orchestrator rules (dispatch + verify)
  RAM,Context window (managed token segments)
  Processes,10 specialized agents (PID + state + budget)
  Scheduler,5-phase TDD workflow (priority-based)
  Interrupts,Approval gates (Phase 1 + Phase 3)
  IPC,Handoff state via TOON snapshots
  Device Drivers,6 MCP servers (auto-invoked)
  Filesystem,Project files (read on demand)
```

**Full architecture:** `docs/os-architecture.md`

---

## Boot Sequence (Session Start)

```toon
boot[5]{step,action,cost}:
  1,Check & load .envrc,~0 tokens
  2,Load KERNEL rules (core/),~2000 tokens
  3,Detect agent + model,~200 tokens
  4,Load project context (on demand),~500-2000 tokens
  5,Verify MCP servers,~100 tokens
```

**CRITICAL:** Always check env FIRST. If env vars not loaded → run `project:reload-env`.

**Total boot cost:** < 3K tokens. Everything else loads on demand.

---

## Golden Rules

```toon
golden_rules[7]{rule,detail}:
  1. Lazy load,KERNEL + boot on start — agent instructions + project context on demand
  2. One agent at a time,Save state before switching contexts
  3. TOON for structured data,Workflow state + handoffs + MCP responses + phase deliverables
  4. Compact proactively,MicroCompact every 10 turns — AutoCompact at 80% context
  5. TDD is mandatory,RED → GREEN → REFACTOR — no exceptions
  6. Memory as hint,Always verify against actual files before acting
  7. Write after verify,No state updates until action confirmed successful
```

**Rules 6-7 details:** `rules/core/memory-trust-policy.md`

---

## Status Line (0 tokens)

Agent, phase, model, context %, and cost are shown in the CLI status bar — NOT in conversation text.

```
🐸 AF v3.1.0 │ lead │ P1 │ Opus │ 12% ctx │ $0.05
```

**Do NOT render banners in conversation.** The status line handles it.

**Setup:** `project:sync-settings` | **Script:** `scripts/statusline.sh`

---

## MCP Servers (Device Drivers)

```toon
mcp_servers[6]{name,package,purpose,requires}:
  context7,@upstash/context7-mcp,Library docs (MUI Tailwind etc),None
  playwright,@playwright/mcp,Browser automation + E2E tests,None
  vitest,@djankies/vitest-mcp,Test execution + coverage,None
  firebase,firebase-tools,Firebase project management + Firestore + Auth,firebase login
  figma,figma-developer-mcp,Design file fetching,FIGMA_API_TOKEN
  slack,@modelcontextprotocol/server-slack,Team notifications,SLACK_BOT_TOKEN
```

**Auto-invocation:** Claude uses these automatically based on context.

**Configuration:** `.mcp.json` | **Guide:** `docs/MCP_GUIDE.md`

---

## Process Table (10 Agents)

```toon
agents[10]{pid,name,type,domain,budget}:
  01,lead,system,Workflow coordination + team orchestration,3K
  02,architect,system,System design + databases + backend,4K
  03,frontend,worker,React/Vue/Angular/Next.js + design systems,4K
  04,mobile,worker,React Native/Flutter/Expo/NativeWind,4K
  05,strategist,system,ROI evaluation + MVP scoping + scope creep,3K
  06,security,system,OWASP audits + vulnerability scanning + SAST,3K
  07,tester,system,Jest/Cypress/Playwright/Detox + coverage,4K
  08,devops,worker,Docker/K8s/CI-CD/monitoring,3K
  09,scanner,system,Project detection + config + context,2K
  10,router,system,Agent + model selection,2K
```

**Process model:** `docs/os-architecture.md`

---

## Auto-Invoke Skills

```toon
skills[8]{name,trigger,file}:
  agent-detector,Every message (includes lazy-agent-loader),skills/agent-detector/SKILL.md
  framework-expert,Framework task (lazy-loads specific patterns),skills/framework-expert/SKILL.md
  testing-patterns,Test task,skills/testing-patterns/SKILL.md
  workflow-orchestrator,Complex feature (includes fasttrack mode),skills/workflow-orchestrator/SKILL.md
  bugfix-quick,Bug fix request,skills/bugfix-quick/SKILL.md
  test-writer,Test request,skills/test-writer/SKILL.md
  code-reviewer,Code review,skills/code-reviewer/SKILL.md
  code-simplifier,Simplify/KISS/complexity,skills/code-simplifier/SKILL.md
```

**Reference Skills (35 — loaded on-demand):**
- Framework experts: react, react-native, vue, angular, nextjs, nodejs, python, laravel, go, flutter, typescript (11)
- Design: design-system-library, stitch-design, design-expert (3)
- Learning: learning-analyzer, self-improve (2)
- Workflow: lazy-agent-loader, phase1-lite (2)
- Context: project-context-loader, session-continuation, response-analyzer (3)
- Others: api-designer, debugging, migration-helper, performance-optimizer, sequential-thinking, problem-solving, scalable-thinking, dev-expert, documentation, git-workflow, git-worktree, pm-expert, qa-expert, refactor-expert (14)

> **Externalized:** Godot and SEO/GEO modules available as separate addons.

**All skills:** `skills/README.md`

---

## Orchestrator Principles

```toon
orchestrator[6]{principle,detail}:
  Orchestrate not execute,Dispatch to right agent with minimal context
  Don't rubber-stamp,Review agent output before advancing phases
  Specify exactly,Don't delegate vague instructions to agents
  Understand before directing,Read findings before assigning follow-up
  One agent RUNNING,Save state before switching contexts
  Verify then write,No state updates until action confirmed successful
```

---

## 5-Phase TDD Workflow (Scheduler)

```toon
phases[5]{phase,name,gate,budget}:
  1,Understand + Design,APPROVAL REQUIRED,3500 tokens
  2,Test RED,Auto-continue,1500 tokens
  3,Build GREEN,APPROVAL REQUIRED,4000 tokens
  4,Refactor + Review,Auto-continue,1500 tokens
  5,Finalize,Auto-continue,800 tokens
```

**2 gates only.** Phases 2, 4, 5 auto-continue.

**Target:** Full workflow ≤ 30K tokens.

---

## Complexity Routing

```toon
routing[3]{complexity,approach}:
  Quick (typo/config),Direct edit — no workflow
  Standard (feature/bugfix),Native plan mode → workflow:start or bugfix:quick
  Deep (multi-file architecture),Full 5-phase workflow + collaborative planning
```

---

## Context Management (RAM)

### Memory Segments

```toon
segments[6]{segment,budget,eviction}:
  KERNEL,2K,Never evict
  INDEX,800,Never evict
  STACK (agent instructions),4K,Evict on agent switch
  HEAP (project context),8K,LRU — compact via TOON
  BUFFER (tool/MCP responses),4K,Evict after processing
  RESERVE (compact buffer),2K,Protected
```

### 3-Tier Compression

```toon
compression[3]{tier,trigger,cost}:
  MicroCompact,Every 10 turns or >60% context,Free (local cleanup)
  AutoCompact,>80% context,1 API call (/compact)
  ManualCompact,User request or workflow:handoff,Full session snapshot
```

**Details:** `rules/core/context-management.md`

---

## Rule Loading (3-Tier)

```toon
rule_tiers[3]{tier,dir,count,when}:
  Core,rules/core/,13,ALWAYS — every session
  Agent,rules/agent/,15,Per-agent — only relevant rules
  Workflow,rules/workflow/,17,Per-phase — only current phase rules
```

**Token savings:** ~30-50% reduction vs loading all 45 rules every message.

---

## Bundled Commands

```toon
bundled_commands[5]{command,subcommands}:
  /workflow,"start/status/phase/next/approve/handoff/resume"
  /test,"unit/e2e/coverage/watch/docs"
  /project,"status/refresh/init/switch/list/config/sync-settings"
  /quality,"lint/complexity/review/fix"
  /bugfix,"quick/full/hotfix"
```

---

## Agent Teams (Experimental)

When `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled:

```toon
team_mode[4]{aspect,detail}:
  Gate,Deep + 2+ domains → team. Quick/Standard → always subagent
  Startup,TeamCreate → TaskCreate x N → parallel execution
  Hooks,TeammateIdle (cross-review) + TaskCompleted (validate)
  Orchestration,lead coordinates → creates teammates per phase
```

**Backward Compatible:** When disabled or Quick/Standard, standard subagent behavior applies.

**Guide:** `docs/AGENT_TEAMS_GUIDE.md`

---

## Learning System

```bash
/learn:status       # Check learning system status
/learn:feedback     # Submit manual feedback
/learn:analyze      # Analyze patterns and generate insights
/learn:apply        # Apply learned improvements
```

**Setup:** `docs/LEARNING_SYSTEM.md`

---

## Resources

```toon
resources[16]{name,location}:
  Agents (10),agents/
  Commands (87),commands/
  Rules (45: 13 core + 15 agent + 17 workflow),rules/{core|agent|workflow}/
  Skills (8 auto-invoke + 36 reference),skills/
  Hooks (27),hooks/
  MCP Servers (6),.mcp.json
  OS Architecture,docs/os-architecture.md
  MCP Guide,docs/MCP_GUIDE.md
  Learning System,docs/LEARNING_SYSTEM.md
  Phases (5),docs/phases/
  Getting Started,GET_STARTED.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
  Troubleshooting,docs/TROUBLESHOOTING.md
  Tutorial,docs/guides/FIRST_WORKFLOW_TUTORIAL.md
  Release Notes,docs/RELEASE_NOTES.md
```

---

**Version:** 3.1.0
