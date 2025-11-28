# Command: security:audit

**Command:** `security:audit [project-path]`
**Agent:** security-expert
**Version:** 5.2.0
**Priority:** High

---

## 🎯 Purpose

Perform a comprehensive security audit of the codebase, including dependency scanning, static code analysis, secret detection, and manual security review based on OWASP Top 10.

---

## 📋 Usage

```bash
# Full security audit on current project
security:audit

# Audit specific project
security:audit /path/to/project

# Audit with custom report output
security:audit --output security-report.md

# Quick audit (dependencies + secrets only)
security:audit --quick
```

---

## 🔧 Execution Steps

### Step 1: Project Detection (1-2 min)

**Activate agents:**
- primary: security-expert
- supporting: project-detector

**Actions:**
1. Detect project type (web, mobile, backend)
2. Identify tech stack (Node.js, Python, PHP, React Native, etc.)
3. Locate configuration files (package.json, requirements.txt, composer.json)
4. Identify security-critical files (auth, API, database)

**Deliverable:**
- Project security profile

---

### Step 2: Dependency Vulnerability Scan (2-5 min)

**Tools:**
- Node.js: `npm audit`, Snyk CLI
- Python: `pip-audit`, Safety
- PHP: Composer audit
- Go: `go list -m all | nancy`

**Actions:**
1. Run dependency scanner
2. Identify vulnerable packages
3. Check for outdated dependencies (>2 years old)
4. Analyze vulnerability severity (Critical, High, Medium, Low)
5. Generate upgrade recommendations

**Deliverable:**
- Dependency vulnerability report
- List of affected packages
- Recommended fixes

---

### Step 3: Secret Scanning (2-3 min)

**Tools:**
- TruffleHog
- git-secrets
- Manual regex patterns

**Actions:**
1. Scan git history for secrets
2. Scan current files for hardcoded secrets
3. Check environment files (.env, .env.example)
4. Detect API keys, passwords, tokens, private keys
5. Check for exposed AWS credentials, JWT secrets

**Patterns searched:**
- AWS Access Keys: `AKIA[0-9A-Z]{16}`
- Private Keys: `-----BEGIN.*PRIVATE KEY-----`
- JWT Secrets: Hardcoded JWT_SECRET values
- API Keys: Common patterns (STRIPE_SECRET_KEY, etc.)

**Deliverable:**
- Secret detection report
- List of exposed secrets (masked)
- Remediation steps

---

### Step 4: Static Code Analysis (5-10 min)

**Tools:**
- Node.js: ESLint security plugins, Semgrep
- Python: Bandit
- PHP: PHPCS security rules
- General: SonarQube (if available)

**Actions:**
1. Run SAST scanner
2. Detect security vulnerabilities:
   - SQL injection risks
   - XSS vulnerabilities
   - Command injection
   - Path traversal
   - Insecure crypto
   - Hardcoded secrets
3. Check security headers (Helmet.js, CSP)
4. Review authentication logic
5. Check authorization patterns

**Deliverable:**
- Static analysis report
- Security hotspots
- Code snippets with issues
- Remediation examples

---

### Step 5: OWASP Top 10 Manual Review (10-20 min)

**Checklist:**

**A01: Broken Access Control**
- [ ] Authorization checks on all routes
- [ ] IDOR prevention (direct object references)
- [ ] Horizontal privilege escalation checks
- [ ] Vertical privilege escalation checks

**A02: Cryptographic Failures**
- [ ] Passwords hashed (bcrypt, argon2)
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted at rest
- [ ] No weak crypto algorithms (MD5, SHA1)

**A03: Injection**
- [ ] SQL injection prevention (parameterized queries)
- [ ] NoSQL injection prevention
- [ ] Command injection prevention
- [ ] XSS prevention (output encoding)

**A04: Insecure Design**
- [ ] Threat modeling performed
- [ ] Security requirements defined
- [ ] Rate limiting on APIs
- [ ] Input validation whitelist

**A05: Security Misconfiguration**
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Error messages don't leak info

**A06: Vulnerable Components**
- [ ] Dependencies up to date
- [ ] No known vulnerabilities
- [ ] Unused dependencies removed

**A07: Authentication Failures**
- [ ] Password strength enforced
- [ ] MFA available
- [ ] Account lockout after failed attempts
- [ ] Secure password reset
- [ ] Session timeout configured

**A08: Data Integrity Failures**
- [ ] Code signing / integrity checks
- [ ] CI/CD pipeline secured
- [ ] No deserialization of untrusted data

