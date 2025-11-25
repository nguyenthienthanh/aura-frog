# Command: project:detect

**Category:** Project Management  
**Syntax:** `project:detect`

---

## Description

Analyze current directory and detect project type, tech stack, and structure.

---

## Output

```markdown
🔍 Project Detection Results

## Project Information
**Name:** your-project  
**Path:** /Users/nguyenthanh/Projects/.../your-project

## Detected Type: mobile-react-native ✅

**Evidence:**
- ✅ package.json contains "react-native"
- ✅ package.json contains "expo"
- ✅ Found expo.json
- ✅ Found app.json

## Tech Stack Detected
- React Native 0.76.9
- Expo SDK 52.0.46
- TypeScript 5.3.3
- Jest (testing)
- Zustand (state management)
- React Query (data fetching)

## Structure Pattern
- Feature-based structure ✅
- Multi-region support (PH, MY, ID, IB, HK) ✅
- Phone & Tablet variants ✅

## Configuration Recommendations
- Test coverage target: 80%
- TDD enforcement: Strict
- Primary agent: mobile-react-native

Run `project:init` to configure CCPM for this project.
```

---

**Version:** 1.0.0

