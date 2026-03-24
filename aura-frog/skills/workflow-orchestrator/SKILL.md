---
name: workflow-orchestrator
description: "Execute 5-phase workflow for complex features. Includes fasttrack mode for pre-approved specs. DO NOT use for simple bug fixes."
autoInvoke: true
priority: high
triggers:
  - "implement"
  - "build feature"
  - "create feature"
  - "workflow:start"
  - "complex task"
  - "fasttrack:"
  - "fast-track"
  - "just build it"
  - "execute from specs"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Aura Frog Workflow Orchestrator

**Priority:** CRITICAL - Use for complex feature implementations

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
5. **Challenge requirements** → Ask clarifying questions before Phase 1 (see `rules/workflow/requirement-challenger.md`)

---

## Token Budget Per Phase

**CRITICAL:** Stay within budget to avoid context explosion. Target: ≤30K for full workflow.

```toon
token_budget[5]{phase,max_tokens,format}:
  1,2000,TOON tables + minimal prose
  2,1500,Test code only - no explanations
  3,2500,Implementation code - minimal comments
  4,1000,Refactor summary + review findings in TOON
  5,500,Status only
```

---

## 5-Phase Workflow

### Collaborative Planning (Deep Tasks Only)

For **Deep complexity** tasks, Phase 1 uses multi-perspective deliberation:
- 3 agents (Builder, Breaker, User) analyze independently
- Cross-review and debate each other's proposals
- Simulate use cases to find gaps
- PM converges on optimal plan

**Details:** `rules/workflow/collaborative-planning.md`

**Gate:** Only for Deep tasks. Quick/Standard use single-agent Phase 1.

| Phase | Name | Lead Agent | Deliverable | Gate |
|-------|------|------------|-------------|------|
| 1 | Understand + Design | lead → Dev | Requirements (TOON), technical design | **APPROVAL** |
| 2 | Test (RED) | tester + Dev | Failing tests (TDD RED) | Auto |
| 3 | Build (GREEN) | Dev agent | Implementation (TDD GREEN) | **APPROVAL** |
| 4 | Refactor + Review | Dev + security | Clean code, quality/security check | Auto* |
| 5 | Finalize | tester + PM | Coverage ≥80%, docs, notification | Auto |

**Gate Legend:**
- **APPROVAL** = Must wait for user approval before continuing
- Auto = Auto-continue after showing deliverables
- Auto* = Auto-continue unless critical issues found

---

## Phase Transition Rules

```
Phase 1 (Understand + Design) → Phase 2 (Test RED)
  Mode: APPROVAL REQUIRED
  Pre-step: Challenge requirements (Standard/Deep only)
  Pre-step (Deep only): Collaborative planning (3-perspective deliberation)
  Blocker: No design approved

Phase 2 (Test RED) → Phase 3 (Build GREEN)
  Mode: AUTO-CONTINUE (if tests fail as expected)
  Blocker: Tests pass → STOP (tests aren't testing new code)

Phase 3 (Build GREEN) → Phase 4 (Refactor + Review)
  Mode: APPROVAL REQUIRED
  Blocker: Tests still failing

Phase 4 (Refactor + Review) → Phase 5 (Finalize)
  Mode: AUTO-CONTINUE (if tests still pass, no critical issues)
  Blocker: Tests broken by refactor → STOP
  Blocker: Critical security issues → STOP

Phase 5 (Finalize) → DONE
  Mode: AUTO-COMPLETE
  Blocker: Coverage <80% → STOP
```

### Invalid Transitions (BLOCKED)

- Skip from Phase 1 to Phase 3 (no tests written)
- Phase 3 without Phase 2 (no TDD)
- Phase 5 with failing tests
- Any phase skip without explicit user request

---

## Approval Gates (Only 2)

Approval is only required at **Phase 1 (Design)** and **Phase 3 (Build)**.

### Gate Format

