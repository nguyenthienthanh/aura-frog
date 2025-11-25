# Rule: Direct Hook Access - No Intermediate Destructuring

**Priority:** High  
**Enforcement:** Code Review Phase  
**Applies To:** Theme hooks, translation hooks, and shared utilities

---

## 🎯 Core Principle

**Access values directly from hook objects. Don't destructure and pass around.**

❌ **Bad:** `const { t } = useTranslation(); return { t };`  
✅ **Good:** `const logic = useLogic(); <Button text={logic.t('key')} />`

---

## 🚫 What NOT to Do

### 1. Destructuring and Returning

❌ **BAD:**
```typescript
// Custom hook that returns destructured values
const useLogic = () => {
  const { t } = useTranslation();
  const { colors, space } = useTheme();
  
  // ❌ Returning destructured values
  return {
    t,
    colors,
    space,
    // ... other logic
  };
};

// Usage
const Component = () => {
  const { t, colors, space } = useLogic();
  
  return (
    <View style={{ backgroundColor: colors.primary }}>
      <Text>{t('hello')}</Text>
    </View>
  );
};
```

**Problems:**
- ❌ Hard to track where `t` comes from
- ❌ Hard to track where `colors` comes from
- ❌ Breaks IDE "Go to Definition"
- ❌ Difficult to refactor
- ❌ Multiple sources of truth

### 2. Re-exporting Hook Values

❌ **BAD:**
```typescript
const useLogic = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const handleSave = () => {
    // Some logic
  };
  
  // ❌ Re-exporting hook values
  return {
    t,           // From useTranslation
    colors,      // From useTheme
    handleSave,  // Actual logic
  };
};
```

### 3. Passing Destructured Values as Props

❌ **BAD:**
```typescript
const ParentComponent = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  // ❌ Passing destructured values down
  return (
    <ChildComponent 
      t={t}
      colors={colors}
    />
  );
};
```

---

## ✅ What TO Do

### 1. Direct Hook Access in Components

✅ **GOOD:**
```typescript
const Component = () => {
  // Get hook objects directly
  const translation = useTranslation();
  const theme = useTheme();
  
  // Or use namespace prefix
  const logic = useLogic();
  
  return (
    <View style={{ backgroundColor: theme.colors.primary }}>
      <Text>{translation.t('hello')}</Text>
      <Button onPress={logic.handleSave} />
    </View>
  );
};
```

### 2. Keep Hook Objects Intact

✅ **GOOD:**
```typescript
const useLogic = () => {
  // Keep hook objects intact - don't destructure
  const translation = useTranslation();
  const theme = useTheme();
  
  const handleSave = () => {
    console.log(translation.t('saving'));
  };
  
  // Return hook objects as-is + your logic
  return {
    translation,  // Entire hook object
    theme,        // Entire hook object
    handleSave,   // Your actual logic
  };
};

// Usage
const Component = () => {
  const logic = useLogic();
  
  return (
    <View style={{ backgroundColor: logic.theme.colors.primary }}>
      <Text>{logic.translation.t('hello')}</Text>
      <Button onPress={logic.handleSave} />
    </View>
  );
};
```

### 3. Use Namespace Prefix

✅ **GOOD:**
```typescript
const Component = () => {
  // Option A: Direct access with clear names
  const translation = useTranslation();
  const theme = useTheme();
  
  return <Text>{translation.t('key')}</Text>;
  
  // Option B: Use custom hook with namespace
  const logic = useComponentLogic();
  
  return <Text>{logic.t('key')}</Text>;
};
```

---

## 📋 Comparison - Before & After

### Screenshot Analysis (Left side is BAD, Right side is GOOD)

#### ❌ BEFORE (Lines 592-618, Left Side)

```typescript
const {
  isOpenProgressModal && (
    // ...
    type={post?.mediaType || ''}
    // Direct usage of destructured 'post'
  )
}

onPress={handleCreatePostAndShare}
// Direct usage of destructured function
```

**Problems:**
- Can't tell where `post` comes from
- Can't tell where `handleCreatePostAndShare` comes from
- Hard to track data flow

#### ✅ AFTER (Lines 243-269, Right Side)

