---
name: workflow-orchestrator
description: "Execute 9-phase workflow for complex features. DO NOT use for simple bug fixes."
autoInvoke: true
priority: high
triggers:
  - "implement"
  - "build feature"
  - "create feature"
  - "workflow:start"
  - "complex task"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Aura Frog Workflow Orchestrator

**Priority:** CRITICAL - Use for complex feature implementations
**Version:** 1.0.0

---

## When to Use

**USE for:**
- New features
- Complex implementations
- Tasks > 2 hours
- Multi-file changes
- Tasks requiring TDD workflow

**DON'T use for:**
- Bug fixes → use `bugfix-quick`
- Quick refactors → direct edit
- Config changes → direct edit
- Simple questions → just answer

---

## Pre-Execution Checklist

1. **agent-detector** → Select lead agent (MANDATORY)
2. **project-context-loader** → Load conventions (MANDATORY)
3. **Show agent banner** at start of response
4. **Verify task complexity** - if simple, suggest lighter approach

---

## Token Budget Per Phase

**CRITICAL:** Stay within budget to avoid context explosion.

```toon
token_budget[9]{phase,max_tokens,format}:
  1,500,TOON summary only - NO prose
  2,1500,Technical design in TOON + minimal prose
  3,800,Component list in TOON
  4,600,Test cases in TOON table
  5a,1000,Test code only - no explanations
  5b,2000,Implementation code - minimal comments
  5c,500,Refactor summary in TOON
  6,800,Review findings in TOON table
  7-9,300 each,Status only
```

**Phase 1 HARD CAP: 500 tokens.** Use `/workflow:phase1-lite` format.

---

## 9-Phase Workflow

| Phase | Name | Lead Agent | Deliverable | Gate |
|-------|------|------------|-------------|------|
| 1 | Understand 🎯 | pm-operations-orchestrator | Requirements (TOON, ≤500 tokens) | ⚡ Auto |
| 2 | Design 🏗️ | Dev agent | Technical design | ✋ **Approval** |
| 3 | UI Breakdown 🎨 | ui-designer | Component breakdown | ⚡ Auto |
| 4 | Plan Tests 🧪 | qa-automation | Test strategy | ⚡ Auto |
| 5a | Write Tests 🔴 | qa-automation + Dev | Failing tests (TDD RED) | ⚡ Auto |
| 5b | Build 🟢 | Dev agent | Implementation (TDD GREEN) | ✋ **Approval** |
| 5c | Polish ♻️ | Dev agent | Refactored code (TDD REFACTOR) | ⚡ Auto |
| 6 | Review 👀 | security-expert | Quality review report | ⚡ Auto* |
| 7 | Verify ✅ | qa-automation | All tests pass, coverage ≥80% | ⚡ Auto |
| 8 | Document 📚 | pm-operations-orchestrator | Documentation | ⚡ Auto |
| 9 | Share 🔔 | slack-operations | Team notification | ⚡ Auto |

**Gate Legend:**
- ✋ **Approval** = Must wait for user approval before continuing
- ⚡ Auto = Auto-continue after showing deliverables
- ⚡ Auto* = Auto-continue unless issues found (stops if critical issues)

---

## Phase Transition Rules

### Valid Transitions

```
Phase 1 (Understand) → Phase 2 (Design)
  Mode: ⚡ AUTO-CONTINUE
  Shows: Requirements summary, then continues

Phase 2 (Design) → Phase 3 (UI)
  Mode: ✋ APPROVAL REQUIRED
  Blocker: No technical design approved

Phase 3 (UI) → Phase 4 (Plan Tests)
  Mode: ⚡ AUTO-CONTINUE
  Skip if: No UI component in task

Phase 4 (Plan Tests) → Phase 5a (Write Tests)
  Mode: ⚡ AUTO-CONTINUE
  Shows: Test strategy, then continues

Phase 5a (RED) → Phase 5b (GREEN)
  Mode: ⚡ AUTO-CONTINUE (if tests fail as expected)
  Blocker: Tests pass (they should fail!) → STOP

Phase 5b (GREEN) → Phase 5c (REFACTOR)
  Mode: ✋ APPROVAL REQUIRED
  Blocker: Tests still failing

Phase 5c (REFACTOR) → Phase 6 (Review)
  Mode: ⚡ AUTO-CONTINUE (if tests still pass)
  Blocker: Tests broken by refactor → STOP

Phase 6 (Review) → Phase 7 (Verify)
  Mode: ⚡ AUTO-CONTINUE (unless critical issues)
  Blocker: Critical security issues → STOP for approval

Phase 7 (Verify) → Phase 8 (Document)
  Mode: ⚡ AUTO-CONTINUE (if tests pass)
  Blocker: Tests fail or coverage <80% → STOP

Phase 8 (Document) → Phase 9 (Share)
  Mode: ⚡ AUTO-CONTINUE
  Auto-executes Phase 9
```

### Summary: Only 2 Approval Gates

| Gate | Phase | Why |
|------|-------|-----|
| 1st | Phase 2 (Design) | Architecture decisions are hard to change later |
| 2nd | Phase 5b (GREEN) | Main implementation - review before refactor |

