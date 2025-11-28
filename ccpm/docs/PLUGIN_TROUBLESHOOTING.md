# CCPM Plugin Troubleshooting Guide

**Version:** 1.0.0
**Purpose:** Diagnose and fix CCPM plugin issues
**Last Updated:** 2025-11-27

**📚 For Installation:** See [`PLUGIN_INSTALLATION.md`](PLUGIN_INSTALLATION.md)

---

## Overview

If your CCPM plugin isn't working correctly, this guide will help you diagnose and fix common issues.

**Common Symptoms:**
- ❌ Agent identification not showing
- ❌ Commands not available
- ❌ Plugin not loading
- ❌ Settings not being applied
- ❌ Integrations failing

---

## ✅ Quick Fix Checklist

### 1. Check Plugin Files

**Location:** `~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/`

**Required files:**
```bash
cd ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/
ls -la
```

You should see:
- ✅ `CLAUDE.md` (Main instructions)
- ✅ `ccpm-config.yaml` (Global config)
- ✅ `settings.example.json` (Settings template)
- ✅ `agents/` (agent definition files)
- ✅ `commands/` (67 command files)

---

### 2. Create settings.local.json (If Missing)

**Problem:** `settings.local.json` is gitignored, so it won't be in fresh install

**Solution:**
```bash
cd ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/
cp settings.example.json settings.local.json
```

**Why:** This file controls Claude Code permissions and is required for plugin to function

---

### 3. Verify Agent Identification Works

**Test:** Start a conversation in any project

**Expected:** You should see this at the top of Claude's response:
```markdown
**─────────────────────────────────────────────────────────**
🤖 **Agent:** pm-operations-orchestrator | 📋 **System:** CCPM v5.0
**─────────────────────────────────────────────────────────**
```

**If missing:** Claude Code hasn't loaded CLAUDE.md instructions

**Fix:**
1. Restart Claude Code
2. Verify plugin is installed: `/plugin list`
3. Check CLAUDE.md exists in plugin directory

---

### 4. Initialize Project (First Time in Each Project)

**When:** Using CCPM in a new project

**Command:**
```bash
project:init
```

**This creates:**
- `.claude/` folder structure
- Project-specific configurations
- Settings and context files

**Why:** Each project needs its own context

---

### 5. Check Environment Variables (For Integrations)

**If using JIRA, Slack, Figma, etc.:**

**Command:**
```bash
# In your project root
ls -la .envrc
```

**If missing:**
```bash
cp ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/.envrc.template .envrc
# Then edit .envrc with your credentials
```

**See:** `docs/INTEGRATION_SETUP_GUIDE.md` for detailed setup

---

## 🔍 Common Issues & Solutions

### Issue 1: Agent Signature Not Showing

**Symptom:** Claude responds normally but doesn't show agent identification

**Causes:**
1. CLAUDE.md not loaded by Claude Code
2. Plugin not properly installed
3. Another plugin overriding behavior

**Solutions:**
```bash
# 1. Verify plugin installation
/plugin list
# Should show: ccpm@ethan-ccpm

# 2. Reinstall plugin
/plugin uninstall ccpm@ethan-ccpm
/plugin install ccpm@ethan-ccpm

# 3. Restart Claude Code
# Close and reopen Claude Code application
```

---

### Issue 2: Commands Not Working

**Symptom:** `workflow:start` or other commands don't work

**Causes:**
1. Commands not registered
2. Plugin not loaded
3. Syntax error in command files

**Solutions:**
```bash
# Check available commands
/help

# Look for CCPM commands like:
# - workflow:start
# - project:init
# - agent:list

# If missing, reinstall plugin
/plugin install ccpm@ethan-ccpm --force
```

---

### Issue 3: Settings Not Applied

**Symptom:** Permissions or workflow settings not working

**Causes:**
1. `settings.local.json` doesn't exist
2. Invalid JSON syntax
3. Wrong file location

**Solutions:**
```bash
# Create settings file
cd ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/
cp settings.example.json settings.local.json

# Validate JSON syntax
jq empty settings.local.json

# If error, fix JSON syntax or copy example again
```

---

### Issue 4: Project Context Not Loading

**Symptom:** Plugin works but doesn't use project-specific settings

**Causes:**
1. `.claude/` folder doesn't exist in project
2. Project not initialized
3. Wrong active project in config

**Solutions:**
```bash
# Initialize project
project:init

# Or manually create project context
mkdir -p .claude/project-contexts/my-project
cp ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/project-contexts/template/* .claude/project-contexts/my-project/

# Update ccpm-config.yaml to point to your project
# Edit: active_project.name and active_project.context_path
```

---

### Issue 5: Integration Scripts Not Working

**Symptom:** JIRA, Figma, Slack integrations fail

**Causes:**
1. `.envrc` not set up
2. Environment variables not loaded
3. Scripts not executable

**Solutions:**
```bash
# 1. Create .envrc from template
cp ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/.envrc.template .envrc

# 2. Edit with your credentials
nano .envrc

# 3. Load environment variables
source .envrc
# Or use direnv: direnv allow

# 4. Make scripts executable
chmod +x ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/scripts/*.sh

# 5. Test integration
bash ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/scripts/jira-fetch.sh TEST-123
```

