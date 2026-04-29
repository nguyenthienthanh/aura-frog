# Aura Frog Commands

**Total:** 15 command files (5 bundled + 1 standalone + 9 hierarchical-planning slash commands)

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
