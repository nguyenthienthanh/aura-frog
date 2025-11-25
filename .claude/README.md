# 🚀 CCPM Team Agents System

**Comprehensive AI-Powered Project Management with Multi-Agent Collaboration, TDD Enforcement, and Quality Gates**

**Version:** 4.5.0  
**License:** MIT  
**Inspired by:** [duongdev/ccpm](https://github.com/duongdev/ccpm)

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Workflow Modes](#-workflow-modes)
- [Commands Reference](#-commands-reference)
- [Documentation](#-documentation)
- [Configuration](#-configuration)
- [Architecture](#-architecture)
- [Advanced Topics](#-advanced-topics)
- [Support & Contributing](#-support--contributing)

---

## ⚡ Quick Start

### 1. Initialize Project (Recommended)

```bash
project:init
```

This will:
- Auto-detect your project type and tech stack
- Create project context with conventions and rules
- Set up configuration files
- Enable workflows to follow your project rules

**📚 See:** [`.claude/commands/project/init.md`](commands/project/init.md) for details

### 2. Start Your First Workflow

```bash
workflow:start "Your task description"
```

### 3. Follow Approval Gates

At each phase, review and approve:
- `workflow:approve` - Continue to next phase
- `workflow:reject <reason>` - Restart current phase
- `workflow:modify <changes>` - Adjust deliverables

**📚 See:** [`.claude/GET_STARTED.md`](GET_STARTED.md) for complete quick start guide

---

## 🎯 Overview

CCPM (Claude Code Project Management) is an AI-powered project management system that uses **14 specialized agents** working through a **9-phase structured workflow** with **TDD enforcement** and **quality gates**.

### What You Get

- ✅ **14 Specialized Agents** - Auto-activated based on context
- ✅ **9-Phase Workflow** - From requirements to deployment
- ✅ **45 Commands** - Full workflow control
- ✅ **TDD Enforcement** - Tests before code, always
- ✅ **Quality Gates** - Human approval at every critical point
- ✅ **Multi-Project Support** - Unlimited projects with auto-detection
- ✅ **Project-Aware** - Follows your project conventions and rules
- ✅ **External Integrations** - JIRA, Confluence, Slack, Figma

---

## 🎨 Key Features

### Intelligent Agent Selection
Agents auto-activate based on your prompt:
- Mention "React Native" → `mobile-react-native` agent
- Mention "test" → `qa-automation` agent
- Mention "design" → `ui-designer` agent

**📚 See:** [`.claude/agents/`](agents/) for all agents

### TDD Enforcement
**RED → GREEN → REFACTOR cycle enforced:**
1. Write failing tests first
2. Implement to make tests pass
3. Refactor while keeping tests green

**📚 See:** [`.claude/rules/tdd-workflow.md`](rules/tdd-workflow.md) for TDD rules

### Quality Gates
Human approval required at every phase - no auto-progression!

**📚 See:** [`.claude/rules/approval-gates.md`](rules/approval-gates.md) for approval workflow

### Project Context System
Workflows automatically follow your project conventions, rules, and patterns.

**📚 See:** 
- [`.claude/docs/RULES_COMBINATION.md`](docs/RULES_COMBINATION.md) - How rules are combined
- [`.claude/project-contexts/README.md`](project-contexts/README.md) - Project context guide

---

## 🔄 Workflow Modes

CCPM supports **two workflow modes** for different needs:

### Full 9-Phase Workflow (High Quality)
```bash
workflow:start "Your complex task"
```
**Use for:** New features, complex changes, production code  
**Includes:** Requirements → Planning → Design → Testing → TDD → Review → QA → Docs → Notify  
**Time:** 2-4 hours  
**Quality:** Maximum ✅

**📚 See:** [`.claude/docs/phases/`](docs/phases/) for phase guides

### Lightweight Commands (Speed)
```bash
bugfix:quick "Simple fix"    # Quick bug fix (30 min)
refactor "file"              # Just refactor (1 hour)
planning "task"              # Just create plan (30 min)
document "feature"           # Just documentation (30 min)
```
**Use for:** Small bugs, documentation, simple refactors  
**Includes:** Only necessary phases  
**Time:** 30 min - 1 hour  
**Quality:** Good ✅

**📚 See:** [`.claude/docs/USAGE_GUIDE.md`](docs/USAGE_GUIDE.md) for usage examples

**CCPM automatically suggests the appropriate mode based on task complexity!**

---

## 📋 Commands Reference

### Core Workflow Commands

| Command | Description | Documentation |
|---------|-------------|--------------|
| `workflow:start <task>` | Start full 9-phase workflow | [commands/workflow/start.md](commands/workflow/start.md) |
| `workflow:status` | Show current workflow progress | [commands/workflow/status.md](commands/workflow/status.md) |
| `workflow:approve` | Approve current phase | [commands/workflow/approve.md](commands/workflow/approve.md) |
| `workflow:reject <reason>` | Reject and restart phase | [commands/workflow/reject.md](commands/workflow/reject.md) |
| `workflow:handoff` | Save for session continuation | [commands/workflow/handoff.md](commands/workflow/handoff.md) |
| `workflow:resume [id]` | Resume saved workflow | [commands/workflow/resume.md](commands/workflow/resume.md) |
| `workflow:tokens` | Show token usage | [commands/workflow/tokens.md](commands/workflow/tokens.md) |
| `workflow:progress` | Show progress metrics | [commands/workflow/progress.md](commands/workflow/progress.md) |

**📚 See:** [`.claude/commands/README.md`](commands/README.md) for complete command list

### Quick Commands

| Command | Description | Documentation |
|---------|-------------|--------------|
| `bugfix` | Full bug fix workflow | [commands/bugfix/fix.md](commands/bugfix/fix.md) |
| `bugfix:quick` | Quick bug fix | [commands/bugfix/quick.md](commands/bugfix/quick.md) |
| `bugfix:hotfix` | Emergency hotfix | [commands/bugfix/hotfix.md](commands/bugfix/hotfix.md) |
| `refactor` | Code refactoring | [commands/refactor.md](commands/refactor.md) |
| `planning` | Create execution plan | [commands/planning/plan.md](commands/planning/plan.md) |
| `document` | Generate documentation | [commands/document.md](commands/document.md) |

### Testing Commands

| Command | Description | Documentation |
|---------|-------------|--------------|
| `test:unit` | Generate unit tests | [commands/test/unit.md](commands/test/unit.md) |
| `test:e2e` | Generate E2E tests | [commands/test/e2e.md](commands/test/e2e.md) |
| `test:coverage` | Check coverage | [commands/test/coverage.md](commands/test/coverage.md) |
| `test:document` | Generate test docs | [commands/test/document.md](commands/test/document.md) |

**📚 See:** [`.claude/TESTING_GUIDE.md`](TESTING_GUIDE.md) for testing workflows

### Project Management Commands

| Command | Description | Documentation |
|---------|-------------|--------------|
| `project:init` | Initialize CCPM | [commands/project/init.md](commands/project/init.md) |
| `project:regen` | Re-generate context | [commands/project/regen.md](commands/project/regen.md) |
| `project:detect` | Detect project type | [commands/project/detect.md](commands/project/detect.md) |
| `project:list` | List projects | [commands/project/list.md](commands/project/list.md) |
| `project:switch` | Switch projects | [commands/project/switch.md](commands/project/switch.md) |

### Agent Commands

| Command | Description | Documentation |
|---------|-------------|--------------|
| `agent:list` | List all agents | [commands/agent/list.md](commands/agent/list.md) |
| `agent:activate` | Activate agent | [commands/agent/activate.md](commands/agent/activate.md) |
| `agent:deactivate` | Deactivate agent | [commands/agent/deactivate.md](commands/agent/deactivate.md) |
| `agent:info` | Show agent details | [commands/agent/info.md](commands/agent/info.md) |

**📚 See:** [`.claude/INDEX.md`](INDEX.md) for quick command reference

---

## 📚 Documentation

### Getting Started

- **[GET_STARTED.md](GET_STARTED.md)** - Complete quick start guide (5 minutes)
- **[INDEX.md](INDEX.md)** - Quick reference index for all commands and files
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - How to test workflows and commands

### Core Documentation

- **[CLAUDE.md](CLAUDE.md)** - AI instructions and behavior (for Claude Code AI)
- **[plugin.json](plugin.json)** - Plugin manifest and metadata

### Workflow & Phases

- **[docs/phases/](docs/phases/)** - Detailed phase guides
  - [PHASE_1_REQUIREMENTS_ANALYSIS.MD](docs/phases/PHASE_1_REQUIREMENTS_ANALYSIS.MD)
  - [PHASE_2_TECHNICAL_PLANNING.MD](docs/phases/PHASE_2_TECHNICAL_PLANNING.MD)
  - [PHASE_3_DESIGN_REVIEW.MD](docs/phases/PHASE_3_DESIGN_REVIEW.MD)
  - [PHASE_4_TEST_PLANNING.MD](docs/phases/PHASE_4_TEST_PLANNING.MD)
  - *More phase guides available*

### Usage Guides

- **[docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md)** - Comprehensive usage guide with examples
- **[docs/RULES_COMBINATION.md](docs/RULES_COMBINATION.md)** - How rules are combined (core + project)
- **[docs/WORKFLOW_STATE_MANAGEMENT.md](docs/WORKFLOW_STATE_MANAGEMENT.md)** - Multi-workflow state management
- **[docs/TOKEN_TRACKING.md](docs/TOKEN_TRACKING.md)** - Token usage and session management

### Integration Guides

- **[docs/INTEGRATION_ENV_SETUP.md](docs/INTEGRATION_ENV_SETUP.md)** - Environment setup for integrations
- **[docs/figma-mcp-integration.md](docs/figma-mcp-integration.md)** - Figma MCP integration
- **[docs/mcp-integration.md](docs/mcp-integration.md)** - General MCP setup

### Project Context

- **[project-contexts/README.md](project-contexts/README.md)** - Project context system guide
- **[project-contexts/[project-name]/](project-contexts/)** - Your project-specific context

### Rules & Conventions

- **[rules/](rules/)** - CCPM core rules (13 files)
  - [tdd-workflow.md](rules/tdd-workflow.md) - TDD enforcement
  - [safety-rules.md](rules/safety-rules.md) - Safety and security
  - [code-quality.md](rules/code-quality.md) - Code quality standards
  - [smart-commenting.md](rules/smart-commenting.md) - Commenting guidelines
  - [theme-consistency.md](rules/theme-consistency.md) - Theme usage
  - [direct-hook-access.md](rules/direct-hook-access.md) - Hook patterns
  - [correct-file-extensions.md](rules/correct-file-extensions.md) - File extensions
  - [git-workflow.md](rules/git-workflow.md) - Git conventions
  - [naming-conventions.md](rules/naming-conventions.md) - Naming patterns
  - [performance-rules.md](rules/performance-rules.md) - Performance guidelines
  - [kiss-avoid-over-engineering.md](rules/kiss-avoid-over-engineering.md) - Simplicity
  - [approval-gates.md](rules/approval-gates.md) - Approval workflow
  - [cross-review-workflow.md](rules/cross-review-workflow.md) - Review process

**📚 See:** [docs/RULES_COMBINATION.md](docs/RULES_COMBINATION.md) for how rules are combined

### Agents

- **[agents/](agents/)** - All 14 specialized agents
  - [mobile-react-native.md](agents/mobile-react-native.md) - React Native expert
  - [web-vuejs.md](agents/web-vuejs.md) - Vue.js expert
  - [web-reactjs.md](agents/web-reactjs.md) - React expert
  - [web-nextjs.md](agents/web-nextjs.md) - Next.js expert
  - [backend-laravel.md](agents/backend-laravel.md) - Laravel expert
  - [qa-automation.md](agents/qa-automation.md) - Testing expert
  - [ui-designer.md](agents/ui-designer.md) - UI/UX expert
  - *More agents available*

### Commands

- **[commands/README.md](commands/README.md)** - Complete commands directory guide
- **[commands/](commands/)** - All 45 commands organized by category

### Settings & Configuration

- **[settings.example.json](settings.example.json)** - Auto-approval settings template
- **[docs/SETTINGS_GUIDE.md](docs/SETTINGS_GUIDE.md)** - Settings customization guide

### Roadmap

- **[TODO.md](TODO.md)** - Feature roadmap (33 planned items)

---

## ⚙️ Configuration

### Basic Configuration

Edit `.claude/ccpm-config.yaml`:

```yaml
version: "4.5.0"
project_context: "your-project-name"

workflow:
  default_mode: "auto"
  test_coverage_target: 80
  tdd_enforcement: "strict"
  approval_gates: true

agents:
  auto_activate: true
  primary: "mobile-react-native"

integrations:
  jira:
    enabled: false
  confluence:
    enabled: false
  slack:
    enabled: false
```

**📚 See:** [`.claude/templates/ccpm-config.yaml.template`](templates/ccpm-config.yaml.template) for full template

### Environment Variables

Create `.claude/.envrc` (git-ignored) for integrations:

```bash
# JIRA Integration
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-jira-token"

# Confluence Integration
export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your-email@company.com"
export CONFLUENCE_API_TOKEN="your-confluence-token"

# Slack Integration
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

**📚 See:** [`.claude/docs/INTEGRATION_ENV_SETUP.md`](docs/INTEGRATION_ENV_SETUP.md) for complete setup guide

### Auto-Approval Settings

Edit `.claude/settings.local.json` to auto-approve common commands:

```json
{
  "autoApprove": {
    "commands": [
      "npm run lint",
      "npm run test",
      "npx tsc --noEmit"
    ]
  }
}
```

**📚 See:** [`.claude/docs/SETTINGS_GUIDE.md`](docs/SETTINGS_GUIDE.md) for settings guide

---

## 🏗️ Architecture

### Directory Structure

```
.claude/
├── agents/                # 14 specialized agents
├── commands/              # 45 workflow commands
│   ├── agent/            # Agent management (4)
│   ├── bugfix/           # Bug fixing (3)
│   ├── planning/         # Planning (3)
│   ├── project/          # Project management (5)
│   ├── test/             # Testing (4)
│   ├── workflow/         # Core workflows (20)
│   └── ...               # Other commands
├── docs/                  # Comprehensive documentation
│   ├── phases/           # Phase guides
│   ├── USAGE_GUIDE.md    # Usage examples
│   ├── RULES_COMBINATION.md
│   └── ...
├── hooks/                 # Conceptual automation hooks
├── rules/                 # 13 core quality rules
├── scripts/               # Helper scripts
├── skills/                # 25+ reusable capabilities
├── templates/             # Document templates
├── project-contexts/      # Project-specific configs
│   └── [project-name]/
│       ├── project-config.yaml
│       ├── conventions.md
│       ├── rules.md
│       └── examples.md
├── logs/                  # Auto-created runtime logs
│   ├── workflows/        # Execution logs
│   └── contexts/         # Deliverables
├── plans/                 # Saved execution plans
└── documents/             # Generated documentation
```

### 9-Phase Workflow

```
Phase 1: Requirements Analysis
    ↓
Phase 2: Technical Planning
    ↓
Phase 3: Design Review
    ↓
Phase 4: Test Planning
    ↓
Phase 5: Implementation (TDD)
    ├── 5a: RED - Write Failing Tests
    ├── 5b: GREEN - Implement Feature
    └── 5c: REFACTOR - Improve Code
    ↓
Phase 6: Code Review
    ↓
Phase 7: QA Validation
    ↓
Phase 8: Documentation
    ↓
Phase 9: Notification
```

**📚 See:** [`.claude/docs/phases/`](docs/phases/) for detailed phase guides

### Rules Combination

CCPM combines rules from multiple sources:

```
Project Context Rules > CCPM Core Rules > Generic Defaults
```

**How it works:**
1. Load ALL rules from `.claude/rules/` (13 core rules - universal)
2. Load project rules from `project-contexts/[project]/rules.md`
3. Merge: Project rules override core rules where they conflict
4. Result: Combined ruleset applied to workflow

**📚 See:** [`.claude/docs/RULES_COMBINATION.md`](docs/RULES_COMBINATION.md) for detailed explanation

---

## 🚀 Advanced Topics

### Session Continuation

For long workflows near the 200K token limit:

```bash
workflow:handoff    # Save current state
# ... in new session ...
workflow:resume [id] # Continue from saved state
```

**📚 See:** 
- [`.claude/docs/TOKEN_TRACKING.md`](docs/TOKEN_TRACKING.md) - Token management
- [`.claude/commands/workflow/handoff.md`](commands/workflow/handoff.md) - Handoff command
- [`.claude/commands/workflow/resume.md`](commands/workflow/resume.md) - Resume command

### Multi-Workflow State Management

Each workflow maintains its own state in `logs/workflows/[workflow-id]/workflow-state.json`.

**📚 See:** [`.claude/docs/WORKFLOW_STATE_MANAGEMENT.md`](docs/WORKFLOW_STATE_MANAGEMENT.md) for details

### Project Context System

Project context makes workflows project-aware:
- Follows your file naming conventions
- Uses your tech stack versions
- Applies your project rules
- Assigns correct reviewers

**📚 See:** 
- [`.claude/project-contexts/README.md`](project-contexts/README.md) - Project context guide
- [`.claude/commands/project/init.md`](commands/project/init.md) - Initialize project context
- [`.claude/commands/project/regen.md`](commands/project/regen.md) - Re-generate context

### Integration Setup

Set up JIRA, Confluence, Slack, and Figma integrations:

```bash
setup:integrations
```

**📚 See:** 
- [`.claude/docs/INTEGRATION_ENV_SETUP.md`](docs/INTEGRATION_ENV_SETUP.md) - Complete setup guide
- [`.claude/commands/setup/integrations.md`](commands/setup/integrations.md) - Setup command

---

## 🆚 How CCPM Compares

| Feature | Traditional PM | CCPM Team Agents |
|---------|---------------|------------------|
| **Task Management** | Manual JIRA/Linear | AI-powered with 9 phases |
| **Agent Selection** | Manual | Auto-selects from 14 agents |
| **Testing** | Optional | TDD enforced (RED→GREEN→REFACTOR) |
| **Code Review** | Manual PR request | Auto-invoked with cross-review |
| **Workflow** | Context switching | CLI-first with commands |
| **Quality Gates** | Ad-hoc | Built-in enforcement |
| **Documentation** | Manual | Auto-generated (Confluence + MD) |
| **Multi-Project** | Separate setups | Single config for all projects |
| **Project Awareness** | Generic | Follows project conventions |

**Result:** CCPM saves 60-70% of PM overhead while improving quality.

---

## 🤝 Support & Contributing

### Getting Help

- **Documentation:** `.claude/docs/`
- **Quick Reference:** `.claude/INDEX.md`
- **Issues:** Report bugs or request features
- **Discussions:** Ask questions and share ideas

### Contributing

Contributions welcome! See guidelines for:
- Reporting bugs
- Suggesting features
- Submitting code improvements
- Improving documentation
- Sharing custom skills and agents

### Ways to Contribute

- ✅ Report bugs
- ✅ Suggest features
- ✅ Submit code improvements
- ✅ Improve documentation
- ✅ Share custom skills and agents

---

## 📄 License

MIT License - See LICENSE for details

---

## 🙏 Acknowledgments

- **Claude Code** - AI-powered development platform
- **duongdev/ccpm** - Original inspiration and architecture
- **CCPM Contributors** - Development and testing

---

## 🎉 What Makes CCPM Different?

✅ **14 Specialized Agents** - Auto-activated based on context  
✅ **9-Phase Workflow** - From requirements to deployment  
✅ **45 Commands** - Full workflow control  
✅ **TDD Enforcement** - Tests before code, always enforced  
✅ **Quality Gates** - Human approval at every critical point  
✅ **Project-Aware** - Follows your project conventions and rules  
✅ **Multi-Project** - Unlimited projects with auto-detection  
✅ **External Integrations** - JIRA, Confluence, Slack, Figma ready  
✅ **Command-Based** - Flexible command syntax  
✅ **Safety First** - Confirmation prompts for external writes  
✅ **Comprehensive Docs** - 50+ guides and references  
✅ **Open Source** - MIT licensed, contributions welcome  

---

**Transform your development workflow with intelligent automation.**

🚀 **Get started:** `workflow:start <your-task>`  
📚 **Learn more:** `.claude/GET_STARTED.md`  
🧪 **Test it:** `.claude/TESTING_GUIDE.md`  
📋 **Quick reference:** `.claude/INDEX.md`

---

*nguyenthienthanh - Built with ❤️ for development teams*
