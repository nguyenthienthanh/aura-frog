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
# TOKEN OPTIMIZATION: No file scanning tools. Detection uses in-memory patterns only.
---

# Agent Detector

**Runs FIRST for every message. No exceptions.**

---

## Complexity Detection

```toon
complexity[3]{level,criteria,approach}:
  Quick,"Single file / simple fix / clear scope","Direct implementation"
  Standard,"2-5 files / feature add / some unknowns","Scout then implement"
  Deep,"6+ files / architecture / vague scope","workflow-orchestrator"
```

## Model Selection

```toon
model_map[3]{complexity,model,override}:
  Quick,haiku,Never
  Standard,sonnet,"opus for architecture/design"
  Deep,sonnet,"opus for planning phase"
```

```toon
agent_defaults[10]{agent,model,opus_when}:
  lead,haiku,Never
  scanner,haiku,Never
  router,haiku,Never
  architect,sonnet,"Schema design / system architecture"
  frontend,sonnet,"Design system architecture"
  mobile,sonnet,"Architecture decisions"
  strategist,sonnet,"Business strategy / ROI"
  security,sonnet,"opus for full audits"
  tester,sonnet,Never
  devops,sonnet,"Infrastructure architecture"
```

---

## Detection Layers (Priority Order)

### Layer 0: Task Content (Highest)
Analyze the task itself — a backend repo may have frontend tasks. Task content score ≥50 overrides repo-based detection.

```toon
task_triggers[7]{category,patterns,agent,boost}:
  Frontend,"html template/blade/email/pdf styling/css",frontend,+50-60
  Backend,"api endpoint/controller/middleware/webhook",architect,+50-55
  Database,"migration/schema/query optimization/n+1",architect,+55-60
  Security,"xss/sql injection/csrf/vulnerability",security,+55-60
  DevOps,"docker/kubernetes/ci-cd/terraform",devops,+50-55
  Testing,"unit test/e2e/coverage/mock/fixture",tester,+45-55
  Design,"figma/wireframe/design system",frontend,+50-60
```

### Layer 1: Explicit Technology (+60)
User directly mentions: react-native/flutter/angular/vue/react/next/node/python/go/laravel → corresponding agent.

### Layer 2: Intent Detection (+50)
Action keywords: implement/fix/test/design/database/security/performance/deploy → corresponding agent.

### Layer 3: Project Context (+40)
Package files/configs: app.json+expo→mobile, angular.json→frontend, go.mod→architect, etc.
Use cached detection from `.claude/project-contexts/[project]/project-detection.json` when valid (<24h).

### Layer 4: File Patterns (+20)
Recent file naming: *.phone.tsx→mobile, *.vue→frontend, *.go→architect, etc.

---

## Scoring & Selection

```toon
thresholds[4]{level,score,role}:
  Primary,≥80,Leads task
  Secondary,50-79,Supporting role
  Optional,30-49,May assist
  Skip,<30,Not selected
```

**tester:** Always secondary for implementation/bugfix tasks. Primary only for explicit test requests.

## Detection Cache

Cache at `.claude/cache/agent-detection-cache.json`. Reuse within same workflow (phase >1). Invalidate on: new workflow, phase 1, user override.

## Output Format

```
## Detection Result
- **Agent:** [name]
- **Model:** [model]
- **Complexity:** [level]
- **Reason:** [brief]
```
