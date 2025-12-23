---
name: git-workflow
description: "Token-efficient git operations with security scanning and auto-split commits"
autoInvoke: true
priority: high
model: haiku
triggers:
  - "commit"
  - "push"
  - "create PR"
  - "git operations"
allowed-tools: Bash, Read
---

# Git Workflow

Token-efficient git operations. Execute in 2-4 tool calls max.

---

## Commit Workflow

### Step 1: Stage + Analyze (Single Command)

```bash
git add -A && \
echo "=== STAGED ===" && \
git diff --cached --stat && \
echo "=== METRICS ===" && \
git diff --cached --shortstat | awk '{print "LINES:"($4+$6)" FILES:"NR}' && \
echo "=== SECURITY ===" && \
git diff --cached | grep -c -iE "(api[_-]?key|token|password|secret|credential)" | awk '{print "SECRETS:"$1}' && \
echo "=== GROUPS ===" && \
git diff --cached --name-only | awk '{
  if ($0 ~ /\.(md|txt)$/) print "docs:"$0
  else if ($0 ~ /test|spec/) print "test:"$0
  else if ($0 ~ /package\.json|yarn\.lock|pnpm-lock/) print "deps:"$0
  else if ($0 ~ /\.github|\.gitlab/) print "ci:"$0
  else print "code:"$0
}'
```

**If SECRETS > 0:** STOP. Show matches. Block commit.

---

### Step 2: Auto-Split Decision

**Split commits if:**
- Mixed types (feat + fix, code + deps)
- FILES > 10 with unrelated changes
- Multiple scopes (frontend + backend)

**Keep single if:**
- All files same type/scope
- FILES ≤ 3 and LINES ≤ 50
- Logically related changes

---

### Step 3: Commit Message

**Format:** `type(scope): description`

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `chore` - Maintenance
- `refactor` - Code restructure
- `test` - Tests
- `perf` - Performance

**Rules:**
- <72 chars
- Present tense, imperative
- No period at end
- Focus on WHAT not HOW

---

### Step 4: Commit + Push

```bash
git commit -m "type(scope): description" && \
echo "✓ commit: $(git rev-parse --short HEAD) $(git log -1 --pretty=%s)"
```

**Push only if user requests.**

---

## Output Format

```
✓ staged: 3 files (+45/-12 lines)
✓ security: passed
✓ commit: a3f8d92 feat(auth): add token refresh
✓ pushed: yes
```

---

## Security Patterns (Block)

```
api[_-]?key
token
password
secret
private[_-]?key
credential
```

---

## PR Workflow

### Pre-PR Check

```bash
git fetch origin main && \
echo "=== COMMITS ===" && \
git log --oneline origin/main..HEAD && \
echo "=== CHANGES ===" && \
git diff --stat origin/main..HEAD
```

### Create PR

```bash
gh pr create --title "type(scope): description" --body "## Summary
- [bullet points]

## Test Plan
- [testing steps]"
```

---

**Version:** 1.0.0
