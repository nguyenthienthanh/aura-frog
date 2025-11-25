# Command: workflow:phase:4

**Version:** 1.0.0  
**Purpose:** Execute Phase 4 - Test Planning  
**Trigger:** Auto-triggered after Phase 3 approval OR manual `/workflow:phase:4`

---

## 🎯 Phase 4 Objectives

Create comprehensive test plan and test cases for TDD implementation.

**Deliverables:**
1. Test Plan Document
2. Detailed Test Cases
3. Coverage Goals
4. Testing Strategy

---

## 📋 Execution Steps

### Step 1: Pre-Phase Hook
- Load Phase 2 (tech spec) and Phase 3 (design)
- Identify what needs testing
- Initialize Phase 4 state

### Step 2: Define Test Strategy
**Agent:** qa-automation + dev agent

```markdown
## Testing Strategy

### Test Levels
1. **Unit Tests** - Individual components/functions
   - Component rendering
   - Props handling
   - Event handlers
   - State management

2. **Integration Tests** - Component interactions
   - Parent-child communication
   - Hook integrations
   - API calls with mocks

3. **E2E Tests** (if applicable)
   - Complete user flows
   - Navigation
   - Critical paths

### Test Framework
- **Framework:** Jest + React Native Testing Library
- **Coverage Tool:** Istanbul/nyc
- **Mocking:** jest.fn(), jest.mock()
- **Assertions:** expect() from Jest
```

### Step 3: Set Coverage Goals

```markdown
## Coverage Goals

### Overall Target: 85%
(Higher than default 80% due to refactoring criticality)

### By Component Type:
- Components: 80% (UI components)
- Hooks: 90% (business logic critical)
- Utils: 95% (pure functions, easy to test)
- Integration: 70% (complex setup)

### Coverage Metrics:
- Statements: 85%
- Branches: 80%
- Functions: 85%
- Lines: 85%
```

### Step 4: Write Test Cases

For each component/module:

```markdown
## Test Cases: PostCaptionEditor

### Rendering Tests
- TC-001: Should render caption input field
- TC-002: Should render generate button when enabled
- TC-003: Should render save button
- TC-004: Should show loading state when generating
- TC-005: Should show error message on validation fail

### Interaction Tests
- TC-006: Should call onCaptionChange when text changes
- TC-007: Should call onGenerate when generate button clicked
- TC-008: Should call onSave when save button clicked
- TC-009: Should disable buttons while loading
- TC-010: Should enable buttons after loading complete

### State Tests
- TC-011: Should update caption state on change
- TC-012: Should show saved state after save success
- TC-013: Should show error state on save failure

### Edge Cases
- TC-014: Should handle empty caption
- TC-015: Should handle max length (280 chars)
- TC-016: Should handle special characters
- TC-017: Should handle API timeout
- TC-018: Should handle network error

### Accessibility
- TC-019: Should have correct accessibility labels
- TC-020: Should be keyboard navigable
```

### Step 5: Define Test Data

```typescript
// Test Data / Fixtures
export const mockPost = {
  id: 'test-post-123',
  caption: 'Test caption',
  platform: 'facebook',
  status: 'draft',
};

export const mockPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: 'facebook-icon' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram-icon' },
];

export const mockHandlers = {
  onCaptionChange: jest.fn(),
  onGenerate: jest.fn(),
  onSave: jest.fn(),
  onPlatformSelect: jest.fn(),
};
```

### Step 6: Plan Test Execution Order

```markdown
## Test Execution Plan

### Phase 5a (RED): Write Tests
1. Create test files
2. Write all test cases
3. Run tests → All should FAIL (expected)
4. Duration: ~1-2 hours

### Phase 5b (GREEN): Implement
1. Implement components
2. Run tests → All should PASS
3. Check coverage → Must meet 85%
4. Duration: ~3-4 hours

### Phase 5c (REFACTOR): Optimize
1. Refactor code
2. Run tests → Still PASS
3. Maintain coverage
4. Duration: ~1 hour
```

---

## 📊 Test Plan Document Template

```markdown
# Test Plan - {Feature Name}

## Test Scope
- Components to test: 5
- Hooks to test: 1
- Total test cases: 73

## Test Environment
- Device: iOS Simulator, Android Emulator
- OS: iOS 17+, Android 13+
- Node: 18.x
- React Native: 0.76.9

## Test Data
[Mock data and fixtures]

## Test Cases
[Detailed test cases per component]

## Coverage Goals
- Overall: 85%
- Per component breakdown

## Risk Assessment
- High risk areas requiring extra testing
- Edge cases to cover
- Performance considerations

## Test Schedule
- Phase 5a: 1-2 hours (write tests)
- Phase 5b: 3-4 hours (implement)
- Phase 5c: 1 hour (refactor)
```

---

## ✅ Success Criteria

Phase 4 complete when:
- [ ] Test strategy defined
- [ ] Coverage goals set (85%)
- [ ] Test cases written for all components (73 cases)
- [ ] Test data/mocks defined
- [ ] Test execution plan created
- [ ] Risks identified

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 4 COMPLETE: Test Planning
═══════════════════════════════════════════════════════════

📊 Summary:
Created comprehensive test plan with 73 test cases

📦 Deliverables:
   📄 PHASE_4_TEST_PLAN.md
   - Test strategy defined
   - 73 test cases documented
   - Coverage goal: 85%
   - Mock data prepared

🎯 Test Coverage Breakdown:
   - PostCaptionEditor: 20 test cases
   - PlatformSelector: 12 test cases
   - MediaPreviewSection: 15 test cases
   - PostActionButtons: 11 test cases
   - Main Component: 15 test cases
   - useSocialMarketingLogic: 20 test cases

✅ Success Criteria:
   ✅ Test strategy defined (Unit + Integration)
   ✅ Coverage goals set (85% overall)
   ✅ All test cases written (73 cases)
   ✅ Mock data prepared
   ✅ Execution plan created

⏭️  Next Phase: Phase 5a - Write Tests (RED)
   Start TDD: Write failing tests first!

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 5a (TDD RED)
Type "/workflow:reject" → Revise test plan
Type "/workflow:modify <feedback>" → Adjust test cases

Your response:
═══════════════════════════════════════════════════════════
```

---

## 📂 Files Created

```
.claude/logs/contexts/{workflow-id}/deliverables/
└── PHASE_4_TEST_PLAN.md
    - Test strategy
    - 73 test cases
    - Coverage goals
    - Mock data
    - Execution plan
```

---

## 💡 Test Planning Tips

### For Refactoring:
- Test existing behavior first (regression tests)
- Add tests for new structure
- Ensure 100% backward compatibility

### For New Features:
- Test happy paths
- Test error scenarios
- Test edge cases
- Test user interactions

### Coverage Strategy:
- Prioritize critical business logic (90%+)
- UI components can be lower (70-80%)
- Utility functions should be 95%+

---

## 🎯 What Happens Next

After approval → `/workflow:phase:5a`:
- Write all 73 tests
- Tests should ALL FAIL (RED phase)
- Verify tests are correct before implementation

---

**Status:** Active command  
**Related:** workflow:phase:3, workflow:phase:5a, workflow:approve

