# Impact Analysis Rule

**Version:** 1.0.0
**Priority:** CRITICAL - Must be done before any code modification
**Type:** Rule (Mandatory Process)

---

## Core Rule

**Before modifying any existing code, YOU MUST analyze all usages to prevent breaking changes.**

---

## When This Rule Applies

| Action | Requires Impact Analysis |
|--------|-------------------------|
| Refactoring code | YES |
| Renaming functions/variables/classes | YES |
| Changing function signatures | YES |
| Modifying API contracts | YES |
| Updating component props | YES |
| Changing type definitions | YES |
| Deleting code | YES |
| Moving files | YES |
| Changing exports | YES |
| Adding new features only | NO (but verify imports) |
| Writing new files | NO |
| Documentation changes | NO |

---

## Impact Analysis Process

### Step 1: Identify What's Changing

```markdown
**Target:** [file/function/component being modified]
**Change Type:** [rename/signature/delete/move/refactor]
**Description:** [what exactly is changing]
```

### Step 2: Find All Usages

Use these commands to find all references:

```bash
# Find all imports/usages of a function or component
grep -r "functionName" --include="*.ts" --include="*.tsx" --include="*.js"

# Find all imports from a file
grep -r "from './path/to/file'" --include="*.ts" --include="*.tsx"

# Find all usages of a type
grep -r "TypeName" --include="*.ts" --include="*.tsx"
```

### Step 3: Document Affected Files

```markdown
## Affected Files

| File | Usage | Impact | Action Required |
|------|-------|--------|-----------------|
| src/components/Header.tsx | imports `useAuth` | Will break | Update import |
| src/pages/Login.tsx | calls `login()` | Will break | Update signature |
| src/utils/helpers.ts | references type | Will break | Update type |
| src/__tests__/auth.test.ts | tests `login()` | Will break | Update tests |
```

### Step 4: Categorize Impact

| Impact Level | Description | Action |
|--------------|-------------|--------|
| **BREAKING** | Will cause compile/runtime errors | Must fix before merge |
| **WARNING** | May cause unexpected behavior | Should fix before merge |
| **SAFE** | No impact on functionality | Can proceed |

### Step 5: Update All Affected Files

- Update **ALL** usages before completing the refactor
- Run tests after each file update
- Verify no new errors introduced

---

## Checklist Before Modifying Code

```markdown
## Pre-Modification Checklist

- [ ] Identified all files using the target code
- [ ] Documented the expected impact
- [ ] Created plan to update all affected files
- [ ] Verified test coverage for affected areas
- [ ] Have rollback strategy if needed

## Post-Modification Checklist

- [ ] All affected files updated
- [ ] All tests pass
- [ ] No new TypeScript/linting errors
- [ ] No broken imports
- [ ] Verified functionality still works
```

---

## Examples

### Example 1: Renaming a Function

```markdown
**Target:** `getUserData()` in `src/api/userApi.ts`
**Change:** Rename to `fetchUserProfile()`

**Step 1: Find usages**
$ grep -r "getUserData" --include="*.ts" --include="*.tsx"

Results:
- src/hooks/useUser.ts:15
- src/components/Profile.tsx:23
- src/pages/Dashboard.tsx:45
- src/__tests__/userApi.test.ts:10,25,40

**Step 2: Update all 4 files**
**Step 3: Run tests**
**Step 4: Verify build passes**
```

### Example 2: Changing Function Signature

```markdown
**Target:** `login(email, password)` in `src/auth/authService.ts`
**Change:** Add optional `rememberMe` parameter: `login(email, password, rememberMe?)`

**Impact Analysis:**
- Backward compatible ✅ (optional param)
- But should still check all usages for awareness

**Usages found:**
- src/components/LoginForm.tsx - may want to use new param
- src/hooks/useAuth.ts - may want to expose new param
- src/__tests__/auth.test.ts - should add tests for new param
```

### Example 3: Deleting a Component

```markdown
**Target:** `OldButton` in `src/components/OldButton.tsx`
**Change:** Delete (replaced by `Button`)

**CRITICAL: Must find ALL usages first**

$ grep -r "OldButton" --include="*.tsx"

Results:
- src/pages/Settings.tsx:12 - STILL USING! ❌
- src/pages/Profile.tsx:8 - STILL USING! ❌

**Action:** Cannot delete until all usages migrated to `Button`
```

---

## Integration with Workflow

### During Refactoring (refactor command)

The `refactor` command **automatically** includes impact analysis in:
- **Phase 1:** Code Analysis - identifies usages
- **Phase 2:** Refactoring Plan - documents affected files
- **Phase 4:** TDD GREEN - updates all affected code

### During Bug Fixes (bugfix command)

Impact analysis is included in:
- **Phase 1:** Bug Analysis - identifies related code
- **Phase 4:** TDD GREEN - ensures fix doesn't break other areas

### Manual Changes

When making manual changes without workflow:
1. Run grep/search before modifying
2. Document findings
3. Update all usages
4. Run full test suite

---

## Tools for Impact Analysis

### IDE Tools
- **Find All References** (F12 or right-click)
- **Rename Symbol** (F2) - shows all usages
- **Go to Definition** - verify source

### CLI Tools
```bash
# TypeScript: Find references
npx ts-prune  # Find unused exports

# General search
grep -r "pattern" --include="*.ts" .
rg "pattern" --type ts

# Git: See what uses a file
git log --follow -p -- path/to/file.ts
```

### Automated Checks
```bash
# TypeScript compilation
npx tsc --noEmit

# ESLint
npx eslint .

# Tests
npm test
```

---

## Failure to Follow This Rule

**What happens if you skip impact analysis:**
- Broken imports at runtime
- TypeScript compilation errors
- Test failures
- Production bugs
- Rollback required

**This rule exists because:**
- Code is interconnected
- Changes propagate
- Breaking changes are costly
- Prevention is easier than debugging

---

## Related Rules

| Rule | Connection |
|------|------------|
| `tdd-workflow.md` | Tests catch breaking changes |
| `cross-review-workflow.md` | Reviewers verify impact |
| `safety-rules.md` | Prevent destructive changes |
| `approval-gates.md` | Changes require approval |

---

**Version:** 1.0.0
**Last Updated:** 2025-12-08
