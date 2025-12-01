# Environment Variables Setup Guide

**Version:** 5.0.0
**Last Updated:** 2025-11-27

> **⚠️ DEPRECATION NOTICE:**
> This guide has been consolidated into [`INTEGRATION_SETUP_GUIDE.md`](INTEGRATION_SETUP_GUIDE.md).
> **Please use the new consolidated guide** for the complete integration setup experience.
> This file will be archived in a future release.

---

## Overview

Aura Frog uses environment variables to configure integrations with external services like JIRA, Confluence, Slack, and Figma. This guide explains how to set up your environment variables properly.

---

## Quick Setup

### 1. Copy the Template

**Location:** `.envrc` should be in your **project root** (not in aura-frog/ plugin directory)

```bash
# In your project directory
cp ~/.claude/plugins/marketplaces/aurafrog/aura-frog/.envrc.template .envrc
```

**Why project root?**
- ✅ Standard convention (direnv expects root)
- ✅ Easier path references
- ✅ Git-ignored per-project

### 2. Edit the File

Open `.envrc` in your project root and replace `{{PLACEHOLDERS}}` with your actual values:

```bash
nano .envrc
# or
code .envrc
```

### 3. Load Environment Variables

**Option A: Using direnv (Recommended)**
```bash
# Install direnv
brew install direnv  # macOS
# or
apt install direnv   # Linux

# Add to your shell config (~/.zshrc or ~/.bashrc)
eval "$(direnv hook zsh)"  # for zsh
eval "$(direnv hook bash)" # for bash

# Allow direnv for this project
cd /path/to/your/project
direnv allow
```

**Option B: Manual Source**
```bash
source aura-frog/.envrc
```

**Option C: Add to Shell Config**
```bash
# Add to ~/.zshrc or ~/.bashrc
export $(cat /path/to/aura-frog/.envrc | grep -v "^#" | xargs)
```

---

## Environment Variables Reference

### Project Configuration

```bash
# Basic project information
export PROJECT_NAME="Your_Project_Name"        # Project identifier
export PROJECT_ENV="development"                # development, staging, production
```

**Usage:** These identify your project in logs and notifications.

---

### JIRA Integration

```bash
export JIRA_URL="https://yourcompany.atlassian.net"
export JIRA_EMAIL="your.email@company.com"
export JIRA_API_TOKEN="your_jira_api_token_here"
export JIRA_PROJECT_KEY="PROJ"
export JIRA_DEFAULT_ASSIGNEE="your.email@company.com"
export JIRA_DEFAULT_PRIORITY="Medium"
```

