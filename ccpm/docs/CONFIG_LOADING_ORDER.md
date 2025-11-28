# Configuration Loading Order

**Version:** 5.2.0
**Last Updated:** 2025-11-27

---

## Overview

CCPM uses multiple configuration files with a clear priority system. Understanding this loading order is crucial for customizing your workflow.

---

## Quick Reference

**Priority (Highest to Lowest):**
1. 🔴 **Environment Variables** - Runtime overrides
2. 🟠 **Project Context Config** - Project-specific settings
3. 🟡 **Local Settings** - User-specific permissions
4. 🟢 **Global CCPM Config** - Plugin defaults
5. 🔵 **Hard-coded Defaults** - Fallback values

**Rule:** Higher priority overwrites lower priority

---

## Configuration Files

### 1. Environment Variables (Highest Priority)

**Location:** `ccpm/.envrc` or system environment

**Purpose:** Runtime configuration, integration credentials

**Example:**
```bash
export CCPM_PROJECT="my-project"
export CCPM_PROJECT_CONTEXT="project-contexts/my-project"
export JIRA_URL="https://company.atlassian.net"
export CCPM_DEFAULT_COVERAGE="85"
```

**Scope:** Session-specific, not committed to git

**Priority:** 🔴 **HIGHEST** - Overrides everything

**When to use:**
- ✅ Integration credentials (JIRA, Slack, Figma)
- ✅ Per-user customization
- ✅ CI/CD configuration
- ✅ Temporary overrides

**Documentation:** `INTEGRATION_SETUP_GUIDE.md`

---

### 2. Project Context Config (Project-Specific)

**Location:** `.claude/project-contexts/[project-name]/project-config.yaml`

**Purpose:** Project-specific tech stack, team, workflow settings

**Example:**
```yaml
project:
  name: "My Mobile App"
  type: "mobile-react-native"

tech_stack:
  primary:
    framework: "React Native"
    language: "TypeScript"
  styling:
    approach: "nativewind"

workflow:
  test_coverage_target: 85
  tdd_enforcement: "strict"

team:
  reviewers:
    frontend: ["dev@example.com"]
```

**Scope:** Per-project, committed to git

**Priority:** 🟠 **VERY HIGH** - Overrides global config

**When to use:**
- ✅ Tech stack configuration
- ✅ Project conventions
- ✅ Team members
- ✅ Workflow customization

**Created by:** `project:init` command

**Documentation:** `project-contexts/template/project-config.yaml`

---

### 3. Local Settings (User-Specific)

**Location:** `ccpm/settings.local.json`

**Purpose:** Claude Code permissions, auto-approval settings

**📚 Detailed Guide:** See [`SETTINGS_GUIDE.md`](SETTINGS_GUIDE.md) for complete configuration reference

**Example:**
```json
{
  "permissions": {
    "allow": ["Bash(yarn test:*)", "Read(./**)"],
    "deny": ["Bash(rm -rf:*)"],
    "ask": ["Bash(git commit:*)"]
  },
  "workflow": {
    "auto_continue_after_approval": true,
    "token_warning_threshold": 150000
  }
}
```

**Scope:** Per-user, not committed to git

**Priority:** 🟡 **HIGH** - Controls what Claude can do

**When to use:**
- ✅ Permission configuration
- ✅ Safety settings
- ✅ User preferences

**Template:** `ccpm/settings.example.json`

---

### 4. Global CCPM Config (Plugin Defaults)

**Location:** `ccpm/ccpm-config.yaml`

**Purpose:** Default CCPM settings for all projects

**Example:**
```yaml
version: '5.0'

active_project:
  name: "template"
  context_path: "project-contexts/template"

global:
  test_coverage:
    default: 80
    strict_mode: true

  review:
    require_approval: true
    min_reviewers: 1

workflow:
  phases:
    enabled: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  tdd:
    enforcement: 'strict'

agents:
  auto_activation: true
  activation_threshold: 30
  max_active: 5
```

**Scope:** Global, committed to git

**Priority:** 🟢 **MEDIUM** - Default behavior

**When to use:**
- ✅ Plugin-wide defaults
- ✅ Agent settings
- ✅ Global workflow rules

---

### 5. Hard-coded Defaults (Lowest Priority)

