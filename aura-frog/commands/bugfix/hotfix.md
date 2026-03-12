# Command: bugfix:hotfix

**Purpose:** Emergency production bug fix (fastest workflow)

**Category:** Bug Fixing

**Usage:**
```
bugfix:hotfix <description>
bugfix:hotfix <JIRA-ID>
```

---

## 🚨 Hotfix Workflow

**Optimized for:**
- 🔥 Production bugs
- ⏰ Time-critical fixes
- 🚑 Service disruptions
- ⚠️ Critical user impact

**Changes from standard workflow:**
- ⚡ Faster approvals (10 sec timeout)
- ⚡ Minimal documentation
- ⚡ Immediate notifications
- ⚡ Deploy guide included
- ⚡ Skip optional refactoring

---

## 🔄 Hotfix Phases

### Phase 1: Emergency Analysis + Plan (5-10 min)

**Focus:**
- Identify immediate cause
- Assess impact
- Quick solution design + minimal viable fix
- Rollback plan + deploy strategy
- Skip deep analysis and optimization

**Approval:** Auto-approve after 10 seconds if no response

---

### Phase 2: Test RED (10-15 min)

- Write minimal reproduction test
- Skip edge case tests (add later)

---

### Phase 3: Build GREEN (15-30 min)

- Implement quickest fix
- Make test pass
- Skip optimization

**Approval:** Required (no auto-approve)

---

### Phase 4: Refactor + Review (5-10 min, OPTIONAL refactor)

**Focus:**
- Refactor: Ask user "Refactor now or skip?" (can skip if time-critical)
- Review: Check for breaking changes, verify no new bugs
- QA: Verify fix works, test rollback works
- Skip style issues and full regression (fix/run after deploy)

---

### Phase 5: Finalize (5 min, Auto)

**Minimal docs:**
- What was broken
- What was fixed
- Deploy instructions
- Rollback instructions

**Immediate notifications:**
- Slack: #incidents channel
- Jira: Update ticket + set priority
- Email: On-call team
- Status page: Update (if applicable)

**Includes:**
- Deploy guide
- Rollback steps
- Monitoring links

---

## 📋 Hotfix Deliverables

**Minimal set:**
- `HOTFIX_ANALYSIS.md` - Quick analysis
- `HOTFIX_DEPLOY_GUIDE.md` - Deploy steps
- `HOTFIX_ROLLBACK_GUIDE.md` - Rollback steps
- Code changes
- Tests

**NOT generated (to save time):**
- Detailed tech specs
- Architecture diagrams
- Comprehensive documentation
- Confluence pages (create post-hotfix)

---

## 🚀 Deploy Guide Auto-Generated

```markdown
# Hotfix Deploy Guide

## Pre-Deploy Checklist
- [ ] Tests passing
- [ ] Staging verified
- [ ] Rollback plan ready
- [ ] Team notified

## Deploy Steps
1. Merge PR: [link]
2. Deploy to production: `[command]`
3. Verify: [verification steps]
4. Monitor: [dashboard links]

## Rollback Steps
1. Revert commit: `git revert [hash]`
2. Deploy: `[command]`
3. Verify: [steps]

## Monitoring
- Error rate: [dashboard]
- Performance: [dashboard]
- User impact: [analytics]

## Communication
- Status page: [link]
- Incident channel: #incidents
- On-call: @team
```

---

## ⏰ Timeline Comparison

| Phase | Standard | Hotfix | Time Saved |
|-------|----------|--------|------------|
| 1. Understand+Design | 30-60 min | 5-10 min | 25-50 min |
| 2. Test RED | 20-30 min | 10-15 min | 10-15 min |
| 3. Build GREEN | 30-90 min | 15-30 min | 15-60 min |
| 4. Refactor+Review | 30-60 min | 5-10 min (skip refactor) | 25-50 min |
| 5. Finalize | 10-20 min | 5 min | 5-15 min |
| **Total** | **2-4 hours** | **40-70 min** | **1-2.5 hours** |

---

## 🎯 Example Usage

```
User: bugfix:hotfix API returning 500 errors for all users

AI:
🚨 HOTFIX MODE ACTIVATED

Priority: CRITICAL
Impact: ALL USERS
Target: Fix in 1 hour

Phase 1: Emergency Analysis... ✅
- Root cause: Database connection timeout
- Impact: 100% of API requests failing
- Solution: Increase timeout + add retry

⏰ Auto-approving in 10 seconds...

Phase 2: Quick Fix Plan... ✅
- File: api/database.ts
- Change: timeout 5s → 30s
- Add: Exponential retry (3 attempts)

⏰ Auto-approving in 10 seconds...

Phase 2: Test RED...
[Shows tests]

Phase 3: Build GREEN...
APPROVAL REQUIRED
Options: "approve" → Implement fix
```

---

## 🔥 Post-Hotfix Tasks

**After deploy, create follow-up tickets:**
- [ ] Full regression test suite
- [ ] Refactor hotfix code
- [ ] Add monitoring/alerting
- [ ] Update documentation
- [ ] Post-mortem analysis
- [ ] Long-term solution design

**Auto-generated:**
```markdown
## Follow-up Tasks

Created Jira tickets:
- [PROJ-1235] Run full regression tests
- [PROJ-1236] Refactor hotfix code
- [PROJ-1237] Add database monitoring
- [PROJ-1238] Post-mortem meeting
```

---

## ⚠️ Hotfix Checklist

**Before using hotfix mode:**
- [ ] Is this truly a production emergency?
- [ ] Is immediate fix required (< 2 hours)?
- [ ] Is user impact critical?
- [ ] Is standard workflow too slow?

**If ANY answer is NO, use standard `bugfix` instead!**

---

## 🛡️ Safety Features

**Still enforced:**
- ✅ TDD workflow (RED → GREEN)
- ✅ Tests must pass
- ✅ Code review required
- ✅ Rollback plan generated
- ✅ Notifications sent

**Relaxed:**
- ⚡ Approval timeouts (10 sec auto-approve)
- ⚡ Skip optional refactoring
- ⚡ Minimal documentation
- ⚡ Skip comprehensive testing (do after)

---

## 📱 Notifications

**Slack message:**
```
🚨 HOTFIX DEPLOYED

Bug: API 500 errors
Fix: Database timeout increased
Status: ✅ Deployed to production
Impact: All users
Deploy: 2 minutes ago

Monitoring:
- Error rate: [link]
- API health: [link]

Rollback: See thread for steps
Follow-up: 4 tickets created
```

---

## ✅ Success Criteria

**Hotfix succeeds when:**
- ✅ Production issue resolved
- ✅ Tests passing
- ✅ No new issues introduced
- ✅ Rollback plan ready
- ✅ Team notified
- ✅ Follow-up tickets created
- ✅ Deploy guide generated

**Time target:** < 1.5 hours from start to deploy

---

## 🎨 Integration

**Hotfix branch strategy:**
```bash
# Auto-generated branch name
hotfix/PROJ-1234-api-500-errors-[timestamp]

# Deploy command
git checkout main
git pull
git merge hotfix/PROJ-1234-api-500-errors-[timestamp]
git push
[deploy-script]
```

---

**⚡ Use responsibly! Only for true emergencies! 🚨**

