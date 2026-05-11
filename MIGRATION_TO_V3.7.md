# Migrating to Aura Frog v3.7.0

**Released:** 2026-05-11
**Type:** MINOR version bump (3.6.x → 3.7.0) — backward-compatible
**Migration required:** None mandatory; everything new is opt-in

---

## TL;DR for existing users

**You do not have to change anything.** Your existing `/run` workflow, your existing 9 agents, your existing 6 commands all continue to work exactly as before.

What's new (all opt-in):

- 🎯 `/aura-frog:plan` — hierarchical planning (T0-T4), persistent across sessions, forensic decision trail
- 🔍 `/aura-frog:trace` — every Claude decision auditable with grounded/ungrounded flags
- ❄️ `/aura-frog:plan-freeze` + `/aura-frog:plan-conflicts` — detect file/function overlaps between parallel work
- 🩺 `/aura-frog:heal` — F2/F3 self-heal proposals (never auto-applies)
- 🛡️ `/aura-frog:mcp` — per-agent MCP allowlist + audit + rate limits
- 📊 `/aura-frog:dashboard` — terse one-screen CLI status
- 🔌 `/aura-frog:extend` — create project-level skills/rules/commands at `.claude/`
- 🔄 `/aura-frog:reset-session` — distill T2 done into permanent_memory

---

## 🐸 The 8 Pillars at a glance

