# Command: workflow:phase:3

**Version:** 1.0.0
**Purpose:** Execute Phase 3 - Build GREEN (Implementation Phase of TDD)
**Trigger:** Auto-triggered after Phase 2 completion OR manual `/workflow:phase:3`

---

## 🎯 Phase 3 Objectives (TDD GREEN Phase)

**Write minimum code to make ALL tests pass.**

**Deliverables:**
1. Implemented components/modules
2. Test execution report (ALL TESTS MUST PASS)
3. Coverage report (≥85%)
4. Linter report (0 warnings)

---

## 🟢 TDD GREEN Phase Rules

### CRITICAL: Make Tests Pass!
- ✅ Implement components to satisfy tests
- ✅ Write minimum code needed
- ✅ All tests must pass
- ✅ Coverage must meet threshold (85%)
- ❌ DO NOT skip tests
- ❌ DO NOT over-engineer

**Focus: Make it work, not perfect (refactor in Phase 4)**

---

## 📋 Execution Steps

### Step 1: Load Test Files
- Read Phase 2 test files
- Understand what tests expect
- Check test failures

### Step 2: Implement Components
**Agents:** Primary dev agent + qa-automation

For each component, implement:

```typescript
// Example: PostCaptionEditor.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@emotion/react';

interface PostCaptionEditorProps {
  caption: string;
  onCaptionChange: (caption: string) => void;
  onGenerate?: () => void;
  onSave?: () => void;
  canGenerate?: boolean;
  isGenerating?: boolean;
  isSaving?: boolean;
}

export const PostCaptionEditor: React.FC<PostCaptionEditorProps> = ({
  caption,
  onCaptionChange,
  onGenerate,
  onSave,
  canGenerate = false,
  isGenerating = false,
  isSaving = false,
}) => {
  const { colors, space, sizes } = useTheme();

  return (
    <View style={{ padding: space.md }}>
      {/* Caption Input */}
      <TextInput
        value={caption}
        onChangeText={onCaptionChange}
        placeholder="Enter caption..."
        multiline
        maxLength={280}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: space.sm,
          minHeight: 100,
        }}
      />

      {/* Generate Button */}
      {canGenerate && onGenerate && (
        <TouchableOpacity
          onPress={onGenerate}
          disabled={isGenerating}
          style={{
            backgroundColor: colors.primary,
            padding: space.sm,
            borderRadius: 8,
            marginTop: space.sm,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {isGenerating ? 'Generating...' : 'Generate Caption'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Save Button */}
      {onSave && (
        <TouchableOpacity
          onPress={onSave}
          disabled={isSaving}
          style={{
            backgroundColor: colors.secondary,
            padding: space.sm,
            borderRadius: 8,
            marginTop: space.sm,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### Step 3: Implement Custom Hook

```typescript
// useSocialMarketingCompositePostLogic.ts
export function useSocialMarketingCompositePostLogic(
  post: SocialMarketingPost | undefined,
  storyTemplate: StoryTemplate | undefined
) {
  // State
  const [caption, setCaption] = useState(post?.caption || '');
  const [platform, setPlatform] = useState<SocialMarketingPlatform>('facebook');
  const [muted, setMuted] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handlers
  const handleSaveCaption = async () => {
    // Implementation
  };
  
  const handleGenerateCaption = async () => {
    // Implementation
  };
  
  // ... more handlers
  
  return {
    state: {
      caption,
      platform,
      muted,
      isGenerating,
      // ... more state
    },
    handlers: {
      handleSaveCaption,
      handleGenerateCaption,
      // ... more handlers
    },
  };
}
```

### Step 4: Run Tests Continuously

```bash
# Watch mode - tests run on file save
npm test -- --watch

# Expected progression:
# Initial: 73 tests, 73 failing
# After implementing PostCaptionEditor: 61 failing
# After implementing PlatformSelector: 49 failing
# After implementing all: 0 failing ✅
```

### Step 5: Check Coverage

```bash
npm test -- --coverage

# Expected output:
File                          | % Stmts | % Branch | % Funcs | % Lines |
------------------------------|---------|----------|---------|---------|
PostCaptionEditor.tsx         |   87.5  |   85.0   |   90.0  |   87.5  |
PlatformSelector.tsx          |   91.2  |   88.5   |   92.0  |   91.2  |
MediaPreviewSection.tsx       |   85.3  |   82.0   |   86.0  |   85.3  |
PostActionButtons.tsx         |   89.1  |   85.5   |   90.0  |   89.1  |
useSocialMarketingLogic.ts    |   92.5  |   90.0   |   94.0  |   92.5  |
------------------------------|---------|----------|---------|---------|
All files                     |   88.2  |   86.0   |   90.0  |   88.2  | ✅
```

**Target: ≥85% overall** ✅

### Step 6: Run Linter

```bash
npm run lint