```markdown
Phase [N]: [Name] - Approval Needed

## [Friendly Summary]

[Deliverables list]

---

Progress: [X]% ([N]/5 phases)

After approval:
→ Phases [N+1] to [X] will AUTO-CONTINUE
→ Next approval gate: Phase [Y]

---

Options:
- `approve` / `yes` → Continue
- `reject: <reason>` → Brainstorm & re-do
- `modify: <changes>` → Adjust deliverables
- `stop` → Cancel workflow
```

See: `rules/workflow/workflow-navigation.md` for full navigation format.

### Valid Responses

| Response | Action |
|----------|--------|
| `approve` / `yes` | Continue to next phase |
| `reject: <reason>` | **Brainstorm first**, then restart phase |
| `modify: <changes>` | **Light brainstorm**, then adjust |
| `stop` / `cancel` | End workflow, save state |

### Feedback Handling

**Default:** Brainstorm feedback before implementing.
**Force mode:** Skip brainstorming with "must do: ..." / "just do: ..." / "work like that"

See: `rules/workflow/feedback-brainstorming.md`

---

## AUTO-CONTINUE Behavior

### Flow Overview
```
START → Phase 1 APPROVAL
      → Phase 2 (auto) → Phase 3 APPROVAL
      → Phase 4 (auto) → Phase 5 (auto) → DONE
```

**Auto-Stop Triggers:**
- Phase 2: Tests pass when they should fail
- Phase 4: Tests fail after refactor, or critical security issues
- Phase 5: Coverage below 80%
- Any phase: Token limit reached

**Token Awareness:**
- At 75% (150K tokens): Warn user
- At 85% (170K tokens): Suggest `workflow:handoff`
- At 90% (180K tokens): Force handoff

---

## Critical Rules

### TDD (NON-NEGOTIABLE)

```
Phase 2 (RED):
  Write tests FIRST → Run tests → MUST FAIL
  If tests pass → STOP

Phase 3 (GREEN):
  Write minimal code to pass → Run tests → MUST PASS
  If tests fail → Fix code, not tests

Phase 4 (REFACTOR):
  Clean up code → Run tests → MUST STILL PASS
  If tests fail → Revert refactor
```

### KISS Principle

- Simple over complex
- Standard patterns over custom
- Solve today's problem, not tomorrow's
- No premature abstraction or over-engineering

### Cross-Review

| Phase | Creator | Reviewers |
|-------|---------|-----------|
| 1 (Understand + Design) | PM → Dev | Secondary Dev + QA |
| 4 (Refactor + Review) | Dev + Security | All |

---

## Phase Skip Rules

### Automatic Skips
- **Phase 5 notification:** Skip Slack if no integration configured
- **Phase 5 docs:** Skip if no documentation changes needed

### User-Requested Skips
User can request skip with reason. Log skip reason and proceed.

---

## Files to Load (ON-DEMAND ONLY)

**TOKEN OPTIMIZATION:** Load only when entering that phase.

### Phase Guides (Load ONE at a time)
```toon
phase_files[5]{phase,file,load_when}:
  1,docs/phases/PHASE_1_UNDERSTAND_DESIGN.MD,Entering Phase 1
  2,docs/phases/PHASE_2_TEST_RED.MD,Entering Phase 2
  3,docs/phases/PHASE_3_BUILD_GREEN.MD,Entering Phase 3
  4,docs/phases/PHASE_4_REFACTOR_REVIEW.MD,Entering Phase 4
  5,docs/phases/PHASE_5_FINALIZE.MD,Entering Phase 5
```

### Project Context (Load ONCE at workflow start)
```
.claude/project-contexts/[project]/project-config.yaml
```
**Skip:** conventions.md and rules.md unless explicitly needed.

