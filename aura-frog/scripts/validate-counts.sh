#!/bin/bash
set -e

# =============================================================================
# validate-counts.sh - Validate component counts across documentation
# =============================================================================
# Counts actual files and compares against documented counts in CLAUDE.md
# and plugin.json. Reports mismatches with a summary table.
#
# Usage: bash scripts/validate-counts.sh
# =============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Resolve base directory (aura-frog/aura-frog/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

CLAUDE_MD="$BASE_DIR/CLAUDE.md"
PLUGIN_JSON="$BASE_DIR/.claude-plugin/plugin.json"

MISMATCHES=0

# -----------------------------------------------------------------------------
# Count actual files
# -----------------------------------------------------------------------------

# Agents: .md files in agents/ excluding README.md
ACTUAL_AGENTS=$(find "$BASE_DIR/agents" -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')

# Skills: SKILL.md files under skills/
ACTUAL_SKILLS=$(find "$BASE_DIR/skills" -name 'SKILL.md' | wc -l | tr -d ' ')

# Rules: .md files in rules/ excluding README.md
ACTUAL_RULES=$(find "$BASE_DIR/rules" -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')

# Commands: .md files in commands/ and commands/*/ excluding README.md
ACTUAL_COMMANDS=$(find "$BASE_DIR/commands" -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')

# Hooks: .cjs files in hooks/ (not in hooks/lib/)
ACTUAL_HOOKS=$(find "$BASE_DIR/hooks" -maxdepth 1 -name '*.cjs' | wc -l | tr -d ' ')

# -----------------------------------------------------------------------------
# Extract expected counts from CLAUDE.md
# Purpose line format: "11 agents + 50 skills + 88 commands"
# -----------------------------------------------------------------------------

PURPOSE_LINE=$(grep -E '^\*\*Purpose:\*\*' "$CLAUDE_MD" 2>/dev/null || echo "")

extract_count() {
  local component="$1"
  echo "$PURPOSE_LINE" | grep -oE "[0-9]+ ${component}" | grep -oE '[0-9]+' || echo "?"
}

EXPECTED_AGENTS=$(extract_count "agents")
EXPECTED_SKILLS=$(extract_count "skills")
EXPECTED_COMMANDS=$(extract_count "commands")

# Rules and hooks may not be in purpose line; try plugin.json
EXPECTED_RULES=$(grep -oE '[0-9]+ rules' "$PLUGIN_JSON" 2>/dev/null | grep -oE '[0-9]+' || echo "?")
EXPECTED_HOOKS=$(grep -oE '[0-9]+ hooks' "$PLUGIN_JSON" 2>/dev/null | grep -oE '[0-9]+' || echo "?")

# -----------------------------------------------------------------------------
# Compare and build table
# -----------------------------------------------------------------------------

check_match() {
  local component="$1"
  local actual="$2"
  local expected="$3"

  if [ "$expected" = "?" ]; then
    STATUS="${YELLOW}??${NC}"
  elif [ "$actual" -eq "$expected" ] 2>/dev/null; then
    STATUS="${GREEN}OK${NC}"
  else
    STATUS="${RED}MISMATCH${NC}"
    MISMATCHES=$((MISMATCHES + 1))
  fi

  printf "  ${BOLD}%-12s${NC} %6s %10s    %b\n" "$component" "$actual" "$expected" "$STATUS"
}

echo ""
echo -e "${CYAN}${BOLD}=======================================${NC}"
echo -e "${CYAN}${BOLD}  Component Count Validator${NC}"
echo -e "${CYAN}${BOLD}=======================================${NC}"
echo ""
echo -e "  ${BOLD}Base:${NC} $BASE_DIR"
echo ""
printf "  ${BOLD}%-12s${NC} %6s %10s    %s\n" "Component" "Actual" "Expected" "Status"
echo "  -----------------------------------------------"

check_match "Agents"   "$ACTUAL_AGENTS"   "$EXPECTED_AGENTS"
check_match "Skills"   "$ACTUAL_SKILLS"   "$EXPECTED_SKILLS"
check_match "Rules"    "$ACTUAL_RULES"    "$EXPECTED_RULES"
check_match "Commands" "$ACTUAL_COMMANDS" "$EXPECTED_COMMANDS"
check_match "Hooks"    "$ACTUAL_HOOKS"    "$EXPECTED_HOOKS"

echo ""

if [ "$MISMATCHES" -gt 0 ]; then
  echo -e "  ${RED}${BOLD}$MISMATCHES mismatch(es) found.${NC} Update docs to match actual counts."
  echo ""
  exit 1
else
  echo -e "  ${GREEN}${BOLD}All counts match.${NC}"
  echo ""
  exit 0
fi
