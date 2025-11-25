# Command: planning

**Purpose:** Create a comprehensive plan for a task without starting full workflow  
**Aliases:** `plan`, `create plan`, `brainstorm plan`

---

## 🎯 Overview

Generate a detailed technical plan including:
- Problem analysis
- Solution options
- Technical approach
- Implementation steps
- Risk assessment

**Use when:** You need planning/design before committing to full workflow

---

## 📋 Usage

```bash
# Create plan
planning "Refactor UserProfile component"

# Or natural language
"Create a plan for adding authentication"
"Help me plan the dashboard refactoring"
```

---

## 🔄 Execution Flow

### 1. Gather Context

```typescript
// Load project context
const projectContext = loadProjectContext();

// Analyze existing code (if applicable)
const codeAnalysis = analyzeExistingCode(task);

// Identify constraints
const constraints = {
  time: estimateEffort(task),
  complexity: assessComplexity(task),
  dependencies: findDependencies(task)
};
```

### 2. Brainstorm Solutions

```markdown
## Problem Statement

**Task:** [User's request]

**Current State:**
- What exists today
- Pain points
- Limitations

**Desired State:**
- What we want to achieve
- Success criteria
- Requirements

---

## Solution Options

### Option A: [Approach 1]

**Description:** [How it works]

**Pros:**
- ✅ [Advantage 1]
- ✅ [Advantage 2]

**Cons:**
- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]

**Effort:** Low | Medium | High  
**Risk:** Low | Medium | High  
**Impact:** Low | Medium | High

### Option B: [Approach 2]

**Description:** [How it works]

**Pros:**
- ✅ [Advantage 1]
- ✅ [Advantage 2]

**Cons:**
- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]

**Effort:** Low | Medium | High  
**Risk:** Low | Medium | High  
**Impact:** Low | Medium | High

### Option C: [Approach 3]

**Description:** [How it works]

**Pros:**
- ✅ [Advantage 1]

**Cons:**
- ❌ [Disadvantage 1]

**Effort:** Low | Medium | High  
**Risk:** Low | Medium | High  
**Impact:** Low | Medium | High

---

## Decision Matrix

| Solution | Impact | Effort | Risk | Maintainability | Score |
|----------|--------|--------|------|-----------------|-------|
| Option A | 9      | 3      | 2    | 8               | 22    |
| Option B | 7      | 5      | 4    | 6               | 18    |
| Option C | 6      | 2      | 1    | 7               | 16    |

**Recommended:** Option A (Highest score)
```

### 3. Technical Plan

```markdown
## Selected Solution: Option A

### Technical Approach

**Architecture:**
```
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Component  │ ← Split into 3 parts
└──────┬──────┘
       │
┌──────▼──────┐
│   Logic     │
└─────────────┘
```

**Components:**
1. **Header Component**
   - Props: title, onBack
   - State: none
   - Logic: Navigation

2. **Content Component**
   - Props: data
   - State: loading, error
   - Logic: Data fetching

3. **Footer Component**
   - Props: actions
   - State: none
   - Logic: Action handlers

---

### File Structure

```
src/
├── components/
│   ├── UserProfile/
│   │   ├── index.ts
│   │   ├── UserProfile.tsx
│   │   ├── UserProfileHeader.tsx
│   │   ├── UserProfileContent.tsx
│   │   ├── UserProfileFooter.tsx
│   │   └── __tests__/
│   │       ├── UserProfile.test.tsx
│   │       ├── UserProfileHeader.test.tsx
│   │       └── UserProfileContent.test.tsx
│   └── ...
└── ...
```

---

### Implementation Steps

**Phase 1: Preparation (30 min)**
1. Create new component files
2. Set up test structure
3. Define TypeScript interfaces

**Phase 2: Header (45 min)**
1. Implement UserProfileHeader
2. Write tests
3. Style component

**Phase 3: Content (60 min)**
1. Implement UserProfileContent
2. Add data fetching logic
3. Handle loading/error states
4. Write tests

**Phase 4: Footer (30 min)**
1. Implement UserProfileFooter
2. Wire up actions
3. Write tests

**Phase 5: Integration (45 min)**
1. Compose components in UserProfile
2. Integration tests
3. Manual testing

**Total Estimate:** 3.5 hours

---

### Dependencies

**External:**
- None required

**Internal:**
- Button component (exists)
- Loading spinner (exists)
- Error boundary (exists)

**New:**
- UserProfile types
- Test utilities

---

### Testing Strategy

**Unit Tests:**
- Each component tested in isolation
- Props, state, events
- Target: 85% coverage

**Integration Tests:**
- Full UserProfile flow
- Data loading scenarios
- Error handling

**Manual Tests:**
- Visual regression
- Responsive design
- Accessibility

---

### Migration Plan

**Step 1:** Create new components (no breaking changes)  
**Step 2:** Use new components in parallel  
**Step 3:** Replace old usage gradually  
**Step 4:** Remove old component  

**Rollback:** Keep old component until fully tested

---

### Risks & Mitigation

**Risk 1: Breaking existing features**
- **Likelihood:** Medium
- **Impact:** High
- **Mitigation:** Gradual migration, feature flags

**Risk 2: Performance degradation**
- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:** Performance testing, memoization

**Risk 3: Incomplete test coverage**
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** TDD approach, coverage gates

---

### Success Criteria

✅ All 3 components created and tested  
✅ 85%+ test coverage  
✅ No visual regressions  
✅ Performance maintained  
✅ Zero linter errors  
✅ Passes code review  
```

