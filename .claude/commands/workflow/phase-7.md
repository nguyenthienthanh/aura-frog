# Command: workflow:phase:7

**Version:** 1.0.0  
**Purpose:** Execute Phase 7 - QA Validation  
**Trigger:** Auto-triggered after Phase 6 approval OR manual `/workflow:phase:7`

---

## 🎯 Phase 7 Objectives

Final QA validation before documentation and deployment.

**Deliverables:**
1. Test Execution Report (Final)
2. Coverage Report (Final)
3. Manual Test Results
4. QA Sign-off

---

## 📋 Execution Steps

### Step 1: Pre-Phase Hook
- Load code review report
- Verify all blocking issues fixed
- Initialize QA validation

### Step 2: Run Full Test Suite
**Agent:** qa-automation

```bash
# Clean environment
npm run clean

# Fresh install
npm install

# Run ALL tests
npm test -- --coverage --verbose

# Expected output:
Test Suites: 6 passed, 6 total
Tests:       73 passed, 73 total
Snapshots:   0 total
Time:        12.543 s

Coverage summary:
Statements   : 88.5% ( 354/400 )
Branches     : 86.0% ( 172/200 )
Functions    : 90.0% ( 54/60 )
Lines        : 88.5% ( 354/400 )
```

### Step 3: Verify Coverage Threshold

```typescript
// Coverage must meet requirements
const coverageRequirements = {
  statements: 85,  // ✅ 88.5% meets
  branches: 80,    // ✅ 86.0% meets
  functions: 85,   // ✅ 90.0% meets
  lines: 85,       // ✅ 88.5% meets
};

if (actualCoverage < requirements) {
  throw new Error('Coverage below threshold');
}
```

### Step 4: Run Integration Tests

```bash
# Integration tests (if exist)
npm run test:integration

# E2E tests (if applicable)
npm run test:e2e
```

### Step 5: Build Verification

```bash
# Verify app builds successfully
npm run build

# Or for React Native:
npx expo prebuild
npx expo run:ios --configuration Release
npx expo run:android --variant release
```

### Step 6: Manual Testing Checklist

**QA Agent guides user through:**

```markdown
## Manual Test Checklist

Please test the following scenarios:

### Basic Functionality
- [ ] Component renders correctly
- [ ] Caption can be entered
- [ ] Platform can be selected
- [ ] Generate caption works
- [ ] Save caption works
- [ ] Post now button works
- [ ] Customize button works

### Edge Cases
- [ ] Empty caption handling
- [ ] Max length (280 chars) enforcement
- [ ] Special characters in caption
- [ ] Network error handling
- [ ] API timeout handling

### UI/UX
- [ ] Loading states show correctly
- [ ] Error messages display properly
- [ ] Success messages appear
- [ ] Animations smooth
- [ ] No visual glitches

### Device Testing (if mobile)
- [ ] iPhone 13 (portrait)
- [ ] iPhone 13 (landscape)
- [ ] iPad Air (portrait)
- [ ] iPad Air (landscape)
- [ ] Android phone (Samsung S21)
- [ ] Android tablet

### Performance
- [ ] No lag when typing
- [ ] Media loads quickly
- [ ] Smooth transitions
- [ ] No memory leaks (check DevTools)

### Accessibility
- [ ] Screen reader works
- [ ] Keyboard navigation works
- [ ] Touch targets adequate (44x44pt)
- [ ] Color contrast sufficient

### Regression Testing
- [ ] Existing features still work
- [ ] No breaking changes
- [ ] Navigation unaffected
- [ ] Analytics still firing
```

### Step 7: Performance Testing

```typescript
// Performance metrics to verify
const performanceMetrics = {
  initialRenderTime: '< 100ms',      // First paint
  interactionTime: '< 50ms',         // Button press to response
  memoryUsage: '< 50MB',             // Memory footprint
  bundleSize: '< 500KB',             // JS bundle size
};

// Measure actual performance
console.time('Component render');
// ... render component
console.timeEnd('Component render');
// Should be < 100ms
```

### Step 8: Generate Final QA Report

