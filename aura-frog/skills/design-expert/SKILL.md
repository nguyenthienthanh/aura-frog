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
user-invocable: false
---

> **AI-consumed reference.** Optimized for Claude to read during execution.
> Human-readable explanation: see [docs/architecture/HIERARCHICAL_PLANNING.md](../../../docs/architecture/HIERARCHICAL_PLANNING.md)
> or [docs/getting-started/](../../../docs/getting-started/) depending on topic.


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

---

## Figma Code Connect discipline

When working from Figma (Dev Mode MCP), treat Figma as a *source*, not a regenerator:

- **Sync tokens, don't re-pick.** Pull design variables with `get_variable_defs` and feed them INTO the `design-tokens` skill's system (one OKLCH source of truth) — never hand-copy hexes into components. Figma variables → `--brand-hue`/semantic tokens, so design + code share one palette.
- **Reuse mapped components, don't duplicate.** Call `get_code_connect_map` first; if a node already maps to a real code component, import and compose THAT instead of generating a new near-duplicate. Regenerating mapped components is the #1 source of design-system drift.
- Only generate net-new code for nodes with no Code Connect mapping.
