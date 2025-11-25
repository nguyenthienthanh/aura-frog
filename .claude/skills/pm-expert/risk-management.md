# Skill: Risk Management

**Category:** PM Expert  
**Priority:** High  
**Used By:** pm-operations-orchestrator

---

## Overview

Identify, assess, mitigate, and monitor project risks throughout the development lifecycle to ensure successful delivery.

---

## Core Capabilities

### 1. Risk Identification

**Common Software Project Risks:**

**Technical Risks:**
- Technology complexity or immaturity
- Integration challenges
- Performance issues
- Security vulnerabilities
- Technical debt
- Scalability concerns

**Schedule Risks:**
- Unrealistic timelines
- Dependency delays
- Resource availability
- Scope creep
- Under-estimation

**Resource Risks:**
- Key person dependency
- Skill gaps
- Team capacity
- Budget constraints

**External Risks:**
- Third-party API changes
- Vendor reliability
- Regulatory changes
- Market changes

**Example Risk Register:**
```markdown
# Risk Register: Social Media Sharing Feature

| ID | Risk | Category | Impact | Prob | Score | Status |
|----|------|----------|--------|------|-------|--------|
| R1 | API rate limits | Technical | H | M | 🟡 6 | Active |
| R2 | Timeline slip | Schedule | M | L | 🟢 3 | Monitor |
| R3 | Third-party API changes | External | H | L | 🟡 4 | Monitor |
| R4 | Key dev unavailable | Resource | H | L | 🟡 4 | Mitigated |
| R5 | Performance on old devices | Technical | M | M | 🟡 5 | Active |
```

### 2. Risk Assessment

**Risk Scoring Matrix:**

```
Impact Levels:
- LOW (1): Minor inconvenience, workaround exists
- MEDIUM (2): Affects timeline or quality
- HIGH (3): Major impact on delivery or quality
- CRITICAL (4): Project failure

Probability Levels:
- LOW (1): < 20% chance
- MEDIUM (2): 20-50% chance
- HIGH (3): 50-80% chance
- VERY HIGH (4): > 80% chance

Risk Score = Impact × Probability

Risk Levels:
- 🟢 LOW (1-2): Accept and monitor
- 🟡 MEDIUM (3-6): Active mitigation needed
- 🔴 HIGH (8-12): Urgent action required
- ⚫ CRITICAL (16): Escalate immediately
```

**Risk Assessment Template:**
```markdown
## Risk: API Rate Limiting

### Description
Social media APIs have strict rate limits. If exceeded, posting functionality will fail.

### Impact Analysis
**Technical Impact:** HIGH
- Feature becomes unusable
- User experience degraded
- Potential data loss

**Business Impact:** HIGH
- Users cannot complete core workflow
- Negative user feedback
- Support tickets increase

**Timeline Impact:** MEDIUM
- May need additional development time
- Testing complexity increases

### Probability Assessment
**Likelihood:** MEDIUM (40%)

**Reasoning:**
- Expected usage: 1000 posts/day
- Facebook limit: 200 posts/hour per user
- Multiple users could hit limits
- Historical data shows similar features hit limits

### Risk Score
Impact: 3 (HIGH) × Probability: 2 (MEDIUM) = 6 (🟡 MEDIUM RISK)

### Triggers
- Usage exceeds 80% of API limits
- Error rates > 5% due to rate limiting
- Multiple users report posting failures
```

### 3. Risk Mitigation Strategies

**4 Risk Response Strategies:**

#### A. Avoid (Eliminate the risk)
```markdown
## Strategy: Avoid

Risk: Third-party API instability

**Avoidance Plan:**
- Use official SDK instead of direct API calls
- Implement feature flags to disable if issues
- Have fallback to manual posting flow

**Result:** Risk reduced from HIGH to LOW
```

#### B. Mitigate (Reduce probability or impact)
```markdown
## Strategy: Mitigate

Risk: API rate limiting

**Mitigation Plan:**

**Reduce Probability:**
1. Implement request queuing
2. Rate limit client-side (prevent spam)
3. Cache API responses (reduce calls)
4. Batch operations where possible

**Reduce Impact:**
1. Exponential backoff + retry logic
2. User-friendly error messages
3. Queue failed posts for retry
4. Monitor usage in real-time

**Cost:** 2 extra days development
**Benefit:** Risk reduced from 🟡 6 to 🟢 3
```

