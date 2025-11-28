# CCPM Hooks System

**Purpose:** Configure Claude Code lifecycle hooks for CCPM workflows

---

## 📋 hooks.json Structure

CCPM uses Claude Code hooks to enhance workflow automation and safety.

### File Location
```
ccpm/hooks/hooks.json
```

Referenced in plugin.json:
```json
{
  "hooks": "./hooks/hooks.json"
}
```

---

## 🎯 Active Hooks

### 1. SessionStart
**When:** Every time Claude Code session begins

**Actions:**
- ✅ Display CCPM welcome message
- ✅ Show available commands
- ✅ List active Skills (8 auto-invoking capabilities)
- ✅ Guide user on natural language usage

**Output Example:**
```
🚀 CCPM Team Agents System v5.2.0 is active.

Available Commands:
- workflow:start <task> - Start 9-phase TDD workflow
- bugfix:quick <description> - Quick bug fix
- project:init - Initialize project context
- agent:list - Show all available agents

Skills System: 8 auto-invoking skills active
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
[2025-11-27 14:31:15] Bash: workflow:start "Add user profile"
```

---

### 5. UserPromptSubmit - JIRA Detection
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

### 6. UserPromptSubmit - Figma Detection
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

### 7. SessionEnd - Workflow Handoff Reminder
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
[SessionStart Hook] - Show CCPM welcome
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

**Note:** Hooks are part of plugin, applied globally to all projects using CCPM.

---

**Version:** 5.2.0
**Last Updated:** 2025-11-27
**Status:** Active hooks system
