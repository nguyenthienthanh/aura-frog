# Command: project:regen

**Category:** Project  
**Priority:** Medium  
**Syntax:** `project:regen [project-name]`

---

## Description

Re-generate project context by re-scanning the project and updating all context files. This is useful when:
- Project structure has changed
- New dependencies added
- Conventions updated
- Team members changed
- Tech stack updated

**Difference from `project:init`:**
- `project:init` - Full initialization (creates everything from scratch)
- `project:regen` - Re-generate existing project context (updates only)

---

## When to Use

- Project structure changed (new directories, moved files)
- Major dependencies updated
- New conventions adopted
- Team members changed
- Tech stack versions updated
- Code patterns evolved
- After refactoring large parts of codebase

---

## Execution Steps

### 1. Detect Project Name

**If project-name provided:**
- Use provided name
- Verify `.claude/project-contexts/[project-name]/` exists

**If not provided:**
- Detect from current directory (same as `project:init`)
- Check if context exists
- If not exists → Prompt: "No project context found. Run `project:init` first?"

### 2. Backup Existing Context (Optional)

**Create backup:**
```bash
# Backup existing context
cp -r .claude/project-contexts/[project-name] \
     .claude/project-contexts/[project-name].backup.$(date +%Y%m%d-%H%M%S)
```

**Ask user:**
```
Existing project context found: [project-name]

Options:
1. Backup and re-generate (recommended)
2. Re-generate without backup
3. Cancel

Choice [1]:
```

### 3. Re-scan Project

**Same deep analysis as `project:init` Steps 3 + 3b:**
- Scan project structure
- Detect framework and tech stack
- Extract patterns and conventions (12 detections)
- Detect team reviewers
- Analyze code examples
- Regenerate repo map, file registry, and architecture analysis

### 4. Update Project Context Files

