# 🚀 CCPM Team Agents

**Comprehensive AI-Powered Project Management with Multi-Agent Collaboration, TDD Enforcement, and Quality Gates**

---

## 📖 Introduction

CCPM Team Agents is an AI-powered project management system that provides a 9-phase workflow with multi-agent collaboration, TDD enforcement, and quality gates.

The system includes:
- 🤖 **14 AI specialists** automatically activated based on context
- 🔄 **9-phase workflow** from requirements analysis to deployment
- ✅ **TDD enforcement** (Test-Driven Development) mandatory
- 🎯 **Quality gates** requiring approval at each critical phase
- 🔗 **External integrations** with JIRA, Confluence, Slack

---

## 🚀 Quick Start

### Installation

#### Option 1: Automated Installation (Recommended)

Use the installation script to automatically copy `.claude` to your project and configure environment variables:

```bash
# Clone this repository
git clone https://github.com/nguyenthienthanh/ccpm-team-agents.git
cd ccpm-team-agents

# Run installation script
./install.sh /path/to/your/project

# Or run interactively (script will prompt for project path)
./install.sh
```

The script will:
- ✅ Copy `.claude` directory to your project root
- ✅ Prompt you for environment variables (Jira, Confluence, Slack, Figma)
- ✅ Create `.claude/.envrc` with your configuration
- ✅ Create `.claude/settings.local.json` from template

**Note:** All sensitive files (`.envrc`, `settings.local.json`) are automatically git-ignored.

#### Option 2: Manual Installation

1. Clone this repository:
```bash
git clone https://github.com/nguyenthienthanh/ccpm-team-agents.git
cd ccpm-team-agents
```

2. Copy the `.claude` directory to your project root:
```bash
cp -r .claude /path/to/your/project/
```

3. Configure environment variables:
```bash
cd /path/to/your/project
cp .claude/.envrc.template .claude/.envrc
# Edit .claude/.envrc and fill in your values
```

4. Create local settings:
```bash
cp .claude/settings.example.json .claude/settings.local.json
# Edit .claude/settings.local.json if needed
```

### Usage

To get started with CCPM Team Agents, see the **[detailed guide at `.claude/README.md`](.claude/README.md)**.

That documentation includes:
- ⚡ Quick Reference - Essential commands
- 🎯 Workflow Modes - Different workflow modes
- 📝 Usage examples
- ⚙️ Configuration
- 🛠️ Advanced Setup
- 📚 Complete documentation

### Basic Commands

```bash
# Start full workflow
workflow:start "Your task description"

# Planning only
planning "Your task"

# Check status
workflow:status

# List agents
agent:list
```

---

## 📁 Project Structure

```
ccpm-team-agents/
├── .claude/              # CCPM Team Agents system
│   ├── README.md         # 📖 Detailed documentation (SEE HERE)
│   ├── GET_STARTED.md    # Quick start guide
│   ├── agents/           # 14 AI specialists
│   ├── commands/         # 29+ workflow commands
│   ├── rules/            # 9 quality rules
│   ├── docs/             # Detailed documentation
│   └── ...
└── README.md             # This file
```

---

## 🎯 Key Features

- ✅ **14 AI Specialists** - Auto-activated based on context
- ✅ **9-Phase Workflow** - From requirements to deployment
- ✅ **TDD Enforcement** - Write tests before code, always enforced
- ✅ **Quality Gates** - Approval required at each critical point
- ✅ **Multi-Project Support** - Manage unlimited projects with auto-detection
- ✅ **External Integrations** - Connect with JIRA, Confluence, Slack
- ✅ **Command-Based** - 29+ commands for full workflow control
- ✅ **Safety First** - Confirmation prompts for external writes
- ✅ **Comprehensive Docs** - 20+ guides and references

---

## 📚 Documentation

**👉 See [`.claude/README.md`](.claude/README.md) for complete usage guide.**

The documentation includes:
- Quick start guide
- Complete command list
- Detailed usage examples
- Configuration guide
- Integration with external tools
- System architecture

---

## 📄 License

MIT License - See LICENSE for details

---

## 🙏 Acknowledgments

- **Claude Code** - AI-powered development platform
- **duongdev/ccpm** - Original inspiration and architecture
- **CCPM Contributors** - Development and testing

---

## 📞 Support

- **Documentation:** `.claude/docs/`
- **Issues:** https://github.com/nguyenthienthanh/ccpm-team-agents/issues
- **Discussions:** https://github.com/nguyenthienthanh/ccpm-team-agents/discussions

---

**🚀 Get started:** See [`.claude/README.md`](.claude/README.md) for complete guide!
