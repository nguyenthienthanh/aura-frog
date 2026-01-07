# Command: setup:activate

**Category:** Setup
**Priority:** High
**Syntax:** `setup:activate`

---

## Description

Quick activation command to enable Aura Frog in any project. Creates the minimal `.claude/CLAUDE.md` file needed for Aura Frog to work.

**Use this when:**
- You installed Aura Frog plugin but it's not activating
- You want to quickly enable Aura Frog without full `project:init`
- You see vanilla "Claude Code" responses instead of Aura Frog banners

**Difference from other commands:**
- `setup:activate` - Minimal activation (just CLAUDE.md)
- `project:init` - Full initialization (context, config, everything)
- `project:regen` - Re-generate existing project context

---

## When to Use

- Plugin installed but responses don't show Aura Frog banner
- Quick activation without full project setup
- Testing Aura Frog in a new project
- After fresh plugin installation

---

## Execution Steps

### 1. Detect Project Info

**Auto-detect from project:**
```bash
PROJECT_ROOT=$(pwd)
PROJECT_NAME=$(basename "$PROJECT_ROOT" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Try to get better name from package.json
if [ -f "$PROJECT_ROOT/package.json" ]; then
  PKG_NAME=$(grep -o '"name": "[^"]*"' "$PROJECT_ROOT/package.json" | cut -d'"' -f4)
  if [ -n "$PKG_NAME" ]; then
    PROJECT_NAME=$(echo "$PKG_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  fi
fi

# Detect tech stack
if [ -f "$PROJECT_ROOT/package.json" ]; then
  if grep -q "react-native" "$PROJECT_ROOT/package.json"; then
    TECH_STACK="React Native"
    PRIMARY_AGENT="mobile-react-native"
  elif grep -q "\"next\"" "$PROJECT_ROOT/package.json"; then
    TECH_STACK="Next.js"
    PRIMARY_AGENT="web-nextjs"
  elif grep -q "\"vue\"" "$PROJECT_ROOT/package.json"; then
    TECH_STACK="Vue.js"
    PRIMARY_AGENT="web-vuejs"
  elif grep -q "\"react\"" "$PROJECT_ROOT/package.json"; then
    TECH_STACK="React"
    PRIMARY_AGENT="web-reactjs"
  elif grep -q "\"angular\"" "$PROJECT_ROOT/package.json"; then
    TECH_STACK="Angular"
    PRIMARY_AGENT="web-angular"
  else
    TECH_STACK="Node.js"
    PRIMARY_AGENT="backend-nodejs"
  fi
elif [ -f "$PROJECT_ROOT/composer.json" ]; then
  if grep -q "laravel" "$PROJECT_ROOT/composer.json"; then
    TECH_STACK="Laravel"
    PRIMARY_AGENT="backend-laravel"
  else
    TECH_STACK="PHP"
    PRIMARY_AGENT="backend-laravel"
  fi
elif [ -f "$PROJECT_ROOT/pubspec.yaml" ]; then
  TECH_STACK="Flutter"
  PRIMARY_AGENT="mobile-flutter"
elif [ -f "$PROJECT_ROOT/go.mod" ]; then
  TECH_STACK="Go"
  PRIMARY_AGENT="backend-go"
elif [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
  TECH_STACK="Python"
  PRIMARY_AGENT="backend-python"
else
  TECH_STACK="Unknown"
  PRIMARY_AGENT="pm-operations-orchestrator"
fi
```

### 2. Create `.claude/` Directory

```bash
mkdir -p "$PROJECT_ROOT/.claude"
```

### 3. Create/Update `.claude/CLAUDE.md`

**Get plugin template and replace placeholders:**

```bash
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog"
CURRENT_DATE=$(date +%Y-%m-%d)

# Check if CLAUDE.md exists
if [ -f "$PROJECT_ROOT/.claude/CLAUDE.md" ]; then
  # Check if already has Aura Frog
  if grep -q "AURA FROG" "$PROJECT_ROOT/.claude/CLAUDE.md"; then
    echo "✅ Aura Frog already activated in this project!"
    exit 0
  fi

  # Prepend Aura Frog to existing file
  TEMP_FILE=$(mktemp)

  sed "s/\[PROJECT_NAME\]/$PROJECT_NAME/g; s/\[TECH_STACK\]/$TECH_STACK/g; s/\[PRIMARY_AGENT\]/$PRIMARY_AGENT/g; s/\[PROJECT_TYPE\]/$PROJECT_TYPE/g; s/\[DATE\]/$CURRENT_DATE/g" \
    "$PLUGIN_DIR/templates/project-claude.md" > "$TEMP_FILE"

  echo "" >> "$TEMP_FILE"
  echo "---" >> "$TEMP_FILE"
  echo "" >> "$TEMP_FILE"
  echo "# Existing Project Instructions" >> "$TEMP_FILE"
  echo "" >> "$TEMP_FILE"
  cat "$PROJECT_ROOT/.claude/CLAUDE.md" >> "$TEMP_FILE"

  mv "$TEMP_FILE" "$PROJECT_ROOT/.claude/CLAUDE.md"

  echo "✅ Updated .claude/CLAUDE.md (prepended Aura Frog instructions)"
else
  # Create new CLAUDE.md from template
  sed "s/\[PROJECT_NAME\]/$PROJECT_NAME/g; s/\[TECH_STACK\]/$TECH_STACK/g; s/\[PRIMARY_AGENT\]/$PRIMARY_AGENT/g; s/\[PROJECT_TYPE\]/$PROJECT_TYPE/g; s/\[DATE\]/$CURRENT_DATE/g" \
    "$PLUGIN_DIR/templates/project-claude.md" > "$PROJECT_ROOT/.claude/CLAUDE.md"

  echo "✅ Created .claude/CLAUDE.md"
fi
```

