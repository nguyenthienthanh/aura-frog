# Command: review:fix

**Purpose:** Auto-fix code review issues from Phase 6  
**Aliases:** `fix review`, `auto fix`, `fix issues`

---

## 🎯 Overview

Automatically fix issues found in Phase 6 Code Review.

**Use when:**
- Phase 6 review complete
- Issues identified
- Want auto-fix instead of manual
- Save time on minor/routine fixes

---

## 📋 Usage

```bash
# Fix all fixable issues
review:fix

# Fix specific issue
review:fix M-001

# Fix by priority
review:fix --priority=critical
review:fix --priority=major
review:fix --priority=minor

# Fix by category
review:fix --category=accessibility
review:fix --category=performance
review:fix --category=style

# Dry run (show what will be fixed)
review:fix --dry-run
```

---

## 🔄 Execution Flow

### 1. Load Review Report

```typescript
// Read Phase 6 deliverables
const reviewReport = loadFile(
  '.claude/logs/contexts/{workflow-id}/deliverables/PHASE_6_CODE_REVIEW_REPORT.md'
);

// Parse issues
const issues = parseIssues(reviewReport);

console.log(`Found ${issues.length} issues`);
console.log(`- Critical: ${issues.filter(i => i.priority === 'critical').length}`);
console.log(`- Major: ${issues.filter(i => i.priority === 'major').length}`);
console.log(`- Minor: ${issues.filter(i => i.priority === 'minor').length}`);
```

### 2. Analyze Fixability

```markdown
## 🔍 Issue Analysis

**Total Issues:** 9

**Auto-Fixable:** 6 ✅
- M-001: Missing accessibility label → Can fix
- m-002: Remove console.log → Can fix
- m-003: Add JSDoc → Can fix
- m-001: Inconsistent button styles → Can fix
- s-002: Memoize array → Can fix
- s-003: Add loading skeleton → Can fix

**Manual Fix Required:** 3 ⚠️
- s-001: Extract validation logic → Too complex (needs refactoring)
- s-004: Add analytics → Needs business logic
- s-005: Add error boundary → Architectural change

**Cannot Fix:** 0 ❌

---

**Proceeding with 6 auto-fixes...**
```

### 3. Execute Fixes

#### Fix Type 1: Missing Accessibility Label

**Issue M-001:**
```typescript
// File: PostCaptionEditor.tsx, line 45
// Issue: TextInput missing accessibilityLabel
```

**Before:**
```typescript
<TextInput
  value={caption}
  onChangeText={setCaption}
  placeholder="Enter caption..."
/>
```

**After:**
```typescript
<TextInput
  value={caption}
  onChangeText={setCaption}
  placeholder="Enter caption..."
  accessibilityLabel="Caption input"
  accessibilityHint="Enter a caption for your post"
/>
```

#### Fix Type 2: Remove Console.log

**Issue m-002:**
```typescript
// File: useSocialMarketingLogic.ts, line 89
// Issue: Debug console.log not removed
```

**Before:**
```typescript
const handleSave = async () => {
  console.log('Saving post:', post); // Debug
  await savePost(post);
};
```

**After:**
```typescript
const handleSave = async () => {
  await savePost(post);
};
```

#### Fix Type 3: Add JSDoc

**Issue m-003:**
```typescript
// File: useSocialMarketingLogic.ts, line 120
// Issue: handleCustomize missing documentation
```

**Before:**
```typescript
const handleCustomize = () => {
  setEditMode(true);
};
```

**After:**
```typescript
/**
 * Enable edit mode for post customization
 * Allows user to modify caption, platform selection, and media
 */
const handleCustomize = () => {
  setEditMode(true);
};
```

#### Fix Type 4: Extract Inline Styles

**Issue m-001:**
```typescript
// File: PostActionButtons.tsx, lines 25-30
// Issue: Inline styles should use design tokens
```

**Before:**
```typescript
<TouchableOpacity
  style={{
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  }}
>
  <Text style={{ color: '#FFFFFF' }}>Save</Text>
</TouchableOpacity>
```

**After:**
```typescript
const SaveButton = () => {
  const { colors, space, borderRadius } = useTheme();
  
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary[500],
        padding: space[4],
        borderRadius: borderRadius.md,
      }}
    >
      <Text style={{ color: colors.text.inverse }}>Save</Text>
    </TouchableOpacity>
  );
};
```

