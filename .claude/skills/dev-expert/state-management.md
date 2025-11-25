# Skill: State Management Patterns

**Category:** Dev Expert  
**Priority:** High  
**Used By:** mobile-react-native, web-reactjs, web-nextjs, web-vuejs

---

## Overview

Comprehensive patterns for managing application state across different frameworks and libraries.

---

## Zustand (React/React Native)

### 1. Basic Store Structure

```typescript
// store/useBoundStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  setUser: (user: User) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      user: null,
      theme: 'light',
      
      setUser: (user) => set({ user }),
      
      setTheme: (theme) => set({ theme })
    })),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
```

### 2. Slice Pattern

```typescript
// store/slices/authSlice.ts
import { StateCreator } from 'zustand'

export interface AuthSlice {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  token: null,
  isAuthenticated: false,
  
  login: (token) => set({ token, isAuthenticated: true }),
  
  logout: () => set({ token: null, isAuthenticated: false })
})

// store/useBoundStore.ts
import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './slices/authSlice'
import { UserSlice, createUserSlice } from './slices/userSlice'

type BoundStore = AuthSlice & UserSlice

export const useBoundStore = create<BoundStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUserSlice(...a)
}))
```

### 3. Selectors

```typescript
// Memoized selector
import { shallow } from 'zustand/shallow'

function UserProfile() {
  const { name, email } = useBoundStore(
    (state) => ({ name: state.user.name, email: state.user.email }),
    shallow
  )
  
  return <div>{name} - {email}</div>
}
```

---

## Context API (React)

### 1. Context with Reducer

```typescript
// contexts/CartContext.tsx
import { createContext, useContext, useReducer } from 'react'

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      }
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload)
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item?.price || 0)
      }
    case 'CLEAR':
      return { items: [], total: 0 }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

---

## Pinia (Vue.js)

```typescript
// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
    error: null as string | null
  }),
  
  getters: {
    isAuthenticated: (state) => state.user !== null,
    fullName: (state) => `${state.user?.firstName} ${state.user?.lastName}`
  },
  
  actions: {
    async fetchUser(id: string) {
      this.isLoading = true
      try {
        this.user = await userService.getById(id)
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    
    logout() {
      this.user = null
      this.error = null
    }
  }
})

// Usage in component
const userStore = useUserStore()
const { isAuthenticated, fullName } = storeToRefs(userStore)
```

---

## Redux Toolkit (React)

```typescript
// features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer

// Usage
import { useDispatch, useSelector } from 'react-redux'

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  
  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  )
}
```

---

## Async State Management

### React Query + Zustand

```typescript
// Combine for optimal state management
// React Query for server state
const { data: users } = useQuery(['users'], fetchUsers)

// Zustand for client state
const theme = useAppStore((state) => state.theme)
```

---

## Best Practices

### Do's ✅
- ✅ Separate server state from client state
- ✅ Use immer for immutable updates
- ✅ Implement proper TypeScript types
- ✅ Use selectors to avoid re-renders
- ✅ Persist only necessary data
- ✅ Use slices for large stores
- ✅ Handle loading and error states

### Don'ts ❌
- ❌ Store derived data in state
- ❌ Mutate state directly
- ❌ Over-use global state
- ❌ Store temporary UI state globally
- ❌ Forget to clean up state
- ❌ Use multiple state management libraries

---

## State Organization Guide

**Global State (Zustand/Pinia/Redux):**
- Authentication
- User preferences
- Theme
- Navigation state
- Global UI state

**Server State (React Query):**
- API data
- Cached responses
- Pagination data

**Local State (useState/ref):**
- Form inputs
- UI toggles
- Temporary values

---

**Used by dev agents for state management implementation.**

