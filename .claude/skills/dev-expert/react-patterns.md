# Skill: React Patterns & Best Practices

**Category:** Dev Expert  
**Priority:** High  
**Used By:** web-reactjs agent

---

## Overview

React 18 development patterns, hooks, and best practices for building modern web applications.

---

## Core Patterns

### 1. Modern Hooks Patterns

```typescript
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

function UserList() {
  // State
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  
  // Refs
  const abortControllerRef = useRef<AbortController>()
  
  // Memoized values
  const filteredUsers = useMemo(
    () => users.filter(u => u.name.includes(search)),
    [users, search]
  )
  
  // Memoized callbacks
  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])
  
  // Effects
  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current = controller
    
    fetchUsers(controller.signal)
    
    return () => controller.abort()
  }, [])
  
  return (
    <div>
      <SearchInput value={search} onChange={handleSearch} />
      {loading ? <Loading /> : <UserGrid users={filteredUsers} />}
    </div>
  )
}
```

### 2. Custom Hooks

```typescript
// hooks/useFetch.ts
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const controller = new AbortController()
    
    setLoading(true)
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
    
    return () => controller.abort()
  }, [url])
  
  return { data, error, loading }
}

// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  
  return [value, setValue] as const
}

// Usage
const { data, loading } = useFetch<User[]>('/api/users')
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

### 3. Context + Hooks Pattern

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    setUser(response.data.user)
  }, [])
  
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Usage
function Profile() {
  const { user, logout } = useAuth()
  return <div>{user?.name} <button onClick={logout}>Logout</button></div>
}
```

### 4. Component Composition

```typescript
// Compound Components Pattern
function Select({ children, value, onChange }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  )
}

Select.Option = function Option({ value, children }: OptionProps) {
  const { value: selectedValue, onChange } = useSelectContext()
  return (
    <div 
      className={selectedValue === value ? 'selected' : ''}
      onClick={() => onChange(value)}
    >
      {children}
    </div>
  )
}

// Usage
<Select value={selected} onChange={setSelected}>
  <Select.Option value="1">Option 1</Select.Option>
  <Select.Option value="2">Option 2</Select.Option>
</Select>
```

### 5. Performance Optimization

```typescript
import { memo, lazy, Suspense, useDeferredValue, useTransition } from 'react'

// Memoize expensive components
const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  return <div>{items.map(renderItem)}</div>
}, (prev, next) => prev.items === next.items) // Custom comparison

// Lazy load components
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyChart data={data} />
    </Suspense>
  )
}

// Defer non-urgent updates
function SearchResults() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => search(deferredQuery), [deferredQuery])
  
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Results data={results} />
    </>
  )
}

// Transitions for non-blocking updates
function TabContainer() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()
  
  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab)
    })
  }
  
  return (
    <>
      <Tabs active={tab} onSelect={selectTab} pending={isPending} />
      <TabPanel>{tab === 'home' ? <Home /> : <Settings />}</TabPanel>
    </>
  )
}
```

### 6. Error Boundaries

```typescript
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info)
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 7. Testing with React Testing Library

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('UserForm', () => {
  it('submits form with user data', async () => {
    const handleSubmit = vi.fn()
    render(<UserForm onSubmit={handleSubmit} />)
    
    await userEvent.type(screen.getByLabelText('Name'), 'John Doe')
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com')
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })
})
```

---

## Best Practices

### Do's ✅
- ✅ Use functional components + hooks
- ✅ Extract custom hooks for reusable logic
- ✅ Use TypeScript for type safety
- ✅ Memoize expensive computations
- ✅ Lazy load heavy components
- ✅ Use Error Boundaries
- ✅ Test with Testing Library

### Don'ts ❌
- ❌ Mutate state directly
- ❌ Use class components (unless Error Boundary)
- ❌ Forget dependency arrays in useEffect
- ❌ Over-optimize with memo/useMemo
- ❌ Prop drill excessively (use Context)
- ❌ Ignore React warnings

---

## Project Structure

```
src/
├── components/    # Reusable components
├── contexts/      # Context providers
├── hooks/         # Custom hooks
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utilities
└── App.tsx
```

---

**Used by web-reactjs agent for React 18 development guidance.**

