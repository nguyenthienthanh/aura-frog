# Bugfix Commands

Unified bug fixing with severity-based approach selection. Three modes: full structured workflow, quick lightweight fix, and emergency hotfix for production.

---

## /bugfix

**Trigger:** `bugfix <description>`, `bugfix:start <JIRA-ID>`

Full 5-phase structured bug fix: analyze (reproduce + root cause), plan (fix + test strategy), RED (failing tests), GREEN (implement fix), REFACTOR (optimize), review, QA, document, notify. Produces BUG_ANALYSIS.md, BUG_FIX_PLAN.md, BUG_FIX_REVIEW.md, and BUG_FIX_SUMMARY.md. Enforces TDD throughout.

**Usage:** `bugfix "Payment processing fails" --priority=critical --coverage=80`
**Modes:** `bugfix:quick` (skip approvals), `bugfix:hotfix` (production critical), `bugfix:security` (private workflow)

---

## /bugfix:quick

**Trigger:** `bugfix:quick <description>`

Lightweight bug fix for obvious issues. Auto-executes Phase 1 (understand + design) without approval. Still enforces TDD (RED then GREEN then REFACTOR). Approval required only at implementation gates. Saves 30-60 minutes vs full bugfix. Best for: typos, obvious logic errors, simple validation fixes, import fixes, null checks.

**Usage:** `bugfix:quick "Login button not disabled during loading"`
**Time:** 1-2 hours (vs 2-4 hours full)

---

## /bugfix:hotfix

**Trigger:** `bugfix:hotfix <description>`, `bugfix:hotfix <JIRA-ID>`

Emergency production bug fix. Optimized for time-critical situations: 10-second auto-approve timeouts, minimal documentation, immediate Slack/Jira notifications, deploy guide + rollback steps auto-generated. Still enforces TDD and code review. Produces HOTFIX_ANALYSIS.md, HOTFIX_DEPLOY_GUIDE.md, HOTFIX_ROLLBACK_GUIDE.md. Auto-creates follow-up tickets for regression tests, code refactor, and post-mortem.

**Usage:** `bugfix:hotfix "API returning 500 errors for all users"`
**Time target:** < 1.5 hours from start to deploy

---

## Related

- **Skills:** `bugfix-quick`, `debugging`, `workflow-orchestrator`
- **Rules:** `rules/core/tdd-workflow.md`
