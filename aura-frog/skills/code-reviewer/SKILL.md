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
---

# Aura Frog Code Reviewer — 6-Aspect Analysis

**Priority:** HIGH — Use before merging code

---

## When to Use

- After implementation, before merge
- During Phase 4 (Refactor + Review)
- When explicitly requested

---

## Review Process

### Step 1: Get Changed Files

```bash
git diff --name-only main...HEAD
# Or: files modified in current workflow
```

### Step 2: Run 6-Aspect Review

**MANDATORY: All 6 aspects must be covered. Do not skip any.**

#### Aspect 1: 🔒 Security
- Hardcoded secrets (API keys, passwords, tokens)
- SQL injection, XSS, command injection vectors
- Auth/authz gaps (missing middleware, privilege escalation)
- CSRF, CORS misconfigurations
- Insecure crypto (MD5, SHA1, Math.random for tokens)

#### Aspect 2: 🏷️ Type Safety
- Missing type annotations on public functions
- `any` type usage (suggest specific types)
- Inconsistent return types
- Null/undefined handling gaps
- Generic types that could be narrower

#### Aspect 3: ⚠️ Error Handling
- Unhandled promise rejections
- Empty catch blocks without justification
- Missing error boundaries (React) / error middleware (Express)
- Silent failures (errors swallowed without logging)
- Missing retry logic on external calls

#### Aspect 4: 🧪 Test Gaps
- Untested critical paths
- Missing edge case tests
- Test quality (testing behavior vs implementation)
- Mock quality (over-mocking, missing integration tests)
- Gaps on modified files

#### Aspect 5: 📐 Code Quality
- KISS violations (over-engineering, premature abstraction)
- DRY violations (duplicated logic)
- Naming clarity (functions, variables, files)
- Single Responsibility violations
- Dead code, unused imports

#### Aspect 6: ♻️ Simplification Opportunities
- Complex conditionals that could be simplified
- Deep nesting that could be flattened (early returns)
- Long functions that should be split
- Verbose patterns with simpler alternatives
- Redundant null checks or type guards

### Step 3: Generate Report

```toon
review[6]{aspect,icon,status,findings}:
  Security,🔒,✅|⚠️|❌,{count} findings
  Types,🏷️,✅|⚠️|❌,{count} findings
  Errors,⚠️,✅|⚠️|❌,{count} findings
  Tests,🧪,✅|⚠️|❌,{count} findings
  Quality,📐,✅|⚠️|❌,{count} findings
  Simplify,♻️,✅|⚠️|❌,{count} findings
```

**Detail each finding:**
```
[ASPECT] [SEVERITY] file:line — description
  → Fix: recommendation
```

Severity: 🔴 CRITICAL (block merge) | 🟡 WARNING (should fix) | 🔵 INFO (nice to have)

### Step 4: Decision

- **✅ APPROVED** — 0 critical, ≤3 warnings
- **⚠️ APPROVED WITH COMMENTS** — 0 critical, >3 warnings
- **❌ CHANGES REQUESTED** — Any critical finding

### Step 5: Summary Line

```
Review: 🔒✅ 🏷️✅ ⚠️⚠️ 🧪✅ 📐✅ ♻️✅ — APPROVED WITH COMMENTS (1 error handling warning)
```

---

## Critical (Block Merge)

- Hardcoded secrets
- SQL injection / XSS / command injection
- Missing auth on protected routes
- Breaking changes without migration

---

**Remember:** Review improves code quality. Be constructive.
