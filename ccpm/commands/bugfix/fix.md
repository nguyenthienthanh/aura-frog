# Command: bugfix

**Purpose:** Fix bugs with structured workflow (analyze → plan → fix → test → verify)

**Category:** Bug Fixing

**Usage:**
```
bugfix <bug-description>
bugfix:start <JIRA-ID>
bugfix <file> <issue>
```

---

## 📋 Command Execution

### Input Parameters

**Required:**
- `bug-description` - Description of the bug to fix
- OR `JIRA-ID` - Jira ticket ID (e.g., PROJ-1234)
- OR `file` + `issue` - Specific file and issue

**Optional:**
- `--priority` - Bug priority (critical, high, medium, low)
- `--coverage` - Target test coverage (default: 80%)

---

## 🔄 Bug Fix Workflow

### Phase 1: Bug Analysis (15-30 min)

**Agents:** PM Orchestrator + Dev Expert + QA Expert

**Steps:**
1. **Reproduce Bug**
   - Read bug description/ticket
   - Identify steps to reproduce
   - Verify current behavior
   - Document expected behavior

2. **Root Cause Analysis**
   - Analyze code
   - Identify root cause
   - Check related files
   - Review recent changes (git log)

3. **Impact Assessment**
   - Determine severity
   - Identify affected areas
   - Check for similar issues
   - Assess regression risk

**Deliverables:**
- `BUG_ANALYSIS.md` - Complete bug analysis
  - Bug description
  - Steps to reproduce
  - Root cause
  - Affected files
  - Impact assessment
  - Proposed solution

**Approval Gate:**
```markdown
## Bug Analysis Complete

**Bug:** [Description]
**Root Cause:** [Cause]
**Affected Files:** [Files]
**Impact:** [Critical/High/Medium/Low]

**Proposed Solution:**
[Solution approach]

Options:
- "approve" → Proceed to fix planning
- "reject: [reason]" → Re-analyze
```

---

### Phase 2: Fix Planning (20-40 min)

**Agents:** Dev Expert + QA Expert

**Steps:**
1. **Design Fix**
   - Plan code changes
   - Identify edge cases
   - Consider alternatives
   - Design test strategy

2. **Create Implementation Plan**
   - List files to modify
   - Define changes per file
   - Plan refactoring (if needed)
   - Estimate effort

3. **Risk Assessment**
   - Identify potential side effects
   - Plan regression tests
   - Define rollback strategy

**Deliverables:**
- `BUG_FIX_PLAN.md` - Detailed fix plan
  - Solution approach
  - Files to modify
  - Step-by-step changes
  - Test strategy
  - Risk mitigation
  - Estimated effort

**Approval Gate:**
```markdown
## Bug Fix Plan Complete

**Approach:** [Solution]
**Files to Modify:** [X] files
**Estimated Effort:** [Y] hours

**Changes:**
1. [file1] - [changes]
2. [file2] - [changes]

**Tests Required:**
- Unit tests: [X]
- Integration tests: [Y]
- Regression tests: [Z]

Options:
- "approve" → Start TDD RED
- "modify: [changes]" → Adjust plan
```

---

### Phase 3: TDD RED - Write Tests (20-30 min)

**Agents:** QA Expert + Dev Expert

**Steps:**
1. **Write Bug Reproduction Test**
   - Test that fails with current bug
   - Captures exact bug behavior
   - Clear assertion messages

2. **Write Regression Tests**
   - Test edge cases
   - Test related functionality
   - Prevent future regressions

3. **Verify Tests Fail**
   - Run tests
   - Confirm they fail as expected
   - Document failure reasons

**Deliverables:**
- Test files created/updated
- All tests FAIL (expected)
- Test coverage report

**Approval Gate:**
```markdown
## Tests Written (TDD RED)

**Tests Added:** [X] tests
**Status:** ❌ ALL FAILING (expected)

**Test Files:**
- [test1.test.ts] - Bug reproduction
- [test2.test.ts] - Edge cases
- [test3.test.ts] - Regression tests

**Next:** Implement fix to make tests pass

Options:
- "approve" → Implement bug fix
```

---

### Phase 4: TDD GREEN - Implement Fix (30-90 min)

**Agents:** Dev Expert

**Steps:**
1. **Implement Fix**
   - Apply planned changes
   - Follow KISS principle
   - Maintain code quality
   - Add comments for complex logic

2. **Run Tests**
   - All tests should pass
   - No new test failures
   - Coverage meets target

3. **Verify Fix**
   - Manual testing
   - Check edge cases
   - Verify no side effects

**Deliverables:**
- Code changes applied
- All tests PASS ✅
- Linter passes (0 warnings)
- Type checking passes

