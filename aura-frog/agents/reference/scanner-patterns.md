# Scanner Agent - Reference Patterns

**Source:** `agents/scanner.md`
**Load:** On-demand when deep project detection expertise needed

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
  project.godot,Godot engine,gamedev
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
    - tester

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
  Workflow phase,Current phase in 5-phase workflow
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

## Output Format

```markdown
**Project Detection**

**Project:** my-app
**Type:** single-repo
**Framework:** nextjs
**Package Manager:** pnpm

**Agents:**
- Primary: web-nextjs
- Secondary: backend-nodejs, tester

**Test Infrastructure:**
- Framework: vitest
- Config: vitest.config.ts
- Directories: tests/, __tests__/

**From Cache:** Yes (updated 2h ago)
```

---

## Integration with Agent Detector

```
1. Agent detector runs on every message
2. Agent detector calls scanner for context
3. Project-manager returns cached detection
4. Agent detector uses detection for agent scoring
5. Detected agent loads with project context
```

---

## Legacy Agents (Deprecated)

The following agents are now consolidated into scanner:
- `project-detector.md` -> Detection functionality
- `project-config-loader.md` -> Config loading functionality
- `project-context-manager.md` -> Context tracking functionality

These files remain for backwards compatibility but redirect to scanner.
