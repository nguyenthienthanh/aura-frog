# Command: /bugfix

**Category:** Bug Fixing (Bundled)
**Scope:** Session
**Version:** 2.0.0

---

## Purpose

Unified bug fixing command with severity-based approach selection.

---

## Usage

```bash
# Interactive mode
/bugfix

# Specific severity
/bugfix quick "Login button not working"
/bugfix full "Payment processing fails"
/bugfix hotfix "Production crash"
```

---

## Subcommands

| Subcommand | Description | When to Use |
|------------|-------------|-------------|
| `quick <desc>` | Lightweight 3-gate fix | Simple bugs, clear cause |
| `full <desc>` | Full 9-phase workflow | Complex bugs, unclear cause |
| `hotfix <desc>` | Emergency fix for production | Critical production issues |

---

## Quick vs Full Decision

```toon
approach_selection[3]{approach,when,phases}:
  quick,Clear scope + single file + known cause,Understand → Test → Fix → Verify
  full,Multiple files + unclear cause + regression risk,Full 9-phase workflow
  hotfix,Production down + critical path + emergency,Fix → Deploy → Document later
```

---

## Interactive Menu

```
🐛 Bug Fix Commands

Describe the bug or select approach:

  [1] Quick fix (simple, clear cause)
  [2] Full investigation (complex, unclear)
  [3] Hotfix (production emergency)

Or describe the bug directly:
> _
```

---

## Quick Fix Flow

```
1. UNDERSTAND: Read error, reproduce issue
   ↓
2. TEST: Write failing test that captures bug
   ↓
3. FIX: Implement minimum fix to pass test
   ↓
4. VERIFY: Run full test suite, no regressions
```

---

## Related Files

- **Bugfix Quick Skill:** `skills/bugfix-quick/SKILL.md`
- **Workflow Orchestrator:** `skills/workflow-orchestrator/SKILL.md`
- **Debugging Skill:** `skills/debugging/SKILL.md`
- **Legacy Commands:** `commands/bugfix/*.md`

---

**Version:** 2.0.0 | **Last Updated:** 2026-01-21
