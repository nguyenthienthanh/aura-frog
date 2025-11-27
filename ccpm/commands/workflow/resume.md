# Command: workflow:resume

**Purpose:** Resume workflow from previous session  
**Aliases:** `resume`, `continue workflow`, `load workflow`

---

## 🎯 Overview

Load and continue a workflow that was handed off from a previous Cursor session due to token limits or breaks.

---

## 📋 Usage

```bash
# Resume by workflow ID
workflow:resume add-user-authentication-20251124-120000

# Or natural language
"Continue workflow add-user-authentication-20251124-120000"
"Resume the authentication workflow"
```

---

## 🔄 Execution Flow

### Step 1: Load Workflow State

```typescript
const workflowId = args[0];
const statePath = `workflow-state.json`;
const handoffPath = `.claude/logs/workflows/${workflowId}/HANDOFF_CONTEXT.md`;

// Load state
const state = JSON.parse(readFile(statePath));

// Load handoff context
const handoffContext = readFile(handoffPath);
```

### Step 2: Validate Context

```typescript
// Check if workflow exists
if (!state || state.workflow_id !== workflowId) {
  throw new Error('Workflow not found');
}

// Check if handoff context exists
if (!handoffContext) {
  console.warn('⚠️ No HANDOFF_CONTEXT.md found. Using workflow state only.');
}

// Check token usage in this new session
const newSessionTokens = getCurrentTokenUsage();
console.log(`📊 New session - Tokens available: ${200000 - newSessionTokens}`);
```

### Step 3: Display Resumption Summary

```markdown
╔══════════════════════════════════════════════════════════╗
║  🔄 RESUMING WORKFLOW                                    ║
╚══════════════════════════════════════════════════════════╝

**Workflow:** add-user-authentication
**ID:** add-user-authentication-20251124-120000
**Handed Off:** 2025-11-24T15:30:00Z (2 hours ago)

---

## 📊 Previous Session Summary

**Completed Phases:** 4/9 (44%)
- ✅ Phase 1: Requirements Analysis
- ✅ Phase 2: Technical Planning
- ✅ Phase 3: Design Review
- ✅ Phase 4: Test Planning

**Previous Session Stats:**
- Time: 37 minutes
- Tokens: 135K / 200K (67.5%)
- Quality: All approved ✅

---

## 🎯 Current Status

**Next Phase:** Phase 5a - TDD RED (Write Failing Tests)

**What to do:**
1. Create test files
2. Write failing tests
3. Verify RED state

**Key Context Loaded:**
- Technical spec from Phase 2
- Test plan from Phase 4
- Design decisions from Phase 3

---

## 📂 Files Available

**Deliverables:**
- ✅ Requirements document
- ✅ Technical specification
- ✅ Architecture diagram
- ✅ UI breakdown
- ✅ Test plan & cases

**All files located in:**
`.claude/logs/workflows/add-user-authentication-20251124-120000/deliverables/`

---

## 🚀 Ready to Continue

**New Session Tokens:** 5K / 200K (2.5%)  
**Available:** 195K tokens (~195K available)  
**Estimated for completion:** ~65K tokens (5 phases remaining)

✅ Sufficient tokens to complete workflow!

---

**Options:**
- `continue` → Start Phase 5a immediately
- `workflow:progress` → See full timeline
- `workflow:status` → Review current state
- `review context` → Show handoff details again
```

### Step 4: Load Context Into Memory

```typescript
// Parse handoff context
const context = parseHandoffContext(handoffContext);

// Update workflow state with new session info
state.resumed_at = new Date().toISOString();
state.resumed_from_tokens = state.total_tokens_used;
state.new_session_tokens = getCurrentTokenUsage();
state.previous_session_id = state.session_id;
state.session_id = generateSessionId();

// Prepare phase context
state.current_phase_context = {
  previous_decisions: context.decisions,
  files_to_create: context.next_files,
  requirements_summary: context.requirements,
  technical_approach: context.technical_approach
};

saveWorkflowState(state);
```

### Step 5: Auto-Load Relevant Files

```typescript
// Load key deliverables into context
const deliverables = [
  'tech-spec.md',      // From Phase 2
  'test-plan.md',      // From Phase 4
  'requirements.md'    // From Phase 1
];

for (const file of deliverables) {
  const content = loadDeliverable(workflowId, file);
  console.log(`✅ Loaded: ${file}`);
}
```

---

## 📄 Handoff Context Structure

### Required Information

