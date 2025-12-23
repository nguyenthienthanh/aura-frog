---
name: state-persistence
description: "TOON-based state management for session handoff and context persistence"
autoInvoke: false
priority: high
model: haiku
triggers:
  - "workflow:handoff"
  - "session:save"
  - "context:persist"
allowed-tools: Read, Write, Bash
---

# State Persistence

**Priority:** HIGH - Enable session continuity
**Version:** 2.0.0

---

## Plan State Variables

```toon
state_vars[4]{var,purpose,persistence}:
  AF_ACTIVE_PLAN,Current active plan path,Session temp file
  AF_SUGGESTED_PLAN,Branch-matched plan hint,Inferred from git branch
  AF_COMPLEXITY,Auto-detected task complexity,Session memory
  AF_ACTIVE_AGENTS,Currently active agents,Session memory
```

### Plan State Detection (On Session Start)

```bash
# 1. Check session state file
if [ -f /tmp/af-session-*.json ]; then
  ACTIVE_PLAN=$(cat /tmp/af-session-*.json | grep -o '"activePlan":"[^"]*"' | cut -d'"' -f4)
  echo "📋 Active plan found: $ACTIVE_PLAN"
fi

# 2. Check branch-matched plan
BRANCH=$(git branch --show-current 2>/dev/null)
if [ -n "$BRANCH" ]; then
  SUGGESTED=$(find plans/ -name "*${BRANCH}*" -type d 2>/dev/null | head -1)
  if [ -n "$SUGGESTED" ]; then
    echo "💡 Suggested plan from branch: $SUGGESTED"
  fi
fi
```

### On Plan Activation

```bash
# Write to session state (not git)
cat > /tmp/af-session-$(date +%s).json << EOF
{
  "activePlan": "plans/2025-12-23-feature-auth/",
  "complexity": "standard",
  "activeAgents": ["backend-nodejs", "qa-automation"],
  "phase": 3,
  "timestamp": "$(date -Iseconds)"
}
EOF
```

---

## Purpose

Enable true session handoff by:
1. Saving workflow state to `.aura-frog/` (TOON format)
2. Reducing conversation history dependency
3. Allowing clean session restarts

---

## State Directory Structure

```
.claude/                             # Project Claude root
├── session-context.toon             # Current session patterns + workflow
├── workflow-state.toon              # Active workflow state
├── decisions.toon                   # Architectural decisions
└── project-contexts/                # Project config
    └── {project}/
        ├── project-config.yaml
        └── conventions.md

~/.claude/state/                     # Global state (optional)
├── workflows/
│   └── {project}-{id}.toon
└── handoffs/
    └── handoff-{id}.md
```

---

## TOON State Format

### Session Context (patterns + workflow)

```toon
# .claude/session-context.toon
# Generated: 2025-12-16T10:00:00Z

project:
  name: my-app
  stack: React,TypeScript,TailwindCSS

patterns[6]{type,convention,example}:
  file_naming,PascalCase,UserProfile.tsx
  imports,absolute,@/components/Button
  exports,named,export const Card
  errors,result,{ ok: true, data }
  testing,vitest,describe/it
  styling,tailwind,className

workflow:
  id: auth-feature-20251216
  phase: 5
  phase_name: TDD Implementation
  feature: user-authentication
  branch: feature/user-auth

decisions[3]{id,choice,reason}:
  auth,JWT,Stateless + scalable
  storage,Redis,Fast session lookup
  validation,Zod,Runtime type safety
```

### Workflow State (detailed)

```toon
# .claude/workflow-state.toon

workflow:
  id: auth-feature-20251216
  name: User Authentication
  status: in_progress
  phase: 5
  created: 2025-12-16T10:00:00Z
  task: Implement JWT authentication with refresh tokens

phases[9]{num,name,status}:
  1,Requirements,completed
  2,Tech Planning,completed
  3,UI Breakdown,completed
  4,Test Planning,completed
  5,TDD Implementation,in_progress
  6,Code Review,pending
  7,QA Validation,pending
  8,Documentation,pending
  9,Notification,pending

agents[4]: pm-requirements,tech-lead,frontend-senior,tdd-specialist

deliverables[8]{phase,file}:
  1,docs/requirements.md
  2,docs/tech-spec.md
  3,docs/ui-breakdown.md
  4,tests/auth.test.ts
  5,src/auth/Login.tsx
  5,src/auth/useAuth.ts
  5,src/auth/authService.ts
  5,src/auth/types.ts
```

---

## Token Comparison

| Format | Lines | Est. Tokens |
|--------|-------|-------------|
| JSON (old) | ~150 | ~600 |
| TOON (new) | ~40 | ~160 |
| **Savings** | **73%** | **~440 tokens** |

---

## Commands

### Save State

```bash
# Auto-save after phase completion
# State written to .claude/workflow-state.toon

# Manual save
bash scripts/workflow/workflow-save-toon.sh
```

### Load State

```bash
# Read TOON directly (token-efficient)
Read .claude/session-context.toon

# Export from JSON to TOON
bash scripts/workflow/workflow-export-toon.sh {workflow-id}
```

### Handoff Document

```bash
bash scripts/session-handoff.sh create {workflow-id}
```

---

## Session Lifecycle

### Start New Session

```
1. Check .claude/session-context.toon
2. If exists and < 1 hour old → use cached
3. If not → run project-context-loader
4. Load .claude/workflow-state.toon if active workflow
```

### During Session

```
1. Update state after each phase
2. Track token usage
3. At 75% tokens → warn user
4. At 85% tokens → suggest handoff
```

### End Session

```
1. Save session-context.toon
2. Save workflow-state.toon
3. Generate handoff if needed
4. Show resume instructions
```

---

## Handoff Document Format

```markdown
# Session Handoff: auth-feature-20251216

## Quick Context
- **Task:** User authentication with JWT
- **Phase:** 5 - TDD Implementation (GREEN)
- **Progress:** 56% (5/9 phases)

## Patterns (from session-context.toon)
- File naming: PascalCase
- Imports: @/ absolute paths
- Testing: vitest

## What's Done
- Requirements, Design, UI, Test Planning complete
- Tests written (passing)

## Next Steps
1. Complete Login component
2. Add refresh token logic
3. Proceed to Code Review

## Resume
\`\`\`
Read .claude/session-context.toon
Read .claude/workflow-state.toon
\`\`\`
```

---

## Best Practices

### Do
- Save state after each phase gate
- Use TOON format for all state files
- Keep session-context.toon updated
- Generate human-readable handoffs

### Don't
- Keep full state in conversation context
- Rely on conversation history for state
- Skip state saves between phases
- Use JSON when TOON suffices

---

**Related:**
- `skills/project-context-loader/SKILL.md` - Context generation
- `rules/codebase-consistency.md` - Pattern matching
- `scripts/workflow/workflow-export-toon.sh` - TOON export
- `docs/MULTI_SESSION_ARCHITECTURE.md` - Architecture guide
