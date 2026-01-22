# Agent: Smart Agent Detector

**Agent ID:** smart-agent-detector
**Priority:** 100
**Version:** 1.0.0
**Status:** Active

---

## Purpose

Advanced intelligent agent selection system using multi-layer analysis of natural language, context, file patterns, and project structure to automatically select appropriate agents.

---

## Multi-Layer Detection System

| Layer | Name | Description |
|-------|------|-------------|
| 0 | **Task Content Analysis** | **NEW:** Analyze task itself, not just repo - highest priority |
| 1 | Natural Language | Analyze user message for intent, domain, complexity |
| 2 | Context Analysis | CWD, recent files, project structure, conversation history |
| 3 | Domain Patterns | Match task patterns against agent capabilities |
| 4 | Confidence Scoring | Weighted multi-criteria algorithm |
| 5 | Recommendation | Primary, secondary, optional agents with reasoning |

**Layer 0 Override:** Task content can override repo-based selection. A backend repo may have frontend tasks (templates, PDFs, emails).

---

## Task Content Analysis (Layer 0)

**Analyze the actual task, not just the repo type.** This is the highest priority layer.

### Task Content Triggers

| Category | Example Patterns | Activates | Score |
|----------|------------------|-----------|-------|
| Frontend | html template, blade, twig, email template, pdf styling, css | ui-expert | +50-60 |
| Backend | api endpoint, controller, middleware, queue job, webhook | architect (+ framework skill) | +50-55 |
| Database | migration, schema, query optimization, slow query, n+1 | architect | +55-60 |
| Security | xss, sql injection, csrf, vulnerability, auth bypass | security-expert | +55-60 |
| DevOps | docker, kubernetes, ci-cd, terraform, deployment | devops-cicd | +50-55 |
| Testing | unit test, e2e test, coverage, mock, fixture | qa-automation | +45-55 |
| Design | figma, wireframe, design system, accessibility | ui-expert | +50-60 |

### Frontend Task Patterns (Detailed)

```toon
frontend_tasks[12]{pattern,score,description}:
  html template/blade/twig/jinja/ejs,+55,Server-side template work
  email template,+55,Email HTML/CSS design
  pdf styling/pdf layout,+50,PDF generation with HTML/CSS
  css/scss/tailwind,+55,Stylesheet modifications
  responsive design,+50,Mobile responsiveness
  form layout/ui component,+50,UI element work
  admin panel ui,+50,Dashboard interface
  modal/dialog/toast,+45,UI overlay components
  svg/icon work,+45,Vector graphics
```

### Backend Task Patterns (Detailed)

```toon
backend_tasks[12]{pattern,score,description}:
  api endpoint/route,+55,API implementation
  controller logic,+55,Business logic in controller
  middleware,+50,Request/response middleware
  authentication/authorization,+50,Auth logic (not UI)
  queue job/background,+50,Async processing
  webhook handler,+50,External integrations
  caching/redis,+45,Cache layer work
  file upload/storage,+45,File handling
  email sending,+45,Mail dispatch logic
```

### Cross-Domain Override Examples

```
Backend Repo + Frontend Task:
  "Fix email template styling" → ui-expert PRIMARY, architect SECONDARY

Frontend Repo + Backend Task:
  "Add rate limiting to API" → architect PRIMARY, ui-expert SECONDARY

Any Repo + Database Task:
  "Optimize slow query" → architect PRIMARY, dev agent SECONDARY

Any Repo + Security Task:
  "Fix XSS vulnerability" → security-expert PRIMARY, dev agent SECONDARY
```

**Full patterns:** `skills/agent-detector/task-based-agent-selection.md`

---

## Scoring Algorithm

### Weights

| Criterion | Points | Description |
|-----------|--------|-------------|
| **Task Content Match** | **+50-60** | **Task-based patterns (Layer 0) - HIGHEST PRIORITY** |
| Explicit Mention | +60 | User directly mentions technology |
| Keyword Exact Match | +50 | Direct keyword match to intent |
| Project Context | +40 | CWD, file structure, package files |
| Semantic Match | +35 | Contextual/implied match |
| Task Complexity | +30 | Inferred complexity level |
| Conversation History | +25 | Previous context, active agents |
| File Patterns | +20 | Recent files, naming conventions |

