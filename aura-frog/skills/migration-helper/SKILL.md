---
name: migration-helper
description: "Guide safe database and code migrations with zero-downtime strategies."
autoInvoke: false
priority: medium
triggers:
  - "database migration"
  - "code migration"
  - "zero-downtime"
---

# Skill: Migration Helper

**Category:** Dev Expert
**Version:** 1.0.0
**Used By:** database-specialist, backend agents

---

## Overview

Guide safe database and code migrations with zero-downtime strategies.

---

## 1. Migration Safety Rules

```
1. Always backup before migration
2. Test migration on staging first
3. Make migrations reversible
4. Deploy in small batches
5. Monitor during migration
```

---

## 2. Database Migration Patterns

### Schema Changes

| Change | Safe Approach |
|--------|---------------|
| Add column | Add nullable first, backfill, then NOT NULL |
| Remove column | Stop using → deploy → drop |
| Rename column | Add new → copy data → deploy → drop old |
| Add index | CREATE INDEX CONCURRENTLY |
| Change type | Add new column → migrate → drop old |

### Zero-Downtime Pattern
```
Phase 1: Add new column (nullable)
Phase 2: Dual-write (write to both columns)
Phase 3: Backfill old data
Phase 4: Switch reads to new column
Phase 5: Remove old column writes
Phase 6: Drop old column
```

---

## 3. Migration Script Template

```typescript
// migrations/20250128_add_user_status.ts
export async function up(db: Database) {
  // 1. Add column
  await db.query(`
    ALTER TABLE users
    ADD COLUMN status VARCHAR(20) DEFAULT 'active'
  `)

  // 2. Backfill in batches
  let lastId = 0
  while (true) {
    const rows = await db.query(`
      UPDATE users SET status = 'active'
      WHERE id > $1 AND status IS NULL
      LIMIT 1000
      RETURNING id
    `, [lastId])
    if (rows.length === 0) break
    lastId = rows[rows.length - 1].id
  }

  // 3. Add constraint
  await db.query(`
    ALTER TABLE users
    ALTER COLUMN status SET NOT NULL
  `)
}

export async function down(db: Database) {
  await db.query(`ALTER TABLE users DROP COLUMN status`)
}
```

---

## 4. Code Migration Strategies

### Feature Flag Migration
```typescript
// Phase 1: Behind flag
if (featureFlags.newPaymentSystem) {
  return newPaymentService.process(order)
}
return oldPaymentService.process(order)

// Phase 2: Gradually increase flag percentage
// Phase 3: Remove flag, delete old code
```

### Strangler Fig Pattern
```
1. Identify bounded context to migrate
2. Create new implementation alongside old
3. Route traffic gradually to new
4. Remove old when new is stable
```

---

## 5. Data Migration Checklist

Before:
- [ ] Full backup created
- [ ] Migration tested on staging
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

During:
- [ ] Run in batches (not all at once)
- [ ] Monitor performance/errors
- [ ] Verify data integrity

After:
- [ ] Data validation queries
- [ ] Application smoke tests
- [ ] Monitor for 24-48 hours
- [ ] Document changes

---

## 6. Common Migration Scenarios

### Adding Required Column
```sql
-- Wrong: Locks table, fails on existing rows
ALTER TABLE users ADD COLUMN email VARCHAR NOT NULL;

-- Right: Three-phase approach
ALTER TABLE users ADD COLUMN email VARCHAR;
UPDATE users SET email = 'unknown@example.com' WHERE email IS NULL;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
```

### Large Table Index
```sql
-- Wrong: Blocks writes
CREATE INDEX idx_orders_user ON orders(user_id);

-- Right: Non-blocking
CREATE INDEX CONCURRENTLY idx_orders_user ON orders(user_id);
```

### Type Conversion
```sql
-- Add new column
ALTER TABLE products ADD COLUMN price_cents INTEGER;

-- Migrate data
UPDATE products SET price_cents = (price * 100)::INTEGER;

-- Switch application to use new column
-- Drop old column
ALTER TABLE products DROP COLUMN price;
```

---

## 7. Rollback Strategies

| Strategy | When to Use |
|----------|-------------|
| Script rollback | Data changes, can undo |
| Backup restore | Major failure, data loss |
| Feature flag off | Code changes |
| Traffic reroute | Service migration |

---

## Best Practices

### Do's
- Test migrations on copy of prod data
- Make migrations idempotent
- Batch large data updates
- Monitor during execution
- Keep rollback scripts ready

### Don'ts
- Run untested migrations on prod
- Make irreversible changes without backup
- Migrate during peak traffic
- Skip staging environment
- Assume migrations are fast

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
