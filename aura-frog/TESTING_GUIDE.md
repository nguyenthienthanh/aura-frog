# Aura Frog Workflow Testing Guide

**Version:** 1.18.0
**Last Updated:** 2026-02-09
**Purpose:** How to test the command-based Aura Frog workflow system

---

## IMPORTANT: How Commands Work

**Commands are plain text in Claude Code chat:**

```
You: workflow:status
```

Or use bundled slash commands:
```
/workflow → Shows interactive submenu
/workflow start "task" → Direct subcommand
```

Claude AI reads the command text and executes the workflow.

---

## 🎯 TEST 1: Quick Command Test (2 minutes)

### Test if Claude recognizes commands:

```
You: workflow:status
```

**Expected Response:**
```
No active workflow found.

Initialize a workflow first:
workflow:start <task-description>
```

---

## 🎯 TEST 2: Simple Workflow Test (5 minutes)

### Start a Simple Task:

```
You: workflow:start Analyze the useSocialMediaPost hook and suggest improvements
```

**Expected: Claude Should:**
1. ✅ Detect command
2. ✅ Read `commands/workflow/start.md`
3. ✅ Execute Phase 1 (Requirements Analysis)
4. ✅ Analyze the hook file
5. ✅ Generate analysis document
6. ✅ Show approval gate like this:

```
═══════════════════════════════════════════════════════════
🎯 PHASE 1 COMPLETE: Requirements Analysis
═══════════════════════════════════════════════════════════

📊 Summary:
Analyzed useSocialMediaPost hook (505 lines)

📦 Deliverables:
   📄 PHASE_1_REQUIREMENTS_ANALYSIS.md

✅ Success Criteria:
   ✅ Hook analyzed
   ✅ Issues identified
   ✅ Improvements suggested

⏭️  Next Phase: Phase 2 - Technical Planning

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "workflow:approve" → Proceed to Phase 2
Type "workflow:reject" → Restart Phase 1
Type "workflow:modify <feedback>" → Adjust analysis

Your response:
═══════════════════════════════════════════════════════════
```

### Then Test Approval:

```
You: workflow:approve
```

**Expected:**
```
✅ Phase 1 approved
⏭️  Proceeding to Phase 2: Technical Planning...

[Phase 2 execution starts...]
```

---

## 🎯 TEST 3: Full Refactoring Workflow (30 minutes)

### Real Refactoring Task:

```
You: workflow:start Refactor SocialMarketingCompositePost.phone.tsx - split into smaller, maintainable components
```

**This will test:**
- ✅ Component analysis (Phase 1)
- ✅ Architecture design (Phase 2)
- ✅ Design review (Phase 3)
- ✅ Test planning (Phase 4)
- ✅ TDD workflow (Phase 5a, 5b, 5c)
- ✅ Code review (Phase 6)
- ✅ QA validation (Phase 7)
- ✅ Documentation (Phase 8)
- ✅ Notification (Phase 9)

### Expected Flow:

```
Phase 1: Analyzes 713-line component → [Auto-continues]

Phase 2: Creates tech spec with architecture
→ You: workflow:approve  ← [APPROVAL GATE]

Phase 3: Reviews UI component structure → [Auto-continues]
Phase 4: Plans 70+ test cases → [Auto-continues]
Phase 5a: Writes failing tests (RED) → [Auto-continues]

Phase 5b: Implements components (GREEN)
→ You: workflow:approve  ← [APPROVAL GATE]

Phase 5c: Refactors code (REFACTOR) → [Auto-continues]
Phase 6: Cross-agent code review → [Auto-continues]
Phase 7: QA validation with coverage report → [Auto-continues]
Phase 8: Generates documentation → [Auto-continues]
Phase 9: Sends notifications → [Auto-complete]

🎉 WORKFLOW COMPLETE!
```

**Note:** Only 2 approval gates (Phase 2 & 5b). Other phases auto-continue after showing deliverables.

---

## 🎯 TEST 4: Test Rejection (2 minutes)

```
You: workflow:start Add error handling to a function

[Phase 1 completes, shows approval gate]

You: workflow:reject Need more specific error scenarios - add timeout and network errors

[Phase 1 restarts with feedback, updates analysis]

You: workflow:approve

[Continues to Phase 2...]
```

---

## 🎯 TEST 5: Test Modification (2 minutes)

