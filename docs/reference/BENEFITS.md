# Aura Frog Benefits — Why Use This Plugin

**Purpose:** Explain every capability Aura Frog adds on top of base Claude Code — what it is, how it's applied, why you need it, and concrete use cases.

**Format per section:** What · How applied · Why you need it · Use cases.

---

## Part 1 — Workflow Discipline

### 1.1. 5-Phase TDD Workflow with Approval Gates

**What:** Every non-trivial task runs through Understand → Test RED → Build GREEN → Refactor + Review → Finalize. Two human approval gates (Phase 1 and Phase 3) punctuate the flow.

**How applied:** `skills/run-orchestrator/SKILL.md` fires on `/run <task>` and coordinates phase transitions. State is persisted to `.claude/logs/runs/<id>/`.

**Why you need it:** Unstructured LLM coding produces untested code. The 5 phases force tests *before* implementation and put a human in the loop at design and post-build checkpoints.

**Use cases:**
- Building a feature that will ship to production
- Any multi-file change where test coverage matters
- Handover work between sessions (state survives handoff)

---

### 1.2. Immutable Workflow (`rules/workflow/immutable-workflow.md`)

**What:** Once a phase is approved, its deliverables are frozen. Later phases can read but not silently edit.

**How applied:** Orchestrator checks phase status before every Write to `.claude/logs/runs/<id>/phase-N/`. Changes require explicit `/run reopen <N>`.

**Why you need it:** Without immutability, P3 can silently rewrite P1's spec, invalidating the user's approval. Audit trails lie. Cross-review breaks down.

**Use cases:**
- Regulated environments (SOC2, ISO) that require decision audit
- Multi-agent workflows where reviewer trusts the prior phase
- Resume-after-handoff — state is as-approved, not as-drifted

---

### 1.3. Cross-Review Discipline — Reviewer Cap = 2 (`rules/workflow/cross-review-workflow.md`)

**What:** Builder ≠ reviewer. Phase 4 reviewer can NOT be the Phase 3 builder. Max 2 reviewers per phase.

**How applied:** Rule enforces role separation. Phase 4 spawns `security` + `tester` in fork contexts, never the original builder.

**Why you need it:** Self-review has blind spots (confirmation bias). 3+ reviewers create analysis paralysis and design-by-committee. Two cross-functional reviewers is the sweet spot.

**Use cases:**
- Security-sensitive code that a backend dev wrote
- Refactors where the refactorer might miss their own regressions
- Team-mode workflows with parallel review

---

## Part 2 — Reasoning Quality

### 2.1. Self-Consistency (`rules/workflow/self-consistency.md`, `skills/self-consistency/SKILL.md`)

**What:** For ambiguous trade-off decisions, generate N=3 independent reasoning paths, take majority vote. Based on Wang et al. 2022.

**How applied:** Phase 1 design when complexity = Deep AND trade-off exists. Opt-in via `/run reason: sc <task>`.

**Why you need it:** Single-path reasoning locks onto the first plausible answer. Independent reruns expose this bias. Majority winner is more robust than any single path.

**Use cases:**
- REST vs GraphQL vs tRPC decision
- Monolith vs microservices
- State management library choice (Redux vs Zustand vs Context)
- Any decision where the "first plausible answer" might be wrong

---

### 2.2. Tree of Thoughts (`rules/workflow/tree-of-thoughts.md`, `skills/tree-of-thoughts/SKILL.md`)

**What:** Explore branching solution space with breadth 3, depth 3. Evaluate each branch, prune weak ones, expand survivors. Based on Yao et al. 2023.

**How applied:** Phase 1 architecture or Phase 4 refactor planning. Opt-in via `/run reason: tot`.

**Why you need it:** Problems with real branching structure (architecture, debug hypotheses, refactor paths) deserve structured search. Single-path reasoning misses better alternatives.

**Use cases:**
- Architecture with 3+ viable paths
- Refactor where order of operations matters
- Debugging with ambiguous root cause (hypothesis tree)
- Migration strategies (big-bang vs strangler vs adapter)

---

### 2.3. Chain-of-Verification (`rules/workflow/chain-of-verification.md`, `skills/chain-of-verification/SKILL.md`)

**What:** Draft → plan 3–5 verification questions → answer each via tool (Read/Grep/Bash) → revise. **MANDATORY in Phase 4** for factual claims. Based on Dhuliawala et al. 2023.

