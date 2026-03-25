# Code Quality Rules

**Purpose:** Ensure consistent, high-quality code across all projects

---

## ⚠️ Merge With Project Config

**IMPORTANT:** These rules MERGE with project's ESLint/TSLint/Prettier configuration.

```
Project config overrides conflicts → Aura Frog fills gaps → Combined result
```

- If project defines a rule → Project wins
- If project is silent → These rules apply

**See:** `rules/project-linting-precedence.md` for details.

---

## 📏 General Code Standards

### TypeScript/JavaScript
```typescript
// ✅ GOOD: Strict typing, no any
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // Implementation
}

// ❌ BAD: Using any
function getUser(id: any): any {
  // Implementation
}
```

### No Non-Null Assertions
```typescript
// ❌ BAD
const value = obj.field!;

// ✅ GOOD
const value = obj.field ?? defaultValue;
const value = obj.field || fallback;
if (obj.field) {
  // Use obj.field safely
}
```

### Proper Error Handling
```typescript
// ✅ GOOD
try {
  await riskyOperation();
} catch (error) {
  if (error instanceof ValidationError) {
    handleValidationError(error);
  } else {
    logger.error('Unexpected error', error);
    throw error;
  }
}

// ❌ BAD: Silent failures
try {
  await riskyOperation();
} catch (error) {
  // Do nothing
}
```

---

## 🧪 Testing Rules

### Test Coverage
```yaml
Minimum Coverage:
  overall: 80%
  critical_business_logic: 90%
  ui_components: 70%
  utility_functions: 95%
  
Required Test Types:
  - Unit tests
  - Integration tests (for API/data layers)
  - E2E tests (for critical user flows)
```

### Test Structure
```typescript
// ✅ GOOD: Descriptive, organized
describe('useSocialMediaPost', () => {
  describe('when posting to Facebook', () => {
    it('should successfully post with valid content', async () => {
      // Arrange
      const hook = renderHook(() => useSocialMediaPost());
      
      // Act
      await act(() => hook.result.current.post(validPost));
      
      // Assert
      expect(hook.result.current.status).toBe('success');
    });
  });
});

// ❌ BAD: Vague, unorganized
it('test post', () => {
  // Unclear what's being tested
});
```

---

## 🏗️ Architecture Rules

### Component Structure
```typescript
// ✅ GOOD: Single responsibility
// UserProfile.tsx
export const UserProfile: FC<Props> = ({ userId }) => {
  const user = useUser(userId);
  
  if (!user) return <Loading />;
  
  return (
    <div>
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </div>
  );
};

// ❌ BAD: Too many responsibilities
export const UserProfile: FC<Props> = ({ userId }) => {
  // Handles fetching, rendering, actions, routing...
  // 500+ lines of code
};
```

### Dependency Injection
```typescript
// ✅ GOOD: Dependencies injected
export class UserService {
  constructor(
    private api: ApiClient,
    private storage: Storage
  ) {}
}

// ❌ BAD: Hard-coded dependencies
export class UserService {
  api = new ApiClient();
  storage = localStorage;
}
```

---

## 🎨 Naming Conventions

### Variables & Functions
```typescript
// ✅ GOOD: Descriptive, camelCase
const userList = getActiveUsers();
const isAuthenticated = checkAuth();

// ❌ BAD: Unclear, inconsistent
const list = get();
const auth = check();
```

### Constants
```typescript
// ✅ GOOD: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// ❌ BAD
const max = 3;
const url = 'https://api.example.com';
```

### Booleans
```typescript
// ✅ GOOD: is/has/can prefix
const isLoading = true;
const hasPermission = checkPermission();
const canEdit = user.role === 'admin';

// ❌ BAD
const loading = true;
const permission = checkPermission();
```

---

## 📦 File Organization

### Import Order
```typescript
// 1. React & React Native
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

// 3. Navigation
import { useNavigation } from '@react-navigation/native';

// 4. Store & State
import { useBoundStore } from 'hooks/useBoundStore';

// 5. API
import { userApi } from 'api/userApi';

// 6. Components
import { Button } from 'proj-ui-components';
import { CustomComponent } from 'components/CustomComponent';

// 7. Hooks
import { useCustomHook } from './hooks/useCustomHook';

// 8. Utils & Constants
import { formatDate } from 'utils/dateUtils';

// 9. Types
import type { User } from 'types/user';

// 10. Assets
import Logo from './assets/logo.svg';
```

---

## ♻️ Code Reusability

### DRY Principle
```typescript
// ✅ GOOD: Reusable function
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Use everywhere
const price1 = formatCurrency(100, 'USD');
const price2 = formatCurrency(200, 'USD');

// ❌ BAD: Repeated logic
const price1 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(100);

const price2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(200);
```

---

## 🚫 Code Smells to Avoid

### Magic Numbers
```typescript
// ❌ BAD
if (user.age > 18) {
  // What does 18 mean?
}

// ✅ GOOD
const MINIMUM_AGE = 18;
if (user.age > MINIMUM_AGE) {
  // Clear intent
}
```

### Long Functions
```typescript
// ❌ BAD: 200+ lines function
function processUser() {
  // Too much logic
}

// ✅ GOOD: Break into smaller functions
function processUser() {
  validateUser();
  transformUser();
  saveUser();
}
```

### Nested Conditionals
```typescript
// ❌ BAD: Deep nesting
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // Do something
    }
  }
}

// ✅ GOOD: Early returns
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;

// Do something
```

---

## 📝 Documentation Rules

### JSDoc for Public APIs
```typescript
/**
 * Calculate premium based on age, coverage, and region.
 * 
 * @param age - Applicant age (18-65)
 * @param coverage - Coverage amount in local currency
 * @param region - Region code (ph, my, id, ib, hk)
 * @returns Premium amount or null if not eligible
 * 
 * @example
 * ```typescript
 * const premium = calculatePremium(30, 1000000, 'ph');
 * // Returns: 5000
 * ```
 */
export function calculatePremium(
  age: number,
  coverage: number,
  region: Region
): number | null {
  // Implementation
}
```

### Comments for Complex Logic
```typescript
// ✅ GOOD: Explain "why", not "what"
// Use exponential backoff to avoid overwhelming the server
// after rate limit errors
await retryWithBackoff(operation);

// ❌ BAD: Obvious comment
// Increment counter by 1
counter = counter + 1;
```

---

## ✅ Code Review Checklist

Before submitting code:

- [ ] No ESLint warnings
- [ ] TypeScript strict compliance
- [ ] Test coverage >= threshold
- [ ] All tests pass
- [ ] No console.logs in production
- [ ] Proper error handling
- [ ] Code is readable
- [ ] No code smells
- [ ] Documentation updated
- [ ] Follows naming conventions

---

**Last Updated:** 2025-12-10

