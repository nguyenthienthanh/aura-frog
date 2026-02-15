# Aura Frog Usage Guide - Clarifications & Best Practices

**Version:** 1.19.0
**Last Updated:** 2026-02-09

---

## Key Clarifications

### 1. Hooks Are Two Types: Runtime Scripts + Conceptual Documentation

Aura Frog uses both **runtime hooks** (`.cjs` files executed by Claude Code) and **conceptual hooks** (`.md` files as instructions):

**Runtime Hooks (.cjs files):**
- ✅ Real Node.js scripts executed by Claude Code's hook system
- ✅ Configured in `hooks/hooks.json`
- ✅ Run automatically on lifecycle events (SessionStart, PreToolUse, PostToolUse, etc.)
- ✅ Examples: `session-start.cjs`, `auto-learn.cjs`, `lint-autofix.cjs`, `scout-block.cjs`

**Conceptual Hooks (.md files):**
- ✅ Markdown files describing behavior logic for Claude to follow
- ✅ Instructions Claude reads and implements during workflows
- ✅ Examples: `pre-phase.md`, `post-phase.md`, `pre-approval.md`

**How runtime hooks work:**
```
Session starts → hooks.json triggers session-start.cjs → Injects environment variables
User edits file → hooks.json triggers lint-autofix.cjs → Auto-runs linter
User writes code → hooks.json triggers smart-learn.cjs → Detects patterns
```

**How conceptual hooks work:**
```
User: workflow:start "Task"
  ↓
Claude reads: hooks/pre-phase.md
  ↓
Claude implements logic: Load workflow state, check prerequisites, activate agents
  ↓
Claude executes: Phase 1 logic from docs/phases/PHASE_1_REQUIREMENTS_ANALYSIS.MD
  ↓
Claude reads: hooks/post-phase.md
  ↓
Claude implements logic: Save state, generate summary, show approval gate
```

---

## Workflow Modes: When to Use What

### Mode 1: Full 9-Phase Workflow

**Command:** `workflow:start "Task description"`

**When to use:**
- ✅ New features
- ✅ Complex bug fixes
- ✅ Architecture changes
- ✅ Production code
- ✅ Multi-file changes
- ✅ When you need complete documentation

**Phases:** All 9 phases with approval gates
**Time:** 2-4 hours
**Output:** Complete documentation + tested code + team notification

**Example:**
```
workflow:start "Add user authentication with JWT"
→ 9 phases
→ Requirements doc
→ Technical spec
→ Design review
→ Test plan
→ TDD implementation
→ Code review
→ QA validation
→ Complete documentation
→ Team notification
```

---

### Mode 2: Lightweight Commands

#### bugfix:quick
```bash
bugfix:quick "Button label typo: 'Sumbit' → 'Submit'"
```
**Phases grouped:**
- Analysis + Planning (auto-executed, no approval)
- Write test + Fix + Verify (1 approval)
- Done (skip docs for trivial)

**Time:** 15-30 min

---

#### refactor
```bash
refactor src/components/Dashboard.tsx
```
**Phases:**
- Analysis
- Plan refactoring
- Write/update tests
- Refactor code
- Verify tests pass
- Code review
- Done

**Time:** 1-2 hours

---

#### planning
```bash
planning "Add dark mode toggle"
```
**Creates plan only, NO implementation:**
- Requirement analysis
- Technical plan
- Design review (if needed)
- Test strategy
- **Saves plan** to `plans/`

**Later execute:**
```bash
execute plan-dark-mode-toggle-timestamp
```

**Time:** 30-45 min (planning only)

---

#### document
```bash
document feature "User Authentication"
document api src/api/userApi.ts
document component src/components/Button.tsx
```
**Generates documentation only:**
- Feature docs
- API docs
- Component docs
- Formatted for Confluence

**Time:** 20-30 min

---

### How Aura Frog Chooses Mode

**Claude automatically suggests appropriate mode:**

```
User: "Fix typo in button"
Claude: "This is a simple fix. Suggest using: bugfix:quick"

User: "Add user authentication system"
Claude: "This is complex. Suggest using: workflow:start for full TDD workflow"

User: "Refactor large component"
Claude: "Suggest using: refactor for focused refactoring workflow"
```

**You can override:**
```bash
# Force full workflow for simple task
workflow:start "Fix typo"

# Force quick mode for complex task (not recommended)
bugfix:quick "Add authentication"  # Will warn you!
```

---

## Logs & State Management

### Folder Structure (Auto-Created at Runtime)

```
<your-project>/                            # Your project root
└── .claude/logs/                          # Created when first workflow runs
    ├── workflows/                         # Execution logs
    │   └── [workflow-id]/
    │       ├── workflow-state.json
    │       └── execution.log
    └── contexts/                          # Deliverables
        └── [workflow-id]/
            ├── REQUIREMENTS.md
            ├── TECH_SPEC.md
            └── ...
```

**These folders:**
- ✅ Created automatically when needed
- ✅ Git-ignored (see `.gitignore`)
- ✅ Contain `.gitkeep` for structure
- ✅ Can be deleted anytime (will recreate)

**In git, you'll see:**
```
.claude/logs/
├── workflows/.gitkeep
└── contexts/.gitkeep
```

**At runtime, you'll see:**
```
.claude/logs/
├── workflows/
│   ├── .gitkeep
│   ├── bugfix-login-20251125-143022/
│   └── refactor-dashboard-20251125-150030/
└── contexts/
    ├── .gitkeep
    ├── bugfix-login-20251125-143022/
    └── refactor-dashboard-20251125-150030/
```

---

