# Command: security:deps

**Command:** `security:deps [options]`
**Agent:** security-expert
**Version:** 5.2.0

---

## 🎯 Purpose

Scan project dependencies for known vulnerabilities and outdated packages.

---

## 📋 Usage

```bash
# Scan dependencies
security:deps

# Fix automatically
security:deps --fix

# Show only critical/high
security:deps --severity high
```

---

## 🔧 Execution Steps

### Step 1: Detect Package Manager
- Node.js: npm, yarn, pnpm
- Python: pip, poetry
- PHP: Composer
- Go: go modules
- Ruby: bundler

### Step 2: Run Vulnerability Scan

**Node.js:**
```bash
npm audit --json
yarn audit --json
snyk test
```

**Python:**
```bash
pip-audit
safety check
```

**PHP:**
```bash
composer audit
```

**Go:**
```bash
go list -m all | nancy sleuth
```

### Step 3: Analyze Results
- Extract vulnerable packages
- Identify fix versions
- Check for breaking changes
- Estimate upgrade effort

### Step 4: Generate Report

**Output:**
```markdown
# Dependency Vulnerability Report

**Total Vulnerabilities:** 8
- Critical: 1
- High: 3
- Medium: 3
- Low: 1

## Critical Issues

### express (4.16.0 → 4.18.2)
- CVE-2022-24999: Denial of Service
- Severity: Critical
- Fix: `npm install express@4.18.2`

## Recommended Actions

1. Upgrade express to 4.18.2 (CRITICAL)
2. Upgrade jsonwebtoken to 9.0.0 (HIGH)
3. Update lodash to 4.17.21 (HIGH)

**Auto-fix command:**
```bash
npm audit fix
```
```

---

## 📊 Deliverables

- Dependency vulnerability report
- List of affected packages
- Upgrade commands
- Breaking change warnings

---

**Command:** security:deps
**Version:** 5.2.0
