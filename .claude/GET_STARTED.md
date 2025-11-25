# 🚀 Get Started with CCPM

**CCPM Team Agents System** - AI-powered project management for development teams

---

## ⚡ Quick Setup (2 minutes)

### Step 1: Install CCPM

Copy the `.claude` directory to your project root:

**Option A: From GitHub (Recommended)**
```bash
cd /path/to/your/project
curl -sL https://github.com/your-org/ccpm/archive/main.tar.gz | tar xz --strip-components=1 ccpm-main/.claude
```

**Option B: Manual Copy**
```bash
# Clone CCPM repository
git clone https://github.com/your-org/ccpm.git /tmp/ccpm

# Copy .claude directory to your project
cp -r /tmp/ccpm/.claude /path/to/your/project/

# Cleanup
rm -rf /tmp/ccpm
```

**Option C: Direct Download**
1. Download: https://github.com/your-org/ccpm/archive/main.zip
2. Extract the zip file
3. Copy `.claude` folder to your project root

---

### Step 2: Verify Installation

Check that these files exist:
```
your-project/
├── .claude/
│   ├── CLAUDE.md          ✅ AI instructions
│   ├── README.md           ✅ Human guide
│   ├── ccpm-config.yaml    ✅ Configuration
│   ├── agents/             ✅ 14 specialized agents
│   ├── commands/           ✅ Workflow commands
│   ├── rules/              ✅ Quality & TDD rules
│   ├── hooks/              ✅ Pre/post phase hooks
│   ├── skills/             ✅ Reusable capabilities
│   ├── scripts/            ✅ Automation helpers
│   └── docs/               ✅ Detailed guides
```

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

**Or skip and use defaults** - CCPM works out of the box!

---

## 🧪 Test Your Setup

### Test 1: Check Status
```
workflow:status
```

**Expected:** "No active workflow found" or current workflow status

---

### Test 2: Start Simple Task
```
workflow:start Analyze the current component structure
```

**Expected:** 
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
- **`.claude/README.md`** - Complete user guide
- **`.claude/TESTING_GUIDE.md`** - How to test workflows
- **`.claude/docs/phases/`** - Detailed phase guides

### Start Your First Real Task

```
workflow:start Refactor [ComponentName] - split into smaller, maintainable components
```

or

```
workflow:start Add [feature] to [component]
```

### Configure Integrations

Edit `.claude/ccpm-config.yaml` to add:
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
- `project:init` - Initialize/reconfigure CCPM
- `help` - Show all available commands
- `agent:list` - Show all agents and their capabilities

---

## 🛠️ Advanced Setup

### Add to .gitignore

```bash
# CCPM - Exclude sensitive workflow data
.claude/logs/contexts/
.claude/logs/
.claude/workflow-state.json
.claude/.env
```

### Environment Variables (Optional)

Create `.claude/.env` for integrations:

```bash
# JIRA Integration
JIRA_EMAIL="your.email@example.com"
JIRA_API_TOKEN="your-jira-api-token"

# Confluence Integration
CONFLUENCE_EMAIL="${JIRA_EMAIL}"
CONFLUENCE_API_TOKEN="${JIRA_API_TOKEN}"

# Slack Integration
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

**Security:** Never commit `.env` file!

---

## 💡 How It Works

### 1. You Give a Command
```
workflow:start Refactor MyComponent
```

### 2. Claude Detects Command
- Reads `.claude/CLAUDE.md` for instructions
- Loads `.claude/commands/workflow/start.md`
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

Follow the steps in .claude/commands/workflow/start.md
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

- **Documentation:** `.claude/README.md`
- **Testing Guide:** `.claude/TESTING_GUIDE.md`
- **Architecture:** `.claude/docs/architecture/overview.md`
- **Phase Guides:** `.claude/docs/phases/`

---

**Happy Coding! 🚀**

Type `workflow:start <task>` to begin your first workflow.

