---
name: nodejs-expert
description: "Node.js backend expert. PROACTIVELY use when working with Express, NestJS, Fastify, Node.js APIs. Triggers: nodejs, express, nestjs, fastify, api route, backend"
autoInvoke: false
priority: high
triggers:
  - "nodejs"
  - "node.js"
  - "express"
  - "nestjs"
  - "fastify"
  - "api route"
  - "backend node"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Node.js Expert Skill

Node.js backend patterns: Express, NestJS, Fastify, API development.

---

## 1. Project Structure

**Express (MVC):** `src/{config,controllers,models,routes,middlewares,services,validators}` + `app.ts` + `server.ts`

**NestJS (Modular):** `src/modules/{feature}/{controller,service,module,dto,entities}` + `common/{guards,interceptors,filters}`

---

## 2. Express Patterns

**Async handler wrapper** -- catches rejections:
```typescript
const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

**Error hierarchy:** `AppError` base (message, statusCode, code, isOperational) + `NotFoundError`, `ValidationError`. Global error handler as last middleware.

---

## 3. NestJS Patterns

- **Controllers:** `@Controller('users')` + DTOs with `class-validator` decorators
- **Services:** `@Injectable()` with Prisma/TypeORM, throw `NotFoundException`
- **Pipes:** `ParseUUIDPipe` for param validation

---

## 4. Database (Prisma)

- `include` for eager loading, `select` for field selection
- `$transaction(async (tx) => {...})` for atomic operations
- Cursor pagination: `take`, `skip`, `cursor`, `orderBy`

TypeORM: Repository pattern with `findOne({ relations: ['posts'] })`.

---

## 5. Async Best Practices

- `Promise.all` for parallel (never `forEach` with async)
- `Promise.allSettled` for partial failure tolerance
- `AbortController` for timeouts
- `for...of` for sequential processing

---

## 6. Validation (Zod)

Schema + middleware pattern:
```typescript
const validate = (schema: z.ZodSchema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  req.body = result.data; next();
};
```

---

## 7. Security

`helmet()` + `cors({ origin, credentials })` + `rateLimit({ windowMs, max })` + input sanitization.

---

## 8. Logging

Pino with `redact: ['password', 'token']`. Child loggers with requestId per request.

---

## 9. Testing

Supertest: `request(app).post('/api/users').send(data).expect(201)`. Factory pattern with `@faker-js/faker`.

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  Errors,Custom error classes + asyncHandler wrapper
  Validation,Zod or class-validator DTOs
  Database,Prisma/TypeORM with eager loading
  Async,Promise.all for parallel Never async forEach
  Security,Helmet + CORS + rate limiting
  Logging,Pino structured logging
  Testing,Supertest + factories
  Auth,JWT with Passport or NestJS guards
  Config,dotenv + typed config object
  Routes,RESTful conventions /api/v1/
  Middleware,Error handler last
  Types,Strict TypeScript no any
```

---
