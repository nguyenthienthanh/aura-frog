---
name: figma-integration
description: "Auto-fetch Figma designs when URL detected. Extracts components, design tokens, images. Requires FIGMA_API_TOKEN."
allowed-tools: Read, Bash
---

# Aura Frog Figma Integration

**Priority:** MEDIUM - Use when Figma URL detected

---

## When to Use

**AUTO-DETECT when:**
- Figma URL shared: `figma.com/file/ABC123/...`
- User mentions: "implement Figma design"
- Starting workflow with design reference

---

## Integration Process

### 1. Detect & Extract File ID
```javascript
const match = message.match(/figma\.com\/(file|design)\/([a-zA-Z0-9]+)/)
const fileId = match[2] // "ABC123"
```

### 2. Check for Existing Log Data (PRIORITY)

**⚠️ IMPORTANT: Always check for cached data first before fetching!**

**Log file locations (check in order):**
```
.claude/logs/figma/{FILE_ID}-readable.txt  ← Human-readable format
.claude/logs/figma/{FILE_ID}.json          ← Raw JSON data
.claude/logs/figma/{FILE_ID}-images.json   ← Image URLs
logs/figma/{FILE_ID}-readable.txt          ← Alternative location
logs/figma/{FILE_ID}.json                  ← Alternative location
```

**Decision logic:**
```
IF log file exists AND user did NOT request "fetch", "refresh", "update":
  → READ from log file using Read tool
  → Show cached data with note: "📋 Using cached Figma data from {date}"

IF log file does NOT exist OR user requests fresh data:
  → FETCH using bash script
```

**Read cached data:**
```bash
# Prefer readable format
Read .claude/logs/figma/ABC123-readable.txt

# Or parse JSON if needed
Read .claude/logs/figma/ABC123.json

# Get image URLs
Read .claude/logs/figma/ABC123-images.json
```

### 3. Fetch Fresh Data (Only When Needed)

**Fetch when:**
- No cached log exists
- User says: "fetch", "refresh", "update", "get latest"
- User explicitly requests fresh Figma data

```bash
bash scripts/figma-fetch.sh ABC123
# Output:
#   logs/figma/ABC123-readable.txt   ← Formatted data
#   logs/figma/ABC123.json           ← Raw JSON
#   logs/figma/ABC123-images.json    ← Image URLs
#   logs/figma/figma-fetch-{timestamp}.log ← Execution log
```

### 4. Extract Design Tokens
From response, generate:
- **Colors:** primary, secondary, background, text
- **Typography:** heading, body fonts with sizes
- **Spacing:** xs, sm, md, lg, xl values
- **Components:** Button, TextField, Card structures

### 5. Generate Component Structure
```
Figma Frame → Code Components
├── Header → Header.tsx
├── Content → ContentSection.tsx
└── Actions → ActionButtons.tsx
```

---

## Setup

**In `.envrc`:**
```bash
export FIGMA_API_TOKEN="figd_your-token"
```

**Get token:** Figma → Settings → Personal Access Tokens

---

## If Not Configured

```markdown
⚠️ **Figma not set up**

1. Configure: Add FIGMA_API_TOKEN to .envrc
2. Or: Provide screenshots instead

Which option?
```

---

**📚 Setup:** `docs/INTEGRATION_SETUP_GUIDE.md`

**Remember:** Screenshots work as fallback if API unavailable.
