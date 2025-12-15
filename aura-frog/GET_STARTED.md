<div align="center">

![Welcome to Aura Frog](../assets/logo/mascot_full.png)

# 🚀 Get Started with Aura Frog

### A Plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Code with main character energy** ✨

</div>

---

**Aura Frog** - A plugin for **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** that adds AI-powered project management with specialized agents and TDD workflows.

> **What is Claude Code?** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's agentic coding tool that operates in your terminal. Aura Frog extends it with structured 9-phase workflows.

| **24 Agents** | **26+ Skills** | **37 Rules** | **9 Phases** | **70+ Commands** |
|:-------------:|:-------------:|:------------:|:------------:|:---------------:|

---

## ⚡ Quick Setup (2 minutes)

### Prerequisites

1. **Install Claude Code** — Follow [Anthropic's installation guide](https://docs.anthropic.com/en/docs/claude-code)
2. **Start Claude Code** — Run `claude` in your terminal

### Step 1: Install Aura Frog Plugin

In the Claude Code terminal, run these commands:

**Add Aura Frog Marketplace (one-time):**
```bash
/plugin marketplace add nguyenthienthanh/aura-frog
```

**Install Aura Frog Plugin:**
```bash
/plugin install aura-frog@aurafrog
```

**That's it!** Aura Frog is now installed globally and available in all your Claude Code projects.

---

### Step 2: Verify Installation

Check that Aura Frog commands are available:
```bash
/help
```

You should see Aura Frog commands like:
- `workflow:start` - Start 9-phase workflow
- `workflow:status` - Check workflow progress
- `agent:list` - Show all available agents
- `bugfix:quick` - Quick bug fix
- `project:init` - Initialize project context

---

### Step 3: Initialize (Optional)

Configure for your project:

```
In Claude Code chat, type:

project:init
```

This will:
- Detect your project type
- Configure integrations (JIRA, Confluence, Slack)
- Set up team reviewers
- Create project-specific config

**Or skip and use defaults** - Aura Frog works out of the box!

---

## 🧪 Test Your Setup

### Test 1: Check Status
```
workflow:status
```

**Expected:** "No active workflow found" or current workflow status

---

### Test 2: Start Simple Task

**🆕 Using Skills (Natural Language):**
```
Analyze the current component structure
```

**Or using command:**
```
workflow:start Analyze the current component structure
```

**Expected:**
- **agent-detector** skill auto-invokes → Selects appropriate agent
- **workflow-orchestrator** skill auto-invokes → Starts 9-phase workflow
- Claude analyzes your code
- Shows Phase 1: Requirements Analysis
- Displays approval gate
- Waits for your response

---

### Test 3: Approve and Continue
```
workflow:approve
```

**Expected:**
- Proceeds to Phase 2: Technical Planning
- Shows next approval gate

---

## 📚 What's Next?

### Learn the Workflow

Read the guides:
- **`README.md`** - Complete user guide
- **`TESTING_GUIDE.md`** - How to test workflows
- **`docs/phases/`** - Detailed phase guides

### Start Your First Real Task

```
workflow:start Refactor [ComponentName] - split into smaller, maintainable components
```

or

```
workflow:start Add [feature] to [component]
```

### Configure Integrations

Edit `ccpm-config.yaml` to add:
- JIRA integration (ticket management)
- Confluence integration (documentation)
- Slack integration (notifications)
- Team reviewers

---

## 🎯 Common Commands

### Workflow Commands
- `workflow:start <task>` - Start new workflow
- `workflow:status` - Show current progress
- `workflow:approve` - Approve current phase
- `workflow:reject <reason>` - Reject and restart phase
- `workflow:modify <changes>` - Modify deliverables

### Phase Commands (Advanced)
- `workflow:phase:2` - Execute Phase 2 (Technical Planning)
- `workflow:phase:3` - Execute Phase 3 (Design Review)
- `workflow:phase:4` - Execute Phase 4 (Test Planning)
- `workflow:phase:5a` - Execute Phase 5a (Write Tests - TDD RED)
- `workflow:phase:5b` - Execute Phase 5b (Implementation - TDD GREEN)
- `workflow:phase:5c` - Execute Phase 5c (Refactor - TDD REFACTOR)
- `workflow:phase:6` - Execute Phase 6 (Code Review)
- `workflow:phase:7` - Execute Phase 7 (QA Validation)
- `workflow:phase:8` - Execute Phase 8 (Documentation)
- `workflow:phase:9` - Execute Phase 9 (Notification)

### Other Commands
- `project:init` - Initialize/reconfigure Aura Frog
- `project:reload-env` - Reload .envrc variables
- `help` - Show all available commands
- `agent:list` - Show all agents and their capabilities

---

## 🛠️ Advanced Setup

### Add to .gitignore

```bash
# Aura Frog - Exclude sensitive workflow data
logs/contexts/
logs/
workflow-state.json
.env
```

### Environment Variables (Optional)

Create `.envrc` for integrations:

```bash
# JIRA Integration
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your.email@example.com"
export JIRA_API_TOKEN="your-jira-api-token"

# Figma Integration
export FIGMA_API_TOKEN="your-figma-token"

# Confluence Integration
export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your.email@example.com"
export CONFLUENCE_API_TOKEN="your-confluence-api-token"

# Slack Integration
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

**Reload after editing:** `project:reload-env`

**Security:** Never commit `.envrc` file!

---

## 💡 How It Works

### 1. You Give a Command
```
workflow:start Refactor MyComponent
```

### 2. Claude Detects Command
- Reads `CLAUDE.md` for instructions
- Loads `commands/workflow/start.md`
- Activates relevant agents (dev, QA, UI designer)

### 3. Executes 9-Phase Workflow
```
Phase 1: Requirements Analysis → [Approval Gate]
Phase 2: Technical Planning → [Approval Gate]
Phase 3: Design Review → [Approval Gate]
Phase 4: Test Planning → [Approval Gate]
Phase 5: Implementation (TDD: RED → GREEN → REFACTOR) → [Approval Gates]
Phase 6: Code Review → [Approval Gate]
Phase 7: QA Validation → [Approval Gate]
Phase 8: Documentation → [Approval Gate]
Phase 9: Notification → [Auto-complete]
```

### 4. You Control Every Step
At each approval gate:
- Review deliverables
- Type `workflow:approve` to continue
- Type `workflow:reject <reason>` to redo
- Type `workflow:modify <changes>` to adjust

---

## ❓ Troubleshooting

### Claude doesn't recognize commands?

**Try being explicit:**
```
Please execute the workflow command: workflow:start <task>

Follow the steps in commands/workflow/start.md
```

### Need to reconfigure?

```
project:init
```

Choose "Reset configuration" option.

### Want to see all agents?

```
agent:list
```

---

## 🎉 You're Ready!

**Start building with AI-powered project management:**

```
workflow:start <your-task-description>
```

**Examples:**
- `workflow:start Analyze useSocialMediaPost hook and suggest improvements`
- `workflow:start Refactor SocialMarketingCompositePost - split into smaller components`
- `workflow:start Add error handling to API calls`
- `workflow:start Optimize performance of list rendering`

---

## 📞 Support

- **Documentation:** `README.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Skills:** `skills/README.md` (26+ skills)
- **Rules:** `rules/README.md` (37 quality rules)
- **Diagrams:** `docs/WORKFLOW_DIAGRAMS.md` (10 Mermaid diagrams)
- **Phase Guides:** `docs/phases/`

---

**Happy Coding! 🚀**

Type `workflow:start <task>` to begin your first workflow.