**Approval Gate:**
```markdown
## Bug Fix Implemented (TDD GREEN)

**Files Modified:** [X] files
**Lines Changed:** +[Y] -[Z]
**Tests:** ✅ ALL PASSING

**Changes:**
- [file1]: [summary]
- [file2]: [summary]

**Verification:**
- ✅ Bug fixed
- ✅ Tests passing
- ✅ Linter clean
- ✅ No side effects

Options:
- "approve" → Refactor & optimize
```

---

### Phase 5: TDD REFACTOR - Optimize (20-40 min)

**Agents:** Dev Expert

**Steps:**
1. **Refactor Code**
   - Improve readability
   - Extract duplicated logic
   - Optimize performance (if needed)
   - Apply best practices

2. **Verify Tests Still Pass**
   - Run all tests
   - Ensure no regressions
   - Check coverage maintained

3. **Code Quality Check**
   - Run linter
   - Run type checker
   - Check complexity metrics

**Deliverables:**
- Refactored code
- Tests still passing ✅
- Improved code quality
- Performance metrics (if applicable)

**Approval Gate:**
```markdown
## Refactoring Complete (TDD REFACTOR)

**Improvements:**
- [improvement 1]
- [improvement 2]

**Quality:**
- ✅ Tests passing
- ✅ Linter clean
- ✅ Type-safe
- ✅ Complexity reduced

Options:
- "approve" → Code review
```

---

### Phase 6: Code Review (15-30 min)

**Agents:** QA Expert + Secondary Dev

**Steps:**
1. **Self-Review**
   - Check all changes
   - Verify best practices
   - Review comments
   - Check for hardcoded values

2. **Automated Checks**
   - Theme consistency
   - Direct hook access
   - Smart commenting
   - Correct file extensions

3. **Generate Review Report**
   - List all issues
   - Categorize by severity
   - Suggest fixes
   - Provide examples

**Deliverables:**
- `BUG_FIX_REVIEW.md` - Code review report
- Issue list (categorized)
- Fix suggestions

**Approval Gate:**
```markdown
## Code Review Complete

**Issues Found:** [X] issues
- Critical: [A]
- High: [B]
- Medium: [C]
- Low: [D]

**Review Report:** `.claude/logs/workflows/[workflow]/BUG_FIX_REVIEW.md`

Options:
- "approve" → QA validation
- "review:fix" → Auto-fix issues
```

---

### Phase 7: QA Validation (15-30 min)

**Agents:** QA Expert

**Steps:**
1. **Run Full Test Suite**
   - Unit tests
   - Integration tests
   - E2E tests (if applicable)
   - Regression tests

2. **Coverage Analysis**
   - Check coverage percentage
   - Identify gaps
   - Verify critical paths covered

3. **Manual Verification**
   - Test bug fix manually
   - Verify edge cases
   - Check user experience
   - Test on multiple devices/browsers (if applicable)

**Deliverables:**
- Test results report
- Coverage report
- Manual test results
- QA sign-off

**Approval Gate:**
```markdown
## QA Validation Complete

**Test Results:**
- ✅ All tests passing
- ✅ Coverage: [X]% (target: [Y]%)
- ✅ No regressions

**Manual Testing:**
- ✅ Bug verified fixed
- ✅ Edge cases covered
- ✅ No side effects

Options:
- "approve" → Documentation
```

---

### Phase 8: Documentation (10-20 min)

**Agents:** PM Orchestrator

**Steps:**
1. **Create Bug Fix Summary**
   - Bug description
   - Root cause
   - Solution implemented
   - Files changed

2. **Update CHANGELOG**
   - Add bug fix entry
   - Include ticket reference
   - Note breaking changes (if any)

3. **Generate Confluence Page**
   - Format for Confluence
   - Include code snippets
   - Add before/after screenshots (if applicable)
   - Save local Markdown copy

**Deliverables:**
- `BUG_FIX_SUMMARY.md` - Implementation summary
- `CHANGELOG.md` - Updated
- `CONFLUENCE_BUG_FIX.md` - Confluence format
- Local copies in `documents/bugs/`

**Approval Gate:**
```markdown
## Documentation Complete

**Documents Generated:**
- ✅ Bug Fix Summary
- ✅ CHANGELOG updated
- ✅ Confluence page ready

**Files:**
- `.claude/logs/workflows/[workflow]/BUG_FIX_SUMMARY.md`
- `documents/bugs/[bug-id].md`

Options:
- "approve" → Notify team
```

---

### Phase 9: Notification (Auto-execute)

**Agents:** Slack Operations + Jira Operations

