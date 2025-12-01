#!/bin/bash
# Confluence Operations Script for Aura Frog
# Usage: ./confluence-operations.sh <command> [options]
# Commands: fetch, search, create, update
# Version: 1.0.0

set -e

# Script directory (for relative paths)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Log directory - use project's logs or fallback to plugin logs
if [ -d ".claude/logs" ]; then
  LOG_DIR=".claude/logs/confluence"
elif [ -d "logs" ]; then
  LOG_DIR="logs/confluence"
else
  LOG_DIR="${PLUGIN_DIR}/logs/confluence"
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Log file with timestamp
LOG_FILE="${LOG_DIR}/confluence-$(date +%Y%m%d-%H%M%S).log"

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

# Helper function to safely source envrc files
source_envrc() {
  local file="$1"
  if [ -f "$file" ]; then
    log "INFO" "Found $file, attempting to load..."
    set +e
    while IFS= read -r line; do
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      [[ -z "$line" ]] && continue
      if [[ "$line" =~ ^[[:space:]]*export[[:space:]] ]]; then
        eval "$line" 2>/dev/null
      fi
    done < "$file"
    set -e
    return 0
  fi
  return 1
}

# Load environment variables
load_env() {
  local ENVRC_LOADED=false

  # Check if already set in environment
  if [ -n "$CONFLUENCE_URL" ] && [ -n "$CONFLUENCE_EMAIL" ] && [ -n "$CONFLUENCE_API_TOKEN" ]; then
    log "INFO" "Confluence credentials already set in environment"
    ENVRC_LOADED=true
  fi

  # If not already set, try loading from files
  if [ "$ENVRC_LOADED" = false ]; then
    if source_envrc ".envrc"; then
      log "INFO" "Loaded from current directory .envrc"
      ENVRC_LOADED=true
    elif source_envrc ".claude/.envrc"; then
      log "INFO" "Loaded from .claude/.envrc"
      ENVRC_LOADED=true
    elif source_envrc "$HOME/.envrc"; then
      log "INFO" "Loaded from home directory .envrc"
      ENVRC_LOADED=true
    elif source_envrc "${PLUGIN_DIR}/.envrc"; then
      log "INFO" "Loaded from plugin directory .envrc"
      ENVRC_LOADED=true
    fi
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
    exit 1
  fi

  # Check required variables
  if [ -z "$CONFLUENCE_URL" ] || [ -z "$CONFLUENCE_EMAIL" ] || [ -z "$CONFLUENCE_API_TOKEN" ]; then
    log "ERROR" "Confluence environment variables not set"
    echo "❌ Error: Confluence environment variables not set"
    echo ""
    echo "Required variables in .envrc:"
    echo "  - CONFLUENCE_URL (e.g., https://your-domain.atlassian.net/wiki)"
    echo "  - CONFLUENCE_EMAIL (your email)"
    echo "  - CONFLUENCE_API_TOKEN (API token from Atlassian)"
    echo ""
    echo "To get API token:"
    echo "  1. Go to https://id.atlassian.com/manage-profile/security/api-tokens"
    echo "  2. Create new token"
    echo "  3. Add to .envrc"
    exit 1
  fi

  log "INFO" "Confluence credentials loaded successfully"
  log "INFO" "CONFLUENCE_URL: $CONFLUENCE_URL"
}

# URL encode function
urlencode() {
  local string="$1"
  python3 -c "import urllib.parse; print(urllib.parse.quote('$string', safe=''))"
}

