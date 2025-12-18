# Skill: Design System Library

**Category:** Implementation Skill
**Version:** 1.2.6

---

## Purpose

Help select and implement design systems. For up-to-date library documentation, **use Context7**.

---

## How to Use

```
"Build a login form with Material UI" use context7
"Create dashboard with Ant Design" use context7
"Style with Tailwind" use context7
```

Context7 fetches current, version-specific documentation automatically.

---

## Design System Selection

```toon
systems[10]{system,best_for,platform}:
  Material UI (MUI),Google ecosystem + enterprise,React/Next.js
  Ant Design,Data-heavy enterprise apps,React/Vue
  Tailwind CSS,Utility-first flexibility,All frameworks
  shadcn/ui,Modern React + full control,React/Next.js
  Chakra UI,Accessible + great DX,React/Next.js
  NativeWind,Tailwind for mobile,React Native
  Bootstrap,Quick prototyping,All frameworks
  Mantine,Full-featured + dark mode,React/Next.js
  Radix UI,Headless primitives,React
  Headless UI,Tailwind Labs headless,React/Vue
```

---

## Auto-Detection

Detect from package.json:

```toon
detection[8]{package,system}:
  @mui/material,Material UI
  antd,Ant Design
  tailwindcss,Tailwind CSS
  @chakra-ui/react,Chakra UI
  nativewind,NativeWind
  @radix-ui/*,Radix UI
  @headlessui/react,Headless UI
  @mantine/core,Mantine
```

---

## Quick Selection

| Use Case | Recommendation |
|----------|----------------|
| Enterprise | Ant Design, MUI, Mantine |
| Modern Web | Tailwind + shadcn/ui |
| Mobile (RN) | NativeWind |
| Prototyping | Bootstrap, Tailwind |

---

**For implementation details:** Add "use context7" to fetch current library docs.
