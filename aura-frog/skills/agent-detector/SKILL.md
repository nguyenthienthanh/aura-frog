---
name: agent-detector
description: "CRITICAL: MUST run for EVERY message. Detects agent, complexity, AND model automatically. Always runs FIRST."
autoInvoke: true
priority: highest
model: haiku
triggers:
  - "every message"
  - "always first"
allowed-tools: NONE
# TOKEN OPTIMIZATION: Disabled file scanning tools. Detection uses in-memory patterns only.
# This saves ~10-30k tokens per message. If file scanning needed, use project-context-loader explicitly.
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

**Deep (7+ tool calls, use workflow-orchestrator):**
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
  haiku,Quick tasks/Simple queries/Orchestration,lead/scanner
  sonnet,Standard implementation/Coding/Testing/Bug fixes,All dev agents/tester/frontend
  opus,Architecture/Deep analysis/Security audits/Complex planning,security (audits)/Any agent (architecture mode)
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
agent_models[10]{agent,default_model,opus_when}:
  lead,haiku,Never (orchestration only)
  scanner,haiku,Never (detection/context loading)
  router,haiku,Never (routing only)
  architect,sonnet,Schema design / migration planning / system architecture
  frontend,sonnet,Design system architecture
  mobile,sonnet,Architecture decisions
  strategist,sonnet,Business strategy / ROI evaluation
  security,sonnet,opus for full audits
  tester,sonnet,Never
  devops,sonnet,Infrastructure architecture
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

### Layer 0: Task Content Analysis (Highest Priority)

**Analyze the actual task, not just the repo.** A backend repo may have frontend tasks (templates, PDFs, emails).

**Full patterns:** `task-based-agent-selection.md`

```toon
task_content_triggers[7]{category,example_patterns,activates,score_boost}:
  Frontend,html template/blade/twig/email template/pdf styling/css,frontend,+50 to +60
  Backend,api endpoint/controller/middleware/queue job/webhook,architect (+ framework skill),+50 to +55
  Database,migration/schema/query optimization/slow query/n+1,architect,+55 to +60
  Security,xss/sql injection/csrf/vulnerability/auth bypass,security,+55 to +60
  DevOps,docker/kubernetes/ci-cd/terraform/deployment,devops,+50 to +55
  Testing,unit test/e2e test/coverage/mock/fixture,tester,+45 to +55
  Design,figma/wireframe/design system/accessibility,frontend,+50 to +60
```

**Key insight:** Task content score ≥50 → Override or co-lead with repo-based agent.

**Examples:**
```
# Backend repo, but frontend task
Repo: Laravel API
Task: "Fix email template styling"
→ frontend (PRIMARY) + architect (SECONDARY)

# Frontend repo, but backend task
Repo: Next.js
Task: "Add rate limiting to API route"
→ architect (PRIMARY) + frontend (SECONDARY)
```

---

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
  Implementation,implement/create/add/build/develop,Dev agent,frontend/tester
  Bug Fix,fix/bug/error/issue/broken/crash,Dev agent,tester
  Testing,test/testing/coverage/QA/spec,tester,Dev agent
  Design/UI,design/UI/UX/layout/figma/style,frontend,Dev agent
  Database,database/schema/query/migration/SQL,architect,Backend agent
  Security,security/vulnerability/audit/owasp/secure,security,Dev agent
  Performance,performance/slow/optimize/speed/memory,devops,Dev agent
  Deployment,deploy/docker/kubernetes/CI-CD/pipeline,devops,-
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
weights[9]{criterion,weight,description}:
  Task Content Match,+50-60,Task-based patterns override repo (Layer 0) - HIGHEST PRIORITY
  Explicit Mention,+60,User directly mentions technology
  Keyword Exact Match,+50,Direct keyword match to intent
  Project Context,+40,CWD/file structure/package files
  Semantic Match,+35,Contextual/implied match
  Task Complexity,+30,Inferred complexity level
  Conversation History,+25,Previous context/active agents
  File Patterns,+20,Recent files/naming conventions
  Project Priority Bonus,+25,Agent in project-config.yaml priority list
```

**Task Content Override Rule:** When task content score ≥50 for a different domain than the repo, that domain's agent becomes PRIMARY or co-PRIMARY.

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

**tester is ALWAYS Secondary when:**
- Intent = Implementation (+30 pts as secondary)
- Intent = Bug Fix (+35 pts as secondary)
- New feature being created
- Code modification requested

**tester is Primary when:**
- Intent = Testing (keywords: test, coverage, QA)
- User explicitly asks for tests
- Coverage report requested

**tester is SKIPPED when:**
- Pure documentation task
- Pure design discussion (no code)
- Research/exploration only

---

## Detection Process

### Pre-Step: Check Detection Cache (Performance Optimization)

**Before running full detection, check if a cached result can be reused.**

Cache file: `.claude/cache/agent-detection-cache.json`

```toon
cache_check[4]{condition,action}:
  Cache exists AND same workflowId AND phase > 1,Use cached result (skip Steps 0-5)
  Cache exists AND same workflowId AND phase = 1,Invalidate — re-detect (requirements may change agents)
  New workflow OR no workflowId,Invalidate — full detection
  User override (e.g. "Use tester"),Invalidate — honor explicit override
