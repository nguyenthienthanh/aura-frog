#!/bin/bash
# JIRA Ticket Fetch Script for Aura Frog
# Usage: ./jira-fetch.sh ETHAN-1269
# Version: 1.0.0

set -e

# Script directory (for relative paths)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Log directory - use project's logs or fallback to plugin logs
if [ -d ".claude/logs" ]; then
  LOG_DIR=".claude/logs/jira"
elif [ -d "logs" ]; then
  LOG_DIR="logs/jira"
else
  LOG_DIR="${PLUGIN_DIR}/logs/jira"
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Log file with timestamp
LOG_FILE="${LOG_DIR}/jira-fetch-$(date +%Y%m%d-%H%M%S).log"

# Logging function
log() {
  local level="$1"
  local message="$2"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
  if [ "$level" = "ERROR" ]; then
    echo "❌ $message" >&2
  fi
}

log "INFO" "=== JIRA Fetch Script Started ==="

# Get ticket key from argument
TICKET_KEY="$1"

if [ -z "$TICKET_KEY" ]; then
  log "ERROR" "Ticket key required"
  echo "❌ Error: Ticket key required"
  echo "Usage: $0 TICKET_KEY"
  echo "Example: $0 ETHAN-1269"
  exit 1
fi

log "INFO" "Fetching ticket: $TICKET_KEY"

# Load environment variables - check multiple locations
ENVRC_LOADED=false

# Priority 1: Current directory .envrc
if [ -f ".envrc" ]; then
  log "INFO" "Loading .envrc from current directory"
  source .envrc
  ENVRC_LOADED=true
# Priority 2: Project .claude/.envrc
elif [ -f ".claude/.envrc" ]; then
  log "INFO" "Loading .envrc from .claude/"
  source .claude/.envrc
  ENVRC_LOADED=true
# Priority 3: Home directory .envrc
elif [ -f "$HOME/.envrc" ]; then
  log "INFO" "Loading .envrc from home directory"
  source "$HOME/.envrc"
  ENVRC_LOADED=true
# Priority 4: Plugin directory .envrc
elif [ -f "${PLUGIN_DIR}/.envrc" ]; then
  log "INFO" "Loading .envrc from plugin directory"
  source "${PLUGIN_DIR}/.envrc"
  ENVRC_LOADED=true
fi

if [ "$ENVRC_LOADED" = false ]; then
  log "ERROR" ".envrc not found in any location"
  echo "❌ Error: .envrc not found"
  echo ""
  echo "Searched locations:"
  echo "  1. Current directory (.envrc)"
  echo "  2. Project .claude/.envrc"
  echo "  3. Home directory (~/.envrc)"
  echo "  4. Plugin directory (${PLUGIN_DIR}/.envrc)"
  echo ""
  echo "Please create .envrc with JIRA credentials in one of these locations"
  exit 1
fi

