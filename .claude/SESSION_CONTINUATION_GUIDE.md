# 🔄 Session Continuation Guide

**Version:** 1.0.0  
**Critical:** How to handle token limits in Cursor

---

## ⚠️ Important: Token Limits

### Reality Check

**Cursor Session Limit:**
- **200,000 tokens** per conversation
- NOT 1 million (that's API limit)
- Shared across all messages

**Current Session:**
- Used: ~119K / 200K (59.5%)
- Remaining: ~81K tokens
- Status: ⚠️ Moderate usage

---

## 🚨 When to Handoff

### Token Thresholds

| Usage | Tokens | Action | Priority |
|-------|--------|--------|----------|
| 0-75% | 0-150K | Continue normally | ✅ Safe |
| 75-80% | 150-160K | **Prepare handoff** | ⚠️ Warning |
| 80-90% | 160-180K | **Run handoff NOW** | 🚨 Urgent |
| 90%+ | 180K+ | **Emergency handoff** | 🔴 Critical |

### Warning Signs

```
⚠️ Token Warning: 150K / 200K (75%)
   Recommendation: Prepare for handoff
   Run: workflow:handoff

🚨 Token Alert: 160K / 200K (80%)
   URGENT: Save context now!
   Run: workflow:handoff immediately
```

---

## 📦 Handoff Process

### Step 1: Prepare Handoff

**When:** At 150K+ tokens or before taking break

```bash
workflow:handoff

# Creates:
✅ HANDOFF_CONTEXT.md (comprehensive context)
✅ Updated workflow-state.json
✅ Resume instructions
```

### Step 2: Review Handoff

```markdown
╔══════════════════════════════════════════════════════════╗
║  📦 WORKFLOW HANDOFF PREPARED                            ║
╚══════════════════════════════════════════════════════════╝

**Workflow:** add-user-authentication
**Current Phase:** 5/9
**Tokens Used:** 155K / 200K (77.5%)

## Saved Context

✅ Workflow state
✅ 4 completed phases
✅ All deliverables
✅ Key decisions
✅ Next steps

**Location:**
`.claude/logs/contexts/[workflow-id]/HANDOFF_CONTEXT.md`

---

## 🔄 Resume Command

**In NEW Cursor session:**
```
workflow:resume add-user-authentication-20251124-120000
```
```

### Step 3: Open New Session

**Important:**
1. Close current Cursor chat
2. Open NEW Cursor chat (Cmd+L or Ctrl+L)
3. Fresh 200K token budget!

### Step 4: Resume Workflow

```bash
workflow:resume add-user-authentication-20251124-120000

# Agent will:
✅ Load handoff context
✅ Show completion summary
✅ Load deliverables
✅ Resume at next phase
```

---

## 📄 What Gets Saved

### HANDOFF_CONTEXT.md

**Comprehensive context file:**

```markdown
# Workflow Handoff Context

## Project Overview
- Task description
- Tech stack
- Platform

## Completed Phases (1-4)
- Phase summaries
- Key decisions made
- Deliverables created

## Current Status
- Current phase: 5/9
- What's done
- What's next

## Important Notes
- Design decisions
- Technical constraints
- Gotchas to remember

## Files & Artifacts
- Created files list
- Planned files
- Dependencies

## Resume Instructions
- Exact command to run
- What to expect
- Next phase details
```

### Workflow State

**workflow-state.json includes:**
- Current phase
- Completed phases
- Token usage
- Timestamps
- Handoff metadata

---

## 🔄 Resume Process

### In New Session

```bash
# 1. Run resume command
workflow:resume add-user-authentication-20251124-120000

# 2. Agent shows summary
╔══════════════════════════════════════════════════════════╗
║  🔄 RESUMING WORKFLOW                                    ║
╚══════════════════════════════════════════════════════════╝

**Previous Session:**
- Completed: 4/9 phases
- Tokens: 155K used
- Quality: All approved ✅

**New Session:**
- Available: 195K tokens (97.5%)
- Next: Phase 5a (TDD RED)
- Estimated: ~60K tokens remaining

✅ Sufficient tokens to complete!

# 3. Review context
Options:
- `continue` → Start Phase 5a
- `workflow:progress` → See timeline
- `review context` → Full handoff details

# 4. Continue workflow
continue

# 5. Auto-continues through remaining phases!
```

---

## 💡 Best Practices

### Before Handoff

**Do:**
- ✅ Run handoff at 150K+ tokens (don't wait!)
- ✅ Complete current phase if possible
- ✅ Document any important decisions
- ✅ Commit code to git if applicable

**Don't:**
- ❌ Wait until 180K+ tokens (too late!)
- ❌ Handoff mid-phase (finish phase first)
- ❌ Forget to document context
- ❌ Close without saving state

### During Handoff

**Checklist:**
1. [ ] Run `workflow:handoff`
2. [ ] Review HANDOFF_CONTEXT.md created
3. [ ] Copy workflow ID
4. [ ] Note resume command
5. [ ] Close current session
6. [ ] Open new Cursor chat

### After Resume

**Verify:**
- ✅ Context loaded correctly
- ✅ Deliverables accessible
- ✅ Next phase clear
- ✅ No duplicate work
- ✅ Decisions preserved

---

## 🎯 Token Budget Planning

### Typical Workflow Phases

| Phases | Est. Tokens | Sessions Needed |
|--------|-------------|-----------------|
| 1-4 (Planning) | ~135K | 1 session ✅ |
| 5 (Implementation) | ~130K | 1 session ✅ |
| 6-9 (Validation) | ~75K | 1 session ✅ |

**Total:** ~340K tokens = **2 sessions typically**

### Multi-Session Strategy

**For Large Workflows:**

```
Session 1: Phase 1-4
├─ Requirements → Planning
├─ Tokens: ~135K
└─ Handoff at 140K

Session 2: Phase 5 (TDD)
├─ RED → GREEN → REFACTOR
├─ Tokens: ~130K
└─ Handoff at 125K (or complete if <150K total)

Session 3 (if needed): Phase 6-9
├─ Review → QA → Docs → Notify
├─ Tokens: ~75K
└─ Complete!
```

---

## 🔧 Troubleshooting

### Issue: Lost Context

```bash
❌ Problem: Agent doesn't remember previous phases

✅ Solution:
1. Check HANDOFF_CONTEXT.md exists
2. Re-run: workflow:resume [id]
3. Manually paste key context if needed
```

### Issue: Duplicate Work

```bash
❌ Problem: Agent tries to redo Phase X

✅ Solution:
1. Show workflow state:
   cat .claude/workflow-state.json
2. Clarify current phase:
   "We already completed Phase X. Continue with Phase Y."
```

### Issue: File Conflicts

```bash
❌ Problem: Files already exist from previous session

✅ Solution:
1. Check files in IDE
2. Tell agent: "Files from Phase X already exist, skip creation"
3. Agent continues with next step
```

---

## 📊 Token Monitoring

### Check Anytime

```bash
workflow:tokens

# Shows:
📊 Token Usage
Used: 119K / 200K (59.5%)
Remaining: 81K

⚠️ Status: Moderate usage
💡 Recommendation: Monitor, handoff if exceeds 150K
```

### Auto Warnings

**Agent will warn automatically:**

```
# At 150K (75%)
⚠️ Token usage: 150K / 200K (75%)
   Consider: workflow:handoff

# At 160K (80%)
🚨 HIGH token usage: 160K / 200K (80%)
   URGENT: workflow:handoff NOW!

# At 180K (90%)
🔴 CRITICAL: 180K / 200K (90%)
   IMMEDIATE handoff required!
```

---

## 🎯 Success Criteria

### Handoff Success

✅ HANDOFF_CONTEXT.md created  
✅ Workflow state saved  
✅ Resume command shown  
✅ All deliverables preserved  
✅ Decisions documented  

### Resume Success

✅ Context loaded completely  
✅ No information loss  
✅ Continues from correct phase  
✅ No duplicate work  
✅ Quality maintained  

---

## 📚 Related Docs

- **commands/workflow/handoff.md** - Detailed handoff process
- **commands/workflow/resume.md** - Detailed resume process
- **docs/TOKEN_TRACKING.md** - Token monitoring guide
- **CLAUDE.md** - Agent behavior rules

---

## 🎯 Quick Reference

### Handoff Commands

```bash
workflow:handoff              # Prepare handoff
workflow:tokens               # Check token usage
workflow:status               # Current state
```

### Resume Commands

```bash
workflow:resume [workflow-id] # Resume workflow
workflow:progress             # Check timeline
workflow:status               # Verify state
continue                      # Start next phase
```

### Emergency Handoff

```bash
# If near limit (180K+):
workflow:handoff

# Copy this:
workflow:resume [shown-workflow-id]

# Close chat
# Open new Cursor chat
# Paste resume command
```

---

## 💡 Pro Tips

1. **Proactive Handoff**
   - Don't wait for warnings
   - Handoff at natural breaks (after Phase 4, after Phase 5)
   - Better to handoff early than lose context

2. **Document Decisions**
   - Add notes to deliverables
   - Explain "why" not just "what"
   - Makes resume smoother

3. **Test Resume**
   - After handoff, test resume immediately
   - Verify context loads correctly
   - Fix any issues while fresh

4. **Use Git**
   - Commit code after each phase
   - Provides backup if handoff fails
   - Easy to see what was done

---

**Token limits are not a problem with proper handoff! 🚀**

---

*Version: 1.0.0*  
*Added: CCPM v4.2*  
*Critical for Cursor usage*

