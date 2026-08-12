---
last_aligned_with: v3.8.0-alpha.9
status: current
audience: contributor
---

# Architecture v4 Proposal — Aura Frog

**Status:** DRAFT — awaiting maintainer approval. No code in this document has been applied.
**Basis:** 33 adversarially-verified audit findings (2026-08-11 full-repo audit, 42-agent workflow) + platform research with sources. Every claim below cites either a repo file or a URL.
**Scope:** structural changes only. The four quick-fix groups (hooks runtime, plan-tree correctness, tests/CI, docs/budget) land independently of this proposal.

---

## 1. Current architecture (as measured, not as documented)

Aura Frog layers a "planning-first LLM OS" over Claude Code:

- **Prose control plane** — CLAUDE.md kernel doc, 25 command files, 60 skill dirs, 73 rule files, 25 agent files. Enforced by description-matching and instruction text.
- **Deterministic plane** — ~51 CJS hook scripts registered via `hooks/hooks.json`, now mostly funneled through `dispatch.cjs` (one node process per chain).
- **Shared substrate** — the plan tree (`.claude/plans/`: `active.json`, features/stories/tasks markdown, traces, conflicts.jsonl), mutated by hooks and `scripts/plans/`, narrated by skills.

The 5-phase `/run` flow and the plan tree are **not** duplicated — `rules/workflow/run-plan-bridge.md` genuinely bridges them (audit confirmed; earlier suspicion withdrawn).

## 2. Verified structural problems

| # | Problem | Evidence |
|---|---------|----------|
| P1 | **Auto-invoke layer rests on frontmatter the platform ignores.** 9 skills declare `autoInvoke: true` / `priority` / `triggers` — fields `docs/reference/MAINTENANCE.md` §2 itself lists as *not official*. 37 skills use non-official `triggers:` vs 23 using official `when_to_use`. Only description text actually drives invocation. Plan-context loading and trace recording are *already* enforced by real hooks (`pre-execute-load-plan-context.cjs`, `tool-call-tracer.cjs`) — the skills duplicating them are redundant. | `skills/agent-detector/SKILL.md:4`, `MAINTENANCE.md` §2, `aura-frog/CLAUDE.md` "Auto-Invoke Skills" |
| P2 | **Session/workflow state has no owner.** Phase/workflow state lives in ≥6 stores — `os.tmpdir()/af-session-{ppid}.json`, `.claude/cache/workflow-state.json`, `.claude/logs/workflows/<id>/workflow-state.json`, `active-workflow.txt` (two candidate dirs), `.claude/workflows/current-phase.txt` — and each hook resolves them in a *different order* (`compact-handoff.cjs`: files→env; `subagent-init.cjs`: env→files; `session-metrics.cjs`: pointer→mtime). Two hooks can disagree about the current phase. `compact-handoff.cjs` never even requires the `session-state.cjs` library. | `compact-handoff.cjs:26`, `subagent-init.cjs:53-78,167-169`, `session-metrics.cjs:28-66` |
| P3 | **Always-loaded context budget is broken and misreported.** Core rules tier ≈10k words while every budget doc claims ~2k tokens; every-turn skills burn ~13k words/turn; with 60 skills the plugin almost certainly overflows Claude Code's skill-listing budget (1% of context window; overflow silently drops descriptions of least-used skills — killing their triggering). | `rules/README.md:14`, `skills/permanent-memory-loader/SKILL.md`, [docs: skills](https://code.claude.com/docs/en/skills) |
| P4 | **Dead config layer.** `ccpm-config.yaml` ships a 9-phase workflow nothing reads; `.mcp.json` carries 5 `disabled: true` servers that Claude Code starts anyway (measured: ~3.3 GB across wrappers); CI commits derived `stats.json` back to main after nearly every merge. | `ccpm-config.yaml:29`, `.mcp.json`, `.github/workflows/ci.yml:151` |

## 3. Target architecture — five workstreams

### W1 — Single state owner (highest impact)

One module owns session/workflow state; everything else goes through it.

