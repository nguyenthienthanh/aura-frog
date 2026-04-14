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

# Documentation (ADR & Runbook)

## When to Create

- **ADR:** Technology choices, architectural changes, new patterns, deprecations
- **Runbook:** Service deployment, common ops tasks, incident response

## ADR Template

```markdown
# ADR-[N]: [TITLE]
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-X
**Date:** YYYY-MM-DD

## Context — ## Decision — ## Options Considered — ## Consequences
```

Location: `docs/adr/ADR-NNN-description.md`. Keep immutable — supersede, don't edit.

## Runbook Template

```markdown
# Runbook: [Service]
**Owner:** [Team] | **On-Call:** [Contact]

## Prerequisites — ## Common Operations — ## Troubleshooting — ## Alerts & Escalation
```

Location: `docs/runbooks/service-name.md`. Test commands before documenting.

## Principles

- ADR: clear problem, options evaluated, consequences documented
- Runbook: commands copy-paste-ready, escalation path defined
