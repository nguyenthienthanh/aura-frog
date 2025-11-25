# Rule: Theme Consistency - No Hardcoded Values

**Priority:** Critical  
**Enforcement:** Code Review Phase + Linter  
**Applies To:** All UI code (React Native, Vue.js, React.js, Next.js)

---

## 🎯 Core Principle

**Use theme/design system values. Never hardcode colors, spacing, or sizes.**

❌ **Bad:** `backgroundColor: '#FF0000'`, `padding: 16`  
✅ **Good:** `backgroundColor: colors.error`, `padding: space[4]`

---

## 🚫 What NOT to Do

### 1. Hardcoded Colors

❌ **BAD:**
```typescript
// React Native
<View style={{ backgroundColor: '#FFFFFF' }}>
<Text style={{ color: '#000000' }}>Hello</Text>
<View style={{ borderColor: '#E0E0E0' }} />

// Vue.js
<div :style="{ color: '#333333', backgroundColor: '#F5F5F5' }">

// Emotion CSS
const Button = styled.button`
  background-color: #007AFF;
  color: #FFFFFF;
  border: 1px solid #0051D5;
`;
```

❌ **ALSO BAD:**
```typescript
// Named colors (non-theme)
color: 'red'
color: 'blue'
backgroundColor: 'white'
borderColor: 'gray'

// RGB/RGBA
color: 'rgb(0, 0, 0)'
backgroundColor: 'rgba(255, 255, 255, 0.5)'
```

### 2. Hardcoded Spacing

❌ **BAD:**
```typescript
// React Native
<View style={{ 
  padding: 16,
  margin: 8,
  gap: 12,
  paddingHorizontal: 20,
  marginTop: 24
}}>

// Vue.js
<div :style="{ 
  padding: '16px',
  margin: '8px 12px',
  gap: '24px'
}">

// Emotion CSS
const Container = styled.div`
  padding: 16px;
  margin: 24px;
  gap: 12px;
`;
```

### 3. Hardcoded Sizes

❌ **BAD:**
```typescript
// React Native
<View style={{ 
  width: 320,
  height: 48,
  borderRadius: 8,
  fontSize: 16
}}>

// Vue.js
<div :style="{ 
  width: '320px',
  height: '48px',
  fontSize: '16px',
  borderRadius: '8px'
}">

// Emotion CSS
const Card = styled.div`
  width: 320px;
  height: 200px;
  border-radius: 12px;
`;
```

---

## ✅ What TO Do

### 1. Use Theme Colors

✅ **GOOD - React Native:**
```typescript
import { useTheme } from '@/hooks/useTheme';

const Component = () => {
  const { colors } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: colors.background.primary,
      borderColor: colors.border.default
    }}>
      <Text style={{ color: colors.text.primary }}>
        Hello
      </Text>
      <Button backgroundColor={colors.primary[500]} />
    </View>
  );
};
```

✅ **GOOD - Vue.js:**
```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { colors } = useTheme();
</script>

<template>
  <div :style="{ 
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    borderColor: colors.border.default
  }">
    Hello
  </div>
</template>
```

✅ **GOOD - Emotion CSS:**
```typescript
import { useTheme } from '@emotion/react';

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: 1px solid ${({ theme }) => theme.colors.primary[600]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;
```

### 2. Use Theme Spacing

✅ **GOOD - React Native:**
```typescript
import { useTheme } from '@/hooks/useTheme';

const Component = () => {
  const { space } = useTheme();
  
  return (
    <View style={{ 
      padding: space[4],        // 16px
      margin: space[2],          // 8px
      gap: space[3],             // 12px
      paddingHorizontal: space[5], // 20px
      marginTop: space[6]        // 24px
    }}>
      <Text>Hello</Text>
    </View>
  );
};
```

✅ **GOOD - Vue.js:**
```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { space } = useTheme();
</script>

<template>
  <div :style="{ 
    padding: space[4],
    margin: space[2],
    gap: space[3]
  }">
    Hello
  </div>
</template>
```

### 3. Use Theme Sizes

✅ **GOOD - React Native:**
```typescript
import { useTheme } from '@/hooks/useTheme';

const Component = () => {
  const { sizes, borderRadius } = useTheme();
  
  return (
    <View style={{ 
      width: sizes.container.sm,     // 320px
      height: sizes.button.md,       // 48px
      borderRadius: borderRadius.md  // 8px
    }}>
      <Text style={{ fontSize: sizes.text.md }}>
        Hello
      </Text>
    </View>
  );
};
```

✅ **GOOD - Emotion CSS:**
```typescript
const Card = styled.div`
  width: ${({ theme }) => theme.sizes.container.sm};
  height: ${({ theme }) => theme.sizes.card.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.sizes.text.md};
