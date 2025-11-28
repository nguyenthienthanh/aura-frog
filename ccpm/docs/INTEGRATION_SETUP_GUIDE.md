# Integration Setup Guide

**Version:** 5.2.0
**Last Updated:** 2025-11-27

---

## Table of Contents

1. [Quick Decision Guide](#1-quick-decision-guide)
2. [15-Minute Quick Setup](#2-15-minute-quick-setup)
3. [Detailed Setup](#3-detailed-setup)
4. [Advanced Topics](#4-advanced-topics)
5. [Script Usage](#5-script-usage)

---

## 1. Quick Decision Guide

### 1.1 Decision Tree

```
Do you track issues in JIRA?
├─ YES → Enable JIRA Integration
└─ NO  → Skip JIRA

Do you use Confluence for documentation?
├─ YES → Enable Confluence Integration
└─ NO  → Use local Markdown only

Do you want team notifications?
├─ YES → Enable Slack Integration
└─ NO  → Skip Slack

Do you have Figma designs?
├─ YES → Enable Figma Integration (screenshots work without API)
└─ NO  → Skip Figma
```

### 1.2 Integration Matrix

| Integration | Required For | Setup Time | Difficulty | Worth It? |
|-------------|--------------|------------|------------|-----------|
| **JIRA** | Issue tracking, auto-fetch tickets | 5 min | Easy | ⭐⭐⭐⭐⭐ High |
| **Confluence** | Auto-publish docs | 5 min | Easy | ⭐⭐⭐⭐ High |
| **Slack** | Team notifications | 10 min | Medium | ⭐⭐⭐ Medium |
| **Figma** | Design extraction | 5 min | Easy | ⭐⭐⭐⭐ High |

### 1.3 Common Setup Scenarios

#### Scenario 1: Solo Developer
**Recommended:** None or Figma only
- ✅ Figma (if you have designs)
- ❌ JIRA (overkill for solo work)
- ❌ Confluence (use local markdown)
- ❌ Slack (no team to notify)

**Setup Time:** 5 minutes

#### Scenario 2: Small Team (2-5 people)
**Recommended:** JIRA + Figma
- ✅ JIRA (issue tracking)
- ✅ Figma (if designers involved)
- ⚠️ Slack (optional, useful for async updates)
- ⚠️ Confluence (optional, consider GitHub Wiki instead)

**Setup Time:** 15 minutes

#### Scenario 3: Medium Team (6-15 people)
**Recommended:** All integrations
- ✅ JIRA (essential for coordination)
- ✅ Confluence (centralized docs)
- ✅ Slack (team communication)
- ✅ Figma (design handoff)

**Setup Time:** 30 minutes

#### Scenario 4: Enterprise
**Recommended:** All integrations + advanced config
- ✅ JIRA (with custom workflows)
- ✅ Confluence (with templates)
- ✅ Slack (multiple channels)
- ✅ Figma (design system)

**Setup Time:** 1 hour (including customization)

### 1.4 Integration Feature Overview

#### JIRA Integration
**What it does:**
- ✅ Auto-fetch ticket details when you mention ticket ID
- ✅ Update ticket status during workflow
- ✅ Add comments with progress updates
- ✅ Link commits to tickets

**When to enable:**
- ✅ You use JIRA for issue tracking
- ✅ You want automated ticket updates
- ✅ You work with ticket IDs (e.g., PROJ-123)

**When to skip:**
- ❌ You don't use JIRA
- ❌ You use GitHub Issues, Linear, or other trackers
- ❌ You prefer manual ticket updates

#### Confluence Integration
**What it does:**
- ✅ Auto-publish documentation to Confluence
- ✅ Create pages in specified space
- ✅ Update existing pages
- ✅ Add labels and metadata

**When to enable:**
- ✅ Your team uses Confluence
- ✅ You want centralized documentation
- ✅ You need to share docs with non-technical stakeholders

**When to skip:**
- ❌ You only need local markdown files
- ❌ You use GitHub Wiki, Notion, or other docs platforms
- ❌ Your team doesn't use Confluence

#### Slack Integration
**What it does:**
- ✅ Send workflow completion notifications
- ✅ Alert team on phase completions
- ✅ Share deployment updates
- ✅ Notify on errors or blockers

**When to enable:**
- ✅ Your team uses Slack
- ✅ You want real-time notifications
- ✅ You want to keep team informed automatically

**When to skip:**
- ❌ You work solo
- ❌ Your team uses Teams, Discord, or other chat platforms
- ❌ You prefer manual updates

#### Figma Integration
**What it does:**
- ✅ Fetch design specifications
- ✅ Extract components and layout
- ✅ Get design tokens (colors, spacing, typography)
- ✅ Works with screenshots (no API needed for basic use)

**When to enable:**
- ✅ You implement designs from Figma
- ✅ You want accurate UI implementation
- ✅ You work with designers

**When to skip:**
- ❌ You don't have designs
- ❌ Designs are in Sketch, Adobe XD, or other tools
- ❌ You prefer manual design reference

---

## 2. 15-Minute Quick Setup

### 2.1 Prerequisites

Install `jq` (required for all integrations):

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Verify
jq --version
```

### 2.2 Get All Tokens (10 min)

#### JIRA Token (2 min)
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name: `CCPM`
4. Copy token → Save for step 2.3

#### Figma Token (1 min)
1. Go to https://www.figma.com/settings
2. Scroll to "Personal Access Tokens"
3. Click "Generate new token"
4. Name: `CCPM`
5. Copy token → Save for step 2.3

#### Slack Token (5 min)
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name: `CCPM Bot`, select workspace
4. Go to "OAuth & Permissions"
5. Add scopes: `chat:write`, `chat:write.public`
6. Click "Install to Workspace"
7. Copy "Bot User OAuth Token" (xoxb-...) → Save for step 2.3
8. In Slack: `/invite @CCPM Bot` to your channel

#### Confluence Token (2 min)
1. Same as JIRA token (Confluence uses same Atlassian API token)

### 2.3 Configure `.envrc` (2 min)

**Location:** `.envrc` should be in your **project root** (not in ccpm/ plugin directory)

```bash
# Copy template
cp ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/.envrc.template .envrc

# Edit and replace {{placeholders}} with your actual values
```

**Complete Configuration:**

```bash
# ============================================
# Project Configuration
# ============================================
export PROJECT_NAME="Your_Project_Name"
export PROJECT_ENV="development"  # development, staging, production

# ============================================
# JIRA Integration
# ============================================
export JIRA_URL="https://yourcompany.atlassian.net"
export JIRA_EMAIL="your.email@company.com"
export JIRA_API_TOKEN="paste_jira_token_here"
export JIRA_PROJECT_KEY="PROJ"  # Your project key
export JIRA_DEFAULT_ASSIGNEE="your.email@company.com"  # Optional
export JIRA_DEFAULT_PRIORITY="Medium"  # Optional

# ============================================
# Confluence Integration
# ============================================
export CONFLUENCE_URL="https://yourcompany.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your.email@company.com"
export CONFLUENCE_API_TOKEN="paste_confluence_token_here"  # Same as JIRA
export CONFLUENCE_SPACE_KEY="DEV"  # Find in Confluence URL
export CONFLUENCE_DEFAULT_LABELS="ccpm,generated,documentation"  # Optional

# ============================================
# Slack Integration
# ============================================
export SLACK_BOT_TOKEN="paste_slack_token_here"  # xoxb-...
export SLACK_CHANNEL_ID="#dev-team"  # or use channel ID like C01234567
export SLACK_MENTION_DEV="@developer-team"  # Optional
export SLACK_MENTION_QA="@qa-team"  # Optional
export SLACK_MENTION_PM="@pm-team"  # Optional

# ============================================
# Figma Integration
# ============================================
export FIGMA_ACCESS_TOKEN="paste_figma_token_here"  # figd_...
export FIGMA_FILE_KEY="ABC123DEF456"  # Optional: default file

# ============================================
# CCPM Configuration
# ============================================
export CCPM_AUTO_APPROVE="true"
export CCPM_DEFAULT_COVERAGE="80"
export CCPM_TDD_ENFORCE="true"
export CCPM_AUTO_NOTIFY="true"
export CCPM_TOKEN_WARNING="150000"
```

### 2.4 Load & Test (3 min)

#### Load Environment

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
source .envrc
```

#### Test Each Integration

```bash
# Test JIRA
./scripts/jira-fetch.sh PROJ-123

# Test Figma (replace with your file ID)
./scripts/figma-fetch.sh ABC123xyz456

# Test Slack
./scripts/slack-notify.sh '#dev-team' '✅ CCPM integrations working!'

# Test Confluence (creates test page)
echo "# Test\nCCPM is ready!" > /tmp/test.md
./scripts/confluence-publish.sh 'DEV' 'CCPM Test' '/tmp/test.md'
```

**If all 4 succeed → You're done! ✅**

### 2.5 Usage in Workflows

```bash
# JIRA: Auto-fetch when starting workflow
workflow:start PROJ-1234

# Figma: Include in workflow prompt
workflow:start "Implement https://figma.com/file/ABC123/Design"

# Slack: Manual notification
bash scripts/slack-notify.sh '#team' 'Update message'

# Confluence: Publish docs
bash scripts/confluence-publish.sh 'SPACE' 'Title' 'file.md'
```

### 2.6 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| `jq: command not found` | `brew install jq` |
| `HTTP 401` (JIRA/Confluence) | Regenerate token, update .envrc |
| `HTTP 403` (Figma) | Regenerate token at figma.com/settings |
| `channel_not_found` (Slack) | `/invite @CCPM Bot` in channel |
| Script not executable | `chmod +x scripts/*.sh` |

---

## 3. Detailed Setup

### 3.1 JIRA Integration

#### Prerequisites
- Atlassian account
- JIRA project access
- Permission to create API tokens

#### Step-by-Step Setup

**Step 1: Generate API Token**

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "CCPM Integration")
4. Copy the token immediately (you can't view it again)
5. Paste it into `JIRA_API_TOKEN`

**Step 2: Get JIRA Configuration**

Find your JIRA URL:
```
https://yourcompany.atlassian.net
```

Find your project key (visible in JIRA URLs):
```
https://yourcompany.atlassian.net/browse/PROJ-123
                                           ^^^^ This is the project key
```

**Step 3: Configure Environment Variables**

```bash
export JIRA_URL="https://yourcompany.atlassian.net"
export JIRA_EMAIL="your.email@company.com"
export JIRA_API_TOKEN="your_jira_api_token_here"
export JIRA_PROJECT_KEY="PROJ"
export JIRA_DEFAULT_ASSIGNEE="your.email@company.com"  # Optional
export JIRA_DEFAULT_PRIORITY="Medium"  # Optional
```

**Step 4: Enable in Project Context**

Edit `.claude/project-contexts/[project]/project-config.yaml`:

```yaml
integrations:
  jira:
    enabled: true
    project_key: "PROJ"
```

**Step 5: Test Connection**

```bash
# Test API access
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_URL/rest/api/3/myself"

# Expected: Your user information

# Test with CCPM script
bash ccpm/scripts/jira-fetch.sh PROJ-123
```

**Expected Output:**
```
🔍 Fetching JIRA ticket: PROJ-123
✅ Successfully fetched ticket

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 JIRA TICKET: PROJ-123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Summary: [Feature] Add user authentication
📊 Details: [...]
```

#### Features

Once configured, CCPM can:
- ✅ Fetch ticket details from Jira links
- ✅ Update ticket status
- ✅ Add comments with implementation details
- ✅ Create follow-up tickets
- ✅ Link related tickets
- ✅ Update fix versions
- ✅ Attach documentation

#### Usage in CCPM

```bash
# Fetch ticket and start workflow
workflow:start PROJ-1234

# Or with Jira link
workflow:start https://yourcompany.atlassian.net/browse/PROJ-1234

# Bug fix from Jira ticket
bugfix:start PROJ-1234
```

#### Troubleshooting

**Problem:** `401 Unauthorized`
- ✅ Check email is correct
- ✅ Regenerate API token
- ✅ Verify URL format (no trailing slash)

**Problem:** `403 Forbidden`
- ✅ Check user has project access
- ✅ Verify project key is correct

---

### 3.2 Confluence Integration

#### Prerequisites
- Atlassian account
- Confluence space access
- Permission to create pages
- Same API token as JIRA

#### Step-by-Step Setup

**Step 1: Generate API Token**

Same as JIRA - Confluence uses the same Atlassian API token.

**Step 2: Get Confluence Configuration**

Find your Confluence URL:
```
https://yourcompany.atlassian.net/wiki
```

Find your space key:

**Method 1: From URL**
```
https://yourcompany.atlassian.net/wiki/spaces/TECH/pages/...
                                                    ^^^^
                                               Space Key
```

**Method 2: From Space Settings**
1. Go to your Confluence space
2. Click "Space settings" (bottom left)
3. Space key is shown at the top

**Step 3: Configure Environment Variables**

```bash
export CONFLUENCE_URL="https://yourcompany.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your.email@company.com"
export CONFLUENCE_API_TOKEN="same_as_jira_token"
export CONFLUENCE_SPACE_KEY="DEV"
export CONFLUENCE_PARENT_PAGE_ID="123456"  # Optional
export CONFLUENCE_DEFAULT_LABELS="ccpm,generated,documentation"  # Optional
```

**Step 4: Enable in Project Context**

```yaml
integrations:
  confluence:
    enabled: true
    space_key: "DEV"
```

**Step 5: Test Connection**

```bash
# Test Confluence API
curl -u "$CONFLUENCE_EMAIL:$CONFLUENCE_API_TOKEN" \
  -H "Accept: application/json" \
  "$CONFLUENCE_URL/rest/api/space/$CONFLUENCE_SPACE_KEY"

# Test with CCPM script
cat > /tmp/test-doc.md <<EOF
# Test Documentation
This is a test page created by CCPM.
EOF

bash ccpm/scripts/confluence-publish.sh 'DEV' 'CCPM Test Page' '/tmp/test-doc.md'
```

**Expected Output:**
```
📚 Publishing to Confluence...
✅ Page published successfully!
🔗 View page: https://yourcompany.atlassian.net/wiki/pages/viewpage.action?pageId=123456
```

#### Features

Once configured, CCPM can:
- ✅ Publish documentation to Confluence
- ✅ Create/update pages automatically
- ✅ Format Markdown → Confluence markup
- ✅ Attach code snippets
- ✅ Add labels and metadata
- ✅ Link to Jira tickets
- ✅ Update existing pages

#### Usage in CCPM

```bash
# Generate feature documentation
document feature "User Authentication"
# → Auto-publishes to Confluence

# Phase 8 (Documentation) in workflow
# → Auto-generates Confluence page
```

#### Troubleshooting

**Problem:** `403 Forbidden`
- ✅ Verify you have "Can add" permission in Confluence space
- ✅ Check space key is correct
- ✅ Verify API token is valid

**Problem:** Page Creates Duplicate Instead of Update
- Script checks for existing pages by title and updates if found
- If still creating duplicates:
  1. Manually delete duplicates
  2. Try again
  3. Or use explicit parent page ID to organize pages

---

### 3.3 Slack Integration

#### Prerequisites
- Slack workspace access
- Permission to create apps/webhooks

#### Step-by-Step Setup

**Option A: Bot Token (Recommended for Features)**

**Step 1: Create Slack App**

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name: "CCPM Bot"
4. Select your workspace

**Step 2: Add Bot Token Scopes**

1. Go to "OAuth & Permissions"
2. Scroll to "Scopes" → "Bot Token Scopes"
3. Add these scopes:
   - `chat:write` - Post messages
   - `chat:write.public` - Post to public channels
   - `files:write` - Upload files (optional)
   - `channels:read` - List channels (optional)

**Step 3: Install to Workspace**

1. Click "Install to Workspace"
2. Authorize the app
3. Copy "Bot User OAuth Token" (starts with `xoxb-`)

**Step 4: Get Channel ID**

```bash
# Method 1: From Slack app
# Right-click channel → View channel details → Copy Channel ID

# Method 2: From Slack web URL
# https://app.slack.com/client/T.../C1234567890
#                                    ^^^^^^^^^^^
#                                    Channel ID
```

**Step 5: Configure Environment Variables**

```bash
export SLACK_BOT_TOKEN="xoxb-your-slack-bot-token"
export SLACK_CHANNEL_ID="#dev-team"  # or C1234567890
export SLACK_MENTION_DEV="@developer-team"  # Optional
export SLACK_MENTION_QA="@qa-team"  # Optional
export SLACK_MENTION_PM="@pm-team"  # Optional
```

**Step 6: Invite Bot to Channel**

In Slack: `/invite @CCPM Bot` in your channel

**Option B: Webhook (Simpler, Notifications Only)**

1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Enable "Incoming Webhooks"
4. Click "Add New Webhook to Workspace"
5. Select channel and authorize
6. Copy webhook URL

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

**Step 7: Enable in Project Context**

```yaml
integrations:
  slack:
    enabled: true
    channels:
      dev: "#dev-team"
      qa: "#qa-team"
```

**Step 8: Test Connection**

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

# Test with CCPM script
bash ccpm/scripts/slack-notify.sh '#dev-team' 'Hello from CCPM! 👋'
```

**Expected Output:**
```
💬 Sending Slack notification...
📍 Channel: #dev-team
✅ Message sent successfully!
```

#### Features

Once configured, CCPM can:
- ✅ Send workflow completion notifications
- ✅ Alert team on hotfixes
- ✅ Post code review requests
- ✅ Share metrics and achievements
- ✅ Notify on QA failures
- ✅ Tag relevant team members
- ✅ Include links to Jira/Confluence

#### Usage in CCPM

```bash
# Phase 9 auto-notifies team
workflow:start "Add feature X"
# ... workflow completes ...
# → Slack notification sent automatically

# Hotfix alerts
bugfix:hotfix "API down"
# → Immediate Slack alert to #incidents
```

#### Troubleshooting

**Problem:** `invalid_auth`
- ✅ Regenerate bot token
- ✅ Reinstall app to workspace
- ✅ Check token starts with `xoxb-`

**Problem:** `channel_not_found` or `not_in_channel`
- ✅ Invite bot to channel: `/invite @CCPM Bot`
- ✅ Verify channel ID is correct

---

### 3.4 Figma Integration

#### Prerequisites (for API access)
- Figma account
- Access to design files

#### Step-by-Step Setup

**Step 1: Generate Personal Access Token**

1. Go to https://www.figma.com/developers/api#access-tokens
2. Click your profile → Settings
3. Scroll to "Personal access tokens"
4. Click "Generate new token"
5. Give it a name (e.g., "CCPM Integration")
6. Copy the token (starts with `figd_`)

**Step 2: Get File Key from URL**

From Figma URL:
```
https://www.figma.com/file/ABC123DEF456/Design-Name
                           ^^^^^^^^^^^^ This is the file key
```

**Step 3: Configure Environment Variables**

```bash
export FIGMA_ACCESS_TOKEN="figd_your_figma_token_here"
export FIGMA_FILE_KEY="ABC123DEF456"  # Optional: default file
export FIGMA_MCP_ENABLED="true"  # Optional
```

**Step 4: Test Connection**

```bash
# Test Figma API
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/me"

# Test with CCPM script
bash ccpm/scripts/figma-fetch.sh ABC123DEF456
```

**Expected Output:**
```
🎨 Fetching Figma file: ABC123DEF456
✅ Successfully fetched Figma file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 FIGMA FILE: ABC123DEF456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Name: Mobile App Design
📊 Details: [...]
```

#### Features

Once configured, CCPM can:
- ✅ Analyze Figma designs from URLs
- ✅ Extract design tokens (colors, spacing, typography)
- ✅ Break down components
- ✅ Generate component specs
- ✅ Compare design vs implementation
- ✅ Extract assets (icons, images)

#### Two Methods of Usage

**Option A: API Access (Recommended)**
- Requires `FIGMA_ACCESS_TOKEN`
- CCPM will automatically extract design data via `figma-fetch.sh`
- No screenshots needed

**Option B: Screenshots (No Setup Required)**
- Just provide Figma URL in workflow
- Claude will ask for screenshots
- Works immediately without token

#### Usage in CCPM

```bash
# Start workflow with Figma URL
workflow:start "Implement design from https://www.figma.com/file/ABC123/Mobile"

# Claude will:
# 1. Detect Figma URL
# 2. Extract file ID: ABC123
# 3. Run: bash scripts/figma-fetch.sh ABC123
# 4. Parse design components
# 5. Start Phase 3 (UI Breakdown) with design context
```

#### Troubleshooting

**Problem:** `403 Invalid token`
- ✅ Regenerate personal access token
- ✅ Check token starts with `figd_`
- ✅ Verify team access

**Problem:** `404 Not Found`
- ✅ Check file key is correct
- ✅ Verify you have access to the file

---

## 4. Advanced Topics

### 4.1 Security Best Practices

#### DO ✅

- ✅ Keep tokens in `.envrc` (gitignored)
- ✅ Use separate tokens per project
- ✅ Rotate tokens every 90 days
- ✅ Use read-only tokens when possible
- ✅ Revoke tokens when leaving team
- ✅ Store backups securely (password manager)
- ✅ Limit token scopes to minimum required

#### DON'T ❌

- ❌ Commit `.envrc` to git
- ❌ Share tokens in chat/email
- ❌ Use production tokens for development
- ❌ Hardcode tokens in scripts
- ❌ Give tokens broader permissions than needed
- ❌ Use same token across multiple projects
- ❌ Store tokens in plain text files outside `.envrc`

#### Environment-Specific Tokens

Use different tokens for dev/staging/prod:

```bash
# .envrc
if [ "$PROJECT_ENV" = "production" ]; then
  export SLACK_BOT_TOKEN="xoxb-prod-token"
  export JIRA_PROJECT_KEY="PROD"
else
  export SLACK_BOT_TOKEN="xoxb-dev-token"
  export JIRA_PROJECT_KEY="DEV"
fi
```

#### Git Ignore Configuration

Ensure these are in your `.gitignore`:

```
.envrc
.env
*.local.json
.claude/logs/
.claude/context/
```

### 4.2 Per-Project Configuration

Create project-specific overrides in your project context:

```yaml
# .claude/project-contexts/[project]/project-config.yaml
integrations:
  jira:
    project_key: "MYPROJ"
    default_assignee: "developer@company.com"

  slack:
    channel: "#my-project-dev"
    mentions:
      dev: "@dev-team"
      qa: "@qa-team"
      pm: "@pm-team"

  confluence:
    space: "MYPROJ"
    parent_page_id: "123456"
```

**Priority:** Project `.env` > Global `.envrc` > Defaults

### 4.3 Rate Limiting

If you hit rate limits, adjust in `ccpm-config.yaml`:

```yaml
integrations:
  jira:
    rate_limit: 5  # Reduce from 10 to 5 requests/min
  confluence:
    rate_limit: 5
  slack:
    rate_limit: 1  # Already conservative
```

### 4.4 Integration Status Check

Create a script to verify all integrations:

```bash
#!/bin/bash
# scripts/check-integrations.sh

echo "🔍 Checking CCPM Integrations..."
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
if [ -n "$FIGMA_ACCESS_TOKEN" ]; then
  echo "✅ Figma: Configured"
else
  echo "❌ Figma: Not configured"
fi

echo ""
echo "Run individual tests with:"
echo "  bash scripts/jira-fetch.sh TICKET-123"
echo "  bash scripts/slack-notify.sh '#channel' 'Test message'"
echo "  bash scripts/figma-fetch.sh FILE_KEY"
echo "  bash scripts/confluence-publish.sh 'SPACE' 'Title' 'file.md'"
```

**Run it:**
```bash
chmod +x scripts/check-integrations.sh
./scripts/check-integrations.sh
```

### 4.5 Custom Notification Templates

Create custom Slack notification templates:

```bash
# scripts/slack-notify-deployment.sh
#!/bin/bash
ENVIRONMENT="$1"
VERSION="$2"
STATUS="$3"

MESSAGE="🚀 Deployment to *${ENVIRONMENT}*
Version: \`${VERSION}\`
Status: ${STATUS}
Deployed by: CCPM Bot"

bash scripts/slack-notify.sh '#deployments' "$MESSAGE"
```

### 4.6 Alternative: Using `.env` Files

If you prefer `.env` files over `.envrc`:

**Create `.env`:**
```bash
cp ccpm/.envrc.template .env
```

**Load in scripts:**
```bash
# At the top of any script
if [ -f ".env" ]; then
  export $(cat .env | grep -v "^#" | xargs)
fi
```

**Add to .gitignore:**
```
.env
```

### 4.7 Troubleshooting Guide

#### General Issues

**Environment Variables Not Loading**

Check if direnv is installed:
```bash
which direnv
```

Check if direnv is hooked:
```bash
# Should show "direnv" somewhere in output
echo $PROMPT_COMMAND  # bash
echo $precmd_functions  # zsh
```

Manually load variables:
```bash
source .envrc
echo $JIRA_URL  # Should print your JIRA URL
```

**Permission Denied**

Check file permissions:
```bash
ls -la .envrc
# Should be: -rw------- (600) or -rw-r--r-- (644)
```

Fix permissions:
```bash
chmod 600 .envrc
```

#### Integration-Specific Issues

**JIRA: "HTTP 401 Unauthorized"**
- ✅ Check email is correct
- ✅ Regenerate API token
- ✅ Verify URL format (no trailing slash)
- ✅ Test: `curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" "$JIRA_URL/rest/api/3/myself"`

**Figma: "HTTP 403 Forbidden"**
- ✅ Regenerate token at: https://www.figma.com/settings
- ✅ Ensure token has file access
- ✅ Check file permissions (must be viewer or higher)
- ✅ Update `.envrc`

**Slack: "channel_not_found"**
- ✅ Go to Slack channel
- ✅ Type: `/invite @CCPM Bot`
- ✅ Try again

**Confluence: "HTTP 403 Forbidden"**
- ✅ Verify you have "Can add" permission in Confluence space
- ✅ Check space key is correct
- ✅ Verify API token is valid
- ✅ Try creating page manually in Confluence to test permissions

**All Scripts: "jq: command not found"**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Verify
jq --version
```

**Note:** Scripts work without `jq`, just with less formatting

### 4.8 Cost Considerations

**Free Integrations:**
- ✅ JIRA (on paid Atlassian plan)
- ✅ Confluence (on paid Atlassian plan)
- ✅ Slack (on any plan)
- ✅ Figma (on any plan)

**No Additional Costs:**
All integrations use existing service APIs. No extra CCPM costs.

---

## 5. Script Usage

### 5.1 Available Scripts

CCPM provides **native Bash script integrations** for external services:

| Service | Script | Purpose | Status |
|---------|--------|---------|--------|
| **JIRA** | `jira-fetch.sh` | Fetch tickets, requirements | ✅ Ready |
| **Figma** | `figma-fetch.sh` | Fetch designs, extract components | ✅ Ready |
| **Slack** | `slack-notify.sh` | Send notifications, updates | ✅ Ready |
| **Confluence** | `confluence-publish.sh` | Publish documentation | ✅ Ready |

### 5.2 Script Reference

#### jira-fetch.sh

**Purpose:** Fetch JIRA ticket details

**Usage:**
```bash
./scripts/jira-fetch.sh <ticket-key>
```

**Examples:**
```bash
./scripts/jira-fetch.sh PROJ-123
./scripts/jira-fetch.sh ETHAN-1269
```

**Output:**
- Console: Formatted ticket summary
- File: `.claude/logs/jira/<ticket-key>.json` (full JSON)

**Requirements:**
- `JIRA_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `jq` (optional, for formatting)

---

#### figma-fetch.sh

**Purpose:** Fetch Figma file metadata and images

**Usage:**
```bash
./scripts/figma-fetch.sh <file-id-or-url>
```

**Examples:**
```bash
./scripts/figma-fetch.sh ABC123xyz456
./scripts/figma-fetch.sh "https://www.figma.com/file/ABC123xyz456/Design"
./scripts/figma-fetch.sh "https://www.figma.com/design/ABC123xyz456/Design"
```

**Output:**
- Console: File info, pages, styles
- File: `.claude/logs/figma/<file-id>.json` (full JSON)
- File: `.claude/logs/figma/<file-id>-images.json` (image URLs)

**Requirements:**
- `FIGMA_ACCESS_TOKEN`
- `jq` (optional, for formatting)

---

#### slack-notify.sh

**Purpose:** Send Slack notifications

**Usage:**
```bash
./scripts/slack-notify.sh <channel> <message> [thread_ts] [mentions]
```

**Examples:**
```bash
# Simple message
./scripts/slack-notify.sh '#dev-team' 'Deploy completed!'

# With mentions
./scripts/slack-notify.sh '#dev-team' 'PR ready for review' '' '@reviewer-team'

# Reply in thread
./scripts/slack-notify.sh '#dev-team' 'Updated' '1234567890.123456'

# Channel ID (not name)
./scripts/slack-notify.sh 'C01234567' 'Private channel message'
```

**Output:**
- Console: Message confirmation
- File: `.claude/logs/slack/message-<timestamp>.json`

**Requirements:**
- `SLACK_BOT_TOKEN`
- `jq` (for JSON construction)
- Bot invited to channel

---

#### confluence-publish.sh

**Purpose:** Publish markdown to Confluence

**Usage:**
```bash
./scripts/confluence-publish.sh <space-key> <title> <content-file> [parent-page-id]
```

**Examples:**
```bash
# Create new page
./scripts/confluence-publish.sh 'DEV' 'API Documentation' 'docs/api.md'

# Update existing page (same title = update)
./scripts/confluence-publish.sh 'DEV' 'API Documentation' 'docs/api-v2.md'

# Create as child page
./scripts/confluence-publish.sh 'DEV' 'Sub Page' 'docs/sub.md' '123456'
```

**Output:**
- Console: Page URL
- File: `.claude/logs/confluence/page-<page-id>.json`

**Requirements:**
- `CONFLUENCE_URL`
- `CONFLUENCE_EMAIL`
- `CONFLUENCE_API_TOKEN`
- `jq` (for JSON construction)

**Note:** Script does basic Markdown → Confluence conversion. For complex formatting, consider using `pandoc`.

---

### 5.3 Automatic Integration in Workflows

#### Automatic JIRA Fetching

```bash
# Start workflow with ticket
workflow:start PROJ-1269
```

Claude will:
1. Detect JIRA ticket: `PROJ-1269`
2. Run: `bash scripts/jira-fetch.sh PROJ-1269`
3. Parse requirements from JSON
4. Start Phase 1 with ticket context

#### Automatic Figma Integration

```bash
# Start workflow with Figma URL
workflow:start "Implement design from https://www.figma.com/file/ABC123/Mobile"
```

Claude will:
1. Detect Figma URL
2. Extract file ID: `ABC123`
3. Run: `bash scripts/figma-fetch.sh ABC123`
4. Parse design components
5. Start Phase 3 (UI Breakdown) with design context

#### Phase 9: Auto-Notifications

At the end of Phase 9, Claude will:

```bash
# Update JIRA
bash scripts/jira-update.sh PROJ-1269 "Done" "Implementation completed"

# Notify Slack
bash scripts/slack-notify.sh '#dev-team' '✅ PROJ-1269 completed! @reviewer-team please review'

# Publish docs to Confluence
bash scripts/confluence-publish.sh 'DEV' 'PROJ-1269: Implementation' '.claude/logs/workflows/*/implementation.md'
```

### 5.4 Why Bash Scripts vs MCP?

| Feature | Bash Scripts (Our Approach) | MCP |
|---------|------------------------------|-----|
| **Claude Code Support** | ✅ Yes | ❌ No |
| **Setup Time** | 5 min per service | 15-30 min |
| **Dependencies** | bash, curl, jq | Node.js, npm, MCP server |
| **Performance** | ~200ms | ~500ms |
| **Customization** | ✅ Easy (edit script) | ⚠️ Limited |
| **Debugging** | ✅ Easy (logs, console) | ⚠️ Harder |
| **Offline Mode** | ✅ Can cache | ❌ No |
| **Cost** | Free (built-in tools) | Free (but more overhead) |
| **Maintenance** | ✅ Simple scripts | ⚠️ npm dependencies |

**Verdict:** Bash scripts are better for Claude Code ✅

---

## Verification Checklist

After setup, verify:

- [ ] `.envrc` or `.env` file created
- [ ] All required variables set
- [ ] File added to `.gitignore`
- [ ] `direnv allow .` executed (if using direnv)
- [ ] JIRA connection tested ✅
- [ ] Confluence connection tested ✅
- [ ] Slack connection tested ✅
- [ ] Figma connection tested ✅
- [ ] Integration test script runs successfully
- [ ] Variables load automatically when entering directory

---

## Next Steps

After setting up environment variables:

1. ✅ Test integrations (see Section 4.7 Troubleshooting)
2. ✅ Initialize project: `project:init`
3. ✅ Configure project context: Edit `.claude/project-contexts/[project]/project-config.yaml`
4. ✅ Start workflow: `workflow:start "Your task"`

---

## Related Documentation

- **BASH_INTEGRATIONS_REFERENCE.md** - Technical API reference for developers
- **CONFIG_LOADING_ORDER.md** - Configuration priority
- **SECURITY_AND_TRUST.md** - Security best practices
- **JIRA_WEBFETCH_SOLUTION.md** - JIRA integration details
- **PROJECT_CONTEXTS_README.md** - Project customization

---

## Support

**Issues with setup?**
- Check troubleshooting section (Section 4.7)
- Review integration scripts in `ccpm/scripts/`
- See `ccpm/README.md` for complete documentation

**Token expired?**
- JIRA/Confluence: Regenerate at https://id.atlassian.com/manage-profile/security/api-tokens
- Slack: Regenerate at https://api.slack.com/apps
- Figma: Regenerate at https://www.figma.com/settings

---

**Version:** 5.2.0
**Last Updated:** 2025-11-27
**Total Lines:** ~800
