# Naming Conventions

**Category:** Code Quality
**Priority:** High
**Enforcement:** Linter + Code Review
**Version:** 1.1.0

---

## ⚠️ Merge With Project Config

**IMPORTANT:** These conventions MERGE with project's ESLint naming rules.

```
Project config overrides conflicts → Aura Frog fills gaps → Combined result
```

- If project defines naming rules → Project wins
- If project is silent → These conventions apply

**See:** `rules/project-linting-precedence.md` for details.

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

## Structured Data Format

**ALWAYS use TOON format for structured data in documentation.**

```toon
format_rules[3]{element,format,avoid}:
  Tables,TOON blocks,Markdown tables
  Lists with structure,TOON arrays,Bullet lists
  Configuration,TOON key-value,Plain text
```

### Example

```toon
# ✅ Use TOON
items[3]{name,type,required}:
  email,string,yes
  age,number,no
  role,enum,yes
```

```markdown
<!-- ❌ Avoid markdown tables -->
| Name | Type | Required |
|------|------|----------|
| email | string | yes |
```

**Reference:** `docs/TOON_FORMAT_GUIDE.md`

---

## Best Practices

### Do's ✅
- ✅ Use descriptive names
- ✅ Be consistent across codebase
- ✅ Follow language conventions
- ✅ Use meaningful abbreviations only
- ✅ Use TOON for structured data

### Don'ts ❌
- ❌ Single letter variables (except i, j in loops)
- ❌ Abbreviations like `usr`, `btn`, `msg`
- ❌ Generic names like `data`, `temp`, `obj`
- ❌ Inconsistent casing
- ❌ Markdown tables in documentation

---

**Applied in:** All phases, enforced in Phase 6 (Code Review)

---

**Version:** 1.2.0
**Last Updated:** 2025-12-23

