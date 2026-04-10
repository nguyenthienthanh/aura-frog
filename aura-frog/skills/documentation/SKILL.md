---
name: documentation
description: "Create Architecture Decision Records (ADRs) and Runbooks for operational documentation."
autoInvoke: false
priority: medium
triggers:
  - "ADR"
  - "runbook"
  - "architecture decision"
---

# Skill: Documentation (ADR & Runbook)

Create ADRs and Runbooks for operational documentation.

---

## ADRs

### When to Create
- Choosing between technologies
- Significant architectural changes
- New patterns/conventions
- Deprecating approaches

### Template

```markdown
# ADR-[NUMBER]: [TITLE]

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]
**Date:** YYYY-MM-DD

## Context
[Why do we need this decision?]

## Decision
[What is being decided?]

## Options Considered
### Option N: [Name]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]

## Consequences
- Positive: [Benefits]
- Negative: [Tradeoffs]
- Risks: [Risk] - Mitigation: [How]
```

**Location:** `docs/adr/ADR-NNN-description.md`

**Rules:** Keep immutable (supersede, don't edit). Index in README.

---

## Runbooks

### When to Create
- New service deployment
- Common operational tasks
- Incident response

### Template

```markdown
# Runbook: [Service/Task Name]

**Service:** [Name] | **Owner:** [Team] | **On-Call:** [Contact]

## Prerequisites
- [ ] Access to [system]

## Common Operations
### Start/Stop/Health Check
[Copy-paste-ready commands]

## Troubleshooting
### Issue: [Description]
**Symptoms:** [What user sees]
**Diagnosis:** [Commands]
**Common Causes:** [List with fixes]

## Alerts & Escalation
| Alert | Severity | Action | Escalate After |
```

**Location:** `docs/runbooks/service-name.md`

**Rules:** Test commands before documenting. Review after incidents.

---

## Checklists

**ADR:** Clear problem, options evaluated, decision stated, consequences documented, numbered/indexed.

**Runbook:** Prerequisites listed, commands copy-paste-ready, issues documented, escalation path defined.

---
