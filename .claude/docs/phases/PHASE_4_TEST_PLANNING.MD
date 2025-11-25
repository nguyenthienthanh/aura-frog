# Phase 4: Test Planning - Detailed Guidelines

**Phase:** 4/9 - Test Planning  
**Duration:** 2-4 hours  
**Agents:** qa-automation, dev agents  
**Prerequisites:** Phase 3 approved  
**Deliverables:** test_plan.md, test_cases.md, coverage_goals.md

---

## 🎯 Phase Objectives

1. **Define** test strategy (unit, integration, E2E)
2. **Write** detailed test cases for all scenarios
3. **Set** coverage goals (default 80%)
4. **Plan** automation approach
5. **Identify** test data and mocks needed

---

## 📋 Test Levels

### Level 1: Unit Tests (60% of tests)

**Scope:** Individual functions, hooks, utils

**Examples:**
```typescript
// Utils
- imageCompression.ts → compress(), resize(), validate()
- validation.ts → validateText(), validateImage()

// Hooks
- useSocialMediaShare.tsx → All states and transitions
- useImagePicker.tsx → Pick, compress, error handling
- usePlatformAuth.tsx → Token refresh, validation

// Services
- ShareService.ts → All public methods
- FacebookService.ts → API calls, error handling
- ImageService.ts → Compression logic
```

**Tools:**
- Jest
- React Testing Library (hooks)
- Mock functions

---

### Level 2: Integration Tests (30% of tests)

**Scope:** Component interactions, API integration

**Examples:**
```typescript
// Component Integration
- ShareModal + ContentEditor + API
- ImagePicker + ImageService
- PlatformSelector + Auth

// API Integration
- shareApi.ts → Real API calls (mocked backend)
- Token refresh flow
- Error handling across layers
```

**Tools:**
- Jest
- React Testing Library
- Mock Service Worker (MSW)

---

### Level 3: E2E Tests (10% of tests)

**Scope:** Full user journeys

**Examples:**
```typescript
// Critical Paths
- Complete share flow (pick image, enter text, submit)
- Facebook OAuth flow
- Error recovery (network failure → retry → success)
- Offline mode (save draft → go online → share)
```

**Tools:**
- Detox (React Native E2E)
- Appium (alternative)

---

## 📝 Test Cases

### Test Case Template

```markdown
## TC-001: Share to Facebook with Text Only

**Priority:** High  
**Type:** Integration  
**Preconditions:**
- User logged in
- Facebook token valid

**Steps:**
1. Open share modal
2. Select "Facebook" platform
3. Enter text "Test post" (10 chars)
4. Tap "Share" button

**Expected Results:**
- Loading indicator shown
- API call made with correct payload
- Success modal shown
- Modal closes after 3s
- Share recorded in history

**Test Data:**
```typescript
{
  platform: 'facebook',
  content: {
    text: 'Test post',
    imageUri: null,
  }
}
```

**Coverage:**
- ✅ Happy path
- ✅ API integration
- ✅ UI feedback
```

---

### Critical Test Cases (Must Have)

```markdown
## Happy Paths

TC-001: Share to Facebook (text only)
TC-002: Share to Facebook (text + image)
TC-003: Share to Instagram Stories
TC-004: Switch platform mid-flow
TC-005: Edit draft and share

---

## Error Scenarios

TC-101: Network error during share
TC-102: Token expired (auto-refresh)
TC-103: Rate limit exceeded
TC-104: Image upload fails
TC-105: Invalid image format
TC-106: Text exceeds 500 chars
TC-107: Permission denied (gallery)

---

## Edge Cases

TC-201: Share with 0 chars (empty text)
TC-202: Share with exactly 500 chars
TC-203: Share with emoji/unicode
TC-204: Share with very large image (50MB)
TC-205: Share while offline
TC-206: Close modal while submitting
TC-207: App backgrounded during share
TC-208: Multiple rapid taps on Share button

---

## Validation

TC-301: Min text length (0)
TC-302: Max text length (500)
TC-303: Special characters
TC-304: Image size limits
TC-305: Image format validation (JPEG, PNG, HEIC)

---

## Performance

TC-401: Image compression time (< 2s)
TC-402: Share completion time (< 5s on 4G)
TC-403: Modal open animation (300ms)
TC-404: Memory usage (< 100MB increase)
```

---

## 🎯 Coverage Goals

### Overall Target: 80%

```yaml
Statements: 80%
Branches: 75%
Functions: 80%
Lines: 80%
```

### By Module:

```yaml
Utils: 95%
  - imageCompression.ts: 100%
  - validation.ts: 100%
  - formatters.ts: 90%

Hooks: 85%
  - useSocialMediaShare.tsx: 90%
  - useImagePicker.tsx: 85%
  - usePlatformAuth.tsx: 80%

Services: 85%
  - ShareService.ts: 90%
  - FacebookService.ts: 85%
  - ImageService.ts: 90%

Components: 70%
  - ShareModal.tsx: 75%
  - ContentEditor.tsx: 70%
  - PlatformSelector.tsx: 80%

API: 90%
  - shareApi.ts: 95%
  - tokenRefresh.ts: 90%
```

---

## 🔧 Test Tools & Setup

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

### Test Setup

```typescript
// jest.setup.js
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve()),
  getGenericPassword: jest.fn(() => Promise.resolve({ password: 'token' })),
  resetGenericPassword: jest.fn(() => Promise.resolve()),
}));

// Mock Image Picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// Mock Facebook SDK
jest.mock('react-native-fbsdk-next', () => ({
  GraphRequest: jest.fn(),
  GraphRequestManager: jest.fn(),
  LoginManager: {
    logInWithPermissions: jest.fn(),
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn(),
  },
}));
```

