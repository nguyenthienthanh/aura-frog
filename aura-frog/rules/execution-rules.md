# Execution Rules

**Version:** 1.0.0
**Priority:** CRITICAL - Behavioral constraints for all operations
**Type:** Rule (Behavioral Constraints)

---

## Core Rule

These are the fundamental ALWAYS/NEVER rules that govern Aura Frog behavior across all operations.

---

## ALWAYS Do

### Before Any Task

| # | Rule | Why |
|---|------|-----|
| 1 | **Show agent banner** | User must know which agent is active |
| 2 | **Load project context** | Must follow project conventions |
| 3 | **Detect appropriate agent** | Right specialist for the task |

### During Workflow

| # | Rule | Why |
|---|------|-----|
| 4 | **Show banner before each phase** | User knows which agent handles phase |
| 5 | **Read command definition** | Follow exact execution steps |
| 6 | **Follow phase order** | Phases build on each other |
| 7 | **Execute hooks** | Pre/post phase automation |
| 8 | **Load relevant rules** | Apply quality standards |
| 9 | **Activate appropriate agents** | Multi-agent collaboration |
| 10 | **Generate deliverables** | Tangible outputs per phase |

### At Phase Completion

| # | Rule | Why |
|---|------|-----|
| 10 | **Show approval gate** | Human oversight required |
| 11 | **Wait for explicit approval** | No auto-progression |
| 12 | **Save workflow state** | Enable resume if interrupted |
| 13 | **Show next step guidance** | User knows available actions |

### After User Approval

| # | Rule | Why |
|---|------|-----|
| 13 | **IMMEDIATELY execute next phase** | Auto-continue flow |
| 14 | **Show token usage** | Monitor consumption |
| 15 | **Continue until blocking event** | Efficient execution |

---

## NEVER Do

### Context & Loading

| # | Rule | Why |
|---|------|-----|
| 1 | **Skip project context loading** | Will use wrong conventions |
| 2 | **Ignore CLAUDE.md hierarchy** | Miss critical instructions |
| 3 | **Assume tech stack** | Must detect/verify |

### Approvals & Safety

| # | Rule | Why |
|---|------|-----|
| 4 | **Ignore approval gates** | Human oversight required |
| 5 | **Auto-approve without user** | User must confirm |
| 6 | **Skip confirmation for destructive actions** | Safety first |

### External Systems

| # | Rule | Why |
|---|------|-----|
| 7 | **Write to external systems without confirmation** | Side effects need approval |
| 8 | **Commit credentials/tokens** | Security risk |
| 9 | **Push to main/master without approval** | Critical branch protection |

### Code Quality

| # | Rule | Why |
|---|------|-----|
| 10 | **Implement without tests** | TDD is mandatory |
| 11 | **Skip RED phase in TDD** | Tests must fail first |
| 12 | **Ignore linter errors** | Code quality standard |
| 13 | **Leave any/unknown types** | TypeScript strictness |

### Workflow Control

| # | Rule | Why |
|---|------|-----|
| 14 | **Skip phases without justification** | Phases exist for a reason |
| 15 | **Proceed if tests don't pass** | Quality gate |
| 16 | **Continue if coverage below target** | Coverage requirement |

---

## Blocking Conditions

Execution MUST stop when:

```yaml
Blocking Events:
  - User rejection ("reject", "stop", "cancel")
  - Tests failing (in GREEN phase)
  - Coverage below target
  - Linter errors
  - Security vulnerabilities detected
  - Token limit approaching (150K warning)
  - External system errors
  - Missing required credentials
```

---

## Auto-Continue Conditions

After approval, continue automatically until:

```yaml
Continue Until:
  - Next approval gate reached
  - Blocking condition encountered
  - Workflow complete (Phase 9)
  - User interruption
  - Token limit reached
```

---

## Execution Flow Checklist

### Phase Start
```markdown
- [ ] Banner shown with correct agent(s) for this phase
- [ ] Agent change announced if different from previous phase
- [ ] Project context loaded
- [ ] Phase guide read
- [ ] Relevant rules loaded
- [ ] Pre-phase hook executed
```

### Phase Execution
```markdown
- [ ] Following phase steps exactly
- [ ] Generating required deliverables
- [ ] Applying quality rules
- [ ] Running tests (if applicable)
- [ ] Checking coverage (if applicable)
```

### Phase Complete
```markdown
- [ ] All deliverables generated
- [ ] Quality checks passed
- [ ] State saved
- [ ] Post-phase hook executed
- [ ] Approval gate shown
- [ ] Waiting for user response
```

---

## Exception Handling

### When Rules Conflict

**Priority:** Project rules > Plugin rules > Generic rules

```yaml
Example:
  Plugin: "Test coverage must be 80%"
  Project: "Test coverage must be 90%"
  Result: Use 90% (project wins)
```

### When User Requests Skip

```yaml
User: "Skip phase 3"
Action:
  1. Check if skip is allowed (see phase-skipping skill)
  2. If allowed: Document reason, proceed
  3. If not allowed: Explain why, suggest alternatives
```

### When Token Limit Approaching

```yaml
At 150K tokens (75% of 200K):
  1. Show warning
  2. Suggest handoff
  3. Save state automatically
  4. Provide resume instructions
```

---

## Enforcement Examples

### Correct Behavior

```markdown
✅ User: "Implement feature X"
   Agent:
   1. Shows banner
   2. Loads project context
   3. Starts Phase 1
   4. Shows approval gate
   5. Waits for approval
```

### Incorrect Behavior

```markdown
❌ User: "Implement feature X"
   Agent:
   1. Skips banner
   2. Assumes React project
   3. Starts coding immediately
   4. No approval gate
   5. Commits without review
```

---

## Quick Reference

### ALWAYS Checklist
```
□ Show agent banner (start of response)
□ Show banner before each workflow phase
□ Load project context
□ Follow phase order
□ Show approval gates
□ Show next step guidance (commands & suggestions)
□ Wait for approval
□ Save state
□ Run tests
□ Check coverage
```

### NEVER Checklist
```
□ Skip context loading
□ Auto-approve
□ Skip tests
□ Ignore linter
□ Commit secrets
□ Push to main without approval
□ Continue on failures
```

---

**Version:** 1.2.5
**Last Updated:** 2025-12-17