```

**Cache hit output:**
```markdown
## Detection Result (cached)
- **Agent:** [cached-agent]
- **Model:** [cached-model]
- **Complexity:** [cached-complexity]
- **Cache:** hit (workflow: [id], phase: [N])
```

**Cache write:** After completing Steps 0-5, write detection result to cache file:
```json
{
  "workflowId": "FEAT-123",
  "agent": "architect",
  "model": "sonnet",
  "complexity": "Standard",
  "secondary": ["tester"],
  "teamMode": false,
  "detectedAt": "2026-03-24T10:00:00Z"
}
```

**Savings:** ~500-1000 tokens per message after first detection in a workflow.

---

### Step 0: Task Content Analysis (Do This First!)

**Analyze the task itself before checking the repo.**

```
User: "Update the invoice PDF layout - table breaks across pages"

Task Analysis:
- "PDF" → Frontend task pattern (+50)
- "layout" → Frontend keyword (+40)
- "table" → Frontend keyword (+30)
→ Total frontend score: 120 pts → frontend is PRIMARY

Even if repo is pure backend, frontend leads this task!
```

**Apply patterns from:** `task-based-agent-selection.md`

### Step 1: Extract Keywords
```
User: "Fix the login button not working on iOS"

Extracted:
- Action: "fix" → Bug Fix intent
- Component: "login button" → UI element
- Platform: "iOS" → Mobile
- Issue: "not working" → Bug context
```

### Step 2: Check Project Context (Use Cached Detection!)

**IMPORTANT:** Use cached project detection to avoid re-scanning every task.

```bash
# 1. Check detection first (fast path):
.claude/project-contexts/[project-name]/project-detection.json

# 2. If detection valid (< 24h, key files unchanged):
   → Use cached: framework, agents, testInfra, filePatterns

# 3. If detection invalid or missing:
   → Run full detection (reads package.json, etc.)
   → Save to project-contexts for next task

# 4. Load project-specific overrides:
.claude/project-contexts/[project]/project-config.yaml
.claude/project-contexts/[project]/conventions.md
```

**Detection invalidation triggers:**
- Key config files changed (package.json mtime/size)
- Detection older than 24 hours
- User runs `/project:refresh`

**Commands:**
- `/project:status` - Show project detection
- `/project:refresh` - Force fresh scan

### Step 3: Score All Agents (Combine Task + Repo)
```
mobile-react-native:
  - "iOS" keyword: +35 (semantic)
  - CWD = /mobile-app: +40 (context)
  - Recent *.phone.tsx: +20 (file pattern)
  → Total: 95 pts ✅ PRIMARY

tester:
  - Bug fix intent: +35 (secondary for bugs)
  → Total: 35 pts ✅ OPTIONAL

frontend:
  - "button" keyword: +20 (UI element)
  → Total: 20 pts ❌ NOT SELECTED
```

### Step 4: Select Agents
- Primary: Highest score ≥80
- Secondary: Score 50-79
- Optional: Score 30-49

### Step 5: Show Banner

**See:** `rules/core/agent-identification-banner.md` for official format.

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
  Development,4,architect/frontend/mobile/gamedev
  Quality & Security,2,security/tester
  DevOps & Operations,1,devops
  Infrastructure,3,router/lead/scanner
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
  ✅ Agent: mobile (PRIMARY, 80 pts)
  ✅ Model: sonnet
  ✅ Complexity: Standard
  ✅ Secondary: frontend (35), tester (30)
```

### Example 2: Context-Based Detection (No Tech Mention)
```
User: "Fix the login bug"

Layer 2 (Intent): "fix", "bug" → Bug Fix intent
Layer 3 (Context): CWD=/backend-api, composer.json has laravel → +40
Layer 4 (Files): AuthController.php recent → +20

Detection Result:
  ✅ Agent: architect (PRIMARY, 95 pts) + laravel-expert skill
  ✅ Model: sonnet
  ✅ Complexity: Standard
  ✅ Secondary: tester (35)
```

### Example 3: Architecture Task (Uses Opus)
```
User: "Design the authentication system architecture"

Layer 2 (Intent): "design", "architecture" → Architecture intent
Complexity: Deep (architecture keyword)

Detection Result:
  ✅ Agent: architect (PRIMARY)
  ✅ Model: opus (architecture task)
  ✅ Complexity: Deep
  ✅ Secondary: security (55)
```

### Example 4: Quick Fix (Uses Haiku)
```
User: "Fix typo in README.md line 42"

Complexity: Quick (single file, explicit location)

Detection Result:
  ✅ Agent: lead
  ✅ Model: haiku
  ✅ Complexity: Quick
```

