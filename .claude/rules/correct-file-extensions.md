# Rule: Correct File Extensions - JSX/TSX for Components

**Priority:** High  
**Enforcement:** Code Review Phase + Linter  
**Applies To:** All JavaScript/TypeScript files

---

## 🎯 Core Principle

**If file contains JSX/components, use `.jsx` or `.tsx`. Otherwise use `.js` or `.ts`.**

❌ **Bad:** `Component.ts` (contains JSX)  
✅ **Good:** `Component.tsx` (contains JSX)

❌ **Bad:** `utils.tsx` (no JSX, just functions)  
✅ **Good:** `utils.ts` (no JSX)

---

## 🚫 What NOT to Do

### 1. `.ts` File with JSX

❌ **BAD:**
```typescript
// File: Button.ts ❌ WRONG EXTENSION
import React from 'react';

export const Button = () => {
  return <button>Click me</button>; // JSX in .ts file!
};
```

**Problem:**
- TypeScript compiler will error
- IDE won't highlight JSX properly
- Linter will complain

### 2. `.js` File with JSX

❌ **BAD:**
```javascript
// File: Card.js ❌ WRONG EXTENSION (if using TypeScript project)
export const Card = () => {
  return <div>Card</div>; // JSX in .js file (should be .jsx or .tsx)
};
```

### 3. `.tsx` File with No JSX

❌ **BAD:**
```typescript
// File: utils.tsx ❌ WRONG EXTENSION
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const calculateTotal = (items: number[]): number => {
  return items.reduce((a, b) => a + b, 0);
};

// No JSX anywhere! Should be .ts
```

### 4. Hook File with Component

❌ **BAD:**
```typescript
// File: useUserLogic.ts ❌ WRONG EXTENSION
import { useState } from 'react';

export const useUserLogic = () => {
  const [user, setUser] = useState(null);
  
  // Helper component inside hook file
  const UserBadge = () => {
    return <div>{user?.name}</div>; // JSX present!
  };
  
  return { user, setUser, UserBadge };
};
```

**Problem:** Contains `UserBadge` component with JSX, but file is `.ts`

---

## ✅ What TO Do

### 1. Component Files → `.tsx` (TypeScript) or `.jsx` (JavaScript)

✅ **GOOD:**
```typescript
// File: Button.tsx ✅ CORRECT
import React from 'react';

export const Button = () => {
  return <button>Click me</button>;
};
```

✅ **GOOD:**
```typescript
// File: UserProfile.tsx ✅ CORRECT
import React from 'react';

interface Props {
  userId: string;
}

export const UserProfile: React.FC<Props> = ({ userId }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {userId}</p>
    </div>
  );
};
```

### 2. Utility Files → `.ts` (TypeScript) or `.js` (JavaScript)

✅ **GOOD:**
```typescript
// File: utils.ts ✅ CORRECT (no JSX)
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const calculateTotal = (items: number[]): number => {
  return items.reduce((a, b) => a + b, 0);
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
};
```

### 3. Hook Files → `.ts` if no JSX, `.tsx` if has JSX

✅ **GOOD:**
```typescript
// File: useUserData.ts ✅ CORRECT (no JSX)
import { useState, useEffect } from 'react';

export const useUserData = (userId: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
};
```

✅ **GOOD:**
```typescript
// File: useUserLogic.tsx ✅ CORRECT (has JSX)
import { useState } from 'react';

export const useUserLogic = () => {
  const [user, setUser] = useState(null);
  
  // Helper component (contains JSX)
  const UserBadge = () => {
    return <div className="badge">{user?.name}</div>;
  };
  
  return { user, setUser, UserBadge };
};
```

### 4. Type Definition Files → `.ts` (never `.tsx`)

✅ **GOOD:**
```typescript
// File: types.ts ✅ CORRECT (type definitions)
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

---

## 📋 Decision Tree

```
Does file contain JSX/TSX elements?
│
├─ YES → Use .jsx (JS) or .tsx (TS)
│   ├─ React components
│   ├─ Fragments (<>...</>)
│   ├─ JSX elements (<div>, <Component />)
│   └─ Components returned from hooks
│
└─ NO → Use .js (JS) or .ts (TS)
    ├─ Pure functions
    ├─ Hooks (without JSX)
    ├─ Utilities
    ├─ Constants
    ├─ Type definitions
    └─ API clients
```

---

## 🎯 Specific Cases

### Case 1: React Components

**Rule:** Always `.tsx` (TypeScript) or `.jsx` (JavaScript)

```typescript
// ✅ Button.tsx
export const Button = () => <button>Click</button>;

// ✅ Card.tsx
export const Card = ({ children }) => <div>{children}</div>;

// ❌ Button.ts - WRONG!
// ❌ Card.ts - WRONG!
```

### Case 2: Custom Hooks (No JSX)

**Rule:** `.ts` (TypeScript) or `.js` (JavaScript)

```typescript
// ✅ useUserData.ts (no JSX)
export const useUserData = () => {
  const [user, setUser] = useState(null);
  return { user, setUser };
};