**Steps:**
1. **Update Jira Ticket**
   - Add comment with fix details
   - Attach documentation
   - Update status (In Review / Fixed)
   - Add fix version

2. **Notify Team**
   - Post to Slack channel
   - Tag relevant people
   - Include summary and links
   - Request code review (if needed)

3. **Archive Workflow**
   - Save workflow state
   - Archive context
   - Update metrics

**Deliverables:**
- Jira ticket updated
- Slack notification sent
- Workflow archived

**Completion:**
```markdown
## ✅ Bug Fix Complete!

**Bug:** [Bug description]
**Status:** Fixed & Documented

**Jira:** [PROJ-1234] - Updated
**Slack:** #engineering - Notified
**Docs:** Confluence page created

**Next Steps:**
1. Create PR/MR for review
2. Deploy to staging
3. QA verification
4. Deploy to production

**Workflow archived:** `.claude/logs/workflows/bugfix-[name]-[timestamp]/`
```

---

## 🎯 Usage Examples

### Example 1: Simple Bug Fix

```
User: bugfix Users cannot login with email

AI:
1. Analyzes login code
2. Identifies root cause (email validation regex)
3. Plans fix
4. Writes failing test
5. Implements fix
6. Tests pass
7. Refactors
8. Reviews code
9. Documents
10. Notifies team
```

### Example 2: From Jira Ticket

```
User: bugfix:start PROJ-1234

AI:
1. Fetches ticket from Jira
2. Reads bug description
3. Analyzes code
4. ... (same workflow)
```

### Example 3: Specific File Bug

```
User: bugfix src/auth/login.ts Email validation fails for plus signs

AI:
1. Focuses on login.ts
2. Analyzes email validation
3. ... (same workflow)
```

---

## 🔧 Command Options

### Priority Flags

```bash
bugfix <description> --priority=critical
bugfix <description> --priority=high
bugfix <description> --priority=medium
bugfix <description> --priority=low
```

**Effect:**
- Critical: Full workflow + extra testing
- High: Standard workflow
- Medium: Standard workflow, may skip some manual tests
- Low: Simplified workflow, focus on fix

### Coverage Override

```bash
bugfix <description> --coverage=90
```

**Effect:** Sets target test coverage to 90% (default: 80%)

### Quick Fix Mode

```bash
bugfix:quick <description>
```

**Effect:** 
- Skip Phase 1 approval (auto-analyze)
- Skip Phase 2 approval (auto-plan)
- Still enforce TDD workflow
- Faster for obvious bugs

---

## 📊 Success Criteria

**Bug fix succeeds when:**
- ✅ Root cause identified
- ✅ Fix planned and approved
- ✅ Tests written and fail (RED)
- ✅ Fix implemented and tests pass (GREEN)
- ✅ Code refactored (REFACTOR)
- ✅ Code reviewed
- ✅ QA validated
- ✅ Coverage meets target
- ✅ No regressions
- ✅ Documented
- ✅ Team notified

---

## 🚨 Special Cases

### Hotfix (Production Bug)

```bash
bugfix:hotfix <description>
```

**Changes:**
- Priority: Critical
- Faster approvals
- Skip some refactoring
- Immediate notification
- Deploy guide included

### Security Bug

```bash
bugfix:security <description>
```

**Changes:**
- Private workflow (limited logging)
- Security review included
- Patch notes generated
- Restricted notifications

---

## 🎨 Integration with Workflow

**Can be used:**
- ✅ Standalone (just fix a bug)
- ✅ During Phase 5 (bug found during implementation)
- ✅ After Phase 7 (bug found during QA)
- ✅ Post-deployment (production bug)

**Workflow State:**
- Creates new workflow ID: `bugfix-[description]-[timestamp]`
- Saved in: `.claude/logs/workflows/bugfix-[id]/`
- Independent of main workflow

---

## 🔄 Auto-Continue

After each approval:
- ✅ Automatically proceeds to next phase
- ✅ Shows token usage
- ✅ Continues until Phase 8 complete
- ✅ Only stops at: rejection, errors, or Phase 9

---

## 📝 Templates Used

- `BUG_ANALYSIS.md` - Bug analysis template
- `BUG_FIX_PLAN.md` - Fix planning template
- `BUG_FIX_SUMMARY.md` - Implementation summary
- `BUG_FIX_REVIEW.md` - Code review report
- `CONFLUENCE_BUG_FIX.md` - Confluence format

---

## ✅ Command Complete

**Workflow:** 9 phases (Bug-specific)  
**Duration:** 2-4 hours (typical)  
**Enforces:** TDD workflow  
**Output:** Complete bug fix + documentation  
**Integration:** Jira + Slack + Confluence