```markdown
# QA Validation Report

## Test Execution Summary

### Automated Tests
**Status:** ✅ PASSED

- Unit Tests: 73/73 passing ✅
- Integration Tests: 12/12 passing ✅
- E2E Tests: N/A
- Total: 85/85 tests passing ✅

**Coverage:**
- Statements: 88.5% ✅ (target: 85%)
- Branches: 86.0% ✅ (target: 80%)
- Functions: 90.0% ✅ (target: 85%)
- Lines: 88.5% ✅ (target: 85%)

### Manual Testing
**Status:** ✅ PASSED

- Basic Functionality: 7/7 ✅
- Edge Cases: 5/5 ✅
- UI/UX: 5/5 ✅
- Device Testing: 6/6 ✅
- Performance: 4/4 ✅
- Accessibility: 4/4 ✅
- Regression: 4/4 ✅

**Total:** 35/35 manual tests passed ✅

### Build Verification
**Status:** ✅ PASSED

- iOS Debug: ✅ Success
- iOS Release: ✅ Success
- Android Debug: ✅ Success
- Android Release: ✅ Success

### Performance Metrics
**Status:** ✅ PASSED

- Initial Render: 78ms ✅ (< 100ms)
- Interaction Time: 32ms ✅ (< 50ms)
- Memory Usage: 42MB ✅ (< 50MB)
- Bundle Size: 456KB ✅ (< 500KB)

### Issues Found
**Critical:** 0 ✅
**Major:** 0 ✅
**Minor:** 1
  - m-001: Loading spinner slightly off-center on iPad landscape

### Regression Check
**Status:** ✅ NO REGRESSIONS

- All existing features work ✅
- No breaking changes ✅
- Analytics still working ✅
- Navigation unaffected ✅

## QA Sign-Off

**QA Status:** ✅ APPROVED FOR DEPLOYMENT

**Tested By:** QA Automation Agent
**Date:** 2025-11-24
**Confidence:** 95%

**Recommendation:** DEPLOY TO PRODUCTION
```

---

## ✅ Success Criteria

Phase 7 complete when:
- [ ] All automated tests pass (85/85)
- [ ] Coverage meets threshold (≥85%)
- [ ] Manual testing complete (35/35)
- [ ] Build verification successful
- [ ] Performance metrics acceptable
- [ ] No critical/major issues
- [ ] QA sign-off obtained

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 7 COMPLETE: QA Validation
═══════════════════════════════════════════════════════════

📊 Summary:
QA validation complete - APPROVED FOR DEPLOYMENT

📦 Deliverables:
   📄 PHASE_7_QA_VALIDATION_REPORT.md
   📊 coverage-report-final.html
   📊 test-results-final.xml

🧪 Test Results:
   **Automated Tests:** 85/85 passing ✅
   - Unit: 73/73 ✅
   - Integration: 12/12 ✅
   
   **Manual Tests:** 35/35 passing ✅
   - Functionality: 7/7 ✅
   - Edge Cases: 5/5 ✅
   - UI/UX: 5/5 ✅
   - Devices: 6/6 ✅
   - Performance: 4/4 ✅
   - Accessibility: 4/4 ✅
   - Regression: 4/4 ✅

📊 Final Coverage:
   Statements: 88.5% ✅
   Branches: 86.0% ✅
   Functions: 90.0% ✅
   Lines: 88.5% ✅

🏗️  Build Verification:
   ✅ iOS Debug/Release
   ✅ Android Debug/Release
   ✅ No build errors

⚡ Performance:
   ✅ Render: 78ms (< 100ms)
   ✅ Interaction: 32ms (< 50ms)
   ✅ Memory: 42MB (< 50MB)
   ✅ Bundle: 456KB (< 500KB)

🐛 Issues: 1 minor (non-blocking)

✅ Success Criteria:
   ✅ All tests passing
   ✅ Coverage exceeds target
   ✅ No critical/major issues
   ✅ Performance acceptable
   ✅ QA sign-off obtained

⏭️  Next Phase: Phase 8 - Documentation
   Create deployment docs and summary

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 8 (Documentation)
Type "/workflow:reject" → Fix QA issues
Type "/workflow:modify <feedback>" → Retest specific areas

Your response:
═══════════════════════════════════════════════════════════
```

---

## 📂 Files Created

```
.claude/logs/contexts/{workflow-id}/deliverables/
├── PHASE_7_QA_VALIDATION_REPORT.md
├── coverage-report-final.html
└── test-results-final.xml
```

---

## 🎯 What Happens Next

After approval → `/workflow:phase:8`:
- Create implementation summary
- Generate deployment guide
- Prepare Confluence documentation
- Final workflow summary

---

**Status:** Active command  
**Related:** workflow:phase:6, workflow:phase:8, workflow:approve

