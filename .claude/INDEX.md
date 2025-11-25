# 📚 CCPM Quick Index

**Version:** 4.5.0  
**Last Updated:** 2025-11-25

---

## ⚡ Essential Files (Start Here)

### For Users
1. **README.md** - Main guide
2. **GET_STARTED.md** - Quick start (5 min)
3. **TESTING_GUIDE.md** - Test workflows

### For AI (Claude)
1. **CLAUDE.md** - AI instructions & behavior
2. **ccpm-config.yaml** - Active config
3. **project-contexts/** - Project-specific settings

---

## 📁 Directory Purpose

```
.claude/
├── agents/          → 14 specialized AI agents (6 more planned)
├── commands/        → 25 workflow commands (23 more planned)
├── docs/
│   ├── phases/      → 11 detailed phase guides
│   └── guides/      → Integration guides (Jira, Confluence)
├── hooks/           → Pre/post phase automation
├── rules/           → Quality & safety rules
├── scripts/         → Helper scripts
├── skills/          → 25+ reusable capabilities
├── templates/       → 8 document templates
├── workflows/       → (Planned) Specialized YAML workflows
├── project-contexts/→ Project-specific configs
├── plans/           → Saved execution plans
├── documents/       → Generated documentation
├── TODO.md          → 📋 Feature backlog (33 items)
└── logs/
    ├── workflows/   → Execution logs (auto-created)
    └── contexts/    → Workflow deliverables (auto-created)
```

---

## 🎯 Common Tasks

### Start a Workflow
```
"workflow:start Your task description"
```
Reads: CLAUDE.md → commands/workflow/start.md → hooks/pre-phase.md

### Fix a Bug
```
bugfix <description>
bugfix:quick <simple-bug>
bugfix:hotfix <production-emergency>
```
Reads: commands/bugfix.md → TDD workflow

### Check Status
```
workflow:status
```
Reads: workflow-state.json

### Configure Project
```
Edit: project-contexts/[your-project]/project-config.yaml
```

---

## 📋 Feature Roadmap

**See:** `TODO.md` for complete feature backlog

**Summary:**
- ✅ **Implemented:** 25 commands, 14 agents, 4 phase guides
- 🟡 **Planned:** 23 commands, 6 agents, 4 workflows
- **Total:** 48 commands, 20 agents, 4 workflows when complete

**Priorities:**
- 🔴 High: Security, Performance, Quality commands
- 🟡 Medium: Database, API, Monitoring commands  
- 🟢 Low: Additional utilities

**Implementation Plan:** 5-week roadmap in TODO.md

---

## 🔑 Key Concepts

### Workflow Names (v4.0)
- Parsed from user input
- Format: `action-subject-timestamp`
- Example: `refactor-userprofile-20251124-143022`

### Project Context Priority
```
Project Context > CCPM Config > Defaults
```

### 9 Phases
1. Requirements → 2. Technical Planning → 3. Design Review → 4. Test Planning → 5. TDD (RED-GREEN-REFACTOR) → 6. Code Review → 7. QA Validation → 8. Documentation → 9. Notification

---

## 📖 Documentation Map

### Guides
- **GET_STARTED.md** - Beginner guide
- **TESTING_GUIDE.md** - Test system
- **MIGRATION_GUIDE.md** - v3→v4 upgrade
- **docs/WORKFLOW_NAMING.md** - Naming system

### Integration
- **docs/guides/JIRA_INTEGRATION.md**
- **docs/guides/CONFLUENCE_OPERATIONS.md**
- **docs/guides/IMAGE_ANALYSIS.md**
- **docs/mcp-integration.md**
- **docs/figma-mcp-integration.md**

### Architecture
- **docs/architecture/overview.md** - System design

### Phase Guides (11 files)
- **docs/phases/PHASE_1_REQUIREMENTS_ANALYSIS.MD**
- **docs/phases/PHASE_2_TECHNICAL_PLANNING.MD**
- ... through PHASE_9_NOTIFICATION.MD

---

## 🚀 Quick Commands

```bash
# Workflows
workflow:start "Task description"
workflow:status
workflow:progress
workflow:metrics
workflow:tokens

# Bug Fixing (NEW!)
bugfix "Bug description"        # Full workflow (2-4h)
bugfix:quick "Simple bug"       # Quick fix (1-2h)
bugfix:hotfix "Production bug"  # Emergency (< 1.5h)

# Session Management
workflow:handoff         # Before token limit
workflow:resume [id]     # Continue new session

# Planning & Execution
planning "Task"          # Create plan only
planning:list            # List all plans
planning:refine [id]     # Update plan
execute [id]             # Execute plan (skip phase 1-4)

# Testing
test:unit "file"         # Add unit tests
test:e2e "flow"          # Add E2E tests
test:coverage            # Check coverage

# Documentation
document feature "Name"  # Feature docs
document api "file"      # API docs
document component "file"# Component docs

# Review
review:fix               # Auto-fix review issues

# Control
approve
reject: reason

# Agents
agent:list
agent:info mobile-react-native

# Project
project:detect
project:init

# Help
help
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `ccpm-config.yaml` | Active config |
| `ccpm-config.example.yaml` | Template |
| `project-contexts/template/` | New project template |
| `project-contexts/[project]/` | Project-specific |
| `workflow-state.json` | Active workflow state |

---

## 📊 Current Status

**System:** ✅ Production Ready  
**Version:** 4.5.0  
**Components:** 
- 14 Agents
- 45 Commands (Bug Fixing + Refactoring + Testing Added!)
- 13 Rules
- 25+ Skills
- 11 Phase Guides
- 8 Templates

**Active Workflows:** Check `logs/workflows/`  
**Deliverables:** Check `logs/contexts/`

---

## 💡 Pro Tips

1. **Start workflows:** Use descriptive task names
2. **Project contexts:** Configure once, use everywhere
3. **Phase guides:** Read before starting complex tasks
4. **Logs:** Check `logs/workflows/[id]/execution.log` for debugging
5. **Deliverables:** Find in `logs/contexts/[id]/deliverables/`

---

*This index helps you navigate CCPM without re-reading full context.*

