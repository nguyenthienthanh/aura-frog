# Workflow Naming & Organization

**Version:** 2.0.0  
**Date:** 2025-11-24

---

## 🎯 Overview

CCPM v4.0 introduces **meaningful workflow names** parsed from user prompts and **organized log structure** for better tracking and management.

---

## 📋 Workflow Naming System

### How Names are Generated

**User Prompt → Meaningful Name → Unique ID**

```
User: "Refactor SocialMarketingCompositePost component"
  ↓
Name: "refactor-socialmarketingcompositepost"
  ↓
ID: "refactor-socialmarketingcompositepost-20251124-143022"
```

### Name Parsing Rules

| Pattern | Example Input | Generated Name |
|---------|--------------|----------------|
| **Refactor X** | "Refactor UserProfile component" | `refactor-userprofile-[timestamp]` |
| **Add X** | "Add user authentication" | `add-user-authentication-[timestamp]` |
| **Fix X** | "Fix login crash on iOS" | `fix-login-crash-[timestamp]` |
| **Implement X** | "Implement dashboard analytics" | `implement-dashboard-analytics-[timestamp]` |
| **Create X** | "Create payment gateway integration" | `create-payment-gateway-[timestamp]` |
| **Update X** | "Update API endpoints" | `update-api-endpoints-[timestamp]` |
| **Fallback** | "Optimize performance" | `optimize-performance-[timestamp]` |

### Examples

```bash
# Good workflow names (automatically parsed):
workflow:start "Refactor SocialMarketingPost component"
→ refactor-socialmarketingpost-20251124-143022

workflow:start "Add JWT authentication"
→ add-jwt-authentication-20251124-143530

workflow:start "Fix memory leak in UserList"
→ fix-memory-leak-in-userlist-20251124-144015

workflow:start "Implement dark mode support"
→ implement-dark-mode-support-20251124-144500
```

---

## 📁 Directory Structure

### New Organized Structure (v2.0)

```
ccpm/
├── .claude/logs/                           # All logs and execution data
│   ├── workflows/                  # Execution logs by workflow
│   │   └── [workflow-id]/
│   │       ├── execution.log       # Timestamped execution log
│   │       ├── phase-1.log         # Phase-specific logs
│   │       ├── phase-2.log
│   │       └── errors.log          # Error logs
│   └── contexts/                   # Workflow contexts & deliverables
│       └── [workflow-id]/
│           ├── README.md           # Workflow overview
│           ├── deliverables/       # Phase deliverables
│           │   ├── 01-requirements-analysis/
│           │   ├── 02-technical-planning/
│           │   ├── 03-design-review/
│           │   ├── 04-test-planning/
│           │   ├── 05-tdd-implementation/
│           │   ├── 06-code-review/
│           │   ├── 07-qa-validation/
│           │   ├── 08-documentation/
│           │   └── 09-notification/
│           └── phases/             # Phase-specific artifacts
│               ├── 01-requirements-analysis/
│               └── ...
```

### Old Structure (v1.0 - Deprecated)

```
ccpm/
└── context/                        # Old location
    └── [workflow-id]/
        ├── deliverables/
        ├── .claude/logs/
        └── task-context.md
```

---

## 🔄 Migration

### Automatic Migration

Run the migration script to move existing workflows:

```bash
bash scripts/workflow/migrate-workflows.sh
```

**What it does:**
1. ✅ Creates new `.claude/logs/workflows/` and `.claude/logs/workflows/` structure
2. ✅ Moves deliverables → `.claude/logs/workflows/[workflow-id]/deliverables/`
3. ✅ Moves logs → `.claude/logs/workflows/[workflow-id]/`
4. ✅ Converts `task-context.md` → `README.md`
5. ✅ Creates execution logs
6. ⚠️ Preserves old structure (manual cleanup needed)

### Manual Cleanup

After verifying migration:

```bash
# Remove old workflows
rm -rf .claude/logs/workflows/*

# Or remove entire old context folder
rm -rf .claude/logs/workflows/
```

---

## 📝 Phase Naming

### Phase Names (Numbered + Slugified)

| Phase | Display Name | Slug | Directory |
|-------|-------------|------|-----------|
| 1 | Requirements Analysis | `01-requirements-analysis` | `deliverables/01-requirements-analysis/` |
| 2 | Technical Planning | `02-technical-planning` | `deliverables/02-technical-planning/` |
| 3 | Design Review | `03-design-review` | `deliverables/03-design-review/` |
| 4 | Test Planning | `04-test-planning` | `deliverables/04-test-planning/` |
| 5 | TDD Implementation | `05-tdd-implementation` | `deliverables/05-tdd-implementation/` |
| 6 | Code Review | `06-code-review` | `deliverables/06-code-review/` |
| 7 | QA Validation | `07-qa-validation` | `deliverables/07-qa-validation/` |
| 8 | Documentation | `08-documentation` | `deliverables/08-documentation/` |
| 9 | Notification | `09-notification` | `deliverables/09-notification/` |

### Phase Deliverables Naming

