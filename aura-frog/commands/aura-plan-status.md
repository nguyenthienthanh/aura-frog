# /aura:plan:status

**Render the current plan tree** with status, counts, and storage usage.

---

## Usage

```
/aura:plan:status                      # ASCII tree + summary
/aura:plan:status --detailed           # add per-node revision + deviation_score
```

## Protocol

1. **Validate** plan tree first: `bash aura-frog/scripts/plans/validate-plan-tree.sh`.
2. **Render** ASCII tree: `bash aura-frog/scripts/plans/render-plan-tree.sh`.
3. **Compute summary:**
   - Total nodes per tier (T0/T1/T2/T3/T4)
   - Status counts (planned / active / done / blocked / frozen / discarded)
   - Active path: Mission → Initiative → Feature → Story → Task
   - Token cost (approx) of currently-loaded plan context
4. **Storage usage:**
   - `.aura/plans/traces/` size
   - `.aura/plans/history.jsonl` size
   - `.aura/plans/conflicts.jsonl` size
   - Hard caps from spec §27 — warn at 80% utilization
5. **Surface frozen/blocked count:** if > 0, mention `/aura:plan:conflicts list` (Milestone D+) for details.

## Output format

```
○ MISSION — <one-sentence intent>
├─ ▶ INIT-001 — <intent>
│  ├─ ▶ FEAT-A — Planning foundation
│  │  ├─ ✓ STORY-0001 — Schema + validation
│  │  └─ ▶ STORY-0002 — Plan-loader + active.json
│  │     └─ ▶ TASK-00101 — implement plan-loader

Summary:
  Tiers: T0=1, T1=1, T2=1, T3=2, T4=1
  Status: planned=0, active=4, done=1, blocked=0, frozen=0, discarded=0
  Active: MISSION → INIT-001 → FEAT-A → STORY-0002 → TASK-00101

Storage:
  history.jsonl       42 KB / 100 MB cap
  traces/             125 KB / 10 MB per file
  conflicts.jsonl     0 KB

Token budget (loaded plan context): ~720 / 800 target
```

## Constraints

- Exits 0 even if plan tree is empty (informational, not a validator)
- Validation failure printed inline; does NOT block status display
- Token estimates rely on `4/3 tokens per line` heuristic per spec §1

## Tie-Ins

- **Spec:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §10.1, §27 (storage budget)
- **Scripts:** `validate-plan-tree.sh`, `render-plan-tree.sh`
- **Companion:** `/aura:plan:next` (what to do next), `/aura:plan:undo` (Milestone A part 2)
