---
name: reasoning-trace-recorder
description: "Auto-invokes for every Claude turn during active T4 task execution. Emits append-only trace events (file_read, output_claim, tool_call, decision) to .aura/plans/traces/{TASK_ID}.jsonl. Source of grounding-discipline checks."
when_to_use: "Every Claude turn during active T4 execution; silent if no .aura/plans/active.json or no active.task"
autoInvoke: true
allowed-tools: Read, Bash
effort: low
user-invocable: false
---

# Reasoning Trace Recorder

**STATUS — v3.7.0-alpha.2 (Milestone B).** Forensic reproducibility per spec goal §2.1.3.

## Behavior

1. Detect: if `.aura/plans/active.json` does NOT exist → exit silently
2. Read `.aura/plans/active.json` — if `active.task` is null → exit silently
3. For every emitted event from companion hooks/tools, append a line to `.aura/plans/traces/{TASK_ID}.jsonl`

## Event schema (one JSON per line)

```json
{
  "ts": "2026-04-29T14:32:01Z",
  "event_id": "TR-00101-007",
  "task_id": "TASK-00101",
  "type": "output_claim",
  "payload": {
    "claim": "src/auth/jwt.ts exports verifyToken",
    "grounded": true,
    "grounded_by": ["TR-00101-003"]
  }
}
```

## Event types

| Type | Emitted by | Required payload fields |
|------|-----------|-------------------------|
| `file_read` | Read tool / hook | `path`, `lines_read`, `sha256` |
| `output_claim` | Claude reasoning | `claim`, `grounded` (bool), `grounded_by` (array of event_ids) |
| `tool_call` | PreToolUse hook | `tool_name`, `args_hash` |
| `tool_result` | PostToolUse hook | `tool_name`, `exit_code`, `result_hash`, `duration_ms` |
| `decision` | master-planner | `decision`, `reasoning`, `confidence` |
| `phase_transition` | run-orchestrator | `from_phase`, `to_phase`, `gate_passed` |

## Grounding rule (per spec §11.1)

An `output_claim` is **grounded** when ≥1 prior `file_read` event in the same trace covers the file/function/symbol named in the claim.

If `grounded: false`, it is **flagged as potential hallucination** and surfaced via `/aura-frog:trace --hallucinations`.

## What this skill does NOT do

- Does NOT call an LLM
- Does NOT modify plan files (trace is independent of plan)
- Does NOT enforce grounding (that's grounding-discipline rule's job — this just records)
- Does NOT prune traces (retention is /aura-frog:plan-archive's responsibility)

## File location

```
.aura/plans/traces/{TASK_ID}.jsonl
```

One file per T4 task. Append-only; never edited or deleted by this skill.

## Storage budget

Per task target: ≤500 events (typical task: 50-100 events). If a task exceeds 1000 events, post-execute-update-node hook flags `event: trace_overflow` and surfaces in /aura-frog:trace.

## Tie-Ins

- **Spec:** §9.5, §11.1 (grounding-discipline)
- **Companion hook:** `hooks/tool-call-tracer.cjs` — emits tool_call/tool_result events
- **Companion hook:** `hooks/tdd-red-failure-tracker.cjs` — emits decision events for RED phase
- **Command:** `commands/trace.md` — reads traces for /aura-frog:trace output
- **Rule:** `rules/core/grounding-discipline.md` — defines grounded:bool semantics
- **Skill:** `failure-classifier` — reads recent trace events to score F2/F3
