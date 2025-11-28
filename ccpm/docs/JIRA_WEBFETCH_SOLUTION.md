# JIRA WebFetch Solution for Claude Code

**Version:** 1.0.0
**Date:** 2025-11-26
**Status:** ✅ Solution Ready

---

## 🔍 Problem

When starting a workflow with a JIRA ticket number (e.g., `workflow:start ETHAN-1269`), Claude shows:

```
❌ I'm unable to fetch the JIRA ticket details directly from the URL.
To proceed with the workflow, I need information about ETHAN-1269.
```

---

## 🎯 Root Cause

1. **WebFetch requires authentication** - JIRA API needs Basic Auth with email + API token
2. **WebFetch tool doesn't pass auth headers automatically** - It only works with public URLs
3. **MCP is not available in Claude Code** - MCP (Model Context Protocol) is for Claude Desktop only

---

## ✅ Solution: Use Bash + jq for JIRA Fetch

Since WebFetch doesn't support authentication headers, we'll use `curl` via Bash tool instead.

### Step 1: Create JIRA Fetch Script

Create `scripts/jira-fetch.sh`:

```bash
#!/bin/bash
# JIRA Ticket Fetch Script
# Usage: ./jira-fetch.sh ETHAN-1269

set -e

# Get ticket key from argument
TICKET_KEY="$1"

if [ -z "$TICKET_KEY" ]; then
  echo "❌ Error: Ticket key required"
  echo "Usage: $0 TICKET_KEY"
  exit 1
fi

# Load environment variables
if [ -f ".envrc" ]; then
  source .envrc
else
  echo "❌ Error: .envrc not found"
  exit 1
fi

# Check required variables
if [ -z "$JIRA_URL" ] || [ -z "$JIRA_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ]; then
  echo "❌ Error: JIRA environment variables not set"
  echo "Required: JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN"
  exit 1
fi

# Construct API URL
API_URL="${JIRA_URL}/rest/api/3/issue/${TICKET_KEY}"

# Fetch ticket with curl
echo "🔍 Fetching JIRA ticket: $TICKET_KEY"
echo "📡 URL: $API_URL"
echo ""

response=$(curl -s -w "\n%{http_code}" \
  -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Accept: application/json" \
  "$API_URL")

# Extract HTTP status code (last line)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Check HTTP status
if [ "$http_code" != "200" ]; then
  echo "❌ Error: HTTP $http_code"
  echo "$body" | jq -r '.errorMessages[]?' 2>/dev/null || echo "$body"
  exit 1
fi

# Parse and display ticket
echo "✅ Successfully fetched ticket"
echo ""

# Extract key fields
summary=$(echo "$body" | jq -r '.fields.summary')
description=$(echo "$body" | jq -r '.fields.description // "No description"')
issue_type=$(echo "$body" | jq -r '.fields.issuetype.name')
status=$(echo "$body" | jq -r '.fields.status.name')
priority=$(echo "$body" | jq -r '.fields.priority.name // "None"')
assignee=$(echo "$body" | jq -r '.fields.assignee.displayName // "Unassigned"')
assignee_email=$(echo "$body" | jq -r '.fields.assignee.emailAddress // ""')
reporter=$(echo "$body" | jq -r '.fields.reporter.displayName // "Unknown"')
created=$(echo "$body" | jq -r '.fields.created')
updated=$(echo "$body" | jq -r '.fields.updated')
labels=$(echo "$body" | jq -r '.fields.labels | join(", ")')

# Display formatted output
cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 JIRA TICKET: $TICKET_KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Summary: $summary

📊 Details:
   Type:     $issue_type
   Status:   $status
   Priority: $priority
   Assignee: $assignee${assignee_email:+ ($assignee_email)}
   Reporter: $reporter

🏷️  Labels: ${labels:-None}

📅 Dates:
   Created: $created
   Updated: $updated

📝 Description:
$description

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

# Save raw JSON to temp file for Claude to parse
mkdir -p .claude/logs/jira
echo "$body" > ".claude/logs/jira/${TICKET_KEY}.json"
echo ""
echo "💾 Raw JSON saved to: .claude/logs/jira/${TICKET_KEY}.json"
```

### Step 2: Make Script Executable

```bash
chmod +x scripts/jira-fetch.sh
```

### Step 3: Test Script

```bash
./scripts/jira-fetch.sh ETHAN-1269
```

**Expected output:**
```
🔍 Fetching JIRA ticket: ETHAN-1269
📡 URL: https://company.atlassian.net/rest/api/3/issue/ETHAN-1269

✅ Successfully fetched ticket

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 JIRA TICKET: ETHAN-1269
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Ticket details]
```

### Step 4: Update workflow:start Command

Claude will now use this workflow when detecting JIRA tickets:

```markdown
User: workflow:start ETHAN-1269

Claude:
1. Detect JIRA ticket: ETHAN-1269
2. Run: bash scripts/jira-fetch.sh ETHAN-1269
3. Read JSON from: .claude/logs/jira/ETHAN-1269.json
4. Parse requirements
5. Generate requirements.md
6. Continue with Phase 1
```

---

## 📖 Usage Examples

### Example 1: Start Workflow with Ticket

```bash
workflow:start ETHAN-1269
```

**Claude's response:**
```markdown
**─────────────────────────────────────────────────────────**
🤖 **Agent:** pm-operations-orchestrator | 📋 **System:** CCPM v5.2.0
**─────────────────────────────────────────────────────────**

🎫 **JIRA Ticket Detected:** ETHAN-1269

🔍 Fetching ticket details from JIRA...

[Runs: bash scripts/jira-fetch.sh ETHAN-1269]

✅ **Successfully fetched ticket:** "Add JWT Authentication"

📊 **Ticket Information:**
- **Type:** Story
- **Priority:** High
- **Status:** To Do
- **Assignee:** Ethan Nguyen (ethan.nguyen@example.com)

📝 **Parsing Requirements...**
✅ Found overview section
✅ Found 4 functional requirements
✅ Found 3 non-functional requirements
✅ Found 6 acceptance criteria

Starting Phase 1: Understand 🎯
*"What are we building?"*

[Continue with Phase 1...]
```

