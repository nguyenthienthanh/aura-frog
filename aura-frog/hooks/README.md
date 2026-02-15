# Aura Frog Hooks System

**Purpose:** Configure Claude Code lifecycle hooks for Aura Frog workflows
**Version:** 1.19.0

---

## hooks.json Structure

Aura Frog uses Claude Code hooks to enhance workflow automation and safety.

### File Location
```
aura-frog/hooks/hooks.json
```

Referenced in plugin.json:
```json
{
  "hooks": "./hooks/hooks.json"
}
```

---

## Active Hooks (21 Total)

### 0. SessionStart - Environment Injection (NEW in 1.4.0)
**When:** Once per session (startup, resume, clear, compact)

**Actions:**
- ✅ Auto-detect project type (monorepo, library, single-repo)
- ✅ Auto-detect package manager (npm, pnpm, yarn, bun, composer, poetry, go, cargo)
- ✅ Auto-detect framework (Next.js, React, Vue, Laravel, Django, etc.)
- ✅ Resolve active/suggested plans from branch matching
- ✅ Inject 20+ environment variables for agents

**Injected Environment Variables:**
```toon
env_vars[16]{var,description}:
  AF_SESSION_ID,Current session identifier
  AF_PROJECT_TYPE,monorepo | library | single-repo
  AF_PACKAGE_MANAGER,npm | pnpm | yarn | bun | composer | etc.
  AF_FRAMEWORK,nextjs | react | vue | laravel | django | etc.
  AF_ACTIVE_PLAN,Explicitly active plan path
  AF_SUGGESTED_PLAN,Branch-matched plan path (hint only)
  AF_REPORTS_PATH,Where to save reports
  AF_PLANS_PATH,Plans directory
  AF_GIT_BRANCH,Current git branch
  AF_NODE_VERSION,Node.js version
  AF_PYTHON_VERSION,Python version (if available)
  AF_PHP_VERSION,PHP version (if available)
  AF_GO_VERSION,Go version (if available)
  AF_OS_PLATFORM,darwin | linux | win32
  AF_USER,Current username
  AF_TIMEZONE,System timezone
```

**Configuration:** `.claude/.af.json` (local) or `~/.claude/.af.json` (global)

**Example Output:**
```
🐸 Session startup. Type: single-repo | PM: pnpm | Framework: nextjs | Suggested: 241223-user-auth
```

**Script:** `hooks/session-start.cjs`
**Config Utils:** `hooks/lib/af-config-utils.cjs`

---

### 0b. SessionStart - Visual Testing Detection (NEW in 1.14.0)
**When:** Once per session (after environment injection)

**Actions:**
- ✅ Detect `.claude/visual/` folder in project
- ✅ Load visual testing configuration
- ✅ Set environment variables for visual testing
- ✅ Display visual testing status

**Injected Environment Variables:**
```toon
env_vars[4]{var,description}:
  AF_VISUAL_TESTING,true if visual testing configured
  AF_VISUAL_PATH,Path to .claude/visual folder
  AF_VISUAL_WEB_THRESHOLD,Web diff threshold (default 0.5%)
  AF_VISUAL_PDF_THRESHOLD,PDF diff threshold (default 1.0%)
```

**Example Output:**
```
🎨 Visual Testing: enabled | Thresholds: web 0.5% / pdf 1.0% | Specs: 5 | Baselines: 3
```

**Script:** `hooks/visual-pixel-init.cjs`

---

### 0c. SessionStart - Firebase Cleanup (NEW in 1.16.0)
**When:** Once per session (after environment injection)

**Actions:**
- ✅ Check if Firebase is configured (firebase.json, login, or ENV vars)
- ✅ Clean up auto-created firebase-debug.log if Firebase not configured
- ✅ Prevent cluttering project with unused debug logs
- ✅ Non-blocking - silent cleanup

**Example:**
```
🧹 Cleaned up unused firebase-debug.log (Firebase not configured)
```

**Script:** `hooks/firebase-cleanup.cjs`

---

### 0d. SessionStart - Workflow Edit Detection (NEW in 1.16.0)
**When:** Once per session (after environment injection)

**Actions:**
- ✅ Scan workflow MD files for user edits
- ✅ Detect changes made outside of Claude sessions
- ✅ Extract patterns from user modifications
- ✅ Record learnings automatically

