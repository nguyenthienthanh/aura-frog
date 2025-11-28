# Command: project:init

**Category:** Project  
**Priority:** High  
**Syntax:** `project:init`

---

## Description

Initialize CCPM for a project:
1. Auto-detect project type and structure
2. Index project into `.claude/project-contexts/` for AI understanding
3. Set up `.envrc` to load CCPM integrations
4. Create configuration files
5. Enable workflows to follow project rules and conventions

---

## When to Use

- First time using CCPM in a project
- Reconfiguring CCPM settings
- Switching project types
- Setting up team integrations

---

## Execution Steps

### 0. Create Project .claude/ Folder Structure

**FIRST:** Create `.claude/` folder in user's project (if not exists)

```bash
# Get project root (where user runs commands)
PROJECT_ROOT=$(pwd)

# Create .claude/ structure
mkdir -p "$PROJECT_ROOT/.claude/project-contexts"
mkdir -p "$PROJECT_ROOT/.claude/logs/workflows"
mkdir -p "$PROJECT_ROOT/.claude/logs/figma"
mkdir -p "$PROJECT_ROOT/.claude/logs/jira"
mkdir -p "$PROJECT_ROOT/.claude/logs/audio"
mkdir -p "$PROJECT_ROOT/.claude/context"

# Create .gitkeep files to preserve folder structure
touch "$PROJECT_ROOT/.claude/logs/.gitkeep"
touch "$PROJECT_ROOT/.claude/logs/workflows/.gitkeep"
touch "$PROJECT_ROOT/.claude/logs/figma/.gitkeep"
touch "$PROJECT_ROOT/.claude/logs/jira/.gitkeep"
touch "$PROJECT_ROOT/.claude/logs/audio/.gitkeep"
touch "$PROJECT_ROOT/.claude/context/.gitkeep"

echo "✅ Created .claude/ folder structure"
```

**Resulting structure:**
```
.claude/
├── CLAUDE.md                    # ⚠️ Created in step 6.3 (loader file)
├── settings.local.json          # Created in step 6.2 (git-ignored)
├── project-contexts/[project]/  # Created in step 4 (git-tracked)
│   ├── project-config.yaml
│   ├── conventions.md
│   ├── rules.md
│   └── examples.md
├── logs/                        # Workflow logs (git-ignored)
│   ├── workflows/
│   ├── figma/
│   ├── jira/
│   └── audio/
└── context/                     # Active contexts (git-ignored)
```

**Purpose:**
- `.claude/CLAUDE.md` - **CRITICAL:** Tells Claude to load plugin CLAUDE.md
- `.claude/project-contexts/` - Project context (conventions, rules, examples)
- `.claude/logs/` - Workflow execution logs
- `.claude/context/` - Active workflow contexts
- Keeps project clean, all CCPM data in one place

### 1. Detect Project Name

**Detect project name from (in order):**
1. `package.json` → `name` field (e.g., "my-project")
2. `composer.json` → `name` field (e.g., "vendor/project-name")
3. `pubspec.yaml` → `name` field (e.g., "project_name")
4. Current directory name (fallback)
5. Convert to kebab-case for folder name

**Example:**
- `package.json`: `{"name": "My Project"}` → `my-project`
- `composer.json`: `{"name": "vendor/my-project"}` → `my-project`
- Directory: `/Users/user/Projects/MyApp` → `myapp`

### 2. Detect Existing Configuration

Check if `.claude/project-contexts/[detected-project-name]/` exists:
- If exists → Prompt: "Project context exists. Re-index or update?"
- If not → Fresh initialization

### 3. Deep Project Analysis & Detection

**Scan project structure:**
- Read `package.json`, `composer.json`, `pubspec.yaml`, etc.
- Detect framework: React Native, Vue, Laravel, Flutter, etc.
- Identify key directories: `src/`, `app/`, `features/`, `components/`
- Find configuration files: ESLint, Prettier, TypeScript, etc.
- Detect testing framework: Jest, PHPUnit, Cypress, etc.
- Identify state management: Zustand, Redux, Pinia, etc.
- Find navigation: React Navigation, Vue Router, etc.