**Task Content Override:** When task content score ≥50 for a domain different from repo, that agent becomes PRIMARY or co-PRIMARY.

### Thresholds

| Role | Score | Description |
|------|-------|-------------|
| Primary Agent | ≥80 | Lead development |
| Secondary Agent | 50-79 | Supporting role |
| Optional Agent | 30-49 | Nice-to-have |
| Not Activated | <30 | Insufficient match |

---

## Intent Detection Patterns

| Intent | Keywords | Primary Agent | Secondary |
|--------|----------|---------------|-----------|
| Implementation | `implement`, `create`, `add`, `build`, `develop` | Dev agent | qa-automation, ui-designer |
| Bug Fix | `fix`, `bug`, `error`, `issue`, `broken`, `debug` | Dev agent | qa-automation |
| Refactoring | `refactor`, `improve`, `optimize`, `clean up` | Dev agent | qa-automation |
| Testing | `test`, `testing`, `QA`, `coverage`, `spec` | qa-automation | Dev agent |
| Design/UI | `design`, `UI`, `UX`, `figma`, `layout`, `styling` | ui-designer | Dev agent |
| Documentation | `document`, `docs`, `README`, `explain` | pm-operations-orchestrator | - |
| Database | `database`, `schema`, `migration`, `query`, `SQL` | database-specialist | Backend agent |
| Security | `security`, `vulnerability`, `audit`, `OWASP` | security-expert | Dev agent |
| Performance | `performance`, `slow`, `optimize`, `lighthouse` | devops-cicd | Dev agent |
| Deployment | `deploy`, `docker`, `kubernetes`, `CI/CD`, `pipeline` | devops-cicd | - |
| Monitoring | `monitor`, `errors`, `logs`, `sentry`, `tracking` | devops-cicd | - |

---

## Technology Detection

### Mobile Frameworks

| Framework | Keywords | Files | Patterns |
|-----------|----------|-------|----------|
| React Native | `react-native`, `expo`, `RN` | `app.json` (expo), `package.json` | `*.phone.tsx`, `*.tablet.tsx` |
| Flutter | `flutter`, `dart`, `bloc`, `riverpod` | `pubspec.yaml` | `*.dart`, `lib/` |

### Web Frameworks

| Framework | Keywords | Files | Patterns |
|-----------|----------|-------|----------|
| Angular | `angular`, `ngrx`, `rxjs`, `signals` | `angular.json` | `*.component.ts`, `*.service.ts` |
| Vue.js | `vue`, `pinia`, `nuxt`, `composition api` | `*.vue` files | `composables/`, `stores/` |
| React | `react`, `hooks`, `context` | `package.json` (react, no next) | `*.jsx`, `*.tsx` |
| Next.js | `next`, `nextjs`, `ssr`, `ssg`, `app router` | `next.config.js` | `app/`, `pages/`, `route.ts` |

### Backend Frameworks

| Framework | Keywords | Files | Patterns |
|-----------|----------|-------|----------|
| Node.js | `nodejs`, `express`, `nestjs`, `fastify` | `package.json` | `*.controller.ts`, `*.module.ts` |
| Python | `python`, `django`, `fastapi`, `flask` | `requirements.txt`, `pyproject.toml` | `views.py`, `models.py` |
| Go | `go`, `golang`, `gin`, `fiber`, `grpc` | `go.mod`, `go.sum` | `*.go`, `handler.go` |
| Laravel | `laravel`, `php`, `eloquent`, `artisan` | `artisan`, `composer.json` | `*Controller.php`, `routes/` |

### Specialized Agents

| Agent | Keywords | Files/Patterns |
|-------|----------|----------------|
| architect | `database`, `schema`, `migration`, `SQL`, `postgres`, `architecture` | `migrations/`, `schema.sql` |
| security-expert | `security`, `vulnerability`, `OWASP`, `XSS`, `pentest` | - |
| devops-cicd | `docker`, `kubernetes`, `terraform`, `pipeline` | `Dockerfile`, `.github/workflows/` |
| qa-automation | `test`, `testing`, `coverage`, `jest`, `pytest` | `*.test.ts`, `__tests__/` |
| ui-expert | `design`, `UI`, `UX`, `figma`, `wireframe`, `frontend` | `design/`, Figma URLs |

