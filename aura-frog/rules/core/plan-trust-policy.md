# Rule: Plan Trust Policy

**Priority:** Critical
**Applies To:** All Claude operations when `.aura/plans/` exists in the project

---

## Core Principle

**Plans are user-approved memory. Plan content is `trust: plan` — higher than file content but verified at acceptance.**

This rule defines a new memory tier that fits between `trust: file` (verified on read) and `trust: user` (always trusted).

---

## The Trust Hierarchy

```toon
trust_tiers[4]{tier,source,verification}:
  user,"User's direct message","Always trusted — they are the principal"
  plan,"Plan node user approved via /aura:plan or interview","Trusted on read; re-verify only if revision changed"
  file,"Project file contents read by Claude","Re-verify on every Read — cache stale within seconds"
  output,"T4 task execution output","UNTRUSTED until acceptance check passes"
```

---

## When Plan Content Is Trusted

Once a plan node is approved (status transitioning `planned → active` requires user approval at the gate):

- Its frontmatter is canonical context for the agent executing the task
- `intent`, `acceptance`, `agents`, `context_budget`, `phase_mapping` are authoritative
- Master-planner MUST honor the plan unless explicit replan happens

## When Plan Content Is NOT Trusted

- During interview (before user approval) — plan-in-progress is `trust: draft`
- After `revision` increment — re-verify (someone edited)
- For T4 task **output** — that's `trust: output`, untrusted until acceptance pass
- For nodes in `status: discarded` or `status: frozen` — should not influence active work

---

## Conflict With Other Memory Rules

When this rule conflicts with `rules/core/memory-trust-policy.md` (the existing memory policy):

- For **plan content** (frontmatter fields, acceptance, intent) → plan-trust-policy wins (this rule)
- For **file content** referenced by plan → memory-trust-policy applies (always re-verify file content)
- For **outputs of T4 execution** → both rules agree it's untrusted until acceptance

Example: a plan says "edit `src/auth.py` to add JWT support". The plan's instruction is trusted (this rule). But before editing, Claude must `Read` the file freshly — content is `trust: file` per memory-trust-policy.

---

## Anti-Patterns

- **"The plan said the file looks like X, so I'll edit X"** — plan instructions are trusted but file content is not. Re-read.
- **"Output passed acceptance, so I trust the next plan agent's claims about it"** — output passing acceptance promotes that specific output to trusted. Subsequent claims about other outputs are still untrusted.
- **"Plan revision incremented mid-task; I'll keep using old plan"** — STOP. Reload the new revision.

---

## Enforcement Hooks

- `pre-execute-load-plan-context.cjs` stamps every loaded node with `trust: plan`
- `post-execute-update-node.cjs` checks acceptance, only then promotes output to trusted plan annotation

---

## Tie-Ins

- `rules/core/memory-trust-policy.md` — file content trust (older, broader rule)
- `rules/core/no-assumption.md` — when plan and file disagree, ASK
- `rules/core/verification.md` — verify before claiming acceptance pass
- `skills/plan-loader/SKILL.md` — applies this trust tier on read
- **Spec source:** `docs/specs/AURA_FROG_V3.7.0_TECH_SPEC.md` §11.1