All other phases auto-continue unless a blocker is hit.

### Invalid Transitions (BLOCKED)

- ❌ Skip from Phase 1 to Phase 5 (no design)
- ❌ Phase 5b without 5a (no TDD)
- ❌ Phase 7 with failing tests
- ❌ Any phase skip without explicit user request

---

## Approval Gates (Only 2)

Approval is only required at **Phase 2 (Design)** and **Phase 5b (Implementation)**.

### Gate Format

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Phase [N]: [Name] - Approval Needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Friendly Summary] ✨

[Deliverables list]

---

📍 **Progress:** ████░░░░░░░░░░░░ [X]% ([N]/8 phases)

⏭️ **After approval:**
→ Phases [N+1] to [X] will AUTO-CONTINUE
→ Next approval gate: Phase [Y]

---

**Options:**
- `approve` / `yes` → Continue (auto-runs until next gate)
- `reject: <reason>` → Brainstorm & re-do
- `modify: <changes>` → Adjust deliverables
- `stop` → Cancel workflow

⚡ After approval, I'll AUTO-CONTINUE through multiple phases!
```

See: `rules/workflow-navigation.md` for full navigation format.

### Auto-Continue Phases (No Approval Needed)

These phases show deliverables but continue automatically:

| Phase | Shows | Then |
|-------|-------|------|
| 1. Understand | Requirements summary | → Continues to Phase 2 |
| 3. UI Breakdown | Component breakdown | → Continues to Phase 4 |
| 4. Test Plan | Test strategy | → Continues to Phase 5a |
| 5a. TDD RED | Failing tests | → Continues to Phase 5b (if tests fail) |
| 5c. TDD REFACTOR | Cleaned code | → Continues to Phase 6 (if tests pass) |
| 6. Review | Review report | → Continues to Phase 7 (unless critical issues) |
| 7. Verify | Test results | → Continues to Phase 8 (if pass) |
| 8. Document | Documentation | → Continues to Phase 9 |

**Auto-Stop Conditions:**
- Phase 5a: Tests pass (should fail) → STOP
- Phase 5c/6/7: Tests fail → STOP
- Phase 6: Critical security issues → STOP
- Phase 7: Coverage < 80% → STOP

### Valid Responses

| Response | Action |
|----------|--------|
| `approve` / `yes` | Continue to next phase immediately |
| `reject: <reason>` | **Brainstorm first**, then restart phase |
| `modify: <changes>` | **Light brainstorm**, then adjust deliverables |
| `stop` / `cancel` | End workflow, save state |

### Feedback Handling (IMPORTANT)

**Default behavior:** Brainstorm feedback before implementing.
- Analyze user's suggestion
- Consider alternatives
- Present options with pros/cons
- Then implement agreed approach

**Force mode:** Skip brainstorming when user says:
- "must do: ..." → Implement directly
- "just do: ..." → Skip discussion
- "work like that" → No alternatives

See: `rules/feedback-brainstorming.md`

---

## AUTO-CONTINUE Behavior

**Streamlined workflow with only 2 approval gates:**

### Flow Overview
```
START → Phase 1 (auto) → Phase 2 ✋ APPROVAL
      → Phase 3-5a (auto) → Phase 5b ✋ APPROVAL
      → Phase 5c-9 (auto) → DONE
```

### Example Flow
```
User: "workflow:start Add JWT authentication"

→ Phase 1: Understand (shows summary, auto-continues)
→ Phase 2: Design
  ✋ APPROVAL GATE - waits for user

User: "approve"

→ Phase 3: UI Breakdown (auto-continues)
→ Phase 4: Test Plan (auto-continues)
→ Phase 5a: TDD RED - write failing tests (auto-continues if tests fail)
→ Phase 5b: TDD GREEN - implementation
  ✋ APPROVAL GATE - waits for user

User: "approve"

→ Phase 5c: Refactor (auto-continues if tests pass)
→ Phase 6: Review (auto-continues unless critical issues)
→ Phase 7: Verify (auto-continues if tests pass)
→ Phase 8: Document (auto-continues)
→ Phase 9: Share (auto-executes)
→ DONE ✅
```

**Auto-Stop Triggers:**
- Tests fail when they shouldn't (or pass when they should fail)
- Critical security issues in review
- Coverage below 80%
- Token limit reached

**Token Awareness:**
- At 75% (150K tokens): Warn user
- At 85% (170K tokens): Suggest `workflow:handoff`
- At 90% (180K tokens): Force handoff

---

## Critical Rules

### TDD (NON-NEGOTIABLE)

```
Phase 5a (RED):
  ✅ Write tests FIRST
  ✅ Run tests → MUST FAIL
  ❌ If tests pass → STOP, tests aren't testing new code

Phase 5b (GREEN):
  ✅ Write minimal code to pass tests
  ✅ Run tests → MUST PASS
  ❌ If tests fail → Fix code, not tests

Phase 5c (REFACTOR):
  ✅ Clean up code
  ✅ Run tests → MUST STILL PASS
  ❌ If tests fail → Revert refactor
