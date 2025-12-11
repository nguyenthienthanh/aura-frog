# Agent Selection Guide

**Version:** 2.1.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** Complete guide to intelligent agent selection in Aura Frog

---

## 🎯 Overview

Aura Frog v1.0.0 includes an advanced **Smart Agent Detector** that automatically selects the most appropriate agents for any task based on natural language understanding, project context, and conversation history.

---

## 🧠 How It Works

### 3-Step Process

**1. Analysis** → Parse user input, detect intent, extract keywords
**2. Scoring** → Score all agents using multi-criteria algorithm
**3. Selection** → Choose primary, secondary, and optional agents

---

## 📊 Scoring System (TOON)

```toon
scoring_weights[7]{criterion,weight,description}:
  explicit_mention,60,User directly mentions tech (React Native)
  keyword_exact_match,50,Direct keyword match (test → qa-automation)
  project_context,40,CWD + file structure + package.json
  semantic_match,35,Contextual/implied match
  task_complexity,30,Inferred from task description
  conversation_history,25,Previous context + active agents
  file_patterns,20,Recent files + naming conventions

thresholds[4]{level,score,role}:
  primary_agent,>=80,Lead development
  secondary_agent,50-79,Supporting role
  optional_agent,30-49,Nice-to-have
  not_activated,<30,Not selected
```

---

## 🎯 Agent Selection by Intent

### Implementation Intent
```
Keywords: "implement", "create", "add", "build", "develop"

Selected:
  Primary: Relevant dev agent (mobile, web, backend)
  Secondary: ui-designer, qa-automation
```

### Bug Fix Intent
```
Keywords: "fix", "bug", "error", "issue", "broken"

Selected:
  Primary: Relevant dev agent
  Secondary: qa-automation
  Skip: ui-designer (unless UI bug)
```

### Testing Intent
```
Keywords: "test", "testing", "coverage", "QA"

Selected:
  Primary: qa-automation
  Secondary: Relevant dev agent
```

### Design Intent
```
Keywords: "design", "UI", "UX", "layout", "figma"

Selected:
  Primary: ui-designer
  Secondary: Relevant dev agent
```

### Database Intent
```
Keywords: "database", "schema", "query", "migration"

Selected:
  Primary: database-specialist
  Secondary: Relevant backend agent
```

### Security Intent
```
Keywords: "security", "vulnerability", "audit", "owasp"

Selected:
  Primary: security-expert
  Secondary: Relevant dev agent
```

### Performance Intent
```
Keywords: "performance", "slow", "optimize", "speed"

Selected:
  Primary: devops-cicd (perf commands)
  Secondary: Relevant dev agent
```

### Deployment Intent
```
Keywords: "deploy", "docker", "kubernetes", "pipeline"

Selected:
  Primary: devops-cicd
  Commands: deploy:setup, docker:create, cicd:create
```

---

## 🔍 Technology Detection

### Mobile Frameworks

**React Native**
- Keywords: `react-native`, `expo`, `mobile`, `ios`, `android`
- Files: `app.json` (with expo), `*.phone.tsx`, `*.tablet.tsx`
- Score: +50 exact, +40 context, +35 semantic

**Flutter**
- Keywords: `flutter`, `dart`, `bloc`, `provider`, `riverpod`
- Files: `pubspec.yaml`, `*.dart`, `lib/` folder
- Score: +50 exact, +40 context, +35 semantic

### Web Frameworks

**Angular**
- Keywords: `angular`, `typescript`, `ngrx`, `rxjs`, `signals`
- Files: `angular.json`, `*.component.ts`, `*.service.ts`
- Score: +50 exact, +40 context, +35 semantic

**Vue.js**
- Keywords: `vue`, `vuejs`, `pinia`, `nuxt`, `composition api`
- Files: `vite.config.ts` (with vue), `*.vue`
- Score: +50 exact, +40 context, +35 semantic

**React**
- Keywords: `react`, `reactjs`, `hooks`, `context`
- Files: `package.json` (with react, not next), `*.jsx`, `*.tsx`
- Score: +50 exact, +40 context, +35 semantic

**Next.js**
- Keywords: `next`, `nextjs`, `ssr`, `ssg`, `app router`
- Files: `next.config.js`, `app/` directory, `route.ts`
- Score: +50 exact, +40 context, +35 semantic

### Backend Frameworks

**Node.js**
- Keywords: `nodejs`, `express`, `nestjs`, `fastify`, `koa`
- Files: `package.json` (with express/nestjs/fastify)
- Score: +50 exact, +40 context, +35 semantic

**Python**
- Keywords: `python`, `django`, `fastapi`, `flask`
- Files: `requirements.txt`, `pyproject.toml`, `manage.py`
- Score: +50 exact, +40 context, +35 semantic

**Go**
- Keywords: `go`, `golang`, `gin`, `fiber`, `echo`, `grpc`
- Files: `go.mod`, `go.sum`, `*.go`
- Score: +50 exact, +40 context, +35 semantic

**Laravel**
- Keywords: `laravel`, `php`, `eloquent`, `artisan`
- Files: `artisan`, `composer.json` (with laravel)
- Score: +50 exact, +40 context, +35 semantic

---

## 📝 Example Selections