### 4. Save Plan

```typescript
// Save to plans directory
const planFile = `.claude/plans/${generatePlanId(task)}.md`;
savePlan(planFile, planContent);

console.log(`✅ Plan saved: ${planFile}`);
console.log(`\n📋 Next steps:`);
console.log(`   1. Review plan`);
console.log(`   2. Refine if needed: planning:refine`);
console.log(`   3. Start execution: execute "[plan-id]"`);
console.log(`   4. Or start full workflow: workflow:start "[task]"`);
```

---

## 📊 Output Format

```markdown
╔══════════════════════════════════════════════════════════╗
║  📋 PLAN CREATED                                         ║
╚══════════════════════════════════════════════════════════╝

**Task:** Refactor UserProfile component

**Plan ID:** refactor-userprofile-20251124-150000

**Recommended Solution:** Option A - Component Split

**Effort:** 3.5 hours  
**Risk:** Low  
**Impact:** Medium  

---

## 📄 Plan Location

`.claude/plans/refactor-userprofile-20251124-150000.md`

**Contains:**
- ✅ Problem analysis
- ✅ 3 solution options
- ✅ Decision matrix
- ✅ Technical approach
- ✅ Implementation steps
- ✅ File structure
- ✅ Testing strategy
- ✅ Risk assessment

---

## 🎯 Next Steps

**Option 1: Review & Refine**
```bash
# Open plan for review
open .claude/plans/refactor-userprofile-20251124-150000.md

# Refine if needed
planning:refine refactor-userprofile-20251124-150000
```

**Option 2: Execute Plan**
```bash
# Execute plan directly
execute refactor-userprofile-20251124-150000
```

**Option 3: Start Full Workflow**
```bash
# Use plan in workflow
workflow:start "Refactor UserProfile component"
# (Will reference this plan)
```

**Option 4: Document Only**
```bash
# Save plan for future reference
# No action needed - plan is saved
```
```

---

## 🎯 Plan Features

### Comprehensive Analysis
- Problem statement
- Multiple solutions
- Decision framework
- Risk assessment

### Actionable Details
- File structure
- Implementation steps
- Time estimates
- Dependencies

### Quality Focus
- Testing strategy
- Success criteria
- Rollback plan
- Mitigation strategies

---

## 💡 Use Cases

### Case 1: Explore Options

```bash
planning "Add authentication"

# Output:
- Option A: JWT tokens
- Option B: OAuth
- Option C: Session-based

# Review and decide later
```

### Case 2: Quick Estimate

```bash
planning "Refactor dashboard"

# Get:
- Effort estimate: 8 hours
- Complexity: High
- Risks identified
```

### Case 3: Documentation

```bash
planning "Implement new API"

# Creates:
- Technical specification
- Architecture diagram
- Implementation plan
- Can share with team
```

---

## 🔗 Related Commands

```bash
planning "Task"              # Create plan
planning:refine [plan-id]    # Update plan
planning:list                # List all plans
execute [plan-id]            # Execute plan
workflow:start "Task"        # Full workflow (includes planning)
```

---

## ✅ Success Criteria

✅ Comprehensive problem analysis  
✅ Multiple solution options  
✅ Clear decision rationale  
✅ Detailed implementation plan  
✅ Risk assessment included  
✅ Saved for reference  
✅ Ready to execute  

---

**Command:** planning  
**Version:** 1.0.0  
**Added:** CCPM v4.3

