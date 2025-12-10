# Aura Frog Commands Directory

**Version:** 1.1.6
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Last Updated:** 2025-12-10

---

## 📁 Directory Structure

Commands are organized by category with naming convention: `category/action.md`

```
commands/
├── agent/              # Agent management (4 commands)
├── bugfix/             # Bug fixing workflows (3 commands)
├── planning/           # Planning & execution (3 commands)
├── project/            # Project operations (6 commands)
├── review/             # Code review (1 command)
├── setup/              # Setup & configuration (2 commands)
├── skill/              # Skill management (1 command)
├── test/               # Testing commands (4 commands)
├── workflow/           # Core workflow commands (20 commands)
├── document.md         # document (standalone)
├── execute.md          # execute (standalone)
├── help.md             # help (standalone)
└── refactor.md         # refactor (standalone)
```

---

## 📊 Commands Index (TOON)

```toon
commands[48]{category,command,file,description}:
  agent,agent:list,agent/list.md,List all available agents
  agent,agent:activate,agent/activate.md,Activate specific agent
  agent,agent:deactivate,agent/deactivate.md,Deactivate agent
  agent,agent:info,agent/info.md,Show agent details
  bugfix,bugfix,bugfix/fix.md,Full 9-phase bug fix workflow
  bugfix,bugfix:quick,bugfix/quick.md,Quick bug fix (grouped phases)
  bugfix,bugfix:hotfix,bugfix/hotfix.md,Emergency production hotfix
  planning,planning,planning/plan.md,Create execution plan
  planning,planning:list,planning/list.md,List all saved plans
  planning,planning:refine,planning/refine.md,Update existing plan
  project,project:init,project/init.md,Initialize Aura Frog for project
  project,project:detect,project/detect.md,Auto-detect project type
  project,project:list,project/list.md,List indexed projects
  project,project:regen,project/regen.md,Re-generate project context
  project,project:reload-env,project/reload-env.md,Load/reload .envrc variables
  project,project:switch,project/switch.md,Switch between projects
  review,review:fix,review/fix.md,Auto-fix review issues
  setup,setup:integrations,setup/integrations.md,Configure JIRA/Confluence/Slack/Figma
  setup,setup:activate,setup/activate.md,Activate project configuration
  skill,skill:create,skill/create.md,Create reusable skill
  test,test:unit,test/unit.md,Generate unit tests
  test,test:e2e,test/e2e.md,Generate E2E tests
  test,test:coverage,test/coverage.md,Check coverage + gaps
  test,test:document,test/document.md,Generate test documentation
  workflow,workflow:start,workflow/start.md,Start workflow
  workflow,workflow:status,workflow/status.md,Show workflow status
  workflow,workflow:approve,workflow/approve.md,Approve phase
  workflow,workflow:reject,workflow/reject.md,Reject phase
  workflow,workflow:modify,workflow/modify.md,Modify deliverables
  workflow,workflow:handoff,workflow/handoff.md,Save for session continuation
  workflow,workflow:resume,workflow/resume.md,Resume workflow
  workflow,workflow:tokens,workflow/tokens.md,Show token usage
  workflow,workflow:progress,workflow/progress.md,Show progress
  workflow,workflow:metrics,workflow/metrics.md,Show metrics
  workflow,workflow:predict,workflow/predict.md,Predict token usage
  workflow,workflow:phase-2,workflow/phase-2.md,Execute Phase 2 (Design)
  workflow,workflow:phase-3,workflow/phase-3.md,Execute Phase 3 (UI)
  workflow,workflow:phase-4,workflow/phase-4.md,Execute Phase 4 (Test Plan)
  workflow,workflow:phase-5a,workflow/phase-5a.md,Execute Phase 5a (RED)
  workflow,workflow:phase-5b,workflow/phase-5b.md,Execute Phase 5b (GREEN)
  workflow,workflow:phase-5c,workflow/phase-5c.md,Execute Phase 5c (REFACTOR)
  workflow,workflow:phase-6,workflow/phase-6.md,Execute Phase 6 (Review)
  workflow,workflow:phase-7,workflow/phase-7.md,Execute Phase 7 (QA)
  workflow,workflow:phase-8,workflow/phase-8.md,Execute Phase 8 (Docs)
  workflow,workflow:phase-9,workflow/phase-9.md,Execute Phase 9 (Share)
  standalone,document,document.md,Generate documentation
  standalone,execute,execute.md,Execute saved plan
  standalone,refactor,refactor.md,Code refactoring workflow
```

---

## 📈 Statistics (TOON)

```toon
stats[11]{category,count}:
  agent,4
  bugfix,3
  planning,3
  project,6
  review,1
  setup,2
  skill,1
  test,4
  workflow,20
  standalone,4
  total,48
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

**Version:** 1.1.6 | **Format:** TOON
