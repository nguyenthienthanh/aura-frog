# Phase 3: Design Review - Detailed Guidelines

**Phase:** 3/9 - Design Review & Component Breakdown  
**Duration:** 3-6 hours  
**Agents:** ui-designer, mobile-react-native, web-*  
**Prerequisites:** Phase 2 approved + Figma screenshots  
**Deliverables:** component_breakdown.md, design_tokens.md, ui_flow.md

---

## 🎯 Phase Objectives

1. **Analyze** Figma designs visually
2. **Extract** design tokens (colors, typography, spacing)
3. **Break down** UI into reusable components
4. **Document** user flows and interactions
5. **Ensure** design consistency with design system

---

## 📋 Step-by-Step Process

### Step 0: Design Approach Selection (5 min) - NEW

Before starting design review, determine the design approach:

```markdown
🎨 DESIGN APPROACH SELECTION

Choose your design approach:

1. **Manual Design** (Traditional)
   - Use existing Figma designs
   - Work from wireframes/mockups
   - Best for: Established design systems, detailed specs

2. **AI-Assisted** (Google Stitch)
   - Generate UI designs with AI
   - Quick prototypes from requirements
   - Best for: Rapid prototyping, exploring ideas
   - Command: `/design:stitch "<requirements>"`

3. **Hybrid** (Stitch + Manual)
   - Generate initial prototype with Stitch
   - Refine in Figma
   - Best for: Starting from scratch, design exploration

Select approach: [1/2/3]
```

