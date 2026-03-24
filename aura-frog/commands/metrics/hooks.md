# Command: metrics:hooks

**Syntax:** `metrics:hooks [--iterations N]`

## Purpose

Profile all registered hooks: execution time, output size, token estimate.

## Execution

```bash
bash aura-frog/scripts/profile-hooks.sh ${ITERATIONS:-3}
```

Color codes: ✅ <100ms, 🟡 100-1000ms, 🔴 >1000ms.
Flags hooks whose output exceeds 500 tokens (context bloat risk).
