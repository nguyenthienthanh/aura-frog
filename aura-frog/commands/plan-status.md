# /aura-frog:plan-status

**Render the current plan tree.** Alias for `/aura-frog:plan status` (v3.7.2+).

---

## Usage

```
/aura-frog:plan-status
/aura-frog:plan-status --detailed
```

## Delegation

```bash
bash aura-frog/scripts/plans/validate-plan-tree.sh   # invariants; failure printed but does not block status
bash aura-frog/scripts/plans/render-plan-tree.sh     # ASCII tree
```

Then compute summary (per Tech Spec §10.3): total nodes per tier, status counts, active path, token cost estimate (4/3 tokens-per-line heuristic), storage usage with hard-cap warnings at 80% (per §27).

Full protocol in `commands/plan.md`. Validation failures are informational — they don't block the display.

**Deprecation timeline:** soft-deprecated v3.7.2, warning v4.0, removed v5.0.
