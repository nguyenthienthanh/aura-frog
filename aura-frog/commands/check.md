# Check Commands

Verify code quality, security, performance, and coverage. One command to audit everything.

**Category:** Verification
**Scope:** Session

---

## /check

Run all quality checks: lint, format, type check, coverage, complexity. Produces scored report (0-100) with prioritized next steps.

**Usage:** `/check`, `/check src/components`

---

## /check security

Comprehensive security audit: dependency vulnerabilities (npm audit/pip-audit), secret detection (gitleaks), SAST (semgrep/eslint-security), OWASP Top 10 checks. Generates `SECURITY_AUDIT.md` with remediation plan.

**Usage:** `/check security`, `/check security --quick` (deps + secrets only)

---

## /check perf

Performance analysis: Web (Lighthouse: FCP, LCP, TTI, CLS), Mobile (startup, memory), Backend (API response time, N+1), Bundle (size, chunks, duplicates). Scored 0-100 with prioritized recommendations.

For deep profiling of a specific bottleneck (not just surface metrics), delegate to `skills/perf-profiling/SKILL.md` — measure → analyze flamegraph → one change → verify.

**Usage:** `/check perf`, `/check perf --bundle`, `/check perf --lighthouse`

---

## /check complexity

Cyclomatic + cognitive complexity analysis. Scale: 1-5 simple, 6-10 moderate, 11-20 complex, 21+ critical. Reports hotspots and refactoring priorities.

**Usage:** `/check complexity src/services/auth.ts --threshold 10`

---

## /check debt

Technical debt tracking: TODO/FIXME/HACK, deprecated code, unused exports, duplication, code smells. Categorized by priority with effort estimates and remediation plans.

**Usage:** `/check debt src/components --priority high`

---

## /check coverage

Test coverage analysis: statements, branches, functions, lines. Identifies files below target, uncovered lines, and suggests tests to write.

**Usage:** `/check coverage --target 85`

---

## /check deps

Dependency vulnerability scan. Auto-detects package manager. Reports affected packages, fix versions, breaking change warnings. `--fix` for auto-resolution.

**Usage:** `/check deps`, `/check deps --fix`

---

## Related

- **Skills:** `code-reviewer`, `code-simplifier`, `performance-optimizer`, `perf-profiling`
- **Rules:** `rules/core/code-quality.md`, `rules/core/simplicity-over-complexity.md`
