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

**Category:** Documentation
**Version:** 1.0.0
**Used By:** All agents, Phase 8

---

## Overview

Create Architecture Decision Records (ADRs) and Runbooks for operational documentation.

---

## Part 1: Architecture Decision Records (ADR)

### When to Create ADR
- Choosing between technologies
- Significant architectural changes
- New patterns or conventions
- Deprecating existing approaches

### ADR Template

```markdown
# ADR-[NUMBER]: [TITLE]

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]
**Date:** YYYY-MM-DD
**Deciders:** [Names/Teams]

## Context

[What is the issue? Why do we need to make a decision?]

## Decision

[What is the change being proposed/decided?]

## Options Considered

### Option 1: [Name]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]

### Option 2: [Name]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]

### Option 3: [Name]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Tradeoff 1]
- [Tradeoff 2]

### Risks
- [Risk 1] - Mitigation: [How to handle]

## References

- [Link to relevant docs/discussions]
```

### ADR Example

```markdown
# ADR-001: Use PostgreSQL for Primary Database

**Status:** Accepted
**Date:** 2025-01-15
**Deciders:** Backend Team, DevOps

## Context

We need a relational database for our new application. The application requires ACID compliance, complex queries, and JSON support.

## Decision

Use PostgreSQL 16 as the primary database.

## Options Considered

### Option 1: PostgreSQL
- **Pros:** ACID, JSON support, excellent performance, open source
- **Cons:** Requires more ops expertise than managed solutions

### Option 2: MySQL
- **Pros:** Familiar, widely supported
- **Cons:** Weaker JSON support, licensing concerns

### Option 3: MongoDB
- **Pros:** Flexible schema, easy scaling
- **Cons:** Not ideal for relational data, eventual consistency

## Consequences

### Positive
- Full ACID compliance
- Native JSON/JSONB support
- Strong ecosystem and tooling

### Negative
- Team needs PostgreSQL training
- More complex backup strategy
```

### ADR Naming Convention
```
docs/adr/
├── ADR-001-database-selection.md
├── ADR-002-authentication-strategy.md
├── ADR-003-api-versioning.md
└── README.md (index)
```

---

## Part 2: Runbook

### When to Create Runbook
- New service deployment
- Common operational tasks
- Incident response procedures
- On-call handoff documentation

### Runbook Template

```markdown
# Runbook: [Service/Task Name]

**Service:** [Service name]
**Owner:** [Team/Person]
**Last Updated:** YYYY-MM-DD
**On-Call:** [Rotation/Contact]

## Overview

[Brief description of what this runbook covers]

## Prerequisites

- [ ] Access to [system/tool]
- [ ] Credentials for [service]
- [ ] VPN connected (if applicable)

## Common Operations

### Start Service
```bash
# Command to start
systemctl start service-name

# Verify running
systemctl status service-name
```

### Stop Service
```bash
# Graceful shutdown
systemctl stop service-name

# Force stop (if graceful fails)
systemctl kill service-name
```

### Check Logs
```bash
# Recent logs
journalctl -u service-name -n 100

# Follow logs
journalctl -u service-name -f

# Search for errors
journalctl -u service-name | grep -i error
```

### Health Check
```bash
# Endpoint check
curl -s http://localhost:8080/health | jq

# Expected response
# { "status": "healthy", "version": "1.0.0" }
```

## Troubleshooting

### Issue: Service Won't Start

**Symptoms:** Service fails to start, exits immediately

**Diagnosis:**
```bash
journalctl -u service-name -n 50
```

**Common Causes:**
1. Missing environment variables → Check `.env` file
2. Port already in use → `lsof -i :8080`
3. Database connection failed → Check DB connectivity

**Resolution:**
```bash
# Fix env vars
source /etc/service-name/env

# Restart
systemctl restart service-name
```

### Issue: High Memory Usage

**Symptoms:** Memory > 80% threshold

**Diagnosis:**
```bash
# Check memory
free -h
ps aux --sort=-%mem | head -10
```

**Resolution:**
```bash
# Restart service (temporary)
systemctl restart service-name

# Scale if needed
kubectl scale deployment service-name --replicas=3
```

## Alerts & Escalation

| Alert | Severity | Action | Escalate After |
|-------|----------|--------|----------------|
| Service Down | Critical | Restart, check logs | 5 min |
| High CPU | Warning | Monitor, scale if needed | 15 min |
| High Memory | Warning | Restart if > 90% | 10 min |
| Error Rate > 5% | Critical | Check logs, rollback | 5 min |

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Primary On-Call | [Name] | [Slack/Phone] |
| Secondary | [Name] | [Slack/Phone] |
| Team Lead | [Name] | [Slack/Phone] |

## Related Documentation

- [Service Architecture](link)
- [Deployment Guide](link)
- [Monitoring Dashboard](link)
```

### Runbook Naming Convention
```
docs/runbooks/
├── api-service.md
├── database-maintenance.md
├── deployment-rollback.md
├── incident-response.md
└── README.md (index)
```

---

## Documentation Checklist

### ADR Checklist
- [ ] Clear problem statement
- [ ] Options evaluated objectively
- [ ] Decision clearly stated
- [ ] Consequences documented
- [ ] Numbered and indexed

### Runbook Checklist
- [ ] Prerequisites listed
- [ ] Commands are copy-paste ready
- [ ] Common issues documented
- [ ] Escalation path defined
- [ ] Contacts current

---

## Best Practices

### Do's
- Keep ADRs immutable (supersede, don't edit)
- Test runbook commands before documenting
- Include "why" not just "what"
- Review runbooks after incidents
- Index all documentation

### Don'ts
- Delete old ADRs (mark superseded)
- Write runbooks without testing
- Assume reader knows context
- Let docs become stale
- Skip the troubleshooting section

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