**Update existing files (don't recreate from scratch):**

#### 4.1. Update `project-config.yaml`
- Merge detected values with existing config
- Preserve manual customizations (if any)
- Update tech stack versions
- Update structure paths if changed
- Update team reviewers if changed

#### 4.2. Update `conventions.md`
- Re-extract naming patterns
- Update directory structure
- Update import patterns
- Update component patterns
- Preserve manual notes (if any)

#### 4.3. Update `rules.md`
- Re-extract from ESLint/Prettier configs
- Update testing rules
- Update git rules
- Preserve custom rules (if any)

#### 4.4. Update `examples.md`
- Re-scan codebase for examples
- Update feature examples
- Update component examples
- Update test examples
- Update API examples

#### 4.5. Regenerate `repo-map.md` (NEW in v3.0.0)
```bash
bash "$PLUGIN_DIR/scripts/repo-map-gen.sh" "$PROJECT_ROOT" "$CONTEXT_DIR/repo-map.md" 3
```
- Re-walk directory tree
- Update purpose annotations
- Claude enriches generic annotations with specific descriptions

#### 4.6. Regenerate `file-registry.yaml` (NEW in v3.0.0)
```bash
bash "$PLUGIN_DIR/scripts/file-registry-gen.sh" "$PROJECT_ROOT" "$CONTEXT_DIR/file-registry.yaml" 50
```
- Re-detect entry points, configs, hub files
- Update import counts and relationships
- Claude adds/updates file descriptions

#### 4.7. Regenerate `architecture.md` (NEW in v3.0.0)
```bash
bash "$PLUGIN_DIR/scripts/architecture-gen.sh" "$PROJECT_ROOT" "$CONTEXT_DIR/architecture.md"
```
- Re-detect architecture type, dependencies, patterns, data flow
- Claude enriches with module relationships

#### 4.8. Regenerate `session-context.toon` (Enhanced)
```bash
bash "$PLUGIN_DIR/scripts/context-compress.sh" ".claude" "$PROJECT_ROOT"
```
- Now detects 12 patterns (was 6): adds indentation, state mgmt, API pattern, component style, env pattern, monorepo

### 5. Sync Plugin Settings

**Merge latest plugin settings into project** (picks up new env vars, permissions):

```bash
PLUGIN_DIR="${CLAUDE_PLUGIN_ROOT}"
PLUGIN_SETTINGS="$PLUGIN_DIR/settings.example.json"
PROJECT_SETTINGS=".claude/settings.local.json"

if [ -f "$PLUGIN_SETTINGS" ] && [ -f "$PROJECT_SETTINGS" ]; then
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
  echo "✅ Settings synced from plugin (env + permissions)"
elif [ -f "$PLUGIN_SETTINGS" ]; then
  cp "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS"
  echo "✅ Created settings from plugin defaults"
fi
```

**What gets synced:**
- New env vars (e.g., Agent Teams) — plugin defaults, project overrides win
- New permission rules — added without removing project rules

### 6. Update `.claude/CLAUDE.md` (CRITICAL)

**⚠️ CRITICAL:** This file is required for Claude Code to load Aura Frog instructions!

**Use the auto-update script to refresh AURA-FROG section:**

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

**Why This is Critical:**
- ✅ Claude Code loads `.claude/CLAUDE.md` at session start (highest priority)
- ✅ References plugin for banner format and MCP display
- ✅ User customizations preserved in USER-CUSTOM section
- ✅ Auto-syncs with plugin updates via `project:regen`
- ✅ Without it, Aura Frog won't activate!

### 7. Update ccpm-config.yaml (If Needed)

**Check if updates needed:**
- Primary agent changed?
- Project type changed?
- Ticket format changed?
- Main branch changed?

**If changes detected:**
- Update `ccpm-config.yaml`
- Show diff of changes

### 8. Validate Updates

**Run validation:**
- ✅ All context files updated
- ✅ Config files valid
- ✅ Can load project conventions
- ✅ Can detect project patterns
- ✅ No conflicts with existing config

---

## Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Project Context Re-generated Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Project: [project-name]

🔄 Changes Detected:

Tech Stack:
- Framework: [old] → [new]
- State: [old] → [new]
- Data: [old] → [new]

Structure:
- Added: [new directories]
- Removed: [removed directories]
- Changed: [modified paths]

Conventions:
- Updated: [naming patterns]
- Updated: [import patterns]
- Updated: [component patterns]

Team:
- Added: [new reviewers]
- Removed: [removed reviewers]
- Updated: [changed reviewers]

📄 Files Updated:

✅ .claude/project-contexts/[project-name]/
   ├── project-config.yaml   - Updated (tech stack, structure)
   ├── conventions.md        - Updated (patterns + code style)
   ├── rules.md              - Updated (quality rules)
   ├── examples.md           - Updated (code examples)
   ├── repo-map.md           - Regenerated (directory tree)
   ├── file-registry.yaml    - Regenerated (key files index)
   └── architecture.md       - Regenerated (architecture analysis)

✅ ccpm-config.yaml
   - Updated: [changes made]

📦 Backup Created:
   .claude/project-contexts/[project-name].backup.[timestamp]/

✅ Project context refreshed!
```

---

## Example Usage

### Example 1: Re-generate Current Project

```
You: project:regen

Claude:
🔍 Detecting project...
   ✅ Found: my-project

📦 Existing context found: my-project

Options:
1. Backup and re-generate (recommended)
2. Re-generate without backup
3. Cancel

Choice [1]: 1

💾 Creating backup...
   ✅ Backup: my-project.backup.20251125-153022

🔄 Re-scanning project...

📦 Scanning files:
   ✅ Detected new dependencies: 3 added
   ✅ Updated framework version: 0.76.9 → 0.77.0
   ✅ Found new directory: src/hooks/

📋 Extracting conventions:
   ✅ Updated naming patterns
   ✅ Found new import aliases
   ✅ Updated component structure

👥 Detected team changes:
   ✅ Added reviewer: New Team Member

🔧 Updating project context...
   ✅ project-config.yaml - Updated
   ✅ conventions.md - Updated
   ✅ rules.md - Updated
   ✅ examples.md - Updated

✅ Re-generation complete!
```

### Example 2: Re-generate Specific Project

```
You: project:regen my-other-project

Claude:
🔍 Checking project: my-other-project

📦 Found context: my-other-project

🔄 Re-scanning project...
   [Same process as Example 1]

✅ Re-generation complete!
```

### Example 3: No Context Found

```
You: project:regen

Claude:
🔍 Detecting project...
   ✅ Found: new-project

❌ No project context found: new-project

Options:
1. Run project:init to create context first
2. Cancel

Choice [1]: 1

[Executes project:init...]
```

---

## Important Notes

### What Gets Updated

**Always updated:**
- Tech stack versions
- Directory structure
- Code patterns
- Conventions
- Examples

**Preserved (if exists):**
- Manual customizations in config files
- Custom rules added manually
- Team reviewers (merged with detected)

### When to Use vs project:init

**Use `project:regen`:**
- ✅ Project context already exists
- ✅ Just need to refresh/update
- ✅ Project structure changed
- ✅ Dependencies updated

**Use `project:init`:**
- ✅ First time setup
- ✅ No project context exists
- ✅ Want to reset everything
- ✅ Switching to different project

### Backup Strategy

**Backups are created with timestamp:**
```
project-contexts/
├── my-project/
└── my-project.backup.20251125-153022/
```

**Cleanup old backups:**
- Keep last 3 backups
- Delete backups older than 30 days
- Manual cleanup: `rm -rf .claude/project-contexts/*.backup.*`

---

## Related Commands

- `project:init` - Full initialization (first time setup)
- `project:detect` - Re-detect project type only
- `project:list` - List all indexed projects
- `project:switch` - Switch between projects
- `help` - Show all commands

---

## Technical Details

### Merge Strategy

**For project-config.yaml:**
1. Load existing config
2. Detect new values
3. Merge: Detected values override existing (except manual flags)
4. Preserve custom fields

**For conventions.md:**
1. Extract new patterns
2. Replace sections with new patterns
3. Preserve manual notes (marked with `<!-- MANUAL -->`)

**For rules.md:**
1. Re-extract from config files
2. Replace auto-detected rules
3. Preserve custom rules (marked with `<!-- CUSTOM -->`)

**For examples.md:**
1. Re-scan codebase
2. Replace all examples
3. Keep same structure

### Detection Priority

```
Detected Values > Existing Config > Defaults
```

---

**Last Updated:** 2026-03-20