### Example 5: Backend Repo, Frontend Task (Task-Based Override)
```
User: "Fix the password reset email template - the button styling is broken"

Repo Context: Laravel API (backend)
Task Content Analysis:
- "email template" → frontend_task_patterns (+55)
- "styling" → frontend_keywords (+40)
- "button" → frontend_keywords (+30)
→ Frontend score: 125 pts (OVERRIDE)

Detection Result:
  ✅ Agent: frontend (PRIMARY, 125 pts) - leads template fix
  ✅ Agent: architect (SECONDARY, 40 pts) - Blade context + laravel-expert skill
  ✅ Model: sonnet
  ✅ Complexity: Standard
```

### Example 6: Frontend Repo, Database Task (Task-Based Override)
```
User: "The user list page is slow - optimize the query"

Repo Context: Next.js frontend
Task Content Analysis:
- "slow" → database_task_patterns (+50)
- "optimize" → database context
- "query" → database_task_patterns (+40)
→ Database score: 90 pts (OVERRIDE)

Detection Result:
  ✅ Agent: architect (PRIMARY, 90 pts) - database optimization
  ✅ Agent: frontend (SECONDARY, 40 pts) - API route context + nextjs-expert skill
  ✅ Model: sonnet
  ✅ Complexity: Standard
```

### Example 7: Backend Repo, PDF Generation (Task-Based Override)
```
User: "Invoice PDF has layout issues - table breaks across pages incorrectly"

Repo Context: Node.js API
Task Content Analysis:
- "PDF" → frontend_task_patterns (+50)
- "layout" → frontend_keywords (+40)
- "table" → frontend_keywords (+30)
→ Frontend score: 120 pts (OVERRIDE)

Detection Result:
  ✅ Agent: frontend (PRIMARY, 120 pts) - HTML/CSS for PDF
  ✅ Agent: architect (SECONDARY, 40 pts) - PDF library integration + nodejs-expert skill
  ✅ Model: sonnet
  ✅ Complexity: Standard
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

## Team Mode Detection

**When:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled.

Team mode spawns multiple Claude Code instances as **teammates** (persistent, peer-to-peer messaging, shared task list) instead of **subagents** (fire-and-forget, hub-spoke).

### Complexity Gate (CRITICAL — Token Savings)

**Team mode is ONLY for Deep complexity + multi-domain tasks.** All other tasks use single-agent or subagent mode to save tokens.

```toon
team_decision[5]{condition,mode,reason}:
  Complexity=Quick,single agent,Trivial task - no team overhead
  Complexity=Standard,subagent,Standard tasks never need teams - save tokens
  Complexity=Deep + 1 domain,subagent,Deep but single-focus - one agent sufficient
  Complexity=Deep + 2+ domains (≥50 each),team (if enabled),Only case for parallel teammates
  Agent Teams disabled,subagent,Feature not enabled - always subagent
```

**Token impact:** Team mode costs ~3x tokens (3 parallel context windows). Only justified when task requires parallel cross-domain work that would take 3x longer sequentially.

**Gate checks (ALL must pass):**
1. `isAgentTeamsEnabled()` returns true
2. Complexity = Deep
3. 2+ domains score ≥50 each
4. Task requires cross-domain collaboration (not just multiple files)

### Team Mode Output Format

When team mode is selected, output:

```markdown
## Detection Result
- **Agent:** architect (LEAD)
- **Mode:** team
- **Model:** opus
- **Complexity:** Deep
- **Team Composition:**
  - architect (lead) - system design, API endpoints
  - frontend (primary) - frontend components
  - tester (primary) - test strategy + TDD
- **Reason:** Multi-domain feature requiring parallel work
```

When team mode is NOT selected (most tasks), output:

```markdown
## Detection Result
- **Agent:** architect
- **Mode:** subagent
- **Model:** sonnet
- **Complexity:** Standard
- **Reason:** Single-domain task, team not needed
```

### After Detection — Handoff

```toon
handoff[3]{mode,action,target}:
  single agent,Execute directly in current session,N/A
  subagent,Use Task tool with subagent_type,Task(subagent_type="aura-frog:architect")
  team,Hand off to workflow-orchestrator for parallel startup,workflow-orchestrator → TeamCreate → parallel Task calls
```

**Team handoff:** Agent detector does NOT create the team. It returns the detection result with `Mode: team` and `Team Composition`. The **workflow-orchestrator** handles the actual parallel startup sequence (TeamCreate → TaskCreate → parallel Task spawns).

### Team Composition Rules

```toon
team_rules[4]{rule,detail}:
  Max teammates per phase,3 (lead + 2 primary)
  Lead selection,Highest scoring agent from detection
  Primary selection,Score 50-79 agents become teammates
  Minimum for team mode,2+ domains with score ≥50 each
```

---

## Manual Override

User can force specific agent:
```
User: "Use only tester for this task"
→ Override automatic selection
→ tester becomes PRIMARY regardless of scoring
```

---

**Full detection algorithm:** `agents/router.md`
**Selection guide:** `docs/AGENT_SELECTION_GUIDE.md`

**MANDATORY:** Always show agent banner at start of EVERY response.
