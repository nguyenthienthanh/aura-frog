# Skill: Risk Management

**Category:** PM Expert
**Version:** 5.2.0
**Used By:** pm-operations-orchestrator

---

## Overview

Identify, assess, mitigate, and monitor project risks throughout the development lifecycle.

---

## Risk Categories

| Category | Common Risks |
|----------|--------------|
| Technical | Technology complexity, integration, performance, security, scalability |
| Schedule | Unrealistic timelines, dependency delays, scope creep, under-estimation |
| Resource | Key person dependency, skill gaps, team capacity, budget constraints |
| External | Third-party API changes, vendor reliability, regulatory changes |

---

## Risk Scoring

```
Impact Levels:
- LOW (1): Minor inconvenience, workaround exists
- MEDIUM (2): Affects timeline or quality
- HIGH (3): Major impact on delivery
- CRITICAL (4): Project failure

Probability Levels:
- LOW (1): < 20%
- MEDIUM (2): 20-50%
- HIGH (3): 50-80%
- VERY HIGH (4): > 80%

Risk Score = Impact × Probability

Risk Levels:
- 🟢 LOW (1-2): Accept and monitor
- 🟡 MEDIUM (3-6): Active mitigation needed
- 🔴 HIGH (8-12): Urgent action required
- ⚫ CRITICAL (16): Escalate immediately
```

---

## Risk Register Template

```markdown
| ID | Risk | Category | Impact | Prob | Score | Status |
|----|------|----------|--------|------|-------|--------|
| R1 | API rate limits | Technical | H | M | 🟡 6 | Active |
| R2 | Timeline slip | Schedule | M | L | 🟢 3 | Monitor |
| R3 | Key dev unavailable | Resource | H | L | 🟡 4 | Mitigated |
```

---

## Mitigation Strategies

### 1. Avoid (Eliminate)
Use official SDK instead of direct API, implement feature flags for disable capability

### 2. Mitigate (Reduce)
**Reduce Probability:** Request queuing, rate limiting, caching, batching
**Reduce Impact:** Exponential backoff, retry logic, user-friendly errors, real-time monitoring

### 3. Transfer (Shift)
Use cloud provider auto-scaling, SLA coverage, third-party testing services

### 4. Accept (Acknowledge)
For low-impact risks: Document known issues, fix only critical ones

---

## Weekly Review Template

```markdown
# Weekly Risk Review

## Active Risks Status

### 🟡 R1: API Rate Limiting
**Status:** MITIGATED (was 6, now 3)
**Actions Taken:** ✅ Rate limiting, ✅ Retry logic, 🔄 Caching in progress
**Owner:** Backend Lead

### 🟢 R2: Timeline Slip
**Status:** MONITORING (score: 3)
**Triggers to Escalate:** > 2 days behind schedule
**Owner:** PM
```

---

## Escalation Protocol

| Level | Score | Handler | Response Time |
|-------|-------|---------|---------------|
| Team | 1-6 (🟢🟡) | Tech Lead, PM | 1-2 days |
| Manager | 8-12 (🔴) | Eng Manager | Same day |
| Executive | 16 (⚫) | Director/VP | Immediate |

---

## Risk by Phase

| Phase | Key Risks |
|-------|-----------|
| 1. Requirements | Technical feasibility, resource availability |
| 2. Design | Architecture, integration, technical debt |
| 3. UI | UX/UI complexity, accessibility |
| 4. Test Planning | Coverage gaps, timeline for testing |
| 5. Implementation | Development delays, integration issues |
| 6. Code Review | Security vulnerabilities, performance |
| 7. QA | Testing gaps, coverage shortfalls |

---

## Best Practices

### Do's ✅
- Identify risks early and continuously
- Be honest about risk levels
- Document all risks and decisions
- Review weekly minimum
- Have contingency plans for high risks

### Don'ts ❌
- Hide or downplay risks
- Ignore low-probability high-impact risks
- Wait until risks materialize
- Over-mitigate low risks

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
