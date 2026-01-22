# Command: workflow:resume

**Purpose:** Resume workflow from previous session
**Aliases:** `resume`, `continue workflow`, `load workflow`

---

## Usage

```
workflow:resume <workflow-id>
workflow:resume AUTH-456
"Resume the authentication workflow"
```

---

## Workflow

```toon
steps[5]{step,action}:
  1. Load,Read workflow-state.json + HANDOFF_CONTEXT.md
  2. Validate,Check workflow exists + verify git state
  3. Detect,Compare branches + check for external changes
  4. Restore,Load context + set current phase
  5. Continue,Resume from last phase with full context
```

---

## Files Loaded

```toon
files[4]{file,content}:
  workflow-state.json,Current phase + progress + pending tasks
  HANDOFF_CONTEXT.md,Summary for session continuation
  task-context.md,Original requirements + decisions
  deliverables/,Phase outputs created so far
```

---

## Git Validation

```toon
checks[3]{check,action_if_fail}:
  Branch match,Warn + offer to switch
  Commit exists,Warn + show current state
  No conflicts,Show changes + ask to proceed
```

---

## Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WORKFLOW RESUMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workflow: add-user-authentication
Phase: 5b - TDD GREEN (in progress)
Progress: 60% complete

📋 Pending Tasks:
1. Implement login API endpoint
2. Add password validation

💡 Continue with: workflow:approve
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Version:** 2.0.0
