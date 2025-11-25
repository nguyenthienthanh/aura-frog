# CCPM Integration Setup Guide

**Purpose:** Configure external integrations (Jira, Confluence, Slack, Figma) using environment variables

---

## 📋 Overview

CCPM supports integrations with:
- **Jira** - Ticket management, status updates
- **Confluence** - Documentation publishing
- **Slack** - Team notifications
- **Figma** - Design analysis (via MCP)

All configured via environment variables for security and flexibility.

---

## 🔧 Setup Methods

### Method 1: Using `.envrc` (Recommended)

**Step 1: Install direnv**

```bash
# macOS
brew install direnv

# Add to ~/.zshrc or ~/.bashrc
eval "$(direnv hook zsh)"  # for zsh
eval "$(direnv hook bash)" # for bash

# Restart shell
source ~/.zshrc
```

**Step 2: Create `.envrc` file**

```bash
cd /path/to/your/project
touch .envrc
```

**Step 3: Add environment variables**

```bash
# Edit .envrc
nano .envrc
```

**Step 4: Allow direnv**

```bash
direnv allow .
```

**Benefits:**
- ✅ Auto-loads when you `cd` into project
- ✅ Isolated per project
- ✅ Git-ignored by default
- ✅ Secure (not committed to repo)

---

### Method 2: Using `.env` file

**Step 1: Create `.env` file**

```bash
touch .env
```

**Step 2: Add to `.gitignore`**

```bash
echo ".env" >> .gitignore
```

**Step 3: Load in your shell**

```bash
# Add to ~/.zshrc or run manually
export $(cat .env | xargs)
```

---

### Method 3: Export directly in shell

```bash
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-token"
```

**Note:** Lost when shell closes. Not recommended for permanent setup.

---

## 🎫 Jira Integration Setup

### Required Environment Variables

```bash
# .envrc or .env

# Jira Configuration
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"
export JIRA_PROJECT_KEY="PROJ"  # Your project key (e.g., PROJ, YOUR)

# Optional: Default settings
export JIRA_DEFAULT_ASSIGNEE="your-username"
export JIRA_DEFAULT_PRIORITY="Medium"
export JIRA_BOARD_ID="123"  # For sprint operations
```

### Getting Jira API Token

**Step 1: Go to Atlassian Account Settings**

```
https://id.atlassian.com/manage-profile/security/api-tokens
```

**Step 2: Create API Token**
1. Click "Create API token"
2. Give it a label (e.g., "CCPM Integration")
3. Copy the token (save it securely!)

**Step 3: Test Connection**

```bash
# Test API access
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_URL/rest/api/3/myself"
```

**Expected output:** Your user information

### Jira Integration Features

Once configured, CCPM can:
- ✅ Fetch ticket details from Jira links
- ✅ Update ticket status
- ✅ Add comments with implementation details
- ✅ Create follow-up tickets
- ✅ Link related tickets
- ✅ Update fix versions
- ✅ Attach documentation

### Usage in CCPM

```bash
# Fetch ticket and start workflow
workflow:start PROJ-1234

# Or with Jira link
workflow:start https://your-company.atlassian.net/browse/PROJ-1234

# Bug fix from Jira ticket
bugfix:start PROJ-1234
```

---

## 📚 Confluence Integration Setup

### Required Environment Variables

```bash
# .envrc or .env

# Confluence Configuration
export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your-email@company.com"
export CONFLUENCE_API_TOKEN="same-as-jira-token"  # Usually same as Jira
export CONFLUENCE_SPACE_KEY="TECH"  # Your space key

# Optional: Default settings
export CONFLUENCE_PARENT_PAGE_ID="123456"  # Parent page for docs
export CONFLUENCE_DEFAULT_LABELS="ccpm,generated,documentation"
```

### Getting Confluence Space Key

**Method 1: From URL**
```
https://your-company.atlassian.net/wiki/spaces/TECH/pages/...
                                                    ^^^^
                                               Space Key
```

