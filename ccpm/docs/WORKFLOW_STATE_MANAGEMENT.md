# 🗂️ Workflow State Management

**Version:** 1.0.0  
**Purpose:** Manage multiple concurrent workflows

---

## 📊 Overview

CCPM v4.2+ supports **multiple concurrent workflows** with independent state management.

---

## 🏗️ State Structure

### Previous (Single Workflow)

```
ccpm/
└── workflow-state.json  ❌ Only one workflow at a time
```

**Problem:** Can't have multiple workflows simultaneously

### Current (Multi-Workflow)

```
ccpm/
├── active-workflow.txt          → Current active workflow ID
└── .claude/logs/
    └── workflows/
        ├── workflow-1/
        │   ├── workflow-state.json  ← Workflow 1 state
        │   └── execution.log
        ├── workflow-2/
        │   ├── workflow-state.json  ← Workflow 2 state
        │   └── execution.log
        └── workflow-3/
            ├── workflow-state.json  ← Workflow 3 state
            └── execution.log
```

**Benefits:**
✅ Multiple workflows simultaneously  
✅ Each workflow has independent state  
✅ Easy to switch between workflows  
✅ No state conflicts  

---

## 📁 File Locations

### Workflow State

**Location:**
```
logs/workflows/[workflow-id]/workflow-state.json
```

**Contains:**
- Workflow metadata
- Current phase
- Phase history
- Token usage
- Deliverables list
- Agent list

### Active Workflow Pointer

**Location:**
```
active-workflow.txt
```

**Contains:**
```
add-user-authentication-20251124-120000
```

**Purpose:** Points to currently active workflow

### Workflow Logs

**Location:**
```
logs/workflows/[workflow-id]/
├── workflow-state.json
├── execution.log
├── phase-1.log
├── phase-2.log
├── tokens.log
└── errors.log
```

### Workflow Context

**Location:**
```
logs/contexts/[workflow-id]/
├── README.md
├── HANDOFF_CONTEXT.md
├── deliverables/
│   ├── 01-requirements-analysis/
│   ├── 02-technical-planning/
│   └── ...
└── phases/
```

---

## 🎮 Workflow Management

### List All Workflows

```bash
bash scripts/workflow/workflow-manager.sh list

# Output:
📋 All Workflows:

⏳ add-user-authentication [ACTIVE]
   ID: add-user-authentication-20251124-120000
   Phase: 5/9 | Status: in_progress
   Created: 2025-11-24T12:00:00Z

✅ refactor-userprofile
   ID: refactor-userprofile-20251124-110000
   Phase: 9/9 | Status: completed
   Created: 2025-11-24T11:00:00Z

⏸️  add-dark-mode
   ID: add-dark-mode-20251124-130000
   Phase: 2/9 | Status: initialized
   Created: 2025-11-24T13:00:00Z
```

### Switch Workflow

```bash
bash scripts/workflow/workflow-manager.sh switch [workflow-id]

# Or in Claude
workflow:switch add-dark-mode-20251124-130000
```

### Load Workflow State

```bash
bash scripts/workflow/workflow-manager.sh load [workflow-id]

# Returns JSON state
```

### Delete Workflow

```bash
bash scripts/workflow/workflow-manager.sh delete [workflow-id]

# Confirmation required
```

### Archive Workflow

```bash
bash scripts/workflow/workflow-manager.sh archive [workflow-id]

# Creates .tar.gz archive
```

---

## 🔄 Workflow Lifecycle

### 1. Create Workflow

```bash
workflow:start "Add user authentication"

# Creates:
# - .claude/logs/workflows/add-user-auth-20251124-120000/
# - .claude/logs/workflows/add-user-auth-20251124-120000/
# - Sets as active workflow
```

### 2. Work on Workflow

```
# All commands operate on active workflow
workflow:status
workflow:progress
workflow:approve
# etc.
```

### 3. Switch Workflows

```bash
# Start another workflow (pauses current)
workflow:start "Refactor UserProfile"

# Now "refactor-userprofile" is active
# Previous workflow is paused

# Switch back
workflow:switch add-user-auth-20251124-120000
# Now "add-user-auth" is active again
```

### 4. Complete Workflow

```
# After Phase 9 completion
workflow-state.json → status: "completed"
# Remains in .claude/logs/ for reference
```

### 5. Archive/Delete

```bash
# Archive old workflows
bash scripts/workflow/workflow-manager.sh archive [old-workflow-id]

# Delete if not needed
bash scripts/workflow/workflow-manager.sh delete [workflow-id]
```

---

## 💡 Use Cases

### Concurrent Development

**Scenario:** Working on multiple features

```bash
# Feature 1: Authentication
workflow:start "Add authentication"
# ... work on Phase 1-2 ...

# Feature 2: Dark mode (while waiting for auth review)
workflow:start "Add dark mode"
# ... work on Phase 1 ...

# Switch back to auth
workflow:switch add-authentication-20251124-120000
# Continue auth workflow
```

### Handoff & Resume

**Scenario:** Token limit reached

```bash
# Session 1
workflow:start "Large refactoring"
# ... Phase 1-4 complete (150K tokens) ...
workflow:handoff

# Session 2 (new chat)
workflow:resume large-refactoring-20251124-100000
# Loads state from .claude/logs/workflows/[id]/
# Continues seamlessly
```

