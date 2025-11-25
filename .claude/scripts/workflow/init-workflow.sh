#!/usr/bin/env bash

# Workflow Initialization Script
# Purpose: Initialize new workflow with human-readable naming
# Version: 2.0.0 - Meaningful names + proper log structure

set -euo pipefail

CLAUDE_DIR=".claude"
LOGS_DIR="${CLAUDE_DIR}/logs"
WORKFLOWS_DIR="${LOGS_DIR}/workflows"
CONTEXTS_DIR="${LOGS_DIR}/contexts"
ACTIVE_WORKFLOW_FILE="${CLAUDE_DIR}/active-workflow.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse meaningful workflow name from user prompt
parse_workflow_name() {
    local task="$1"
    local name=""
    
    # Extract action verb and main subject
    # Remove special chars, keep spaces initially
    local cleaned=$(echo "$task" | sed 's/[^a-zA-Z0-9 ]//g')
    
    # Common patterns to extract meaningful name
    if [[ "$cleaned" =~ [Rr]efactor[[:space:]]+([a-zA-Z0-9]+) ]]; then
        name="refactor-${BASH_REMATCH[1]}"
    elif [[ "$cleaned" =~ [Aa]dd[[:space:]]+([a-zA-Z0-9 ]+) ]]; then
        name="add-$(echo "${BASH_REMATCH[1]}" | tr ' ' '-' | cut -c1-30)"
    elif [[ "$cleaned" =~ [Ff]ix[[:space:]]+([a-zA-Z0-9 ]+) ]]; then
        name="fix-$(echo "${BASH_REMATCH[1]}" | tr ' ' '-' | cut -c1-30)"
    elif [[ "$cleaned" =~ [Ii]mplement[[:space:]]+([a-zA-Z0-9 ]+) ]]; then
        name="implement-$(echo "${BASH_REMATCH[1]}" | tr ' ' '-' | cut -c1-30)"
    elif [[ "$cleaned" =~ [Cc]reate[[:space:]]+([a-zA-Z0-9 ]+) ]]; then
        name="create-$(echo "${BASH_REMATCH[1]}" | tr ' ' '-' | cut -c1-30)"
    elif [[ "$cleaned" =~ [Uu]pdate[[:space:]]+([a-zA-Z0-9 ]+) ]]; then
        name="update-$(echo "${BASH_REMATCH[1]}" | tr ' ' '-' | cut -c1-30)"
    else
        # Fallback: use first 3-4 words
        name=$(echo "$cleaned" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | cut -c1-40)
    fi
    
    # Clean up multiple dashes
    name=$(echo "$name" | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
    
    echo "$name"
}

# Generate unique workflow ID with meaningful name
generate_workflow_id() {
    local task="$1"
    local workflow_name=$(parse_workflow_name "$task")
    local timestamp=$(date +%Y%m%d-%H%M%S)
    
    echo "${workflow_name}-${timestamp}"
}

# Parse phase name from phase number and task
parse_phase_name() {
    local phase_num="$1"
    local task="$2"
    
    # Base phase names
    case $phase_num in
        1) echo "01-requirements-analysis" ;;
        2) echo "02-technical-planning" ;;
        3) echo "03-design-review" ;;
        4) echo "04-test-planning" ;;
        5) echo "05-tdd-implementation" ;;
        6) echo "06-code-review" ;;
        7) echo "07-qa-validation" ;;
        8) echo "08-documentation" ;;
        9) echo "09-notification" ;;
        *) echo "unknown-phase" ;;
    esac
}

# Create proper directory structure
create_directory_structure() {
    mkdir -p "${LOGS_DIR}"
    mkdir -p "${WORKFLOWS_DIR}"
    mkdir -p "${CONTEXTS_DIR}"
}

# Create workflow state file
create_workflow_state() {
    local workflow_id="$1"
    local task="$2"
    local agents=("${@:3}")
    
    # Create state file in workflow's own directory
    local state_file="${WORKFLOWS_DIR}/${workflow_id}/workflow-state.json"

    cat > "${state_file}" <<EOF
{
  "workflow_id": "${workflow_id}",
  "workflow_name": "$(parse_workflow_name "$task")",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "initialized",
  "current_phase": 1,
  "current_phase_name": "requirements-analysis",
  "phases": {},
  "context": {
    "task": "${task}",
    "agents": $(printf '%s\n' "${agents[@]}" | jq -R . | jq -s .),
    "project_root": "$(pwd)",
    "user": "${USER}",
    "logs_dir": "${WORKFLOWS_DIR}/${workflow_id}",
    "context_dir": "${CONTEXTS_DIR}/${workflow_id}"
  }
}
EOF
}

