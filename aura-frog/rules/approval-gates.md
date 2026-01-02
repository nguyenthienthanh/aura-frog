# Approval Gates - Phase Transition Control

**Version:** 2.0.0
**Purpose:** Streamlined 2-gate approval workflow (v1.8.0)
**Priority:** CRITICAL - Core workflow mechanism

---

## 🎯 Core Principle (v1.8.0 Update)

**RULE:** Only **2 approval gates** - Phase 2 (Design) and Phase 5b (Implementation).

### Two Types of Phase Transitions

| Type | Phases | Behavior |
|------|--------|----------|
| **✋ Approval Gate** | Phase 2, 5b | Execute → Show deliverables → **WAIT for approval** |
| **⚡ Auto-Continue** | 1, 3, 4, 5a, 5c, 6, 7, 8, 9 | Execute → Show deliverables → **Continue automatically** |

### Flow Diagram

```
Approval Gate:     Execute → Deliverables → STOP → Wait → User approves → Continue
Auto-Continue:     Execute → Deliverables → Continue (no wait)
```

**IMPORTANT:** Auto-continue phases are NOT skipped. They:
1. ✅ Execute fully
2. ✅ Show deliverables/summary
3. ✅ Continue automatically (no user action needed)

---

## 🚦 Approval Gate Workflow

### State Machine

```
[Phase Execution]
      ↓
[Phase Complete]
      ↓
[Generate Summary]
      ↓
[Show Approval Prompt] ← YOU ARE HERE
      ↓
   Wait for user input...
      ↓
[User Response?]
   ├─ "approve" → [Next Phase]
   ├─ "reject" → [Rollback/Restart]
   ├─ "modify" → [Stay in current phase]
   └─ timeout → [Stay in current phase]
```

---

## 📋 Approval Prompt Format

### Standard Template

```markdown
═══════════════════════════════════════════════════════════
🎯 PHASE {N} COMPLETE: {Phase Name}
═══════════════════════════════════════════════════════════

📊 **Summary:**
{Brief summary of what was accomplished}

📦 **Deliverables:**
- {Deliverable 1}
- {Deliverable 2}
- {Deliverable 3}

✅ **Success Criteria Met:**
- [x] {Criterion 1}
- [x] {Criterion 2}
- [x] {Criterion 3}

⏭️  **Next Phase:** Phase {N+1} - {Next Phase Name}
{Brief description of what happens next}

───────────────────────────────────────────────────────────
⚠️  **ACTION REQUIRED**

Please review the above and respond:

Type "approve" → Proceed to Phase {N+1}
Type "reject"  → Restart Phase {N} with feedback
Type "modify"  → Make changes before proceeding
Type "cancel"  → Stop workflow

Your response:
═══════════════════════════════════════════════════════════
```

---

## 🔒 Phase Transition Details

### ⚡ Phase 1: Requirements Analysis → AUTO-CONTINUE
```yaml
Type: Auto-continue (no approval needed)
Must show:
  - Parsed requirements
  - Identified scope
  - Edge cases
  - Success criteria

Then: Continues automatically to Phase 2
```

### ✋ Phase 2: Technical Planning → APPROVAL GATE (1 of 2)
```yaml
Type: APPROVAL REQUIRED
Must show:
  - Architecture diagram
  - Component breakdown
  - File changes list
  - Technology decisions

User confirms:
  - Approach is correct
  - No better alternatives
  - Acceptable complexity

After approval: Auto-continues through Phase 3, 4, 5a
```

### ⚡ Phase 3: Design Review → AUTO-CONTINUE
```yaml
Type: Auto-continue (no approval needed)
Skip if: Backend-only task (no UI)
Must show:
  - UI/UX analysis
  - Component structure
  - Design alignment

Then: Continues automatically to Phase 4
```

### ⚡ Phase 4: Test Planning → AUTO-CONTINUE
```yaml
Type: Auto-continue (no approval needed)
Must show:
  - Test strategy
  - Test cases list
  - Coverage plan

Then: Continues automatically to Phase 5a
```

### ⚡ Phase 5a: Write Tests (RED) → AUTO-CONTINUE
```yaml
Type: Auto-continue (with auto-stop condition)
Must show:
  - Test files created
  - Test execution report (all failing)
  - Coverage report

AUTO-STOP if: Tests pass (they should fail!) → Fix tests first
Then: Continues automatically to Phase 5b
```

### ✋ Phase 5b: Implementation (GREEN) → APPROVAL GATE (2 of 2)
```yaml
Type: APPROVAL REQUIRED
Must show:
  - Implementation complete
  - Test execution report (all passing)
  - Coverage report (meets threshold)
  - Linter report (clean)
  - Files changed

User confirms:
  - Implementation correct
  - Tests pass
  - Coverage acceptable
  - Ready to refactor

After approval: Auto-continues through Phase 5c, 6, 7, 8, 9
```

