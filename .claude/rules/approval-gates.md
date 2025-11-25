# Approval Gates - Phase Transition Control

**Version:** 1.0.0  
**Purpose:** Enforce mandatory user approval at each workflow phase  
**Priority:** CRITICAL - Core workflow mechanism

---

## 🎯 Core Principle

**RULE:** Every phase transition REQUIRES explicit user approval.

```
Phase N Complete → Show Summary → Wait for Approval → Phase N+1 Start
```

**No automatic progression** - User must actively approve each step.

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

## 🔒 Mandatory Approval Gates

### Phase 1: Requirements Analysis → APPROVAL GATE
```yaml
Must show:
  - Parsed requirements
  - Identified scope
  - Edge cases
  - Success criteria

User confirms:
  - Requirements understood correctly
  - Nothing missing
  - Scope is clear
```

### Phase 2: Technical Planning → APPROVAL GATE
```yaml
Must show:
  - Architecture diagram
  - Component breakdown
  - File changes list
  - Technology decisions
  - Estimated effort

User confirms:
  - Approach is correct
  - No better alternatives
  - Acceptable complexity
```

### Phase 3: Design Review → APPROVAL GATE
```yaml
Must show:
  - UI/UX analysis
  - Component structure
  - Design alignment
  - Responsive considerations

User confirms:
  - Design matches requirements
  - UI won't break
  - Acceptable for users
```

### Phase 4: Test Planning → APPROVAL GATE
```yaml
Must show:
  - Test strategy
  - Test cases list
  - Coverage plan
  - Testing approach

User confirms:
  - Tests cover all scenarios
  - Coverage threshold acceptable
  - Test quality sufficient
```

### Phase 5a: Write Tests (RED) → APPROVAL GATE
```yaml
Must show:
  - Test files created
  - Test execution report (all failing)
  - Coverage report
  - Test code quality

User confirms:
  - Tests are correct
  - Failures are expected
  - Ready to implement
```

### Phase 5b: Implementation (GREEN) → APPROVAL GATE
```yaml
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
```

### Phase 5c: Refactor (REFACTOR) → APPROVAL GATE
```yaml
Must show:
  - Refactored code
  - Test execution report (still passing)
  - Code quality improvements
  - Performance impact

User confirms:
  - Code quality improved
  - No behavior changes
  - Tests still pass
  - Ready for review
```

### Phase 6: Code Review → APPROVAL GATE
```yaml
Must show:
  - Code review checklist
  - Issues found (if any)
  - Recommendations
  - Quality score

User confirms:
  - Review findings addressed
  - Code quality acceptable
  - Ready for QA
```

### Phase 7: QA Validation → APPROVAL GATE
```yaml
Must show:
  - Test execution results
  - Coverage report
  - Manual test results
  - Bug report (if any)

User confirms:
  - All tests pass
  - No critical bugs
  - Ready to document
```

### Phase 8: Documentation → APPROVAL GATE
```yaml
Must show:
  - Documentation created
  - Confluence page preview
  - Changes documented
  - Migration notes (if needed)

User confirms:
  - Documentation complete
  - Accurate and clear
  - Ready to notify
```

### Phase 9: Notification → AUTO (Read-only)
```yaml
No approval needed:
  - Send notifications
  - Update JIRA
  - Post to Slack
  - Mark workflow complete

(Read-only operations only)
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

### State File: `.claude/workflow-state.json`

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

Approval gates are working correctly if:

1. ✅ User MUST approve every phase (no auto-progression)
2. ✅ Clear summary shown before approval
3. ✅ User can reject/modify/cancel at any point
4. ✅ State saved and recoverable
5. ✅ Transitions logged for audit
6. ✅ Safe rollback mechanism exists

---

**Version:** 1.0.0  
**Status:** ✅ PRODUCTION READY  
**Last Updated:** 2025-11-24

---

**Remember:** Approval gates are the HEART of CCPM workflow. Without them, it's just automation - with them, it's collaboration! 🤝

