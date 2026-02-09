# Execution Rules

**Version:** 2.0.0
**Priority:** CRITICAL - Behavioral constraints for all operations
**Type:** Rule (Behavioral Constraints)
**Updated:** v1.8.0 - Aligned with 2-gate workflow

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

### After Implementation

| # | Rule | Why |
|---|------|-----|
| 11 | **Run ESLint/TSLint** | Catch code quality issues |
| 12 | **Run TypeScript check** | Verify type safety |
| 13 | **Fix ALL lint issues** | Zero warnings policy |
| 14 | **Verify clean output** | No errors before proceeding |

### At Phase Completion

| # | Rule | Why |
|---|------|-----|
| 10 | **Show deliverables** | User sees what was accomplished |
| 11 | **Save workflow state** | Enable resume if interrupted |
| 12 | **Show next step guidance** | User knows what happens next |

#### For Approval Phases (Phase 2 & 5b only)
| # | Rule | Why |
|---|------|-----|
| A1 | **Show approval gate** | Human oversight for critical decisions |
| A2 | **Wait for explicit approval** | Architecture & implementation review |

#### For Auto-Continue Phases (1, 3, 4, 5a, 5c, 6, 7, 8, 9)
| # | Rule | Why |
|---|------|-----|
| AC1 | **Execute phase fully** | Phase is NOT skipped |
| AC2 | **Show deliverables** | User sees what was done |
| AC3 | **Continue automatically** | No wait for approval |
| AC4 | **Stop on blockers** | Auto-stop if issues found |

### After User Approval (Phase 2 & 5b)

| # | Rule | Why |
|---|------|-----|
| 13 | **IMMEDIATELY execute next phase** | Auto-continue flow |
| 14 | **Show token usage** | Monitor consumption |
| 15 | **Continue until next approval gate or blocker** | Efficient execution |

---

## NEVER Do

### Plan Mode Override (CRITICAL)

| # | Rule | Why |
|---|------|-----|
| 0 | **NEVER use EnterPlanMode or Claude's built-in plan mode** | Aura Frog has its own 9-phase workflow that replaces plan mode entirely. Use `workflow-orchestrator` skill instead. |

### Context & Loading

| # | Rule | Why |
|---|------|-----|
| 1 | **Skip project context loading** | Will use wrong conventions |
| 2 | **Ignore CLAUDE.md hierarchy** | Miss critical instructions |
| 3 | **Assume tech stack** | Must detect/verify |

### Approvals & Safety

| # | Rule | Why |
|---|------|-----|
| 4 | **Ignore approval gates (Phase 2 & 5b)** | Critical decisions need user review |
| 5 | **Skip auto-continue phases entirely** | Phases must execute and show deliverables |
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
□ Run lint after implementation (eslint/tslint)
□ Run TypeScript check (tsc --noEmit)
□ Fix ALL lint issues before proceeding
□ Show deliverables at each phase completion
□ Show next step guidance (commands & suggestions)
□ Wait for approval at Phase 2 & 5b only
□ Auto-continue through other phases
□ Save state
□ Run tests
□ Check coverage
```

### NEVER Checklist
```
□ Skip context loading
□ Skip auto-continue phases (must execute & show deliverables)
□ Ignore approval gates at Phase 2 & 5b
□ Skip tests
□ Ignore linter
□ Commit secrets
□ Push to main without approval
□ Continue on blockers (tests fail, coverage low, security issues)
```

### Phase Behavior Summary
```
Approval Phases (2, 5b):     Execute → Show → WAIT → User approves → Continue
Auto-Continue Phases:        Execute → Show → Continue automatically
Auto-Stop (on blockers):     Execute → Issue found → STOP for fix
```

---

## Team Mode Rules (Agent Teams)

**When:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled.

### ALWAYS (Team Mode)

| # | Rule | Why |
|---|------|-----|
| T1 | **Max 3 teammates per phase** | Prevent coordination overhead |
| T2 | **Pass complete context to teammates** | They don't share conversation history |
| T3 | **Use shared task list for work distribution** | Prevents duplicate work |
| T4 | **Claim files before editing** | Prevents merge conflicts |
| T5 | **Message teammates for handoffs** | Explicit coordination |

### NEVER (Team Mode)

| # | Rule | Why |
|---|------|-----|
| T6 | **Teammates commit independently** | Only lead manages git operations |
| T7 | **Skip file claiming** | Causes merge conflicts |
| T8 | **Create more than 3 teammates per phase** | Coordination overhead exceeds benefit |
| T9 | **Let teammates advance phases** | Only lead manages phase transitions |

### Team Mode Quick Reference
```
Lead: Creates teammates → Distributes tasks → Manages phases → Commits
Teammate: Claims tasks → Works on files → Messages for review → Reports done
```

---

**Version:** 2.1.0
**Last Updated:** 2026-02-09
