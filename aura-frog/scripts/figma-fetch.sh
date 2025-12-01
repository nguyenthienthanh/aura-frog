#!/bin/bash
# Figma File Fetch Script for Aura Frog
# Usage: ./figma-fetch.sh <file-id-or-url>
# Version: 1.0.0

set -e

# Script directory (for relative paths)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Log directory - use project's logs or fallback to plugin logs
if [ -d ".claude/logs" ]; then
  LOG_DIR=".claude/logs/figma"
elif [ -d "logs" ]; then
  LOG_DIR="logs/figma"
else
  LOG_DIR="${PLUGIN_DIR}/logs/figma"
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Log file with timestamp
LOG_FILE="${LOG_DIR}/figma-fetch-$(date +%Y%m%d-%H%M%S).log"

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

log "INFO" "=== Figma Fetch Script Started ==="

# Get Figma file ID or URL from argument
INPUT="$1"

if [ -z "$INPUT" ]; then
  log "ERROR" "Figma file ID or URL required"
  echo "❌ Error: Figma file ID or URL required"
  echo ""
  echo "Usage: $0 <file-id-or-url>"
  echo ""
  echo "Examples:"
  echo "  $0 ABC123xyz456"
  echo "  $0 https://www.figma.com/file/ABC123xyz456/Design-Name"
  echo "  $0 https://www.figma.com/design/ABC123xyz456/Design-Name"
  exit 1
fi

# Extract file ID and optional node-id from URL if needed
NODE_ID=""
if [[ "$INPUT" =~ figma.com/(file|design)/([a-zA-Z0-9]+) ]]; then
  FILE_ID="${BASH_REMATCH[2]}"
  log "INFO" "Extracted Figma file ID from URL: $FILE_ID"
  echo "📎 Extracted Figma file ID from URL: $FILE_ID"

  # Extract node-id if present (e.g., ?node-id=3153-203362)
  if [[ "$INPUT" =~ node-id=([0-9]+-[0-9]+) ]]; then
    NODE_ID="${BASH_REMATCH[1]}"
    log "INFO" "Extracted node ID: $NODE_ID"
    echo "📎 Extracted node ID: $NODE_ID"
  fi
else
  FILE_ID="$INPUT"
fi

log "INFO" "Fetching Figma file: $FILE_ID"

# Load environment variables - check multiple locations
ENVRC_LOADED=false

# Helper function to safely source envrc files
source_envrc() {
  local file="$1"
  if [ -f "$file" ]; then
    log "INFO" "Found $file, attempting to load..."
    # Use set +e to prevent exit on error, grep export lines and eval them
    set +e
    # Extract and execute only export statements (safer than full source)
    while IFS= read -r line; do
      # Skip comments and empty lines
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      [[ -z "$line" ]] && continue
      # Only process export statements
      if [[ "$line" =~ ^[[:space:]]*export[[:space:]] ]]; then
        eval "$line" 2>/dev/null
      fi
    done < "$file"
    set -e
    return 0
  fi
  return 1
}

# Check if already set in environment (e.g., by direnv)
if [ -n "$FIGMA_API_TOKEN" ]; then
  log "INFO" "FIGMA_API_TOKEN already set in environment"
  ENVRC_LOADED=true
elif [ -n "$FIGMA_API_TOKEN" ]; then
  log "INFO" "FIGMA_API_TOKEN found, using as FIGMA_API_TOKEN"
  FIGMA_API_TOKEN="$FIGMA_API_TOKEN"
  ENVRC_LOADED=true
fi

# If not already set, try loading from files
if [ "$ENVRC_LOADED" = false ]; then
  # Priority 1: Current directory .envrc
  if source_envrc ".envrc"; then
    log "INFO" "Loaded from current directory .envrc"
    ENVRC_LOADED=true
  # Priority 2: Project .claude/.envrc
  elif source_envrc ".claude/.envrc"; then
    log "INFO" "Loaded from .claude/.envrc"
    ENVRC_LOADED=true
  # Priority 3: Home directory .envrc
  elif source_envrc "$HOME/.envrc"; then
    log "INFO" "Loaded from home directory .envrc"
    ENVRC_LOADED=true
  # Priority 4: Plugin directory .envrc
  elif source_envrc "${PLUGIN_DIR}/.envrc"; then
    log "INFO" "Loaded from plugin directory .envrc"
    ENVRC_LOADED=true
  fi
