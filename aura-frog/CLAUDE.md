# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v1.19.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** 10 agents + 52 skills + 91 commands + 9-phase workflow + auto-invoking skills + bundled MCP

---

## New in 1.19.0 - Optimization

- **Banner rule optimized** (19KB -> 5KB) — Examples moved to `docs/BANNER_EXAMPLES.md`
- **Rules consolidated** — YAGNI+DRY+KISS merged into `simplicity-over-complexity.md` (50 -> 48 rules)
- **Fasttrack merged** — Now a mode inside `workflow-orchestrator` (53 -> 52 skills)
- **Approval gates slimmed** (558 -> 96 lines) — Points to orchestrator for details
- **PreCompact hook** — Auto-save workflow state before context compaction
- **`context: fork`** — Heavy skills (framework-expert, seo-bundle, testing-patterns, learning-analyzer) run in forked context
- **plugin.json** — New `engines`, `capabilities`, `stats` fields

---

## New in 1.18.0 - Agent Teams

- **Agent Teams** - Real multi-agent orchestration via Claude's experimental Agent Teams feature
- **Complexity gate** - Team mode ONLY for Deep + multi-domain tasks (~3x token savings on Quick/Standard)

**Guide:** `docs/AGENT_TEAMS_GUIDE.md`

---

## New in 1.17.0 - Context Optimization

**Cost Reduction:**
- `model-router` - Auto-select Haiku/Sonnet/Opus (30-50% savings on trivial tasks)
- `framework-expert` - Lazy-load framework patterns (~80% token reduction)
- `seo-bundle` - Consolidated SEO/GEO skills
- `testing-patterns` - Unified testing patterns

**Consolidated Agents (15 → 10):**
- `project-manager` ← project-detector + project-config-loader + project-context-manager
- `architect` ← backend-expert + database-specialist
- `ui-expert` ← web-expert + ui-designer

**Bundled Commands:** `/workflow`, `/test`, `/project`, `/quality`, `/bugfix`, `/seo`

**Docs:** `docs/REFACTOR_ANALYSIS.md`

---

## Session Start (MANDATORY)

```toon
session_start[6]{step,action,file}:
  1,Check & load .envrc (AUTO-RUN if not loaded),rules/env-loading.md
  2,Load memory from Supabase (auto via hook),hooks/lib/af-memory-loader.cjs
  3,Show agent banner,rules/agent-identification-banner.md
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

## Agent Banner (REQUIRED EVERY RESPONSE)

```
⚡ 🐸 AURA FROG v1.19.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ Teams: [✓ enabled / ✗ off]             ┃
┃ 🔥 [aura-message]                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Teams status is MANDATORY in every banner.** Show `✓ enabled` or `✗ off`.

**Details:** `rules/agent-identification-banner.md`

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
skills[13]{name,trigger,file}:
  agent-detector,Every message (includes lazy-agent-loader),skills/agent-detector/SKILL.md
  model-router,After agent detection,skills/model-router/SKILL.md
  project-context-loader,Before code gen,skills/project-context-loader/SKILL.md
  framework-expert,Framework task (lazy-loads specific patterns),skills/framework-expert/SKILL.md
  seo-bundle,SEO/GEO task,skills/seo-bundle/SKILL.md
  testing-patterns,Test task,skills/testing-patterns/SKILL.md
  workflow-orchestrator,Complex feature (includes fasttrack mode),skills/workflow-orchestrator/SKILL.md
  bugfix-quick,Bug fix request,skills/bugfix-quick/SKILL.md
  test-writer,Test request,skills/test-writer/SKILL.md
  code-reviewer,Code review,skills/code-reviewer/SKILL.md
  code-simplifier,Simplify/KISS/complexity,skills/code-simplifier/SKILL.md
  session-continuation,Token limit/handoff,skills/session-continuation/SKILL.md
  response-analyzer,Large outputs,skills/response-analyzer/SKILL.md
