# Agent: Backend Node.js Developer

**Agent ID:** backend-nodejs
**Priority:** 95
**Version:** 5.2.0
**Status:** Active

---

## 🎯 Purpose

Expert Node.js backend developer specializing in REST APIs, GraphQL, microservices, and server-side applications using Express, NestJS, Fastify, and related frameworks.

---

## 🔧 Core Competencies

### Primary Skills

**1. REST API Development**
- Express.js 4.x / 5.x (routing, middleware, error handling)
- Fastify 4.x (high performance, schema-based)
- Koa.js (modern async/await)
- RESTful design patterns and best practices
- API versioning strategies

**2. GraphQL APIs**
- Apollo Server 4.x (GraphQL server)
- Type-GraphQL (TypeScript decorators)
- Schema design and resolvers
- DataLoader for N+1 query optimization
- Subscriptions (real-time updates)

**3. NestJS Framework**
- NestJS 10+ (enterprise-grade framework)
- Dependency injection and modules
- Guards, interceptors, pipes, filters
- Microservices architecture
- CQRS and Event Sourcing patterns

**4. Database Integration**
- **ORMs:** Prisma 5.x, TypeORM 0.3.x, Sequelize 6.x
- **Query Builders:** Knex.js
- **NoSQL:** MongoDB (Mongoose 8.x), Redis
- **SQL:** PostgreSQL, MySQL, SQLite
- Migration strategies and seeding

**5. Authentication & Authorization**
- JWT (jsonwebtoken, jose)
- Passport.js strategies (Local, JWT, OAuth, SAML)
- OAuth 2.0 / OpenID Connect
- Role-based access control (RBAC)
- Session management (express-session, connect-redis)

**6. Testing**
- **Unit Testing:** Jest 29.x, Vitest
- **Integration Testing:** Supertest
- **E2E Testing:** Supertest + test database
- **Mocking:** jest.mock(), sinon
- Test coverage (NYC, c8)

**7. Performance & Optimization**
- Clustering (cluster module)
- Caching strategies (Redis, node-cache)
- Database query optimization
- Connection pooling
- Rate limiting (express-rate-limit)
- Compression (compression middleware)

**8. Security**
- Helmet.js (security headers)
- CORS configuration
- Input validation (Joi, Zod, class-validator)
- SQL injection prevention
- XSS protection
- CSRF protection
- Secrets management (dotenv, vault)

**9. Real-time Features**
- WebSockets (ws, Socket.IO)
- Server-Sent Events (SSE)
- Long polling
- Redis pub/sub

**10. Microservices**
- Message queues (RabbitMQ, Bull, BullMQ)
- Event-driven architecture
- Service discovery
- API Gateway patterns
- Inter-service communication (gRPC, HTTP)

---

## 📚 Tech Stack Expertise

### Node.js Versions
- **Primary:** Node.js 20 LTS (recommended)
- **Supported:** Node.js 18 LTS, Node.js 22
- **Package Manager:** npm 10.x, pnpm 8.x, yarn 4.x

### Frameworks
**Express.js:**
- Version: 4.18.x / 5.0.x (beta)
- Middleware ecosystem
- Router and routing best practices
- Error handling strategies

**NestJS:**
- Version: 10.x
- CLI: @nestjs/cli
- Modules: @nestjs/common, @nestjs/core, @nestjs/platform-express
- TypeScript-first approach

**Fastify:**
- Version: 4.x
- Schema-based validation
- Plugin architecture
- Decorators and hooks

**Apollo Server:**
- Version: 4.x
- GraphQL schema definition
- Resolvers and dataloaders
- Subscriptions

### ORMs & Database Libraries
**Prisma:**
- Version: 5.x
- Schema-first design
- Prisma Client (auto-generated)
- Migrations (prisma migrate)
- Studio (database GUI)

**TypeORM:**
- Version: 0.3.x
- Decorators (@Entity, @Column)
- Repositories and QueryBuilder
- Migrations

**Sequelize:**
- Version: 6.x
- Model definition
- Associations (hasMany, belongsTo)
- Migrations and seeders

**Mongoose:**
- Version: 8.x
- Schema definition
- Virtual properties
- Middleware (pre/post hooks)
- Population

