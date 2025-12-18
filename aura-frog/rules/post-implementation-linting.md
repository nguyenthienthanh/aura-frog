# Rule: Post-Implementation Linting

**Priority:** High
**Applies To:** All code implementation tasks
**Version:** 1.2.6

---

## Core Requirement

**After EVERY implementation, run lint and resolve ALL issues before completing the task.**

```
Implementation Complete → Run Lint → Fix Issues → Verify Clean → Done
```

---

## When to Lint

```toon
triggers[5]{event,action}:
  New file created,Run lint on file
  Existing file modified,Run lint on file
  Feature implementation done,Run lint on all changed files
  Bug fix completed,Run lint on affected files
  Refactoring finished,Run lint on refactored files
```

---

## Lint Commands by Project Type

### JavaScript/TypeScript Projects

```bash
# ESLint (preferred)
npx eslint --fix "src/**/*.{ts,tsx,js,jsx}"

# Or with specific files
npx eslint --fix path/to/file.ts

# TypeScript type checking
npx tsc --noEmit
```

### Package Manager Variants

```bash
# npm
npm run lint
npm run lint:fix

# yarn
yarn lint
yarn lint:fix

# pnpm
pnpm lint
pnpm lint:fix
```

### Framework-Specific

```toon
commands[6]{framework,lint_command}:
  Next.js,next lint --fix
  Vue.js,vue-cli-service lint --fix
  Angular,ng lint --fix
  React Native,npx eslint --fix .
  NestJS,npm run lint
  Laravel,./vendor/bin/pint
```

---

## Resolution Process

### Step 1: Run Lint

```bash
npx eslint src/ --ext .ts,.tsx,.js,.jsx
```

### Step 2: Auto-Fix What's Possible

```bash
npx eslint src/ --ext .ts,.tsx,.js,.jsx --fix
```

### Step 3: Manually Fix Remaining Issues

For issues that can't be auto-fixed:

```toon
common_issues[6]{issue,fix}:
  @typescript-eslint/no-explicit-any,Add proper types
  @typescript-eslint/no-unused-vars,Remove or use the variable
  react-hooks/exhaustive-deps,Add missing dependencies or disable with comment
  import/order,Reorder imports per project convention
  no-console,Remove console.log or use logger
  prefer-const,Change let to const
```

### Step 4: Verify Clean

```bash
npx eslint src/ --ext .ts,.tsx,.js,.jsx
# Should output: No warnings or errors
```

---

## Type Checking

Always run TypeScript check after implementation:

```bash
npx tsc --noEmit
```

Fix all type errors before completing:

```toon
type_errors[4]{error,fix}:
  Type 'X' is not assignable,Correct the type or add proper typing
  Property does not exist,Add to interface or fix property name
  Argument of type 'any',Add explicit types
  Missing return type,Add return type annotation
```

---

## Mandatory Checks

```toon
checklist[5]{check,command,required}:
  ESLint,npx eslint .,Yes
  TypeScript,npx tsc --noEmit,Yes (if TS project)
  Prettier,npx prettier --check .,Recommended
  Tests pass,npm test,Yes
  Build succeeds,npm run build,Yes
```

---

## DO NOT

```toon
never[5]{action,why}:
  Skip linting,Causes CI failures and tech debt
  Disable rules inline without reason,Hides problems
  Leave warnings unresolved,Warnings become errors
  Commit with lint errors,Breaks team workflow
  Ignore type errors,Runtime crashes
```

---

## Exception: Intentional Rule Disable

If a rule MUST be disabled, add explanation:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy API returns untyped response
const response: any = await legacyApi.fetch();
```

---

## Integration with Workflow

This rule applies to ALL workflow phases:

```toon
phases[4]{phase,lint_action}:
  Phase 3 (Implementation),Lint after each file
  Phase 4 (Testing),Lint test files too
  Phase 6 (Review),Verify zero lint issues
  Phase 8 (Delivery),Final lint check before merge
```

---

**Version:** 1.2.6