#### C. Transfer (Share or shift the risk)
```markdown
## Strategy: Transfer

Risk: Infrastructure performance

**Transfer Plan:**
- Use cloud provider auto-scaling (AWS/GCP)
- SLA with provider covers downtime
- Load testing before launch (third-party service)

**Result:** Risk transferred to infrastructure provider
```

#### D. Accept (Acknowledge but don't act)
```markdown
## Strategy: Accept

Risk: Minor UI inconsistencies across devices

**Acceptance Rationale:**
- Impact: LOW (cosmetic only)
- Probability: HIGH (many device variations)
- Cost to fully mitigate: 1 week (not worth it)

**Contingency:**
- Document known issues
- Fix critical ones only
- Address others in future releases

**Result:** Risk accepted, contingency plan ready
```

### 4. Risk Monitoring

**Monitor risks throughout project:**

```markdown
# Weekly Risk Review

## Active Risks Status

### 🟡 R1: API Rate Limiting
**Status:** MITIGATED (was 6, now 3)
**Actions Taken:**
- ✅ Implemented rate limiting
- ✅ Added retry logic
- 🔄 Caching in progress

**Next Steps:**
- Complete caching implementation
- Load testing next week

**Owner:** Backend Lead
**Review:** Weekly

---

### 🟢 R2: Timeline Slip
**Status:** MONITORING (score: 3)
**Current:** On track
**Actions:**
- Daily standups
- Buffer days included

**Triggers to Escalate:**
- > 2 days behind schedule
- Unplanned work appears

**Owner:** PM
**Review:** Daily

---

### NEW 🟡 R6: Test Coverage Below Target
**Status:** IDENTIFIED
**Description:** Current coverage 65%, target 85%
**Impact:** MEDIUM (quality risk)
**Probability:** MEDIUM (tight timeline)
**Score:** 🟡 4

**Mitigation:**
- Allocate extra QA time in Phase 4
- Start unit tests early in Phase 5
- Code review focuses on testability

**Owner:** QA Lead
```

### 5. Risk Communication

**Risk Dashboard for Stakeholders:**

```markdown
# Project Risk Dashboard: PROJPH-1234

## Risk Summary
- 🟢 LOW: 2 risks
- 🟡 MEDIUM: 3 risks
- 🔴 HIGH: 0 risks
- ⚫ CRITICAL: 0 risks

**Overall Risk Level:** 🟡 MEDIUM

## Top 3 Risks

### 1. 🟡 API Rate Limiting (Score: 6)
**Status:** Mitigation in progress
**Impact:** Feature unusable if hit limits
**Mitigation:** Queuing, caching, retry logic
**ETA Resolution:** Phase 5 (this week)

### 2. 🟡 Performance on Older Devices (Score: 5)
**Status:** Monitoring
**Impact:** Poor UX for 20% of users
**Mitigation:** Performance testing, optimization
**ETA Resolution:** Phase 7

### 3. 🟢 Key Developer Availability (Score: 4)
**Status:** Mitigated
**Impact:** Could delay Phase 5-6
**Mitigation:** Knowledge sharing, pair programming
**ETA Resolution:** Ongoing

## Trend
📉 Risk level decreasing (was 🔴 HIGH 2 weeks ago)

## Actions Required
- None from stakeholders
- Continue monitoring

**Next Review:** [Date]
```

### 6. Contingency Planning

**"What if" scenarios:**

