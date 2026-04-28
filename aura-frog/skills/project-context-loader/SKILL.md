---
name: project-context-loader
description: "Load project conventions and generate session context. Use EXPLICITLY when needed, not automatically."
autoInvoke: false
# TOKEN OPTIMIZATION: Disabled auto-invoke. Was causing ~15-25k tokens per session.
# Invoke explicitly via /project context or when project context is truly needed.
priority: high
triggers:
  - "/project context"
  - "load project context"
  - "load conventions"
allowed-tools: Read, Write, Grep, Glob, Bash
user-invocable: false
---

# Project Context Loader

Load project conventions and generate session context on demand.

---

## When to Use

**Before:** `/run`, code generation, refactoring, test writing.
**Skip:** Simple questions (no code), when `session-context.toon` already loaded.

---

## Loading Process

### 1. Check Cache
If `.claude/session-context.toon` exists and is recent (< 1 hour), use it.

### 2. Generate (If Missing)
Scan codebase for: file naming, import style, export pattern, error handling, testing framework, styling approach. Write to `.claude/session-context.toon`.

### 3. Load Project Config
From `.claude/project-contexts/[project]/`:

| File | When |
|------|------|
| `project-config.yaml` | Always |
| `conventions.md` | Always |
| `rules.md` | Always |
| `repo-map.md` | First task |
| `file-registry.yaml` | When modifying code |
| `architecture.md` | Architecture decisions |

### 4. Smart Loading

```toon
loading_strategy[4]{scenario,files_to_load}:
  Simple question,session-context.toon only
  Bug fix / small change,"session-context.toon + conventions.md + file-registry.yaml"
  New feature / refactor,All 7 files
  Architecture decision,"session-context.toon + architecture.md + repo-map.md"
```

**Token budget:** Simple ~200, Bug fix ~800, Full ~2000, Architecture ~1000.

---

## Session Context Template

```toon
project:
  name: {name}
  stack: {detected}

patterns[12]{type,convention,example}:
  file_naming,PascalCase,UserProfile.tsx
  imports,absolute @/,import { Button } from '@/components/Button'
  exports,named,export const UserCard = ...
  errors,result,return { ok: true, data }
  testing,vitest,describe('UserCard', () => ...)
  styling,tailwind,className="flex items-center"
  ...
```

---

## Commands

- `bash scripts/context-compress.sh` -- generate context
- `rm .claude/session-context.toon` -- force rescan

---
