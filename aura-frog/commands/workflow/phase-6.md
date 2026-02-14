# Command: workflow:phase:6

**Version:** 1.0.0  
**Purpose:** Execute Phase 6 - Code Review  
**Trigger:** Auto-triggered after Phase 5c approval OR manual `/workflow:phase:6`

---

## 🎯 Phase 6 Objectives

Cross-agent code review to ensure quality and best practices.

**Deliverables:**
1. Code Review Report
2. Issues Found (if any)
3. Recommendations
4. Quality Score

---

## 📋 Execution Steps

### Step 1: Pre-Phase Hook
- Load all implemented code from Phase 5
- Initialize review checklist
- Activate review agents

### Step 2: Multi-Agent Review

**Primary Reviewer:** Dev agent (mobile-react-native/web-*/backend-laravel)  
**Secondary Reviewers:** qa-automation, ui-expert, pm-orchestrator

Each agent reviews from their perspective:

#### Dev Agent Review
- [ ] Code follows project conventions
- [ ] Props/interfaces properly typed
- [ ] Error handling comprehensive
- [ ] No code smells
- [ ] DRY principle followed
- [ ] Proper component composition

#### QA Agent Review
- [ ] Test coverage adequate (≥85%)
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Integration tests present
- [ ] Mock data appropriate

#### UI Designer Review
- [ ] Design tokens used correctly
- [ ] Responsive design implemented
- [ ] Accessibility labels present
- [ ] UI consistent with design system

### Step 3: Code Quality Checks

**Automated Checks:**
```bash
# 1. Linter
npm run lint
→ Must have: 0 errors, 0 warnings ✅

# 2. TypeScript
npx tsc --noEmit
→ Must have: No type errors ✅

# 3. Tests
npm test
→ Must have: All tests passing ✅

# 4. Coverage
npm test -- --coverage
→ Must have: ≥85% coverage ✅

# 5. Code complexity (if tool available)
npm run complexity
→ Target: Complexity < 10 per function
```

### Step 4: Manual Code Review

Review for:

**Architecture:**
- Component boundaries clear?
- Proper separation of concerns?
- State management appropriate?
- Dependencies well-managed?

**Readability:**
- Code self-documenting?
- Comments where needed?
- Naming conventions followed?
- Consistent formatting?

**Performance:**
- Unnecessary re-renders avoided?
- Memoization used appropriately?
- No performance bottlenecks?
- Bundle size acceptable?

**Security:**
- No sensitive data exposed?
- Input validation present?
- API calls secure?
- No XSS vulnerabilities?

### Step 5: Generate Review Report

```markdown
# Code Review Report

## Overall Assessment
**Status:** ✅ APPROVED / ⚠️ NEEDS CHANGES / ❌ REJECTED

**Quality Score:** 8.5/10

## Review Summary
Reviewed 5 components + 1 hook (620 lines total)

### Strengths
- ✅ Excellent test coverage (88.5%)
- ✅ Clean component structure
- ✅ Proper TypeScript usage
- ✅ Good separation of concerns
- ✅ Comprehensive error handling

### Issues Found
**Critical:** 0
**Major:** 1
**Minor:** 3
**Suggestions:** 5

## Detailed Findings

### Major Issues (1)
**M-001: Missing accessibility label**
- File: PostCaptionEditor.tsx, line 45
- Issue: TextInput missing accessibilityLabel
- Fix: Add accessibilityLabel="Caption input"
- Priority: HIGH

### Minor Issues (3)
**m-001: Inconsistent button styles**
- File: PostActionButtons.tsx, lines 25-30
- Issue: Inline styles should use design tokens
- Fix: Extract to styled component
- Priority: LOW

**m-002: Console.log left in code**
- File: useSocialMarketingLogic.ts, line 89
- Issue: Debug console.log not removed
- Fix: Remove console.log
- Priority: MEDIUM

**m-003: Missing JSDoc on public function**
- File: useSocialMarketingLogic.ts, line 120
- Issue: handleCustomize missing documentation
- Fix: Add JSDoc comment
- Priority: LOW

### Suggestions (5)
**s-001:** Consider extracting validation logic into separate util
**s-002:** Could memoize platform options array
**s-003:** Add loading skeleton for media preview
**s-004:** Consider adding analytics events
**s-005:** Add error boundary for graceful error handling

## Agent Reviews

### Mobile React Native Agent
**Score:** 9/10
- Code follows React Native best practices ✅
- Proper hook usage ✅
- Good component composition ✅
- Minor: Missing accessibility label (1 issue)

### QA Automation Agent
**Score:** 9.5/10
- Excellent test coverage (88.5%) ✅
- Edge cases well covered ✅
- Good mock usage ✅
- All tests passing ✅

### UI Designer Agent
**Score:** 8/10
- Design tokens used correctly ✅
- Responsive implementation good ✅
- Minor: Inconsistent button styles (1 issue)
- Suggestion: Add loading states

## Recommendations

### Must Fix Before Merging:
- [ ] Fix M-001: Add accessibility label

### Should Fix:
- [ ] Fix m-002: Remove console.log
- [ ] Fix m-003: Add JSDoc

### Nice to Have:
- [ ] Consider suggestions s-001 to s-005

## Approval Criteria Met
- [x] No critical issues
- [x] All tests passing
- [x] Coverage ≥ 85%
- [x] Linter clean
- [ ] All major issues fixed (1 remaining)
```

