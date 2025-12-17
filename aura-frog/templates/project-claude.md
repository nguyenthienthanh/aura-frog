# Aura Frog - [PROJECT_NAME]

**Project:** [PROJECT_NAME]
**Tech Stack:** [TECH_STACK]
**Aura Frog Version:** 1.2.4

---

## Load Aura Frog Plugin

**Read and follow:** `~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md`

This plugin provides rules and skills that auto-load. Key files:
- `rules/agent-identification-banner.md` - Banner format
- `rules/execution-rules.md` - Always/Never constraints
- `skills/` - Auto-invoking behaviors

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

## Integrations

### JIRA

When ticket ID detected (e.g., `PROJ-1234`):
```bash
bash ~/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/jira-fetch.sh PROJ-1234
```

### Confluence

When Confluence URL or docs request detected:
```bash
bash ~/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/confluence-operations.sh fetch|search|create|update
```

### Figma

When Figma URL detected:
```bash
bash ~/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/figma-fetch.sh "FIGMA_URL"
```

**See:** `docs/INTEGRATION_SETUP_GUIDE.md` for env var setup.

---

**Version:** 1.2.0 | **Generated:** [DATE]
