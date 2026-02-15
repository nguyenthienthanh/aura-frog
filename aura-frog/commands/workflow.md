# Command: /workflow

**Category:** Workflow (Bundled)
**Scope:** Session
**Version:** 2.0.0

---

## Purpose

Unified workflow command with interactive subcommand selection. Replaces 22+ individual workflow commands with a single entry point.

---

## Usage

```bash
# Interactive mode - shows menu
/workflow

# Direct subcommand access
/workflow start "Build user authentication"
/workflow status
/workflow phase 4
/workflow next
/workflow approve
```

---

## Subcommands

### Core Workflow

| Subcommand | Description | Example |
|------------|-------------|---------|
| `start <task>` | Start new 9-phase workflow | `/workflow start "Add login"` |
| `fasttrack <specs>` | Fast-track with pre-approved specs | `/workflow fasttrack "See specs.md"` |
| `status` | Show current workflow status | `/workflow status` |
| `next` | Continue to next phase | `/workflow next` |
| `approve` | Approve current phase | `/workflow approve` |
| `reject <reason>` | Reject with feedback | `/workflow reject "Need tests"` |

### Phase Navigation

| Subcommand | Description | Example |
|------------|-------------|---------|
| `phase <n>` | Jump to specific phase | `/workflow phase 4` |
| `phase:1` | Requirements gathering | `/workflow phase:1` |
| `phase:2` | Design (approval gate) | `/workflow phase:2` |
| `phase:3` | Test planning | `/workflow phase:3` |
| `phase:4` | Implementation | `/workflow phase:4` |
| `phase:5a` | RED tests | `/workflow phase:5a` |
| `phase:5b` | GREEN implementation (approval gate) | `/workflow phase:5b` |
| `phase:5c` | Code review | `/workflow phase:5c` |
| `phase:6` | REFACTOR | `/workflow phase:6` |
| `phase:7` | Documentation | `/workflow phase:7` |
| `phase:8` | Integration | `/workflow phase:8` |
| `phase:9` | Deployment | `/workflow phase:9` |

### Session Management

| Subcommand | Description | Example |
|------------|-------------|---------|
| `handoff` | Save state for session continuation | `/workflow handoff` |
| `resume` | Resume from saved state | `/workflow resume` |
| `reset` | Reset workflow state | `/workflow reset` |
| `history` | Show phase history | `/workflow history` |

### Metrics & Reporting

| Subcommand | Description | Example |
|------------|-------------|---------|
| `metrics` | Show workflow metrics | `/workflow metrics` |
| `progress` | Show visual progress | `/workflow progress` |
| `export` | Export workflow docs | `/workflow export` |

---

## Interactive Menu

When called without subcommand, shows:

```
🔄 Workflow Commands

Current: Phase 4 - Implementation (65% complete)

Quick Actions:
  [1] Continue to next phase
  [2] Show status
  [3] Approve current phase

Phase Navigation:
  [4] Jump to phase...
  [5] View phase details

Session:
  [6] Save handoff
  [7] Resume previous
  [8] Reset workflow

Select [1-8] or type command:
```

---

## 9-Phase Workflow Summary

```toon
phases[9]{phase,name,approval,auto_continue}:
  1,Requirements,No,Yes
  2,Design,YES (Gate 1),No - Wait for approval
  3,Test Planning,No,Yes
  4,Implementation,No,Yes
  5a,RED Tests,No,Yes
  5b,GREEN Code,YES (Gate 2),No - Wait for approval
  5c,Code Review,No,Yes
  6,REFACTOR,No,Yes
  7,Documentation,No,Yes
  8,Integration,No,Yes
  9,Deployment,No,Yes
```

**Only 2 Approval Gates:** Phase 2 (Design) and Phase 5b (Implementation)

---

## Status Output

```markdown
## 🔄 Workflow Status

**Task:** Build user authentication
**Phase:** 4 - Implementation
**Progress:** ████████░░ 65%

### Phase History
- ✅ Phase 1: Requirements (completed)
- ✅ Phase 2: Design (approved)
- ✅ Phase 3: Test Planning (completed)
- 🔄 Phase 4: Implementation (in progress)

### Current Deliverables
- [ ] auth.service.ts
- [ ] auth.controller.ts
- [x] User model (done)

### Next Steps
1. Complete password hashing
2. Add JWT token generation
3. Run `/workflow next` when ready
```

---

## Related Files

- **Workflow Orchestrator:** `skills/workflow-orchestrator/SKILL.md` (includes fast-track mode)
- **Session Continuation:** `skills/session-continuation/SKILL.md`
- **Phase Docs:** `docs/phases/`
- **Legacy Commands:** `commands/workflow/` (individual phase commands)

---

## Migration from Individual Commands

| Old Command | New Command |
|-------------|-------------|
| `/workflow:start` | `/workflow start` |
| `/workflow:phase:1` | `/workflow phase:1` |
| `/workflow:status` | `/workflow status` |
| `/workflow:next` | `/workflow next` |
| `/workflow:approve` | `/workflow approve` |
| `/workflow:handoff` | `/workflow handoff` |
| `/workflow:resume` | `/workflow resume` |

Legacy commands still work but redirect to bundled command.

---

**Version:** 2.0.0 | **Last Updated:** 2026-01-21
