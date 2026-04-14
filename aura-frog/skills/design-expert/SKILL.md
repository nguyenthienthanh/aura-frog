---
name: design-expert
description: "UI/UX design expertise — component design, design system selection, responsive layout. Includes auto-detection from package.json and Context7 integration for library docs."
autoInvoke: false
priority: medium
triggers:
  - "design component"
  - "design system"
  - "component library"
  - "Material UI"
  - "Tailwind"
  - "shadcn"
  - "responsive layout"
---

# Design Expert

## When to Use

Component design, design system selection/setup, responsive layouts, Figma analysis.

---

## Principles

```toon
principles[4]{principle}:
  Atomic design: Atoms → Molecules → Organisms → Templates → Pages
  Mobile-first: design for smallest then enhance
  Design tokens: colors/spacing/typography as variables not magic values
  Consistency: one library per project — don't mix
```

## Design System Selection

```toon
selection[4]{use_case,recommendation}:
  Enterprise,"Ant Design, MUI, Mantine"
  Modern Web,"Tailwind + shadcn/ui"
  Mobile (RN),NativeWind
  Prototyping,"Bootstrap, Tailwind"
```

## Auto-Detection

Detect from package.json: `@mui/material` → MUI, `antd` → Ant Design, `tailwindcss` → Tailwind, `@chakra-ui/react` → Chakra, `nativewind` → NativeWind, `@mantine/core` → Mantine.

## Implementation

**Use Context7** for current library docs. Add "use context7" to fetch version-specific API.

---

## Responsive Breakpoints

Mobile: <768px | Tablet: 768-1024px | Desktop: >1024px