**If AI-Assisted (Option 2 or 3):**
1. Run `/design:stitch` skill to generate optimized prompt
2. User generates designs in Stitch (https://stitch.withgoogle.com)
3. User exports to Figma or HTML/CSS
4. Continue with Step 1 using exported assets

**Skill:** `skills/stitch-design/SKILL.md`

---

### Step 1: Request Design Assets (5 min)

#### 1.1 Ask User for Figma Screenshots

**Prompt:**
```markdown
📸 DESIGN ASSETS NEEDED

Please provide Figma screenshots for:

1. **All Screens**
   - Main share modal (phone)
   - Main share modal (tablet)
   - Platform selector
   - Content editor
   - Preview screen
   - Success screen

2. **All States**
   - Empty state
   - Loading state
   - Error state
   - Success state

3. **Interactions**
   - Button hover/press states
   - Form validation
   - Modal animations

**How to provide:**
- Paste images directly in chat
- Or provide Figma link (I'll use MCP to extract design data if available)

**Note:** 
- If Figma link provided, I'll use MCP tools (figma_file_get, etc.) to extract design data
- If MCP not available, I'll ask for screenshots instead
- **DO NOT** fetch Figma URLs directly - always use MCP tools
```

---

### Step 2: Visual Analysis (20 min)

#### 2.1 Analyze Each Screen

**For each screenshot:**

```markdown
## Screen Analysis: Share Modal (Phone)

### Layout Structure
```
┌────────────────────────────────┐
│         Share Modal            │ ← Header (60px)
├────────────────────────────────┤
│                                │
│  [Facebook] [Instagram]        │ ← Platform tabs
│                                │
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐ │
│  │  [Pick Image]            │ │ ← Image picker
│  │      +                   │ │   (180px height)
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ Write something...       │ │ ← Text input
│  │                          │ │   (120px height)
│  │                          │ │
│  └──────────────────────────┘ │
│  500/500                       │ ← Character count
│                                │
├────────────────────────────────┤
│  [Cancel]        [Share]  →   │ ← Footer
└────────────────────────────────┘
```

### Measurements
```yaml
Screen:
  width: 375px (iPhone)
  height: 667px (iPhone 8)
  
Modal:
  width: Full screen
  height: 90% of screen
  borderRadius: 16px (top corners)
  
Header:
  height: 60px
  paddingHorizontal: 20px
  
Content:
  paddingHorizontal: 20px
  paddingVertical: 24px
  gap: 16px
```

### Colors Used
```yaml
Background: #FFFFFF
Text Primary: #1A1A1A
Text Secondary: #6B6B6B
Border: #E5E5E5
Primary Blue: #0066FF
Success Green: #00C853
Error Red: #FF3B30
```

### Typography
```yaml
Header Title:
  font: Inter SemiBold
  size: 18px
  lineHeight: 24px
  
Body Text:
  font: Inter Regular
  size: 16px
  lineHeight: 22px
  
Caption:
  font: Inter Regular
  size: 14px
  lineHeight: 18px
```

### Spacing
```yaml
Padding: 16px, 20px, 24px
Margin: 8px, 12px, 16px
Gap: 12px, 16px, 20px
Border Radius: 8px, 12px, 16px
```

### Shadows
```yaml
Modal Shadow:
  shadowColor: #000000
  shadowOpacity: 0.15
  shadowRadius: 20px
  shadowOffset: { width: 0, height: 10 }
  
Button Shadow:
  shadowColor: #0066FF
  shadowOpacity: 0.25
  shadowRadius: 8px
  shadowOffset: { width: 0, height: 4 }
```
```

---

#### 2.2 Identify Design Patterns

**Look for:**

```markdown
## Design Patterns Identified

### 1. Modals
- **Pattern:** Bottom sheet on phone, centered on tablet
- **Animation:** Slide up from bottom
- **Backdrop:** Semi-transparent (#000000, 40% opacity)
- **Close:** Swipe down or tap outside

### 2. Buttons
- **Primary:** Filled, blue background, white text
- **Secondary:** Outline, white background, blue text
- **Disabled:** Gray background, gray text
- **Size:** 48px height (touch-friendly)

### 3. Form Inputs
- **Style:** Outlined with rounded corners
- **Focus:** Blue border (2px)
- **Error:** Red border + error text below
- **Label:** Above input, 14px, gray

### 4. Platform Selector
- **Style:** Segmented control
- **Active:** Blue background, white text
- **Inactive:** White background, gray text
- **Indicator:** Underline (3px, blue)

### 5. Image Picker
- **Empty:** Dashed border, plus icon, "Add Image" text
- **With Image:** Image preview, "Change" button overlay
- **Loading:** Shimmer animation
```

---

### Step 3: Extract Design Tokens (15 min)

#### 3.1 Create Design Tokens Document

**Template:**
```markdown
# Design Tokens: Social Media Sharing

## Colors

### Brand Colors
```typescript
export const colors = {
  // Primary
  primary: {
    default: '#0066FF',
    dark: '#0052CC',
    light: '#3385FF',
    lightest: '#E6F0FF',
  },
  
  // Neutral
  neutral: {
    black: '#1A1A1A',
    gray900: '#333333',
    gray700: '#6B6B6B',
    gray500: '#9B9B9B',
    gray300: '#D4D4D4',
    gray100: '#F5F5F5',
    white: '#FFFFFF',
  },
  
  // Semantic
  success: '#00C853',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#0066FF',
  
  // Social Platforms
  facebook: '#1877F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
} as const;
```

---

## Typography

```typescript
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  
  lineHeight: {
    xs: 16,
    sm: 18,
    base: 22,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 38,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
```

---

## Spacing

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;
```

---

## Border Radius

```typescript
export const borderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;
```

---

## Shadows

```typescript
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
```

---

## Animations

```typescript
export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;
```
```

---

### Step 4: Component Breakdown (30 min)

#### 4.1 Identify All Components

**Template:**
```markdown
# Component Breakdown

## 1. ShareModal (Container)

**Responsibility:** Orchestrate sharing flow

**Props:**
```typescript
interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  initialContent?: Partial<ShareContent>;
}
```

**Subcomponents:**
- ShareHeader
- PlatformSelector
- ContentEditor
- ShareFooter

**States:**
- idle
- editing
- validating
- submitting
- success
- error

**Variants:**
- Phone (bottom sheet)
- Tablet (centered dialog)

---

## 2. ShareHeader

**Responsibility:** Display title and close button

**Props:**
```typescript
interface ShareHeaderProps {
  title: string;
  onClose: () => void;
}
```

**Design:**
```yaml
Layout: Row (space-between)
Height: 60px
Padding: 0 20px
Border Bottom: 1px solid #E5E5E5

Title:
  Font: Inter SemiBold 18px
  Color: #1A1A1A
  
Close Button:
  Icon: X (24px)
  Color: #6B6B6B
  Touch: 44x44px
```

---

## 3. PlatformSelector

**Responsibility:** Select social platform

**Props:**
```typescript
interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
  platforms: Platform[];
}
```

**Design:**
```yaml
Layout: Row (horizontal scroll)
Gap: 12px
Padding: 16px 20px

Platform Option:
  Width: 120px
  Height: 48px
  Border Radius: 12px
  
  Active:
    Background: #0066FF
    Text: #FFFFFF
    Border: none
  
  Inactive:
    Background: #F5F5F5
    Text: #6B6B6B
    Border: 1px solid #E5E5E5
```

**Animation:**
- Slide transition between platforms
- Spring animation (300ms)

---

## 4. ContentEditor

**Responsibility:** Edit text and pick image

**Subcomponents:**
- ImagePicker
- TextInput
- CharacterCount

**Design:**
```yaml
Layout: Column
Gap: 16px
Padding: 16px 20px
```

---

## 5. ImagePicker

**Responsibility:** Pick/preview image

**Props:**
```typescript
interface ImagePickerProps {
  imageUri: string | null;
  onPick: (uri: string) => void;
  onRemove: () => void;
  loading?: boolean;
}
```

**States:**

**Empty:**
```yaml
Size: 100% width x 180px height
Border: 2px dashed #D4D4D4
Border Radius: 12px
Background: #F5F5F5

Content:
  Icon: Plus (48px, #9B9B9B)
  Text: "Add Image" (14px, #6B6B6B)
```

**With Image:**
```yaml
Size: 100% width x 200px height
Border Radius: 12px
Background: Image (cover)

Overlay (on press):
  Background: rgba(0,0,0,0.5)
  Buttons: [Change] [Remove]
```

**Loading:**
```yaml
Shimmer animation
Placeholder: Same as empty
Spinner: Center (32px)
```

---

## 6. TextInput

**Responsibility:** Multi-line text input

**Props:**
```typescript
interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  maxLength: number;
  error?: string;
}
```

**Design:**
```yaml
Height: 120px
Border: 1px solid #E5E5E5
Border Radius: 12px
Padding: 12px 16px
Font: Inter Regular 16px
Line Height: 22px

Focus:
  Border: 2px solid #0066FF
  
Error:
  Border: 2px solid #FF3B30
  Error Text: Below (14px, #FF3B30)
```

---

## 7. CharacterCount

**Responsibility:** Show character count

**Props:**
```typescript
interface CharacterCountProps {
  current: number;
  max: number;
}
```

**Design:**
```yaml
Position: Below text input (right aligned)
Font: Inter Regular 14px
Color: #9B9B9B

When > 80%:
  Color: #FF9500 (warning)
  
When >= 100%:
  Color: #FF3B30 (error)
```

---

## 8. ShareFooter

**Responsibility:** Cancel and submit actions

**Props:**
```typescript
interface ShareFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitting: boolean;
}
```

**Design:**
```yaml
Layout: Row (space-between)
Height: 72px
Padding: 12px 20px
Border Top: 1px solid #E5E5E5

Cancel Button:
  Type: Secondary
  Width: 48%
  Height: 48px
  
Share Button:
  Type: Primary
  Width: 48%
  Height: 48px
  
  Disabled:
    Background: #D4D4D4
    Text: #9B9B9B
  
  Loading:
    Spinner (white, 24px)
```
```

---

### Step 5: User Flow Documentation (20 min)

#### 5.1 Create Flow Diagrams

**Template:**
```markdown
# User Flows

## Flow 1: Happy Path - Share to Facebook

```
User taps "Share" button
    ↓
ShareModal opens (slide up animation, 300ms)
    ↓
Default to last used platform (Facebook)
    ↓
User taps "Add Image"
    ↓
Check gallery permission
    ↓ [Granted]
Open image picker
    ↓
User selects image
    ↓
Show loading (shimmer, 500ms)
    ↓
Compress image (if > 5MB)
    ↓
Show image preview
    ↓
User enters text (max 500 chars)
    ↓
Real-time validation
    ↓  [Valid]
Enable "Share" button (blue)
    ↓
User taps "Share"
    ↓
Show loading spinner on button
    ↓
Upload image to S3 (2-3s)
    ↓
Post to Facebook API (1-2s)
    ↓
Save to YOUR API (1s)
    ↓
Hide ShareModal
    ↓
Show SuccessModal (fade in, 300ms)
    ↓
Auto-dismiss after 3s
    ↓
Done ✅
```

---

## Flow 2: Error Path - Network Failure

```
[...same as happy path until...]
    ↓
User taps "Share"
    ↓
Show loading
    ↓
Network request fails (timeout 30s)
    ↓
Catch error
    ↓
Hide loading
    ↓
Show error toast (slide down from top)
    "No internet. Please try again."
    ↓
Keep modal open
    ↓
User can retry or cancel
```

---

## Flow 3: Edge Case - Permission Denied

```
User taps "Add Image"
    ↓
Check gallery permission
    ↓ [Denied]
Show alert:
  Title: "Gallery Access"
  Message: "Please enable gallery access in Settings"
  Actions: [Cancel] [Settings]
    ↓
If user taps "Settings":
  Open app settings
    ↓
User enables permission
    ↓
Returns to app
    ↓
Retry "Add Image"
```
```

---

### Step 6: Responsive Design (15 min)

#### 6.1 Phone vs Tablet

**Template:**
```markdown
# Responsive Design

## Phone (< 768px)

### ShareModal
```yaml
Type: Bottom Sheet
Width: 100%
Height: 90% of screen
Position: Bottom
Animation: Slide up
Backdrop: Tap to close

Layout: Column (vertical)
Scroll: Enabled
```

### Platform Selector
```yaml
Type: Horizontal Scroll
Show: 2.5 options visible
Pagination: Dots below
```

---

## Tablet (≥ 768px)

### ShareModal
```yaml
Type: Centered Dialog
Width: 600px
Height: Auto (max 80%)
Position: Center
Animation: Scale + fade
Backdrop: Tap to close

Layout: Column (vertical, wider)
Scroll: If content > height
```

### Platform Selector
```yaml
Type: Grid
Show: All options visible
Columns: 3
Gap: 16px
```

---

## Breakpoints

```typescript
export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;
```

---

## Component Variants

```typescript
// ShareModal.tsx
const ShareModal = ({ visible, onClose }) => {
  const deviceType = useDeviceType(); // phone | tablet
  
  if (deviceType === 'phone') {
    return <ShareModalPhone {...props} />;
  }
  
  return <ShareModalTablet {...props} />;
};
```
```

---

### Step 7: Accessibility (10 min)

#### 7.1 A11y Requirements

**Template:**
```markdown
# Accessibility

## Screen Reader Support

### Labels
```typescript
All interactive elements must have accessibilityLabel:

<TouchableOpacity
  accessibilityLabel="Close share modal"
  accessibilityRole="button"
  onPress={onClose}
>
  <CloseIcon />
</TouchableOpacity>

<TextInput
  accessibilityLabel="Share message"
  accessibilityHint="Enter text up to 500 characters"
  placeholder="Write something..."
/>
```

### Live Regions
```typescript
// Announce character count updates
<Text
  accessibilityLiveRegion="polite"
  accessibilityLabel={`${currentLength} of ${maxLength} characters`}
>
  {currentLength}/{maxLength}
</Text>

// Announce errors
<Text
  accessibilityLiveRegion="assertive"
  accessibilityRole="alert"
>
  {error}
</Text>
```

---

## Touch Targets

### Minimum Size
```yaml
All touchable elements:
  Minimum: 44x44pt (iOS)
  Minimum: 48x48dp (Android)
  
Buttons:
  Height: 48px
  Padding: 12px 24px
  
Icons:
  Size: 24px
  Touch area: 44x44px (padding)
```

---

## Color Contrast

### WCAG AA Compliance
```yaml
Text on Background:
  Ratio: ≥ 4.5:1
  
Large Text (≥18px):
  Ratio: ≥ 3:1
  
Buttons:
  Ratio: ≥ 3:1

Check all colors:
- #1A1A1A on #FFFFFF: 18.5:1 ✅
- #6B6B6B on #FFFFFF: 5.4:1 ✅
- #0066FF on #FFFFFF: 5.1:1 ✅
```

---

## Keyboard Navigation

```typescript
// Tab order
1. Close button
2. Platform selector (Facebook)
3. Platform selector (Instagram)
4. Image picker
5. Text input
6. Cancel button
7. Share button

// Enter key
- On text input: Submit (if valid)
- On buttons: Activate
```
```

---

### Step 8: Animation Specifications (10 min)

**Template:**
```markdown
# Animation Specifications

## Modal Animations

### Open (300ms)
```typescript
// Phone (bottom sheet)
Animated.timing(translateY, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.cubic),
}).start();

// Tablet (centered)
Animated.parallel([
  Animated.timing(scale, {
    toValue: 1,
    duration: 300,
    easing: Easing.out(Easing.cubic),
  }),
  Animated.timing(opacity, {
    toValue: 1,
    duration: 300,
  }),
]).start();
```

### Close (250ms)
```typescript
// Reverse of open
// Faster (250ms vs 300ms)
```

---

## Platform Selector (200ms)

```typescript
// Slide indicator
Animated.spring(indicatorPosition, {
  toValue: selectedIndex * optionWidth,
  tension: 100,
  friction: 10,
  useNativeDriver: true,
}).start();
```

---

## Button Press (100ms)

```typescript
// Scale down on press
Animated.timing(scale, {
  toValue: 0.95,
  duration: 100,
  useNativeDriver: true,
}).start();

// Scale back up on release
Animated.timing(scale, {
  toValue: 1,
  duration: 100,
  useNativeDriver: true,
}).start();
```

---

## Loading Shimmer

```typescript
// Continuous loop
Animated.loop(
  Animated.sequence([
    Animated.timing(opacity, {
      toValue: 0.3,
      duration: 800,
    }),
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
    }),
  ])
).start();
```
```

---

### Step 9: Approval Gate (10 min)

**Present Summary:**

```markdown
📋 PHASE 3 COMPLETE: Design Review

## Summary

**Screens Analyzed:** 6 screens (phone + tablet)
**Components Identified:** 8 reusable components
**Design Tokens:** Extracted (colors, typography, spacing)
**User Flows:** 3 flows documented
**Accessibility:** WCAG AA compliant

## Design System Alignment

✅ Uses Inter font (company standard)
✅ Follows 8px spacing grid
✅ Color palette matches brand guidelines
✅ Touch targets ≥ 44pt (iOS HIG)
✅ Contrast ratios ≥ 4.5:1 (WCAG AA)

## Component Breakdown

- ShareModal (container)
- ShareHeader
- PlatformSelector (3 platforms)
- ImagePicker (empty, preview, loading)
- TextInput (with validation)
- CharacterCount
- ShareFooter
- Success/Error modals

## Responsive Design

✅ Phone: Bottom sheet
✅ Tablet: Centered dialog
✅ Breakpoints: 768px

## Deliverables Generated

- [x] component_breakdown.md (8 components)
- [x] design_tokens.md (colors, typography, spacing)
- [x] ui_flow.md (3 user flows)
- [x] accessibility_checklist.md
- [x] animation_specs.md

---

👉 **Ready to proceed to Phase 4: Test Planning?**

Type:
- "approve" to continue
- "reject" + feedback
- "clarify" + questions
```

---

## ✅ Phase 3 Checklist

### Visual Analysis ✅
- [ ] All screens analyzed
- [ ] Measurements extracted
- [ ] Design patterns identified
- [ ] Screenshots documented

### Design Tokens ✅
- [ ] Colors extracted
- [ ] Typography defined
- [ ] Spacing system
- [ ] Shadows & borders

### Component Breakdown ✅
- [ ] All components identified
- [ ] Props defined
- [ ] States documented
- [ ] Variants specified

### User Flows ✅
- [ ] Happy paths
- [ ] Error paths
- [ ] Edge cases

### Responsive Design ✅
- [ ] Phone design
- [ ] Tablet design
- [ ] Breakpoints

### Accessibility ✅
- [ ] A11y labels
- [ ] Color contrast
- [ ] Touch targets
- [ ] Keyboard nav

### Quality ✅
- [ ] Design system compliance
- [ ] Cross-device consistency
- [ ] User approval

---

**Phase 3 Complete! Ready for Phase 4: Test Planning** 🧪

