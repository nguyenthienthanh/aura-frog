# Dual-File Architecture

**Version:** 1.0.0
**Priority:** HIGH - Understanding file organization
**Type:** Rule (Structural Standard)

---

## Core Concept

Aura Frog uses a **dual-file architecture** that separates:
- **Plugin files** (global, shared) - System instructions
- **Project files** (local, per-project) - Customization

---

## Why Dual-File?

### Problem
Claude Code auto-loads `.claude/CLAUDE.md` from project, but NOT plugin files.

### Solution
1. Project `.claude/CLAUDE.md` is lightweight loader
2. It instructs Claude to read plugin CLAUDE.md
3. Single source of truth for system instructions

### Benefits
- No duplication of system instructions
- Easy updates (change plugin, all projects benefit)
- Project-specific overrides when needed
- Clean separation of concerns

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER PROJECT                             │
├─────────────────────────────────────────────────────────────────┤
│  <project>/                                                      │
│  └── .claude/                                                    │
│      ├── CLAUDE.md            ← Loader (points to plugin)       │
│      ├── settings.json        ← Project settings                │
│      ├── settings.local.json  ← Local overrides (git-ignored)   │
│      └── project-contexts/                                       │
│          └── [project-name]/                                     │
│              ├── project-config.yaml   ← Tech stack, team       │
│              ├── conventions.md        ← Naming, structure      │
│              ├── rules.md              ← Project rules          │
│              └── examples.md           ← Code examples          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ "Read plugin CLAUDE.md"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AURA FROG PLUGIN                           │
├─────────────────────────────────────────────────────────────────┤
│  ~/.claude/plugins/marketplaces/aurafrog/aura-frog/             │
│  ├── CLAUDE.md              ← ALL system instructions           │
│  ├── .claude-plugin/                                             │
│  │   └── plugin.json        ← Plugin manifest                   │
│  ├── agents/                ← 24 specialized agents             │
│  ├── commands/              ← 70+ commands                      │
│  ├── rules/                 ← 25+ quality rules                 │
│  ├── skills/                ← 20+ skills                        │
│  ├── templates/             ← Document templates                │
│  ├── scripts/               ← Bash integration scripts          │
│  ├── hooks/                 ← Workflow hooks                    │
│  └── docs/                  ← Documentation                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Fallback if no project CLAUDE.md
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         GLOBAL CONFIG                            │
├─────────────────────────────────────────────────────────────────┤
│  ~/.claude/                                                      │
│  ├── CLAUDE.md              ← Global instructions (optional)    │
│  ├── settings.json          ← Global settings                   │
│  └── plugins/               ← Installed plugins                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Responsibilities

### Project Files (`.claude/`)

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `CLAUDE.md` | Loader + project overrides | Yes |
| `settings.json` | Project settings | Yes |
| `settings.local.json` | Local secrets/overrides | No |
| `project-contexts/` | Project conventions | Yes |

### Plugin Files (`aura-frog/`)

| Directory | Purpose |
|-----------|---------|
| `CLAUDE.md` | Complete system instructions |
| `agents/` | Agent definitions |
| `commands/` | Command definitions |
| `rules/` | Quality rules |
| `skills/` | Auto/reference skills |
| `templates/` | Document templates |
| `scripts/` | Bash scripts |
| `hooks/` | Workflow hooks |
| `docs/` | Documentation |

### Global Files (`~/.claude/`)

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Global defaults |
| `settings.json` | Global settings |
| `plugins/` | Plugin storage |

---

## Loading Flow

```
1. Claude Code starts
   │
2. Check: Project .claude/CLAUDE.md exists?
   │
   ├─ YES → Load project CLAUDE.md
   │        │
   │        └─ Project says "Read plugin CLAUDE.md"
   │           │
   │           └─ Load plugin CLAUDE.md
   │
   └─ NO → Check: Global ~/.claude/CLAUDE.md exists?
           │
           ├─ YES → Load global CLAUDE.md
           │        │
           │        └─ Global says "Read plugin CLAUDE.md"
           │           │
           │           └─ Load plugin CLAUDE.md
           │
           └─ NO → Plugin not loaded (no Aura Frog)
```

---

## Minimal Project CLAUDE.md

The project CLAUDE.md can be very lightweight:

```markdown
# Project: my-app

## Load Aura Frog
Read and follow: ~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md

## Project Context
Load from: .claude/project-contexts/my-app/

## Overrides (if any)
- Primary agent: mobile-react-native
- Test coverage: 90%
```

---

## When to Modify Each File

### Modify Project CLAUDE.md When:
- Adding project-specific overrides
- Changing primary agent
- Adjusting phase behavior
- Custom approval requirements

### Modify Plugin CLAUDE.md When:
- Updating Aura Frog core behavior
- Adding new agents/skills/rules
- Fixing plugin bugs
- Version updates

### Modify Global CLAUDE.md When:
- Setting defaults for ALL projects
- Personal preferences
- Fallback behavior

---

## Anti-Patterns

### DON'T: Duplicate Plugin Content

```markdown
❌ Project CLAUDE.md:
# Copy-paste of entire plugin CLAUDE.md (500+ lines)
...all the system instructions...
```

### DO: Reference Plugin

```markdown
✅ Project CLAUDE.md:
# Project: my-app
Read: ~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md
```

### DON'T: Put Project Rules in Plugin

```markdown
❌ Plugin CLAUDE.md:
# Rules for my-specific-project
- Use React Native 0.76
- Team lead: John
```

### DO: Put Project Rules in Project Context

```markdown
✅ .claude/project-contexts/my-app/project-config.yaml:
tech_stack:
  framework: "React Native"
  version: "0.76"
team:
  lead: "John"
```

---

## File Location Quick Reference

| What | Where |
|------|-------|
| System instructions | Plugin `CLAUDE.md` |
| Project overrides | Project `.claude/CLAUDE.md` |
| Tech stack config | Project `project-contexts/*/project-config.yaml` |
| Naming conventions | Project `project-contexts/*/conventions.md` |
| Project rules | Project `project-contexts/*/rules.md` |
| Agent definitions | Plugin `agents/*.md` |
| Command definitions | Plugin `commands/**/*.md` |
| Quality rules | Plugin `rules/*.md` |
| Skills | Plugin `skills/**/*.md` |

---

## Initialization Commands

### New Project Setup

```bash
# In your project directory
# Run Aura Frog's project:init command
```

This creates:
```
.claude/
├── CLAUDE.md              # Loader pointing to plugin
└── project-contexts/
    └── [project-name]/
        ├── project-config.yaml
        ├── conventions.md
        ├── rules.md
        └── examples.md
```

### Global Setup (All Projects)

Create `~/.claude/CLAUDE.md`:
```markdown
# Global Instructions
Read: ~/.claude/plugins/marketplaces/aurafrog/aura-frog/CLAUDE.md
```

Now Aura Frog loads for ALL projects, even without project-level `.claude/CLAUDE.md`.

---

**Version:** 1.0.0
**Last Updated:** 2025-11-29