# Convert Markdown to Confluence Storage Format
md_to_confluence() {
  local content="$1"

  # Convert headings
  content=$(echo "$content" | sed 's/^### \(.*\)$/<h3>\1<\/h3>/g')
  content=$(echo "$content" | sed 's/^## \(.*\)$/<h2>\1<\/h2>/g')
  content=$(echo "$content" | sed 's/^# \(.*\)$/<h1>\1<\/h1>/g')

  # Convert bold
  content=$(echo "$content" | sed 's/\*\*\([^*]*\)\*\*/<strong>\1<\/strong>/g')

  # Convert italic
  content=$(echo "$content" | sed 's/\*\([^*]*\)\*/<em>\1<\/em>/g')

  # Convert inline code
  content=$(echo "$content" | sed 's/`\([^`]*\)`/<code>\1<\/code>/g')

  # Convert bullet lists
  content=$(echo "$content" | sed 's/^- \(.*\)$/<li>\1<\/li>/g')
  content=$(echo "$content" | sed 's/^\* \(.*\)$/<li>\1<\/li>/g')

  # Wrap lists in <ul>
  content=$(echo "$content" | awk '
    BEGIN { in_list = 0 }
    /<li>/ {
      if (!in_list) { print "<ul>"; in_list = 1 }
      print; next
    }
    {
      if (in_list) { print "</ul>"; in_list = 0 }
      print
    }
    END { if (in_list) print "</ul>" }
  ')

  # Convert line breaks to paragraphs
  content=$(echo "$content" | awk '
    NF {
      if (!/^<[hul]/ && !/^<\/[ul]/ && !/^<li/) {
        print "<p>" $0 "</p>"
      } else {
        print
      }
    }
  ')

  echo "$content"
}

# ============================================================================
# FETCH COMMAND - Read a page by ID or title
# ============================================================================
cmd_fetch() {
  local page_id="$1"
  local space_key="$2"

  if [ -z "$page_id" ]; then
    echo "❌ Error: Page ID or title required"
    echo ""
    echo "Usage: $0 fetch <page-id> [space-key]"
    echo "       $0 fetch <page-title> <space-key>"
    echo ""
    echo "Examples:"
    echo "  $0 fetch 123456"
    echo "  $0 fetch 'API Documentation' DEV"
    exit 1
  fi

  echo "📚 Fetching Confluence page..."
  log "INFO" "Fetching page: $page_id"

  local api_url
  local response
  local http_code
  local body

  # Check if page_id is numeric (actual ID) or string (title)
  if [[ "$page_id" =~ ^[0-9]+$ ]]; then
    # Fetch by ID
    api_url="${CONFLUENCE_URL}/rest/api/content/${page_id}?expand=body.storage,version,space,ancestors"
    log "INFO" "Fetching by ID: $api_url"
  else
    # Fetch by title (requires space key)
    if [ -z "$space_key" ]; then
      echo "❌ Error: Space key required when fetching by title"
      echo "Usage: $0 fetch '<title>' <space-key>"
      exit 1
    fi

    local encoded_title=$(urlencode "$page_id")
    api_url="${CONFLUENCE_URL}/rest/api/content?spaceKey=${space_key}&title=${encoded_title}&expand=body.storage,version,space,ancestors"
    log "INFO" "Fetching by title: $api_url"
  fi

  response=$(curl -s -w "\n%{http_code}" \
    -u "${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}" \
    -H "Accept: application/json" \
    "$api_url")

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  log "INFO" "HTTP Response Code: $http_code"

  if [ "$http_code" != "200" ]; then
    log "ERROR" "HTTP request failed with code: $http_code"
    echo "❌ Error: HTTP $http_code"
    echo "$body" | jq -r '.message // .' 2>/dev/null || echo "$body"
    exit 1
  fi

  # Handle search results (when fetching by title)
  if [[ ! "$page_id" =~ ^[0-9]+$ ]]; then
    local result_count=$(echo "$body" | jq '.results | length')
    if [ "$result_count" = "0" ]; then
      echo "❌ Page not found: $page_id in space $space_key"
      exit 1
    fi
    body=$(echo "$body" | jq '.results[0]')
  fi

  # Parse and display
  local title=$(echo "$body" | jq -r '.title')
  local space=$(echo "$body" | jq -r '.space.key')
  local space_name=$(echo "$body" | jq -r '.space.name // .space.key')
  local version=$(echo "$body" | jq -r '.version.number')
  local last_modified=$(echo "$body" | jq -r '.version.when')
  local modified_by=$(echo "$body" | jq -r '.version.by.displayName // "Unknown"')
  local page_id_result=$(echo "$body" | jq -r '.id')
  local content=$(echo "$body" | jq -r '.body.storage.value // "No content"')
  local page_url="${CONFLUENCE_URL}/pages/viewpage.action?pageId=${page_id_result}"

  # Save content to file
  local content_file="${LOG_DIR}/page-${page_id_result}.html"
  echo "$content" > "$content_file"

  # Save full JSON
  local json_file="${LOG_DIR}/page-${page_id_result}.json"
  echo "$body" > "$json_file"

  # Display result
  cat <<EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 CONFLUENCE PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Title:    $title
🆔 Page ID:  $page_id_result
📁 Space:    $space ($space_name)
📊 Version:  $version
👤 Modified: $modified_by
📅 Date:     $last_modified
🔗 URL:      $page_url

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Files saved:
   📄 Content:  $content_file
   📋 JSON:     $json_file

EOF

  log "INFO" "Page fetched successfully: $title (ID: $page_id_result)"
}

# ============================================================================
# SEARCH COMMAND - Search for pages
# ============================================================================
cmd_search() {
  local query="$1"
  local space_key="$2"
  local limit="${3:-10}"

  if [ -z "$query" ]; then
    echo "❌ Error: Search query required"
    echo ""
    echo "Usage: $0 search <query> [space-key] [limit]"
    echo ""
    echo "Examples:"
    echo "  $0 search 'API documentation'"
    echo "  $0 search 'deployment' DEV"
    echo "  $0 search 'release notes' PROJ 20"
    exit 1
  fi

  echo "🔍 Searching Confluence..."
  log "INFO" "Searching: $query"

  # Build CQL query
  local cql
  if [ -n "$space_key" ]; then
    cql="space = ${space_key} AND text ~ \"${query}\""
  else
    cql="text ~ \"${query}\""
  fi

  local encoded_cql=$(urlencode "$cql")
  local api_url="${CONFLUENCE_URL}/rest/api/content/search?cql=${encoded_cql}&limit=${limit}"

  log "INFO" "CQL: $cql"
  log "INFO" "API URL: $api_url"

  local response=$(curl -s -w "\n%{http_code}" \
    -u "${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}" \
    -H "Accept: application/json" \
    "$api_url")

  local http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "$http_code" != "200" ]; then
    log "ERROR" "Search failed with code: $http_code"
    echo "❌ Error: HTTP $http_code"
    echo "$body" | jq -r '.message // .' 2>/dev/null || echo "$body"
    exit 1
  fi

  local result_count=$(echo "$body" | jq '.results | length')
  local total_size=$(echo "$body" | jq '.totalSize // .results | length')

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔍 CONFLUENCE SEARCH RESULTS"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📊 Query: $query"
  [ -n "$space_key" ] && echo "📁 Space: $space_key"
  echo "📈 Found: $result_count results (total: $total_size)"
  echo ""

  if [ "$result_count" = "0" ]; then
    echo "No results found."
    exit 0
  fi

  echo "Results:"
  echo ""

  echo "$body" | jq -r '.results[] | "  📄 \(.title)\n     ID: \(.id) | Space: \(.space.key // "N/A")\n     URL: \(._links.webui // "N/A")\n"'

  # Save results
  local results_file="${LOG_DIR}/search-results-$(date +%Y%m%d-%H%M%S).json"
  echo "$body" > "$results_file"

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📁 Results saved: $results_file"

  log "INFO" "Search completed: $result_count results"
}

# ============================================================================
# CREATE COMMAND - Create a new page
# ============================================================================
cmd_create() {
  local space_key="$1"
  local title="$2"
  local content_file="$3"
  local parent_id="$4"

  if [ -z "$space_key" ] || [ -z "$title" ] || [ -z "$content_file" ]; then
    echo "❌ Error: Space key, title, and content file required"
    echo ""
    echo "Usage: $0 create <space-key> <title> <content-file> [parent-page-id]"
    echo ""
    echo "Examples:"
    echo "  $0 create DEV 'New API Documentation' docs/api.md"
    echo "  $0 create PROJ 'Sprint Report' report.md 123456"
    exit 1
  fi

  if [ ! -f "$content_file" ]; then
    echo "❌ Error: Content file not found: $content_file"
    exit 1
  fi

  echo "✨ Creating Confluence page..."
  log "INFO" "Creating page: $title in space $space_key"

  # Read and convert content
  local raw_content=$(cat "$content_file")
  local confluence_content=$(md_to_confluence "$raw_content")

  # Build payload
  local payload
  if [ -n "$parent_id" ]; then
    payload=$(jq -n \
      --arg space "$space_key" \
      --arg title "$title" \
      --arg content "$confluence_content" \
      --arg parent "$parent_id" \
      '{
        type: "page",
        title: $title,
        space: {key: $space},
        ancestors: [{id: $parent}],
        body: {
          storage: {
            value: $content,
            representation: "storage"
          }
        }
      }')
  else
    payload=$(jq -n \
      --arg space "$space_key" \
      --arg title "$title" \
      --arg content "$confluence_content" \
      '{
        type: "page",
        title: $title,
        space: {key: $space},
        body: {
          storage: {
            value: $content,
            representation: "storage"
          }
        }
      }')
  fi

  log "INFO" "Sending create request..."

  local response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -u "${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "${CONFLUENCE_URL}/rest/api/content")

  local http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "$http_code" != "200" ]; then
    log "ERROR" "Create failed with code: $http_code"
    echo "❌ Error: HTTP $http_code"
    echo "$body" | jq -r '.message // .' 2>/dev/null || echo "$body"
    echo ""
    echo "Common issues:"
    echo "  - 401: Invalid credentials"
    echo "  - 403: No permission to create pages in this space"
    echo "  - 404: Space not found"
    echo "  - 400: Page title already exists"
    exit 1
  fi

  local page_id=$(echo "$body" | jq -r '.id')
  local page_url="${CONFLUENCE_URL}/pages/viewpage.action?pageId=${page_id}"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ PAGE CREATED SUCCESSFULLY"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📄 Title:    $title"
  echo "🆔 Page ID:  $page_id"
  echo "📁 Space:    $space_key"
  echo "🔗 URL:      $page_url"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Save response
  echo "$body" > "${LOG_DIR}/created-page-${page_id}.json"
  log "INFO" "Page created successfully: ID $page_id"
}

