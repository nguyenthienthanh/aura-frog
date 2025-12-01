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

### Default Flow (WITH Brainstorming)

```
User types /workflow:reject <reason>
    ↓
Agent BRAINSTORMS feedback:
  - Analyze suggestion
  - Consider alternatives
  - Present options with pros/cons
    ↓
User chooses approach
    ↓
Agent reworks deliverables
    ↓
Show new approval gate
```

### Force Mode (Skip Brainstorming)

```
User types /workflow:reject must do: <reason>
    ↓
Skip brainstorming
    ↓
Agent directly implements feedback
    ↓
Show new approval gate
```

**Force phrases:** "must do:", "just do:", "work like that", "I insist"

See: `rules/feedback-brainstorming.md`

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

### Example 1: With Brainstorming (Default)
```
User: /workflow:reject Should use Redux instead of Zustand

Agent Response:
🤔 I hear your feedback: Use Redux instead of Zustand.

Before I switch, let me consider:

**Current context:**
- Project already uses Zustand (src/stores/)
- Team is familiar with Zustand patterns
- Bundle size: Zustand 2KB vs Redux 7KB

**Options I see:**

**Option A: Switch to Redux** (your suggestion)
- Pros: More ecosystem, great devtools, middleware
- Cons: More boilerplate, migration effort, larger bundle

**Option B: Stay with Zustand**
- Pros: Already set up, simpler API, smaller bundle
- Cons: Less middleware options

**Option C: Zustand + middleware** (hybrid)
- Pros: Keep simplicity, add persistence/devtools
- Cons: Additional setup

Which approach would you prefer? (A/B/C)

💡 Tip: Say "must do: Redux" to skip discussion next time.
```

### Example 2: Force Mode (Skip Brainstorming)
```
User: /workflow:reject must do: use Redux instead of Zustand

Agent Response:
✅ Got it! Implementing Redux as requested.

🔄 Restarting Phase 2 with Redux architecture...

[Directly implements Redux without discussion]
```

### Example 3: Simple Feedback (Light Brainstorming)
```
User: /workflow:reject Missing edge cases for empty input

Agent Response:
🤔 Good catch! Adding edge cases for empty input.

Quick thought: Should I also add edge cases for:
- Null/undefined values?
- Whitespace-only input?
- Max length exceeded?

Or just empty string handling?

(Say "just empty" or "all of them")
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

Updates `workflow-state.json`:

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
1. **Agent brainstorms** (unless force mode)
2. User confirms approach
3. Agent reworks deliverables
4. Phase re-executes
5. New approval gate shown
6. User can approve or reject again

**Skip brainstorming:** Use "must do:", "just do:", or "work like that"

---

**Status:** Active command  
**Related:** workflow:approve, workflow:modify, workflow:status

