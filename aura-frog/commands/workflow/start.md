# Command: workflow:start

**Purpose:** Initialize and start Phase 1 of Aura Frog workflow
**Trigger:** `workflow:start <task-description>`

---

## Usage

```
workflow:start Refactor UserProfile component
workflow:start Add social media sharing feature
workflow:start Fix bug in payment API
workflow:start Implement JWT authentication
```

---

## Workflow

```toon
steps[4]{step,action}:
  1. Initialize,Generate workflow ID + create state file
  2. Detect,Identify project type + activate relevant agents
  3. Analyze,Execute Phase 1 Requirements Analysis
  4. Gate,Show approval prompt for Phase 2
```

---

## Agent Detection

```toon
detection[6]{keywords,agent}:
  mobile/ios/android,mobile-react-native
  web/react/vue,web-frontend
  api/backend/server,backend-*
  test/qa/cypress,qa-automation
  ui/design/figma,ui-designer
  always,pm-operations-orchestrator
```

---

## Phase 1 Deliverables

- Requirements analysis document
- Issue identification
- Implementation strategy
- Success criteria
- Risk assessment
- Story points + time estimate

---

## Files Created

```
.claude/logs/workflows/{workflow-id}/
├── workflow-state.json
├── task-context.md
├── deliverables/
│   └── PHASE_1_REQUIREMENTS_ANALYSIS.md
└── logs/
    └── phase-execution.log
```

---

## Approval Gate

After Phase 1 completes:
- `workflow:approve` → Proceed to Phase 2
- `workflow:reject` → Restart Phase 1
- `workflow:modify <feedback>` → Refine analysis
- `workflow:cancel` → Stop workflow

---

**Related:** `workflow:approve`, `workflow:status`, `workflow:phase:2`
**Version:** 2.0.0
