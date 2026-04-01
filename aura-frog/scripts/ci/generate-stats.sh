#!/bin/bash
# Generate stats.json from actual repo data
# Called by CI on every push to main

set -e
BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
OUTPUT="$BASE_DIR/stats.json"

VERSION=$(grep -oE '"version":\s*"[^"]+"' "$BASE_DIR/.claude-plugin/plugin.json" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
AGENTS=$(find "$BASE_DIR/agents" -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')
SKILLS=$(find "$BASE_DIR/skills" -name 'SKILL.md' | wc -l | tr -d ' ')
RULES_CORE=$(find "$BASE_DIR/rules/core" -name '*.md' | wc -l | tr -d ' ')
RULES_AGENT=$(find "$BASE_DIR/rules/agent" -name '*.md' | wc -l | tr -d ' ')
RULES_WORKFLOW=$(find "$BASE_DIR/rules/workflow" -name '*.md' | wc -l | tr -d ' ')
RULES_TOTAL=$((RULES_CORE + RULES_AGENT + RULES_WORKFLOW))
COMMANDS=$(find "$BASE_DIR/commands" -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')
HOOKS=$(find "$BASE_DIR/hooks" -maxdepth 1 -name '*.cjs' | wc -l | tr -d ' ')
SCRIPTS=$(find "$BASE_DIR/scripts" -type f \( -name '*.sh' -o -name '*.cjs' \) | wc -l | tr -d ' ')

# Auto-invoke skills count
AUTO_INVOKE=0
for dir in "$BASE_DIR/skills/"*/; do
  s="$dir/SKILL.md"
  [ -f "$s" ] && head -10 "$s" | grep -q "autoInvoke: true" && AUTO_INVOKE=$((AUTO_INVOKE + 1))
done

# Context metrics
CLAUDE_MD_LINES=$(wc -l < "$BASE_DIR/CLAUDE.md" | tr -d ' ')
CORE_RULES_LINES=$(cat "$BASE_DIR/rules/core/"*.md 2>/dev/null | wc -l | tr -d ' ')
AGENTS_LINES=$(cat "$BASE_DIR/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
AUTO_SKILL_LINES=0
for dir in "$BASE_DIR/skills/"*/; do
  s="$dir/SKILL.md"
  [ -f "$s" ] && head -10 "$s" | grep -q "autoInvoke: true" && AUTO_SKILL_LINES=$((AUTO_SKILL_LINES + $(wc -l < "$s" | tr -d ' ')))
done
ALWAYS_LOADED=$((CLAUDE_MD_LINES + CORE_RULES_LINES + AGENTS_LINES + AUTO_SKILL_LINES))

ALL_MD_WORDS=$(find "$BASE_DIR/" -name '*.md' ! -name 'README.md' ! -path '*/docs/*' -exec cat {} + 2>/dev/null | wc -w | tr -d ' ')
LOADED_WORDS=$(cat "$BASE_DIR/CLAUDE.md" "$BASE_DIR/rules/core/"*.md "$BASE_DIR/agents/"*.md 2>/dev/null | wc -w | tr -d ' ')
for dir in "$BASE_DIR/skills/"*/; do
  s="$dir/SKILL.md"
  [ -f "$s" ] && head -10 "$s" | grep -q "autoInvoke: true" && LOADED_WORDS=$((LOADED_WORDS + $(wc -w < "$s" | tr -d ' ')))
done
TOKENS=$((LOADED_WORDS * 4 / 3))

# Total if ALL loadable content were loaded (rules + agents + skills + CLAUDE.md)
ALL_RULES_LINES=$(find "$BASE_DIR/rules" -name '*.md' ! -name 'README.md' -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
ALL_AGENTS_LINES=$(cat "$BASE_DIR/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
ALL_SKILLS_LINES=$(find "$BASE_DIR/skills" -name 'SKILL.md' -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
TOTAL_IF_ALL_LOADED=$((CLAUDE_MD_LINES + ALL_RULES_LINES + ALL_AGENTS_LINES + ALL_SKILLS_LINES))

if [ "$TOTAL_IF_ALL_LOADED" -gt 0 ]; then
  SAVINGS=$(( (TOTAL_IF_ALL_LOADED - ALWAYS_LOADED) * 100 / TOTAL_IF_ALL_LOADED ))
else
  SAVINGS=0
fi
OVERHEAD=$((TOKENS * 100 / 200000))

# CJS/MD/SH lines
CJS_LINES=$(find "$BASE_DIR/" -name '*.cjs' -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
MD_LINES=$(find "$BASE_DIR/" -name '*.md' -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
SH_LINES=$(find "$BASE_DIR/" -name '*.sh' -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
TOTAL_FILES=$(find "$BASE_DIR/" -type f | wc -l | tr -d ' ')

cat > "$OUTPUT" << EOF
{
  "version": "$VERSION",
  "generated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "components": {
    "agents": $AGENTS,
    "skills": { "total": $SKILLS, "autoInvoke": $AUTO_INVOKE },
    "rules": { "total": $RULES_TOTAL, "core": $RULES_CORE, "agent": $RULES_AGENT, "workflow": $RULES_WORKFLOW },
    "commands": $COMMANDS,
    "hooks": $HOOKS,
    "mcpServers": 6,
    "scripts": $SCRIPTS
  },
  "performance": {
    "alwaysLoadedLines": $ALWAYS_LOADED,
    "alwaysLoadedTokens": $TOKENS,
    "savingsPercent": $SAVINGS,
    "overheadPercent": $OVERHEAD
  },
  "codebase": {
    "cjsLines": $CJS_LINES,
    "mdLines": $MD_LINES,
    "shLines": $SH_LINES,
    "totalFiles": $TOTAL_FILES
  }
}
EOF

echo "✅ Generated $OUTPUT (v$VERSION)"
