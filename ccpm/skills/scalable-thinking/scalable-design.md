# Skill: Scalable Thinking

**Purpose:** Ensure solutions are designed to scale while keeping implementation simple (KISS)

**Priority:** HIGH (before implementation)

**Auto-invokes when:** Architecture decisions, API design, data modeling, system design

---

## 🎯 Core Philosophy

**"Think Scalable, Build Simple"**

1. **Architecture & Design** → Think scalable (future-proof structure)
2. **Implementation** → Keep it simple (KISS principle)
3. **Iterate** → Add complexity only when needed

---

## ⚖️ Scalable Thinking vs KISS

### They Work Together, Not Against Each Other

**Scalable Thinking (WHAT to build):**
- Design data models that can grow
- Plan APIs that can evolve
- Choose architecture that supports growth
- Anticipate scaling patterns

**KISS (HOW to build):**
- Implement the simplest version first
- Avoid over-engineering
- Add features only when needed
- Keep code readable and maintainable

---

## 🏗️ Where to Apply Scalable Thinking

### 1. Data Models (Think Scalable)

**❌ Non-Scalable:**
```typescript
// Single monolithic user object
interface User {
  id: string
  name: string
  email: string
  preferences: string  // JSON string - can't query
  settings: string     // JSON string - can't index
  metadata: string     // JSON string - unmaintainable
}
```

**✅ Scalable Design (Simple Implementation):**
```typescript
// Normalized, queryable structure
interface User {
  id: string
  name: string
  email: string
}

interface UserPreference {
  userId: string
  key: string
  value: string
}

interface UserSetting {
  userId: string
  category: string
  settings: Record<string, any>
}

// Implementation is still simple:
const user = await db.users.findById(id)
const prefs = await db.userPreferences.findByUserId(id)
```

**Why Scalable:**
- ✅ Can query preferences independently
- ✅ Can add new preference types without migration
- ✅ Can index by key for performance
- ✅ Can partition by userId

**Why KISS:**
- Simple tables, simple queries
- No complex ORM configurations
- Standard SQL operations

---

### 2. API Design (Think Scalable)

**❌ Non-Scalable:**
```typescript
// Tight coupling, hard to version
POST /api/process
{
  "userData": {...},
  "processType": "type1",
  "options": {...},
  "misc": {...}
}
```

**✅ Scalable Design (Simple Implementation):**
```typescript
// RESTful, versionable, resource-oriented
POST /api/v1/users/:userId/processes
{
  "type": "type1",
  "config": {...}
}

GET /api/v1/processes/:processId
DELETE /api/v1/processes/:processId
```

**Why Scalable:**
- ✅ Versionable (/v1, /v2)
- ✅ Resource-oriented (RESTful)
- ✅ Can add new endpoints without breaking old
- ✅ Can deprecate gradually
- ✅ Cacheable (GET /processes/:id)

**Why KISS:**
- Standard REST patterns
- No complex routing
- Simple CRUD operations

---

### 3. Database Schema (Think Scalable)

**❌ Non-Scalable:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_data JSON,        -- Denormalized, can't query
  items JSON,            -- Can't filter by item
  total DECIMAL,
  created_at TIMESTAMP
);
```

**✅ Scalable Design (Simple Implementation):**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status VARCHAR(50),
  total DECIMAL,
  created_at TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  price DECIMAL,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);
```

**Why Scalable:**
- ✅ Can query orders by user efficiently
- ✅ Can query items independently
- ✅ Can partition orders by created_at
- ✅ Can shard by user_id
- ✅ Indexes support common queries

**Why KISS:**
- Simple foreign keys
- Standard SQL joins
- No fancy ORM magic

---

### 4. File/Module Structure (Think Scalable)

**❌ Non-Scalable:**
```
src/
├── utils.ts       # 5000 lines
├── helpers.ts     # 3000 lines
├── api.ts         # All API calls
└── components.tsx # All components
```

**✅ Scalable Design (Simple Implementation):**
```
src/
├── features/
│   ├── auth/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── api/
│   ├── posts/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── api/
│   └── users/
│       ├── hooks/
│       ├── components/
│       └── api/
└── shared/
    ├── hooks/
    ├── components/
    └── utils/
```

**Why Scalable:**
- ✅ Can add new features independently
- ✅ Team can work on different features
- ✅ Can lazy-load features
- ✅ Clear boundaries

