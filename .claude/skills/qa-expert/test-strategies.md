# Skill: Test Strategies

**Category:** QA Expert  
**Priority:** High  
**Used By:** qa-automation agent

---

## Test Pyramid

```
       /\
      /E2E\        ← Few (10%)
     /------\
    /  API  \      ← Some (30%)
   /----------\
  /   UNIT     \   ← Many (60%)
 /--------------\
```

### 1. Unit Tests (60% of tests)

**What:** Test individual functions/methods in isolation

**Frameworks:**
- Jest (JavaScript/TypeScript)
- PHPUnit (PHP/Laravel)
- pytest (Python)

**Example:**
```typescript
describe('calculateTotal', () => {
  it('sums prices correctly', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60)
  })
  
  it('handles empty array', () => {
    expect(calculateTotal([])).toBe(0)
  })
  
  it('ignores negative numbers', () => {
    expect(calculateTotal([10, -5, 20])).toBe(30)
  })
})
```

### 2. Integration Tests (30%)

**What:** Test component interactions

**Example:**
```typescript
describe('UserService Integration', () => {
  it('creates user and sends email', async () => {
    const service = new UserService(db, mailService)
    const user = await service.createUser(userData)
    
    expect(user.id).toBeDefined()
    expect(mailService.sendWelcome).toHaveBeenCalledWith(user)
  })
})
```

### 3. E2E Tests (10%)

**What:** Test full user workflows

**Tools:**
- Playwright
- Cypress
- Detox (React Native)

**Example:**
```typescript
test('user can complete purchase', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-test="product-1"]')
  await page.click('[data-test="add-to-cart"]')
  await page.goto('/checkout')
  await page.fill('[name="card"]', '4242424242424242')
  await page.click('[data-test="submit"]')
  await expect(page).toHaveURL('/success')
})
```

---

## Test Coverage Goals

- **Critical paths:** 100%
- **Business logic:** 90%
- **Utilities:** 85%
- **UI components:** 75%
- **Overall target:** 80%+

---

## TDD Workflow

```
RED → GREEN → REFACTOR

1. Write failing test (RED)
2. Write minimum code to pass (GREEN)
3. Improve code quality (REFACTOR)
4. Repeat
```

---

## Best Practices

### Do's ✅
- ✅ Follow test pyramid
- ✅ Test behavior, not implementation
- ✅ Use meaningful test names
- ✅ Keep tests independent
- ✅ Mock external dependencies
- ✅ Aim for 80%+ coverage

### Don'ts ❌
- ❌ Test private methods directly
- ❌ Write flaky tests
- ❌ Ignore failing tests
- ❌ Test framework code
- ❌ Write tests after code (use TDD!)

---

**Used by qa-automation agent for test planning and strategy.**

