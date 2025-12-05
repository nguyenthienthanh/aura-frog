# Command: test:document

**Purpose:** Generate comprehensive test documentation from requirements or ticket

**Category:** Testing & Documentation

**Usage:**
```
test:document <description>
test:document <JIRA-ID>
test:document <requirement-file>
```

---

## 📋 Command Execution

### Input Parameters

**Required:**
- `description` - Description of requirement to test
- OR `JIRA-ID` - Jira ticket ID (e.g., PROJ-1234)
- OR `requirement-file` - Path to requirement document

**Optional:**
- `--type` - Test document type (functional, integration, e2e, performance, security)
- `--format` - Output format (markdown, confluence, pdf)
- `--coverage` - Target coverage (default: 80%)
- `--framework` - Test framework (jest, vitest, cypress, playwright, phpunit)

---

## 🔄 Test Documentation Workflow

### Phase 1: Requirement Analysis (15-30 min)

**Agents:** QA Expert + PM Orchestrator + Dev Expert

**Steps:**
1. **Read Requirement**
   - Fetch from Jira (if ticket ID)
   - Read from file (if file path)
   - Parse from description (if text)

2. **Extract Test Scenarios**
   - Identify user stories
   - Extract acceptance criteria
   - Identify edge cases
   - List non-functional requirements

3. **Categorize Tests**
   - Functional tests
   - Integration tests
   - E2E tests
   - Performance tests
   - Security tests

**Deliverables:**
- `TEST_REQUIREMENTS.md` - Requirement analysis
  - User stories mapped to tests
  - Acceptance criteria
  - Test scenarios (positive/negative)
  - Edge cases
  - Dependencies

**Approval Gate:**
```markdown
## Requirement Analysis Complete

**Feature:** User Authentication
**User Stories:** 3
**Acceptance Criteria:** 8
**Test Scenarios:** 15 (10 positive, 5 negative)

**Breakdown:**
- Unit tests: 8
- Integration tests: 4
- E2E tests: 3

**Coverage Target:** 80%

Options:
- "approve" → Generate test cases
- "modify: [changes]" → Adjust scope
```

---

### Phase 2: Test Case Generation (30-60 min)

**Agents:** QA Expert

**Steps:**
1. **Generate Test Cases**
   - For each scenario
   - Positive test cases
   - Negative test cases
   - Edge case tests
   - Error handling tests

2. **Define Test Data**
   - Valid inputs
   - Invalid inputs
   - Boundary values
   - Special characters
   - Mock data requirements

3. **Create Test Steps**
   - Preconditions
   - Test steps (detailed)
   - Expected results
   - Postconditions

**Deliverables:**
- `TEST_CASES.md` - Complete test cases
  - Test case ID and name
  - Description and objective
  - Preconditions
  - Test steps (numbered)
  - Test data
  - Expected results
  - Priority (P0, P1, P2, P3)
  - Type (positive, negative, edge)

**Example Test Case:**
```markdown
### TC-001: Login with Valid Credentials

**Objective:** Verify user can login with valid email and password

**Priority:** P0 (Critical)
**Type:** Positive
**Category:** Functional

**Preconditions:**
- User exists in database
- User is not already logged in
- App is in logged-out state

**Test Data:**
- Email: test.user@company.com
- Password: ValidPass123!

**Test Steps:**
1. Navigate to login screen
2. Enter valid email in email field
3. Enter valid password in password field
4. Tap "Login" button

**Expected Results:**
1. ✅ Email field accepts input
2. ✅ Password field shows masked characters
3. ✅ Login button becomes enabled
4. ✅ Loading indicator appears
5. ✅ User is redirected to home screen
6. ✅ Welcome message displays user name
7. ✅ Auth token is stored in secure storage

**Postconditions:**
- User is logged in
- Session is active
- Auth token is valid

**Notes:**
- Test on both iOS and Android
- Verify token expiry handling
```

**Approval Gate:**
```markdown
## Test Cases Generated

**Total Test Cases:** 15
- Functional: 10
- Integration: 4
- E2E: 1

**Priority Breakdown:**
- P0 (Critical): 5
- P1 (High): 6
- P2 (Medium): 3
- P3 (Low): 1

**Coverage:**
- User stories: 100%
- Acceptance criteria: 100%
- Edge cases: 80%

Options:
- "approve" → Create test matrix
```

---

### Phase 3: Test Matrix Creation (15-30 min)

**Agents:** QA Expert

**Steps:**
1. **Create Requirements Traceability Matrix (RTM)**
   - Map requirements to test cases
   - Track coverage per requirement
   - Identify gaps

2. **Create Test Execution Matrix**
   - Test case ID
   - Test environment
   - Test data set
   - Execution method (manual/automated)
   - Assigned tester

