# /aura:plan:conflicts

**Inspect, resolve, and audit detected plan-tree conflicts.** Backed by `.aura/plans/conflicts.jsonl` (append-only).

---

## Usage

```
/aura:plan:conflicts list                        # all conflicts (open + resolved)
/aura:plan:conflicts list --open                 # open only
/aura:plan:conflicts show <CONFLICT-ID>          # full record + history
/aura:plan:conflicts resolve <CONFLICT-ID> <choice>  # user-priority resolution
/aura:plan:conflicts history                     # arbitration timeline
/aura:plan:conflicts check                       # run conflict-detector against active.task NOW
```

`<choice>` for `resolve`: `accept-proposed | accept-blocker | sequential <which-first> | freeze-both | escalate`.

## Protocol — `list`

1. Read `.aura/plans/conflicts.jsonl` (append-only; latest record per conflict_id is current state)
2. Fold per `conflict_id`: deduplicate by latest entry
3. Filter by `--open` if requested (where `resolution == null`)
4. Render TOON:
   ```toon
   conflicts[N]{conflict_id,layer,participants,status,detected_at}:
     CONFLICT-00007,L1,"TASK-00125 vs TASK-00120",open,2026-05-07T10:30:00Z
     CONFLICT-00008,L2,"TASK-00131 vs TASK-00130",resolved (sequential),2026-05-06T14:00:00Z
   ```

## Protocol — `show <CONFLICT-ID>`

1. Refuse if `<CONFLICT-ID>` does not exist
2. Render full conflict record (all fields per spec §21.4) PLUS arbitration history (all entries from history.jsonl matching this conflict_id)
3. If unresolved: surface `Suggested resolutions:` with the resolution paths from `conflict-arbiter` decision table

## Protocol — `resolve <CONFLICT-ID> <choice>`

1. Refuse if conflict already resolved (no double-resolve; user must reopen via `/aura:plan:freeze ... --conflict <ID>`)
2. Validate `<choice>` is one of: `accept-proposed | accept-blocker | sequential <NODE_ID-first> | freeze-both | escalate`
3. Save checkpoint on each affected participant before mutation
4. Apply per-choice:
   - **accept-proposed** — discard the blocker (status: discarded), thaw the proposed (status: planned)
   - **accept-blocker** — discard the proposed (status: discarded), continue blocker normally
   - **sequential `<NODE_ID-first>`** — set `depends_on: [<other-node>]` on the second; both stay planned
   - **freeze-both** — both transition to frozen with `freeze_reason: user_resolved_conflict_<ID>`
   - **escalate** — append history entry; print "user-escalated; no auto-action — coordinate offline"
5. Update conflicts.jsonl with `resolution: <choice>` + `resolved_at: <ISO>` + `resolved_by: user`
6. Append history.jsonl: `event: conflict_resolved`, `conflict_id`, `choice`, `mutated_nodes: [...]`
7. Render summary: choice + nodes mutated + next steps

## Protocol — `history`

Read history.jsonl, filter to `event: conflict_*` entries, render chronologically as TOON:
```toon
events[N]{ts,event,conflict_id,detail}:
  2026-05-07T10:30:00Z,conflict_detected,CONFLICT-00007,"L1 file overlap"
  2026-05-07T10:31:00Z,conflict_arbitrated,CONFLICT-00007,"freeze proposed"
  2026-05-07T11:45:00Z,conflict_resolved,CONFLICT-00007,"accept-proposed"
```

## Protocol — `check`

Manual invocation of `conflict-detector` skill against the active.task. Useful when you want to see what would happen on dispatch BEFORE the hook fires. Read-only — does NOT mutate plan state.

1. Read `.aura/plans/active.json` for `active.task`
2. Resolve siblings under same parent T3 with status `planned` or `blocked-on-confirm`
3. Run `bash scripts/conflicts/check-l1-files.sh` with task + sibling artifacts
4. If L1 overlap → run `check-l2-syntactic.sh` on the overlapping files
5. Render TOON of findings (no write to conflicts.jsonl — that's reserved for actual dispatch attempts)

## Failure modes

| Failure | Behavior |
|---|---|
| conflicts.jsonl missing | List shows empty; `show` refuses |
| Resolved conflict double-resolved | Refuse — point at original resolution |
| `<NODE_ID-first>` not a participant | Refuse on `sequential` |

## Tie-Ins

- **Spec:** §10.2, §21.4 (conflict record schema), §21.5 (resolution paths)
- **Skill:** `conflict-detector` — primary producer of records
- **Agent:** `conflict-arbiter` — auto-arbitrates; user resolves manually via this command
- **Companion commands:** `/aura:plan:freeze`, `/aura:plan:thaw`
- **Rule:** `rules/workflow/conflict-arbitration-policy.md` — decision table
- **Rule:** `rules/workflow/plan-lifecycle.md` — state transitions on resolve
- **File:** `.aura/plans/conflicts.jsonl` — append-only conflict log
- **File:** `.aura/plans/history.jsonl` — arbitration audit trail
