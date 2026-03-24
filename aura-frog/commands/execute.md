# Command: execute

**Purpose:** Execute implementation based on existing plan  
**Aliases:** `implement`, `execute plan`, `build`

---

## 🎯 Overview

Implement code based on a pre-existing plan, skipping Phase 1 (Understand + Design) and going straight to TDD implementation.

**Use when:** 
- Plan already created
- Design already approved
- Ready to implement

---

## 📋 Usage

```bash
# Execute from plan ID
execute refactor-userprofile-20251124-150000

# Execute from plan file
execute plans/refactor-userprofile-20251124-150000.md

# Or natural language
"Execute the UserProfile refactoring plan"
"Implement based on plan refactor-userprofile-..."
```

---

## 🔄 Execution Flow

### 1. Load Plan

```typescript
const planId = args[0];
const planFile = `plans/${planId}.md`;
const plan = loadPlan(planFile);

// Parse plan sections
const context = {
  task: plan.task,
  solution: plan.selectedSolution,
  architecture: plan.architecture,
  steps: plan.implementationSteps,
  fileStructure: plan.fileStructure,
  testStrategy: plan.testStrategy
};
```

### 2. Create Execution Workflow

```typescript
// Create lightweight workflow (skip Phase 1)
const workflowId = `execute-${planId}`;

const workflow = {
  workflow_id: workflowId,
  workflow_name: `Execute: ${plan.task}`,
  source_plan: planId,
  phases: {
    // Skip Phase 1 (planning done)
    2: { name: "Test RED", status: "pending" },
    3: { name: "Build GREEN", status: "pending" },
    4: { name: "Refactor + Review", status: "pending" },
    5: { name: "Finalize", status: "pending" }
  }
};
```

### 3. Display Execution Summary

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ EXECUTING PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Plan:** refactor-userprofile-20251124-150000  
**Task:** Refactor UserProfile component  
**Solution:** Component Split (Option A)

---

## 📋 Plan Summary

**Approach:**
- Split into 3 components
- Header + Content + Footer
- Maintain existing functionality

**Files to Create:**
- UserProfileHeader.tsx
- UserProfileContent.tsx
- UserProfileFooter.tsx
- Tests for each

**Estimated:** 3.5 hours  
**Risk:** Low

---

## 🎯 Execution Phases

✅ Phase 1: Understand + Design (SKIPPED - Plan exists)

**Starting:**
⏳ Phase 2: Test RED
   - Write failing tests

**Then:**
⏸️  Phase 3: Build GREEN
⏸️  Phase 4: Refactor + Review
⏸️  Phase 5: Finalize

---

## 🚀 Starting Phase 2: Write Tests (RED)

**Creating test files based on plan:**
- UserProfileHeader.test.tsx
- UserProfileContent.test.tsx
- UserProfileFooter.test.tsx

Ready to proceed? (yes/no)
```

### 4. Execute TDD Cycle

**Phase 2: RED (Write Failing Tests)**

```typescript
// Create test files from plan
for (const component of plan.components) {
  const testFile = `${component.path}/__tests__/${component.name}.test.tsx`;

  const testContent = generateTests(component, {
    coverage: plan.testStrategy.coverage || 85,
    scenarios: plan.testStrategy.scenarios
  });

  createFile(testFile, testContent);
}

// Run tests (should fail)
const testResults = runTests();
console.log(`✅ Created ${tests.length} test files`);
console.log(`🔴 All tests failing (RED phase) - Good!`);
```

**Phase 3: GREEN (Implement)**

```typescript
// Create components from plan
for (const component of plan.components) {
  const componentFile = `${component.path}/${component.name}.tsx`;

  const componentCode = generateComponent(component, {
    props: component.props,
    state: component.state,
    logic: component.logic
  });

  createFile(componentFile, componentCode);
}

// Run tests (should pass)
const testResults = runTests();
console.log(`✅ Created ${components.length} components`);
console.log(`🟢 All tests passing (GREEN phase) - Good!`);
```

**Phase 4: REFACTOR + REVIEW**

```typescript
// Apply best practices
for (const file of createdFiles) {
  refactorCode(file, {
    extractConstants: true,
    memoizeComponents: true,
    optimizePerformance: true,
    reduceComplexity: true
  });
}

// Verify tests still pass
const testResults = runTests();
console.log(`✅ Refactored ${files.length} files`);
console.log(`🟢 All tests still passing - Good!`);
```

### 5. Continue Through Phases

```typescript
// Phase 4: Refactor + Review (continued)
runCodeReview({
  checkLinter: true,
  checkComplexity: true,
  checkCoverage: true,
  compareWithPlan: true
});