3. **Create Test Coverage Matrix**
   - Features vs test cases
   - Platforms (iOS, Android, Web)
   - Browsers (if web)
   - Devices (phone, tablet)

**Deliverables:**
- `TEST_MATRIX.md` - Traceability and coverage matrices

**Requirements Traceability Matrix:**
```markdown
| Requirement ID | Description | Test Cases | Status | Coverage |
|----------------|-------------|------------|--------|----------|
| REQ-001 | User login | TC-001, TC-002, TC-003 | ✅ | 100% |
| REQ-002 | Password reset | TC-004, TC-005 | ✅ | 100% |
| REQ-003 | Remember me | TC-006 | ✅ | 100% |
```

**Test Coverage Matrix:**
```markdown
| Feature | iOS Phone | iOS Tablet | Android Phone | Android Tablet | Coverage |
|---------|-----------|------------|---------------|----------------|----------|
| Login | TC-001 ✅ | TC-001 ✅ | TC-001 ✅ | TC-001 ✅ | 100% |
| Logout | TC-007 ✅ | TC-007 ✅ | TC-007 ✅ | TC-007 ✅ | 100% |
```

**Approval Gate:**
```markdown
## Test Matrix Complete

**Requirements Coverage:** 100%
**Platform Coverage:**
- iOS: 100%
- Android: 100%

**Gaps Identified:** None

Options:
- "approve" → Generate automated tests
```

---

### Phase 4: Automated Test Code Generation (30-60 min)

**Agents:** QA Expert + Dev Expert

**Steps:**
1. **Generate Unit Test Code**
   - Test file structure
   - Setup/teardown
   - Test functions
   - Assertions
   - Mocks

2. **Generate Integration Test Code**
   - API test setup
   - Database fixtures
   - Integration assertions

3. **Generate E2E Test Code**
   - Page objects
   - User flow tests
   - Assertions
   - Screenshots

**Deliverables:**
- Test code files (`.test.ts`, `.spec.ts`, `.test.tsx`)
- Test helpers and utilities
- Mock data files
- Fixtures

**Example Generated Test:**
```typescript
// src/features/auth/__tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Login } from '../Login';
import { authApi } from '@api/authApi';

jest.mock('@api/authApi');

describe('Login', () => {
  describe('TC-001: Login with Valid Credentials', () => {
    it('should login user with valid email and password', async () => {
      // Arrange
      const mockUser = { id: '1', email: 'test@company.com', name: 'Test User' };
      (authApi.login as jest.Mock).mockResolvedValue({ user: mockUser, token: 'abc123' });
      
      render(<Login />);
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');
      
      // Act
      fireEvent.changeText(emailInput, 'test@company.com');
      fireEvent.changeText(passwordInput, 'ValidPass123!');
      fireEvent.press(loginButton);
      
      // Assert
      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({
          email: 'test@company.com',
          password: 'ValidPass123!'
        });
      });
      
      // Verify navigation (mocked)
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
  
  describe('TC-002: Login with Invalid Credentials', () => {
    it('should show error message for invalid credentials', async () => {
      // Test implementation...
    });
  });
});
```

**Approval Gate:**
```markdown
## Automated Tests Generated

**Test Files Created:** 5
- Login.test.tsx
- PasswordReset.test.tsx
- AuthAPI.integration.test.ts
- LoginFlow.e2e.ts
- AuthHelpers.test.ts

**Total Test Count:** 15
**Lines of Code:** ~800

Options:
- "approve" → Create test plan document
```

---

### Phase 5: Test Plan Document (20-40 min)

**Agents:** QA Expert + PM Orchestrator

**Steps:**
1. **Create Test Plan**
   - Objective and scope
   - Test strategy
   - Test approach
   - Resources and schedule
   - Risk and mitigation

2. **Define Test Environment**
   - Hardware requirements
   - Software requirements
   - Test data requirements
   - Tools and frameworks

3. **Create Execution Schedule**
   - Test phases
   - Timeline
   - Dependencies
   - Milestones

**Deliverables:**
- `TEST_PLAN.md` - Comprehensive test plan document

