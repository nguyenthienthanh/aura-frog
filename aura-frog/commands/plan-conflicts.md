# /aura-frog:plan-conflicts

**Inspect, resolve, audit plan-tree conflicts.** Alias for `/aura-frog:plan conflicts <sub>` (v3.7.2+).

---

## Usage

```
/aura-frog:plan-conflicts list                  # all (open + resolved)
/aura-frog:plan-conflicts list --open
/aura-frog:plan-conflicts show <CONFLICT-ID>
/aura-frog:plan-conflicts resolve <CONFLICT-ID> <choice>
/aura-frog:plan-conflicts history
/aura-frog:plan-conflicts check                 # run L1+L2 detector against active.task
```

`<choice>`: `accept-proposed | accept-blocker | sequential | freeze-both | escalate`.

## Delegation

```bash
bash aura-frog/scripts/plans/conflicts-scan.sh <list|show|resolve|history|check> [args...]
```

The script:
- **list** — folds `conflicts.jsonl` per `conflict_id` (latest record wins), optionally filtered by `--open` (records with no `resolution`).
- **show** — prints every record matching `conflict_id`.
- **resolve** — appends a new record with the user's choice + writes `history.jsonl event=conflicts.resolve`. Validates choice against the allowed set.
- **history** — dumps `conflicts.jsonl` raw.
- **check** — runs the `conflict-detector` skill for on-demand L1+L2 detection (Tier-1 per Tech Spec §21); the `pre-dispatch-conflict-check.cjs` hook performs the same automatically before each dispatch.

Full per-choice mutation semantics (accept-proposed discards blocker, sequential sets `depends_on`, freeze-both cascades, etc.) are documented in `commands/plan.md` and the Tech Spec §21.5.

**Deprecation timeline:** soft-deprecated v3.7.2, warning v4.0, removed v5.0.
