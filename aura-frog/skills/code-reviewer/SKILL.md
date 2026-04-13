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

## 6 Aspects

```toon
aspects[6]{aspect,checks}:
  Security,"Hardcoded secrets, injection (SQL/XSS/cmd), auth gaps, CSRF/CORS, insecure crypto"
  Type Safety,"Missing annotations, any usage, inconsistent returns, null gaps"
  Error Handling,"Unhandled rejections, empty catch, missing error boundaries, silent failures"
  Test Gaps,"Untested critical paths, missing edge cases, over-mocking, gaps on modified files"
  Code Quality,"KISS/DRY violations, naming clarity, SRP violations, dead code"
  Simplification,"Complex conditionals, deep nesting, long functions, verbose patterns"
```

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

## Block Merge On

Hardcoded secrets, injection vulnerabilities, missing auth on protected routes, breaking changes without migration.
