# Aura Frog Commands Directory

**Version:** 1.1.0
**Last Updated:** 2025-12-04

---

## 📁 Directory Structure

Commands are organized by category with naming convention: `category/action.md`

```
commands/
├── agent/              # Agent management (4 commands)
│   ├── activate.md     # agent:activate
│   ├── deactivate.md   # agent:deactivate
│   ├── info.md         # agent:info
│   └── list.md         # agent:list
│
├── bugfix/             # Bug fixing workflows (3 commands)
│   ├── fix.md          # bugfix (full 9-phase)
│   ├── quick.md        # bugfix:quick
│   └── hotfix.md       # bugfix:hotfix
│
├── planning/           # Planning & execution (3 commands)
│   ├── plan.md         # planning
│   ├── list.md         # planning:list
│   └── refine.md       # planning:refine
│
├── project/            # Project operations (6 commands)
│   ├── detect.md       # project:detect
│   ├── init.md         # project:init
│   ├── list.md         # project:list
│   ├── regen.md        # project:regen
│   ├── reload-env.md   # project:reload-env
│   └── switch.md       # project:switch
│
├── review/             # Code review (1 command)
│   └── fix.md          # review:fix
│
├── setup/              # Setup & configuration (1 command)
│   └── integrations.md # setup:integrations
│
├── skill/              # Skill management (1 command)
│   └── create.md       # skill:create
│
├── test/               # Testing commands (4 commands)
│   ├── unit.md         # test:unit
│   ├── e2e.md          # test:e2e
│   ├── coverage.md     # test:coverage
│   └── document.md     # test:document
│
├── workflow/           # Core workflow commands (20 commands)
│   ├── start.md        # workflow:start
│   ├── status.md       # workflow:status
│   ├── approve.md      # workflow:approve
│   ├── reject.md       # workflow:reject
│   ├── modify.md       # workflow:modify
│   ├── handoff.md      # workflow:handoff
│   ├── resume.md       # workflow:resume
│   ├── tokens.md       # workflow:tokens
│   ├── progress.md     # workflow:progress
│   ├── metrics.md      # workflow:metrics
│   ├── phase-2.md      # workflow:phase-2
│   ├── phase-3.md      # workflow:phase-3
│   ├── phase-4.md      # workflow:phase-4
│   ├── phase-5a.md     # workflow:phase-5a
│   ├── phase-5b.md     # workflow:phase-5b
│   ├── phase-5c.md     # workflow:phase-5c
│   ├── phase-6.md      # workflow:phase-6
│   ├── phase-7.md      # workflow:phase-7
│   ├── phase-8.md      # workflow:phase-8
│   └── phase-9.md      # workflow:phase-9
│
├── document.md         # document (standalone)
├── execute.md          # execute (standalone)
├── help.md             # help (standalone)
└── refactor.md         # refactor (standalone)
```

---

## 📊 Commands by Category

### Agent Commands (4)
| Command | File | Description |
|---------|------|-------------|
| `agent:list` | `agent/list.md` | List all available agents |
| `agent:activate` | `agent/activate.md` | Activate specific agent |
| `agent:deactivate` | `agent/deactivate.md` | Deactivate agent |
| `agent:info` | `agent/info.md` | Show agent details |

### Bug Fixing (3)
| Command | File | Description |
|---------|------|-------------|
| `bugfix` | `bugfix/fix.md` | Full 9-phase bug fix workflow |
| `bugfix:quick` | `bugfix/quick.md` | Quick bug fix (grouped phases) |
| `bugfix:hotfix` | `bugfix/hotfix.md` | Emergency production hotfix |

### Planning (3)
| Command | File | Description |
|---------|------|-------------|
| `planning` | `planning/plan.md` | Create execution plan |
| `planning:list` | `planning/list.md` | List all saved plans |
| `planning:refine` | `planning/refine.md` | Update existing plan |

### Project Management (6)
| Command | File | Description |
|---------|------|-------------|
| `project:init` | `project/init.md` | Initialize Aura Frog for project |
| `project:detect` | `project/detect.md` | Auto-detect project type |
| `project:list` | `project/list.md` | List indexed projects |
| `project:regen` | `project/regen.md` | Re-generate project context |
| `project:reload-env` | `project/reload-env.md` | Load/reload .envrc variables |
| `project:switch` | `project/switch.md` | Switch between projects |