## Session Continuation: When You Actually Need It

### You DON'T Need handoff/resume For:

❌ Normal daily usage  
❌ Starting new tasks  
❌ Multiple small tasks  
❌ Different features  
❌ Bug fixes

**Just start fresh commands!**

### You DO Need handoff/resume When:

✅ **Long workflow hitting token limit (150K+ tokens)**
✅ **Switching devices mid-workflow**
✅ **Need to pause and continue later**
✅ **Want to continue SAME workflow in new session**

### How It Works

**Scenario: Long complex feature**
```
Session 1 (Morning):
→ workflow:start "Build payment system"
→ Phase 1-5 completed
→ Token count: 160K / 200K
→ workflow:handoff

Claude saves:
- Complete workflow state
- All deliverables
- Current phase: 5c
- Next steps: Phase 6 Code Review

Session 2 (Afternoon - New Cursor window):
→ workflow:resume workflow-payment-system-20251125
→ Claude loads state
→ "Resuming from Phase 5c..."
→ Continue to Phase 6-9
```

### Alternative: Don't Need handoff/resume

**For normal work:**
```
Morning:
→ bugfix "Login error"  # 30 min, 20K tokens
→ refactor "Dashboard"  # 1 hour, 40K tokens

Afternoon (New session):
→ document feature "User Auth"  # 30 min, 25K tokens
→ workflow:start "Add dark mode"  # Fresh start, no resume needed
```

**Claude automatically:**
- Loads project context
- Reads conventions
- Accesses previous deliverables from logs
- No explicit handoff/resume needed!

---

## Phase Grouping for Small Tasks

### For Simple Tasks, Phases Merge:

#### Example: Simple Bug Fix

**Full workflow (overkill):**
```
Phase 1: Requirements Analysis → Approval
Phase 2: Technical Planning → Approval
Phase 3: Design Review → Skip
Phase 4: Test Planning → Approval
Phase 5a: Write Tests → Approval
Phase 5b: Implement → Approval
Phase 5c: Refactor → Approval
Phase 6: Code Review → Approval
Phase 7: QA Validation → Approval
Phase 8: Documentation → Approval
Phase 9: Notification → Auto

Total: 9 approval gates! 😰
```

**Lightweight with `bugfix:quick`:**
```
Phases 1-2: Analyze + Plan → Auto-executed (10 min)
Phases 5-7: Test + Fix + Verify → 1 Approval (15 min)
Phase 8-9: Optional → Skip for trivial

Total: 1 approval gate! ✅
```

### Phase Grouping Rules

**Phases 1-4 (Planning):**
- Simple tasks: Can execute together
- Complex tasks: Individual approvals

**Phases 5-7 (Implementation):**
- Can merge: Write test → Implement → Verify
- Show results together in one approval

**Phases 8-9 (Documentation):**
- Optional for trivial changes
- Required for features/important fixes

---

## Quick Decision Tree

**Need to decide which command to use?**

```
                    What are you doing?
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    🐛 Bug?            🔧 Refactor?        ✨ Feature?
        │                   │                   │
        │                   │                   │
    How big?            How big?            How complex?
        │                   │                   │
    ┌───┴───┐           ┌───┴───┐          ┌───┴───┐
  Small   Big         Simple  Complex     Simple  Complex
    │       │           │        │           │        │
bugfix:   bugfix     refactor refactor   planning workflow:
quick                                              start


Other needs:
📝 Just docs? → document
📋 Just plan? → planning
🧪 Just tests? → test:unit / test:e2e
```

---

## Pro Tips

### 1. Start Small, Scale Up
```bash
# First, just plan
planning "Add feature X"

# Review plan, then execute
execute plan-feature-x-timestamp

# Or go full workflow if complex
workflow:start "Add feature X"
```

### 2. Use Lightweight for Iteration
```bash
# During development
bugfix:quick "Fix validation"
refactor "component"
test:unit "feature"

# When ready for review
workflow:start "Complete feature"  # Full quality workflow
```

### 3. Combine Commands
```bash
Morning:
- planning "Feature A"
- planning "Feature B"
- planning "Feature C"

Afternoon:
- Review all plans
- execute plan-feature-a-...  # Implement approved plan
```

### 4. Let Claude Help
```
User: "I need to fix a small CSS issue"
Claude: "Suggest bugfix:quick for this simple fix"

User: "I want to add a new payment gateway"
Claude: "Suggest workflow:start for complete implementation with full TDD"
```

---

## Summary

### Remember:

1. **Hooks are two types** - Runtime `.cjs` scripts (auto-executed) + conceptual `.md` instructions
2. **Two modes** - Full workflow (quality) vs Lightweight (speed)
3. **Logs auto-create** - No setup needed, git-ignored
4. **handoff/resume optional** - Only for long workflows near token limit
5. **Phase grouping** - Simple tasks merge phases for speed
6. **Claude helps** - Suggests appropriate mode automatically
7. **Only 2 approval gates** - Phase 2 (Design) and Phase 5b (Implementation)

### Quick Commands Reference:

| Need | Command | Time | Phases |
|------|---------|------|--------|
| Feature | `workflow:start` | 2-4h | 9 full |
| Simple bug | `bugfix:quick` | 30m | Grouped |
| Complex bug | `bugfix` | 2h | 9 adapted |
| Refactor | `refactor` | 1-2h | Focused |
| Just plan | `planning` | 30m | 1-4 only |
| Just docs | `document` | 30m | 8 only |
| Just tests | `test:unit` | 30m | Test only |

---

**You're ready to use Aura Frog efficiently! Choose the right tool for the job!**

