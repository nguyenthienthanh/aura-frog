# Priority Hierarchy

**Version:** 1.1.0
**Priority:** HIGH - Determines how instructions are loaded and merged
**Type:** Rule (Structural Standard)
**Format:** [TOON](https://github.com/toon-format/toon)

---

## Core Rule

Claude Code loads instructions in a specific order. Higher-priority sources ALWAYS override lower-priority ones.

**CRITICAL:** Project linting config (ESLint/TSLint/Prettier) takes precedence over Aura Frog rules.

---

## Loading Order

```
┌─────────────────────────────────────────────────────────┐
│ 0. Project Linting Config            (HIGHEST PRIORITY) │
│    └─ .eslintrc, .prettierrc, tsconfig.json             │
├─────────────────────────────────────────────────────────┤
│ 1. Project: .claude/CLAUDE.md        (HIGH PRIORITY)    │
│    └─ Project-specific overrides                        │
├─────────────────────────────────────────────────────────┤
│ 2. Plugin: aura-frog/CLAUDE.md       (MEDIUM PRIORITY)  │
│    └─ Aura Frog system instructions                     │
├─────────────────────────────────────────────────────────┤
│ 3. Global: ~/.claude/CLAUDE.md       (LOWEST PRIORITY)  │
│    └─ User's global defaults                            │
└─────────────────────────────────────────────────────────┘
```

---

## Code Quality Priority (TOON)

```toon
code_quality_priority[5]{priority,source,examples}:
  1,Project linting,.eslintrc + .prettierrc + tsconfig.json
  2,Project conventions,.claude/project-contexts/[project]/rules.md
  3,Project examples,.claude/project-contexts/[project]/examples.md
  4,Aura Frog rules,aura-frog/rules/*.md
  5,Claude defaults,Built-in training
```

**See:** `rules/project-linting-precedence.md` for detailed linting precedence.

---

## Priority Levels Explained

### Level 1: Project CLAUDE.md (Highest)

**Location:** `<project>/.claude/CLAUDE.md`

**Purpose:**
- Project-specific overrides
- Points to plugin CLAUDE.md
- Custom project rules

**Example:**
```markdown
# Project Instructions

## Load Aura Frog
Read: ~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md

## Project Overrides
- Primary agent: mobile-react-native
- Skip Phase 3 (no UI changes)
- Test coverage: 90% (higher than default)
```

### Level 2: Plugin CLAUDE.md (Medium)

**Location:** `~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md`

**Purpose:**
- Complete Aura Frog system instructions
- Agent definitions
- Workflow rules
- Skills and commands

**Contains:**
- Agent identification banner rule
- 9-phase workflow
- TDD enforcement
- Approval gates
- All core Aura Frog behavior

### Level 3: Global CLAUDE.md (Lowest)

**Location:** `~/.claude/CLAUDE.md`

**Purpose:**
- User's global defaults
- Applies to ALL projects
- Fallback when no project CLAUDE.md

**Example:**
```markdown
# Global Instructions

## Load Aura Frog for all projects
Read: ~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md
```

---

## Context Priority

Beyond CLAUDE.md files, project context also has priority:

```
Project Linting > Project Context > Aura Frog Rules > Generic Defaults
```

### Loading Order for Context

```
0. Project Linting Config (HIGHEST)
   ├── .eslintrc.*            # ESLint rules
   ├── .prettierrc*           # Prettier config
   └── tsconfig.json          # TypeScript settings

1. .claude/project-contexts/[project]/
   ├── project-config.yaml    # Tech stack, team
   ├── conventions.md         # Naming, structure
   ├── rules.md               # Project rules (extracted from linting)
   └── examples.md            # Code examples

2. aura-frog/rules/           # Plugin rules (fallback)

3. Claude's training          # Generic defaults (lowest)
```

---

## Override Behavior

### How Overrides Work

| Source | Example Rule | Priority |
|--------|--------------|----------|
| Project | "Test coverage: 90%" | Wins |
| Plugin | "Test coverage: 80%" | Overridden |
| Global | "Test coverage: 70%" | Overridden |

### Merge Strategy

**Additive:** Lists are merged (agents, skills)
```yaml
# Plugin
agents: [mobile-react-native, qa-automation]

# Project (adds to list)
agents: [ui-designer]

# Result
agents: [mobile-react-native, qa-automation, ui-designer]
```

**Override:** Values are replaced
```yaml
# Plugin
test_coverage: 80

# Project (replaces value)
test_coverage: 90

# Result
test_coverage: 90
```

---

## When to Use Each Level

### Use Project CLAUDE.md When:
- Project has specific tech stack
- Need to override default behavior
- Want project-specific agents
- Custom workflow phases needed

### Use Plugin CLAUDE.md When:
- Standard Aura Frog behavior
- Core system instructions
- Shared across all projects

### Use Global CLAUDE.md When:
- Apply Aura Frog to ALL projects
- Personal preferences
- Default fallback behavior

---

## File Locations Summary

| Level | Location | Git Tracked |
|-------|----------|-------------|
| Project | `.claude/CLAUDE.md` | Yes |
| Plugin | `~/.claude/plugins/.../CLAUDE.md` | No (global) |
| Global | `~/.claude/CLAUDE.md` | No (global) |

---

## Best Practices

### DO:
- Keep project CLAUDE.md lightweight (point to plugin)
- Put overrides only in project CLAUDE.md
- Use global CLAUDE.md for cross-project defaults

### DON'T:
- Duplicate plugin content in project CLAUDE.md
- Put project-specific rules in global CLAUDE.md
- Modify plugin CLAUDE.md for project needs

---

## Troubleshooting

### Plugin Not Loading?

1. Check global `~/.claude/CLAUDE.md` points to plugin
2. Or add project `.claude/CLAUDE.md` that points to plugin
3. Verify plugin path is correct

### Overrides Not Working?

1. Check priority order (project > plugin > global)
2. Ensure correct file location
3. Restart Claude Code session

### Context Not Applied?

1. Run `project:init` to create context files
2. Check `.claude/project-contexts/[project]/` exists
3. Verify YAML syntax in project-config.yaml

---

**Version:** 1.1.0
**Last Updated:** 2025-12-10