**Extract project patterns:**
- File naming conventions (PascalCase, kebab-case, etc.)
- Directory structure patterns
- Import aliases (`@/`, `~/`, etc.)
- Component structure (Phone/Tablet, Region-specific, etc.)
- Testing patterns
- Git branch naming convention

### 4. Index Project Context

**Create `.claude/project-contexts/[detected-project-name]/`:**

#### 4.1. Generate `project-config.yaml`

**Extract from detected project:**

```yaml
project:
  name: "[DETECTED_FROM_PACKAGE_JSON]"  # From package.json name field
  type: "[DETECTED_TYPE]"                # mobile, web, backend, fullstack
  framework: "[DETECTED_FRAMEWORK]"      # React Native, Vue, Laravel, etc.
  language: "[DETECTED_LANGUAGE]"        # TypeScript, JavaScript, PHP, etc.
  
tech_stack:
  # Auto-detect from package.json dependencies
  frontend:
    framework: "[DETECTED_FRAMEWORK_VERSION]"
    ui_library: "[DETECTED_UI_LIBRARY]"
    styling: "[DETECTED_STYLING_LIBRARY]"
  state_management:
    library: "[DETECTED_STATE_LIBRARY]"
    version: "[DETECTED_VERSION]"
  data_fetching:
    library: "[DETECTED_DATA_LIBRARY]"
    version: "[DETECTED_VERSION]"
  navigation:
    library: "[DETECTED_NAV_LIBRARY]"
    type: "[DETECTED_NAV_TYPE]"
  forms:
    library: "[DETECTED_FORM_LIBRARY]"
    validation: "[DETECTED_VALIDATION_LIBRARY]"
  testing:
    unit: "[DETECTED_UNIT_TEST_FRAMEWORK]"
    e2e: "[DETECTED_E2E_TEST_FRAMEWORK]"
    coverage_target: 80  # Default, can be from config

structure:
  # Auto-detect from directory structure
  source_dir: "[DETECTED_SOURCE_DIR]"
  features_dir: "[DETECTED_FEATURES_DIR]"
  components_dir: "[DETECTED_COMPONENTS_DIR]"
  screens_dir: "[DETECTED_SCREENS_DIR]"
  api_dir: "[DETECTED_API_DIR]"
  
conventions:
  # Extract from existing code patterns
  file_naming: "[DETECTED_NAMING_PATTERN]"
  component_structure: "[DETECTED_COMPONENT_STRUCTURE]"
  import_aliases:
    - "[DETECTED_ALIASES]"
  
team:
  # Extract from git config, CODEOWNERS, or code comments
  reviewers:
    [REGION]: "[DETECTED_REVIEWER]"
    
integrations:
  jira:
    enabled: false
    ticket_format: "[DETECTED_TICKET_FORMAT]"  # From git branch patterns
  confluence:
    enabled: false
  slack:
    enabled: false
```

**All values are auto-detected from project files, no hardcoding!**

#### 4.2. Generate `conventions.md`

**Extract from existing code patterns:**

```markdown
# Project Conventions

## File Naming
[DETECTED from existing files]
- Components: [PascalCase/kebab-case/snake_case]
- Utilities: [Detected pattern]
- Screens: [Detected pattern]

## Directory Structure
[Auto-detected from project structure]

## Branch Naming
[DETECTED from git branches]
feature/<TICKET>-<description>
bugfix/<TICKET>-<description>
hotfix/<TICKET>-<description>

## Import Patterns
[DETECTED from existing imports]
- Path aliases: [Detected aliases]
- Import grouping: [Detected pattern]

## Component Patterns
[Extracted from existing components]

## Testing Patterns
[Extracted from existing tests]
```

#### 4.3. Generate `rules.md`

**Extract from ESLint, Prettier, and code patterns:**

