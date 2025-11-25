#!/bin/bash

# Slack Notify Script
# Sends notifications to Slack channels

set -e

# Load environment variables
if [ -f .claude/.env ]; then
    source .claude/.env
fi

# Check required vars
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "❌ Slack webhook not configured"
    echo "Set SLACK_WEBHOOK_URL in .claude/.env"
    exit 1
fi

CHANNEL=$1
MESSAGE=$2
STATUS=$3

if [ -z "$MESSAGE" ]; then
    echo "Usage: $0 <CHANNEL> <MESSAGE> [STATUS]"
    echo "Example: $0 dev-team 'Phase 5 complete' success"
    exit 1
fi

# Set color based on status
case $STATUS in
    "success")
        COLOR="#00ff00"
        EMOJI="✅"
        ;;
    "error")
        COLOR="#ff0000"
        EMOJI="❌"
        ;;
    "warning")
        COLOR="#ffaa00"
        EMOJI="⚠️"
        ;;
    *)
        COLOR="#0099ff"
        EMOJI="ℹ️"
        ;;
esac

echo "💬 Sending to Slack..."
echo "   Channel: #$CHANNEL"
echo "   Message: $MESSAGE"

# Send to Slack
curl -X POST \
    -H "Content-Type: application/json" \
    -d "{
        \"channel\": \"#$CHANNEL\",
        \"attachments\": [{
            \"color\": \"$COLOR\",
            \"text\": \"$EMOJI $MESSAGE\",
            \"footer\": \"CCPM Workflow\"
        }]
    }" \
    "$SLACK_WEBHOOK_URL"

echo ""
echo "✅ Notification sent to #$CHANNEL"