# ============================================================================
# UPDATE COMMAND - Update an existing page
# ============================================================================
cmd_update() {
  local page_id="$1"
  local content_file="$2"
  local new_title="$3"

  if [ -z "$page_id" ] || [ -z "$content_file" ]; then
    echo "❌ Error: Page ID and content file required"
    echo ""
    echo "Usage: $0 update <page-id> <content-file> [new-title]"
    echo ""
    echo "Examples:"
    echo "  $0 update 123456 docs/api.md"
    echo "  $0 update 123456 docs/api.md 'Updated API Documentation'"
    exit 1
  fi

  if [ ! -f "$content_file" ]; then
    echo "❌ Error: Content file not found: $content_file"
    exit 1
  fi

  echo "📝 Updating Confluence page..."
  log "INFO" "Updating page ID: $page_id"

  # First, fetch current page to get version and title
  local fetch_response=$(curl -s -w "\n%{http_code}" \
    -u "${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}" \
    -H "Accept: application/json" \
    "${CONFLUENCE_URL}/rest/api/content/${page_id}?expand=version")

  local fetch_code=$(echo "$fetch_response" | tail -n1)
  local fetch_body=$(echo "$fetch_response" | sed '$d')

  if [ "$fetch_code" != "200" ]; then
    echo "❌ Error: Could not fetch page $page_id"
    echo "$fetch_body" | jq -r '.message // .' 2>/dev/null || echo "$fetch_body"
    exit 1
  fi

  local current_version=$(echo "$fetch_body" | jq -r '.version.number')
  local current_title=$(echo "$fetch_body" | jq -r '.title')
  local new_version=$((current_version + 1))

  # Use new title if provided, otherwise keep current
  local title="${new_title:-$current_title}"

  echo "   Current version: $current_version"
  echo "   New version: $new_version"
  echo "   Title: $title"

  # Read and convert content
  local raw_content=$(cat "$content_file")
  local confluence_content=$(md_to_confluence "$raw_content")

  # Build payload
  local payload=$(jq -n \
    --arg title "$title" \
    --arg content "$confluence_content" \
    --argjson version "$new_version" \
    '{
      version: {number: $version},
      title: $title,
      type: "page",
      body: {
        storage: {
          value: $content,
          representation: "storage"
        }
      }
    }')

  log "INFO" "Sending update request..."

  local response=$(curl -s -w "\n%{http_code}" \
    -X PUT \
    -u "${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "${CONFLUENCE_URL}/rest/api/content/${page_id}")

  local http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "$http_code" != "200" ]; then
    log "ERROR" "Update failed with code: $http_code"
    echo "❌ Error: HTTP $http_code"
    echo "$body" | jq -r '.message // .' 2>/dev/null || echo "$body"
    echo ""
    echo "Common issues:"
    echo "  - 401: Invalid credentials"
    echo "  - 403: No permission to edit this page"
    echo "  - 404: Page not found"
    echo "  - 409: Version conflict (page was modified)"
    exit 1
  fi

  local page_url="${CONFLUENCE_URL}/pages/viewpage.action?pageId=${page_id}"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ PAGE UPDATED SUCCESSFULLY"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📄 Title:    $title"
  echo "🆔 Page ID:  $page_id"
  echo "📊 Version:  $current_version → $new_version"
  echo "🔗 URL:      $page_url"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Save response
  echo "$body" > "${LOG_DIR}/updated-page-${page_id}.json"
  log "INFO" "Page updated successfully: version $new_version"
}