```markdown
# Project-Specific Rules

## Code Quality
[DETECTED from ESLint/Prettier configs]
- [Detected rules from .eslintrc]
- [Detected rules from .prettierrc]

## Component Rules
[Detected from component structure]

## Testing Rules
[Detected from test setup]
- Coverage: [From jest.config or package.json]
- Test files: [Detected pattern]

## Git Rules
[Detected from git config and branch patterns]
```

#### 4.4. Generate `examples.md`

**Extract samples from existing codebase:**

```markdown
# Project Examples

## Feature Structure Example
[Sample from src/features/[existing-feature]/]

## Component Example
[Sample from src/components/[existing-component]/]

## Test Example
[Sample from [test-files]]

## API Integration Example
[Sample from src/api/[existing-api].ts]
```

**All examples are real code from the project, not templates!**

### 5. Setup Root .envrc

**Check if `.envrc` exists in project root:**

**If NOT exists:**
```bash
# Create new .envrc
cat > .envrc << 'EOF'
# ==============================================
# Project Environment Variables
# ==============================================
# Add your project-specific env vars here

# ==============================================
# CCPM Integrations (Load from .envrc)
# ==============================================
# All integration configs are in .envrc (git-ignored)
# This keeps secrets out of project .envrc
if [ -f .envrc ]; then
  source_env .envrc
fi
EOF
```

**If EXISTS:**
```bash
# Check if CCPM section already exists
if ! grep -q "CCPM Integrations" .envrc; then
  # Append CCPM section
  cat >> .envrc << 'EOF'

# ==============================================
# CCPM Integrations (Load from .envrc)
# ==============================================
# All integration configs are in .envrc (git-ignored)
# This keeps secrets out of project .envrc
if [ -f .envrc ]; then
  source_env .envrc
fi
EOF
  echo "✅ Added CCPM section to .envrc"
else
  echo "✅ .envrc already has CCPM section"
fi
```

### 6. Create CCPM Config Files

#### 5.1. Generate `ccpm-config.yaml`

**Load template and replace placeholders:**

1. **Load template:** `templates/ccpm-config.yaml.template`

2. **Replace placeholders with detected values:**
   - `[PROJECT_NAME]` → Detected project name (e.g., "my-project")
   - `[PRIMARY_AGENT]` → Detected primary agent (e.g., "mobile-react-native")
   - `[PROJECT_TYPE]` → Detected type (e.g., "mobile", "web", "backend")
   - `[TICKET_FORMAT]` → Detected from git config or project (e.g., "PROJ-####")

3. **Auto-detect additional values:**
   - `main_branch`: Check git branches (default: "develop" or "main")
   - `branch_prefix`: From git conventions (default: "feature")
   - `require_ticket`: From branch naming pattern (if contains ticket format)
   - `linter`: From package.json (eslint, prettier, phpcs, etc.)
   - `formatter`: From package.json (prettier, php-cs-fixer, etc.)
   - `type_check`: From tsconfig.json or PHP version

4. **Create file:** `ccpm-config.yaml`

**Example generated file:**
```yaml
version: "4.5.0"
project_context: "my-project"

workflow:
  default_mode: "auto"
  test_coverage_target: 80
  tdd_enforcement: "strict"
  approval_gates: true
  
agents:
  auto_activate: true
  primary: "mobile-react-native"
  
integrations:
  jira:
    enabled: false
    ticket_format: "PROJ-####"
  confluence:
    enabled: false
  slack:
    enabled: false
  figma:
    enabled: false

project:
  name: "[DETECTED_FROM_PACKAGE_JSON]"
  type: "[DETECTED_TYPE]"
  main_branch: "[DETECTED_MAIN_BRANCH]"

git:
  branch_prefix: "[DETECTED_BRANCH_PREFIX]"
  require_ticket: "[DETECTED_FROM_BRANCH_PATTERNS]"
  commit_format: "[DETECTED_COMMIT_FORMAT]"

quality:
  linter: "[DETECTED_LINTER]"
  formatter: "[DETECTED_FORMATTER]"
  type_check: "[DETECTED_TYPE_CHECK]"
  require_review: "[DETECTED_REVIEW_REQUIREMENT]"
  min_reviewers: "[DETECTED_MIN_REVIEWERS]"
```

