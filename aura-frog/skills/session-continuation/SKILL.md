---
name: session-continuation
description: "Manage workflow state across sessions with handoff and resume. TOON-based state persistence."
autoInvoke: false
priority: high
model: haiku
triggers:
  - "handoff"
  - "save state"
  - "resume workflow"
  - "workflow:handoff"
  - "workflow:resume"
allowed-tools: Read, Write, Bash
user-invocable: false
---

> **AI-consumed reference.** Optimized for Claude to read during execution.
> Human-readable explanation: see [docs/architecture/HIERARCHICAL_PLANNING.md](../../../docs/architecture/HIERARCHICAL_PLANNING.md)
> or [docs/getting-started/](../../../docs/getting-started/) depending on topic.


# Session Continuation

Manage workflow state across sessions.

## Triggers

Token ≥75% → suggest handoff. User says handoff/save → execute. User says resume + ID → load.

## Handoff Flow

1. Save to `.claude/logs/runs/[id]/run-state.json`: workflow_id, status, current_phase, agents, phases_completed (with deliverables), key decisions, token_usage
2. Output: workflow ID, phase progress, deliverables, resume command

## Resume Flow

1. Load state file → validate exists/valid
2. Restore: project context, agents, phase rules, decisions
3. Show summary → continue from saved phase

## Auto-Save / Auto-Resume (hooks — no action needed)

`hooks/compact-handoff.cjs` writes `.claude/cache/compact-handoff.json` (active run from `logs/runs/*/run-state.json`, plan anchor, last 3 user prompts, uncommitted files):

- **PreCompact** (manual + auto) → always saves.
- **Stop** → saves when context ≥ `AF_HANDOFF_THRESHOLD` (default 70%, read from the statusline's `.claude/cache/context-usage.json`); without statusline data, saves only while a run is open.
- **SessionStart** (`source=compact`/`resume`/`startup`, not `clear`) → injects it as `additionalContext`, then deletes it.

Keep `run-state.json` current (`current_phase`, `next_action`) — it is what the resume points Claude back to. Disable: `AF_COMPACT_HANDOFF_DISABLED=true`.

## TOON State Format (~160 tokens vs JSON ~600)

```toon
workflow:
  id: AUTH-1234
  phase: 3
  status: in_progress
agents[2]: architect,tester
```

## Error Handling

Not found → show available, suggest `/run`. Corrupted → restore from `.backup.json`.

## Cleanup

Completed: 30 days. Cancelled: 7 days. Paused: indefinitely.
