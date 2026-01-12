---
name: code-simplifier
description: "Detect and simplify overly complex code. Apply KISS principle - less is more."
autoInvoke: true
priority: high
triggers:
  - "simplify"
  - "too complex"
  - "make simpler"
  - "reduce complexity"
  - "KISS"
  - "over-engineered"
---

# Skill: Code Simplifier

**Category:** Code Quality
**Version:** 1.0.0
**Rule Reference:** `rules/kiss-avoid-over-engineering.md`

---

## Overview

Detect and simplify overly complex code. Apply KISS principle (Keep It Simple, Stupid).

**Philosophy:** The best code is code you don't have to write. Less is more.

**Full Guide:** Read `rules/kiss-avoid-over-engineering.md` for comprehensive patterns and examples.

---

## Quick Reference

| Signal | Action |
|--------|--------|
| Deep nesting (>3 levels) | Flatten with early returns |
| Long function (>30 lines) | Extract smaller functions |
| Complex conditionals | Use lookup tables |
| Over-abstraction | Inline single-use code |
| Premature optimization | Remove unless profiled |

---

## Complexity Targets

| Metric | Target |
|--------|--------|
| Cyclomatic complexity | ≤10 |
| Nesting depth | ≤3 |
| Function length | ≤30 lines |
| File length | ≤300 lines |
| Parameters | ≤3 |

---

## Simplification Checklist

Before writing or reviewing code, ask:

1. **Can I delete this?** - Unused code, dead branches
2. **Can I inline this?** - Single-use abstractions
3. **Can I flatten this?** - Nested conditions, callbacks
4. **Can I use built-ins?** - Array methods, standard library
5. **Is this needed now?** - YAGNI (You Ain't Gonna Need It)
6. **Would a junior understand?** - If not, simplify

---

## Commands

| Command | Purpose |
|---------|---------|
| `simplify <file>` | Analyze and simplify a file |
| `simplify:check` | Check complexity metrics |
| `quality:complexity` | Full complexity report |

---

## Example Session

```
User: This function is too complex, simplify it

Claude: Let me analyze the complexity...

Complexity Analysis:
- Cyclomatic complexity: 15 (target: ≤10)
- Nesting depth: 5 (target: ≤3)
- Lines: 87 (target: ≤30)

Simplification Plan:
1. Convert nested ifs to early returns (-3 nesting)
2. Extract validation logic to separate function (-20 lines)
3. Replace switch with lookup table (-15 lines, -5 complexity)
4. Remove unused error handling branch

Applying changes...

Result:
- Cyclomatic complexity: 6 ✓
- Nesting depth: 2 ✓
- Lines: 28 ✓
```

---

## Related Resources

- **Full KISS Guide:** `rules/kiss-avoid-over-engineering.md`
- **Complexity Command:** `commands/quality/complexity.md`
- **Refactor Workflow:** `commands/refactor.md`
- **Code Reviewer:** `skills/code-reviewer/SKILL.md`

---

**Remember:** Simple code is not dumb code. It takes skill to write simple code.

---

**Version:** 1.0.0
