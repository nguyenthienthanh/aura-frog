# Command: project:init

**Category:** Project  
**Priority:** High  
**Syntax:** `project:init`

---

## Description

Initialize CCPM for a project:
1. Auto-detect project type and structure
2. Index project into `project-contexts/` for AI understanding
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
# CCPM Integrations (Load from .claude/.envrc)
# ==============================================
# All integration configs are in .claude/.envrc (git-ignored)
# This keeps secrets out of project .envrc
if [ -f .claude/.envrc ]; then
  source_env .claude/.envrc
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
# CCPM Integrations (Load from .claude/.envrc)
# ==============================================
# All integration configs are in .claude/.envrc (git-ignored)
# This keeps secrets out of project .envrc
if [ -f .claude/.envrc ]; then
  source_env .claude/.envrc
fi
EOF
  echo "✅ Added CCPM section to .envrc"
else
  echo "✅ .envrc already has CCPM section"
fi
```

### 6. Create CCPM Config Files

#### 5.1. Generate `.claude/ccpm-config.yaml`

**Load template and replace placeholders:**

1. **Load template:** `.claude/templates/ccpm-config.yaml.template`

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

4. **Create file:** `.claude/ccpm-config.yaml`

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

#### 5.2. Create `.claude/.envrc.template`
```bash
# CCPM Integration Environment Variables
# Copy to .claude/.envrc and fill in your values

# JIRA Integration
# export JIRA_URL="https://your-company.atlassian.net"
# export JIRA_EMAIL="your-email@company.com"
# export JIRA_API_TOKEN="your-jira-token"

# Confluence Integration
# export CONFLUENCE_URL="https://your-company.atlassian.net/wiki"
# export CONFLUENCE_EMAIL="your-email@company.com"
# export CONFLUENCE_API_TOKEN="your-confluence-token"

# Slack Integration
# export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Figma Integration
# export FIGMA_API_TOKEN="your-figma-token"
```

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

✅ .envrc (root)
   - Added CCPM section to source .claude/.envrc

✅ .claude/ccpm-config.yaml
   - Generated from template with detected values
   - Version: 4.5.0
   - Project context: [DETECTED_PROJECT_NAME]
   - Primary agent: [DETECTED_PRIMARY_AGENT]
   - Workflow settings: auto mode, [DETECTED_COVERAGE]% coverage, strict TDD
   - Git config: [DETECTED_BRANCH_PREFIX]/* branches, [TICKET_REQUIREMENT]
   - Quality: [DETECTED_LINTER] + [DETECTED_FORMATTER], [TYPE_CHECK_STATUS]

✅ .claude/project-contexts/[DETECTED_PROJECT_NAME]/
   ├── project-config.yaml   - Full project config (tech stack, team)
   ├── conventions.md        - File naming, structure, patterns
   ├── rules.md              - Project-specific rules
   └── examples.md           - Code examples from project

✅ .claude/.envrc.template
   - Template for JIRA, Confluence, Slack, Figma integrations

📚 How Workflows Use This:

When you run workflow:start or any command:

1. ✅ Claude loads project-config.yaml
2. ✅ Reads conventions.md for naming/structure
3. ✅ Applies rules.md for quality standards
4. ✅ References examples.md for patterns
5. ✅ Follows detected tech stack and patterns
6. ✅ Assigns correct reviewers per region

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
   ✅ Loaded template: .claude/templates/ccpm-config.yaml.template
   ✅ Detected primary agent: [detected agent]
   ✅ Detected project type: [detected type]
   ✅ Detected ticket format: [detected format]
   ✅ Detected main branch: [detected branch]
   ✅ Detected linter: [detected linter]
   ✅ Created: .claude/ccpm-config.yaml

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

**ALL workflows reference project-contexts:**

When you run `workflow:start`, `bugfix`, `refactor`, etc., Claude will:
1. Load `.claude/project-contexts/[project]/project-config.yaml`
2. Read conventions.md for naming and structure rules
3. Apply rules.md for quality standards
4. Reference examples.md for code patterns
5. Follow tech stack and testing requirements
6. Assign correct reviewers

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

**File location:** `.claude/ccpm-config.yaml`

**What it contains:**
- Project context reference
- Workflow settings (mode, coverage, TDD)
- Primary agent configuration
- Integration settings
- Git configuration
- Code quality settings

**How it's created:**
1. Loads template from `.claude/templates/ccpm-config.yaml.template`
2. Replaces placeholders with detected project values
3. Auto-detects: primary agent, project type, ticket format, etc.
4. Creates final config file

**When to update:**
- After major project changes → Run `project:init` again (or use `project:regen` for updates)
- To change workflow settings → Edit manually
- To enable integrations → Use `setup:integrations`

**Priority:**
```
ccpm-config.yaml → References project-contexts/[project]/
                 → Workflows load both files
```

### .envrc Separation

```
.envrc (root)          → Project env vars (git-tracked)
                         Sources .claude/.envrc

.claude/.envrc         → CCPM integrations (git-ignored)
                         Contains JIRA/Slack tokens
```

This keeps secrets separate from project configuration!

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

**Template location:** `.claude/templates/ccpm-config.yaml.template`

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

**Final file:** `.claude/ccpm-config.yaml` (ready to use)

---

**Version:** 2.0.0  
**Last Updated:** 2025-11-25

