---
name: performance-optimizer
description: "Identify and resolve performance bottlenecks through profiling, measurement, and targeted optimization."
autoInvoke: false
priority: medium
triggers:
  - "performance optimization"
  - "slow"
  - "bottleneck"
---

# Skill: Performance Optimizer

**Category:** Dev Expert
**Version:** 1.0.0
**Used By:** All development agents

---

## Overview

Identify and resolve performance bottlenecks through profiling, measurement, and targeted optimization.

---

## 1. Performance Optimization Rules

```
1. Measure first, optimize second
2. Optimize the bottleneck, not everything
3. 80/20 rule: 80% of slowness is in 20% of code
4. Premature optimization is the root of all evil
```

---

## 2. Profiling Strategy

| Layer | Tools | Metrics |
|-------|-------|---------|
| Frontend | Lighthouse, DevTools | FCP, LCP, TTI, CLS |
| Backend | APM, profilers | Response time, throughput |
| Database | EXPLAIN, slow query log | Query time, index usage |
| Memory | Heap snapshots | Allocation, leaks |

### When to Profile
- Before optimization (baseline)
- After each change (verify improvement)
- Production (real user data)

---

## 3. Frontend Optimization

### Core Web Vitals Targets
| Metric | Good | Description |
|--------|------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |

### Quick Wins
```typescript
// Lazy load images
<img loading="lazy" src="image.jpg" />

// Code splitting
const Component = lazy(() => import('./Component'))

// Debounce handlers
const handleSearch = debounce((q) => search(q), 300)

// Memoize expensive computations
const result = useMemo(() => expensiveCalc(data), [data])
```

### Checklist
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code split by route
- [ ] CSS/JS minified and compressed
- [ ] Caching headers set
- [ ] Fonts preloaded

---

## 4. Backend Optimization

### Common Bottlenecks
| Issue | Solution |
|-------|----------|
| N+1 queries | Eager loading, batching |
| Missing indexes | Add appropriate indexes |
| Unbounded queries | Pagination, limits |
| Sync blocking | Async/parallel processing |
| No caching | Cache hot data |

### Quick Wins
```typescript
// Batch database calls
const users = await User.findByIds(ids)  // 1 query, not N

// Add indexes
CREATE INDEX idx_users_email ON users(email)

// Cache expensive queries
const data = await cache.getOrSet('key', () => db.query(), 3600)

// Parallel async
const [users, orders] = await Promise.all([getUsers(), getOrders()])
```

---

## 5. Database Optimization

### Query Analysis
```sql
-- Always EXPLAIN slow queries
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- Look for: Seq Scan (bad), Index Scan (good)
```

### Index Strategy
| Query Pattern | Index Type |
|---------------|------------|
| Exact match | B-tree (default) |
| Range queries | B-tree |
| Full-text search | GIN/GiST |
| JSON fields | GIN |

### Checklist
- [ ] Indexes on WHERE/JOIN columns
- [ ] No SELECT * (specify columns)
- [ ] Pagination on large tables
- [ ] Connection pooling enabled
- [ ] Query result caching

---

## 6. Caching Strategy

| Cache Level | TTL | Use Case |
|-------------|-----|----------|
| Browser | Hours-Days | Static assets |
| CDN | Minutes-Hours | API responses |
| Application | Seconds-Minutes | Computed data |
| Database | Varies | Query cache |

### Cache Invalidation
```typescript
// Time-based
cache.set(key, value, { ttl: 3600 })

// Event-based
onUserUpdate(user => cache.delete(`user:${user.id}`))

// Version-based
cache.set(`data:v${version}`, value)
```

---

## 7. Memory Optimization

### Common Leaks
| Cause | Fix |
|-------|-----|
| Event listeners not removed | Cleanup in useEffect/destroy |
| Closures holding references | Null out references |
| Growing arrays/maps | Use WeakMap, clear periodically |
| Timers not cleared | clearInterval/clearTimeout |

### Detection
```typescript
// Node.js heap snapshot
const v8 = require('v8')
v8.writeHeapSnapshot()

// Browser DevTools
// Memory tab → Take heap snapshot → Compare
```

---

## 8. Optimization Checklist

Before:
- [ ] Baseline metrics captured
- [ ] Bottleneck identified via profiling
- [ ] Target improvement defined

After:
- [ ] Metrics improved
- [ ] No regressions introduced
- [ ] Tests still pass

---

## Best Practices

### Do's
- Measure before and after
- Optimize biggest bottleneck first
- Use appropriate data structures
- Cache strategically
- Profile in production-like env

### Don'ts
- Optimize without measuring
- Micro-optimize everything
- Cache without invalidation strategy
- Ignore memory leaks
- Sacrifice readability for speed

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
