# Command: db:design

**Command:** `db:design [feature]`
**Agent:** database-specialist
**Version:** 5.2.0

---

## 🎯 Purpose

Design database schema, create ERD, define tables, relationships, indexes, and generate migration files.

---

## 📋 Usage

```bash
# Design schema for feature
db:design "user authentication"

# Design from requirements
db:design --requirements user-stories.md

# Include sample data
db:design --with-seeds
```

---

## 🔧 Steps

1. **Analyze Requirements** - Extract entities and relationships
2. **Create ERD** - Entity-Relationship Diagram
3. **Define Tables** - Columns, data types, constraints
4. **Plan Indexes** - Performance optimization
5. **Generate Migration** - SQL/ORM migration files
6. **Create Seeds** - Sample data (optional)

---

## 📊 Output

```markdown
# Database Schema Design

## ERD
```
┌─────────────┐       ┌──────────────┐
│    users    │───────│    posts     │
├─────────────┤ 1   * ├──────────────┤
│ id (PK)     │       │ id (PK)      │
│ email       │       │ user_id (FK) │
│ name        │       │ title        │
│ created_at  │       │ content      │
└─────────────┘       │ created_at   │
                      └──────────────┘
```

## Tables

### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### posts
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
```

## Indexes Strategy
- users.email: Unique index (login queries)
- posts.user_id: Foreign key index (joins)
- posts.created_at: DESC index (recent posts)

## Deliverables
- ✅ Schema SQL (`migrations/001_create_users_posts.sql`)
- ✅ ERD diagram (`docs/database-erd.md`)
- ✅ Seed data (`seeds/users_posts.sql`)
```

---

**Command:** db:design
**Version:** 5.2.0
