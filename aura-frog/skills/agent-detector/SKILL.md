---
name: agent-detector
description: "CRITICAL: MUST run for EVERY message. Detects agent, complexity, AND model automatically. Always runs FIRST."
autoInvoke: true
priority: highest
model: haiku
triggers:
  - "every message"
  - "always first"
allowed-tools: Read, Grep, Glob
---

# Aura Frog Agent Detector

**Priority:** HIGHEST - Runs FIRST for every message
**Version:** 3.0.0

---

## When to Use

**ALWAYS** - Every user message, no exceptions.

---

## Auto-Complexity Detection

AI auto-detects task complexity. User doesn't need `:fast` or `:hard` variants.

### Complexity Levels

```toon
complexity[3]{level,criteria,approach}:
  Quick,Single file/Simple fix/Clear scope,Direct implementation - skip research
  Standard,2-5 files/Feature add/Some unknowns,Scout first then implement
  Deep,6+ files/Architecture/Vague scope,Research + plan + implement
```

### Auto-Detection Criteria

**Quick (1-2 tool calls):**
- Typo fix, single variable rename
- Add console.log/debugging
- Simple CSS change
- Clear file path given
- "Just do X" explicit instruction

**Standard (3-6 tool calls):**
- New component/function
- Bug fix with clear error
- API endpoint addition
- File modification with tests

**Deep (7+ tool calls, use plan mode):**
- New feature across multiple files
- Refactoring/architecture change
- Vague requirements ("make it better")
- Security audit
- Performance optimization
- User asks to "plan" or "design"

### Detection Logic

```
1. Count mentioned files/components
2. Check for vague vs specific language
3. Detect scope modifiers (all, entire, every)
4. Check for research keywords (how, why, best way)
5. Assign complexity level
```

---

## Model Selection

**Auto-select model based on task complexity and agent type.**

### Model Mapping

```toon
model_selection[3]{model,when_to_use,agents}:
  haiku,Quick tasks/Simple queries/Orchestration,pm-operations-orchestrator/project-detector/voice-operations
  sonnet,Standard implementation/Coding/Testing/Bug fixes,All dev agents/qa-automation/ui-designer
  opus,Architecture/Deep analysis/Security audits/Complex planning,security-expert (audits)/Any agent (architecture mode)
```

### Complexity → Model

```toon
complexity_model[3]{complexity,default_model,override_to_opus}:
  Quick,haiku,Never
  Standard,sonnet,User asks for architecture/design
  Deep,sonnet,Always consider opus for planning phase
```

### Task Type → Model

```toon
task_model[8]{task_type,model,reason}:
  Typo fix / config change,haiku,Minimal reasoning needed
  Bug fix / feature add,sonnet,Standard implementation
  API endpoint / component,sonnet,Standard implementation
  Test writing,sonnet,Requires code understanding
  Code review,sonnet,Pattern matching + analysis
  Architecture design,opus,Complex trade-off analysis
  Security audit,opus,Deep vulnerability analysis
  Refactoring / migration,opus,Cross-cutting impact analysis
```

### Agent Default Models

```toon
agent_models[14]{agent,default_model,opus_when}:
  pm-operations-orchestrator,haiku,Never (orchestration only)
  project-detector,haiku,Never (detection only)
  project-context-manager,haiku,Never (context loading)
  mobile-react-native,sonnet,Architecture decisions
  mobile-flutter,sonnet,Architecture decisions
  web-angular,sonnet,Architecture decisions
  web-vuejs,sonnet,Architecture decisions
  web-reactjs,sonnet,Architecture decisions
  web-nextjs,sonnet,Architecture decisions
  backend-nodejs,sonnet,Architecture decisions
  backend-python,sonnet,Architecture decisions
  backend-go,sonnet,Architecture decisions
  backend-laravel,sonnet,Architecture decisions
  database-specialist,sonnet,Schema design / migration planning
  security-expert,sonnet,opus for full audits
  qa-automation,sonnet,Never
  ui-designer,sonnet,Design system architecture
  devops-cicd,sonnet,Infrastructure architecture
```

### Model Selection Output

Include in detection result:

```markdown
## Detection Result
- **Agent:** backend-nodejs
- **Model:** sonnet
- **Complexity:** Standard
- **Reason:** API endpoint implementation
```

When spawning Task tool, use the detected model:
```
Task(subagent_type="backend-nodejs", model="sonnet", ...)
```

---

## Multi-Layer Detection System

### Layer 1: Explicit Technology Detection

Check if user **directly mentions** a technology:

```toon
tech_detection[10]{technology,keywords,agent,score}:
  React Native,react-native/expo/RN,mobile-react-native,+60
  Flutter,flutter/dart/bloc,mobile-flutter,+60
  Angular,angular/ngrx/rxjs,web-angular,+60
  Vue.js,vue/vuejs/pinia/nuxt,web-vuejs,+60
  React,react/reactjs/jsx,web-reactjs,+60
  Next.js,next/nextjs/ssr/ssg,web-nextjs,+60
  Node.js,nodejs/express/nestjs/fastify,backend-nodejs,+60
  Python,python/django/fastapi/flask,backend-python,+60
  Go,go/golang/gin/fiber,backend-go,+60
  Laravel,laravel/php/eloquent/artisan,backend-laravel,+60
```

### Layer 2: Intent Detection Patterns

Detect user **intent** from action keywords:

