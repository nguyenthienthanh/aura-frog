---
name: design-system-library
description: "Build apps with popular design systems - Material UI, Ant Design, Tailwind, shadcn/ui, Chakra UI, NativeWind"
autoInvoke: true
priority: high
triggers:
  - "material ui"
  - "mui"
  - "ant design"
  - "antd"
  - "tailwind"
  - "tailwindcss"
  - "shadcn"
  - "shadcn/ui"
  - "chakra ui"
  - "nativewind"
  - "design system"
  - "component library"
  - "ui library"
  - "bootstrap"
  - "mantine"
  - "radix ui"
  - "headless ui"
---

# Skill: Design System Library

**Category:** Implementation Skill
**Used By:** ui-designer, web-reactjs, web-vuejs, web-nextjs, mobile-react-native, web-angular
**Version:** 1.0.0

---

## Purpose

Enable AI agents to build web and mobile applications using popular design systems and component libraries. Provides patterns, best practices, and implementation guides for each system.

---

## Supported Design Systems

| File | Design System | Platform | Description |
|------|---------------|----------|-------------|
| `material-ui.md` | Material UI (MUI) | React, Next.js | Google Material Design 3 |
| `ant-design.md` | Ant Design | React, Vue | Enterprise-grade UI library |
| `tailwind-css.md` | Tailwind CSS | All frameworks | Utility-first CSS framework |
| `shadcn-ui.md` | shadcn/ui | React, Next.js | Radix + Tailwind components |
| `chakra-ui.md` | Chakra UI | React, Next.js | Accessible component library |
| `nativewind.md` | NativeWind | React Native | Tailwind for React Native |
| `bootstrap.md` | Bootstrap | All frameworks | Classic CSS framework |
| `mantine.md` | Mantine | React, Next.js | Full-featured component library |
| `radix-ui.md` | Radix UI | React | Headless primitives |
| `headless-ui.md` | Headless UI | React, Vue | Tailwind Labs headless components |

---

## Auto-Detection

When user requests a UI feature, detect the design system from:

1. **Package.json dependencies:**
   ```json
   "@mui/material": "^5.x",        // Material UI
   "antd": "^5.x",                 // Ant Design
   "tailwindcss": "^3.x",          // Tailwind CSS
   "@chakra-ui/react": "^2.x",     // Chakra UI
   "nativewind": "^4.x",           // NativeWind
   "@radix-ui/react-*": "*",       // Radix UI
   "@headlessui/react": "^2.x",    // Headless UI
   "bootstrap": "^5.x",            // Bootstrap
   "@mantine/core": "^7.x"         // Mantine
   ```

2. **Config files:**
   - `tailwind.config.js` → Tailwind CSS
   - `components.json` → shadcn/ui
   - `nativewind.config.js` → NativeWind

3. **Import patterns in existing code:**
   - `from '@mui/'` → Material UI
   - `from 'antd'` → Ant Design
   - `from '@chakra-ui/'` → Chakra UI

---

## Usage Flow

```
1. Detect design system (auto or user-specified)
2. Load relevant sub-skill file
3. Apply patterns and conventions
4. Generate code following design system's best practices
```

---

## Quick Selection Guide

### For Enterprise Apps
- **Ant Design** - Rich data display, tables, forms
- **Material UI** - Google ecosystem integration
- **Mantine** - Full-featured with dark mode

### For Modern Web Apps
- **Tailwind + shadcn/ui** - Maximum flexibility
- **Chakra UI** - Great developer experience
- **Radix + Tailwind** - Headless + styling freedom

### For Mobile Apps (React Native)
- **NativeWind** - Tailwind for mobile
- **React Native Paper** - Material Design mobile
- **Native Base** - Cross-platform components

### For Speed/Prototyping
- **Bootstrap** - Quick, familiar, documented
- **Tailwind** - Rapid utility styling
- **Chakra UI** - Minimal config needed

---

## Integration Triggers

Load this skill when user mentions:
- Building a new UI component
- Setting up a design system
- Requesting specific design library
- Asking about component styling
- Creating a new web/mobile app

---

## Example Invocations

```markdown
User: "Build a login form using Material UI"
→ Load material-ui.md → Follow MUI patterns

User: "Create a dashboard with Ant Design"
→ Load ant-design.md → Use ProComponents

User: "Style this component with Tailwind"
→ Load tailwind-css.md → Apply utility classes

User: "I want to use shadcn for this Next.js project"
→ Load shadcn-ui.md → Generate components

User: "Make this React Native app look modern"
→ Detect or ask → Load nativewind.md or react-native-paper.md
```

---

## Sub-Skill Loading Rules

1. **Single Design System:** Load only the relevant file
2. **Mixed (e.g., Tailwind + Radix):** Load both, prefer Radix for primitives, Tailwind for styling
3. **Unknown:** Ask user preference or detect from codebase
4. **New Project:** Recommend based on requirements (see Quick Selection Guide)

---

**Load sub-skills as needed for detailed implementation guidance.**
