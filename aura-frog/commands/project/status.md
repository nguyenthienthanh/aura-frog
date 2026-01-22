# Command: /project:status

**Category:** Project
**Scope:** Session

---

## Purpose

Show the current project detection status from cache. Displays detected tech stack, agents, test infrastructure, and file patterns without re-scanning.

**Supports both single projects and workspaces with multiple repos.**

---

## Usage

```
/project:status
/project:status [project-name]   # In workspace, show specific project
```

---

## Output - Single Project

```
📊 Project Detection Status

**Project Type:** single-repo
**Framework:** laravel
**Package Manager:** composer
**Primary Agent:** backend-laravel
**Secondary Agents:** web-expert (templates detected)
**Test Framework:** phpunit
**Templates:** blade
**Styles:** tailwind, scss

**Cache Status:**
- From Cache: Yes
- Cache Age: 2 hours
- Key Files Hash: a1b2c3d4e5f6
- Last Scan: 2026-01-21 10:30:00
```

---

## Output - Workspace

```
📊 Workspace Detection Status

**Workspace:** ~/Projects/my-workspace
**Projects:** 3

┌─────────────────┬────────────────┬────────────────────┬──────────┐
│ Project         │ Framework      │ Agent              │ Tests    │
├─────────────────┼────────────────┼────────────────────┼──────────┤
│ frontend-app    │ nextjs         │ web-nextjs         │ vitest   │
│ backend-api     │ laravel        │ backend-laravel    │ phpunit  │
│ mobile-app      │ react-native   │ mobile-react-native│ jest     │
└─────────────────┴────────────────┴────────────────────┴──────────┘

**Cache Status:**
- From Cache: Yes
- Cache Age: 1 hour
- Last Scan: 2026-01-21 10:30:00
```

---

## Cache Information

| Field | Description |
|-------|-------------|
| From Cache | Whether data is from cache or fresh scan |
| Cache Age | How old the cached detection is |
| Key Files Hash | Hash of config files (changes trigger refresh) |
| Last Scan | Timestamp of last full detection |

---

## When to Use

- To verify which agent will be selected
- To check if templates/styles are detected
- To confirm test infrastructure detection
- Before starting a task (understand project context)
- To see all projects in a workspace

---

## Workspace Task Matching

When you mention a project name in your task, the system automatically selects it:

```
Task: "Fix the login bug in backend-api"
→ Matches project: backend-api
→ Agent: backend-laravel
```

---

## Related Commands

- `/project:refresh` - Force refresh the cache
- `/project:reload-env` - Reload environment variables

---

**Version:** 2.0.0
