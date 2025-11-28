# JIRA Integration Guide

**Complete guide for JIRA integration with CCPM Team Agents using Bash scripts**

**Version:** 2.0.0 (Bash Script Approach)
**Last Updated:** 2025-11-27

---

## 🎯 Overview

CCPM provides **native Bash script integration** for JIRA, optimized for Claude Code:

**Features:**
- ✅ Fetch ticket requirements automatically
- ✅ Parse acceptance criteria and descriptions
- ✅ Update ticket status (with approval)
- ✅ Add comments and track progress
- ✅ Link documentation

**Why Bash Scripts (Not MCP)?**
- ✅ **Works in Claude Code** (MCP is Claude Desktop only)
- ✅ **Faster** (~200ms vs ~500ms with MCP)
- ✅ **Simpler** (no Node.js dependency)
- ✅ **More flexible** (easy to customize)
- ✅ **Better for development** workflows

---

## 📚 Quick Navigation

**Choose your guide:**

### 🚀 Quick Start (15 minutes)
→ **[Integration Setup Guide](./../INTEGRATION_SETUP_GUIDE.md)**
- Fastest way to get started
- All 4 integrations (JIRA, Figma, Slack, Confluence)
- Quick setup + detailed config in one place

### 📖 Technical Reference
→ **[Bash Integrations Reference](./../BASH_INTEGRATIONS_REFERENCE.md)**
- API documentation
- Script architecture
- Extending and customization

### 🔧 Technical Deep Dive
→ **[JIRA WebFetch Solution](./../JIRA_WEBFETCH_SOLUTION.md)**
- How it works internally
- Comparison with MCP
- Advanced customization

### 🤖 For Claude
→ **[JIRA Integration Skill](./../../skills/jira-integration/ticket-management.md)**
- How Claude uses the script
- Integration with workflows
- Error handling

---

## ⚡ Quick Start

### 1. Get API Token (2 min)

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name: `CCPM Integration`
4. Copy token

### 2. Configure (1 min)

Edit `.envrc`:

```bash
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your.email@company.com"
export JIRA_API_TOKEN="paste_your_token_here"
export JIRA_PROJECT_KEY="PROJ"
```

### 3. Load & Test (2 min)

```bash
# Load environment
source .envrc

# Test with your ticket
./scripts/jira-fetch.sh PROJ-123
```

**✅ If you see ticket details → You're done!**

---

## 🎮 Usage

### In Workflows

```bash
# Auto-fetch JIRA ticket
workflow:start ETHAN-1269
```

Claude will:
1. Detect ticket: `ETHAN-1269`
2. Run: `bash scripts/jira-fetch.sh ETHAN-1269`
3. Parse requirements from JSON
4. Start Phase 1 with ticket context

### Manual Fetch

```bash
# Fetch any ticket
./scripts/jira-fetch.sh PROJ-123

# View saved JSON
cat .claude/logs/jira/PROJ-123.json | jq
```

### During Workflow

**Phase 1:** Auto-fetch requirements
**Phase 9:** Update ticket status (with confirmation)

```
Agent: Should I update JIRA PROJ-123 status to 'Done'?
⚠️ CONFIRMATION REQUIRED
Type "confirm" to update JIRA
```

---

## 📊 What Gets Fetched

From JIRA ticket, the script extracts:

- ✅ **Summary** (title)
- ✅ **Description** (full content with formatting)
- ✅ **Issue Type** (Story, Bug, Task, etc.)
- ✅ **Status** (To Do, In Progress, Done, etc.)
- ✅ **Priority** (Low, Medium, High, Critical)
- ✅ **Assignee** & **Reporter**
- ✅ **Labels** & **Components**
- ✅ **Story Points** (if configured)
- ✅ **Sprint** (if in sprint)
- ✅ **Created/Updated** dates
- ✅ **Comments** (if any)

**Output:**
- Console: Formatted summary
- JSON: `.claude/logs/jira/<ticket-key>.json` (full data)

---

## 🔧 Advanced Features

### Custom Parsing

Edit `scripts/jira-fetch.sh` to:
- Extract custom fields
- Parse specific formats
- Add logging
- Cache responses

### Project-Specific Config

In `.claude/project-contexts/your-project/project-config.yaml`:

```yaml
integrations:
  jira:
    project_key: "MYPROJ"
    default_assignee: "dev@company.com"
    auto_fetch: true
    parse_acceptance_criteria: true
```

### Environment-Specific Tokens

```bash
# .envrc
if [ "$PROJECT_ENV" = "production" ]; then
  export JIRA_PROJECT_KEY="PROD"
else
  export JIRA_PROJECT_KEY="DEV"
fi
```