**How to Get JIRA API Token:**

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Aura Frog Integration")
4. Copy the token immediately (you can't view it again)
5. Paste it into `JIRA_API_TOKEN`

**Required Variables:**
- ✅ `JIRA_URL` - Your Atlassian domain
- ✅ `JIRA_EMAIL` - Your Atlassian account email
- ✅ `JIRA_API_TOKEN` - API token from above
- ✅ `JIRA_PROJECT_KEY` - Project key (visible in JIRA URLs)

**Optional Variables:**
- `JIRA_DEFAULT_ASSIGNEE` - Auto-assign tickets to this user
- `JIRA_DEFAULT_PRIORITY` - Default priority (High, Medium, Low)

**Testing:**
```bash
bash aura-frog/scripts/jira-fetch.sh PROJ-123
```

---

### Confluence Integration

```bash
export CONFLUENCE_URL="https://yourcompany.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your.email@company.com"
export CONFLUENCE_API_TOKEN="your_confluence_api_token_here"
export CONFLUENCE_SPACE_KEY="DEV"
export CONFLUENCE_DEFAULT_LABELS="aura-frog,generated,documentation"
```

**How to Get Confluence API Token:**

Same as JIRA - Confluence uses the same Atlassian API token.

**Required Variables:**
- ✅ `CONFLUENCE_URL` - Your Confluence wiki URL
- ✅ `CONFLUENCE_EMAIL` - Your Atlassian account email
- ✅ `CONFLUENCE_API_TOKEN` - Same API token as JIRA
- ✅ `CONFLUENCE_SPACE_KEY` - Space key (visible in Confluence URLs)

**Optional Variables:**
- `CONFLUENCE_DEFAULT_LABELS` - Comma-separated labels for pages

**Testing:**
```bash
bash aura-frog/scripts/confluence-publish.sh "Test Page" "Test content"
```

---

### Slack Integration

```bash
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_CHANNEL_ID="C0123456789"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
export SLACK_MENTION_DEV="@developer-team"
export SLACK_MENTION_QA="@qa-team"
export SLACK_MENTION_PM="@pm-team"
```

**How to Get Slack Credentials:**

**Option A: Webhook (Simpler, Recommended for Notifications)**
1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Enable "Incoming Webhooks"
4. Click "Add New Webhook to Workspace"
5. Select channel and authorize
6. Copy the webhook URL

**Option B: Bot Token (More Features)**
1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Go to "OAuth & Permissions"
4. Add bot token scopes: `chat:write`, `chat:write.public`, `channels:read`
5. Install app to workspace
6. Copy "Bot User OAuth Token" (starts with `xoxb-`)
7. Get channel ID: Right-click channel → "Copy link" → ID is in URL

**Required Variables (Webhook):**
- ✅ `SLACK_WEBHOOK_URL` - Incoming webhook URL

**Required Variables (Bot Token):**
- ✅ `SLACK_BOT_TOKEN` - Bot OAuth token
- ✅ `SLACK_CHANNEL_ID` - Target channel ID

**Optional Variables:**
- `SLACK_MENTION_DEV` - Mention dev team
- `SLACK_MENTION_QA` - Mention QA team
- `SLACK_MENTION_PM` - Mention PM team

**Testing:**
```bash
bash aura-frog/scripts/slack-notify.sh "Test message from Aura Frog"
```

---

### Figma Integration

```bash
export FIGMA_API_TOKEN="figd_your_figma_token_here"
export FIGMA_FILE_KEY="ABC123DEF456"
export FIGMA_MCP_ENABLED="true"
```

**How to Get Figma Access Token:**

1. Go to https://www.figma.com/developers/api#access-tokens
2. Click your profile → Settings
3. Scroll to "Personal access tokens"
4. Click "Generate new token"
5. Give it a name (e.g., "Aura Frog Integration")
6. Copy the token (starts with `figd_`)

**How to Get Figma File Key:**

From Figma URL:
```
https://www.figma.com/file/ABC123DEF456/Design-Name
                           ^^^^^^^^^^^^ This is the file key
```

**Required Variables:**
- ✅ `FIGMA_API_TOKEN` - Personal access token
- ✅ `FIGMA_FILE_KEY` - File ID from URL

**Optional Variables:**
- `FIGMA_MCP_ENABLED` - Enable MCP integration (true/false)

**Testing:**
```bash
bash aura-frog/scripts/figma-fetch.sh ABC123DEF456
```

---

### Aura Frog Configuration

```bash
export AURA_FROG_AUTO_APPROVE="true"
export AURA_FROG_DEFAULT_COVERAGE="80"
export AURA_FROG_TDD_ENFORCE="true"
export AURA_FROG_AUTO_NOTIFY="true"
export AURA_FROG_TOKEN_WARNING="150000"
```

**Variables:**

- `AURA_FROG_AUTO_APPROVE` - Auto-approve safe operations (default: true)
- `AURA_FROG_DEFAULT_COVERAGE` - Default test coverage threshold % (default: 80)
- `AURA_FROG_TDD_ENFORCE` - Enforce TDD workflow (default: true)
- `AURA_FROG_AUTO_NOTIFY` - Auto-send notifications (default: true)
- `AURA_FROG_TOKEN_WARNING` - Token usage warning threshold (default: 150000)

---

## Security Best Practices

### ✅ DO

- ✅ Keep `.envrc` file LOCAL only (already in `.gitignore`)
- ✅ Use strong, unique API tokens
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use read-only tokens when possible
- ✅ Limit token scopes to minimum required
- ✅ Store backups securely (password manager)

### ❌ DON'T

- ❌ Commit `.envrc` to git
- ❌ Share tokens in chat/email
- ❌ Use production tokens for development
- ❌ Hardcode tokens in scripts
- ❌ Use same token across multiple projects
- ❌ Store tokens in plain text files outside `.envrc`

---

## Troubleshooting

### Environment Variables Not Loading

**Check if direnv is installed:**
```bash
which direnv
```

**Check if direnv is hooked:**
```bash
# Should show "direnv" somewhere in output
echo $PROMPT_COMMAND  # bash
echo $precmd_functions  # zsh
```

**Manually load variables:**
```bash
source aura-frog/.envrc
echo $JIRA_URL  # Should print your JIRA URL
```

### Integration Not Working

**Test each integration:**
```bash
# Test JIRA
bash aura-frog/scripts/jira-fetch.sh PROJ-123

# Test Confluence
bash aura-frog/scripts/confluence-list.sh

# Test Slack
bash aura-frog/scripts/slack-notify.sh "Test"

# Test Figma
bash aura-frog/scripts/figma-fetch.sh FILE_KEY
```

**Check token validity:**
- JIRA/Confluence: Visit https://id.atlassian.com/manage-profile/security/api-tokens
- Slack: Visit https://api.slack.com/apps → Your App → OAuth & Permissions
- Figma: Visit https://www.figma.com/settings → Personal access tokens

### Permission Denied

**Check file permissions:**
```bash
ls -la aura-frog/.envrc
# Should be: -rw------- (600) or -rw-r--r-- (644)
```

**Fix permissions:**
```bash
chmod 600 aura-frog/.envrc
```

---

## Integration Status Check

Create a script to verify all integrations:

```bash
#!/bin/bash
# aura-frog/scripts/check-integrations.sh

echo "🔍 Checking Aura Frog Integrations..."
echo ""

# Check JIRA
if [ -n "$JIRA_URL" ] && [ -n "$JIRA_API_TOKEN" ]; then
  echo "✅ JIRA: Configured"
else
  echo "❌ JIRA: Not configured"
fi

# Check Confluence
if [ -n "$CONFLUENCE_URL" ] && [ -n "$CONFLUENCE_API_TOKEN" ]; then
  echo "✅ Confluence: Configured"
else
  echo "❌ Confluence: Not configured"
fi

# Check Slack
if [ -n "$SLACK_WEBHOOK_URL" ] || [ -n "$SLACK_BOT_TOKEN" ]; then
  echo "✅ Slack: Configured"
else
  echo "❌ Slack: Not configured"
fi

# Check Figma
if [ -n "$FIGMA_API_TOKEN" ]; then
  echo "✅ Figma: Configured"
else
  echo "❌ Figma: Not configured"
fi

echo ""
echo "Run individual tests with:"
echo "  bash aura-frog/scripts/jira-fetch.sh TICKET-123"
echo "  bash aura-frog/scripts/slack-notify.sh 'Test message'"
echo "  bash aura-frog/scripts/figma-fetch.sh FILE_KEY"
```

**Run it:**
```bash
bash aura-frog/scripts/check-integrations.sh
```

---

## Alternative: Using .env Files

If you prefer `.env` files over `.envrc`:

**Create `.env`:**
```bash
cp aura-frog/.envrc.template aura-frog/.env
```

**Load in scripts:**
```bash
# At the top of any script
if [ -f "aura-frog/.env" ]; then
  export $(cat aura-frog/.env | grep -v "^#" | xargs)
fi
```

**Add to .gitignore:**
```
aura-frog/.env
```

---

## Project-Specific Variables

You can also set environment variables in project context:

**File:** `.claude/project-contexts/[project]/.env`

```bash
# Project-specific overrides
export PROJECT_NAME="My_Specific_Project"
export JIRA_PROJECT_KEY="MYPROJ"
```

**Priority:** Project `.env` > Global `.envrc` > Defaults

---

## Next Steps

After setting up environment variables:

1. ✅ Test integrations (see Troubleshooting section)
2. ✅ Initialize project: `project:init`
3. ✅ Configure project context: Edit `.claude/project-contexts/[project]/project-config.yaml`
4. ✅ Start workflow: `workflow:start "Your task"`

---

## Related Documentation

- **BASH_INTEGRATIONS_GUIDE.md** - Detailed integration scripts
- **QUICK_SETUP_INTEGRATIONS.md** - Quick setup (15 min)
- **CONFIG_LOADING_ORDER.md** - Config file priority
- **SECURITY_AND_TRUST.md** - Security best practices

---

## Support

**Issues with setup?**
- Check troubleshooting section above
- Review integration scripts in `aura-frog/scripts/`
- See `aura-frog/README.md` for complete documentation

**Token expired?**
- JIRA/Confluence: Regenerate at https://id.atlassian.com/manage-profile/security/api-tokens
- Slack: Regenerate at https://api.slack.com/apps
- Figma: Regenerate at https://www.figma.com/settings

---

**Version:** 5.0.0
**Last Updated:** 2025-11-27