# ============================================================================
# MAIN
# ============================================================================
show_help() {
  cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONFLUENCE OPERATIONS - Aura Frog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: $0 <command> [options]

Commands:
  fetch   <page-id|title> [space]    Fetch a page by ID or title
  search  <query> [space] [limit]    Search for pages
  create  <space> <title> <file>     Create a new page
  update  <page-id> <file> [title]   Update an existing page
  help                               Show this help

Examples:
  $0 fetch 123456
  $0 fetch 'API Documentation' DEV
  $0 search 'deployment guide'
  $0 search 'release notes' PROJ 20
  $0 create DEV 'New Page' content.md
  $0 create PROJ 'Report' report.md 123456
  $0 update 123456 updated-content.md
  $0 update 123456 updated-content.md 'New Title'

Environment Variables (in .envrc):
  CONFLUENCE_URL         Base URL (e.g., https://company.atlassian.net/wiki)
  CONFLUENCE_EMAIL       Your Atlassian email
  CONFLUENCE_API_TOKEN   API token from Atlassian

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
}

# Parse command
COMMAND="${1:-help}"
shift 2>/dev/null || true

log "INFO" "=== Confluence Operations Script Started ==="
log "INFO" "Command: $COMMAND"

case "$COMMAND" in
  fetch)
    load_env
    cmd_fetch "$@"
    ;;
  search)
    load_env
    cmd_search "$@"
    ;;
  create)
    load_env
    cmd_create "$@"
    ;;
  update)
    load_env
    cmd_update "$@"
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo "❌ Unknown command: $COMMAND"
    echo ""
    show_help
    exit 1
    ;;
esac

log "INFO" "=== Confluence Operations Script Completed ==="