- Extend `hooks/lib/session-state.cjs` into the **only** read/write path for phase + workflow identity. One canonical file, one documented schema, atomic writes (tmp+rename, already the repo idiom).
- Formalize what the repo already half-does: **append-only JSONL as the source of truth** (traces, checkpoints, history), with the canonical state file as a *snapshot/projection* of the log. This is the convergent pattern across mature harnesses (pi-mono AgentHarness, OpenHands SDK, AgentLog — all append-only JSONL with a single harness-owned writer; [deepwiki: pi-mono](https://deepwiki.com/badlogic/pi-mono/3.3-agentharness-and-hooks-system), [event-sourcing for agent state](https://tianpan.co/blog/2026-04-10-agent-state-event-stream-immutable-event-sourcing)).
- Migration shim: for one minor release the module *writes* the canonical file and *mirrors* to legacy paths; readers switch immediately; legacy writes deleted next release.
- **Deliberately rejected:** DB-style locking (2PL/OCC) for plan-tree concurrency. CoAgent (arXiv 2606.15376) measured both on real multi-agent workloads: 2PL deadlocks 0.81/trial with no speedup; OCC costs 1.83× tokens for 0.93× speed. Detect-and-notify with agent-side repair — which the existing L1-L4 conflict ladder already resembles — empirically wins. Keep the ladder; give it the fixed rescan logic from fix-group B; add only the *narrow* claim-lock in `next-task.sh` (mkdir-based, crash-safe) because task claiming is a millisecond-scale critical section, not an agent-length transaction.

### W2 — Kill the pseudo-autoInvoke layer

- Migrate all 37 skills from `triggers:` → official `when_to_use`; delete `autoInvoke`/`priority` fields everywhere.
- Every-message guarantees move to the layer that can actually guarantee them: **hooks**. `UserPromptSubmit` already injects context deterministically; agent-detector's routing table becomes a hook-injected reminder (or an honest description-matched skill with no every-message claim).
- Delete the two skills that duplicate existing deterministic hooks (plan-loader narration, trace-recorder narration) or reduce them to thin docs pointing at the hooks.
- Fix `aura-frog/CLAUDE.md` "Auto-Invoke" section to describe the real mechanism.
- Official boundary ([best-practices](https://code.claude.com/docs/en/best-practices)): facts → CLAUDE.md; procedures → skills; must-happen-every-time → hooks.

### W3 — Hook hygiene (keep dispatch, align it with the platform)

The platform contract ([docs: hooks](https://code.claude.com/docs/en/hooks)): matcher filtering is free; `if` conditions filter with zero process spawn; all matching hooks run in parallel, independent, non-deterministic order; only exit 2 blocks; **exit-1 stderr goes only to the debug log**; UserPromptSubmit hooks are killed at 30s; **all SessionEnd hooks share a 1.5s combined budget**.

- `dispatch.cjs` stays — official guidance itself says "batch related checks into one hook script", and the decider/claude-hooks community dispatcher validates the pattern — but chains must respect independence: exit 1 never cancels siblings (fixed in group A), and any hook that must block asynchronously gets its own entry (documented limit).
- Move every self-filtering hook's cheap precondition into hooks.json `if` conditions / tighter matchers, so non-matching tool calls spawn nothing.
- Audit SessionStart/SessionEnd/Stop chains against their real time budgets (SessionEnd 1.5s shared is a probable silent-kill today).
- Anything advisory becomes `async: true`; stop relying on exit 1 as a user-visible signal (it isn't — debug log only).
- Never `> name` un-merge/merge stderr casually: on PreToolUse, stderr is what the model sees on a block.

### W4 — Context budget diet

- `aura-frog/CLAUDE.md` → ~60 lines of universal facts + a pointer manifest (progressive disclosure; [source](https://alexop.dev/posts/stop-bloating-your-claude-md-progressive-disclosure-ai-coding-tools/)). Procedures move to skills; enforcement moves to hooks; anything a linter enforces gets deleted from prose.
- Skill listing: run `/doctor` to measure the listing's real cost; mark workflow-style skills `disable-model-invocation: true` (zero listing cost, still user-invocable); shorten descriptions with trigger keywords first (1,536-char per-skill truncation); keep SKILL.md bodies <500 lines with detail in `references/` files.
- Re-measure the rules tiers honestly (`wc -w`), publish real numbers, and fold rarely-loaded rule content into skill `references/` (skills are the platform's only true lazy-load primitive).
- Front-load the critical 5k tokens of every auto-triggered skill body — that's all that survives post-compaction re-attachment.

### W5 — Config cleanup

- Delete `ccpm-config.yaml` (+ example) — nothing reads it.
- Delete the five `disabled: true` entries from `.mcp.json` — Claude Code ignores the field and starts them anyway (measured GBs of resident wrappers). Users who want them re-add locally.
- Stop committing `stats.json` from CI; generate on demand or publish as a CI artifact. Halves bot noise in history.
- Fold `commands/*.md` into skills over time — the platform has merged commands into skills and recommends the skill form ([plugins-reference](https://code.claude.com/docs/en/plugins-reference)). Verify any hook matching bundled MCP tools uses the scoped `mcp__plugin_aura-frog_<server>__<tool>` name (unscoped names silently never fire).

## 4. Migration path

Each phase is independently shippable and reversible; no big-bang.

| Phase | Contents | Risk |
|-------|----------|------|
| 0 (done separately) | Quick-fix groups A–D | low |
| 1 | W5 config cleanup + W3 matcher/`if`/async pass | low — deletions and metadata |
| 2 | W4 context diet (CLAUDE.md, skill descriptions, honest budgets) | low — prose only, measurable via `/doctor` |
| 3 | W2 pseudo-autoInvoke removal | medium — behavior visible in routing; ship behind one release with both mechanisms live |
| 4 | W1 state owner + event-log formalization | highest — touches every state-reading hook; shim release then cutover |

## 5. Risks

- **W1 cutover:** a hook missed in the sweep reads a legacy path after deletion → one release of dual-write mirroring + a grep-gate in CI (`rg 'workflow-state.json|current-phase.txt'` outside the state module fails the build).
- **W2:** description-matched routing may fire less eagerly than the prose claimed. Mitigation: the deterministic pieces are hooks already; only advisory routing changes.
- **W3 `if` conditions:** behavior differences between `if` and in-script guards must be tested per hook — move incrementally, one chain at a time.
- **Plugin dev loop:** hook/agent/MCP changes need `/reload-plugins` or restart (SKILL.md hot-reloads) — phase 3/4 testing must account for it.

## 6. Explicitly out of scope

- No message bus / HTTP coordination between agents (JSONL + single writer is sufficient at this scale).
- No database locking for the plan tree (CoAgent evidence above).
- No rewrite of dispatch.cjs (it is sound; semantics aligned in group A).
