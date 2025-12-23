# Systematic Debugging

Four-phase framework ensuring proper investigation before fixes.

---

## Phase 1: Root Cause Investigation

**Goal:** Understand what's actually happening.

### Steps

1. **Read the error completely**
   - Full error message
   - Stack trace
   - Context (where, when, what data)

2. **Reproduce the issue**
   ```bash
   # Run the failing test/scenario
   npm test -- --testNamePattern="failing test"
   ```

3. **Check recent changes**
   ```bash
   git log --oneline -10
   git diff HEAD~3
   ```

4. **Gather evidence**
   - Console logs
   - Network requests
   - State at time of error

### Output

- Clear description of what fails
- Steps to reproduce
- Relevant error messages

---

## Phase 2: Pattern Analysis

**Goal:** Find what's different from working code.

### Steps

1. **Find working example**
   - Similar feature that works
   - Previous working version
   - Documentation example

2. **Compare systematically**
   - Data structures
   - Function calls
   - Dependencies
   - Configuration

3. **Identify differences**
   - What changed?
   - What's missing?
   - What's extra?

### Output

- List of differences
- Hypothesis about root cause

---

## Phase 3: Hypothesis Testing

**Goal:** Verify your theory minimally.

### Steps

1. **Form specific hypothesis**
   - "The bug is caused by X because Y"
   - Be precise, testable

2. **Design minimal test**
   - Smallest possible verification
   - One variable at a time

3. **Test and observe**
   - Did it confirm or refute?
   - What new information?

4. **Iterate if needed**
   - Refine hypothesis
   - Test again

### Output

- Confirmed root cause
- Clear fix path

---

## Phase 4: Implementation

**Goal:** Fix properly with verification.

### Steps

1. **Write test first**
   - Test that reproduces bug
   - Should fail before fix

2. **Apply minimal fix**
   - Change only what's necessary
   - Don't refactor during bug fix

3. **Verify completely**
   - Original test passes
   - No regressions
   - Run full test suite

4. **Document if needed**
   - Why bug occurred
   - How to prevent similar

### Output

- Passing tests
- Clean commit

---

## Rules

- **Complete each phase before next**
- **No fixes in Phase 1-2**
- **Minimal changes in Phase 4**
- **Always verify at end**
