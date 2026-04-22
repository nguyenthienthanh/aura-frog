---
name: code-reviewer
description: "6-aspect structured code review (security, architecture, error handling, test gaps, type safety, simplification) with calibrated scoring and per-aspect breakdown. Use when the user asks to review code, check a PR, review a pull request, audit changes before merge, or give code feedback."
autoInvoke: true
priority: high
triggers:
  - "review code"
  - "code review"
  - "before merge"
allowed-tools: Read, Grep, Glob, Bash
effort: high
---

# Code Reviewer

Use after implementation, Phase 4, or before merge.

## Process

1. `git diff --name-only main...HEAD` → changed files
2. Run 6-aspect review
3. Report + decision

## 6 Aspects

```toon
aspects[6]{aspect,weight,checks}:
  Security,CRITICAL,"Secrets, injection, auth gaps, CSRF/CORS"
  Architecture,HIGH,"SRP, coupling, wrong layer, edge cases"
  Error Handling,HIGH,"Unhandled rejections, empty catch, silent failures"
  Test Gaps,HIGH,"Untested critical paths, missing edge/boundary cases"
  Type Safety,MEDIUM,"Missing types, any usage, null gaps"
  Simplification,LOW,"Complex conditionals, deep nesting — only if harms readability"
```

Spend 60% on Security + Architecture + Edge Cases. Don't nitpick syntax — linters handle that.

## Report

`[ASPECT] [SEVERITY] file:line — description → Fix: recommendation`

CRITICAL = block merge | WARNING = should fix | INFO = nice to have

## Decision

- **APPROVED** — 0 critical, ≤3 warnings
- **CHANGES REQUESTED** — any critical finding

## Scoring (prevents LGTM drift)

Per-aspect breakdown required. Anchors: 9-10 production-ready, 7-8 minor issues, 5-6 needs work, <5 changes requested.

## Block Merge On

Hardcoded secrets, injection, missing auth on protected routes, breaking changes without migration.

---

## Mandatory Verification for Claims (CoVe)

Before reporting "0 critical findings" / "N% coverage" / "tests pass", run the Chain-of-Verification protocol from `skills/chain-of-verification/SKILL.md`. Draft → plan 3–5 verification questions → answer via tool (Read/Grep/Bash) → revise. Per `rules/workflow/chain-of-verification.md` this is **mandatory** — reviews without verified claims are not acceptable.

---

## Related Rules

- `rules/core/code-quality.md` — Coverage, typing, error handling baseline
- `rules/core/naming-conventions.md` — Naming patterns
- `rules/core/simplicity-over-complexity.md` — YAGNI/DRY/KISS
- `rules/core/verification.md` — Verify before approving
- `rules/core/prefer-established-libraries.md` — Library choice review
- `rules/agent/sast-security-scanning.md` — Security patterns
- `rules/agent/error-handling-standard.md` — Error-handling review
- `rules/workflow/smart-commenting.md` — Comment review (WHY not WHAT)
- `rules/workflow/cross-review-workflow.md` — Builder ≠ Reviewer
- `rules/workflow/chain-of-verification.md` — **MANDATORY** for factual claims in review output
- `rules/workflow/dual-llm-review.md` — Second-opinion LLM for destructive-op / security-critical findings
