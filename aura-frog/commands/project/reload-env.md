# Command: project:reload-env

**Category:** Project
**Priority:** Medium
**Syntax:** `project:reload-env`

---

## Description

Load or reload environment variables from the project's `.envrc` file. This command reads the `.envrc` file and makes all exported variables available for the current session.

**Use cases:**
- After editing `.envrc` with new API keys
- After switching projects
- When environment variables are not loading properly
- To verify which environment variables are set

---

## When to Use

- After adding new API keys (GEMINI_API_KEY, OPENAI_API_KEY, etc.)
- After modifying integration credentials (JIRA, Slack, Figma, etc.)
- After changing model selection environment variables
- When starting a new session and env vars aren't loaded
- To debug environment variable issues

---

## Execution Steps

### 1. Detect .envrc Location

**Search order:**
1. Project root (current directory): `./.envrc`
2. Project .claude folder: `./.claude/.envrc`

```bash
PROJECT_ROOT=$(pwd)

if [ -f "$PROJECT_ROOT/.envrc" ]; then
  ENVRC_PATH="$PROJECT_ROOT/.envrc"
elif [ -f "$PROJECT_ROOT/.claude/.envrc" ]; then
  ENVRC_PATH="$PROJECT_ROOT/.claude/.envrc"
else
  echo "❌ No .envrc file found"
  echo "   Run 'project:init' to create one"
  exit 1
fi
```

### 2. Parse and Load Environment Variables

**Safe parsing approach (handles special characters):**

```bash
# Read .envrc and extract export statements
while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line// }" ]] && continue

  # Match export statements
  if [[ "$line" =~ ^[[:space:]]*export[[:space:]]+([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    # Extract variable name and value
    var_name="${BASH_REMATCH[1]}"

    # Get value (handle quoted and unquoted)
    if [[ "$line" =~ ^[[:space:]]*export[[:space:]]+[A-Za-z_][A-Za-z0-9_]*=\"([^\"]*)\" ]]; then
      var_value="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^[[:space:]]*export[[:space:]]+[A-Za-z_][A-Za-z0-9_]*=\'([^\']*)\' ]]; then
      var_value="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^[[:space:]]*export[[:space:]]+[A-Za-z_][A-Za-z0-9_]*=([^[:space:]]*) ]]; then
      var_value="${BASH_REMATCH[1]}"
    fi

    # Export the variable
    export "$var_name=$var_value"
    echo "   ✅ $var_name"
  fi
done < "$ENVRC_PATH"
```

### 3. Verify Key Variables

**Check critical variables are set:**

```bash
echo ""
echo "📋 Environment Status:"
echo ""

# AI Model API Keys
echo "🤖 AI Model API Keys:"
[ -n "$GEMINI_API_KEY" ] && echo "   ✅ GEMINI_API_KEY (set)" || echo "   ⚪ GEMINI_API_KEY (not set)"
[ -n "$OPENAI_API_KEY" ] && echo "   ✅ OPENAI_API_KEY (set)" || echo "   ⚪ OPENAI_API_KEY (not set)"
[ -n "$DEEPSEEK_API_KEY" ] && echo "   ✅ DEEPSEEK_API_KEY (set)" || echo "   ⚪ DEEPSEEK_API_KEY (not set)"

# Model Overrides
echo ""
echo "🔀 Model Phase Overrides:"
[ -n "$AURA_PHASE_1_MODEL" ] && echo "   ✅ Phase 1: $AURA_PHASE_1_MODEL" || echo "   ⚪ Phase 1: default (claude)"
[ -n "$AURA_PHASE_2_MODEL" ] && echo "   ✅ Phase 2: $AURA_PHASE_2_MODEL" || echo "   ⚪ Phase 2: default (claude)"
[ -n "$AURA_PHASE_5B_MODEL" ] && echo "   ✅ Phase 5b: $AURA_PHASE_5B_MODEL" || echo "   ⚪ Phase 5b: default (claude)"
[ -n "$AURA_PHASE_6_MODEL" ] && echo "   ✅ Phase 6: $AURA_PHASE_6_MODEL" || echo "   ⚪ Phase 6: default (claude)"

# Integrations
echo ""
echo "🔗 Integration Credentials:"
[ -n "$JIRA_URL" ] && echo "   ✅ JIRA (configured)" || echo "   ⚪ JIRA (not configured)"
[ -n "$FIGMA_API_TOKEN" ] && echo "   ✅ Figma (configured)" || echo "   ⚪ Figma (not configured)"
[ -n "$SLACK_BOT_TOKEN" ] && echo "   ✅ Slack (configured)" || echo "   ⚪ Slack (not configured)"
[ -n "$CONFLUENCE_URL" ] && echo "   ✅ Confluence (configured)" || echo "   ⚪ Confluence (not configured)"

# Workflow Settings
echo ""
echo "⚙️  Workflow Settings:"
[ -n "$AURA_FROG_DEFAULT_COVERAGE" ] && echo "   Coverage: $AURA_FROG_DEFAULT_COVERAGE%" || echo "   Coverage: 80% (default)"
[ -n "$AURA_FROG_TDD_ENFORCE" ] && echo "   TDD: $AURA_FROG_TDD_ENFORCE" || echo "   TDD: true (default)"
```

