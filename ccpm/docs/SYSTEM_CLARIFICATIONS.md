# CCPM System Clarifications

**Version:** 1.0.0
**Last Updated:** 2025-11-27
**Purpose:** Detailed explanations of CCPM system behavior and concepts

This document provides detailed clarifications that Claude should understand but don't need to be in the core CLAUDE.md file.

---

## Hooks Are Logical, Not Runtime

**⚠️ IMPORTANT:** Files in `hooks/` are **conceptual guides**, NOT executable scripts.

### What Hooks Are:
- ✅ Markdown documentation files
- ✅ Logical instructions for Claude to follow
- ✅ Workflow guidance at specific points

### What Hooks Are NOT:
- ❌ Node.js/TypeScript scripts
- ❌ Executable programs
- ❌ Separate processes that run

### How They Work:

When Claude executes a workflow:
1. Reaches a hook point (e.g., before Phase 1)
2. Reads the corresponding hook file (`hooks/pre-phase.md`)
3. Follows the instructions in that markdown
4. Continues with the workflow

**Example:**
```markdown
# hooks/pre-phase.md

Before starting any phase:
1. Check project context is loaded
2. Verify required files exist
3. Show phase preview to user
```

Claude reads this and follows these steps - it's not executed as code.

---

## Workflow Modes

### Mode 1: Full 9-Phase Workflow (High Quality)

**Use for:**
- New features
- Complex changes
- Production code
- Customer-facing functionality

**Includes:**
- Requirements analysis
- Technical design
- UI breakdown
- Test planning
- TDD (RED → GREEN → REFACTOR)
- Code review
- QA validation
- Documentation
- Team notification

**Time:** 2-4 hours (depending on complexity)
**Quality:** Maximum
**Coverage:** ≥80% test coverage
**Review:** Multi-agent cross-review

**Example Tasks:**
- "Add user authentication system"
- "Implement payment processing"
- "Build analytics dashboard"

---

### Mode 2: Lightweight Commands (Speed)

**Use for:**
- Small bug fixes
- Documentation updates
- Simple refactoring
- Quick experiments

**Includes:**
- Minimal phases
- Focused execution
- Streamlined approval

**Time:** 30 minutes - 1 hour
**Quality:** Good (not maximum, but acceptable)
**Coverage:** Proportional to change size
**Review:** Optional or minimal

**Available Commands:**
- `bugfix:quick <description>` - Fast bug fix
- `refactor <file>` - Code refactoring
- `planning <task>` - Create execution plan
- `document <type> <name>` - Generate docs
- `test:unit <file>` - Add unit tests

**Example Tasks:**
- "Fix typo in button label"
- "Add JSDoc comments"
- "Extract duplicate code"

---

### Mode Selection

**Claude Will:**
- Automatically suggest appropriate mode based on task complexity
- Default to lightweight for simple tasks
- Recommend full workflow for complex features
- Ask user if unclear

**User Can:**
- Explicitly request mode: "Use full workflow" or "Quick fix only"
- Override suggestion
- Change mode mid-execution (rare)

---

## Session Start Protocol

### When It Triggers

**AT THE START OF EVERY NEW SESSION:**
- Plugin is loaded
- Claude Code starts
- New conversation begins

### Behavior

**1. Check Environment**
```
Is current directory a user project?
├─ Yes: Continue to step 2
└─ No: Skip (system directory, temp folder, etc.)
```

**2. Check `.claude/` Folder**
```
Does .claude/ folder exist?
├─ Yes: Continue to step 4 (silently)
└─ No: Continue to step 3
```

**3. Show Welcome Message**

Only if `.claude/` is missing:

```markdown
╔════════════════════════════════════════════════════════════╗
║  👋 Welcome to CCPM Team Agents!                          ║
╚════════════════════════════════════════════════════════════╝

🤖 **CCPM v5.2.0** - AI-powered project management is active!

**📋 Quick Setup Check:**

I noticed this project hasn't been initialized with CCPM yet.

**To get started:**
```bash
project:init
```

[Full message as in CLAUDE.md]
```

**4. Proceed Silently**
- If `.claude/` exists, no message
- Continue with normal operation

**5. Don't Repeat**
- Show welcome only once per session
- Don't show on every message

### Exception: Workflow Commands

If user runs `workflow:start` without initialization:
- Follow `hooks/on-start.md` logic
- Guide through initialization
- Don't block - offer to proceed

### Purpose

**Why This Protocol:**
- ✅ Proactive onboarding for new users
- ✅ Reminder to initialize CCPM
- ✅ Non-intrusive (only once per session if needed)
- ✅ Clear next steps
- ✅ Doesn't block experienced users

**What It Prevents:**
- ❌ Silent failures from missing setup
- ❌ Confusion about CCPM status
- ❌ Users not knowing to run project:init

---

## File Locations

### Plugin Files (Global)

**Location:** `~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/`

**Installed:** Once per machine

**Contains:**
- CCPM system instructions
- Agent definitions
- Command definitions
- Core rules
- Templates

**Updated:** When you update the plugin

---

### Project Files (Per-Project)

**Location:** `<your-project>/.claude/`

**Created:** When you run `project:init`

**Contains:**
- Project context
- Workflow logs
- Active states
- Project-specific settings

**Updated:** During workflow execution

---

## Related Documentation

- **Main Instructions:** `ccpm/CLAUDE.md`
- **Architecture:** `ccpm/docs/CLAUDE_FILE_ARCHITECTURE.md`
- **Hooks:** `ccpm/hooks/`
- **Quick Start:** `ccpm/GET_STARTED.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-11-27
