# API Design Rules

**Category:** Code Quality
**Priority:** High
**Version:** 5.2.0
**Applies To:** All API development

---

## Overview

Standards for designing consistent, maintainable APIs.

**Full Guide:** See `skills/api-designer/api-design.md`

---

## 1. RESTful Conventions

| Method | Action | Success | Failure |
|--------|--------|---------|---------|
| GET | Read | 200 | 404 |
| POST | Create | 201 | 400/409 |
| PUT | Replace | 200 | 404 |
| PATCH | Update | 200 | 404 |
| DELETE | Delete | 204 | 404 |

---

## 2. Naming Rules

| Element | Convention | Example |
|---------|------------|---------|
| Endpoints | Plural nouns | `/users`, `/orders` |
| Query params | snake_case | `?page_size=20` |
| Request body | camelCase | `{ "firstName": "John" }` |
| Response body | camelCase | `{ "createdAt": "..." }` |

```
✅ GET /users/:id/orders
❌ GET /getUser/:id/getOrders
❌ GET /user/:id/order
```

---

## 3. Response Format

### Success
```json
{
  "data": { "id": "123", "name": "John" },
  "meta": { "requestId": "req_abc" }
}
```

### List with Pagination
```json
{
  "data": [...],
  "meta": { "page": 1, "pageSize": 20, "total": 100 }
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": { "email": "Required" }
  }
}
```

---

## 4. Versioning

**Recommended:** URL path versioning

```
/api/v1/users
/api/v2/users
```

| Strategy | Example | Use When |
|----------|---------|----------|
| URL path | `/v1/users` | Default choice |
| Header | `Accept-Version: 1` | Clean URLs needed |

---

## 5. Pagination

```
# Offset-based (simple)
GET /users?page=2&page_size=20

# Cursor-based (scalable)
GET /users?cursor=abc123&limit=20
```

Always include pagination metadata in response.

---

## 6. Filtering & Sorting

```
# Filter
GET /users?status=active&role=admin

# Sort
GET /users?sort=created_at:desc

# Combined
GET /users?status=active&sort=name:asc&page=1
```

---

## 7. Status Codes Quick Reference

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (DELETE) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Rate Limited |
| 500 | Server Error |

---

## 8. API Checklist

- [ ] RESTful resource naming
- [ ] Consistent response format
- [ ] Proper status codes
- [ ] Pagination for lists
- [ ] Versioning from start
- [ ] Error codes documented
- [ ] Rate limiting headers
- [ ] OpenAPI documentation

---

## Anti-Patterns

```
❌ GET /getAllUsers
❌ POST /createUser
❌ GET /users?action=delete&id=123
❌ Different response formats per endpoint
❌ Exposing internal database IDs
❌ No pagination on large lists
```

---

## Best Practices

### Do's
- Use plural nouns
- Return created resource on POST
- Include total count in list responses
- Document with OpenAPI
- Use standard error codes

### Don'ts
- Verbs in endpoints
- Expose implementation details
- Mix response formats
- Skip versioning
- Return arrays without wrapper

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
