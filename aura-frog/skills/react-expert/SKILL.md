---
name: react-expert
description: "React best practices expert. PROACTIVELY use when working with React components, hooks, state management. Triggers: React, JSX, hooks, useState, useEffect, component"
autoInvoke: true
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

Expert-level React patterns, hooks best practices, performance optimization, and component architecture.

---

## Auto-Detection

This skill activates when:
- Working with `.jsx`, `.tsx` React files
- Using React hooks (useState, useEffect, etc.)
- Building React components
- Detected `react` in package.json

---

## 1. Component Patterns

### Function Components Only

```tsx
// ❌ BAD - Class components (legacy)
class UserCard extends React.Component { }

// ✅ GOOD - Function components
function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}

// ✅ GOOD - Arrow function with explicit return type
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <div>{user.name}</div>;
};
```

### Props Interface Pattern

```tsx
// ✅ GOOD - Explicit props interface
interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
  className?: string;
  children?: React.ReactNode;
}

function UserCard({
  user,
  onSelect,
  className,
  children
}: UserCardProps) {
  return (
    <div className={className} onClick={() => onSelect?.(user)}>
      <h3>{user.name}</h3>
      {children}
    </div>
  );
}
```

### Compound Components

```tsx
// ✅ GOOD - Compound component pattern
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card">{children}</div>
);

Card.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="card-header">{children}</div>
);

Card.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="card-body">{children}</div>
);

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

---

## 2. Hooks Best Practices

### useState

```tsx
// ❌ BAD - Object state without proper updates
const [user, setUser] = useState({ name: '', email: '' });
setUser({ name: 'John' }); // Loses email!

// ✅ GOOD - Spread previous state
setUser(prev => ({ ...prev, name: 'John' }));

// ✅ GOOD - Separate states for unrelated values
const [name, setName] = useState('');
const [email, setEmail] = useState('');

// ✅ GOOD - Lazy initialization for expensive computation
const [data, setData] = useState(() => computeExpensiveInitialValue());
```

### useEffect

```tsx
// ❌ BAD - Missing dependencies
useEffect(() => {
  fetchUser(userId);
}, []); // userId missing!

// ❌ BAD - Object/array in dependencies (infinite loop)
useEffect(() => {
  doSomething(options);
}, [options]); // New object every render!

// ✅ GOOD - Primitive dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// ✅ GOOD - Cleanup function
useEffect(() => {
  const subscription = subscribe(userId);
  return () => {
    subscription.unsubscribe();
  };
}, [userId]);

// ✅ GOOD - Abort controller for async
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error);
      }
    }
  }

  fetchData();
  return () => controller.abort();
}, [url]);
```

### useMemo & useCallback

```tsx
// ❌ BAD - Unnecessary memoization
const value = useMemo(() => a + b, [a, b]); // Simple math

// ✅ GOOD - Expensive computation
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// ✅ GOOD - Stable callback for child components
const handleClick = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);

// ✅ GOOD - Prevent child re-renders
const MemoizedChild = React.memo(ChildComponent);
```

### Custom Hooks

```tsx
// ✅ GOOD - Extract reusable logic
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ✅ GOOD - Data fetching hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

---

## 3. Conditional Rendering

### Safe Patterns

```tsx
// ❌ BAD - && with numbers (shows "0")
{count && <Badge count={count} />}

// ✅ GOOD - Explicit boolean
{count > 0 && <Badge count={count} />}

// ❌ BAD - && with strings (shows empty string issues)
{title && <Header title={title} />}

// ✅ GOOD - Ternary for clarity
{title ? <Header title={title} /> : null}

// ✅ GOOD - Nullish check
{title != null && title !== '' && <Header title={title} />}

// ✅ GOOD - Early return pattern
function UserProfile({ user }: { user: User | null }) {
  if (user == null) {
    return <LoadingSpinner />;
  }

  return <div>{user.name}</div>;
}
```

### List Rendering

```tsx
// ❌ BAD - Index as key (causes issues with reordering)
{items.map((item, index) => <Item key={index} item={item} />)}

// ✅ GOOD - Unique ID as key
{items.map(item => <Item key={item.id} item={item} />)}

// ✅ GOOD - Empty state handling
{items.length > 0 ? (
  items.map(item => <Item key={item.id} item={item} />)
) : (
  <EmptyState message="No items found" />
)}
```

---

## 4. State Management

### Local vs Global State

```toon
state_decision[5]{type,use_when,solution}:
  Local state,Component-specific UI,useState
  Lifted state,Shared between siblings,Lift to parent
  Context,Theme/auth/deep props,React Context
  Server state,API data,TanStack Query/SWR
  Global state,Complex app state,Zustand/Redux
```

### Context Pattern

```tsx
// ✅ GOOD - Typed context with provider
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: Credentials) => {
    const user = await authApi.login(credentials);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 5. Performance Optimization

### Prevent Unnecessary Re-renders

```tsx
// ✅ GOOD - Memoize expensive components
const ExpensiveList = React.memo(function ExpensiveList({ items }: Props) {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});

// ✅ GOOD - Custom comparison
const UserCard = React.memo(
  function UserCard({ user }: { user: User }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);

// ✅ GOOD - Split components to isolate re-renders
function Parent() {
  return (
    <>
      <FrequentlyUpdating />
      <ExpensiveButStatic />
    </>
  );
}
```

### Code Splitting

```tsx
// ✅ GOOD - Lazy load routes/components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 6. Form Handling

### Controlled Components

```tsx
// ✅ GOOD - Controlled with proper types
function LoginForm({ onSubmit }: { onSubmit: (data: LoginData) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (email === '') newErrors.email = 'Email is required';
    if (password === '') newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-invalid={errors.email != null}
      />
      {errors.email != null && <span role="alert">{errors.email}</span>}
      {/* ... */}
    </form>
  );
}
```

### Form Libraries

```tsx
// ✅ GOOD - React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

---

## 7. Error Boundaries

```tsx
// ✅ GOOD - Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught:', error, info);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

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

**Version:** 1.2.6
