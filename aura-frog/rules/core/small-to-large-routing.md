# Rule: Small-to-Large Model Routing — Escalate Only When Needed

**Priority:** HIGH
**Applies To:** All agent invocations where model selection is configurable

---

## Core Principle

**Start with the smallest model that could plausibly succeed. Escalate only on concrete signals that a smaller model is inadequate.**

Always using Opus is wasteful. Always using Haiku is risky. The right answer is conditional.

---

## The Ladder

```
Haiku → Sonnet → Opus
 (fast)    (balanced)   (deep reasoning)
```

### When to start Haiku (default for cheap tasks)

- Classification (`agent-detector`, `scanner`)
- File format detection
- Simple extraction (pull field from JSON)
- Initial skim of known content
- Any task where wrong answer costs little

### When to start Sonnet (default for most work)

- Code generation for single file
- Standard test writing
- Code review (most aspects)
- Feature implementation in known patterns
- Phase 3 Build GREEN for Standard complexity

### When to start Opus (reserve for hard problems)

- Architecture design with multiple conflicting constraints
- Debugging with ambiguous root cause
- Cross-system reasoning (frontend + backend + infra)
- Deep refactors where the whole shape must change
- Hard security reviews

---

## Escalation Signals

Move up the ladder when you see:

| Signal | Action |
|--------|--------|
| Haiku gave contradictory or vague output | → Sonnet |
| Sonnet's draft failed verification (CoVe caught errors) | → Sonnet retry with better prompt OR → Opus |
| Sonnet couldn't keep 3+ constraints consistent | → Opus |
| Output quality oscillates on retry | → Opus (lower-variance model) |
| Task requires reasoning across 3+ files' worth of context | → Opus |
| Test failure persists across 2 Sonnet attempts | → Opus |

---

## De-Escalation Signals

Move DOWN the ladder when you see:

| Signal | Action |
|--------|--------|
| Task is pure extraction/classification | → Haiku |
| Boilerplate generation (scaffolds, fixtures) | → Haiku |
| Iteration N of same refactor (pattern established) | → Sonnet |
| Final formatting / linting fixes | → Haiku |

---

## Enforced Defaults in Aura Frog

| Agent / Skill | Starts at | Escalation trigger |
|---------------|:---------:|-------------------|
| `agent-detector` | Haiku | never (classification task) |
| `scanner` | Haiku | never (detection task) |
| `security` | Sonnet | never (no Opus reviewer value) |
| `strategist` | Sonnet | Complex product strategy → Opus |
| `tester` | Sonnet | never (tests don't benefit) |
| `devops` | Sonnet | never (deployment is procedural) |
| `lead` | inherit | orchestrator matches session |
| `architect` | inherit | matches session — Opus session → Opus |
| `frontend` | inherit | matches session |
| `mobile` | inherit | matches session |

Resolution: Per-agent frontmatter `model:` field > session model. See `README.md#per-agent-model-override`.

---

## Why Small-to-Large (Not Semantic Embeddings)

Embedding-based routing requires infrastructure (embedding API, vector comparison, thresholds). Small-to-Large uses:

- Model behavior signals (agent self-reports confidence/retry)
- Tool-call outcomes (did verification succeed?)
- Task meta-signals (classification vs generation vs reasoning)

These are free, observable in-context, and don't require new infra. Good enough for 90% of routing wins.

---

## Anti-Patterns

- **"Always Opus for safety"** — 5–10× cost with marginal quality gain for most tasks
- **"Always Haiku for speed"** — lose on complex tasks; compensating with retries costs more
- **"Start Haiku, never escalate"** — missing the point of the ladder
- **"Escalate after every minor hiccup"** — ladder becomes a stairway to bankruptcy
- **"Set a fixed model per agent regardless"** — breaks Opus-session users' intent

---

## Tie-Ins

- `README.md` Per-Agent Model Override section — user-facing explanation
- `rules/core/context-management.md` — model selection is part of context strategy
- `rules/workflow/token-time-awareness.md` — model choice is the biggest cost lever
- `skills/agent-detector/SKILL.md` — implements Haiku-first classification
- `rules/core/prompt-caching.md` — smaller models cache same prefix cheaper
