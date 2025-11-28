---
name: workflow-orchestrator
description: "Execute 9-phase workflow for complex features. Triggers: 'implement', 'build', 'create feature', 'workflow:start'. DO NOT use for simple bug fixes."
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# CCPM Workflow Orchestrator

**Priority:** CRITICAL - Use for complex feature implementations
**Version:** 5.2.0

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

## 9-Phase Workflow

| Phase | Name | Lead Agent | Deliverable | Gate |
|-------|------|------------|-------------|------|
| 1 | Understand 🎯 | pm-operations-orchestrator | Requirements document | ✋ |
| 2 | Design 🏗️ | Dev agent | Technical design | ✋ |
| 3 | UI Breakdown 🎨 | ui-designer | Component breakdown | ✋ |
| 4 | Plan Tests 🧪 | qa-automation | Test strategy | ✋ |
| 5a | Write Tests 🔴 | qa-automation + Dev | Failing tests (TDD RED) | ✋ |
| 5b | Build 🟢 | Dev agent | Implementation (TDD GREEN) | ✋ |
| 5c | Polish ♻️ | Dev agent | Refactored code (TDD REFACTOR) | ✋ |
| 6 | Review 👀 | security-expert | Quality review report | ✋ |
| 7 | Verify ✅ | qa-automation | All tests pass, coverage ≥80% | ✋ |
| 8 | Document 📚 | pm-operations-orchestrator | Documentation | ✋ |
| 9 | Share 🔔 | slack-operations | Team notification | Auto |

---

## Phase Transition Rules

### Valid Transitions

```
Phase 1 (Understand) → Phase 2 (Design)
  Requires: approve
  Blocker: Unclear requirements

Phase 2 (Design) → Phase 3 (UI)
  Requires: approve
  Blocker: No technical design

Phase 3 (UI) → Phase 4 (Plan Tests)
  Requires: approve
  Skip if: No UI component in task

Phase 4 (Plan Tests) → Phase 5a (Write Tests)
  Requires: approve
  Blocker: No test strategy

Phase 5a (RED) → Phase 5b (GREEN)
  Requires: approve + tests MUST fail
  Blocker: Tests pass (they should fail!)

Phase 5b (GREEN) → Phase 5c (REFACTOR)
  Requires: approve + tests MUST pass
  Blocker: Tests still failing

Phase 5c (REFACTOR) → Phase 6 (Review)
  Requires: approve + tests MUST still pass
  Blocker: Tests broken by refactor

Phase 6 (Review) → Phase 7 (Verify)
  Requires: approve
  Blocker: Critical security issues

Phase 7 (Verify) → Phase 8 (Document)
  Requires: approve + coverage ≥80%
  Blocker: Coverage below target

Phase 8 (Document) → Phase 9 (Share)
  Requires: approve
  Auto-executes Phase 9
```

### Invalid Transitions (BLOCKED)

- ❌ Skip from Phase 1 to Phase 5 (no design)
- ❌ Phase 5b without 5a (no TDD)
- ❌ Phase 7 with failing tests
- ❌ Any phase skip without explicit user request

---

## Approval Gates

### Gate Format

```markdown
╔══════════════════════════════════════════════════════════╗
║  🏗️  Phase [N]: [Name] - Approval Needed                ║
╚══════════════════════════════════════════════════════════╝

## [Friendly Summary] ✨

[Deliverables list]

---

**Options:**
- `approve` / `yes` → Continue to Phase [N+1]
- `reject: <reason>` → Re-do this phase
- `modify: <changes>` → Adjust deliverables
- `stop` → Cancel workflow

⚡ After approval, I'll AUTO-CONTINUE to Phase [N+1]!
```

### Valid Responses

| Response | Action |
|----------|--------|
| `approve` / `yes` | Continue to next phase immediately |
| `reject: <reason>` | Restart current phase with feedback |
| `modify: <changes>` | Adjust deliverables then re-show gate |
| `stop` / `cancel` | End workflow, save state |

---

## AUTO-CONTINUE Behavior

**After user approves:**
1. ✅ Immediately start next phase
2. ✅ No waiting for additional input
3. ✅ Continue until:
   - Next approval gate
   - User rejection
   - Blocking error
   - Token limit (150K) → suggest `workflow:handoff`

**Example Flow:**
```
User: "approve"
→ Claude immediately starts Phase 3
→ Completes Phase 3 deliverables
→ Shows Phase 3 approval gate
→ Waits for user

User: "approve"
→ Claude immediately starts Phase 4
→ ... continues ...
```

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

## Files to Load

### Phase Guides
```
docs/phases/phase-1-understand.md
docs/phases/phase-2-design.md
docs/phases/phase-3-ui.md
docs/phases/phase-4-test-planning.md
docs/phases/phase-5-implementation.md
docs/phases/phase-6-review.md
docs/phases/phase-7-verification.md
docs/phases/phase-8-documentation.md
docs/phases/phase-9-notification.md
```

### Project Context
```
.claude/project-contexts/[project]/project-config.yaml
.claude/project-contexts/[project]/conventions.md
.claude/project-contexts/[project]/rules.md
```

### Rules
```
rules/tdd-workflow.md
rules/kiss-principle.md
rules/code-quality.md
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

Phase 1: Understand 🎯
├── Analyze requirements
├── Define success criteria
├── Identify risks
├── Cross-review with dev/QA/UI
└── Show approval gate ✋

User: "approve"

Phase 2: Design 🏗️  [AUTO-CONTINUE]
├── Design JWT architecture
├── Define API endpoints
├── Plan database schema
├── Cross-review
└── Show approval gate ✋

User: "approve"

Phase 3: UI Breakdown 🎨  [AUTO-CONTINUE]
├── Design login/register screens
├── Extract design tokens
├── Plan component structure
└── Show approval gate ✋

... continues through all phases ...

Phase 9: Share 🔔  [AUTO-EXECUTE]
├── Send Slack notification
├── Update JIRA ticket
└── Workflow complete ✅
```

---

**Remember:**
- Follow phases in order
- Never skip approval gates without user consent
- TDD is mandatory (RED → GREEN → REFACTOR)
- AUTO-CONTINUE after approval
- Save state at token limit