**Why KISS:**
- Simple folder structure
- Standard feature modules
- No complex module federation

---

### 5. Event/Message Structure (Think Scalable)

**❌ Non-Scalable:**
```typescript
// Tightly coupled to current implementation
socket.emit('update', {
  type: 'user',
  data: userData,
  timestamp: Date.now()
})
```

**✅ Scalable Design (Simple Implementation):**
```typescript
// Versioned, structured events
interface DomainEvent {
  id: string
  type: string
  version: '1.0'
  timestamp: number
  payload: unknown
}

const event: DomainEvent = {
  id: uuid(),
  type: 'user.updated',
  version: '1.0',
  timestamp: Date.now(),
  payload: { userId, changes }
}

eventBus.publish(event)
```

**Why Scalable:**
- ✅ Versioned (can evolve schema)
- ✅ Namespaced (user.updated, post.created)
- ✅ Event sourcing ready
- ✅ Can replay events
- ✅ Can add event handlers without changing publishers

**Why KISS:**
- Simple interface
- Basic publish/subscribe
- No complex event orchestration

---

## 🚀 Scalable Patterns to Use

### 1. Pagination (Always Plan For)

**❌ Non-Scalable:**
```typescript
// Returns all records - breaks at 10k+ items
GET /api/users
→ [{ id: 1 }, { id: 2 }, ...]  // All 50,000 users
```

**✅ Scalable (Simple):**
```typescript
// Cursor-based pagination
GET /api/users?limit=20&cursor=abc123

{
  data: [...],
  pagination: {
    nextCursor: 'xyz789',
    hasMore: true
  }
}
```

---

### 2. Feature Flags (Plan For Evolution)

**❌ Non-Scalable:**
```typescript
// Hard-coded feature switch
if (process.env.NEW_FEATURE === 'true') {
  // new code
}
```

**✅ Scalable (Simple):**
```typescript
// Centralized feature flags (simple implementation)
const features = {
  newCheckout: true,
  betaUI: false,
  aiSearch: true
}

if (features.newCheckout) {
  // new code
}

// Later: Can make user-specific, percentage rollout, etc.
```

---

### 3. Configuration (Centralized)

**❌ Non-Scalable:**
```typescript
// Scattered constants
const API_URL = 'https://api.example.com'
const TIMEOUT = 5000
const MAX_RETRIES = 3
```

**✅ Scalable (Simple):**
```typescript
// Centralized, typed config
const config = {
  api: {
    baseUrl: process.env.API_URL,
    timeout: 5000,
    retries: 3
  },
  features: {
    // feature flags
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024
  }
}

export default config
```

---

### 4. Error Handling (Structured)

**❌ Non-Scalable:**
```typescript
throw new Error('Something went wrong')
```

**✅ Scalable (Simple):**
```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

throw new AppError('User not found', 'USER_NOT_FOUND', 404)

// Can add: logging, monitoring, i18n later
```

---

## ❌ What NOT to Do (Anti-Patterns)

### 1. Don't Build for Hypothetical Scale

**❌ Wrong:**
```typescript
// "We might need to support 1M users"
// But current users: 100

// Building microservices, event sourcing, CQRS,
// sharding, caching layers, message queues...
```

**✅ Right:**
```typescript
// Design data model to support growth
// Implement simple monolith first
// Add complexity when you have data showing you need it
```

---

### 2. Don't Prematurely Optimize

**❌ Wrong:**
```typescript
// "Let's use Redis for everything"
// Before measuring if you have a performance problem
```

**✅ Right:**
```typescript
// Use simple in-memory cache first
// Measure performance
// Add Redis when data shows you need it
```

---

### 3. Don't Abstract Too Early

**❌ Wrong:**
```typescript
// Creating abstraction for 1 use case
interface PaymentProcessor {
  process(payment: Payment): Promise<Result>
}

class StripeProcessor implements PaymentProcessor { }
```

**✅ Right:**
```typescript
// Direct implementation
const stripe = new Stripe(apiKey)

// Add abstraction when you have 2-3 payment providers
```

---

## ✅ Scalable Thinking Checklist

### Before Designing (Think Scalable)

**Data & Storage:**
- [ ] Can this data model support 10x more records?
- [ ] Can I query the data I'll need to query?
- [ ] Are there natural partition keys (userId, orgId)?
- [ ] Can I add fields without breaking existing data?
- [ ] Are indexes planned for common queries?