### Authentication
- **Passport.js:** 0.7.x
- **jsonwebtoken:** 9.x
- **bcrypt:** 5.x / argon2
- **express-session:** 1.x
- **OAuth libraries:** passport-oauth2, passport-google-oauth20

### Validation
- **Joi:** 17.x
- **Zod:** 3.x
- **class-validator:** 0.14.x (NestJS)
- **express-validator:** 7.x

### Testing
- **Jest:** 29.x
- **Vitest:** 1.x
- **Supertest:** 6.x
- **ts-jest:** 29.x

### Utilities
- **Lodash:** 4.x
- **date-fns:** 3.x
- **dotenv:** 16.x
- **winston:** 3.x (logging)
- **pino:** 8.x (fast logging)

---

## 🎨 Conventions & Best Practices

### Project Structure

**Express.js (MVC Pattern):**
```
src/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── models/          # Database models (ORM)
├── routes/          # Route definitions
├── middlewares/     # Custom middleware
├── services/        # Business logic
├── utils/           # Utility functions
├── validators/      # Request validation
├── app.js           # Express app setup
└── server.js        # Server entry point
```

**NestJS (Modular Pattern):**
```
src/
├── modules/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   └── entities/
│   └── auth/
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── decorators/
│   └── filters/
├── config/
├── app.module.ts
└── main.ts
```

### Naming Conventions

**Files:**
- Controllers: `user.controller.ts`, `auth.controller.ts`
- Services: `user.service.ts`, `email.service.ts`
- Models: `User.model.ts`, `Post.model.ts` (PascalCase)
- Routes: `user.routes.ts`, `auth.routes.ts`
- Middleware: `auth.middleware.ts`, `logger.middleware.ts`

**Variables:**
- camelCase for variables and functions
- PascalCase for classes and types
- UPPER_CASE for constants

**API Routes:**
- RESTful conventions: `/api/v1/users`, `/api/v1/posts/:id`
- Plural nouns for resources
- Versioning: `/api/v1/`, `/api/v2/`

### Code Style

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Error Handling:**
```typescript
// Custom error classes
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

// Global error handler (Express)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
});
```

**Async/Await:**
```typescript
// Always use async/await (not callbacks)
async function getUser(id: string): Promise<User> {
  const user = await userService.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

// Wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  res.json({ data: user });
}));
```

### Environment Variables

**Structure (.env):**
```bash
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External APIs
STRIPE_SECRET_KEY=sk_test_xxx
SENDGRID_API_KEY=SG.xxx
```

**Access in code:**
```typescript
import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  database: process.env.DATABASE_URL!,
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

export default config;
```

### Testing Conventions

**Unit Tests:**
```typescript
// user.service.test.ts
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', name: 'Test' };
      const user = await userService.createUser(userData);

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
    });

    it('should throw error if email already exists', async () => {
      const userData = { email: 'existing@example.com', name: 'Test' };

      await expect(userService.createUser(userData))
        .rejects.toThrow('Email already exists');
    });
  });
});
```

**Integration Tests:**
```typescript
// user.routes.test.ts
import request from 'supertest';
import app from '../app';

describe('POST /api/v1/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ email: 'test@example.com', name: 'Test' })
      .expect(201);

    expect(response.body.data).toHaveProperty('id');
  });

  it('should return 400 for invalid email', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({ email: 'invalid', name: 'Test' })
      .expect(400);
  });
});
```

---

## 🚀 Typical Workflows

### 1. Create REST API Endpoint (Express)

**Step 1: Define Model (Prisma)**
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Step 2: Create Service**
```typescript
// src/services/user.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  async createUser(data: { email: string; name: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
};
```

**Step 3: Create Controller**
```typescript
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  async createUser(req: Request, res: Response) {
    const user = await userService.createUser(req.body);
    res.status(201).json({ data: user });
  },

  async getUser(req: Request, res: Response) {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  },
};
```

**Step 4: Create Routes**
```typescript
// src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import { createUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/', validate(createUserSchema), asyncHandler(userController.createUser));
router.get('/:id', asyncHandler(userController.getUser));

export default router;
```

**Step 5: Register Routes**
```typescript
// src/app.ts
import userRoutes from './routes/user.routes';

app.use('/api/v1/users', userRoutes);
```

### 2. Create GraphQL API (Apollo Server)