### ⚡ Phase 5c: Refactor (REFACTOR) → AUTO-CONTINUE
```yaml
Type: Auto-continue (with auto-stop condition)
Must show:
  - Refactored code
  - Test execution report (still passing)
  - Code quality improvements

AUTO-STOP if: Tests fail → Revert refactor
Then: Continues automatically to Phase 6
```

### ⚡ Phase 6: Code Review → AUTO-CONTINUE
```yaml
Type: Auto-continue (with auto-stop condition)
Must show:
  - Code review checklist
  - Issues found (if any)
  - Security findings
  - Quality score

AUTO-STOP if: Critical security issues found → Fix first
Then: Continues automatically to Phase 7
```

### ⚡ Phase 7: QA Validation → AUTO-CONTINUE
```yaml
Type: Auto-continue (with auto-stop condition)
Must show:
  - Test execution results
  - Coverage report
  - Bug report (if any)

AUTO-STOP if: Tests fail OR coverage < 80% → Fix first
Then: Continues automatically to Phase 8
```

### ⚡ Phase 8: Documentation → AUTO-CONTINUE
```yaml
Type: Auto-continue (no approval needed)
Must show:
  - Documentation created
  - Changes documented
  - Migration notes (if needed)

Then: Continues automatically to Phase 9
```

### ⚡ Phase 9: Notification → AUTO-CONTINUE
```yaml
Type: Auto-continue (read-only)
Skip if: No Slack configured
Actions:
  - Send Slack notifications
  - Mark workflow complete

End of workflow ✅
```

---

## ⏱️ Timeout Behavior

### No Timeout by Default
```yaml
Behavior: Wait indefinitely for user response
Reason: User may need time to review carefully
```

### Optional Timeout (Configurable)
```yaml
timeout_after: 24h (default: never)

On timeout:
  - Save workflow state
  - Notify user (Slack/email)
  - Pause workflow
  - Allow resume later
```

---

## 🎨 User Response Handling

### Valid Responses

#### 1. "approve" / "approved" / "ok" / "proceed" / "continue" / "yes"
```yaml
Action: Proceed to next phase
Log: "Phase {N} approved by user at {timestamp}"
Notify: "✅ Proceeding to Phase {N+1}..."
```

#### 2. "reject" / "rejected" / "no" / "restart"
```yaml
Action: Restart current phase
Prompt: "What should be changed? Please provide feedback:"
Wait for: User feedback
Log: "Phase {N} rejected by user at {timestamp}"
Notify: "🔄 Restarting Phase {N} with feedback..."
```

#### 3. "modify" / "change" / "edit"
```yaml
Action: Stay in current phase, allow modifications
Prompt: "What modifications do you need?"
Wait for: User instructions
Log: "Phase {N} modifications requested at {timestamp}"
Notify: "✏️ Making modifications..."
```

#### 4. "cancel" / "stop" / "abort"
```yaml
Action: Stop workflow
Prompt: "Are you sure? Type 'confirm' to cancel workflow."
Wait for: Confirmation
Log: "Workflow cancelled by user at {timestamp}"
Notify: "❌ Workflow cancelled. State saved for resume."
```

#### 5. "back" / "previous"
```yaml
Action: Return to previous phase
Prompt: "Return to Phase {N-1}? Type 'confirm'."
Wait for: Confirmation
Log: "User requested rollback to Phase {N-1}"
Notify: "⏪ Rolling back to Phase {N-1}..."
```

### Invalid Responses
```yaml
Examples: Random text, unclear input

Action: 
  - Show error message
  - Re-display approval prompt
  - Suggest valid options

Message:
  "❌ Invalid response. Please type one of:
   - 'approve' to proceed
   - 'reject' to restart
   - 'modify' to make changes
   - 'cancel' to stop"
```

---

## 📊 Workflow State Tracking

### State File: `workflow-state.json`

```json
{
  "workflow_id": "refactor-social-post-20231124-143022",
  "current_phase": 2,
  "status": "waiting_approval",
  "phases": {
    "1": {
      "name": "Requirements Analysis",
      "status": "approved",
      "started_at": "2023-11-24T14:30:22Z",
      "completed_at": "2023-11-24T14:35:10Z",
      "approved_at": "2023-11-24T14:36:00Z",
      "approved_by": "user",
      "deliverables": [
        "requirements-analysis.md"
      ]
    },
    "2": {
      "name": "Technical Planning",
      "status": "waiting_approval",
      "started_at": "2023-11-24T14:36:05Z",
      "completed_at": "2023-11-24T14:45:30Z",
      "deliverables": [
        "tech-spec.md",
        "architecture-diagram.png"
      ]
    }
  },
  "context": {
    "task": "Refactor SocialMarketingCompositePost.phone.tsx",
    "agents": ["mobile-react-native", "qa-automation", "ui-designer"]
  }
}
```