**Method 2: From Space Settings**
1. Go to your Confluence space
2. Click "Space settings" (bottom left)
3. Space key is shown at the top

### Test Connection

```bash
# Test Confluence API
curl -u "$CONFLUENCE_EMAIL:$CONFLUENCE_API_TOKEN" \
  -H "Accept: application/json" \
  "$CONFLUENCE_URL/rest/api/space/$CONFLUENCE_SPACE_KEY"
```

### Confluence Integration Features

Once configured, CCPM can:
- ✅ Publish documentation to Confluence
- ✅ Create/update pages automatically
- ✅ Format Markdown → Confluence markup
- ✅ Attach code snippets
- ✅ Add labels and metadata
- ✅ Link to Jira tickets
- ✅ Update existing pages

### Usage in CCPM

```bash
# Generate feature documentation
document feature "User Authentication"
# → Auto-publishes to Confluence

# Phase 8 (Documentation) in workflow
# → Auto-generates Confluence page
```

---

## 💬 Slack Integration Setup

### Required Environment Variables

```bash
# .envrc or .env

# Slack Configuration
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_CHANNEL_ID="C1234567890"  # Channel for notifications
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."  # Optional

# Optional: Team mentions
export SLACK_MENTION_DEV="@developer-team"
export SLACK_MENTION_QA="@qa-team"
export SLACK_MENTION_PM="@pm-team"
```

### Getting Slack Bot Token

**Step 1: Create Slack App**

1. Go to https://api.slack.com/apps
2. Click "Create New App"
3. Choose "From scratch"
4. Name: "CCPM Bot"
5. Select your workspace

**Step 2: Add Bot Token Scopes**

1. Go to "OAuth & Permissions"
2. Add these Bot Token Scopes:
   - `chat:write` - Post messages
   - `chat:write.public` - Post to public channels
   - `files:write` - Upload files
   - `channels:read` - List channels

**Step 3: Install to Workspace**

1. Click "Install to Workspace"
2. Authorize the app
3. Copy "Bot User OAuth Token" (starts with `xoxb-`)

**Step 4: Get Channel ID**

```bash
# Method 1: From Slack app
# Right-click channel → View channel details → Copy Channel ID

# Method 2: From Slack web
# URL: https://app.slack.com/client/T.../C1234567890
#                                        ^^^^^^^^^^^
#                                        Channel ID
```

### Getting Slack Webhook URL (Alternative)

**For simpler integration (no bot token needed):**

1. Go to https://api.slack.com/messaging/webhooks
2. Click "Create your Slack app"
3. Follow wizard to create incoming webhook
4. Copy webhook URL

### Test Connection

```bash
# Test with webhook
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text":"CCPM integration test ✅"}'

# Or with bot token
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"channel\":\"$SLACK_CHANNEL_ID\",\"text\":\"CCPM test ✅\"}"
```

### Slack Integration Features

Once configured, CCPM can:
- ✅ Send workflow completion notifications
- ✅ Alert team on hotfixes
- ✅ Post code review requests
- ✅ Share metrics and achievements
- ✅ Notify on QA failures
- ✅ Tag relevant team members
- ✅ Include links to Jira/Confluence

### Usage in CCPM

```bash
# Phase 9 auto-notifies team
workflow:start "Add feature X"
# ... workflow completes ...
# → Slack notification sent automatically

# Hotfix alerts
bugfix:hotfix "API down"
# → Immediate Slack alert to #incidents
```

---

## 🎨 Figma Integration Setup (MCP)

### Required Environment Variables

```bash
# .envrc or .env

# Figma Configuration
export FIGMA_ACCESS_TOKEN="figd_your-personal-access-token"
export FIGMA_FILE_KEY="your-file-key"  # Default file (optional)
export FIGMA_TEAM_ID="your-team-id"  # Optional

# MCP Server Configuration (if using MCP)
export FIGMA_MCP_ENABLED="true"
```

### Getting Figma Access Token

**Step 1: Generate Personal Access Token**

