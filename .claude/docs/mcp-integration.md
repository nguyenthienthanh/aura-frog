# MCP (Model Context Protocol) Integration Guide

**Version:** 1.0.0  
**Status:** Ready for Integration

---

## 🔌 What is MCP?

Model Context Protocol (MCP) enables AI assistants to connect with external data sources and tools. For CCPM Team Agents, MCP allows:

- 📋 **JIRA Integration** - Read/write tickets
- 📚 **Confluence Integration** - Read/write documentation
- 🔗 **Linear Integration** - Issue tracking
- 💬 **Slack Integration** - Notifications
- 🔍 **GitHub Integration** - Code & PRs

---

## 📦 MCP Servers Configuration

### Current Setup (in ccpm-config.yaml)

```yaml
mcp_servers:
  jira:
    command: 'npx'
    args: ['-y', '@automaze/mcp-jira']
    env:
      JIRA_URL: '${JIRA_URL}'
      JIRA_API_TOKEN: '${JIRA_API_TOKEN}'
      JIRA_USER_EMAIL: '${JIRA_USER_EMAIL}'
      
  confluence:
    command: 'npx'
    args: ['-y', '@automaze/mcp-confluence']
    env:
      CONFLUENCE_URL: '${CONFLUENCE_URL}'
      CONFLUENCE_API_TOKEN: '${CONFLUENCE_API_TOKEN}'
      CONFLUENCE_USER_EMAIL: '${CONFLUENCE_USER_EMAIL}'
      
  linear:
    command: 'npx'
    args: ['-y', '@automaze/mcp-linear']
    env:
      LINEAR_API_KEY: '${LINEAR_API_KEY}'
      
  slack:
    command: 'npx'
    args: ['-y', 'mcp-server-slack']
    env:
      SLACK_WEBHOOK_URL: '${SLACK_WEBHOOK_URL}'
```

---

## 🚀 Installation

### Step 1: Install MCP Servers

```bash
# JIRA MCP Server
npx -y @automaze/mcp-jira --version

# Confluence MCP Server
npx -y @automaze/mcp-confluence --version

# Linear MCP Server
npx -y @automaze/mcp-linear --version

# Slack MCP Server
npx -y mcp-server-slack --version
```

### Step 2: Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or equivalent on your OS:

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@automaze/mcp-jira"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_API_TOKEN": "your-api-token",
        "JIRA_USER_EMAIL": "your-email@company.com"
      }
    },
    "confluence": {
      "command": "npx",
      "args": ["-y", "@automaze/mcp-confluence"],
      "env": {
        "CONFLUENCE_URL": "https://your-company.atlassian.net/wiki",
        "CONFLUENCE_API_TOKEN": "your-api-token",
        "CONFLUENCE_USER_EMAIL": "your-email@company.com"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@automaze/mcp-linear"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "mcp-server-slack"],
      "env": {
        "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/..."
      }
    }
  }
}
```

### Step 3: Restart Claude

Restart Claude Desktop or Claude Code to load MCP servers.

---

## 🎯 How Agents Use MCP

### JIRA Operations Agent

```typescript
// Using MCP to fetch JIRA ticket
async function fetchJiraTicket(ticketId: string) {
  // MCP automatically provides jira_issue_get tool
  const issue = await mcp.tools.jira_issue_get({
    issueKey: ticketId,
  });
  
  return {
    key: issue.key,
    summary: issue.fields.summary,
    description: issue.fields.description,
    status: issue.fields.status.name,
    // ... more fields
  };
}

// Using MCP to update JIRA ticket (with confirmation)
async function updateJiraStatus(ticketId: string, newStatus: string) {
  // Show confirmation prompt first
  const confirmed = await requestUserConfirmation(`
    Update JIRA ${ticketId} status to ${newStatus}?
  `);
  
  if (!confirmed) return;
  
  // MCP provides jira_issue_transition tool
  await mcp.tools.jira_issue_transition({
    issueKey: ticketId,
    transition: newStatus,
  });
}
```

### Confluence Operations Agent

```typescript
// Using MCP to read Confluence page
async function fetchConfluencePage(pageId: string) {
  const page = await mcp.tools.confluence_page_get({
    id: pageId,
    expand: ['body.storage', 'version'],
  });
  
  return {
    id: page.id,
    title: page.title,
    content: page.body.storage.value,
    version: page.version.number,
  };
}

