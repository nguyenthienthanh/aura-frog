# Command: workflow:phase:2

**Version:** 1.0.0
**Purpose:** Execute Phase 2 - Write Tests (RED Phase of TDD)
**Trigger:** Auto-triggered after Phase 1 approval OR manual `/workflow:phase:2`

---

## 🎯 Phase 2 Objectives (TDD RED Phase)

**Write failing tests FIRST before any implementation.**

**Deliverables:**
1. Test files for all components/modules
2. Test execution report (ALL TESTS MUST FAIL)
3. Coverage setup
4. Test documentation

---

## 🔴 TDD RED Phase Rules

### CRITICAL: Tests Must Fail!
- ✅ Write tests for non-existent code
- ✅ Tests should fail because code doesn't exist yet
- ❌ DO NOT write implementation code
- ❌ DO NOT make tests pass

**This is verification that tests are correct!**

---

## 📋 Execution Steps

### Step 1: Load Test Plan
- Read Phase 4 test plan
- Review test cases
- Identify what needs to be tested

### Step 2: Create Test Files
**Agent:** qa-automation + primary dev agent

For each component/module:
```typescript
// Example: PostCaptionEditor.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PostCaptionEditor } from '../PostCaptionEditor';

describe('PostCaptionEditor', () => {
  it('should render caption input', () => {
    const { getByPlaceholderText } = render(
      <PostCaptionEditor caption="" onCaptionChange={jest.fn()} />
    );
    
    expect(getByPlaceholderText('Enter caption...')).toBeTruthy();
  });
  
  it('should call onCaptionChange when text changes', () => {
    const onCaptionChange = jest.fn();
    const { getByPlaceholderText } = render(
      <PostCaptionEditor caption="" onCaptionChange={onCaptionChange} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter caption...'), 'New caption');
    expect(onCaptionChange).toHaveBeenCalledWith('New caption');
  });
  
  it('should show generate button when enabled', () => {
    const { getByText } = render(
      <PostCaptionEditor 
        caption="" 
        onCaptionChange={jest.fn()}
        onGenerate={jest.fn()}
        canGenerate={true}
      />
    );
    
    expect(getByText('Generate Caption')).toBeTruthy();
  });
  
  // ... more tests
});
```

### Step 3: Write Tests for All Scenarios
Cover:
- ✅ Happy path (normal usage)
- ✅ Error cases (API failures, validation errors)
- ✅ Edge cases (empty input, max length, special chars)
- ✅ Boundary conditions (min/max values)
- ✅ State transitions (loading → success → error)
- ✅ User interactions (clicks, typing, gestures)

### Step 4: Run Tests - Expect Failures! 🔴
```bash
npm test

# Expected output:
FAIL  src/features/.../PostCaptionEditor.test.tsx
  PostCaptionEditor
    ✕ should render caption input (5 ms)
    ✕ should call onCaptionChange when text changes (3 ms)
    ✕ should show generate button when enabled (2 ms)

Reason: Cannot find module '../PostCaptionEditor'

Test Suites: 1 failed, 0 passed, 1 total
Tests:       15 failed, 0 passed, 15 total
```

**This is GOOD! Tests failing as expected! 🔴**

### Step 5: Verify Test Quality
- [ ] Tests are readable (clear test names)
- [ ] Tests are independent (no shared state)
- [ ] Tests cover requirements
- [ ] Mocks are properly configured
- [ ] Assertions are specific and meaningful

### Step 6: Generate Test Report
```markdown
# Phase 2: Test Report (RED)

## Tests Written

### Component Tests (5 files, 53 tests)
- PostCaptionEditor.test.tsx: 12 tests
- PlatformSelector.test.tsx: 8 tests
- MediaPreviewSection.test.tsx: 10 tests
- PostActionButtons.test.tsx: 8 tests
- SocialMarketingCompositePost.test.tsx: 15 tests

### Hook Tests (1 file, 20 tests)
- useSocialMarketingCompositePostLogic.test.ts: 20 tests

## Test Execution Results

Total: 73 tests
Passing: 0 ✅
Failing: 73 ❌ (Expected!)

## Coverage Setup
- Coverage threshold: 85%
- Coverage reporters: text, html, lcov
- Coverage directory: coverage/

## Next Step
Phase 3: Implement code to make these tests pass (GREEN)
```

