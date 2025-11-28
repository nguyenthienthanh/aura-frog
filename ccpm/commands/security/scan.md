# Command: security:scan

**Command:** `security:scan [path]`
**Agent:** security-expert
**Version:** 5.2.0

---

## 🎯 Purpose

Static code security analysis to detect vulnerabilities, insecure patterns, and hardcoded secrets.

---

## 📋 Usage

```bash
# Scan current project
security:scan

# Scan specific directory
security:scan src/

# Show only high/critical
security:scan --severity high
```

---

## 🔧 Execution Steps

### Step 1: Static Analysis

**Tools by language:**
- **Node.js:** ESLint security plugins, Semgrep
- **Python:** Bandit
- **PHP:** PHPCS security rules
- **Go:** gosec

**Checks:**
- SQL injection risks
- XSS vulnerabilities
- Command injection
- Path traversal
- Insecure crypto
- Hardcoded credentials

### Step 2: Secret Detection

**Tools:**
- TruffleHog
- git-secrets
- Regex patterns

**Patterns:**
```regex
AWS Access Key: AKIA[0-9A-Z]{16}
Private Keys: -----BEGIN.*PRIVATE KEY-----
API Keys: [A-Za-z0-9]{32,}
Passwords: password\s*=\s*['"](.*?)['"]
```

### Step 3: Security Headers Check

**Web projects:**
- Helmet.js configuration
- CSP headers
- CORS settings
- HTTPS enforcement

### Step 4: Generate Report

**Output:**
```markdown
# Code Security Scan Report

**Issues Found:** 12
- Critical: 2 (SQL injection)
- High: 4 (XSS, weak crypto)
- Medium: 5 (missing headers)
- Low: 1 (outdated pattern)

## Critical Issues

### SQL Injection - user.controller.js:45
```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${id}`;

// ✅ Fixed
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [id]);
```

## Secrets Found

- AWS Access Key in config/aws.js:12
- JWT Secret in auth/middleware.js:23

**Remediation:** Move to environment variables
```

---

## 📊 Deliverables

- Code security report
- Vulnerability list with code snippets
- Remediation examples
- Secret detection results

---

**Command:** security:scan
**Version:** 5.2.0
