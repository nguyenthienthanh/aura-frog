# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v2.1.2
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** 10 agents + 43 skills + 86 commands + 5-phase workflow + 8 auto-invoking skills + bundled MCP

---

## New in 2.0.0 - Deep Project Init

- **3 new context generators** — `repo-map-gen.sh` (annotated directory tree), `file-registry-gen.sh` (key files index), `architecture-gen.sh` (architecture analysis)
- **`context-compress.sh` v2.0** — 12 pattern detections (was 6): adds indentation, state mgmt, API pattern, component style, env, monorepo
- **Project context: 4 → 7 files** — New: `repo-map.md`, `file-registry.yaml`, `architecture.md`
- **Smart context loading** — Route by scenario: simple (~200 tokens), bug fix (~800), full (~2000), architecture (~1000)
- **Collaborative Planning** — Deep tasks get 4-round deliberation (Builder/Breaker/User/Why → debate → simulate → converge)
- **`strategist` agent** — Business-level thinking (ROI, MVP scoping, scope creep detection)
- **Agent rename** — Shorter, clearer: `lead`, `frontend`, `mobile`, `tester`, `security`, `devops`, `gamedev`, `scanner`, `router`
- **Scripts: 34 → 37**, **Rules: 45**, **Agents: 10**

---

## New in 1.19.0 - Optimization

- **Banner rule optimized** (19KB -> 5KB) — Examples moved to `docs/BANNER_EXAMPLES.md`
- **Rules consolidated** — YAGNI+DRY+KISS merged into `simplicity-over-complexity.md` (50 -> 49 rules)
- **Fasttrack merged** — Now a mode inside `workflow-orchestrator` (53 -> 52 skills)
- **Approval gates slimmed** (558 -> 96 lines) — Points to orchestrator for details
- **PreCompact hook** — Auto-save workflow state before context compaction
- **`context: fork`** — Heavy skills (framework-expert, testing-patterns, learning-analyzer) run in forked context
- **plugin.json** — Removed invalid `engines`, `capabilities`, `stats` fields

---

## New in 1.18.0 - Agent Teams

- **Agent Teams** - Real multi-agent orchestration via Claude's experimental Agent Teams feature
- **Complexity gate** - Team mode ONLY for Deep + multi-domain tasks (~3x token savings on Quick/Standard)

**Guide:** `docs/AGENT_TEAMS_GUIDE.md`

---

## New in 1.17.0 - Context Optimization

**Cost Reduction:**
- `framework-expert` - Lazy-load framework patterns (~80% token reduction)
- `testing-patterns` - Unified testing patterns

**Consolidated Agents (15 → 11):**
- `scanner` ← project-detector + project-config-loader + project-context-manager
- `architect` ← backend-expert + database-specialist
- `frontend` ← web-expert + ui-designer

**Bundled Commands:** `/workflow`, `/test`, `/project`, `/quality`, `/bugfix`

**Docs:** `docs/REFACTOR_ANALYSIS.md`

---

## Session Start (MANDATORY)

```toon
session_start[6]{step,action,file}:
  1,Check & load .envrc (AUTO-RUN if not loaded),rules/core/env-loading.md
  2,Load memory from Supabase (auto via hook),hooks/lib/af-memory-loader.cjs
  3,Show agent banner,rules/core/agent-identification-banner.md
  4,Detect agent + model,skills/agent-detector/SKILL.md
  5,Load project context,skills/project-context-loader/SKILL.md
  6,Verify MCP servers,commands/mcp/status.md
```

**CRITICAL: Always check env FIRST.** If env vars not loaded → run `project:reload-env` before continuing.

**Show status in first response:**
```
🔌 MCP: context7 ✓ | playwright ✓ | vitest ✓ | firebase ✗
🧠 Learning: enabled ✓ | Memory: 15 items loaded
👥 Teams: ✓ enabled | Mode: ready
```

---

## Agent Banner (Session Start + Phase Transitions + Agent Switches)

```
⚡ 🐸 AURA FROG v2.1.2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ Teams: [✓ enabled / ✗ off]             ┃
┃ 🔥 [aura-message]                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Teams status is MANDATORY in every banner.** Show `✓ enabled` or `✗ off`.

**Details:** `rules/core/agent-identification-banner.md`

---

## MCP Servers

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

**Reference Skills (35 - loaded on-demand by bundles or commands):**
- Framework experts: react, react-native, vue, angular, nextjs, nodejs, python, laravel, go, flutter, typescript (11)
- Design: design-system-library, stitch-design, design-expert (3)
- Learning: learning-analyzer, self-improve (2)
- Workflow: lazy-agent-loader, phase1-lite (2)
- Context: project-context-loader, session-continuation, response-analyzer (3)
- Others: api-designer, debugging, migration-helper, performance-optimizer, sequential-thinking, problem-solving, scalable-thinking, dev-expert, documentation, git-workflow, git-worktree, pm-expert, qa-expert, refactor-expert (14)

> **Externalized:** Godot and SEO/GEO modules available as separate addons.

**All skills:** `skills/README.md`

---

## Plan Mode Integration

**Use Claude Code's native plan mode for Quick/Standard tasks** (brainstorm, design, compare options). For Deep implementation tasks, use Aura Frog's 5-phase workflow.

```toon
plan_routing[3]{complexity,approach}:
  Quick (typo/config),Native plan mode or direct edit
  Standard (feature/bugfix),Native plan mode → then workflow:start or bugfix:quick
  Deep (multi-file architecture),workflow-orchestrator 5-phase workflow