#### 6.2. Copy `settings.example.json` to `.claude/settings.local.json`

**Location:** User's project `.claude/settings.local.json` (NOT plugin)

**Check if `.claude/settings.local.json` already exists:**

**If NOT exists:**
```bash
# Get plugin directory
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/ethan-ccpm/ccpm"
PROJECT_ROOT=$(pwd)

# Copy example settings to project .claude/
cp "$PLUGIN_DIR/settings.example.json" "$PROJECT_ROOT/.claude/settings.local.json"
echo "✅ Created .claude/settings.local.json from template"
```

**If EXISTS:**
```bash
echo "✅ .claude/settings.local.json already exists (keeping existing)"
```

**Purpose:**
- `.claude/settings.local.json` contains Claude Code permissions and preferences
- Git-ignored for personal customization
- Users can modify to auto-approve specific commands
- Project-specific settings (not global)

#### 6.3. Create Project `.claude/CLAUDE.md`

**⚠️ CRITICAL: This file is required for Claude Code to load CCPM instructions!**

**Location:** User's project `.claude/CLAUDE.md`

```bash
# Get plugin directory and project info
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/ethan-ccpm/ccpm"
PROJECT_ROOT=$(pwd)
PROJECT_NAME=$(basename "$PROJECT_ROOT")
TECH_STACK="[DETECTED_TECH_STACK]"  # From step 2

# Copy template and replace placeholders
cp "$PLUGIN_DIR/templates/project-claude.md" "$PROJECT_ROOT/.claude/CLAUDE.md"

# Replace placeholders
sed -i '' "s/\[PROJECT_NAME\]/$PROJECT_NAME/g" "$PROJECT_ROOT/.claude/CLAUDE.md"
sed -i '' "s/\[TECH_STACK\]/$TECH_STACK/g" "$PROJECT_ROOT/.claude/CLAUDE.md"

echo "✅ Created .claude/CLAUDE.md (tells Claude to read plugin CLAUDE.md)"
```

**Why This File is Critical:**
- ✅ Claude Code loads `.claude/CLAUDE.md` first (highest priority)
- ✅ This file tells Claude to read the plugin CLAUDE.md
- ✅ Without this, Claude won't know about CCPM agents and workflows
- ✅ Lightweight loader file (not duplicate of plugin CLAUDE.md)

#### 6.4. Setup Project `.envrc`

**Goal:** Create/update project's `.envrc` to load CCPM integration variables

**Get project root directory:**
```bash
# Determine where user's project actually is
# This is where we'll create/update .envrc
PROJECT_ROOT=$(pwd)
```

**Check if project `.envrc` exists:**

**If NOT exists:**
```bash
# Create new project .envrc from template
cat > "$PROJECT_ROOT/.envrc" << 'EOF'
# ==============================================
# Project Environment Variables
# ==============================================
# Add your project-specific env vars here

# Example:
# export API_BASE_URL="http://localhost:3000"
# export NODE_ENV="development"

# ==============================================
# CCPM Integrations
# ==============================================
# Uncomment and configure to enable CCPM integrations

# JIRA Integration
# export JIRA_URL="https://your-company.atlassian.net"
# export JIRA_EMAIL="your-email@company.com"
# export JIRA_API_TOKEN="your-jira-token"
# export JIRA_PROJECT_KEY="PROJ"

# Figma Integration
# export FIGMA_ACCESS_TOKEN="figd_your-token"
# export FIGMA_FILE_KEY="your-file-key"

# Slack Integration
# export SLACK_BOT_TOKEN="xoxb-your-token"
# export SLACK_CHANNEL_ID="C1234567890"

# Confluence Integration
# export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
# export CONFLUENCE_EMAIL="your-email@company.com"
# export CONFLUENCE_API_TOKEN="your-token"
# export CONFLUENCE_SPACE_KEY="TEAM"
EOF

echo "✅ Created .envrc in project root"
echo "⚠️  Run 'direnv allow' to enable environment loading"
```

