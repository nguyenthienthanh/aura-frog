# On-Start Hook - Workflow Initialization Check

**Purpose:** Check project setup before workflow starts
**Trigger:** Automatically run when `workflow:start` or any workflow command is executed

---

## 🎯 Purpose

Ensure the project is properly initialized with Aura Frog before executing workflows. Remind users to run `project:init` if setup is incomplete.

**⚠️ Note:** This hook is different from the **Session Start Protocol** in `CLAUDE.md`:

| Hook | When | What | Blocking |
|------|------|------|----------|
| **Session Start Protocol** | New conversation starts | Welcome message, suggest `project:init` | No - informational only |
| **On-Start Hook (this file)** | User runs workflow command | Validate setup, offer to continue or cancel | Yes - user must choose |

**Session Start Protocol** = Gentle reminder at session start
**On-Start Hook** = Strict validation before workflow execution

---

## 🔄 Execution Flow

```
User: workflow:start "Task"
      ↓
[ON-START HOOK] ← YOU ARE HERE
      ↓
Phase 1: Understand
```

---

## ✅ On-Start Checklist

### 1. Check Project Context

**Verify project context exists:**

```bash
# Check if .claude/ folder and project context exists
if [ ! -d ".claude/project-contexts" ] || [ -z "$(ls -A .claude/project-contexts 2>/dev/null)" ]; then
  echo "⚠️  No project context found"
  MISSING_PROJECT_CONTEXT=true
else
  echo "✅ Project context exists"
  MISSING_PROJECT_CONTEXT=false
fi
```

### 2. Check Aura Frog Configuration

**Verify ccpm-config.yaml exists (project-level or plugin-level):**

```bash
# Check project-level config first, then plugin config
if [ -f ".claude/ccpm-config.yaml" ]; then
  echo "✅ Aura Frog config exists (project-level)"
  MISSING_CONFIG=false
elif [ -f "$PLUGIN_DIR/ccpm-config.yaml" ]; then
  echo "✅ Aura Frog config exists (plugin-level)"
  MISSING_CONFIG=false
else
  echo "⚠️  No ccpm-config.yaml found"
  MISSING_CONFIG=true
fi
```

### 3. Check Settings

**Verify settings.local.json exists in .claude/:**

```bash
if [ ! -f ".claude/settings.local.json" ]; then
  echo "⚠️  No .claude/settings.local.json found"
  MISSING_SETTINGS=true
else
  echo "✅ Settings configured"
  MISSING_SETTINGS=false
fi
```

### 4. Check Environment Configuration

**Verify project .envrc exists:**

```bash
# Check in user's project directory (not plugin root)
if [ ! -f ".envrc" ]; then
  echo "⚠️  No .envrc found in project"
  MISSING_ENVRC=true
else
  echo "✅ Environment configuration exists"
  MISSING_ENVRC=false
fi
```

### 5. Display Reminder if Needed

**If any checks failed, show reminder:**

```bash
if [ "$MISSING_PROJECT_CONTEXT" = true ] || [ "$MISSING_CONFIG" = true ] || [ "$MISSING_SETTINGS" = true ] || [ "$MISSING_ENVRC" = true ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "⚠️ Aura Frog Setup Incomplete"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "🔧 Missing components detected:"
  echo ""

  if [ "$MISSING_PROJECT_CONTEXT" = true ]; then
    echo "   ❌ Project context (.claude/project-contexts/)"
  fi

  if [ "$MISSING_CONFIG" = true ]; then
    echo "   ❌ Aura Frog configuration (ccpm-config.yaml)"
  fi

  if [ "$MISSING_SETTINGS" = true ]; then
    echo "   ❌ Settings file (.claude/settings.local.json)"
  fi

  if [ "$MISSING_ENVRC" = true ]; then
    echo "   ❌ Environment config (.envrc in your project root)"
  fi

  echo ""
  echo "📚 To complete setup, run:"
  echo ""
  echo "   project:init"
  echo ""
  echo "This will:"
  echo "   • Create .claude/ folder in your project"
  echo "   • Analyze your project structure"
  echo "   • Generate project-specific configuration"
  echo "   • Create .claude/settings.local.json from template"
  echo "   • Set up .envrc in your project root"
  echo "   • Prepare Aura Frog for your tech stack"
  echo ""
  echo "After running project:init:"
  echo "   • Edit .envrc in your project root to add integration tokens"
  echo "   • Run 'direnv allow' to enable environment variables"
  echo "   • Customize .claude/settings.local.json if needed"
  echo "   • Review .claude/CLAUDE.md for project guide"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Continue workflow anyway? (y/n)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Wait for user input
  read -p "Your choice: " choice

  if [ "$choice" != "y" ] && [ "$choice" != "Y" ] && [ "$choice" != "yes" ]; then
    echo ""
    echo "❌ Workflow cancelled. Please run: project:init"
    exit 1
  fi

  echo ""
  echo "⚠️  Continuing with default Aura Frog configuration..."
  echo ""
fi
```

