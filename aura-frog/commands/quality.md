# Quality Commands

Unified code quality command. Handles linting, formatting, type checking, complexity analysis, technical debt tracking, and code review.

---

## /quality

**Trigger:** `/quality`, `/quality [subcommand]`

Interactive quality menu. Runs all checks (lint, format, type check, coverage, complexity) and produces a scored report (0-100). Offers quick actions: run all checks, auto-fix issues, view report. Sub-checks: lint, complexity, security scan, dependency audit, full code review.

**Usage:** `/quality`, `/quality lint src/`, `/quality fix`, `/quality review`

---

## /quality check

**Trigger:** `/quality check [target]`

Comprehensive quality checks: linting (ESLint/Pylint/PHPCS/golangci-lint), formatting (Prettier/Black/gofmt), type checking (tsc/mypy/phpstan), test coverage, and complexity analysis. Supports `--skip-tests` for linting only. Outputs a full report with pass/fail per category, issues found, and next steps with time estimates. Exit codes: 0 (pass), 1-5 (specific failures).

**Usage:** `/quality check src/components`, `/quality check --skip-tests`

---

## /quality complexity

**Trigger:** `/quality complexity [target]`

Analyze cyclomatic complexity, cognitive complexity, and maintainability index. Identifies functions needing refactoring. Scale: 1-5 simple, 6-10 moderate, 11-20 complex, 21+ critical. Reports per-function complexity, distribution chart, directory hotspots, and refactoring priorities with effort estimates and suggested patterns (extract method, guard clauses, strategy pattern).

**Usage:** `/quality complexity src/services/auth.ts --threshold 10 --export report.json`

---

## /quality debt

**Trigger:** `/quality debt [target]`

Track technical debt: TODO/FIXME/HACK comments, deprecated code, unused exports, code duplication (jscpd), and code smells (long methods, deep nesting, magic numbers, commented-out code). Categorizes by priority (high/medium/low) with age tracking, effort estimates, and debt ratio metrics. Provides sprint-sized remediation plans and JIRA ticket suggestions.

**Usage:** `/quality debt src/components --priority high --export debt-report.md`

---

## Related

- **Skills:** `code-reviewer`, `code-simplifier`, `refactor-expert`
- **Rules:** `rules/core/code-quality.md`, `rules/core/simplicity-over-complexity.md`
