# Aura Frog Hooks System

**Purpose:** Configure Claude Code lifecycle hooks for Aura Frog workflows
**Version:** 1.2.5

---

## 📋 hooks.json Structure

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

## 🎯 Active Hooks (15 Total)

### 1. SessionStart - Welcome Message
**When:** Every time Claude Code session begins

**Actions:**
- ✅ Display Aura Frog welcome message
- ✅ Show available commands
- ✅ List active Skills (26+ auto-invoking capabilities)
- ✅ Guide user on natural language usage

**Output Example:**
```
🐸 Aura Frog v1.2.1 is active - A Claude Code Plugin

Available Commands:
- workflow:start <task> - Start 9-phase TDD workflow
- bugfix:quick <description> - Quick bug fix
- project:init - Initialize project context
- agent:list - Show all available agents

Skills System: 26+ auto-invoking skills active
Type any command or use natural language - Skills will auto-activate based on your intent.
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

### 5. PreToolUse - SAST Security Check
**When:** Before Write or Edit tool execution

**Actions:**
- ✅ Detect common security anti-patterns (eval, innerHTML, exec, hardcoded passwords)
- ✅ Reference OWASP guidelines
- ✅ Point to rules/sast-security-scanning.md

**Detected Patterns:**
- `eval()` - Code injection risk
- `innerHTML =` - XSS vulnerability
- `dangerouslySetInnerHTML` - React XSS risk
- `exec()` - Command injection
- Hardcoded passwords/API keys

**Example:**
```
🔐 Security: Potential security concern detected. Review OWASP guidelines in rules/sast-security-scanning.md
```

---

### 6. PostToolUse - Command Logging
**When:** After any Bash command completes

**Actions:**
- ✅ Log command execution to `.claude/logs/workflows/commands.log`
- ✅ Include timestamp and command
- ✅ Useful for workflow tracking and debugging

**Log Format:**
```
[2025-11-27 14:30:45] Bash: npm test
[2025-11-27 14:31:02] Bash: git status
[2025-11-27 14:31:15] Bash: workflow:start "Add user profile"
```

---

### 7. PostToolUse - Large File Warning
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

### 8. UserPromptSubmit - JIRA Detection
**When:** User submits a prompt

**Actions:**
- ✅ Detect JIRA ticket IDs (e.g., `PROJ-1234`, `IGNT-5678`)
- ✅ Notify that jira-integration skill may auto-activate
- ✅ Pattern: `[A-Z]{2,10}-[0-9]+`

**Example:**
```
User: "Implement PROJ-1234"
Hook: 🎫 JIRA ticket detected - jira-integration skill may auto-activate
```

---

### 9. UserPromptSubmit - Figma Detection
**When:** User submits a prompt

**Actions:**
- ✅ Detect Figma URLs (`figma.com/file/...`)
- ✅ Notify that figma-integration skill may auto-activate
- ✅ Enables automatic design extraction

**Example:**
```
User: "Build this design https://figma.com/file/ABC123/Design"
Hook: 🎨 Figma link detected - figma-integration skill may auto-activate
```

---

### 10. UserPromptSubmit - Confluence Detection
**When:** User submits a prompt

**Actions:**
- ✅ Detect Confluence URLs (`atlassian.net/wiki`, `confluence`)
- ✅ Notify that confluence-integration skill may auto-activate
- ✅ Enables automatic documentation fetching

**Example:**
```
User: "Check the docs at https://mycompany.atlassian.net/wiki/spaces/DEV/pages/123"
Hook: 📚 Confluence link detected - confluence-integration skill may auto-activate
```

---

### 11. UserPromptSubmit - GitHub PR/Issue Detection
**When:** User submits a prompt

**Actions:**
- ✅ Detect GitHub PR URLs (`github.com/.*/pull/[0-9]+`)
- ✅ Detect GitHub Issue URLs (`github.com/.*/issues/[0-9]+`)
- ✅ Notify user of detected link

**Example:**
```
User: "Review https://github.com/user/repo/pull/123"
Hook: 🔗 GitHub PR/Issue detected
```

---

### 12. SessionEnd - Workflow Handoff Reminder
**When:** Session ends

**Actions:**
- ✅ Check if active workflow exists (`.claude/logs/workflows/active-workflow.json`)
- ✅ Remind user to save state with `workflow:handoff`
- ✅ Prevents workflow loss between sessions

**Example:**
```
💾 Active workflow detected. Use workflow:handoff to save state for next session.
```

---

### 13. SessionEnd - Uncommitted Changes Reminder
**When:** Session ends

**Actions:**
- ✅ Check for staged uncommitted changes
- ✅ Remind user to commit before ending
- ✅ Prevents work loss

**Example:**
```
📝 You have uncommitted staged changes. Consider committing before ending session.
```

---

### 14. Stop - Voice Notification
**When:** Claude stops for user approval

**Actions:**
- ✅ Play context-aware voiceover notification
- ✅ Alert user that approval is needed
- ✅ Uses macOS `say` command

**Script:** `hooks/stop-voice-notify.sh`

---

### 15. Notification - Critical Alert Voice
**When:** Critical notifications occur

**Actions:**
- ✅ Detect critical notifications (error, critical, failed)
- ✅ Play voice alert for urgent issues
- ✅ Uses `scripts/voice-notify.sh`

**Example:**
```
Alert: Please check the notification
```

---

## 🔧 Hook Types

### Type: "command"
Executes bash command, uses exit code:
- **Exit 0:** Continue normally
- **Exit 1:** Warning (show stderr, continue)
- **Exit 2:** Block operation (show stderr, stop)

### Type: "prompt"
Returns text to inject into conversation context

---

## 🎯 Benefits

**Safety:**
- ✅ Blocks destructive commands
- ✅ Prevents system damage
- ✅ Validates operations before execution

**Workflow Enhancement:**
- ✅ Auto-detects JIRA tickets and Figma links
- ✅ Reminds about project context
- ✅ Suggests workflow handoff

**Visibility:**
- ✅ Welcome message shows active system
- ✅ Command logging for debugging
- ✅ Skill activation notifications

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

---

## 🔄 Hook Execution Flow

```
Session Start
  ↓
