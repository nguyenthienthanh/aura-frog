# /aura:plan:promote &lt;note&gt;

**Bubble a T4 (Task) discovery up to T2 (Feature) or T1 (Initiative)** as an architectural insight.

---

## Usage

```
/aura:plan:promote "Existing module X already provides Y — feature scope shrinks"
/aura:plan:promote --to FEAT-007 "Auth needs Redis, not in original feature scope"
/aura:plan:promote --to INIT-001 "We need a new initiative for migration"
```

## Protocol

1. **Detect active T4** from `.aura/plans/active.json`. Abort if no active task.
2. **Determine target tier:**
   - Default: parent's parent (T4 → T2 if no `--to` specified)
   - Override with `--to <id>`
3. **Compose discovery record** with note + source task + timestamp.
4. **Append to target node's `discoveries` field** (create field if missing).
5. **Increment target's `revision`.**
6. **If target is T1/T2 and discovery contradicts an architectural assumption** — flag for replan via `deviation_score += 0.2` (spec §16.2).
7. **Append history.jsonl:** `event: promote` with source task, target, note.

## What constitutes a "promotable" discovery

- "Existing code does X" — reduces feature scope
- "Library Y doesn't behave as documented" — affects design
- "Integration with module Z requires schema change" — affects T1 architecture
- "Performance budget unrealistic" — affects estimation

NOT promotable:
- Implementation details (those stay in trace)
- Test failures (handled by failure-classifier)
- File edits (those are normal task output)

## Constraints

- One promotion per active task (track in node frontmatter to prevent loops)
- Promotion does NOT auto-replan — it FLAGS for human/replanner review
- Cannot promote from `discarded` or `archived` nodes

## Tie-Ins

- **Spec:** §10.1, §16.2 (branch replan triggers — discovery contradiction)
- **Hook:** `post-execute-update-node.cjs` (Milestone B) — auto-prompt promote on certain F-classes
- **Companion:** `/aura:plan:replan` — act on the discovery
