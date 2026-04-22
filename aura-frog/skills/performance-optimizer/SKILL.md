---
name: performance-optimizer
description: "Identifies and resolves performance bottlenecks across frontend (Core Web Vitals, code splitting, lazy loading), backend (N+1 queries, async processing), and database (EXPLAIN ANALYZE, indexing strategies) layers. Use when the user reports slow code, latency issues, memory leaks, needs to speed up an application, or wants to benchmark and profile performance."
autoInvoke: false
priority: medium
triggers:
  - "performance optimization"
  - "slow"
  - "bottleneck"
---

# Skill: Performance Optimizer

Identify and resolve performance bottlenecks. Measure first, optimize second.

---

## Principles

1. Measure first, optimize second
2. Optimize the bottleneck, not everything
3. 80/20: 80% of slowness is in 20% of code

---

## Profiling

| Layer | Tools | Metrics |
|-------|-------|---------|
| Frontend | Lighthouse, DevTools | FCP, LCP, TTI, CLS |
| Backend | APM, profilers | Response time, throughput |
| Database | EXPLAIN, slow query log | Query time, index usage |
| Memory | Heap snapshots | Allocation, leaks |

---

## Frontend

**Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

**Quick wins:** `loading="lazy"` images, `lazy(() => import(...))` code splitting, `debounce` handlers, `useMemo` for expensive computations. Optimize images (WebP), cache headers, preload fonts.

---

## Backend

| Issue | Solution |
|-------|----------|
| N+1 queries | Eager loading, batching |
| Missing indexes | Add appropriate indexes |
| Unbounded queries | Pagination, limits |
| Sync blocking | Async/parallel processing |
| No caching | Cache hot data |

---

## Database

`EXPLAIN ANALYZE` for slow queries. Look for Seq Scan (bad) vs Index Scan (good).

| Query Pattern | Index Type |
|---------------|------------|
| Exact match | B-tree |
| Range | B-tree |
| Full-text | GIN/GiST |
| JSON | GIN |

---

## Caching

| Level | TTL | Use Case |
|-------|-----|----------|
| Browser | Hours-Days | Static assets |
| CDN | Minutes-Hours | API responses |
| Application | Seconds-Minutes | Computed data |

Invalidation: time-based, event-based, or version-based.

---

## Memory

| Leak Cause | Fix |
|------------|-----|
| Event listeners | Cleanup in useEffect/destroy |
| Closures | Null out references |
| Growing collections | WeakMap, clear periodically |
| Timers | clearInterval/clearTimeout |

---

## Optimization Workflow

1. Profile → capture baseline metrics
2. Identify bottleneck → focus on hottest path
3. Set target metric → define measurable goal
4. Apply fix → implement targeted optimization
5. Re-measure → compare against baseline
6. Verify → confirm no regressions, tests pass