**Monitored Paths:**
- `.claude/cache/workflow-state.json`
- `.claude/logs/workflows/*.md`
- `docs/workflow/*.md`
- Any `phase-*.md`, `plan.md`, `spec.md`, `requirements.md`

**What It Learns:**
- User preferences for formatting (headers, bullet points)
- Verbosity preferences (content added/removed)
- Documentation style preferences

**Example:**
```
🧠 Workflow Edit: Detected 2 pattern(s) from user edits to plan.md
```

**Script:** `hooks/workflow-edit-learn.cjs`

---

### 0e. SessionStart - Compact Resume (NEW in 1.16.0)
**When:** Once per session (after compact)

**Actions:**
- ✅ Check for saved handoff state from previous session
- ✅ Inject resume context if workflow was in progress
- ✅ Display workflow status and resume instructions
- ✅ Restore environment variables for continuity

**What It Restores:**
- Workflow ID and current phase
- Task description and agents
- Project context (name, framework, branch)
- Active plan reference

**Example Output:**
```
═══════════════════════════════════════════════════════════
🔄 SESSION RESUMED AFTER COMPACT
═══════════════════════════════════════════════════════════

📋 **Workflow:** AUTH-123
📝 **Task:** Implement user authentication with JWT
📍 **Phase:** 5a
🤖 **Agent:** backend-nodejs

📦 **Project:** my-api
🛠️ **Framework:** nextjs
🌿 **Branch:** feature/auth

───────────────────────────────────────────────────────────
📥 **To fully resume workflow:**
   workflow:resume AUTH-123

💡 Context has been restored. Type "continue" to proceed.
═══════════════════════════════════════════════════════════
```

**Script:** `hooks/compact-handoff.cjs --resume`

---

### 1. PreToolUse - Scout Block (NEW in 1.4.0)
**When:** Before Bash, Read, Write, Edit, Glob, or Grep tool execution

**Actions:**
- ✅ Block scanning of node_modules, dist, build, vendor, .git
- ✅ Prevent wasteful token usage from large directory scans
- ✅ Allow build commands (npm build, yarn build)
- ✅ Custom patterns via `.afignore` file

**Blocked Directories:**
- `node_modules` - NPM packages
- `dist`, `build` - Build outputs
- `vendor` - Vendor packages
- `.git` - Git internals
- `__pycache__` - Python cache
- `.next`, `.nuxt` - Framework caches
- `coverage` - Test coverage

**Example:**
```bash
User: cat node_modules/react/package.json
Hook: ⛔ Blocked: command accesses node_modules
```

**Customization:** Add patterns to `.afignore`:
```
# .afignore
.expo
android/build
ios/Pods
```

---

### 2. PreToolUse - Bash Safety
**When:** Before any Bash tool execution

**Actions:**
- ✅ Block destructive commands (`rm -rf /`, `mkfs`, `dd`, fork bombs, system shutdown)
- ✅ Prevent accidental system damage
- ✅ Show warning message

**Blocked Patterns:**
- `rm -rf /` - Recursive delete from root
- `mkfs` - Format filesystem
- `dd if=` - Low-level disk operations
- `:(){` - Fork bomb
- `shutdown`, `reboot`, `halt` - System control

**Example:**
```bash
User: rm -rf / --no-preserve-root
Hook: ⚠️ Blocked: Potentially destructive command detected
```

---

### 3. PreToolUse - Project Context Reminder
**When:** Before Write or Edit tool execution

**Actions:**
- ✅ Check if project context exists (`.claude/project-contexts/*/project-config.yaml`)
- ✅ Remind user to run `project:init` if missing
- ✅ Helps prevent generating code without conventions

**Example:**
```
💡 Reminder: Run project:init to create project context before generating code
```

---

### 4. PreToolUse - Secrets Protection
**When:** Before Write or Edit to sensitive files

**Actions:**
- ✅ Detect files that may contain secrets (.env, credentials, tokens, api-keys)
- ✅ Check if file is tracked by git
- ✅ Warn user to add to .gitignore

**Example:**
```
🔒 Warning: This file may contain secrets and is tracked by git. Consider adding to .gitignore
```

---

### 5. PostToolUse - Command Logging
**When:** After any Bash command completes

**Actions:**
- ✅ Log command execution to `.claude/logs/workflows/commands.log`
- ✅ Include timestamp and command
- ✅ Useful for workflow tracking and debugging

**Log Format:**
```
[2025-11-27 14:30:45] Bash: npm test
[2025-11-27 14:31:02] Bash: git status
```