# Expected: 0 errors, 0 warnings
✓ All files pass linting
```

### Step 7: Verify No Breaking Changes

- Check existing tests still pass
- Verify app builds successfully
- Manual smoke test (if applicable)

---

## ✅ Success Criteria

Phase 3 complete when:
- [ ] All components implemented
- [ ] **ALL 73 TESTS PASS** ✅
- [ ] Coverage ≥ 85% (target met)
- [ ] Linter passes (0 warnings)
- [ ] No breaking changes
- [ ] App builds successfully

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 5b COMPLETE: Implementation (GREEN)
═══════════════════════════════════════════════════════════

📊 Summary:
Implemented 5 components + 1 custom hook, all tests passing!

📦 Deliverables:
   ⚛️ PostCaptionEditor.tsx (95 lines)
   ⚛️ PlatformSelector.tsx (65 lines)
   ⚛️ MediaPreviewSection.tsx (85 lines)
   ⚛️ PostActionButtons.tsx (75 lines)
   ⚛️ SocialMarketingCompositePost.phone.tsx (125 lines - refactored)
   🔧 useSocialMarketingCompositePostLogic.ts (210 lines)

🟢 Test Results (GREEN Phase):
   Total: 73 tests
   Passing: 73 ✅
   Failing: 0 ✅
   
   Duration: 12.5s
   All tests green! 🎉

📊 Coverage Report:
   Statements: 88.2% ✅ (target: 85%)
   Branches: 86.0% ✅ (target: 80%)
   Functions: 90.0% ✅ (target: 85%)
   Lines: 88.2% ✅ (target: 85%)

✅ Linter: 0 errors, 0 warnings ✅

✅ Success Criteria:
   ✅ All components implemented
   ✅ All 73 tests passing
   ✅ Coverage exceeds threshold (88% vs 85%)
   ✅ Linter clean
   ✅ No breaking changes

⏭️  Next Phase: Phase 4 - Refactor
   Improve code quality while keeping tests green

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 4 (REFACTOR)
Type "/workflow:reject" → Fix implementation issues
Type "/workflow:modify <feedback>" → Adjust implementation

Your response:
═══════════════════════════════════════════════════════════
```

---

## ⚠️ Validation Before Proceeding

```typescript
// Must pass all checks
const validation = {
  allTestsPass: true,       // ✅ REQUIRED
  coverageMet: true,        // ✅ REQUIRED (≥85%)
  linterClean: true,        // ✅ REQUIRED
  noBreakingChanges: true,  // ✅ REQUIRED
};

if (!validation.allTestsPass) {
  throw new Error('Cannot proceed: Tests failing');
}

if (!validation.coverageMet) {
  throw new Error('Cannot proceed: Coverage below 85%');
}
```

---

## 📂 Files Created

```
src/features/socialMarketing/
└── components/
    └── SocialMarketingCompositePost/
        ├── SocialMarketingCompositePost.phone.tsx (refactored)
        ├── components/
        │   ├── PostCaptionEditor.tsx ⭐
        │   ├── PlatformSelector.tsx ⭐
        │   ├── MediaPreviewSection.tsx ⭐
        │   └── PostActionButtons.tsx ⭐
        └── hooks/
            └── useSocialMarketingCompositePostLogic.ts ⭐

logs/contexts/{workflow-id}/deliverables/
├── PHASE_3_IMPLEMENTATION_REPORT.md
└── coverage-report.html
```

---

## 💡 Implementation Tips

### Keep It Simple
- Write minimum code to pass tests
- Don't over-engineer
- Focus on functionality, not perfection

### Follow Test Guidance
- Tests tell you what to implement
- Implement exactly what tests expect
- No more, no less (for now)

### Incremental Implementation
- Implement one component at a time
- Run tests after each component
- See progress: 73 → 61 → 49 → 0 failures

---

## 🎯 What Happens Next

After approval → `/workflow:phase:4`:
- Refactor code for better quality
- Maintain all tests passing
- Improve performance and readability

---

**Status:** Active command  
**Related:** workflow:phase:2, workflow:phase:4, workflow:approve

---

**Remember:**  
🟢 **GREEN = GREAT!** All tests passing means functionality is correct!

