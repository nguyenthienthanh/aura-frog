# Rule: Project Linting Precedence

**Version:** 1.1.0
**Priority:** CRITICAL
**Applies:** All code generation and review

---

## Core Rule

**Project's ESLint/TSLint/Prettier configuration MERGES with Aura Frog rules.**

- Project linting config **overrides** conflicting Aura Frog rules
- Aura Frog rules **still apply** where project config is silent
- Result: Best of both worlds

---

## Merge Strategy

```toon
merge_strategy[3]{layer,behavior,example}:
  1,Project config overrides,Semicolons: project says no → no semicolons
  2,Aura Frog fills gaps,Error handling: project silent → use Aura Frog
  3,Combined result,Follow project style + Aura Frog best practices
```

---

## Detection Sources

### ESLint Configuration
```toon
eslint_files[6]{file,format}:
  .eslintrc.js,JavaScript config
  .eslintrc.cjs,CommonJS config
  .eslintrc.json,JSON config
  .eslintrc.yaml,YAML config
  .eslintrc.yml,YAML config
  eslint.config.js,Flat config (ESLint 9+)
```

### TSLint Configuration (Legacy)
```toon
tslint_files[2]{file,format}:
  tslint.json,JSON config
  tslint.yaml,YAML config
```

### Prettier Configuration
```toon
prettier_files[6]{file,format}:
  .prettierrc,JSON/YAML
  .prettierrc.js,JavaScript
  .prettierrc.json,JSON
  .prettierrc.yaml,YAML
  prettier.config.js,JavaScript
  package.json (prettier key),Inline
```

### TypeScript Configuration
```toon
tsconfig_files[3]{file,purpose}:
  tsconfig.json,Main config
  tsconfig.build.json,Build config
  tsconfig.node.json,Node config
```

---

## How Merging Works

### Project Overrides (Conflicts)
```yaml
# Project .prettierrc:
{ "semi": false, "tabWidth": 4 }

# Aura Frog code-quality.md says: use semicolons
# Result: NO semicolons (project wins on conflicts)
```

### Aura Frog Applies (No Conflict)
```yaml
# Project ESLint: only has naming rules
# Aura Frog: has error handling, logging, TDD rules

# Result: Use project naming + Aura Frog error handling + logging + TDD
```

### Merge Examples

| Topic | Project Config | Aura Frog Rule | Result |
|-------|---------------|----------------|--------|
| Semicolons | `semi: false` | Use semicolons | No semicolons (project) |
| Naming | `camelCase` | `camelCase` | camelCase (same) |
| Error handling | (silent) | Typed errors | Typed errors (Aura Frog) |
| TDD | (silent) | RED-GREEN-REFACTOR | TDD applies (Aura Frog) |
| Import order | Custom order | Standard order | Custom order (project) |
| Logging | (silent) | Structured logs | Structured logs (Aura Frog) |

---

## Implementation

### Before Writing Code

1. **Check for linting config:**
   ```bash
   ls -la .eslintrc* eslint.config.* .prettierrc* tsconfig.json 2>/dev/null
   ```

2. **Read and merge configs:**
   - Parse ESLint rules → Override Aura Frog where conflicts
   - Parse Prettier settings → Override formatting rules
   - Parse TypeScript settings → Override type rules
   - Keep Aura Frog rules where project is silent

3. **Apply merged ruleset**

### Project Context Integration

The `project:init` command should capture linting config in:
```
.claude/project-contexts/[project]/
├── project-config.yaml   # Has quality.linter, quality.formatter
└── rules.md              # Extracted from ESLint/Prettier
```

### Example project-config.yaml
```yaml
quality:
  linter: "eslint"
  linter_config: ".eslintrc.js"
  formatter: "prettier"
  formatter_config: ".prettierrc"
  type_check: "typescript"
  tsconfig: "tsconfig.json"

  # Key rules extracted from ESLint
  extracted_rules:
    naming: "camelCase"
    semicolons: false
    quotes: "single"
    indent: 2
    max_line_length: 100
```

---

## Examples

### Example 1: Project Uses No Semicolons

**Project .prettierrc:**
```json
{ "semi": false }
```

**Claude generates:**
```typescript
// ✅ CORRECT - follows project config
const name = 'John'
const age = 30

// ❌ WRONG - ignores project config
const name = 'John';
const age = 30;
```

### Example 2: Project Uses Tabs

**Project .prettierrc:**
```json
{ "useTabs": true, "tabWidth": 4 }
```

**Claude generates:**
```typescript
// ✅ CORRECT - uses tabs
function hello() {
→   const message = 'Hello'
→   return message
}

// ❌ WRONG - uses spaces
function hello() {
    const message = 'Hello'
    return message
}
```

### Example 3: Project Has Custom Naming

**Project .eslintrc:**
```json
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "variable", "format": ["snake_case"] }
    ]
  }
}
```

**Claude generates:**
```typescript
// ✅ CORRECT - follows project's snake_case
const user_name = 'John'
const user_age = 30

// ❌ WRONG - uses Aura Frog's camelCase
const userName = 'John'
const userAge = 30
```

---

## When No Project Config Exists

When project has NO linting config:
1. Aura Frog rules apply fully (no conflicts to resolve)
2. Follow `code-quality.md`, `naming-conventions.md`, etc.
3. Apply consistent Aura Frog style throughout

---

## Verification

Before submitting code, verify it passes project linting:

```bash
# Run project's linter
npm run lint
# or
yarn lint
# or
npx eslint . --ext .ts,.tsx

# Run project's formatter check
npx prettier --check .
```

---

## Related Rules

- `code-quality.md` - Default quality rules (lower priority)
- `naming-conventions.md` - Default naming (lower priority)
- `modern-javascript.md` - ES6+ defaults (lower priority)
- `priority-hierarchy.md` - Overall priority system

---

**Version:** 1.1.0
**Last Updated:** 2025-12-10
