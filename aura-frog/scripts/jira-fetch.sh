#!/bin/bash
# Jira Ticket Fetcher - TOON Format Output
# Usage: ./scripts/jira-fetch.sh PROJ-123 [--verbose]
# Requires: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in environment

set -e

TICKET_ID="$1"
VERBOSE=""

# Parse flags
for arg in "$@"; do
  case $arg in
    --verbose|-v)
      VERBOSE="true"
      ;;
  esac
done

if [ -z "$TICKET_ID" ] || [[ "$TICKET_ID" == -* ]]; then
  echo "Usage: $0 <TICKET-ID> [--verbose]"
  echo "Example: $0 PROJ-123"
  echo ""
  echo "Options:"
  echo "  --verbose, -v  Show full description and comments"
  echo ""
  echo "Required environment variables:"
  echo "  JIRA_BASE_URL  - Your Jira base URL (e.g., https://company.atlassian.net)"
  echo "  JIRA_EMAIL     - Your Jira account email"
  echo "  JIRA_API_TOKEN - API token from https://id.atlassian.com/manage-profile/security/api-tokens"
  exit 1
fi

# Check required env vars
if [ -z "$JIRA_BASE_URL" ]; then
  echo "Error: JIRA_BASE_URL not set"
  exit 1
fi

if [ -z "$JIRA_EMAIL" ]; then
  echo "Error: JIRA_EMAIL not set"
  exit 1
fi

if [ -z "$JIRA_API_TOKEN" ]; then
  echo "Error: JIRA_API_TOKEN not set"
  exit 1
fi

