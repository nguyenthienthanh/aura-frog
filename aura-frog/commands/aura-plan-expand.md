# /aura:plan:expand &lt;id&gt;

**Decompose a plan node one tier down.** T1→T2, T2→T3, T3→T4.

---

## Usage

```
/aura:plan:expand FEAT-A             # decompose Feature into Stories
/aura:plan:expand STORY-0042         # decompose Story into Tasks
/aura:plan:expand INIT-001           # decompose Initiative into Features
```

## Protocol

1. **Read** target node by ID. Abort if not found.
2. **Validate** target tier supports expansion (T0 cannot expand directly; expand its T1).
3. **Detect dispatching agent:**
   - T1→T2: feature-architect
   - T2→T3: story-planner
   - T3→T4: story-planner (Phase 1 of TDD pairs here)
4. **Mint child IDs** via `.aura/plans/.counters.json` (atomic increment).
5. **Write child node files** with frontmatter per spec §6.
6. **Update parent's `children: [...]`** array.
7. **Append history.jsonl:** `event: plan_expand` with parent ID, child IDs, dispatching agent.
8. **Update active.json** if expansion happened on the active path.
9. **Render** tree showing the new branch.

## What gets generated

| From → To | Generated content |
|-----------|-------------------|
| T1 → T2 (Features) | 1–4 features with `intent`, `acceptance_summary`, `context_budget` |
| T2 → T3 (Stories) | 2–6 stories per feature, TDD-bounded; each has acceptance criteria + agents |
| T3 → T4 (Tasks) | 1–6 atomic tasks per story with `agent`, `depends_on` (DAG), `artifacts` |

## Constraints

- Don't fabricate detail. If user input is sparse, generate fewer children with explicit "TBD" placeholders.
- Respect `replan_budget` — re-expansion that fails repeatedly should escalate.
- Never expand a node with `status: discarded` or `status: frozen`.

## Tie-Ins

- **Spec:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §10.1, §8.3 (feature-architect), §8.4 (story-planner)
- **Companion:** `/aura:plan:promote <note>` — bubble T4 discoveries up
- **Companion:** `/aura:plan:replan <id>` — rewrite an existing decomposition
