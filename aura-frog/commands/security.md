# Security Commands

Security scanning and auditing. Covers dependency vulnerabilities, static analysis (SAST), secret detection, and OWASP Top 10 checks.

---

## /security:audit

**Trigger:** `security:audit [path]`

Comprehensive security audit in 6 steps: detect project type, scan dependencies (npm audit/pip-audit/composer audit), detect secrets (gitleaks/truffleHog), run SAST (semgrep/eslint-security), check OWASP Top 10 (broken access control, injection, auth failures), and generate report with remediation plan. Severity SLAs: critical 24h, high 1 week, medium 2 weeks.

**Usage:** `security:audit --quick` (deps + secrets only), `security:audit --output report.md`
**Output:** `SECURITY_AUDIT.md`, `vulnerabilities.json`, `remediation-plan.md`

---

## /security:scan

**Trigger:** `security:scan [path]`

Static code security analysis. Runs language-specific SAST tools (ESLint security plugins, Semgrep, Bandit, gosec) to detect SQL injection, XSS, command injection, path traversal, insecure crypto, and hardcoded credentials. Includes secret detection (TruffleHog, regex patterns for AWS keys, private keys, API keys). For web projects, also checks security headers (Helmet.js, CSP, CORS, HTTPS).

**Usage:** `security:scan src/ --severity high`

---

## /security:deps

**Trigger:** `security:deps [options]`

Scan dependencies for known vulnerabilities. Auto-detects package manager (npm/yarn/pnpm/pip/poetry/composer/go modules/bundler). Runs vulnerability scan, identifies fix versions, checks for breaking changes, and estimates upgrade effort. Supports `--fix` for automatic resolution. Outputs affected packages, upgrade commands, and breaking change warnings.

**Usage:** `security:deps --fix`, `security:deps --severity high`

---

## Related

- **Agent:** `security` (PID 06)
- **Rules:** OWASP Top 10 checks integrated