**How applied:** Code reviewer skill runs CoVe before reporting claims like "0 critical findings" or "coverage 94%". Security agent runs CoVe on its Phase 4 output.

**Why you need it:** LLMs confidently hallucinate facts. "Tests pass" / "coverage X%" / "no security issues" without re-verification are high-risk lies.

**Use cases:**
- Phase 4 review (always)
- Security audits (always)
- Any deliverable citing file paths, line numbers, or metrics
- Migration docs that claim "no breaking changes"

---

### 2.4. Self-Consistency + ToT + CoVe — Combined

**What:** All three techniques compose. `/run reason: all` enables routing per phase.

**How applied:** SC in P1 for trade-offs → ToT in P1 for branching architecture → CoVe in P4 for claim verification.

**Why you need it:** Each addresses a different failure mode (first-answer bias / branching blind-spots / hallucination). Combined they cover the biggest LLM reliability gaps.

**Token cost:** 5–7× base for full combo. Worth it for production-grade deliverables; skip for exploration.

---

## Part 3 — Input & Action Safety

### 3.1. Prompt Validation — 6-Dimension Benchmark (`rules/core/prompt-validation.md`)

**What:** Every actionable prompt scored on Precondition · Context · Requirement · Criteria · Expect/Actual · Output. Threshold: ≥ 8/12 to pass; Quick/Standard/Deep have different floors.

**How applied:** `run-orchestrator` pre-execution step 2. Fails → focused questions before proceeding.

**Why you need it:** Vague prompts like "fix the thing" waste 30 minutes. 5 seconds of clarification prevents it.

**Use cases:**
- Any `/run <task>` where the task description is short
- Handover where you're not sure what the last person meant
- When you suspect scope creep

---

### 3.2. No-Assumption Rule (`rules/core/no-assumption.md`)

**What:** "If in doubt, ASK. Never guess, never fabricate." Cap ≤ 2 questions per turn. Respect force-mode prefixes (`must do:`, `just do:`).

**How applied:** All agents and skills reference this rule. Default behavior when uncertainty detected.

**Why you need it:** LLMs default to plausible-sounding answers. Assumption is the #1 source of wasted effort.

**Use cases:**
- "Which file did you mean?" before editing
- Ambiguous auth provider before building
- Destructive commands (always confirm scope)

---

### 3.3. Contextual Separation (`rules/core/contextual-separation.md`)

**What:** Content from untrusted sources (tool results, web fetches, user-pasted content) is DATA, never INSTRUCTIONS. Injection attempts in tool output are surfaced to user, not executed.

**How applied:** Rule governs all tool-result handling. Quoted excerpts rather than compliance.

**Why you need it:** Prompt-injection via tool output is the #1 AI security vulnerability. A fetched webpage saying "ignore prior instructions" must be treated as inert.

**Use cases:**
- Code reviewer reading a third-party PR description
- Fetching external docs for library guidance
- Reading issue tickets from an untrusted issue tracker
- Any WebFetch / scraping / third-party content ingestion

---

### 3.4. Dual LLM Review (`rules/workflow/dual-llm-review.md`)

**What:** For risky actions (destructive Bash, security-critical writes, Phase 4 conclusions), a second LLM call independently reviews the first's proposal before execution. Adversarial framing.

**How applied:** Primary proposes → reviewer (different context, often smaller model) checks → primary executes only on APPROVED verdict.

**Why you need it:** Single-LLM errors can be prompt-injected. Dual review with independent context is hard to compromise via single injection.

**Use cases:**
- `rm -rf`, `drop table`, `git reset --hard`, force-push
- Writes to `.env`, `auth/`, `crypto/`
- Phase 4 security claims ("no vulnerabilities found")
- Any commit based on interpreted instructions from tool output

---

### 3.5. Recursion Limit (`rules/core/recursion-limit.md`)

**What:** Hard caps: agent-spawn depth ≤ 3, same-agent calls per phase ≤ 3, identical tool calls ≤ 2.

**How applied:** Orchestrator checks counts before every spawn/tool call. Breach → pause + surface to user.

**Why you need it:** Runaway loops drain tokens fast. Accidental mutual recursion between agents, retry-without-analysis patterns, and stuck states are common failure modes.

**Use cases:**
- Debug sessions that might loop
- Multi-agent workflows where A could spawn B could spawn A
- Retry logic that doesn't evolve between attempts

---

