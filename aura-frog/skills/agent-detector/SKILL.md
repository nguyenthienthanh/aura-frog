---
name: agent-detector
description: "CRITICAL: MUST run for EVERY message. Detects which specialized agent should handle the request using multi-layer scoring. Always runs FIRST before any other skill."
autoInvoke: true
priority: highest
triggers:
  - "every message"
  - "always first"
allowed-tools: Read, Grep, Glob
---

# Aura Frog Agent Detector

**Priority:** HIGHEST - Runs FIRST for every message
**Version:** 1.1.0

---

## When to Use

**ALWAYS** - Every user message, no exceptions.

---

## Multi-Layer Detection System

### Layer 1: Explicit Technology Detection
Check if user **directly mentions** a technology:

| Technology | Keywords | Agent | Score |
|------------|----------|-------|-------|
| React Native | `react-native`, `expo`, `RN` | mobile-react-native | +60 |
| Flutter | `flutter`, `dart`, `bloc` | mobile-flutter | +60 |
| Angular | `angular`, `ngrx`, `rxjs` | web-angular | +60 |
| Vue.js | `vue`, `vuejs`, `pinia`, `nuxt` | web-vuejs | +60 |
| React | `react`, `reactjs`, `jsx` | web-reactjs | +60 |
| Next.js | `next`, `nextjs`, `ssr`, `ssg` | web-nextjs | +60 |
| Node.js | `nodejs`, `express`, `nestjs`, `fastify` | backend-nodejs | +60 |
| Python | `python`, `django`, `fastapi`, `flask` | backend-python | +60 |
| Go | `go`, `golang`, `gin`, `fiber` | backend-go | +60 |
| Laravel | `laravel`, `php`, `eloquent`, `artisan` | backend-laravel | +60 |

### Layer 2: Intent Detection Patterns
Detect user **intent** from action keywords:

| Intent | Keywords | Primary Agent | Secondary |
|--------|----------|---------------|-----------|
| Implementation | `implement`, `create`, `add`, `build`, `develop` | Dev agent | ui-designer, qa-automation |
| Bug Fix | `fix`, `bug`, `error`, `issue`, `broken`, `crash` | Dev agent | qa-automation |
| Testing | `test`, `testing`, `coverage`, `QA`, `spec` | qa-automation | Dev agent |
| Design/UI | `design`, `UI`, `UX`, `layout`, `figma`, `style` | ui-designer | Dev agent |
| Database | `database`, `schema`, `query`, `migration`, `SQL` | database-specialist | Backend agent |
| Security | `security`, `vulnerability`, `audit`, `owasp`, `secure` | security-expert | Dev agent |
| Performance | `performance`, `slow`, `optimize`, `speed`, `memory` | devops-cicd | Dev agent |
| Deployment | `deploy`, `docker`, `kubernetes`, `CI/CD`, `pipeline` | devops-cicd | - |

### Layer 3: Project Context Detection
Read project files to **infer** tech stack:

| File | Indicates | Agent | Score |
|------|-----------|-------|-------|
| `app.json` (with expo) | React Native | mobile-react-native | +40 |
| `pubspec.yaml` | Flutter | mobile-flutter | +40 |
| `angular.json` | Angular | web-angular | +40 |
| `*.vue` files | Vue.js | web-vuejs | +40 |
| `next.config.js` | Next.js | web-nextjs | +40 |
| `package.json` + react (no next) | React | web-reactjs | +40 |
| `package.json` + express/nestjs | Node.js | backend-nodejs | +40 |
| `requirements.txt`, `pyproject.toml` | Python | backend-python | +40 |
| `go.mod`, `go.sum` | Go | backend-go | +40 |
| `artisan`, `composer.json` + laravel | Laravel | backend-laravel | +40 |

### Layer 4: File Pattern Detection
Check **recent files** and naming conventions:

| Pattern | Agent | Score |
|---------|-------|-------|
| `*.phone.tsx`, `*.tablet.tsx` | mobile-react-native | +20 |
| `*.dart`, `lib/` folder | mobile-flutter | +20 |
| `*.component.ts`, `*.service.ts` | web-angular | +20 |
| `*.vue` | web-vuejs | +20 |
| `app/`, `route.ts` (Next.js) | web-nextjs | +20 |
| `*.controller.ts`, `*.module.ts` | backend-nodejs | +20 |
| `views.py`, `models.py` | backend-python | +20 |
| `*.go` | backend-go | +20 |
| `*Controller.php`, `*Model.php` | backend-laravel | +20 |

