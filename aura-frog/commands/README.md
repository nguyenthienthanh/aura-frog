# Aura Frog Commands

**Total:** 26 command files (10 bundled + 16 standalone)

---

## Bundled Commands

Each file contains multiple sub-commands with interactive menus:

```toon
bundled[10]{command,subs,count}:
  /workflow,"start/status/approve/modify/reject/resume/handoff/rollback/predict/progress/budget/metrics",12
  /project,"init/detect/status/list/switch/refresh/regen/reload-env/sync-settings",9
  /learn,"status/feedback/analyze/apply/setup",5
  /test,"unit/e2e/coverage/document",4
  /bugfix,"fix/quick/hotfix",3
  /quality,"check/complexity/debt",3
  /security,"audit/scan/deps",3
  /perf,"analyze/bundle/lighthouse/optimize",4
  /metrics,"dashboard/hooks/performance/prompts-evaluate",4
  /deploy,"setup/cicd-create/docker-create",3
```

## Standalone Commands

```toon
standalone[16]{command,file,description}:
  help,help.md,Show help and available commands
  document,document.md,Generate feature/API/component documentation
  refactor,refactor.md,Structured code refactoring workflow
  agent:list,agent/list.md,List all available agents
  agent:info,agent/info.md,Show agent details and capabilities
  api:design,api/design.md,Design API endpoints + OpenAPI spec
  api:test,api/test.md,Generate API test suite
  db:design,db/design.md,Design database schema + ERD + migrations
  db:optimize,db/optimize.md,Query optimization + N+1 detection
  mcp:status,mcp/status.md,Show MCP server status
  plugin:update,plugin/update.md,Check for plugin updates
  review:fix,review/fix.md,Auto-fix code review issues
  setup:activate,setup/activate.md,Quick-activate Aura Frog for project
  setup:cli,setup/cli.md,Install af CLI globally
  setup:integrations,setup/integrations.md,Configure JIRA/Confluence/Slack/Figma
  skill:create,skill/create.md,Create reusable skill template
```

---

## Usage

Type any bundled command without a subcommand to see its interactive menu.
Example: `/workflow` shows menu, `/workflow:start "task"` runs directly.
