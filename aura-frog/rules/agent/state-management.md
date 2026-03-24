# State Management Rules

**Category:** Code Quality
**Priority:** High
**Version:** 1.0.0
**Applies To:** Frontend applications (React, Vue, React Native)

---

## Overview

Guidelines for predictable, maintainable state management in frontend applications.

---

## 1. State Categorization

| Type | Scope | Storage | Example |
|------|-------|---------|---------|
| UI State | Component | Local state | Modal open, form input |
| Client State | App-wide | Store | Theme, user preferences |
| Server State | App-wide | Query cache | API responses |
| URL State | Route | URL params | Filters, pagination |

---

## 2. Choose the Right Tool

| State Type | React | Vue | When to Use |
|------------|-------|-----|-------------|
| Local UI | useState | ref/reactive | Single component |
| Shared UI | Context | provide/inject | Few components share |
| Global | Zustand/Redux | Pinia | App-wide access |
| Server | TanStack Query | TanStack Query | API data |
| Forms | React Hook Form | VeeValidate | Form handling |

---

## 3. State Location Rules

```
Rule 1: Start local, lift only when needed
Rule 2: Server state ≠ Client state
Rule 3: URL is state too
Rule 4: Don't duplicate state
```

### Decision Tree
```
Is it from an API?
├── Yes → Use TanStack Query / SWR
└── No → Is it used by multiple components?
    ├── Yes → Is it truly global?
    │   ├── Yes → Use global store
    │   └── No → Use Context / provide
    └── No → Use local state
```

---

## 4. React Patterns

### Local State
```tsx
// Simple state
const [count, setCount] = useState(0)

// Object state - always spread
const [user, setUser] = useState({ name: '', email: '' })
setUser(prev => ({ ...prev, name: 'John' }))
```

### Server State (TanStack Query)
```tsx
// Fetch
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId)
})

// Mutate
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => queryClient.invalidateQueries(['users'])
})
```

### Global State (Zustand)
```tsx
// Store
const useStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme })
}))

// Usage
const theme = useStore(state => state.theme)
const setTheme = useStore(state => state.setTheme)
```

---

## 5. Vue Patterns

### Composition API
```vue
<script setup>
import { ref, reactive, computed } from 'vue'

// Primitives
const count = ref(0)

// Objects
const user = reactive({ name: '', email: '' })

// Derived
const fullName = computed(() => `${user.firstName} ${user.lastName}`)
</script>
```

### Pinia Store
```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  actions: {
    async login(credentials) {
      this.user = await authApi.login(credentials)
      this.isAuthenticated = true
    }
  }
})
```

---

## 6. Anti-Patterns

### Duplicating Server State
```tsx
// ❌ Bad: Copying API data to local state
const [users, setUsers] = useState([])
useEffect(() => {
  fetchUsers().then(setUsers)
}, [])

// ✅ Good: Let query library manage it
const { data: users } = useQuery(['users'], fetchUsers)
```

### Prop Drilling
```tsx
// ❌ Bad: Passing through many levels
<App user={user}>
  <Layout user={user}>
    <Header user={user}>
      <UserMenu user={user} />

// ✅ Good: Use context or store
const user = useUserStore(s => s.user)
```

### Storing Derived State
```tsx
// ❌ Bad: Storing computed values
const [items, setItems] = useState([])
const [total, setTotal] = useState(0)
useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0))
}, [items])

// ✅ Good: Compute on render
const total = useMemo(() =>
  items.reduce((sum, i) => sum + i.price, 0),
[items])
```

---

## 7. Performance Rules

| Rule | Why |
|------|-----|
| Memoize expensive computations | Prevent recalculation |
| Split stores by domain | Reduce re-renders |
| Subscribe to specific slices | Don't watch entire store |
| Use selectors | Optimize subscriptions |

```tsx
// ✅ Select specific slice
const count = useStore(state => state.count)

// ❌ Subscribe to entire store
const store = useStore()
```

---

## 8. State Checklist

- [ ] State is at the right level
- [ ] Server state uses query library
- [ ] No duplicated state
- [ ] No derived state stored
- [ ] Selectors for store access
- [ ] Forms use form library
- [ ] URL state for shareable filters

---

## Best Practices

### Do's
- Start with local state
- Use query libraries for API data
- Derive values with useMemo/computed
- Keep stores small and focused
- Use selectors for performance

### Don'ts
- Store everything globally
- Duplicate API data locally
- Store computed values
- Subscribe to entire stores
- Mix server and client state

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
