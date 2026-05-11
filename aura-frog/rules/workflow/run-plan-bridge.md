# Run ↔ Plan Bridge

Auto-detect when `/aura-frog:run` should anchor to an active hierarchical plan node, or when a task description warrants bootstrapping a plan first. The bridge is deterministic, non-destructive, and always user-overridable.

**Owner skill:** `skills/run-orchestrator/SKILL.md` (Phase 1 setup, between agent-detector and Sprint Contract).
**Owner command:** `commands/run.md` (declares the bridge runs after complexity routing).

---

## Three states

```toon
states[3]{state,trigger,bridge_action}:
  no_plan,".aura/plans/ does not exist OR active.json missing","Heuristic check on task description. If multi-feature/epic → suggest /aura-frog:plan. Else proceed inline."
  plan_idle,"active.json exists, active.feature set, active.task null","Suggest /aura-frog:plan-next to claim the next ready T4 before running freely."
  plan_anchored,"active.json has active.task set","Auto-anchor run-state to that T4 — deliverables write into the plan tree, status transitions sync to .aura/plans/."
```

---

## Anchoring (state: plan_anchored)

When `.aura/plans/active.json#active.task` is set:

1. **Read** the task file at `.aura/plans/features/<feature>/stories/<story>/tasks/<task>.md`.
2. **Populate run-state with anchor block:**
   ```json
   {
     "anchor": {
       "task_id": "TASK-NNNNN",
       "story_id": "STORY-NNNN",
       "feature_id": "FEAT-X",
       "context_budget": <from task frontmatter>,
       "acceptance_refs": [<AC-N from task or story>]
     }
   }
   ```
3. **Sprint Contract negotiation** uses the task's acceptance criteria as the seed — user can amend but not weaken below the plan's contract.
4. **Phase 5 (Finalize)** writes deliverable digests to `.aura/plans/.../tasks/<task>.md` under a `### Run Log` section AND triggers `post-execute-update-node.cjs` to transition the task to `status: done`.

If the task is `frozen`, abort the run with: *"TASK-N is frozen. Thaw via `/aura-frog:plan-thaw <id>` first, or pick a different ready task with `/aura-frog:plan-next`."*

---

## Suggestion (state: plan_idle)

If `active.feature` is set but `active.task` is null:

> Detected an active Feature (FEAT-X) with no claimed task. Run `/aura-frog:plan-next` to dispatch the next ready T4 — the run will auto-anchor to it. Or type `proceed` to run freely (deliverables won't write into the plan tree).

Wait for user input. `proceed` skips the bridge; anything else routes through `/aura-frog:plan-next` then re-enters run-orchestrator with the new anchor.

---

## Escalation heuristic (state: no_plan)

When `.aura/plans/` doesn't exist, scan the task description against these triggers:

```toon
escalation_triggers[6]{signal,weight}:
  multi_feature,"contains 2+ distinct user-facing capabilities (e.g. 'auth + billing + dashboard')",2
  multi_week,"contains 'roadmap', 'epic', 'initiative', 'multi-week', 'over N weeks/months', 'phase 1 of'",2
  shipping_scope,"contains 'ship v', 'v2.0', 'rollout', 'migrate from X to Y', 'launch'",2
  scale_words,"contains 'across N teams', '50+ files', 'monorepo migration', 'org-wide'",1
  cross_session,"contains 'continue from yesterday', 'session reset', 'come back to'",1
  user_explicit,"contains 'plan first', 'decompose', 'hierarchical'",3
```

**Suggest planning if total weight ≥ 3.**

The suggestion is a soft prompt:

> Your task looks like multi-session/multi-feature scope. Recommend `/aura-frog:plan` first to bootstrap T0→T2, then `/aura-frog:plan-expand` for Stories/Tasks. Reply `plan` to bootstrap, or `proceed` to run inline anyway.

Honor `proceed` immediately. Default to inline if no signals match.

---

## Reverse direction — `/aura-frog:plan-next` → `/aura-frog:run`

After `plan-next` claims a task and sets `active.task`, it MUST surface:

> Next ready: **TASK-NNNNN** ({intent}).
> To execute: `/aura-frog:run <one-line description>` — the run will auto-anchor to this task.

The user can also dispatch a different agent manually via the Agent tool — anchoring is an opt-in convenience.

---

## Constraints

- **Never silently mutate** `active.json` — anchoring only reads, never writes (write happens through `plan-next` or `post-execute-update-node`).
- **Force modes** (`must do:`, `just do:`, `exactly:` prefixes) skip the bridge entirely.
- **Sprint Contract weakening** vs plan acceptance criteria requires explicit user override + a `manual_override.json` audit entry.
- **No plan ≠ failure** — most tasks legitimately don't need a plan tree. The bridge biases toward inline execution unless evidence suggests planning helps.

---

## Disable

```
export AF_RUN_PLAN_BRIDGE_DISABLED=true
```

Bypasses all three states. `/run` behaves exactly as in v3.7.0-rc.1 (no plan awareness).

---

## Tie-Ins

- **Skill:** `run-orchestrator` (consumes this rule in Phase 1 setup)
- **Command:** `commands/run.md` (documents bridge in protocol)
- **Command:** `commands/plan-next.md` (reverse-direction suggestion)
- **Hook:** `post-execute-update-node.cjs` (writes task status back to plan tree on Phase 5)
- **Spec:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §10.1, §13
