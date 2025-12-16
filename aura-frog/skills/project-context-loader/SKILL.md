---
name: project-context-loader
description: "Load project conventions and generate session context. PROACTIVELY use before any code generation."
autoInvoke: true
priority: high
triggers:
  - "before workflow:start"
  - "before code generation"
  - "before implement"
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Project Context Loader

**Priority:** HIGH - Use before any workflow or code generation
**Version:** 1.1.0

---

## When to Use

**BEFORE:**
- `workflow:start` or any implementation
- Any code generation or new files
- Refactoring or writing tests

**SKIP only for:** Simple questions (no code), when `session-context.toon` already loaded

---

## Loading Process

### 1. Check for Cached Context

```bash
# If session context exists and is recent (< 1 hour), use it
if [ -f ".claude/session-context.toon" ]; then
  Read .claude/session-context.toon
  # Skip full scan
fi
```

### 2. Generate Session Context (If Missing)

#### Scan Codebase Patterns

```bash
# File naming convention
ls src/components/ | head -5  # PascalCase or kebab-case?

# Import style
Grep: "^import.*from ['\"]@/" --type ts  # Absolute paths?
Grep: "^import.*from ['\"]\.\./" --type ts  # Relative paths?

# Export pattern
Grep: "^export default" --type ts
Grep: "^export (const|function)" --type ts

# Error handling
Grep: "Result<|Either<" --type ts  # Functional?
Grep: "try.*catch" --type ts  # Exception-based?
```

#### Generate TOON File

Write to `.claude/session-context.toon`:

```toon
# Session Context - Auto-generated
# Generated: {timestamp}

---

project:
  name: {from package.json}
  stack: {detected}

patterns[6]{type,convention,example}:
  file_naming,{PascalCase|kebab-case},{example}
  imports,{absolute|relative},{example}
  exports,{named|default},{example}
  errors,{result|exceptions},{example}
  testing,{jest|vitest},{example}
  styling,{tailwind|css-modules},{example}

workflow:
  phase: {current}
  feature: {name}
  branch: {git branch}
```

### 3. Load Project-Specific Config

**Location:** `.claude/project-contexts/[project]/`

| File | Contains |
|------|----------|
| `project-config.yaml` | Tech stack, integrations |
| `conventions.md` | Override patterns (optional) |
| `rules.md` | Project-specific rules |

### 4. Merge Priority

```
session-context.toon (cached patterns)
  ↓
project-contexts/conventions.md (overrides)
  ↓
Aura Frog core rules (defaults)
```

---

## Session Context Template

```toon
# Session Context
# Generated: 2025-12-16T10:00:00Z
# Valid for: 1 hour (regenerate if stale)

---

project:
  name: my-app
  stack: React,TypeScript,TailwindCSS

patterns[6]{type,convention,example}:
  file_naming,PascalCase,UserProfile.tsx
  imports,absolute @/,import { Button } from '@/components/Button'
  exports,named,export const UserCard = ...
  errors,result,return { ok: true, data }
  testing,vitest,describe('UserCard', () => ...)
  styling,tailwind,className="flex items-center"

workflow:
  phase: 4
  feature: user-authentication
  branch: feature/user-auth

decisions[2]{id,choice}:
  auth,JWT tokens
  storage,Redis session
```

---

## Token Efficiency

| Approach | Tokens |
|----------|--------|
| Full convention docs | ~500-1000 |
| Session context TOON | ~100-150 |
| **Savings** | **80-85%** |

---

## Commands

### Generate Context Manually
```bash
bash scripts/context-compress.sh
```

### Clear Context (Force Rescan)
```bash
rm .claude/session-context.toon
```

---

## If Context Missing

```markdown
⚠️ **Project context not found!**

Generating session-context.toon from codebase scan...
Run `project:init` for full project config.
```

---

**Related:**
- `rules/codebase-consistency.md` - Pattern matching rule
- `skills/state-persistence/SKILL.md` - Workflow state
- `scripts/context-compress.sh` - Context generator
