# Workflow Deliverables Rule

**Version:** 1.2.0
**Priority:** CRITICAL - Must verify deliverables at each phase
**Type:** Rule (Mandatory Checklist)

---

## Core Rule

**Every workflow phase MUST produce its required deliverables before proceeding to the next phase.**

---

## TOON Format for AI-Readable Documents

**Use TOON (Token-Oriented Object Notation) for structured data in AI-readable documents.**

TOON reduces token usage by ~40% while improving AI accuracy.

- **Source:** [TOON Format](https://github.com/toon-format/toon)
- **Guide:** `docs/TOON_FORMAT_GUIDE.md`

### When to Use TOON

```toon
format_usage[4]{document,format,reason}:
  TECH_SPEC.md,TOON,AI reads for implementation
  TEST_PLAN.md,TOON,AI reads for test generation
  REQUIREMENTS.md,Markdown,Narrative content
  TECH_SPEC_CONFLUENCE.md,Markdown,Human-readable
```

### TOON Syntax Quick Reference

```toon
# Basic key-value
feature: User Authentication

# Simple arrays
tags[3]: auth,profile,api

# Tabular arrays (biggest savings)
files[3]{path,action,purpose}:
  src/auth.ts,CREATE,Auth service
  src/login.tsx,CREATE,Login screen
  src/types.ts,MODIFY,Add types

# Use semicolons for nested values
models[2]{name,fields}:
  User,id;email;name
  Post,id;title;userId
```

### Templates

- `templates/tech-spec-toon.md` - TOON-enabled tech spec
- `templates/test-plan-toon.md` - TOON-enabled test plan

---

## Phase Deliverables Checklist

### Phase 1: Understand (Requirements)

| Deliverable | Location | Required |
|-------------|----------|----------|
| `REQUIREMENTS.md` | `.claude/logs/workflows/{id}/` | YES |
| User stories | In REQUIREMENTS.md | YES |
| Acceptance criteria | In REQUIREMENTS.md | YES |
| Out of scope | In REQUIREMENTS.md | YES |
| JIRA ticket summary | In REQUIREMENTS.md (if ticket) | If JIRA |

**Validation:**
```markdown
## Phase 1 Deliverables Check
- [ ] REQUIREMENTS.md created
- [ ] User stories documented (at least 1)
- [ ] Acceptance criteria listed (at least 3)
- [ ] Scope clearly defined
```

---

### Phase 2: Design (Technical Specification)

| Deliverable | Location | Required | Purpose |
|-------------|----------|----------|---------|
| `TECH_SPEC.md` | `.claude/logs/workflows/{id}/` | YES | **AI reads this** - Concise, structured for AI |
| `TECH_SPEC_CONFLUENCE.md` | `.claude/logs/workflows/{id}/` | YES | Full Confluence page format for humans |
| Architecture diagram | In both files | YES | System design |
| File structure | In both files | YES | Code organization |
| API contracts | In both files | If API | Endpoint definitions |
| Database schema | In both files | If DB changes | Data model |
| Component hierarchy | In both files | If frontend | UI structure |

**CRITICAL: AI must ALWAYS read `TECH_SPEC.md`, NOT Confluence version.**

#### TECH_SPEC.md (For AI)

Concise, structured format optimized for AI consumption:

```markdown
# Tech Spec: [Feature Name]

## Overview
[1-2 sentences]

## Architecture
- Pattern: [e.g., Repository, Service Layer]
- Key components: [list]

## Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| src/services/auth.ts | CREATE | Auth service |
| src/hooks/useAuth.ts | MODIFY | Add logout |

## API Contracts
### POST /api/auth/login
- Request: { email: string, password: string }
- Response: { token: string, user: User }

## Database Changes
[If applicable]

## Dependencies
- [package@version] - reason

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| [risk] | [mitigation] |
```

#### TECH_SPEC_CONFLUENCE.md (For Humans)

Full Confluence page format with rich documentation:

```markdown
# [Feature Name] - Technical Specification

## Document Info
| Field | Value |
|-------|-------|
| Author | [name] |
| Status | Draft / In Review / Approved |
| Created | [date] |
| JIRA | [ticket-id] |

## Executive Summary
[Detailed overview for stakeholders]

## Background & Context
[Why this feature is needed]

## Goals & Non-Goals
### Goals
- [goal 1]
### Non-Goals
- [explicitly out of scope]

## Technical Design
### Architecture Overview
[Detailed architecture with diagrams]

### Component Design
[Detailed component descriptions]

### Data Flow
[Step-by-step data flow]

### API Design
[Full API documentation with examples]

### Database Schema
[Complete schema with relationships]

## Security Considerations
[Security analysis]

## Performance Considerations
[Performance requirements and optimizations]

## Testing Strategy
[High-level testing approach]

## Rollout Plan
[Deployment strategy]

## Open Questions
[Unresolved items]

## Appendix
[Additional diagrams, references]
```

**Validation:**
```markdown
## Phase 2 Deliverables Check
- [ ] TECH_SPEC.md created (AI-readable format)
- [ ] TECH_SPEC_CONFLUENCE.md created (human-readable)
- [ ] Architecture diagram included in both
- [ ] File structure planned
- [ ] Dependencies identified
- [ ] Risk assessment documented
```

---

### Phase 3: UI Breakdown (Design Analysis)

| Deliverable | Location | Required |
|-------------|----------|----------|
| `UI_BREAKDOWN.md` | `.claude/logs/workflows/{id}/` | YES |
| Component list | In UI_BREAKDOWN.md | YES |
| Props definitions | In UI_BREAKDOWN.md | YES |
| Figma design notes | In UI_BREAKDOWN.md | If Figma |
| Responsive breakpoints | In UI_BREAKDOWN.md | If responsive |
| Accessibility notes | In UI_BREAKDOWN.md | YES |

**Validation:**
```markdown
## Phase 3 Deliverables Check
- [ ] UI_BREAKDOWN.md created
- [ ] Components identified and listed
- [ ] Props/interfaces defined
- [ ] Accessibility requirements noted
- [ ] Design tokens/theme values extracted
```

---

### Phase 4: Test Plan

| Deliverable | Location | Required |
|-------------|----------|----------|
| `TEST_PLAN.md` | `.claude/logs/workflows/{id}/` | YES |
| Test scenarios | In TEST_PLAN.md | YES |
| Test data requirements | In TEST_PLAN.md | YES |
| Coverage targets | In TEST_PLAN.md | YES |
| E2E test cases | In TEST_PLAN.md | If E2E needed |

**Validation:**
```markdown
## Phase 4 Deliverables Check
- [ ] TEST_PLAN.md created
- [ ] Unit test scenarios listed
- [ ] Integration test scenarios listed
- [ ] E2E test scenarios listed (if applicable)
- [ ] Test data requirements defined
- [ ] Coverage target set (minimum 80%)
```

---

### Phase 5a: TDD RED (Write Tests)

| Deliverable | Location | Required |
|-------------|----------|----------|
| Test files | `src/**/__tests__/` | YES |
| Test report (failing) | Console output | YES |

**Validation:**
```markdown
## Phase 5a Deliverables Check
- [ ] Test files created
- [ ] All tests FAIL (expected)
- [ ] Test file naming correct (*.test.ts, *.spec.ts)
- [ ] Assertions are meaningful
```

---

### Phase 5b: TDD GREEN (Implementation)

| Deliverable | Location | Required |
|-------------|----------|----------|
| Implementation code | `src/` | YES |
| Test report (passing) | Console output | YES |

**Validation:**
```markdown
## Phase 5b Deliverables Check
- [ ] Code implemented
- [ ] All tests PASS
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Coverage meets target
```

---

### Phase 5c: TDD REFACTOR (Polish)

| Deliverable | Location | Required |
|-------------|----------|----------|
| Refactored code | `src/` | YES |
| Test report (still passing) | Console output | YES |

**Validation:**
```markdown
## Phase 5c Deliverables Check
- [ ] Code refactored
- [ ] All tests still PASS
- [ ] Code quality improved
- [ ] No new warnings
```

---

### Phase 6: Review (Code Review)

| Deliverable | Location | Required |
|-------------|----------|----------|
| `CODE_REVIEW.md` | `.claude/logs/workflows/{id}/` | YES |
| Security review | In CODE_REVIEW.md | YES |
| Performance review | In CODE_REVIEW.md | YES |
| Best practices check | In CODE_REVIEW.md | YES |

**Validation:**
```markdown
## Phase 6 Deliverables Check
- [ ] CODE_REVIEW.md created
- [ ] Security issues listed (or "None found")
- [ ] Performance issues listed (or "None found")
- [ ] Best practices violations listed (or "None found")
- [ ] Recommendations documented
```

---

### Phase 7: Verify (QA Validation)

| Deliverable | Location | Required |
|-------------|----------|----------|
| `QA_REPORT.md` | `.claude/logs/workflows/{id}/` | YES |
| Test results | In QA_REPORT.md | YES |
| Coverage report | In QA_REPORT.md | YES |
| Manual test results | In QA_REPORT.md | If manual tests |

**Validation:**
```markdown
## Phase 7 Deliverables Check
- [ ] QA_REPORT.md created
- [ ] All tests passing
- [ ] Coverage percentage documented
- [ ] No regressions found
- [ ] QA sign-off given
```

---

### Phase 8: Document (Documentation)

| Deliverable | Location | Required |
|-------------|----------|----------|
| `IMPLEMENTATION_SUMMARY.md` | `.claude/logs/workflows/{id}/` | YES |
| `DEPLOYMENT_GUIDE.md` | `.claude/logs/workflows/{id}/` | If deployment |
| `CHANGELOG.md` update | Project root | YES |
| `CONFLUENCE_PAGE.md` | `.claude/logs/workflows/{id}/` | If Confluence |

**Validation:**
```markdown
## Phase 8 Deliverables Check
- [ ] IMPLEMENTATION_SUMMARY.md created
- [ ] Changes documented
- [ ] CHANGELOG.md updated
- [ ] API documentation updated (if API changes)
- [ ] README updated (if needed)
```

---

### Phase 9: Share (Notification)

| Deliverable | Location | Required |
|-------------|----------|----------|
| JIRA update | JIRA ticket | If JIRA |
| Slack notification | Slack channel | If Slack configured |
| Workflow archive | `.claude/logs/workflows/{id}/` | YES |

**Validation:**
```markdown
## Phase 9 Deliverables Check
- [ ] JIRA ticket updated (if applicable)
- [ ] Team notified (if applicable)
- [ ] Workflow state archived
- [ ] All documents in workflow folder
```

---

## Workflow Folder Structure

Every workflow MUST create this folder structure:

```
.claude/logs/workflows/{workflow-id}/
├── REQUIREMENTS.md           # Phase 1
├── TECH_SPEC.md              # Phase 2 - AI reads this (concise)
├── TECH_SPEC_CONFLUENCE.md   # Phase 2 - Human-readable (full Confluence format)
├── UI_BREAKDOWN.md           # Phase 3 (if UI)
├── TEST_PLAN.md              # Phase 4
├── CODE_REVIEW.md            # Phase 6
├── QA_REPORT.md              # Phase 7
├── IMPLEMENTATION_SUMMARY.md # Phase 8
├── DEPLOYMENT_GUIDE.md       # Phase 8 (if deployment)
├── CHANGELOG_ENTRY.md        # Phase 8
└── workflow-state.json       # Workflow metadata
```

**IMPORTANT:** AI must read `TECH_SPEC.md` for implementation guidance, not `TECH_SPEC_CONFLUENCE.md`.

---

## Enforcement

### Before Phase Transition

**MUST verify current phase deliverables exist before approving:**

```markdown
## Pre-Approval Check

Current Phase: [X]
Required Deliverables:
- [x] Document 1 - Created ✅
- [x] Document 2 - Created ✅
- [ ] Document 3 - MISSING ❌

❌ Cannot proceed - missing deliverables
```

### At Workflow End

**MUST verify all documents exist before closing:**

```markdown
## Workflow Completion Check

Workflow: {workflow-id}
Status: Checking deliverables...

Phase 1 (Understand):
  ✅ REQUIREMENTS.md

Phase 2 (Design):
  ✅ TECH_SPEC.md (AI-readable)
  ✅ TECH_SPEC_CONFLUENCE.md (human-readable)

Phase 3 (UI Breakdown):
  ✅ UI_BREAKDOWN.md

Phase 4 (Test Plan):
  ✅ TEST_PLAN.md

Phase 6 (Review):
  ✅ CODE_REVIEW.md

Phase 7 (Verify):
  ✅ QA_REPORT.md

Phase 8 (Document):
  ✅ IMPLEMENTATION_SUMMARY.md
  ✅ CHANGELOG_ENTRY.md

All deliverables present ✅
Workflow can be closed.
```

---

## Missing Deliverable Recovery

If a deliverable is missing at a later phase:

### Option 1: Create Retroactively
```markdown
**Missing Deliverable Detected**

Document: TECH_SPEC.md (Phase 2)
Current Phase: 5b

Action: Creating TECH_SPEC.md retroactively...
[Generate document based on current implementation]

✅ TECH_SPEC.md created
```

### Option 2: Note Omission
```markdown
**Deliverable Intentionally Skipped**

Document: UI_BREAKDOWN.md
Reason: Backend-only feature, no UI components
Approved by: User at Phase 3

Skipped deliverables:
- UI_BREAKDOWN.md (no UI)
```

---

## Quick Reference Card

| Phase | Key Document | Must Have |
|-------|--------------|-----------|
| 1 | REQUIREMENTS.md | User stories, acceptance criteria |
| 2 | TECH_SPEC.md | AI-readable: Architecture, files, APIs |
| 2 | TECH_SPEC_CONFLUENCE.md | Human-readable: Full Confluence format |
| 3 | UI_BREAKDOWN.md | Components, props, accessibility |
| 4 | TEST_PLAN.md | Test scenarios, coverage target |
| 5a | Test files | Failing tests |
| 5b | Implementation | Passing tests |
| 5c | Refactored code | Still passing |
| 6 | CODE_REVIEW.md | Security, performance, practices |
| 7 | QA_REPORT.md | Test results, coverage |
| 8 | IMPLEMENTATION_SUMMARY.md | Changes, deployment |
| 9 | Workflow archive | All documents |

---

## Automated Checks

At each phase approval, run:

```bash
# Check workflow folder exists
ls .claude/logs/workflows/{workflow-id}/

# Check required documents
[ -f "REQUIREMENTS.md" ] && echo "✅ Phase 1" || echo "❌ Phase 1"
[ -f "TECH_SPEC.md" ] && echo "✅ Phase 2 (AI)" || echo "❌ Phase 2 (AI)"
[ -f "TECH_SPEC_CONFLUENCE.md" ] && echo "✅ Phase 2 (Confluence)" || echo "❌ Phase 2 (Confluence)"
[ -f "UI_BREAKDOWN.md" ] && echo "✅ Phase 3" || echo "⚠️ Phase 3 (optional)"
[ -f "TEST_PLAN.md" ] && echo "✅ Phase 4" || echo "❌ Phase 4"
[ -f "CODE_REVIEW.md" ] && echo "✅ Phase 6" || echo "❌ Phase 6"
[ -f "QA_REPORT.md" ] && echo "✅ Phase 7" || echo "❌ Phase 7"
[ -f "IMPLEMENTATION_SUMMARY.md" ] && echo "✅ Phase 8" || echo "❌ Phase 8"
```

---

## Related Rules

| Rule | Connection |
|------|------------|
| `approval-gates.md` | Deliverables checked at gates |
| `workflow-navigation.md` | Phase tracking |
| `next-step-guidance.md` | Remind about deliverables |
| `tdd-workflow.md` | Test file deliverables |

---

**Version:** 1.2.0
**Last Updated:** 2025-12-10
