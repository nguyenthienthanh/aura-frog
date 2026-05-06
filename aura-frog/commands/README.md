# Aura Frog Commands

**Total:** 18 command files (5 bundled + 1 standalone + 9 hierarchical-planning slash commands + 1 project-extension + 1 session-reset + 1 pre-flight)

---

## Bundled Commands

```toon
bundled[5]{command,subs,count}:
  /run,"<task>/status/resume/progress/rollback + context-aware: approve/reject/modify/handoff/stop",10
  /check,"(all)/security/perf/complexity/debt/coverage/deps",7
  /design,"api/db/doc",3
  /project,"init/detect/status/list/switch/refresh/regen/env/sync",9
  /af,"status/agents/metrics/learn/setup/update/mcp/prompts/skill",9
```

## Standalone Commands

```toon
standalone[1]{command,file,description}:
  help,help.md,Show help and available commands
```

## Hierarchical Planning (alpha — opt-in)

```toon
planning[9]{command,file,purpose}:
  /aura:plan,aura-plan.md,"Bootstrap T0/T1/T2 via interview"
  /aura:plan:expand,aura-plan-expand.md,"Decompose node one tier down"
  /aura:plan:next,aura-plan-next.md,"Return next ready T4 leaf"
  /aura:plan:replan,aura-plan-replan.md,"Replan with budget enforcement"
  /aura:plan:promote,aura-plan-promote.md,"Promote node to higher tier"
  /aura:plan:archive,aura-plan-archive.md,"Archive completed branch"
  /aura:plan:status,aura-plan-status.md,"Render plan tree + summary"
  /aura:plan:undo,aura-plan-undo.md,"Restore latest checkpoint (LIFO)"
  /aura:trace,aura-trace.md,"Reasoning trace + hallucination surface (alpha.2)"
```

These commands are **silent on projects without `.aura/plans/`**. Initialize with `/aura:plan` (or `bash aura-frog/scripts/plans/new-plan.sh`).

## Project Extension (alpha.3 — opt-in)

```toon
extension[1]{command,file,purpose}:
  /aura:extend,aura-extend.md,"Create project-level skills/rules/commands at .claude/ — never plugin-level. Subcommands: propose / create / list / remove."
```

`extension-detector` skill auto-invokes when patterns suggest a new skill/rule/command would help; surfaces a confirmation question; only `/aura:extend` actually writes files. Hard guardrail: writes are blocked from any path inside `aura-frog/`.

## Memory Tier (alpha.4 — opt-in)

```toon
memory[1]{command,file,purpose}:
  /aura:reset-session,aura-reset-session.md,"Distill active Epic via epic-summarizer → permanent_memory.md → optional reset. Preserves history.jsonl, plan tree, conflict cache, manual_overrides."
```

`epic-summarizer` agent runs on T2 done (auto via `feature-done-trigger-archive` hook) or manually via this command. `permanent-memory-loader` skill auto-loads distilled summaries (≤120 tokens always-loaded) in subsequent sessions.

## Pre-flight (beta.1 — auto-on)

```toon
preflight[1]{command,file,purpose}:
  /aura:preflight,aura-preflight.md,"check/policies/bypass/status — Tier 1 bash linters (path safety, command allowlist, secret patterns, frontmatter, tool input/output)"
```

`hooks/pre-flight-validate.cjs` auto-fires on every PreToolUse for Bash|Edit|Write|Read. Hard-blocks `rm -rf /`, system paths, credential leaks. Warns on `git push --force`, `DROP TABLE`, etc. Bypass per-call only with `/aura:preflight bypass <reason ≥10 chars>`. Tier 2 OPA Rego policies deferred to v3.7.0-rc.1.

---

## Usage

Type `/run <task>` to start working — intent is auto-detected.
During an active run, type bare words: `approve`, `reject`, `modify`, `handoff`.

---

## Architecture — Commands vs Skills

`commands/` is the **slash surface**. Skills (`aura-frog/skills/`) are AI-discoverable knowledge with `user-invocable: false` — they don't appear in the slash menu, but Claude auto-invokes them on intent match.

**Rule:** if a user types `/<name>`, the file MUST live here in `commands/`. If a skill needs slash exposure, wrap it in a thin command file that delegates to the skill (e.g., `/af prompts` → invokes `prompt-evaluator` skill).

This keeps the `/` menu uncluttered (only actionable commands) while preserving full AI discoverability of skill content.

See: `.claude/CLAUDE.md` "ARCHITECTURE RULE — Commands vs Skills Separation".