// ❌ useUserData.tsx - WRONG! (no JSX)
```

### Case 3: Custom Hooks (With JSX)

**Rule:** `.tsx` (TypeScript) or `.jsx` (JavaScript)

```typescript
// ✅ useUserLogic.tsx (has JSX via component)
export const useUserLogic = () => {
  const Badge = () => <span>Badge</span>; // JSX here!
  return { Badge };
};

// ❌ useUserLogic.ts - WRONG! (has JSX)
```

### Case 4: Utility Functions

**Rule:** `.ts` (TypeScript) or `.js` (JavaScript)

```typescript
// ✅ dateUtils.ts (no JSX)
export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

// ❌ dateUtils.tsx - WRONG! (no JSX)
```

### Case 5: Constants

**Rule:** `.ts` (TypeScript) or `.js` (JavaScript)

```typescript
// ✅ constants.ts (no JSX)
export const API_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;

// ❌ constants.tsx - WRONG! (no JSX)
```

### Case 6: Type Definitions

**Rule:** Always `.ts`, never `.tsx`

```typescript
// ✅ types.ts (type definitions)
export interface User {
  id: string;
  name: string;
}

// ❌ types.tsx - WRONG! (no JSX, just types)
```

### Case 7: API Clients

**Rule:** `.ts` (TypeScript) or `.js` (JavaScript)

```typescript
// ✅ userApi.ts (no JSX)
export const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// ❌ userApi.tsx - WRONG! (no JSX)
```

### Case 8: Styled Components

**Rule:** If returns JSX → `.tsx`, if just exports styles → `.ts`

```typescript
// ✅ Button.styles.ts (just styles, no JSX)
import styled from '@emotion/styled';

export const StyledButton = styled.button`
  background: blue;
  color: white;
`;

// ✅ Button.tsx (uses styled components, has JSX)
import { StyledButton } from './Button.styles';

export const Button = () => {
  return <StyledButton>Click</StyledButton>;
};
```

### Case 9: HOCs (Higher-Order Components)

**Rule:** If returns JSX component → `.tsx`

```typescript
// ✅ withAuth.tsx (returns component with JSX)
export const withAuth = (Component: React.FC) => {
  return (props: any) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <div>Not authenticated</div>; // JSX!
    }
    
    return <Component {...props} />; // JSX!
  };
};

// ❌ withAuth.ts - WRONG! (has JSX)
```

### Case 10: Context Providers

**Rule:** Always `.tsx` (has JSX)

```typescript
// ✅ AuthProvider.tsx (has JSX)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ❌ AuthProvider.ts - WRONG! (has JSX)
```

---

## 🔍 Detection Patterns

### Contains JSX (Use `.tsx` or `.jsx`)

```typescript
// Pattern 1: JSX Elements
<div>Content</div>
<Component />
<>Fragment</>

// Pattern 2: Component Definition
export const Component = () => {
  return <div />;
};

// Pattern 3: React.createElement
React.createElement('div', null, 'Content')

// Pattern 4: Fragment
<React.Fragment>Content</React.Fragment>

// Pattern 5: Component in Hook
const useHook = () => {
  const Comp = () => <div />;
  return { Comp };
};
```

### No JSX (Use `.ts` or `.js`)

```typescript
// Pattern 1: Pure Functions
export const add = (a: number, b: number) => a + b;

// Pattern 2: Hooks (no JSX)
export const useCounter = () => {
  const [count, setCount] = useState(0);
  return { count, setCount };
};

// Pattern 3: Types
export interface User { id: string; }

// Pattern 4: Constants
export const API_URL = 'https://api.example.com';

// Pattern 5: Classes
export class UserService { }
```

---

## 🚨 Common Mistakes

### Mistake 1: Hook File with Hidden Component

❌ **BAD:**
```typescript
// File: useSocialMarketingCompositePostLogic.ts ❌
// (Your current file from screenshot!)

export const useSocialMarketingCompositePostLogic = () => {
  // ... lots of logic ...
  
  // Hidden component at the bottom!
  const SuccessIcon = () => (
    <Icon.Tick /> // JSX present!
  );
  
  return {
    // ... other stuff ...
    SuccessIcon, // Returning component!
  };
};
```

✅ **GOOD:**
```typescript
// File: useSocialMarketingCompositePostLogic.tsx ✅
// CORRECT extension because it contains JSX

export const useSocialMarketingCompositePostLogic = () => {
  // ... logic ...
  
  const SuccessIcon = () => (
    <Icon.Tick />
  );
  
  return {
    // ... other stuff ...
    SuccessIcon,
  };
};
```

### Mistake 2: Utils File with JSX

❌ **BAD:**
```typescript
// File: helpers.ts ❌

export const renderError = (message: string) => {
  return <div className="error">{message}</div>; // JSX in .ts!
};
```

✅ **GOOD:**
```typescript
// Option 1: Rename to .tsx
// File: helpers.tsx ✅

export const renderError = (message: string) => {
  return <div className="error">{message}</div>;
};

// Option 2: Return string, not JSX
// File: helpers.ts ✅

