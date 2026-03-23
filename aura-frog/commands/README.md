# Aura Frog Commands Directory

**Version:** 1.22.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Last Updated:** 2026-02-09

---

## New in 1.17.0 - Bundled Commands

Individual commands are now bundled into unified entry points with subcommand menus:

| Bundled Command | Replaces | Subcommands |
|-----------------|----------|-------------|
| `/workflow` | 16 workflow commands | start, status, phase, next, approve, handoff, resume |
| `/test` | 4 test commands | unit, e2e, coverage, watch, docs |
| `/project` | 7 project commands | status, refresh, init, switch, list, config, sync-settings |
| `/quality` | 3 quality commands | lint, complexity, review, fix |
| `/bugfix` | 3 bugfix commands | quick, full, hotfix |
| `/seo` | 3 seo commands | check, schema, geo |

**Benefits:** Interactive menus, auto-detection, reduced command memorization.

**Usage:** `/workflow` shows interactive menu, `/workflow start "task"` uses direct subcommand.

---

## Directory Structure

Commands are organized by category with naming convention: `category/action.md`

```
commands/
├── agent/              # Agent management (4 commands)
├── api/                # API operations (2 commands)
├── bugfix/             # Bug fixing workflows (3 commands)
├── db/                 # Database operations (2 commands)
├── deploy/             # Deployment & CI/CD (3 commands)
├── design/             # Design workflows (2 commands)
├── learn/              # Learning system (5 commands)
├── logs/               # Log operations (2 commands)
├── mcp/                # MCP server management (1 command)
├── monitor/            # Monitoring setup (2 commands)
├── perf/               # Performance optimization (4 commands)
├── plan/               # Active plan management (1 command)
├── planning/           # Planning & execution (3 commands)
├── project/            # Project operations (9 commands)
├── quality/            # Code quality (3 commands)
├── review/             # Code review (1 command)
├── security/           # Security scanning (3 commands)
├── seo/                # SEO & GEO optimization (3 commands) - NEW
├── setup/              # Setup & configuration (2 commands)
├── skill/              # Skill management (1 command)
├── test/               # Testing commands (4 commands)
├── workflow/           # Core workflow commands (16 commands)
├── document.md         # document (standalone)
├── execute.md          # execute (standalone)
├── help.md             # help (standalone)
└── refactor.md         # refactor (standalone)
```

---

## Commands Index (TOON)

