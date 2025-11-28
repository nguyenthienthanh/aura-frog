# Command: docker:create

**Command:** `docker:create [options]`
**Agent:** devops-cicd
**Version:** 5.2.0

---

## 🎯 Purpose

Generate optimized Dockerfile and docker-compose.yml for your project.

---

## 📋 Usage

```bash
# Generate Dockerfile
docker:create

# Include docker-compose
docker:create --compose

# Multi-stage build
docker:create --multi-stage
```

---

## 🔧 Generated Files

### Dockerfile
- Multi-stage build (builder + production)
- Minimal base image (Alpine/Distroless)
- Non-root user
- Health check
- .dockerignore

### docker-compose.yml
- App service
- Database service (if needed)
- Redis service (if needed)
- Volume mounts
- Environment variables

---

## 📊 Example Output

```dockerfile
# Dockerfile (Node.js)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
HEALTHCHECK CMD node healthcheck.js
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

**Command:** docker:create
**Version:** 5.2.0