runQAValidation({
  runAllTests: true,
  checkCoverage: true,
  verifyRequirements: true
});

// Phase 5: Finalize
generateDocumentation({
  implementationSummary: true,
  apiDocs: true,
  usageExamples: true,
  deploymentNotes: true
});
```

---

## 📊 Execution Tracking

```markdown
## ⏱️ Progress

**Phase 2: Test RED** ✅ (15 min) - Tests created
**Phase 3: Build GREEN** ✅ (45 min) - Code implemented
**Phase 4: Refactor + Review** ⏳ (in progress)

**Metrics:**
- Files created: 6 (3 components + 3 tests)
- Test coverage: 87% ✅ (target: 85%)
- Linter: 0 errors, 0 warnings ✅
- Time: 60 min / 210 min estimated

**Tokens:** 45K / 200K (22.5%)
```

---

## 🎯 Execution Options

### Fast Track (Recommended)

```bash
execute [plan-id]

# Auto-executes:
- Phase 2: Test RED
- Phase 3: Build GREEN (with approval)
- Phase 4: Refactor + Review
- Phase 5: Finalize

# Shows approval gate at Phase 3
```

### Manual Control

```bash
execute [plan-id] --manual

# Step-by-step:
1. Shows Phase 2 plan
2. Wait for: proceed
3. Execute Phase 2
4. Wait for: approve
5. Shows Phase 3 plan
... etc
```

### Dry Run

```bash
execute [plan-id] --dry-run

# Shows:
- What will be created
- Estimated time
- File list
- No actual execution
```

---

## 📄 Output Files

### Code Files

**Components:**
```
src/components/UserProfile/
├── UserProfile.tsx
├── UserProfileHeader.tsx
├── UserProfileContent.tsx
├── UserProfileFooter.tsx
└── index.ts
```

**Tests:**
```
src/components/UserProfile/__tests__/
├── UserProfile.test.tsx
├── UserProfileHeader.test.tsx
├── UserProfileContent.test.tsx
└── UserProfileFooter.test.tsx
```

### Documentation

**Execution Log:**
```
logs/workflows/execute-[plan-id]/
├── workflow-state.json
├── execution.log
├── phase-2.log
├── phase-3.log
└── phase-4.log
```

**Deliverables:**
```
logs/contexts/execute-[plan-id]/
└── deliverables/
    ├── 02-test-red/
    │   └── test-report.md
    ├── 03-build-green/
    │   └── implementation-summary.md
    ├── 04-refactor-review/
    │   └── review-report.md
    └── 05-finalize/
        └── api-docs.md
```

---

## 💡 Comparison

### workflow:start vs execute

**workflow:start "Task":**
```
Phase 1: Understand + Design ✅
Phase 2: Test RED ✅
Phase 3: Build GREEN ✅
Phase 4: Refactor + Review ✅
Phase 5: Finalize ✅

Total: 5 phases, ~3.5 hours
```

**execute [plan-id]:**
```
Phase 1: SKIPPED (plan exists)
Phase 2: Test RED ✅
Phase 3: Build GREEN ✅
Phase 4: Refactor + Review ✅
Phase 5: Finalize ✅

Total: 4 phases, ~2 hours
```

**Savings:** 1.5 hours, 1 phase

---

## 🔗 Typical Flow

### 1. Create Plan

```bash
planning "Refactor UserProfile"
# Output: plan-id
```

### 2. Review Plan

```bash
# Review in IDE
open plans/[plan-id].md

# Or request changes
planning:refine [plan-id]
```

### 3. Execute Plan

```bash
# When ready
execute [plan-id]

# Or execute immediately
planning "Task" --execute
```

---

## ⚡ Fast Mode

```bash
# Plan + Execute in one command
planning "Refactor UserProfile" --execute

# Creates plan
# Waits for approval
# Executes automatically
```

---

## 🎯 Success Criteria

✅ Plan loaded successfully  
✅ All files created as planned  
✅ Tests pass (TDD cycle)  
✅ Coverage target met  
✅ Refactor + review passed
✅ Finalization complete
✅ Documentation generated  

---

## 🔍 Execution vs Full Workflow

| Feature | workflow:start | execute |
|---------|---------------|---------|
| Planning phases | ✅ Yes | ❌ Skipped |
| Implementation | ✅ Yes | ✅ Yes |
| Validation | ✅ Yes | ✅ Yes |
| Time | ~3.5 hours | ~2 hours |
| Use case | New tasks | Pre-planned tasks |

---

**Command:** execute  
**Added:** Aura Frog v1.3

