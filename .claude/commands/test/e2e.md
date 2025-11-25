# Command: test:e2e

**Purpose:** Add E2E tests for user flows  
**Aliases:** `add e2e tests`, `create e2e tests`, `e2e test`, `cypress test`

---

## 🎯 Overview

Generate end-to-end tests for complete user flows and scenarios.

**Supports:**
- Cypress (Web)
- Detox (React Native)
- Playwright (Web)

**Use when:**
- Need to test complete user journeys
- Verify integration between components
- Test critical business flows
- Ensure UI/UX works end-to-end

---

## 📋 Usage

```bash
# Add E2E tests for feature
test:e2e "User login flow"

# Add tests with specific tool
test:e2e "Checkout process" --tool=cypress

# Add tests for multiple flows
test:e2e "Login, Profile, Logout"

# Or natural language
"Add E2E tests for authentication"
"Create Cypress tests for checkout"
```

---

## 🔄 Execution Flow

### 1. Analyze User Flow

```markdown
## 🎯 Flow Analysis

**Feature:** User Login Flow  
**Type:** Authentication  
**Complexity:** Medium  

---

## 📋 Flow Steps

**Happy Path:**
1. Navigate to login page
2. Enter valid email
3. Enter valid password
4. Click login button
5. Verify redirect to dashboard
6. Verify user name displayed

**Alternative Paths:**
1. Invalid email format
2. Wrong password
3. Empty fields
4. Network error
5. Session expired

**Edge Cases:**
1. Multiple login attempts
2. Remember me checkbox
3. Forgot password link
4. Social login options

---

## 🎬 Test Scenarios

**Total:** 8 scenarios  
**Estimated Tests:** 12 test cases  
**Estimated Time:** 30 minutes

**Proceed?** (yes/no)
```

### 2. Generate E2E Tests

**Cypress Example:**

```typescript
// File: cypress/e2e/auth/login.cy.ts
describe('User Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('Happy Path', () => {
    it('should successfully login with valid credentials', () => {
      // Arrange
      const user = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      cy.get('[data-testid="email-input"]').type(user.email);
      cy.get('[data-testid="password-input"]').type(user.password);
      cy.get('[data-testid="login-button"]').click();

      // Assert
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-name"]').should('contain', 'Test User');
      cy.get('[data-testid="logout-button"]').should('be.visible');
    });

    it('should persist session after page refresh', () => {
      // Login
      cy.login('test@example.com', 'password123');

      // Refresh
      cy.reload();

      // Verify still logged in
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-name"]').should('be.visible');
    });
  });

  describe('Validation', () => {
    it('should show error for invalid email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="email-error"]')
        .should('be.visible')
        .and('contain', 'Invalid email format');
    });

    it('should show error for wrong password', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
    });

    it('should require both email and password', () => {
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
    });
  });

  describe('UI/UX', () => {
    it('should show loading state during login', () => {
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply({
          delay: 1000,
          statusCode: 200,
          body: { success: true }
        });
      });

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="login-button"]')
        .should('be.disabled')
        .and('contain', 'Logging in...');
    });

    it('should toggle password visibility', () => {
      cy.get('[data-testid="password-input"]')
        .should('have.attr', 'type', 'password');

      cy.get('[data-testid="password-toggle"]').click();

      cy.get('[data-testid="password-input"]')
        .should('have.attr', 'type', 'text');
    });
  });

  describe('Edge Cases', () => {
    it('should handle network error gracefully', () => {
      cy.intercept('POST', '/api/auth/login', {
        forceNetworkError: true
      });

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Network error');
    });

    it('should prevent multiple simultaneous login attempts', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      
      // Rapid clicks
      cy.get('[data-testid="login-button"]').click().click().click();

      // Should only make one request
      cy.wait('@loginRequest').its('request').should('exist');
      cy.get('@loginRequest.all').should('have.length', 1);
    });

    it('should redirect to intended page after login', () => {
      // Try to access protected page
      cy.visit('/profile');

      // Should redirect to login with return URL
      cy.url().should('include', '/login');
      cy.url().should('include', 'redirect=%2Fprofile');

      // Login
      cy.login('test@example.com', 'password123');

      // Should redirect to original page
      cy.url().should('include', '/profile');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'email-input');

      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'password-input');

      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'login-button');
    });

    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="email-input"]')
        .should('have.attr', 'aria-label', 'Email address');

      cy.get('[data-testid="password-input"]')
        .should('have.attr', 'aria-label', 'Password');

      cy.get('[data-testid="login-button"]')
        .should('have.attr', 'aria-label', 'Login to your account');
    });
  });
});

// Custom commands (cypress/support/commands.ts)
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

**Detox (React Native) Example:**

```typescript
// File: e2e/auth/login.e2e.ts
describe('User Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Happy Path', () => {
    it('should successfully login with valid credentials', async () => {
      // Navigate to login
      await element(by.id('login-tab')).tap();

      // Enter credentials
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');

      // Hide keyboard
      await element(by.id('password-input')).tapReturnKey();

      // Tap login
      await element(by.id('login-button')).tap();

      // Verify navigation
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Verify user name
      await expect(element(by.id('user-name')))
        .toHaveText('Test User');
    });

    it('should persist session after app restart', async () => {
      // Login
      await element(by.id('login-tab')).tap();
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      // Wait for dashboard
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Restart app
      await device.reloadReactNative();

      // Verify still logged in
      await expect(element(by.id('dashboard-screen'))).toBeVisible();
    });
  });

  describe('Validation', () => {
    it('should show error for invalid email', async () => {
      await element(by.id('login-tab')).tap();
      await element(by.id('email-input')).typeText('invalid-email');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      await expect(element(by.id('email-error')))
        .toBeVisible()
        .toHaveText('Invalid email format');
    });

    it('should show error for wrong password', async () => {
      await element(by.id('login-tab')).tap();
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('login-button')).tap();

      await waitFor(element(by.id('error-message')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('UI/UX', () => {
    it('should show loading indicator during login', async () => {
      await element(by.id('login-tab')).tap();
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      // Loading indicator should appear
      await expect(element(by.id('loading-indicator'))).toBeVisible();

      // Then disappear after success
      await waitFor(element(by.id('loading-indicator')))
        .not.toBeVisible()
        .withTimeout(5000);
    });

    it('should allow scrolling on small screens', async () => {
      await element(by.id('login-tab')).tap();

      // Scroll to bottom
      await element(by.id('login-scroll-view')).scrollTo('bottom');

      // Verify login button visible
      await expect(element(by.id('login-button'))).toBeVisible();
    });
  });
});
```

**Playwright Example:**

```typescript
// File: tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');

    // Submit
    await page.click('[data-testid="login-button"]');

    // Verify redirect
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify user name
    await expect(page.locator('[data-testid="user-name"]'))
      .toContainText('Test User');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toBeVisible();
  });

  test('should handle network error', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', route => route.abort());

    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Network error');
  });
});
```

### 3. Display Results

```markdown
╔══════════════════════════════════════════════════════════╗
║  ✅ E2E TESTS GENERATED                                  ║
╚══════════════════════════════════════════════════════════╝

