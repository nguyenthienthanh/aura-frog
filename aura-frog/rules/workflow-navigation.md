# Rule: Workflow Navigation

**Version:** 1.1.3
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

✅ Completed: Phase 1 (Understand), Phase 2 (Design)
🔄 Current: Phase 3 (UI Breakdown) - Awaiting approval
⏭️ Next: Phase 4 (Test Plan)
⏩ Will skip: Phase 3 (no UI components detected)

**After approval:**
→ Phase 4: Define test strategy and test cases
→ Estimated: ~10 min

**Upcoming phases:**
5a. TDD RED (write failing tests)
5b. TDD GREEN (implement code)
5c. TDD REFACTOR (clean up)
6. Code Review
7. Verification
8. Documentation
9. Share (Slack notification)
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
- Phase 3 (UI Breakdown) - No UI components in task
- Phase 9 (Share) - Slack not configured

💡 Tip: These can be unskipped with "include phase 3"
```

### Skip Reasons

| Phase | Auto-Skip When |
|-------|----------------|
| Phase 3 (UI) | No UI components detected |
| Phase 9 (Share) | Slack not configured |
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

### Example 1: After Phase 2 Approval

```markdown
✅ Phase 2 (Design) approved!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ████░░░░░░░░░░░░ 25% (2/8 phases)

✅ Phase 1: Understand - Done
✅ Phase 2: Design - Done
⏩ Phase 3: UI Breakdown - SKIPPING (backend-only task)
🔄 Phase 4: Test Plan - UP NEXT
⏳ Phase 5a-c: Implementation (TDD)
⏳ Phase 6: Review
⏳ Phase 7: Verify
⏳ Phase 8: Document
⏳ Phase 9: Share

**Next up:** Phase 4 - Test Plan
→ Define test strategy, identify test cases
→ QA agent takes the lead

Continuing to Phase 4...
```

### Example 2: At Workflow Start

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: "Add user authentication with JWT"

**Phases to complete:**

1. 🔄 Understand - Analyze requirements (NOW)
2. ⏳ Design - Technical architecture
3. ⏳ UI Breakdown - Login/register screens
4. ⏳ Test Plan - Define test strategy
5. ⏳ Implementation (TDD)
   - 5a. Write failing tests (RED)
   - 5b. Implement code (GREEN)
   - 5c. Refactor (REFACTOR)
6. ⏳ Review - Security & quality check
7. ⏳ Verify - Run all tests
8. ⏳ Document - Update docs
9. ⏳ Share - Notify team

**Detected skips:** None (full workflow)

Starting Phase 1...
```

### Example 3: After Rejection

```markdown
❌ Phase 4 rejected: "Need more edge case tests"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ████████░░░░░░░░ 37% (3/8 phases)

✅ Phase 1: Understand - Done
✅ Phase 2: Design - Done
✅ Phase 3: UI Breakdown - Done
❌ Phase 4: Test Plan - REJECTED (retry #1)
⏳ Phase 5-9: Waiting...

**What happens now:**
→ Brainstorming your feedback...
→ Re-doing Phase 4 with improvements
→ Will show new approval gate after rework

Restarting Phase 4...
```

### Example 4: Nearing Completion

```markdown
✅ Phase 7 (Verify) approved!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ██████████████░░ 87% (7/8 phases)

✅ Phase 1-7: All completed!
🔄 Phase 8: Document - UP NEXT
⏩ Phase 9: Share - SKIPPING (Slack not configured)

**Almost done!** Just documentation left.

**Next up:** Phase 8 - Documentation
→ Generate/update docs, ADRs
→ PM agent takes the lead

Continuing to Phase 8...
```

---

## Approval Gate Integration

Include navigation in every approval gate:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Phase 2: Design - Approval Needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Deliverables...]

---

📍 **Where we are:**
Progress: ████░░░░░░░░░░░░ 25% (2/8 phases)

⏭️ **After approval:**
→ Phase 3: UI Breakdown (or skip if no UI)
→ Then: Phase 4 (Test Plan)

---

**Options:**
- `approve` → Continue to Phase 3
- `reject: <reason>` → Brainstorm & redo Phase 2
- `modify: <changes>` → Adjust deliverables
- `stop` → Save and exit
```

---

## Token Awareness Integration

Include token status in navigation when relevant:

```markdown
📍 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ██████████░░░░░░ 62% (5/8 phases)
Tokens: ████████████░░░░ 75% (~150K used)

⚠️ Token usage high. Consider `workflow:handoff` after Phase 6.
```

---

**Version:** 1.1.3
**Last Updated:** 2025-12-01
