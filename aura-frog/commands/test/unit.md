# Command: test:unit

**Purpose:** Add unit tests to achieve target coverage
**Aliases:** `add unit tests`, `create unit tests`, `unit test`

---

## Usage

```
test:unit "src/components/UserProfile.tsx"
test:unit "src/components/UserProfile.tsx" --coverage=85
test:unit "src/features/auth/" --coverage=90
test:unit "Button.tsx, Input.tsx, Form.tsx"
```

---

## Supported Frameworks

```toon
frameworks[5]{stack,framework,utilities}:
  React Native,Jest,React Native Testing Library
  React/Next.js,Jest,React Testing Library
  Vue.js,Vitest,Vue Test Utils
  Laravel,PHPUnit,RefreshDatabase trait
  Node.js,Jest/Vitest,Supertest
```

---

## Workflow

```toon
workflow[5]{step,action}:
  1. Analyze,Parse file + extract testable units
  2. Plan,Determine test strategy + calculate coverage gap
  3. Generate,Create test files with setup/assertions/mocks
  4. Run,Execute tests + generate coverage report
  5. Report,Display results + coverage metrics
```

---

## Test Types Generated

```toon
test_types[6]{type,covers}:
  Rendering,Component displays correct content
  Interactions,User events (press/change/submit)
  Validation,Form field + input validation
  Hooks,Custom hook behavior + state
  Edge Cases,Error/loading/empty states
  Snapshots,UI structure consistency
```

---

## Coverage Targets

| Level | Coverage | Use Case |
|-------|----------|----------|
| Default | 80% | Most projects |
| Recommended | 85% | Production apps |
| Strict | 90%+ | Critical systems |

---

## Options

| Option | Values | Default |
|--------|--------|---------|
| `--coverage` | 1-100 | 80 |
| `--focus` | component, hooks, edge-cases | all |
| `--mocks` | auto, minimal | auto |

---

## Output

```
src/components/UserProfile/
├── UserProfile.tsx
└── __tests__/
    ├── UserProfile.test.tsx      ✅ NEW
    ├── useUserData.test.ts       ✅ NEW
    └── utils.test.ts             ✅ NEW
```

---

## Success Criteria

- ✅ Target coverage achieved
- ✅ All tests passing
- ✅ Edge cases covered
- ✅ Mocks properly configured
- ✅ Fast execution (< 5s)

---

**Version:** 2.0.0
