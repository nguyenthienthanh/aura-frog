---
name: react-expert
description: "React best practices expert. PROACTIVELY use when working with React components, hooks, state management. Triggers: React, JSX, hooks, useState, useEffect, component"
autoInvoke: false
priority: high
triggers:
  - "react"
  - "jsx"
  - "component"
  - "useState"
  - "useEffect"
  - "hooks"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# React Expert Skill

React patterns: hooks, performance, component architecture, state management.

---

## 1. Component Patterns

**Function components only.** Explicit props interface. Compound components for complex UI.

```tsx
interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
  children?: React.ReactNode;
}

function UserCard({ user, onSelect, children }: UserCardProps) {
  return (
    <div onClick={() => onSelect?.(user)}>
      <h3>{user.name}</h3>
      {children}
    </div>
  );
}
```

---

## 2. Hooks Best Practices

**useState:** Spread previous for object updates. Separate states for unrelated values. Lazy init for expensive computation.

**useEffect:**
- Include all dependencies
- Cleanup subscriptions in return
- AbortController for async fetches
- Avoid objects/arrays in deps (infinite loop)

**useMemo/useCallback:** Only for expensive computations or stable callbacks passed to memoized children. `React.memo` for preventing child re-renders.

**Custom hooks:** Extract reusable logic (useDebounce, useFetch).

---

## 3. Conditional Rendering

```tsx
// ❌ {count && <X/>}  -- renders "0" when count=0
// ✅ {count > 0 && <X/>}
// ✅ {title != null && title !== '' && <Header title={title} />}
// ✅ Early return for null checks
```

**Keys:** Unique IDs, never indices.

---

## 4. State Management

```toon
state_decision[5]{type,use_when,solution}:
  Local state,Component-specific UI,useState
  Lifted state,Shared between siblings,Lift to parent
  Context,Theme/auth/deep props,React Context
  Server state,API data,TanStack Query/SWR
  Global state,Complex app state,Zustand/Redux
```

**Context pattern:** Typed context + null check hook (`throw if outside provider`) + `useMemo` for value.

---

## 5. Performance

- `React.memo` for expensive components (custom comparator if needed)
- Split components to isolate re-renders
- `lazy(() => import(...))` + `Suspense` for code splitting

---

## 6. Forms

**Controlled components** with validation. Or **React Hook Form + Zod:**

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

---

## 7. Error Boundaries

Class component with `getDerivedStateFromError` + `componentDidCatch`. Wrap at route level.

---

## Quick Reference

```toon
checklist[10]{pattern,do_this}:
  Component type,Function components only
  Props,Interface with explicit types
  Keys,Unique IDs not indices
  useEffect deps,Include all dependencies
  Conditional &&,Use explicit boolean check
  State updates,Spread previous for objects
  Memoization,Only for expensive operations
  Context,Throw if used outside provider
  Forms,Controlled with validation
  Errors,Error boundaries at route level
```

---