# Fetch ticket
RESPONSE=$(curl -s -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Accept: application/json" \
  "${JIRA_BASE_URL}/rest/api/3/issue/${TICKET_ID}?fields=summary,description,status,priority,assignee,reporter,labels,components,fixVersions,parent,subtasks,issuelinks,comment,issuetype,created,updated")

# Check for errors
if echo "$RESPONSE" | grep -q '"errorMessages"'; then
  echo "Error fetching ticket:"
  echo "$RESPONSE" | jq -r '.errorMessages[]' 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

# Parse fields
SUMMARY=$(echo "$RESPONSE" | jq -r '.fields.summary // "N/A"')
STATUS=$(echo "$RESPONSE" | jq -r '.fields.status.name // "N/A"')
PRIORITY=$(echo "$RESPONSE" | jq -r '.fields.priority.name // "N/A"')
ISSUE_TYPE=$(echo "$RESPONSE" | jq -r '.fields.issuetype.name // "N/A"')
ASSIGNEE=$(echo "$RESPONSE" | jq -r '.fields.assignee.displayName // "Unassigned"')
REPORTER=$(echo "$RESPONSE" | jq -r '.fields.reporter.displayName // "N/A"')
CREATED=$(echo "$RESPONSE" | jq -r '.fields.created | split("T")[0] // "N/A"')
UPDATED=$(echo "$RESPONSE" | jq -r '.fields.updated | split("T")[0] // "N/A"')
LABELS=$(echo "$RESPONSE" | jq -r '.fields.labels | join(";") // ""')
COMPONENTS=$(echo "$RESPONSE" | jq -r '[.fields.components[]?.name] | join(";") // ""')
FIX_VERSIONS=$(echo "$RESPONSE" | jq -r '[.fields.fixVersions[]?.name] | join(";") // ""')
PARENT_KEY=$(echo "$RESPONSE" | jq -r '.fields.parent.key // ""')
PARENT_SUMMARY=$(echo "$RESPONSE" | jq -r '.fields.parent.fields.summary // ""')

# Output TOON format
echo "# ${TICKET_ID}: ${SUMMARY}"
echo ""
echo '```toon'
echo "ticket[1]{key,summary,type,status,priority}:"
echo "  ${TICKET_ID},${SUMMARY},${ISSUE_TYPE},${STATUS},${PRIORITY}"
echo ""
echo "metadata[1]{assignee,reporter,created,updated}:"
echo "  ${ASSIGNEE},${REPORTER},${CREATED},${UPDATED}"

# Labels and components
if [ -n "$LABELS" ]; then
  LABEL_COUNT=$(echo "$LABELS" | tr ';' '\n' | wc -l | tr -d ' ')
  echo ""
  echo "labels[${LABEL_COUNT}]: ${LABELS}"
fi

if [ -n "$COMPONENTS" ]; then
  COMP_COUNT=$(echo "$COMPONENTS" | tr ';' '\n' | wc -l | tr -d ' ')
  echo "components[${COMP_COUNT}]: ${COMPONENTS}"
fi

if [ -n "$FIX_VERSIONS" ]; then
  VER_COUNT=$(echo "$FIX_VERSIONS" | tr ';' '\n' | wc -l | tr -d ' ')
  echo "fixVersions[${VER_COUNT}]: ${FIX_VERSIONS}"
fi

# Parent (for subtasks)
if [ -n "$PARENT_KEY" ]; then
  echo ""
  echo "parent[1]{key,summary}:"
  echo "  ${PARENT_KEY},${PARENT_SUMMARY}"
fi

# Subtasks
SUBTASK_COUNT=$(echo "$RESPONSE" | jq -r '.fields.subtasks | length')
if [ "$SUBTASK_COUNT" -gt 0 ]; then
  echo ""
  echo "subtasks[${SUBTASK_COUNT}]{key,summary,status}:"
  echo "$RESPONSE" | jq -r '.fields.subtasks[]? | "  " + .key + "," + .fields.summary + "," + .fields.status.name'
fi

# Linked Issues
LINK_COUNT=$(echo "$RESPONSE" | jq -r '.fields.issuelinks | length')
if [ "$LINK_COUNT" -gt 0 ]; then
  echo ""
  echo "links[${LINK_COUNT}]{type,key,summary}:"
  echo "$RESPONSE" | jq -r '.fields.issuelinks[]? |
    if .outwardIssue then
      "  " + .type.outward + "," + .outwardIssue.key + "," + .outwardIssue.fields.summary
    elif .inwardIssue then
      "  " + .type.inward + "," + .inwardIssue.key + "," + .inwardIssue.fields.summary
    else empty end'
fi

echo '```'

# Description
echo ""
echo "## Description"
echo ""
DESCRIPTION=$(echo "$RESPONSE" | jq -r '.fields.description.content // empty')
if [ -n "$DESCRIPTION" ] && [ "$DESCRIPTION" != "null" ]; then
  echo "$RESPONSE" | jq -r '
    .fields.description.content[]? |
    if .type == "paragraph" then
      (.content[]? | .text // "")
    elif .type == "heading" then
      "\n### " + (.content[]? | .text // "")
    elif .type == "bulletList" then
      (.content[]? | "- " + (.content[]?.content[]?.text // ""))
    elif .type == "orderedList" then
      (.content[]? | "1. " + (.content[]?.content[]?.text // ""))
    elif .type == "codeBlock" then
      "```\n" + (.content[]? | .text // "") + "\n```"
    else
      (.content[]? | .text // "")
    end
  ' 2>/dev/null | grep -v '^$' || echo "(No description)"
else
  echo "(No description)"
fi

# Verbose: Show comments
if [ "$VERBOSE" = "true" ]; then
  COMMENT_COUNT=$(echo "$RESPONSE" | jq -r '.fields.comment.comments | length')
  if [ "$COMMENT_COUNT" -gt 0 ]; then
    echo ""
    echo "## Comments"
    echo ""
    echo '```toon'
    echo "comments[${COMMENT_COUNT}]{author,date,body}:"
    echo "$RESPONSE" | jq -r '.fields.comment.comments[]? |
      "  " + .author.displayName + "," + (.created | split("T")[0]) + "," + (.body.content[]?.content[]?.text // "(empty)" | gsub(","; ";") | gsub("\n"; " "))'
    echo '```'
  fi
fi

echo ""
echo "---"
echo "**URL:** ${JIRA_BASE_URL}/browse/${TICKET_ID}"
echo "**Fetched:** $(date '+%Y-%m-%d %H:%M:%S')"
