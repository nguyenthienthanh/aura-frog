---
name: project-context-loader
description: "Load project conventions, rules, and examples BEFORE any code generation. Ensures AI follows YOUR project standards."
autoInvoke: true
priority: high
triggers:
  - "before workflow:start"
  - "before code generation"
  - "before implement"
allowed-tools: Read, Grep, Glob
---

# Aura Frog Project Context Loader

**Priority:** HIGH - Use before any workflow or code generation

---

## When to Use

**BEFORE:**
- `workflow:start` or any implementation
- Any code generation or new files
- Refactoring or writing tests

**SKIP only for:** Simple questions (no code), when already loaded this session

---

## Loading Process

### 1. Check Context Exists
```bash
if [ ! -d ".claude/project-contexts" ]; then
  echo "⚠️ Run: project:init"
fi
```

### 2. Load Project Files

**Location:** `.claude/project-contexts/[project]/`

| File | Contains |
|------|----------|
| `project-config.yaml` | Tech stack, team, integrations |
| `conventions.md` | File naming, directory structure, import aliases |
| `rules.md` | Quality rules, testing requirements, git workflow |
| `examples.md` | Real code examples from project |

### 3. Load Aura Frog Core Rules
From plugin `rules/`: tdd-workflow.md, approval-gates.md, kiss-principle.md, cross-review.md

### 4. Merge (Project Overrides Core)
```
Project rules.md > Aura Frog core rules > Generic defaults
```

---

## Key Context Items

**Tech Stack:** framework, language, styling, state management, testing
**Conventions:** file naming (kebab/Pascal), import aliases (@/, ~/), component structure
**Rules:** coverage target (default 80%), linting, PR requirements
**Examples:** component patterns, test patterns, API patterns

---

## Application Examples

| Without Context | With Context |
|-----------------|--------------|
| `userProfile.tsx` | `UserProfile.tsx` (PascalCase) |
| StyleSheet.create | NativeWind className |
| 80% coverage | 85% coverage (project rule) |
| Relative imports | `@/components/Button` |

---

## If Context Missing

```markdown
⚠️ **Project context not found!**

Run: `project:init`

Continue with Aura Frog defaults? [yes/no]
```

---

**📚 Details:** `docs/RULES_COMBINATION.md`

**Remember:** Project conventions override Aura Frog defaults. Always load before generating code.
