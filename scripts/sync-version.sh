#!/bin/bash
# Aura Frog Version Sync Script
# Purpose: Synchronize version numbers across all configuration files
#
# SINGLE SOURCE OF TRUTH: aura-frog/.claude-plugin/plugin.json
#
# Usage:
#   ./scripts/sync-version.sh           # Sync all files to current version
#   ./scripts/sync-version.sh 1.4.0     # Bump to new version and sync
#   ./scripts/sync-version.sh patch     # Auto-increment patch (1.3.2 -> 1.3.3)
#   ./scripts/sync-version.sh minor     # Auto-increment minor (1.3.2 -> 1.4.0)
#   ./scripts/sync-version.sh major     # Auto-increment major (1.3.2 -> 2.0.0)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PLUGIN_DIR="$PROJECT_ROOT/aura-frog"

# Single source of truth
SOURCE_FILE="$PLUGIN_DIR/.claude-plugin/plugin.json"

# Version pattern
VERSION_PATTERN="[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+)?"

# All files that need version updates
declare -a JSON_FILES=(
  "$PLUGIN_DIR/.claude-plugin/plugin.json"
  "$PROJECT_ROOT/.claude-plugin/marketplace.json"
)

declare -a MD_FILES=(
  "$PLUGIN_DIR/CLAUDE.md"
  "$PLUGIN_DIR/README.md"
  "$PLUGIN_DIR/GET_STARTED.md"
  "$PLUGIN_DIR/TODO.md"
  "$PLUGIN_DIR/rules/README.md"
  "$PLUGIN_DIR/skills/README.md"
  "$PLUGIN_DIR/hooks/README.md"
  "$PLUGIN_DIR/commands/README.md"
  "$PLUGIN_DIR/docs/MCP_GUIDE.md"
  "$PLUGIN_DIR/rules/agent-identification-banner.md"
  "$PROJECT_ROOT/README.md"
)

declare -a YAML_FILES=(
  "$PLUGIN_DIR/ccpm-config.yaml"
)

print_header() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "📦 Aura Frog Version Sync Script"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Get current version from plugin.json (single source of truth)
get_current_version() {
  if [ -f "$SOURCE_FILE" ]; then
    grep -o '"version": *"[^"]*"' "$SOURCE_FILE" | head -1 | sed 's/"version": *"\([^"]*\)"/\1/'
  else
    echo "1.0.0"
  fi
}

# Calculate next version based on bump type
calculate_next_version() {
  local current=$1
  local bump_type=$2

  local major minor patch
  IFS='.' read -r major minor patch <<< "${current%%-*}"  # Remove suffix like -beta

  case "$bump_type" in
    major)
      echo "$((major + 1)).0.0"
      ;;
    minor)
      echo "${major}.$((minor + 1)).0"
      ;;
    patch)
      echo "${major}.${minor}.$((patch + 1))"
      ;;
  esac
}

# Validate version format
validate_version() {
  local version=$1
  if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+)?$ ]]; then
    print_error "Invalid version format: $version"
    print_info "Expected format: X.Y.Z or X.Y.Z-suffix (e.g., 1.0.0 or 1.0.0-beta)"
    exit 1
  fi
}

# Update JSON files
update_json_version() {
  local file=$1
  local new_version=$2

  if [ ! -f "$file" ]; then
    print_warning "File not found: $file (skipping)"
    return
  fi

  cp "$file" "$file.bak"

  # Update all "version": "x.x.x" patterns in JSON
  sed -i '' "s/\"version\": *\"[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?\"/\"version\": \"$new_version\"/g" "$file"

  if diff -q "$file" "$file.bak" > /dev/null; then
    print_warning "No changes: $(basename "$file")"
    rm "$file.bak"
  else
    print_success "Updated: $(basename "$file")"
    rm "$file.bak"
  fi
}

