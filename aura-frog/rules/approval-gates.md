# Approval Gates - Phase Transition Control

**Version:** 1.20.1
**Purpose:** Streamlined 2-gate approval workflow
**Priority:** CRITICAL

---

## Core Rule

**Only 2 approval gates** in the 9-phase workflow:

| Gate | Phase | Why |
|------|-------|-----|
| 1st | Phase 2 (Design) | Architecture decisions are hard to change later |
| 2nd | Phase 5b (Implementation) | Main implementation — review before refactor |

All other phases **auto-continue** after executing and showing deliverables.

---

## Phase Transitions

```toon
phases[11]{phase,name,type,auto_stop_if}:
  1,Understand,⚡ Auto,Never
  2,Design,✋ Approval,—
  3,UI Breakdown,⚡ Auto,Never (skip if no UI)
  4,Test Plan,⚡ Auto,Never
  5a,TDD RED,⚡ Auto,Tests pass (should fail)
  5b,TDD GREEN,✋ Approval,—
  5c,TDD REFACTOR,⚡ Auto,Tests fail
  6,Review,⚡ Auto*,Critical security issues
  7,Verify,⚡ Auto,Tests fail or coverage <80%
  8,Document,⚡ Auto,Never
  9,Share,⚡ Auto,Never (skip if no Slack)
```

**Legend:** ✋ = Wait for user | ⚡ = Auto-continue | ⚡* = Auto unless issues

---

## Flow Overview

```
START → Phase 1 (auto) → Phase 2 ✋ APPROVAL
      → Phase 3-5a (auto) → Phase 5b ✋ APPROVAL
      → Phase 5c-9 (auto) → DONE
```

**IMPORTANT:** Auto-continue ≠ Skip. Every phase executes fully and shows deliverables.

---

## Approval Prompt Format

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Phase [N]: [Name] - Approval Needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Deliverables summary]

📍 Progress: ████░░░░░░ [X]% ([N]/9 phases)
⏭️ After approval: Auto-continues to Phase [Y]

Options: approve | reject: <reason> | modify: <changes> | stop
```

---

## Valid Responses

```toon
responses[5]{input,action}:
  "approve/yes/ok/continue",Proceed to next phase
  "reject: <reason>",Brainstorm feedback then restart phase
  "modify: <changes>",Light brainstorm then adjust deliverables
  "stop/cancel",Save state and end workflow
  "back/previous",Return to previous phase (requires confirm)
```

**Force mode:** "must do: ..." or "just do: ..." skips brainstorming.

---

## State Tracking

Workflow state saved to `.claude/logs/workflows/[workflow-id]/workflow-state.json`

**Full details:** `skills/workflow-orchestrator/SKILL.md`

---

**Version:** 1.20.1