---

### 6. PostToolUse - Large File Warning
**When:** After Read tool completes

**Actions:**
- ✅ Detect files over 500 lines
- ✅ Warn about context consumption
- ✅ Suggest response-analyzer skill for chunked reading

**Example:**
```
📄 Large file (1234 lines). Consider using response-analyzer skill for chunked reading.
```

---

### 7. PostToolUse - Lint Auto-Fix (NEW in 1.11.1)
**When:** After Write or Edit tool completes

**Actions:**
- ✅ Detect file type and available linters
- ✅ Auto-run appropriate linter with --fix flag
- ✅ Non-blocking - reports results but doesn't fail

**Supported Linters:**
| Language | Linters |
|----------|---------|
| JS/TS/Vue | ESLint, Prettier |
| CSS/SCSS | Prettier, Stylelint |
| PHP | PHP CS Fixer, Laravel Pint |
| Python | Ruff, Black |
| Go | gofmt, goimports |
| Ruby | Rubocop |
| Rust | rustfmt |
| Dart | dart format |

**Example:**
```
User edits: src/components/Button.tsx
Hook: 🔧 Auto-fixed: eslint, prettier
```

**Disable:** Set `AF_LINT_AUTOFIX=false` in environment

**Script:** `hooks/lint-autofix.cjs`

---

### 7b. PostToolUse - Smart Learn (NEW in 1.16.0)
**When:** After Write, Edit, or Bash tool completes successfully

**Actions:**
- ✅ Track successful code patterns (arrow functions, const usage, async/await)
- ✅ Detect file modification patterns by extension
- ✅ Learn from successful bash commands
- ✅ Auto-create patterns after 3+ successful operations

**What It Learns (automatically, no user feedback needed):**
- Code style patterns (arrow functions, prefer const, explicit types)
- Framework patterns (React hooks, async/await)
- Successful command patterns

**Pattern Detection:**
| Language | Patterns Detected |
|----------|-------------------|
| TypeScript/JS | arrow_functions, prefer_const, async_await, explicit_types, react_hooks, error_handling |
| Python | python_type_hints, python_async |
| Bash | Command patterns, pipe usage, chaining |

**Example:**
```
🧠 Smart Learn: Pattern detected! "prefer_const" in .ts files
🧠 Smart Learn: Bash pattern! "npm" is frequently used
```

**Local Files:**
- `.claude/cache/smart-learn-cache.json` - Success tracking cache

**Script:** `hooks/smart-learn.cjs`

---

### 8. UserPromptSubmit - Prompt Reminder
**When:** Every user prompt submission

**Actions:**
- ✅ Inject TDD reminder for code-related tasks
- ✅ Show approval gate reminder for relevant phases
- ✅ Security reminder for sensitive operations (auth, password, token)

**Example:**
```
💡 🧪 TDD: Write tests first | 🔒 Security: Review before commit
```

**Script:** `hooks/prompt-reminder.cjs`

---

### 9. UserPromptSubmit - Auto-Learn (NEW in 1.11.0)
**When:** Every user prompt submission

**Actions:**
- ✅ Detect correction patterns in user messages (e.g., "no", "wrong", "actually", "don't do that")
- ✅ Detect approval patterns (e.g., "good", "great", "perfect")
- ✅ Categorize feedback (code_style, testing, security, etc.)
- ✅ **Deduplication** - Skips identical feedback within 24 hours
- ✅ **Pattern detection** - Auto-creates learned patterns after 3+ similar corrections
- ✅ **Local cache** - Saves to `.claude/cache/learned-patterns.md` + Supabase
- ✅ Non-blocking - never interrupts user flow

**Detection Patterns:**
- Direct negations: "no", "nope", "wrong", "incorrect"
- Corrections: "actually", "should be", "shouldn't", "instead of"
- Modifications: "change that", "fix that", "don't do that", "remove that"
- Preferences: "I prefer", "always use", "never use", "don't add"
- Approvals: "good job", "great", "perfect", "looks good"

**Example:**
```
User: "Don't add comments everywhere, only when needed"
Hook: 🧠 Learning: Captured correction [code_style:minimal_comments] (1x)

# After 3 similar corrections about comments:
Hook: 🧠 Learning: Pattern detected! "code_style:minimal_comments" (3 occurrences)
→ Auto-creates learned pattern in Supabase + local cache
```

