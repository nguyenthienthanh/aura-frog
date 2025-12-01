# Bash Script Integrations for Claude Code

**Version:** 1.0.0
**Last Updated:** 2025-11-27
**Purpose:** Native integrations for JIRA, Figma, Slack, and Confluence without MCP

> **⚠️ DEPRECATION NOTICE:**
> This guide has been consolidated into [`INTEGRATION_SETUP_GUIDE.md`](INTEGRATION_SETUP_GUIDE.md) (Sections 3-5).
> **Please use the new consolidated guide** for setup and usage.
>
> **For technical/development details, see:** [`BASH_INTEGRATIONS_REFERENCE.md`](BASH_INTEGRATIONS_REFERENCE.md)
>
> This file will be archived in a future release.

---

## 🎯 Overview

Aura Frog provides **native Bash script integrations** for external services, optimized for Claude Code:

| Service | Script | Purpose | Status |
|---------|--------|---------|--------|
| **JIRA** | `jira-fetch.sh` | Fetch tickets, requirements | ✅ Ready |
| **Figma** | `figma-fetch.sh` | Fetch designs, extract components | ✅ Ready |
| **Slack** | `slack-notify.sh` | Send notifications, updates | ✅ Ready |
| **Confluence** | `confluence-publish.sh` | Publish documentation | ✅ Ready |

---

## 🚀 Quick Start (5 minutes)

### 1. Configure Environment Variables

Edit `.envrc`:

```bash
# ============================================
# JIRA Integration
# ============================================
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your.email@company.com"
export JIRA_API_TOKEN="your_jira_token"
export JIRA_PROJECT_KEY="PROJ"

# ============================================
# Figma Integration
# ============================================
export FIGMA_API_TOKEN="your_figma_token"

# ============================================
# Slack Integration
# ============================================
export SLACK_BOT_TOKEN="xoxb-your-slack-token"
export SLACK_CHANNEL_ID="#dev-team"

# ============================================
# Confluence Integration
# ============================================
export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="your.email@company.com"
export CONFLUENCE_API_TOKEN="your_confluence_token"
export CONFLUENCE_SPACE_KEY="DEV"
```

### 2. Load Environment

```bash
source .envrc
```

### 3. Test Each Integration

```bash
# Test JIRA
./scripts/jira-fetch.sh PROJ-123

# Test Figma
./scripts/figma-fetch.sh ABC123xyz456

# Test Slack
./scripts/slack-notify.sh '#dev-team' 'Test message'

# Test Confluence
echo "# Test Page\n\nContent here" > /tmp/test.md
./scripts/confluence-publish.sh 'DEV' 'Test Page' '/tmp/test.md'
```

---

## 📋 Detailed Setup

### JIRA Setup (5 min)

**Step 1: Generate API Token**
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Name it: `Aura Frog Integration`
4. Copy token

**Step 2: Configure**
```bash
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="ethan.nguyen@example.com"
export JIRA_API_TOKEN="ATATT3xFfGF0w7t..."  # Paste your token
export JIRA_PROJECT_KEY="ETHAN"
```

**Step 3: Test**
```bash
source .envrc
./scripts/jira-fetch.sh ETHAN-1269
```

**Expected output:**
```
🔍 Fetching JIRA ticket: ETHAN-1269
✅ Successfully fetched ticket

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 JIRA TICKET: ETHAN-1269
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Summary: [Cute] Gen AI Generation Error pop up
📊 Details: [...]
```

---

### Figma Setup (3 min)

**Step 1: Generate Access Token**
1. Go to: https://www.figma.com/settings
2. Scroll to **Personal Access Tokens**
3. Click **Generate new token**
4. Name it: `Aura Frog Integration`
5. Copy token

**Step 2: Configure**
```bash
export FIGMA_API_TOKEN="figd_your_token_here"
```

**Step 3: Test**
```bash
source .envrc

# Method 1: File ID
./scripts/figma-fetch.sh ABC123xyz456

# Method 2: Full URL
./scripts/figma-fetch.sh "https://www.figma.com/file/ABC123xyz456/Design-Name"
```

**Expected output:**
```
🎨 Fetching Figma file: ABC123xyz456
✅ Successfully fetched Figma file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 FIGMA FILE: ABC123xyz456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Name: Mobile App Design
📊 Details: [...]
```

