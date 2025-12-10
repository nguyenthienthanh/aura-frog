# Rule: Project Linting Precedence

**Version:** 1.0.0
**Priority:** CRITICAL
**Applies:** All code generation and review

---

## Core Rule

**Project's ESLint/TSLint/linting configuration ALWAYS takes precedence over Aura Frog default rules.**

When a project has its own linting configuration, Claude MUST follow that configuration, not Aura Frog's generic code quality rules.

---

## Priority Order

```toon
linting_priority[5]{priority,source,example}:
  1,Project ESLint/TSLint,.eslintrc + .prettierrc + tsconfig
  2,Project conventions,.claude/project-contexts/[project]/rules.md
  3,Project examples,.claude/project-contexts/[project]/examples.md
  4,Aura Frog rules,aura-frog/rules/*.md
  5,Claude defaults,Built-in training
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

## What Project Config Overrides

### Naming Conventions
```yaml
# If project .eslintrc has:
rules:
  "@typescript-eslint/naming-convention": [...]
  camelcase: "error"

# Claude MUST follow these, not Aura Frog's naming-conventions.md
```

### Import Order
```yaml
# If project has eslint-plugin-import:
rules:
  "import/order": [...]

# Claude MUST follow project's import order, not Aura Frog's code-quality.md
```

### Formatting
```yaml
# If project .prettierrc has:
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 4
}

# Claude MUST use these settings, even if Aura Frog examples use different style
```

### Code Style
```yaml
# If project ESLint allows:
rules:
  "no-console": "off"

# Claude CAN use console.log, even if Aura Frog rules say don't
```

---

## Implementation

### Before Writing Code

1. **Check for linting config:**
   ```bash
   ls -la .eslintrc* eslint.config.* .prettierrc* tsconfig.json 2>/dev/null
   ```

2. **Read project config if exists:**
   - Parse ESLint rules
   - Parse Prettier settings
   - Parse TypeScript strict settings

3. **Apply project config FIRST, then fill gaps with Aura Frog rules**

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

## Fallback Behavior

When NO project linting config exists:
1. Use Aura Frog rules as defaults
2. Follow `code-quality.md`, `naming-conventions.md`, etc.
3. Apply consistent style throughout the codebase

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

**Version:** 1.0.0
**Last Updated:** 2025-12-10
