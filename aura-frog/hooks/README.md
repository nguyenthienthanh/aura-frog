# Aura Frog Hooks System

**Purpose:** Configure Claude Code lifecycle hooks for Aura Frog workflows
**Version:** 1.2.6

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

## 🎯 Active Hooks (10 Total)

### 1. PreToolUse - Bash Safety
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

### 2. PreToolUse - Project Context Reminder
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

### 3. PreToolUse - Secrets Protection
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

### 4. PostToolUse - Command Logging
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

### 5. PostToolUse - Large File Warning
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

### 6. UserPromptSubmit - JIRA Detection
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

### 7. UserPromptSubmit - Figma Detection
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

### 8. UserPromptSubmit - Confluence Detection
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

### 9. UserPromptSubmit - GitHub PR/Issue Detection
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

### 10. Stop - Voice Notification
**When:** Claude stops for user approval

**Actions:**
- ✅ Play context-aware voiceover notification
- ✅ Alert user that approval is needed
- ✅ Uses macOS `say` command

**Script:** `hooks/stop-voice-notify.sh`

---

### 11. Notification - Critical Alert Voice
**When:** Critical notifications occur

**Actions:**
- ✅ Detect critical notifications (error, critical, failed)
- ✅ Play voice alert for urgent issues
- ✅ Uses `scripts/voice-notify.sh`

---

## 🔧 Hook Types

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

## 📊 Hook Summary Table

```toon
hooks[11]{event,name,purpose}:
  PreToolUse,Bash Safety,Block destructive system commands
  PreToolUse,Project Context,Remind to initialize project context
  PreToolUse,Secrets Protection,Warn about secrets in tracked files
  PostToolUse,Command Logging,Log bash commands for audit
  PostToolUse,Large File Warning,Warn about context consumption
  UserPromptSubmit,JIRA Detection,Auto-detect ticket IDs
  UserPromptSubmit,Figma Detection,Auto-detect design URLs
  UserPromptSubmit,Confluence Detection,Auto-detect wiki URLs
  UserPromptSubmit,GitHub Detection,Auto-detect PR/Issue URLs
  Stop,Voice Notification,Alert user for approval needed
  Notification,Critical Alert,Voice alert for errors/critical issues
```

---

**Version:** 1.2.6
**Last Updated:** 2025-12-18
**Status:** Active hooks system (11 hooks)
