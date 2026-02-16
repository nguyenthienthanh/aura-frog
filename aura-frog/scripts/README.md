# Aura Frog Scripts

**Version:** 1.19.0
**Purpose:** Utility scripts for integrations, workflows, and automation

---

## Directory Structure

```
scripts/
├── learn/              # Learning system scripts
├── supabase/           # Database setup scripts
├── visual/             # Visual testing scripts
├── workflow/           # Workflow management scripts
├── test/               # Test utilities
└── *.sh                # Root-level utility scripts
```

---

## Quick Reference

```toon
scripts[24]{category,script,purpose}:
  integration,jira-fetch.sh,Fetch Jira tickets with TOON output
  integration,confluence-fetch.sh,Fetch Confluence pages with TOON output
  integration,setup-integrations.sh,Interactive integration setup (Jira/Confluence/Slack/Figma)
  integration,test-integrations.sh,Test all configured integrations
  workflow,init-workflow.sh,Initialize new workflow
  workflow,workflow-manager.sh,Manage workflow state
  workflow,workflow-status.sh,Show workflow status
  workflow,phase-transition.sh,Handle phase transitions
  workflow,save-deliverable.sh,Save workflow deliverables
  workflow,save-mcp-response.sh,Save MCP responses
  workflow,track-tokens.sh,Track token usage
  workflow,workflow-export-toon.sh,Export workflow to TOON format
  workflow,migrate-workflows.sh,Migrate old workflow data
  learn,submit-feedback.sh,Submit feedback to learning system
  supabase,setup.sh,Set up Supabase database schema
  supabase,schema.sql,Full database schema
  supabase,bootstrap.sql,Bootstrap SQL for first-time setup
  visual,visual-test.sh,Run visual regression tests
  visual,snapshot-compare.sh,Compare snapshots
  visual,pdf-render.sh,Render PDFs for visual comparison
  visual,init-claude-visual.sh,Initialize Claude visual testing
  utility,validate-config.sh,Validate plugin configuration
  utility,validate-toon.sh,Validate TOON format files
  utility,context-compress.sh,Compress context for token optimization
  utility,session-handoff.sh,Create session handoff files
  utility,response-save.sh,Save large responses to files
  utility,detect-design-system.sh,Detect design system in project
  utility,discover-agents.sh,Discover available agents
  utility,generate-report.sh,Generate workflow reports
  utility,claude-md-update.sh,Update CLAUDE.md files
```

---

## Integration Scripts

### Jira Integration

```bash
# Fetch a Jira ticket
./scripts/jira-fetch.sh PROJ-123

# Fetch with comments
./scripts/jira-fetch.sh PROJ-123 --verbose

# Output: TOON format for token efficiency
```

**Requirements:**
```bash
# Add to .envrc
export JIRA_BASE_URL="https://company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"
```

### Confluence Integration

```bash
# Fetch by page ID
./scripts/confluence-fetch.sh 123456789

# Fetch by space and title
./scripts/confluence-fetch.sh --space PROJ --title "API Docs"

# Fetch with comments
./scripts/confluence-fetch.sh 123456789 --verbose
```

**Requirements:** Same as Jira (shares Atlassian credentials)

### Setup All Integrations

```bash
# Interactive setup for all integrations
./scripts/setup-integrations.sh

# Test configured integrations
./scripts/test-integrations.sh
```

---

## Workflow Scripts

### Initialize Workflow

```bash
./scripts/workflow/init-workflow.sh "Task description"
```

### Check Status

```bash
./scripts/workflow/workflow-status.sh
```

### Track Tokens

```bash
./scripts/workflow/track-tokens.sh show
./scripts/workflow/track-tokens.sh log
./scripts/workflow/track-tokens.sh estimate "Your text here"
```

### Phase Transitions

```bash
./scripts/workflow/phase-transition.sh next
./scripts/workflow/phase-transition.sh goto 5b
```

---

## Learning System Scripts

### Supabase Setup

```bash
# 1. Run bootstrap (one-time, in Supabase SQL Editor)
# File: scripts/supabase/bootstrap.sql

# 2. Run setup script
./scripts/supabase/setup.sh
```

**Requirements:**
```bash
# Add to .envrc
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
export SUPABASE_SECRET_KEY="your-secret-key"
export AF_LEARNING_ENABLED="true"
```

### Submit Feedback

```bash
./scripts/learn/submit-feedback.sh
```

---

## Visual Testing Scripts

### Run Visual Tests

```bash
# Initialize visual testing
./scripts/visual/init-claude-visual.sh

# Run visual regression test
./scripts/visual/visual-test.sh

# Compare snapshots
./scripts/visual/snapshot-compare.sh baseline.png current.png
```

---

## Utility Scripts

### Validate Configuration

```bash
./scripts/validate-config.sh
```

### Validate TOON Files

```bash
./scripts/validate-toon.sh path/to/file.md
```

### Session Handoff

```bash
# Create handoff file for session continuation
./scripts/session-handoff.sh
```

### Context Compression

```bash
# Compress large context for token optimization
./scripts/context-compress.sh input.md output.md
```

### Detect Design System

```bash
./scripts/detect-design-system.sh
```

---

## Environment Variables Summary

```bash
# Atlassian (Jira/Confluence)
export JIRA_BASE_URL="https://company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"

# Supabase (Learning System)
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
export SUPABASE_SECRET_KEY="your-secret-key"
export AF_LEARNING_ENABLED="true"

# Optional integrations (for optional MCP servers)
export FIGMA_API_TOKEN="your-figma-token"
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_TEAM_ID="T0123456789"
```

---

## Adding New Scripts

1. Create script in appropriate category folder
2. Add shebang: `#!/bin/bash`
3. Make executable: `chmod +x script.sh`
4. Update this README
5. Document required environment variables

---

**Version:** 1.19.0 | **Last Updated:** 2026-01-16
