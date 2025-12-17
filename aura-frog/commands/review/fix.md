# Command: review:fix

**Purpose:** Auto-fix code review issues from Phase 6
**Aliases:** `fix review`, `auto fix`, `fix issues`

---

## Usage

```
review:fix                           # Fix all auto-fixable issues
review:fix M-001                     # Fix specific issue
review:fix --priority=critical       # Fix by priority
review:fix --category=accessibility  # Fix by category
review:fix --dry-run                 # Preview changes only
review:fix --rollback                # Undo last fix
```

---

## Auto-Fixable Categories

```toon
categories[6]{category,examples}:
  Accessibility,Add accessibilityLabel/Hint/Role
  Code Quality,Remove console.log + unused imports/vars
  Documentation,Add JSDoc comments + param types
  Style/Theme,Replace hardcoded colors/spacing with tokens
  Performance,Add memoization + move constants outside
  TypeScript,Add missing types + fix type errors
```

---

## Manual Fix Required

```toon
manual_fixes[3]{category,reason}:
  Architecture,Extract components + error boundaries + state refactoring
  Business Logic,Analytics + validation rules + workflow changes
  Complex Refactoring,Extract utilities + reduce complexity + split components
```

---

## Workflow

```toon
workflow[5]{step,action}:
  1. Load,Read Phase 6 review report
  2. Analyze,Categorize issues as auto-fixable or manual
  3. Backup,Create backup before applying fixes
  4. Execute,Apply fixes by priority/category
  5. Verify,Re-run linter + TypeScript + tests
```

---

## Safety Features

- **Backup** - Creates backup before any changes
- **Validation** - Runs full test suite after fixes
- **Rollback** - Automatic revert if tests fail

---

## Output

```toon
output[5]{metric,before,after}:
  Quality Score,8.5/10,9.2/10
  Linter Errors,2,0
  TypeScript Errors,0,0
  Tests,73/73,73/73
  Coverage,88%,88%
```

---

## Options

| Option | Values |
|--------|--------|
| `--priority` | critical, major, minor, all |
| `--category` | accessibility, performance, style, docs, quality |
| `--dry-run` | Preview without applying |
| `--rollback` | Undo last fix session |
| `--restore=<timestamp>` | Restore specific backup |

---

**Version:** 2.0.0
