#!/bin/bash

# CCPM Stop Hook - Voice Notification with Context
# Purpose: Extract approval context from conversation and play intelligent voiceover
# Usage: Called automatically by Claude Code Stop hook

set -e

# Read hook input from stdin
read -r HOOK_INPUT
TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path // empty' 2>/dev/null || echo "")
STOP_HOOK_ACTIVE=$(echo "$HOOK_INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null || echo "false")

# Prevent infinite loops
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

# Voice configuration
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/ethan-ccpm/ccpm"
VOICE_SCRIPT="$PLUGIN_DIR/scripts/voice-notify.sh"

if [ ! -f "$VOICE_SCRIPT" ]; then
  exit 0
fi

# Default message
MESSAGE="approval needed"

# Extract context from transcript if available
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
  # Read the last assistant message
  LAST_MESSAGE=$(jq -r '.messages[-1].content // .messages[-1].text // ""' "$TRANSCRIPT_PATH" 2>/dev/null || echo "")

  if [ -n "$LAST_MESSAGE" ]; then
    # Extract phase information
    if echo "$LAST_MESSAGE" | grep -qE "Phase [0-9]"; then
      PHASE=$(echo "$LAST_MESSAGE" | grep -oE "Phase [0-9][a-z]?:" | head -1 | sed 's/:$//')

      if [ -n "$PHASE" ]; then
        # Extract what this phase is about (first sentence after phase)
        CONTEXT=$(echo "$LAST_MESSAGE" | grep -A2 "$PHASE" | tail -1 | head -c 50 | sed 's/[^a-zA-Z0-9 ]//g' | awk '{print $1, $2, $3, $4}')

        if [ -n "$CONTEXT" ]; then
          MESSAGE="$PHASE - $CONTEXT"
        else
          MESSAGE="$PHASE approval needed"
        fi
      fi
    fi

    # Check for specific workflow stages
    if echo "$LAST_MESSAGE" | grep -qi "deliverables"; then
      # Extract the type of deliverables
      if echo "$LAST_MESSAGE" | grep -qi "design"; then
        MESSAGE="Design deliverables ready for review"
      elif echo "$LAST_MESSAGE" | grep -qi "test"; then
        MESSAGE="Test plan ready for review"
      elif echo "$LAST_MESSAGE" | grep -qi "requirements\|understand"; then
        MESSAGE="Requirements ready for review"
      fi
    fi

    # Check for test results
    if echo "$LAST_MESSAGE" | grep -qi "test.*pass\|all tests pass"; then
      MESSAGE="All tests passed - review needed"
    elif echo "$LAST_MESSAGE" | grep -qi "test.*fail"; then
      MESSAGE="Tests failed - check results"
    fi

    # Check for code review
    if echo "$LAST_MESSAGE" | grep -qi "code review\|review.*code"; then
      MESSAGE="Code review complete - approval needed"
    fi
  fi
fi

# Summarize message if too long (keep under 15 words)
WORD_COUNT=$(echo "$MESSAGE" | wc -w | tr -d ' ')
if [ "$WORD_COUNT" -gt 15 ]; then
  MESSAGE=$(echo "$MESSAGE" | awk '{for(i=1;i<=15;i++) printf $i" "; print ""}')
fi

# Call voice notification with context
bash "$VOICE_SCRIPT" "$MESSAGE" "approval-gate" 2>/dev/null || true

exit 0
