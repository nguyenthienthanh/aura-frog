---
name: bugfix-quick
description: "Fast bug fixes with root cause investigation + TDD. Enforces 'no fix without root cause' discipline and verification protocol. Without this skill, fixes are applied at symptoms instead of sources, and bugs return."
autoInvoke: true
priority: medium
triggers:
  - "fix bug"
  - "broken"
  - "crash"
  - "not working"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
effort: low
user-invocable: false
---

# Quick Bugfix

For bugs only. Features/refactors → run-orchestrator.

---

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE.** Fix at SOURCE, not symptom.

## Process (4 Steps)

### 1. Investigate
- Read error + stack trace
- Reproduce the bug
- `git log` / `git diff` for recent changes
- Trace backward: where did bad data originate?

### 2. Write Failing Test (RED)
- Test that reproduces the bug exactly
- User confirms test FAILS

### 3. Fix (GREEN)
- Minimal, focused change at root cause
- User confirms test PASSES

### 4. Verify
- Run full test suite — no regressions
- Read output, THEN claim result
- **Wrong:** "Should work now" / **Right:** "Tests pass: [output]"

---

## Red Flags (Return to Step 1)

"Quick fix for now" / "Just try changing X" / "It's probably X" / "Seems fixed"

---

## Output

```markdown
## Bug Fix: [Description]
**Root Cause:** [Why — traced to source]
**Test Added:** [file + test name]
**Fix Applied:** [file + change summary]
**Verification:** Tests pass, no regressions
```

If complex → switch to `run-orchestrator`.

**Escalation:** If the bug resists quick fix (intermittent, race condition, "works on my machine", multiple plausible causes), escalate to `skills/deep-debugging/SKILL.md` for scientific-method root-cause analysis.

---

## Related Rules

- `rules/core/tdd-workflow.md` — Failing test before fix
- `rules/core/verification.md` — Run tests, read output, then claim
- `rules/core/execution-rules.md` — Root-cause discipline
- `rules/core/simplicity-over-complexity.md` — Minimal fix at root cause, no speculative refactoring during bug fix
