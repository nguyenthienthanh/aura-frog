---
name: nodejs-expert
description: "Node.js backend expert. PROACTIVELY use when working with Express, NestJS, Fastify, Node.js APIs. Triggers: nodejs, express, nestjs, fastify, api route, backend"
autoInvoke: true
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

Expert-level Node.js backend patterns for Express, NestJS, Fastify, and API development.

---

## Auto-Detection

This skill activates when:
- Working with Node.js backend projects
- Detected `express`, `@nestjs/core`, or `fastify` in package.json
- Building REST/GraphQL APIs
- Working with `*.controller.ts`, `*.service.ts` files

---

## 1. Project Structure

### Express (MVC Pattern)

```
src/
├── config/           # Configuration
├── controllers/      # Route handlers
├── models/          # Database models
├── routes/          # Route definitions
├── middlewares/     # Custom middleware
├── services/        # Business logic
├── utils/           # Utilities
├── validators/      # Request validation
├── app.ts           # Express setup
└── server.ts        # Entry point
```

### NestJS (Modular Pattern)

```
src/
├── modules/
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.module.ts
│       ├── dto/
│       └── entities/
├── common/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
├── app.module.ts
└── main.ts
```

---

## 2. Express Patterns

### Async Error Handler

```typescript
// ✅ GOOD - Wrap async routes
const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (user == null) {
    throw new NotFoundError('User');
  }
  res.json({ data: user });
}));
```

### Custom Error Classes

```typescript
// ✅ GOOD - Typed error hierarchy
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message: string, public details?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

### Global Error Handler

```typescript
// ✅ GOOD - Centralized error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
    });
  }

  logger.error('Unexpected error', { error: err, path: req.path });

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  });
});
```

---

## 3. NestJS Patterns

### Controller with Validation

```typescript
// ✅ GOOD - NestJS controller with DTOs
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }
}
```

### DTO with class-validator

```typescript
// ✅ GOOD - Validated DTO
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Service with Repository

```typescript
// ✅ GOOD - Service pattern
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, name: true },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
```

---

## 4. Database Patterns

### Prisma Best Practices

```typescript
// ✅ GOOD - Prevent N+1 with include
const users = await prisma.user.findMany({
  include: { posts: true, profile: true },
});

// ✅ GOOD - Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});

// ✅ GOOD - Transactions
await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } },
  });
  await tx.account.update({
    where: { id: receiverId },
    data: { balance: { increment: amount } },
  });
});

// ✅ GOOD - Cursor pagination
const users = await prisma.user.findMany({
  take: 20,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' },
});
```

### TypeORM Patterns

```typescript
// ✅ GOOD - Repository pattern
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findWithPosts(id: string): Promise<User | null> {
    return this.findOne({
      where: { id },
      relations: ['posts'],
    });
  }
}
```

---

## 5. Async Best Practices

```typescript
// ✅ GOOD - Parallel operations
async function getDashboard(userId: string) {
  const [user, posts, notifications] = await Promise.all([
    getUser(userId),
    getUserPosts(userId),
    getNotifications(userId),
  ]);
  return { user, posts, notifications };
}

// ✅ GOOD - Handle partial failures
const results = await Promise.allSettled([
  fetchFromAPI1(),
  fetchFromAPI2(),
  fetchFromAPI3(),
]);

const successful = results
  .filter((r): r is PromiseFulfilledResult<Data> => r.status === 'fulfilled')
  .map((r) => r.value);

// ✅ GOOD - AbortController for timeouts
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// ❌ BAD - async in forEach (fire and forget!)
items.forEach(async (item) => await process(item));

// ✅ GOOD - Use Promise.all or for...of
await Promise.all(items.map((item) => process(item)));
// Or sequential:
for (const item of items) {
  await process(item);
}
```

---

## 6. Validation with Zod

```typescript
import { z } from 'zod';

// ✅ GOOD - Schema definition
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

// ✅ GOOD - Express middleware
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
};

router.post('/users', validate(createUserSchema), createUser);
```

---

## 7. Security Patterns

```typescript
// ✅ GOOD - Helmet for security headers
import helmet from 'helmet';
app.use(helmet());

// ✅ GOOD - Rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
});
app.use('/api/', apiLimiter);

// ✅ GOOD - CORS configuration
import cors from 'cors';
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));

// ✅ GOOD - Input sanitization
import DOMPurify from 'isomorphic-dompurify';
const sanitized = DOMPurify.sanitize(userInput);
```

---

## 8. Logging Best Practices

```typescript
import pino from 'pino';

// ✅ GOOD - Structured logging
const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['password', 'token', 'authorization'],
});

// ✅ GOOD - Request context
app.use((req, res, next) => {
  req.log = logger.child({
    requestId: req.headers['x-request-id'] ?? crypto.randomUUID(),
    path: req.path,
    method: req.method,
  });
  next();
});

// ✅ GOOD - Log levels
logger.debug('Detailed debug info');
logger.info('User created', { userId: user.id });
logger.warn('Deprecated endpoint', { endpoint: req.path });
logger.error('Operation failed', { error, userId });
```

---

## 9. Testing Patterns

```typescript
import request from 'supertest';

// ✅ GOOD - Integration tests
describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test' })
      .expect(201);

    expect(response.body.data).toMatchObject({
      email: 'test@example.com',
      name: 'Test',
    });
  });

  it('returns 400 for invalid email', async () => {
    await request(app)
      .post('/api/users')
      .send({ email: 'invalid', name: 'Test' })
      .expect(400);
  });
});

// ✅ GOOD - Factory pattern
import { faker } from '@faker-js/faker';

const createUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  createdAt: new Date(),
  ...overrides,
});
```

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

**Version:** 1.3.0
