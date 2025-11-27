# Command: refactor

**Purpose:** Refactor code with structured workflow (analyze → plan → test → refactor → verify)

**Category:** Code Improvement

**Usage:**
```
refactor <file>
refactor <description>
refactor:component <component-file>
refactor:performance <file>
```

---

## 📋 Command Execution

### Input Parameters

**Required:**
- `file` - File or component to refactor
- OR `description` - Description of refactoring task

**Optional:**
- `--type` - Refactoring type (structure, performance, readability, extract)
- `--coverage` - Target test coverage (default: maintain current)
- `--preserve-behavior` - Ensure no behavior changes (default: true)

---

## 🔄 Refactoring Workflow

### Phase 1: Code Analysis (20-30 min)

**Agents:** PM Orchestrator + Dev Expert + QA Expert

**Steps:**
1. **Read Current Code**
   - Analyze file structure
   - Identify code smells
   - Check complexity metrics
   - Review dependencies

2. **Identify Issues**
   - Long methods/components
   - Duplicated code
   - Complex conditionals
   - Performance bottlenecks
   - Poor naming
   - Hardcoded values

3. **Assess Impact**
   - Check usage across codebase (grep)
   - Identify dependent files
   - Review test coverage
   - Estimate risk level

**Deliverables:**
- `REFACTOR_ANALYSIS.md` - Complete analysis
  - Current state assessment
  - Code quality metrics
  - Issues identified (prioritized)
  - Dependency map
  - Risk assessment
  - Recommended refactorings

**Approval Gate:**
```markdown
## Code Analysis Complete

**File:** [file-path]
**Size:** [X] lines
**Complexity:** [High/Medium/Low]
**Test Coverage:** [X]%

**Issues Found:**
1. [Issue 1] - Priority: High
2. [Issue 2] - Priority: Medium
3. [Issue 3] - Priority: Low

**Recommended Refactorings:**
1. Extract [X] into separate components
2. Split into [Y] smaller files
3. Simplify [Z] logic

**Risk:** [Low/Medium/High]
**Estimated Effort:** [X] hours

Options:
- "approve" → Proceed to refactoring plan
- "reject: [reason]" → Re-analyze
```

---

### Phase 2: Refactoring Plan (30-60 min)

**Agents:** Dev Expert + QA Expert

**Steps:**
1. **Design Refactoring Strategy**
   - Choose refactoring patterns
   - Plan file structure
   - Design new component hierarchy
   - Define naming conventions

2. **Create Step-by-Step Plan**
   - Break down into small steps
   - Order by risk (low-risk first)
   - Identify breaking changes
   - Plan backward compatibility (if needed)

3. **Test Strategy**
   - Ensure existing tests still work
   - Add new tests for extracted code
   - Plan regression testing
   - Define acceptance criteria

**Deliverables:**
- `REFACTOR_PLAN.md` - Detailed refactoring plan
  - Refactoring strategy
  - New file structure
  - Step-by-step changes
  - Before/After code examples
  - Test strategy
  - Rollback plan
  - Success criteria

**Approval Gate:**
```markdown
## Refactoring Plan Complete

**Strategy:** [Approach]
**Files to Create:** [X] new files
**Files to Modify:** [Y] files
**Files to Delete:** [Z] files (optional)

**New Structure:**
```
before/
  Component.tsx (500 lines)

after/
  Component/
    index.tsx (50 lines)
    Component.logic.tsx (150 lines)
    Component.styles.tsx (50 lines)
    SubComponent1.tsx (100 lines)
    SubComponent2.tsx (100 lines)
```

**Breaking Changes:** [Yes/No]
**Backward Compatible:** [Yes/No]

Options:
- "approve" → Start TDD RED
- "modify: [changes]" → Adjust plan
```

---

### Phase 3: TDD RED - Write/Update Tests (30-45 min)

**Agents:** QA Expert + Dev Expert

**Steps:**
1. **Verify Existing Tests**
   - Run current tests
   - Document current coverage
   - Identify gaps

2. **Write Tests for New Structure**
   - Test new components/functions
   - Test extracted logic
   - Test edge cases
   - Maintain/increase coverage

3. **Verify Tests Fail (if needed)**
   - New component tests should fail
   - Existing tests should still pass
   - Document expected failures

**Deliverables:**
- Test files created/updated
- Existing tests: ✅ PASSING
- New tests: ❌ FAILING (expected)
- Coverage maintained or increased