```

**Reference Skills (39 - loaded on-demand by bundles or commands):**
- Framework experts: react, react-native, vue, angular, nextjs, nodejs, python, laravel, go, flutter, godot, typescript (12)
- SEO experts: seo-expert, ai-discovery-expert, seo-check, seo-schema, seo-geo (5)
- Design: design-system-library, stitch-design, visual-pixel-perfect, design-expert (4)
- Learning: learning-analyzer, self-improve (2)
- Workflow: lazy-agent-loader, phase1-lite (2)
- Others: api-designer, debugging, migration-helper, performance-optimizer, sequential-thinking, problem-solving, scalable-thinking, dev-expert, documentation, git-workflow, nativewind-generator, pm-expert, qa-expert, refactor-expert (14)

**All skills:** `skills/README.md`

---

## Plan Mode Integration

**Use Claude Code's native plan mode for Quick/Standard tasks** (brainstorm, design, compare options). For Deep implementation tasks, use Aura Frog's 9-phase workflow.

```toon
plan_routing[3]{complexity,approach}:
  Quick (typo/config),Native plan mode or direct edit
  Standard (feature/bugfix),Native plan mode → then workflow:start or bugfix:quick
  Deep (multi-file architecture),workflow-orchestrator 9-phase workflow
```

**Details:** `rules/execution-rules.md`

---

## Execution Rules

**ALWAYS:** Show banner → Load context → Follow TDD → Show deliverables

**NEVER:** Skip banner, skip approval gates (Phase 2 & 5b), skip auto-continue phases, skip tests

**2-Gate Workflow:** Only Phase 2 & 5b require approval. Other phases auto-continue.

**Details:** `rules/execution-rules.md`

---

## Bundled Commands

```toon
bundled_commands[6]{command,subcommands,replaces}:
  /workflow,"start/status/phase/next/approve/handoff/resume",22 workflow commands
  /test,"unit/e2e/coverage/watch/docs",4 test commands
  /project,"status/refresh/init/switch/list/config/sync-settings",7 project commands
  /quality,"lint/complexity/review/fix",3 quality commands
  /bugfix,"quick/full/hotfix",3 bugfix commands
  /seo,"check/schema/geo",3 seo commands
```

**Usage:** `/workflow` shows menu, `/workflow start "task"` uses direct subcommand.

---

## Resources

```toon
resources[12]{name,location}:
  Agents (10),agents/
  Commands (91),commands/
  Rules (48),rules/
  Skills (13 auto-invoke + 39 reference),skills/
  Hooks (21),hooks/
  MCP Servers (6),.mcp.json
  MCP Guide,docs/MCP_GUIDE.md
  Learning System,docs/LEARNING_SYSTEM.md
  Phases (9),docs/phases/
  Banner Examples,docs/BANNER_EXAMPLES.md
  Getting Started,GET_STARTED.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
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
  Orchestration,pm-operations-orchestrator as lead → creates teammates per phase
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

**Details:** `rules/context-management.md`

---

## Token Budget (CRITICAL)

**Target:** Phase 1-9 complete workflow ≤ 40k tokens (down from ~200k).

```toon
token_budget[5]{phase_group,budget,notes}:
  Phase 1 (Understand),500 tokens MAX,TOON format only - NO prose
  Phase 2-4 (Design/UI/Test Plan),3000 tokens total,TOON tables + minimal prose
  Phase 5a-5c (TDD),4000 tokens total,Code only - minimal comments
  Phase 6-7 (Review/Verify),1500 tokens total,Findings in TOON tables
  Phase 8-9 (Doc/Notify),800 tokens total,Summary only
```

**Enforcement Rules:**
1. **Agent Detector:** NO file scanning tools (patterns only)
2. **Project Context:** Load explicitly, not auto-invoke
3. **Phase Guides:** Load ONE at a time, not all 9 upfront
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

**Version:** 1.19.0