fi

# Support both FIGMA_API_TOKEN and FIGMA_API_TOKEN (fallback)
if [ -z "$FIGMA_API_TOKEN" ] && [ -n "$FIGMA_API_TOKEN" ]; then
  log "INFO" "Using FIGMA_API_TOKEN as FIGMA_API_TOKEN"
  FIGMA_API_TOKEN="$FIGMA_API_TOKEN"
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
  echo "Please create .envrc with FIGMA_API_TOKEN in one of these locations"
  exit 1
fi

# Check required variables
if [ -z "$FIGMA_API_TOKEN" ]; then
  log "ERROR" "FIGMA_API_TOKEN not set"
  echo "❌ Error: FIGMA_API_TOKEN not set"
  echo ""
  echo "Current environment check:"
  echo "  FIGMA_API_TOKEN: ${FIGMA_API_TOKEN:-<not set>}"
  echo "  FIGMA_API_TOKEN: ${FIGMA_API_TOKEN:-<not set>}"
  echo ""
  echo "To fix:"
  echo "  1. Get token from: https://www.figma.com/developers/api#access-tokens"
  echo "  2. Edit .envrc and add:"
  echo "     export FIGMA_API_TOKEN=\"figd_your_token_here\""
  echo "  3. Run: direnv allow . && direnv reload"
  echo "     OR:  source .envrc"
  echo ""
  echo "📋 Log file: $LOG_FILE"
  exit 1
fi

log "INFO" "Figma credentials loaded successfully"
log "INFO" "Token length: ${#FIGMA_API_TOKEN} chars"

# Construct API URL with query params
API_URL="https://api.figma.com/v1/files/${FILE_ID}"

# Add query parameters
QUERY_PARAMS=""
if [ -n "$NODE_ID" ]; then
  # Fetch specific node - convert node-id format (3153-203362 -> 3153:203362)
  NODE_ID_FORMATTED="${NODE_ID//-/:}"
  QUERY_PARAMS="?ids=${NODE_ID_FORMATTED}&depth=2"
  log "INFO" "Fetching specific node: $NODE_ID_FORMATTED"
  echo "🎯 Fetching specific node: $NODE_ID"
else
  # Limit depth for large files to avoid 400 error
  QUERY_PARAMS="?depth=1"
  log "INFO" "Fetching with depth=1 (top-level only)"
fi

API_URL="${API_URL}${QUERY_PARAMS}"
log "INFO" "API URL: $API_URL"

echo "🎨 Fetching Figma file: $FILE_ID"
echo "📡 API: https://api.figma.com"
echo ""

log "INFO" "Sending API request..."

# Fetch file metadata
response=$(curl -s -w "\n%{http_code}" \
  -H "X-Figma-Token: ${FIGMA_API_TOKEN}" \
  "$API_URL")

# Extract HTTP status code
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
    error_msg=$(echo "$body" | jq -r '.err // .message // .error // empty' 2>/dev/null)
    if [ -n "$error_msg" ]; then
      echo "Error: $error_msg"
    else
      echo "$body"
    fi
  else
    echo "$body"
  fi
  echo ""
  echo "Common issues:"
  echo "  - 403: Invalid or expired token"
  echo "         → Regenerate at: https://www.figma.com/developers/api#access-tokens"
  echo "  - 403: No permission to access file (check file sharing settings)"
  echo "  - 404: File not found (check file ID)"
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
  echo "$body" > "${LOG_DIR}/${FILE_ID}.json"
  log "INFO" "Raw JSON saved to: ${LOG_DIR}/${FILE_ID}.json"
  echo ""
  echo "💾 Saved to: ${LOG_DIR}/${FILE_ID}.json"
  echo "📋 Log file: $LOG_FILE"
  exit 0
fi

# Parse and display file info
echo "✅ Successfully fetched Figma file"
echo ""

