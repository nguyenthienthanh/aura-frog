# Aura Frog Commands

**Total:** 6 command files (5 bundled + 1 standalone)

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