#### Fix Type 5: Add Memoization

**Issue s-002:**
```typescript
// File: useSocialMarketingLogic.ts, line 56
// Issue: Platform options array recreated on every render
```

**Before:**
```typescript
const useSocialMarketingLogic = () => {
  const platformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
  ];
  
  return { platformOptions };
};
```

**After:**
```typescript
const PLATFORM_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
] as const;

const useSocialMarketingLogic = () => {
  const platformOptions = useMemo(() => PLATFORM_OPTIONS, []);
  
  return { platformOptions };
};
```

#### Fix Type 6: Add Loading States

**Issue s-003:**
```typescript
// File: MediaPreview.tsx, line 34
// Issue: No loading skeleton while media loads
```

**Before:**
```typescript
const MediaPreview = ({ uri }) => {
  return <Image source={{ uri }} />;
};
```

**After:**
```typescript
const MediaPreview = ({ uri }) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <View>
      {loading && <Skeleton width="100%" height={200} />}
      <Image 
        source={{ uri }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ display: loading ? 'none' : 'flex' }}
      />
    </View>
  );
};
```

### 4. Re-run Checks

```typescript
// After fixes, re-run automated checks
console.log('🔧 Fixes applied, re-running checks...\n');

// 1. Linter
const lintResult = runLint();
console.log(`✅ Linter: ${lintResult.errors} errors, ${lintResult.warnings} warnings`);

// 2. TypeScript
const tsResult = runTypeScript();
console.log(`✅ TypeScript: ${tsResult.errors} type errors`);

// 3. Tests
const testResult = runTests();
console.log(`✅ Tests: ${testResult.passed}/${testResult.total} passing`);

// 4. Coverage
const coverageResult = runCoverage();
console.log(`✅ Coverage: ${coverageResult.overall}%`);
```

### 5. Update Review Report

```markdown
## 🔄 Auto-Fix Results

**Fixes Applied:** 6/9

**Fixed Issues:**
- ✅ M-001: Added accessibility labels (PostCaptionEditor.tsx)
- ✅ m-002: Removed console.log (useSocialMarketingLogic.ts)
- ✅ m-003: Added JSDoc (handleCustomize function)
- ✅ m-001: Extracted styles to theme (PostActionButtons.tsx)
- ✅ s-002: Memoized platform options (useSocialMarketingLogic.ts)
- ✅ s-003: Added loading skeleton (MediaPreview.tsx)

**Remaining Issues (Manual Fix Required):**
- ⚠️ s-001: Extract validation logic (requires refactoring)
- ⚠️ s-004: Add analytics events (needs business logic)
- ⚠️ s-005: Add error boundary (architectural change)

---

## ✅ Post-Fix Quality

**Before Fixes:**
- Quality Score: 8.5/10
- Issues: 9 (1 major, 3 minor, 5 suggestions)

**After Fixes:**
- Quality Score: 9.2/10 ✅ (+0.7)
- Issues: 3 (all suggestions, manual fix needed)

**Automated Checks:**
- ✅ Linter: 0 errors, 0 warnings (was: 2 warnings)
- ✅ TypeScript: 0 type errors
- ✅ Tests: 73/73 passing
- ✅ Coverage: 88.5%

---

## 📝 Changes Made

**Files Modified:** 4
1. `PostCaptionEditor.tsx` - Added accessibility
2. `useSocialMarketingLogic.ts` - Removed debug, added docs, memoization
3. `PostActionButtons.tsx` - Extracted theme styles
4. `MediaPreview.tsx` - Added loading state

**Lines Changed:** 47
- Added: 32 lines
- Removed: 15 lines
- Modified: 4 files

---

## 🎯 Next Steps

**Option 1: Approve & Continue**
```bash
approve → Proceed to Phase 7 (QA Validation)
```

**Option 2: Fix Remaining Issues Manually**
```bash
# Address s-001, s-004, s-005
# Then run: review:fix --verify
```

**Option 3: Re-review**
```bash
workflow:phase:6 --rerun
```
```

### 6. Generate Diff Summary

```markdown
## 📊 Detailed Changes

### PostCaptionEditor.tsx

```diff
  <TextInput
    value={caption}
    onChangeText={setCaption}
    placeholder="Enter caption..."
