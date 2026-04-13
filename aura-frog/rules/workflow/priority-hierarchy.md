# Priority Hierarchy

**Priority:** HIGH
**Type:** Rule (Structural Standard)

---

## Core Rule

Claude Code loads instructions in order and MERGES them. Project linting config MERGES with Aura Frog rules (conflicts: project wins).

---

## Loading Order

```
0. Project Linting Config    (HIGHEST) — .eslintrc, .prettierrc, tsconfig.json
1. Project: .claude/CLAUDE.md (HIGH)   — Project-specific overrides
2. Plugin: aura-frog/CLAUDE.md (MED)   — Aura Frog system instructions
3. Global: ~/.claude/CLAUDE.md (LOW)   — User's global defaults
```

---

## Code Quality Merge

```toon
code_quality_merge[5]{priority,source,behavior}:
  1,Project linting,Overrides conflicts in layers 2-5
  2,Project conventions,Overrides conflicts in layers 3-5
  3,Project examples,Overrides conflicts in layers 4-5
  4,Aura Frog rules,Applies where layers 1-3 are silent
  5,Claude defaults,Applies where layers 1-4 are silent
```

**See:** `project-linting-precedence.md` for detailed merge strategy.

---

## Override Behavior

**Additive** (lists merged): agents, skills
**Override** (values replaced): test_coverage, naming conventions

---

## When to Use Each Level

- **Project CLAUDE.md:** Project-specific tech stack, overrides, custom agents
- **Plugin CLAUDE.md:** Standard Aura Frog behavior, core instructions
- **Global CLAUDE.md:** Cross-project defaults, personal preferences

---

## Troubleshooting

- Plugin not loading? Check global `~/.claude/CLAUDE.md` points to plugin
- Overrides not working? Check priority order (project > plugin > global)
- Context not applied? Run `project:init`, verify `.claude/project-contexts/` exists

---

**Last Updated:** 2025-12-10