**If EXISTS:**
```bash
# Check if CCPM section already exists
if ! grep -q "CCPM Integrations" "$PROJECT_ROOT/.envrc"; then
  # Append CCPM section
  cat >> "$PROJECT_ROOT/.envrc" << 'EOF'

# ==============================================
# CCPM Integrations
# ==============================================
# Uncomment and configure to enable CCPM integrations

# JIRA Integration
# export JIRA_URL="https://your-company.atlassian.net"
# export JIRA_EMAIL="your-email@company.com"
# export JIRA_API_TOKEN="your-jira-token"
# export JIRA_PROJECT_KEY="PROJ"

# Figma Integration
# export FIGMA_ACCESS_TOKEN="figd_your-token"
# export FIGMA_FILE_KEY="your-file-key"

# Slack Integration
# export SLACK_BOT_TOKEN="xoxb-your-token"
# export SLACK_CHANNEL_ID="C1234567890"

# Confluence Integration
# export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
# export CONFLUENCE_EMAIL="your-email@company.com"
# export CONFLUENCE_API_TOKEN="your-token"
# export CONFLUENCE_SPACE_KEY="TEAM"
EOF
  echo "✅ Added CCPM section to existing .envrc"
  echo "⚠️  Run 'direnv allow' to reload environment"
else
  echo "✅ .envrc already has CCPM section"
fi
```

**Security:**
- Project `.envrc` is created in user's project directory
- Users can commit this file with commented examples
- Actual tokens should be uncommented and filled by users
- Add `.envrc` to `.gitignore` if it contains secrets

### 7. Validate and Test

**Run validation checks:**
- ✅ Project context created
- ✅ .envrc configured
- ✅ CCPM config valid
- ✅ Can load project conventions
- ✅ Can detect project patterns

---

## Output