| # | Pillar | Theme | v3.7.0 ships | v3.7.1+ queued |
|---|---|---|---|---|
| 1 | Hierarchical Planning | Structure | T0-T4 tree · 8 commands · 5 planning agents · 2 hooks | — |
| 2 | Reasoning Trace Audit | Accountability | tracer hook · grounding-discipline rule · `/aura-frog:trace` | helper CLI scripts ([#6](https://github.com/nguyenthienthanh/aura-frog/issues/6)) |
| 3 | Semantic Session Reset | Memory | epic-summarizer · permanent-memory-loader · `/aura-frog:reset-session` | — |
| 4 | Pre-flight Validation | Accountability | 7 Tier-1 bash linters + bypass-with-3-warn | Tier 2 OPA + 5 .rego policies |
| 5 | Semantic Conflict Detection | Resilience | L1 (file) + L2 (function) + freeze cascade + arbiter | L3 (semantic LLM) + L4 (architectural LLM) |
| 6 | Self-Healing Orchestrator | Resilience | manual `/aura-frog:heal diagnose` · ≥0.7 confidence · never auto-applies | auto-trigger hook on F2/F3 classification |
| 7 | MCP Security Layer | Security | per-agent allowlist + audit + rate limits + sanitizer | SQLite WAL ([#8](https://github.com/nguyenthienthanh/aura-frog/issues/8)) |
| 8 | Phase-Role Binding | Structure | hard rule in `cross-review-workflow.md` + run-orchestrator | — |

Full marketing-quality breakdown with examples + diagrams: [README.md § The 8 Pillars](README.md#-the-8-pillars-of-the-planning-first-llm-os).

---

## What's new (the bigger story)

v3.7.0 turns Aura Frog from a "5-phase TDD workflow with agents" into a **planning-first LLM Operating System**. The five major systems shipped across alpha → beta → rc → stable:

### 1. Hierarchical planning (alpha.1 — FEAT-A)

Plans persist as first-class artifacts at `.aura/plans/`. Five tiers:

```
T0 Mission         "Why does this project exist?"
T1 Initiative      "Multi-feature effort over weeks"
T2 Feature         "User-facing capability"
T3 Story           "TDD-bounded unit"
T4 Task            "Atom — single agent invocation"
```

Activate with `/aura-frog:plan`. Plans survive session reset and context compaction. `master-planner` agent owns the tree; specialist agents (architect, frontend, etc.) execute T4 atoms.

### 2. Failure handling + reasoning trace (alpha.2 — FEAT-B)

Every failure is classified F1-F5 deterministically (no LLM): transient / local-logic / local-design / story-level / architectural. Each class has a recommended action (retry / replan / freeze / escalate).

Every Claude tool call emits a trace event to `.aura/plans/traces/{TASK_ID}.jsonl`. `/aura-frog:trace --hallucinations` surfaces output_claims that weren't grounded in prior file_reads — your hallucination canary.

### 3. Memory tier + extensions + pre-flight (alpha.3 + alpha.4 + beta.1 — FEAT-C)

**Memory tier**: when a T2 (Feature) reaches `done`, `epic-summarizer` distills the Epic into a permanent_memory section (≤500 tokens). `/aura-frog:reset-session` cleanly resets the conversation while preserving history.jsonl, plan tree, and permanent_memory.

**Extensions**: `/aura-frog:extend` creates project-specific skills / rules / commands at `.claude/` — never at the plugin level. The plugin stays generic; per-project knowledge stays with the repo.

**Pre-flight**: 7 Tier 1 bash linters run on every PreToolUse — block `rm -rf /`, hostile paths, AWS/GitHub/OpenAI credentials, path traversals. Bypass per-call only with `/aura-frog:preflight bypass <reason ≥10 chars>`.

### 4. Conflict detection + freeze (beta.2 — FEAT-D)

Before any T4 dispatch, L1 (file overlap) + L2 (function overlap) detection compares proposed artifacts against pending-confirm siblings. On conflict, `conflict-arbiter` decides: auto_thaw / auto_discard / sequential_reorder / replan / escalate / user_priority. Freeze cascades to descendants only (not siblings) per spec §13.1.

### 5. Self-healing + MCP security + polish (rc.1 — FEAT-E)

**Self-healing**: F2/F3 failures only. Confidence ≥0.7 to propose. NEVER auto-applies — every proposal goes through the standard approval flow. Counts toward `replan_budget`.

**MCP security**: per-agent allowlist (frontmatter `mcp_servers:`), sanitized audit log, rate limits (soft 80% warn / hard 100% block). DB MCPs (postgres/redis) are HARD-LOCKED to architect + tdd-engineer only, read-only by default.

**Phase-Role hard rule**: Phase 4 reviewer ≠ Phase 3 builder (formalized as enforced, was advisory).

**Dashboard**: `/aura-frog:dashboard` — terse one-screen status (plan tree, conflicts, memory, MCP, pre-flight).

---

## Backward compatibility — what continues to work

| Old behavior | v3.7.0 status |
|---|---|
| `/run <task>` | ✅ Unchanged; still primary entry for one-off work |
| Existing 9 agents (architect, frontend, etc.) | ✅ All work; gained `mcp_servers:` allowlists (tightening — see breaking changes) |
| Existing 6 commands (/run, /check, /design, /project, /af, /help) | ✅ Unchanged |
| 5-phase TDD workflow | ✅ Unchanged; now maps to T3 Story lifecycle when planning is active |
| `.envrc` env vars | ✅ All existing vars work; new ones added (see env additions) |
| `.mcp.json` schema | ✅ Unchanged structure; 2 new servers added (postgres, redis), both `disabled: true` |
| Existing skills/rules/hooks | ✅ All preserved |
| Project context files (`.claude/project-contexts/`) | ✅ Unchanged |

---

## Breaking-ish changes (zero hard breaks, two semi-breaks)

1. **MCP allowlists tightened on baseline agents.** Previously, every agent could call every MCP (default = backward-compat). v3.7.0 ships explicit `mcp_servers:` allowlists on the 9 baseline agents per spec §8.8 recommendations:

   | Agent | Now allowed |
   |---|---|
   | architect | context7, postgres, redis |
   | frontend | context7, figma, playwright |
   | mobile | context7, figma, playwright |
   | strategist | context7 |
   | tester | vitest, playwright |
   | security | (none) |
   | devops | firebase, slack |
   | lead | (none — orchestrator only) |
   | scanner | (none) |

   **Impact**: if you had custom code dispatching `security` agent to call an MCP, it now blocks. To restore old behavior on a specific agent, edit the agent file's `mcp_servers:` field (e.g., add `[context7]` to security).

2. **Pre-flight hook auto-blocks destructive commands.** Things like `rm -rf /` were always discouraged; now they're hard-blocked at PreToolUse. To bypass intentionally: `/aura-frog:preflight bypass <reason ≥10 chars>` (single-use per call).

   **Impact**: scripts/workflows that intentionally run destructive commands (very rare in user flows) need to bypass per call. The list of hard-blocks is in `aura-frog/scripts/preflight/check-command-allowlist.sh`.

---

## Opt-in features — how to enable each

### Enable hierarchical planning

```bash
# In your project directory:
/aura-frog:plan  # interview-bootstrap; creates .aura/plans/

# Or non-interactive:
bash aura-frog/scripts/plans/new-plan.sh
```

`.aura/` is added to `.gitignore` by default (per decision Q2). Commit it if you want plans tracked in git.

### Enable JIRA ticket auto-fetch

```bash
# Add to .envrc:
export JIRA_BASE_URL=https://yourcompany.atlassian.net
export JIRA_EMAIL=you@example.com
export JIRA_API_TOKEN=<token from id.atlassian.com>
# Optional allowlist to filter false positives like RFC-123:
export JIRA_PROJECT_PREFIXES=PROJ,IGNT,JIRA
```

Now any prompt mentioning a ticket like `PROJ-123` auto-fetches via the Atlassian REST API. Cached at `.claude/logs/jira/{ID}.json` for 24h. Surfaced as projected TOON (not raw JSON) in context.

### Enable postgres / redis MCPs

```bash
# 1. Add to .envrc:
export POSTGRES_CONNECTION_STRING=postgresql://...
export REDIS_URL=redis://...

# 2. Edit aura-frog/.mcp.json — set "disabled": false for the server(s) you want

# 3. The architect + tdd-engineer agents are already allowlisted; other agents will be blocked
```

DB MCPs are **read-only by default**. Writes require `--allow-write` in the tool args. Destructive ops (DROP/TRUNCATE/DELETE without WHERE) are hard-blocked regardless.

### Disable any new feature

| Feature | Disable env var |
|---|---|
| Self-healing | `AF_SELF_HEAL_DISABLED=true` |
| MCP audit logging (still enforces allowlist + rate limits) | `AF_MCP_AUDIT_DISABLED=true` |
| Reasoning trace recording | `AF_TRACE_DISABLED=true` |
| Pre-flight validation | `AF_PREFLIGHT_DISABLED=true` (strongly discouraged) |
| Conflict detection L3-L4 | `AF_CONFLICT_LLM_DISABLED=true` (already off in rc.1 — L3/L4 are stubs) |
| JSON→TOON projection | `AF_JSON_TOON_DISABLED=true` (reverts to raw JSON in context) |

---

## New env vars

```bash
# Hierarchical planning
# (no env vars — opt-in via /aura-frog:plan command)

# JIRA auto-fetch (alpha.3)
JIRA_BASE_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_PREFIXES=PROJ,IGNT     # optional allowlist

# Pre-flight (beta.1)
AF_PREFLIGHT_DISABLED=true          # disable entirely (discouraged)
AF_PENDING_TIMEOUT_HOURS=24         # T4 idle warning threshold

# JSON projection (alpha.4)
AF_JSON_TOON_DISABLED=true          # revert to raw JSON in context
AF_JSON_TOON_MIN_BYTES=2000         # threshold for auto-projection

# Self-healing (rc.1)
AF_SELF_HEAL_DISABLED=true          # disable entirely

# MCP security (rc.1)
AF_MCP_AUDIT_DISABLED=true          # disable logging (still enforces)
AF_MCP_AUDIT_RETENTION_DAYS=30      # rotation
POSTGRES_CONNECTION_STRING=         # required for postgres MCP
REDIS_URL=                          # required for redis MCP
```

---

## Counts summary

| Component | v3.6.1 | v3.7.0 | Delta |
|---|---:|---:|---:|
| Agents | 9 | **15** | +6 |
| Skills | 44 | **55** | +11 |
| Auto-invoke skills | 5 | **9** | +4 |
| Rules | 57 | **70** | +13 |
| Commands | 6 | **24** | +18 |
| Hooks | 28 | **42** | +14 |
| MCP servers | 6 | **8** | +2 |
| Scripts | ~43 | **55** | +12 |

Token overhead stays bounded: always-loaded ≤ 14,000 tokens (7% of 200K context) per spec §26.

---

## Internal pre-release tags shipped along the way

For reference (these are all on GitHub Releases under "Pre-release"):

```
v3.7.0-alpha.1   Planning foundation              (2026-04-29)
v3.7.0-alpha.2   Failure handling + trace         (2026-04-29)
v3.7.0-alpha.3   Project-level extension creation (2026-05-04)
v3.7.0-alpha.4   Memory tier                      (2026-05-05)
v3.7.0-beta.1    Pre-flight Tier 1                (2026-05-06)
v3.7.0-beta.2    L1+L2 conflict detection         (2026-05-07)
v3.7.0-rc.1      Self-healing + MCP security      (2026-05-07)
v3.7.0           Stable — marketplace publish     (2026-05-11)
```

---

## Known issues (and fixes)

### "Stop hook error: Plugin directory does not exist" referencing an old version

**Symptom:**

```
Stop hook error: Failed to run: Plugin directory does not exist:
/Users/<you>/.claude/plugins/cache/aurafrog/aura-frog/3.6.1
(aura-frog@aurafrog — run /plugin to reinstall)
```

**Cause:** This is a Claude Code session-state issue, not a plugin code bug. When a Claude Code session starts, it captures `CLAUDE_PLUGIN_ROOT` as an env var pointing at the currently-installed plugin cache directory (e.g., `.../aura-frog/3.6.1/`). If that plugin version is later uninstalled or replaced (e.g., when you update from v3.6.1 → v3.7.0), the env var in the existing session points at a deleted directory. The session's PostToolUse / Stop hooks then fail when they try to spawn `node "${CLAUDE_PLUGIN_ROOT}/hooks/..."`.

**Fix (2 steps):**

```
# In Claude Code:
/plugin update aura-frog

# Then close the current session and start a new one.
# The new session will capture a fresh CLAUDE_PLUGIN_ROOT pointing at v3.7.0.
```

**Why the plugin can't auto-fix this:** the broken path resolution happens in Claude Code's runtime *before* any plugin code runs. By the time our hook would have a chance to handle it, the spawn has already failed. Restarting the session is the only clean recovery.

**Prevention:** when upgrading the plugin, restart your Claude Code session afterward. The `/plugin update` command refreshes the install pin but does not retroactively update env vars in already-running sessions.

---

## What's deferred (intentional — ships in v3.7.x patch releases)

- **L3 (semantic LLM) + L4 (architectural LLM) full implementations** — currently stubbed; LLM dispatch + `conflict_cache.jsonl` LRU pending real-world tuning data
- **Pre-flight Tier 2 (OPA, optional)** — bash linters (Tier 1) ship and cover 90% of value; OPA Rego policies are opt-in for power users with policy-as-code workflows
- **Acceptance fixture suites** — 80-case classifier, 20-case hallucination, 15-case logic-error, 30-case L1, 20-case L2 corpora per spec §28.7; full fixtures generate from real usage in v3.7.1+
- **Trace-event latency benchmark** — spec target <100ms per emission; works in practice but no formal benchmark suite yet
- **deviation_score auto-update** — formula in `replan-thresholds.md` is defined and used by `replanner` but the post-execute hook does not yet auto-compute; manual setting only
- **/aura-frog:plan-promote and /aura-frog:plan-replan full impl** — protocols documented, basic execution works, advanced features (LLM-driven alternative generation in replan) deferred

None of these are blockers — the system is fully functional with current behavior.

---

## Spec reference

The complete authoritative spec lives at `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` in the repo (gitignored in distribution — owner-internal). All design decisions (§32) are locked: 17 questions answered with spec-recommended defaults.

---

## Help & feedback

- Issue tracker: https://github.com/nguyenthienthanh/aura-frog/issues
- Release notes: https://github.com/nguyenthienthanh/aura-frog/releases/tag/v3.7.0
- Marketplace listing: (link after publish)
