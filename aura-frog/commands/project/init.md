# Command: project:init

**Category:** Project
**Priority:** High
**Syntax:** `project:init`

---

## Purpose

Initialize Aura Frog for a project:
1. Auto-detect project type and structure
2. Create `.claude/project-contexts/` for AI understanding
3. Set up project configuration
4. Enable workflow integration

---

## When to Use

- First time using Aura Frog in a project
- Reconfiguring Aura Frog settings
- Setting up team integrations

---

## Created Structure

```
.claude/
├── CLAUDE.md                    # References plugin for instructions
├── settings.local.json          # Merged permissions from plugin
├── project-contexts/[project]/
│   ├── project-config.yaml      # Tech stack, integrations, entry points, key deps
│   ├── conventions.md           # Naming, structure, code style, patterns, idioms
│   ├── rules.md                 # Project-specific rules
│   ├── examples.md              # Code examples
│   ├── repo-map.md              # Annotated directory tree with purpose descriptions
│   ├── file-registry.yaml       # Key files index (entry points, configs, hub files)
│   └── architecture.md          # Module map, data flow, design patterns, dependencies
├── logs/                        # Workflow logs (git-ignored)
│   └── workflows/
└── session-context.toon         # Cached patterns (12 detections, auto-generated)
```

---

## Execution Steps

### 1. Create Folder Structure

```bash
mkdir -p .claude/project-contexts .claude/logs/workflows
```

### 2. Detect Project Type

```toon
detection[6]{check,indicator,type}:
  package.json + react,React/RN,frontend
  package.json + next,Next.js,fullstack
  composer.json + laravel,Laravel,backend
  go.mod,Go,backend
  requirements.txt,Python,backend
  pubspec.yaml,Flutter,mobile
```

### 3. Generate project-config.yaml

```yaml
project:
  name: {detected}
  type: {detected}

tech_stack:
  language: {detected}
  framework: {detected}
  styling: {detected}
  testing: {detected}

integrations:
  jira: {if JIRA_* env vars present}
  figma: {if FIGMA_* env vars present}
```

### 3b. Generate Deep Context Files (NEW in v2.0.0)

These scripts collect raw structural data. Claude then enriches with AI-generated descriptions.

```bash
PLUGIN_DIR="${CLAUDE_PLUGIN_ROOT}"
PROJECT_ROOT=$(pwd)
PROJECT_NAME="[DETECTED_PROJECT_NAME]"
CONTEXT_DIR=".claude/project-contexts/$PROJECT_NAME"

# Generate annotated repo map (directory tree with purpose descriptions)
bash "$PLUGIN_DIR/scripts/repo-map-gen.sh" "$PROJECT_ROOT" "$CONTEXT_DIR/repo-map.md" 3
echo "✅ Generated repo-map.md"

# Generate file registry (key files: entry points, configs, hub files)
bash "$PLUGIN_DIR/scripts/file-registry-gen.sh" "$PROJECT_ROOT" "$CONTEXT_DIR/file-registry.yaml" 50
echo "✅ Generated file-registry.yaml"

# Generate architecture analysis (type, dependencies, patterns, data flow)
bash "$PLUGIN_DIR/scripts/architecture-gen.sh" "$PROJECT_ROOT" "$CONTEXT_DIR/architecture.md"
echo "✅ Generated architecture.md"

# Generate enhanced session context (12 pattern detections)
bash "$PLUGIN_DIR/scripts/context-compress.sh" ".claude" "$PROJECT_ROOT"
echo "✅ Generated session-context.toon (12 patterns)"
```

**After script generation, Claude enriches the output:**

1. **repo-map.md** — Review directories with generic annotations ("Contains: md files") and replace with specific purpose descriptions based on file content sampling
2. **file-registry.yaml** — Add `description` fields for key files by reading their first few lines
3. **architecture.md** — Fill in module relationships, data flow details, and pattern analysis based on actual codebase understanding
4. **conventions.md** — Enhance with code style patterns (component structure, state management approach, API integration pattern, error handling idioms) detected from the session-context.toon patterns

**Token budget for enrichment:** ~2000 tokens max. Keep descriptions concise (1 line per item).

### 4. Create/Update CLAUDE.md

**Use sectioned template with auto-update support:**