**Location:** Built into agent definitions and command logic

**Purpose:** Fallback values when nothing else is set

**Example:**
```typescript
// In agent code
const testCoverage = config.test_coverage || 80;
const tddMode = config.tdd_enforcement || 'recommended';
```

**Scope:** Plugin code

**Priority:** 🔵 **LOWEST** - Only used as last resort

**When to use:**
- ✅ Fallback values
- ✅ Safety defaults

---

## Loading Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  User runs: workflow:start "Add feature"       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  1. Load Hard-coded Defaults                    │
│     - test_coverage: 80                         │
│     - tdd_enforcement: 'recommended'            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  2. Load Global CCPM Config                     │
│     ccpm/ccpm-config.yaml                       │
│     - Overrides defaults                        │
│     - Sets plugin-wide behavior                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  3. Load Local Settings                         │
│     ccpm/settings.local.json                    │
│     - User permissions                          │
│     - Auto-approval settings                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  4. Load Project Context Config                 │
│     .claude/project-contexts/[project]/         │
│     - Project tech stack                        │
│     - Project conventions                       │
│     - Team settings                             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  5. Apply Environment Variables                 │
│     ccpm/.envrc or system env                   │
│     - Runtime overrides                         │
│     - Integration credentials                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Final Configuration Applied                    │
│  - Execute workflow with merged config          │
└─────────────────────────────────────────────────┘
```

---

## Configuration Merge Examples

### Example 1: Test Coverage

**Hard-coded Default:**
```typescript
test_coverage: 80
```

**Global Config (`ccpm-config.yaml`):**
```yaml
global:
  test_coverage:
    default: 80
```

**Project Context (`.claude/project-contexts/my-project/project-config.yaml`):**
```yaml
workflow:
  test_coverage_target: 85
```

**Environment Variable:**
```bash
export CCPM_DEFAULT_COVERAGE="90"
```

**Final Value:** `90` (from environment variable)

---

### Example 2: Active Project

**Global Config (`ccpm-config.yaml`):**
```yaml
active_project:
  name: "template"
  context_path: "project-contexts/template"
```

**Environment Variable:**
```bash
export CCPM_PROJECT="my-mobile-app"
export CCPM_PROJECT_CONTEXT="project-contexts/my-mobile-app"
```

**Final Value:**
- Project: `my-mobile-app`
- Context: `project-contexts/my-mobile-app`

---

### Example 3: TDD Enforcement

**Hard-coded Default:**
```typescript
tdd_enforcement: 'recommended'
```

**Global Config:**
```yaml
workflow:
  tdd:
    enforcement: 'strict'
```

**Project Context:**
```yaml
workflow:
  tdd_enforcement: 'strict'
```

**Final Value:** `strict` (from project context and global config)

---

## Configuration Scopes

### Plugin-Wide Configuration
**File:** `ccpm/ccpm-config.yaml`

**Controls:**
- Default agent settings
- Global workflow rules
- Integration defaults
- Safety settings

**Example:**
```yaml
agents:
  auto_activation: true
  max_active: 5

global:
  safety:
    require_confirmation:
      - jira_write
      - git_push
```

---

### Project-Specific Configuration
**File:** `.claude/project-contexts/[project]/project-config.yaml`

**Controls:**
- Tech stack
- Team members
- Conventions
- Project workflow

**Example:**
```yaml
tech_stack:
  primary:
    framework: "React Native"
    language: "TypeScript"

team:
  reviewers:
    frontend: ["dev@example.com"]
