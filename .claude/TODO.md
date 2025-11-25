# 📋 CCPM TODO List - Missing Commands, Workflows & Agents

**Version:** 4.5.0  
**Date:** 2025-11-25  
**Status:** Pending Implementation

---

## 🎯 Overview

This document lists all commands, workflows, and agents that are **planned but not yet implemented** in CCPM v4.5.0. These are advanced features for future expansion.

---

## ✅ Currently Implemented (45 commands, 14 agents)

### Commands (25 files)
- ✅ Workflow commands (15): start, status, approve, reject, handoff, resume, tokens, progress, metrics, modify, phase-2 to phase-9
- ✅ Testing commands (4): test:unit, test:e2e, test:coverage, test:document
- ✅ Bug fixing commands (3): bugfix, bugfix:quick, bugfix:hotfix
- ✅ Planning commands (3): planning, planning:list, planning:refine
- ✅ Other commands (10): document, execute, refactor, review:fix, agent:list, agent-activate, agent-deactivate, agent-info, help, setup-integrations, project:init, project:detect, project:list, project:switch, skill-create

### Agents (14 files)
- ✅ Frontend: mobile-react-native, web-vuejs, web-reactjs, web-nextjs, ui-designer
- ✅ Backend: backend-laravel
- ✅ Operations: jira-operations, confluence-operations, slack-operations, pm-operations-orchestrator
- ✅ QA: qa-automation
- ✅ Project: project-detector, project-config-loader, project-context-manager

---

## 🚀 TODO: Performance & Optimization Commands

### 1. perf:analyze
**File:** `.claude/commands/perf-analyze.md`  
**Description:** Analyze performance of a file or component  
**Priority:** High ⭐⭐⭐

**Usage:**
```bash
perf:analyze src/components/Dashboard.tsx
perf:analyze [file/component]
```

**What it does:**
- Analyze render performance
- Check for unnecessary re-renders
- Identify memory leaks
- Profile component lifecycle
- Suggest optimizations

---

### 2. perf:optimize
**File:** `.claude/commands/perf-optimize.md`  
**Description:** Auto-optimize bottlenecks  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
perf:optimize
```

**What it does:**
- Run performance analysis
- Identify bottlenecks
- Apply optimizations:
  - Add React.memo where needed
  - Optimize re-renders
  - Add useMemo/useCallback
  - Optimize images
  - Code splitting suggestions

---

### 3. perf:lighthouse
**File:** `.claude/commands/perf-lighthouse.md`  
**Description:** Run Lighthouse audit  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
perf:lighthouse
perf:lighthouse --mobile
perf:lighthouse --desktop
```

**What it does:**
- Run Lighthouse CI
- Generate performance report
- Check accessibility
- Check best practices
- SEO audit

---

### 4. perf:bundle
**File:** `.claude/commands/perf-bundle.md`  
**Description:** Bundle size analysis  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
perf:bundle
```

**What it does:**
- Analyze bundle size
- Show dependency sizes
- Identify large packages
- Suggest tree-shaking opportunities
- Recommend lighter alternatives

---

## 🔒 TODO: Security Commands

### 5. security:audit
**File:** `.claude/commands/security-audit.md`  
**Description:** Run full security audit  
**Priority:** High ⭐⭐⭐

**Usage:**
```bash
security:audit
```

**What it does:**
- OWASP Top 10 checks
- Dependency vulnerability scan
- Code security scan
- Auth/Authorization review
- Generate security report

---

### 6. security:deps
**File:** `.claude/commands/security-deps.md`  
**Description:** Check dependency vulnerabilities  
**Priority:** High ⭐⭐⭐

**Usage:**
```bash
security:deps
security:deps --fix
```

**What it does:**
- Run `npm audit` or `yarn audit`
- Check for known vulnerabilities
- Show severity levels
- Suggest fixes
- Auto-fix if possible

---

### 7. security:scan
**File:** `.claude/commands/security-scan.md`  
**Description:** Scan file for security issues  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
security:scan [file]
security:scan src/api/authApi.ts
```