### 4. Merge Plugin Settings

**Copy plugin permissions to project:**

```bash
PLUGIN_SETTINGS="$PLUGIN_DIR/settings.example.json"
PROJECT_SETTINGS="$PROJECT_ROOT/.claude/settings.local.json"

if [ -f "$PLUGIN_SETTINGS" ]; then
  if [ -f "$PROJECT_SETTINGS" ]; then
    # Merge: combine allow/deny arrays
    jq -s '
      {
        permissions: {
          allow: (.[0].permissions.allow + .[1].permissions.allow | unique),
          deny: (.[0].permissions.deny + .[1].permissions.deny | unique)
        }
      }
    ' "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS" > "${PROJECT_SETTINGS}.tmp"
    mv "${PROJECT_SETTINGS}.tmp" "$PROJECT_SETTINGS"
    echo "✅ Merged plugin settings into .claude/settings.local.json"
  else
    cp "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS"
    echo "✅ Created .claude/settings.local.json from plugin"
  fi
fi
```

### 5. Verify Activation

**Check file exists and has correct content:**
```bash
if [ -f "$PROJECT_ROOT/.claude/CLAUDE.md" ] && grep -q "AURA FROG" "$PROJECT_ROOT/.claude/CLAUDE.md"; then
  echo "✅ Aura Frog activated successfully!"
else
  echo "❌ Activation failed. Please check manually."
fi
```

---

## Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Aura Frog Activated!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Project: [PROJECT_NAME]
🛠️  Tech Stack: [TECH_STACK]
🤖 Primary Agent: [PRIMARY_AGENT]

📄 Files Created:
   .claude/CLAUDE.md - Aura Frog instructions
   .claude/settings.local.json - Plugin permissions

🎯 What's Next:

1. **Start a new Claude Code session** (important!)
   Close and reopen Claude Code to load the new CLAUDE.md

2. **Test it works:**
   Type "how are you" - you should see the Aura Frog banner

3. **Optional - Full setup:**
   Run `project:init` for complete project context

✅ Aura Frog is now active in this project!
```

---

## Example Usage

### Example 1: Fresh Activation

```
You: setup:activate

Claude:
⚡ 🐸 AURA FROG v1.9.2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: pm-operations-orchestrator │ Phase: -              ┃
┃ 🔥 Activating the frog                                    ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Detecting project...
   ✅ Project: my-project
   ✅ Tech Stack: React Native
   ✅ Primary Agent: mobile-react-native

📁 Creating .claude/CLAUDE.md...
   ✅ Created from template
   ✅ Replaced placeholders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Aura Frog Activated!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Project: my-project
🛠️  Tech Stack: React Native
🤖 Primary Agent: mobile-react-native

🎯 Start a new session to see Aura Frog in action!
```

### Example 2: Already Activated

```
You: setup:activate

Claude:
⚡ 🐸 AURA FROG v1.9.2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: pm-operations-orchestrator │ Phase: -              ┃
┃ 🔥 Already vibing                                         ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Aura Frog is already activated in this project!

📄 File: .claude/CLAUDE.md exists with Aura Frog instructions

🎯 If you're not seeing banners, try:
   1. Start a new Claude Code session
   2. Or run `project:regen` to refresh
```

### Example 3: Existing CLAUDE.md

```
You: setup:activate

Claude:
⚡ 🐸 AURA FROG v1.9.2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: pm-operations-orchestrator │ Phase: -              ┃
┃ 🔥 Merging instructions                                   ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Found existing .claude/CLAUDE.md
   ✅ Prepending Aura Frog instructions
   ✅ Preserving existing content

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Aura Frog Activated!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 .claude/CLAUDE.md updated:
   - Aura Frog instructions (new)
   - Existing project instructions (preserved)

🎯 Start a new session to see Aura Frog in action!
```

---

## Important Notes

### Why This Command Exists

Claude Code's plugin system loads commands, agents, and skills from plugins, but **NOT the CLAUDE.md file**. The `.claude/CLAUDE.md` file in each project is what tells Claude Code to use Aura Frog's identity and rules.

Without `.claude/CLAUDE.md`:
- ❌ No Aura Frog banner
- ❌ No agent identification
- ❌ Vanilla Claude Code responses

With `.claude/CLAUDE.md`:
- ✅ Aura Frog banner on every response
- ✅ Agent identification
- ✅ Full Aura Frog behavior

### When to Use Each Command

| Command | Use When |
|---------|----------|
| `setup:activate` | Quick activation, testing, minimal setup |
| `project:init` | First-time full setup with project context |
| `project:regen` | Refresh existing project context |

### After Activation

**Important:** You must start a **new Claude Code session** for the changes to take effect. Claude Code loads `.claude/CLAUDE.md` at session start.

---

## Related Commands

- `project:init` - Full project initialization
- `project:regen` - Regenerate project context
- `setup:integrations` - Configure JIRA/Slack/Figma
- `help` - Show all commands

---

**Version:** 1.0.0
**Last Updated:** 2025-11-29
