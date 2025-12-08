#!/bin/bash

# Confluence Publish Script
# Publishes documentation to Confluence

set -e

# Load environment variables
if [ -f .env ]; then
    source .env
fi

# Check required vars
if [ -z "$CONFLUENCE_EMAIL" ] || [ -z "$CONFLUENCE_API_TOKEN" ]; then
    echo "❌ Confluence credentials not configured"
    exit 1
fi

# Get Confluence config
CONFLUENCE_URL=$(grep -A 5 "confluence:" ccpm-config.yaml | grep "url:" | awk '{print $2}' | tr -d '"')
SPACE_KEY=$(grep -A 5 "confluence:" ccpm-config.yaml | grep "space_key:" | awk '{print $2}' | tr -d '"')

DOC_FILE=$1
PAGE_TITLE=$2

if [ -z "$DOC_FILE" ] || [ -z "$PAGE_TITLE" ]; then
    echo "Usage: $0 <DOC_FILE> <PAGE_TITLE>"
    echo "Example: $0 .claude/logs/documents/implementation-summary.md 'Feature Implementation'"
    exit 1
fi

if [ ! -f "$DOC_FILE" ]; then
    echo "❌ File not found: $DOC_FILE"
    exit 1
fi

echo "📚 Publishing to Confluence..."
echo "   Page: $PAGE_TITLE"
echo "   Space: $SPACE_KEY"

# Convert markdown to Confluence format
CONTENT=$(cat "$DOC_FILE")

# Create or update page
curl -X POST \
    -H "Content-Type: application/json" \
    -u "$CONFLUENCE_EMAIL:$CONFLUENCE_API_TOKEN" \
    -d "{
        \"type\": \"page\",
        \"title\": \"$PAGE_TITLE\",
        \"space\": {\"key\": \"$SPACE_KEY\"},
        \"body\": {
            \"storage\": {
                \"value\": \"$CONTENT\",
                \"representation\": \"storage\"
            }
        }
    }" \
    "$CONFLUENCE_URL/rest/api/content"

echo "✅ Published to Confluence"
echo "🔗 View at: $CONFLUENCE_URL/display/$SPACE_KEY"