**A09: Logging & Monitoring Failures**
- [ ] Security events logged
- [ ] Logs don't contain sensitive data
- [ ] Alerts configured
- [ ] Audit trail for admin actions

**A10: SSRF**
- [ ] User input validated for URLs
- [ ] Whitelist for external requests
- [ ] Network segmentation

**Actions:**
1. Review code against each OWASP category
2. Document findings
3. Assign severity ratings
4. Provide remediation guidance

**Deliverable:**
- OWASP Top 10 checklist results
- Security findings by category
- Risk ratings (Critical/High/Medium/Low)

---

### Step 6: Container & Infrastructure Security (5-10 min, if applicable)

**Tools:**
- Trivy (container scanning)
- Docker Bench Security
- Kubernetes security scanner

**Actions:**
1. Scan Docker images for vulnerabilities
2. Check Dockerfile best practices
3. Review Kubernetes manifests security
4. Check cloud IAM permissions (AWS, GCP, Azure)
5. Review secrets management (Vault, Secrets Manager)

**Deliverable:**
- Container security report
- Infrastructure security findings

---

### Step 7: Report Generation & Prioritization (5-10 min)

**Actions:**
1. Aggregate all findings
2. Remove duplicates
3. Categorize by severity:
   - **Critical:** Exploitable, immediate risk (e.g., SQL injection in production)
   - **High:** Serious vulnerability, near-term risk (e.g., weak password hashing)
   - **Medium:** Security weakness, should fix (e.g., missing CSRF protection)
   - **Low:** Best practice violation (e.g., outdated dependency, no security impact)
4. Calculate security score (0-100)
5. Create remediation roadmap
6. Generate JIRA tickets for Critical/High issues

**Deliverable:**
- **Comprehensive Security Audit Report** (Markdown)
- **Executive Summary** (for non-technical stakeholders)
- **Vulnerability List** (categorized, prioritized)
- **Remediation Roadmap**
- **JIRA Tickets** (auto-created for Critical/High)

---

## 📊 Report Structure

```markdown
# Security Audit Report

**Project:** [Project Name]
**Date:** [Date]
**Auditor:** security-expert agent (CCPM v5.2.0)
**Scope:** Full application security audit

---

## Executive Summary

**Security Score:** 72/100 (Medium Risk)

**Critical Issues:** 2
**High Issues:** 5
**Medium Issues:** 12
**Low Issues:** 8

**Top Risks:**
1. SQL Injection vulnerability in /api/users endpoint (CRITICAL)
2. Weak password hashing (bcrypt cost factor 4, should be ≥12) (HIGH)
3. Missing CSRF protection on state-changing endpoints (HIGH)

**Recommendation:** Address Critical and High issues within 1 week.

---

## Findings by Category

### 1. Dependency Vulnerabilities

**Total:** 8 vulnerable packages

| Package | Version | Vulnerability | Severity | Fix |
|---------|---------|---------------|----------|-----|
| express | 4.16.0 | CVE-2022-24999 | High | Upgrade to 4.18.2+ |
| jsonwebtoken | 8.5.1 | CVE-2022-23529 | High | Upgrade to 9.0.0+ |
| ... | ... | ... | ... | ... |

### 2. Secret Detection

**Total:** 3 exposed secrets

- AWS Access Key in `config/aws.js` (line 12)
- Stripe Secret Key in `.env.example` (line 45)
- JWT Secret hardcoded in `auth/middleware.js` (line 23)

### 3. Static Code Analysis

**Total:** 15 security issues

#### Critical Issues (2)

**SQL Injection - /api/users**
```javascript
// src/controllers/user.controller.js:45
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
db.query(query);
```
**Remediation:**
```javascript
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [req.params.id]);
```

#### High Issues (5)

**Weak Password Hashing**
```javascript
// src/services/auth.service.js:78
const hash = bcrypt.hashSync(password, 4);  // Cost factor too low
```
**Remediation:**
```javascript
const hash = await bcrypt.hash(password, 12);  // Cost factor ≥12
```

### 4. OWASP Top 10 Review

| Category | Status | Issues | Priority |
|----------|--------|--------|----------|
| A01: Broken Access Control | ⚠️ | 3 | High |
| A02: Cryptographic Failures | ⚠️ | 2 | High |
| A03: Injection | ❌ | 2 | Critical |
| A04: Insecure Design | ✅ | 0 | - |
| A05: Security Misconfiguration | ⚠️ | 4 | Medium |
| ... | ... | ... | ... |

### 5. Security Score Breakdown

- Dependencies: 65/100 (8 vulnerable packages)
- Secrets: 40/100 (3 exposed secrets)
- Code Security: 70/100 (2 critical, 5 high issues)
- OWASP Compliance: 75/100 (2 critical categories failing)
- Infrastructure: 85/100 (minor issues)

**Overall Score:** 72/100 (Medium Risk)

---

## Remediation Roadmap

### Week 1 (Critical & High)
1. Fix SQL injection in /api/users endpoint
2. Fix SQL injection in /api/posts endpoint
3. Upgrade password hashing (bcrypt cost 12)
4. Remove exposed secrets from code
5. Upgrade vulnerable dependencies (express, jsonwebtoken)
6. Add CSRF protection

### Week 2 (Medium)
7. Implement rate limiting on /api/* endpoints
8. Add security headers (Helmet.js)
9. Fix CORS configuration
10. Enable HTTPS redirect

### Week 3-4 (Low)
11. Update remaining outdated dependencies
12. Add security logging
13. Implement audit trail

---

## JIRA Tickets Created

- [SEC-101] CRITICAL: Fix SQL Injection in /api/users
- [SEC-102] CRITICAL: Fix SQL Injection in /api/posts
- [SEC-103] HIGH: Upgrade password hashing to bcrypt cost 12
- [SEC-104] HIGH: Remove exposed AWS credentials
- [SEC-105] HIGH: Add CSRF protection

---

## Compliance Status

- GDPR: ⚠️ Partial (password hashing weak)
- OWASP Top 10: ⚠️ Partial (2 critical issues)
- PCI DSS: ❌ Not compliant (payment data not encrypted)

---

**Generated by:** CCPM v5.2.0 security-expert agent
**Next Audit:** 2024-12-26 (30 days)
```

