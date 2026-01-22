# Command: /project

**Category:** Project (Bundled)
**Scope:** Session
**Version:** 2.0.0

---

## Purpose

Unified project management command. Handles detection, configuration, and context management.

---

## Usage

```bash
# Show project status
/project

# Specific subcommands
/project status
/project refresh
/project init
/project switch <name>
/project list
/project config
```

---

## Subcommands

| Subcommand | Description | Example |
|------------|-------------|---------|
| `status` | Show current detection + context | `/project status` |
| `refresh` | Force re-scan project | `/project refresh` |
| `init` | Initialize project config | `/project init` |
| `switch <name>` | Switch active project (workspace) | `/project switch backend-api` |
| `list` | List detected projects | `/project list` |
| `config` | Edit project configuration | `/project config` |
| `detect` | Show detection details | `/project detect` |
| `reload-env` | Reload environment variables | `/project reload-env` |

---

## Interactive Menu

```
📁 Project Commands

Current: my-app (nextjs, pnpm)

Quick Actions:
  [1] Show status
  [2] Refresh detection
  [3] Reload environment

Configuration:
  [4] Edit project config
  [5] Initialize new project
  [6] View conventions

Workspace:
  [7] List all projects
  [8] Switch project

Select [1-8] or type command:
```

---

## Status Output

```markdown
## 📁 Project Status

**Project:** my-app
**Type:** single-repo
**Framework:** nextjs
**Package Manager:** pnpm
**Path:** /Users/dev/my-app

### Agents
- **Primary:** web-nextjs
- **Secondary:** backend-nodejs, qa-automation

### Test Infrastructure
- **Framework:** vitest
- **Config:** vitest.config.ts
- **Directories:** tests/, __tests__/
- **Coverage:** 78%

### Environment
- ✅ .envrc loaded (16 vars)
- ✅ MCP servers: context7, vitest, playwright

### Cache
- **Status:** Valid
- **Updated:** 2 hours ago
- **Key Files:** Unchanged
```

---

## Related Files

- **Project Manager Agent:** `agents/project-manager.md`
- **Project Cache:** `hooks/lib/af-project-cache.cjs`
- **Cache Docs:** `docs/PROJECT_CACHE.md`
- **Legacy Commands:** `commands/project/*.md`

---

**Version:** 2.0.0 | **Last Updated:** 2026-01-21