---

## Scoring Weights

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Explicit Mention** | +60 | User directly mentions technology |
| **Keyword Exact Match** | +50 | Direct keyword match to intent |
| **Project Context** | +40 | CWD, file structure, package files |
| **Semantic Match** | +35 | Contextual/implied match |
| **Task Complexity** | +30 | Inferred complexity level |
| **Conversation History** | +25 | Previous context, active agents |
| **File Patterns** | +20 | Recent files, naming conventions |
| **Project Priority Bonus** | +25 | Agent in project-config.yaml priority list |

---

## Agent Thresholds

| Threshold | Score | Role |
|-----------|-------|------|
| **Primary Agent** | ≥80 | Leads the task |
| **Secondary Agent** | 50-79 | Supporting role |
| **Optional Agent** | 30-49 | May assist |
| **Not Activated** | <30 | Not selected |

---

## QA Agent Conditional Activation

**qa-automation is ALWAYS Secondary when:**
- Intent = Implementation (+30 pts as secondary)
- Intent = Bug Fix (+35 pts as secondary)
- New feature being created
- Code modification requested

**qa-automation is Primary when:**
- Intent = Testing (keywords: test, coverage, QA)
- User explicitly asks for tests
- Coverage report requested

**qa-automation is SKIPPED when:**
- Pure documentation task
- Pure design discussion (no code)
- Research/exploration only

---

## Detection Process

### Step 1: Extract Keywords
```
User: "Fix the login button not working on iOS"

Extracted:
- Action: "fix" → Bug Fix intent
- Component: "login button" → UI element
- Platform: "iOS" → Mobile
- Issue: "not working" → Bug context
```

### Step 2: Check Project Context
```bash
# Read these files in order:
1. .claude/project-contexts/[project]/project-config.yaml
2. package.json / composer.json / pubspec.yaml / go.mod
3. Check CWD path for project hints
```

### Step 3: Score All Agents
```
mobile-react-native:
  - "iOS" keyword: +35 (semantic)
  - CWD = /mobile-app: +40 (context)
  - Recent *.phone.tsx: +20 (file pattern)
  → Total: 95 pts ✅ PRIMARY

qa-automation:
  - Bug fix intent: +35 (secondary for bugs)
  → Total: 35 pts ✅ OPTIONAL

ui-designer:
  - "button" keyword: +20 (UI element)
  → Total: 20 pts ❌ NOT SELECTED
```

### Step 4: Select Agents
- Primary: Highest score ≥80
- Secondary: Score 50-79
- Optional: Score 30-49

### Step 5: Show Banner

**See:** `rules/agent-identification-banner.md` for official format.

**Single Agent Banner:**
```
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Multi-Agent Banner (when collaboration needed):**
```
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: [primary] + [secondary], [tertiary]            ┃
┃ Phase: [phase] - [name] │ 🔥 [aura-message]            ┃
┃ Model: [model]                                         ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Banner Examples:**
```
# Single agent:
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: backend-laravel │ Phase: 2 - Design             ┃
┃ Model: Sonnet 4.5 │ 🔥 Architecting greatness          ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Multiple agents (full-stack):
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: web-reactjs + backend-nodejs                   ┃
┃ Phase: 5b - TDD GREEN │ 🔥 Full stack flow             ┃
┃ Model: Opus 4.5                                        ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# With QA secondary:
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: mobile-flutter + qa-automation                 ┃
┃ Phase: - │ 🔥 Bug hunter squad                         ┃
┃ Model: Sonnet 4.5                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# General (no workflow):
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: pm-operations-orchestrator │ Phase: -           ┃
┃ Model: Sonnet 4.5 │ 🔥 Ready to rock                   ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Available Agents

**Development (11):**
- mobile-react-native, mobile-flutter
- web-angular, web-vuejs, web-reactjs, web-nextjs
- backend-nodejs, backend-python, backend-go, backend-laravel
- database-specialist

**Quality & Security (3):**
- security-expert, qa-automation, ui-designer

**DevOps & Operations (5):**
- devops-cicd, jira-operations, confluence-operations, slack-operations, voice-operations

**Infrastructure (5):**
- smart-agent-detector, pm-operations-orchestrator, project-detector, project-config-loader, project-context-manager

---

## Detailed Examples

### Example 1: Explicit Technology Mention
```
User: "Create a React Native screen for user profile"

Layer 1 (Explicit): "React Native" → +60
Layer 2 (Intent): "create" → Implementation → Dev agent primary
Layer 3 (Context): Check package.json
Layer 4 (Files): *.phone.tsx present → +20