---

## 🎯 Success Criteria

**Audit is successful when:**
- ✅ All 7 audit steps completed
- ✅ Comprehensive report generated
- ✅ Findings categorized and prioritized
- ✅ Remediation roadmap created
- ✅ JIRA tickets created for Critical/High issues
- ✅ Security score calculated

---

## 🚨 Approval Gate

```markdown
╔══════════════════════════════════════════════════════════╗
║  🔒 Security Audit Complete - Review Required           ║
╚══════════════════════════════════════════════════════════╝

## Security Audit Summary

**Agent:** security-expert
**Scope:** Full application security audit
**Duration:** 35 minutes

**Security Score:** 72/100 (Medium Risk)

**Findings:**
- 🔴 Critical: 2 (SQL injection vulnerabilities)
- 🟠 High: 5 (weak hashing, exposed secrets, missing CSRF)
- 🟡 Medium: 12 (security headers, rate limiting, CORS)
- 🟢 Low: 8 (outdated deps, logging gaps)

**Deliverables:**
- ✅ Security audit report (security-audit-report.md)
- ✅ Vulnerability list (categorized)
- ✅ Remediation roadmap
- ✅ JIRA tickets created (5 tickets for Critical/High)

**Top 3 Risks:**
1. SQL Injection in /api/users (CRITICAL)
2. SQL Injection in /api/posts (CRITICAL)
3. Weak password hashing - bcrypt cost 4 (HIGH)

**Recommendation:**
Address Critical issues within 48 hours, High issues within 1 week.

**Next Steps:**
1. Review security report
2. Prioritize remediation
3. Assign JIRA tickets to developers
4. Schedule follow-up audit in 30 days

---

**Options:**
- "approve" → Accept findings, proceed with remediation
- "reject: [reason]" → Re-run audit with adjustments
- "fix critical" → Auto-generate fixes for Critical issues

**Token Usage:** 8,450 tokens (~8.5K)
**Total Session:** 103,386 / 200,000 (51.7%)

─────────────────────────────────────────────────────────
🤖 Agent: security-expert | System: CCPM v5.2.0
─────────────────────────────────────────────────────────
```

---

## 🔗 Integration Points

**CCPM Workflow:**
- Can be run standalone: `security:audit`
- Integrated with Phase 6 (Review): Auto-trigger security review
- Integrated with Phase 7 (Verify): Security testing validation

**Related Commands:**
- `security:deps` - Dependency scan only
- `security:scan` - Code scan only
- `security:fix` - Auto-fix common issues

**Related Agents:**
- security-expert (primary)
- backend agents (code review)
- devops-cicd (infrastructure review)

---

**Command:** security:audit
**Version:** 5.2.0
**Last Updated:** 2024-11-26
**Status:** ✅ Active
