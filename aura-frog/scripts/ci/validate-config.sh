#!/bin/bash

# Script: validate-config.sh
# Purpose: Validate ccpm-config.yaml syntax and content

set -e

CONFIG_FILE="ccpm-config.yaml"

echo "🔍 Validating Aura Frog configuration..."

# Check if file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Error: $CONFIG_FILE not found"
  exit 1
fi

# Validate YAML syntax
echo "  ✓ Checking YAML syntax..."
if ! python3 -c "import yaml; yaml.safe_load(open('$CONFIG_FILE'))" 2>/dev/null; then
  echo "❌ Error: Invalid YAML syntax"
  exit 1
fi

# Check version
echo "  ✓ Checking version..."
version=$(grep -m 1 "^version:" "$CONFIG_FILE" | awk '{print $2}' | tr -d "'\"")
if [ -z "$version" ]; then
  echo "❌ Error: Version not specified"
  exit 1
fi

# Check projects
echo "  ✓ Checking projects..."
if ! grep -q "^projects:" "$CONFIG_FILE"; then
  echo "❌ Error: No projects defined"
  exit 1
fi

# Check agents
echo "  ✓ Checking agents..."
if ! grep -q "^agents:" "$CONFIG_FILE"; then
  echo "❌ Error: No agents defined"
  exit 1
fi

# Validate agent priorities (0-100)
echo "  ✓ Validating agent priorities..."
invalid_priorities=$(grep "priority:" "$CONFIG_FILE" | awk '{print $2}' | while read -r priority; do
  if [ "$priority" -lt 0 ] || [ "$priority" -gt 100 ]; then
    echo "$priority"
  fi
done)

if [ -n "$invalid_priorities" ]; then
  echo "❌ Error: Invalid priorities (must be 0-100): $invalid_priorities"
  exit 1
fi

echo "✅ Configuration valid!"
echo ""
echo "📊 Summary:"
echo "  Version: $version"
echo "  Projects: $(grep -c "^  [a-z].*:" "$CONFIG_FILE" || echo 0)"
echo "  Agents: $(grep -c "^  [a-z].*:" "$CONFIG_FILE" | head -1)"

exit 0

