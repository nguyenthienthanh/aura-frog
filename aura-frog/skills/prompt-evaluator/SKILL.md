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
context: fork
allowed-tools: Read, Bash, Glob, Grep
---

# Prompt Evaluator Skill

**Type:** Analysis
**Trigger:** `/prompts:evaluate`, on-demand
**Auto-invoke:** No (manual trigger only)

---

## Purpose

Evaluate how the user interacts with Claude Code by analyzing:
- Prompt quality and patterns
- Feature utilization (skills, commands, agents)
- Intent distribution (implement, debug, test, review, question)
- Session efficiency
- Workflow adoption
- Gaps and improvement opportunities

---

## Usage

```bash
/prompts:evaluate              # Last 7 days
/prompts:evaluate --days 30    # Last 30 days
```

---

## Execution

1. Run the evaluation script:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/metrics/evaluate-prompts.cjs" --days 7
```

2. Present the report to the user
3. Highlight top 3 suggestions
4. Offer to explain any suggestion in detail

---

## Data Requirements

Prompt logs are collected automatically by the `prompt-logger` hook.

**Storage:** `.claude/metrics/prompts/{date}.jsonl`
**Retention:** 30 days (auto-cleaned)

If no data exists, inform the user that prompt logging will start automatically and they should return after a few sessions.

---

## Report Sections

```toon
sections[8]{section,content}:
  Overview,"Total prompts, sessions, avg length, peak hours"
  Intent Distribution,"Task type breakdown with visual bars"
  Feature Utilization,"Skills/commands/agents used vs available"
  Complexity Profile,"Types of complex tasks detected"
  Daily Activity,"Visual activity chart"
  Suggestions,"Prioritized improvements (high/medium/low)"
  Gaps,"Unused features and missed opportunities"
  Usage Score,"0-100 score across 5 dimensions"
```

---

## Suggestion Priorities

| Priority | Icon | Meaning |
|----------|------|---------|
| High | 🔴 | Significant improvement opportunity |
| Medium | 🟡 | Moderate improvement |
| Low | 🟢 | Nice to have |

---
