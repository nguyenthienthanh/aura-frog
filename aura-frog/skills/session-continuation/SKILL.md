---
name: session-continuation
description: "Manage workflow state across sessions with handoff and resume. TOON-based state persistence."
autoInvoke: false
priority: high
model: haiku
triggers:
  - "handoff"
  - "save state"
  - "resume workflow"
  - "workflow:handoff"
  - "workflow:resume"
allowed-tools: Read, Write, Bash
---

# Session Continuation

Manage workflow state across sessions with handoff and resume.

---

## Plan State Variables

```toon
state_vars[4]{var,purpose,persistence}:
  AF_ACTIVE_PLAN,Current active plan path,Session temp file
  AF_SUGGESTED_PLAN,Branch-matched plan hint,Inferred from git branch
  AF_COMPLEXITY,Auto-detected task complexity,Session memory
  AF_ACTIVE_AGENTS,Currently active agents,Session memory
```

---

## Triggers

```toon
triggers[5]{trigger,action}:
  Token 150K (75%),Suggest handoff
  User says handoff/save,Execute handoff
  User says resume + ID,Execute resume
  Session ending,Auto-save state
  Incomplete workflow,Prompt to resume
```

---

## Handoff Flow

### 1. Detect Need

Triggers: Token >= 150K (75%), user request, or long workflow at phase boundary.

### 2. Save State

**Location:** `.claude/logs/workflows/[workflow-id]/workflow-state.json`

**Content:** workflow_id, status, current_phase, task description, agents, phases_completed (with deliverables), context (tech stack, key decisions, blockers), token_usage.

### 3. Output Summary

Show: workflow ID, phase progress, state file path, deliverables, key decisions, resume command (`workflow:resume <ID>`).

---

## Resume Flow

1. **Parse:** Extract workflow_id from `workflow:resume <ID>`
2. **Load:** Read state file, validate exists/valid/compatible version
3. **Restore:** Load project context, activate agents, load phase rules, restore decisions
4. **Show:** Resume summary with current phase and key decisions
5. **Continue:** Resume from saved phase

---

## Commands

| Command | Action |
|---------|--------|
| `workflow:handoff` | Save state + generate resume instructions |
| `workflow:resume <id>` | Load state + continue from last phase |
| `workflow:list` | Show all saved workflows with status |

---

## Auto-Save

Triggers: Phase completion, every 5 min, token milestones (100K/150K/175K). Silent -- no user notification except at warning thresholds.

---

## State Files

```
.claude/logs/workflows/
├── AUTH-123/
│   ├── workflow-state.json
│   ├── requirements.md, tech-spec.md, test-plan.md
└── README.md (index)
```

**Cleanup:** Completed: 30 days. Cancelled: 7 days. Paused: indefinitely.

---

## Error Handling

- **Not found:** Show available workflows, suggest `workflow:start`
- **Corrupted:** Attempt backup restore (workflow-state.backup.json)
- **Version mismatch:** Attempt migration

---

## TOON State Format (Token-Efficient)

```toon
workflow:
  id: AUTH-1234
  phase: 5
  status: in_progress

phases[5]{num,name,status}:
  1,Understand + Design,completed
  2,Test RED,completed
  3,Build GREEN,in_progress
  4,Refactor + Review,pending
  5,Finalize,pending

agents[2]: architect,tester
```

~160 tokens vs JSON ~600 tokens (73% reduction).

---