```typescript
{logic.isOpenProgressModal && (
  <SocialMarketingProgressModal
    isOpen={logic.isOpenProgressModal}
    isSharing={logic.sharingProgress > 0}
    type={logic.post?.mediaType || ''}
    platform={logic.platform}
    progress={logic.sharingProgress}
    onClose={() => {
      logic.toggleProgressModal(false);
    }}
  />
)}
onShare={logic.handleCreatePostAndShare}
shouldShowCopyInstruction={logic.shouldShowCopyInstruction}
```

**Benefits:**
- ✅ Clear: Everything comes from `logic`
- ✅ Trackable: IDE can jump to definition
- ✅ Consistent: Single source of truth
- ✅ Refactorable: Easy to find all usages

### ❌ BEFORE (Lines 571-572, Bottom Left)

```typescript
text={t('postCaption.customize')}
icon={<EditIconSVG fill={colors.background} />}
```

**Problems:**
- Where does `t` come from?
- Where does `colors` come from?
- Multiple destructured sources mixed together

### ✅ AFTER (Lines 222-223, Bottom Right)

```typescript
text={logic.t('postCaption.customize')}
icon={<EditIconSVG fill={logic.colors.background} />}
```

**Benefits:**
- ✅ Clear: Both from `logic` hook
- ✅ Trackable: Easy to find source
- ✅ Consistent: Same pattern everywhere

---

## 🎯 Best Practices

### Pattern 1: Component-Level Hooks

✅ **GOOD:**
```typescript
const UserProfile = () => {
  // Get hooks directly in component
  const translation = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        {translation.t('profile.title')}
      </Text>
      <Button 
        text={translation.t('profile.edit')}
        onPress={() => navigation.navigate('EditProfile')}
      />
    </View>
  );
};
```

### Pattern 2: Custom Hook with Namespace

✅ **GOOD:**
```typescript
const useUserProfileLogic = () => {
  // Keep hook objects intact
  const translation = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  
  // Your actual business logic
  const [user, setUser] = useState<User>();
  
  const handleSave = async () => {
    await saveUser(user);
    navigation.goBack();
  };
  
  // Return everything under one namespace
  return {
    // Hook objects (as-is)
    translation,
    theme,
    navigation,
    
    // Your logic
    user,
    handleSave,
  };
};

// Usage
const UserProfile = () => {
  const logic = useUserProfileLogic();
  
  return (
    <View style={{ backgroundColor: logic.theme.colors.background }}>
      <Text>{logic.translation.t('profile.title')}</Text>
      <Button onPress={logic.handleSave} />
    </View>
  );
};
```

### Pattern 3: Prefix for Clarity

✅ **GOOD:**
```typescript
const Component = () => {
  // Use descriptive prefixes
  const $t = useTranslation();
  const $theme = useTheme();
  const logic = useComponentLogic();
  
  return (
    <View style={{ backgroundColor: $theme.colors.background }}>
      <Text>{$t.t('title')}</Text>
      <Button onPress={logic.handleAction} />
    </View>
  );
};
```

---

## 🚨 Common Mistakes

### Mistake 1: Mixing Patterns

❌ **BAD:**
```typescript
const Component = () => {
  // ❌ Inconsistent: Some destructured, some not
  const { t } = useTranslation();
  const theme = useTheme();
  const { handleSave } = useLogic();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text>{t('title')}</Text>
      <Button onPress={handleSave} />
    </View>
  );
};
```

✅ **GOOD:**
```typescript
const Component = () => {
  // ✅ Consistent: All from logic hook
  const logic = useLogic();
  
  return (
    <View style={{ backgroundColor: logic.theme.colors.background }}>
      <Text>{logic.t('title')}</Text>
      <Button onPress={logic.handleSave} />
    </View>
  );
};
```

### Mistake 2: Deep Destructuring

❌ **BAD:**
```typescript
const useLogic = () => {
  const { t } = useTranslation();
  const { colors, space, sizes } = useTheme();
  const { navigate } = useNavigation();
  
  // ❌ Too many destructured values
  return {
    t,
    colors,
    space,
    sizes,
    navigate,
    handleSave: () => {},
  };
};
```

