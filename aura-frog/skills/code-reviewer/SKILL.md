---
name: code-reviewer
description: "6-aspect structured code review. Checks security, types, error handling, tests, quality, simplification."
autoInvoke: true
priority: high
triggers:
  - "review code"
  - "code review"
  - "after Phase 4"
  - "before merge"
allowed-tools: Read, Grep, Glob, Bash
effort: high
---

# Code Reviewer — 6-Aspect Analysis

Use after implementation, during Phase 4, or before merge.

**Builder ≠ Reviewer.** The reviewing agent MUST differ from the agent that built the code. If architect built in Phase 3, security or tester leads the Phase 4 review — not architect.

## Process

1. Get changed files: `git diff --name-only main...HEAD`
2. Run 6-aspect review (all mandatory)
3. Generate report
4. Decision

## 6 Aspects (Weighted by Impact)

```toon
aspects[6]{aspect,weight,checks}:
  Security,CRITICAL,"Hardcoded secrets, injection (SQL/XSS/cmd), auth gaps, CSRF/CORS, insecure crypto"
  Architecture,HIGH,"SRP violations, coupling, missing abstractions, wrong layer responsibilities, edge case handling gaps"
  Error Handling,HIGH,"Unhandled rejections, empty catch, missing error boundaries, silent failures, missing edge cases"
  Test Gaps,HIGH,"Untested critical paths, missing edge cases, over-mocking, boundary conditions"
  Type Safety,MEDIUM,"Missing annotations, any usage, inconsistent returns, null gaps"
  Simplification,LOW,"Complex conditionals, deep nesting, long functions — only flag if harms readability"
```

**Weight priority:** Focus review effort on architecture decisions and edge case coverage. Don't nitpick syntax or formatting — linters handle that. Spend 60% of review time on Security + Architecture + Edge Cases.

## Report Format

```
[ASPECT] [SEVERITY] file:line — description
  → Fix: recommendation
```

Severity: CRITICAL (block merge) | WARNING (should fix) | INFO (nice to have)

## Decision

- **APPROVED** — 0 critical, ≤3 warnings
- **APPROVED WITH COMMENTS** — 0 critical, >3 warnings
- **CHANGES REQUESTED** — Any critical finding

Summary: `Review: 🔒✅ 🏷️✅ ⚠️⚠️ 🧪✅ 📐✅ ♻️✅ — APPROVED WITH COMMENTS`

## Evaluator Calibration (Few-Shot Scoring)

To prevent review drift, use structured score breakdowns:

```
Review Score: 7.5/10

Breakdown:
  Security:       9/10  (no secrets, auth solid)
  Architecture:   6/10  (coupling between UserService and OrderService)
  Error Handling:  8/10  (one unhandled edge case in payment flow)
  Test Coverage:   7/10  (missing boundary tests for discount calc)
  Type Safety:     8/10  (minor: 2 implicit any casts)
  Simplification:  7/10  (processOrder could split into 2 functions)

Verdict: APPROVED WITH COMMENTS (address architecture coupling)
```

**Calibration anchors:**
- **9-10:** Production-ready, no significant issues
- **7-8:** Good, minor improvements needed
- **5-6:** Needs work — architectural or coverage gaps
- **<5:** Changes requested — critical issues

Always show the per-aspect breakdown. This prevents "LGTM" drift and forces specific feedback.

## Block Merge On

Hardcoded secrets, injection vulnerabilities, missing auth on protected routes, breaking changes without migration.