+   accessibilityLabel="Caption input"
+   accessibilityHint="Enter a caption for your post"
  />
```

### useSocialMarketingLogic.ts

```diff
  const handleSave = async () => {
-   console.log('Saving post:', post);
    await savePost(post);
  };

+ /**
+  * Enable edit mode for post customization
+  * Allows user to modify caption, platform selection, and media
+  */
  const handleCustomize = () => {
    setEditMode(true);
  };

+ const PLATFORM_OPTIONS = [
+   { value: 'facebook', label: 'Facebook' },
+   { value: 'instagram', label: 'Instagram' },
+   { value: 'tiktok', label: 'TikTok' },
+ ] as const;

  const useSocialMarketingLogic = () => {
-   const platformOptions = [
-     { value: 'facebook', label: 'Facebook' },
-     { value: 'instagram', label: 'Instagram' },
-     { value: 'tiktok', label: 'TikTok' },
-   ];
+   const platformOptions = useMemo(() => PLATFORM_OPTIONS, []);
```

### PostActionButtons.tsx

```diff
+ const SaveButton = () => {
+   const { colors, space, borderRadius } = useTheme();
+
+   return (
      <TouchableOpacity
        style={{
-         backgroundColor: '#007AFF',
-         padding: 16,
-         borderRadius: 8,
+         backgroundColor: colors.primary[500],
+         padding: space[4],
+         borderRadius: borderRadius.md,
        }}
      >
-       <Text style={{ color: '#FFFFFF' }}>Save</Text>
+       <Text style={{ color: colors.text.inverse }}>Save</Text>
      </TouchableOpacity>
+   );
+ };
```

### MediaPreview.tsx

```diff
  const MediaPreview = ({ uri }) => {
+   const [loading, setLoading] = useState(true);
+
    return (
+     <View>
+       {loading && <Skeleton width="100%" height={200} />}
        <Image 
          source={{ uri }}
+         onLoadStart={() => setLoading(true)}
+         onLoadEnd={() => setLoading(false)}
+         style={{ display: loading ? 'none' : 'flex' }}
        />
+     </View>
    );
  };
```
```

---

## 🎯 Fix Categories

### Auto-Fixable Issues

#### 1. **Accessibility**
- ✅ Add accessibilityLabel
- ✅ Add accessibilityHint
- ✅ Add accessibilityRole
- ✅ Fix contrast ratios
- ✅ Add keyboard navigation

#### 2. **Code Quality**
- ✅ Remove console.log/console.error
- ✅ Remove unused imports
- ✅ Remove unused variables
- ✅ Fix linter warnings
- ✅ Add missing semicolons

#### 3. **Documentation**
- ✅ Add JSDoc comments
- ✅ Add function descriptions
- ✅ Add param types
- ✅ Add return types

#### 4. **Style/Theme**
- ✅ Replace hardcoded colors
- ✅ Replace hardcoded spacing
- ✅ Replace hardcoded sizes
- ✅ Use theme tokens

#### 5. **Performance**
- ✅ Add memoization (simple cases)
- ✅ Add useCallback (simple cases)
- ✅ Move constants outside component
- ✅ Add loading states

#### 6. **TypeScript**
- ✅ Add missing types
- ✅ Fix type errors
- ✅ Add explicit returns
- ✅ Fix any types

### Manual Fix Required

#### 1. **Architecture**
- ⚠️ Extract to separate component
- ⚠️ Add error boundary
- ⚠️ Refactor state management
- ⚠️ Change API structure

#### 2. **Business Logic**
- ⚠️ Add analytics
- ⚠️ Change validation rules
- ⚠️ Modify workflow
- ⚠️ Update business logic

#### 3. **Complex Refactoring**
- ⚠️ Extract utilities
- ⚠️ Simplify complex functions
- ⚠️ Reduce cyclomatic complexity
- ⚠️ Split large components

---

## 💡 Options

### By Priority

```bash
# Fix only critical
review:fix --priority=critical

# Fix critical + major
review:fix --priority=major

# Fix all auto-fixable
review:fix --all
```

### By Category

```bash
# Fix accessibility only
review:fix --category=accessibility

# Fix performance only
review:fix --category=performance

# Fix style only
review:fix --category=style
```

### By Issue ID

```bash
# Fix specific issues
review:fix M-001 m-002 m-003

# Fix range
review:fix M-001..m-003
```

### Dry Run

```bash
# Show what will be fixed without applying
review:fix --dry-run

# Output:
# Would fix:
# - M-001: Add accessibility label (PostCaptionEditor.tsx:45)
# - m-002: Remove console.log (useSocialMarketingLogic.ts:89)
# ...
```

---

## 🔍 Safety Features

### 1. Backup Before Fix

```typescript
// Create backup before applying fixes
const backupDir = `.claude/backups/${Date.now()}`;

for (const file of filesToModify) {
  createBackup(file, backupDir);
}

console.log(`✅ Backup created: ${backupDir}`);
```

### 2. Validation After Fix

```typescript
// Validate fixes don't break anything
const validation = {
  linter: runLint(),
  typescript: runTypeScript(),
  tests: runTests(),
};

if (validation.tests.failed > 0) {
  console.error('❌ Fixes broke tests! Rolling back...');
  rollback(backupDir);
  return;
}

console.log('✅ All validations passed');
```

### 3. Rollback Option

```bash
# If something goes wrong
review:fix --rollback

# Restore from specific backup
review:fix --restore=1732453200000
```

---

## ✅ Success Criteria

✅ All auto-fixable issues resolved  
✅ No new issues introduced  
✅ All tests still passing  
✅ Linter clean  
✅ TypeScript clean  
✅ Quality score improved  

---

## 📊 Output Summary

```markdown
╔══════════════════════════════════════════════════════════╗
║  ✅ AUTO-FIX COMPLETE                                    ║
╚══════════════════════════════════════════════════════════╝

## 🔧 Fixes Applied

**Total Issues:** 9  
**Fixed:** 6 ✅  
**Manual:** 3 ⚠️  
**Failed:** 0 ❌

---

## 📈 Quality Improvement

**Before:** 8.5/10  
**After:** 9.2/10 (+0.7) ✅

**Issues Resolved:**
- ✅ 1 major issue
- ✅ 3 minor issues
- ✅ 2 suggestions

**Remaining:**
- ⚠️ 3 suggestions (manual fix needed)

---

## 📝 Changes Summary

**Files Modified:** 4  
**Lines Changed:** 47 (32 added, 15 removed)

**Modified Files:**
1. PostCaptionEditor.tsx
2. useSocialMarketingLogic.ts
3. PostActionButtons.tsx
4. MediaPreview.tsx

---

## ✅ Verification

**Automated Checks:**
- ✅ Linter: 0 errors, 0 warnings
- ✅ TypeScript: 0 type errors
- ✅ Tests: 73/73 passing
- ✅ Coverage: 88.5%

---

## 🎯 Next Steps

**Recommended:**
```bash
approve → Proceed to Phase 7 (QA Validation)
```

**Or manually address remaining issues:**
- s-001: Extract validation logic
- s-004: Add analytics events
- s-005: Add error boundary

---

**Backup Location:** `.claude/backups/1732453200000/`  
**Rollback:** `review:fix --rollback`
```

---

## 🔗 Integration

### With Workflow

```bash
# Normal workflow
workflow:start "Task"
# ... Phase 1-5 ...
# Phase 6: Code Review → Issues found

# Auto-fix issues
review:fix

# Continue workflow
approve → Phase 7
```

### Standalone Usage

```bash
# After any code review
review:fix

# Fix specific categories
review:fix --category=accessibility --category=style
```

---

## 🎓 Examples

### Example 1: Fix All Auto-Fixable

```bash
review:fix

# Output:
# Analyzing 9 issues...
# ✅ Can fix: 6 issues
# ⚠️ Manual: 3 issues
#
# Applying fixes...
# ✅ Fixed M-001
# ✅ Fixed m-002
# ✅ Fixed m-003
# ...
#
# Quality: 8.5/10 → 9.2/10
```

### Example 2: Fix by Priority

```bash
review:fix --priority=critical

# No critical issues found
# Try: review:fix --priority=major
```

### Example 3: Dry Run

```bash
review:fix --dry-run

# Would fix 6 issues:
# - M-001: Add accessibility (easy)
# - m-002: Remove console.log (easy)
# - m-003: Add JSDoc (medium)
# ...
#
# Run without --dry-run to apply
```

---

**Command:** review:fix  
**Version:** 1.0.0  
**Added:** CCPM v4.4  
**Integration:** Phase 6 Code Review

