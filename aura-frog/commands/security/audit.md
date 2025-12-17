# Command: security:audit

**Purpose:** Comprehensive security audit (dependencies, SAST, secrets, OWASP)
**Agent:** security-expert

---

## Usage

```
security:audit                    # Full audit
security:audit /path/to/project   # Specific path
security:audit --quick            # Dependencies + secrets only
security:audit --output report.md # Custom output
```

---

## Audit Steps

```toon
steps[6]{step,action,tools}:
  1. Detect,Identify project type + tech stack,project-detector
  2. Dependencies,Scan for vulnerable packages,"npm audit/pip-audit/composer audit"
  3. Secrets,Find exposed credentials + API keys,gitleaks/truffleHog
  4. SAST,Static code analysis for vulnerabilities,semgrep/eslint-security
  5. OWASP,Check Top 10 vulnerabilities,Manual review
  6. Report,Generate security report + remediation,security-report.md
```

---

## Dependency Scanning

```toon
tools[4]{stack,tool}:
  Node.js,npm audit + Snyk
  Python,pip-audit + Safety
  PHP,Composer audit
  Go,nancy + govulncheck
```

---

## OWASP Top 10 Checks

```toon
owasp[5]{id,vulnerability}:
  A01,Broken Access Control
  A02,Cryptographic Failures
  A03,Injection (SQL/XSS/Command)
  A07,Authentication Failures
  A09,Security Logging Failures
```

---

## Output

```
.claude/logs/security/
├── SECURITY_AUDIT.md         # Full report
├── vulnerabilities.json      # Machine-readable
└── remediation-plan.md       # Fix recommendations
```

---

## Severity Levels

```toon
severity[4]{level,action,sla}:
  Critical,Block deployment + immediate fix,24h
  High,Fix before release,1 week
  Medium,Schedule fix,2 weeks
  Low,Track in backlog,As time permits
```

---

**Version:** 2.0.0
