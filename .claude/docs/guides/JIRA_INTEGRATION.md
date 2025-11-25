# JIRA Integration Guide

**Complete guide for JIRA MCP integration with CCPM Team Agents**

---

## 🎯 Overview

JIRA MCP enables automatic:
- Fetch ticket requirements
- Update ticket status (with approval)
- Add comments and track progress
- Link documentation

---

## 📦 Setup (15 minutes)

### Step 1: Get JIRA API Token
```bash
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name: "CCPM Team Agents"
4. Copy token
```

### Step 2: Configure Environment
```bash
# Add to .envrc
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_API_TOKEN="your-api-token"
export JIRA_USER_EMAIL="your-email@company.com"
export JIRA_PROJECT_KEY="PROJ"

# Allow direnv
direnv allow .
```

### Step 3: Install JIRA MCP Server
```bash
# Install @automaze/mcp-jira
npx -y @automaze/mcp-jira --version
```

### Step 4: Configure Claude Desktop
```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@automaze/mcp-jira"],
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}",
        "JIRA_USER_EMAIL": "${JIRA_USER_EMAIL}"
      }
    }
  }
}
```

### Step 5: Update ccpm-config.yaml
```yaml
projects:
  your-project:
    integrations:
      jira:
        enabled: true
        url: "https://your-company.atlassian.net"
        project_key: "PROJ"
        api_token_env: "JIRA_API_TOKEN"
```

---

## 🚀 Usage

### Phase 1: Fetch Requirements
```
User: "Analyze JIRA ticket PROJ-1234"

Agent automatically:
1. Fetches ticket via MCP
2. Extracts:
   - Summary & Description
   - Acceptance criteria
   - Attachments & links
   - Comments
3. Generates requirements.md
```

### During Workflow
```
Agent: "Should I update JIRA PROJ-1234 status to 'In Progress'?"

⚠️ CONFIRMATION REQUIRED
Type "confirm" to update JIRA
```

### Phase 9: Update Status
```
Agent automatically (after approval):
- Updates ticket status
- Adds implementation summary comment
- Links generated documentation
```

---

## 🔧 Available Operations

### Read Operations (No approval needed)
- `jira_issue_get(issueKey)` - Get ticket details
- `jira_issue_search(jql)` - Search tickets
- `jira_project_get(projectKey)` - Get project info

### Write Operations (Approval required)
- `jira_issue_update(issueKey, fields)` - Update fields
- `jira_issue_transition(issueKey, status)` - Change status
- `jira_issue_comment_add(issueKey, comment)` - Add comment

---

## 📊 Example Workflow

```
1. User provides JIRA link
   ↓
2. Agent fetches ticket (JIRA MCP)
   ↓
3. Phase 1: Requirements Analysis
   - Parses description
   - Extracts user stories
   - Identifies acceptance criteria
   ↓
4. Generate requirements.md
   ↓
5. User approves Phase 1
   ↓
... (Phases 2-8)
   ↓
9. Phase 9: Update JIRA
   - Status: Done
   - Comment: Implementation summary
   - Link: Confluence documentation
```

---

## 🔒 Security

```yaml
Permissions:
  Read: ✅ Always allowed
  Write: ⚠️ Requires user confirmation
  Delete: ❌ Blocked by system

Safety:
  - All writes logged
  - Confirmation prompts shown
  - Can be cancelled anytime
```

---

## 🆘 Troubleshooting

### "JIRA MCP not configured"
```bash
# Check Claude Desktop config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Restart Claude Desktop
```

### "Invalid credentials"
```bash
# Test JIRA API
curl -u your-email@company.com:$JIRA_API_TOKEN \
  $JIRA_URL/rest/api/3/myself
```

### "Permission denied"
```
Ensure JIRA token has:
- Read issues
- Edit issues
- Add comments
```

---

**Setup Time:** 15 minutes  
**Status:** Production ready

