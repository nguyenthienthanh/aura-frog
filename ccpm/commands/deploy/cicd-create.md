# Command: cicd:create

**Command:** `cicd:create [platform]`
**Agent:** devops-cicd
**Version:** 5.2.0

---

## 🎯 Purpose

Generate CI/CD pipeline configuration for GitHub Actions, GitLab CI, Azure Pipelines, or CircleCI.

---

## 📋 Usage

```bash
# Auto-detect platform
cicd:create

# Specific platform
cicd:create --platform github
cicd:create --platform gitlab
cicd:create --platform azure
cicd:create --platform circle
```

---

## 🔧 Pipeline Stages

### 1. Lint & Format
- ESLint, Prettier
- Type checking (TypeScript)

### 2. Test
- Unit tests (Jest, Vitest)
- Integration tests
- E2E tests (Playwright, Cypress)

### 3. Security
- Dependency scan (npm audit)
- Secret scanning
- Container scan (Trivy)

### 4. Build
- Build application
- Build Docker image
- Push to registry

### 5. Deploy
- Deploy to staging (auto)
- Deploy to production (manual)
- Health check

---

## 📊 Example Output (GitHub Actions)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
      - uses: aquasecurity/trivy-action@master

  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - run: |
          docker build -t myapp:${{ github.sha }} .
          docker push myapp:${{ github.sha }}
      - run: kubectl apply -f k8s/staging/

  deploy-production:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3
      - run: |
          docker build -t myapp:${{ github.sha }} .
          docker push myapp:${{ github.sha }}
      - run: kubectl apply -f k8s/production/
```

---

**Command:** cicd:create
**Version:** 5.2.0