```bash
PLUGIN_DIR="${CLAUDE_PLUGIN_ROOT}"
PROJECT_ROOT=$(pwd)
PROJECT_NAME="[DETECTED_PROJECT_NAME]"
TECH_STACK="[DETECTED_TECH_STACK]"
PRIMARY_AGENT="[DETECTED_PRIMARY_AGENT]"
PROJECT_TYPE="[DETECTED_TYPE]"
CURRENT_DATE=$(date +%Y-%m-%d)

if [ ! -f "$PROJECT_ROOT/.claude/CLAUDE.md" ]; then
  # Create from template
  cp "$PLUGIN_DIR/templates/project-claude.md" "$PROJECT_ROOT/.claude/CLAUDE.md"

  # Replace placeholders
  sed -i '' "s/\[PROJECT_NAME\]/$PROJECT_NAME/g" "$PROJECT_ROOT/.claude/CLAUDE.md"
  sed -i '' "s/\[TECH_STACK\]/$TECH_STACK/g" "$PROJECT_ROOT/.claude/CLAUDE.md"
  sed -i '' "s/\[PRIMARY_AGENT\]/$PRIMARY_AGENT/g" "$PROJECT_ROOT/.claude/CLAUDE.md"
  sed -i '' "s/\[PROJECT_TYPE\]/$PROJECT_TYPE/g" "$PROJECT_ROOT/.claude/CLAUDE.md"
  sed -i '' "s/\[DATE\]/$CURRENT_DATE/g" "$PROJECT_ROOT/.claude/CLAUDE.md"

  echo "✅ Created .claude/CLAUDE.md"
else
  # Update AURA-FROG section, preserve USER-CUSTOM
  bash "$PLUGIN_DIR/scripts/claude-md-update.sh" "$PROJECT_ROOT/.claude/CLAUDE.md"
  echo "✅ Updated .claude/CLAUDE.md (AURA-FROG section refreshed)"
fi
```

**Template sections:**
- `<!-- AURA-FROG:START -->` ... `<!-- AURA-FROG:END -->` - Auto-updated by plugin
- `<!-- USER-CUSTOM:START -->` ... `<!-- USER-CUSTOM:END -->` - Preserved during updates

### 5. Merge Plugin Settings

Copy and merge plugin settings (permissions + env) to project:

```bash
PLUGIN_DIR="${CLAUDE_PLUGIN_ROOT}"
PLUGIN_SETTINGS="$PLUGIN_DIR/settings.example.json"
PROJECT_SETTINGS=".claude/settings.local.json"

if [ -f "$PLUGIN_SETTINGS" ]; then
  if [ -f "$PROJECT_SETTINGS" ]; then
    # Full merge: env + permissions.allow + permissions.deny
    # Project values override plugin defaults for env
    jq -s '
      .[1] as $project |
      .[0] as $plugin |
      ($plugin.env // {}) + ($project.env // {}) as $merged_env |
      (($plugin.permissions.allow // []) + ($project.permissions.allow // []) | unique) as $merged_allow |
      (($plugin.permissions.deny // []) + ($project.permissions.deny // []) | unique) as $merged_deny |
      $project * {
        env: $merged_env,
        permissions: { allow: $merged_allow, deny: $merged_deny }
      }
    ' "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS" > /tmp/af-merged-settings.json
    mv /tmp/af-merged-settings.json "$PROJECT_SETTINGS"
  else
    # Copy plugin settings as base
    cp "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS"
  fi
  echo "✅ Created/merged .claude/settings.local.json"
fi
```

**Settings include:**
- **Environment variables** — Agent Teams enabled, custom env vars
- Script execution permissions
- Linting/testing commands
- Git read-only commands
- Dangerous operation denials

**Re-sync after plugin update:** Run `project:sync-settings`

### 6. Generate .envrc (Optional)

If direnv installed, create `.envrc` for auto-loading.

### 7. Setup Learning System (Optional)

If Supabase credentials are configured:

```bash
PLUGIN_DIR="${CLAUDE_PLUGIN_ROOT}"

if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SECRET_KEY" ]; then
  echo ""
  echo "🧠 Learning System detected. Setup now? [y/N]"
  read -r setup_learning

  if [ "$setup_learning" = "y" ] || [ "$setup_learning" = "Y" ]; then
    # Check if bootstrap is needed
    if ! bash "$PLUGIN_DIR/scripts/supabase/setup.sh" --check 2>/dev/null; then
      echo ""
      echo "⚠️  First, run bootstrap.sql in Supabase SQL Editor:"
      echo "   File: $PLUGIN_DIR/scripts/supabase/bootstrap.sql"
      echo ""
      echo "Then run: ./scripts/supabase/setup.sh"
    else
      bash "$PLUGIN_DIR/scripts/supabase/setup.sh"
    fi
  fi
fi
```

---

## Interactive Prompts

1. Project type (if not auto-detected)
2. Primary agent to use
3. Enable JIRA/Figma integration?
4. Team conventions (if not detected)
5. **Setup learning system?** (if Supabase configured)

---

## Post-Init

- Run `project:reload-env` to load integrations
- Review generated `project-config.yaml`
- Customize `conventions.md` if needed
- Run `/learn:status` to verify learning system (if enabled)

---

**Version:** 3.0.0