```markdown
╔════════════════════════════════════════════════════════════╗
║         ✅  CCPM Initialization Complete!                  ║
╚════════════════════════════════════════════════════════════╝

📊 Project Indexed Successfully:

Project: [DETECTED_PROJECT_NAME]
Type: [DETECTED_TYPE] ([DETECTED_FRAMEWORK] [DETECTED_VERSION])
Path: [PROJECT_PATH]

Tech Stack Detected:
- Framework: [DETECTED_FRAMEWORK] [DETECTED_VERSION]
- State: [DETECTED_STATE_LIBRARY] [DETECTED_VERSION]
- Data: [DETECTED_DATA_LIBRARY] [DETECTED_VERSION]
- Navigation: [DETECTED_NAV_LIBRARY] [DETECTED_NAV_TYPE]
- Forms: [DETECTED_FORM_LIBRARY] + [DETECTED_VALIDATION]
- Testing: [DETECTED_UNIT_TEST] + [DETECTED_E2E_TEST]
- Styling: [DETECTED_STYLING_LIBRARY]

Structure Analyzed:
- Source: [DETECTED_SOURCE_DIR]
- Features: [DETECTED_FEATURES_DIR] ([DETECTED_STRUCTURE_PATTERN])
- Screens: [DETECTED_SCREENS_DIR]
- API: [DETECTED_API_DIR]
- Import Aliases: [DETECTED_ALIASES]

Conventions Detected:
- Components: [DETECTED_COMPONENT_NAMING]
- Utilities: [DETECTED_UTILITY_NAMING]
- Branch: [DETECTED_BRANCH_PATTERN]
- [DETECTED_REGIONS_OR_OTHER_PATTERNS]

Team Reviewers:
[DETECTED_REVIEWERS_FROM_GIT_OR_CODEOWNERS]

📄 Files Created:

✅ .claude/ (project root) - Project-specific CCPM data folder
   ├── settings.local.json          - Claude Code permissions (git-ignored)
   ├── project-contexts/
   │   └── [DETECTED_PROJECT_NAME]/
   │       ├── project-config.yaml  - Tech stack, team config
   │       ├── conventions.md       - File naming, structure, patterns
   │       ├── rules.md             - Project-specific rules
   │       └── examples.md          - Code examples from project
   ├── logs/                        - Workflow execution logs (git-ignored)
   │   ├── workflows/               - Phase deliverables
   │   ├── figma/                   - Figma design data
   │   ├── jira/                    - JIRA ticket data
   │   └── audio/                   - Voice narration (if enabled)
   └── context/                     - Active workflow contexts (git-ignored)

✅ .envrc (project root)
   - Created/updated with CCPM integration section
   - Contains commented examples for JIRA, Figma, Slack, Confluence
   - Users should uncomment and fill in actual tokens
   - Run 'direnv allow' to enable
   - Consider adding to .gitignore if contains secrets

✅ ccpm-config.yaml (plugin root: ~/.claude/plugins/.../ccpm/)
   - Generated from template with detected values
   - Version: 5.2.0
   - Project context reference: .claude/project-contexts/[DETECTED_PROJECT_NAME]/
   - Primary agent: [DETECTED_PRIMARY_AGENT]
   - Workflow settings: auto mode, [DETECTED_COVERAGE]% coverage, strict TDD
   - Git config: [DETECTED_BRANCH_PREFIX]/* branches, [TICKET_REQUIREMENT]
   - Quality: [DETECTED_LINTER] + [DETECTED_FORMATTER], [TYPE_CHECK_STATUS]

📚 How Workflows Use This:

When you run workflow:start or any command:

1. ✅ Claude loads .claude/project-contexts/[project]/project-config.yaml
2. ✅ Reads .claude/project-contexts/[project]/conventions.md for naming/structure
3. ✅ Applies .claude/project-contexts/[project]/rules.md for quality standards
4. ✅ References .claude/project-contexts/[project]/examples.md for patterns
5. ✅ Follows detected tech stack and patterns
6. ✅ Assigns correct reviewers per region
7. ✅ Saves logs to .claude/logs/workflows/[workflow-id]/

Example:
workflow:start "Add user profile screen"
→ Claude knows:
  - Must follow [DETECTED_COMPONENT_STRUCTURE]
  - Must handle [DETECTED_REGIONS_OR_PATTERNS]
  - Use [DETECTED_STATE_LIBRARY] for state
  - Use [DETECTED_FORM_LIBRARY] + [DETECTED_VALIDATION] for forms
  - Use [DETECTED_STYLING_LIBRARY] for styling
  - Test with [DETECTED_UNIT_TEST] ([DETECTED_COVERAGE]% coverage)
  - Assign [DETECTED_REVIEWER] as reviewer

📚 Next Steps:

1. Configure integrations (optional):
   setup:integrations

2. Review project context:
   .claude/project-contexts/my-project/

3. Start your first workflow:
   workflow:start "Your task"

4. All workflows will now follow your project rules! ✨

✅ CCPM is ready and project-aware!
```

---

## Example Usage

### Example 1: Fresh Initialization

```
You: project:init

Claude:
🔍 Analyzing project structure...

📦 Scanning files:
   ✅ Found package.json
   ✅ Detected project name: [name from package.json]
   ✅ Detected framework: [framework] [version]
   ✅ Found [config file] config
   ✅ Detected state management: [state library]
   ✅ Found [data library]
   ✅ Detected [structure pattern]

📂 Analyzing structure:
   ✅ [source_dir]/ - Main source directory
   ✅ [features_dir]/ - Feature-based architecture
   ✅ [screens_dir]/ - Screen components
   ✅ [api_dir]/ - API layer
   ✅ [components_dir]/ - Shared components
   ✅ [hooks_dir]/ - Custom hooks
   ✅ [utils_dir]/ - Utility functions

📋 Extracting conventions:
   ✅ File naming: [detected pattern] for components
   ✅ Import aliases: [detected aliases]
   ✅ Component structure: [detected structure]
   ✅ Branch naming: [detected branch pattern]

👥 Detected team structure:
   Reviewers from git config, CODEOWNERS, or code comments
   
🔧 Creating project context...
   ✅ project-config.yaml - [lines] lines
   ✅ conventions.md - [lines] lines
   ✅ rules.md - [lines] lines
   ✅ examples.md - [lines] lines

⚙️ Generating CCPM config...
   ✅ Loaded template: templates/ccpm-config.yaml.template
   ✅ Detected primary agent: [detected agent]
   ✅ Detected project type: [detected type]
   ✅ Detected ticket format: [detected format]
   ✅ Detected main branch: [detected branch]
   ✅ Detected linter: [detected linter]
   ✅ Created: ccpm-config.yaml

📝 Setting up .envrc...
   ✅ Added CCPM integration section

✅ Initialization complete! (See full output above)
```

