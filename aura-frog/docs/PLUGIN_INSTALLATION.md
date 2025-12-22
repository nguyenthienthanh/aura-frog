# 📦 Aura Frog Plugin Installation Guide

**Official Claude Code Plugin Installation for Aura Frog Team Agents**

---

## 🚀 Quick Installation

### Method 1: Using Claude Code Plugin Commands (Recommended)

**Step 1: Add Aura Frog Marketplace (one-time setup)**
```bash
/plugin marketplace add nguyenthienthanh/aura-frog
```

This registers the Aura Frog repository as a plugin marketplace on your machine.

**Step 2: Install Aura Frog Plugin**
```bash
/plugin install aura-frog@aurafrog
```

This installs the Aura Frog plugin from the marketplace you just added.

**Explanation of install command:**
- `aura-frog` = plugin name (what you're installing)
- `aurafrog` = marketplace name (where it comes from)

**Important:** Step 1 is only needed once per machine. After adding the marketplace, you can:
- Install: `/plugin install aura-frog@aurafrog`
- Update: `/plugin update aura-frog@aurafrog`
- Reinstall: `/plugin uninstall aura-frog@aurafrog` then install again

All without re-adding the marketplace!

**Step 3: Create Local Settings (REQUIRED)**

**⚠️ CRITICAL:** The plugin requires `settings.local.json` to function properly.

```bash
cd ~/.claude/plugins/marketplaces/aurafrog/aura-frog/
cp settings.example.json settings.local.json
```

**Why Required:**
- Controls Claude Code permissions (auto-approve, allowed domains)
- Git-ignored for security (not included in plugin)
- Must be created manually after installation

**Step 4: Activate in Your Project (CRITICAL)**

**⚠️ IMPORTANT:** The plugin is installed globally, but you need to **activate it in each project** where you want to use Aura Frog.

**Option A: Quick Activation (Recommended)**
```bash
# In your project directory, run:
setup:activate
```

This creates `.claude/CLAUDE.md` with the Aura Frog banner format and instructions.

**Option B: Full Project Setup**
```bash
# For complete project context setup:
project:init
```

This creates full project context including conventions, rules, and examples.

**Why Activation is Required:**
- Claude Code loads `.claude/CLAUDE.md` at session start
- Without it, you get vanilla Claude Code responses (no Aura Frog banner)
- The plugin provides commands/agents, but the CLAUDE.md tells Claude to USE them

**Step 5: Verify Installation**
```bash
# Start a NEW Claude Code session (important!)
# Then type:
how are you

# You should see the Aura Frog banner:
# ⚡ 🐸 AURA FROG v1.0.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ┃ Agent: [agent] │ Phase: -                          ┃
# ┃ Model: [model] │ 🔥 [aura-message]                                   ┃
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**✅ Done!** Aura Frog is now installed and activated!

---

## 📋 Installation Details

### What Gets Installed

When you install the Aura Frog plugin, the following components are added to your project:

**Directory Structure:**
```
your-project/
├── aura-frog/
│   ├── CLAUDE.md                 # AI instructions
│   ├── README.md                 # User guide
│   ├── GET_STARTED.md            # Quick start
│   ├── agents/                   # Specialized agents
│   ├── commands/                 # 13 workflow commands
│   ├── skills/                   # 5 reusable skills
│   ├── hooks/                    # 4 workflow hooks
│   ├── rules/                    # 13 quality rules
│   ├── docs/                     # Documentation
│   ├── templates/                # Document templates
│   ├── scripts/                  # Bash integrations
│   └── .claude/project-contexts/         # Project configs
└── .claude-plugin/
    ├── plugin.json               # Plugin manifest
    └── marketplace.json          # Marketplace metadata
```

**Components Registered:**
- ✅ **13 Commands**: workflow:start, workflow:status, bugfix:quick, etc.
- ✅ **Agents**: mobile-react-native, backend-nodejs, security-expert, etc.
- ✅ **20 Skills**: test-writer, code-reviewer, workflow-orchestrator, etc.
- ✅ **4 Hooks**: PrePhase, PostPhase, PreApproval, PostApproval

---

## ⚙️ Post-Installation Setup

### 1. Configure Integrations (Optional)

Aura Frog supports optional integrations with external services:

**Edit `.envrc`:**
```bash
# Navigate to your project
cd /path/to/your/project

# Copy template
cp .envrc.template .envrc

# Edit with your credentials
nano .envrc
```

**Configuration Options:**
```bash
# JIRA Integration
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-jira-api-token"
export JIRA_PROJECT_KEY="PROJ"

# Figma Integration
export FIGMA_API_TOKEN="figd_your-personal-access-token"
export FIGMA_FILE_KEY="your-file-key"

# Slack Integration
export SLACK_BOT_TOKEN="xoxb-your-slack-bot-token"
export SLACK_CHANNEL_ID="C1234567890"

# Confluence Integration
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your-email@company.com"
export CONFLUENCE_API_TOKEN="your-confluence-api-token"
export CONFLUENCE_SPACE_KEY="TEAM"
```

**Load Configuration:**
```bash
source .envrc
```

### 2. Initialize Project Context

Aura Frog uses project-specific context to provide better suggestions:

```bash
# Auto-detect project type and create context
/project:detect

# Or manually initialize
/project:init
```

This creates:
- `project-config.yaml` - Tech stack, team info, configuration
- `conventions.md` - Coding conventions, naming patterns
- `rules.md` - Project-specific quality rules (optional)
- `examples.md` - Code examples (optional)

### 3. Verify Setup

```bash
# Test Aura Frog with a simple workflow
/workflow:start "Add console.log to test Aura Frog"

# Expected output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🎯 Phase 1: Understand - Starting...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔄 Plugin Management

### Update Plugin

```bash
# Update to latest version
/plugin update aura-frog

# Or update all plugins
/plugin update-all
```

### Uninstall Plugin

```bash
# Remove Aura Frog plugin
/plugin uninstall aura-frog

# This removes:
# - .claude-plugin/ directory
# - Plugin commands from Claude Code
# - Plugin agents from Claude Code
```

**Note:** The plugin is uninstalled from your system. To remove any project-specific Aura Frog files:
```bash
rm -rf .envrc ccpm-config.yaml
```

### List Installed Plugins

```bash
# Show all installed plugins
/plugin list

# Expected output:
# Installed Plugins:
# - aura-frog (v1.0.0) - Aura Frog
```

---

## 📖 Usage After Installation

### Quick Reference

**Essential Commands:**
```bash
# Start workflows
/workflow:start "Your task description"

# Check status
/workflow:status

# List agents
/agent:list

# Show agent info
/agent:info mobile-react-native

# Quick bug fix
/bugfix:quick "Fix typo in button label"

# Planning only
/planning "Design authentication system"

# Execute saved plan
/execute plan-auth-system-20250127
```

**Workflow Phases:**
1. **Understand** 🎯 - Requirements analysis
2. **Design** 🏗️ - Technical planning
3. **UI Breakdown** 🎨 - Component design
4. **Plan Tests** 🧪 - Test strategy
5a. **Write Tests** 🔴 - TDD RED (tests fail)
5b. **Build** 🟢 - TDD GREEN (tests pass)
5c. **Polish** ♻️ - TDD REFACTOR (optimize)
6. **Review** 👀 - Code review
7. **Verify** ✅ - QA validation
8. **Document** 📚 - Documentation
9. **Share** 🔔 - Team notification

### Available Agents

**Mobile Development:**
- `mobile-react-native` - React Native + Expo (iOS/Android)
- `mobile-flutter` - Flutter + Dart cross-platform

**Backend Development:**
- `backend-nodejs` - Node.js + Express/NestJS/Fastify
- `backend-python` - Django/FastAPI/Flask
- `backend-go` - Go + Gin/Fiber/gRPC
- `backend-laravel` - Laravel PHP

**Web Development:**
- `web-nextjs` - Next.js SSR/SSG
- `web-reactjs` - React 18 SPA
- `web-vuejs` - Vue.js 3 Composition API
- `web-angular` - Angular 17+ standalone components

**Quality & Security:**
- `security-expert` - OWASP audits, vulnerability scanning
- `qa-automation` - Testing automation (Jest, Cypress, Detox)
- `ui-designer` - UI/UX, Figma integration

**Infrastructure:**
- `devops-cicd` - Docker, Kubernetes, CI/CD, monitoring
- `database-specialist` - Database design, query optimization
- `pm-operations-orchestrator` - Workflow coordination
- `smart-agent-detector` - Intelligent agent selection

**Integrations:**
- `jira-operations` - JIRA ticket management
- `confluence-operations` - Confluence documentation
- `slack-operations` - Slack notifications
- `voice-operations` - ElevenLabs AI narration

---

## 🛠️ Troubleshooting

**📚 For comprehensive troubleshooting, see:** [`PLUGIN_TROUBLESHOOTING.md`](PLUGIN_TROUBLESHOOTING.md)

The checklist includes:
- ✅ Quick fix steps (5-step verification)
- ✅ Common issues with solutions
- ✅ Verification scripts
- ✅ Complete setup validation

### Issue 1: Plugin Installed But No Aura Frog Banner (MOST COMMON)

**Symptom:**
- Plugin is installed (`/plugin list` shows aura-frog)
- But responses show vanilla "Claude Code" without Aura Frog banner
- No agent identification in responses

**Cause:**
The plugin provides commands/agents but Claude Code doesn't automatically load the plugin's CLAUDE.md instructions. Each project needs its own `.claude/CLAUDE.md` file.

**Solution:**
```bash
# Option A: Quick Activation
setup:activate

# Option B: Full Project Setup
project:init

# Then: Start a NEW Claude Code session!
```

**Why This Happens:**
- Claude Code's plugin system loads commands, agents, skills from plugins
- But CLAUDE.md files are loaded per-project from `.claude/CLAUDE.md`
- Without this file, Claude doesn't know to use Aura Frog's identity/banner

### Issue 2: Plugin Not Found

**Error:**
```
Error: Plugin 'aura-frog' not found in marketplace
```

**Solution:**
```bash
# Ensure marketplace is added
/plugin add-marketplace https://github.com/nguyenthienthanh/aura-frog

# Refresh marketplace cache
/plugin refresh-marketplace

# Try installation again
/plugin install aura-frog
```

### Issue 3: Commands Not Working

**Error:**
```
Unknown command: /workflow:start
```

**Solution:**
```bash
# Verify plugin is installed
/plugin list

# If not installed, install it
/plugin install aura-frog

# Restart Claude Code (if needed)
```

### Issue 4: Integration Scripts Not Found

**Error:**
```
MCP server not responding
```

**Solution:**
```bash
# Check MCP configuration
cat .mcp.json

# Verify environment variables are set
echo $JIRA_API_TOKEN

# Run mcp:status to check loaded servers
mcp:status
```

### Issue 5: MCP Server Not Loading

**Error:**
```
MCP tools not available
```

**Solution:**
```bash
# Check .envrc has required tokens
cat .envrc

# Reload environment
direnv allow

# Restart Claude Code session (MCP loads at startup)
```

---

## 📚 Next Steps

After installation, we recommend:

1. **Read Quick Start:**
   ```bash
   cat GET_STARTED.md
   ```

2. **Configure Project Context:**
   ```bash
   /project:init
   ```

3. **Set Up Integrations (if needed):**
   ```bash
   # Copy and edit .envrc with your API tokens
   cp .envrc.template .envrc
   nano .envrc

   # Load configuration
   direnv allow

   # MCP servers auto-load - verify with:
   mcp:status
   ```

4. **Start Your First Workflow:**
   ```bash
   /workflow:start "Add user authentication"
   ```

5. **Explore Documentation:**
   - `README.md` - Complete user guide
   - `docs/` - Detailed documentation
   - `docs/guides/` - Integration guides
   - `docs/phases/` - Phase-by-phase guides

---

## 🔗 Resources

**Documentation:**
- [Complete User Guide](./../README.md)
- [Quick Start Guide](./../GET_STARTED.md)
- [MCP Setup Guide](./MCP_GUIDE.md)
- [Agent Selection Guide](./AGENT_SELECTION_GUIDE.md)

**External:**
- [Claude Code Plugin Documentation](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplace Documentation](https://code.claude.com/docs/en/plugin-marketplaces)
- [GitHub Repository](https://github.com/nguyenthienthanh/aura-frog)
- [Issue Tracker](https://github.com/nguyenthienthanh/aura-frog/issues)

---

## 💡 Tips

**1. Use Auto-Detection:**
Aura Frog automatically detects your project type (React Native, Laravel, etc.) and activates the right agents.

**2. Leverage Project Context:**
Initialize project context for better suggestions that match your conventions.

**3. Start Simple:**
Use `/bugfix:quick` for small tasks, `/workflow:start` for complex features.

**4. Enable Integrations:**
Set up JIRA, Slack, Confluence for full workflow automation (optional).

**5. Review Phase Guides:**
Each phase has a detailed guide in `docs/phases/`.

---

**✅ Installation Complete!** You're ready to use Aura Frog Team Agents. 🚀

Start with: `/workflow:start "Your first task"`
