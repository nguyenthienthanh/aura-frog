---
name: scalable-thinking
description: "Design for scale while keeping implementation simple (KISS)."
autoInvoke: false
priority: high
triggers:
  - "architecture"
  - "API design"
  - "data modeling"
  - "database schema"
---

# Skill: Scalable Thinking

**Purpose:** Design for scale while keeping implementation simple (KISS)
**Priority:** HIGH
**Auto-invokes:** Architecture, API design, data modeling, database schema

---

## Core Philosophy

**"Think Scalable, Build Simple"**

| Aspect | Scalable Thinking (WHAT) | KISS (HOW) |
|--------|--------------------------|------------|
| Data Model | Normalized, indexed | Simple queries |
| API | Versioned, RESTful | Standard CRUD |
| Code Structure | Feature-based | Flat hierarchy |
| Config | Centralized | Single file |

---

## Where to Apply

### 1. Data Models

**❌ Non-Scalable:**
```typescript
interface User {
  id: string
  preferences: string  // JSON string - can't query
}
```

**✅ Scalable (Simple Implementation):**
```typescript
interface User { id: string; name: string; email: string }
interface UserPreference { userId: string; key: string; value: string }

// Simple queries, can index by key, can partition by userId
```

### 2. API Design

**❌ Non-Scalable:**
```
POST /api/process { everything... }
```

**✅ Scalable (Simple):**
```
POST /api/v1/users/:userId/processes
GET /api/v1/processes/:processId
```

Benefits: Versionable, RESTful, cacheable, evolvable

### 3. Database Schema

**❌ Non-Scalable:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  items JSON  -- Can't filter by item
);
```

**✅ Scalable (Simple):**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  INDEX idx_user_id (user_id)
);

CREATE TABLE order_items (
  order_id UUID REFERENCES orders(id),
  product_id UUID,
  INDEX idx_order_id (order_id)
);
```

### 4. File Structure

**❌ Non-Scalable:**
```
src/utils.ts      # 5000 lines
src/components.tsx # All components
```

**✅ Scalable:**
```
src/features/auth/hooks/, components/, api/
src/features/posts/hooks/, components/, api/
src/shared/hooks/, components/, utils/
```

---

## Scalable Patterns

### Always Plan For Pagination

```typescript
// ❌ Returns all records
GET /api/users → [...50,000 users]

// ✅ Cursor-based
GET /api/users?limit=20&cursor=abc123
→ { data: [...], pagination: { nextCursor, hasMore } }
```

### Centralized Configuration

```typescript
const config = {
  api: { baseUrl: process.env.API_URL, timeout: 5000 },
  features: { /* feature flags */ },
  limits: { maxFileSize: 10 * 1024 * 1024 }
}
```

### Structured Error Handling

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) { super(message) }
}

throw new AppError('User not found', 'USER_NOT_FOUND', 404)
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Instead Do |
|--------------|------------|
| Build for hypothetical 1M users | Simple monolith first, scale when data shows need |
| Pre-optimize with Redis | In-memory cache first, add Redis when measured |
| Abstract for 1 use case | Direct implementation, abstract at 2-3 examples |
| Microservices from day 1 | Monolith, split when team/features grow |

---

## Checklist

### Before Designing
- [ ] Can data model support 10x more records?
- [ ] Can I query the data I'll need?
- [ ] Are there natural partition keys (userId, orgId)?
- [ ] Is API versioned (/v1)?
- [ ] Does pagination exist for lists?

### During Implementation
- [ ] Am I using standard patterns?
- [ ] Is this the simplest solution?
- [ ] Can a junior dev understand this?
- [ ] No abstractions until 3+ examples?

---

## When to Scale Up

**Add Complexity When:**
- Database queries > 2s consistently
- API response > 500ms at p95
- Error rate > 1%
- User growth > 10x in 3 months
- Team size > 5 developers

**Until Then:** Keep it simple, measure everything

---

## Summary

1. **Think Scalable:** Data models that grow, APIs that evolve, architecture that supports change
2. **Build Simple:** Simplest implementation first, standard patterns, no premature optimization
3. **Iterate:** Add complexity based on data, refactor when patterns emerge

**Remember:** Scalable ≠ Complex. Scalable = Can grow. KISS = Simple to maintain.

---

**Applied In:** Phase 2 (Design), Phase 5 (Implementation)
**Version:** 1.0.0 | **Last Updated:** 2025-11-28