Scores:
  ✅ mobile-react-native: 60+20 = 80 (PRIMARY)
  ✅ ui-designer: 35 (screen/profile implies UI) (OPTIONAL)
  ✅ qa-automation: 30 (implementation needs tests) (OPTIONAL)

Banner: (single agent - ui-designer & qa-automation are optional, not shown)
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: mobile-react-native │ Phase: -                  ┃
┃ Model: Sonnet 4.5 │ 🔥 Let's build                     ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 2: Context-Based Detection (No Tech Mention)
```
User: "Fix the login bug"

Layer 1 (Explicit): No tech mentioned
Layer 2 (Intent): "fix", "bug" → Bug Fix intent
Layer 3 (Context): CWD=/backend-api, composer.json has laravel → +40
Layer 4 (Files): AuthController.php recent → +20

Scores:
  ✅ backend-laravel: 40+20 = 60, +35 (bug intent) = 95 (PRIMARY)
  ✅ qa-automation: 35 (bug fix needs validation) (OPTIONAL)

Banner: (multi-agent - qa involved in bug fix)
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: backend-laravel + qa-automation                ┃
┃ Phase: - │ 🔥 Bug hunter mode                          ┃
┃ Model: Sonnet 4.5                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 3: Full-Stack Feature
```
User: "Build user profile page with API"

Layer 1 (Explicit): No specific tech
Layer 2 (Intent): "build" → Implementation
  - "page" → Frontend hint
  - "API" → Backend hint
Layer 3 (Context): Mixed project

Scores:
  ✅ web-reactjs: 55 (page + context) (PRIMARY - Frontend)
  ✅ backend-nodejs: 55 (API + context) (PRIMARY - Backend)
  ✅ ui-designer: 45 (profile UI) (OPTIONAL)
  ✅ qa-automation: 30 (implementation) (OPTIONAL)

Banner: (multi-agent - full stack collaboration)
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: web-reactjs + backend-nodejs, ui-designer      ┃
┃ Phase: - │ 🔥 Full stack mode                          ┃
┃ Model: Opus 4.5                                        ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 4: Security Audit
```
User: "Check if our authentication is secure"

Layer 1 (Explicit): No tech
Layer 2 (Intent): "secure" → Security intent → +50

Scores:
  ✅ security-expert: 50+35 = 85 (PRIMARY)
  ✅ backend-nodejs: 45 (auth context) (OPTIONAL)

Banner: (multi-agent - security with backend context)
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: security-expert + backend-nodejs               ┃
┃ Phase: - │ 🔥 Security audit                           ┃
┃ Model: Opus 4.5                                        ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 5: Testing Request
```
User: "Add unit tests for the payment service"

Layer 1 (Explicit): No tech
Layer 2 (Intent): "tests" → Testing intent → qa-automation PRIMARY

Scores:
  ✅ qa-automation: 50+30 = 80 (PRIMARY)
  ✅ backend-nodejs: 40 (service context) (SECONDARY)

Banner: (multi-agent - QA leads with backend support)
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: qa-automation + backend-nodejs                 ┃
┃ Phase: - │ 🔥 Test warrior mode                        ┃
┃ Model: Sonnet 4.5                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 6: Database Task
```
User: "Design schema for orders, products, users"

Layer 2 (Intent): "schema" → Database intent → +50

Scores:
  ✅ database-specialist: 50+35 = 85 (PRIMARY)
  ✅ backend-nodejs: 40 (will implement models) (SECONDARY)

Banner: (multi-agent - DB leads with backend for models)
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: database-specialist + backend-nodejs           ┃
┃ Phase: - │ 🔥 Schema architect                         ┃
┃ Model: Sonnet 4.5                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## After Detection

1. **Load agent instructions** from `agents/[agent-name].md`
2. **Invoke appropriate skill:**
   - Complex feature → `workflow-orchestrator`
   - Bug fix → `bugfix-quick`
   - Test request → `test-writer`
   - Code review → `code-reviewer`
3. **Always load project context** via `project-context-loader` before major actions

---

## Manual Override

User can force specific agent:
```
User: "Use only qa-automation for this task"
→ Override automatic selection
→ qa-automation becomes PRIMARY regardless of scoring
```

---

**Full detection algorithm:** `agents/smart-agent-detector.md`
**Selection guide:** `docs/AGENT_SELECTION_GUIDE.md`

**MANDATORY:** Always show agent banner at start of EVERY response.
