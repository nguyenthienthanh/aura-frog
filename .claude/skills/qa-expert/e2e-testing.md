# Skill: E2E Testing

**Category:** QA Expert  
**Priority:** High  
**Used By:** qa-automation agent

---

## Frameworks

### Web: Playwright/Cypress
### Mobile: Detox/Appium

---

## Playwright Example

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  test('can login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'user@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Welcome')
  })
  
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'wrong@example.com')
    await page.fill('[name="password"]', 'wrong')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error')).toBeVisible()
  })
})
```

---

## Best Practices

### Do's ✅
- ✅ Use data-test attributes
- ✅ Test critical user journeys
- ✅ Run in CI/CD
- ✅ Use Page Object Model
- ✅ Handle waits properly

### Don'ts ❌
- ❌ Test every single path
- ❌ Rely on CSS selectors
- ❌ Hard-code waits (sleep)
- ❌ Test implementation details

---

**Used by qa-automation agent for end-to-end test implementation.**

