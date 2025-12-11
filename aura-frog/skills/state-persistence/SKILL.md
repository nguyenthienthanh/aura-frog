---
name: state-persistence
description: "File-based state management for session handoff and context persistence"
autoInvoke: false
priority: high
triggers:
  - "workflow:handoff"
  - "session:save"
  - "context:persist"
allowed-tools: Read, Write, Bash
---

# State Persistence

**Priority:** HIGH - Enable session continuity
**Version:** 1.0.0

---

## Purpose

Enable true session handoff by:
1. Saving workflow state to `.claude/state/`
2. Reducing conversation history dependency
3. Allowing clean session restarts

---

## State Directory Structure

```
~/.claude/state/
├── workflows/
│   ├── wf-001.json          # Workflow state (JSON)
│   └── wf-001.toon          # Workflow state (TOON)
├── sessions/
│   ├── current.json         # Current session info
│   └── history/             # Past sessions
│       └── session-{id}.json
├── context/
│   ├── project-cache.json   # Cached project contexts
│   └── agent-cache.json     # Loaded agent cache
└── temp/
    └── handoff-{id}.md      # Handoff documents
```

---

## State Types

```toon
state_types[4]{type,location,purpose,ttl}:
  Workflow,workflows/,Track 9-phase progress,Until completed
  Session,sessions/,Track current session,24 hours
  Context,context/,Cache loaded contexts,1 hour
  Handoff,temp/,Session transition docs,Until resumed
```

---

## Commands

### Save Current State
```bash
# Via workflow-manager.sh
bash scripts/workflow/workflow-manager.sh load wf-001

# State stored in:
# - .claude/logs/workflows/wf-001/workflow-state.json
```

### Load State on Resume
```bash
# Get state in TOON format (token-efficient)
bash scripts/workflow/workflow-export-toon.sh wf-001

# Or get full JSON
bash scripts/workflow/workflow-manager.sh load wf-001
```

### Create Handoff Document
```bash
# Generate handoff for new session
bash scripts/session-handoff.sh create wf-001
```

---

## Handoff Document Format

```markdown
# Session Handoff: wf-001

## Quick Context
- **Task:** [task description]
- **Phase:** 5b - TDD GREEN
- **Progress:** 62% (5/8 phases)

## What's Done
- Phase 1-4: Requirements, Design, UI, Test Plan
- Phase 5a: Tests written (all failing as expected)

## Current State
- Branch: feature/user-auth
- Last commit: abc1234 - "feat: add auth types"
- Uncommitted: 2 files

## Next Steps
1. Implement Login component to pass tests
2. Run tests, ensure GREEN
3. Proceed to Phase 5c (Refactor)

## Files to Review
- src/auth/Login.tsx (in progress)
- tests/auth.test.ts (failing - expected)

## Token Usage
- Previous session: 155,000 tokens
- This session starts fresh: 0 tokens

---
Load full state: `bash scripts/workflow-state.sh get wf-001`
```

---

## Session Lifecycle

### Start New Session
```
1. Check for existing workflow: ~/.claude/state/workflows/
2. If found, load handoff document
3. Read TOON state (token-efficient)
4. Continue from last phase
```

### During Session
```
1. Update state after each phase completion
2. Track token usage
3. At 75% tokens (150K), warn user
4. At 85% tokens (170K), suggest handoff
```

### End Session
```
1. Save current state to file
2. Generate handoff document
3. Commit any uncommitted changes (optional)
4. Show resume instructions
```

---

## Integration with Workflow

```toon
workflow_events[6]{event,action,file}:
  Phase complete,Update state,workflows/{id}.json
  Token warning,Generate handoff,temp/handoff-{id}.md
  User says stop,Full state save,All state files
  Session timeout,Auto-save state,workflows/{id}.json
  Resume command,Load state,Read from files
  Workflow complete,Archive state,Archive + cleanup
```

---

## Token Savings

By persisting state to files:

```toon
comparison[3]{approach,context_tokens,persistent_tokens}:
  Full conversation history,150K-200K,0
  State in context,10K-20K,500 (TOON summary)
  Reference-based,500,500 (just pointers)
```

---

## Best Practices

### Do
- Save state after each phase gate
- Use TOON format for loading into context
- Keep JSON for programmatic access
- Generate human-readable handoffs

### Don't
- Keep full state in conversation context
- Rely on conversation history for state
- Skip state saves between phases
- Lose uncommitted work on session end

---

## Recovery

If session ends unexpectedly:

```bash
# List available workflows
bash scripts/workflow-state.sh list

# Resume specific workflow
bash scripts/workflow-state.sh get-toon wf-001

# Check git state
git status
git stash list
```

---

**Note:** State persistence enables the multi-session architecture pattern.
See: `docs/MULTI_SESSION_ARCHITECTURE.md`

**Related Scripts:**
- `scripts/workflow/workflow-manager.sh` - Main workflow management
- `scripts/workflow/workflow-export-toon.sh` - TOON format export
- `scripts/workflow/workflow-status.sh` - Status display
- `scripts/session-handoff.sh` - Handoff document generation