**Local Files:**
- `.claude/cache/auto-learn-cache.json` - Deduplication cache (24h window)
- `.claude/cache/learned-patterns.md` - Human-readable patterns file

**Script:** `hooks/auto-learn.cjs` (v2.0.0)
**Requires:** `AF_LEARNING_ENABLED=true`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`

---

### 10. SubagentStart - Context Injection
**When:** Any subagent starts

**Actions:**
- ✅ Inject current workflow phase
- ✅ Inject active plan path
- ✅ Show pending approvals
- ✅ Pass project context to subagents

**Example:**
```
--- Aura Frog Context ---
📍 Phase: 5b
📋 Plan: plans/241223-user-profile
📦 Project: my-app
🤖 Agents: backend-nodejs, qa-automation
-------------------------
```

**Script:** `hooks/subagent-init.cjs`
**Session State:** `hooks/lib/session-state.cjs`

---

### 10b. TeammateIdle - Idle Teammate Handler (NEW in 1.19.0)
**When:** A teammate has no remaining tasks (Agent Teams mode only)

**Actions:**
- ✅ Check for unclaimed tasks matching teammate's specialization
- ✅ Assign cross-review work from completed phases
- ✅ Check pending quality gates needing validation
- ✅ Exit 2 = keep alive (assign work), Exit 0 = let exit

**Agent Teams Required:** Only fires when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

**Script:** `hooks/teammate-idle.cjs`

---

### 10c. TaskCompleted - Task Completion Validator (NEW in 1.19.0)
**When:** A teammate marks a task as done (Agent Teams mode only)

**Actions:**
- ✅ Validate TDD phase test references
- ✅ Check approval gate status
- ✅ Exit 2 = reject (needs revision), Exit 0 = accept

**Agent Teams Required:** Only fires when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

**Script:** `hooks/task-completed.cjs`

---

### 11. Stop - Compact Handoff Save (NEW in 1.16.0)
**When:** Session stops (including before compact)

**Actions:**
- ✅ Auto-save current workflow state
- ✅ Capture session context (project, agent, phase)
- ✅ Save to handoff file for resume after compact
- ✅ Non-blocking - runs silently in background

**Files Saved:**
- `.claude/cache/compact-handoff.json` - Quick resume state
- `.claude/logs/workflows/[id]/workflow-state.json` - Full workflow state (if workflow active)

**Example:**
```
💾 Workflow state saved for compact handoff
```

**Script:** `hooks/compact-handoff.cjs`

---

### 11b. PreCompact - Pre-Compact State Save (NEW in 1.19.0)
**When:** Before Claude auto-compacts context

**Actions:**
- Saves workflow state and transcript summary before context compaction
- Captures current phase, task, and agent information
- Ensures continuity across compact boundaries
- Complements the Stop hook and SessionStart Compact Resume hook

**Files Saved:**
- `.claude/cache/compact-handoff.json` - Pre-compact state snapshot
- `.claude/logs/workflows/[id]/workflow-state.json` - Full workflow state (if workflow active)

**Example:**
```
Pre-compact: Workflow state saved for compact handoff
```

**Script:** `hooks/compact-handoff.cjs --pre-compact`

---

### 12. PostToolUse - Feedback Capture
**When:** User provides corrections or feedback

**Actions:**
- ✅ Detect user corrections (e.g., "no, that's wrong", "actually...")
- ✅ Capture approval/rejection reasons at gates
- ✅ Send feedback to Supabase for learning
- ✅ Enable learning-analyzer skill

**Script:** `hooks/feedback-capture.cjs`
**Requires:** `AF_LEARNING_ENABLED=true`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`

---

### 14. Learning System Library (Updated in 1.16.0)
**Location:** `hooks/lib/af-learning.cjs`

**Provides:**
- ✅ **Dual-mode storage** - Supabase OR local files
- ✅ Local storage fallback when Supabase not configured
- ✅ Feedback submission functions
- ✅ Metrics tracking functions
- ✅ Pattern analysis utilities
- ✅ Auto-generated learned-rules.md file

**Storage Modes:**
| Mode | When Used | Location |
|------|-----------|----------|
| **Local** | No Supabase config | `.claude/learning/*.json` + `.claude/learning/learned-rules.md` |
| **Supabase** | SUPABASE_URL + SUPABASE_SECRET_KEY set | Cloud (cross-session, cross-machine) |

