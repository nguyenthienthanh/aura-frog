# Session Continuation Skill

## Purpose

Manage workflow state across Claude Code sessions, enabling pause/resume of long workflows.

## Auto-Invoke Conditions

This skill activates when:
- Token count exceeds 150K (75% of limit)
- User requests to save/pause workflow
- User wants to resume a previous workflow
- Session needs to be handed off

---

## Token Awareness

### Warning Thresholds
- **150K tokens** - Consider handoff soon
- **175K tokens** - Recommend handoff now
- **190K tokens** - Urgent handoff required

### Check Token Usage
Monitor context usage and warn user proactively.

---

## Handoff Process

### When to Use `workflow:handoff`
- Token count reaches 150K (75% of 200K limit)
- Need to close session but continue later
- Taking a break on long workflow
- Switching to different task temporarily

### Handoff Steps
1. Save current workflow state to `.claude/context/`
2. Generate workflow ID
3. Document current phase and progress
4. List pending tasks
5. Provide resume command

### State File Format
```yaml
workflow_id: "WF-20251201-143022"
ticket: "PROJ-1234"
current_phase: 5
phase_status: "in_progress"
started_at: "2025-12-01T14:30:22Z"
last_saved: "2025-12-01T16:45:00Z"

completed_phases:
  - phase: 1
    deliverables: ["requirements.md"]
  - phase: 2
    deliverables: ["architecture.md"]

pending_tasks:
  - "Complete implementation of UserProfile component"
  - "Add unit tests for validation logic"

context:
  files_modified: ["src/components/UserProfile.tsx"]
  decisions: ["Using Zustand for state management"]
```

---

## Resume Process

### When to Use `workflow:resume <id>`
- Starting new session
- Continuing previous workflow
- Recovering from interruption

### Resume Steps
1. Load state file from `.claude/context/`
2. Verify workflow ID matches
3. Load project context
4. Review completed phases
5. Continue from last saved point

### Resume Command
```
workflow:resume WF-20251201-143022
```

---

## Important Notes

### When NOT Needed
- Normal commands (bugfix, refactor, etc.)
- Single-session tasks
- Quick fixes

### Auto-Save
State is automatically saved:
- After each phase completion
- Every 30 minutes during long phases
- Before token limit warnings

### State Location
```
.claude/context/
├── WF-20251201-143022.yaml
├── WF-20251130-091500.yaml
└── active-workflow.yaml  # Symlink to current
```

---

## Related

- `docs/SESSION_CONTINUATION_GUIDE.md`
- `rules/token-time-awareness.md`
- `commands/workflow/handoff.md`
- `commands/workflow/resume.md`

---

**Version:** 1.0.0
