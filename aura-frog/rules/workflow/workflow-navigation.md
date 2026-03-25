# Rule: Workflow Navigation

**Priority:** HIGH
**Applies:** All workflow phases and approval gates

---

## Core Rule

**After each phase, ALWAYS show what comes next.**

Tell the user:
1. What phase/step is next
2. What might be skipped (and why)
3. Current progress overview

---

## Navigation Block Format

After every phase completion, show:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Completed: Phase 1 (Understand + Design)
🔄 Current: Phase 2 (Test RED) - Auto-continuing
⏭️ Next: Phase 3 (Build GREEN)

**After approval:**
→ Phase 2: Test plan + write failing tests
→ Estimated: ~10 min

**Upcoming phases:**
2. Test RED (test plan + write failing tests)
3. Build GREEN (implement code)
4. Refactor + Review (polish + code review)
5. Finalize (verify + document + share)
```

---

## When to Show Navigation

| Event | Show Navigation? |
|-------|------------------|
| Phase completed | ✅ Yes |
| Approval gate | ✅ Yes (include in gate) |
| Phase rejected | ✅ Yes (show re-do info) |
| Phase modified | ✅ Yes (show updated path) |
| Workflow started | ✅ Yes (show full roadmap) |
| Workflow resumed | ✅ Yes (show remaining) |

---

## Skip Detection

### Automatic Skips

Detect and announce skips proactively:

```markdown
⏩ **Will skip:**
- Phase 1 UI Breakdown step - No UI components in task
- Phase 5 Share step - Slack not configured

💡 Tip: These can be unskipped with "include phase 3"
```

### Skip Reasons

| Phase | Auto-Skip When |
|-------|----------------|
| Phase 1 (UI part) | No UI components detected |
| Phase 5 (Share part) | Slack not configured |
| Any phase | User explicitly skipped |

---

## Progress Indicators

### Visual Progress Bar

```markdown
Progress: ████████░░░░░░░░ 50% (4/8 phases)
```

### Phase Status Icons

| Icon | Meaning |
|------|---------|
| ✅ | Completed |
| 🔄 | In progress |
| ⏳ | Pending |
| ⏩ | Will be skipped |
| ❌ | Rejected (redo needed) |

---

## Examples

### Example 1: After Phase 1 Approval

```markdown
✅ Phase 1 (Understand + Design) approved!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ████░░░░░░░░░░░░ 20% (1/5 phases)

✅ Phase 1: Understand + Design - Done
🔄 Phase 2: Test RED - UP NEXT
⏳ Phase 3: Build GREEN
⏳ Phase 4: Refactor + Review
⏳ Phase 5: Finalize

**Next up:** Phase 2 - Test RED
→ Define test strategy, write failing tests
→ QA agent takes the lead

Continuing to Phase 2...
```

### Example 2: At Workflow Start

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: "Add user authentication with JWT"

**Phases to complete:**

1. 🔄 Understand + Design - Requirements, architecture, UI breakdown (NOW)
2. ⏳ Test RED - Test plan + write failing tests
3. ⏳ Build GREEN - Implement code
4. ⏳ Refactor + Review - Polish code + security & quality check
5. ⏳ Finalize - Verify, document, notify team

**Detected skips:** None (full workflow)

Starting Phase 1...
```

### Example 3: After Rejection

```markdown
❌ Phase 1 rejected: "Need better architecture approach"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ░░░░░░░░░░░░░░░░ 0% (0/5 phases)

❌ Phase 1: Understand + Design - REJECTED (retry #1)
⏳ Phase 2-5: Waiting...

**What happens now:**
→ Brainstorming your feedback...
→ Re-doing Phase 1 with improvements
→ Will show new approval gate after rework

Restarting Phase 1...
```

### Example 4: Nearing Completion

```markdown
✅ Phase 4 (Refactor + Review) complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ████████████████ 80% (4/5 phases)

✅ Phase 1-4: All completed!
🔄 Phase 5: Finalize - UP NEXT

**Almost done!** Just verification, documentation, and notifications left.

**Next up:** Phase 5 - Finalize
→ Verify tests, generate docs, notify team
→ PM agent takes the lead

Continuing to Phase 5...
```

---

## Approval Gate Integration

**Only 2 approval gates in the workflow:** Phase 1 (Understand + Design) and Phase 3 (Build GREEN).

Include navigation in approval gates:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Phase 1: Understand + Design - Approval Needed (Gate 1 of 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Deliverables...]

---

📍 **Where we are:**
Progress: ████░░░░░░░░░░░░ 20% (1/5 phases)

⏭️ **After approval (AUTO-CONTINUE):**
→ Phase 2: Test RED (test plan + write failing tests)
→ Next approval gate: Phase 3 (Build GREEN)

---

**Options:**
- `approve` → Auto-continue through Phase 2
- `reject: <reason>` → Brainstorm & redo Phase 1
- `modify: <changes>` → Adjust deliverables
- `stop` → Save and exit
```

---

## Related Rule

**See also:** `rules/next-step-guidance.md` for comprehensive command reference and context-aware guidance blocks.

---

## Token Awareness Integration

Include token status in navigation when relevant:

```markdown
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ██████████░░░░░░ 60% (3/5 phases)
Tokens: ████████████░░░░ 75% (~150K used)

⚠️ Token usage high. Consider `workflow:handoff` after Phase 4.
```

---

**Last Updated:** 2025-12-04