---

## Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Environment Loaded Successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Source: ./.envrc

📋 Environment Status:

🤖 AI Model API Keys:
   ✅ GEMINI_API_KEY (set)
   ⚪ OPENAI_API_KEY (not set)
   ⚪ DEEPSEEK_API_KEY (not set)

🔀 Model Phase Overrides:
   ✅ Phase 1: gemini
   ✅ Phase 2: gemini
   ⚪ Phase 5b: default (claude)
   ⚪ Phase 6: default (claude)

🔗 Integration Credentials:
   ✅ JIRA (configured)
   ✅ Figma (configured)
   ⚪ Slack (not configured)
   ⚪ Confluence (not configured)

⚙️  Workflow Settings:
   Coverage: 80% (default)
   TDD: true (default)

💡 Tip: Edit .envrc and run 'project:reload-env' to apply changes
```

---

## Example Usage

### Example 1: Load Environment After Editing

```
You: project:reload-env

Claude:
🔄 Loading environment from .envrc...

📁 Source: ./.envrc

Loaded variables:
   ✅ GEMINI_API_KEY
   ✅ AURA_PHASE_1_MODEL
   ✅ AURA_PHASE_2_MODEL
   ✅ JIRA_URL
   ✅ JIRA_EMAIL
   ✅ JIRA_API_TOKEN

📋 Environment Status:
[Full status output...]

✅ Environment loaded successfully!
```

### Example 2: No .envrc Found

```
You: project:reload-env

Claude:
❌ No .envrc file found

To create one, run:
   project:init

Or create manually:
   cp ~/.claude/plugins/marketplaces/aurafrog/aura-frog/.envrc.template .envrc
```

### Example 3: Verify Model Configuration

```
You: project:reload-env

Claude:
🔄 Loading environment...

📋 Model Configuration Active:

Phase 1 (Understand): gemini
Phase 2 (Design): gemini
Phase 3-5c: claude (default)
Phase 6 (Review): claude (default)

✅ Multi-model workflow ready!
```

---

## Important Notes

### Auto-Loading .envrc

**Claude Code should auto-load .envrc at session start.**

Add this instruction to CLAUDE.md:
```markdown
## Environment Loading

**ALWAYS load .envrc at session start:**
1. Check for `.envrc` in: project root, then `.claude/.envrc`
2. If found, parse and load all exported variables
3. Use loaded variables for integrations and model selection
```

### Security

- **Never log API key values** - only show "(set)" or "(not set)"
- **Don't commit .envrc with secrets** - add to .gitignore
- **Use .envrc.template** for sharing configuration structure

### direnv Integration

If using `direnv`:
```bash
# Allow direnv to load .envrc
direnv allow

# Reload after changes
direnv reload
```

**Note:** Claude Code doesn't use direnv directly. This command manually parses .envrc.

### Variable Priority

```
Environment Variable > Project Config > Global Config > Default
```

Example:
- `AURA_PHASE_1_MODEL=gemini` in .envrc overrides `phase_1_understand: claude` in config

---

## Related Commands

- `project:init` - Initialize project with .envrc
- `project:regen` - Regenerate project context
- `setup:integrations` - Configure integration credentials
- `workflow:start` - Start workflow (uses loaded env vars)

---

## Technical Details

### Supported Variable Formats

```bash
# All these formats are supported:
export VAR_NAME="value"
export VAR_NAME='value'
export VAR_NAME=value
```

### Special Characters

The parser handles:
- Quoted values with spaces
- URLs with special characters
- API tokens with special characters

### Environment Scope

Variables are loaded for the current Claude Code session only. They persist until:
- Session ends
- Variables are overwritten
- `project:reload-env` is run again

---

**Version:** 1.0.0
**Last Updated:** 2025-12-01
