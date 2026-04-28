---
name: api-designer
description: "Design consistent, RESTful APIs with proper versioning, documentation, and error handling."
autoInvoke: false
priority: medium
triggers:
  - "API design"
  - "REST API"
  - "endpoint design"
---

# Skill: API Designer

Design consistent, RESTful APIs with versioning, documentation, and error handling.

---

## RESTful Conventions

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | /users | List | 200 + array |
| GET | /users/:id | Get one | 200 / 404 |
| POST | /users | Create | 201 + created |
| PUT | /users/:id | Replace | 200 / 404 |
| PATCH | /users/:id | Update | 200 / 404 |
| DELETE | /users/:id | Delete | 204 / 404 |

Nested: `GET /users/:userId/orders`

---

## Naming

- Resources: plural nouns (`/users`, `/orders`)
- Query params: snake_case (`page_size`)
- Request/Response bodies: camelCase

**Versioning:** URL path `/api/v1/...` (recommended).

---

## Response Format

**Success:** `{ "data": {...}, "meta": {...} }`
**List:** Add `meta: { page, pageSize, total, totalPages }`
**Error:** `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {...} } }`

---

## Status Codes

| Code | When |
|------|------|
| 200 | Successful GET/PUT/PATCH |
| 201 | Successful POST |
| 204 | Successful DELETE |
| 400/422 | Invalid input / validation |
| 401/403 | No auth / no permission |
| 404/409 | Not found / conflict |
| 429 | Rate limited |
| 500 | Unexpected error |

---

## Pagination

**Offset:** `?page=2&page_size=20` (simple, slow on large sets)
**Cursor:** `?cursor=abc&limit=20` (consistent, fast, no page jump)

---

## Filtering & Sorting

```
GET /users?status=active&sort=created_at:desc&q=john&page=1&page_size=20
```

---

## Checklist

RESTful naming, consistent response format, proper status codes, pagination for lists, error codes, versioning, OpenAPI docs, rate limiting headers.

---

## Related Rules

- `rules/agent/api-design-rules.md` — enforcement checklist (short form of this skill)
- `rules/core/simplicity-over-complexity.md` — favor flat resources over nested hierarchies, reject premature GraphQL when REST fits, no speculative "future-proofing" fields
- `rules/agent/structured-data-schema.md` — consistent schema across endpoints
- `rules/agent/error-handling-standard.md` — uniform error envelope

---