---

## 📊 Test Data & Mocks

### Mock Data

```typescript
// __mocks__/shareData.ts
export const mockUser = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  facebookConnected: true,
  instagramConnected: true,
};

export const mockShareContent = {
  text: 'Just closed a big deal! #CompanyLife #Success',
  imageUri: 'file:///path/to/image.jpg',
};

export const mockFacebookResponse = {
  id: 'fb_post_123',
  postUrl: 'https://facebook.com/posts/123',
};

export const mockImage = {
  uri: 'file:///path/to/image.jpg',
  width: 1080,
  height: 1080,
  size: 2048000, // 2MB
  type: 'image/jpeg',
};
```

### MSW Handlers

```typescript
// __mocks__/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Upload image
  rest.post('/api/v1/social/upload-image', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          imageUrl: 'https://cdn.example.com/images/abc123.jpg',
          imageId: 'img_abc123',
        },
      })
    );
  }),

  // Share to platform
  rest.post('/api/v1/social/share', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          shareId: 'share_xyz789',
          platformPostId: 'fb_123456',
          postedAt: '2025-11-23T10:30:00Z',
        },
      })
    );
  }),

  // Error: Network failure
  rest.post('/api/v1/social/share-error', (req, res, ctx) => {
    return res.networkError('Network request failed');
  }),

  // Error: Rate limit
  rest.post('/api/v1/social/share-rate-limit', (req, res, ctx) => {
    return res(
      ctx.status(429),
      ctx.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
        },
      })
    );
  }),
];
```

---

## 👥 Cross-Review Process

**IMPORTANT:** Before presenting to user, test plan must be reviewed by dev agents.

### Review Workflow

```markdown
Step 1: QA Agent completes test plan
   ↓
Step 2: Dev Agent Implementation Feasibility Review (15 min)
   ↓
Step 3: QA Agent updates test plan with feedback
   ↓
Step 4: Present to User for approval
```

### Dev Implementation Feasibility Review

**Dev Agent reviews for:**
- ✅ Test cases match implementation
- ✅ Test scenarios are comprehensive
- ✅ Edge cases are covered
- ✅ Tests can be written as planned
- ✅ Mock strategy is correct
- ✅ Coverage target is achievable
- ✅ TDD compatibility (tests can fail/pass correctly)
- ⚠️ Implementation concerns

**Output:** Test plan implementation review (see `.claude/rules/cross-review-workflow.md`)

### Consolidated Feedback Format

```markdown
╔══════════════════════════════════════════════════════════╗
║  Phase 4: Test Planning - Review Complete                ║
╚══════════════════════════════════════════════════════════╝

## Review Summary

**Test Plan Author:** qa-automation  
**Reviewer:** mobile-react-native  
**Status:** ✅ Approved with suggestions

---

### Dev Implementation Review (mobile-react-native)
**Status:** ✅ Approved  
**Key Points:**
- Test cases accurately reflect implementation
- All critical paths are covered
- Mock strategy with MSW is correct
- Coverage target of 80% is achievable
- TDD workflow will work well

**Suggestions:**
- Add test for offline mode (edge case)
- Include test for token refresh scenario
- Mock Linking API for deep link tests

**TDD Compatibility:**
- ✅ Tests can be written first
- ✅ Tests will fail correctly (no code yet)
- ✅ Tests will pass when implemented
- ✅ Refactoring won't break tests

**Concerns:** None major

---

## Consolidated Feedback

**Updates Made:**
- ✅ Added offline mode test case
- ✅ Added token refresh test case
- ✅ Added Linking API mock setup
- ✅ Updated test fixtures

**Acknowledged:**
- Dev confirmed test approach is sound
- TDD workflow is validated
- Ready for RED phase

---

## Updated Test Plan

[QA Agent updates test plan with dev feedback]

✋ **APPROVAL REQUIRED**: Phase 4 Complete with Dev Review

**Deliverables:**
- ✅ test_plan.md (updated)
- ✅ test_cases.md (43 test cases - added 3)
- ✅ coverage_goals.md
- ✅ mock_data.ts
- ✅ msw_handlers.ts
- ✅ Dev Implementation Review

**Next Phase:** TDD Implementation - Phase 5a (RED)

**Options:**
- "approve" → Start writing failing tests (TDD RED)
- "reject: [reason]" → Revise test plan
- "modify: [changes]" → Make specific adjustments
```

---

## ✅ Approval Gate

```markdown
📋 PHASE 4 COMPLETE: Test Planning with Dev Review

## Summary

**Test Cases:** 43 test cases defined (added 3 after dev review)
**Coverage Goal:** 80% (configurable)
**Test Levels:** Unit (60%), Integration (30%), E2E (10%)
**Tools:** Jest, RTL, MSW, Detox

## Test Strategy

✅ TDD approach (tests before code)
✅ Mock external dependencies
✅ Real API integration tests (MSW)
✅ E2E for critical paths
✅ Performance tests included
✅ **Dev-reviewed and validated**

## Coverage Breakdown

- Utils: 95% target
- Hooks: 85% target
- Services: 85% target
- Components: 70% target
- API: 90% target

## Deliverables Generated

- [x] test_plan.md (comprehensive strategy)
- [x] test_cases.md (43 test cases)
- [x] coverage_goals.md (by module)
- [x] mock_data.ts (test fixtures)
- [x] msw_handlers.ts (API mocks)
- [x] **Dev implementation review**

---

👉 **Ready to proceed to Phase 5: Implementation (TDD)?**

Type:
- "approve" to start RED phase (write failing tests)
- "reject" + feedback
- "clarify" + questions
```

---

**Phase 4 Complete! Ready for Phase 5: TDD Implementation** ⚡