```
# Phase 1
01-requirements-analysis/
├── requirements.md
├── user-stories.md
└── acceptance-criteria.md

# Phase 2
02-technical-planning/
├── tech-spec.md
├── architecture.md
└── lld.md

# Phase 4
04-test-planning/
├── test-plan.md
├── test-cases.md
└── coverage-goals.md
```

---

## 🔍 Finding Workflows

### By Name Pattern

```bash
# List all workflows
ls .claude/logs/workflows/

# Find refactor workflows
ls .claude/logs/workflows/ | grep refactor

# Find by date
ls .claude/logs/workflows/ | grep 20251124
```

### By Status

```bash
# Check workflow state
cat workflow-state.json | jq '.workflow_id, .status'

# List all workflow statuses
for dir in .claude/logs/workflows/*/; do
  id=$(basename "$dir")
  echo "$id"
done
```

### By Content

```bash
# Search in deliverables
grep -r "authentication" .claude/logs/workflows/*/deliverables/

# Search in execution logs
grep "ERROR" .claude/logs/workflows/*/execution.log
```

---

## 📊 Workflow State

### State File Location

`workflow-state.json` - Active workflow state

### State Structure (v2.0)

```json
{
  "workflow_id": "add-user-authentication-20251124-143530",
  "workflow_name": "add-user-authentication",
  "created_at": "2025-11-24T14:35:30Z",
  "status": "in_progress",
  "current_phase": 2,
  "current_phase_name": "technical-planning",
  "phases": {
    "1": {
      "name": "Requirements Analysis",
      "slug": "01-requirements-analysis",
      "status": "completed",
      "started_at": "2025-11-24T14:35:35Z",
      "completed_at": "2025-11-24T14:52:10Z",
      "deliverables": [
        "requirements.md",
        "user-stories.md"
      ]
    },
    "2": {
      "name": "Technical Planning",
      "slug": "02-technical-planning",
      "status": "in_progress",
      "started_at": "2025-11-24T14:52:15Z",
      "completed_at": null,
      "deliverables": []
    }
  },
  "context": {
    "task": "Add user authentication",
    "agents": ["pm-operations-orchestrator", "backend-laravel", "qa-automation"],
    "project_root": "/path/to/project",
    "user": "developer",
    "logs_dir": ".claude/logs/workflows/add-user-authentication-20251124-143530",
    "context_dir": ".claude/logs/workflows/add-user-authentication-20251124-143530"
  }
}
```

---

## 🎯 Benefits

### Meaningful Names
✅ Easy to identify workflows at a glance  
✅ No need to remember cryptic IDs  
✅ Clear purpose from filename  

### Organized Structure
✅ Logs separated from deliverables  
✅ Easy to find execution logs  
✅ Clean deliverable organization  
✅ Scalable for many workflows  

### Better Tracking
✅ Execution logs in one place  
✅ Phase-specific logs  
✅ Easy to debug issues  
✅ Clear workflow lifecycle  

---

## 📚 Usage Examples

### Starting a Workflow

```bash
# Method 1: Natural language
"Start a workflow to refactor UserProfile component"

# Method 2: Command style
workflow:start "Refactor UserProfile component"

# Method 3: Script
bash scripts/workflow/init-workflow.sh "Refactor UserProfile component"
```

### Checking Status

```bash
# Show current workflow
workflow:status

# Or read state file
cat workflow-state.json | jq '.workflow_id, .status, .current_phase_name'
```

### Accessing Deliverables

```bash
# List all deliverables for a workflow
ls .claude/logs/workflows/refactor-userprofile-20251124-143022/deliverables/

# Read specific phase deliverable
cat .claude/logs/workflows/[workflow-id]/deliverables/02-technical-planning/tech-spec.md
```

### Viewing Logs

```bash
# Execution log
tail -f .claude/logs/workflows/[workflow-id]/execution.log

# Phase-specific log
cat .claude/logs/workflows/[workflow-id]/phase-2.log

# Error log
cat .claude/logs/workflows/[workflow-id]/errors.log
```

---

## 🔧 Configuration

### Customize Name Parsing

Edit `scripts/workflow/init-workflow.sh`:

```bash
# Add custom patterns in parse_workflow_name() function
elif [[ "$cleaned" =~ [Oo]ptimize[[:space:]]+([a-zA-Z0-9 ]+) ]]; then
    name="optimize-$(echo "${BASH_REMATCH[1]}" | tr ' ' '-' | cut -c1-30)"
```

### Customize Directory Structure

Edit directory creation in `init-workflow.sh`:

```bash
# Add custom directories
mkdir -p "${CONTEXTS_DIR}/${workflow_id}/custom-artifacts"
mkdir -p "${WORKFLOWS_DIR}/${workflow_id}/performance-logs"
```

---

## ⚠️ Important Notes

1. **Unique IDs:** Timestamp ensures uniqueness even with same name
2. **Case Insensitive:** Names are lowercased automatically
3. **Special Chars:** Removed and replaced with dashes
4. **Length Limit:** Names truncated to 40 chars (readable length)
5. **Backwards Compatible:** Old structure still readable

---

**Workflow naming system makes CCPM workflows easier to manage and track! 🚀**

