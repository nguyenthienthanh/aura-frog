# Command: agent:info

**Category:** Agent Management  
**Syntax:** `agent:info <agent-name>`

---

## Description

Show detailed information about a specific agent including capabilities, tech stack, and usage.

---

## Usage

```
agent:info mobile-react-native
agent:info qa-automation
agent:info ui-designer
```

---

## Output Example

```markdown
# Agent: mobile-react-native

**Priority:** 100 (Highest)  
**Status:** ✅ Active  
**File:** agents/mobile-react-native.md

## Description
Expert in React Native and Expo mobile development with multi-region support.

## Tech Stack
- React Native 0.76+
- Expo SDK 52+
- TypeScript
- Jest + Detox
- React Query
- Zustand

## Capabilities
- Component development (phone & tablet)
- Multi-region implementation (PH/MY/ID/IB/HK)
- State management with Zustand
- API integration with React Query
- Testing with Jest/Detox
- Performance optimization

## Triggers
Automatically activates when you mention:
- react-native
- expo
- mobile
- component
- phone
- tablet

## Skills
- react-native-patterns.md
- test-writer/test-generation.md
- code-reviewer/quality-review.md

## Usage Example
"Refactor the SocialMarketing component"
→ This agent will be activated automatically
```

---

**Version:** 1.0.0