**API Design:**
- [ ] Is the API versioned (/v1)?
- [ ] Are resources RESTful and cacheable?
- [ ] Does pagination exist for lists?
- [ ] Can I add new endpoints without breaking old?
- [ ] Are error responses structured?

**Architecture:**
- [ ] Are concerns separated (features, layers)?
- [ ] Can features be deployed independently? (future)
- [ ] Is configuration centralized?
- [ ] Can I add new features without modifying existing?

**Code Organization:**
- [ ] Is the folder structure feature-based?
- [ ] Can I find code quickly?
- [ ] Can new team members navigate easily?

### During Implementation (Apply KISS)

**Simplicity:**
- [ ] Am I using standard patterns?
- [ ] Is this the simplest solution?
- [ ] Can a junior dev understand this?
- [ ] Have I removed all "just in case" code?

**Avoid Over-Engineering:**
- [ ] No abstractions until 3+ examples?
- [ ] No optimization without profiling?
- [ ] No layers without clear benefit?
- [ ] No custom solutions for solved problems?

---

## 🎯 Real-World Examples

### Example 1: User Authentication

**Scalable Design:**
```typescript
// JWT with versioned claims (can evolve)
interface TokenPayload {
  version: '1.0'
  userId: string
  role: string
  exp: number
}

// Refreshable tokens (long-term support)
interface Tokens {
  accessToken: string   // 15 min
  refreshToken: string  // 7 days
}
```

**KISS Implementation:**
```typescript
// Simple JWT library
import jwt from 'jsonwebtoken'

function generateTokens(user: User): Tokens {
  const accessToken = jwt.sign(
    { version: '1.0', userId: user.id, role: user.role },
    SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { version: '1.0', userId: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}
```

---

### Example 2: File Upload

**Scalable Design:**
```typescript
// Separate storage from metadata
interface FileMetadata {
  id: string
  userId: string
  filename: string
  mimeType: string
  size: number
  storageKey: string  // S3 key, can change storage
  createdAt: Date
}

// Storage abstraction (can swap providers)
interface StorageProvider {
  upload(file: Buffer, key: string): Promise<string>
  download(key: string): Promise<Buffer>
  delete(key: string): Promise<void>
}
```

**KISS Implementation:**
```typescript
// Start with local filesystem
class LocalStorage implements StorageProvider {
  async upload(file: Buffer, key: string) {
    await fs.writeFile(`./uploads/${key}`, file)
    return key
  }

  async download(key: string) {
    return await fs.readFile(`./uploads/${key}`)
  }

  async delete(key: string) {
    await fs.unlink(`./uploads/${key}`)
  }
}

// Later: Swap to S3 without changing calling code
```

---

## 📊 When to Scale Up

### Metrics to Watch

**Add Complexity When:**
- Database queries > 2 seconds consistently
- API response time > 500ms at p95
- Error rate > 1%
- User growth > 10x in 3 months
- Team size > 5 developers
- Feature count > 20

**Until Then:**
- Keep it simple
- Measure everything
- Optimize based on data

---

## 🎓 Summary

### The Golden Rule

**"Design for scale, implement for simplicity"**

1. **Think Scalable:**
   - Data models that can grow
   - APIs that can evolve
   - Architecture that supports change

2. **Build Simple:**
   - Simplest implementation first
   - Standard patterns
   - No premature optimization

3. **Iterate:**
   - Add complexity based on data
   - Refactor when patterns emerge
   - Scale when metrics demand it

---

### Quick Decision Matrix

| Aspect | Think Scalable | Implement KISS |
|--------|---------------|----------------|
| **Data Model** | Normalized, indexed | Simple queries |
| **API** | Versioned, RESTful | Standard CRUD |
| **Code Structure** | Feature-based | Flat hierarchy |
| **Error Handling** | Structured codes | Simple classes |
| **Config** | Centralized | Single file |
| **Pagination** | Always planned | Simple offset first |
| **Caching** | Designed in | Add when needed |
| **Testing** | Test boundaries | Unit tests first |

---

**Applied In:** Phase 1 (Requirements), Phase 2 (Technical Planning), Phase 3 (Design)

**Works With:** KISS Principle, TDD, Code Quality Rules

**Remember:** Scalable ≠ Complex. Scalable = Can grow. KISS = Simple to maintain.