# Update Markdown files
update_md_version() {
  local file=$1
  local new_version=$2

  if [ ! -f "$file" ]; then
    print_warning "File not found: $file (skipping)"
    return
  fi

  cp "$file" "$file.bak"

  # Update various version patterns in markdown
  sed -i '' "s/\*\*Version:\*\* [0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?/\*\*Version:\*\* $new_version/g" "$file"
  sed -i '' "s/Version: [0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?/Version: $new_version/g" "$file"
  sed -i '' "s/v[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?/v$new_version/g" "$file"
  sed -i '' "s/AURA FROG v[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?/AURA FROG v$new_version/g" "$file"

  if diff -q "$file" "$file.bak" > /dev/null; then
    print_warning "No changes: $(basename "$file")"
    rm "$file.bak"
  else
    print_success "Updated: $(basename "$file")"
    rm "$file.bak"
  fi
}

# Update YAML files
update_yaml_version() {
  local file=$1
  local new_version=$2

  if [ ! -f "$file" ]; then
    print_warning "File not found: $file (skipping)"
    return
  fi

  cp "$file" "$file.bak"

  sed -i '' "s/version: '[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?'/version: '$new_version'/" "$file"
  sed -i '' "s/# Version: [0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\(-[a-z]*\)\?/# Version: $new_version/" "$file"

  if diff -q "$file" "$file.bak" > /dev/null; then
    print_warning "No changes: $(basename "$file")"
    rm "$file.bak"
  else
    print_success "Updated: $(basename "$file")"
    rm "$file.bak"
  fi
}

# Main execution
main() {
  print_header

  CURRENT_VERSION=$(get_current_version)
  print_info "Current version: $CURRENT_VERSION (from plugin.json)"

  # Determine target version
  if [ -n "$1" ]; then
    case "$1" in
      major|minor|patch)
        NEW_VERSION=$(calculate_next_version "$CURRENT_VERSION" "$1")
        print_info "Bump type: $1"
        ;;
      *)
        NEW_VERSION="$1"
        ;;
    esac
  else
    echo ""
    echo "Usage:"
    echo "  ./scripts/sync-version.sh patch     # $CURRENT_VERSION -> $(calculate_next_version "$CURRENT_VERSION" "patch")"
    echo "  ./scripts/sync-version.sh minor     # $CURRENT_VERSION -> $(calculate_next_version "$CURRENT_VERSION" "minor")"
    echo "  ./scripts/sync-version.sh major     # $CURRENT_VERSION -> $(calculate_next_version "$CURRENT_VERSION" "major")"
    echo "  ./scripts/sync-version.sh 1.4.0     # Set specific version"
    echo ""
    read -p "Enter version or bump type: " INPUT

    if [ -z "$INPUT" ]; then
      print_info "No version specified. Exiting."
      exit 0
    fi

    case "$INPUT" in
      major|minor|patch)
        NEW_VERSION=$(calculate_next_version "$CURRENT_VERSION" "$INPUT")
        ;;
      *)
        NEW_VERSION="$INPUT"
        ;;
    esac
  fi

  # Validate version
  validate_version "$NEW_VERSION"

  echo ""
  print_info "Updating version: $CURRENT_VERSION -> $NEW_VERSION"
  echo ""

  # Update JSON files
  echo -e "${BLUE}JSON files:${NC}"
  for file in "${JSON_FILES[@]}"; do
    update_json_version "$file" "$NEW_VERSION"
  done

  # Update Markdown files
  echo ""
  echo -e "${BLUE}Markdown files:${NC}"
  for file in "${MD_FILES[@]}"; do
    update_md_version "$file" "$NEW_VERSION"
  done

  # Update YAML files
  echo ""
  echo -e "${BLUE}YAML files:${NC}"
  for file in "${YAML_FILES[@]}"; do
    update_yaml_version "$file" "$NEW_VERSION"
  done

  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  print_success "Version sync complete! $CURRENT_VERSION -> $NEW_VERSION"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  echo ""
  print_info "Next steps:"
  echo "  1. Review changes: git diff"
  echo "  2. Update CHANGELOG.md with new version entry"
  echo "  3. Commit: git commit -am \"chore: Bump version to $NEW_VERSION\""
  echo "  4. Tag: git tag v$NEW_VERSION"
  echo ""
}

# Run main function
main "$@"