```

**Details:** `rules/core/execution-rules.md`

---

## Execution Rules

**ALWAYS:** Show banner → Load context → Follow TDD → Show deliverables

**NEVER:** Skip banner, skip approval gates (Phase 1 & 3), skip auto-continue phases, skip tests

**2-Gate Workflow:** Only Phase 1 (Understand + Design) & Phase 3 (Build GREEN) require approval. Other phases auto-continue.

**Details:** `rules/core/execution-rules.md`

---

## Bundled Commands

```toon
bundled_commands[5]{command,subcommands,replaces}:
  /workflow,"start/status/phase/next/approve/handoff/resume",16 workflow commands
  /test,"unit/e2e/coverage/watch/docs",4 test commands
  /project,"status/refresh/init/switch/list/config/sync-settings",7 project commands
  /quality,"lint/complexity/review/fix",3 quality commands
  /bugfix,"quick/full/hotfix",3 bugfix commands
```

**Usage:** `/workflow` shows menu, `/workflow start "task"` uses direct subcommand.

---

## Resources

```toon
resources[15]{name,location}:
  Agents (10),agents/
  Commands (86),commands/
  Rules (45: 13 core + 15 agent + 17 workflow),rules/{core|agent|workflow}/
  Skills (8 auto-invoke + 35 reference),skills/
  Hooks (26),hooks/
  MCP Servers (6),.mcp.json
  MCP Guide,docs/MCP_GUIDE.md
  Learning System,docs/LEARNING_SYSTEM.md
  Phases (5),docs/phases/
  Banner Examples,docs/BANNER_EXAMPLES.md
  Getting Started,GET_STARTED.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
  Troubleshooting,docs/TROUBLESHOOTING.md
  Tutorial,docs/guides/FIRST_WORKFLOW_TUTORIAL.md
  Release Notes,docs/RELEASE_NOTES.md
```

---

## Agent Teams (Experimental)

When `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled, Aura Frog uses real multi-agent orchestration via Claude's Agent Teams feature.

**Complexity Gate:** Team mode ONLY for Deep complexity + 2+ domains. Quick/Standard tasks always use single-agent or subagent (saves ~3x tokens).

```toon
team_mode[4]{aspect,detail}:
  Gate,Deep + 2+ domains ≥50 each → team. Quick/Standard → always subagent
  Startup,TeamCreate → TaskCreate × N → parallel Task × N (one message)
  Hooks,TeammateIdle (assign cross-review) + TaskCompleted (validate quality)
  Orchestration,lead as lead → creates teammates per phase
```

**Backward Compatible:** When disabled OR Quick/Standard tasks, standard subagent behavior applies.

**Guide:** `docs/AGENT_TEAMS_GUIDE.md`

---

## Context Management

```toon
context_rules[4]{rule,action}:
  Trivial tasks,Use Haiku (typo fix/rename/format)
  Standard tasks,Use Sonnet (bug fix/feature/refactor)
  Architecture tasks,Use Opus (system design/security audit)
  High context (>70%),Use /compact with focus instructions
```

**Details:** `rules/core/context-management.md`

---

## Rule Loading Strategy (3-Tier)

Rules are organized into `core/`, `agent/`, `workflow/` subdirectories for selective loading.

```toon
rule_tiers[3]{tier,dir,count,when}:
  Core,rules/core/,13,ALWAYS — every session
  Agent,rules/agent/,15,Per-agent — only relevant rules
  Workflow,rules/workflow/,17,Per-phase — only current phase rules
```

```toon
loading_examples[4]{scenario,loaded,est_tokens}:
  Quick fix,Core only (13),~2000
  Standard Phase 1,Core + agent subset + Phase 1 workflow,~4000
  Standard Phase 3,Core + agent subset + Phase 3 workflow,~3500
  Deep (full),Core + all agent + current phase workflow,~5000
```

**Details:** `rules/README.md`

---

## Token Budget (CRITICAL)

**Target:** Phase 1-5 complete workflow ≤ 40k tokens (down from ~200k).

```toon
token_budget[5]{phase_group,budget,notes}:
  Phase 1 (Understand + Design),3500 tokens MAX,TOON format + minimal prose
  Phase 2 (Test RED),1500 tokens total,Test scaffolding only
  Phase 3 (Build GREEN),4000 tokens total,Code only - minimal comments
  Phase 4 (Refactor + Review),1500 tokens total,Findings in TOON tables
  Phase 5 (Finalize),800 tokens total,Summary only
```

**Enforcement Rules:**
1. **Agent Detector:** NO file scanning tools (patterns only)
2. **Project Context:** Load explicitly, not auto-invoke
3. **Phase Guides:** Load ONE at a time, not all 5 upfront
4. **Output Format:** TOON for all phase deliverables
5. **No Re-summarization:** Don't repeat previous phase outputs

**If over budget:** Compress with TOON, don't expand with prose.

---

## Learning System

Self-improvement through feedback collection and pattern analysis.

```bash
/learn:status       # Check learning system status
/learn:feedback     # Submit manual feedback (optional)
/learn:analyze      # Analyze patterns and generate insights
/learn:apply        # Apply learned improvements
```

**Setup:** `docs/LEARNING_SYSTEM.md`

---

**Version:** 2.1.2