**Test Plan Structure:**
```markdown
# Test Plan: User Authentication

## 1. Executive Summary
Brief overview of testing scope and objectives.

## 2. Test Objectives
- Verify all login functionality works as specified
- Ensure 80%+ code coverage
- Validate on iOS and Android
- Test error handling and edge cases

## 3. Scope

### In Scope
- Login with email/password
- Password reset flow
- Remember me functionality
- Session management
- Error handling

### Out of Scope
- Social login (separate feature)
- Biometric authentication (phase 2)

## 4. Test Strategy

### Test Levels
- **Unit Tests**: 60% of tests
- **Integration Tests**: 25% of tests
- **E2E Tests**: 15% of tests

### Test Types
- Functional testing
- Security testing
- Performance testing
- Usability testing

### Test Approach
- Test-Driven Development (TDD)
- Automated testing where possible
- Manual testing for UX verification

## 5. Test Environment

### Hardware
- iPhone 13 (iOS 16)
- iPad Pro (iOS 16)
- Samsung Galaxy S22 (Android 13)
- Samsung Tab S8 (Android 13)

### Software
- Jest 29.x
- React Native Testing Library
- Detox 20.x
- Postman (API testing)

### Test Data
- 10 test users (various roles)
- Mock API responses
- Edge case datasets

## 6. Test Schedule

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Test Planning | 2 days | 2025-11-25 | 2025-11-26 |
| Test Case Design | 3 days | 2025-11-27 | 2025-11-29 |
| Test Automation | 5 days | 2025-11-30 | 2025-12-04 |
| Test Execution | 3 days | 2025-12-05 | 2025-12-07 |
| Bug Fixing | 2 days | 2025-12-08 | 2025-12-09 |
| Regression | 2 days | 2025-12-10 | 2025-12-11 |

## 7. Entry and Exit Criteria

### Entry Criteria
- ✅ Requirements finalized
- ✅ Test environment ready
- ✅ Test data available
- ✅ Code complete

### Exit Criteria
- ✅ All P0/P1 tests pass
- ✅ 80%+ code coverage
- ✅ No critical bugs
- ✅ Regression tests pass

## 8. Test Deliverables
- Test plan document
- Test cases
- Test scripts (automated)
- Test execution reports
- Bug reports
- Test summary report

## 9. Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API delays | High | Medium | Use mock API |
| Device unavailable | Medium | Low | Use simulators |
| Test data issues | Medium | Medium | Prepare backups |

## 10. Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | [Name] | [Date] | [Signature] |
| Dev Lead | [Name] | [Date] | [Signature] |
| PM | [Name] | [Date] | [Signature] |
```

**Approval Gate:**
```markdown
## Test Plan Complete

**Document:** TEST_PLAN.md (15 pages)
**Sections:** 10
**Test Cases Mapped:** 15
**Schedule:** 15 days

Options:
- "approve" → Generate final documentation
```

---

### Phase 6: Final Documentation Assembly (15-30 min)

**Agents:** QA Expert + PM Orchestrator

**Steps:**
1. **Combine All Documents**
   - Test requirements
   - Test cases
   - Test matrix
   - Test plan
   - Automated test code references

2. **Format for Output**
   - Markdown (default)
   - Confluence markup
   - PDF export format

3. **Add Metadata**
   - Document version
   - Author information
   - Review status
   - Approval signatures

**Deliverables:**
- `COMPLETE_TEST_DOCUMENT.md` - Master test document
- `CONFLUENCE_TEST_DOCUMENT.md` - Confluence format
- Test code files in appropriate directories

**Complete Test Document Structure:**
```markdown
# Complete Test Documentation: User Authentication

**Version:** 1.0  
**Date:** 2025-11-25  
**Author:** Aura Frog QA Agent  
**Status:** Ready for Review

---

## Table of Contents
1. [Test Requirements](#test-requirements)
2. [Test Cases](#test-cases)
3. [Test Matrix](#test-matrix)
4. [Automated Tests](#automated-tests)
5. [Test Plan](#test-plan)
6. [Appendices](#appendices)

---

## 1. Test Requirements
[Full TEST_REQUIREMENTS.md content]

## 2. Test Cases
[Full TEST_CASES.md content]

## 3. Test Matrix
[Full TEST_MATRIX.md content]

## 4. Automated Tests
### 4.1 Unit Tests
[List of test files with code samples]

### 4.2 Integration Tests
[List of test files with code samples]

### 4.3 E2E Tests
[List of test files with code samples]

## 5. Test Plan
[Full TEST_PLAN.md content]

## 6. Appendices
### Appendix A: Test Data
### Appendix B: Environment Setup
### Appendix C: Glossary
```

