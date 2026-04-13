# Rule: Context Management

**Priority:** High

---

## Core: Load Minimally, Compact Proactively

```toon
context_tiers[3]{tier,tokens,loads}:
  0-always,~500,MCP list + core rules
  1-session,~1000,Project detection + tech stack + workflow phase
  2-demand,variable,Framework patterns + detailed rules + full skills
```

Start with Tier 0+1. Load Tier 2 only when task requires it.

---

## Progressive Loading

Load framework/security/test/design patterns only when task triggers them. Never load all 12 framework skills at start — lazy-load via `skills/framework-expert/SKILL.md`.

## Token Thresholds (Model-Aware)

```toon
thresholds[4]{percent,action}:
  <50%,Continue normally
  50-70%,Consider /compact
  70-85%,"/compact Focus on [task details]"
  >85%,Finish task then /clear
```

### Model-Aware Compact Strategy

```toon
model_strategy[3]{model,strategy,reason}:
  Haiku,"Prefer /clear + restart","Small context window — compaction loses too much"
  Sonnet,"Prefer /clear + handoff over /compact","Sonnet reasoning degrades with compacted context — cleaner restart"
  Opus,"Compaction OK — use /compact freely","Large context window — handles compacted context well"
```

**Rule:** Before compacting, check active model. If Sonnet: prefer `workflow:handoff` + `/clear` + `workflow:resume` over `/compact`. If Opus: `/compact` is fine.

## Session Boundaries

**/clear when:** switching projects, switching domains, after major task, context cluttered, after architecture discussion.
**Don't /clear:** mid-implementation, during debugging, multi-file refactor in progress.

---

## Efficient Exploration

- Use subagents for verbose tasks (test suites, lint, coverage) — summary returns to main
- Read specific functions/line ranges, not entire files
- Grep then read matches, not read-all-to-find
- Cache detection results via project cache

---

## 3-Tier Compression

```toon
compression[3]{tier,trigger,action}:
  MicroCompact,"Every 10 turns or >60%","Drop old tool outputs + collapse file reads + TOON summaries"
  AutoCompact,">80%","/compact with focus instructions — preserves workflow state + decisions"
  ManualCompact,"User request or handoff","Full session snapshot (state + git diff + blockers + next steps)"
```

---

## Team Context (Agent Teams)

Teammates have **separate context windows** — no shared history.

```toon
team_rules[3]{rule,detail}:
  Explicit context,Lead must send all relevant context via messages or shared files
  Targeted sharing,Send only relevant file paths and summaries — not entire codebase
  File claiming,Use file claiming to prevent merge conflicts
```