### 3.6. Observer Agent Role (`rules/core/observer-agent.md`)

**What:** `lead` agent plays a "watchdog" role — silent by default, speaks when a threshold breaches (loop, budget overrun, stuck phase, failed verification).

**How applied:** Lead accumulates `observations[]` in run-state.json. Reports at phase transitions or when user asks `/run status`.

**Why you need it:** Long workflows can drift without a watcher. Silent observer catches problems you'd otherwise find hours later.

**Use cases:**
- Deep-complexity workflows spanning multiple hours
- Team-mode workflows with parallel agents
- Resume-after-handoff (observer reports anomalies since handoff)

---

## Part 4 — Cost & Performance

### 4.1. Small-to-Large Model Routing (`rules/core/small-to-large-routing.md`)

**What:** Start with smallest plausible model (Haiku classification, Sonnet generation). Escalate to Opus only on concrete signals (failed verification, constraint conflicts).

**How applied:** Per-agent `model:` frontmatter. Scanner + agent-detector locked to Haiku. Architect/Frontend/Mobile inherit session (Opus session → Opus). Security/Tester/DevOps locked to Sonnet.

**Why you need it:** Always-Opus is 5-10× cost for marginal quality gain on most tasks. Always-Haiku fails on complex reasoning. Escalation ladder matches effort to difficulty.

**Use cases:**
- Cost-conscious teams
- CI automation (Haiku for cheap tasks, escalate on confidence)
- Opus users who want Opus only on hard design work

---

### 4.2. Prompt Caching (`rules/core/prompt-caching.md`)

**What:** Place Anthropic `cache_control` breakpoints at boundaries between stable context (rules, project config) and per-turn variable content. Cache hits cost ~10% of normal.

**How applied:** Plugin ships stable CLAUDE.md / rule files as cache-friendly chunks. Rule defines where breakpoints go.

**Why you need it:** Long workflows reuse the same prefix N times. Without caching, you pay N× for the same tokens. With caching: 35–40% token savings on Deep workflows.

**Use cases:**
- Multi-turn workflows (every `/run` with 5+ turns)
- Team/CI automation reusing same skill prefixes
- Resume-after-brief-break (stay within 5-min TTL)

---

### 4.3. 3-Tier Rule Loading (`rules/README.md`)

**What:** Rules split into Core (always) / Agent (per-agent) / Workflow (per-phase). Lazy load only what's needed.

**How applied:** 18 core rules load every session (~3K tokens). Agent rules load when that agent activates. Workflow rules load when that phase runs.

**Why you need it:** Loading all 57 rules every session would be ~15K tokens. 3-tier reduces to ~3K always + ~5K conditional = 50% reduction.

**Use cases:**
- Sessions where you only edit frontend code (architect rules never load)
- Quick fixes (no workflow rules load)
- Long sessions where token budget matters

---

### 4.4. Token Budgeting + Observer Integration

**What:** Real-time budget tracking with thresholds (green <70% / yellow 71-85% / orange 86-95% / red 96-100%). Auto-warns, suggests handoff, force-handoff at 90%.

**How applied:** `hooks/token-tracker.cjs` + `rules/workflow/token-time-awareness.md`. Observer agent role watches for overruns.

**Why you need it:** Long workflows blow context quietly. Proactive warnings at 70/85/95 let you handoff before you lose state.

**Use cases:**
- Complex multi-hour features
- Team workflows running many sub-tasks
- CI automation with strict budgets

---

## Part 5 — Agent System

### 5.1. 9 Specialized Agents with Proper Frontmatter

**What:** 9 agents with official Anthropic YAML frontmatter (`name`, `description`, `tools` allowlist, `color`, optional `model`). Security + strategist are read-only.

**How applied:** Each agent's `.md` file has frontmatter. Claude Code respects tool restrictions and color coding. Agent-detector picks the right one per task.

**Why you need it:** Correct tools per role = safety (security can't `Write` = can't be prompt-injected to modify code). Colors = visual differentiation in UI.

