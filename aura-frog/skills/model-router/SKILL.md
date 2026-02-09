# Skill: Model Router

**Skill ID:** model-router
**Version:** 1.0.0
**Priority:** 95 (runs after agent-detector)
**Auto-Invoke:** Yes

---

## Purpose

Automatically select the optimal Claude model based on task complexity to reduce costs while maintaining quality. Routes trivial tasks to Haiku, standard tasks to Sonnet, and complex tasks to Opus.

---

## Triggers

- Every task after agent detection
- Explicit model mentions ("use opus", "cheap model")
- Cost-conscious requests ("minimize cost", "quick task")

---

## Model Selection Matrix

```toon
model_matrix[4]{complexity,model,cost_ratio,triggers}:
  trivial,haiku,1x,typo|rename|single line|format|lint fix
  simple,sonnet,3x,bug fix|small feature|refactor file|add test
  complex,sonnet,3x,multi-file|new feature|API endpoint|migration
  architectural,opus,15x,system design|major refactor|security audit|architecture
```

---

## Decision Algorithm

### Step 1: Task Classification

```toon
task_signals[20]{signal,complexity,weight}:
  # Trivial signals (+1 each, trivial if sum ≥ 3)
  typo|spelling,trivial,+3
  rename variable,trivial,+3
  fix lint error,trivial,+3
  update comment,trivial,+2
  format code,trivial,+2
  single file mention,trivial,+1

  # Simple signals (+1 each, simple if sum ≥ 2)
  fix bug,simple,+2
  add validation,simple,+2
  refactor function,simple,+2
  write test for,simple,+2
  update config,simple,+1

  # Complex signals (+1 each, complex if sum ≥ 2)
  new feature,complex,+2
  multiple files,complex,+2
  API endpoint,complex,+2
  database migration,complex,+2
  integration,complex,+1

  # Architectural signals (+2 each, opus if sum ≥ 2)
  system design,architectural,+3
  architecture,architectural,+3
  security audit,architectural,+3
  major refactor,architectural,+2
  performance optimization,architectural,+2
  breaking change,architectural,+2
```

### Step 2: Override Rules

```toon
overrides[6]{condition,force_model,reason}:
  user says "use opus",opus,Explicit request
  user says "use haiku",haiku,Explicit request
  user says "cheap/fast",haiku,Cost preference
  user says "thorough/careful",opus,Quality preference
  security/vulnerability task,opus,Safety critical
  production deployment,opus,Risk management
```

### Step 3: Context Modifiers

```toon
modifiers[4]{context,adjustment,reason}:
  unfamiliar codebase,-1 complexity,Need more exploration
  well-documented project,+1 complexity,Can work faster
  critical path code,-1 complexity,Need more care
  test/mock code,+1 complexity,Lower risk
```

---

## Output Format

When model routing applies, include in response:

```
🎯 Model: [model] | Complexity: [level] | Reason: [why]
```

**Examples:**
```
🎯 Model: haiku | Complexity: trivial | Reason: Single typo fix
🎯 Model: sonnet | Complexity: simple | Reason: Bug fix in auth module
🎯 Model: opus | Complexity: architectural | Reason: Security audit requested
```

---

## Cost Savings Examples

| Task | Without Router | With Router | Savings |
|------|----------------|-------------|---------|
| Fix typo in README | Sonnet (3x) | Haiku (1x) | 66% |
| Rename variable | Sonnet (3x) | Haiku (1x) | 66% |
| Add input validation | Sonnet (3x) | Sonnet (3x) | 0% |
| Design auth system | Sonnet (3x) | Opus (15x) | -400%* |
| Security audit | Sonnet (3x) | Opus (15x) | -400%* |

*Opus costs more but prevents costly mistakes and rework

---

## Integration with Agent Detector

The model-router works WITH agent-detector:

```
1. agent-detector runs → selects primary/secondary agents
2. model-router runs → selects optimal model for task
3. Both results shown in banner
```

**Updated Banner Format:**
```
⚡ 🐸 AURA FROG v1.18.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: ui-expert │ Phase: 4 - Implement                ┃
┃ Model: haiku │ Teams: ✓ enabled                         ┃
┃ 🎯 Trivial task: typo fix │ 🔥 Quick fix incoming!      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## User Controls

Users can override model selection:

```bash
# Force specific model
"Fix this typo, use opus"  → Opus (overridden)

# Request cost optimization
"Quick fix, minimize cost" → Haiku (preference)

# Request thoroughness
"Audit this carefully"     → Opus (preference)
```

---

## Complexity Escalation

If task becomes more complex during execution:

1. **Detect escalation:** Task grew from "fix typo" to "refactor module"
2. **Notify user:** "Task complexity increased. Consider using Sonnet for better results."
3. **Continue or restart:** User decides

---

## Metrics Tracking

Track model usage for optimization:

```toon
metrics[4]{metric,purpose}:
  tasks_by_model,Distribution of task complexity
  cost_per_task,Average cost by complexity
  rework_rate,Tasks needing follow-up by model
  user_overrides,How often users override routing
```

---

## Skip Conditions

Don't route when:
- User explicitly specifies model
- In middle of multi-turn conversation (maintain consistency)
- Task is ambiguous (ask for clarification first)

---

## Related Files

- `skills/agent-detector/SKILL.md` - Agent selection (runs first)
- `rules/context-management.md` - Token optimization rules
- `docs/REFACTOR_ANALYSIS.md` - Cost optimization analysis

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-21
