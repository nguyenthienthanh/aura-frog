---
name: failure-classifier
description: "Classifies execution failures into F1-F5 (transient/local-logic/local-design/story-level/architectural). Outputs JSON with class, confidence, evidence, and recommended action. Deterministic rule-based classifier; no LLM call."
when_to_use: "When post-execute-update-node hook detects a task failure, before master-planner makes a retry/replan decision"
allowed-tools: Read, Grep, Glob, Bash
effort: low
user-invocable: false
---

# Failure Classifier

**STATUS — v3.7.0-alpha.2 (Milestone B).**

Classifies T4 task failures so master-planner can decide: retry, self-heal, replan, or escalate.

## Failure classes

| Class | Name | Trigger | Recommended action |
|-------|------|---------|---------------------|
| **F1** | transient | Network timeout, file lock, ECONNRESET, rate limit, flaky CI | Retry with backoff (max 3) |
| **F2** | local-logic | Test fails, type error, lint error, assertion mismatch | Self-heal-propose (Milestone E) or single retry |
| **F3** | local-design | Story acceptance unreachable as designed; signals: same test fails after 2 fixes, or output drift > 50% from plan | Replan story (re-decompose T3) |
| **F4** | story-level | Sibling tasks broken, dependency contract violated, deviation_score ≥ 0.7 | Replan feature (re-decompose T2) |
| **F5** | architectural | Cross-feature impact, mission-level constraint violated | Freeze + escalate to user |

(F6 conflict ships in Milestone D.)

## Classifier inputs

- Failure event from post-execute-update-node hook: `{tool, exit_code, stderr_tail, files_touched}`
- Active task node (status, failed_attempts, replan_budget_remaining)
- Last 10 history.jsonl events for the task
- Failed test output (when available)

## Decision rules (deterministic, evaluated top-down — first match wins)

```
1. exit_code == 0 → not a failure; abort classification
2. stderr matches /ECONNRESET|ETIMEDOUT|EAI_AGAIN|429|503|rate limit/i → F1
3. failed_attempts >= 3 AND same stderr_hash as last 2 attempts → F3
4. files_touched intersects sibling task's files_touched (from history) → F4
5. failed_attempts == 1 AND stderr matches /TypeError|SyntaxError|test failed|assertion/ → F2
6. deviation_score(node) >= 0.7 → F4
7. ancestor_T1.intent contradicted by failure evidence → F5
8. default → F2
```

## Output schema

```json
{
  "class": "F3",
  "confidence": 0.78,
  "evidence": [
    "failed_attempts=3",
    "stderr_hash matches last 2 attempts",
    "test_ref tests/auth/jwt.test.ts has been edited 4 times in revision history"
  ],
  "recommended_action": "replan_story",
  "node_id": "TASK-00101",
  "parent_node_id": "STORY-0042"
}
```

## Confidence scoring

```
F1 transient: 0.95 (regex match is reliable)
F2 local-logic: 0.85 (single attempt heuristic)
F3 local-design: 0.75 (multi-attempt + same hash)
F4 story-level: 0.80 (file overlap is signal-rich)
F5 architectural: 0.65 (semantic match — lowest confidence)
```

If confidence < 0.6 → emit `class: F2` with the action `single_retry_then_escalate` and surface to user.

## What this skill does NOT do

- Does NOT call an LLM (deterministic only — see Q1 decision)
- Does NOT decide retry/replan itself (that's master-planner)
- Does NOT mutate the plan tree
- Does NOT classify F6 (conflict) — Milestone D ships that

## Tie-Ins

- **Spec:** §9.3
- **Decisions:** Q1 (deterministic), Q5 (deviation_score formula in `replan-thresholds.md`)
- **Agent:** master-planner — consumes classifier output for decision engine
- **Agent:** replanner — invoked when class is F2/F3/F4
- **Rule:** `rules/workflow/replan-thresholds.md` — deviation_score formula
- **Hook:** `hooks/post-execute-update-node.cjs` — invokes this skill on failure