1. Go to https://www.figma.com/developers/api#access-tokens
2. Click your profile → Settings
3. Scroll to "Personal access tokens"
4. Click "Create new token"
5. Name: "CCPM Integration"
6. Copy token (starts with `figd_`)

**Step 2: Get File Key from URL**

```
https://www.figma.com/file/ABC123xyz/Your-Design-Name
                           ^^^^^^^^^
                          File Key
```

### Test Connection

```bash
# Test Figma API
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/me"
```

### Figma Integration Features

Once configured, CCPM can:
- ✅ Analyze Figma designs from URLs
- ✅ Extract design tokens (colors, spacing, typography)
- ✅ Break down components
- ✅ Generate component specs
- ✅ Compare design vs implementation
- ✅ Extract assets (icons, images)

**Note:** Since Claude cannot directly access Figma links, you'll need to:
1. Take screenshots of Figma designs
2. Paste screenshots in chat
3. CCPM will analyze the images

### Usage in CCPM

```bash
# Phase 3: Design Review
workflow:start "Implement new dashboard"
# ... Phase 1, 2 complete ...
# Phase 3: AI asks for Figma screenshots
# → Paste screenshots in chat
# → AI analyzes design and extracts specs
```

---

## 📝 Complete `.envrc` Example

```bash
# .envrc - CCPM Integration Configuration
# Copy this template and fill in your values

# ============================================
# Project Configuration
# ============================================
export PROJECT_NAME="My Project"
export PROJECT_ENV="development"  # development, staging, production

# ============================================
# Jira Integration
# ============================================
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-jira-api-token"
export JIRA_PROJECT_KEY="PROJ"
export JIRA_DEFAULT_ASSIGNEE="your-username"
export JIRA_DEFAULT_PRIORITY="Medium"
export JIRA_BOARD_ID="123"

# ============================================
# Confluence Integration
# ============================================
export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="$JIRA_EMAIL"  # Usually same as Jira
export CONFLUENCE_API_TOKEN="$JIRA_API_TOKEN"  # Usually same as Jira
export CONFLUENCE_SPACE_KEY="TECH"
export CONFLUENCE_PARENT_PAGE_ID="123456"
export CONFLUENCE_DEFAULT_LABELS="ccpm,generated,documentation"

# ============================================
# Slack Integration
# ============================================
export SLACK_BOT_TOKEN="xoxb-your-slack-bot-token"
export SLACK_CHANNEL_ID="C1234567890"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
export SLACK_MENTION_DEV="@developer-team"
export SLACK_MENTION_QA="@qa-team"
export SLACK_MENTION_PM="@pm-team"

# ============================================
# Figma Integration
# ============================================
export FIGMA_ACCESS_TOKEN="figd_your-figma-token"
export FIGMA_FILE_KEY="your-default-file-key"
export FIGMA_TEAM_ID="your-team-id"
export FIGMA_MCP_ENABLED="true"

# ============================================
# CCPM Configuration
# ============================================
export CCPM_AUTO_APPROVE="true"
export CCPM_DEFAULT_COVERAGE="80"
export CCPM_TDD_ENFORCE="true"
export CCPM_AUTO_NOTIFY="true"

# ============================================
# Optional: Git Configuration
# ============================================
export GIT_AUTHOR_NAME="Your Name"
export GIT_AUTHOR_EMAIL="your-email@company.com"
```

### After editing `.envrc`:

```bash
# Allow direnv to load it
direnv allow .

# Verify variables loaded
echo $JIRA_URL
echo $CONFLUENCE_URL
echo $SLACK_CHANNEL_ID
echo $FIGMA_ACCESS_TOKEN
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```bash
# Add to .gitignore
echo ".envrc" >> .gitignore
echo ".env" >> .gitignore
echo "*.local.json" >> .gitignore
```

### 2. Use Environment-Specific Files

```bash
.envrc.development
.envrc.staging
.envrc.production
```

Load appropriate one:
```bash
# .envrc
if [ "$PROJECT_ENV" = "production" ]; then
  source_env .envrc.production
