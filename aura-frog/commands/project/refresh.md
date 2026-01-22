# Command: /project:refresh

**Category:** Project
**Scope:** Session

---

## Purpose

Refresh the project detection cache. Forces a fresh scan of the codebase to update detected tech stack, file patterns, test infrastructure, and agent mappings.

**Supports both single projects and workspaces with multiple repos.**

---

## When to Use

- After adding new dependencies (npm install, composer require)
- After changing project structure
- After adding test infrastructure
- When agent detection seems wrong
- After switching branches with different tech stacks
- After adding a new project to a workspace

---

## Usage

```
/project:refresh
```

---

## What Gets Refreshed

| Detection | Description |
|-----------|-------------|
| Framework | Next.js, Laravel, Django, Flutter, etc. |
| Package Manager | npm, pnpm, yarn, composer, pip, etc. |
| Project Type | monorepo, library, single-repo, workspace |
| Test Infrastructure | vitest, jest, phpunit, pytest, etc. |
| File Patterns | Templates, styles, frontend/backend files |
| Agent Mapping | Primary and secondary agents for this project |

---

## Storage Location

**Single Project:**
```
.claude/project-contexts/[project-name]/project-detection.json
```

**Workspace (multiple repos):**
```
.claude/project-contexts/workspace-detection.json           # Workspace index
frontend-app/.claude/project-contexts/frontend-app/project-detection.json
backend-api/.claude/project-contexts/backend-api/project-detection.json
mobile-app/.claude/project-contexts/mobile-app/project-detection.json
```

---

## Cache Invalidation

Cache is automatically invalidated when:
- Key config files change (package.json, composer.json, etc.)
- Cache is older than 24 hours
- `/project:refresh` is run manually

---

## Output - Single Project

```
🔄 Project Cache Refreshed

**Project Type:** single-repo
**Framework:** nextjs
**Package Manager:** pnpm
**Primary Agent:** web-nextjs
**Secondary Agents:** backend-nodejs
**Test Framework:** vitest
**Templates:** (none)
**From Cache:** No (fresh scan)
```

## Output - Workspace

```
🔄 Workspace Cache Refreshed

**Workspace:** my-projects
**Projects:** 3

- **frontend-app** (nextjs) → web-nextjs
- **backend-api** (laravel) → backend-laravel
- **mobile-app** (react-native) → mobile-react-native

**From Cache:** No (fresh scan)
```

---

## Related Commands

- `/project:status` - Show current project detection (from cache)
- `/project:reload-env` - Reload environment variables

---

**Version:** 2.0.0
