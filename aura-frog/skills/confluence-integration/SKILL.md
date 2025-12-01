---
name: confluence-integration
description: "Manage Confluence pages - fetch, search, create, update. Requires Confluence credentials in .envrc."
autoInvoke: true
priority: medium
triggers:
  - "Confluence URL"
  - "confluence page"
  - "wiki page"
  - "documentation request"
allowed-tools: Read, Bash
---

# Aura Frog Confluence Integration

**Priority:** MEDIUM - Use when Confluence page/documentation needed

---

## When to Use

**AUTO-DETECT when:**
- Confluence URL shared: `https://company.atlassian.net/wiki/...`
- Documentation request with Confluence mention
- Phase 8 (Documentation) - for publishing
- Phase 9 (Share) - for updating team docs
- User mentions "confluence page", "wiki", "documentation"

---

## Integration Process

### 1. Detect Confluence Reference

```javascript
// Confluence URL pattern
const urlMatch = message.match(/https:\/\/[^\/]+\.atlassian\.net\/wiki\/.*pageId=(\d+)/)
const pageId = urlMatch ? urlMatch[1] : null

// Or detect keywords
const keywords = ['confluence', 'wiki page', 'documentation page', 'confluence page']
```

### 2. Check for Existing Log Data (PRIORITY)

**⚠️ IMPORTANT: Always check for cached data first before fetching!**

**Log file locations (check in order):**
```
.claude/logs/confluence/page-{PAGE_ID}.html    ← Page content
.claude/logs/confluence/page-{PAGE_ID}.json    ← Full metadata
logs/confluence/page-{PAGE_ID}.html            ← Alternative
logs/confluence/page-{PAGE_ID}.json            ← Alternative
```

**Decision logic:**
```
IF log file exists AND user did NOT request "fetch", "refresh", "update":
  → READ from log file using Read tool
  → Show cached data with note: "📋 Using cached data"

IF log file does NOT exist OR user requests fresh data:
  → FETCH using bash script
```

### 3. Operations

#### Fetch Page (Read-Only)

```bash
# By page ID
bash scripts/confluence-operations.sh fetch 123456

# By title (requires space key)
bash scripts/confluence-operations.sh fetch "API Documentation" DEV
```

**Output:**
- `logs/confluence/page-{ID}.html` - Content
- `logs/confluence/page-{ID}.json` - Full metadata

#### Search Pages

```bash
# Search all spaces
bash scripts/confluence-operations.sh search "deployment guide"

# Search specific space
bash scripts/confluence-operations.sh search "release notes" PROJ 20
```

**Output:**
- `logs/confluence/search-results-{timestamp}.json`

#### Create Page (WITH CONFIRMATION)

```bash
bash scripts/confluence-operations.sh create DEV "API Documentation" docs/api.md
bash scripts/confluence-operations.sh create PROJ "Sprint Report" report.md 123456
```

**⚠️ REQUIRES user confirmation before executing**

#### Update Page (WITH CONFIRMATION)

```bash
bash scripts/confluence-operations.sh update 123456 docs/updated-content.md
bash scripts/confluence-operations.sh update 123456 docs/api.md "New Title"
```

**⚠️ REQUIRES user confirmation before executing**

---

## Setup

**In `.envrc`:**
```bash
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="email@company.com"
export CONFLUENCE_API_TOKEN="your-token"
```

**Get API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create new token
3. Add to .envrc

---

## Phase Integration

| Phase | Confluence Use |
|-------|----------------|
| Phase 1 | Search existing docs for context |
| Phase 2 | Reference architecture docs |
| Phase 8 | Create/update implementation docs |
| Phase 9 | Publish summary, notify stakeholders |

---

## Safety Rules

**ALWAYS require confirmation for:**
- ✅ Creating new pages
- ✅ Updating existing pages
- ✅ Moving pages

**READ operations are safe:**
- ✅ Fetch page content
- ✅ Search pages

---

## Confirmation Format

Before create/update operations:

```markdown
⚠️ **CONFIRMATION REQUIRED: [Create/Update] Confluence Page**

**Space:** DEV (Development)
**Title:** "API Documentation"
**Page ID:** 123456 (if update)

**Action:** [Create new page / Update version X → Y]

Type "confirm" to proceed or "cancel" to skip
```

---

**📚 Setup:** `docs/INTEGRATION_SETUP_GUIDE.md`
**📚 Agent:** `agents/confluence-operations.md`

**Remember:** Confluence integration is optional. Workflow works without it.
