# Command: test:document

**Purpose:** Generate comprehensive test documentation from requirements or ticket
**Category:** Testing & Documentation

---

## Usage

```
test:document <description>
test:document <JIRA-ID>
test:document <requirement-file>
test:document --type=<functional|integration|e2e|performance|security>
test:document --framework=<jest|vitest|cypress|playwright|phpunit>
```

---

## Workflow

```toon
phases[6]{phase,action,output}:
  1. Analyze,Parse requirements + extract scenarios,TEST_REQUIREMENTS.md
  2. Generate,Create test cases (positive/negative/edge),TEST_CASES.md
  3. Matrix,Build traceability + coverage matrices,TEST_MATRIX.md
  4. Code,Generate automated test files,*.test.ts/*.test.tsx
  5. Plan,Create test plan document,TEST_PLAN.md
  6. Assemble,Combine into master document,COMPLETE_TEST_DOCUMENT.md
```

---

## Test Case Structure

```toon
test_case[8]{field,description}:
  ID,Unique identifier (TC-001)
  Objective,What the test verifies
  Priority,P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
  Type,Positive | Negative | Edge
  Preconditions,Required state before test
  Steps,Numbered test actions
  Expected,Expected results for each step
  Postconditions,State after test completion
```

---

## Output Files

```toon
outputs[6]{file,content}:
  TEST_REQUIREMENTS.md,User stories + acceptance criteria + scenarios
  TEST_CASES.md,Detailed test cases with steps + data
  TEST_MATRIX.md,Requirements traceability + coverage matrices
  TEST_PLAN.md,Strategy + environment + schedule + risks
  COMPLETE_TEST_DOCUMENT.md,Master document combining all
  *.test.ts,Generated automated test code
```

**Location:** `.claude/logs/documents/tests/`

---

## Options

| Option | Values | Default |
|--------|--------|---------|
| `--type` | functional, integration, e2e, performance, security | all |
| `--format` | markdown, confluence, pdf | markdown |
| `--coverage` | 1-100 | 80 |
| `--framework` | jest, vitest, cypress, playwright, phpunit | auto-detect |

---

## Success Criteria

- ✅ All requirements mapped to test cases
- ✅ Positive, negative, edge cases covered
- ✅ 100% traceability coverage
- ✅ Automated tests generated and runnable
- ✅ Test plan complete with schedule

---

**Version:** 2.0.0