### Example 2: Re-indexing Existing Project

```
You: project:init

Claude:
🔍 Found existing project context: [detected-project-name]

Options:
1. Re-index (scan project again, update all files)
2. Update config only
3. Cancel

Choice [1]: 1

🔄 Re-scanning project...
   ✅ Detected new features: [count] new
   ✅ Updated tech stack versions
   ✅ Found new conventions
   
✅ Project context updated!
```

### Example 3: Different Project Type

```
You: project:init

Claude:
🔍 Analyzing project structure...

📦 Detected: [framework] [version] + [frontend-framework] [version]
   Backend: [backend-language] [version], [backend-framework] [version]
   Frontend: [frontend-framework] [version], [frontend-pattern]
   
📂 Structure:
   ✅ [backend_dir]/ - Backend code
   ✅ [frontend_dir]/ - Frontend code
   ✅ [routes_dir]/ - API routes
   ✅ [tests_dir]/ - [test frameworks]
   
🔧 Creating project context...
   ✅ Detected primary agents: [detected agents]
   ✅ Conventions: [detected conventions]
   
✅ Initialization complete!
```

---

## Important Notes

### Project Context is Critical

**ALL workflows reference .claude/project-contexts:**

When you run `workflow:start`, `bugfix`, `refactor`, etc., Claude will:
1. Load `.claude/project-contexts/[project]/project-config.yaml`
2. Read `.claude/project-contexts/[project]/conventions.md` for naming and structure rules
3. Apply `.claude/project-contexts/[project]/rules.md` for quality standards
4. Reference `.claude/project-contexts/[project]/examples.md` for code patterns
5. Follow tech stack and testing requirements
6. Assign correct reviewers
7. Save logs to `.claude/logs/workflows/[workflow-id]/`

**Without project context, workflows use generic CCPM defaults!**

### Priority Hierarchy

```
Project Context > CCPM Rules > Generic Defaults
```

Example:
- Project conventions.md says: "Use kebab-case for files"
- CCPM default: "Use PascalCase"
- Result: **Workflows use kebab-case** ✅

### Re-index When Project Changes

**For existing projects, use `project:regen` instead:**

Run `project:regen` when:
- New major dependencies added
- Project structure changed
- New team members
- New conventions adopted
- Tech stack versions updated

**Use `project:init` only when:**
- First time setup
- No project context exists
- Want to reset everything
- Switching to different project

### ccpm-config.yaml is Auto-Generated

**File location:** `ccpm-config.yaml`

**What it contains:**
- Project context reference
- Workflow settings (mode, coverage, TDD)
- Primary agent configuration
- Integration settings
- Git configuration
- Code quality settings

**How it's created:**
1. Loads template from `templates/ccpm-config.yaml.template`
2. Replaces placeholders with detected project values
3. Auto-detects: primary agent, project type, ticket format, etc.
4. Creates final config file

**When to update:**
- After major project changes → Run `project:init` again (or use `project:regen` for updates)
- To change workflow settings → Edit manually
- To enable integrations → Use `setup:integrations`

**Priority:**
```
ccpm-config.yaml → References .claude/project-contexts/[project]/
                 → Workflows load both files
```

### Environment Variables

**Project .envrc (root):**
```
.envrc (project root) → Project + CCPM env vars
                      → Contains JIRA/Slack/Figma tokens
                      → Git-ignore if contains secrets
                      → Run 'direnv allow' to enable
```