### Code Review (1)
| Command | File | Description |
|---------|------|-------------|
| `review:fix` | `review/fix.md` | Auto-fix review issues |

### Setup (1)
| Command | File | Description |
|---------|------|-------------|
| `setup:integrations` | `setup/integrations.md` | Configure JIRA/Confluence/Slack/Figma |

### Skills (1)
| Command | File | Description |
|---------|------|-------------|
| `skill:create` | `skill/create.md` | Create reusable skill |

### Testing (4)
| Command | File | Description |
|---------|------|-------------|
| `test:unit` | `test/unit.md` | Generate unit tests |
| `test:e2e` | `test/e2e.md` | Generate E2E tests |
| `test:coverage` | `test/coverage.md` | Check coverage & gaps |
| `test:document` | `test/document.md` | Generate test documentation |

### Workflow (20)
| Command | File | Description |
|---------|------|-------------|
| `workflow:start` | `workflow/start.md` | Start workflow |
| `workflow:status` | `workflow/status.md` | Show workflow status |
| `workflow:approve` | `workflow/approve.md` | Approve phase |
| `workflow:reject` | `workflow/reject.md` | Reject phase |
| `workflow:modify` | `workflow/modify.md` | Modify deliverables |
| `workflow:handoff` | `workflow/handoff.md` | Save for session continuation |
| `workflow:resume` | `workflow/resume.md` | Resume workflow |
| `workflow:tokens` | `workflow/tokens.md` | Show token usage |
| `workflow:progress` | `workflow/progress.md` | Show progress |
| `workflow:metrics` | `workflow/metrics.md` | Show metrics |
| `workflow:phase-2` to `workflow:phase-9` | `workflow/phase-*.md` | Execute specific phases |

### Standalone Commands (4 files, 7 commands)
| Command | File | Description |
|---------|------|-------------|
| `document` | `document.md` | Generate documentation |
| `execute` | `execute.md` | Execute saved plan |
| `refactor` | `refactor.md` | Code refactoring workflow |
| `refactor:analyze` | `refactor.md` | Generate analysis document only |
| `refactor:plan` | `refactor.md` | Generate implementation plan only |
| `refactor:docs` | `refactor.md` | Generate both analysis + plan |
| `help` | `help.md` | Show all commands |

---

## 🎯 Naming Convention

**Format:** `category:action`

**Examples:**
- ✅ `agent:list` → `agent/list.md`
- ✅ `bugfix:quick` → `bugfix/quick.md`
- ✅ `test:unit` → `test/unit.md`
- ✅ `workflow:start` → `workflow/start.md`
- ✅ `project:init` → `project/init.md`

**Standalone commands** (no category):
- ✅ `document` → `document.md`
- ✅ `execute` → `execute.md`
- ✅ `refactor` → `refactor.md`
- ✅ `help` → `help.md`

---

## 📈 Statistics

- **Total Commands:** 70+
- **Categories:** 9 folders + 4 standalone
- **Agent:** 4 commands
- **Bugfix:** 3 commands
- **Planning:** 3 commands
- **Project:** 6 commands
- **Review:** 1 command
- **Setup:** 2 commands
- **Skill:** 1 command
- **Test:** 4 commands
- **Workflow:** 20 commands
- **Standalone:** 4 commands
- **Other categories:** See full directory listing

---

## 🔍 How to Find Commands

### By Category
```bash
# List all agent commands
ls commands/agent/

# List all test commands
ls commands/test/

# List all workflow commands
ls commands/workflow/
```

### By Name
```bash
# Find bugfix:quick command
cat commands/bugfix/quick.md

# Find test:unit command
cat commands/test/unit.md
```

### All Commands
```bash
# List all commands
find commands -name "*.md" -type f | sort
```

---

## 📝 Adding New Commands

**Follow naming convention:**

1. Determine category (create folder if new)
2. Create file: `category/action.md`
3. Use template structure
4. Update `.claude-plugin/plugin.json`
5. Update this README

**Example: Adding `deploy:staging` command**

```bash
# 1. Create deploy folder (if not exists)
mkdir -p commands/deploy

# 2. Create command file
touch commands/deploy/staging.md

# 3. Edit file with command definition

# 4. Update plugin.json to add command reference

# 5. Update this README
```

---

**Last Updated:** 2025-12-01
**Maintained By:** Aura Frog Team

