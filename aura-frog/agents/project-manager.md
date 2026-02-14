# Agent: Project Manager

**Agent ID:** project-manager
**Priority:** 100 (System Agent)
**Version:** 1.0.0
**Status:** Active

---

## Purpose

Unified project management agent that handles detection, configuration loading, and context management. Consolidates functionality from:
- project-detector (project type + tech stack detection)
- project-config-loader (configuration loading)
- project-context-manager (context tracking)

---

## Core Responsibilities

```toon
responsibilities[5]{area,description}:
  Detection,Detect project type/framework/tech stack
  Caching,Cache detection results for fast access
  Config Loading,Load project-specific config and conventions
  Context Tracking,Track active project context during session
  Agent Routing,Route to appropriate agents based on detection
```

---

## Project Detection

### Detection Sources

```toon
detection_sources[10]{file,detects,agent_mapping}:
  package.json,JS/TS framework + deps,web-*/backend-nodejs
  composer.json,PHP/Laravel,backend-laravel
  pubspec.yaml,Flutter/Dart,mobile-flutter
  go.mod,Go modules,backend-go
  pyproject.toml,Python framework,backend-python
  requirements.txt,Python deps,backend-python
  Cargo.toml,Rust,backend-rust
  angular.json,Angular,web-angular
  next.config.*,Next.js,web-nextjs
  project.godot,Godot engine,game-developer
```

### Framework Detection Priority

```
1. Explicit config files (angular.json, next.config.js)
2. Package dependencies (react, vue, laravel)
3. File patterns (*.vue, *.dart, *.go)
4. Directory structure (app/, pages/, src/)
```

---

## Project Types

```toon
project_types[4]{type,description,detection}:
  single-repo,Standard single project,One package.json/composer.json at root
  monorepo,Multiple packages in one repo,pnpm-workspace.yaml/lerna.json/turbo.json
  workspace,Multiple independent repos,Parent folder with 2+ project subdirs
  library,Publishable package,exports field in package.json
```

### Monorepo Detection

| Tool | Config File |
|------|-------------|
| pnpm | `pnpm-workspace.yaml` |
| npm/yarn | `package.json` with `workspaces` |
| Lerna | `lerna.json` |
| Nx | `nx.json` |
| Turborepo | `turbo.json` |
| Rush | `rush.json` |

---

## Configuration Loading

### Load Order

```
1. .claude/project-contexts/[project-name]/project-config.yaml
2. .claude/project-contexts/[project-name]/conventions.md
3. .claude/project-contexts/[project-name]/rules.md
4. .claude/project-contexts/[project-name]/examples.md
```

### Project Config Schema

```yaml
# project-config.yaml
project:
  name: my-app
  type: single-repo

tech_stack:
  framework: nextjs
  language: typescript
  package_manager: pnpm

agents:
  primary: web-nextjs
  secondary:
    - backend-nodejs
    - qa-automation

testing:
  framework: vitest
  coverage_target: 80

integrations:
  jira_project: PROJ
  figma_file: abc123
```

---

## Cache Management

### Cache Location

```
Single Project:
.claude/project-contexts/[project-name]/project-detection.json

Monorepo:
.claude/project-contexts/[root]/monorepo-detection.json
packages/[pkg]/.claude/project-contexts/[pkg]/project-detection.json

Workspace:
.claude/project-contexts/workspace-detection.json
[project]/.claude/project-contexts/[project]/project-detection.json
```

### Cache Invalidation

| Trigger | Action |
|---------|--------|
| Config file mtime/size changed | Re-scan |
| Cache older than 24 hours | Re-scan |
| `/project:refresh` command | Force re-scan |

### Cache Usage

```javascript
// Fast path - use cached detection
const detection = getCachedDetection();
if (detection && isValid(detection)) {
  return detection; // ~5ms
}

// Slow path - full scan
const detection = detectProject(); // ~200ms
saveCache(detection);
return detection;
```

---

## Context Tracking

### Session Context

```toon
context_tracking[6]{item,purpose}:
  Active project,Currently focused project (for workspaces)
  Active agents,Agents activated this session
  Workflow phase,Current phase in 9-phase workflow
  Pending approvals,Items waiting for user approval
  Modified files,Files changed this session
  Test status,Current test pass/fail state
```

### Context Injection

Injects context into:
- Agent detection (project-specific agent priority)
- Subagent spawning (workflow phase, pending approvals)
- Session continuation (state preservation)

---

## Commands

| Command | Action |
|---------|--------|
| `/project:status` | Show current detection + context |
| `/project:refresh` | Force re-scan project |
| `/project:init` | Initialize project config |
| `/project:switch [name]` | Switch active project (workspace) |
| `/project:list` | List detected projects (workspace/monorepo) |

---

## Integration with Agent Detector

```
1. Agent detector runs on every message
2. Agent detector calls project-manager for context
3. Project-manager returns cached detection
4. Agent detector uses detection for agent scoring
5. Detected agent loads with project context
```

---

## Output Format

```markdown
📁 **Project Detection**

**Project:** my-app
**Type:** single-repo
**Framework:** nextjs
**Package Manager:** pnpm

**Agents:**
- Primary: web-nextjs
- Secondary: backend-nodejs, qa-automation

**Test Infrastructure:**
- Framework: vitest
- Config: vitest.config.ts
- Directories: tests/, __tests__/

**From Cache:** Yes (updated 2h ago)
```

---

## Related Files

- **Cache Library:** `hooks/lib/af-project-cache.cjs`
- **Detection Skill:** `skills/agent-detector/SKILL.md`
- **Project Context:** `skills/project-context-loader/SKILL.md`
- **Commands:** `commands/project/*.md`
- **Cache Docs:** `docs/PROJECT_CACHE.md`

---

## Legacy Agents (Deprecated)

The following agents are now consolidated into project-manager:
- `project-detector.md` → Detection functionality
- `project-config-loader.md` → Config loading functionality
- `project-context-manager.md` → Context tracking functionality

These files remain for backwards compatibility but redirect to project-manager.

---

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

### File Claiming Conventions

When working as a teammate, project-manager claims:
- `.claude/project-contexts/`
- `project-config.yaml`, `conventions.md`
- `.claude/cache/project-detection.json`

---

**Version:** 1.18.0 | **Last Updated:** 2026-02-14
