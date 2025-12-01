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

**Category:** Dev Expert
**Version:** 1.0.0
**Used By:** backend-nodejs, backend-python, backend-go, backend-laravel

---

## Overview

Design consistent, RESTful APIs with proper versioning, documentation, and error handling.

---

## 1. RESTful Conventions

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | /users | List all | 200 + array |
| GET | /users/:id | Get one | 200 / 404 |
| POST | /users | Create | 201 + created |
| PUT | /users/:id | Replace | 200 / 404 |
| PATCH | /users/:id | Update | 200 / 404 |
| DELETE | /users/:id | Delete | 204 / 404 |

### Nested Resources
```
GET    /users/:userId/orders          # User's orders
POST   /users/:userId/orders          # Create order for user
GET    /users/:userId/orders/:orderId # Specific order
```

---

## 2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Resources | Plural nouns | `/users`, `/orders` |
| Actions | Verbs (rare) | `/auth/login`, `/reports/generate` |
| Query params | snake_case | `?page_size=20` |
| Request/Response | camelCase | `{ "firstName": "John" }` |

---

## 3. Versioning Strategies

| Strategy | Example | When to Use |
|----------|---------|-------------|
| URL Path | `/v1/users` | Most common, clear |
| Header | `Accept: application/vnd.api+json;version=1` | Clean URLs |
| Query | `/users?version=1` | Simple but messy |

**Recommended:** URL path (`/api/v1/...`)

---

## 4. Response Format

### Success
```json
{
  "data": { "id": "123", "name": "John" },
  "meta": { "timestamp": "2025-01-01T00:00:00Z" }
}
```

### List with Pagination
```json
{
  "data": [{ "id": "1" }, { "id": "2" }],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": { "email": "Invalid format" }
  }
}
```

---

## 5. Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | No/invalid auth |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource missing |
| 409 | Conflict | Duplicate/state conflict |
| 422 | Unprocessable | Validation failed |
| 429 | Too Many | Rate limited |
| 500 | Server Error | Unexpected error |

---

## 6. Pagination Patterns

### Offset-based (Simple)
```
GET /users?page=2&page_size=20
```

### Cursor-based (Scalable)
```
GET /users?cursor=eyJpZCI6MTAwfQ&limit=20
```

| Pattern | Pros | Cons |
|---------|------|------|
| Offset | Simple, jump to page | Slow on large datasets |
| Cursor | Consistent, fast | No page jumping |

---

## 7. Filtering & Sorting

```
# Filter
GET /users?status=active&role=admin

# Sort
GET /users?sort=created_at:desc,name:asc

# Search
GET /users?q=john

# Combined
GET /users?status=active&sort=name:asc&page=1&page_size=20
```

---

## 8. API Documentation (OpenAPI)

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
```

---

## 9. API Design Checklist

- [ ] RESTful resource naming
- [ ] Consistent response format
- [ ] Proper status codes
- [ ] Pagination for lists
- [ ] Error responses with codes
- [ ] Versioning strategy
- [ ] OpenAPI documentation
- [ ] Rate limiting headers

---

## Best Practices

### Do's
- Use plural nouns for resources
- Return created/updated resource
- Include pagination metadata
- Document with OpenAPI
- Version from day one

### Don'ts
- Use verbs in resource names
- Return different formats per endpoint
- Expose internal IDs/structures
- Ignore backward compatibility
- Skip error code standards

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
