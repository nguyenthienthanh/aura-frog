# Command: mcp:status

**Category:** MCP
**Priority:** Medium
**Syntax:** `mcp:status`

---

## Purpose

Show status of bundled MCP servers and verify they are loaded correctly.

---

## When to Use

- At session start to verify MCP availability
- When MCP tools aren't responding
- To check which integrations are configured

---

## Output Format

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 MCP Server Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Server | Status | Tools Available |
|--------|--------|-----------------|
| context7 | ✅ Loaded | resolve-library-id, get-library-docs |
| atlassian | ✅ Loaded | jira-get-issue, confluence-search |
| figma | ⚠️ No Token | - |
| playwright | ✅ Loaded | browser-*, navigate, screenshot |
| vitest | ✅ Loaded | run-tests, get-coverage |
| slack | ⚠️ No Token | - |

**Configuration:** .mcp.json
**Guide:** docs/MCP_GUIDE.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## How Claude Determines Status

Claude checks MCP status by:

1. **Tool Availability** - Check if MCP tools appear in available tools list
2. **Tool Prefix** - MCP tools are prefixed with `mcp__plugin_{name}_`
3. **Sample Call** - Optionally test with a simple query

### Detection Logic

```yaml
MCP Prefixes:
  context7: mcp__plugin_context7_context7__
  atlassian: mcp__plugin_atlassian_atlassian__
  figma: mcp__plugin_figma_figma__
  playwright: mcp__plugin_playwright_playwright__
  vitest: mcp__plugin_vitest_vitest__
  slack: mcp__plugin_slack_slack__

Status Rules:
  - Tools visible → ✅ Loaded
  - Tools missing but config exists → ⚠️ Check token/config
  - Tools missing and no config → ❌ Not configured
```

---

## Execution Steps

When user runs `mcp:status`:

1. **List Available Tools**
   - Check which MCP tool prefixes are available
   - Map to known MCP servers

2. **Check Configuration**
   - Read `.mcp.json` for expected servers
   - Compare expected vs available

3. **Show Status Table**
   - Display each server with status
   - List available tools per server
   - Note any missing tokens

4. **Provide Guidance**
   - If servers missing, suggest checking `.envrc`
   - Link to MCP_GUIDE.md for setup

---

## Troubleshooting

### Server Not Loading

```markdown
⚠️ MCP server not loading? Check:

1. **Environment Variables**
   - Ensure `.envrc` has required tokens
   - Run `direnv allow` after editing

2. **Configuration**
   - Verify `.mcp.json` syntax
   - Check server package names

3. **Restart Claude Code**
   - MCP servers load at startup
   - Restart session after config changes
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| No atlassian tools | Missing JIRA_API_TOKEN | Add to .envrc |
| No figma tools | Missing FIGMA_API_TOKEN | Add to .envrc |
| No slack tools | Missing SLACK_BOT_TOKEN | Add to .envrc |
| context7 missing | Package not installed | Check .mcp.json |

---

## Related Commands

- `mcp:test <server>` - Test specific MCP server
- `project:reload-env` - Reload environment variables

---

**Version:** 1.0.0
**Last Updated:** 2025-12-22
