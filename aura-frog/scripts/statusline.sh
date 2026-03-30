#!/bin/bash
# Aura Frog Status Line
# Replaces the conversation banner — always visible, 0 tokens
#
# Receives JSON on stdin from Claude Code:
#   { model, agent, cost, context_window, cwd }
#
# Reads additional state from session cache

input=$(cat)

# Parse Claude Code JSON input (works without jq)
parse_json() {
  echo "$input" | grep -o "\"$1\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/'
}
parse_json_num() {
  echo "$input" | grep -o "\"$1\"[[:space:]]*:[[:space:]]*[0-9.]*" | head -1 | sed 's/.*: *//'
}

MODEL=$(parse_json "display_name")
[ -z "$MODEL" ] && MODEL="unknown"

CTX_PCT=$(parse_json_num "used_percentage")
[ -z "$CTX_PCT" ] && CTX_PCT="0"
CTX_INT=${CTX_PCT%.*}

COST=$(parse_json_num "total_cost_usd")
[ -z "$COST" ] && COST="0"

# Read Aura Frog state from session cache
CACHE_FILE=".claude/cache/session-start-cache.json"
AF_AGENT="ready"
AF_PHASE="-"
AF_VERSION="?"

if [ -f "$CACHE_FILE" ]; then
  af_agent=$(grep -o '"agent"[[:space:]]*:[[:space:]]*"[^"]*"' "$CACHE_FILE" 2>/dev/null | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
  af_phase=$(grep -o '"phase"[[:space:]]*:[[:space:]]*"[^"]*"' "$CACHE_FILE" 2>/dev/null | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
  [ -n "$af_agent" ] && AF_AGENT="$af_agent"
  [ -n "$af_phase" ] && AF_PHASE="$af_phase"
fi

# Read version from plugin.json (try marketplace, then local)
for pjson in \
  "$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog/.claude-plugin/plugin.json" \
  "aura-frog/.claude-plugin/plugin.json"; do
  if [ -f "$pjson" ]; then
    v=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$pjson" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
    [ -n "$v" ] && AF_VERSION="$v" && break
  fi
done

# Build status line
echo "🐸 AF v${AF_VERSION} │ ${AF_AGENT} │ P${AF_PHASE} │ ${MODEL} │ ${CTX_INT}% ctx │ \$${COST}"