# Initialize phase structure
init_phase_structure() {
    local workflow_id="$1"
    local task="$2"

    # Create 9 phases with meaningful names
    for i in {1..9}; do
        local phase_name=$(parse_phase_name "$i" "$task")
        jq --arg phase "$i" \
           --arg name "$(get_phase_display_name $i)" \
           --arg slug "$phase_name" \
           '.phases[$phase] = {
               "name": $name,
               "slug": $slug,
               "status": "pending",
               "started_at": null,
               "completed_at": null,
               "deliverables": []
           }' \
           "${WORKFLOW_STATE_FILE}" > temp.json && mv temp.json "${WORKFLOW_STATE_FILE}"
    done
}

# Get phase display name
get_phase_display_name() {
    case $1 in
        1) echo "Requirements Analysis" ;;
        2) echo "Technical Planning" ;;
        3) echo "Design Review" ;;
        4) echo "Test Planning" ;;
        5) echo "TDD Implementation" ;;
        6) echo "Code Review" ;;
        7) echo "QA Validation" ;;
        8) echo "Documentation" ;;
        9) echo "Notification" ;;
        *) echo "Unknown Phase" ;;
    esac
}

# Create context directory with proper structure
create_context_dir() {
    local workflow_id="$1"
    
    # Workflow logs (execution logs, timing, etc.)
    mkdir -p "${WORKFLOWS_DIR}/${workflow_id}"
    
    # Context (deliverables, documents, artifacts)
    mkdir -p "${CONTEXTS_DIR}/${workflow_id}"
    mkdir -p "${CONTEXTS_DIR}/${workflow_id}/deliverables"
    mkdir -p "${CONTEXTS_DIR}/${workflow_id}/phases"
}