---

## 📝 What This Hook Does

### Checks Performed

1. **Project Context Check**
   - Looks for `.claude/project-contexts/` directory
   - Ensures at least one project is configured
   - Indicates if project-specific settings are available

2. **Configuration Check**
   - Verifies `ccpm-config.yaml` exists
   - Ensures workflow settings are defined
   - Confirms agent configuration is present

3. **Settings Check**
   - Checks for `.claude/settings.local.json`
   - Ensures Claude Code permissions are configured
   - Validates personal preferences are set

4. **Environment Check**
   - Looks for `.envrc` in user's project directory
   - Verifies integration configuration exists
   - Confirms environment variables are set up

### User Experience

**If setup is complete:**
```
✅ Project context exists
✅ Aura Frog config exists
✅ Settings configured
✅ Environment configuration exists

[Workflow proceeds normally]
```

**If setup is incomplete:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Aura Frog Setup Incomplete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 Missing components detected:

   ❌ Project context (.claude/project-contexts/)
   ❌ Aura Frog configuration (ccpm-config.yaml in plugin)
   ❌ Settings file (.claude/settings.local.json)
   ❌ Environment config (.envrc in your project root)

📚 To complete setup, run:

   project:init

This will:
   • Create .claude/ folder in your project
   • Analyze your project structure
   • Generate project-specific configuration
   • Create .claude/settings.local.json from template
   • Set up .envrc in your project root
   • Prepare Aura Frog for your tech stack

After running project:init:
   • Edit .envrc in your project root to add integration tokens
   • Run 'direnv allow' to enable environment variables
   • Customize .claude/settings.local.json if needed
   • Review .claude/CLAUDE.md (loader file that reads plugin CLAUDE.md)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Continue workflow anyway? (y/n)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your choice: _
```

---

## 🎯 Benefits

1. **Proactive Guidance**
   - Users discover `project:init` naturally
   - Clear instructions on what to do
   - Explains why setup is needed

2. **Flexible**
   - Allows continuing without setup (uses defaults)
   - Doesn't block workflows completely
   - Provides informed choice to user

3. **Educational**
   - Shows what files are expected
   - Explains what each component does
   - Guides post-init configuration

4. **Non-Intrusive**
   - Only shows once per session (or until setup complete)
   - Quick to dismiss if intentionally skipping
   - Clear actionable steps

---

## 🔧 Implementation Notes

### Hook Activation

This hook is triggered by:
- `workflow:start`
- `workflow:phase:*` commands
- Any command that begins a workflow

### State Management

The hook should:
- Check only once per workflow session
- Not re-check if already validated
- Clear validation on workflow completion

### Error Handling

- Non-blocking: Allow workflow to continue even if setup incomplete
- User choice: Respect user decision to proceed or cancel
- Defaults: Use Aura Frog defaults if project-specific config missing

### Files Checked

1. **Plugin Root Files (~/. claude/plugins/.../aura-frog/):**
   - `ccpm-config.yaml` - Aura Frog configuration

2. **Project Root Files (user's project):**
   - `.claude/` - Project Aura Frog data folder
   - `.claude/project-contexts/[project]/` - Project context
   - `.claude/settings.local.json` - Claude Code settings
   - `.envrc` - Project environment variables

---

## 🚀 Quick Reference

**For Claude Code AI:**

When executing a workflow:
1. Run this hook before Phase 1
2. Check all required files
3. If missing, display reminder
4. Wait for user input
5. Continue or exit based on choice

**For Users:**

If you see the reminder:
1. Exit the workflow (n)
2. Run `project:init`
3. Follow the setup instructions
4. Try your workflow again

---

**Created:** 2025-11-27
**Last Updated:** 2025-11-27
