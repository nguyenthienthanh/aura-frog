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
---

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

## Auto-Save

Phase completion, every 5 min, token milestones (100K/150K/175K). Silent except warning thresholds.

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
