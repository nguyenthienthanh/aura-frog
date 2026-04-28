# /aura:plan:archive &lt;id&gt;

**Compress a completed branch** (T2 Feature or higher with all descendants `done`) into a single summary file.

---

## Usage

```
/aura:plan:archive FEAT-005                  # archive completed feature
/aura:plan:archive INIT-001                  # archive after all features done
```

## Protocol

1. **Validate** target node exists and `status: done`.
2. **Verify all descendants** are `status: done` or `status: discarded` — abort if any active/blocked/frozen.
3. **Run epic-summarizer** (Milestone C+) to produce a summary, OR generate basic stats summary inline:
   - Stories completed, tasks executed
   - Total trace events, hallucination count, logic error count
   - Files touched
   - Time elapsed (created_at → done_at)
4. **Write** `.aura/plans/archive/<id>.summary.md` with the summary.
5. **Move** original node files into `.aura/plans/archive/<id>.original/` (preserves audit trail).
6. **Update** parent's `children` array — replace with summary file ref.
7. **Update** node `status: archived`.
8. **Append history.jsonl:** `event: archive` with id, file_count, total_tokens.
9. If T2 archived: trigger session-reset prompt per spec §19 (Milestone C+).

## What gets archived

- All node `.md` files in subtree → moved to `archive/<id>.original/`
- `traces/<task-id>.jsonl` → kept (compressed `.gz` after 30 days per §27)
- `checkpoints/<id>.*.json` → kept until storage cap

## Constraints

- Archive is one-way (forbidden state transition: `archived → *`)
- Archived nodes do NOT participate in plan-loader's always-loaded context
- Storage cap on archive is unlimited (user manages)

## Tie-Ins

- **Spec:** §10.1, §13 (state machine — archived terminal), §19 (session reset triggers on T2 archive)
- **Skill:** plan-archivist (Milestone C+)
- **Agent:** epic-summarizer (Milestone C+)
- **Companion:** `/aura:reset-session` — what runs after T2 archive
