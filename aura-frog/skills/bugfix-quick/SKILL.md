---
name: bugfix-quick
description: "Fast bug fixes with TDD. Lightweight: understand → test → fix → verify."
autoInvoke: true
priority: medium
triggers:
  - "fix bug"
  - "error"
  - "not working"
  - "broken"
  - "crash"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Aura Frog Quick Bugfix

**Priority:** MEDIUM - Use for bugs only, not new features

---

## When to Use

**USE for:** Bug fixes, errors, crashes, things not working

**DON'T use for:** New features, major refactors, UI changes → use `workflow-orchestrator`

---

## Quick Fix Process (4 Steps)

### 1. Understand (5-10 min)
- Read error description
- Locate affected code (Grep/Glob)
- Identify root cause

### 2. Write Failing Test (10-15 min) - TDD RED
```typescript
// Test that reproduces the bug
it('should show error when password is empty', () => {
  fireEvent.press(getByTestId('login-button'))
  expect(getByText('Password is required')).toBeTruthy()
})
```
**Approval:** User confirms test FAILS

### 3. Implement Fix (20-45 min) - TDD GREEN
```typescript
// Minimal fix
if (!password) {
  setError('Password is required')
  return
}
```
**Approval:** User confirms test PASSES

### 4. Verify (5-10 min)
- Run full test suite
- Check no regressions
- Confirm bug fixed

**Approval:** User confirms fix works

---

## Template

```markdown
## Bug Fix: [Description]

**Issue:** [What's broken]
**Root Cause:** [Why]
**Test Added:** [Code]
**Fix Applied:** [Code]
**Verification:** ✅ Tests pass, no regressions
```

---

**3 approval gates (vs 9 in full workflow) = Much faster!**

**Remember:** Keep fixes minimal. If complex, switch to workflow-orchestrator.
