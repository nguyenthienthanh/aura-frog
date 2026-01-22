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

**Purpose:** Manage workflow state across sessions with handoff and resume
**Priority:** HIGH
**Version:** 2.0.0

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

## When This Skill Activates

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

### Step 1: Detect Need for Handoff

```yaml
Triggers:
  - Token count: >= 150,000 (75% of 200K limit)
  - User request: "handoff", "save", "pause"
  - Long workflow: Phases 1-4 complete, starting Phase 5

Auto-prompt:
  "⚠️ Token usage is at 75%. Would you like to save workflow state for continuation in a new session?"
```

### Step 2: Save Workflow State

**State File Location:** `.claude/logs/workflows/[workflow-id]/workflow-state.json`

**State Content:**
```json
{
  "workflow_id": "AUTH-123",
  "version": "1.0.0",
  "created_at": "2025-11-29T14:30:22Z",
  "updated_at": "2025-11-29T16:45:30Z",
  "status": "paused",

  "current_phase": 5,
  "current_sub_phase": "a",
  "phase_name": "Write Tests (TDD RED)",

  "task": {
    "description": "Implement user authentication with JWT",
    "ticket_id": "PROJ-1234",
    "figma_url": null
  },

  "agents": {
    "primary": "backend-nodejs",
    "secondary": ["security-expert", "qa-automation"]
  },

  "phases_completed": {
    "1": {
      "name": "Requirements Analysis",
      "status": "approved",
      "deliverables": ["requirements.md"],
      "approved_at": "2025-11-29T14:45:00Z"
    },
    "2": {
      "name": "Technical Planning",
      "status": "approved",
      "deliverables": ["tech-spec.md", "architecture.md"],
      "approved_at": "2025-11-29T15:10:00Z"
    },
    "3": {
      "name": "UI Breakdown",
      "status": "skipped",
      "skip_reason": "Backend-only feature",
      "approved_at": "2025-11-29T15:12:00Z"
    },
    "4": {
      "name": "Test Planning",
      "status": "approved",
      "deliverables": ["test-plan.md"],
      "approved_at": "2025-11-29T15:30:00Z"
    }
  },

  "context": {
    "project_name": "my-api",
    "tech_stack": "Node.js, Express, PostgreSQL",
    "test_framework": "Jest",
    "key_decisions": [
      "Using JWT with refresh tokens",
      "Storing sessions in Redis",
      "bcrypt for password hashing"
    ],
    "blockers": [],
    "notes": "User prefers functional approach over classes"
  },

  "token_usage": {
    "at_handoff": 152340,
    "estimated_remaining": 47660
  }
}
```

### Step 3: Generate Handoff Summary

**Output to User:**

```markdown
═══════════════════════════════════════════════════════════
🔄 WORKFLOW HANDOFF COMPLETE
═══════════════════════════════════════════════════════════

📋 **Workflow ID:** AUTH-123

📊 **Progress:**
- ✅ Phase 1: Requirements Analysis - Approved
- ✅ Phase 2: Technical Planning - Approved
- ⏭️ Phase 3: UI Breakdown - Skipped (backend-only)
- ✅ Phase 4: Test Planning - Approved
- 🔄 Phase 5a: Write Tests - In Progress

📁 **State Saved:**
`.claude/logs/workflows/AUTH-123/workflow-state.json`

📦 **Deliverables Created:**
- requirements.md
- tech-spec.md
- architecture.md
- test-plan.md

🔑 **Key Decisions:**
- Using JWT with refresh tokens
- Storing sessions in Redis
- bcrypt for password hashing

───────────────────────────────────────────────────────────
📥 **TO RESUME IN NEW SESSION:**

Type: `workflow:resume AUTH-123`

Or copy this command:
```
workflow:resume AUTH-123
```
═══════════════════════════════════════════════════════════
```

---

## Resume Flow

### Step 1: Parse Resume Command

```yaml
Input: "workflow:resume AUTH-123"
       "resume AUTH-123"
       "continue workflow AUTH-123"

Extract: workflow_id = "AUTH-123"
```

### Step 2: Load Workflow State

```yaml
Load: .claude/logs/workflows/[workflow-id]/workflow-state.json

Validate:
  - File exists
  - JSON is valid
  - Version compatible
  - Status is "paused" or "waiting_approval"
```

### Step 3: Restore Context

```yaml
Actions:
  1. Load project context (project-contexts/[project]/)
  2. Activate saved agents
  3. Load phase-specific rules
  4. Restore key decisions
  5. Load deliverables created so far
```

### Step 4: Show Resume Summary

