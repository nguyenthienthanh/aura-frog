# Command: workflow:phase:3

**Version:** 1.0.0  
**Purpose:** Execute Phase 3 - Design Review  
**Trigger:** Auto-triggered after Phase 2 approval OR manual `/workflow:phase:3`

---

## 🎯 Phase 3 Objectives

Review design specifications and break down UI into components.

**Deliverables:**
1. Component Breakdown Document
2. Design Tokens Extraction
3. UI Flow Documentation
4. Responsive Design Plan

---

## 📋 Execution Steps

### Step 1: Pre-Phase Hook
- Load Phase 2 tech spec
- Verify architecture approved
- Initialize Phase 3 state

### Step 2: Request Design Assets
**Agent:** ui-designer

Prompt user:
```
📸 DESIGN ASSETS NEEDED

Please provide:
1. Figma screenshot(s) OR
2. Design mockups OR
3. Existing UI reference

Upload images or paste Figma link (screenshots will be taken)
```

### Step 3: Analyze Design
**Agents:** ui-designer + dev agent

Analyze:
- Layout structure (header, body, footer)
- Component hierarchy
- Visual elements (buttons, inputs, cards)
- Colors, typography, spacing
- Responsive breakpoints
- Accessibility considerations

### Step 4: Break Down Components
Identify and document each component:

```markdown
## Component Breakdown

### 1. MediaPreviewSection
**Purpose:** Display media with playback controls
**Visual Elements:**
- Image/Video container (aspect ratio preserved)
- Sound toggle button (bottom-right corner)
- Loading skeleton
**Props:**
- signedUrl: string
- mediaWidth: number
- mediaHeight: number
- muted: boolean
- onToggleMuted: () => void

### 2. PlatformSelector
**Purpose:** Select social media platform
**Visual Elements:**
- Dropdown/picker
- Platform icons (Facebook, Instagram, etc.)
- Selected platform indicator
**Props:**
- platform: SocialMarketingPlatform
- platforms: SocialMarketingPlatform[]
- onSelect: (platform) => void
- disabled: boolean
```

### Step 5: Extract Design Tokens
```typescript
// Design Tokens
export const designTokens = {
  colors: {
    primary: '#0066FF',
    secondary: '#6B6B6B',
    background: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};
```

### Step 6: Document UI Flows
```markdown
## UI Flows

### Flow 1: Post Creation
1. User enters caption
2. User selects platform
3. User clicks "Customize" → Navigate to customization
4. OR User clicks "Post Now" → Show confirmation → Post

### Flow 2: Caption Editing
1. User clicks edit icon
2. Modal opens with caption editor
3. User edits caption
4. User clicks "Save" → Caption updated
5. Modal closes

### Flow 3: Generate Caption
1. User clicks "Generate Caption"
2. Loading indicator shown
3. API generates caption
4. Caption auto-filled
5. User can edit or accept
```

### Step 7: Responsive Design Plan
```markdown
## Responsive Breakpoints

### Phone (Portrait)
- Width: 375-428px
- Layout: Single column, full width
- Media: Full width, 16:9 aspect ratio

### Phone (Landscape)
- Width: 667-932px
- Layout: Two columns (media left, controls right)

### Tablet (Portrait)
- Width: 768-834px
- Layout: Centered content, max-width 600px

### Tablet (Landscape)  
- Width: 1024-1366px
- Layout: Two columns, media 60%, controls 40%
```

---

## ✅ Success Criteria

Phase 3 complete when:
- [ ] Design assets reviewed (screenshots/mockups)
- [ ] All UI components identified and documented
- [ ] Design tokens extracted
- [ ] UI flows documented
- [ ] Responsive plan defined
- [ ] Component props specified
- [ ] Accessibility notes included

---

## 🚦 Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 3 COMPLETE: Design Review
═══════════════════════════════════════════════════════════

📊 Summary:
Analyzed design and broke down into 5 UI components

📦 Deliverables:
   📄 PHASE_3_DESIGN_REVIEW.md
   - 5 components identified
   - Design tokens extracted
   - 3 UI flows documented
   - Responsive breakpoints defined

📐 Components Identified:
   - MediaPreviewSection (image/video display)
   - PlatformSelector (platform picker)
   - PostCaptionEditor (caption input)
   - PostActionButtons (Post Now, Customize)
   - Main Container (layout orchestration)

✅ Success Criteria:
   ✅ Design analyzed
   ✅ Components broken down
   ✅ Design tokens extracted
   ✅ UI flows documented
   ✅ Responsive plan defined

⏭️  Next Phase: Phase 4 - Test Planning

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 4
Type "/workflow:reject" → Revise design breakdown
Type "/workflow:modify <feedback>" → Adjust components

Your response:
═══════════════════════════════════════════════════════════
```

---

## 📂 Files Created

```
.claude/logs/contexts/{workflow-id}/deliverables/
├── PHASE_3_DESIGN_REVIEW.md
└── design-tokens.ts (extracted design tokens)
```

---

## 💡 Design Review Tips

### For Refactoring Tasks:
- Analyze existing UI
- Maintain visual consistency
- Document current design patterns
- Note any improvements needed

### For New Features:
- Request Figma screenshots
- Break down into atomic components
- Extract reusable patterns
- Consider accessibility

### If No Design Provided:
- Use existing app design system
- Follow platform guidelines (iOS HIG, Material Design)
- Keep it simple and consistent

---

## 🎯 What Happens Next

After approval → `/workflow:phase:4`:
- Create test plan for all components
- Define test cases
- Set coverage goals

---

**Status:** Active command  
**Related:** workflow:phase:2, workflow:phase:4, workflow:approve