```

---

### User-Specific Configuration
**File:** `ccpm/settings.local.json`

**Controls:**
- Permissions
- Auto-approval
- Token warnings

**Example:**
```json
{
  "permissions": {
    "allow": ["Bash(yarn test:*)"]
  },
  "workflow": {
    "token_warning_threshold": 150000
  }
}
```

---

### Runtime Configuration
**Source:** Environment variables

**Controls:**
- Active project
- Integration credentials
- Temporary overrides

**Example:**
```bash
export CCPM_PROJECT="my-project"
export JIRA_API_TOKEN="secret"
export CCPM_DEFAULT_COVERAGE="90"
```

---

## Config File Locations Reference

```
ccpm-team-agents/
├── ccpm/
│   ├── ccpm-config.yaml              # 🟢 Global plugin config
│   ├── settings.local.json            # 🟡 User permissions (gitignored)
│   ├── settings.example.json          # Template for settings.local.json
│   ├── .envrc                         # 🔴 Environment vars (gitignored)
│   ├── .envrc.template                # Template for .envrc
│   │
│   └── project-contexts/
│       ├── template/                  # Template for new projects
│       │   ├── project-config.yaml    # 🟠 Project settings
│       │   ├── conventions.md         # 🟠 Naming conventions
│       │   ├── rules.md               # 🟠 Project rules
│       │   └── examples.md            # 🟠 Code examples
│       │
│       └── [your-project]/            # Your project context
│           ├── project-config.yaml    # 🟠 Project settings
│           ├── conventions.md         # 🟠 Naming conventions
│           ├── rules.md               # 🟠 Project rules
│           └── examples.md            # 🟠 Code examples
```

---

## Best Practices

### ✅ DO

**Global Config (`ccpm-config.yaml`):**
- ✅ Set sensible defaults for all projects
- ✅ Define agent behavior
- ✅ Set safety requirements

**Project Context:**
- ✅ Define tech stack
- ✅ Set team members
- ✅ Document conventions
- ✅ Provide code examples

**Environment Variables:**
- ✅ Store credentials
- ✅ Override for testing
- ✅ Use in CI/CD

**Local Settings:**
- ✅ Configure permissions
- ✅ Set personal preferences

---

### ❌ DON'T

- ❌ Put credentials in config files
- ❌ Commit `.envrc` or `settings.local.json`
- ❌ Hardcode project-specific values in global config
- ❌ Override project context with env vars (except for testing)
- ❌ Put team settings in local settings

---

## Validation

### Check Current Configuration

**Command:**
```bash
# Show active configuration
config:show

# Validate all configs
config:validate
```

**Manual Check:**
```bash
# Check which project is active
grep "active_project" ccpm/ccpm-config.yaml

# Check environment variables
env | grep CCPM
env | grep JIRA
env | grep FIGMA

# Check if project context exists
ls -la .claude/project-contexts/$(grep "name:" ccpm/ccpm-config.yaml | head -1 | cut -d'"' -f2)
```

---

## Troubleshooting

### Configuration Not Loading

**Symptom:** Settings not applied

**Check:**
1. ✅ File exists at correct location
2. ✅ YAML/JSON syntax is valid
3. ✅ Environment variables loaded (run `direnv allow`)
4. ✅ Project context exists
5. ✅ Active project name matches directory

**Debug:**
```bash
# Validate YAML syntax
yamllint ccpm/ccpm-config.yaml

# Validate JSON syntax
jq empty ccpm/settings.local.json

# Check env vars
source ccpm/.envrc
env | grep CCPM
```

---

### Wrong Configuration Applied

**Symptom:** Unexpected behavior

**Check Priority:**
1. Check environment variables first
2. Check project context
3. Check local settings
4. Check global config

**Debug:**
```bash
# Show all config sources
echo "=== Environment Variables ==="
env | grep -E "(CCPM|JIRA|FIGMA|SLACK)"

echo "=== Active Project ==="
grep -A 2 "active_project:" ccpm/ccpm-config.yaml

echo "=== Project Context ==="
cat .claude/project-contexts/*/project-config.yaml 2>/dev/null | head -20
```

---

## Migration Guide

### From v4.0 to v5.0

**Changes:**
- `version: '4.0'` → `version: '5.0'`
- Active project now uses `template` by default
- Settings structure standardized

**Steps:**
1. Update version in `ccpm-config.yaml`
2. Update active project to existing context or `template`
3. Sync `settings.local.json` with `settings.example.json` structure
4. Verify with `config:validate`

---

## Related Documentation

- **INTEGRATION_SETUP_GUIDE.md** - Environment variables and integration setup
- **RULES_COMBINATION.md** - How rules are merged
- **project-contexts/template/README.md** - Project context setup
- **settings.example.json** - Settings template

---

## Support

**Configuration issues?**
- Review this document
- Check `TODO.md` for known issues
- Run `config:validate` command
- See `ccpm/README.md` for troubleshooting

---

**Version:** 5.2.0
**Last Updated:** 2025-11-27
