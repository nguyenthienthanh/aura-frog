# Command: workflow:approve

**Purpose:** Approve current phase and proceed to next phase  
**Trigger:** User types `/workflow:approve` at approval gate

---

## 🎯 What This Command Does

1. Marks current phase as "approved"
2. Updates workflow state
3. Proceeds to next phase automatically
4. Shows next phase banner

---

## 📋 Command Format

```
/workflow:approve

# Optional: Add comment
/workflow:approve Looks good, proceed
```

---

## ⚙️ Execution Flow

```
User types /workflow:approve
    ↓
Update workflow state:
  - phases[current].status = "approved"
  - phases[current].approved_at = timestamp
  - current_phase = current_phase + 1
    ↓
Show transition message:
  "✅ Phase X approved"
  "⏭️  Proceeding to Phase Y..."
    ↓
Auto-execute next phase
    ↓
Show new approval gate
```

---

## 🔄 Phase Transitions

### From Phase 1 → Phase 2
```
✅ Phase 1: Requirements Analysis approved
⏭️  Proceeding to Phase 2: Test RED...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PHASE 2: Test RED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Phase 2 executes...]
```

### From Phase 2 → Phase 3 (TDD workflow)
```
✅ Phase 2: Test RED approved
⏭️  Proceeding to Phase 3: Build GREEN...

🔴 Tests written: 15 tests
🔴 All tests failing (expected)

Now implementing code to make tests pass...
```

### From Phase 5 → Complete
```
✅ Phase 5: Finalize approved

🎉 WORKFLOW COMPLETE!

Summary:
- Duration: 1 hour 15 minutes
- Phases: 5/5 completed
- Deliverables: 12 files
- Tests: 53 passing (87% coverage)

All done! 🚀
```

---

## 📊 State Update

Updates `workflow-state.json`:

```json
{
  "workflow_id": "...",
  "current_phase": 2,  // Incremented
  "phases": {
    "1": {
      "status": "approved",  // Updated
      "approved_at": "2025-11-24T04:30:00Z",  // Added
      "approved_by": "user"
    },
    "2": {
      "status": "in_progress"  // Auto-started
    }
  }
}
```

---

## ⚠️ Validation

Before approving, command checks:
- [ ] Current phase is "completed" (not "in_progress" or "pending")
- [ ] Deliverables exist
- [ ] Success criteria met
- [ ] No blocking issues

If validation fails:
```
❌ Cannot approve: Phase not complete

Current status: in_progress
Missing: deliverables not generated

Please wait for phase to complete.
```

---

## 🎯 Auto-Execute Next Phase

After approval, automatically runs:
- Pre-phase hook (load context, verify prerequisites)
- Phase execution (agent work)
- Post-phase hook (validate, generate summary)
- Pre-approval hook (show approval gate)

User just needs to review and approve again.

---

## ✅ Success Criteria

- [ ] Current phase marked as approved
- [ ] Workflow state updated
- [ ] Next phase started automatically
- [ ] New approval gate shown
- [ ] Logs updated

---

**Status:** Active command  
**Related:** workflow:reject, workflow:modify, workflow:status

