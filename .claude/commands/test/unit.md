# Command: test:unit

**Purpose:** Add unit tests to achieve target coverage  
**Aliases:** `add unit tests`, `create unit tests`, `unit test`

---

## 🎯 Overview

Generate unit tests for existing code to achieve specified coverage target.

**Supports:**
- React Native (Jest + React Native Testing Library)
- Laravel (PHPUnit)
- Vue.js (Vitest + Vue Test Utils)
- React.js (Jest + React Testing Library)
- Next.js (Jest + React Testing Library)

**Use when:**
- Code exists but lacks tests
- Need to increase coverage
- Want to add tests without full workflow

---

## 📋 Usage

```bash
# Add tests for specific file
test:unit "src/components/UserProfile.tsx"

# Add tests with coverage target
test:unit "src/components/UserProfile.tsx" --coverage=85

# Add tests for directory
test:unit "src/features/auth/" --coverage=90

# Add tests for multiple files
test:unit "Button.tsx, Input.tsx, Form.tsx"

# Or natural language
"Add unit tests for UserProfile component"
"Create tests for auth feature with 90% coverage"
```

---

## 🔄 Execution Flow

### 1. Analyze Target Code

```typescript
// Load and analyze file
const targetFile = parseFile(filePath);

// Extract testable units
const analysis = {
  components: findComponents(targetFile),
  functions: findFunctions(targetFile),
  hooks: findHooks(targetFile),
  classes: findClasses(targetFile),
  methods: findMethods(targetFile),
  complexity: calculateComplexity(targetFile)
};

// Calculate current coverage
const currentCoverage = checkCurrentCoverage(filePath);
```

### 2. Determine Test Strategy

```markdown
## 📊 Code Analysis

**File:** src/components/UserProfile/UserProfile.tsx  
**Type:** React Native Component (Functional)  
**Lines:** 245  
**Complexity:** Medium  

**Current Coverage:** 32%  
**Target Coverage:** 85%  
**Gap:** 53%

---

## 🎯 Testable Units

### Components (2)
1. ✅ UserProfile (main component)
2. ✅ UserProfileHeader (sub-component)

### Hooks (3)
1. ✅ useUserData
2. ✅ useUserUpdate
3. ✅ useFormValidation

### Functions (5)
1. ✅ formatUserName
2. ✅ validateEmail
3. ✅ handleSave
4. ✅ handleCancel
5. ✅ handleAvatarUpload

### Edge Cases (8)
1. Loading state
2. Error state
3. Empty data
4. Invalid email
5. Save success
6. Save failure
7. Network error
8. Upload error

---

## 📝 Test Plan

**Test Files to Create:**
1. `UserProfile.test.tsx` (main component)
2. `useUserData.test.ts` (custom hook)
3. `useUserUpdate.test.ts` (custom hook)
4. `utils.test.ts` (utility functions)

**Estimated Tests:** 28 test cases  
**Estimated Coverage:** 87% (target: 85%) ✅  
**Estimated Time:** 45 minutes

---

**Proceed with test generation?** (yes/no)
```

### 3. Generate Test Files

**React Native Example:**