**What it does:**
- Scan for SQL injection
- Check XSS vulnerabilities
- Detect hardcoded secrets
- Review auth logic
- Check CORS configuration

---

## 🗄️ TODO: Database Commands

### 8. db:design
**File:** `.claude/commands/db-design.md`  
**Description:** Design database schema  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
db:design
db:design "User authentication system"
```

**What it does:**
- Design ERD
- Define tables and relationships
- Choose data types
- Add indexes
- Generate schema SQL

---

### 9. db:migrate:create
**File:** `.claude/commands/db-migrate-create.md`  
**Description:** Create migration file  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
db:migrate:create add_users_table
db:migrate:create <name>
```

**What it does:**
- Generate migration file
- Write up/down migrations
- Add indexes
- Handle foreign keys
- Test migration

---

### 10. db:optimize
**File:** `.claude/commands/db-optimize.md`  
**Description:** Suggest query optimizations  
**Priority:** Low ⭐

**Usage:**
```bash
db:optimize
db:optimize --query "SELECT * FROM users WHERE..."
```

**What it does:**
- Analyze slow queries
- Suggest indexes
- Optimize N+1 queries
- Review query patterns
- Suggest caching strategies

---

### 11. db:seed
**File:** `.claude/commands/db-seed.md`  
**Description:** Generate seed data  
**Priority:** Low ⭐

**Usage:**
```bash
db:seed
db:seed users 100
```

**What it does:**
- Generate realistic test data
- Create seed files
- Handle relationships
- Respect constraints
- Generate factories

---

## 🌐 TODO: API Commands

### 12. api:design
**File:** `.claude/commands/api-design.md`  
**Description:** Design API endpoints  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
api:design "User management API"
```

**What it does:**
- Design REST endpoints
- Define request/response schemas
- Choose HTTP methods
- Plan error handling
- Design authentication

---

### 13. api:test
**File:** `.claude/commands/api-test.md`  
**Description:** Generate API tests  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
api:test src/api/userApi.ts
```

**What it does:**
- Generate test cases for endpoints
- Test request validation
- Test response formats
- Test error cases
- Test authentication

---

### 14. api:document
**File:** `.claude/commands/api-document.md`  
**Description:** Generate OpenAPI documentation  
**Priority:** Low ⭐

**Usage:**
```bash
api:document src/api/
```

**What it does:**
- Generate OpenAPI/Swagger spec
- Document all endpoints
- Include schemas
- Add examples
- Generate Postman collection

---

### 15. api:mock
**File:** `.claude/commands/api-mock.md`  
**Description:** Create mock API server  
**Priority:** Low ⭐

**Usage:**
```bash
api:mock src/api/userApi.ts
```

**What it does:**
- Generate mock server
- Use json-server or MSW
- Create realistic responses
- Support all endpoints
- Enable for testing

---

## 📊 TODO: Code Quality Commands

### 16. quality:check
**File:** `.claude/commands/quality-check.md`  
**Description:** Full quality check  
**Priority:** High ⭐⭐⭐

**Usage:**
```bash
quality:check
quality:check src/features/auth/
```

**What it does:**
- Run linter
- Check TypeScript errors
- Check test coverage
- Analyze complexity
- Check code smells

---

### 17. quality:debt
**File:** `.claude/commands/quality-debt.md`  
**Description:** Technical debt analysis  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
quality:debt
```

**What it does:**
- Identify tech debt
- Find TODOs and FIXMEs
- Check deprecated code
- Find duplicate code
- Prioritize fixes

---

### 18. quality:complexity
**File:** `.claude/commands/quality-complexity.md`  
**Description:** Cyclomatic complexity analysis  
**Priority:** Low ⭐

**Usage:**
```bash
quality:complexity
quality:complexity src/utils/
```

**What it does:**
- Calculate complexity scores
- Find complex functions
- Suggest simplifications
- Generate complexity report

---

### 19. quality:dependencies
**File:** `.claude/commands/quality-dependencies.md`  
**Description:** Dependency health check  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
quality:dependencies
```

**What it does:**
- Check outdated packages
- Find unused dependencies
- Check license compatibility
- Analyze dependency tree
- Suggest updates