**Approval Gate:**
```markdown
## Tests Prepared (TDD RED)

**Existing Tests:** ✅ [X] passing
**New Tests:** ❌ [Y] failing (expected)
**Coverage:** [Z]% → Target: [W]%

**Test Files:**
- [existing-test.test.tsx] - Updated
- [new-component.test.tsx] - Created
- [extracted-logic.test.ts] - Created

**Next:** Refactor code to make new tests pass

Options:
- "approve" → Start refactoring
```

---

### Phase 4: TDD GREEN - Refactor Code (1-3 hours)

**Agents:** Dev Expert

**Steps:**
1. **Extract Components**
   - Create new files
   - Move code to new components
   - Update imports/exports
   - Maintain functionality

2. **Simplify Logic**
   - Extract complex logic
   - Use custom hooks
   - Apply KISS principle
   - Remove duplication

3. **Apply Best Practices**
   - Theme consistency
   - Direct hook access
   - Smart commenting
   - Correct file extensions

4. **Run Tests Continuously**
   - Tests should pass after each step
   - Fix any broken tests immediately
   - Verify no regressions

**Deliverables:**
- Refactored code
- All tests PASS ✅
- Linter passes (0 warnings)
- Type checking passes
- Coverage maintained/improved

**Approval Gate:**
```markdown
## Refactoring Complete (TDD GREEN)

**Files Created:** [X] files
**Files Modified:** [Y] files
**Files Deleted:** [Z] files
**Lines Changed:** +[A] -[B]

**Changes:**
- ✅ Extracted [X] into [Y]
- ✅ Simplified [Z] logic
- ✅ Split [A] into [B] components
- ✅ Applied theme consistency
- ✅ Fixed [C] code smells

**Quality:**
- ✅ All tests passing ([X]/[X])
- ✅ Coverage: [Y]% (was [Z]%)
- ✅ Linter clean
- ✅ Type-safe
- ✅ No breaking changes

Options:
- "approve" → Optimize further
```

---

### Phase 5: TDD REFACTOR - Optimize (30-60 min)

**Agents:** Dev Expert

**Steps:**
1. **Performance Optimization**
   - Add memoization (useMemo, useCallback)
   - Optimize re-renders
   - Lazy load components
   - Remove unnecessary calculations

2. **Code Quality**
   - Improve naming
   - Add missing JSDoc
   - Remove dead code
   - Consolidate duplicates

3. **Final Polish**
   - Verify consistent patterns
   - Check accessibility
   - Optimize bundle size
   - Update documentation

**Deliverables:**
- Optimized code
- Tests still passing ✅
- Performance metrics improved
- Bundle size reduced (if applicable)

**Approval Gate:**
```markdown
## Optimization Complete (TDD REFACTOR)

**Improvements:**
- 🚀 Performance: [X]% faster
- 📦 Bundle size: [Y]KB → [Z]KB (-[W]%)
- 🎯 Complexity: [A] → [B]
- ✨ Readability: Improved

**Quality Metrics:**
- ✅ Tests passing
- ✅ Coverage: [X]%
- ✅ Linter: 0 warnings
- ✅ Type coverage: 100%

Options:
- "approve" → Code review
```

---

### Phase 6: Code Review (20-40 min)

**Agents:** QA Expert + Secondary Dev

**Steps:**
1. **Compare Before/After**
   - Show git diff summary
   - Highlight improvements
   - Verify no functionality lost

2. **Check Best Practices**
   - Theme consistency
   - Hook access patterns
   - Comment quality
   - File extensions
   - KISS principle

3. **Generate Review Report**
   - List remaining issues (if any)
   - Suggest further improvements
   - Verify success criteria met

**Deliverables:**
- `REFACTOR_REVIEW.md` - Code review report
- Before/After comparison
- Improvement metrics
- Remaining issues (if any)

**Approval Gate:**
```markdown
## Code Review Complete

**Overall:** ✅ Excellent / ⚠️ Good / ❌ Needs Work

**Improvements Verified:**
- ✅ Component size reduced: 500 → 150 lines
- ✅ Complexity reduced: High → Low
- ✅ Readability improved
- ✅ Best practices applied
- ✅ No functionality lost

**Issues Found:** [X] minor issues
- [ ] Consider renaming [A] to [B]
- [ ] Add JSDoc to [C]

Options:
- "approve" → QA validation
- "review:fix" → Auto-fix minor issues
```