---

## ✅ Success Criteria

Phase 6 complete when:
- [ ] All agents completed review
- [ ] Issues categorized (critical/major/minor)
- [ ] Quality score calculated
- [ ] Recommendations provided
- [ ] No critical issues OR all fixed

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 6 COMPLETE: Code Review
═══════════════════════════════════════════════════════════

📊 Summary:
Multi-agent code review complete with quality score 8.5/10

📦 Deliverables:
   📄 PHASE_6_CODE_REVIEW_REPORT.md
   - Overall quality score: 8.5/10
   - 9 findings (0 critical, 1 major, 3 minor, 5 suggestions)

🔍 Review Results:
   **Critical Issues:** 0 ✅
   **Major Issues:** 1 ⚠️
   **Minor Issues:** 3
   **Suggestions:** 5

   Agent Scores:
   - Mobile RN Agent: 9/10
   - QA Agent: 9.5/10
   - UI Designer: 8/10

✅ Automated Checks:
   ✅ Linter: 0 errors, 0 warnings
   ✅ TypeScript: No type errors
   ✅ Tests: 73/73 passing
   ✅ Coverage: 88.5% (target: 85%)

⚠️  Issues to Address:
   **Major:**
   - M-001: Missing accessibility label (PostCaptionEditor)

   **Minor:**
   - m-002: Remove console.log (useSocialMarketingLogic)
   - m-003: Add JSDoc (handleCustomize function)

✅ Success Criteria:
   ✅ All agents reviewed
   ✅ No critical issues
   ⚠️  1 major issue (should fix)
   ✅ Quality score acceptable (8.5/10)

⏭️  Next Phase: Phase 7 - QA Validation
   Final testing before deployment

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 7 (accept current quality)
Type "/workflow:reject" → Fix issues first
Type "/workflow:modify fix M-001" → Fix specific issue then re-review

Your response:
═══════════════════════════════════════════════════════════
```

---

## 🔍 Review Checklists

### Code Quality Checklist
- [ ] No hardcoded values
- [ ] No magic numbers
- [ ] No code duplication
- [ ] Functions are small (< 50 lines)
- [ ] Proper error handling
- [ ] No console.logs
- [ ] Types are explicit

### React/React Native Checklist
- [ ] Hooks rules followed
- [ ] No unnecessary re-renders
- [ ] Keys on lists
- [ ] Accessibility labels
- [ ] Memo used appropriately
- [ ] Props validated

### Testing Checklist
- [ ] Coverage ≥ threshold
- [ ] Happy paths tested
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Integration tests present

---

## 📂 Files Created

```
logs/contexts/{workflow-id}/deliverables/
└── PHASE_6_CODE_REVIEW_REPORT.md
```

---

## 🎯 What Happens Next

After approval → `/workflow:phase:7`:
- Final QA validation
- Run all tests
- Manual testing (if applicable)
- Verify production readiness

---

**Status:** Active command  
**Related:** workflow:phase:5c, workflow:phase:7, workflow:approve

