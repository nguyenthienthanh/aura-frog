# Aura Frog OS Architecture

**Version:** 3.2.1
**Inspired by:** Karpathy's LLM OS mental model

---

## Conceptual Model

Aura Frog frames Claude Code as an **Operating System** for software engineering. This is a conceptual model — not a literal OS implementation — that helps reason about resource allocation, process management, and memory discipline.

```
┌─────────────────────────────────────────────────────┐
│                    USER (Human)                     │
│              Sends tasks, approves gates            │
├─────────────────────────────────────────────────────┤
│                 KERNEL (Claude + Aura Frog)         │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │ Scheduler│  │Orchestr. │  │ Interrupt Handler │ │
│  │ 5-phase  │  │ dispatch │  │ approval gates    │ │
│  └──────────┘  └──────────┘  └───────────────────┘ │
├─────────────────────────────────────────────────────┤
│                 MEMORY (Context Window)             │
│  ┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ KERNEL │ │ INDEX  │ │ STACK│ │ HEAP │ │BUFFER│ │
│  │  2K    │ │  800   │ │  4K  │ │  8K  │ │  4K  │ │
│  └────────┘ └────────┘ └──────┘ └──────┘ └──────┘ │
├─────────────────────────────────────────────────────┤
│              PROCESSES (15 Agents)                  │
│  lead │ architect │ frontend │ mobile │ strategist  │
│  security │ tester │ devops │ scanner               │
│  master-planner │ feature-architect │ story-planner │
│  replanner │ epic-summarizer │ conflict-arbiter     │
├─────────────────────────────────────────────────────┤
│       DEVICE DRIVERS (8 MCP Servers · 6 + 2)        │
│  context7 │ playwright │ vitest │ firebase │ figma  │
│  slack │ postgres* │ redis*    (* opt-in)           │
├─────────────────────────────────────────────────────┤
│              FILESYSTEM (Project Files)             │
│  Read on demand via retrieval hierarchy             │
└─────────────────────────────────────────────────────┘
```

---

## OS ↔ Aura Frog Mapping

| OS Concept | Aura Frog Implementation | Why this mapping |
|------------|-------------------------|------------------|
| **CPU/Kernel** | Claude + orchestrator rules | Orchestrates, dispatches, verifies |
| **RAM** | Context window (token budget) | Managed segments, eviction policies |
| **Processes** | 15 specialized agents (9 exec + 6 planning) | Each has state, budget, priority |
| **Process Scheduler** | 5-phase TDD workflow + plan-tree DAG | Priority-based phase progression + dependency-aware T4 scheduling |
| **Interrupts** | Approval gates (Phase 1 & 3) | Human-in-the-loop checkpoints |
| **IPC** | Handoff state / TOON snapshots / `run-state.json` ↔ feature `## Runs` link | Agent-to-agent data passing |
| **Device Drivers** | 8 MCP servers (6 enabled + 2 opt-in) | Standardized external interfaces, per-agent allowlist |
| **Filesystem** | Project files on disk | Read on demand, not preloaded |
| **Compression Codec** | TOON format | Minimize memory footprint |
| **Context Switch** | Agent swap protocol | Save state → evict → load new → inject |

---

## Process Table — 15 Agents

```toon
process_table[15]{pid,agent,type,domain,token_budget,priority}:
  01,lead,system,Workflow coordination + team orchestration,3K,critical
  02,architect,system,System design + databases + backend,4K,critical
  03,frontend,worker,React/Vue/Angular/Next.js + design systems,4K,medium
  04,mobile,worker,React Native/Flutter/Expo/NativeWind,4K,medium
  05,strategist,system,ROI evaluation + MVP scoping + scope creep + T0/T1 framing,3K,high
  06,security,system,OWASP audits + vulnerability scanning + SAST,3K,high
  07,tester,system,Jest/Vitest/Playwright/Cypress/Detox + coverage + test-pyramid layer pick,4K,high
  08,devops,worker,Docker/K8s/CI-CD/monitoring,3K,low
  09,scanner,system,Project detection + config + context,2K,medium
  10,master-planner,system,Plan tree owner + decisions + persistence,3K,critical
  11,feature-architect,system,T2 → T3 decomposition (Feature → Stories),3K,high
  12,story-planner,system,T3 → T4 decomposition (Story → Tasks),3K,high
  13,replanner,system,F2-F4 mutation proposals (re-decompose / promote / discard),3K,medium
  14,epic-summarizer,system,T2 done → permanent_memory distillation,3K,medium
  15,conflict-arbiter,system,L1-L4 conflict adjudication + freeze/thaw decisions,3K,high
```