export const getErrorMessage = (message: string): string => {
  return message; // No JSX, just string
};
```

### Mistake 3: Overly Generic `.tsx`

❌ **BAD:**
```typescript
// File: api.tsx ❌ (no JSX anywhere)

export const fetchUser = async (id: string) => {
  return fetch(`/api/users/${id}`);
};

export const updateUser = async (id: string, data: any) => {
  return fetch(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
```

✅ **GOOD:**
```typescript
// File: api.ts ✅ (no JSX, should be .ts)

export const fetchUser = async (id: string) => {
  return fetch(`/api/users/${id}`);
};

export const updateUser = async (id: string, data: any) => {
  return fetch(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
```

---

## 📊 Your Code Example

### Current Issue (From Screenshot)

```typescript
// File: useSocialMarketingCompositePostLogic.ts ❌
// Line 212 shows: IconLeft: <Icon.Tick />

// This file contains JSX (Icon.Tick component)
// But extension is .ts (should be .tsx)
```

### Fix

```bash
# Rename file
mv useSocialMarketingCompositePostLogic.ts \
   useSocialMarketingCompositePostLogic.tsx

# Update imports in other files
# From: import { ... } from './hooks/useSocialMarketingCompositePostLogic';
# To:   import { ... } from './hooks/useSocialMarketingCompositePostLogic';
# (import path stays same, just file extension changes)
```

**After rename:**
```typescript
// File: useSocialMarketingCompositePostLogic.tsx ✅

export const useSocialMarketingCompositePostLogic = () => {
  // ... logic ...
  
  // Now .tsx extension is correct because of this:
  const renderIcon = () => <Icon.Tick />;
  
  return {
    // ...
    IconLeft: <Icon.Tick />, // JSX is OK in .tsx
  };
};
```

---

## 🔧 Linter Configuration

### ESLint Rule

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Enforce correct file extensions
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
        allow: 'as-needed',
      },
    ],
  },
};
```

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "allowJs": true,
    "checkJs": false
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.js",
    "src/**/*.jsx"
  ]
}
```

---

## 📋 Code Review Checklist

During Phase 6 (Code Review), check:

### File Extension Check
- [ ] All component files are `.tsx` (or `.jsx`)
- [ ] All files with JSX are `.tsx` (or `.jsx`)
- [ ] Hook files with components are `.tsx` (or `.jsx`)
- [ ] Utility files without JSX are `.ts` (or `.js`)
- [ ] Type definition files are `.ts` (never `.tsx`)
- [ ] Constant files are `.ts` (or `.js`)
- [ ] API client files are `.ts` (or `.js`)

### Red Flags
- [ ] No `.ts` files with JSX
- [ ] No `.tsx` files without JSX
- [ ] No type-only files with `.tsx` extension
- [ ] Consistent extension usage across project

---

## 🎯 Quick Reference

| File Type | Contains JSX? | Extension |
|-----------|--------------|-----------|
| React Component | ✅ Yes | `.tsx` / `.jsx` |
| Hook (with component) | ✅ Yes | `.tsx` / `.jsx` |
| Hook (no JSX) | ❌ No | `.ts` / `.js` |
| Utility functions | ❌ No | `.ts` / `.js` |
| Constants | ❌ No | `.ts` / `.js` |
| Type definitions | ❌ No | `.ts` (never `.tsx`) |
| API client | ❌ No | `.ts` / `.js` |
| Styled components (styles only) | ❌ No | `.ts` / `.js` |
| Styled components (with JSX) | ✅ Yes | `.tsx` / `.jsx` |
| HOC returning component | ✅ Yes | `.tsx` / `.jsx` |
| Context Provider | ✅ Yes | `.tsx` / `.jsx` |

---

## ✅ Enforcement

**Phase 6 (Code Review):**
- ESLint checks file extensions
- Manual review for edge cases
- Flag mismatched extensions
- Suggest renames

**Linter Error:**
```
error: JSX not allowed in files with extension '.ts'
  File: useSocialMarketingCompositePostLogic.ts
  Line 212: IconLeft: <Icon.Tick />
  
  Fix: Rename to useSocialMarketingCompositePostLogic.tsx
```

---

## 🔄 Migration Guide

### Step 1: Find Mismatched Files

```bash
# Find .ts files with JSX
grep -r "return <" src/**/*.ts
grep -r "<.*\/>" src/**/*.ts

# Find .tsx files without JSX
# (manual check - look for files with no JSX)
```

### Step 2: Rename Files

```bash
# Rename individual file
git mv file.ts file.tsx

# Batch rename (with git)
for f in $(find src -name "*.ts" -exec grep -l "<" {} \;); do
  git mv "$f" "${f%.ts}.tsx"
done
```

### Step 3: Update Imports

```bash
# Usually automatic with IDE
# TypeScript imports don't include extensions
# So no changes needed in most cases

# Before: import { X } from './file';
# After:  import { X } from './file'; (same!)
```

---

**Rule:** correct-file-extensions  
**Version:** 1.0.0  
**Added:** CCPM v4.4  
**Priority:** High  
**Impact:** Code organization, TypeScript compilation, linter compliance