# Save task context
save_task_context() {
    local workflow_id="$1"
    local task="$2"
    shift 2
    local additional_context="$@"

    cat > "${CONTEXTS_DIR}/${workflow_id}/README.md" <<EOF
# Workflow: $(parse_workflow_name "$task")

**Workflow ID:** \`${workflow_id}\`  
**Created:** $(date)  
**Status:** Initialized

---

## Task Description

${task}

## Additional Context

${additional_context}

## Project Information

- **Project Root:** $(pwd)
- **User:** ${USER}
- **CCPM Version:** 4.0.0

## Directory Structure

\`\`\`
${workflow_id}/
├── README.md              # This file
├── deliverables/          # Phase deliverables
│   ├── 01-requirements-analysis/
│   ├── 02-technical-planning/
│   ├── 03-design-review/
│   ├── 04-test-planning/
│   ├── 05-tdd-implementation/
│   ├── 06-code-review/
│   ├── 07-qa-validation/
│   ├── 08-documentation/
│   └── 09-notification/
└── phases/                # Phase-specific logs
\`\`\`

## Execution Logs

See: \`.claude/logs/workflows/${workflow_id}/\`

---

**Next Step:** Execute Phase 1 - Requirements Analysis
EOF

    # Create phase directories
    for i in {1..9}; do
        local phase_slug=$(parse_phase_name "$i" "$task")
        mkdir -p "${CONTEXTS_DIR}/${workflow_id}/deliverables/${phase_slug}"
        mkdir -p "${CONTEXTS_DIR}/${workflow_id}/phases/${phase_slug}"
    done
}

# Create execution log
create_execution_log() {
    local workflow_id="$1"
    local task="$2"
    
    cat > "${WORKFLOWS_DIR}/${workflow_id}/execution.log" <<EOF
[$(date -u +%Y-%m-%dT%H:%M:%SZ)] WORKFLOW_INIT workflow_id=${workflow_id}
[$(date -u +%Y-%m-%dT%H:%M:%SZ)] TASK task="${task}"
[$(date -u +%Y-%m-%dT%H:%M:%SZ)] STATUS status=initialized phase=1
EOF
}

# Detect and activate agents
detect_agents() {
    local task="$1"
    local agents=()

    # Simple keyword-based detection
    if [[ "$task" =~ (mobile|react native|expo|ios|android|phone|tablet) ]]; then
        agents+=("mobile-react-native")
    fi

    if [[ "$task" =~ (vue|vuejs|composition api|pinia) ]]; then
        agents+=("web-vuejs")
    fi

    if [[ "$task" =~ (react|create-react-app|spa) ]] && [[ ! "$task" =~ (next|nextjs) ]]; then
        agents+=("web-reactjs")
    fi

    if [[ "$task" =~ (next|nextjs|ssr|ssg) ]]; then
        agents+=("web-nextjs")
    fi

    if [[ "$task" =~ (laravel|php|backend|api|database) ]]; then
        agents+=("backend-laravel")
    fi

    if [[ "$task" =~ (test|testing|qa|coverage|automation) ]]; then
        agents+=("qa-automation")
    fi

    if [[ "$task" =~ (design|ui|ux|figma|component|layout) ]]; then
        agents+=("ui-designer")
    fi

    # Always add orchestrator and context manager
    agents=("pm-operations-orchestrator" "project-context-manager" "${agents[@]}")

    # Remove duplicates
    echo "${agents[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '
}

# Show banner
show_banner() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║           CCPM Workflow Initialization v2.0                ║"
    echo "║           Meaningful Names + Organized Logs                ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Show summary
show_summary() {
    local workflow_id="$1"
    local workflow_name=$(parse_workflow_name "$2")
    local agents=("${@:3}")

    echo ""
    echo -e "${GREEN}✅ Workflow Initialized Successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Workflow Details:${NC}"
    echo "   Name: ${workflow_name}"
    echo "   ID: ${workflow_id}"
    echo "   Status: Ready to start"
    echo "   Current Phase: 1 - Requirements Analysis"
    echo ""
    echo -e "${BLUE}📁 Directory Structure:${NC}"
    echo "   Logs: .claude/logs/workflows/${workflow_id}/"
    echo "   Context: .claude/logs/contexts/${workflow_id}/"
    echo ""
    echo -e "${BLUE}🤖 Activated Agents (${#agents[@]}):${NC}"
    for agent in "${agents[@]}"; do
        echo "   - ${agent}"
    done
    echo ""
    echo -e "${YELLOW}⏭️  Next Step:${NC}"
    echo "   Run workflow:start or execute Phase 1"
    echo ""
}

# Main function
main() {
    if [[ $# -lt 1 ]]; then
        echo -e "${RED}Error: Task description required${NC}"
        echo ""
        echo "Usage: $0 <task-description> [additional-context]"
        echo ""
        echo "Examples:"
        echo "  $0 'Refactor SocialMarketingCompositePost component'"
        echo "  $0 'Add user authentication' 'Using JWT tokens'"
        echo "  $0 'Fix login crash on iOS'"
        echo "  $0 'Implement dashboard analytics'"
        echo ""
        exit 1
    fi

    local task="$1"
    local additional_context="${2:-}"

    show_banner

    echo -e "${BLUE}🔍 Analyzing task...${NC}"
    
    # Detect agents
    local agents_array=($(detect_agents "$task"))
    echo -e "${GREEN}✓${NC} Detected ${#agents_array[@]} relevant agent(s)"

    # Generate meaningful workflow ID
    local workflow_id=$(generate_workflow_id "$task")
    local workflow_name=$(parse_workflow_name "$task")
    echo -e "${GREEN}✓${NC} Generated workflow: ${workflow_name}"
    echo -e "  ID: ${workflow_id}"

    # Create directory structure
    echo -e "${BLUE}📁 Creating directory structure...${NC}"
    create_directory_structure
    echo -e "${GREEN}✓${NC} Directory structure created"

    # Create workflow state
    echo -e "${BLUE}📝 Creating workflow state...${NC}"
    create_workflow_state "$workflow_id" "$task" "${agents_array[@]}"
    echo -e "${GREEN}✓${NC} State file created"

    # Initialize phase structure
    init_phase_structure "$workflow_id" "$task"
    echo -e "${GREEN}✓${NC} Phase structure initialized"

    # Create context directory
    create_context_dir "$workflow_id"
    echo -e "${GREEN}✓${NC} Context directories created"

    # Save task context
    save_task_context "$workflow_id" "$task" "$additional_context"
    echo -e "${GREEN}✓${NC} Task context saved"

    # Create execution log
    create_execution_log "$workflow_id" "$task"
    echo -e "${GREEN}✓${NC} Execution log created"
    
    # Set as active workflow
    echo "$workflow_id" > "${ACTIVE_WORKFLOW_FILE}"
    echo -e "${GREEN}✓${NC} Set as active workflow"

    # Show summary
    show_summary "$workflow_id" "$task" "${agents_array[@]}"
}

main "$@"