Agent selection is handled by `skills/agent-detector/SKILL.md` (haiku model, highest priority, fires on every message). The router from earlier versions is no longer a separate agent — its job is now done by the skill at zero cost.

### Process States

```toon
states[5]{state,meaning,transition}:
  READY,Can be dispatched,→ RUNNING when dispatched
  RUNNING,Currently executing (1 at a time),→ COMPLETE or BLOCKED
  BLOCKED,Waiting for approval or external data,→ RUNNING when unblocked
  SUSPENDED,State saved + evicted from context,→ READY when needed again
  COMPLETE,Task done + resources freed,→ READY for next task
```

### Context Switch Protocol

```
1. Active agent: complete() or suspend()
2. Save agent output → TOON snapshot
3. Update workflow state with results
4. Evict agent instructions from context
5. Load new agent instructions (lazy load)
6. Inject: workflow state + relevant context only
7. New agent starts with minimal context
```

---

## Memory Segments (Token Budget)

```toon
segments[6]{segment,purpose,budget,eviction}:
  KERNEL,Orchestrator rules + scheduler,2K,Never evict
  INDEX,Workflow state + project pointers,800,Never evict
  STACK,Current agent instructions + task,4K,Evict on agent switch
  HEAP,Project context + code snippets,8K,LRU — compact via TOON
  BUFFER,Tool responses + MCP data,4K,Evict after processing
  RESERVE,Buffer for compact operations,2K,Protected
```

**Total managed:** ~21K tokens
**Remaining:** Available for conversation + model reasoning

---

## 3-Tier Context Compression

### Tier 1: MicroCompact (No API call)

**Trigger:** Every 10 turns or context > 60%

Actions (local cleanup, no LLM needed):
1. Drop tool outputs older than 5 turns
2. Collapse repeated patterns (keep last occurrence)
3. Replace loaded file contents with pointers
4. Trim MCP responses to TOON summaries
5. Remove stale reasoning — keep conclusions only

### Tier 2: AutoCompact (API call — /compact)

**Trigger:** Context > 80%

1. Run MicroCompact first (reduce input)
2. Trigger `/compact` with focus instructions
3. Compact output preserves: workflow state + decisions + outcomes
4. Phase deliverables stored as TOON snapshots

### Tier 3: ManualCompact (User-triggered or session restart)

**Trigger:** User request or `workflow:handoff`

Creates full session snapshot:
1. Workflow state (all phases, all agents)
2. Git diff summary
3. Open issues / blockers
4. Next steps recommendation

---

## Orchestrator Principles

1. **Orchestrate, don't execute everything directly** — Dispatch to the right agent with minimal context
2. **Don't rubber-stamp weak work** — Review agent output before advancing
3. **Specify exactly what to do** — Don't delegate vague instructions
4. **Understand before directing** — Read findings before assigning follow-up
5. **Lazy load everything** — KERNEL + INDEX on boot, agent instructions on demand
6. **One agent RUNNING at a time** — Save state before switching

---

## Golden Rules

```toon
golden_rules[7]{rule,detail}:
  1. Lazy load,KERNEL + INDEX on boot — rest on demand
  2. One agent at a time,Save state before switching contexts
  3. TOON for structured data,Workflow state + handoffs + MCP responses
  4. Compact proactively,MicroCompact every 10 turns
  5. TDD is mandatory,RED → GREEN → REFACTOR — no exceptions
  6. Memory as hint,Always verify against actual files before acting
  7. Write after verify,No state updates until action confirmed successful
```

---

## Related

- `rules/core/memory-trust-policy.md` — Memory as hint + write discipline
- `rules/core/context-management.md` — Token optimization + model selection
- `CLAUDE.md` — Boot sequence + system config

---