**Approval Gate:**
```markdown
## Complete Test Documentation Ready

**Master Document:** 50+ pages
**Test Cases:** 15
**Automated Tests:** 5 files
**Coverage:** 80%+

**Files Generated:**
- `.claude/logs/documents/tests/COMPLETE_TEST_DOCUMENT.md`
- `.claude/logs/documents/tests/CONFLUENCE_TEST_DOCUMENT.md`
- `src/**/__tests__/*.test.tsx` (5 files)

Options:
- "approve" → Publish and notify
```

---

### Phase 7: Publish and Notify (Auto-execute)

**Agents:** Confluence Operations + Slack Operations

**Steps:**
1. **Publish to Confluence**
   - Create page in test space
   - Format for Confluence
   - Add labels and metadata
   - Link to Jira ticket

2. **Notify Team**
   - Post to Slack QA channel
   - Tag relevant team members
   - Include summary and links

3. **Archive Locally**
   - Save all documents
   - Create backup
   - Update workflow log

**Completion:**
```markdown
## ✅ Test Documentation Complete!

**Feature:** User Authentication
**Test Cases:** 15
**Coverage:** 85%
**Automated Tests:** 5 files

**Published:**
- Confluence: https://company.atlassian.net/wiki/spaces/QA/pages/123456
- Local: .claude/logs/documents/tests/user-authentication-test-doc.md

**Slack:** #qa-team notified

**Next Steps:**
1. Review test plan with QA lead
2. Execute unit tests
3. Run integration tests
4. Execute E2E tests
5. Generate test report

**Workflow archived:** `.claude/logs/workflows/test-document-[name]-[timestamp]/`
```

---

## 🎯 Usage Examples

### Example 1: From Description

```
User: test:document "User can login with email and password, reset password if forgotten, and stay logged in with remember me"

AI:
Phase 1: Analyzing requirement... ✅
- 3 user stories identified
- 8 acceptance criteria
- 15 test scenarios

Phase 2: Generating test cases... ✅
- TC-001 to TC-015 created
- Positive, negative, edge cases covered

Phase 3: Creating test matrix... ✅
- Requirements 100% covered
- iOS and Android covered

Phase 4: Generating automated tests... ✅
- 5 test files created
- 800+ lines of test code

Phase 5: Creating test plan... ✅
- 15-page test plan document

Phase 6: Assembling final doc... ✅
- Master document ready (50+ pages)

✅ Complete test documentation generated!
```

### Example 2: From Jira Ticket

```
User: test:document PROJ-1234

AI:
Fetching PROJ-1234 from Jira... ✅

Feature: User Profile Management
Requirements:
- Edit profile information
- Upload profile picture
- Change password
- Privacy settings

[Continues with full workflow...]
```

### Example 3: From Requirement File

```
User: test:document docs/requirements/user-auth.md

AI:
Reading requirements from file... ✅

[Analyzes Markdown file and generates test documentation]
```

---

## 🎨 Command Options

### Test Type

```bash
test:document <description> --type=functional
test:document <description> --type=integration
test:document <description> --type=e2e
test:document <description> --type=performance
test:document <description> --type=security
```

### Output Format

```bash
test:document <description> --format=markdown
test:document <description> --format=confluence
test:document <description> --format=pdf
```

### Coverage Target

```bash
test:document <description> --coverage=90
```

### Framework

```bash
test:document <description> --framework=jest
test:document <description> --framework=vitest
test:document <description> --framework=cypress
test:document <description> --framework=playwright
test:document <description> --framework=phpunit
```

---

## 📊 Deliverables

### Documents Generated
1. `TEST_REQUIREMENTS.md` - Requirement analysis
2. `TEST_CASES.md` - Detailed test cases
3. `TEST_MATRIX.md` - Traceability matrix
4. `TEST_PLAN.md` - Complete test plan
5. `COMPLETE_TEST_DOCUMENT.md` - Master document
6. `CONFLUENCE_TEST_DOCUMENT.md` - Confluence format

### Code Generated
1. Unit test files (`*.test.tsx`)
2. Integration test files (`*.integration.test.ts`)
3. E2E test files (`*.e2e.ts`)
4. Test helpers and utilities
5. Mock data files

### Total Output
- **Documents:** 50-100 pages
- **Test Cases:** 10-30 (depends on complexity)
- **Automated Tests:** 5-15 files
- **Coverage:** 80%+ guaranteed

---

## ✅ Success Criteria

**Test documentation succeeds when:**
- ✅ All requirements mapped to test cases
- ✅ Test cases cover positive, negative, edge cases
- ✅ Traceability matrix shows 100% coverage
- ✅ Automated tests generated and executable
- ✅ Test plan complete with schedule
- ✅ Documentation published to Confluence
- ✅ Team notified

---

## 🔄 Integration with Workflow

**Can be used:**
- ✅ Standalone (generate test docs for any requirement)
- ✅ During Phase 4 (Test Planning)
- ✅ Before development (TDD approach)
- ✅ For existing features (add test coverage)

**Workflow State:**
- Creates workflow ID: `test-document-[name]-[timestamp]`
- Saved in: `.claude/logs/workflows/test-document-[id]/`

---

**📝 Generate complete test documentation in minutes, not days! 🚀✨**