---

## QA Agent Conditional Activation

### Activate When

| Condition | Points |
|-----------|--------|
| User explicitly requests testing | +50 (Primary) |
| Implementation intent + test infrastructure exists | +30 (Optional) |
| Bug fix intent + test infrastructure exists | +35 (Optional) |

### Skip When

- No test infrastructure detected (no test framework, config, or directory)
- User explicitly skips testing ("don't worry about tests")
- Documentation-only or deployment-only task

### Test Infrastructure Detection

| Language | Check For |
|----------|-----------|
| JavaScript | `jest.config.js`, `vitest.config.ts`, `cypress.config.js`, `package.json` scripts.test |
| Python | `pytest.ini`, `setup.cfg`, `requirements.txt` (pytest) |
| PHP | `phpunit.xml`, `composer.json` (phpunit/phpunit) |
| Go | `*_test.go` files |
| General | `tests/`, `__tests__/`, `test/`, `spec/` directories |

---

## Context Analysis

### Project Detection (Use First!)

**IMPORTANT:** Always check stored detection before scanning.

```
0. Check detection first (FAST PATH):
   .claude/project-contexts/[project-name]/project-detection.json

   If valid (< 24h, config files unchanged):
   → Use stored: framework, agents, testInfra, filePatterns
   → Skip steps 1-3 below

   Commands:
   - /project:status  → Show project detection
   - /project:refresh → Force re-scan
```

### Project Detection Logic (If Cache Miss)

```
1. Check package.json dependencies:
   - react-native → mobile-react-native (+40)
   - @angular/core → web-angular (+40)
   - vue → web-vuejs (+40)
   - react (no next) → web-reactjs (+40)
   - next → web-nextjs (+40)
   - express/nestjs → backend-nodejs (+40)

2. Check other package files:
   - pubspec.yaml → mobile-flutter (+40)
   - requirements.txt/pyproject.toml → backend-python (+40)
   - go.mod → backend-go (+40)
   - artisan → backend-laravel (+40)

3. Analyze recent files:
   - *.vue → web-vuejs (+20)
   - *.dart → mobile-flutter (+20)
   - *.go → backend-go (+20)
   - *.py → backend-python (+20)
   - *.test.*, *.spec.* → qa-automation (+20)

4. Conversation history:
   - Active agents → boost (+25)
   - Previous tech mentions → boost (+20)
```

---

## Examples

### Example 1: Implicit Mobile
```
User: "Add share button to post screen"

Analysis:
- "screen" → mobile terminology (+35)
- CWD: /mobile-app (+40)
- Recent: PostScreen.phone.tsx (+20)

Result:
✅ mobile-react-native: 95 pts (Primary)
✅ ui-designer: 50 pts (Secondary) - "button" UI
✅ qa-automation: 30 pts (Optional) - if test infra exists
```

### Example 2: Full-Stack Feature
```
User: "Build user profile page with API"

Analysis:
- "page" → frontend (+35)
- "API" → backend (+50)
- CWD: mixed project

Result:
✅ web-reactjs: 55 pts (Primary - Frontend)
✅ backend-nodejs: 55 pts (Primary - Backend)
✅ ui-designer: 45 pts (Secondary)
```

### Example 3: Vague Request
```
User: "Fix the login issue"

Analysis:
- "fix" → bug fix intent
- CWD: /backend-api (Laravel)
- Recent: AuthController.php (+20)

Result:
✅ backend-laravel: 90 pts (Primary)
✅ qa-automation: 35 pts (Optional) - bug validation
❌ ui-designer: skipped - backend context
```

### Example 4: Security Audit
```
User: "Check if authentication is secure"

Analysis:
- "secure" → security intent (+50)
- "authentication" → auth context (+35)

Result:
✅ security-expert: 85 pts (Primary)
✅ backend-nodejs: 45 pts (Secondary)
```

