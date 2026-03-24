---
name: project-context-loader
description: "Load project conventions and generate session context. Use EXPLICITLY when needed, not automatically."
autoInvoke: false
# TOKEN OPTIMIZATION: Disabled auto-invoke. Was causing ~15-25k tokens per session.
# Invoke explicitly via /project:context or when project context is truly needed.
priority: high
triggers:
  - "/project:context"
  - "load project context"
  - "load conventions"
allowed-tools: Read, Write, Grep, Glob, Bash
---

# Project Context Loader

**Priority:** HIGH - Use before any workflow or code generation
**Version:** 2.0.0

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

| File | Contains | Priority |
|------|----------|----------|
| `project-config.yaml` | Tech stack, integrations, entry points | Always load |
| `conventions.md` | Naming, code style, patterns, idioms | Always load |
| `rules.md` | Project-specific rules | Always load |
| `repo-map.md` | Annotated directory tree with purposes | Load on first task |
| `file-registry.yaml` | Key files: entry points, configs, hub files | Load when modifying code |
| `architecture.md` | Module map, data flow, patterns, dependencies | Load for architecture decisions |

### 4. Merge Priority

```
session-context.toon (cached patterns — 12 detections)
  ↓
project-contexts/conventions.md (overrides)
  ↓
project-contexts/repo-map.md + file-registry.yaml + architecture.md (deep context)
  ↓
Aura Frog core rules (defaults)
```

### 5. Smart Loading Strategy

**Not all context files need loading every time.** Use this routing:

```toon
loading_strategy[4]{scenario,files_to_load}:
  Simple question (no code),session-context.toon only
  Bug fix / small change,"session-context.toon + conventions.md + file-registry.yaml"
  New feature / refactor,"All 7 files (full context)"
  Architecture decision,"session-context.toon + architecture.md + repo-map.md"
```

**Token budget per scenario:**
- Simple: ~200 tokens
- Bug fix: ~800 tokens
- Full context: ~2000 tokens
- Architecture: ~1000 tokens

---

## Session Context Template

```toon
# Session Context
# Generated: 2026-03-20T10:00:00Z
# Valid for: 1 hour (regenerate if stale)

---

project:
  name: my-app
  stack: React,TypeScript,TailwindCSS

patterns[12]{type,convention,example}:
  file_naming,PascalCase,UserProfile.tsx
  imports,absolute @/,import { Button } from '@/components/Button'
  exports,named,export const UserCard = ...
  errors,result,return { ok: true, data }
  testing,vitest,describe('UserCard', () => ...)
  styling,tailwind,className="flex items-center"
  indentation,2-space,2-space
  state_mgmt,zustand,zustand
  api_pattern,react-query,react-query
  components,functional,functional
  env,dotenv-multi,dotenv-multi
  monorepo,none,none

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
| Full repo re-scan | ~5000-10000 |
| All 7 context files | ~2000 |
| Session context TOON (12 patterns) | ~200 |
| **Savings vs re-scan** | **95-98%** |

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
- `rules/agent/codebase-consistency.md` - Pattern matching rule
- `skills/session-continuation/SKILL.md` - Workflow state + handoff
- `scripts/context-compress.sh` - Context generator
