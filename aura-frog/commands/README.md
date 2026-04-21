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