---

### Phase 7: QA Validation (20-30 min)

**Agents:** QA Expert

**Steps:**
1. **Functional Testing**
   - Test all user flows
   - Verify behavior unchanged
   - Test edge cases
   - Test on multiple devices/browsers

2. **Performance Testing**
   - Measure load time
   - Check render performance
   - Verify memory usage
   - Test with large datasets

3. **Regression Testing**
   - Run full test suite
   - Check coverage report
   - Verify no new bugs
   - Test dependent features

**Deliverables:**
- Test results report
- Performance metrics
- Coverage report
- QA sign-off

**Approval Gate:**
```markdown
## QA Validation Complete

**Functional Testing:**
- ✅ All features working
- ✅ No behavior changes
- ✅ Edge cases covered

**Performance Testing:**
- ✅ Load time: [X]ms → [Y]ms (-[Z]%)
- ✅ Render time: [A]ms → [B]ms (-[C]%)
- ✅ Memory: [D]MB → [E]MB (-[F]%)

**Regression Testing:**
- ✅ All tests passing ([X]/[X])
- ✅ Coverage: [Y]%
- ✅ No new issues

Options:
- "approve" → Documentation
```

---

### Phase 8: Documentation (15-30 min)

**Agents:** PM Orchestrator

**Steps:**
1. **Create Refactoring Summary**
   - What was refactored
   - Why it was refactored
   - What changed
   - Impact on other code

2. **Update Code Documentation**
   - Add/update JSDoc
   - Update component docs
   - Update API documentation
   - Add migration guide (if breaking)

3. **Generate Confluence Page**
   - Format for Confluence
   - Include before/after code
   - Add metrics/improvements
   - Save local Markdown copy

**Deliverables:**
- `REFACTOR_SUMMARY.md` - Implementation summary
- `MIGRATION_GUIDE.md` - If breaking changes
- Updated code documentation
- `CONFLUENCE_REFACTOR.md` - Confluence format
- Local copies in `documents/refactors/`

**Approval Gate:**
```markdown
## Documentation Complete

**Documents Generated:**
- ✅ Refactoring Summary
- ✅ Code documentation updated
- ✅ Migration guide (if needed)
- ✅ Confluence page ready

**Files:**
- `.claude/logs/workflows/[workflow]/REFACTOR_SUMMARY.md`
- `documents/refactors/[component-name].md`

Options:
- "approve" → Notify team
```

---

### Phase 9: Notification (Auto-execute)

**Agents:** Slack Operations + Jira Operations

**Steps:**
1. **Update Jira Ticket**
   - Add refactoring details
   - Attach documentation
   - Update status
   - Link related tickets

2. **Notify Team**
   - Post to Slack channel
   - Tag relevant developers
   - Include metrics/improvements
   - Request code review (if needed)

3. **Archive Workflow**
   - Save workflow state
   - Archive context
   - Update metrics

**Deliverables:**
- Jira ticket updated
- Slack notification sent
- Workflow archived

**Completion:**
```markdown
## ✅ Refactoring Complete!

**File:** [file-path]
**Improvements:**
- 📉 Size: 500 → 150 lines (-70%)
- 🎯 Complexity: High → Low
- 🚀 Performance: +25% faster
- ✅ Test coverage: 75% → 85%

**Jira:** [PROJ-1234] - Updated
**Slack:** #engineering - Notified
**Docs:** Confluence page created

**Next Steps:**
1. Create PR for review
2. Get team approval
3. Merge to develop

**Workflow archived:** `.claude/logs/workflows/refactor-[name]-[timestamp]/`
```

---

## 🎯 Usage Examples

### Example 1: Refactor Large Component

```
User: refactor src/components/SocialMarketingCompositePost.phone.tsx

AI:
1. Analyzes component (683 lines)
2. Identifies: too large, complex logic, hardcoded values
3. Plans: split into 5 components, extract custom hook
4. Writes tests for new structure
5. Refactors code
6. Optimizes performance
7. Reviews code
8. Validates
9. Documents
```

### Example 2: Extract Custom Hook

```
User: refactor:extract-hook src/features/auth/Login.tsx

AI:
1. Analyzes Login component
2. Identifies reusable logic
3. Plans to extract useLoginLogic hook
4. Creates tests for hook
5. Extracts logic to hook
6. Updates component to use hook
7. Verifies tests pass
... continues
```

### Example 3: Performance Refactoring

