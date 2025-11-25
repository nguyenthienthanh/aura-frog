# Naming Conventions

**Category:** Code Quality  
**Priority:** High  
**Enforcement:** Linter + Code Review

---

## File Naming

### Components
```
PascalCase.{phone|tablet}.tsx
Example: ShareModal.phone.tsx
```

### Hooks
```
useCamelCase.tsx
Example: useSharePost.tsx
```

### Utilities
```
camelCase.ts
Example: formatDate.ts
```

### Tests
```
ComponentName.test.tsx
hookName.test.ts
Example: ShareModal.test.tsx
```

### Constants
```
UPPER_SNAKE_CASE.ts
Example: API_ENDPOINTS.ts
```

---

## Variable Naming

### Boolean
```typescript
// Prefix with is/has/should/can
const isLoading = true
const hasPermission = false
const shouldUpdate = true
const canEdit = false
```

### Arrays
```typescript
// Plural nouns
const users = []
const items = []
const products = []
```

### Functions
```typescript
// Verb + noun
function fetchUser() {}
function handleSubmit() {}
function validateEmail() {}
```

### Event Handlers
```typescript
// handle + Event
const handleClick = () => {}
const handleChange = () => {}
const handleSubmit = () => {}
```

---

## Component Naming

### React/React Native
```typescript
// PascalCase
export function ShareModal() {}
export const UserCard = () => {}
```

### Vue
```vue
<!-- PascalCase or kebab-case -->
<ShareModal />
<share-modal />
```

---

## Type/Interface Naming

```typescript
// PascalCase, descriptive
interface User {
  id: string
  name: string
}

type UserRole = 'admin' | 'user'

// Props suffix for component props
interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}
```

---

## Constant Naming

```typescript
// UPPER_SNAKE_CASE for true constants
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = 'https://api.example.com'

// camelCase for config objects
const apiConfig = {
  timeout: 5000,
  retries: 3
}
```

---

## Best Practices

### Do's ✅
- ✅ Use descriptive names
- ✅ Be consistent across codebase
- ✅ Follow language conventions
- ✅ Use meaningful abbreviations only

### Don'ts ❌
- ❌ Single letter variables (except i, j in loops)
- ❌ Abbreviations like `usr`, `btn`, `msg`
- ❌ Generic names like `data`, `temp`, `obj`
- ❌ Inconsistent casing

---

**Applied in:** All phases, enforced in Phase 6 (Code Review)

