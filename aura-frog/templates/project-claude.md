# Aura Frog - [PROJECT_NAME]

**Project:** [PROJECT_NAME]
**Tech Stack:** [TECH_STACK]
**Aura Frog Version:** 1.3.0

---

## Load Aura Frog Plugin

**Read and follow:** `~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md`

This plugin provides rules and skills that auto-load:
- **Banner:** Follow `rules/agent-identification-banner.md` (includes MCP display)
- **Execution:** Follow `rules/execution-rules.md`
- **Skills:** Auto-invoke from `skills/`
- **MCP:** Use bundled servers from `.mcp.json`

**Important:** Banner format is defined in the plugin. Do NOT duplicate here.

---

## Project Context

**Load from:** `.claude/project-contexts/[PROJECT_NAME]/`

```toon
context_files[4]{file,purpose}:
  project-config.yaml,Tech stack + agents + integrations
  conventions.md,File naming + structure patterns
  rules.md,Project-specific quality rules
  examples.md,Code examples from this project
```

---

## Project-Specific Settings

- **Primary Agent:** `[PRIMARY_AGENT]`
- **Tech Stack:** [TECH_STACK]
- **Type:** [PROJECT_TYPE]

---

## MCP Integrations

Bundled MCP servers auto-invoke based on context:

| MCP | Triggers |
|-----|----------|
| **context7** | Library names (React, MUI, Tailwind) |
| **atlassian** | Ticket IDs (PROJ-123) |
| **figma** | Figma URLs |
| **playwright** | E2E test requests |
| **vitest** | Unit test requests |
| **slack** | Phase 9 notifications |

**Setup:** Copy `.envrc.template` and set tokens. See `docs/MCP_GUIDE.md`.

---

**Version:** 1.3.0 | **Generated:** [DATE]
