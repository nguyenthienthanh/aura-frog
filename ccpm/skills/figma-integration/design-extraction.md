---
name: figma-integration
description: "Auto-fetch Figma designs when URL detected. Extracts components, design tokens, images. Requires FIGMA_ACCESS_TOKEN."
allowed-tools: Read, Bash
---

# CCPM Figma Integration

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
const match = message.match(/figma\.com\/file\/([a-zA-Z0-9]+)/)
const fileId = match[1] // "ABC123"
```

### 2. Fetch Design
```bash
bash scripts/figma-fetch.sh ABC123
# Output: .claude/logs/figma/ABC123.json
```

### 3. Extract Design Tokens
From response, generate:
- **Colors:** primary, secondary, background, text
- **Typography:** heading, body fonts with sizes
- **Spacing:** xs, sm, md, lg, xl values
- **Components:** Button, TextField, Card structures

### 4. Generate Component Structure
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
export FIGMA_ACCESS_TOKEN="figd_your-token"
```

**Get token:** Figma → Settings → Personal Access Tokens

---

## If Not Configured

```markdown
⚠️ **Figma not set up**

1. Configure: Add FIGMA_ACCESS_TOKEN to .envrc
2. Or: Provide screenshots instead

Which option?
```

---

**📚 Setup:** `docs/INTEGRATION_SETUP_GUIDE.md`

**Remember:** Screenshots work as fallback if API unavailable.
