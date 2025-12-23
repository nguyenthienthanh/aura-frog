# Multi-Session Architecture

**Version:** 1.0.0
**Purpose:** Enable complex workflows across multiple Claude Code sessions

---

## Overview

Large features often exceed single-session token limits (~200K). This architecture enables:

1. **Session splitting** by workflow phase
2. **State persistence** via file-based management
3. **Clean handoffs** between sessions
4. **Background agents** for parallel tasks

---

## Token Budget Reference

```toon
token_limits[4]{level,tokens,action}:
  Normal,0-150K,Continue working
  Warning,150K (75%),Show token warning
  Suggest Handoff,170K (85%),Recommend session split
  Force Handoff,180K (90%),Must save and restart
```

---

## Session Architecture

### Pattern 1: Phase-Based Splitting

Split workflow by natural phase boundaries:

```toon
sessions[3]{session,phases,focus,typical_tokens}:
  Session 1,1-4,Planning (Requirements/Design/UI/Tests),50K-80K
  Session 2,5,TDD Implementation (RED/GREEN/REFACTOR),80K-150K
  Session 3,6-9,Review & Deploy (Review/Verify/Docs/Notify),40K-60K
```

**Benefits:**
- Natural breakpoints at approval gates
- Each session has clear deliverables
- Context can be discarded between sessions

### Pattern 2: Background Agents (Cursor 2.0 Pattern)

Run parallel agents for independent tasks:

```
┌─────────────────────────────────────────────────────────┐
│ Main Session (Interactive)                              │
│ - User interaction                                      │
│ - Core implementation                                   │
│ - Decision making                                       │
└─────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ Background    │  │ Background    │  │ Background    │
│ Agent: Tests  │  │ Agent: Docs   │  │ Agent: Review │
│               │  │               │  │               │
│ Writes tests  │  │ Generates     │  │ Security      │
│ in parallel   │  │ documentation │  │ scanning      │
└───────────────┘  └───────────────┘  └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌───────────────┐
                    │ Merge Results │
                    │ (Main Session)│
                    └───────────────┘
```

**Implementation:**
```bash
# Main session delegates to background
# Background agent writes to /tmp/aura-frog/agents/

# Agent 1: Write tests
# Agent 2: Generate docs
# Agent 3: Run security scan

# Main session merges when ready
```

### Pattern 3: Token-Efficient Tools (Anthropic Beta)

Enable experimental token reduction:

```
# In .claude/settings.json or environment
ANTHROPIC_BETA=token-efficient-tools-2025-02-19

# Reduces tool call overhead by ~30%
```

---

## Handoff Protocol

### Step 1: Detect Token Threshold

```toon
thresholds[3]{percent,tokens,action}:
  75%,150000,Show warning banner
  85%,170000,Suggest handoff + generate document
  90%,180000,Force handoff + auto-save
```

### Step 2: Generate Handoff Document

```bash
# Automatic at threshold
bash scripts/session-handoff.sh create wf-001

# Creates human-readable handoff with:
# - Current progress
# - Next steps
# - Files to review
# - Resume instructions
```

### Step 3: Save State

```bash
# Export to files
bash scripts/workflow-manager.sh export wf-001

# Creates:
# - state.json (full state)
# - state.toon (token-efficient via workflow-export-toon.sh)
```

### Step 4: New Session Resume

```bash
# Load TOON state (minimal tokens)
bash scripts/workflow/workflow-export-toon.sh wf-001

# Show handoff document
bash scripts/session-handoff.sh show wf-001

# Tell Claude: "Resume workflow wf-001"
```

---

## State Files

### Locations

```
~/.claude/state/
├── workflows/           # Workflow states
│   ├── wf-001.json
│   └── wf-001.toon
├── sessions/            # Session tracking
│   └── current.json
├── context/             # Cached contexts
│   └── project-cache.json
└── temp/                # Handoff documents
    └── handoff-wf-001.md
```

