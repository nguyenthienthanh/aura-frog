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
