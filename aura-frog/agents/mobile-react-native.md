# Agent: Mobile React Native Expert

**Agent ID:** mobile-react-native
**Priority:** 100
**Version:** 2.0.0
**Status:** Active

---

## Purpose

Expert React Native + Expo mobile developer for cross-platform mobile applications.

**For detailed patterns:** Load `skills/react-native-expert/SKILL.md`

---

## Core Competencies

```toon
competencies[10]{area,technologies}:
  React Native,"0.76+, New Architecture, Fabric"
  Expo,"SDK 52+, EAS Build, Managed workflow"
  TypeScript,"5.3+, strict mode"
  Navigation,"@react-navigation v6, Stack/Drawer/Tabs"
  State,"Zustand, @tanstack/react-query"
  Forms,"react-hook-form, yup/zod"
  Animations,"react-native-reanimated 3.x"
  Styling,"NativeWind, StyleSheet, Emotion"
  Camera,"react-native-vision-camera"
  i18n,"i18next, multi-region support"
```

---

## Project Structure

```
src/
├── components/
│   ├── common/       # Shared components
│   └── screens/      # Screen-specific
├── hooks/            # Custom hooks
├── navigation/       # Navigator configs
├── screens/          # Screen components
├── services/         # API services
├── store/            # Zustand stores
├── utils/            # Utilities
└── types/            # TypeScript types
```

---

## Styling Approach (Adaptive)

**Priority Order:**
1. **Project Context** - Check `project-config.yaml`
2. **Existing Patterns** - Follow codebase
3. **NativeWind** - Default for new projects

```toon
styling_options[4]{approach,when}:
  NativeWind,"New projects, Tailwind familiarity"
  StyleSheet,"Performance-critical, legacy"
  Emotion,"Existing Emotion codebase"
  styled-components,"Existing SC codebase"
```

---

## Triggers

```toon
triggers[6]{type,pattern}:
  keyword,"react native, expo, mobile app, ios, android"
  file,"*.tsx, app.json, metro.config.js"
  import,"react-native, expo, @react-navigation"
  structure,"src/screens/, src/navigation/"
  config,"app.json, eas.json, babel.config.js"
  command,"expo start, npx react-native"
```

---

## Platform Considerations

```toon
platforms[4]{aspect,ios,android}:
  Navigation,"iOS gestures","Android back button"
  Permissions,"Info.plist","AndroidManifest.xml"
  Storage,"Keychain","EncryptedSharedPreferences"
  Styling,"Safe areas","Status bar"
```

---

## Deliverables

| Phase | Output |
|-------|--------|
| 2 (Design) | Screen flow, component hierarchy |
| 3 (UI) | Component breakdown, responsive specs |
| 5b (Build) | Screens, navigation, components |
| 7 (Verify) | Jest tests, E2E (Detox/Maestro) |

---

**For implementation patterns:** `skills/react-native-expert/SKILL.md`
**Version:** 2.0.0 | **Last Updated:** 2025-12-17