---

## 🔄 Phase Transition Logic

### Pseudo-code

```typescript
async function executePhase(phaseNumber: number) {
  // 1. Load workflow state
  const state = loadWorkflowState();
  
  // 2. Execute phase
  console.log(`🚀 Starting Phase ${phaseNumber}...`);
  const result = await runPhaseLogic(phaseNumber);
  
  // 3. Save deliverables
  state.phases[phaseNumber].deliverables = result.deliverables;
  state.phases[phaseNumber].completed_at = new Date().toISOString();
  state.phases[phaseNumber].status = 'waiting_approval';
  saveWorkflowState(state);
  
  // 4. Show approval prompt
  showApprovalPrompt(phaseNumber, result);
  
  // 5. Wait for user response
  const response = await waitForUserInput();
  
  // 6. Handle response
  switch (response) {
    case 'approve':
      state.phases[phaseNumber].status = 'approved';
      state.phases[phaseNumber].approved_at = new Date().toISOString();
      state.current_phase = phaseNumber + 1;
      saveWorkflowState(state);
      
      // 7. Proceed to next phase
      if (phaseNumber < 9) {
        await executePhase(phaseNumber + 1);
      } else {
        completeWorkflow(state);
      }
      break;
      
    case 'reject':
      const feedback = await getFeedback();
      state.phases[phaseNumber].status = 'rejected';
      state.phases[phaseNumber].feedback = feedback;
      saveWorkflowState(state);
      
      // Restart current phase
      await executePhase(phaseNumber);
      break;
      
    case 'modify':
      const modifications = await getModifications();
      // Stay in current phase, make modifications
      await applyModifications(modifications);
      await executePhase(phaseNumber);
      break;
      
    case 'cancel':
      state.status = 'cancelled';
      saveWorkflowState(state);
      console.log('❌ Workflow cancelled');
      break;
  }
}
```

---

## 🛡️ Safety Mechanisms

### 1. Always Save State Before Approval
```yaml
Reason: User may close session, need to resume
Action: Save after phase complete, before prompt
```

### 2. Prevent Accidental Skip
```yaml
Reason: Phases must run in order
Action: Disable "skip" command
Exception: User can go back, but not forward
```

### 3. Require Confirmation for Destructive Actions
```yaml
Actions requiring "confirm":
  - Cancel workflow
  - Rollback phase
  - Delete deliverables

Prompt: "Are you sure? Type 'confirm' to proceed."
```

### 4. Auto-save Every 5 Minutes
```yaml
During phase execution:
  - Save partial progress
  - Allow recovery if crashed
  - Show last saved time
```

---

## 📈 Metrics & Logging

### Log Every Transition
```typescript
interface PhaseTransitionLog {
  workflow_id: string;
  phase_number: number;
  phase_name: string;
  action: 'start' | 'complete' | 'approve' | 'reject' | 'modify';
  timestamp: string;
  duration_seconds: number;
  user_id: string;
}

// Example log
{
  "workflow_id": "refactor-social-post-20231124",
  "phase_number": 2,
  "phase_name": "Technical Planning",
  "action": "approve",
  "timestamp": "2023-11-24T14:45:30Z",
  "duration_seconds": 570,
  "user_id": "nguyenthanh"
}
```

---

## ✅ Approval Gate Checklist

Before showing approval prompt:

- [ ] Phase execution complete
- [ ] All deliverables generated
- [ ] Success criteria met
- [ ] Quality checks passed
- [ ] State saved
- [ ] Summary prepared
- [ ] Next phase identified

After user approves:

- [ ] Approval logged
- [ ] State updated
- [ ] Notifications sent (if configured)
- [ ] Next phase started

---

## 🎯 Success Criteria

Workflow gates are working correctly if:

1. ✅ Only 2 approval gates exist (Phase 2 & 5b)
2. ✅ Auto-continue phases EXECUTE fully (not skipped)
3. ✅ Auto-continue phases SHOW deliverables before continuing
4. ✅ Auto-stop conditions halt workflow when issues found
5. ✅ User can reject/modify/cancel at approval gates
6. ✅ State saved and recoverable
7. ✅ Transitions logged for audit

---

## ❌ Common Mistakes to Avoid

| Mistake | Correct Behavior |
|---------|------------------|
| Skipping auto-continue phases entirely | Execute phase, show deliverables, then continue |
| Waiting for approval on all phases | Only wait at Phase 2 & 5b |
| Ignoring auto-stop conditions | Stop and fix issues before continuing |
| Not showing deliverables on auto phases | Always show what was done |

---

**Version:** 2.0.0
**Status:** ✅ PRODUCTION READY
**Last Updated:** 2026-01-02

---

**Remember:** Auto-continue ≠ Skip! Every phase executes and shows its work. We just don't stop for approval except at the 2 critical gates. 🚀

