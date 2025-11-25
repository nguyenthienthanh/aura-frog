# Command: workflow:reject

**Version:** 1.0.0  
**Purpose:** Reject current phase and restart with feedback  
**Trigger:** User types `/workflow:reject <reason>` at approval gate

---

## 🎯 What This Command Does

1. Marks current phase as "rejected"
2. Saves user feedback
3. Restarts current phase with feedback context
4. Shows new approval gate after rework

---

## 📋 Command Format

```
/workflow:reject <reason>

Examples:
/workflow:reject Need to add more test cases for edge scenarios
/workflow:reject Architecture should use different state management approach
/workflow:reject Missing accessibility considerations in design
```

---

## ⚙️ Execution Flow

```
User types /workflow:reject <reason>
    ↓
Save rejection reason
    ↓
Mark phase as "rejected"
    ↓
Show feedback to agent
    ↓
Agent reworks deliverables
    ↓
Show new approval gate
```

---

## 🔄 Phase Restart Logic

```typescript
// Update workflow state
const state = loadWorkflowState();
const currentPhase = state.current_phase;

state.phases[currentPhase] = {
  ...state.phases[currentPhase],
  status: 'rejected',
  rejected_at: new Date().toISOString(),
  rejection_reason: userFeedback,
  retry_count: (state.phases[currentPhase].retry_count || 0) + 1,
};

saveWorkflowState(state);

// Restart phase with feedback
console.log(`\n🔄 Phase ${currentPhase} rejected. Restarting with feedback...\n`);
console.log(`Feedback: ${userFeedback}\n`);

// Agent reads feedback and reworks
await executePhase(currentPhase, { feedback: userFeedback });
```

---

## 📊 Rejection Examples

### Example 1: Requirements Phase
```
User: /workflow:reject Missing edge cases for empty input scenarios

Agent Response:
🔄 Phase 1 rejected. Restarting with feedback...

Feedback: Missing edge cases for empty input scenarios

Updating requirements analysis to include:
- Empty caption handling
- Null/undefined data handling
- Network timeout scenarios
- API failure edge cases

[Generates updated requirements document]

═══════════════════════════════════════════════════════════
🎯 PHASE 1 COMPLETE: Requirements Analysis (Updated)
═══════════════════════════════════════════════════════════

📊 Summary:
Updated requirements with additional edge cases

✅ Changes Made:
   • Added 4 edge case scenarios
   • Updated acceptance criteria
   • Enhanced risk assessment

[New approval gate...]
```

### Example 2: Technical Planning
```
User: /workflow:reject Should use Zustand instead of local state

Agent Response:
🔄 Phase 2 rejected. Restarting with feedback...

Feedback: Should use Zustand instead of local state

Revising architecture:
- Replace local state with Zustand store
- Update state management strategy
- Modify component props accordingly

[Generates updated tech spec]
```

### Example 3: Implementation
```
User: /workflow:reject Tests are not covering error scenarios properly

Agent Response:
🔄 Phase 5a rejected. Restarting with feedback...

Feedback: Tests are not covering error scenarios properly

Adding error scenario tests:
- API timeout handling
- Network error handling
- Validation error handling
- Concurrent request handling

[Adds 12 new test cases]
```

---

## ⚠️ Rejection Limits

To prevent infinite loops:

```typescript
const MAX_REJECTIONS_PER_PHASE = 3;

if (phase.retry_count >= MAX_REJECTIONS_PER_PHASE) {
  console.warn(`
⚠️  WARNING: Phase ${currentPhase} rejected ${MAX_REJECTIONS_PER_PHASE} times

This phase has been rejected multiple times.
Consider:
1. Providing more specific feedback
2. Modifying requirements instead of rejecting
3. Scheduling a discussion to clarify expectations

Would you like to:
a) Continue anyway (override limit)
b) Modify phase deliverables instead
c) Cancel workflow
  `);
}
```

---

## 📊 State Update

Updates `.claude/workflow-state.json`:

```json
{
  "phases": {
    "2": {
      "name": "Technical Planning",
      "status": "rejected",
      "rejected_at": "2025-11-24T15:30:00Z",
      "rejection_reason": "Should use Zustand instead of local state",
      "retry_count": 1,
      "attempts": [
        {
          "attempt": 1,
          "completed_at": "2025-11-24T15:25:00Z",
          "rejected_at": "2025-11-24T15:30:00Z",
          "reason": "Should use Zustand instead of local state"
        }
      ]
    }
  }
}
```

---

## 💡 Tips for Effective Feedback

### ✅ Good Rejection Feedback
```
/workflow:reject Need to add error handling for API timeout scenarios
/workflow:reject Architecture should separate business logic from UI components
/workflow:reject Test coverage should include boundary conditions (0, max values)
```

### ❌ Vague Feedback
```
/workflow:reject This is wrong
/workflow:reject Do it better
/workflow:reject Not good enough
```

**Be specific!** Agent needs clear guidance to improve.

---

## 🎯 What Happens Next

After rejection:
1. Agent reworks deliverables based on feedback
2. Phase re-executes
3. New approval gate shown
4. User can approve or reject again

---

**Status:** Active command  
**Related:** workflow:approve, workflow:modify, workflow:status