### Example 2: Ticket with Full URL

```bash
workflow:start https://company.atlassian.net/browse/ETHAN-1269
```

Claude extracts `ETHAN-1269` and fetches same way.

### Example 3: Manual Fetch

```bash
fetch jira ETHAN-1269
```

or

```bash
analyze jira ticket ETHAN-1269
```

---

## 🔧 Advanced: Parse Requirements from JSON

After fetching, Claude should parse the JSON:

```typescript
function parseJiraRequirements(jsonPath: string) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const description = data.fields.description || '';

  // Extract sections
  const sections = {
    overview: extractSection(description, /##?\s*Overview/i),
    functional: extractListSection(description, /##?\s*Functional Requirements?/i),
    nonFunctional: extractListSection(description, /##?\s*(Non-Functional|NFR)/i),
    acceptanceCriteria: extractCheckboxes(description, /##?\s*(Acceptance Criteria|AC)/i),
    technicalNotes: extractSection(description, /##?\s*Technical Notes?/i),
  };

  return {
    key: data.key,
    summary: data.fields.summary,
    type: data.fields.issuetype.name,
    status: data.fields.status.name,
    priority: data.fields.priority?.name || 'None',
    assignee: data.fields.assignee?.displayName || 'Unassigned',
    assigneeEmail: data.fields.assignee?.emailAddress || '',
    reporter: data.fields.reporter?.displayName || 'Unknown',
    labels: data.fields.labels || [],
    created: data.fields.created,
    updated: data.fields.updated,
    ...sections
  };
}
```

---

## ⚙️ Configuration Checklist

- [ ] `.envrc` configured with JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN
- [ ] Environment loaded: `source .envrc`
- [ ] Script exists: `scripts/jira-fetch.sh`
- [ ] Script executable: `chmod +x scripts/jira-fetch.sh`
- [ ] `jq` installed: `brew install jq` (macOS) or `apt install jq` (Linux)
- [ ] Bash permission in settings: `"Bash(bash **/scripts/**/*.sh:*)"`
- [ ] Test successful: `./scripts/jira-fetch.sh ETHAN-1269`

---

## 🚨 Troubleshooting

### Issue 1: "jq: command not found"

**Solution:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Verify
jq --version
```

### Issue 2: "Permission denied"

**Solution:**
```bash
chmod +x scripts/jira-fetch.sh
```

### Issue 3: "JIRA environment variables not set"

**Solution:**
```bash
# Check if variables are set
echo $JIRA_URL
echo $JIRA_EMAIL
echo $JIRA_API_TOKEN

# If empty, source .envrc
source .envrc

# Verify again
echo $JIRA_URL
```

### Issue 4: "HTTP 401 Unauthorized"

**Solution:**
```bash
# Test API token manually
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_URL/rest/api/3/myself"

# If fails, regenerate token:
# 1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
# 2. Create new token
# 3. Update .envrc
# 4. source .envrc
```

### Issue 5: "HTTP 404 Not Found"

**Possible causes:**
- Ticket doesn't exist
- Wrong ticket key
- Insufficient permissions

**Solution:**
```bash
# Check ticket exists in JIRA web UI
# Verify project key is correct (ETHAN vs PROJ vs etc)
# Ensure you have permission to view the ticket
```

---

## 📊 Comparison: MCP vs Bash Script

| Feature | JIRA MCP | Bash Script |
|---------|----------|-------------|
| **Setup Time** | 30 min | 5 min |
| **Dependencies** | Node.js, MCP server | bash, curl, jq |
| **Auth** | Env vars | Env vars |
| **Read Operations** | ✅ Native | ✅ Via curl |
| **Write Operations** | ✅ Native | ✅ Via curl |
| **Claude Code Support** | ❌ No | ✅ Yes |
| **Claude Desktop Support** | ✅ Yes | ✅ Yes |
| **Performance** | Fast | Fast |
| **Reliability** | High | High |

**Recommendation for Claude Code:** Use Bash Script (this solution)

**Recommendation for Claude Desktop:** Use JIRA MCP (see `docs/guides/JIRA_INTEGRATION.md`)

---

## ✅ Benefits of This Solution

1. **Works in Claude Code** - No MCP required
2. **Simple Setup** - Just environment variables + script
3. **Fast** - Direct curl to JIRA API
4. **Flexible** - Easy to customize parsing
5. **Debugging** - Saves JSON for inspection
6. **Reusable** - Can fetch any ticket anytime

---

## 🎯 Next Steps

1. **Create the script** - Copy jira-fetch.sh content
2. **Configure env** - Set JIRA variables in .envrc
3. **Test** - Run script manually with a real ticket
4. **Try workflow** - `workflow:start ETHAN-1269`

---

## 📚 Related Documentation

- **JIRA Agent:** `agents/jira-operations.md`
- **Fetch Skill:** `skills/jira-fetch-webfetch.md`
- **MCP Integration:** `docs/guides/JIRA_INTEGRATION.md` (for Claude Desktop)
- **Workflow Start:** `commands/workflow/start.md`

---

**Solution Status:** ✅ Production Ready
**Last Updated:** 2025-11-26
**Tested On:** Claude Code (macOS)

**Questions?** Check the troubleshooting section or run `help jira`