# Extract key fields with null handling
file_name=$(echo "$body" | jq -r '.name // "Unknown"')
last_modified=$(echo "$body" | jq -r '.lastModified // "Unknown"')
version=$(echo "$body" | jq -r '.version // "Unknown"')
thumbnail=$(echo "$body" | jq -r '.thumbnailUrl // "N/A"')

# Extract document structure with null handling
num_pages=$(echo "$body" | jq '(.document.children // []) | length')
page_names=$(echo "$body" | jq -r '(.document.children // []) | map(.name) | join(", ")')

# Extract styles if present
num_styles=$(echo "$body" | jq '(.styles // {}) | length')

# Log parsed data
log "INFO" "=== Figma File Data ==="
log "INFO" "File ID: $FILE_ID"
log "INFO" "Name: $file_name"
log "INFO" "Version: $version"
log "INFO" "Last Modified: $last_modified"
log "INFO" "Pages: $num_pages"
log "INFO" "Page Names: $page_names"
log "INFO" "Styles: $num_styles"
log "INFO" "======================="

# Display formatted output
cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 FIGMA FILE: $FILE_ID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Name: $file_name

📊 Details:
   Version:       $version
   Last Modified: $last_modified
   Pages:         $num_pages
   Styles:        $num_styles

📄 Pages: $page_names

🔗 View Online:
   https://www.figma.com/file/${FILE_ID}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

# Save full JSON
echo "$body" > "${LOG_DIR}/${FILE_ID}.json"
log "INFO" "Raw JSON saved to: ${LOG_DIR}/${FILE_ID}.json"

# Save readable log file
READABLE_LOG="${LOG_DIR}/${FILE_ID}-readable.txt"
cat > "$READABLE_LOG" <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIGMA FILE: $FILE_ID
Fetched: $(date '+%Y-%m-%d %H:%M:%S')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAME: $file_name

DETAILS:
  Version:       $version
  Last Modified: $last_modified
  Pages:         $num_pages
  Styles:        $num_styles

PAGES: $page_names

VIEW ONLINE:
  https://www.figma.com/file/${FILE_ID}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
log "INFO" "Readable log saved to: $READABLE_LOG"

# Fetch images (node metadata)
echo ""
echo "🖼️  Fetching image assets..."
log "INFO" "Fetching image assets..."

# Get all frames and components
frames=$(echo "$body" | jq -r '
  .. |
  objects |
  select(.type == "FRAME" or .type == "COMPONENT") |
  .id' 2>/dev/null | head -10)

if [ -n "$frames" ]; then
  # Convert to comma-separated for API
  frame_ids=$(echo "$frames" | paste -sd "," -)
  log "INFO" "Found frames: $frame_ids"

  # Fetch image URLs
  images_response=$(curl -s \
    -H "X-Figma-Token: ${FIGMA_API_TOKEN}" \
    "https://api.figma.com/v1/images/${FILE_ID}?ids=${frame_ids}&format=png&scale=2")

  # Save images metadata
  echo "$images_response" > "${LOG_DIR}/${FILE_ID}-images.json"
  log "INFO" "Image URLs saved to: ${LOG_DIR}/${FILE_ID}-images.json"
  echo "✅ Image URLs saved to: ${LOG_DIR}/${FILE_ID}-images.json"

  # Append image URLs to readable log
  echo "" >> "$READABLE_LOG"
  echo "IMAGE URLS:" >> "$READABLE_LOG"
  echo "$images_response" | jq -r '.images | to_entries[] | "  " + .key + ": " + .value' >> "$READABLE_LOG" 2>/dev/null || true
else
  log "WARN" "No frames found in file"
  echo "⚠️  No frames found in file"
fi

log "INFO" "=== Figma Fetch Script Completed Successfully ==="

echo ""
echo "📁 Files saved:"
echo "   📄 Readable:  $READABLE_LOG"
echo "   📋 Raw JSON:  ${LOG_DIR}/${FILE_ID}.json"
echo "   📋 Log file:  $LOG_FILE"
echo ""
echo "🤖 Claude can now parse these files for design details"