---

### Slack Setup (5 min)

**Step 1: Create Slack App**
1. Go to: https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. Name: `Aura Frog Bot`
4. Workspace: Select your workspace

**Step 2: Add Bot Scopes**
1. Go to **OAuth & Permissions**
2. Scroll to **Scopes** → **Bot Token Scopes**
3. Add: `chat:write`, `chat:write.public`

**Step 3: Install to Workspace**
1. Click **Install to Workspace**
2. Authorize
3. Copy **Bot User OAuth Token** (starts with `xoxb-`)

**Step 4: Configure**
```bash
export SLACK_BOT_TOKEN="xoxb-1234567890-..."  # Paste your token
export SLACK_CHANNEL_ID="#dev-team"
```

**Step 5: Invite Bot to Channel**
In Slack: `/invite @Aura Frog Bot` in your channel

**Step 6: Test**
```bash
source .envrc
./scripts/slack-notify.sh '#dev-team' 'Hello from Aura Frog! 👋'
```

**Expected output:**
```
💬 Sending Slack notification...
📍 Channel: #dev-team
✅ Message sent successfully!
```

---

### Confluence Setup (5 min)

**Step 1: Generate API Token**
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Name it: `Aura Frog Confluence`
4. Copy token

**Step 2: Find Space Key**
1. Open your Confluence space
2. Look at URL: `https://company.atlassian.net/wiki/spaces/DEV/...`
3. Space key is `DEV` (between `/spaces/` and next `/`)

**Step 3: Configure**
```bash
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="ethan.nguyen@example.com"
export CONFLUENCE_API_TOKEN="ATATT3xFfGF0w7t..."  # Paste your token
export CONFLUENCE_SPACE_KEY="DEV"
```

**Step 4: Test**
```bash
source .envrc

# Create test markdown file
cat > /tmp/test-doc.md <<EOF
# Test Documentation

This is a test page created by Aura Frog.

## Features
- Automatic publishing
- Markdown support
- Version control

\`\`\`bash
echo "Hello World"
\`\`\`
EOF

# Publish to Confluence
./scripts/confluence-publish.sh 'DEV' 'Aura Frog Test Page' '/tmp/test-doc.md'
```

**Expected output:**
```
📚 Publishing to Confluence...
✅ Page published successfully!
🔗 View page: https://company.atlassian.net/wiki/pages/viewpage.action?pageId=123456
```

---

## 🎮 Usage in Workflows

### Automatic JIRA Fetching

```bash
# Start workflow with ticket
workflow:start ETHAN-1269
```

Claude will:
1. Detect JIRA ticket: `ETHAN-1269`
2. Run: `bash scripts/jira-fetch.sh ETHAN-1269`
3. Parse requirements from JSON
4. Start Phase 1 with ticket context

### Automatic Figma Integration

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

### Phase 9: Auto-Notifications

At the end of Phase 9, Claude will:

```bash
# Update JIRA
bash scripts/jira-update.sh ETHAN-1269 "Done" "Implementation completed"

# Notify Slack
bash scripts/slack-notify.sh '#dev-team' '✅ ETHAN-1269 completed! @reviewer-team please review'

# Publish docs to Confluence
bash scripts/confluence-publish.sh 'DEV' 'ETHAN-1269: Implementation' '.claude/logs/workflows/*/implementation.md'
```

---

## 📚 Script Reference

### jira-fetch.sh

**Purpose:** Fetch JIRA ticket details

**Usage:**
```bash
./scripts/jira-fetch.sh <ticket-key>
```

**Examples:**
```bash
./scripts/jira-fetch.sh ETHAN-1269
./scripts/jira-fetch.sh PROJ-123
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

### figma-fetch.sh

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
- `FIGMA_API_TOKEN`
- `jq` (optional, for formatting)

---

### slack-notify.sh

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

### confluence-publish.sh

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

## 🔧 Advanced Configuration

### Per-Project Settings

Create project-specific overrides in your project context:

```yaml
# .claude/project-contexts/my-project/project-config.yaml
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

### Environment-Specific Tokens

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

### Custom Slack Messages

Create custom notification templates:

```bash
# scripts/slack-notify-deployment.sh
#!/bin/bash
ENVIRONMENT="$1"
VERSION="$2"
STATUS="$3"

MESSAGE="🚀 Deployment to *${ENVIRONMENT}*
Version: \`${VERSION}\`
Status: ${STATUS}
Deployed by: Aura Frog Bot"

bash scripts/slack-notify.sh '#deployments' "$MESSAGE"
```

---

## 🛠️ Troubleshooting

### All Scripts: "jq: command not found"

**Problem:** `jq` not installed

**Solution:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Verify
jq --version
```

**Alternative:** Scripts work without `jq`, just with less formatting

---

### JIRA: "HTTP 401 Unauthorized"

**Problem:** Invalid API token

**Solutions:**
1. Regenerate token at: https://id.atlassian.com/manage-profile/security/api-tokens
2. Update `.envrc`
3. `source .envrc`
4. Test: `curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" "$JIRA_URL/rest/api/3/myself"`

---

### Figma: "HTTP 403 Forbidden"

**Problem:** Invalid access token or no file permission

**Solutions:**
1. Regenerate token at: https://www.figma.com/settings
2. Ensure token has file access
3. Check file permissions (must be viewer or higher)
4. Update `.envrc`

---

### Slack: "channel_not_found"

**Problem:** Bot not invited to channel

**Solution:**
1. Go to Slack channel
2. Type: `/invite @Aura Frog Bot`
3. Try again

---

### Slack: "not_in_channel"

Same as above - bot needs to be invited

---

### Confluence: "HTTP 403 Forbidden"

**Problem:** No permission to create pages

**Solutions:**
1. Verify you have "Can add" permission in Confluence space
2. Check space key is correct
3. Verify API token is valid
4. Try creating page manually in Confluence to test permissions

---

### Confluence: Page Creates Duplicate Instead of Update

**Problem:** Script creates new page even though one exists with same title

**Reason:** Confluence allows duplicate titles in same space

**Solution:** Script checks for existing pages by title and updates if found. If still creating duplicates:
1. Manually delete duplicates
2. Try again
3. Or use explicit parent page ID to organize pages

---

## 📊 Comparison: Bash Scripts vs MCP

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

## ✅ Checklist

### Initial Setup
- [ ] Install `jq`: `brew install jq` or `sudo apt install jq`
- [ ] Edit `.envrc` with all tokens
- [ ] Run `source .envrc`
- [ ] Verify all scripts executable: `ls -l scripts/*.sh`

### JIRA
- [ ] JIRA API token generated
- [ ] `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` set
- [ ] Test: `./scripts/jira-fetch.sh <ticket>`

### Figma
- [ ] Figma access token generated
- [ ] `FIGMA_API_TOKEN` set
- [ ] Test: `./scripts/figma-fetch.sh <file-id>`

### Slack
- [ ] Slack app created
- [ ] Bot scopes added: `chat:write`, `chat:write.public`
- [ ] Bot installed to workspace
- [ ] `SLACK_BOT_TOKEN` set
- [ ] Bot invited to channels
- [ ] Test: `./scripts/slack-notify.sh '#channel' 'test'`

### Confluence
- [ ] Confluence API token generated
- [ ] `CONFLUENCE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_KEY` set
- [ ] Space permissions verified
- [ ] Test: `./scripts/confluence-publish.sh <space> <title> <file>`

---

## 🎯 Next Steps

1. **Complete setup** - Follow checklist above
2. **Test each integration** - Run test commands
3. **Try a workflow** - `workflow:start ETHAN-1269`
4. **Customize scripts** - Edit scripts for your needs
5. **Share with team** - Commit `.envrc.example`, not `.envrc`

---

## 📚 Related Documentation

- **JIRA Solution:** `docs/JIRA_WEBFETCH_SOLUTION.md`
- **JIRA Skill:** `skills/jira-fetch-webfetch.md`
- **JIRA Agent:** `agents/jira-operations.md`
- **Project Context:** `.claude/project-contexts/README.md`
- **Workflow Commands:** `commands/workflow/`

---

**Integration Status:** ✅ All 4 Services Ready
**Last Updated:** 2025-11-27
**Tested On:** Claude Code (macOS)

**Questions?** Check troubleshooting section or run `help integrations`
