# Aura Frog Hooks System

**Purpose:** Configure Claude Code lifecycle hooks for Aura Frog workflows
**Version:** 1.9.0

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

## Active Hooks (15 Total)

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

### 7. UserPromptSubmit - Prompt Reminder (NEW in 1.4.0)
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

### 8. UserPromptSubmit - Auto-Learn (NEW in 1.11.0)
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

### 10. SubagentStart - Context Injection (NEW in 1.4.0)
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

### 11. Stop - Voice Notification
**When:** Claude stops for user approval

**Actions:**
- ✅ Play context-aware voiceover notification
- ✅ Alert user that approval is needed
- ✅ Uses macOS `say` command

**Script:** `hooks/stop-voice-notify.sh`

---

### 12. Notification - Critical Alert Voice
**When:** Critical notifications occur

**Actions:**
- ✅ Detect critical notifications (error, critical, failed)
- ✅ Play voice alert for urgent issues
- ✅ Uses `scripts/voice-notify.sh`

---

### 13. PostToolUse - Feedback Capture (NEW in 1.9.0)
**When:** User provides corrections or feedback

**Actions:**
- ✅ Detect user corrections (e.g., "no, that's wrong", "actually...")
- ✅ Capture approval/rejection reasons at gates
- ✅ Send feedback to Supabase for learning
- ✅ Enable learning-analyzer skill

**Script:** `hooks/feedback-capture.cjs`
**Requires:** `AF_LEARNING_ENABLED=true`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`

---

### 14. PostToolUse - Workflow Metrics (NEW in 1.9.0)
**When:** After workflow phase completion

**Actions:**
- ✅ Track workflow success/failure rates
- ✅ Measure token usage per phase
- ✅ Monitor agent performance
- ✅ Send metrics to Supabase

**Script:** `hooks/workflow-metrics.cjs`
**Requires:** `AF_METRICS_COLLECTION=true`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`

---

### 15. Learning System Library (NEW in 1.9.0)
**Location:** `hooks/lib/af-learning.cjs`

**Provides:**
- ✅ Supabase client initialization
- ✅ Feedback submission functions
- ✅ Metrics tracking functions
- ✅ Pattern analysis utilities

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
[Stop Hook] - Voice notification if approval needed
```

---

## Hook Summary Table

```toon
hooks[15]{event,name,purpose}:
  SessionStart,Environment Injection,Auto-detect project and inject env vars
  PreToolUse,Scout Block,Block scanning of node_modules/dist/vendor
  PreToolUse,Bash Safety,Block destructive system commands
  PreToolUse,Project Context,Remind to initialize project context
  PreToolUse,Secrets Protection,Warn about secrets in tracked files
  PostToolUse,Command Logging,Log bash commands for audit
  PostToolUse,Large File Warning,Warn about context consumption
  PostToolUse,Workflow Metrics,Send metrics to Supabase
  PostToolUse,Feedback Capture,Capture file edit corrections
  UserPromptSubmit,Prompt Reminder,TDD/security/approval reminders
  UserPromptSubmit,Auto-Learn,Auto-detect corrections in messages (NEW)
  SubagentStart,Context Injection,Auto-inject workflow context to subagents
  Stop,Voice Notification,Alert user for approval needed
  Notification,Critical Alert,Voice alert for errors/critical issues
  Library,af-learning.cjs,Learning system utilities
```

---

**Version:** 1.10.0
**Last Updated:** 2026-01-08
**Status:** Active hooks system (15 hooks)