### Rules (Load only if referenced)
```toon
rules[4]{rule,load_when}:
  tdd-workflow.md,Phase 2-4 only
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

━━━ Phase 1: Understand + Design ━━━
├── Challenge requirements (1-2 questions)
├── Analyze requirements, define success criteria
├── Design architecture, API endpoints, data model
└── APPROVAL GATE (1 of 2)

User: "approve"

━━━ AUTO-CONTINUE BLOCK ━━━

Phase 2: Test (RED) [AUTO]
├── Plan test strategy inline
├── Write failing tests (TDD RED)
├── Run tests → verify they FAIL
└── Continues automatically...

Phase 3: Build (GREEN)
├── Implement minimal code (TDD GREEN)
├── Run tests → verify they PASS
└── APPROVAL GATE (2 of 2)

User: "approve"

━━━ AUTO-CONTINUE TO DONE ━━━

Phase 4: Refactor + Review [AUTO]
├── Clean up code (TDD REFACTOR)
├── Security/quality check inline
├── Run tests → still pass
└── Continues automatically...

Phase 5: Finalize [AUTO]
├── Verify coverage ≥80%
├── Update documentation if needed
├── Send notification if configured
└── Workflow complete

TOTAL APPROVALS NEEDED: 2
```

---

## Fast-Track Mode

**When to use:** User provides complete specs/design. Skips Phase 1, auto-executes Phases 2-5 without approval gates.

**Triggers:** `fasttrack: <specs>` | `workflow:fasttrack <file>` | "just build it"

### Spec Validation (Required Before Start)

```toon
required_sections[6]{section,purpose}:
  Overview,What we're building
  Requirements,Functional requirements
  Technical Design,Architecture/approach
  API/Interfaces,Endpoints or component APIs
  Data Model,Database/state structure
  Acceptance Criteria,Definition of done
```

**If missing sections:** Ask user to provide them.

### Fast-Track Execution

```
Phase 2 → Phase 3 → Phase 4 → Phase 5
(No approval gates — only stops on errors)
```

### Stop Conditions

| Condition | Phase | Action |
|-----------|-------|--------|
| Tests pass in RED | 2 | Stop — specs may be incomplete |
| Tests fail after 3 attempts | 3 | Stop — ask user for clarification |
| Critical security issue | 4 | Stop — fix before proceeding |
| Coverage below 80% | 5 | Add tests, retry twice, then ask |
| Token limit warning | Any | Save state and handoff |

### Switching Modes

```
standard → fasttrack: "approve phase 1, then fasttrack the rest"
fasttrack → standard: On error, auto-switches to standard mode
```

---

## Agent Teams Mode (Experimental)

**When:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled AND complexity = Deep + 2+ domains.

**Gate:** Team mode ONLY activates for Deep complexity with 2+ domains scoring >=50 each. Quick/Standard tasks use single-agent or subagent mode (~3x cost reduction).

### Phase Team Composition

```toon
phase_teams[5]{phase,lead,teammates,team_size}:
  1-Understand+Design,lead → architect,frontend+tester,3
  2-Test RED,tester,architect,2
  3-Build GREEN,architect,frontend+tester,3
  4-Refactor+Review,architect+security,tester(reviewer),3
  5-Finalize,lead,-,1
```

### Teammate Operation Pattern

```
1. Read ~/.claude/teams/[team-name]/config.json
2. TaskList → find unclaimed tasks
3. TaskUpdate(taskId, owner, status="in_progress") → claim
4. Do work → TaskUpdate(taskId, status="completed")
5. SendMessage(recipient="lead", content="Done: [summary]")
6. Check for more tasks or await shutdown
```

### Team vs Subagent Fallback

If Agent Teams not enabled OR complexity not Deep + multi-domain:
- Sequential execution (standard subagent behavior)
- Single context window, hub-spoke communication
- No additional token overhead

**Full docs:** `docs/AGENT_TEAMS_GUIDE.md` | `docs/TEAM_WORKFLOW_BRIDGE.md`

---

**Remember:**
- Follow phases in order
- Only 2 approval gates: Phase 1 (Design) and Phase 3 (Build)
- Auto-continue through other phases unless blocker hit
- TDD is mandatory (RED → GREEN → REFACTOR)
- Save state at token limit
- **ALWAYS show what's next** after each phase (see `rules/workflow/workflow-navigation.md`)
