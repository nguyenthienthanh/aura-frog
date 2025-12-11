#!/bin/bash

# JIRA Sync Script
# Syncs workflow status and updates to JIRA tickets

set -e

# Load environment variables
if [ -f .env ]; then
    source .env
fi

# Check required vars
if [ -z "$JIRA_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ]; then
    echo "❌ JIRA credentials not configured"
    echo "Set JIRA_EMAIL and JIRA_API_TOKEN in .env"
    exit 1
fi

# Get JIRA config from ccpm-config.yaml
JIRA_URL=$(grep -A 5 "jira:" ccpm-config.yaml | grep "url:" | awk '{print $2}' | tr -d '"')
PROJECT_KEY=$(grep -A 5 "jira:" ccpm-config.yaml | grep "project_key:" | awk '{print $2}' | tr -d '"')

TICKET_ID=$1
STATUS=$2
COMMENT=$3

if [ -z "$TICKET_ID" ]; then
    echo "Usage: $0 <TICKET_ID> [STATUS] [COMMENT]"
    echo "Example: $0 PROJPH-1234 'In Progress' 'Phase 5 complete'"
    exit 1
fi

echo "🔄 Syncing to JIRA..."
echo "   Ticket: $TICKET_ID"
echo "   Status: $STATUS"

# Update ticket status
if [ -n "$STATUS" ]; then
    curl -X POST \
        -H "Content-Type: application/json" \
        -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
        -d "{\"transition\": {\"id\": \"$STATUS\"}}" \
        "$JIRA_URL/rest/api/2/issue/$TICKET_ID/transitions"
    
    echo "✅ Status updated"
fi

# Add comment
if [ -n "$COMMENT" ]; then
    curl -X POST \
        -H "Content-Type: application/json" \
        -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
        -d "{\"body\": \"$COMMENT\"}" \
        "$JIRA_URL/rest/api/2/issue/$TICKET_ID/comment"
    
    echo "✅ Comment added"
fi

echo "✅ JIRA sync complete"