elif [ "$PROJECT_ENV" = "staging" ]; then
  source_env .envrc.staging
else
  source_env .envrc.development
fi
```

### 3. Rotate Tokens Regularly

- ⚠️ Rotate API tokens every 90 days
- ⚠️ Revoke tokens when team members leave
- ⚠️ Use separate tokens per environment

### 4. Limit Token Permissions

- ✅ Jira: Only grant needed permissions
- ✅ Slack: Use minimal bot scopes
- ✅ Figma: Read-only tokens if possible

---

## 🧪 Testing Integrations

### Test Script

Create `.claude/scripts/test-integrations.sh`:

```bash
#!/bin/bash

echo "🧪 Testing CCPM Integrations..."
echo ""

# Test Jira
echo "Testing Jira..."
if curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_URL/rest/api/3/myself" > /dev/null; then
  echo "✅ Jira: Connected"
else
  echo "❌ Jira: Failed"
fi

# Test Confluence
echo "Testing Confluence..."
if curl -s -u "$CONFLUENCE_EMAIL:$CONFLUENCE_API_TOKEN" \
  "$CONFLUENCE_URL/rest/api/space/$CONFLUENCE_SPACE_KEY" > /dev/null; then
  echo "✅ Confluence: Connected"
else
  echo "❌ Confluence: Failed"
fi

# Test Slack
echo "Testing Slack..."
if curl -s -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test"}' > /dev/null; then
  echo "✅ Slack: Connected"
else
  echo "❌ Slack: Failed"
fi

# Test Figma
echo "Testing Figma..."
if curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/me" > /dev/null; then
  echo "✅ Figma: Connected"
else
  echo "❌ Figma: Failed"
fi

echo ""
echo "✅ Integration tests complete!"
```

Run test:
```bash
chmod +x .claude/scripts/test-integrations.sh
./.claude/scripts/test-integrations.sh
```

---

## 📋 Troubleshooting

### Jira Connection Issues

**Problem:** `401 Unauthorized`
- ✅ Check email is correct
- ✅ Regenerate API token
- ✅ Verify URL format (no trailing slash)

**Problem:** `403 Forbidden`
- ✅ Check user has project access
- ✅ Verify project key is correct

### Slack Connection Issues

**Problem:** `invalid_auth`
- ✅ Regenerate bot token
- ✅ Reinstall app to workspace
- ✅ Check token starts with `xoxb-`

**Problem:** `channel_not_found`
- ✅ Invite bot to channel: `/invite @CCPM Bot`
- ✅ Verify channel ID is correct

### Figma Connection Issues

**Problem:** `403 Invalid token`
- ✅ Regenerate personal access token
- ✅ Check token starts with `figd_`
- ✅ Verify team access

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.envrc` or `.env` file created
- [ ] All required variables set
- [ ] File added to `.gitignore`
- [ ] `direnv allow .` executed (if using direnv)
- [ ] Jira connection tested ✅
- [ ] Confluence connection tested ✅
- [ ] Slack connection tested ✅
- [ ] Figma connection tested ✅
- [ ] Integration test script runs successfully
- [ ] Variables load automatically when entering directory

---

## 🚀 Ready to Use!

**Your integrations are now configured!**

**CCPM will automatically:**
- ✅ Fetch Jira tickets
- ✅ Publish to Confluence
- ✅ Notify on Slack
- ✅ Analyze Figma designs

**Test with:**
```bash
# Start workflow with Jira ticket
workflow:start PROJ-1234

# CCPM will:
# 1. Fetch ticket from Jira
# 2. Execute workflow
# 3. Publish docs to Confluence
# 4. Notify team on Slack
```

---

**Questions? Check:**
- `.claude/docs/guides/JIRA_INTEGRATION.md`
- `.claude/docs/guides/CONFLUENCE_OPERATIONS.md`
- `.claude/docs/figma-mcp-integration.md`