```
You: workflow:start Create a utility function

[Phase 1 completes]

You: workflow:modify Add TypeScript type definitions and JSDoc comments

[Phase 1 updates with modifications]

You: workflow:approve

[Continues to Phase 2...]
```

---

## 🎯 TEST 6: Test Status Command (1 minute)

### After starting a workflow:

```
You: workflow:status
```

**Expected Response:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORKFLOW STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Workflow Information:
   ID: PROJ-1234
   Status: In Progress
   Created: 2025-11-24 11:23:23

📍 Current Phase: Phase 3 - Design Review

📊 Phase Progress:

  ✅ Phase 1: Requirements Analysis (approved)
  ✅ Phase 2: Technical Planning (approved)
→ 🔄 Phase 3: Design Review (in_progress)
  ⏸️ Phase 4-9: Pending

Progress: 2/9 phases (22%)

⏭️  Next Action:
   Wait for Phase 3 completion, then approve
```

---

## 🎯 VALIDATION CHECKLIST

After each test, verify:

### Command Recognition ✅
- [ ] Claude detects `workflow:` commands
- [ ] Claude reads command files from `commands/workflow/`
- [ ] Claude follows command execution steps

### Approval Gates ✅
- [ ] Formatted approval prompts shown
- [ ] Phase summary displayed
- [ ] Deliverables listed
- [ ] Success criteria shown
- [ ] Next phase previewed

### Phase Execution ✅
- [ ] Pre-phase hook executes (setup)
- [ ] Phase work completed
- [ ] Post-phase hook executes (validation)
- [ ] Pre-approval hook shows prompt
- [ ] Deliverables generated

### State Management ✅
- [ ] `workflow-state.json` created
- [ ] Phase status updated
- [ ] Context saved
- [ ] Deliverables tracked

### Commands Work ✅
- [ ] `workflow:start` - Initializes and executes Phase 1
- [ ] `workflow:approve` - Approves and continues
- [ ] `workflow:reject` - Restarts with feedback
- [ ] `workflow:modify` - Makes changes
- [ ] `workflow:status` - Shows progress

---

## 🐛 TROUBLESHOOTING

### If Claude doesn't recognize commands:

**Problem:** Claude responds normally, doesn't execute command

**Solution:**
```
Try being explicit:

"Please execute the workflow command: workflow:start <task>

Follow these steps:
1. Read commands/workflow/start.md
2. Execute Phase 1 as defined
3. Show approval gate
4. Wait for my response"
```

### If approval gate doesn't show:

**Problem:** Phase completes but no approval prompt

**Solution:**
```
"Please show the approval gate as defined in:
hooks/pre-approval.md

Format should include:
- Phase summary
- Deliverables
- Success criteria
- Action required"
```

### If state not saved:

**Problem:** `workflow:status` says no workflow

**Solution:**
```
Workflow state is conceptual in this version.
Continue with the workflow, Claude will track context.
```

---

## 🎯 QUICK TEST SCRIPT

**Copy and paste this:**

```
workflow:start Analyze useSocialMediaPost hook and suggest 3 improvements

[Wait for approval gate]

workflow:approve

[Wait for Phase 2]

workflow:status

[Check if status shows correctly]

workflow:approve

[Continue through phases...]
```

---

## 📊 SUCCESS CRITERIA

Your Aura Frog is working if:

✅ Commands are recognized  
✅ Phases execute in order  
✅ Approval gates appear after each phase  
✅ You can approve/reject/modify  
✅ Status command shows progress  
✅ Deliverables are generated  
✅ Multi-phase workflow completes  

---

## 🎉 NEXT STEPS AFTER TESTING

If tests pass:
1. ✅ Aura Frog is operational!
2. Use for real refactoring tasks
3. Iterate and improve based on usage

If tests fail:
1. Note what doesn't work
2. Adjust CLAUDE.md or commands
3. Retest until working

---

## 💡 RECOMMENDED FIRST TEST

**Start Simple:**

```
workflow:start Analyze the useSocialMediaPost hook
```

This will:
- Test basic command detection
- Execute Phase 1 only (quickest test)
- Show if approval gates work
- Validate command system

**Then expand to full workflow once working!**

---

**Ready to test?** 🚀

Try: `workflow:start Analyze useSocialMediaPost hook and suggest improvements`