```typescript
// File: UserProfile.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  // Setup
  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering tests
  describe('Rendering', () => {
    it('should render user information', () => {
      render(<UserProfile userId={mockUser.id} />);
      
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('john@example.com')).toBeTruthy();
    });

    it('should render loading state', () => {
      render(<UserProfile userId={mockUser.id} />);
      
      expect(screen.getByTestId('loading-spinner')).toBeTruthy();
    });

    it('should render error state', () => {
      // Mock error
      jest.spyOn(console, 'error').mockImplementation();
      
      render(<UserProfile userId="invalid" />);
      
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('should handle edit mode toggle', () => {
      render(<UserProfile userId={mockUser.id} editable />);
      
      const editButton = screen.getByText('Edit');
      fireEvent.press(editButton);
      
      expect(screen.getByTestId('edit-form')).toBeTruthy();
    });

    it('should handle save action', async () => {
      const onSave = jest.fn();
      render(
        <UserProfile 
          userId={mockUser.id} 
          editable 
          onSave={onSave} 
        />
      );
      
      const nameInput = screen.getByTestId('name-input');
      fireEvent.changeText(nameInput, 'Jane Doe');
      
      const saveButton = screen.getByText('Save');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({
          ...mockUser,
          name: 'Jane Doe',
        });
      });
    });
  });

  // Validation tests
  describe('Validation', () => {
    it('should validate email format', () => {
      render(<UserProfile userId={mockUser.id} editable />);
      
      const emailInput = screen.getByTestId('email-input');
      fireEvent.changeText(emailInput, 'invalid-email');
      
      expect(screen.getByText('Invalid email format')).toBeTruthy();
    });

    it('should prevent save with invalid data', () => {
      const onSave = jest.fn();
      render(
        <UserProfile 
          userId={mockUser.id} 
          editable 
          onSave={onSave} 
        />
      );
      
      const emailInput = screen.getByTestId('email-input');
      fireEvent.changeText(emailInput, 'invalid');
      
      const saveButton = screen.getByText('Save');
      fireEvent.press(saveButton);
      
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  // Hook tests
  describe('Hooks', () => {
    it('should fetch user data on mount', async () => {
      render(<UserProfile userId={mockUser.id} />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });
    });

    it('should refetch on userId change', async () => {
      const { rerender } = render(<UserProfile userId="123" />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });
      
      rerender(<UserProfile userId="456" />);
      
      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeTruthy();
      });
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle empty user data', () => {
      render(<UserProfile userId="empty" />);
      
      expect(screen.getByText('No user data')).toBeTruthy();
    });

    it('should handle network error', async () => {
      // Mock network failure
      jest.spyOn(global, 'fetch').mockRejectedValue(
        new Error('Network error')
      );
      
      render(<UserProfile userId={mockUser.id} />);
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeTruthy();
      });
    });

    it('should handle concurrent save attempts', async () => {
      const onSave = jest.fn();
      render(
        <UserProfile 
          userId={mockUser.id} 
          editable 
          onSave={onSave} 
        />
      );
      
      const saveButton = screen.getByText('Save');
      
      // Rapid clicks
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledTimes(1);
      });
    });
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('should match snapshot', () => {
      const tree = render(<UserProfile userId={mockUser.id} />);
      expect(tree).toMatchSnapshot();
    });
  });
});
```

**Laravel Example:**

```php
// File: UserProfileTest.php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserProfileTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_display_user_profile()
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        $response = $this->actingAs($user)
            ->get(route('profile.show', $user));

        $response->assertStatus(200);
        $response->assertSee('John Doe');
        $response->assertSee('john@example.com');
    }

    /** @test */
    public function it_can_update_user_profile()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->put(route('profile.update', $user), [
                'name' => 'Jane Doe',
                'email' => 'jane@example.com',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
        ]);
    }

    /** @test */
    public function it_validates_email_format()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->put(route('profile.update', $user), [
                'name' => 'John Doe',
                'email' => 'invalid-email',
            ]);

        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function it_requires_authentication()
    {
        $user = User::factory()->create();

        $response = $this->get(route('profile.show', $user));

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function it_prevents_unauthorized_profile_updates()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $response = $this->actingAs($otherUser)
            ->put(route('profile.update', $user), [
                'name' => 'Hacked',
            ]);

        $response->assertStatus(403);
    }
}
```

### 4. Run Tests & Check Coverage

```typescript
// Run tests
const testResults = runTests({
  file: testFile,
  coverage: true
});

// Generate coverage report
const coverageReport = {
  statements: 87.5,
  branches: 85.2,
  functions: 90.1,
  lines: 86.8
};
```

### 5. Display Results

