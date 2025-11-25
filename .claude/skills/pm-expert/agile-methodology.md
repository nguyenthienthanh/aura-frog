# Skill: Agile Methodology

**Category:** PM Expert  
**Priority:** High  
**Used By:** pm-operations-orchestrator

---

## Overview

Implementing Agile practices for effective project management and team collaboration.

---

## Scrum Framework

### Sprint Structure

**Sprint Duration:** 2 weeks (10 working days)

**Sprint Events:**
1. Sprint Planning (4 hours)
2. Daily Standup (15 minutes)
3. Sprint Review (2 hours)
4. Sprint Retrospective (1.5 hours)

### Sprint Planning

```markdown
# Sprint Planning Template

## Sprint Goal
[Clear, achievable goal for this sprint]

## Capacity Planning
- Team capacity: 80 story points
- Available developers: 5
- Sprint duration: 10 days
- Velocity (last 3 sprints): 75, 82, 78 points

## Sprint Backlog

### High Priority (Must Have)
- [ ] PROJ-1234: Implement social sharing (13 points)
- [ ] PROJ-1235: Fix login crash on iOS (5 points)
- [ ] PROJ-1236: Add analytics tracking (8 points)

### Medium Priority (Should Have)
- [ ] PROJ-1237: Refactor user profile (8 points)
- [ ] PROJ-1238: Update documentation (3 points)

### Low Priority (Nice to Have)
- [ ] PROJ-1239: UI polish (5 points)

## Definition of Done
- [ ] Code reviewed and approved
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] QA validated
- [ ] Deployed to staging

## Dependencies
- Design mockups needed for PROJ-1234
- API changes required for PROJ-1236

## Risks
- PROJ-1235 may require backend changes
- Team member on leave for 2 days
```

### Daily Standup

```markdown
# Daily Standup Format

## What I did yesterday:
- Completed API integration for social sharing
- Fixed 3 bugs in the authentication flow

## What I'm doing today:
- Implement Instagram sharing UI
- Start writing tests for new features

## Blockers:
- Waiting for design approval on share modal
- Need access to staging environment
```

---

## User Stories

### INVEST Criteria

**I**ndependent - Can be developed independently  
**N**egotiable - Details can be discussed  
**V**aluable - Delivers value to users  
**E**stimable - Can be estimated  
**S**mall - Completable in one sprint  
**T**estable - Clear acceptance criteria

### User Story Template

```markdown
# User Story: [PROJ-1234] Social Media Sharing

## As a...
Insurance agent

## I want to...
Share marketing content to Facebook, Instagram, and LinkedIn

## So that...
I can reach more potential clients and grow my business

## Acceptance Criteria

### Scenario 1: Share to Facebook
**Given** I have a marketing post ready
**When** I tap the "Share to Facebook" button
**Then** The Facebook share dialog opens
**And** My post content is pre-filled
**And** I can add a personal message

### Scenario 2: Multiple platforms
**Given** I want to share to multiple platforms
**When** I select Facebook, Instagram, and LinkedIn
**Then** The post is shared to all three platforms
**And** I see a success confirmation

### Scenario 3: Error handling
**Given** The network is unavailable
**When** I try to share a post
**Then** I see a clear error message
**And** The post is saved for retry later

## Technical Notes
- Use native share APIs where possible
- Implement OAuth for platform authentication
- Cache credentials securely
- Track share analytics

## Definition of Done
- [ ] Works on iOS and Android
- [ ] Works on phone and tablet
- [ ] All regions supported (PH, MY, ID)
- [ ] Unit tests >80% coverage
- [ ] E2E tests added
- [ ] Performance: Share completes <3s
- [ ] Error handling tested
- [ ] Analytics implemented
- [ ] Documentation updated

## Story Points: 13
## Priority: High
## Dependencies: Design mockups, OAuth setup
```

---

## Estimation Techniques

### Story Points (Fibonacci)

| Points | Complexity | Time Estimate |
|--------|-----------|---------------|
| 1 | Trivial | ~1 hour |
| 2 | Simple | ~2-3 hours |
| 3 | Easy | ~4-6 hours |
| 5 | Medium | ~1 day |
| 8 | Complex | ~2 days |
| 13 | Very Complex | ~3-4 days |
| 21 | Too Large | Split into smaller stories |

### Planning Poker

1. Product Owner reads user story
2. Team asks clarifying questions
3. Each member selects a card secretly
4. All reveal simultaneously
5. Discuss differences
6. Re-estimate until consensus

