# Bash Integration Scripts - Technical Reference

**Version:** 1.0.0
**Last Updated:** 2025-11-27
**Audience:** Developers, contributors, advanced users
**Purpose:** Technical API reference for Aura Frog bash integration scripts

**📚 For Setup:** See [`INTEGRATION_SETUP_GUIDE.md`](INTEGRATION_SETUP_GUIDE.md)

---

## Overview

This document provides technical details about Aura Frog's bash script integrations for developers who want to:
- Understand script architecture
- Extend or customize scripts
- Debug integration issues
- Contribute improvements

For user-facing setup and usage, see the [Integration Setup Guide](INTEGRATION_SETUP_GUIDE.md).

---

## Table of Contents

1. [Architecture](#architecture)
2. [Script Reference](#script-reference)
3. [API Endpoints](#api-endpoints)
4. [Error Codes](#error-codes)
5. [Output Formats](#output-formats)
6. [Environment Variables](#environment-variables)
7. [Extending Scripts](#extending-scripts)
8. [Contributing](#contributing)

---

## Architecture

### Design Principles

**1. Standalone Execution**
- Each script is self-contained
- No Node.js/Python dependencies
- Uses only standard Unix tools (bash, curl, jq)

**2. Error Handling**
- Exit codes for programmatic use
- Stderr for error messages
- Stdout for data output

**3. Idempotent Operations**
- Safe to run multiple times
- No destructive operations without confirmation
- Graceful handling of missing data

### Directory Structure

```
scripts/
├── jira-fetch.sh              # Fetch JIRA ticket details
├── figma-fetch.sh             # Fetch Figma design data
├── slack-notify.sh            # Send Slack notifications
├── confluence-publish.sh      # Publish to Confluence
└── test-integrations.sh       # Test all integrations
```

---

## Script Reference

### 1. jira-fetch.sh

**Purpose:** Fetch JIRA ticket details via REST API

**Syntax:**
```bash
./scripts/jira-fetch.sh <TICKET-ID>
```

**Parameters:**
- `TICKET-ID` (required): JIRA ticket key (e.g., PROJ-123)

**Environment Variables Required:**
- `JIRA_URL` - Base URL (e.g., https://company.atlassian.net)
- `JIRA_EMAIL` - User email
- `JIRA_API_TOKEN` - API token

**Output:** JSON object with ticket data

**Exit Codes:**
- `0` - Success
- `1` - Missing environment variables
- `2` - Missing ticket ID parameter
- `3` - HTTP error (unauthorized, not found, etc.)

**Example:**
```bash
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="user@company.com"
export JIRA_API_TOKEN="token_here"

./scripts/jira-fetch.sh PROJ-123
```

**Output Format:**
```json
{
  "key": "PROJ-123",
  "summary": "Feature description",
  "description": "Detailed requirements...",
  "status": "In Progress",
  "assignee": "John Doe",
  "priority": "High",
  "issueType": "Story",
  "created": "2025-11-01T10:00:00Z",
  "updated": "2025-11-27T15:30:00Z"
}
```

**API Endpoint Used:**
- `GET /rest/api/3/issue/{issueIdOrKey}`
- Documentation: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get

---

### 2. figma-fetch.sh

**Purpose:** Fetch Figma design file metadata and components

**Syntax:**
```bash
./scripts/figma-fetch.sh <FILE-KEY>
```

**Parameters:**
- `FILE-KEY` (required): Figma file ID from URL

**Environment Variables Required:**
- `FIGMA_API_TOKEN` - Personal access token

**Output:** JSON object with file data

**Exit Codes:**
- `0` - Success
- `1` - Missing environment variable
- `2` - Missing file key parameter
- `3` - HTTP error (401, 403, 404)

**Example:**
```bash
export FIGMA_API_TOKEN="figd_xyz123"

./scripts/figma-fetch.sh ABC123xyz456
```

**Output Format:**
```json
{
  "name": "Design System",
  "lastModified": "2025-11-27T10:00:00Z",
  "thumbnailUrl": "https://...",
  "version": "1234567890",
  "document": {
    "id": "0:0",
    "name": "Design System",
    "type": "DOCUMENT",
    "children": [...]
  }
}
```

**API Endpoint Used:**
- `GET /v1/files/{file_key}`
- Documentation: https://www.figma.com/developers/api#get-files-endpoint

**Design Token Extraction:**
The script includes logic to extract common design tokens:
- Colors (fill styles)
- Typography (text styles)
- Spacing (layout grids)
- Components (component sets)

---

### 3. slack-notify.sh

**Purpose:** Send notification to Slack channel

**Syntax:**
```bash
./scripts/slack-notify.sh <CHANNEL> <MESSAGE>
```

**Parameters:**
- `CHANNEL` (required): Channel name (#dev-team) or ID (C1234567890)
- `MESSAGE` (required): Message text (supports markdown)

**Environment Variables Required:**
- `SLACK_BOT_TOKEN` - Bot user OAuth token (xoxb-...)

**Output:** JSON response from Slack API

**Exit Codes:**
- `0` - Success
- `1` - Missing environment variable
- `2` - Missing parameters
- `3` - Slack API error

**Example:**
```bash
export SLACK_BOT_TOKEN="xoxb-123-456-abc"

./scripts/slack-notify.sh '#dev-team' '✅ Deployment complete!'
```

**Output Format:**
```json
{
  "ok": true,
  "channel": "C1234567890",
  "ts": "1234567890.123456",
  "message": {
    "text": "✅ Deployment complete!",
    "username": "Aura Frog Bot",
    "bot_id": "B1234567890",
    "type": "message",
    "subtype": "bot_message"
  }
}
```

**API Endpoint Used:**
- `POST /api/chat.postMessage`
- Documentation: https://api.slack.com/methods/chat.postMessage

**Markdown Support:**
- Bold: `*text*`
- Italic: `_text_`
- Code: `` `code` ``
- Links: `<URL|text>`

---

### 4. confluence-publish.sh

**Purpose:** Publish markdown document to Confluence

**Syntax:**
```bash
./scripts/confluence-publish.sh <SPACE-KEY> <PAGE-TITLE> <MARKDOWN-FILE>
```

**Parameters:**
- `SPACE-KEY` (required): Confluence space key (e.g., DEV)
- `PAGE-TITLE` (required): Title for the page
- `MARKDOWN-FILE` (required): Path to markdown file

**Environment Variables Required:**
- `CONFLUENCE_URL` - Base URL (https://company.atlassian.net/wiki)
- `CONFLUENCE_EMAIL` - User email
- `CONFLUENCE_API_TOKEN` - API token
- `CONFLUENCE_SPACE_KEY` - Default space (optional if provided as parameter)

**Output:** JSON response with page details

**Exit Codes:**
- `0` - Success (created or updated)
- `1` - Missing environment variables
- `2` - Missing parameters
- `3` - File not found
- `4` - Confluence API error

**Example:**
```bash
export CONFLUENCE_URL="https://company.atlassian.net/wiki"
export CONFLUENCE_EMAIL="user@company.com"
export CONFLUENCE_API_TOKEN="token_here"

./scripts/confluence-publish.sh DEV "Implementation Summary" ./summary.md
```

**Output Format:**
```json
{
  "id": "123456",
  "type": "page",
  "status": "current",
  "title": "Implementation Summary",
  "space": {
    "key": "DEV",
    "name": "Development"
  },
  "version": {
    "number": 1
  },
  "_links": {
    "webui": "/spaces/DEV/pages/123456",
    "self": "https://company.atlassian.net/wiki/rest/api/content/123456"
  }
}
```

**Markdown Conversion:**
The script converts markdown to Confluence storage format:
- Headers: `#` → `<h1>`, `##` → `<h2>`, etc.
- Bold: `**text**` → `<strong>text</strong>`
- Italic: `*text*` → `<em>text</em>`
- Code blocks: ` ```lang ` → `<ac:structured-macro ac:name="code">`
- Links: `[text](url)` → `<a href="url">text</a>`

---

## API Endpoints

### JIRA REST API v3

**Base URL:** `{JIRA_URL}/rest/api/3/`

**Authentication:** Basic Auth (email:token)

**Common Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/issue/{key}` | GET | Get issue details |
| `/issue/{key}/comment` | POST | Add comment |
| `/issue/{key}/transitions` | POST | Change status |
| `/search` | GET | Search issues (JQL) |

**Rate Limits:**
- Cloud: ~100 requests/minute per user
- No official hard limit, uses adaptive throttling

---

### Figma API v1

**Base URL:** `https://api.figma.com/v1/`

**Authentication:** Bearer token in header

**Common Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/files/{key}` | GET | Get file data |
| `/files/{key}/components` | GET | Get components |
| `/files/{key}/styles` | GET | Get styles |
| `/images/{key}` | GET | Render images |

**Rate Limits:**
- Free: 60 requests/minute
- Professional: 300 requests/minute
- Organization: 600 requests/minute

---

### Slack Web API

**Base URL:** `https://slack.com/api/`

**Authentication:** Bearer token (Bot User OAuth)

**Common Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat.postMessage` | POST | Send message |
| `/files.upload` | POST | Upload file |
| `/conversations.list` | GET | List channels |
| `/users.info` | GET | Get user info |

**Rate Limits:**
- Tier 1 (chat.postMessage): 1 request/second
- Tier 2 (files.upload): 20 requests/minute
- Tier 3 (conversations.list): 50 requests/minute

---

### Confluence REST API v2

**Base URL:** `{CONFLUENCE_URL}/rest/api/`

**Authentication:** Basic Auth (email:token)

**Common Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/content` | GET | Search content |
| `/content` | POST | Create page |
| `/content/{id}` | PUT | Update page |
| `/content/{id}/child/page` | GET | Get child pages |

**Rate Limits:**
- Similar to JIRA (same Atlassian platform)
- ~100 requests/minute per user

---

## Error Codes

### Standard Exit Codes

All scripts follow this exit code convention:

| Code | Meaning | Remediation |
|------|---------|-------------|
| `0` | Success | None |
| `1` | Missing environment variables | Set required env vars |
| `2` | Invalid parameters | Check script syntax |
| `3` | HTTP error (4xx/5xx) | Check credentials, network |
| `4` | File/resource not found | Verify file paths |
| `5` | Parsing error (invalid JSON) | Check API response format |

### HTTP Status Codes

**401 Unauthorized**
- Cause: Invalid or expired token
- Fix: Regenerate token, update `.envrc`

**403 Forbidden**
- Cause: Insufficient permissions
- Fix: Grant required permissions to API token

**404 Not Found**
- Cause: Resource doesn't exist
- Fix: Verify ticket ID, file key, or space key

**429 Too Many Requests**
- Cause: Rate limit exceeded
- Fix: Wait and retry, implement exponential backoff

**500 Internal Server Error**
- Cause: Service issue
- Fix: Retry later, check service status page

---

## Output Formats

### JSON Output Structure

All scripts output valid JSON to stdout for easy parsing:

```bash
# Capture output
output=$(./scripts/jira-fetch.sh PROJ-123)

# Parse with jq
summary=$(echo "$output" | jq -r '.summary')
status=$(echo "$output" | jq -r '.status')

echo "Ticket: $summary ($status)"
```

### Error Output

Errors are written to stderr with descriptive messages:

```bash
# Run script and capture both streams
./scripts/jira-fetch.sh PROJ-123 > output.json 2> error.log

# Check if succeeded
if [ $? -eq 0 ]; then
  echo "Success!"
else
  cat error.log
fi
```

### Logging

Scripts log to stderr for debugging:

```bash
# Enable debug logging
DEBUG=1 ./scripts/jira-fetch.sh PROJ-123 2> debug.log

# View debug info
cat debug.log
```

---

## Environment Variables

### Required Variables by Script

| Script | Required Variables |
|--------|-------------------|
| **jira-fetch.sh** | `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |
| **figma-fetch.sh** | `FIGMA_API_TOKEN` |
| **slack-notify.sh** | `SLACK_BOT_TOKEN` |
| **confluence-publish.sh** | `CONFLUENCE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN` |

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | `0` | Enable debug logging (set to `1`) |
| `TIMEOUT` | `30` | HTTP request timeout (seconds) |
| `RETRY_COUNT` | `3` | Number of retries on failure |
| `RETRY_DELAY` | `2` | Delay between retries (seconds) |

### Loading Methods

**1. Manual Export:**
```bash
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="user@company.com"
export JIRA_API_TOKEN="token"
```

**2. From .envrc (direnv):**
```bash
# In project root
direnv allow
./scripts/jira-fetch.sh PROJ-123
```

**3. Inline:**
```bash
JIRA_URL="https://..." JIRA_EMAIL="..." ./scripts/jira-fetch.sh PROJ-123
```

---

## Extending Scripts

### Adding New Functionality

**1. Create New Script**
```bash
#!/bin/bash
# scripts/new-integration.sh

set -e  # Exit on error

# Validate environment
if [ -z "$REQUIRED_VAR" ]; then
  echo "Error: REQUIRED_VAR not set" >&2
  exit 1
fi

# Your logic here
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.service.com/endpoint"
```

**2. Make Executable**
```bash
chmod +x scripts/new-integration.sh
```

**3. Test**
```bash
./scripts/new-integration.sh
```

### Common Patterns

**HTTP GET with jq parsing:**
```bash
response=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.service.com/data")

# Parse JSON
value=$(echo "$response" | jq -r '.field')
```

**HTTP POST with JSON payload:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "field1": "value1",
    "field2": "value2"
  }' \
  "https://api.service.com/endpoint"
```

**Error Handling:**
```bash
response=$(curl -s -w "%{http_code}" -o /tmp/output.json \
  "https://api.service.com/endpoint")

if [ "$response" -ne 200 ]; then
  echo "Error: HTTP $response" >&2
  cat /tmp/output.json >&2
  exit 3
fi

cat /tmp/output.json
```

---

## Contributing

### Development Setup

**1. Clone Repository**
```bash
git clone https://github.com/nguyenthienthanh/aura-frog
cd aura-frog
```

**2. Set Up Environment**
```bash
cp .envrc.template .envrc
# Edit .envrc with test credentials
source .envrc
```

**3. Run Tests**
```bash
./scripts/test-integrations.sh
```

### Testing Checklist

Before submitting a PR:
- [ ] Script runs without errors
- [ ] Exit codes are correct
- [ ] JSON output is valid
- [ ] Error messages are descriptive
- [ ] Environment variables are documented
- [ ] Script is executable (`chmod +x`)
- [ ] No hardcoded credentials
- [ ] Added to test-integrations.sh

### Code Style

**Bash Best Practices:**
- Use `set -e` for error exit
- Quote all variables: `"$VAR"`
- Use descriptive variable names
- Add comments for complex logic
- Check for required tools (curl, jq)

**Example:**
```bash
#!/bin/bash
set -e

# Validate required tools
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed" >&2
  exit 1
fi

# Validate environment
if [ -z "$REQUIRED_VAR" ]; then
  echo "Error: REQUIRED_VAR not set" >&2
  exit 1
fi

# Main logic with error handling
if ! response=$(curl -s "https://api.com/endpoint"); then
  echo "Error: API request failed" >&2
  exit 3
fi

echo "$response" | jq '.'
```

---

## Troubleshooting

### Common Development Issues

**Issue: `jq: command not found`**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Verify
jq --version
```

**Issue: `Permission denied`**
```bash
chmod +x scripts/*.sh
```

**Issue: `curl: SSL certificate problem`**
```bash
# Add -k flag to curl (insecure, only for testing)
curl -k -s "https://..."

# Better: Install proper CA certificates
```

**Issue: Token expired (401)**
```bash
# Regenerate token and update .envrc
# JIRA/Confluence: https://id.atlassian.com/manage-profile/security/api-tokens
# Figma: https://www.figma.com/settings
# Slack: https://api.slack.com/apps
```

---

## Performance

### Optimization Tips

**1. Reduce API Calls**
- Cache responses when possible
- Batch requests if API supports it
- Use pagination wisely

**2. Parallel Execution**
```bash
# Run multiple scripts in parallel
./scripts/jira-fetch.sh PROJ-1 > jira1.json &
./scripts/jira-fetch.sh PROJ-2 > jira2.json &
wait
```

**3. Rate Limit Awareness**
```bash
# Add delay between requests
sleep 1
./scripts/jira-fetch.sh PROJ-123
```

### Benchmarks

Typical execution times (with network):
- `jira-fetch.sh`: ~200-500ms
- `figma-fetch.sh`: ~300-600ms
- `slack-notify.sh`: ~150-300ms
- `confluence-publish.sh`: ~400-800ms

---

## Security

### Best Practices

**1. Never Hardcode Credentials**
```bash
# ❌ BAD
JIRA_TOKEN="hardcoded_token_here"

# ✅ GOOD
JIRA_TOKEN="${JIRA_API_TOKEN}"
```

**2. Use Environment Variables**
```bash
# Store in .envrc (git-ignored)
export JIRA_API_TOKEN="token_here"
```

**3. Validate Input**
```bash
# Sanitize user input
ticket_id=$(echo "$1" | tr -cd 'A-Z0-9-')
```

**4. Secure Output**
```bash
# Don't log sensitive data
echo "Fetching ticket $ticket_id..." >&2
# (token not logged)
```

---

## Related Documentation

- **Setup Guide:** [`INTEGRATION_SETUP_GUIDE.md`](INTEGRATION_SETUP_GUIDE.md)
- **Plugin Installation:** [`PLUGIN_INSTALLATION.md`](PLUGIN_INSTALLATION.md)
- **Troubleshooting:** [`PLUGIN_TROUBLESHOOTING.md`](PLUGIN_TROUBLESHOOTING.md)
- **Configuration:** [`CONFIG_LOADING_ORDER.md`](CONFIG_LOADING_ORDER.md)

---

**Version:** 1.0.0
**Last Updated:** 2025-11-27
**Maintainer:** Aura Frog Team
