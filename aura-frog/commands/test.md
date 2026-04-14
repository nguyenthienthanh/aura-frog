# Test Commands

Unified testing command with intelligent test type detection. Supports unit, e2e, coverage, and documentation generation across Jest, Vitest, Pytest, PHPUnit, Go testing, Cypress, Playwright, and Detox.

---

## /test

**Trigger:** `/test`, `/test [subcommand]`

Interactive test menu with auto-detection. When called without subcommand, detects framework (Jest, Vitest, Pytest, PHPUnit, Go), test type (unit/integration/e2e), and scope (changed files or full suite). Offers quick actions: run all, run changed, run with coverage, watch mode, debug failing test, update snapshots.

**Usage:** `/test`, `/test watch [path]`, `/test snapshot`, `/test debug "user login"`

---

## /test unit

**Trigger:** `/test unit <path>`, `add unit tests`, `unit test`

Generate and run unit tests targeting a coverage threshold. Analyzes files, extracts testable units, creates test files with setup/assertions/mocks, runs them, and reports coverage. Generates tests for rendering, interactions, validation, hooks, edge cases, and snapshots.

**Usage:** `/test unit "src/components/UserProfile.tsx" --coverage=85`
**Options:** `--coverage` (default 80), `--focus` (component/hooks/edge-cases), `--mocks` (auto/minimal)

---

## /test e2e

**Trigger:** `/test e2e <flow>`, `add e2e tests`, `e2e test`

Generate end-to-end tests for user flows. Supports Cypress (web), Detox (React Native), and Playwright (multi-browser). Covers happy path, validation, edge cases, UI/UX states, accessibility, and session flows. Auto-detects tool or specify with `--tool`.

**Usage:** `/test e2e "User login flow" --tool=cypress --mode=full`
**Options:** `--tool` (cypress/detox/playwright), `--mode` (happy/full/a11y), `--viewport` (mobile/desktop/tablet)

---

## /test coverage

**Trigger:** `/test coverage`, `coverage`, `check coverage`

Analyze current test coverage and identify gaps. Reports overall metrics (statements, branches, functions, lines), per-directory breakdown, files below target, uncovered lines with suggested tests, and prioritized recommendations with time estimates. Tracks coverage trends over time.

**Usage:** `/test coverage --target=85 --format=detailed`
**Options:** `--target` (default 80), `--format` (summary/detailed/json), `--below-target`, `--critical`

---

## /test document

**Trigger:** `/test document <description|JIRA-ID>`

Generate comprehensive test documentation from requirements. Produces TEST_REQUIREMENTS.md, TEST_CASES.md (with ID, priority, steps, expected results), TEST_MATRIX.md (traceability), TEST_PLAN.md, generated test code, and a master COMPLETE_TEST_DOCUMENT.md. Output in `.claude/logs/documents/tests/`.

**Usage:** `/test document "User authentication" --type=e2e --framework=playwright`
**Options:** `--type` (functional/integration/e2e/performance/security), `--format` (markdown/confluence/pdf), `--coverage` (default 80)

---

## Related

- **Skills:** `test-writer`, `bugfix-quick`
- **Rules:** `rules/core/tdd-workflow.md`
