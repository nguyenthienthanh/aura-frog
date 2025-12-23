---
description: Set the active plan for current session
argument-hint: <plan-path>
---

# Set Active Plan

Set the active plan for the current session. This affects:
- Where reports are saved (`AF_REPORTS_PATH`)
- Context injection to subagents
- Workflow state tracking

## Usage

```bash
/plan:set plans/241223-user-auth
/plan:set plans/241223-GH-123-user-profile
```

## Execution

```bash
node "$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog/hooks/set-active-plan.cjs" "$ARGUMENTS"
```

## Clear Active Plan

```bash
/plan:set clear
```

## Notes

- Plan path must exist
- Clears any branch-matched suggested plan
- Persists for the session duration
- Pass to new sessions via `AF_ACTIVE_PLAN` env var