```toon
commands[86]{category,command,file,description}:
  agent,agent:list,agent/list.md,List all available agents
  agent,agent:activate,agent/activate.md,Activate specific agent
  agent,agent:deactivate,agent/deactivate.md,Deactivate agent
  agent,agent:info,agent/info.md,Show agent details
  api,api:design,api/design.md,Design API endpoints
  api,api:test,api/test.md,Test API endpoints
  bugfix,bugfix,bugfix.md,Bundled bug fix menu (interactive)
  bugfix,bugfix:fix,bugfix/fix.md,Full 5-phase bug fix workflow
  bugfix,bugfix:quick,bugfix/quick.md,Quick bug fix (grouped phases)
  bugfix,bugfix:hotfix,bugfix/hotfix.md,Emergency production hotfix
  db,db:design,db/design.md,Design database schema
  db,db:optimize,db/optimize.md,Optimize database queries
  deploy,deploy:setup,deploy/setup.md,Setup deployment configuration
  deploy,deploy:docker-create,deploy/docker-create.md,Create Dockerfile
  deploy,deploy:cicd-create,deploy/cicd-create.md,Create CI/CD pipeline
  design,design:stitch,design/stitch.md,Generate Stitch AI design prompts
  design,design:stitch-review,design/stitch-review.md,Review Stitch export and integrate
  learn,learn:setup,learn/setup.md,Set up learning database schema
  learn,learn:status,learn/status.md,Show learning system status
  learn,learn:feedback,learn/feedback.md,Submit manual feedback
  learn,learn:analyze,learn/analyze.md,Run pattern analysis
  learn,learn:apply,learn/apply.md,Apply learned improvements
  logs,logs:analyze,logs/analyze.md,Analyze log files
  logs,logs:cleanup,logs/cleanup.md,Clean old log files and workflow data
  mcp,mcp:status,mcp/status.md,Show MCP server status
  monitor,monitor:setup,monitor/setup.md,Setup monitoring
  monitor,monitor:errors,monitor/errors.md,Monitor error tracking
  perf,perf:analyze,perf/analyze.md,Analyze performance
  perf,perf:bundle,perf/bundle.md,Analyze bundle size
  perf,perf:lighthouse,perf/lighthouse.md,Run Lighthouse audit
  perf,perf:optimize,perf/optimize.md,Optimize performance
  plan,plan:set,plan/set.md,Set active plan for workflow
  planning,planning,planning/plan.md,Create execution plan
  planning,planning:list,planning/list.md,List all saved plans
  planning,planning:refine,planning/refine.md,Update existing plan
  project,project,project.md,Bundled project menu (interactive)
  project,project:init,project/init.md,Initialize Aura Frog for project
  project,project:detect,project/detect.md,Auto-detect project type
  project,project:list,project/list.md,List indexed projects
  project,project:regen,project/regen.md,Re-generate project context
  project,project:refresh,project/refresh.md,Force re-scan project detection
  project,project:reload-env,project/reload-env.md,Load/reload .envrc variables
  project,project:status,project/status.md,Show project detection + context
  project,project:switch,project/switch.md,Switch between projects
  project,project:sync-settings,project/sync-settings.md,Sync plugin settings to project
  quality,quality,quality.md,Bundled quality menu (interactive)
  quality,quality:check,quality/check.md,Run code quality checks
  quality,quality:complexity,quality/complexity.md,Analyze code complexity
  quality,quality:debt,quality/debt.md,Analyze technical debt
  review,review:fix,review/fix.md,Auto-fix review issues
  security,security:audit,security/audit.md,Run security audit
  security,security:deps,security/deps.md,Scan dependency vulnerabilities
  security,security:scan,security/scan.md,Scan for security issues
  seo,seo,seo.md,Bundled SEO menu (interactive)
  seo,seo:check,seo/check.md,Full SEO/GEO audit
  seo,seo:schema,seo/schema.md,Validate structured data (Rich Results Test)
  seo,seo:geo,seo/geo.md,AI discovery optimization audit
  setup,setup:integrations,setup/integrations.md,Configure JIRA/Confluence/Slack/Figma
  setup,setup:activate,setup/activate.md,Activate project configuration
  skill,skill:create,skill/create.md,Create reusable skill
  test,test,test.md,Bundled test menu (interactive)
  test,test:unit,test/unit.md,Generate unit tests
  test,test:e2e,test/e2e.md,Generate E2E tests
  test,test:coverage,test/coverage.md,Check coverage + gaps
  test,test:document,test/document.md,Generate test documentation
  workflow,workflow,workflow.md,Bundled workflow menu (interactive)
  workflow,workflow:start,workflow/start.md,Start workflow
  workflow,workflow:status,workflow/status.md,Show workflow status
  workflow,workflow:approve,workflow/approve.md,Approve phase
  workflow,workflow:reject,workflow/reject.md,Reject phase
  workflow,workflow:modify,workflow/modify.md,Modify deliverables
  workflow,workflow:handoff,workflow/handoff.md,Save for session continuation
  workflow,workflow:resume,workflow/resume.md,Resume workflow
  workflow,workflow:progress,workflow/progress.md,Show progress
  workflow,workflow:metrics,workflow/metrics.md,Show metrics
  workflow,workflow:predict,workflow/predict.md,Predict token usage
  workflow,workflow:budget,workflow/budget.md,Manage workflow token budget
  workflow,workflow:phase-1,workflow/phase-1.md,Execute Phase 1 (Understand + Design)
  workflow,workflow:phase-2,workflow/phase-2.md,Execute Phase 2 (Test RED)
  workflow,workflow:phase-2-test,workflow/phase-2-test.md,Execute Phase 2 test scaffolding
  workflow,workflow:phase-3-green,workflow/phase-3-green.md,Execute Phase 3 (Build GREEN)
  workflow,workflow:phase-4-refactor,workflow/phase-4-refactor.md,Execute Phase 4 (Refactor + Review)
  standalone,document,document.md,Generate documentation
  standalone,execute,execute.md,Execute saved plan
  standalone,help,help.md,Show help and available commands
  standalone,refactor,refactor.md,Code refactoring workflow
```

---

## Statistics (TOON)

```toon
stats[22]{category,count}:
  workflow,17
  project,10
  agent,4
  test,5
  perf,4
  bugfix,4
  deploy,3
  learn,5
  planning,3
  quality,4
  security,3
  seo,4
  api,2
  db,2
  design,2
  monitor,2
  setup,2
  logs,2
  mcp,1
  plan,1
  review,1
  skill,1
  standalone,4
  total,86
```

---

## 🎯 Naming Convention

**Format:** `category:action`

```toon
examples[8]{command,file}:
  agent:list,agent/list.md
  bugfix:quick,bugfix/quick.md
  test:unit,test/unit.md
  workflow:start,workflow/start.md
  project:init,project/init.md
  document,document.md
  execute,execute.md
  refactor,refactor.md
```

---

## 🔍 How to Find Commands

```bash
# List all agent commands
ls commands/agent/

# List all test commands
ls commands/test/

# Find specific command
cat commands/bugfix/quick.md

# List all commands
find commands -name "*.md" -type f | sort
```

---

## 📝 Adding New Commands

1. Determine category (create folder if new)
2. Create file: `category/action.md`
3. Use template structure
4. Update `.claude-plugin/plugin.json`
5. Update this README

---

**Version:** 1.22.0 | **Format:** TOON
