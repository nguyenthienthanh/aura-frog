---
name: jira-integration
description: "Auto-fetch JIRA tickets when ID detected. Triggers: 'PROJ-1234', JIRA URLs. Requires JIRA credentials in .envrc."
allowed-tools: Read, Bash
---

# Aura Frog JIRA Integration

**Priority:** MEDIUM - Use when ticket ID detected

---

## When to Use

**AUTO-DETECT when:**
- Ticket ID mentioned: `PROJ-1234`, `IGNT-567`
- JIRA URL shared
- Starting workflow with ticket reference

---

## Integration Process

### 1. Detect Ticket ID
```javascript
const match = message.match(/([A-Z]{2,10})-(\d+)/)
const ticketId = match[0] // "PROJ-1234"
```

### 2. Check for Existing Log Data (PRIORITY)

**⚠️ IMPORTANT: Always check for cached data first before fetching!**

**Log file locations (check in order):**
```
.claude/logs/jira/{TICKET_ID}-readable.txt  ← Human-readable format
.claude/logs/jira/{TICKET_ID}.json          ← Raw JSON data
logs/jira/{TICKET_ID}-readable.txt          ← Alternative location
logs/jira/{TICKET_ID}.json                  ← Alternative location
```

**Decision logic:**
```
IF log file exists AND user did NOT request "fetch", "refresh", "update":
  → READ from log file using Read tool
  → Show cached data with note: "📋 Using cached data from {date}"

IF log file does NOT exist OR user requests fresh data:
  → FETCH using bash script
```

**Read cached data:**
```bash
# Prefer readable format
Read .claude/logs/jira/PROJ-1234-readable.txt

# Or parse JSON if needed
Read .claude/logs/jira/PROJ-1234.json
```

### 3. Fetch Fresh Data (Only When Needed)

**Fetch when:**
- No cached log exists
- User says: "fetch", "refresh", "update", "get latest"
- User explicitly requests fresh data

```bash
bash scripts/jira-fetch.sh PROJ-1234
# Output:
#   logs/jira/PROJ-1234-readable.txt  ← Formatted data
#   logs/jira/PROJ-1234.json          ← Raw JSON
#   logs/jira/jira-fetch-{timestamp}.log ← Execution log
```

### 4. Use in Workflow
- Summary → Task title
- Description → Requirements
- Acceptance criteria → Success criteria
- Labels → Agent detection hints

### 5. Update Status (Optional)
```bash
# Update status
bash scripts/jira-update.sh PROJ-1234 status "In Progress"

# Add comment
bash scripts/jira-update.sh PROJ-1234 comment "Implementation started"
```

---

## Setup

**In `.envrc`:**
```bash
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="email@company.com"
export JIRA_API_TOKEN="your-token"
```

---

## Status Transitions

| Phase | JIRA Status |
|-------|-------------|
| Phase 1 start | In Progress |
| Phase 5b done | In Review |
| Phase 7 done | Testing |
| Phase 9 done | Done |

---

**📚 Setup:** `docs/INTEGRATION_SETUP_GUIDE.md`

**Remember:** JIRA integration is optional. Workflow works without it.