**Project .claude/ folder:**
```
.claude/
├── settings.local.json          # Claude Code permissions (git-ignored)
├── project-contexts/[project]/  # Project context (git-tracked)
├── logs/                        # Workflow logs (git-ignored)
└── context/                     # Active contexts (git-ignored)
```

**Note:** No project-level CLAUDE.md needed - plugin CLAUDE.md is auto-loaded globally

This keeps all CCPM data organized in one place!

---

## Related Commands

- `project:regen` - Re-generate project context (for existing projects)
- `setup:integrations` - Configure JIRA/Confluence/Slack after init
- `workflow:start` - Start workflow (will use project context)
- `project:detect` - Re-detect project type
- `project:list` - List all indexed projects
- `project:switch` - Switch between projects
- `help` - Show all commands

---

## Technical Details

### Project Name Detection

**Detection order (first match wins):**

1. **package.json** → `name` field
   ```json
   {"name": "my-project"} → "my-project"
   {"name": "My Project"} → "my-project" (converted to kebab-case)
   ```

2. **composer.json** → `name` field
   ```json
   {"name": "vendor/project-name"} → "project-name"
   ```

3. **pubspec.yaml** → `name` field
   ```yaml
   name: my_project → "my-project" (converted to kebab-case)
   ```

4. **Directory name** (fallback)
   ```
   /Users/user/Projects/MyApp → "myapp"
   ```

5. **Convert to kebab-case** for folder name
   - PascalCase → kebab-case
   - snake_case → kebab-case
   - spaces → hyphens

**Result:** Used as folder name in `.claude/project-contexts/[project-name]/`

### What Gets Indexed

**Files scanned:**
- package.json, composer.json, pubspec.yaml
- tsconfig.json, jsconfig.json
- .eslintrc, .prettierrc
- jest.config.js, vitest.config.ts
- Existing source files (sample-based)

**Patterns detected:**
- File naming conventions
- Directory structure
- Import/export patterns
- Component architecture
- Testing patterns
- State management usage
- API integration patterns

**Team info extracted from:**
- Git config
- CODEOWNERS file
- Code comments with @reviewer
- package.json maintainers

### Project Context Format

```yaml
project:
  name: "..."
  type: "mobile|web|backend|fullstack"
  framework: "..."
  
tech_stack:
  [detected technologies]
  
structure:
  [directory structure]
  
conventions:
  [naming, imports, patterns]
  
team:
  [reviewers, leads]
  
integrations:
  [jira, confluence, etc.]
```

### ccpm-config.yaml Generation Process

**Template location:** `templates/ccpm-config.yaml.template`

**Placeholder replacement:**
1. `[PROJECT_NAME]` → From detected project name (Step 1, kebab-case)
2. `[PRIMARY_AGENT]` → From tech stack detection:
   - React Native → `mobile-react-native`
   - Vue.js → `web-vuejs`
   - React → `web-reactjs`
   - Next.js → `web-nextjs`
   - Laravel → `backend-laravel`
   - Python/Django → `backend-python` (when implemented)
   - Go → `backend-go` (when implemented)
3. `[PROJECT_TYPE]` → From project structure:
   - `mobile` → Has React Native/Expo/Flutter
   - `web` → Has Vue/React/Next.js
   - `backend` → Has Laravel/Node.js/Python API
   - `fullstack` → Has both frontend and backend
4. `[TICKET_FORMAT]` → From git branch patterns or project config:
   - Scans existing branches for patterns
   - Detects formats like `PROJ-####`, `PROJ-####`, `TICKET-1234`, etc.
   - Default: `PROJ-####` if not detected

**Auto-detected values:**
- `main_branch`: Checks git branches (develop, main, master)
- `branch_prefix`: From existing branches (feature, bugfix, hotfix)
- `require_ticket`: If branch names contain ticket format
- `linter`: From package.json dependencies (eslint, phpcs, etc.)
- `formatter`: From package.json dependencies (prettier, php-cs-fixer)
- `type_check`: From tsconfig.json or PHP version

**Final file:** `ccpm-config.yaml` (ready to use)

---

**Version:** 2.0.0  
**Last Updated:** 2025-11-25

