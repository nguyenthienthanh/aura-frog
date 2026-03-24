# Command: workflow:phase:4

**Purpose:** Execute Phase 4 - Refactor (REFACTOR Phase of TDD)
**Trigger:** Auto-triggered after Phase 3 approval OR manual `/workflow:phase:4`

---

## 🎯 Phase 4 Objectives (TDD REFACTOR Phase)

**Improve code quality WITHOUT changing behavior.**

**Deliverables:**
1. Refactored code
2. Test execution report (STILL ALL PASSING)
3. Code quality improvements report
4. Performance optimizations (if any)

---

## ♻️ TDD REFACTOR Phase Rules

### CRITICAL: Tests Must Still Pass!
- ✅ Improve code structure
- ✅ Remove duplication
- ✅ Enhance readability
- ✅ Optimize performance
- ✅ **Tests must STILL PASS**
- ❌ DO NOT change behavior
- ❌ DO NOT break tests

**Safety Net: Tests ensure no regressions**

---

## 📋 Execution Steps

### Step 1: Baseline Metrics
Capture current state:

```typescript
// Before Refactoring
const baseline = {
  complexity: 18,            // Cyclomatic complexity
  duplication: 25,           // % duplicated code
  maintainability: 65,       // Maintainability index
  linesOfCode: 650,
  testsPassing: 73,
  coverage: 88.2,
};
```

### Step 2: Identify Refactoring Opportunities

**Common Issues to Fix:**

1. **Code Duplication**
```typescript
// ❌ BEFORE: Duplicated loading button logic
<TouchableOpacity disabled={isLoading}>
  <Text>{isLoading ? 'Loading...' : 'Save'}</Text>
</TouchableOpacity>

<TouchableOpacity disabled={isGenerating}>
  <Text>{isGenerating ? 'Generating...' : 'Generate'}</Text>
</TouchableOpacity>

// ✅ AFTER: Extract LoadingButton component
<LoadingButton
  onPress={onSave}
  isLoading={isLoading}
  label="Save"
  loadingLabel="Saving..."
/>

<LoadingButton
  onPress={onGenerate}
  isLoading={isGenerating}
  label="Generate"
  loadingLabel="Generating..."
/>
```

2. **Long Functions**
```typescript
// ❌ BEFORE: 50+ line function
const handlePostNow = async () => {
  // Validation logic
  // API call preparation
  // Error handling
  // Success handling
  // Analytics tracking
  // Navigation
  // 50+ lines total
};

// ✅ AFTER: Break into smaller functions
const handlePostNow = async () => {
  if (!validatePost()) return;
  
  const postData = preparePostData();
  const result = await submitPost(postData);
  
  handlePostResult(result);
  trackPostAnalytics(result);
  navigateToResult(result);
};
```

3. **Complex Conditionals**
```typescript
// ❌ BEFORE: Nested conditionals
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // Do something
    }
  }
}

// ✅ AFTER: Early returns
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;

// Do something
```

4. **Magic Numbers/Strings**
```typescript
// ❌ BEFORE: Magic values
if (caption.length > 280) {
  // Error
}

// ✅ AFTER: Named constants
const MAX_CAPTION_LENGTH = 280;

if (caption.length > MAX_CAPTION_LENGTH) {
  // Error
}
```

### Step 3: Apply Refactorings

**Agent:** Primary dev agent

Apply refactorings one at a time:

```bash
# Refactor 1: Extract LoadingButton
→ Run tests → All pass ✅
→ Commit changes

# Refactor 2: Break handlePostNow into smaller functions
→ Run tests → All pass ✅
→ Commit changes

# Refactor 3: Simplify conditionals
→ Run tests → All pass ✅
→ Commit changes

# ... continue
```

### Step 4: Performance Optimizations

```typescript
// Add React.memo for pure components
export const PostCaptionEditor = React.memo<PostCaptionEditorProps>(
  ({ caption, onCaptionChange, ...props }) => {
    // Component code
  }
);

// Use useCallback for event handlers
const handleCaptionChange = useCallback((text: string) => {
  onCaptionChange(text);
}, [onCaptionChange]);

// Use useMemo for derived values
const isValid = useMemo(() => {
  return caption.length > 0 && caption.length <= MAX_CAPTION_LENGTH;
}, [caption]);
```

### Step 5: Code Quality Improvements

```typescript
// Add comprehensive JSDoc
/**
 * PostCaptionEditor - Component for editing post captions
 * 
 * @param caption - Current caption text
 * @param onCaptionChange - Callback when caption changes
 * @param onGenerate - Optional callback to generate caption via AI
 * @param canGenerate - Whether generate button should be shown
 * @param isGenerating - Whether caption is currently being generated
 * 
 * @example
 * <PostCaptionEditor
 *   caption={post.caption}
 *   onCaptionChange={setCaption}
 *   onGenerate={handleGenerate}
 *   canGenerate={true}
 * />
 */
```

### Step 6: Run Tests After Each Refactoring

