# Command: test:e2e

**Purpose:** Add E2E tests for user flows
**Aliases:** `add e2e tests`, `create e2e tests`, `e2e test`

---

## Usage

```
test:e2e "User login flow"
test:e2e "Checkout process" --tool=cypress
test:e2e "Login, Profile, Logout"
test:e2e "Authentication" --mode=full
```

---

## Supported Tools

```toon
tools[3]{tool,platform,best_for}:
  Cypress,Web,Quick setup + great DX + time travel debugging
  Detox,React Native,True native testing + iOS/Android
  Playwright,Web,Multi-browser + advanced scenarios + API testing
```

---

## Workflow

```toon
workflow[3]{step,action}:
  1. Analyze,Parse flow + identify happy/alternative/edge paths
  2. Generate,Create test files with proper assertions + mocks
  3. Report,Run tests + display coverage by flow
```

---

## Test Types

```toon
test_types[6]{type,covers}:
  Happy Path,Success scenarios end-to-end
  Validation,Form errors + required fields
  Edge Cases,Network errors + concurrent actions
  UI/UX,Loading states + disabled buttons
  Accessibility,Keyboard nav + ARIA labels
  Session,Persistence + redirect after login
```

---

## Options

| Option | Values | Default |
|--------|--------|---------|
| `--tool` | cypress, detox, playwright | auto-detect |
| `--mode` | happy, full, a11y | full |
| `--viewport` | mobile, desktop, tablet | responsive |
| `--device` | "iPhone 14 Pro", etc. | default |

---

## Output

```
cypress/e2e/auth/
└── login.cy.ts          ✅ NEW

cypress/support/
└── commands.ts          ✅ UPDATED (custom commands)
```

---

## Run Commands

```bash
yarn cypress run                           # Headless
yarn cypress open                          # Interactive
yarn cypress run --spec "cypress/e2e/**"   # Specific tests
```

---

## Success Criteria

- ✅ All critical flows covered
- ✅ Tests passing consistently (no flaky tests)
- ✅ Fast execution (< 2 min)
- ✅ Accessibility verified

---

**Version:** 2.0.0