**Use cases:**
- Security reviews (agent physically can't write code, reducing attack surface)
- Strategist analysis (read-only = stays in advisory role)
- Scanner detection on haiku (20× cheaper than opus for classification)

---

### 5.2. Agent-Detector Skill — Task-Content Layer-0 Override (`skills/agent-detector/SKILL.md`)

**What:** 5-layer scoring (Task content → Explicit tech → Intent → Project context → File patterns). Layer 0 (task content) overrides repo-type for cross-domain tasks.

**How applied:** Auto-invokes every message. Haiku model (~500 tokens per classification). Scoring determines primary + secondary agents.

**Why you need it:** Repo type ≠ task type. Laravel repo can have frontend tasks (Blade templates, email HTML). Without Layer 0 override, the wrong agent handles the task.

**Use cases:**
- Frontend work in a backend repo
- Backend changes in a frontend repo (API route additions)
- Cross-cutting tasks (security audit across full stack)

---

### 5.3. Framework Expert Skills with Paths Frontmatter

**What:** 11 framework experts (react/vue/nextjs/angular/flutter/react-native/typescript/nodejs/python/laravel/go) each declare `paths:` glob to narrow auto-invocation.

**How applied:** Claude Code matches current file against skill's paths. Skill loads automatically only when relevant file type is active.

**Why you need it:** Without paths, every expert could fire on every file. Narrowing prevents noise and false positives.

**Use cases:**
- Editing `.tsx` file → react-expert + typescript-expert load
- Editing `.vue` file → vue-expert loads, others don't
- Editing `pubspec.yaml` → flutter-expert loads

---

## Part 6 — Developer Experience

### 6.1. Six-Command Surface

**What:** `/run` (universal) + `/check` (quality) + `/design` (pre-code) + `/project` (config) + `/af` (system) + `/help`. Down from 26 commands pre-v3.6.

**How applied:** Commands auto-detect intent. `/run fix login` → bugfix-quick skill. `/run implement X` → 5-phase workflow.

**Why you need it:** 26 commands cause discovery paralysis. 6 covers every workflow. `/run` alone handles 80% of uses.

**Use cases:**
- New user — can memorize 6 commands in 30 seconds
- Experienced user — muscle memory for `/run` on everything

---

### 6.2. Complexity Routing (Quick / Standard / Deep)

**What:** Auto-detected task complexity picks a strategy. Quick (single file) → direct edit. Standard (2-5 files) → single agent. Deep (6+ files) → 5-phase TDD.

**How applied:** Agent-detector scores complexity and routes. User doesn't pick.

**Why you need it:** Forcing 5-phase on typos is overkill. Doing direct edit on architecture is reckless. Matching effort to risk ships faster without skipping what matters.

**Use cases:**
- Typo fix → 3K tokens, 10 seconds
- New feature → 15-25K tokens, 5-10 min
- Architecture → 60-90K tokens, 20-40 min

---

### 6.3. Session Continuation — Handoff & Resume

**What:** `/run handoff` snapshots workflow state. `/run resume <id>` restores. Survives `/compact`, session close, multi-day breaks.

**How applied:** `skills/session-continuation/SKILL.md` + `.claude/logs/runs/<id>/` state files + git phase checkpoints.

**Why you need it:** Long workflows exceed single-session context. Without handoff, you restart. With handoff, you continue exactly where you stopped.

**Use cases:**
- Deep tasks spanning 2+ hours
- Multi-day features
- Handing off to a teammate

---

### 6.4. Prompt Evaluator — Quality + Variance (`skills/prompt-evaluator/SKILL.md`)

**What:** Three modes: (1) Usage analytics, (2) Prompt quality scoring (5-dimension), (3) Output variance (N-run stability check).

**How applied:** `/af prompts` runs usage analytics. "evaluate this prompt" triggers quality mode. User triggers variance mode before production.

**Why you need it:** Prompts drift in quality over time. Outputs can be unstable across runs. Variance check catches prompts that only sometimes work.

**Use cases:**
- Before shipping a prompt that will run 50+ times
- Debugging "sometimes works, sometimes doesn't" complaints
- CI automation validation

---

## Part 7 — Observability & Learning

### 7.1. Learning System (`.claude/learning/` or Supabase)

**What:** Captures user corrections + approval rates + pattern feedback. Auto-generates `learned-rules.md` after 3+ similar corrections.

**How applied:** `hooks/auto-learn.cjs` detects correction patterns, stores them. `/af learn analyze` synthesizes rules.

**Why you need it:** You keep fixing the same kinds of mistakes. Learning turns corrections into persistent rules.

**Use cases:**
- "Always use const, not let" → auto-detects, saves pattern
- Team preferences emerge from correction frequency
- Cross-session memory of your style

---

### 7.2. Metrics & Observability

**What:** `/af metrics`, `/run budget`, `/run progress`, `/run predict`. Token use, phase durations, velocity, rejection rates.

**How applied:** Hook-collected metrics + TOON-format reports.

**Why you need it:** Visibility into what workflows actually cost. Predict before committing to a big task.

**Use cases:**
- Before a task: `/run predict <task>` → "~95K tokens, Deep, feasible in 1 session"
- During: `/run budget` → "78% used, handoff soon"
- After: `/af metrics` → team averages, bottlenecks

---

## Part 8 — Integrations

### 8.1. 6 Bundled MCP Servers

**What:** `context7` (library docs), `playwright` (browser), `vitest` (tests), `firebase`, `figma`, `slack`. Auto-invoked by context.

**How applied:** `.mcp.json` at plugin root. Claude Code loads servers automatically.

**Why you need it:** Each MCP is one config file to maintain. Ready to use from install.

**Use cases:**
- "Build with MUI" → context7 fetches current MUI docs
- "Run E2E tests" → playwright launches browser
- "Deploy to Firebase" → firebase MCP handles project
- "Fetch Figma design" → figma MCP pulls file

---

### 8.2. Externalized Addons (Godot, SEO)

**What:** Specialized modules live in separate plugins (`aura-frog-godot-addon`, `aura-frog-seo-addon`) — opt-in, not bundled.

**How applied:** Install the addon if you need it; the core plugin stays lean.

**Why you need it:** Most users don't need Godot or SEO specialists. Bundling them would bloat the core 20%.

**Use cases:**
- Game dev: install Godot addon
- Content site: install SEO addon
- General web/mobile: neither needed

---

## Part 9 — Tool-Agnostic Investment

### 9.1. Portable Instruction Layer (`docs/PORTABILITY.md`)

**What:** Most of the plugin (rules, skills, agent definitions, commands) is markdown. Only the hook layer is tool-specific. Weighted portability: **~87%**.

**How applied:** Every rule and skill is written as tool-neutral prompting. Frontmatter fields that some tools don't support are treated as optional hints, not load-blockers. The hook layer sits behind a well-defined event interface that maps cleanly to Cursor, Codex, Windsurf, etc.

**Why you need it:** AI coding tools are evolving fast. Claude Code may not be your team's primary tool in 12 months. The rules/skills/agents you craft now should survive — only the thin adapter changes.

**Use cases:**
- Team currently on Claude Code, considering Cursor for some workflows
- Enterprise standardizing on one tool but wanting an exit strategy
- Solo developer who wants to try multiple tools without maintaining multiple workflow libraries
- Open-source project that wants contributors on any tool to get the same discipline

**What you get on each tool:**

| Tool | Install status | Coverage |
|------|----------------|:--------:|
| Claude Code | First-class, released | 100% |
| Codex | Adapter in planning (Q2 2026) | ~85% — skills + commands + MCP, no hooks |
| Cursor | Adapter planned (Q2 2026) | ~80% — rules + skills + agents, different extension model |
| Windsurf | Community request, no committed timeline | ~75% estimated |

**Porting cost:** ~1–2 days per target tool to write the hook adapter. The universal layer copies as-is.

Details: [`docs/PORTABILITY.md`](../PORTABILITY.md).

---

## Summary — When to Use Aura Frog

✅ **Yes, install if you:**
- Build production code (vs. prototypes)
- Value TDD and test coverage
- Work on multi-file features
- Want structured workflows with approval gates
- Care about prompt-injection safety
- Need multi-session continuity
- Want token-cost visibility

⚠️ **Maybe not if you:**
- Only do throwaway scripts / single-file edits
- Don't want any workflow overhead
- Have strict Haiku-only budgets (some features use Sonnet)
- Prefer minimalist plugins (Aura Frog is substantial — 9 agents, 44 skills, 57 rules)

🎯 **Best fit:** Teams shipping production features where quality + security + cost control all matter.

---

## Related Docs

- [README.md](../../README.md) — Quick start + walkthrough
- [GET_STARTED.md](../getting-started/GET_STARTED.md) — Full install + first workflow
- [CHANGELOG.md](CHANGELOG.md) — Release history
- [AGENT_TEAMS_GUIDE.md](../guides/AGENT_TEAMS_GUIDE.md) — Multi-agent parallel work
- [MCP_GUIDE.md](../operations/MCP_GUIDE.md) — MCP setup + creating your own
