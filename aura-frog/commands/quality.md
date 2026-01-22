# Command: /quality

**Category:** Quality (Bundled)
**Scope:** Session
**Version:** 2.0.0

---

## Purpose

Unified code quality command. Handles linting, complexity analysis, and code review.

---

## Usage

```bash
# Run all quality checks
/quality

# Specific subcommands
/quality lint [path]
/quality complexity [path]
/quality review [path]
/quality fix
```

---

## Subcommands

| Subcommand | Description | Example |
|------------|-------------|---------|
| `lint [path]` | Run linters | `/quality lint src/` |
| `complexity [path]` | Analyze code complexity | `/quality complexity` |
| `review [path]` | Multi-agent code review | `/quality review` |
| `fix` | Auto-fix linting issues | `/quality fix` |
| `security` | Security-focused scan | `/quality security` |
| `deps` | Check dependency health | `/quality deps` |

---

## Interactive Menu

```
✨ Quality Commands

Last scan: 2 issues found

Quick Actions:
  [1] Run all checks
  [2] Auto-fix issues
  [3] View report

Specific Checks:
  [4] Lint only
  [5] Complexity analysis
  [6] Security scan
  [7] Dependency audit

Review:
  [8] Full code review

Select [1-8] or type command:
```

---

## Quality Report

```markdown
## ✨ Quality Report

**Score:** 85/100 (Good)

### Linting
- ✅ ESLint: 0 errors, 2 warnings
- ✅ Prettier: Formatted
- ✅ TypeScript: No type errors

### Complexity
- ⚠️ High complexity: auth.service.ts (12)
- ✅ Average complexity: 4.2

### Security
- ✅ No vulnerabilities found
- ✅ SAST scan passed

### Dependencies
- ⚠️ 3 outdated packages
- ✅ No known vulnerabilities

### Recommendations
1. Simplify auth.service.ts (split into smaller functions)
2. Update lodash to 4.17.21
```

---

## Related Files

- **Code Reviewer Skill:** `skills/code-reviewer/SKILL.md`
- **Code Simplifier:** `skills/code-simplifier/SKILL.md`
- **Quality Rules:** `rules/code-quality.md`, `rules/kiss-avoid-over-engineering.md`
- **Legacy Commands:** `commands/quality/*.md`

---

**Version:** 2.0.0 | **Last Updated:** 2026-01-21