```markdown
# Contingency Plans

## Scenario 1: API Provider Changes API

**Probability:** LOW
**Impact:** CRITICAL
**Lead Time:** 2 weeks notice typically

**Contingency Plan:**
1. Monitor API changelog daily
2. Test against beta APIs
3. Implement adapter pattern (easy to swap)
4. Maintain fallback to v1 API

**Activation Trigger:**
- API deprecation notice received
- Breaking changes announced

**Responsible:** Backend Lead

---

## Scenario 2: Timeline Slip by 1 Week

**Probability:** MEDIUM
**Impact:** MEDIUM
**Current Buffer:** 3 days

**Contingency Options:**

**Option A: Reduce Scope**
- Remove Twitter integration
- Defer analytics to Phase 2
- Impact: 80% features delivered on time

**Option B: Add Resources**
- Bring in additional developer
- Cost: $5K
- Impact: On-time delivery

**Option C: Extend Timeline**
- Request 1 week extension
- Impact: Affects downstream projects
- Requires stakeholder approval

**Decision Criteria:**
- If slip < 5 days → Use buffer
- If slip 5-7 days → Option A (reduce scope)
- If slip > 7 days → Option B or C

**Responsible:** PM + Product Owner

---

## Scenario 3: Critical Bug Found in Phase 7

**Probability:** MEDIUM
**Impact:** HIGH

**Contingency:**
1. Immediate triage meeting
2. Assess if blocking or workaround exists
3. Decision:
   - **If blocking:** Fix before deployment
   - **If workaround:** Document + fix in Phase 2

**Responsible:** QA Lead + Tech Lead
```

### 7. Risk Escalation

**Escalation Matrix:**

```markdown
# Risk Escalation Protocol

## Level 1: Team Level (🟢 LOW - 🟡 MEDIUM)
**Score:** 1-6
**Handler:** Tech Lead, PM
**Response Time:** 1-2 days
**Actions:** Team mitigation plans

## Level 2: Manager Level (🔴 HIGH)
**Score:** 8-12
**Handler:** Engineering Manager, Product Manager
**Response Time:** Same day
**Actions:** Resource reallocation, scope changes

## Level 3: Executive Level (⚫ CRITICAL)
**Score:** 16
**Handler:** Director, VP
**Response Time:** Immediate
**Actions:** Project pivot, major decisions

## Escalation Email Template

Subject: 🔴 RISK ESCALATION: [Risk Name] - [Project]

**Risk:** [Name]
**Score:** [Number] (Impact: [X] × Probability: [Y])
**Status:** 🔴 HIGH RISK

**Impact:**
[Describe business and technical impact]

**Current Mitigation:**
[What we're doing]

**Why Escalating:**
[Why team-level mitigation insufficient]

**Options:**
1. [Option A with pros/cons]
2. [Option B with pros/cons]

**Recommendation:**
[Preferred option with reasoning]

**Decision Needed By:**
[Date/Time]

**Escalated By:** [Name]
**Contact:** [Email/Slack]
```

---

## Risk Management Throughout Workflow

### Phase 1: Requirements Analysis
- Identify initial risks
- Technical feasibility assessment
- Resource availability check

### Phase 2: Technical Planning
- Architecture risks
- Integration risks
- Technical debt assessment

### Phase 3: Design Review
- UX/UI risks
- Accessibility risks
- Design complexity

### Phase 4: Test Planning
- Testing risks
- Coverage risks
- Timeline risks for testing

### Phase 5: Implementation (TDD)
- Development risks
- Integration issues
- Quality risks

### Phase 6: Code Review
- Code quality risks
- Security vulnerabilities
- Performance issues

### Phase 7: QA Validation
- Testing gaps
- Coverage shortfalls
- Production readiness

### Phase 8: Documentation
- Documentation gaps
- Knowledge transfer risks

### Phase 9: Notification
- Communication risks
- Stakeholder alignment

---

## Best Practices

### Do's ✅
- ✅ Identify risks early and continuously
- ✅ Be honest about risk levels
- ✅ Document all risks and decisions
- ✅ Review risks regularly (weekly minimum)
- ✅ Involve team in risk identification
- ✅ Have contingency plans for high risks
- ✅ Track risk mitigation progress

### Don'ts ❌
- ❌ Hide or downplay risks
- ❌ Ignore low-probability high-impact risks
- ❌ Wait until risks materialize
- ❌ Over-mitigate low risks (waste resources)
- ❌ Forget to close resolved risks
- ❌ Make decisions without considering risks

---

## Risk Metrics

Track these KPIs:
- Number of risks identified
- Risk score trend over time
- Risks materialized vs identified
- Mitigation effectiveness rate
- Time to resolve risks
- Budget spent on risk mitigation

---

## Integration with Other Skills

Works closely with:
- **Stakeholder Management** - Communicating risks
- **Project Planning** - Factoring risks into plans
- **Requirement Analysis** - Identifying requirement risks

---

**Used by PM Operations Orchestrator to proactively manage project risks throughout the 9-phase workflow.**
