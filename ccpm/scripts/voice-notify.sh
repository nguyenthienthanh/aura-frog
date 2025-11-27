#!/bin/bash

# CCPM Voice Notification Script
# Purpose: Generate voiceover for user action requirements
# Usage: bash scripts/voice-notify.sh "Your attention is needed" "approval-gate"

set -e

# Try to load from config file first (for hooks), then environment
CONFIG_FILE="$HOME/.claude/ccpm-voice-config"
if [ -f "$CONFIG_FILE" ]; then
  source "$CONFIG_FILE"
fi

# Configuration
VOICE_ID="${ELEVENLABS_VOICE_ID:-21m00Tcm4TlvDq8ikWAM}"  # Default: Rachel
API_KEY="${ELEVENLABS_API_KEY}"
OUTPUT_DIR=".claude/logs/audio"
NOTIFICATION_TYPE="${2:-general}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Message
MESSAGE="${1:-Your attention is needed for approval}"

# Check if ElevenLabs is configured
if [ -z "$API_KEY" ]; then
  echo "⚠️ ElevenLabs not configured. Skipping voiceover." >&2
  echo "Set ELEVENLABS_API_KEY in .envrc to enable voice notifications." >&2
  exit 0  # Don't fail, just skip
fi

# Generate timestamp for filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="$OUTPUT_DIR/${NOTIFICATION_TYPE}_${TIMESTAMP}.mp3"

# Prepare message based on notification type
case "$NOTIFICATION_TYPE" in
  "approval-gate")
    FULL_MESSAGE="Attention please. $MESSAGE. Your approval is required to continue."
    ;;
  "error")
    FULL_MESSAGE="Alert. $MESSAGE. Please review the error and provide guidance."
    ;;
  "warning")
    FULL_MESSAGE="Warning. $MESSAGE. Please check the details."
    ;;
  "completion")
    FULL_MESSAGE="Great news. $MESSAGE. The task has been completed successfully."
    ;;
  *)
    FULL_MESSAGE="$MESSAGE"
    ;;
esac

# Call ElevenLabs API
echo "🔊 Generating voiceover..." >&2

HTTP_CODE=$(curl -s -w "%{http_code}" -o "$OUTPUT_FILE" \
  -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "xi-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"${FULL_MESSAGE}\",
    \"model_id\": \"eleven_turbo_v2_5\",
    \"voice_settings\": {
      \"stability\": 0.5,
      \"similarity_boost\": 0.75,
      \"style\": 0.0,
      \"use_speaker_boost\": true
    }
  }")

# Check HTTP status
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Voiceover generated" >&2

  # Auto-play on macOS
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🔊 Playing notification..." >&2
    afplay "$OUTPUT_FILE"  # Play synchronously (wait for completion)

    # Delete after playing
    rm -f "$OUTPUT_FILE"
    echo "🗑️  Audio file deleted after playback" >&2
  else
    # Non-macOS: Save file path for manual playback
    echo "$OUTPUT_FILE"
  fi

  exit 0
else
  echo "❌ Failed to generate voiceover (HTTP $HTTP_CODE)" >&2
  rm -f "$OUTPUT_FILE"
  exit 0  # Don't fail the workflow
fi