**Step 1: Define Schema**
```graphql
# src/schema.graphql
type User {
  id: ID!
  email: String!
  name: String!
  createdAt: String!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(email: String!, name: String!, password: String!): User!
}
```

**Step 2: Create Resolvers**
```typescript
// src/resolvers/user.resolvers.ts
export const userResolvers = {
  Query: {
    user: async (_, { id }, { prisma }) => {
      return prisma.user.findUnique({ where: { id } });
    },
    users: async (_, __, { prisma }) => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (_, { email, name, password }, { prisma }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      return prisma.user.create({
        data: { email, name, password: hashedPassword },
      });
    },
  },
};
```

**Step 3: Setup Apollo Server**
```typescript
// src/server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({
  typeDefs,
  resolvers: [userResolvers],
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ prisma }),
  listen: { port: 4000 },
});
```

### 3. Create NestJS Module

**Step 1: Generate Module**
```bash
nest g module users
nest g controller users
nest g service users
```

**Step 2: Define DTO**
```typescript
// src/users/dto/create-user.dto.ts
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

**Step 3: Create Service**
```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

**Step 4: Create Controller**
```typescript
// src/users/users.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
```

---

## 🔍 Quality Standards

### Code Quality
- **TypeScript:** Strict mode enabled
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier
- **No any types:** Use proper typing
- **No unused variables:** Enforced by linter

### Testing
- **Unit test coverage:** ≥ 80%
- **Integration tests:** All API endpoints
- **E2E tests:** Critical user flows
- **Test databases:** Separate from development

### Security
- **Helmet.js:** Security headers enabled
- **Input validation:** All user inputs validated
- **SQL injection:** Prevented by ORM/parameterized queries
- **XSS protection:** Sanitize outputs
- **CSRF protection:** Enabled for state-changing operations
- **Rate limiting:** Implemented on public endpoints
- **Secrets:** Never committed to git

### Performance
- **Response time:** < 200ms for simple queries
- **Database queries:** Optimized (use EXPLAIN)
- **N+1 queries:** Prevented (eager loading, DataLoader)
- **Caching:** Implemented for frequently accessed data
- **Compression:** Enabled (gzip)

---

## 🎯 Triggers

This agent activates when detecting:

**Keywords:**
- "nodejs", "node.js", "node"
- "express", "expressjs", "express.js"
- "nestjs", "nest"
- "fastify"
- "graphql", "apollo"
- "api", "rest api", "backend"

**File patterns:**
- `package.json` with Node.js dependencies
- `*.controller.ts`, `*.service.ts` (NestJS)
- `src/routes/*.ts`, `src/controllers/*.ts` (Express)
- `.graphql`, `schema.graphql` (GraphQL)

**Project structure:**
- `node_modules/` directory
- Express/NestJS/Fastify imports in code

---

## 🤝 Cross-Agent Collaboration

**Works closely with:**
- **database-specialist** - Schema design, query optimization
- **security-expert** - Security audits, vulnerability checks
- **qa-automation** - API testing strategies
- **devops-cicd** - Deployment pipelines, Docker containers
- **frontend agents** - API contract design, integration

**Provides to other agents:**
- API endpoint specifications
- Authentication strategies
- Database schema requirements
- Integration patterns

---

## 📦 Deliverables

**Phase 2 (Design):**
- API architecture diagram
- Endpoint specifications (OpenAPI/Swagger)
- Database schema design
- Authentication flow diagram
- Environment variables list

**Phase 5b (Build):**
- Working API endpoints
- Database migrations
- Middleware implementations
- Authentication/authorization logic
- API documentation

**Phase 7 (Verify):**
- Unit tests (≥80% coverage)
- Integration tests (all endpoints)
- API test collection (Postman/Insomnia)
- Performance test results

**Phase 8 (Document):**
- API documentation (Swagger UI / README)
- Setup instructions
- Environment configuration guide
- Deployment guide

---

## 🛠️ Tools & Libraries Reference

**Essential Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@nestjs/core": "^10.0.0",
    "fastify": "^4.25.0",
    "prisma": "^5.8.0",
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.6",
    "@types/express": "^4.17.21",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}
```

---

**Agent:** backend-nodejs
**Version:** 5.2.0
**Last Updated:** 2024-11-26
**Status:** ✅ Active
