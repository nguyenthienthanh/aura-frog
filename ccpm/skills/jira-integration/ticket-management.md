---
name: jira-integration
description: "Auto-fetch JIRA tickets when ID detected. Triggers: 'PROJ-1234', JIRA URLs. Requires JIRA credentials in .envrc."
allowed-tools: Read, Bash
---

# CCPM JIRA Integration

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

### 2. Fetch Ticket
```bash
bash scripts/jira-fetch.sh PROJ-1234
# Output: .claude/logs/jira/PROJ-1234.json
```

### 3. Use in Workflow
- Summary → Task title
- Description → Requirements
- Acceptance criteria → Success criteria
- Labels → Agent detection hints

### 4. Update Status (Optional)
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
