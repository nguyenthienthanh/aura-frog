---
name: test-writer
description: "Write tests with TDD following structured patterns. Ensures consistent AAA structure, proper coverage targets, and framework-specific conventions. Without this skill, tests lack consistent naming, miss coverage targets, and skip anti-pattern checks."
autoInvoke: true
priority: medium
triggers:
  - "add tests"
  - "test coverage"
  - "write tests"
  - "TDD"
  - "E2E test"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
user-invocable: false
---

# Test Writer

## When to Use

Adding tests, improving coverage, TDD (Phase 2/3). NOT for: bug fixes (use the `bugfix-quick` **skill** via the Skill tool — it is NOT an agent), features (run-orchestrator **skill**).

---

## Process

1. **Detect framework** from package.json / pyproject.toml / go.mod
2. **Pick test type** per `Test Type Selection` below — unit, integration, or e2e (NOT default to unit)
3. **Analyze target** — read file, identify testable units, list deps to mock
4. **Write tests** — TDD: RED (failing) → GREEN (implement) → refactor. Existing code: passing → edge cases → errors
5. **Verify coverage** — run with coverage flag, check against targets. For e2e, also confirm the runner actually executed (e.g. `npx playwright test` printed pass/fail per spec, not just "0 tests found")

## Test Type Selection (decide BEFORE writing)

The default in v3.7.0 → v3.7.3 was implicitly "unit test only" because the framework table didn't list Playwright and no rule prescribed e2e. v3.7.4 fixes this:

```toon
test_pyramid[3]{level,trigger,framework,when_required}:
  unit,"Pure functions · business logic · isolated components","jest|vitest|pytest|phpunit|go test","always — fast feedback, mocks externals"
  integration,"Multi-module interaction · DB queries · API contracts","Same runner + real DB/fakes","whenever ≥ 2 modules cross-talk"
  e2e,"User flows · login/checkout/critical paths · cross-page nav","playwright|cypress|detox","UI/auth/payment task OR Phase 2 contract mentions 'flow' / 'journey' / 'end-to-end'"
```

**Trigger words in the task description that REQUIRE an e2e layer in Phase 2:**

- `login`, `signup`, `checkout`, `payment` — critical user flows must have at least one e2e spec
- `flow`, `journey`, `end-to-end`, `happy path`, `smoke test`
- UI-bearing tasks where the artifact is a page/screen (route, view, screen)
- Tasks anchored to a T2 Feature whose `acceptance` references user-visible behavior

When in doubt for a UI task, **write BOTH**: unit tests for the component logic + at least one e2e spec for the happy path. Skipping the e2e layer is the silent failure mode of v3.7.0–v3.7.3 and is exactly what this section exists to prevent.

If the project has no e2e runner configured yet:

1. Detect via repo scan: presence of `playwright.config.*`, `cypress.config.*`, `.detoxrc.js`, `e2e/` directory.
2. If none, surface to the user: *"Project has no e2e runner. Install playwright (recommended) or skip e2e tests with explicit user confirmation? Say `install playwright`, `use cypress`, or `unit-only` to proceed."*
3. Do NOT silently drop the e2e layer — the user must explicitly approve unit-only.

## Principles

```toon
principles[5]{principle}:
  AAA pattern: Arrange → Act → Assert
  "should [action] when [condition]" naming
  One concern per test — no shared state
  Test behavior not implementation
  Mock external deps only — use fakes for complex deps
```

## Coverage Targets

```toon
coverage[4]{scope,target}:
  Critical paths (auth/payment),100%
  Business logic,90%
  UI / utilities,80%
  Overall minimum,80%
```

## Anti-Patterns

```toon
avoid[6]{pattern,fix}:
  Test implementation details,Test behavior/output only
  Shared state between tests,Reset in beforeEach
  Sleep/delays,Use waitFor/polling
  Giant multi-assertion tests,One concern per test
  No assertions,Always assert expected outcomes
  Unit-only for UI/auth/payment tasks,"Add an e2e layer (playwright) — silent v3.7.0–v3.7.3 default fixed in v3.7.4"
```

## Framework Detection

```toon
frameworks[8]{framework,layer,file_pattern,runner,config}:
  Jest/Vitest,unit,"*.test.ts *.spec.ts","npm test / npx vitest","jest.config.* / vitest.config.*"
  PHPUnit,unit,"*Test.php","./vendor/bin/phpunit","phpunit.xml"
  Pytest,unit,"test_*.py","pytest --cov=.","pytest.ini / pyproject.toml [tool.pytest]"
  Go,unit,"*_test.go","go test -cover ./...","go.mod"
  Playwright,e2e,"*.spec.ts (inside tests/ or e2e/)","npx playwright test","playwright.config.*"
  Cypress,e2e,"*.cy.ts (inside cypress/e2e/)","npx cypress run","cypress.config.*"
  Detox,e2e (mobile),"*.e2e.ts","detox test",".detoxrc.js"
  Vitest browser mode,integration,"*.browser.test.ts","npx vitest --browser","vitest.config.* with browser block"
```

**Playwright is the v3.7.4+ recommended e2e default** — it ships an MCP server (`playwright`) on the `tester` agent's allowlist, supports all 3 major browsers, and integrates with the `vitest` MCP for one-tool test execution. Cypress and Detox remain supported.

**Runner verification — never trust silence.** After `npx playwright test` / `npx cypress run`, read the actual output: did it list specs, did pass/fail counts appear, is the exit code 0? "Tests passed" without seeing pass count = `0 tests collected` = bug. Same discipline applies to all runners.

---

## Related Rules

- `rules/core/tdd-workflow.md` — RED → GREEN → REFACTOR
- `rules/core/verification.md` — Read output, then claim
- `rules/core/code-quality.md` — Coverage targets per file type
- `rules/workflow/post-implementation-linting.md` — Lint after tests added
- `rules/core/simplicity-over-complexity.md` — One concern per test, no shared mutable state, no over-engineered mocks
