---
name: git-workflow
description: "Token-efficient git operations with security scanning and auto-split commits"
autoInvoke: false
priority: high
model: haiku
triggers:
  - "commit"
  - "push"
  - "create PR"
allowed-tools: Bash, Read
---

# Git Workflow

Token-efficient git: 2-4 tool calls max.

## Commit Process

### 1. Stage + Security Scan

Stage files, check diff stats, scan for secrets (`api_key|token|password|secret|credential`).
**If secrets found: STOP. Show matches. Block commit.**

### 2. Split Decision

**Split** if: mixed types (feat+fix), FILES >10 unrelated, multiple scopes (frontend+backend).
**Single** if: same type/scope, FILES ≤3 + LINES ≤50, logically related.

### 3. Commit Message

Format: `type(scope): description` (<72 chars, present tense, imperative)
Types: feat, fix, docs, chore, refactor, test, perf

### 4. Commit + Push

Push only if user requests.

## PR Workflow

1. `git fetch origin main` + log commits since main + diff stats
2. `gh pr create --title "type(scope): description" --body "## Summary\n- bullets\n\n## Test Plan\n- steps"`

## Output

```
staged: 3 files (+45/-12 lines) | security: passed | commit: a3f8d92 feat(auth): add token refresh
```