`;
```

---

## 🎨 Theme Structure

### Standard Theme Object

```typescript
interface Theme {
  colors: {
    // Primary colors
    primary: {
      50: string;   // Lightest
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;  // Base
      600: string;
      700: string;
      800: string;
      900: string;  // Darkest
    };
    
    // Semantic colors
    success: string;
    error: string;
    warning: string;
    info: string;
    
    // Background colors
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    
    // Text colors
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      disabled: string;
    };
    
    // Border colors
    border: {
      default: string;
      light: string;
      dark: string;
      focus: string;
    };
    
    // Surface colors (cards, modals, etc.)
    surface: {
      default: string;
      elevated: string;
      overlay: string;
    };
  };
  
  space: {
    0: number;    // 0px
    1: number;    // 4px
    2: number;    // 8px
    3: number;    // 12px
    4: number;    // 16px
    5: number;    // 20px
    6: number;    // 24px
    7: number;    // 28px
    8: number;    // 32px
    10: number;   // 40px
    12: number;   // 48px
    16: number;   // 64px
    20: number;   // 80px
  };
  
  sizes: {
    text: {
      xs: number;   // 12px
      sm: number;   // 14px
      md: number;   // 16px
      lg: number;   // 18px
      xl: number;   // 20px
      '2xl': number; // 24px
      '3xl': number; // 30px
    };
    
    button: {
      sm: number;   // 32px
      md: number;   // 40px
      lg: number;   // 48px
    };
    
    icon: {
      xs: number;   // 16px
      sm: number;   // 20px
      md: number;   // 24px
      lg: number;   // 32px
      xl: number;   // 48px
    };
    
    container: {
      xs: number;   // 280px
      sm: number;   // 320px
      md: number;   // 768px
      lg: number;   // 1024px
      xl: number;   // 1280px
    };
  };
  
  borderRadius: {
    none: number;  // 0
    sm: number;    // 4px
    md: number;    // 8px
    lg: number;    // 12px
    xl: number;    // 16px
    '2xl': number; // 24px
    full: number;  // 9999px (pill shape)
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

---

## 🔍 Allowed Exceptions

### Exception 1: Transparent Colors

✅ **ALLOWED:**
```typescript
// Transparent is acceptable (no theme equivalent)
backgroundColor: 'transparent'
borderColor: 'transparent'
```

### Exception 2: Percentage-Based Opacity

✅ **ALLOWED (but prefer theme):**
```typescript
// If theme doesn't have opacity variants
backgroundColor: colors.primary[500] + '80'  // 50% opacity

// BETTER: Add to theme
backgroundColor: colors.primary.alpha50
```

### Exception 3: Dynamic Calculations

✅ **ALLOWED:**
```typescript
// Calculations based on theme values are OK
const dynamicPadding = space[4] * 1.5;
const halfWidth = sizes.container.sm / 2;

// But prefer pre-calculated theme values when possible
```

### Exception 4: Percentage Values

✅ **ALLOWED:**
```typescript
// Percentage-based layouts
width: '100%'
width: '50%'
height: '100%'

// These are responsive, not hardcoded
```

### Exception 5: Zero Values

✅ **ALLOWED:**
```typescript
// Zero is zero, no theme needed
padding: 0
margin: 0
borderWidth: 0

// But for consistency, can use space[0]
padding: space[0]  // Also OK
```

---

## 📋 Migration from Hardcoded Values

### Before (Hardcoded)

❌ **BAD:**
```typescript
const UserCard = () => {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      padding: 16,
      margin: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}>
      <Text style={{
        color: '#333333',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
      }}>
        User Name
      </Text>
      <Text style={{
        color: '#666666',
        fontSize: 14,
      }}>
        user@example.com
      </Text>
    </View>
  );
};
```

### After (Theme-Based)

✅ **GOOD:**
```typescript
const UserCard = () => {
  const { colors, space, sizes, borderRadius, shadows } = useTheme();
  
  return (
    <View style={{
      backgroundColor: colors.surface.default,
      padding: space[4],
      margin: space[3],
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border.light,
      ...shadows.sm,
    }}>
      <Text style={{
        color: colors.text.primary,
        fontSize: sizes.text.md,
        fontWeight: '600',
        marginBottom: space[2],
      }}>
        User Name
      </Text>
      <Text style={{
        color: colors.text.secondary,
        fontSize: sizes.text.sm,
      }}>
        user@example.com
      </Text>
    </View>
  );
};
```

---

## 🎯 Best Practices

### 1. Semantic Naming

✅ **GOOD:**
```typescript
// Use semantic names, not literal values
colors.error          // Not colors.red
colors.success        // Not colors.green
colors.text.primary   // Not colors.black
colors.text.disabled  // Not colors.gray300
```

### 2. Consistent Spacing Scale

✅ **GOOD:**
```typescript
// Stick to spacing scale (multiples of 4 or 8)
space[0]   // 0px
space[1]   // 4px
space[2]   // 8px
space[3]   // 12px
space[4]   // 16px
space[6]   // 24px
space[8]   // 32px