**Local Files Generated:**
- `.claude/learning/feedback.json` - All feedback entries
- `.claude/learning/patterns.json` - Learned patterns
- `.claude/learning/metrics.json` - Workflow metrics
- `.claude/learning/learned-rules.md` - Human-readable rules (**linked to main instructions**)
- `.claude/LEARNED_PATTERNS.md` - Reference link for Claude

**Key Functions:**
```javascript
isLearningEnabled()      // Returns true if learning available (local or Supabase)
isLocalMode()            // Returns true if using local storage
recordFeedback(feedback) // Store feedback (auto-routes to local or Supabase)
recordPattern(pattern)   // Store learned pattern
updateLearnedRulesMD()   // Regenerate the learned-rules.md file
```

---

## Hook Types

### Type: "command"
Executes bash command, uses exit code:
- **Exit 0:** Continue normally
- **Exit 1:** Warning (show stderr, continue)
- **Exit 2:** Block operation (show stderr, stop)

---

## 🎯 Benefits

**Safety:**
- ✅ Blocks destructive commands
- ✅ Prevents system damage
- ✅ Validates operations before execution

**Workflow Enhancement:**
- ✅ Auto-detects JIRA tickets and Figma links
- ✅ Reminds about project context
- ✅ Command logging for debugging

**User Experience:**
- ✅ Guided workflow (reminders at right time)
- ✅ Proactive suggestions
- ✅ Safety without interruption

---

## 📚 Environment Variables Available in Hooks

Claude Code provides these environment variables to hooks:

- `$CLAUDE_TOOL_INPUT` - Input to the tool being called
- `$CLAUDE_TOOL_OUTPUT` - Output from completed tool (PostToolUse only)
- `$CLAUDE_USER_INPUT` - User's prompt text (UserPromptSubmit only)
- `$CLAUDE_FILE_PATHS` - File paths affected by tool (if applicable)
- `$CLAUDE_NOTIFICATION` - Notification content (Notification only)

---

## 🔄 Hook Execution Flow

```
Session Start (startup/resume/clear/compact)
  ↓
[SessionStart Hook] - Auto-detect project, inject env vars
  ↓
User Input
  ↓
[UserPromptSubmit Hook] - Detect JIRA/Figma
  ↓
Claude Decides to Use Tool (e.g., Bash, Write, Edit)
  ↓
[PreToolUse Hook] - Safety checks, reminders
  ↓
Tool Execution
  ↓
[PostToolUse Hook] - Logging, warnings
  ↓
Response to User
  ↓
[PreCompact Hook] - Save workflow state before auto-compact
  ↓
[Stop Hook] - Save state + session metrics
```

---

## Hook Summary Table

```toon
hooks[21]{event,name,purpose}:
  SessionStart,Environment Injection,Auto-detect project and inject env vars
  SessionStart,Visual Testing Init,Detect and configure visual testing
  SessionStart,Firebase Cleanup,Clean up firebase-debug.log if not configured
  SessionStart,Workflow Edit Detection,Detect user edits to workflow files
  SessionStart,Compact Resume,Restore workflow context after compact
  PreToolUse,Scout Block,Block scanning of node_modules/dist/vendor
  PreToolUse,Bash Safety,Block destructive system commands
  PreToolUse,Project Context,Remind to initialize project context
  PreToolUse,Secrets Protection,Warn about secrets in tracked files
  PostToolUse,Command Logging,Log bash commands for audit
  PostToolUse,Large File Warning,Warn about context consumption
  PostToolUse,Lint Auto-Fix,Auto-run linters after file changes
  PostToolUse,Feedback Capture,Capture file edit corrections
  PostToolUse,Smart Learn,Auto-learn from successful operations
  UserPromptSubmit,Prompt Reminder,TDD/security/approval reminders
  UserPromptSubmit,Auto-Learn,Auto-detect corrections in messages
  SubagentStart,Context Injection,Auto-inject workflow context to subagents
  TeammateIdle,Idle Teammate Handler,Assign work to idle teammates (Agent Teams)
  TaskCompleted,Task Completion Validator,Validate teammate task completion (Agent Teams)
  Stop,Compact Handoff + Metrics,Auto-save workflow state + session metrics
  PreCompact,Pre-Compact State Save,Save workflow state before auto-compact
```

---

**Version:** 1.19.0
**Last Updated:** 2026-02-09
**Status:** Active hooks system (21 hooks)