```

### KISS Principle

- ✅ Simple over complex
- ✅ Standard patterns over custom
- ✅ Solve today's problem, not tomorrow's
- ❌ No premature abstraction
- ❌ No over-engineering
- ❌ No excessive configuration

### Cross-Review

| Phase | Creator | Reviewers |
|-------|---------|-----------|
| 1 (Understand) | PM | Dev + QA + UI |
| 2 (Design) | Dev | Secondary Dev + QA |
| 4 (Plan Tests) | QA | Dev |
| 6 (Review) | Security | All |

---

## Phase Skip Rules

### Automatic Skips

- **Phase 3 (UI):** Skip if task has no UI components
- **Phase 9 (Share):** Skip if no Slack integration configured

### User-Requested Skips

User can request skip with reason:
```
User: "skip phase 3, this is backend only"
→ Log skip reason
→ Proceed to Phase 4
```

---

## Files to Load (ON-DEMAND ONLY)

**TOKEN OPTIMIZATION:** Do NOT pre-load all files. Load only when entering that phase.

### Phase Guides (Load ONE at a time)
```toon
phase_files[9]{phase,file,load_when}:
  1,docs/phases/phase-1-understand.md,Entering Phase 1
  2,docs/phases/phase-2-design.md,Entering Phase 2
  3,docs/phases/phase-3-ui.md,Entering Phase 3 (skip if no UI)
  4,docs/phases/phase-4-test-planning.md,Entering Phase 4
  5,docs/phases/phase-5-implementation.md,Entering Phase 5a/5b/5c
  6,docs/phases/phase-6-review.md,Entering Phase 6
  7,docs/phases/phase-7-verification.md,Entering Phase 7
  8,docs/phases/phase-8-documentation.md,Entering Phase 8
  9,docs/phases/phase-9-notification.md,Entering Phase 9
```

### Project Context (Load ONCE at workflow start)
```
.claude/project-contexts/[project]/project-config.yaml
```
**Skip:** conventions.md and rules.md unless explicitly needed.

### Rules (Load only if referenced)
```toon
rules[4]{rule,load_when}:
  tdd-workflow.md,Phase 5 only
  kiss-principle.md,Never (principle is inline above)
  feedback-brainstorming.md,Only on reject/modify response
  workflow-navigation.md,Only if navigation unclear
```

---

## State Management

### Save State
```
workflow:handoff
→ Saves to .claude/logs/workflows/[workflow-id]/
→ Contains: current phase, deliverables, context
```

### Resume State
```
workflow:resume <workflow-id>
→ Loads saved state
→ Continues from last phase
→ Re-shows approval gate if pending
```

### Workflow Status
```
workflow:status
→ Shows: current phase, completed phases, pending tasks
```

---

## Example Workflow Execution

```
User: "workflow:start Add user authentication with JWT"

━━━ AUTO-CONTINUE BLOCK 1 ━━━

Phase 1: Understand 🎯 [AUTO]
├── Analyze requirements
├── Define success criteria
├── Identify risks
└── Shows summary, continues automatically...

Phase 2: Design 🏗️
├── Design JWT architecture
├── Define API endpoints
├── Plan database schema
└── ✋ APPROVAL GATE (1 of 2)

User: "approve"

━━━ AUTO-CONTINUE BLOCK 2 ━━━

Phase 3: UI Breakdown 🎨 [AUTO]
├── Design login/register screens
├── Extract design tokens
└── Continues automatically...

Phase 4: Test Plan 🧪 [AUTO]
├── Define test strategy
├── List test cases
└── Continues automatically...

Phase 5a: Write Tests 🔴 [AUTO]
├── Write failing tests (TDD RED)
├── Run tests → verify they FAIL
└── Continues automatically (if tests fail as expected)...

Phase 5b: Build 🟢
├── Implement code (TDD GREEN)
├── Run tests → verify they PASS
└── ✋ APPROVAL GATE (2 of 2)

User: "approve"

━━━ AUTO-CONTINUE BLOCK 3 ━━━

Phase 5c: Polish ♻️ [AUTO]
├── Refactor code
├── Run tests → still pass
└── Continues automatically...

Phase 6: Review 👀 [AUTO]
├── Security review
├── Code quality check
└── Continues automatically (unless critical issues)...

Phase 7: Verify ✅ [AUTO]
├── Run all tests
├── Check coverage ≥80%
└── Continues automatically...

Phase 8: Document 📚 [AUTO]
├── Update documentation
├── Generate ADRs if needed
└── Continues automatically...

Phase 9: Share 🔔 [AUTO]
├── Send Slack notification
└── Workflow complete ✅

TOTAL APPROVALS NEEDED: 2
```

---

**Remember:**
- Follow phases in order
- Only 2 approval gates: Phase 2 (Design) and Phase 5b (Implementation)
- Auto-continue through other phases unless blocker hit
- TDD is mandatory (RED → GREEN → REFACTOR)
- Save state at token limit
- **ALWAYS show what's next** after each phase (see `rules/workflow-navigation.md`)