// Avoid arbitrary values like 13px, 17px, 23px
```

### 3. Dark Mode Support

✅ **GOOD:**
```typescript
// Theme automatically handles dark mode
const { colors } = useTheme();

// This works for both light and dark mode
<View style={{ backgroundColor: colors.background.primary }}>

// Light mode: colors.background.primary = '#FFFFFF'
// Dark mode:  colors.background.primary = '#000000'
```

### 4. Platform-Specific Overrides

✅ **GOOD:**
```typescript
import { Platform } from 'react-native';

const Component = () => {
  const { space } = useTheme();
  
  return (
    <View style={{
      // Use theme as base
      padding: space[4],
      
      // Platform-specific adjustments (if needed)
      ...Platform.select({
        ios: { paddingTop: space[6] },
        android: { paddingTop: space[4] },
      })
    }}>
  );
};
```

---

## 🚨 Common Mistakes

### Mistake 1: Mixing Theme and Hardcoded

❌ **BAD:**
```typescript
<View style={{
  backgroundColor: colors.primary[500],  // ✅ Theme
  padding: 16,                           // ❌ Hardcoded
  borderColor: '#E0E0E0',                // ❌ Hardcoded
  margin: space[4]                       // ✅ Theme
}}>
```

✅ **GOOD:**
```typescript
<View style={{
  backgroundColor: colors.primary[500],  // ✅ Theme
  padding: space[4],                     // ✅ Theme
  borderColor: colors.border.light,      // ✅ Theme
  margin: space[4]                       // ✅ Theme
}}>
```

### Mistake 2: Creating Custom Colors

❌ **BAD:**
```typescript
// Don't create custom colors inline
const customBlue = '#007AFF';
const lightBlue = '#E5F2FF';

<View style={{ backgroundColor: customBlue }}>
```

✅ **GOOD:**
```typescript
// Add to theme instead
// In theme.ts:
colors: {
  brand: {
    primary: '#007AFF',
    light: '#E5F2FF',
  }
}

// Use from theme:
<View style={{ backgroundColor: colors.brand.primary }}>
```

### Mistake 3: Magic Numbers

❌ **BAD:**
```typescript
// What is 43? Why 43?
<View style={{ height: 43 }}>

// What is 13? Random padding?
<View style={{ padding: 13 }}>
```

✅ **GOOD:**
```typescript
// Clear, consistent values from theme
<View style={{ height: sizes.button.md }}>  // 48px

<View style={{ padding: space[3] }}>        // 12px
```

---

## 🔧 Linter Configuration

### ESLint Rule (Custom)

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Warn on hardcoded colors
    'no-hardcoded-colors': 'error',
    
    // Warn on hardcoded spacing
    'no-hardcoded-spacing': 'error',
    
    // React Native specific
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': ['error', {
      skip: ['Typography', 'Text']
    }],
  }
};
```

### Custom ESLint Plugin

```javascript
// eslint-plugin-theme-consistency.js
module.exports = {
  rules: {
    'no-hardcoded-colors': {
      create(context) {
        return {
          Property(node) {
            // Check for color properties
            const colorProps = [
              'backgroundColor', 'color', 'borderColor',
              'borderTopColor', 'borderRightColor',
              'borderBottomColor', 'borderLeftColor',
              'shadowColor', 'textShadowColor'
            ];
            
            if (colorProps.includes(node.key.name)) {
              const value = node.value.value;
              
              // Check for hex colors, rgb, rgba, named colors
              if (
                /^#[0-9A-Fa-f]{3,8}$/.test(value) ||
                /^rgba?\(/.test(value) ||
                /^(red|blue|green|white|black|gray)$/i.test(value)
              ) {
                context.report({
                  node,
                  message: 'Use theme colors instead of hardcoded values',
                });
              }
            }
          }
        };
      }
    },
    
    'no-hardcoded-spacing': {
      create(context) {
        return {
          Property(node) {
            const spacingProps = [
              'padding', 'margin', 'gap',
              'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
              'paddingHorizontal', 'paddingVertical',
              'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
              'marginHorizontal', 'marginVertical'
            ];
            
            if (spacingProps.includes(node.key.name)) {
              const value = node.value.value;
              
              // Allow 0, '0', '0px', '100%', 'auto'
              const allowedValues = [0, '0', '0px', '100%', 'auto', 'transparent'];
              
              if (!allowedValues.includes(value) && typeof value === 'number') {
                context.report({
                  node,
                  message: 'Use theme spacing (space[n]) instead of hardcoded values',
                });
              }
            }
          }
        };
      }
    }
  }
};
```

