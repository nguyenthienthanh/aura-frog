# Rule: Next Step Guidance

**Version:** 1.0.0
**Priority:** CRITICAL
**Enforcement:** EVERY response must include next step guidance
**Applies To:** All interactions, phases, and approval gates

---

## Core Rule

**EVERY response MUST end with a "What's Next" section showing available actions and suggested commands.**

The user should NEVER have to guess what they can do next.

---

## Guidance Block Format

### Standard Format (End of Every Response)

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick Actions:**
• `approve` or `yes` - Continue to next phase
• `reject: <reason>` - Redo with feedback
• `skip` - Skip current phase (if allowed)

**Available Commands:**
• `workflow:status` - Show current progress
• `workflow:skip phase-3` - Skip specific phase
• `workflow:force phase-5` - Jump to phase
• `workflow:pause` - Save and pause
• `workflow:handoff` - Prepare session handoff

**Suggestions:**
→ Type `approve` to continue to Phase 4
→ Or provide feedback to refine the design
```

---

## Context-Aware Guidance

### Phase 1 (Understand) - After Delivery

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Options:**
• `approve` - Accept requirements, move to Design
• `reject: <feedback>` - Refine requirements understanding
• `modify: <changes>` - Adjust specific items

**Quick Commands:**
• `skip brainstorming` - Skip to technical design directly
• `add requirement: <text>` - Add missing requirement
• `clarify: <question>` - Ask clarifying question

**Suggested Next:**
→ Review the requirements above
→ Type `approve` to proceed to Phase 2 (Design)
```

### Phase 2 (Design) - After Delivery

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Options:**
• `approve` - Accept design, move to UI/Test Plan
• `reject: <feedback>` - Rethink architecture
• `modify: <changes>` - Adjust specific decisions

**Quick Commands:**
• `skip phase-3` - Skip UI Breakdown (backend-only)
• `force phase-4` - Jump directly to Test Plan
• `compare: <alternative>` - Evaluate alternative approach

**Phase Skipping:**
• Phase 3 (UI) can be skipped for backend tasks
• Type `skip phase-3` to skip UI breakdown

**Suggested Next:**
→ Review the technical design above
→ Type `approve` to proceed to Phase 3 (UI Breakdown)
→ Or type `skip phase-3` for backend-only tasks
```

### Phase 3 (UI Breakdown) - After Delivery

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Options:**
• `approve` - Accept UI specs, move to Test Plan
• `reject: <feedback>` - Redesign components
• `modify: <changes>` - Adjust specific components

**Quick Commands:**
• `force tests` - Jump directly to implementation
• `add component: <name>` - Add missing component
• `simplify` - Request simpler UI approach

**Suggested Next:**
→ Review the component breakdown above
→ Type `approve` to proceed to Phase 4 (Test Plan)
```

### Phase 4 (Test Plan) - After Delivery

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Options:**
• `approve` - Accept test plan, start TDD
• `reject: <feedback>` - Revise test strategy
• `modify: <changes>` - Add/remove test cases

**Quick Commands:**
• `force implementation` - Skip to coding (⚠️ skips TDD RED)
• `add tests: <description>` - Add more test cases
• `reduce scope` - Fewer tests, faster implementation

**TDD Workflow Coming:**
After approval, we enter TDD cycle:
• Phase 5a: Write failing tests (RED)
• Phase 5b: Implement code (GREEN)
• Phase 5c: Refactor (REFACTOR)

**Suggested Next:**
→ Review the test plan above
→ Type `approve` to start Phase 5a (TDD RED)
→ Or type `force implementation` to skip test-first (not recommended)
```

### Phase 5a-c (Implementation) - During TDD

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Current:** Phase 5b (GREEN) - Implementing code

**Your Options:**
• `continue` - Keep implementing
• `tests:run` - Run tests to check progress
• `pause` - Save and take a break

**Quick Commands:**
• `skip refactor` - Skip Phase 5c, go to Review
• `force review` - Jump to code review now
• `add feature: <desc>` - Expand scope (careful!)

**TDD Status:**
• ✅ RED: 5 failing tests written
• 🔄 GREEN: 3/5 tests passing
• ⏳ REFACTOR: Pending

**Suggested Next:**
→ Continue implementing until all tests pass
→ Then type `continue` to move to REFACTOR phase
```

### Phase 6 (Code Review) - After Delivery

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Options:**
• `approve` - Accept code, proceed to verification
• `reject: <issues>` - Fix issues, re-review
• `approve with notes: <notes>` - Accept with minor fixes

**Quick Commands:**
• `fix: <issue>` - Fix specific issue
• `ignore: <item>` - Skip non-critical issue
• `force verify` - Skip remaining fixes

