---
name: code-reviewer
description: "Comprehensive code review with multi-agent analysis. Checks security, performance, maintainability, tests."
autoInvoke: true
priority: high
triggers:
  - "review code"
  - "code review"
  - "after Phase 5c"
  - "before merge"
allowed-tools: Read, Grep, Glob, Bash
---

# Aura Frog Code Reviewer

**Priority:** HIGH - Use before merging code

---

## When to Use

**USE:** After implementation, before merge, when requested

---

## Review Process

### 1. Get Files to Review
```bash
git diff --name-only main...HEAD
```

### 2. Multi-Agent Review

| Agent | Checks |
|-------|--------|
| Security | OWASP Top 10, secrets, SQL injection, XSS |
| Dev | KISS principle, structure, error handling |
| QA | Coverage, test quality, edge cases |
| Performance | Algorithms, memory, queries, bundle size |

### 3. Generate Report

```markdown
## Code Review Report

### ✅ Passed Checks
- [List]

### ⚠️ Warnings
- [Non-blocking issues]

### ❌ Issues Found
- **[CRITICAL]** [Issue] at [file:line]
  - Fix: [recommendation]

### 📊 Metrics
- Coverage: X% (target: Y%)
- Files: N changed
```

### 4. Decision

- **✅ APPROVED** - No critical issues
- **⚠️ APPROVED WITH COMMENTS** - Minor issues
- **❌ CHANGES REQUESTED** - Critical issues

---

## Quick Checklist

**Security:**
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] Auth checks in place

**Quality:**
- [ ] KISS principle
- [ ] No duplication
- [ ] Error handling
- [ ] Follows conventions

**Testing:**
- [ ] Coverage ≥ target
- [ ] Critical paths tested
- [ ] Edge cases covered

**Performance:**
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] No memory leaks

---

## Critical (Block Merge)

- Hardcoded secrets
- SQL injection / XSS
- Coverage < target
- Breaking changes without migration

---

**Remember:** Review improves code quality. Be constructive.
