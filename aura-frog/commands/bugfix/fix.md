# Command: bugfix

**Purpose:** Fix bugs with structured workflow (analyze → plan → fix → test → verify)
**Category:** Bug Fixing

---

## Usage

```
bugfix <bug-description>
bugfix:start <JIRA-ID>
bugfix <file> <issue>
bugfix:quick <description>        # Skip approvals
bugfix:hotfix <description>       # Production critical
bugfix:security <description>     # Security-focused
```

---

## Options

| Option | Values | Default |
|--------|--------|---------|
| `--priority` | critical, high, medium, low | medium |
| `--coverage` | 1-100 | 80 |

---

## Workflow

```toon
phases[9]{phase,action,deliverable}:
  1. Analyze,Reproduce bug + root cause analysis,BUG_ANALYSIS.md
  2. Plan,Design fix + test strategy,BUG_FIX_PLAN.md
  3. RED,Write failing tests,*.test.ts (failing)
  4. GREEN,Implement fix,Code changes + tests pass
  5. REFACTOR,Optimize code,Refactored code
  6. Review,Code review + automated checks,BUG_FIX_REVIEW.md
  7. QA,Full test suite + coverage,Test results
  8. Document,Summary + changelog,BUG_FIX_SUMMARY.md
  9. Notify,Update Jira + Slack,Notifications sent
```

---

## Bug Analysis Output

```toon
analysis[6]{field,content}:
  Description,What the bug is
  Steps to Reproduce,How to trigger the bug
  Root Cause,Why it happens
  Affected Files,Which files need changes
  Impact,Severity + affected areas
  Proposed Solution,How to fix it
```

---

## Special Modes

```toon
modes[3]{mode,effect}:
  bugfix:quick,Skip Phase 1-2 approvals + auto-analyze
  bugfix:hotfix,Priority=critical + faster approvals + deploy guide
  bugfix:security,Private workflow + security review + restricted notifications
```

---

## TDD Enforcement

1. **RED** - Write tests that fail (reproduce the bug)
2. **GREEN** - Implement fix until tests pass
3. **REFACTOR** - Optimize while maintaining passing tests

---

## Success Criteria

- ✅ Root cause identified
- ✅ Tests written and fail (RED)
- ✅ Fix implemented and tests pass (GREEN)
- ✅ Code reviewed
- ✅ Coverage meets target
- ✅ No regressions
- ✅ Documented

---

**Workflow:** 9 phases | **Duration:** 2-4 hours typical
**Version:** 2.0.0
