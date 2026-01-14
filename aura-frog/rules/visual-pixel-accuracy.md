# Visual Pixel Accuracy Rule

**Priority:** CRITICAL
**Category:** quality
**Version:** 1.0.0

---

## Purpose

Enforce pixel-perfect visual implementation through strict rules. This rule ensures Claude follows design specs exactly, using design tokens, and never declares success without passing visual diff tests.

---

## Hard Rules (NON-NEGOTIABLE)

```toon
hard_rules[4]{rule,enforcement,consequence}:
  NO_GUESSING,BLOCKING,Cannot proceed without exact token values
  PIXEL_OVER_STYLE,ENFORCED,Visual match trumps code elegance
  NO_SUCCESS_WITHOUT_PASS,BLOCKING,Completion blocked until diff passes
  FROZEN_IMMUTABLE,BLOCKING,Zero tolerance for frozen region diffs
```

---

## Rule 1: No Guessing

**NEVER approximate visual values. ALWAYS use design tokens.**

```toon
forbidden_patterns[6]{pattern,why}:
  Hardcoded hex colors,Use tokens: color.primary not #3B82F6
  Magic number spacing,Use tokens: spacing.md not 16px
  Arbitrary font sizes,Use tokens: font.size.base not 16px
  Estimated margins,Use tokens: spacing.lg not "about 24px"
  Guessed line heights,Use tokens: font.lineHeight.normal not 1.5
  Assumed border widths,Use tokens: divider.width not 1px
```

**Correct Pattern:**
```typescript
// WRONG - hardcoded values
const Button = styled.button`
  background: #3B82F6;
  padding: 16px 24px;
  font-size: 14px;
`;

// CORRECT - using design tokens
const Button = styled.button`
  background: ${tokens.color.primary};
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  font-size: ${tokens.font.size.sm};
`;
```

---

## Rule 2: Pixel Accuracy Over Code Style

**Visual correctness > code elegance. Match the design first.**

```toon
priority_order[4]{priority,what}:
  1,Pixel-perfect match to design reference
  2,Using correct design tokens
  3,Semantic HTML structure
  4,Code style and elegance
```

**Key Principle:**
- If ugly code matches the design perfectly → KEEP IT
- Refactor/clean up ONLY after visual tests pass
- Never sacrifice visual accuracy for "cleaner" code

**Example:**
```typescript
// This is ugly but matches the design exactly
// DO NOT REFACTOR until visual tests pass
const Header = () => (
  <div style={{
    height: '64px',
    paddingLeft: '24px',
    paddingRight: '24px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF'
  }}>
    {/* content */}
  </div>
);
```

---

## Rule 3: No Success Without Diff Pass

**BLOCK all completion claims until visual diff passes.**

```toon
blocking_conditions[5]{condition,action}:
  Diff > 0.5% (web),BLOCK - fix and re-render
  Diff > 1.0% (pdf),BLOCK - fix and re-render
  No baseline exists,BLOCK - create baseline first
  Snapshot not taken,BLOCK - render before claiming done
  Frozen region mismatch,IMMEDIATE FAIL
```

**Forbidden Phrases (until diff passes):**
- "Implementation complete"
- "Looks correct"
- "Should match the design"
- "I think this is right"
- "Ready for review"

**Allowed Only After Diff Pass:**
- "Visual test passed (0.23% diff)"
- "All frozen regions match exactly"
- "Implementation verified against baseline"

---

## Rule 4: Frozen Regions Are Immutable

**Elements in `frozen[]` must match pixel-for-pixel.**

```toon
frozen_rules[4]{rule,tolerance}:
  Height dimensions,0px tolerance
  Border/divider thickness,0px tolerance
  Font sizes,0px tolerance
  Icon sizes,0px tolerance
```

**DesignSpec Example:**
```json
{
  "id": "header-bar",
  "frozen": [
    "height",
    "divider-thickness",
    "logo-size",
    "font-size"
  ],
  "flexible": [
    "text-content",
    "menu-items-count",
    "responsive-breakpoints"
  ]
}
```

---

## Visual Testing Loop

```
┌─────────────────────────────────────────┐
│  1. IMPLEMENT using design tokens       │
│              ↓                          │
│  2. RENDER (Playwright/Puppeteer)       │
│              ↓                          │
│  3. SNAPSHOT (PNG, 1x scale)            │
│              ↓                          │
│  4. COMPARE (Pixelmatch)                │
│              ↓                          │
│  5a. PASS (<threshold) → SUCCESS        │
│  5b. FAIL → FIX visual only → Loop      │
│              ↓                          │
│  Max 5 attempts → HARD FAIL             │
└─────────────────────────────────────────┘
```

---

## Thresholds

```toon
diff_thresholds[2]{type,max_mismatch,notes}:
  web,0.5%,Standard web viewport rendering
  pdf,1.0%,PDF rendering has slight variations
```

---

## Enforcement

This rule is enforced by:
1. **Skill:** `visual-pixel-perfect` orchestrates the loop
2. **Hook:** `visual-pixel-init.cjs` injects context on session start
3. **Scripts:** `scripts/visual/*.sh` execute render/compare

---

## Agent Behavior Injection

When visual testing is active, Claude operates as a **frontend execution agent**:

```
You are a frontend execution agent.

You must:
- Follow design spec strictly
- Never assume values - use tokens
- Validate via pixel diff
- Fix until PASS or max attempts

You are not allowed to say "looks correct" without diff proof.
```

---

## Quick Reference

```toon
visual_checklist[7]{check,required}:
  Using design tokens (not hardcoded),YES
  Rendered snapshot exists,YES
  Diff comparison executed,YES
  Diff within threshold,YES
  Frozen regions match exactly,YES
  No guessed values in code,YES
  Visual proof before completion claim,YES
```

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