[SessionStart Hook] - Show Aura Frog welcome
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
[PostToolUse Hook] - Logging, formatting
  ↓
Response to User
  ↓
(repeat)
  ↓
Session End
  ↓
[SessionEnd Hook] - Workflow handoff reminder
```

---

## 🚫 What Hooks DON'T Do

**Hooks are NOT:**
- ❌ Auto-invoked capabilities (that's Skills)
- ❌ Instruction injection (that's CLAUDE.md)
- ❌ Context loaders (that's project-context-loader skill)

**Hooks ARE:**
- ✅ Lifecycle events (session start/end, tool use)
- ✅ Safety guards (block dangerous commands)
- ✅ Workflow helpers (reminders, logging)

---

## 📖 Related Documentation

- **Skills System:** `skills/README.md` - Auto-invoking capabilities
- **CLAUDE.md:** Main instruction file (always loaded)
- **Project Context:** `.claude/project-contexts/` - Project-specific conventions
- **Claude Code Hooks:** Official docs for hook system

---

## 🔧 Customization

To modify hooks:

1. Edit `hooks/hooks.json`
2. Test with Claude Code session
3. Verify hook execution (check stderr for notifications)
4. Commit changes

**Note:** Hooks are part of plugin, applied globally to all projects using Aura Frog.

---

## 📊 Hook Summary Table

```toon
hooks[15]{event,name,purpose}:
  SessionStart,Welcome Message,Display plugin status and commands
  PreToolUse,Bash Safety,Block destructive system commands
  PreToolUse,Project Context,Remind to initialize project context
  PreToolUse,Secrets Protection,Warn about secrets in tracked files
  PreToolUse,SAST Security,Detect security anti-patterns
  PostToolUse,Command Logging,Log bash commands for audit
  PostToolUse,Large File Warning,Warn about context consumption
  UserPromptSubmit,JIRA Detection,Auto-detect ticket IDs
  UserPromptSubmit,Figma Detection,Auto-detect design URLs
  UserPromptSubmit,Confluence Detection,Auto-detect wiki URLs
  UserPromptSubmit,GitHub Detection,Auto-detect PR/Issue URLs
  SessionEnd,Workflow Handoff,Remind to save active workflow
  SessionEnd,Uncommitted Changes,Remind to commit staged changes
  Stop,Voice Notification,Alert user for approval needed
  Notification,Critical Alert,Voice alert for errors/critical issues
```

---

**Version:** 1.2.5
**Last Updated:** 2025-12-15
**Status:** Active hooks system (15 hooks)