### State Format (TOON vs JSON)

**JSON (~2000 tokens):** Full state, programmatic access
**TOON (~500 tokens):** Summary for AI context loading

Always load TOON into context, reference JSON when needed.

---

## Session Handoff Banner

Show this when approaching token limit:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  TOKEN WARNING - 75% Context Used
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current: ~150,000 tokens | Limit: ~200,000 tokens

📍 Progress: Phase 5b - TDD GREEN (62% complete)

🔄 Consider: `workflow:handoff` to start fresh session

State will be saved. You can resume seamlessly.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Implementation Guide

### For Single-Phase Tasks

No special handling needed. Use standard workflow.

### For Multi-Phase Features

1. **Before starting:**
   ```bash
   bash scripts/workflow-manager.sh init wf-001 "Feature Name"
   ```

2. **During workflow:**
   - State auto-saves at each phase gate
   - Monitor token usage
   - Split at natural boundaries

3. **At token warning:**
   ```bash
   bash scripts/session-handoff.sh create wf-001
   ```

4. **In new session:**
   ```
   User: "Resume workflow wf-001 from Phase 5"

   Claude reads:
   - handoff-wf-001.md (context)
   - wf-001.toon (state)

   Claude continues from saved state.
   ```

---

## Background Agent Pattern

### When to Use

- Tests can be written in parallel with implementation
- Documentation can be generated while coding
- Security scans can run during review

### How to Implement

```bash
# Create agent task file
cat > /tmp/aura-frog/agents/task-tests.md << EOF
# Background Task: Write Tests

## Context
- Feature: User authentication
- Phase: 5a (RED)
- Files: src/auth/Login.tsx

## Task
Write failing tests for Login component.

## Output
Write to: tests/auth/Login.test.tsx
EOF

# Agent reads task, writes output
# Main session merges result
```

### Merge Protocol

```bash
# Check background agent output
cat /tmp/aura-frog/agents/output-tests.md

# If acceptable, merge into main workflow
cp /tmp/aura-frog/agents/tests/* tests/

# Update state
bash scripts/workflow-manager.sh set wf-001 "deliverables" "tests/auth/Login.test.tsx"
```

---

## Best Practices

### Do

- Save state at every phase gate
- Use TOON format for context loading
- Generate handoff documents proactively
- Split sessions at natural boundaries
- Keep handoff documents human-readable

### Don't

- Rely on conversation history for state
- Push through token limits
- Skip state saves
- Lose uncommitted work
- Overload single sessions

---

## Troubleshooting

### Lost State

```bash
# Check for state files
ls ~/.claude/state/workflows/

# Check git for backup
git stash list
git log --all --oneline
```

### Corrupted State

```bash
# Regenerate from git
bash scripts/workflow-manager.sh init wf-002 "Feature (recovered)"
# Manually set phase based on git history
bash scripts/workflow-manager.sh phase wf-002 5
```

### Token Limit Hit

```bash
# Emergency save
bash scripts/workflow-manager.sh export wf-001
bash scripts/session-handoff.sh create wf-001

# Start new session
# Load minimal context
```

---

## Token Savings Summary

```toon
optimization_savings[6]{technique,before,after,savings}:
  TOON format,2000,500,75%
  Lazy agent loading,48000,2700,94%
  Compressed context,5000,500,90%
  Response analyzer,3000,150,95%
  State persistence,10000,500,95%
  Background agents,N/A,Parallel,Time savings
```

---

**Related:**
- `skills/session-continuation/SKILL.md` (includes state persistence)
- `skills/lazy-agent-loader/SKILL.md`
- `skills/response-analyzer/SKILL.md`
- `scripts/workflow-manager.sh`
- `scripts/workflow/workflow-export-toon.sh`
- `scripts/session-handoff.sh`
- `docs/WORKFLOW_DIAGRAMS.md`
