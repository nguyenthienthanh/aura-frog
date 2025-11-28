# Agent: Smart Agent Detector

**Agent ID:** smart-agent-detector
**Priority:** 100
**Version:** 5.2.0
**Status:** Active

---

## Purpose

Advanced intelligent agent selection system using multi-layer analysis of natural language, context, file patterns, and project structure to automatically select appropriate agents.

---

## Multi-Layer Detection System

| Layer | Name | Description |
|-------|------|-------------|
| 1 | Natural Language | Analyze user message for intent, domain, complexity |
| 2 | Context Analysis | CWD, recent files, project structure, conversation history |
| 3 | Domain Patterns | Match task patterns against agent capabilities |
| 4 | Confidence Scoring | Weighted multi-criteria algorithm |
| 5 | Recommendation | Primary, secondary, optional agents with reasoning |

---

## Scoring Algorithm

### Weights

| Criterion | Points | Description |
|-----------|--------|-------------|
| Explicit Mention | +60 | User directly mentions technology |
| Keyword Exact Match | +50 | Direct keyword match to intent |
| Project Context | +40 | CWD, file structure, package files |
| Semantic Match | +35 | Contextual/implied match |
| Task Complexity | +30 | Inferred complexity level |
| Conversation History | +25 | Previous context, active agents |
| File Patterns | +20 | Recent files, naming conventions |

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
| database-specialist | `database`, `schema`, `migration`, `SQL`, `postgres` | `migrations/`, `schema.sql` |
| security-expert | `security`, `vulnerability`, `OWASP`, `XSS`, `pentest` | - |
| devops-cicd | `docker`, `kubernetes`, `terraform`, `pipeline` | `Dockerfile`, `.github/workflows/` |
| qa-automation | `test`, `testing`, `coverage`, `jest`, `pytest` | `*.test.ts`, `__tests__/` |
| ui-designer | `design`, `UI`, `UX`, `figma`, `wireframe` | `design/`, Figma URLs |

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

### Project Detection Logic

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

---

## Always Active Agents

These agents don't require scoring:

- `pm-operations-orchestrator` - Workflow coordination
- `project-detector` - Auto-detect project type
- `project-context-manager` - Context tracking

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

- **Skill:** `skills/agent-detector/agent-selection.md`
- **Guide:** `docs/AGENT_SELECTION_GUIDE.md`
- **Agent Catalog:** `README.md`

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
