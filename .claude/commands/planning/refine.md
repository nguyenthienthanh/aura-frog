# Command: planning:refine

**Purpose:** Refine or update an existing plan  
**Aliases:** `refine plan`, `update plan`, `plan:update`

---

## 🎯 Overview

Modify an existing plan based on new requirements, feedback, or changes in scope.

---

## 📋 Usage

```bash
# Refine specific plan
planning:refine refactor-userprofile-20251124-150000

# With specific changes
planning:refine [plan-id] "Add accessibility requirements"

# Interactive mode
planning:refine [plan-id] --interactive
```

---

## 🔄 Execution Flow

### 1. Load Existing Plan

```typescript
const plan = loadPlan(planId);

console.log(`📋 Current Plan: ${plan.task}`);
console.log(`Created: ${plan.created_at}`);
console.log(`Solution: ${plan.selectedSolution}`);
```

### 2. Request Changes

```markdown
## 📋 Current Plan Summary

**Task:** Refactor UserProfile component  
**Solution:** Component Split (Option A)  
**Estimated:** 3.5 hours  
**Risk:** Low

---

**What would you like to change?**

Options:
1. Update requirements
2. Change selected solution
3. Adjust implementation approach
4. Modify file structure
5. Update testing strategy
6. Add/remove features
7. Other (specify)

**Your choice:**
```

### 3. Apply Changes

```typescript
// Based on user input
switch (changeType) {
  case 'solution':
    // Re-evaluate solutions
    const newSolutions = generateSolutions(newRequirements);
    plan.selectedSolution = newSolutions.recommended;
    break;
    
  case 'approach':
    // Update technical approach
    plan.architecture = updateArchitecture(changes);
    plan.implementationSteps = regenerateSteps(plan);
    break;
    
  case 'requirements':
    // Update requirements and re-plan
    plan.requirements = mergeRequirements(plan.requirements, changes);
    plan = regeneratePlan(plan);
    break;
}
```

### 4. Show Updated Plan

```markdown
## ✅ Plan Updated

**Changes Applied:**
- ✅ Added accessibility requirements
- ✅ Updated implementation steps
- ✅ Increased time estimate: 3.5h → 4.5h
- ✅ Added a11y testing strategy

---

## 📊 Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Components | 3 | 3 |
| Estimated Time | 3.5h | 4.5h |
| Test Coverage | 85% | 90% |
| Features | 5 | 7 (+ a11y) |

---

## 📝 New Plan Summary

**Task:** Refactor UserProfile component (with accessibility)  
**Solution:** Component Split with A11y (Option A+)  
**Estimated:** 4.5 hours  
**Risk:** Low  

**Added:**
- Screen reader support
- Keyboard navigation
- ARIA labels
- Focus management
- A11y test suite

---

**Plan saved:** `.claude/plans/refactor-userprofile-20251124-150000.md`  
**Version:** 2 (updated)

**Next steps:**
- Review updated plan
- Execute: `execute refactor-userprofile-20251124-150000`
- Or refine more: `planning:refine refactor-userprofile-20251124-150000`
```

---

## 💡 Common Refinements

### 1. Add Feature

```bash
planning:refine [plan-id] "Add dark mode support"

# Updates plan to include dark mode
```

### 2. Change Approach

```bash
planning:refine [plan-id] "Use composition instead of splitting"

# Re-evaluates technical approach
```

### 3. Adjust Scope

```bash
planning:refine [plan-id] "Reduce scope to phone only"

# Removes tablet support, updates estimates
```

### 4. Update Constraints

```bash
planning:refine [plan-id] "Must complete in 2 hours"

# Adjusts implementation plan to meet time constraint
```

---

## 🔗 Related Commands

```bash
planning "Task"              # Create new plan
planning:refine [plan-id]    # Update plan
planning:list                # List all plans
execute [plan-id]            # Execute (possibly refined) plan
```

---

**Command:** planning:refine  
**Version:** 1.0.0  
**Added:** CCPM v4.3