// Using MCP to create Confluence page (with confirmation)
async function createConfluencePage(
  spaceKey: string,
  title: string,
  content: string
) {
  const confirmed = await requestUserConfirmation(`
    Create Confluence page "${title}" in ${spaceKey}?
  `);
  
  if (!confirmed) return;
  
  await mcp.tools.confluence_page_create({
    spaceKey,
    title,
    content: {
      storage: {
        value: content,
        representation: 'storage',
      },
    },
  });
}
```

---

## 📋 Available MCP Tools

### JIRA MCP Server

```typescript
Tools provided:
- jira_issue_get(issueKey) → Get issue details
- jira_issue_search(jql) → Search issues
- jira_issue_create(fields) → Create new issue
- jira_issue_update(issueKey, fields) → Update issue
- jira_issue_transition(issueKey, transition) → Change status
- jira_issue_comment_add(issueKey, comment) → Add comment
```

### Confluence MCP Server

```typescript
Tools provided:
- confluence_page_get(id) → Get page content
- confluence_page_search(cql) → Search pages
- confluence_page_create(space, title, content) → Create page
- confluence_page_update(id, version, content) → Update page
- confluence_space_list() → List spaces
```

### Linear MCP Server

```typescript
Tools provided:
- linear_issue_get(id) → Get issue
- linear_issue_search(query) → Search issues
- linear_issue_create(title, description) → Create issue
- linear_issue_update(id, updates) → Update issue
- linear_team_list() → List teams
```

### Slack MCP Server

```typescript
Tools provided:
- slack_message_post(channel, text) → Send message
- slack_message_reply(thread_ts, text) → Reply to thread
- slack_channel_list() → List channels
```

---

## 🔐 Security Best Practices

### API Keys Storage

```bash
# ✅ GOOD: Environment variables
export JIRA_API_TOKEN="secret"

# ✅ GOOD: .envrc (with direnv)
echo 'export JIRA_API_TOKEN="secret"' >> .envrc
direnv allow .

# ❌ BAD: Hardcoded in config
jira:
  api_token: "secret"  # Never do this!
```

### Token Permissions

```yaml
JIRA Token permissions:
  ✅ Read issues
  ✅ Write issues (with confirmation)
  ❌ Delete issues (blocked by system)
  ❌ Admin actions

Confluence Token permissions:
  ✅ Read pages
  ✅ Create pages (with confirmation)
  ✅ Update pages (with confirmation)
  ❌ Delete pages (blocked by system)
```

---

## ✅ Testing MCP Integration

### Test JIRA Connection

```bash
# In Claude Code:
"Fetch JIRA ticket PROJ-1234"

# Expected:
✅ Fetching JIRA ticket PROJ-1234...
✅ Loaded: "Social Media Sharing Feature"
   Type: Story
   Status: In Progress
   Assignee: John Doe
```

### Test Confluence Connection

```bash
"Read Confluence page about authentication"

# Expected:
✅ Searching Confluence for "authentication"...
✅ Found 3 pages:
   1. Authentication Guide (ID: 123456)
   2. OAuth 2.0 Setup (ID: 123457)
   3. ...
```

### Test Write Operations

```bash
"Update JIRA PROJ-1234 status to Code Review"

# Expected:
⚠️ CONFIRMATION REQUIRED: JIRA Write

About to update JIRA ticket PROJ-1234:
- From: In Progress
- To: Code Review

Type "confirm" to proceed or "cancel" to skip
```

---

## 🆘 Troubleshooting

### MCP Server Not Loading?

```bash
# Check if npx can access packages
npx -y @automaze/mcp-jira --version

# Check Claude config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Restart Claude
```

### API Token Issues?

```bash
# Test JIRA token
curl -H "Authorization: Bearer $JIRA_API_TOKEN" \
  $JIRA_URL/rest/api/3/myself

# Test Confluence token  
curl -H "Authorization: Bearer $CONFLUENCE_API_TOKEN" \
  $CONFLUENCE_URL/rest/api/content?limit=1
```

### Tool Not Found?

```
Error: Tool 'jira_issue_get' not found

Solution:
1. Check MCP server is running
2. Restart Claude
3. Verify MCP config in claude_desktop_config.json
```

---

## 📖 Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [@automaze/mcp-jira](https://github.com/automazeio/mcp-jira)
- [@automaze/mcp-confluence](https://github.com/automazeio/mcp-confluence)
- [@automaze/mcp-linear](https://github.com/automazeio/mcp-linear)

---

## 🎉 Benefits of MCP Integration

### Before MCP (Manual)
```
User: "Check JIRA ticket PROJ-1234"
User: [Manually pastes ticket content]
AI: [Analyzes pasted content]
```

### After MCP (Automatic)
```
User: "Check JIRA ticket PROJ-1234"
AI: [Automatically fetches via MCP]
    ✅ Loaded: "Feature description..."
    [Analyzes real-time data]
```

**Benefits:**
- ⚡ **Faster** - No manual copy-paste
- 🔄 **Real-time** - Always up-to-date
- 🎯 **Accurate** - No transcription errors
- 🤖 **Automated** - Seamless integration

---

**Status:** 🟢 MCP Configuration Ready  
**Action Required:** Install MCP servers & configure Claude Desktop  
**Estimated Time:** 15 minutes