**Review Summary:**
• 🔒 Security: ✅ Passed
• ⚡ Performance: ✅ Passed
• 🧹 Code Quality: ⚠️ 2 minor issues
• 🧪 Test Coverage: ✅ 87%

**Suggested Next:**
→ Review the code review findings above
→ Type `approve` to proceed to Phase 7 (Verification)
→ Or `fix: <issue>` to address specific items
```

### Phase 7-9 (Verification, Documentation, Share)

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Options:**
• `approve` - Continue to next phase
• `reject: <reason>` - Redo current phase
• `done` - Complete workflow now (skip remaining)

**Quick Commands:**
• `skip docs` - Skip documentation phase
• `skip share` - Skip Slack notification
• `force complete` - End workflow immediately

**Suggested Next:**
→ Review deliverables above
→ Type `approve` to continue
→ Or `done` to complete the workflow
```

---

## Universal Commands Reference

Always available, show in guidance when relevant:

### Workflow Control

| Command | Description |
|---------|-------------|
| `approve` / `yes` | Accept and continue |
| `reject: <reason>` | Reject with feedback |
| `modify: <changes>` | Adjust deliverables |
| `skip` | Skip current phase |
| `done` | Complete workflow |
| `pause` | Save and pause |
| `stop` | Cancel workflow |

### Phase Navigation

| Command | Description |
|---------|-------------|
| `workflow:status` | Show progress |
| `workflow:skip <phase>` | Skip specific phase |
| `workflow:force <phase>` | Jump to phase |
| `workflow:back` | Go back one phase |
| `workflow:restart` | Start over |

### Speed Commands

| Command | Description |
|---------|-------------|
| `skip brainstorming` | Skip requirement analysis |
| `skip design` | Skip Phase 2 |
| `skip ui` | Skip Phase 3 |
| `skip tests` | Skip test writing (⚠️) |
| `skip refactor` | Skip Phase 5c |
| `skip docs` | Skip Phase 8 |
| `skip share` | Skip Phase 9 |
| `force implementation` | Jump to coding |
| `force review` | Jump to code review |
| `force complete` | End immediately |

### Quick Actions

| Command | Description |
|---------|-------------|
| `add: <item>` | Add to current deliverable |
| `remove: <item>` | Remove from deliverable |
| `clarify: <question>` | Ask clarifying question |
| `simplify` | Request simpler approach |
| `expand` | Request more detail |
| `compare: <option>` | Compare alternatives |

---

## When to Show Extended Guidance

### Show FULL guidance when:
- First interaction of a phase
- After rejection (show how to proceed)
- User seems stuck (no response for long text)
- Complex decision point
- Multiple valid paths exist

### Show MINIMAL guidance when:
- Mid-phase work (just "continue" option)
- Simple confirmation needed
- User is clearly flowing

### Minimal Format:

```markdown
---
💡 **Next:** `approve` to continue | `reject: <feedback>` to revise
```

---

## Enforcement Checklist

Every response should:

- [ ] End with guidance block
- [ ] Show 2-3 most relevant options
- [ ] Include at least one quick command
- [ ] Show a clear suggested action
- [ ] Be context-aware for current phase

---

## Error Guidance

When errors occur, show recovery options:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ERROR: Tests failing (3 failures)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recovery Options:**
• `fix` - Attempt to fix failing tests
• `show failures` - See detailed error messages
• `skip test: <name>` - Skip specific failing test
• `force continue` - Continue anyway (⚠️ risky)
• `rollback` - Revert to last working state

**Suggested:**
→ Type `show failures` to see what's wrong
→ Then type `fix` to attempt auto-fix
```

---

## Non-Workflow Interactions

For non-workflow tasks, still provide guidance:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Options:**
• Ask a follow-up question
• Request code changes
• Start a workflow: `workflow:start <task>`

**Quick Commands:**
• `explain: <topic>` - Get explanation
• `show: <file>` - View file contents
• `search: <term>` - Search codebase
• `test:run` - Run tests
• `lint:fix` - Fix linting issues

**Workflows:**
• `workflow:start <feature>` - Start full workflow
• `bugfix:quick <issue>` - Quick bug fix
• `refactor: <target>` - Refactoring task
```

---

## Integration with Agent Banner

The guidance block should appear AFTER the agent banner:

```markdown
⚡ 🐸 AURA FROG v1.1.5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: backend-nodejs │ Phase: 4 - Test Plan          ┃
┃ Model: claude │ 🔥 Planning comprehensive tests       ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Phase content and deliverables...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 WHAT'S NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Guidance content...]
```

---

**Rule:** next-step-guidance
**Version:** 1.0.0
**Added:** Aura Frog v1.1.5
**Priority:** CRITICAL
**Impact:** User experience, workflow clarity, reduced friction