---

## 📈 TODO: Monitoring & Logging Commands

### 20. monitor:setup
**File:** `.claude/commands/monitor-setup.md`  
**Description:** Setup monitoring  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
monitor:setup
monitor:setup --sentry
monitor:setup --datadog
```

**What it does:**
- Install monitoring tools
- Configure error tracking
- Setup performance monitoring
- Add logging
- Configure alerts

---

### 21. monitor:errors
**File:** `.claude/commands/monitor-errors.md`  
**Description:** Error tracking setup  
**Priority:** Medium ⭐⭐

**Usage:**
```bash
monitor:errors
```

**What it does:**
- Setup Sentry/Bugsnag
- Add error boundaries
- Configure error reporting
- Add breadcrumbs
- Test error tracking

---

### 22. monitor:performance
**File:** `.claude/commands/monitor-performance.md`  
**Description:** Performance monitoring  
**Priority:** Low ⭐

**Usage:**
```bash
monitor:performance
```

**What it does:**
- Setup performance monitoring
- Add custom metrics
- Track core web vitals
- Configure dashboards
- Setup alerts

---

### 23. logs:analyze
**File:** `.claude/commands/logs-analyze.md`  
**Description:** Log analysis  
**Priority:** Low ⭐

**Usage:**
```bash
logs:analyze
logs:analyze --errors
logs:analyze --performance
```

**What it does:**
- Analyze application logs
- Find error patterns
- Identify performance issues
- Generate insights
- Suggest improvements

---

## 🔄 TODO: Specialized Workflows

### 24. Feature Flag Workflow
**File:** `.claude/workflows/feature-flag.yaml`  
**Priority:** Medium ⭐⭐

**Phases:**
- Design feature flag strategy
- Implement flag infrastructure
- Add flag controls
- Test rollout scenarios
- Document flag usage

---

### 25. Database Migration Workflow
**File:** `.claude/workflows/db-migration.yaml`  
**Priority:** Medium ⭐⭐

**Phases:**
- Schema design review
- Migration script creation
- Rollback strategy
- Data migration plan
- Testing (up & down)
- Production checklist

---

### 26. Security Audit Workflow
**File:** `.claude/workflows/security-audit.yaml`  
**Priority:** High ⭐⭐⭐

**Phases:**
- OWASP Top 10 check
- Dependency audit
- Code security scan
- Auth/Authorization review
- Penetration test plan
- Remediation report

---

### 27. Performance Optimization Workflow
**File:** `.claude/workflows/performance.yaml`  
**Priority:** Medium ⭐⭐

**Phases:**
- Performance baseline
- Bottleneck identification
- Optimization plan
- Implementation
- Benchmark comparison
- Monitoring setup

---

## 👥 TODO: Additional Agents

### 28. security-expert
**File:** `.claude/agents/security-expert.md`  
**Priority:** High ⭐⭐⭐

**Description:** Security audit, vulnerability scanning, best practices  
**Triggers:** ["security", "vulnerability", "owasp", "auth", "encryption"]  
**Capabilities:**
- OWASP Top 10 checks
- Dependency vulnerability scanning
- Authentication/Authorization review
- Data encryption strategies

---

### 29. database-specialist
**File:** `.claude/agents/database-specialist.md`  
**Priority:** Medium ⭐⭐

**Description:** SQL/NoSQL database design & optimization  
**Triggers:** ["database", "sql", "postgres", "mysql", "mongodb"]  
**Capabilities:**
- Schema design
- Query optimization
- Migration strategies
- Indexing & performance

---

### 30. data-engineer
**File:** `.claude/agents/data-engineer.md`  
**Priority:** Low ⭐

**Description:** ETL, data pipelines, data modeling  
**Triggers:** ["etl", "pipeline", "data", "analytics"]  
**Capabilities:**
- Design data pipelines
- ETL processes
- Data modeling
- Data quality checks

---

### 31. backend-nodejs
**File:** `.claude/agents/backend-nodejs.md`  
**Priority:** High ⭐⭐⭐

**Description:** Node.js + Express/Fastify/NestJS expert  
**Triggers:** ["nodejs", "express", "nestjs", "fastify"]  
**Capabilities:**
- REST API development
- GraphQL APIs
- Microservices
- Performance optimization

---

### 32. backend-python
**File:** `.claude/agents/backend-python.md`  
**Priority:** Medium ⭐⭐

**Description:** Python + Django/FastAPI/Flask expert  
**Triggers:** ["python", "django", "fastapi", "flask"]  
**Capabilities:**
- API development
- Django REST framework
- FastAPI design
- Python best practices

---

### 33. backend-go
**File:** `.claude/agents/backend-go.md`  
**Priority:** Medium ⭐⭐

**Description:** Go + Gin/Fiber/Echo expert  
**Triggers:** ["golang", "go", "gin", "fiber"]  
**Capabilities:**
- High-performance APIs
- Microservices in Go
- Concurrency patterns
- Go best practices

---

## 📊 Summary

### By Priority

**High Priority (Must Have):** 5 items
- perf:analyze
- security:audit
- security:deps
- quality:check
- security-expert agent
- backend-nodejs agent

**Medium Priority (Should Have):** 14 items
- perf:optimize, perf:lighthouse, perf:bundle
- security:scan
- db:design, db:migrate:create, api:design, api:test
- quality:debt, quality:dependencies
- monitor:setup, monitor:errors
- All 4 specialized workflows
- database-specialist, backend-python, backend-go agents

**Low Priority (Nice to Have):** 9 items
- db:optimize, db:seed
- api:document, api:mock
- quality:complexity
- monitor:performance, logs:analyze
- data-engineer agent

### By Category

| Category | Commands | Workflows | Agents | Total |
|----------|----------|-----------|--------|-------|
| Performance | 4 | 1 | 0 | 5 |
| Security | 3 | 1 | 1 | 5 |
| Database | 4 | 1 | 1 | 6 |
| API | 4 | 0 | 0 | 4 |
| Quality | 4 | 0 | 0 | 4 |
| Monitoring | 4 | 0 | 0 | 4 |
| Backend | 0 | 0 | 3 | 3 |
| Data | 0 | 0 | 1 | 1 |
| **TOTAL** | **23** | **4** | **6** | **33** |

---

## 🎯 Implementation Plan

### Phase 1: Security & Quality (Week 1)
- [ ] security:audit
- [ ] security:deps
- [ ] security:scan
- [ ] security-expert agent
- [ ] security-audit.yaml workflow
- [ ] quality:check

### Phase 2: Performance (Week 2)
- [ ] perf:analyze
- [ ] perf:optimize
- [ ] perf:lighthouse
- [ ] perf:bundle
- [ ] performance.yaml workflow

### Phase 3: Backend & Database (Week 3)
- [ ] backend-nodejs agent
- [ ] database-specialist agent
- [ ] db:design
- [ ] db:migrate:create
- [ ] db-migration.yaml workflow

### Phase 4: API & Monitoring (Week 4)
- [ ] api:design
- [ ] api:test
- [ ] monitor:setup
- [ ] monitor:errors
- [ ] feature-flag.yaml workflow

### Phase 5: Additional Features (Week 5+)
- [ ] All remaining low-priority items
- [ ] backend-python, backend-go agents
- [ ] data-engineer agent
- [ ] Remaining commands

---

## 📝 Notes

**Implementation Guidelines:**
1. Follow existing command structure (see `.claude/commands/bugfix.md` as template)
2. Each command should have clear usage examples
3. Workflows should follow 9-phase structure (or grouped for lightweight)
4. Agents need: description, priority, triggers, capabilities
5. All must be added to `.claude/plugin.json`

**Testing:**
- Each command should be tested with sample inputs
- Workflows should have example use cases
- Agents should have trigger test cases

**Documentation:**
- Update `.claude/INDEX.md` when implemented
- Update `.claude/README.md` with new command counts
- Add examples to `.claude/docs/USAGE_GUIDE.md`

---

**Status:** 🟡 Pending Implementation  
**Last Updated:** 2025-11-25  
**Next Review:** When starting implementation

