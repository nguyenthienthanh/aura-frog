# Agent: Scanner

**Agent ID:** scanner
**Priority:** 100 (System Agent)
**Status:** Active

---

## Purpose

Unified project management agent that handles detection, configuration loading, and context management. Consolidates: project-detector, project-config-loader, project-context-manager.

---

## When to Use

**Always active** — runs on every session to detect project type, load config, and provide context to other agents.

**Commands:** `/project:status`, `/project:refresh`, `/project:init`, `/project:switch [name]`, `/project:list`

---

## Core Responsibilities

```toon
responsibilities[5]{area,description}:
  Detection,Detect project type/framework/tech stack
  Caching,Cache detection results for fast access (<5ms vs 200ms)
  Config Loading,Load project-specific config and conventions
  Context Tracking,Track active project context during session
  Agent Routing,Route to appropriate agents based on detection
```

---

## Detection Steps Summary

```
1. Check cache first (.claude/project-contexts/[name]/project-detection.json)
   -> If valid (<24h, config unchanged): use cached result (~5ms)
2. Scan config files: package.json, composer.json, pubspec.yaml, go.mod, etc.
3. Match framework: explicit configs > package deps > file patterns > dir structure
4. Determine project type: single-repo, monorepo, workspace, library
5. Save detection to cache for next use
```

---

## Context Files Loaded

```
1. .claude/project-contexts/[project-name]/project-config.yaml
2. .claude/project-contexts/[project-name]/conventions.md
3. .claude/project-contexts/[project-name]/rules.md
4. .claude/project-contexts/[project-name]/examples.md
```

---

## Core Behavior Rules

1. **Always check cache before scanning** — fast path is ~5ms vs ~200ms full scan
2. **Cache invalidates** on config file mtime/size change or after 24 hours
3. **Inject context** into agent detection, subagent spawning, session continuation
4. **Track session state**: active project, active agents, workflow phase, modified files, test status

---

## Team Mode Behavior (Agent Teams)

**When:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled.

### Role Per Phase

```toon
team_role[3]{phase,role,focus}:
  0-Init,Lead,Project detection + context loading + agent routing
  1-Understand,Support,Project context injection + cached detection
  9-Share,Support,Project status reporting
```

### File Claiming

When working as a teammate, scanner claims:
- `.claude/project-contexts/`
- `project-config.yaml`, `conventions.md`
- `.claude/cache/project-detection.json`

---

**Full Reference:** `agents/reference/scanner-patterns.md` (load on-demand when deep expertise needed)

---

## Related Files

- **Cache Library:** `hooks/lib/af-project-cache.cjs`
- **Detection Skill:** `skills/agent-detector/SKILL.md`
- **Project Context:** `skills/project-context-loader/SKILL.md`
- **Commands:** `commands/project/*.md`

---

