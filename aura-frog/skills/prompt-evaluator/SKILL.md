---
name: prompt-evaluator
description: "Evaluate how you use Claude Code — analyze prompt patterns, feature utilization, and get improvement suggestions. Trigger: /prompts:evaluate, prompt analysis, usage evaluation, how am I using Claude"
autoInvoke: false
priority: 30
triggers:
  - "/prompts:evaluate"
  - "evaluate my prompts"
  - "how am I using Claude"
  - "usage analysis"
  - "prompt patterns"
  - "improve my workflow"
  - "evaluate this prompt"
  - "optimize this prompt"
context: fork
allowed-tools: Read, Bash, Glob, Grep
---

# Prompt Evaluator

Two modes: **Usage Analytics** (how you use Claude Code) and **Prompt Quality** (evaluate/optimize a specific prompt).

**For task-intake validation (before executing a user request), use the 6-dimension benchmark in `rules/core/prompt-validation.md`** — that's a different check (task completeness, not prompt craftsmanship) and should run at `/run` pre-execution per `rules/core/no-assumption.md`.

---

## Mode 1: Usage Analytics

**Trigger:** `/prompts:evaluate [--days N]`

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/metrics/evaluate-prompts.cjs" --days 7
```

Analyzes prompt logs from `.claude/metrics/prompts/{date}.jsonl`. Reports: intent distribution, feature utilization, complexity profile, suggestions, usage score (0-100).

If no data: prompt-logger hook collects automatically. Return after a few sessions.

---

## Mode 2: Prompt Quality Evaluation

**Trigger:** "evaluate this prompt", "optimize this prompt", or user pastes a prompt for review.

### Process

**Step 1 — Classify.** Infer intent, task type (coding/creative/RAG/agent/reasoning), constraints (format, tone, tools), target model.

**Step 2 — Score.** Rate 0-10 on 5 dimensions:

```toon
dimensions[5]{dimension,what_to_check}:
  Clarity,"Is intent unambiguous? Can the model misinterpret?"
  Instruction Quality,"Are steps specific? Is the task decomposed well?"
  Efficiency,"Token waste? Redundant phrasing? Could say the same in fewer words?"
  Robustness,"Edge cases handled? Hallucination controls? Fallback behavior?"
  Output Alignment,"Format specified? Easy to parse? Deterministic output?"
```

Calibration: 0-3 poor, 4-6 acceptable, 7-8 good, 9-10 excellent.

**Step 3 — Detect Issues.** List specific problems:
- Ambiguities that could cause wrong output
- Missing constraints (format, length, tone)
- Redundant instructions (same thing said twice)
- Hallucination risks (no grounding, no source constraint)
- Weak structure (wall of text vs clear sections)
- Token waste (filler phrases, over-explanation of obvious behavior)

**Step 4 — Optimize.** Rewrite in two versions:
1. **Minimal Fix** — preserve structure, fix issues only
2. **Production Version** — fully optimized for token efficiency + determinism

Goals: preserve intent, reduce tokens, improve structure, add missing constraints, ensure parseable output.

### Output Format

```json
{
  "task_type": "...",
  "score": 0-10,
  "breakdown": {
    "clarity": 0-10,
    "instruction": 0-10,
    "efficiency": 0-10,
    "robustness": 0-10,
    "output_alignment": 0-10
  },
  "issues": ["specific issue 1", "specific issue 2"],
  "suggestions": ["actionable suggestion 1"],
  "optimized_prompt": {
    "minimal": "...",
    "production": "..."
  }
}
```

### Evaluation Principles

```toon
principles[6]{principle}:
  Principle > checklist — 3 clear rules beat 20 vague ones
  Show don't tell — one example > paragraph of explanation
  Structured output > prose — JSON/TOON/tables when parseable output needed
  Remove what the model already knows — don't teach coding basics to Claude
  Constraint what varies — only specify behavior the model wouldn't do by default
  Token budget awareness — every word costs money at scale
```

### Anti-Patterns to Flag

```toon
antipatterns[6]{pattern,fix}:
  "You are an expert...",Remove — model capability is fixed by model choice
  "Please note that...",Remove — filler phrase
  "It is important to always...",Rewrite as direct instruction
  Repeating the same rule in 3 sections,Deduplicate — state once
  Explaining what JSON is,Remove — model knows JSON
  Step-by-step for trivial tasks,Remove steps — just state the goal
```
