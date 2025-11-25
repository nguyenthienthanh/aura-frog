# Command: workflow:start

**Version:** 1.0.0  
**Purpose:** Initialize and start Phase 1 of CCPM workflow  
**Trigger:** User types `/workflow:start <task-description>`

---

## 🎯 What This Command Does

1. Initializes workflow state
2. Detects relevant agents based on task
3. Executes Phase 1: Requirements Analysis
4. Shows approval gate

---

## 📋 Command Format

```
/workflow:start <task-description>

Examples:
/workflow:start Refactor UserProfile component - split into smaller pieces
/workflow:start Add social media sharing feature to mobile app
/workflow:start Fix bug in payment processing API
/workflow:start Implement user authentication with JWT
```

---

## ⚙️ Execution Steps

### Step 1: Initialize Workflow
- Generate unique workflow ID
- Create workflow state file (`.claude/workflow-state.json`)
- Create context directory
- Detect project type and relevant agents

### Step 2: Agent Detection
Based on task keywords, activate agents:
- Mobile keywords → mobile-react-native
- Web keywords → web-vuejs/reactjs/nextjs
- Backend keywords → backend-laravel
- Test keywords → qa-automation
- Design keywords → ui-designer
- Always active: pm-operations-orchestrator, project-context-manager

### Step 3: Execute Phase 1 - Requirements Analysis

**Deliverables:**
- Requirements analysis document (`.md`)
- Issue identification
- Refactoring/implementation strategy
- Success criteria
- Risk assessment

**Agent Actions:**
- **PM Orchestrator:** Coordinate workflow
- **Primary Dev Agent:** Analyze codebase/requirements
- **UI Designer:** (if applicable) UI/UX considerations
- **QA Agent:** Testing requirements

### Step 4: Show Approval Gate

```
═══════════════════════════════════════════════════════════
🎯 PHASE 1 COMPLETE: Requirements Analysis
═══════════════════════════════════════════════════════════

📊 Summary: [Brief summary]

📦 Deliverables:
   📄 requirements-analysis.md

✅ Success Criteria:
   ✅ [Criterion 1]
   ✅ [Criterion 2]

⏭️  Next Phase: Phase 2 - Technical Planning

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "/workflow:approve" → Proceed to Phase 2
Type "/workflow:reject" → Restart Phase 1
Type "/workflow:modify <feedback>" → Refine analysis
Type "/workflow:cancel" → Stop workflow

Your response:
═══════════════════════════════════════════════════════════
```

---

## 📂 Files Created

```
.claude/
├── workflow-state.json (workflow tracking)
└── context/
    └── {workflow-id}/
        ├── task-context.md
        ├── deliverables/
        │   └── PHASE_1_REQUIREMENTS_ANALYSIS.md
        └── logs/
```

---

## 🎯 What Happens Next

After approval, continue with:
- `/workflow:phase:2` - Technical Planning
- Or `/workflow:status` - Check current status

---

## ✅ Success Criteria

- [ ] Workflow initialized
- [ ] Agents detected and activated
- [ ] Requirements analyzed
- [ ] Document created
- [ ] Approval gate shown
- [ ] User prompted for next action

---

**Status:** Active command  
**Related:** workflow:approve, workflow:reject, workflow:status

