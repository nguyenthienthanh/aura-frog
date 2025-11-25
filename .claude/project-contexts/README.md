# Project Contexts

**Purpose:** Store project-specific configurations, conventions, and examples separate from generic CCPM core.

---

## 📁 Structure

```
project-contexts/
├── README.md                    # This file
├── template/                    # Template for new projects
│   ├── project-config.yaml     # Project configuration
│   ├── conventions.md          # Naming & code conventions
│   └── examples.md             # Project-specific examples
└── [your-project-name]/        # Your project context
    ├── project-config.yaml
    ├── conventions.md
    ├── team.md                 # Team & reviewers (optional)
    └── examples.md
```

---

## 🚀 Quick Start

### For New Projects

1. **Copy template:**
   ```bash
   cp -r .claude/project-contexts/template .claude/project-contexts/my-project
   ```

2. **Customize files:**
   - `project-config.yaml` - Team, tech stack, integrations
   - `conventions.md` - Naming conventions, file structure
   - `examples.md` - Sample tickets, features
   - `team.md` (optional) - Team members, reviewers

3. **Update root config:**
   ```yaml
   # .claude/ccpm-config.yaml
   project:
     name: "my-project"
     context_path: ".claude/project-contexts/my-project"
   ```

4. **CCPM will auto-load your context!**

---

## 📋 What Goes in Project Context?

### project-config.yaml
- Project name and type
- Tech stack details
- Team members and roles
- Regional configurations (if multi-region)
- Reviewer assignments
- Integration credentials (JIRA, Confluence, Slack)
- Custom workflow settings

### conventions.md
- File naming patterns
- Directory structure
- Component naming
- Branch naming
- Commit message format
- Code style specifics
- Framework conventions

### team.md (optional)
- Team roster
- Reviewers by region/platform
- Escalation contacts
- Time zones

### examples.md
- Sample ticket formats
- Common features
- Reference implementations
- Project-specific patterns

---

## 🎯 Benefits

### Separation of Concerns
- ✅ CCPM core stays generic and reusable
- ✅ Project specifics in one place
- ✅ Easy to switch between projects
- ✅ Share CCPM across teams

### Multi-Project Support
- ✅ Work on multiple projects
- ✅ Different tech stacks
- ✅ Different conventions
- ✅ Different teams

### Easy Onboarding
- ✅ New team members see project context
- ✅ Clear conventions
- ✅ Examples to follow
- ✅ Team contacts

---

## 📖 Examples

### Example 1: Mobile App

```
project-contexts/my-mobile-app/
├── project-config.yaml
│   - Tech: React Native, Expo
│   - Platforms: iOS, Android
│   - State: Zustand
│
├── conventions.md
│   - File naming: PascalCase.tsx
│   - Components: features/{feature-name}/
│   - Branch: feature/TICKET-123-description
│
└── examples.md
    - Sample tickets: APP-1234
    - Feature: User authentication
    - Pattern: Phone/tablet variants
```

### Example 2: Web Application

```
project-contexts/my-web-app/
├── project-config.yaml
│   - Tech: Vue 3, Vite
│   - State: Pinia
│   - CSS: BEM methodology
│
├── conventions.md
│   - File naming: kebab-case.vue
│   - Components: src/components/
│   - Branch: feat/WEB-1234-description
│
└── examples.md
    - Sample tickets: WEB-1234
    - Feature: Dashboard
    - Pattern: Composables for logic
```

### Example 3: Backend API

```
project-contexts/my-api/
├── project-config.yaml
│   - Tech: Laravel, PHP 8.2
│   - Database: PostgreSQL
│   - API: RESTful
│
├── conventions.md
│   - Controllers: app/Http/Controllers/
│   - Models: app/Models/
│   - Tests: tests/Feature/
│
└── examples.md
    - Sample tickets: API-1234
    - Feature: User CRUD
    - Pattern: Repository pattern
```

---

## 🔧 How CCPM Uses Context

### Auto-Detection

When CCPM starts, it:
1. Reads `ccpm-config.yaml` for `context_path`
2. Loads project context files
3. Merges with generic CCPM settings
4. Uses project-specific conventions

### Context Priority

```
Project Context > CCPM Config > CCPM Defaults
```

### Usage in Workflows

**Phase 1 (Requirements):**
- Uses project ticket format (from examples.md)
- Follows team structure (from team.md)

**Phase 2 (Technical Planning):**
- Applies naming conventions (from conventions.md)
- Uses tech stack info (from project-config.yaml)

**Phase 5 (Implementation):**
- Follows file structure (from conventions.md)
- Uses code patterns (from examples.md)

**Phase 6 (Code Review):**
- Assigns reviewers (from team.md)
- Checks conventions (from conventions.md)

---

## 🎨 Advanced Usage

### Multiple Environments

```yaml
# project-config.yaml
environments:
  development:
    api_url: "https://dev.api.example.com"
  staging:
    api_url: "https://staging.api.example.com"
  production:
    api_url: "https://api.example.com"
```

### Regional Configurations

```yaml
# project-config.yaml
regions:
  - name: "US"
    code: "us"
    reviewers: ["john@example.com"]
  - name: "EU"
    code: "eu"
    reviewers: ["jane@example.com"]
```

### Custom Workflow Settings

```yaml
# project-config.yaml
workflow:
  test_coverage_target: 85
  tdd_enforcement: strict
  require_design_review: true
  auto_assign_reviewers: true
```

---

## 🔄 Switching Projects

```bash
# Method 1: Update ccpm-config.yaml
project:
  context_path: ".claude/project-contexts/another-project"

# Method 2: Use command
project:switch another-project

# Method 3: Environment variable
export CCPM_PROJECT_CONTEXT=".claude/project-contexts/another-project"
```

---

## 📝 Best Practices

### Do's ✅
- ✅ Keep context files updated
- ✅ Document all conventions
- ✅ Provide clear examples
- ✅ Version control context files
- ✅ Review context during onboarding
- ✅ Update team.md when team changes

### Don'ts ❌
- ❌ Store secrets in context files
- ❌ Mix generic and specific in core CCPM
- ❌ Forget to update conventions
- ❌ Create context without examples
- ❌ Duplicate CCPM core features

---

## 🆘 Troubleshooting

### Context Not Loading?

**Check:**
1. Path in `ccpm-config.yaml` is correct
2. All required files exist
3. YAML syntax is valid
4. No circular references

### Conventions Not Applied?

**Check:**
1. conventions.md format is correct
2. Restart CCPM to reload context
3. Clear workflow state cache
4. Check for typos in convention names

### Examples Not Used?

**Check:**
1. examples.md has proper structure
2. Ticket format matches regex
3. Feature names are clear
4. Patterns are well-documented

---

## 📚 Related Documentation

- Main README: `.claude/README.md`
- Getting Started: `.claude/GET_STARTED.md`
- CCPM Configuration: `.claude/ccpm-config.example.yaml`
- Template Files: `.claude/project-contexts/template/`

---

**Need help creating a project context? Check the template folder!**