### Example 1: Natural Mobile Request
```
User: "Add a share button to the post screen"

Analysis:
  - Keywords: "share button", "post screen"
  - Context: CWD = /YOUR_Proj_Frontend
  - Files: PostScreen.phone.tsx (recent)

Selected:
  ✅ mobile-react-native (85) - Primary
  ✅ ui-designer (50) - Secondary
  ✅ qa-automation (30) - Optional

Reasoning:
  - "screen" implies mobile app
  - CWD matches React Native project
  - "button" needs UI design
  - New feature needs testing
```

### Example 2: Full-Stack Feature
```
User: "Build user profile page with API"

Analysis:
  - Keywords: "profile page", "API"
  - Context: Mixed frontend/backend project

Selected:
  ✅ web-reactjs (55) - Primary (Frontend)
  ✅ backend-nodejs (55) - Primary (Backend)
  ✅ ui-designer (45) - Secondary
  ✅ qa-automation (30) - Optional

Reasoning:
  - "page" → Frontend agent
  - "API" → Backend agent
  - Profile needs good UI
  - Integration testing needed
```

### Example 3: Vague Bug Fix
```
User: "Fix the login issue"

Analysis:
  - Keywords: "fix", "login"
  - Context: CWD = /backend-api
  - Files: AuthController.php

Selected:
  ✅ backend-laravel (90) - Primary
  ✅ qa-automation (35) - Secondary

Reasoning:
  - CWD + files indicate Laravel
  - Login likely backend auth issue
  - No UI designer (backend-focused)
  - Testing for bug validation
```

### Example 4: Database Schema
```
User: "Design schema for orders, products, users"

Analysis:
  - Keywords: "schema", "orders", "products", "users"
  - Intent: Database design

Selected:
  ✅ database-specialist (85) - Primary
  ✅ backend-nodejs (40) - Secondary

Reasoning:
  - "schema" → Database specialist
  - Will need to implement models
```

### Example 5: Security Audit
```
User: "Check if authentication is secure"

Analysis:
  - Keywords: "secure", "authentication"
  - Intent: Security audit

Selected:
  ✅ security-expert (85) - Primary
  ✅ backend-nodejs (45) - Secondary

Reasoning:
  - "secure" → Security expert
  - Auth implementation context
  - Suggests: security:audit command
```

---

## ⚙️ Configuration

### Custom Weights
```yaml
# smart-detector-config.yaml
weights:
  keyword_exact_match: 50
  semantic_match: 35
  project_context: 40
  task_complexity: 30
  conversation_history: 25
  file_patterns: 20
  explicit_mention: 60

thresholds:
  primary_agent: 80
  secondary_agent: 50
  optional_agent: 30
  minimum_activation: 25
```

### Sensitivity Settings
```yaml
sensitivity:
  keyword_matching: strict     # strict | moderate | loose
  semantic_matching: moderate
  context_weight: high         # high | medium | low
```

---

## 🎛️ Manual Override

### Override Automatic Selection
```
User: "Use only qa-automation for this task"

System: ✅ Manual override
  - qa-automation (manual)
  - pm-operations-orchestrator (always active)
```

### Project-Specific Priority
```yaml
# .claude/project-contexts/my-project/project-config.yaml
agents_priority:
  - mobile-react-native
  - ui-designer
  - qa-automation

# These get +25 bonus in scoring
```

---

## 🔧 Debug Mode

### Verbose Selection
```
User: "workflow:start --debug Implement user profile"

Output:
🧠 Agent Selection Debug
─────────────────────────────────────────

mobile-react-native:
  - Project context (CWD): +40
  - Recent files (*.phone.tsx): +20
  - Base priority: +100
  → Total: 160 ✅ PRIMARY

web-reactjs:
  - Keyword mismatch: 0
  - Base priority: +90
  → Total: 90 (not selected)

ui-designer:
  - Task type (UI implied): +30
  - Base priority: +85
  → Total: 115 ✅ SECONDARY

qa-automation:
  - Task type (implementation): +30
  - Base priority: +85
  → Total: 115 ✅ SECONDARY

Selected: mobile-react-native (primary), ui-designer, qa-automation
Confidence: 85% (High)
```

---

## 🎯 Best Practices

### For Users

**Be Specific (But Natural)**
- ✅ "Add a share button to the post screen"
- ❌ "Make changes to the app"

**Mention Technology When Relevant**
- ✅ "Create a FastAPI endpoint for user login"
- ✅ "Design a Flutter widget for profile card"

**Describe Intent Clearly**
- ✅ "Fix the authentication bug"
- ✅ "Optimize the slow database queries"

### For Claude

**Always Load Context First**
1. Check current working directory
2. Read project-config.yaml
3. Analyze recent files
4. Review conversation history

**Score All Agents**
- Don't assume based on keywords alone
- Use multi-criteria scoring
- Consider conversation context

**Explain Selection**
- Show reasoning for each agent
- Display confidence level
- Allow manual override

---

## 📚 Related Documentation

- **Agent Definitions:** `agents/`
- **Smart Agent Detector:** `agents/smart-agent-detector.md`
- **Project Detector:** `agents/project-detector.md`
- **Agent Identification:** `docs/AGENT_IDENTIFICATION_GUIDE.md`

---

**Guide Version:** 2.1.0
**Aura Frog Version:** 1.2.0
**Format:** TOON
**Last Updated:** 2025-12-10
