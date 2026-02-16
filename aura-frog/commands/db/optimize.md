# Command: db:optimize

**Command:** `db:optimize [target]`
**Agent:** architect
**Version:** 1.0.0

---

## 🎯 Purpose

Analyze and optimize database queries, indexes, and performance.

---

## 📋 Usage

```bash
# Optimize all queries
db:optimize

# Optimize specific query
db:optimize --query "SELECT * FROM users WHERE email = ?"

# Analyze slow queries
db:optimize --slow-queries

# Index recommendations
db:optimize --suggest-indexes
```

---

## 🔧 Analysis

### 1. Query Analysis (EXPLAIN)
```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(p.id)
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id;
```

### 2. Index Recommendations
- Missing indexes on WHERE clauses
- Unused indexes (remove)
- Composite index opportunities

### 3. N+1 Query Detection
- Identifies sequential queries
- Suggests eager loading

### 4. Query Rewriting
```sql
-- ❌ Slow
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';

-- ✅ Fast (use functional index)
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
```

---

## 📊 Output

```markdown
# Database Optimization Report

## Issues Found: 5

### Critical (1)
**Missing index on posts.user_id**
- Query: `SELECT * FROM posts WHERE user_id = ?`
- Execution time: 1.2s (should be <10ms)
- Fix: `CREATE INDEX idx_posts_user_id ON posts(user_id);`
- Impact: 120x faster

### High (2)
**N+1 Query in UserController**
- Location: `app/controllers/user_controller.py:45`
- Fix: Use eager loading (`select_related`, `prefetch_related`)

**Unused index: idx_users_name**
- Created: 2024-01-15
- Usage: 0 queries
- Recommendation: DROP INDEX

### Optimizations Applied
✅ Created index on posts.user_id
✅ Rewritten query to use EXPLAIN-optimized JOIN
✅ Removed unused index idx_users_name

## Performance Improvement
- Before: Avg 850ms per request
- After: Avg 45ms per request
- Improvement: 94.7%
```

---

**Command:** db:optimize
**Version:** 1.0.0