---

## ✅ Success Criteria

Phase 2 complete when:
- [ ] Test files created for all components
- [ ] All tests written (73 tests in example)
- [ ] **ALL TESTS FAIL** (this is required!)
- [ ] Test failures are for correct reason (module not found / not implemented)
- [ ] Coverage setup configured
- [ ] Test report generated

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 2 COMPLETE: Write Tests (RED)
═══════════════════════════════════════════════════════════

📊 Summary:
Wrote 73 tests for all components and hooks

📦 Deliverables:
   🧪 PostCaptionEditor.test.tsx (12 tests)
   🧪 PlatformSelector.test.tsx (8 tests)
   🧪 MediaPreviewSection.test.tsx (10 tests)
   🧪 PostActionButtons.test.tsx (8 tests)
   🧪 SocialMarketingCompositePost.test.tsx (15 tests)
   🧪 useSocialMarketingCompositePostLogic.test.ts (20 tests)

🔴 Test Results (RED Phase):
   Total: 73 tests
   Passing: 0 ✅
   Failing: 73 ❌ (EXPECTED!)
   
   Failure reason: Modules not implemented yet ✓

✅ Success Criteria:
   ✅ All test files created
   ✅ 73 tests written
   ✅ All tests failing (correct TDD RED phase)
   ✅ Coverage configured (85% target)

⏭️  Next Phase: Phase 3 - Implementation (GREEN)
   Write minimum code to make all tests pass

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 3 (Implementation)
Type "/workflow:reject" → Revise tests
Type "/workflow:modify <feedback>" → Adjust test cases

Your response:
═══════════════════════════════════════════════════════════
```

---

## ⚠️ Validation Before Proceeding

Before allowing Phase 3:

```typescript
// Validate RED phase
const validation = {
  testsExist: true,
  testsRun: true,
  allTestsFail: true,  // MUST BE TRUE!
  failureReason: 'Module not found / Not implemented',
  coverageSetup: true
};

if (!validation.allTestsFail) {
  throw new Error('TDD violation: Tests must fail in RED phase!');
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Writing Implementation Code
```typescript
// WRONG in Phase 2!
export const PostCaptionEditor = ({ caption }) => {
  return <View>...</View>;
};
```

### ❌ Making Tests Pass
```typescript
// WRONG - mocking too much!
jest.mock('../PostCaptionEditor', () => ({
  PostCaptionEditor: () => <View testID="mocked" />
}));
```

### ✅ Correct RED Phase
```typescript
// CORRECT - test for non-existent module
import { PostCaptionEditor } from '../PostCaptionEditor';
// This import will fail → test fails → RED phase correct!

test('should render', () => {
  render(<PostCaptionEditor {...props} />);
  // Will fail because PostCaptionEditor doesn't exist yet
});
```

---

## 📂 Files Created

```
src/features/socialMarketing/
└── components/
    └── SocialMarketingCompositePost/
        └── __tests__/
            ├── PostCaptionEditor.test.tsx ⭐
            ├── PlatformSelector.test.tsx ⭐
            ├── MediaPreviewSection.test.tsx ⭐
            ├── PostActionButtons.test.tsx ⭐
            ├── SocialMarketingCompositePost.test.tsx ⭐
            └── useSocialMarketingCompositePostLogic.test.ts ⭐

logs/contexts/{workflow-id}/deliverables/
└── PHASE_2_TEST_REPORT.md
```

---

## 🎯 What Happens Next

After approval → `/workflow:phase:3`:
- Implement components to make tests pass
- Run tests → should turn GREEN ✅
- Verify coverage meets threshold (85%)

---

**Status:** Active command  
**Related:** workflow:phase:1, workflow:phase:3, workflow:approve

---

**Remember:** 
🔴 **RED = GOOD!** Tests failing means they're correctly testing non-existent code!