```toon
intent_detection[8]{intent,keywords,primary,secondary}:
  Implementation,implement/create/add/build/develop,Dev agent,ui-designer/qa-automation
  Bug Fix,fix/bug/error/issue/broken/crash,Dev agent,qa-automation
  Testing,test/testing/coverage/QA/spec,qa-automation,Dev agent
  Design/UI,design/UI/UX/layout/figma/style,ui-designer,Dev agent
  Database,database/schema/query/migration/SQL,database-specialist,Backend agent
  Security,security/vulnerability/audit/owasp/secure,security-expert,Dev agent
  Performance,performance/slow/optimize/speed/memory,devops-cicd,Dev agent
  Deployment,deploy/docker/kubernetes/CI-CD/pipeline,devops-cicd,-
```

### Layer 3: Project Context Detection

Read project files to **infer** tech stack:

```toon
project_detection[10]{file,indicates,agent,score}:
  app.json (with expo),React Native,mobile-react-native,+40
  pubspec.yaml,Flutter,mobile-flutter,+40
  angular.json,Angular,web-angular,+40
  *.vue files,Vue.js,web-vuejs,+40
  next.config.js,Next.js,web-nextjs,+40
  package.json + react (no next),React,web-reactjs,+40
  package.json + express/nestjs,Node.js,backend-nodejs,+40
  requirements.txt/pyproject.toml,Python,backend-python,+40
  go.mod/go.sum,Go,backend-go,+40
  artisan/composer.json + laravel,Laravel,backend-laravel,+40
```

### Layer 4: File Pattern Detection

Check **recent files** and naming conventions:

```toon
file_patterns[9]{pattern,agent,score}:
  *.phone.tsx/*.tablet.tsx,mobile-react-native,+20
  *.dart/lib/ folder,mobile-flutter,+20
  *.component.ts/*.service.ts,web-angular,+20
  *.vue,web-vuejs,+20
  app/route.ts (Next.js),web-nextjs,+20
  *.controller.ts/*.module.ts,backend-nodejs,+20
  views.py/models.py,backend-python,+20
  *.go,backend-go,+20
  *Controller.php/*Model.php,backend-laravel,+20
```

---

## Scoring Weights

```toon
weights[8]{criterion,weight,description}:
  Explicit Mention,+60,User directly mentions technology
  Keyword Exact Match,+50,Direct keyword match to intent
  Project Context,+40,CWD/file structure/package files
  Semantic Match,+35,Contextual/implied match
  Task Complexity,+30,Inferred complexity level
  Conversation History,+25,Previous context/active agents
  File Patterns,+20,Recent files/naming conventions
  Project Priority Bonus,+25,Agent in project-config.yaml priority list
```

---

## Agent Thresholds

```toon
thresholds[4]{level,score,role}:
  Primary Agent,≥80,Leads the task
  Secondary Agent,50-79,Supporting role
  Optional Agent,30-49,May assist
  Not Activated,<30,Not selected
```

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
⚡ 🐸 AURA FROG v1.2.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Multi-Agent Banner (when collaboration needed):**
```
⚡ 🐸 AURA FROG v1.2.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agents: [primary] + [secondary], [tertiary]            ┃
┃ Phase: [phase] - [name] │ 🔥 [aura-message]            ┃
┃ Model: [model]                                         ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Available Agents

```toon
agents[4]{category,count,list}:
  Development,11,mobile-react-native/mobile-flutter/web-angular/web-vuejs/web-reactjs/web-nextjs/backend-nodejs/backend-python/backend-go/backend-laravel/database-specialist
  Quality & Security,3,security-expert/qa-automation/ui-designer
  DevOps & Operations,5,devops-cicd/jira-operations/confluence-operations/slack-operations/voice-operations
  Infrastructure,5,smart-agent-detector/pm-operations-orchestrator/project-detector/project-config-loader/project-context-manager
```

---

## Examples

### Example 1: Explicit Technology Mention
```
User: "Create a React Native screen for user profile"

Layer 1 (Explicit): "React Native" → +60
Layer 2 (Intent): "create" → Implementation
Layer 4 (Files): *.phone.tsx present → +20

Detection Result:
  ✅ Agent: mobile-react-native (PRIMARY, 80 pts)
  ✅ Model: sonnet
  ✅ Complexity: Standard
  ✅ Secondary: ui-designer (35), qa-automation (30)
```

### Example 2: Context-Based Detection (No Tech Mention)
```
User: "Fix the login bug"

Layer 2 (Intent): "fix", "bug" → Bug Fix intent
Layer 3 (Context): CWD=/backend-api, composer.json has laravel → +40
Layer 4 (Files): AuthController.php recent → +20

Detection Result:
  ✅ Agent: backend-laravel (PRIMARY, 95 pts)
  ✅ Model: sonnet
  ✅ Complexity: Standard
  ✅ Secondary: qa-automation (35)
```

### Example 3: Architecture Task (Uses Opus)
```
User: "Design the authentication system architecture"

Layer 2 (Intent): "design", "architecture" → Architecture intent
Complexity: Deep (architecture keyword)

Detection Result:
  ✅ Agent: backend-nodejs (PRIMARY)
  ✅ Model: opus (architecture task)
  ✅ Complexity: Deep
  ✅ Secondary: security-expert (55), database-specialist (45)
```

### Example 4: Quick Fix (Uses Haiku)
```
User: "Fix typo in README.md line 42"

Complexity: Quick (single file, explicit location)

Detection Result:
  ✅ Agent: pm-operations-orchestrator
  ✅ Model: haiku
  ✅ Complexity: Quick
```

---

## After Detection

1. **Output detection result** with agent, model, and complexity
2. **Load agent instructions** from `agents/[agent-name].md`
3. **Use detected model** when spawning Task tool:
   ```
   Task(subagent_type="[agent]", model="[detected-model]", ...)
   ```
4. **Invoke appropriate skill:**
   - Complex feature → `workflow-orchestrator`
   - Bug fix → `bugfix-quick`
   - Test request → `test-writer`
   - Code review → `code-reviewer`
5. **Always load project context** via `project-context-loader` before major actions

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
