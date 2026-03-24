# Command: workflow:phase:2

**Purpose:** Execute Phase 2 - Test RED (Write Failing Tests)
**Trigger:** Auto-triggered after Phase 1 approval OR manual `/workflow:phase:2`

---

## 🎯 Phase 2 Objectives

Write failing tests before implementation (TDD RED phase). All tests must fail at this stage - they define the expected behavior for Phase 3.

**Deliverables:**
1. Test scaffolding with failing tests
2. Test cases covering requirements from Phase 1
3. Verification that all tests fail (RED state)

---

## 📋 Execution Steps

### Step 1: Pre-Phase Hook
- Load Phase 1 requirements and design
- Verify previous phase approved
- Initialize Phase 2 state
- Show phase banner

### Step 2: Define Test Cases
**Primary Agent:** tester

Actions:
- Derive test cases from Phase 1 requirements and success criteria
- Identify unit test, integration test, and E2E test boundaries
- Define edge cases and error scenarios
- Map tests to components/modules from Phase 1 design

### Step 3: Write Test Scaffolding
**Agent:** tester + Dev agent

Create:
- Test file structure matching the planned code structure
- Test stubs for each requirement
- Mock/fixture setup
- Assertion scaffolding

### Step 4: Verify RED State
- Run all tests
- Confirm every test fails (RED)
- Document expected vs actual for each test
- Flag any tests that pass unexpectedly (indicates existing code already covers it)

### Step 5: Generate Deliverables

```markdown
# Phase 2: Test RED - Deliverables

## Test Cases
| ID | Requirement | Test Type | Status |
|----|------------|-----------|--------|
| T1 | [req] | unit | RED ✗ |
| T2 | [req] | integration | RED ✗ |

## Test Files Created
- tests/unit/[component].test.ts
- tests/integration/[feature].test.ts

## Estimation

### Story Points
**Total:** X story points (Fibonacci scale)

**Breakdown:**
- Phase 2 (Test RED): 2 points
- Phase 3 (Build GREEN): 5 points
- Phase 4 (Refactor + Review): 3 points
- Phase 5 (Finalize): 1 point

**Confidence:** High/Medium/Low

### Time Estimate
- Phase 2-5: X hours
- **Total:** Z hours (~W days)
```

---

## ✅ Success Criteria

Phase 2 is complete when:
- [ ] Test cases derived from Phase 1 requirements
- [ ] Test scaffolding created
- [ ] All tests run and fail (RED state confirmed)
- [ ] Edge cases and error scenarios covered
- [ ] Test-to-requirement traceability documented

---

## 🚦 Auto-Continue

Phase 2 auto-continues to Phase 3 (Build GREEN) without approval gate. The failing tests serve as the specification for implementation.

```
═══════════════════════════════════════════════════════════
🔴 PHASE 2 COMPLETE: Test RED
═══════════════════════════════════════════════════════════

📊 Summary:
Test scaffolding created - all tests failing (RED)

📦 Deliverables:
   📄 Test files with failing tests
   📊 Test-to-requirement mapping

📈 Metrics:
   - Test files created: X
   - Test cases: Y (all RED ✗)
   - Coverage target: Z%

⏭️  AUTO-CONTINUING to Phase 3: Build GREEN 🟢
═══════════════════════════════════════════════════════════
```

---

## 📂 Files Created

```
logs/contexts/{workflow-id}/deliverables/
└── PHASE_2_TEST_RED.md (test cases and scaffolding report)
```

---

## 🎯 What Happens Next

After Phase 2 completes:
- Auto-continues to `/workflow:phase:3` - Build GREEN (implement code to make tests pass)

---

## 📚 Related Documentation

- **Phase Guide:** `docs/phases/PHASE_2_TEST_RED.MD`
- **Detailed Test Scaffolding:** `commands/workflow/phase-2-test.md`
- **Previous Phase:** `commands/workflow/phase-1.md`
- **Next Phase:** `commands/workflow/phase-3.md`
- **Workflow Start:** `commands/workflow/start.md`

---

**Status:** Active command
**Related:** workflow:phase:1, workflow:phase:3, workflow:approve
