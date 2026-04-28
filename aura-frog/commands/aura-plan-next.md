# /aura:plan:next

**Return the next ready T4 task** (leaf node) for execution.

---

## Usage

```
/aura:plan:next
```

## Protocol

1. **Load** `.aura/plans/active.json` and read `ready_queue`.
2. If `ready_queue` is empty:
   - Walk active T3 (Story) → list T4 children with `status: planned` AND all `depends_on` satisfied
   - Populate `ready_queue` with these IDs
   - If still empty: report "No ready tasks. Run `/aura:plan:expand <story-id>` to decompose."
3. **Pop** first ID from `ready_queue`.
4. **Read** the task file `.aura/plans/features/.../tasks/TASK-NNNNN.md`.
5. **Update node:** `status: active`, `started_at: <now>`.
6. **Update active.json:** `active.task = TASK-NNNNN`.
7. **Append history.jsonl:** `event: task_dispatch` with task ID + dispatching agent.
8. **Surface to user:** task ID, intent, agent, depends_on (proven satisfied), context_budget.

## Output format

```markdown
Next ready task:

**TASK-00101** — implement plan-loader skill skeleton
- Agent: tdd-engineer
- Story: STORY-0042
- Context budget: 2000 tokens
- Acceptance: AC-1 in story.md
- Depends on: (none)

Dispatching to tdd-engineer...
```

## Constraints

- A task is "ready" only if ALL `depends_on` siblings have `status: done`.
- Frozen tasks (status: frozen) are excluded — must be thawed first via `/aura:plan:thaw`.
- If conflict-detector flags conflicts (Milestone D+), `/aura:plan:next` may return a frozen task with a freeze reason instead of dispatching.

## Tie-Ins

- **Spec:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §10.1, §13 (state machine)
- **Updates:** `active.json`, target task's frontmatter, `history.jsonl`
- **Hook:** `post-execute-update-node.cjs` (Milestone A part 2) updates status when task completes