```markdown
═══════════════════════════════════════════════════════════
🔄 WORKFLOW RESUMED
═══════════════════════════════════════════════════════════

📋 **Workflow:** AUTH-123
📝 **Task:** Implement user authentication with JWT

📊 **Restored State:**
- Current Phase: 5a - Write Tests (TDD RED)
- Primary Agent: backend-nodejs
- Tech Stack: Node.js, Express, PostgreSQL

✅ **Completed Phases:**
- Phase 1: Requirements Analysis ✓
- Phase 2: Technical Planning ✓
- Phase 3: UI Breakdown (skipped) ✓
- Phase 4: Test Planning ✓

🔑 **Key Decisions Restored:**
- Using JWT with refresh tokens
- Storing sessions in Redis
- bcrypt for password hashing

───────────────────────────────────────────────────────────
⏭️ **CONTINUING FROM:** Phase 5a - Write Tests

Ready to continue writing tests for authentication.

Type "continue" to proceed or "status" for more details.
═══════════════════════════════════════════════════════════
```

### Step 5: Continue Execution

```yaml
On "continue":
  1. Resume from saved phase
  2. Show agent banner
  3. Execute remaining phase steps
  4. Show approval gate when phase complete
```

---

## Commands

### workflow:handoff

**Syntax:** `workflow:handoff`

**Action:** Save current workflow state and generate resume instructions.

### workflow:resume

**Syntax:** `workflow:resume <workflow-id>`

**Action:** Load saved workflow state and continue from last phase.

### workflow:list

**Syntax:** `workflow:list`

**Action:** Show all saved workflows with status.

**Output:**
```markdown
📋 Saved Workflows:

| ID | Task | Phase | Status | Last Updated |
|----|------|-------|--------|--------------|
| AUTH-123 | JWT Auth | 5a | paused | 2h ago |
| fix-login-0128 | Login fix | 7 | waiting | 1d ago |
| REFACTOR-789 | API refactor | complete | done | 3d ago |

To resume: `workflow:resume <id>`
```

---

## Auto-Save Behavior

### When Auto-Save Triggers

```yaml
Events:
  - Phase completion (before approval gate)
  - Every 5 minutes during active work
  - Token count milestones (100K, 150K, 175K)
  - Before any external system write
```

### Auto-Save is Silent

```yaml
Behavior:
  - No user notification for routine saves
  - Only notify at warning thresholds
  - State file updated in background
```

---

## State File Management

### File Location

```
.claude/logs/workflows/
├── AUTH-123/
│   ├── workflow-state.json      # Current state
│   ├── requirements.md          # Phase 1 deliverable
│   ├── tech-spec.md            # Phase 2 deliverable
│   └── test-plan.md            # Phase 4 deliverable
├── fix-login-0128/
│   └── ...
└── README.md                    # Index of workflows
```

### Cleanup Policy

```yaml
Auto-cleanup:
  - Completed workflows: Keep 30 days
  - Cancelled workflows: Keep 7 days
  - Paused workflows: Keep indefinitely

Manual cleanup:
  - Command: workflow:cleanup
  - Removes old completed/cancelled workflows
```

---

## Error Handling

### State File Not Found

```markdown
❌ Workflow not found: AUTH-123

Possible reasons:
- Workflow ID is incorrect
- State file was deleted
- Workflow was never saved

Available workflows:
[list recent workflows]

To start a new workflow: `workflow:start <task>`
```

### Corrupted State File

```markdown
❌ Cannot load workflow state: Invalid JSON

Attempting recovery...
- Found backup: workflow-state.backup.json
- Restored from backup (15 minutes old)

⚠️ Some recent progress may be lost.

Continue with restored state? (yes/no)
```

### Version Mismatch

```markdown
⚠️ Workflow was created with Aura Frog v0.9.0
Current version: v1.0.0

Attempting migration...
✅ State migrated successfully

Continue? (yes/no)
```

---

## Best Practices

### DO:
- Handoff before token limit (at 150K)
- Include workflow ID in task tracking
- Resume promptly to maintain context
- Review key decisions after resume

### DON'T:
- Wait until 200K tokens (may truncate)
- Delete state files manually
- Resume with different project context
- Skip the resume summary review

---

## TOON State Format (Token-Efficient)

```toon
# .claude/workflow-state.toon
workflow:
  id: AUTH-1234
  phase: 5
  status: in_progress

phases[9]{num,name,status}:
  1,Requirements,completed
  2,Tech Planning,completed
  3,UI Breakdown,skipped
  4,Test Planning,completed
  5,TDD Implementation,in_progress
  6,Code Review,pending
  7,QA Validation,pending
  8,Documentation,pending
  9,Notification,pending

agents[2]: backend-nodejs,qa-automation
```

**Token savings:** TOON uses ~160 tokens vs JSON ~600 tokens (73% reduction)

---

**Version:** 2.0.0
**Last Updated:** 2025-12-23