```
User: refactor:performance src/screens/Dashboard.tsx

AI:
1. Analyzes performance issues
2. Identifies: unnecessary re-renders, missing memoization
3. Plans optimization strategy
4. Adds performance tests
5. Applies useMemo, useCallback, React.memo
6. Measures improvement (+40% faster)
... continues
```

---

## 🔧 Refactoring Types

### Structure Refactoring

```bash
refactor:structure <file>
# Or
refactor <file> --type=structure
```

**Focus:**
- Split large files
- Extract components
- Organize file structure
- Improve modularity

### Performance Refactoring

```bash
refactor:performance <file>
```

**Focus:**
- Add memoization
- Optimize re-renders
- Reduce bundle size
- Lazy loading

### Readability Refactoring

```bash
refactor:readability <file>
```

**Focus:**
- Improve naming
- Simplify logic
- Add comments
- Remove duplication

### Extract Refactoring

```bash
refactor:extract-hook <file>
refactor:extract-component <file>
refactor:extract-util <file>
```

**Focus:**
- Extract custom hooks
- Extract reusable components
- Extract utility functions
- Reduce coupling

---

## 🎨 Command Options

### Preserve Behavior (Default: true)

```bash
refactor <file> --preserve-behavior=true
```

**Effect:**
- ✅ No functionality changes
- ✅ Only structure/quality improvements
- ✅ All tests must still pass

### Allow Breaking Changes

```bash
refactor <file> --breaking-changes
```

**Effect:**
- ⚠️ May change API/behavior
- ⚠️ Creates migration guide
- ⚠️ Requires explicit approval

### Coverage Target

```bash
refactor <file> --coverage=90
```

**Effect:** Ensure test coverage reaches 90% after refactoring

### Quick Refactor

```bash
refactor:quick <file>
```

**Effect:**
- Skip approval for Phase 1-2
- Faster for simple refactors
- Still enforces TDD

---

## 📊 Success Criteria

**Refactoring succeeds when:**
- ✅ Code quality improved
- ✅ Complexity reduced
- ✅ All tests passing
- ✅ No functionality lost
- ✅ Coverage maintained/improved
- ✅ Performance maintained/improved
- ✅ Best practices applied
- ✅ Documented
- ✅ Team notified

---

## 🚨 Refactoring Patterns

### 1. Extract Component

**Before:**
```tsx
function Dashboard() {
  // 500 lines
  return (
    <View>
      {/* Complex JSX */}
    </View>
  );
}
```

**After:**
```tsx
function Dashboard() {
  return (
    <View>
      <DashboardHeader />
      <DashboardContent />
      <DashboardFooter />
    </View>
  );
}
```

### 2. Extract Custom Hook

**Before:**
```tsx
function Component() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // ... complex logic
}
```

**After:**
```tsx
function Component() {
  const logic = useComponentLogic();
  return <View>{/* Use logic */}</View>;
}

function useComponentLogic() {
  // Extracted logic
  return { data, loading, handleAction };
}
```

### 3. Simplify Conditionals

**Before:**
```tsx
if (user && user.isActive && user.permissions && user.permissions.includes('admin')) {
  // ...
}
```

**After:**
```tsx
const isAdmin = user?.isActive && user?.permissions?.includes('admin');
if (isAdmin) {
  // ...
}
```

---

## 🔄 Integration with Workflow

**Can be used:**
- ✅ Standalone (refactor existing code)
- ✅ During Phase 5c (refactor new code)
- ✅ After Phase 6 (refactor based on review)
- ✅ Continuous improvement

**Workflow State:**
- Creates workflow ID: `refactor-[description]-[timestamp]`
- Saved in: `.claude/logs/workflows/refactor-[id]/`
- Independent workflow

---

## 📝 Templates Used

- `REFACTOR_ANALYSIS.md` - Code analysis template
- `REFACTOR_PLAN.md` - Refactoring plan template
- `REFACTOR_SUMMARY.md` - Implementation summary
- `REFACTOR_REVIEW.md` - Code review report
- `MIGRATION_GUIDE.md` - Breaking changes guide
- `CONFLUENCE_REFACTOR.md` - Confluence format

---

## ✅ Command Complete

**Workflow:** 9 phases (Refactoring-specific)  
**Duration:** 2-4 hours (typical)  
**Enforces:** TDD workflow, behavior preservation  
**Output:** Improved code + documentation  
**Integration:** Jira + Slack + Confluence

