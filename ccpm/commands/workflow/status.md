# Command: workflow:status

**Version:** 1.0.0  
**Purpose:** Display current workflow status and progress  
**Trigger:** User types `/workflow:status`

---

## 🎯 What This Command Does

Shows comprehensive workflow status including:
- Current phase
- Progress percentage
- Phase completion status
- Deliverables count
- Time spent
- Next actions

---

## 📋 Command Format

```
/workflow:status

# Optional: Detailed view
/workflow:status --detailed
```

---

## 📊 Output Format

```
╔════════════════════════════════════════════════════════════╗
║                  WORKFLOW STATUS                           ║
╚════════════════════════════════════════════════════════════╝

📋 Workflow Information:
   ID: refactor-socialmarketing-20251124-112323
   Task: Refactor SocialMarketingCompositePost - split into components
   Status: In Progress
   Created: 2025-11-24 11:23:23
   Duration: 1h 15m

🤖 Active Agents:
   - mobile-react-native (primary)
   - qa-automation (secondary)
   - ui-designer (secondary)
   - pm-operations-orchestrator (coordinator)

📍 Current Phase: Phase 3 - Design Review

📊 Phase Progress:

  ✅ Phase 1: Requirements Analysis (approved)
     Duration: 7m 0s
     Deliverables: 1 file

  ✅ Phase 2: Technical Planning (approved)
     Duration: 12m 30s
     Deliverables: 2 files

→ 🔄 Phase 3: Design Review (in_progress)
     Started: 11:45:00
     Duration so far: 5m 15s

  ⏸️ Phase 4: Test Planning (pending)
  ⏸️ Phase 5: TDD Implementation (pending)
  ⏸️ Phase 6: Code Review (pending)
  ⏸️ Phase 7: QA Validation (pending)
  ⏸️ Phase 8: Documentation (pending)
  ⏸️ Phase 9: Notification (pending)

─────────────────────────────────────────────────────────────

Progress: 2/9 phases complete (22%)

⏭️  Next Action:
   Wait for Phase 3 completion, then approve to proceed to Phase 4

───────────────────────────────────────────────────────────

📦 Total Deliverables: 3 files
   - .claude/logs/workflows/.../PHASE_1_REQUIREMENTS_ANALYSIS.md
   - .claude/logs/workflows/.../PHASE_2_TECH_SPEC.md
   - .claude/logs/workflows/.../architecture-diagram.png

⏱️  Time Tracking:
   - Total elapsed: 1h 15m
   - Estimated remaining: ~4h 45m
   - ETA completion: 2025-11-24 16:00:00
```

---

## 📊 Status Icons

- ✅ **Approved** - Phase completed and approved
- 🔄 **In Progress** - Currently executing
- ⏸️ **Pending** - Not started yet
- ❌ **Rejected** - Phase rejected, needs rework
- ⚠️ **Blocked** - Waiting for dependency

---

## 🎯 Progress Calculation

```typescript
progress = (approved_phases / total_phases) * 100

Example:
2 approved / 9 total = 22% complete
```

---

## 📈 Detailed View

With `--detailed` flag, shows additional info:

```
╔════════════════════════════════════════════════════════════╗
║              DETAILED WORKFLOW STATUS                      ║
╚════════════════════════════════════════════════════════════╝

📋 Phase 1: Requirements Analysis
   Status: ✅ Approved
   Started: 2025-11-24 11:23:25
   Completed: 2025-11-24 11:30:25
   Approved: 2025-11-24 11:31:00
   Duration: 7m 0s
   
   Deliverables:
   - PHASE_1_REQUIREMENTS_ANALYSIS.md (350 lines)
   
   Success Criteria Met:
   ✅ Issues identified (6 issues)
   ✅ Strategy defined (5 components + 1 hook)
   ✅ Benefits quantified
   ✅ Risks mitigated
   
   Agents Involved:
   - mobile-react-native (primary)
   - ui-designer (secondary)
   - pm-operations-orchestrator (coordinator)

📋 Phase 2: Technical Planning
   [Similar detailed breakdown...]

📋 Phase 3: Design Review (CURRENT)
   Status: 🔄 In Progress
   Started: 2025-11-24 11:45:00
   Duration so far: 5m 15s
   
   Current Activity:
   - Analyzing UI component structure
   - Extracting design tokens
   - Mapping component hierarchy
   
   Agents Working:
   - ui-designer (active)
   - mobile-react-native (supporting)
```

---

## 🚦 Blocking Status

If workflow is blocked:

```
⚠️  WORKFLOW BLOCKED

Blocking Issue: Tests failing in Phase 5b
Reason: 3 tests not passing after implementation
Action Required: Fix failing tests before proceeding

Failing Tests:
- PostCaptionEditor.test.tsx: Caption validation
- PlatformSelector.test.tsx: Platform switching
- useSocialMarketingLogic.test.ts: State management

Run tests: npm test
View logs: .claude/logs/workflows/{workflow-id}/logs/
```

---

## 📂 Deliverables Summary

Shows all generated files:

```
📦 Deliverables (3 files, 1,250 lines):

Phase 1:
├── PHASE_1_REQUIREMENTS_ANALYSIS.md (350 lines)

Phase 2:
├── PHASE_2_TECH_SPEC.md (650 lines)
└── architecture-diagram.png (18 KB)

Phase 3:
└── [In progress...]

Total size: 156 KB
```

---

## ⏱️ Time Tracking

```
⏱️  Time Breakdown:

Phase 1: Requirements     7m 0s   (approved)
Phase 2: Technical Plan   12m 30s (approved)
Phase 3: Design Review    5m 15s  (in progress)
Phase 4-9: [Not started]

Total elapsed: 24m 45s
Estimated remaining: ~4h 45m
```

---

## 🎯 Quick Actions

At the end, show available actions:

```
⚡ Quick Actions:

If phase complete:
  /workflow:approve - Approve and continue
  /workflow:reject <feedback> - Request changes

If stuck:
  /workflow:modify <instructions> - Modify current work
  /workflow:cancel - Stop workflow

If need help:
  /help workflow - Show workflow commands
```

---

## 📊 State File Reference

Reads from: `workflow-state.json`

```json
{
  "workflow_id": "...",
  "status": "in_progress",
  "current_phase": 3,
  "phases": {
    "1": { "status": "approved", ... },
    "2": { "status": "approved", ... },
    "3": { "status": "in_progress", ... }
  }
}
```

---

## ✅ Use Cases

**During active workflow:**
```
User: /workflow:status
→ Shows progress, knows what to do next
```

**After long break:**
```
User: /workflow:status
→ Remembers where they left off
→ Resumes work
```

**When workflow seems stuck:**
```
User: /workflow:status
→ Sees blocking issue
→ Takes corrective action
```

---

**Status:** Active command  
**Related:** workflow:start, workflow:approve, help