# Check required variables
if [ -z "$JIRA_URL" ] || [ -z "$JIRA_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ]; then
  log "ERROR" "JIRA environment variables not set"
  echo "❌ Error: JIRA environment variables not set"
  echo ""
  echo "Required variables in .envrc:"
  echo "  - JIRA_URL (e.g., https://company.atlassian.net)"
  echo "  - JIRA_EMAIL (your JIRA email)"
  echo "  - JIRA_API_TOKEN (API token from JIRA)"
  echo ""
  echo "To fix:"
  echo "  1. Edit .envrc"
  echo "  2. Add the variables"
  echo "  3. Run: source .envrc"
  echo "  4. Try again"
  exit 1
fi

log "INFO" "JIRA credentials loaded successfully"
log "INFO" "JIRA_URL: $JIRA_URL"
log "INFO" "JIRA_EMAIL: $JIRA_EMAIL"

# Construct API URL
API_URL="${JIRA_URL}/rest/api/3/issue/${TICKET_KEY}"
log "INFO" "API URL: $API_URL"

# Fetch ticket with curl
echo "🔍 Fetching JIRA ticket: $TICKET_KEY"
echo "📡 API: $JIRA_URL"
echo ""

log "INFO" "Sending API request..."

response=$(curl -s -w "\n%{http_code}" \
  -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Accept: application/json" \
  "$API_URL")

# Extract HTTP status code (last line)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

log "INFO" "HTTP Response Code: $http_code"

# Check HTTP status
if [ "$http_code" != "200" ]; then
  log "ERROR" "HTTP request failed with code: $http_code"
  log "ERROR" "Response body: $body"
  echo "❌ Error: HTTP $http_code"
  echo ""
  if command -v jq &> /dev/null; then
    echo "$body" | jq -r '.errorMessages[]?' 2>/dev/null || echo "$body"
  else
    echo "$body"
  fi
  echo ""
  echo "Common issues:"
  echo "  - 401: Invalid API token (regenerate at id.atlassian.com)"
  echo "  - 404: Ticket not found (check ticket key)"
  echo "  - 403: No permission to view ticket"
  echo ""
  echo "📋 Log file: $LOG_FILE"
  exit 1
fi

log "INFO" "API request successful"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  log "WARN" "jq not installed, output will be raw JSON"
  echo "⚠️ Warning: jq not installed, output will be raw JSON"
  echo ""
  echo "To install jq:"
  echo "  macOS: brew install jq"
  echo "  Linux: sudo apt install jq"
  echo ""
  echo "Raw JSON:"
  echo "$body"

  # Save raw JSON
  echo "$body" > "${LOG_DIR}/${TICKET_KEY}.json"
  log "INFO" "Raw JSON saved to: ${LOG_DIR}/${TICKET_KEY}.json"
  echo ""
  echo "💾 Saved to: ${LOG_DIR}/${TICKET_KEY}.json"
  echo "📋 Log file: $LOG_FILE"
  exit 0
fi

# Parse and display ticket
echo "✅ Successfully fetched ticket"
echo ""

# Extract key fields
summary=$(echo "$body" | jq -r '.fields.summary // "No summary"')
issue_type=$(echo "$body" | jq -r '.fields.issuetype.name // "Unknown"')
status=$(echo "$body" | jq -r '.fields.status.name // "Unknown"')
priority=$(echo "$body" | jq -r '.fields.priority.name // "None"')
assignee=$(echo "$body" | jq -r '.fields.assignee.displayName // "Unassigned"')
assignee_email=$(echo "$body" | jq -r '.fields.assignee.emailAddress // ""')
reporter=$(echo "$body" | jq -r '.fields.reporter.displayName // "Unknown"')
created=$(echo "$body" | jq -r '.fields.created // "Unknown"')
updated=$(echo "$body" | jq -r '.fields.updated // "Unknown"')
# Fix null handling for arrays
labels=$(echo "$body" | jq -r '(.fields.labels // []) | join(", ")')
components=$(echo "$body" | jq -r '(.fields.components // []) | map(.name) | join(", ")')

# Parse ADF description to extract text and images
# JIRA API v3 uses Atlassian Document Format (ADF) for description
parse_adf_description() {
  local adf_json="$1"

  # Check if description is null or empty
  if [ -z "$adf_json" ] || [ "$adf_json" = "null" ]; then
    echo "No description"
    return
  fi

  # Extract text content recursively from ADF
  local text_content=$(echo "$adf_json" | jq -r '
    def extract_text:
      if type == "object" then
        if .type == "text" then .text // ""
        elif .type == "hardBreak" then "\n"
        elif .type == "paragraph" then ((.content // []) | map(extract_text) | join("")) + "\n"
        elif .type == "heading" then ((.content // []) | map(extract_text) | join("")) + "\n"
        elif .type == "bulletList" or .type == "orderedList" then ((.content // []) | map(extract_text) | join(""))
        elif .type == "listItem" then "• " + ((.content // []) | map(extract_text) | join(""))
        elif .type == "codeBlock" then "```\n" + ((.content // []) | map(extract_text) | join("")) + "\n```\n"
        elif .type == "blockquote" then "> " + ((.content // []) | map(extract_text) | join(""))
        elif .type == "mention" then "@" + (.attrs.text // "user")
        elif .type == "emoji" then .attrs.shortName // ""
        elif .type == "inlineCard" or .type == "blockCard" then "[Link: " + (.attrs.url // "unknown") + "]"
        else ((.content // []) | map(extract_text) | join(""))
        end
      elif type == "array" then map(extract_text) | join("")
      else ""
      end;
    extract_text
  ' 2>/dev/null)

  # Trim whitespace
  echo "$text_content" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

# Extract image URLs from ADF description and attachments
extract_images() {
  local adf_json="$1"
  local attachments_json="$2"

  local images=""

  # Extract media references from ADF (mediaSingle, mediaInline nodes)
  local media_ids=$(echo "$adf_json" | jq -r '
    .. | objects | select(.type == "media" or .type == "mediaSingle" or .type == "mediaInline") |
    .attrs.id // .content[]?.attrs.id // empty
  ' 2>/dev/null | sort -u)

  # Get image attachments
  local image_attachments=$(echo "$attachments_json" | jq -r '
    .[] | select(.mimeType | startswith("image/")) |
    "  📷 " + .filename + "\n     URL: " + .content + "\n     Thumbnail: " + (.thumbnail // "N/A")
  ' 2>/dev/null)

  if [ -n "$image_attachments" ]; then
    echo "$image_attachments"
  else
    echo "  No images found"
  fi
}

# Get raw description JSON
description_json=$(echo "$body" | jq -r '.fields.description')
attachments_json=$(echo "$body" | jq -r '.fields.attachment // []')

# Parse description
description=$(parse_adf_description "$description_json")

# Extract images
images=$(extract_images "$description_json" "$attachments_json")

# Log parsed JIRA data
log "INFO" "=== JIRA Ticket Data ==="
log "INFO" "Ticket Key: $TICKET_KEY"
log "INFO" "Summary: $summary"
log "INFO" "Type: $issue_type"
log "INFO" "Status: $status"
log "INFO" "Priority: $priority"
log "INFO" "Assignee: $assignee${assignee_email:+ ($assignee_email)}"
log "INFO" "Reporter: $reporter"
log "INFO" "Labels: ${labels:-None}"
log "INFO" "Components: ${components:-None}"
log "INFO" "Created: $created"
log "INFO" "Updated: $updated"
log "INFO" "=== Description ==="
echo "$description" >> "$LOG_FILE"
log "INFO" "=== Images/Attachments ==="
echo "$images" >> "$LOG_FILE"
log "INFO" "========================"

# Also save formatted output to a readable log file
READABLE_LOG="${LOG_DIR}/${TICKET_KEY}-readable.txt"
cat > "$READABLE_LOG" <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JIRA TICKET: $TICKET_KEY
Fetched: $(date '+%Y-%m-%d %H:%M:%S')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY: $summary

DETAILS:
  Type:       $issue_type
  Status:     $status
  Priority:   $priority
  Assignee:   $assignee${assignee_email:+ ($assignee_email)}
  Reporter:   $reporter
  Labels:     ${labels:-None}
  Components: ${components:-None}
  Created:    $created
  Updated:    $updated

DESCRIPTION:
$description

IMAGES/ATTACHMENTS:
$images

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
log "INFO" "Readable log saved to: $READABLE_LOG"

# Display formatted output
cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 JIRA TICKET: $TICKET_KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Summary: $summary

📊 Details:
   Type:       $issue_type
   Status:     $status
   Priority:   $priority
   Assignee:   $assignee${assignee_email:+ ($assignee_email)}
   Reporter:   $reporter

🏷️  Labels:     ${labels:-None}
📦 Components:  ${components:-None}

📅 Dates:
   Created:    $created
   Updated:    $updated

📝 Description:
$description

🖼️  Images/Attachments:
$images

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

# Save raw JSON to temp file for Claude to parse
echo "$body" > "${LOG_DIR}/${TICKET_KEY}.json"
log "INFO" "Raw JSON saved to: ${LOG_DIR}/${TICKET_KEY}.json"
log "INFO" "=== JIRA Fetch Script Completed Successfully ==="
echo ""
echo "📁 Files saved:"
echo "   📄 Readable:  $READABLE_LOG"
echo "   📋 Raw JSON:  ${LOG_DIR}/${TICKET_KEY}.json"
echo "   📋 Log file:  $LOG_FILE"
echo ""
echo "🤖 Claude can now parse these files for detailed requirements"