```markdown
# Handoff Context

## 1. Project Overview
- Task description
- Tech stack
- Target platform

## 2. Completed Phases
- Phase summaries
- Key decisions
- Deliverables

## 3. Current Status
- Current phase
- What's done
- What's next

## 4. Important Notes
- Constraints
- Decisions
- Gotchas

## 5. Files & Context
- Created files
- Planned files
- Design tokens
```

### Minimal Viable Handoff

If no `HANDOFF_CONTEXT.md` exists:

```typescript
// Extract from workflow-state.json
const minimalContext = {
  workflow_id: state.workflow_id,
  current_phase: state.current_phase,
  completed_phases: Object.entries(state.phases)
    .filter(([_, p]) => p.status === 'completed')
    .map(([num, p]) => ({ num, name: p.name })),
  deliverables: Object.values(state.phases)
    .flatMap(p => p.deliverables || [])
};
```

---

## 🎯 Resume Strategies

### Strategy 1: Full Context Resume (Best)

**When:** HANDOFF_CONTEXT.md exists

```typescript
1. Load handoff context
2. Parse all sections
3. Load deliverables
4. Continue from next phase
```

**Token Cost:** ~5-10K (comprehensive context)

### Strategy 2: Minimal Resume

**When:** Only workflow-state.json exists

```typescript
1. Load workflow state
2. Load Phase N-1 deliverables
3. Infer next steps
4. Continue with caution
```

**Token Cost:** ~2-5K (basic context)

### Strategy 3: Smart Resume (Recommended)

**When:** Handoff exists + check recent files

```typescript
1. Load handoff context (high-level)
2. Load only current phase deliverables
3. Check filesystem for created files
4. Merge contexts
5. Continue efficiently
```

**Token Cost:** ~3-7K (optimized)

---

## 💡 Best Practices

### Before Handoff

**Do:**
- Run `workflow:handoff` at 150K+ tokens
- Commit code if possible
- Save important decisions

**Don't:**
- Wait until 190K+ tokens
- Leave mid-phase
- Forget to document decisions

### During Resume

**Do:**
- Read handoff context carefully
- Check file creation status
- Verify previous phase outputs

**Don't:**
- Skip context review
- Assume everything is in memory
- Rush into next phase

### After Resume

**Do:**
- Verify continuity
- Check for file conflicts
- Update workflow state

**Don't:**
- Re-do completed work
- Ignore previous decisions
- Create duplicate files

---

## 🔍 Troubleshooting

### Issue: Workflow Not Found

```bash
❌ Error: Workflow 'xyz' not found

Solution:
1. Check workflow ID spelling
2. List available workflows:
   ls .claude/logs/workflows/
3. Use correct ID from list
```

### Issue: No Handoff Context

```bash
⚠️ Warning: No HANDOFF_CONTEXT.md

Solution:
Using workflow-state.json only.
Context may be limited.

Continue anyway? (y/n)
```

### Issue: File Conflicts

```bash
⚠️ Warning: Files already exist:
  - src/auth/Login.tsx
  
Options:
1. Skip file creation
2. Backup and recreate
3. Continue with existing files
```

---

## 📊 Token Management

### New Session Budget

```
Total Available: 200,000 tokens

Reserved:
- Resume context: ~5-10K
- Phase 5 execution: ~130K (all 3 sub-phases)
- Phase 6-9: ~50K
- Buffer: ~10K

Total Needed: ~190K
Status: ✅ Fits in one session
```

### Multi-Session Workflow

For very large workflows:

```
Session 1: Phase 1-4 (150K tokens) → Handoff
Session 2: Phase 5-7 (150K tokens) → Handoff
Session 3: Phase 8-9 (40K tokens) → Complete
```

---

## 🎯 Success Criteria

✅ Workflow state loaded  
✅ Handoff context parsed  
✅ Deliverables accessible  
✅ Context reconstructed  
✅ Ready to continue  
✅ No duplicate work  
✅ Decisions preserved  

---

## 📝 Example Usage

### Complete Flow

```bash
# Session 1 (Previous)
workflow:start "Add authentication"
# ... work work work ...
# At 160K tokens:
workflow:handoff

# Session 2 (New - This one!)
workflow:resume add-user-authentication-20251124-120000
# Shows context summary
continue
# Continues from Phase 5
```

### With Review

```bash
workflow:resume [workflow-id]
# See summary

workflow:progress
# Check timeline

review context
# Show full handoff context

continue
# Start next phase
```

---

## 🔗 Related Commands

- `workflow:handoff` - Prepare for handoff
- `workflow:status` - Current state
- `workflow:progress` - Timeline
- `workflow:list` - Show all workflows

---

**Command:** workflow:resume  
**Version:** 1.0.0  
**Added:** CCPM v4.2