---

## 📊 Code Review Checklist

During Phase 6 (Code Review), check:

### Colors
- [ ] No hex colors (#FFFFFF)
- [ ] No RGB/RGBA (rgb(0,0,0))
- [ ] No named colors ('red', 'blue')
- [ ] All colors from theme
- [ ] Semantic naming used
- [ ] Dark mode supported

### Spacing
- [ ] No hardcoded numbers (16, 24)
- [ ] All spacing from theme (space[n])
- [ ] Consistent spacing scale
- [ ] No arbitrary values (13, 17)

### Sizes
- [ ] No hardcoded sizes
- [ ] All sizes from theme
- [ ] Border radius from theme
- [ ] Font sizes from theme

### Exceptions
- [ ] 'transparent' allowed
- [ ] 0 allowed
- [ ] Percentages allowed ('100%')
- [ ] Calculations based on theme OK

---

## 🎯 Theme Benefits

### 1. Consistency
- Same colors everywhere
- Same spacing scale
- Same component sizes
- Professional look

### 2. Dark Mode
- Automatic support
- No extra code
- Smooth transitions
- User preference

### 3. Rebrandability
- Change theme once
- Updates everywhere
- No find-replace needed
- Quick iterations

### 4. Accessibility
- Consistent contrast ratios
- WCAG compliant colors
- Proper touch targets
- Better readability

### 5. Maintainability
- Single source of truth
- Easy updates
- Clear documentation
- Less bugs

---

## 🔍 Real Example - Before & After

### Before (Screenshot Left - Line 673)

❌ **BAD:**
```typescript
backgroundColor={colors.palette.yourGrey[100]}  // ❌ Using palette directly
```

### After (Screenshot Right - Line 324)

✅ **GOOD:**
```typescript
backgroundColor="#E0E0E0"  // ✅ Wait, this is still hardcoded!
```

### Even Better

✅ **BEST:**
```typescript
backgroundColor={colors.surface.secondary}     // ✅ Semantic theme color
// or
backgroundColor={colors.background.tertiary}   // ✅ Background variant
```

---

## 📝 Migration Guide

### Step 1: Audit Current Code

```bash
# Find hardcoded colors
grep -r "#[0-9A-Fa-f]\{6\}" src/

# Find hardcoded spacing
grep -r "padding: [0-9]" src/
grep -r "margin: [0-9]" src/
```

### Step 2: Create Theme Mappings

```typescript
// Create a mapping document
const MIGRATION_MAP = {
  // Colors
  '#FFFFFF': 'colors.background.primary',
  '#000000': 'colors.text.primary',
  '#E0E0E0': 'colors.border.light',
  '#FF0000': 'colors.error',
  
  // Spacing
  '16': 'space[4]',
  '8': 'space[2]',
  '24': 'space[6]',
  
  // Sizes
  '48': 'sizes.button.md',
  '16': 'sizes.text.md',
};
```

### Step 3: Replace Systematically

```bash
# Use test:unit to ensure no breakage
test:unit "Component.tsx"

# Make changes
# Run tests again
```

---

## ✅ Enforcement

**Phase 6 (Code Review):**
- ESLint checks
- Manual review
- No hardcoded values allowed
- Must use theme

**Linter Error:**
```
error: Use theme colors instead of hardcoded values
  backgroundColor: '#FFFFFF'
                   ^^^^^^^^^
  Use: backgroundColor: colors.background.primary

error: Use theme spacing instead of hardcoded values
  padding: 16
           ^^
  Use: padding: space[4]
```

---

## 🎓 Training Examples

### Example 1: Button Component

✅ **CORRECT:**
```typescript
const Button = ({ variant = 'primary' }) => {
  const { colors, space, sizes, borderRadius } = useTheme();
  
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.text.inverse,
    },
    secondary: {
      backgroundColor: colors.secondary[500],
      color: colors.text.inverse,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary[500],
      color: colors.primary[500],
    },
  };
  
  return (
    <TouchableOpacity
      style={{
        ...variantStyles[variant],
        paddingVertical: space[3],
        paddingHorizontal: space[5],
        borderRadius: borderRadius.md,
        height: sizes.button.md,
      }}
    >
      <Text>Click Me</Text>
    </TouchableOpacity>
  );
};
```

---

**Rule:** theme-consistency  
**Version:** 1.0.0  
**Added:** CCPM v4.4  
**Priority:** Critical  
**Impact:** Visual consistency, maintainability, dark mode support