```markdown
╔══════════════════════════════════════════════════════════╗
║  ✅ UNIT TESTS GENERATED                                 ║
╚══════════════════════════════════════════════════════════╝

## 📝 Test Files Created

1. **UserProfile.test.tsx** (245 lines)
   - 28 test cases
   - Component, hooks, utils
   - Edge cases covered

2. **useUserData.test.ts** (85 lines)
   - 8 test cases
   - Custom hook tests

3. **useUserUpdate.test.ts** (72 lines)
   - 6 test cases
   - Mutation tests

4. **utils.test.ts** (45 lines)
   - 10 test cases
   - Pure function tests

---

## 📊 Coverage Report

| Metric      | Before | After | Target | Status |
|-------------|--------|-------|--------|--------|
| Statements  | 32%    | 87.5% | 85%    | ✅ Met |
| Branches    | 28%    | 85.2% | 85%    | ✅ Met |
| Functions   | 35%    | 90.1% | 85%    | ✅ Met |
| Lines       | 31%    | 86.8% | 85%    | ✅ Met |

**Overall:** 86.8% (Target: 85%) ✅

---

## ✅ Test Results

**Total Tests:** 52  
**Passed:** 52 ✅  
**Failed:** 0  
**Skipped:** 0  

**Duration:** 3.2s  
**Suites:** 4  

---

## 📁 Files Location

```
src/components/UserProfile/
├── UserProfile.tsx
├── __tests__/
│   ├── UserProfile.test.tsx     ✅ NEW
│   ├── useUserData.test.ts      ✅ NEW
│   ├── useUserUpdate.test.ts    ✅ NEW
│   └── utils.test.ts            ✅ NEW
└── ...
```

---

## 🎯 Coverage by Feature

**UserProfile Component:** 92%  
**useUserData Hook:** 88%  
**useUserUpdate Hook:** 85%  
**Utility Functions:** 90%  

---

## 🚀 Next Steps

**Run tests locally:**
```bash
yarn test UserProfile
```

**Run with coverage:**
```bash
yarn test UserProfile --coverage
```

**Watch mode:**
```bash
yarn test UserProfile --watch
```

---

**Status:** ✅ Tests generated and passing!
```

---

## 🎯 Framework-Specific Features

### React Native (Jest + RNTL)

**Test Types:**
- Component rendering
- User interactions (press, change text)
- Navigation
- Async actions
- Hooks
- Snapshots

**Utilities:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
```

**Mock Patterns:**
```typescript
// Mock navigation
jest.mock('@react-navigation/native');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock native modules
jest.mock('react-native-camera');
```

### Laravel (PHPUnit)

**Test Types:**
- Feature tests (HTTP)
- Unit tests (classes)
- Database tests
- Authentication
- Authorization
- Validation

**Utilities:**
```php
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
```

**Assertions:**
```php
$response->assertStatus(200);
$response->assertSee('text');
$this->assertDatabaseHas('users', [...]);
```

### Vue.js (Vitest + VTU)

**Test Types:**
- Component mounting
- Props & emits
- Composables
- Slots
- Directives

**Utilities:**
```typescript
import { mount } from '@vue/test-utils';
```

---

## 📊 Coverage Targets

**Default:** 80%  
**Recommended:** 85%  
**Strict:** 90%+

**Can specify per command:**
```bash
test:unit "file.tsx" --coverage=90
```

---

## 💡 Options

### Coverage Target

```bash
test:unit "Component.tsx" --coverage=85
test:unit "Component.tsx" --coverage=90
```

### Test Type Focus

```bash
# Focus on component tests
test:unit "Component.tsx" --focus=component

# Focus on hook tests
test:unit "useHook.ts" --focus=hooks

# Focus on edge cases
test:unit "utils.ts" --focus=edge-cases
```

### Mock Generation

```bash
# Auto-generate mocks
test:unit "Component.tsx" --mocks=auto

# Specify mock strategy
test:unit "Component.tsx" --mocks=minimal
```

---

## 🔍 Coverage Analysis

After generation, shows:
- Line-by-line coverage
- Uncovered branches
- Missing test scenarios
- Suggestions for improvement

```markdown
## 🔍 Coverage Gaps

**Lines not covered:**
- Line 125: Error handling for null user
- Lines 156-160: Avatar upload edge case

**Suggestions:**
1. Add test for null user scenario
2. Test avatar upload with large file
3. Test concurrent upload attempts

**Add these tests?** (yes/no)
```

---

## ✅ Success Criteria

✅ Target coverage achieved  
✅ All tests passing  
✅ Edge cases covered  
✅ Mocks properly configured  
✅ Fast execution (< 5s)  
✅ No flaky tests  

---

## 🔗 Related Commands

```bash
test:unit "file"        # Unit tests
test:e2e "feature"      # E2E tests (separate command)
test:coverage           # Check current coverage
workflow:start "task"   # Full TDD workflow
```

---

**Command:** test:unit  
**Version:** 1.0.0  
**Added:** CCPM v4.3

