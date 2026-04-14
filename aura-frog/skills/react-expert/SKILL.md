---
name: react-expert
description: "React gotchas and decision criteria. Covers conditional rendering traps, state management choices, and hooks pitfalls Claude commonly misses."
autoInvoke: false
priority: high
triggers:
  - "react"
  - "jsx"
  - "hooks"
  - "useState"
  - "useEffect"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# React Expert — Gotchas & Decisions

Use Context7 for full React docs.

## Key Decisions

```toon
decisions[5]{type,solution}:
  Component-specific UI,useState
  Shared between siblings,Lift to parent
  Theme/auth/deep props,"Context + useMemo value + throw-if-outside-provider"
  API/server data,TanStack Query or SWR
  Complex global state,Zustand or Redux Toolkit
```

## Gotchas

- `{count && <X/>}` renders "0" when count=0 — use `{count > 0 && <X/>}`
- `{title && <X/>}` renders empty string — use `{title != null && title !== '' && <X/>}`
- Keys: unique IDs only, NEVER array indices (breaks on reorder/delete)
- useEffect with object/array deps → infinite loop. Destructure or useMemo the dep
- useEffect cleanup: return AbortController abort for async fetches
- useMemo/useCallback: only for expensive ops or stable refs to memoized children. Don't wrap everything
- Context: always `useMemo` the value object to prevent re-renders on every parent render
- Error boundaries: class component only (no hook equivalent yet). Wrap at route level
