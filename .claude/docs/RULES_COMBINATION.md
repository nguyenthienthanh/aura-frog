# Rules Combination Strategy

**Version:** 4.5.0  
**Last Updated:** 2025-11-25

---

## 🎯 Overview

CCPM uses a **layered rules system** that combines:
1. **CCPM Core Rules** (`.claude/rules/`) - Generic rules for all projects
2. **Project-Specific Rules** (`project-contexts/[project]/rules.md`) - Project overrides

---

## 📊 Priority Hierarchy

```
Project Context Rules > CCPM Core Rules > Generic Defaults
```

**What this means:**
- ✅ CCPM core rules apply to ALL projects (universal best practices)
- ✅ Project rules can override core rules for project-specific needs
- ✅ If no project rule exists, use core rule
- ✅ If no core rule exists, use generic default

---

## 🔄 How Rules Are Combined

### Step 1: Load CCPM Core Rules

**Location:** `.claude/rules/`

**Files loaded:**
- `tdd-workflow.md` - TDD enforcement (RED-GREEN-REFACTOR)
- `safety-rules.md` - Safety and security rules
- `code-quality.md` - Code quality standards
- `smart-commenting.md` - Commenting guidelines
- `theme-consistency.md` - Theme usage rules
- `direct-hook-access.md` - Hook access patterns
- `correct-file-extensions.md` - File extension rules
- `git-workflow.md` - Git conventions
- `naming-conventions.md` - Naming patterns
- `performance-rules.md` - Performance guidelines
- `kiss-avoid-over-engineering.md` - Simplicity rules
- `approval-gates.md` - Approval workflow
- `cross-review-workflow.md` - Review process

**These are UNIVERSAL** - apply to all projects unless overridden.

### Step 2: Load Project-Specific Rules

**Location:** `project-contexts/[project-name]/rules.md`

**Contains:**
- Project-specific overrides
- Project-specific additions
- Project-specific exceptions

### Step 3: Merge Rules

