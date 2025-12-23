---
name: debugging
description: "Systematic debugging with root cause investigation. NO fixes without understanding cause first."
autoInvoke: true
priority: high
model: sonnet
triggers:
  - "bug"
  - "error"
  - "not working"
  - "broken"
  - "crash"
  - "fix"
allowed-tools: Read, Grep, Glob, Bash
---

# Debugging

Systematic debugging framework. Find root cause BEFORE fixing.

---

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs.

---

## When to Use

- Test failures
- Bugs and errors
- Unexpected behavior
- Performance issues
- Build failures
- Before claiming "fixed"

---

## Four-Phase Process

### Phase 1: Investigate

1. **Read the error** - Full message, stack trace
2. **Reproduce** - Confirm the bug exists
3. **Check recent changes** - `git diff`, `git log`
4. **Gather evidence** - Logs, console output

### Phase 2: Analyze

1. **Find working example** - Similar code that works
2. **Compare** - What's different?
3. **Identify pattern** - Where does it diverge?

### Phase 3: Hypothesize

1. **Form theory** - "It breaks because..."
2. **Test minimally** - Smallest change to verify
3. **Confirm** - Does fix work?

### Phase 4: Fix

1. **Write test first** - Reproduces bug
2. **Apply fix** - Single focused change
3. **Verify** - Test passes, no regressions

---

## Root Cause Tracing

When error is deep in call stack:

```
1. Start at error location
2. Trace backward: where did bad data come from?
3. Continue tracing until source found
4. Fix at SOURCE, not symptom
```

---

## Verification Protocol

**Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION

```bash
# Run verification
npm test  # or yarn test, pytest, etc.

# Check output
# THEN claim result
```

**Wrong:** "Should work now"
**Right:** "Tests pass: [paste output]"

---

## Red Flags (Stop & Follow Process)

- "Quick fix for now"
- "Just try changing X"
- "It's probably X"
- "Should work now"
- "Seems fixed"

All mean: Return to Phase 1.

---

## Quick Reference

```
Bug found
  → Phase 1: Read error, reproduce, check changes
  → Phase 2: Find working example, compare
  → Phase 3: Form hypothesis, test minimally
  → Phase 4: Write test, fix, verify

Deep stack error?
  → Trace backward to source
  → Fix at source, not symptom

About to claim fixed?
  → Run verification command
  → Read output
  → THEN claim result
```

---

## References

For detailed techniques, see:
- `references/systematic-debugging.md` - Full four-phase details
- `references/root-cause-tracing.md` - Call stack tracing
- `references/verification.md` - Verification protocols

---

**Version:** 2.0.0
