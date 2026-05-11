---
name: tree-of-thoughts
description: "Branch, evaluate, prune, expand — structured search over solution space. Use for architecture with multi-step decisions, refactor planning, or complex debug hypothesis trees. Paper: Yao et al. 2023."
when_to_use: "architecture decision with branching, refactor planning, debug hypothesis tree, reason: tot, deep complexity multi-step design"
allowed-tools: Read, Grep, Glob, Bash
effort: high
user-invocable: false
---

# Tree of Thoughts

For problems with a branching solution space where some paths become clearly weaker as you explore.

**Governed by:** `rules/workflow/tree-of-thoughts.md` (when / why)

---

## When NOT to Use

- Linear problems (one obvious path)
- Quick/Standard complexity — too expensive
- User said `just do:` / `must do:`
- Token budget projects >120K for workflow

---

## Default Parameters

- **Breadth:** 3 (branches per node)
- **Depth:** 3 (levels deep)
- **Pruning threshold:** evaluation score < 6/10 → prune branch
- **Max leaves:** 9 before pruning, typically 3–5 after

---

## The Protocol

### Step 1 — State the root

Write the problem as a single question or goal:

> "Refactor the auth service without breaking existing tokens"

### Step 2 — Generate Depth-1 branches

Propose 2–3 high-level approaches:

```
Branch A: Big-bang rewrite, feature-flag rollout
Branch B: Strangler fig — new code alongside old, migrate routes one by one
Branch C: Adapter layer — new interface wrapping old implementation
```

### Step 3 — Evaluate each (rubric)

For each branch, score 0–10 on:

| Criterion | Weight | Score |
|-----------|:------:|:-----:|
| Feasibility with current team | 30% | /10 |
| Token/implementation cost | 20% | /10 |
| Rollback safety | 25% | /10 |
| Preserves existing tokens (constraint) | 25% | /10 |

Total = weighted sum. Prune any branch < 6/10.

### Step 4 — Expand surviving branches (Depth 2)

For each survivor, propose 2–3 sub-steps. Score again. Prune again.

### Step 5 — Expand to Depth 3 (leaves)

For each sub-step, propose concrete actions. Score. Prune.

### Step 6 — Pick winning leaf

Highest-scoring leaf is the final plan. Show the **entire path** (root → branch → sub-step → action).

### Step 7 — Output

```markdown
## Plan: [winning leaf]

**Path:**
1. [Root]: Refactor auth without breaking tokens
2. [Branch B — strangler fig] (8.5/10)
3. [Sub-step B2 — route-by-route migration starting with read-only endpoints] (9/10)
4. [Action B2.3 — migrate GET /users, GET /sessions first; POST endpoints last] (9/10)

**Pruned:**
- Branch A (big-bang rewrite): rollback safety 3/10, feasibility 5/10
- Sub-step B1 (all-at-once migration): rollback safety 4/10

**Risks:** [any surviving concerns from pruned branches]
```

---

## Example (debugging)

ToT is especially useful for debugging. Each branch is a hypothesis.

```
Root: "Login fails intermittently in production, works locally"
├── Branch A: Session store issue → score 7/10
│   ├── A1: Redis connection pool exhausted → score 8/10 ← EXPAND
│   └── A2: Cookie domain mismatch → score 5/10 (pruned)
├── Branch B: Load balancer sticky session → score 4/10 (pruned)
└── Branch C: Clock drift in JWT validation → score 6/10
    └── C1: Server NTP misconfigured → score 7/10

Winning leaf: A1 (Redis pool exhausted)
Verification: Check Redis CONFIG GET maxclients + monitor pool stats
```

---

## Anti-Patterns

- **No pruning** — keeping all 9 leaves. Cost explodes; defeats the technique.
- **Cosmetic branches** — 3 branches that are minor variations of the same idea. Should be genuinely different approaches.
- **Over-depth** — going to depth 5+. Rarely changes the final answer; exponential cost.
- **ToT for linear problems** — if there are no real alternatives, ToT is theater.

---

## Tie-Ins

- `rules/workflow/tree-of-thoughts.md` — policy
- `rules/workflow/self-consistency.md` — vote-based technique; ToT is structured search
- `skills/chain-of-verification/SKILL.md` — verify the ToT winning leaf's facts
- `skills/bugfix-quick/SKILL.md` — uses ToT for hypothesis trees (debugging merged into bugfix-quick in v3.5)
- `skills/refactor-expert/SKILL.md` — uses ToT for refactor planning
