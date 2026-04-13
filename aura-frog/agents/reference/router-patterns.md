# Router Agent - Reference Patterns

**Source:** `agents/router.md`
**Load:** On-demand when deep routing expertise needed

---

## Task Content Analysis (Layer 0)

**Analyze the actual task, not just the repo type.** Highest priority layer.

```toon
task_triggers[7]{category,example_patterns,activates,score}:
  Frontend,"html template, blade, twig, email template, pdf styling, css",frontend,+50-60
  Backend,"api endpoint, controller, middleware, queue job, webhook",architect (+ framework skill),+50-55
  Database,"migration, schema, query optimization, slow query, n+1",architect,+55-60
  Security,"xss, sql injection, csrf, vulnerability, auth bypass",security,+55-60
  DevOps,"docker, kubernetes, ci-cd, terraform, deployment",devops,+50-55
  Testing,"unit test, e2e test, coverage, mock, fixture",tester,+45-55
  Design,"figma, wireframe, design system, accessibility",frontend,+50-60
```

### Frontend Task Patterns

```toon
frontend_tasks[9]{pattern,score}:
  html template/blade/twig/jinja/ejs,+55
  email template,+55
  pdf styling/pdf layout,+50
  css/scss/tailwind,+55
  responsive design,+50
  form layout/ui component,+50
  admin panel ui,+50
  modal/dialog/toast,+45
  svg/icon work,+45
```

### Backend Task Patterns

```toon
backend_tasks[9]{pattern,score}:
  api endpoint/route,+55
  controller logic,+55
  middleware,+50
  authentication/authorization,+50
  queue job/background,+50
  webhook handler,+50
  caching/redis,+45
  file upload/storage,+45
  email sending,+45
```

### Cross-Domain Override

When task content score >=50 for a domain different from repo, that agent becomes PRIMARY. Examples: "Fix email template styling" in Laravel repo -> frontend PRIMARY. "Optimize slow query" in any repo -> architect PRIMARY.

---

## Scoring Algorithm

```toon
weights[7]{criterion,points}:
  Task Content Match (Layer 0),+50-60 (HIGHEST)
  Explicit Mention,+60
  Keyword Exact Match,+50
  Project Context,+40
  Semantic Match,+35
  Task Complexity,+30
  Conversation History / File Patterns,+20-25
```

```toon
thresholds[4]{role,score}:
  Primary Agent,>=80
  Secondary Agent,50-79
  Optional Agent,30-49
  Not Activated,<30
```

---

## Intent Detection

```toon
intents[11]{intent,keywords,primary,secondary}:
  Implementation,"implement, create, add, build",Dev agent,"tester, frontend"
  Bug Fix,"fix, bug, error, broken, debug",Dev agent,tester
  Refactoring,"refactor, improve, optimize, clean up",Dev agent,tester
  Testing,"test, QA, coverage, spec",tester,Dev agent
  Design/UI,"design, UI, UX, figma, styling",frontend,Dev agent
  Documentation,"document, docs, README",lead,-
  Database,"database, schema, migration, SQL",architect,Backend agent
  Security,"security, vulnerability, audit, OWASP",security,Dev agent
  Performance,"performance, slow, optimize, lighthouse",devops,Dev agent
  Deployment,"deploy, docker, kubernetes, CI/CD",devops,-
  Monitoring,"monitor, errors, logs, sentry",devops,-
```

---

## Technology Detection

```toon
mobile_detection[2]{framework,keywords,files}:
  React Native,"react-native, expo, RN","app.json (expo), package.json"
  Flutter,"flutter, dart, bloc, riverpod",pubspec.yaml
```

```toon
web_detection[4]{framework,keywords,files}:
  Angular,"angular, ngrx, rxjs, signals",angular.json
  Vue.js,"vue, pinia, nuxt, composition api","*.vue files"
  React,"react, hooks, context","package.json (react, no next)"
  Next.js,"next, nextjs, ssr, app router",next.config.js
```

```toon
backend_detection[4]{framework,keywords,files}:
  Node.js,"nodejs, express, nestjs, fastify",package.json
  Python,"python, django, fastapi, flask","requirements.txt, pyproject.toml"
  Go,"go, golang, gin, fiber, grpc","go.mod, go.sum"
  Laravel,"laravel, php, eloquent, artisan","artisan, composer.json"
```

```toon
specialized_detection[4]{agent,keywords,files}:
  architect,"database, schema, migration, SQL, architecture","migrations/, schema.sql"
  security,"security, vulnerability, OWASP, XSS, pentest",-
  devops,"docker, kubernetes, terraform, pipeline","Dockerfile, .github/workflows/"
  tester,"test, coverage, jest, pytest","*.test.ts, __tests__/"
```

---

## QA Agent Activation

**Activate when:** User explicitly requests testing (+50 Primary), implementation + test infra exists (+30 Optional), bug fix + test infra exists (+35 Optional).

**Skip when:** No test infrastructure detected, user says "don't worry about tests", documentation/deployment-only task.

### Test Infrastructure Detection

```toon
test_infra[5]{language,check_for}:
  JavaScript,"jest.config.js, vitest.config.ts, cypress.config.js, scripts.test"
  Python,"pytest.ini, setup.cfg, requirements.txt (pytest)"
  PHP,"phpunit.xml, composer.json (phpunit)"
  Go,*_test.go files
  General,"tests/, __tests__/, test/, spec/ directories"
```

---

## Context Analysis

**Fast path:** Check `.claude/project-contexts/[name]/project-detection.json`. If valid (<24h, config unchanged) -> use cached detection, skip scanning.

**Cache miss detection:** 1) Check package.json deps (+40), 2) Check other package files (+40), 3) Analyze recent files (+20), 4) Conversation history (+20-25).

---

## Team Mode Detection

```toon
team_decision[4]{condition,mode}:
  Single domain + Quick/Standard,subagent
  Multi-domain (2+ scores >=50) + Teams enabled,team
  Deep complexity + cross-review + Teams enabled,team
  Agent Teams disabled,subagent
```

---

## Fallback Strategies

```toon
fallbacks[3]{scenario,action}:
  No agents >=30 pts,Ask user for clarification
  Multiple agents tie,Prefer higher base priority
  Context unclear,Show top 3 options — let user choose
```

---

## Related Documentation

- **Task-Based Selection:** `skills/agent-detector/task-based-agent-selection.md`
- **Skill:** `skills/agent-detector/SKILL.md`
- **Guide:** `../../docs/guides/AGENT_SELECTION_GUIDE.md`