✅ **GOOD:**
```typescript
const useLogic = () => {
  const translation = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  
  // ✅ Keep hook objects intact
  return {
    translation,
    theme,
    navigation,
    handleSave: () => {},
  };
};
```

### Mistake 3: Prop Drilling Hook Values

❌ **BAD:**
```typescript
const Parent = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  // ❌ Prop drilling hook values
  return <Child t={t} colors={colors} />;
};

const Child = ({ t, colors }) => {
  // ❌ Hard to track where these come from
  return <Text style={{ color: colors.text }}>{t('title')}</Text>;
};
```

✅ **GOOD:**
```typescript
const Parent = () => {
  return <Child />;
};

const Child = () => {
  // ✅ Get hooks directly where needed
  const translation = useTranslation();
  const theme = useTheme();
  
  return (
    <Text style={{ color: theme.colors.text }}>
      {translation.t('title')}
    </Text>
  );
};
```

---

## 📊 Real-World Example

### Your Code Transformation

#### ❌ BEFORE (Old Pattern)

```typescript
const SocialMarketingCompositePost = () => {
  // Destructured at top level
  const { t } = useTranslation();
  const { colors, space } = useTheme();
  
  // More destructuring from custom hook
  const {
    post,
    isOpenProgressModal,
    sharingProgress,
    platform,
    handleCreatePostAndShare,
    toggleProgressModal,
    shouldShowCopyInstruction,
  } = useLogic();
  
  return (
    <View>
      {/* Hard to track where values come from */}
      {isOpenProgressModal && (
        <Modal
          type={post?.mediaType || ''}
          onClose={() => toggleProgressModal(false)}
        />
      )}
      
      <Button
        text={t('postCaption.customize')}
        icon={<Icon fill={colors.background} />}
        onPress={handleCreatePostAndShare}
      />
    </View>
  );
};
```

#### ✅ AFTER (New Pattern)

```typescript
const SocialMarketingCompositePost = () => {
  // Get entire logic object
  const logic = useLogic();
  
  return (
    <View>
      {/* Clear: Everything from logic */}
      {logic.isOpenProgressModal && (
        <Modal
          type={logic.post?.mediaType || ''}
          onClose={() => logic.toggleProgressModal(false)}
        />
      )}
      
      <Button
        text={logic.t('postCaption.customize')}
        icon={<Icon fill={logic.colors.background} />}
        onPress={logic.handleCreatePostAndShare}
      />
    </View>
  );
};
```

---

## 🎯 Benefits

### 1. Traceability

✅ **Easy to track:**
```typescript
// Where does 't' come from?
logic.t('key')
// ↑ Clear: From logic hook

// Where does 'colors' come from?
logic.colors.primary
// ↑ Clear: From logic hook

// Jump to definition works perfectly
```

❌ **Hard to track:**
```typescript
// Where does 't' come from?
t('key')
// ❓ Could be from anywhere

// Where does 'colors' come from?
colors.primary
// ❓ Could be destructured from multiple places
```

### 2. Refactoring

✅ **Easy to refactor:**
```typescript
// Find all usages: Search "logic.handleSave"
logic.handleSave()

// Rename: Change in one place (useLogic hook)
// All usages update automatically
```

❌ **Hard to refactor:**
```typescript
// Find all usages: Search "handleSave"
// ❓ Returns many false positives
handleSave()

// Rename: Need to change everywhere manually
```

### 3. Type Safety

✅ **Better IntelliSense:**
```typescript
// Type "logic." and IDE shows all available properties
logic.
// ↓ IntelliSense:
// - t
// - colors
// - handleSave
// - post
// ... etc
```

❌ **Scattered types:**
```typescript
// Destructured values lose context
const { t, colors, handleSave } = useLogic();
// Type inference may be weaker
```

### 4. Consistency

✅ **Consistent pattern:**
```typescript
// All components follow same pattern
const logic = useLogic();

return (
  <View>
    <Text>{logic.t('key')}</Text>
    <Button color={logic.colors.primary} />
  </View>
);
```

❌ **Inconsistent patterns:**
```typescript
// Some destructure, some don't
const { t } = useTranslation();
const theme = useTheme();
const { handleSave } = useLogic();

// Hard to maintain consistency
```

---

## 🔍 Code Review Checklist

During Phase 6 (Code Review), check:

### Custom Hooks
- [ ] Does hook return entire objects (not destructured)?
- [ ] Are `useTranslation()` and `useTheme()` kept intact?
- [ ] No intermediate destructuring?
- [ ] Clear naming (translation, theme, logic)?

### Component Usage
- [ ] All values accessed via namespace (logic.x)?
- [ ] Consistent pattern throughout?
- [ ] No prop drilling of hook values?
- [ ] Easy to track data source?

### Bad Patterns
- [ ] No: `const { t } = useTranslation(); return { t };`
- [ ] No: `const { colors } = useTheme(); return { colors };`
- [ ] No: Passing `t` or `colors` as props
- [ ] No: Multiple destructuring sources mixed

---

## 📝 Migration Guide

### Step 1: Identify Destructured Returns

```typescript
// Find patterns like this:
const useLogic = () => {
  const { t } = useTranslation();  // ❌
  const { colors } = useTheme();   // ❌
  
  return { t, colors };  // ❌
};
```

### Step 2: Convert to Namespace Pattern

```typescript
// Change to:
const useLogic = () => {
  const translation = useTranslation();  // ✅
  const theme = useTheme();              // ✅
  
  return { translation, theme };  // ✅
};
```

### Step 3: Update Usage

```typescript
// Change from:
const { t, colors } = useLogic();
<Text>{t('key')}</Text>

// To:
const logic = useLogic();
<Text>{logic.translation.t('key')}</Text>
```

### Step 4: Verify with Search

```bash
# Search for remaining destructuring patterns
grep -r "const { t }" src/
grep -r "const { colors" src/
grep -r "useTranslation()" src/
grep -r "useTheme()" src/

# Should find minimal results (only in hook definitions)
```

---

## 🎓 Examples by Framework

### React Native

✅ **GOOD:**
```typescript
const Screen = () => {
  const logic = useScreenLogic();
  
  return (
    <View style={{ backgroundColor: logic.theme.colors.background }}>
      <Text style={{ color: logic.theme.colors.text }}>
        {logic.translation.t('title')}
      </Text>
      <Button 
        onPress={logic.handleSave}
        text={logic.translation.t('save')}
      />
    </View>
  );
};
```

### Vue.js

✅ **GOOD:**
```vue
<script setup lang="ts">
const logic = useLogic();
</script>

<template>
  <div :style="{ backgroundColor: logic.theme.colors.background }">
    <p>{{ logic.translation.t('title') }}</p>
    <button @click="logic.handleSave">
      {{ logic.translation.t('save') }}
    </button>
  </div>
</template>
```

---

## ✅ Enforcement

**Phase 6 (Code Review):**
- Manual review of all custom hooks
- Check for destructuring patterns
- Ensure namespace consistency
- Verify traceability

**Linter Rule (Custom):**
```javascript
// Custom ESLint rule
module.exports = {
  rules: {
    'no-hook-destructuring-return': {
      create(context) {
        return {
          ReturnStatement(node) {
            // Check if returning destructured hook values
            // Flag: const { t } = useTranslation(); return { t };
          }
        };
      }
    }
  }
};
```

---

## 🎯 Summary

### ❌ DON'T

```typescript
// Don't destructure and return
const { t } = useTranslation();
const { colors } = useTheme();
return { t, colors };

// Don't pass as props
<Child t={t} colors={colors} />
```

### ✅ DO

```typescript
// Keep hook objects intact
const translation = useTranslation();
const theme = useTheme();
return { translation, theme };

// Access via namespace
logic.translation.t('key')
logic.theme.colors.primary

// Get hooks where needed
const Child = () => {
  const translation = useTranslation();
  return <Text>{translation.t('key')}</Text>;
};
```

---

## 💡 Quick Tips

1. **Use `logic` prefix** for custom hooks
2. **Keep hook objects intact** - don't destructure
3. **Access via dot notation** - `logic.t()`, `logic.colors`
4. **Get hooks where needed** - not as props
5. **Be consistent** - same pattern everywhere

---

**Rule:** direct-hook-access  
**Version:** 1.0.0  
**Added:** CCPM v4.4  
**Priority:** High  
**Impact:** Code traceability, maintainability, refactorability

