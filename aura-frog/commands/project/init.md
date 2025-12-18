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
│   ├── project-config.yaml      # Tech stack, integrations
│   ├── conventions.md           # Naming, structure patterns
│   ├── rules.md                 # Project-specific rules
│   └── examples.md              # Code examples
├── logs/                        # Workflow logs (git-ignored)
│   └── workflows/
└── session-context.toon         # Cached patterns (auto-generated)
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

### 4. Create CLAUDE.md

```markdown
# {Project Name}

**Load Aura Frog:** `~/.claude/plugins/.../CLAUDE.md`

**Project Context:** `.claude/project-contexts/{project}/`
```

### 5. Merge Plugin Settings

Copy and merge plugin permissions to project:

```bash
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog"
PROJECT_SETTINGS=".claude/settings.local.json"

if [ -f "$PLUGIN_DIR/settings.example.json" ]; then
  if [ -f "$PROJECT_SETTINGS" ]; then
    # Merge: combine allow arrays, keep deny from both
    jq -s '.[0].permissions.allow + .[1].permissions.allow | unique' \
      "$PLUGIN_DIR/settings.example.json" "$PROJECT_SETTINGS" > /tmp/merged_allow.json

    jq -s '.[0].permissions.deny + .[1].permissions.deny | unique' \
      "$PLUGIN_DIR/settings.example.json" "$PROJECT_SETTINGS" > /tmp/merged_deny.json

    jq --slurpfile allow /tmp/merged_allow.json \
       --slurpfile deny /tmp/merged_deny.json \
       '{permissions: {allow: $allow[0], deny: $deny[0]}}' \
       <<< '{}' > "$PROJECT_SETTINGS"
  else
    # Copy plugin settings as base
    cp "$PLUGIN_DIR/settings.example.json" "$PROJECT_SETTINGS"
  fi
  echo "✅ Created/merged .claude/settings.local.json"
fi
```

**Settings include:**
- Script execution permissions
- Linting/testing commands
- Git read-only commands
- Dangerous operation denials

### 6. Generate .envrc (Optional)

If direnv installed, create `.envrc` for auto-loading.

---

## Interactive Prompts

1. Project type (if not auto-detected)
2. Primary agent to use
3. Enable JIRA/Figma integration?
4. Team conventions (if not detected)

---

## Post-Init

- Run `project:reload-env` to load integrations
- Review generated `project-config.yaml`
- Customize `conventions.md` if needed

---

**Version:** 2.0.0
