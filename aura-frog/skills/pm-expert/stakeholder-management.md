# Skill: Stakeholder Management

**Category:** PM Expert  
**Priority:** High  
**Used By:** pm-operations-orchestrator

---

## Overview

Managing relationships and communications with all project stakeholders including clients, team members, executives, and end users.

---

## Core Capabilities

### 1. Stakeholder Identification

**Identify all project stakeholders:**
- Technical team (developers, QA, designers)
- Product owners and managers
- Business stakeholders
- End users
- Regional leads (for multi-region projects)

**Example:**
```markdown
# Stakeholder Map: Social Media Sharing Feature

## Primary Stakeholders
- PH Team: Jacky Cheung (Tech Lead)
- MY Team: Lucas Mok (Frontend)
- Product: Sarah Chen (Product Manager)

## Secondary Stakeholders
- Marketing Team (feature users)
- Compliance (data privacy)

## Communication Frequency
- Tech Team: Daily standups
- Product: Weekly sync
- Business: Bi-weekly updates
```

### 2. Communication Planning

**Define communication strategy:**
- Who needs what information
- How often to communicate
- Best communication channels
- Escalation paths

**Channels:**
- Slack: Daily updates, quick questions
- Email: Formal communications, approvals
- Meetings: Planning, reviews, retrospectives
- JIRA: Technical updates, progress tracking
- Confluence: Documentation, specs

### 3. Expectation Management

**Set and manage expectations:**

```markdown
## Feature Expectations

### Timeline
- Initial estimate: 2 weeks
- Buffer included: +3 days
- Delivery date: [Date]

### Scope
✅ In Scope:
- Facebook, Instagram, LinkedIn posting
- Image and video support
- Error handling

❌ Out of Scope:
- Twitter/X integration (Phase 2)
- Scheduling posts (Future)
- Analytics dashboard (Separate epic)

### Success Criteria
- All acceptance criteria met
- 85%+ test coverage
- Zero critical bugs
- Performance benchmarks met
```

### 4. Status Reporting

**Regular status updates format:**

```markdown
# Weekly Status Report: PROJ-1234

## Progress This Week
✅ Phase 1-3 completed
🔄 Phase 4 in progress (80%)
⏸️ Phase 5 pending

## Accomplishments
- Requirements analyzed and approved
- Tech spec completed
- Design review passed
- Test plan drafted

## Risks
🟡 MEDIUM: Third-party API rate limits
   Mitigation: Implement retry logic + caching

🟢 LOW: Performance on older devices
   Mitigation: Performance testing in Phase 4

## Blockers
None currently

## Next Week
- Complete Phase 4 (Refactor + Review)
- Start Phase 5 (Finalize)
- Review with stakeholders

## Metrics
- Test Coverage: N/A (not started)
- Code Quality: N/A
- On Track: ✅ Yes
```

### 5. Conflict Resolution

**Handle stakeholder conflicts:**

**Common Conflicts:**
1. **Scope Creep**
   - Document original scope
   - Evaluate new requests
   - Propose separate phases

2. **Timeline Pressure**
   - Explain trade-offs (scope vs time vs quality)
   - Provide options with pros/cons
   - Get stakeholder buy-in

3. **Technical Disagreements**
   - Present both approaches objectively
   - Show pros/cons with data
   - Facilitate decision-making

**Example Response:**
```markdown
## Conflict: Add Twitter Integration

### Original Request
Add Facebook, Instagram, LinkedIn (2 weeks)

### New Request
Add Twitter/X integration

### Analysis
**Timeline Impact:** +3 days
**Scope Impact:** +30%
**Risk:** API changes (Twitter API unstable)

### Options

**Option 1: Include in Current Sprint**
- ✅ Feature complete sooner
- ❌ Delays delivery by 3 days
- ❌ Increases risk

**Option 2: Defer to Phase 2**
- ✅ Original timeline maintained
- ✅ Reduced risk
- ❌ Twitter available later

**Option 3: Parallel Development**
- ✅ No timeline delay
- ❌ Requires additional developer
- ❌ Higher coordination overhead

### Recommendation
Option 2: Defer to Phase 2
- Maintain quality and timeline
- Reduce technical risk
- Twitter can be added in 1 week after Phase 1 stable
```

### 6. Feedback Collection

**Gather stakeholder feedback:**

