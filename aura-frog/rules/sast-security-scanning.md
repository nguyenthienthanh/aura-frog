# SAST Security Scanning Rule

**Category:** Security
**Priority:** Critical
**Version:** 1.0.0
**Applies To:** All code changes, Phase 6 (Code Review), Phase 7 (QA Validation)

---

## Overview

Static Application Security Testing (SAST) must be performed on all code changes to identify security vulnerabilities before deployment. This rule enforces security scanning as part of the development workflow.

---

## When SAST Is REQUIRED

```toon
required_triggers[6]{scenario,scan_type,phase}:
  New feature implementation,Full scan,Phase 6
  Bug fix touching auth/security,Targeted scan,Phase 6
  API endpoint changes,API security scan,Phase 6
  Database query changes,SQL injection scan,Phase 5b
  User input handling,XSS/injection scan,Phase 5b
  Dependency updates,Dependency audit,Phase 7
```

---

## OWASP Top 10 Checks

### MUST Check For:

```toon
owasp_checks[10]{id,vulnerability,detection}:
  A01,Broken Access Control,Auth bypass patterns
  A02,Cryptographic Failures,Weak crypto/hardcoded secrets
  A03,Injection,SQL/NoSQL/Command/LDAP injection
  A04,Insecure Design,Missing security controls
  A05,Security Misconfiguration,Default configs/verbose errors
  A06,Vulnerable Components,Outdated dependencies with CVEs
  A07,Auth Failures,Weak passwords/session issues
  A08,Data Integrity Failures,Unsigned data/insecure deserialization
  A09,Logging Failures,Missing audit logs/log injection
  A10,SSRF,Server-side request forgery patterns
```

---

## Code Patterns to Detect

### Critical (Block Merge)

```typescript
// ❌ SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

```typescript
// ❌ Command Injection
exec(`rm -rf ${userInput}`);

// ✅ Validate and sanitize
const safePath = path.basename(userInput);
fs.unlinkSync(path.join(SAFE_DIR, safePath));
```

```typescript
// ❌ Hardcoded Secrets
const apiKey = 'sk-1234567890abcdef';

// ✅ Use environment variables
const apiKey = process.env.API_KEY;
```

```typescript
// ❌ XSS Vulnerability
element.innerHTML = userInput;

// ✅ Sanitize or use safe APIs
element.textContent = userInput;
// or
element.innerHTML = DOMPurify.sanitize(userInput);
```

### High (Warning)

```typescript
// ⚠️ Weak Cryptography
crypto.createHash('md5');
crypto.createHash('sha1');

// ✅ Use strong algorithms
crypto.createHash('sha256');
crypto.createHash('sha512');
```

```typescript
// ⚠️ Missing Input Validation
function processUser(data: any) {
  db.save(data);
}

// ✅ Validate input
function processUser(data: unknown) {
  const validated = userSchema.parse(data);
  db.save(validated);
}
```

---

## Scanning Tools Integration

### JavaScript/TypeScript

```bash
# ESLint Security Plugin
npm install --save-dev eslint-plugin-security
npx eslint --ext .ts,.tsx src/

# Semgrep
semgrep --config=p/javascript src/

# npm audit
npm audit --audit-level=high
```

### Python

```bash
# Bandit
bandit -r src/

# Safety
safety check

# Semgrep
semgrep --config=p/python src/
```

### Go

```bash
# gosec
gosec ./...

# Semgrep
semgrep --config=p/golang src/
```

### PHP

```bash
# PHPStan Security Rules
phpstan analyse --level=max src/

# Psalm
psalm --taint-analysis src/
```

---

## Phase Integration

### Phase 5b (Implementation - GREEN)

```markdown
After tests pass:
1. Run SAST scan on new/modified files
2. Fix any CRITICAL findings before proceeding
3. Document any accepted risks for HIGH findings
```

### Phase 6 (Code Review)

```markdown
Code review MUST include:
1. Full SAST scan report review
2. Security-focused code review
3. Verification of security fixes
4. Sign-off from security perspective
```

### Phase 7 (QA Validation)

```markdown
Final validation:
1. Dependency vulnerability scan
2. Full application SAST scan
3. Security regression check
4. No new CRITICAL/HIGH findings
```

---

## Scan Report Format

```markdown
## SAST Scan Report

**Scan Date:** [DATE]
**Files Scanned:** [COUNT]
**Tool:** [TOOL_NAME]

### Summary
| Severity | Count | Fixed | Accepted |
|----------|-------|-------|----------|
| Critical | 0     | 0     | 0        |
| High     | 2     | 1     | 1        |
| Medium   | 5     | 3     | 2        |
| Low      | 10    | 5     | 5        |

### Critical Findings
[NONE - Ready for merge]

### High Findings
1. **[FIXED]** SQL injection in user.service.ts:45
2. **[ACCEPTED]** Weak random in test-utils.ts (test only)

### Action Items
- [ ] All critical findings resolved
- [ ] High findings addressed or accepted with justification
- [ ] Scan report attached to PR
```

---

## Automated CI/CD Integration

```yaml
# GitHub Actions example
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Run SAST Scan
      uses: returntocorp/semgrep-action@v1
      with:
        config: >-
          p/security-audit
          p/owasp-top-ten

    - name: Dependency Audit
      run: npm audit --audit-level=high

    - name: Upload SARIF
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: semgrep.sarif
```

---

## Severity Handling

### Critical Findings

```markdown
Action: BLOCK merge/deployment
Timeline: Must fix immediately
Approval: Security team sign-off required
```

### High Findings

```markdown
Action: Fix or document risk acceptance
Timeline: Fix before release
Approval: Tech lead sign-off
```

### Medium Findings

```markdown
Action: Track and plan fix
Timeline: Fix within sprint
Approval: Developer acknowledgment
```

### Low Findings

```markdown
Action: Best-effort fix
Timeline: Backlog
Approval: None required
```

---

## Secrets Detection

### Patterns to Detect

```toon
secret_patterns[8]{type,pattern,action}:
  AWS Keys,AKIA[0-9A-Z]{16},Block + alert
  GitHub Tokens,ghp_[a-zA-Z0-9]{36},Block + alert
  Private Keys,-----BEGIN.*PRIVATE KEY-----,Block + alert
  JWT Secrets,eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*,Warn
  API Keys,api[_-]?key.*['\"][a-zA-Z0-9]{20},Block
  Database URLs,postgres://.*:.*@,Block + alert
  Slack Tokens,xox[baprs]-[a-zA-Z0-9-]+,Block + alert
  Generic Secrets,password.*=.*['\"][^'\"]+,Warn
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run secret detection
gitleaks detect --source . --verbose

if [ $? -ne 0 ]; then
  echo "❌ Secrets detected! Commit blocked."
  exit 1
fi
```

---

## Checklist

### Before Code Review

- [ ] SAST scan completed
- [ ] No critical findings
- [ ] High findings addressed or accepted
- [ ] Secrets scan passed
- [ ] Dependency audit clean

### Before Merge

- [ ] Scan report attached to PR
- [ ] Security review completed
- [ ] All blockers resolved
- [ ] Risk acceptances documented

### Before Release

- [ ] Full application scan
- [ ] No new vulnerabilities
- [ ] Dependencies up to date
- [ ] Security sign-off obtained

---

## Related Rules

- `safety-rules.md` - External system safety
- `error-handling-standard.md` - Secure error handling
- `logging-standards.md` - Secure logging practices
- `code-quality.md` - TypeScript strict mode

---

**Version:** 1.0.0 | **Last Updated:** 2025-12-11
