#!/bin/bash
# Aura Frog Status Line shim — adds dir+git prefix, delegates the AF segment to
# the plugin's statusline.sh. Installed at ~/.claude/statusline-command.sh by
# users who want the prefix; settings.json points here.
#
# Plain users (no prefix needed) can skip this shim and point settings.json
# directly at the plugin script — see aura-frog/settings.example.json.
#
# Format:
#   ➜  <dir>  git:(<branch>)  │  🐸 AF v{version} │ {mode} {step} │ {agent} │ {model} │ {ctx}% ctx
#
# The AF segment after `│` is owned by the plugin at
# ~/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/statusline.sh
# and follows the v3.7.3+ mode/step/agent format. Plugin upgrades auto-propagate.

input=$(cat)
PLUGIN_STATUSLINE="$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/statusline.sh"

# ---- Parse cwd (Claude Code sends workspace.current_dir; also accept top-level cwd) ----

if command -v jq >/dev/null 2>&1; then
    CWD=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // empty')
else
    CWD=$(echo "$input" | grep -o '"current_dir"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
    [ -z "$CWD" ] && CWD=$(echo "$input" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
fi
[ -z "$CWD" ] && CWD="$(pwd)"

DIR_NAME=$(basename "$CWD")
GIT_BRANCH=$(git -C "$CWD" --no-optional-locks rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ -n "$GIT_BRANCH" ]; then
    GIT_PART=" git:(${GIT_BRANCH})"
else
    GIT_PART=""
fi

# ---- AF segment — delegate to the plugin script (or fall back if missing) ----

if [ -x "$PLUGIN_STATUSLINE" ]; then
    AF_SEGMENT=$(cd "$CWD" 2>/dev/null && echo "$input" | "$PLUGIN_STATUSLINE")
elif [ -f "$PLUGIN_STATUSLINE" ]; then
    AF_SEGMENT=$(cd "$CWD" 2>/dev/null && echo "$input" | bash "$PLUGIN_STATUSLINE")
else
    AF_SEGMENT="🐸 AF (plugin missing)"
fi

# ---- Compose ----

printf "\033[1;32m➜\033[0m  \033[0;36m%s\033[0m\033[1;34m%s\033[0m  │  %s\n" \
    "$DIR_NAME" "$GIT_PART" "$AF_SEGMENT"
