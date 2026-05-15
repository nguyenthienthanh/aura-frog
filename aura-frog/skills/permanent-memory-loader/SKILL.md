---
name: permanent-memory-loader
description: "Loads permanent_memory.md summary lines (≤120 always-loaded tokens, hard cap 200). Surfaces durable wisdom from past Epics into the current session. Silent if .claude/memory/ does not exist."
when_to_use: "Every Claude turn when .claude/memory/permanent_memory.md exists; loads section headers + 1-line summaries only, never the full body"
autoInvoke: true
allowed-tools: Read, Glob
effort: low
user-invocable: false
---

> **AI-consumed reference.** Optimized for Claude to read during execution.
> Human-readable explanation: see [docs/architecture/HIERARCHICAL_PLANNING.md](../../../docs/architecture/HIERARCHICAL_PLANNING.md)
> or [docs/getting-started/](../../../docs/getting-started/) depending on topic.


# Permanent Memory Loader

**STATUS — v3.7.0-alpha.4 (Milestone C interim).** Auto-invoke complement to `epic-summarizer`.

## Behavior (in order)

1. **Detect:** if `.claude/memory/permanent_memory.md` does NOT exist → exit silently (no overhead)
2. **Read** the file, extract:
   - Each `## Epic: <ID> — <intent>` header
   - For each Epic, the first non-empty line of each subsection (Architectural decisions, Gotchas discovered, Anti-patterns to avoid, Patterns that worked, Conflicts encountered)
3. **Compose** a compact context block: 1 line per Epic, 1 sub-line per subsection (≤120 chars each)
4. **Stamp** with `trust: file` per `memory-trust-policy.md` (memory content is read-verified, not user-canonical)

## Token budget

```toon
budget[3]{layer,target,hard_cap}:
  always_loaded,120,200
  per_epic_summary,12,20
  per_subsection_line,1,2
```

Auto-degradation when budget exceeded:
1. **Drop Tentative subsection** lines first
2. **Trim "Patterns that worked"** lines (keeping decisions + gotchas)
3. **Show Epic IDs only** — no subsection lines
4. **Skip entirely** if file > 8000 tokens (extreme; suggests epic-summarizer cap was bypassed)

## What this skill loads (example output)

```
[permanent-memory | trust:file]
Epic FEAT-007 (JWT auth):
  decisions: token storage in httpOnly cookie (DEC-001)
  gotchas: refresh-token rotation requires CSRF re-issue
Epic FEAT-008 (Profile avatars):
  decisions: deferred to S3 over base64 inline
  anti-patterns: never store image bytes in postgres TEXT
```

## What this skill does NOT do

- Does NOT load the full Epic body — only summary lines
- Does NOT load `.claude/memory/manual_overrides.md` (that's user-curated; treated separately)
- Does NOT modify memory files (read-only)
- Does NOT make decisions based on memory content (caller decides)
- Does NOT trigger across projects (project-isolated; per `.claude/memory/` is per-project)

## Memory staleness

If an Epic section is older than 90 days (parsed from its `**Completed:**` line), the loader prefixes it with `(>90d may be outdated)`. This is per spec §29 risk register: "Permanent memory stale wisdom".

## Tie-Ins

- **Spec:** §9.6, §19.2 (permanent_memory.md structure)
- **Producer:** `agents/epic-summarizer.md` — only writer of the content this skill loads
- **Producer (manual):** `.claude/memory/manual_overrides.md` — user-curated; loaded separately by name (not via this skill)
- **Rule:** `rules/core/memory-trust-policy.md` — defines `trust: file` semantics for loaded content
- **Rule:** `rules/workflow/session-reset-policy.md` — defines what's preserved across reset (this content is)
- **Companion auto-invoke skill:** `plan-loader` — both fire silently when their files don't exist