**Merge strategy:**
1. Start with CCPM core rules (base)
2. Apply project rules on top
3. Project rules override core rules where they conflict
4. Project rules add new rules (don't remove core rules)

**Example merge:**
```markdown
# CCPM Core Rule (.claude/rules/theme-consistency.md)
- Use theme colors, no hardcoded colors
- Use theme spacing, no hardcoded spacing

# Project Rule (project-contexts/my-project/rules.md)
- Use theme colors, no hardcoded colors ✅ (same, no conflict)
- Exception: Brand colors can be hardcoded in brand.ts ✅ (adds exception)

# Result:
- Use theme colors, no hardcoded colors (from core)
- Exception: Brand colors can be hardcoded in brand.ts (from project)
```

---

## 📝 Examples

### Example 1: No Conflict (Additive)

**CCPM Core:**
```markdown
# .claude/rules/tdd-workflow.md
- Write test first (RED)
- Implement code (GREEN)
- Refactor (REFACTOR)
```

**Project Rule:**
```markdown
# project-contexts/my-project/rules.md
- 80% test coverage required
- Use Jest for unit tests
```

**Result:**
- ✅ Write test first (from core)
- ✅ Implement code (from core)
- ✅ Refactor (from core)
- ✅ 80% test coverage (from project)
- ✅ Use Jest (from project)

**Both apply!**

---

### Example 2: Override (Project Wins)

**CCPM Core:**
```markdown
# .claude/rules/naming-conventions.md
- Components: PascalCase.tsx
- Utilities: camelCase.ts
```

**Project Rule:**
```markdown
# project-contexts/my-project/rules.md
- Components: PascalCase.tsx ✅ (same)
- Utilities: kebab-case.ts ❌ (different!)
```

**Result:**
- ✅ Components: PascalCase.tsx (from core, same as project)
- ✅ Utilities: kebab-case.ts (from project, overrides core)

**Project rule wins for utilities!**

---

### Example 3: Project-Specific Addition

**CCPM Core:**
```markdown
# .claude/rules/git-workflow.md
- Branch: feature/<ticket>-<description>
- Commit: conventional commits
```

**Project Rule:**
```markdown
# project-contexts/my-project/rules.md
- Branch: feature/<ticket>-<description> ✅ (same)
- Commit: conventional commits ✅ (same)
- PR: Must include screenshots for UI changes ✅ (new!)
```

**Result:**
- ✅ Branch: feature/<ticket>-<description> (from core)
- ✅ Commit: conventional commits (from core)
- ✅ PR: Must include screenshots (from project, addition)

**Project adds new rule!**

---

## 🎯 Best Practices

### For Project Rules

**DO:**
- ✅ Override only when necessary
- ✅ Add project-specific exceptions
- ✅ Document why you're overriding
- ✅ Keep core rules when possible

**DON'T:**
- ❌ Duplicate core rules (just reference them)
- ❌ Remove core rules (they still apply)
- ❌ Override without reason

**Example:**
```markdown
# project-contexts/my-project/rules.md

## Theme Consistency
- Follows CCPM core rule: theme-consistency.md
- Exception: Brand colors in brand.ts (project-specific)

## TDD Workflow
- Follows CCPM core rule: tdd-workflow.md
- Additional: 80% coverage required (project standard)
```

### For CCPM Core Rules

**DO:**
- ✅ Keep rules generic and reusable
- ✅ Document clearly
- ✅ Make rules optional where possible
- ✅ Allow project overrides

**DON'T:**
- ❌ Make rules too project-specific
- ❌ Hardcode project names
- ❌ Make rules mandatory when they shouldn't be

---

## 🔍 How to Check Which Rules Apply

**When running a workflow:**

1. **Check core rules:**
   ```bash
   ls .claude/rules/
   ```

2. **Check project rules:**
   ```bash
   cat .claude/project-contexts/[project]/rules.md
   ```

3. **See combined result:**
   - Claude loads both
   - Applies merge strategy
   - Shows in workflow output

---

## 📋 Rule Categories

### Universal Rules (Always Apply)

These rules from `.claude/rules/` apply to ALL projects:

1. **TDD Workflow** - Test-driven development
2. **Safety Rules** - Security and safety
3. **Code Quality** - Quality standards
4. **Smart Commenting** - Comment guidelines
5. **Theme Consistency** - Theme usage
6. **Direct Hook Access** - Hook patterns
7. **Correct File Extensions** - File naming
8. **Git Workflow** - Git conventions
9. **Naming Conventions** - Naming patterns
10. **Performance Rules** - Performance guidelines
11. **KISS Principle** - Simplicity
12. **Approval Gates** - Approval workflow
13. **Cross-Review Workflow** - Review process

### Project-Specific Rules

These rules from `project-contexts/[project]/rules.md` can override or add to core:

- Project-specific conventions
- Project-specific exceptions
- Project-specific requirements
- Project-specific patterns

---

## 🚀 Implementation

**When workflow starts:**

```javascript
// Pseudo-code for rule loading
const coreRules = loadAllRules('.claude/rules/');
const projectRules = loadRules(`project-contexts/${project}/rules.md`);

const combinedRules = {
  ...coreRules,           // Base: all core rules
  ...projectRules,        // Override: project rules win
  // Project rules override core rules where they conflict
  // Project rules add new rules (don't remove core)
};

applyRules(combinedRules);
```

**Result:**
- ✅ All core rules apply (unless overridden)
- ✅ Project rules override conflicts
- ✅ Project rules add new rules
- ✅ Workflow follows combined rules

---

## 📚 Related Documentation

- `.claude/rules/` - CCPM core rules
- `project-contexts/[project]/rules.md` - Project-specific rules
- `.claude/CLAUDE.md` - AI instructions (mentions rule loading)
- `.claude/docs/USAGE_GUIDE.md` - Usage guide

---

**Summary:** CCPM combines core rules (universal) with project rules (specific), where project rules override core rules when they conflict. This gives you universal best practices with project-specific flexibility! ✨