```bash
# After EVERY refactoring:
npm test

# Must see:
Test Suites: 6 passed, 6 total
Tests:       73 passed, 73 total
Coverage:    88.2% (maintained) ✅
```

### Step 7: Final Metrics

```typescript
// After Refactoring
const improved = {
  complexity: 8,              // ✅ Reduced from 18
  duplication: 5,             // ✅ Reduced from 25
  maintainability: 85,        // ✅ Improved from 65
  linesOfCode: 620,           // ✅ Reduced from 650
  testsPassing: 73,           // ✅ Still 73 (no change)
  coverage: 88.5,             // ✅ Slightly improved
};

const improvements = {
  complexity: -56%,           // 56% reduction
  duplication: -80%,          // 80% reduction
  maintainability: +31%,      // 31% improvement
};
```

---

## ✅ Success Criteria

Phase 4 complete when:
- [ ] Code refactored for quality
- [ ] **ALL 73 TESTS STILL PASS** ✅
- [ ] Coverage maintained or improved
- [ ] Complexity reduced
- [ ] Duplication eliminated
- [ ] Performance optimized
- [ ] Code quality improved

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 4 COMPLETE: Refactor
═══════════════════════════════════════════════════════════

📊 Summary:
Refactored code for better quality, all tests still passing!

📦 Changes Made:
   ♻️ Extracted LoadingButton component (removed duplication)
   ♻️ Split handlePostNow into 5 smaller functions
   ♻️ Simplified nested conditionals (early returns)
   ♻️ Replaced magic numbers with constants
   ♻️ Added React.memo to 3 components
   ♻️ Added useCallback to 8 handlers
   ♻️ Added comprehensive JSDoc comments

🟢 Test Results (Still GREEN!):
   Total: 73 tests
   Passing: 73 ✅
   Failing: 0 ✅
   
   Coverage: 88.5% ✅ (improved from 88.2%)
   Duration: 11.8s (faster!)

📈 Code Quality Improvements:
   Complexity: 8 (was 18) ↓ 56%
   Duplication: 5% (was 25%) ↓ 80%
   Maintainability: 85 (was 65) ↑ 31%
   Lines of Code: 620 (was 650) ↓ 5%

✅ Success Criteria:
   ✅ Code refactored
   ✅ All tests still passing
   ✅ Coverage maintained (88.5%)
   ✅ Complexity reduced (-56%)
   ✅ Duplication eliminated (-80%)
   ✅ No behavior changes

⏭️  Next Phase: Phase 5 - Finalize
   Documentation, QA validation, and notifications

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 5 (Finalize)
Type "/workflow:reject" → Revert refactorings
Type "/workflow:modify <feedback>" → Adjust refactorings

Your response:
═══════════════════════════════════════════════════════════
```

---

## ⚠️ Safety Checks

```typescript
// After each refactoring, verify:
const safetyChecks = {
  testsPass: true,          // ✅ REQUIRED
  coverageMaintained: true, // ✅ REQUIRED
  behaviorUnchanged: true,  // ✅ REQUIRED
  performanceOK: true,      // ✅ REQUIRED
};

if (!safetyChecks.testsPass) {
  console.error('❌ Tests broke! Revert refactoring.');
  git.revert();
}
```

---

## 📂 Files Modified

```
src/features/socialMarketing/
└── components/
    └── SocialMarketingCompositePost/
        ├── SocialMarketingCompositePost.phone.tsx (refactored)
        ├── components/
        │   ├── PostCaptionEditor.tsx (optimized)
        │   ├── PlatformSelector.tsx (optimized)
        │   ├── MediaPreviewSection.tsx (optimized)
        │   ├── PostActionButtons.tsx (optimized)
        │   └── LoadingButton.tsx (new - extracted)
        └── hooks/
            └── useSocialMarketingCompositePostLogic.ts (refactored)

logs/contexts/{workflow-id}/deliverables/
└── PHASE_4_REFACTORING_REPORT.md
```

---

## 💡 Refactoring Checklist

### Code Structure
- [ ] Extract duplicated code
- [ ] Break long functions
- [ ] Simplify conditionals
- [ ] Remove dead code

### Performance
- [ ] Add React.memo where appropriate
- [ ] Use useCallback for handlers
- [ ] Use useMemo for expensive calculations
- [ ] Optimize re-renders

### Readability
- [ ] Add JSDoc comments
- [ ] Replace magic numbers/strings
- [ ] Improve naming
- [ ] Consistent formatting

### Safety
- [ ] Run tests after EACH change
- [ ] Verify coverage maintained
- [ ] Check performance hasn't regressed
- [ ] Review diffs carefully

---

## 🎯 What Happens Next

After approval → `/workflow:phase:5`:
- Documentation and QA validation
- Final quality checks
- Notifications and workflow archive

---

**Status:** Active command  
**Related:** workflow:phase:3, workflow:phase:5, workflow:approve

---

**Remember:**  
♻️ **REFACTOR = IMPROVE!** Better code, same behavior, tests still green!