---

## 📂 File Locations Reference

### Plugin Directory
```
~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/
├── CLAUDE.md                     # Main instructions (MUST exist)
├── ccpm-config.yaml              # Global config (MUST exist)
├── settings.local.json           # User settings (CREATE THIS)
├── settings.example.json         # Template
├── .envrc.template               # Template for integrations
├── agents/                       # Agent definitions
├── commands/                     # 70 commands
├── rules/                        # Quality rules
├── docs/                         # Documentation
└── scripts/                      # Integration scripts
```

### Project Directory
```
/your-project/
├── .claude/                      # Created by project:init
│   ├── project-contexts/
│   │   └── your-project/
│   │       ├── project-config.yaml
│   │       ├── conventions.md
│   │       └── rules.md
│   ├── logs/                     # Workflow logs
│   └── context/                  # Active contexts
└── .envrc                        # Integration credentials (gitignored)
```

---

## 🎯 Verification Script

Create this script to verify setup:

```bash
#!/bin/bash
# verify-ccpm-setup.sh

echo "🔍 CCPM Plugin Setup Verification"
echo "=================================="
echo ""

PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/ethan-ccpm/ccpm"

# Check plugin directory
if [ -d "$PLUGIN_DIR" ]; then
  echo "✅ Plugin directory exists"
else
  echo "❌ Plugin directory NOT found"
  echo "   Expected: $PLUGIN_DIR"
  exit 1
fi

# Check CLAUDE.md
if [ -f "$PLUGIN_DIR/CLAUDE.md" ]; then
  echo "✅ CLAUDE.md exists"
else
  echo "❌ CLAUDE.md NOT found"
fi

# Check ccpm-config.yaml
if [ -f "$PLUGIN_DIR/ccpm-config.yaml" ]; then
  echo "✅ ccpm-config.yaml exists"
else
  echo "❌ ccpm-config.yaml NOT found"
fi

# Check settings.local.json
if [ -f "$PLUGIN_DIR/settings.local.json" ]; then
  echo "✅ settings.local.json exists"
else
  echo "⚠️  settings.local.json NOT found"
  echo "   Creating from template..."
  cp "$PLUGIN_DIR/settings.example.json" "$PLUGIN_DIR/settings.local.json"
  echo "✅ Created settings.local.json"
fi

# Check agents directory
if [ -d "$PLUGIN_DIR/agents" ]; then
  AGENT_COUNT=$(ls -1 "$PLUGIN_DIR/agents"/*.md 2>/dev/null | wc -l)
  echo "✅ Agents directory exists ($AGENT_COUNT agents)"
else
  echo "❌ Agents directory NOT found"
fi

# Check commands directory
if [ -d "$PLUGIN_DIR/commands" ]; then
  CMD_COUNT=$(find "$PLUGIN_DIR/commands" -name "*.md" 2>/dev/null | wc -l)
  echo "✅ Commands directory exists ($CMD_COUNT commands)"
else
  echo "❌ Commands directory NOT found"
fi

# Check project initialization
if [ -d ".claude" ]; then
  echo "✅ Project initialized (.claude/ folder exists)"
else
  echo "⚠️  Project NOT initialized"
  echo "   Run: project:init"
fi

# Check .envrc
if [ -f ".envrc" ]; then
  echo "✅ .envrc exists (integrations configured)"
else
  echo "ℹ️  .envrc NOT found (integrations not configured)"
  echo "   Optional: Copy from $PLUGIN_DIR/.envrc.template"
fi

echo ""
echo "=================================="
echo "Verification complete!"
```

**Usage:**
```bash
chmod +x verify-ccpm-setup.sh
./verify-ccpm-setup.sh
```

---

## 🚀 Need to Install from Scratch?

**See:** [`PLUGIN_INSTALLATION.md`](PLUGIN_INSTALLATION.md) for complete installation guide.

This troubleshooting guide assumes CCPM is already installed and you're experiencing issues.

---

## 📞 Still Not Working?

If you've followed all steps and it still doesn't work:

1. **Check Claude Code version**
   - CCPM requires Claude Code v1.0+
   - Check: /version

2. **Review logs**
   - Claude Code may have error logs
   - Check console/debug output

3. **Reinstall completely**
   ```bash
   /plugin uninstall ccpm@ethan-ccpm
   rm -rf ~/.claude/plugins/marketplaces/ethan-ccpm/
   /plugin marketplace add nguyenthienthanh/ccpm-team-agents
   /plugin install ccpm@ethan-ccpm
   ```

4. **Check GitHub Issues**
   - Visit: https://github.com/nguyenthienthanh/ccpm-team-agents/issues
   - Search for your issue or create new one

---

## 📚 Related Documentation

- **Plugin Installation:** `docs/PLUGIN_INSTALLATION.md`
- **Integration Setup:** `docs/INTEGRATION_SETUP_GUIDE.md`
- **Configuration Loading:** `docs/CONFIG_LOADING_ORDER.md`
- **Agent Identification:** `docs/AGENT_IDENTIFICATION.md`
- **Main README:** `README.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-11-27