### Example 5: No Test Infrastructure
```
User: "Add new landing page"

Analysis:
- "page" → web (+35)
- CWD: /website
- Test Infrastructure: ❌ None detected

Result:
✅ web-nextjs: 85 pts (Primary)
✅ ui-designer: 50 pts (Secondary)
❌ qa-automation: 0 pts (SKIPPED - no test infra)
```

### Example 6: Explicit Test Skip
```
User: "Add feature, don't worry about tests"

Analysis:
- "feature" → implementation
- User explicitly skips testing

Result:
✅ web-reactjs: 75 pts (Primary)
❌ qa-automation: 0 pts (SKIPPED - user request)
```

### Example 7: Backend Repo, Frontend Task (Task-Based Override)
```
User: "Fix the invoice email template - button styling is broken"

Repo Context: Laravel API backend
Task Content Analysis (Layer 0):
- "email template" → frontend_tasks (+55)
- "styling" → frontend (+40)
- "button" → frontend (+30)
→ Frontend score: 125 pts → OVERRIDE

Result:
✅ web-expert: 125 pts (Primary) - leads template work
✅ backend-laravel: 40 pts (Secondary) - Blade context
```

### Example 8: Any Repo, PDF Generation Task
```
User: "Invoice PDF layout is broken - table splits incorrectly across pages"

Repo Context: Node.js API
Task Content Analysis (Layer 0):
- "PDF" → frontend_tasks (+50)
- "layout" → frontend (+40)
- "table" → frontend (+30)
→ Frontend score: 120 pts → OVERRIDE

Result:
✅ web-expert: 120 pts (Primary) - HTML/CSS for PDF
✅ backend-nodejs: 40 pts (Secondary) - PDF library
```

### Example 9: Frontend Repo, Database Task
```
User: "User list is slow - need to optimize the query"

Repo Context: Next.js frontend
Task Content Analysis (Layer 0):
- "slow" → database (+50)
- "optimize" + "query" → database (+50)
→ Database score: 100 pts → OVERRIDE

Result:
✅ database-specialist: 100 pts (Primary) - query optimization
✅ web-nextjs: 40 pts (Secondary) - API route context
```

### Example 10: Frontend Repo, Backend API Task
```
User: "Add rate limiting to the /api/users endpoint"

Repo Context: Next.js frontend
Task Content Analysis (Layer 0):
- "rate limiting" → backend (+45)
- "api endpoint" → backend (+55)
→ Backend score: 100 pts → OVERRIDE

Result:
✅ backend-nodejs: 100 pts (Primary) - API logic
✅ web-nextjs: 40 pts (Secondary) - Next.js API routes
```

---

## Always Active Agents

These agents don't require scoring:

- `pm-operations-orchestrator` - Workflow coordination
- `project-manager` - Project detection, config loading, and context management

---

## Output Format

```markdown
🧠 **Agent Selection Complete**

**Primary Agents:**
- 🤖 [agent-name] (Score: XX) - [role]
  Reasoning: [why selected]

**Secondary Agents:**
- 🎨 [agent-name] (Score: XX) - [role]

**Optional Agents:**
- ✅ [agent-name] (Score: XX) - [role]

**Confidence:** [High/Medium/Low] (XX%)
```

---

## Fallback Strategies

| Scenario | Action |
|----------|--------|
| No agents ≥30 pts | Ask user for clarification |
| Multiple agents tie | Prefer higher base priority |
| Context unclear | Show top 3 options, let user choose |

---

## Related Documentation

- **Task-Based Selection:** `skills/agent-detector/task-based-agent-selection.md`
- **Project Cache:** `docs/PROJECT_CACHE.md`
- **Skill:** `skills/agent-detector/SKILL.md`
- **Guide:** `docs/AGENT_SELECTION_GUIDE.md`
- **Agent Catalog:** `agents/README.md`
- **Cache Library:** `hooks/lib/af-project-cache.cjs`

---

**Version:** 1.17.0 | **Last Updated:** 2026-01-21
