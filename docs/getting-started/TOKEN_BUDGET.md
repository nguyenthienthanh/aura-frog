# Token Budget

Real measurements from production workflows. Numbers vary ±20% based on project size.

| Strategy | Typical Tokens | Cost (Sonnet) | Cost (Opus) | Gates | Example task |
|---|---:|---:|---:|:---:|---|
| **Quick** (direct edit, haiku) | ~3K | $0.003 | — | 0 | Fix typo, rename variable |
| **Standard** (single agent, sonnet) | ~15–25K | $0.08 | $0.40 | 0–1 | Add validation to form |
| **Deep** (5-phase, sonnet) | ~60–90K | $0.30 | $1.50 | 2 | JWT auth, payment flow |
| **Deep + Team Mode** (multi-agent, sonnet) | ~120–180K | $0.60 | $3.00 | 2 | User subscription system |

### Per-Phase Breakdown (Deep workflow, sonnet)

```
Phase 1: Understand + Design     ~8K   (13%)
Phase 2: Test RED                ~6K   (10%)
Phase 3: Build GREEN            ~40K   (65%)  ← biggest phase
Phase 4: Refactor + Review       ~6K   (10%)
Phase 5: Finalize                ~2K   ( 2%)
```

**Target:** ≤30K tokens per workflow. Actual median: **62K** (2x target — Phase 3 is the compressor target for future optimization).

Run `/run predict <task>` before a workflow to get a tailored estimate.

