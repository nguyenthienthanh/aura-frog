---
title: Aura Frog — Consolidated Roadmap & Research
last_aligned_with: v3.8.0-alpha.7
status: canonical
audience: contributor
generated: 2026-07-09
---

# Aura Frog — Consolidated Roadmap & Research

> **Single source of truth for pending work + research.** This document consolidates:
> the 2026-07-03 three-agent codebase audit, in-session research (codebase-memory-mcp,
> model/effort statusline, plugin-memory architecture), the plan-tree pending tasks
> (`.claude/plans/MASTER_PLAN.md` — local working copy), and the six GitHub issues
> (#6, #7, #8, #9, #21, #22), which are closed in favour of this file.
>
> Plan-tree node files under `.claude/plans/` remain the execution system (they are
> git-ignored working state); this doc is the durable, reviewable narrative.

---

## 1. Status at a glance

| Feature | Theme | Status |
|---|---|---|
| FEAT-006 | Docs cleanup | ✅ done (shipped) |
| FEAT-008 | Context-persistence | ✅ done (committed `bf11d0e`) |
| **FEAT-010 · STORY-0021** | Security hotfixes (P0-1..4) | ✅ **done + committed `4296bd8f`** |
| FEAT-007 | Hook-runtime v3.8 refactor | 🚧 STORY-0009 3/5 tasks done; rest planned |
| FEAT-010 | Plans/scripts hardening | 🚧 STORY-0021 done; 0022–0025 planned |
| FEAT-011 | Research integrations | ⏳ planned |
| FEAT-009 | Frontend design quality | ⏳ planned |

Actual on-disk counts (v3.8.0-alpha.7): **15 agents · 56 skills · 71 rules · 24 commands · 47 hooks · 8 MCPs**.

---

## 2. Research synthesis — memory & codebase understanding for a portable plugin

**Goal:** when aura-frog is installed into an *arbitrary* project, how does the agent gain
persistent "memory" and fast structural understanding without paying a huge token cost each session?

> ⚠️ A fresh external web scan (2025-26 sources) was attempted 2026-07-09 but every search
> agent hit the session rate limit (resets 14:10 Asia/Saigon). The synthesis below is from
> the in-session deep-dive on **codebase-memory-mcp** + the map of aura-frog's own memory
> tiers. A follow-up external scan (Obsidian vaults, Serena, vector search) is still open.

### 2.1 The four approaches

| Approach | What it is | Token cost | Staleness | Portability | Friction / privacy |
|---|---|---|---|---|---|
| **(a) Code knowledge-graph / AST-indexing MCP** (codebase-memory-mcp, Serena) | tree-sitter + LSP → queryable graph of functions/calls/imports | Very low per query (~100× cheaper than file-by-file); high one-time index | git-poll incremental re-index | 158 langs syntactic, ~9 type-aware | Native binary to install; local SQLite (private) |
| **(b) Embedding / vector search** | semantic chunks → vector DB | Low query; embedding cost + model dep | must re-embed changed files | language-agnostic | needs embedding model/DB; unbounded retrieval risk |
| **(c) Obsidian-style linked-markdown vault** | human+AI curated `[[wikilink]]` notes | Bounded (load only headers/links) | manual/curated → drifts | fully portable (plain md) | zero infra; the model curates |
| **(d) File-registry + snapshot** (aura-frog today) | generated repo-map + file-registry + SHA-stamped snapshot | Bounded (120–800 always-loaded) | git-SHA + content-hash invalidation | fully portable (bash/md) | zero infra |

### 2.2 What aura-frog already has (mapped)

- **Layered memory, not retrieval** (design philosophy): four physical tiers, each with its own
  load discipline + trust ceiling; token cost bounded regardless of project age.
- `permanent-memory-loader` (≤120 tokens always-loaded) + `epic-summarizer` (distills done Epics).
- Project-context system: `repo-map.md`, `file-registry.yaml`, `architecture.md`, and the
  FEAT-008 SHA-stamped `snapshot.md` with self-healing auto-refresh.
- `.claude/memory/` uses **Obsidian-style `[[name]]` links already** — approach (c) is partly in place.

### 2.3 Recommendations (feed FEAT-011)

1. **Adopt (a) as opt-in, not default.** Add codebase-memory-mcp to `.mcp.json` disabled-by-default
   (mirror postgres/redis); plugin must NOT run its installer. Add a context-economy rule: prefer
   `search_graph`/`trace_path` over broad Read/Grep when the server is present. Biggest win on
   *large* host projects; on small repos the snapshot already suffices. → **FEAT-011 / STORY-0026**.
2. **Deterministic code-graph is philosophy-compatible** (bounded per-query, grounded) — unlike
   unbounded vector retrieval, which the spec explicitly rejects.
3. **Lean into approach (c)** for cross-project memory: the `[[wikilink]]` memory vault is portable
   and infra-free; strengthen the linking discipline rather than add a vector DB.
4. **Use `detect_changes`/`trace_path` as the deterministic backend for the deferred L3/L4 conflict
   levels** instead of LLM calls (cheaper, grounded). → **FEAT-011 / STORY-0028 (spike)**.

---

## 3. Audit findings (2026-07-03, main @ 8b0405f) — bugs & security

Three parallel Fable-5 audits (47 CJS hooks · bash scripts · refs/doc integrity).

### 3.1 Fixed & shipped — FEAT-010 / STORY-0021 (commit `4296bd8f`)

| ID | Severity | Fix |
|---|---|---|
| P0-1 | **CRITICAL** | `mcp-call-gate.cjs` read unset `CLAUDE_TOOL_NAME` env → allowlist/rate-limit/audit dead. Now reads stdin (`readHookInputCompat`) + windowed rate-counter reset. |
| P0-2 | HIGH | `workflow-edit-learn.cjs` command injection via crafted filename → `execFileSync` (no shell). |
| P0-3 | HIGH | `check-path-safety.sh` traversal/sibling-prefix bypass → canonicalize + trailing-slash prefix. |
| P0-4 | HIGH | `_lib.sh next_counter` race minted duplicate IDs → `with_lock()` mkdir-spinlock + atomic mktemp; missing key returns non-zero. |

### 3.2 Remaining verified bugs (still open)

**Hooks (→ FEAT-007):**
- ~9 hooks read `CLAUDE_TOOL_*` env the API never sets → functionally dead (`pre-flight-validate`,
  `post-execute-update-node` (F1-F5 classifier pipeline), `tdd-red-failure-tracker`, `smart-learn`,
  `json-toon-projector`, `tool-call-tracer`, `security-scan`, `auto-test-runner`). → STORY-0009/TASK-00026.
- Session-identity split: writers key by `session_id`, 9 readers key by `ppid` → readers see empty
  state forever. → STORY-0010/TASK-00039.
- Field-name mismatches: `feedback-capture` (`data.tool`), `post-compact` (`.claude/` vs `.claude/cache/`),
  `thinking-boost` (dead cache keys). → STORY-0010/TASK-00040.
- Unlocked read-modify-write on learning JSON stores; `pruneJsonlByTimestamp` ignores the append lock. → STORY-0011/TASK-00041.
- `session-state.cjs:143` missing `require('fs')`; `post-execute-conflict-rescan` treats any Read as
  "blocker done"; `task-track-model` never searches `CLAUDE_PLUGIN_ROOT/agents` (dead for installed users). → STORY-0029/TASK-00042.

**Bash scripts (→ FEAT-010):**
- `audit-refs.sh` regex can't see full paths → real dead links pass the gate (e.g. `prune-checkpoints.sh`). → STORY-0022.
- `resolve-node.sh` null-field exits 1 not 2; `next-task.sh` rollback leaves `active.json` stale;
  `for f in ${ALL_NODES}` word-splits on paths with spaces; `validate-plan-tree.sh` DAG detects only
  2-cycles (A→B→C→A validates clean); `link-run.sh` regex-unsafe RUN_ID + non-transactional write;
  `promote-node.sh`/`_lib.sh` escaping; `phase-transition.sh` literal `temp.json`; `run-all.sh --files`
  parsing broken. → STORY-0023.

**From GH security review (#21):** `safe-stdin.cjs:132` watchdog message is plain-text via buffered
`stderr.write` → can interleave/corrupt NDJSON. → fold into STORY-0012 (perf/hardening).

---

## 4. Pending task roadmap (execution order)

Phases mirror `.claude/plans/MASTER_PLAN.md`. Suggested order prioritises verified-bug elimination.

> **Session progress 2026-07-09** (commits `4296bd8`→`7b28849`): STORY-0021 done;
> STORY-0023 partially done — fixed `resolve-node` null-field exit code, `validate-plan-tree`
> full-DFS cycle detection + `ALL_NODES` word-splitting, and `run-all.sh --files` parsing (each
> with tests). **STORY-0023 remaining:** `next-task.sh` rollback leaves `active.json` stale;
> `link-run.sh` regex-unsafe RUN_ID + non-transactional write; `promote-node.sh`/`_lib.sh`
> escaping; `phase-transition.sh` literal `temp.json` (7 call-sites — needs per-site mktemp).

| # | Work | Maps to | GH issue | Effort |
|---|---|---|---|---|
| ✅ | Security hotfixes P0-1..4 | FEAT-010/STORY-0021 | — | done |
| 1 | audit-refs rewrite + fixture self-test | FEAT-010/STORY-0022 | — | 1-2d |
| 🚧 | Plans-scripts correctness batch (resolve-node + DAG + run-all done) | FEAT-010/STORY-0023 | — | ~1d left |
| 3 | Consolidate learning hooks | FEAT-010/STORY-0025 | — | 2-3d |
| 4 | CI gates (shellcheck + hooks parity) | FEAT-010/STORY-0024 | — | 1-2d |
| 5 | hook-runtime lib finish (migrate dead hooks) | FEAT-007/STORY-0009 | **#6** | 3-5d |
| 6 | Drop env-var dependence + session identity | FEAT-007/STORY-0010 | **#7** | 2-3d |
| 7 | JSONL → SQLite WAL audit/trace | FEAT-007/STORY-0011 | **#8** | 2-3d |
| 8 | Hook performance budget (≤200ms) + watchdog NDJSON | FEAT-007/STORY-0012 | **#9, #21** | 3-4d |
| 9 | Hook bug-cleanup batch | FEAT-007/STORY-0029 | — | 2-3d |
| 10 | c8 subprocess coverage instrumentation | FEAT-007/STORY-0009 | **#22** | 1d |
| 11 | codebase-memory-mcp opt-in + context rule | FEAT-011/STORY-0026 | — | 2-3d |
| 12 | model/effort statusline | FEAT-011/STORY-0027 | — | 1-2d |
| 13 | L3/L4 graph-conflict spike (stretch) | FEAT-011/STORY-0028 | — | spike |
| 14 | Frontend design quality (aesthetics/tokens/Stitch/DevTools) | FEAT-009/STORY-0016–0020 | — | 9-13d |

**GH issue → plan-node map (nothing lost on close):** #6→STORY-0009 · #7→STORY-0010 · #8→STORY-0011 ·
#9→STORY-0012 · #21→STORY-0012 (watchdog NDJSON) · #22→STORY-0009 (c8 coverage).

---

## 5. Feature / UX optimisation ideas (backlog)

- **model/effort in statusline** — surface which agent runs on which model + reasoning effort at each
  dispatch (infra 70% present via `task-track-model.cjs`; needs `tool_input.model` priority, `effort:`
  parsing, PLUGIN_ROOT resolution). → FEAT-011/STORY-0027.
- **First-install onboarding** — progressive disclosure, sane defaults, one primary action per screen
  (aligns with the house "12-year-old friendly" UX rule). *External UX-pattern scan pending (rate-limited).*
- **Opt-in code-graph** for large host projects (§2.3).

---

## 6. Doc cleanup ledger

**Removed (2026-07-09)** — 4 redundant/superseded docs, with all referrers rewired so
`audit-refs.sh`, `validate-docs-syntax.sh`, and `validate-readme-counts.sh` stay green:

- `docs/marketing/overview.pre-v3.0.md` (archive)
- `docs/marketing/README.pre-v3.7.2-rewrite.md` (archive)
- `docs/marketing/USAGE_GUIDE.pre-v3.7.md` (archive)
- `MIGRATION_TO_V3.7.md` (root; superseded at v3.8)

Referrers updated: both CI scripts' file lists, README nav link, and the stale README/docs/README/
CONTRIBUTING hook counts (43/45 → 47, matching `stats.json`).

Kept (not redundant): the `docs/specs/*` V3.7.0 records (historical), `docs/guides/*` (active content),
`docs/showcase/*` (examples).