### Parallel Teams

**Scenario:** Multiple developers

```bash
# Dev 1: Feature A
workflow:start "Feature A"

# Dev 2: Feature B
workflow:start "Feature B"

# Each has independent state
# No conflicts!
```

---

## 🔍 State Management API

### Get Active Workflow

```bash
cat active-workflow.txt

# Returns:
add-user-authentication-20251124-120000
```

### Load Workflow State

```typescript
const workflowId = readFile('active-workflow.txt').trim();
const statePath = `.claude/logs/workflows/${workflowId}/workflow-state.json`;
const state = JSON.parse(readFile(statePath));
```

### Update Workflow State

```typescript
const statePath = `.claude/logs/workflows/${workflowId}/workflow-state.json`;
state.current_phase = 5;
state.phases[5].status = 'in_progress';
writeFile(statePath, JSON.stringify(state, null, 2));
```

### Switch Workflow

```typescript
writeFile('active-workflow.txt', newWorkflowId);
```

---

## 📊 State File Structure

```json
{
  "workflow_id": "add-user-authentication-20251124-120000",
  "workflow_name": "add-user-authentication",
  "created_at": "2025-11-24T12:00:00Z",
  "updated_at": "2025-11-24T13:30:00Z",
  "status": "in_progress",
  "current_phase": 5,
  "current_phase_name": "05-tdd-implementation",
  "total_tokens_used": 155000,
  "total_tokens_remaining": 45000,
  "auto_continue": true,
  
  "sessions": [
    {
      "session_id": "session-1",
      "started_at": "2025-11-24T12:00:00Z",
      "ended_at": "2025-11-24T13:00:00Z",
      "tokens_used": 155000,
      "phases_completed": [1, 2, 3, 4]
    }
  ],
  
  "phases": {
    "1": {
      "name": "Requirements Analysis",
      "slug": "01-requirements-analysis",
      "status": "completed",
      "started_at": "2025-11-24T12:00:00Z",
      "completed_at": "2025-11-24T12:07:00Z",
      "duration_ms": 420000,
      "tokens": {
        "start": 5000,
        "end": 30000,
        "phase_tokens": 25000,
        "cumulative_tokens": 25000
      },
      "deliverables": [
        "requirements.md",
        "user-stories.md"
      ]
    }
    // ... phases 2-9 ...
  },
  
  "context": {
    "task": "Add user authentication",
    "agents": [
      "pm-operations-orchestrator",
      "mobile-react-native",
      "qa-automation"
    ],
    "project_root": "/path/to/project",
    "user": "developer",
    "logs_dir": ".claude/logs/workflows/add-user-authentication-20251124-120000",
    "context_dir": ".claude/logs/workflows/add-user-authentication-20251124-120000"
  },
  
  "handoffs": [
    {
      "at_phase": 4,
      "at_tokens": 155000,
      "timestamp": "2025-11-24T13:00:00Z",
      "handoff_file": "HANDOFF_CONTEXT.md"
    }
  ]
}
```

---

## 🎯 Best Practices

### 1. Name Workflows Clearly

```bash
# Good
workflow:start "Add JWT authentication"
workflow:start "Refactor UserProfile component"
workflow:start "Fix login crash on iOS"

# Bad
workflow:start "Update stuff"
workflow:start "Changes"
```

### 2. One Active Workflow

**At any time:**
- One workflow = ACTIVE (being worked on)
- Others = PAUSED (saved state)

**Switch when:**
- Waiting for review
- Need to work on urgent fix
- Token limit approaching

### 3. Clean Up Completed

```bash
# After workflow complete
workflow:status  # Verify completed

# Archive for reference
bash workflow-manager.sh archive [id]

# Or delete if not needed
bash workflow-manager.sh delete [id]
```

### 4. Use Handoff for Long Workflows

```bash
# At 150K tokens
workflow:handoff

# New session
workflow:resume [id]
# State loads from .claude/logs/workflows/[id]/
```

---

## 🔧 Migration

### From Single State (Old)

**If you have `workflow-state.json`:**

```bash
# Move to new structure
mkdir -p .claude/logs/workflows/legacy-workflow
mv workflow-state.json \
   .claude/logs/workflows/legacy-workflow/workflow-state.json

# Set as active
echo "legacy-workflow" > active-workflow.txt
```

---

## ⚠️ Important Notes

1. **Active Workflow Pointer**
   - Always check `active-workflow.txt` first
   - Commands operate on active workflow
   - Switch with `workflow:switch`

2. **State Independence**
   - Each workflow has separate state
   - No cross-workflow interference
   - Safe to run concurrently

3. **Token Tracking**
   - Per-workflow token tracking
   - Independent limits
   - Each workflow starts fresh

4. **Handoff & Resume**
   - State persists in `.claude/logs/workflows/[id]/`
   - Resume loads from there
   - No dependency on single state file

---

## 📚 Related

- **scripts/workflow/workflow-manager.sh** - Management script
- **scripts/workflow/init-workflow.sh** - Create workflow
- **commands/workflow/switch.md** - Switch command
- **SESSION_CONTINUATION_GUIDE.md** - Handoff/resume

---

**Multiple workflows = Better organization! 🎯**

---

*Version: 1.0.0*  
*Added: CCPM v4.2*  
*Multi-workflow support*