```markdown
## Feedback Request: Design Review

### Questions for Stakeholders

**For Product Team:**
1. Does the UI match brand guidelines?
2. Are all user flows covered?
3. Any missing features for MVP?

**For Technical Team:**
1. Is the architecture scalable?
2. Any technical concerns?
3. Integration points clear?

**For Business Team:**
1. Does this meet business goals?
2. Any compliance concerns?
3. Market timing appropriate?

### Feedback Summary
[Compile and categorize feedback]
[Identify action items]
[Prioritize changes]
```

### 7. Risk Communication

**Communicate risks effectively:**

**Risk Matrix:**
```
Impact vs Probability

HIGH   |  🟡 Monitor  |  🔴 Urgent    |
       |              |               |
MEDIUM |  🟢 Accept   |  🟡 Mitigate  |
       |              |               |
LOW    |  🟢 Accept   |  🟢 Monitor   |
       +----------------+-------------+
         LOW           MEDIUM   HIGH
              Probability
```

**Risk Report Format:**
```markdown
## Risk: API Rate Limiting

**Category:** Technical
**Impact:** HIGH (feature unusable if hit)
**Probability:** MEDIUM (based on usage estimates)
**Status:** 🟡 MEDIUM RISK

**Description:**
Social media APIs have rate limits. High usage could cause posting failures.

**Mitigation Plan:**
1. Implement exponential backoff
2. Cache API responses
3. Queue system for retries
4. Monitor API usage

**Contingency:**
- Temporary disable feature if limits hit
- Notify users of delays
- Request rate limit increase from providers

**Owner:** Tech Lead
**Review Date:** Weekly
```

### 8. Change Management

**Manage changes to scope/timeline:**

```markdown
## Change Request: Add Video Support

### Original Scope
Images only (PNG, JPG)

### Requested Change
Add video support (MP4, MOV)

### Impact Analysis
- Timeline: +5 days
- Complexity: HIGH (video processing, size limits)
- Dependencies: None
- Testing: +15 test cases

### Stakeholder Impact
- Product: Feature enhancement
- Engineering: Additional work
- QA: More test scenarios
- Users: More content options

### Decision Required
☐ Approve (adjust timeline to +5 days)
☐ Defer to Phase 2
☐ Reject (out of scope)

### Approval
Product Manager: ___________
Tech Lead: ___________
Date: ___________
```

---

## Application in Workflow

### Phase 1: Requirements Analysis
- Identify all stakeholders
- Understand their needs
- Set expectations early

### Phase 2-4: Planning
- Regular status updates
- Manage scope discussions
- Communicate risks

### Phase 2-3: Implementation
- Daily progress updates
- Manage change requests
- Escalate blockers

### Phase 4-5: Review & Delivery
- Final stakeholder review
- Handoff documentation
- Gather feedback

---

## Best Practices

### Do's ✅
- ✅ Communicate proactively (before asked)
- ✅ Be transparent about risks
- ✅ Document all decisions
- ✅ Set realistic expectations
- ✅ Acknowledge concerns
- ✅ Follow up on commitments

### Don'ts ❌
- ❌ Over-promise on timelines
- ❌ Hide problems until they're critical
- ❌ Ignore stakeholder feedback
- ❌ Make decisions without consultation
- ❌ Use technical jargon with non-technical stakeholders
- ❌ Surprise stakeholders with changes

---

## Communication Templates

### Daily Update (Slack)
```
📊 PROJ-1234 Update

✅ Completed: Tech spec review
🔄 In Progress: Phase 4 (80%)
⏭️ Next: Start Phase 5 tomorrow

⚠️ Blockers: None
🕐 Timeline: On track
```

### Weekly Summary (Email)
```
Subject: [PROJ-1234] Week 42 Summary - On Track

Hi Team,

Quick update on Social Media Sharing feature:

✅ Completed This Week:
- Requirements analysis
- Technical specification
- Design review
- Test planning (in progress)

📊 Progress: 4/5 phases complete (80%)

🎯 Next Week:
- Complete test planning
- Start TDD implementation
- Design review with stakeholders

⏰ Timeline: On track for [Date]
🟢 Status: GREEN

Let me know if you have any questions!

Best,
[PM Name]
```

---

## Metrics to Track

- Stakeholder satisfaction (surveys)
- Communication frequency (meetings, updates)
- Decision turnaround time
- Scope change rate
- Risk realization rate
- Feedback incorporation rate

---

## Integration with Other Skills

Works closely with:
- **Risk Management** - Communicating risks to stakeholders
- **Project Planning** - Aligning stakeholder expectations with plans
- **Requirement Analysis** - Gathering stakeholder requirements

---

**Used by PM Operations Orchestrator to manage stakeholder relationships throughout the 5-phase workflow.**