## 📝 Test Files Created

1. **cypress/e2e/auth/login.cy.ts** (285 lines)
   - 12 test scenarios
   - Happy path + edge cases
   - Accessibility tests

2. **cypress/support/commands.ts** (Updated)
   - Custom `cy.login()` command
   - Reusable helpers

3. **cypress.config.ts** (Updated)
   - Base URL configured
   - Viewport settings
   - Timeout settings

---

## ✅ Test Results

**Total Tests:** 12  
**Passed:** 12 ✅  
**Failed:** 0  
**Duration:** 45s  

---

## 📊 Flow Coverage

| Flow | Status |
|------|--------|
| Happy path login | ✅ Covered |
| Invalid email | ✅ Covered |
| Wrong password | ✅ Covered |
| Empty fields | ✅ Covered |
| Network error | ✅ Covered |
| Session persistence | ✅ Covered |
| Loading states | ✅ Covered |
| Accessibility | ✅ Covered |

**Coverage:** 100%

---

## 🚀 Run Tests

**Headless mode:**
```bash
yarn cypress run
```

**Interactive mode:**
```bash
yarn cypress open
```

**Specific test:**
```bash
yarn cypress run --spec "cypress/e2e/auth/login.cy.ts"
```

---

**Status:** ✅ E2E tests ready!
```

---

## 🎯 Test Tool Selection

### Cypress (Default for Web)

**Best for:**
- Web applications
- Quick setup
- Great DX
- Time travel debugging

**Pros:**
- ✅ Easy to write
- ✅ Fast feedback
- ✅ Great documentation
- ✅ Built-in retry logic

### Detox (React Native)

**Best for:**
- React Native apps
- iOS/Android testing
- Native interactions

**Pros:**
- ✅ True native testing
- ✅ Gray box testing
- ✅ Synchronization built-in

### Playwright (Advanced Web)

**Best for:**
- Multi-browser testing
- Advanced scenarios
- API testing

**Pros:**
- ✅ Cross-browser
- ✅ Auto-wait
- ✅ Network mocking

---

## 💡 Options

### Specify Tool

```bash
test:e2e "Login flow" --tool=cypress
test:e2e "Login flow" --tool=detox
test:e2e "Login flow" --tool=playwright
```

### Test Modes

```bash
# Happy path only
test:e2e "Login" --mode=happy

# Include edge cases
test:e2e "Login" --mode=full

# Accessibility focused
test:e2e "Login" --mode=a11y
```

### Device/Browser Target

```bash
# Mobile viewport
test:e2e "Login" --viewport=mobile

# Desktop
test:e2e "Login" --viewport=desktop

# Specific device
test:e2e "Login" --device="iPhone 14 Pro"
```

---

## 🎬 Common Flows

### Authentication
- Login
- Logout
- Signup
- Password reset
- Social login

### E-commerce
- Product search
- Add to cart
- Checkout
- Payment
- Order confirmation

### User Management
- Profile update
- Avatar upload
- Settings change
- Account deletion

---

## ✅ Success Criteria

✅ All critical flows covered  
✅ Tests passing consistently  
✅ No flaky tests  
✅ Fast execution (< 2 min)  
✅ Proper error handling  
✅ Accessibility verified  

---

## 🔗 Related Commands

```bash
test:e2e "flow"         # E2E tests
test:unit "file"        # Unit tests
test:coverage           # Check coverage
workflow:start "task"   # Full TDD workflow
```

---

**Command:** test:e2e  
**Version:** 1.0.0  
**Added:** CCPM v4.3

