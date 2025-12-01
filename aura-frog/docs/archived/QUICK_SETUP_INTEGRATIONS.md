# Quick Setup: All Integrations (15 minutes)

**Version:** 1.0.0
**Last Updated:** 2025-11-27

> **⚠️ DEPRECATION NOTICE:**
> This guide has been consolidated into [`INTEGRATION_SETUP_GUIDE.md`](INTEGRATION_SETUP_GUIDE.md) (Section 2).
> **Please use the new consolidated guide** for the complete integration setup experience.
> This file will be archived in a future release.

---

## ⚡ Super Quick Setup

### 1. Install jq (if not installed)

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Verify
jq --version
```

### 2. Get All Tokens (10 min)

#### JIRA Token (2 min)
1. https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name: `Aura Frog`
4. Copy token → Save for step 3

#### Figma Token (1 min)
1. https://www.figma.com/settings
2. Scroll to "Personal Access Tokens"
3. Click "Generate new token"
4. Name: `Aura Frog`
5. Copy token → Save for step 3

#### Slack Token (5 min)
1. https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name: `Aura Frog Bot`, select workspace
4. Go to "OAuth & Permissions"
5. Add scopes: `chat:write`, `chat:write.public`
6. Click "Install to Workspace"
7. Copy "Bot User OAuth Token" (xoxb-...) → Save for step 3
8. In Slack: `/invite @Aura Frog Bot` to your channel

#### Confluence Token (2 min)
1. https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name: `Aura Frog Confluence`
4. Copy token → Save for step 3

### 3. Configure .envrc (2 min)

Edit `.envrc`:

```bash
# Replace {{placeholders}} with your actual values:

# JIRA (✅ already configured in your case)
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="ethan.nguyen@example.com"
export JIRA_API_TOKEN="paste_jira_token_here"

# Figma
export FIGMA_API_TOKEN="paste_figma_token_here"

# Slack
export SLACK_BOT_TOKEN="paste_slack_token_here"  # xoxb-...
export SLACK_CHANNEL_ID="#dev-team"  # or use channel ID like C01234567

# Confluence
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="ethan.nguyen@example.com"
export CONFLUENCE_API_TOKEN="paste_confluence_token_here"
export CONFLUENCE_SPACE_KEY="DEV"  # Find in Confluence URL
```

### 4. Load & Test (3 min)

```bash
# Load environment
source .envrc

# Test JIRA
./scripts/jira-fetch.sh ETHAN-1269

# Test Figma (replace with your file ID)
./scripts/figma-fetch.sh ABC123xyz456

# Test Slack
./scripts/slack-notify.sh '#dev-team' '✅ Aura Frog integrations working!'

# Test Confluence (creates test page)
echo "# Test\nAura Frog is ready!" > /tmp/test.md
./scripts/confluence-publish.sh 'DEV' 'Aura Frog Test' '/tmp/test.md'
```

**If all 4 succeed → You're done! ✅**

---

## 🎯 Quick Reference

### Usage in Workflows

```bash
# JIRA: Auto-fetch when starting workflow
workflow:start ETHAN-1269

# Figma: Include in workflow prompt
workflow:start "Implement https://figma.com/file/ABC123/Design"

# Slack: Manual notification
bash scripts/slack-notify.sh '#team' 'Update message'

# Confluence: Publish docs
bash scripts/confluence-publish.sh 'SPACE' 'Title' 'file.md'
```

---

## 🐛 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| `jq: command not found` | `brew install jq` |
| `HTTP 401` (JIRA/Confluence) | Regenerate token, update .envrc |
| `HTTP 403` (Figma) | Regenerate token at figma.com/settings |
| `channel_not_found` (Slack) | `/invite @Aura Frog Bot` in channel |
| Script not executable | `chmod +x scripts/*.sh` |

---

## 📚 Detailed Docs

- **Complete Guide:** `docs/BASH_INTEGRATIONS_GUIDE.md`
- **JIRA Details:** `docs/JIRA_WEBFETCH_SOLUTION.md`

---

**Setup Time:** 15 minutes total
**Status:** ✅ Ready to use

**Next:** Try `workflow:start ETHAN-1269` to see JIRA integration in action!