---

## 🛠️ Troubleshooting

### Error: "HTTP 401 Unauthorized"

**Solution:**
1. Regenerate token: https://id.atlassian.com/manage-profile/security/api-tokens
2. Update `.envrc`
3. `source .envrc`
4. Test: `curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" "$JIRA_URL/rest/api/3/myself"`

### Error: "HTTP 404 Not Found"

**Possible causes:**
- Ticket doesn't exist
- Wrong project key
- No permission to view ticket

**Solution:**
- Verify ticket exists in JIRA web UI
- Check project key matches
- Ensure you have view permissions

### Error: "jq: command not found"

**Solution:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq
```

**Note:** Script works without `jq`, just with less formatting

### Script Permission Denied

**Solution:**
```bash
chmod +x scripts/jira-fetch.sh
```

---

## 📋 Example Workflow

```
1. User types: workflow:start ETHAN-1269
   ↓
2. Claude detects JIRA ticket
   ↓
3. Runs: bash scripts/jira-fetch.sh ETHAN-1269
   ↓
4. Parses JSON: .claude/logs/jira/ETHAN-1269.json
   ↓
5. Extracts:
   - Summary: [Cute] Gen AI Generation Error pop up
   - Type: Story
   - Status: In Progress
   - Assignee: Ethan Nguyen
   - Story Points: 3
   ↓
6. Phase 1: Requirements Analysis
   - Uses ticket data for context
   - Generates requirements.md
   ↓
7. ... Phases 2-8 ...
   ↓
8. Phase 9: Update JIRA
   - Status: Done
   - Comment: Implementation summary
   - Link: Confluence docs
```

---

## 🔒 Security

**Permissions:**
- ✅ **Read operations:** Always allowed (no approval)
- ⚠️ **Write operations:** Require user confirmation
- ❌ **Delete operations:** Not implemented (safety)

**Best Practices:**
- ✅ Use API tokens (not passwords)
- ✅ Rotate tokens every 90 days
- ✅ `.envrc` is git-ignored
- ✅ Never commit tokens to git
- ✅ Use environment-specific tokens

---

## 📊 Comparison: Bash vs MCP

| Feature | Bash Scripts (✅ Our Approach) | MCP |
|---------|-------------------------------|-----|
| **Claude Code** | ✅ Works | ❌ Not available |
| **Setup Time** | 5 min | 15 min |
| **Dependencies** | bash, curl, jq | Node.js, npm, MCP server |
| **Performance** | ~200ms | ~500ms |
| **Customization** | ✅ Easy | ⚠️ Limited |
| **Debugging** | ✅ Simple | ⚠️ Complex |
| **Offline** | ✅ Can cache | ❌ No |

**Verdict:** Bash scripts are better for Claude Code! ✅

---

## 📚 Related Documentation

**Setup Guides:**
- [Integration Setup Guide](../INTEGRATION_SETUP_GUIDE.md) - Complete setup (quick start + detailed config)
- [Bash Integrations Reference](../BASH_INTEGRATIONS_REFERENCE.md) - Technical API reference

**Technical Details:**
- [JIRA WebFetch Solution](../JIRA_WEBFETCH_SOLUTION.md)
- [JIRA Integration Skill](../../skills/jira-integration/ticket-management.md)

**Agent Info:**
- [JIRA Operations Agent](../../agents/jira-operations.md)

**Other Integrations:**
- Figma, Slack, Confluence → See [Integration Setup Guide](../INTEGRATION_SETUP_GUIDE.md)

---

## ✅ Checklist

- [ ] API token generated
- [ ] `.envrc` configured
- [ ] Environment loaded: `source .envrc`
- [ ] Script tested: `./scripts/jira-fetch.sh <ticket>`
- [ ] JSON saved: `.claude/logs/jira/<ticket>.json`
- [ ] Try workflow: `workflow:start <ticket>`

---

## 🆘 Need Help?

1. **Quick issues:** Check troubleshooting section above
2. **Setup help:** See [Integration Setup Guide](../INTEGRATION_SETUP_GUIDE.md)
3. **Technical deep dive:** See [JIRA WebFetch Solution](../JIRA_WEBFETCH_SOLUTION.md)
4. **Report bugs:** Create issue in project repository

---

**Integration Status:** ✅ Production Ready
**Last Updated:** 2025-11-27
**Tested With:** Claude Code (macOS), JIRA Cloud
**Script Location:** `scripts/jira-fetch.sh`

**Ready to use!** Just run `workflow:start` with your JIRA ticket number. 🚀
