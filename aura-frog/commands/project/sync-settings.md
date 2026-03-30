# Command: project:sync-settings

**Category:** Project
**Priority:** Medium
**Syntax:** `project:sync-settings`

---

## Purpose

Merge latest plugin settings into project's `.claude/settings.local.json`. Ensures projects get new plugin defaults (permissions, env vars like Agent Teams) without losing project-specific customizations.

**Use after plugin updates** to pick up new features automatically.

---

## When to Use

- After updating Aura Frog plugin (`/plugin marketplace update aurafrog`)
- When new plugin features require settings changes (e.g., Agent Teams)
- To sync permissions from plugin to project
- Called automatically by `project:regen`

---

## Merge Strategy

```
Plugin settings.example.json  ──┐
                                 ├──► MERGE ──► Project settings.local.json
Project settings.local.json   ──┘

Rules:
  permissions.allow  → Union (plugin + project, deduplicated)
  permissions.deny   → Union (plugin + project, deduplicated)
  env                → Plugin defaults + project overrides (project wins)
  statusLine         → Always from plugin (canonical source)
  other keys         → Project values preserved, plugin adds missing
```

---

## Execution Steps

### 1. Locate Files

```bash
PLUGIN_DIR="${CLAUDE_PLUGIN_ROOT:-$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog}"
PLUGIN_SETTINGS="$PLUGIN_DIR/settings.example.json"
PROJECT_SETTINGS=".claude/settings.local.json"
```

### 2. Validate

```bash
# Plugin settings must exist
if [ ! -f "$PLUGIN_SETTINGS" ]; then
  echo "❌ Plugin settings not found: $PLUGIN_SETTINGS"
  echo "   Run: /plugin marketplace update aurafrog"
  exit 1
fi

# Project settings - create if missing
if [ ! -f "$PROJECT_SETTINGS" ]; then
  cp "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS"
  echo "✅ Created $PROJECT_SETTINGS from plugin defaults"
  exit 0
fi
```

### 3. Backup Current Settings

```bash
cp "$PROJECT_SETTINGS" "$PROJECT_SETTINGS.backup.$(date +%Y%m%d-%H%M%S)"
```

### 4. Merge Settings

```bash
# Create merged output using jq
jq -s '
  # Base: start with project settings (preserve all project keys)
  .[1] as $project |
  .[0] as $plugin |

  # Merge env: plugin defaults + project overrides (project wins)
  ($plugin.env // {}) + ($project.env // {}) as $merged_env |

  # Merge permissions.allow: union of both arrays
  (($plugin.permissions.allow // []) + ($project.permissions.allow // []) | unique) as $merged_allow |

  # Merge permissions.deny: union of both arrays
  (($plugin.permissions.deny // []) + ($project.permissions.deny // []) | unique) as $merged_deny |

  # Merge statusLine: always take plugin version (canonical source)
  ($plugin.statusLine // null) as $plugin_sl |

  # Build result: project base + merged fields
  $project * {
    env: $merged_env,
    permissions: {
      allow: $merged_allow,
      deny: $merged_deny
    }
  } + (if $plugin_sl then { statusLine: $plugin_sl } else {} end)
' "$PLUGIN_SETTINGS" "$PROJECT_SETTINGS" > /tmp/af-merged-settings.json

# Replace project settings with merged result
mv /tmp/af-merged-settings.json "$PROJECT_SETTINGS"
```

### 5. Show Changes

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Settings Synced"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Merged from plugin:"
echo "   - permissions.allow: $(jq '.permissions.allow | length' $PROJECT_SETTINGS) rules"
echo "   - permissions.deny: $(jq '.permissions.deny | length' $PROJECT_SETTINGS) rules"
echo "   - env vars: $(jq '.env | length' $PROJECT_SETTINGS) vars"
echo ""
echo "🔑 Environment:"
jq -r '.env // {} | to_entries[] | "   \(.key) = \(.value)"' "$PROJECT_SETTINGS"
echo ""
echo "💾 Backup: $PROJECT_SETTINGS.backup.*"
```

---

## Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Settings Synced
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Merged from plugin:
   - permissions.allow: 58 rules
   - permissions.deny: 6 rules
   - env vars: 1 vars

🔑 Environment:
   CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = 1

💾 Backup: .claude/settings.local.json.backup.20260209-143022
```

---

## Merge Behavior

| Field | Merge Rule | Example |
|-------|-----------|---------|
| `env` | Plugin defaults + project overrides | Plugin: `{TEAMS: "1"}` + Project: `{MY_VAR: "x"}` → Both kept |
| `permissions.allow` | Union (deduplicated) | Plugin has new rule → added to project |
| `permissions.deny` | Union (deduplicated) | Both lists combined |
| `statusLine` | Always from plugin (canonical source) | Ensures correct script path after updates |
| Other keys | Project values preserved | Project custom keys untouched |

### Environment Override Priority

```
Project env  >  Plugin env  >  Not set
```

If a project explicitly sets `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=0`, it will NOT be overwritten by the plugin default of `1`. Project settings always win for env vars.

---

## Related Commands

- `project:init` - Full initialization (includes settings sync)
- `project:regen` - Re-generate context (includes settings sync)
- `project:reload-env` - Reload `.envrc` environment variables

---