---

## Backlog Management

### Backlog Refinement

**Frequency:** Weekly (1 hour)

**Activities:**
- Review upcoming stories
- Break down large stories
- Estimate stories
- Clarify requirements
- Update acceptance criteria

### Prioritization (MoSCoW)

**M**ust have - Critical features  
**S**hould have - Important but not critical  
**C**ould have - Nice to have  
**W**on't have - Explicitly excluded

```markdown
# Product Backlog (Prioritized)

## Must Have
1. PROJ-1234: Social sharing (13 points)
2. PROJ-1235: Critical login bug (5 points)
3. PROJ-1236: Analytics tracking (8 points)

## Should Have
4. PROJ-1237: Profile refactor (8 points)
5. PROJ-1238: Search optimization (13 points)

## Could Have
6. PROJ-1239: Dark mode (13 points)
7. PROJ-1240: Offline mode (21 points)

## Won't Have (This Sprint)
- PROJ-1241: AR features
- PROJ-1242: Voice commands
```

---

## Velocity Tracking

```markdown
# Sprint Velocity Report

## Last 6 Sprints

| Sprint | Committed | Completed | Velocity |
|--------|-----------|-----------|----------|
| Sprint 20 | 85 | 78 | 78 |
| Sprint 19 | 80 | 82 | 82 |
| Sprint 18 | 75 | 75 | 75 |
| Sprint 17 | 80 | 72 | 72 |
| Sprint 16 | 85 | 80 | 80 |
| Sprint 15 | 75 | 73 | 73 |

## Average Velocity: 76.7 points

## Recommendations
- Plan for ~75 points in Sprint 21
- Team capacity is stable
- Slight overcommitment trend - be conservative
```

---

## Sprint Retrospective

### Retrospective Format

```markdown
# Sprint 20 Retrospective

## What went well? 😊
- Team collaboration was excellent
- All high-priority items completed
- Code reviews were thorough and fast
- No production issues this sprint

## What didn't go well? 😞
- Design approvals were delayed
- 2 stories carried over to next sprint
- CI/CD pipeline had downtime
- Testing environment was unstable

## Action Items 🎯
- [ ] Schedule design sync earlier (Owner: PM)
- [ ] Improve story size estimation (Owner: Team)
- [ ] Migrate to new CI/CD provider (Owner: DevOps)
- [ ] Set up backup testing environment (Owner: QA Lead)

## What will we try next sprint? 🚀
- Pair programming for complex features
- Daily design check-ins
- Allocate 10% buffer for unexpected issues
```

---

## Kanban Board

```markdown
# Sprint Board

## To Do (10)
- PROJ-1240
- PROJ-1241
- ...

## In Progress (5)
- PROJ-1234 [Dev: John]
- PROJ-1235 [Dev: Jane]
- ...

## Code Review (3)
- PROJ-1236 [Reviewer: Mike]
- ...

## Testing (2)
- PROJ-1237 [QA: Sarah]
- ...

## Done (15)
- PROJ-1233 ✅
- PROJ-1232 ✅
- ...

## WIP Limits
- In Progress: Max 6
- Code Review: Max 4
- Testing: Max 3
```

---

## Burndown Chart

```markdown
# Sprint Burndown

Day 1:  78 points remaining ████████████████████
Day 2:  75 points remaining ███████████████████
Day 3:  68 points remaining █████████████████
Day 4:  65 points remaining ████████████████
Day 5:  58 points remaining ██████████████
Day 6:  52 points remaining ████████████
Day 7:  45 points remaining ██████████
Day 8:  32 points remaining ███████
Day 9:  15 points remaining ███
Day 10:  0 points remaining ✅

Status: On track 🎯
```

---

## Best Practices

### Do's ✅
- ✅ Keep sprints consistent (same duration)
- ✅ Maintain a healthy backlog (2-3 sprints ahead)
- ✅ Respect WIP limits
- ✅ Review and adapt retrospective actions
- ✅ Celebrate wins
- ✅ Keep ceremonies timeboxed
- ✅ Update board daily

### Don'ts ❌
- ❌ Change sprint scope mid-sprint
- ❌ Skip retrospectives
- ❌ Let standup exceed 15 minutes
- ❌ Ignore velocity trends
- ❌ Overcommit to stories
- ❌ Work on non-sprint items
- ❌ Blame individuals

---

**Used by PM agent for Agile project management.**

