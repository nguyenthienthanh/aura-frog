---
name: permanent-memory-loader
description: "Loads permanent_memory.md summary lines (≤120 always-loaded tokens, hard cap 200). Surfaces durable wisdom from past Epics into the current session. Silent if .claude/memory/ does not exist."
when_to_use: "Every Claude turn when .claude/memory/permanent_memory.md exists; loads section headers + 1-line summaries only, never the full body"
autoInvoke: true
allowed-tools: Read, Glob
effort: low
user-invocable: false
---

# Permanent Memory Loader

Auto-invoke complement to `epic-summarizer`. Read-only.

## Behavior (in order)

1. **Detect:** if `.claude/memory/permanent_memory.md` does NOT exist → exit silently
2. **Read** the file, extract each `## Epic: <ID> — <intent>` header + the first non-empty line of each subsection (decisions, gotchas, anti-patterns, patterns, conflicts)
3. **Compose** a compact block: 1 line per Epic, 1 sub-line per subsection (≤120 chars each)
4. **Stamp** `trust: file` per `rules/core/memory-trust-policy.md`

## Token budget

```toon
budget[3]{layer,target,hard_cap}:
  always_loaded,120,200
  per_epic_summary,12,20
  per_subsection_line,1,2
```

Budget exceeded → degrade (drop Tentative → trim patterns → Epic IDs only → skip if file > 8000 tokens).

## Constraints

Never loads full Epic bodies or `manual_overrides.md`; never writes; never decides from memory content. Epics older than 90 days are prefixed `(>90d may be outdated)`.

**Detail (example output, degradation ladder, staleness, tie-ins):** `skills/permanent-memory-loader/reference.md` — load on demand only.
