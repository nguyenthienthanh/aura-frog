# Command: prompts:evaluate

**Purpose:** Evaluate how you use Claude Code and get improvement suggestions
**Trigger:** `prompts:evaluate [options]`

---

## Usage

```bash
# Default: last 7 days
prompts:evaluate

# Custom period
prompts:evaluate --days 30
prompts:evaluate --days 14

# Focus area
prompts:evaluate --focus efficiency
```

---

## What It Analyzes

```toon
dimensions[6]{dimension,what_it_measures}:
  Prompt Quality,"Avg length, detail level, context provided"
  Feature Utilization,"Skills/commands/agents used vs available"
  Intent Distribution,"Types of tasks (implement, debug, review, test, question)"
  Session Efficiency,"Prompts per session, correction rate"
  Workflow Adoption,"% tasks using structured workflow vs ad-hoc"
  Gaps,"Unused features that could improve your workflow"
```

---

## Output

Generates a markdown report with:

1. **Overview** — Total prompts, sessions, avg length, peak hours
2. **Intent Distribution** — Breakdown by task type with visual bars
3. **Feature Utilization** — Skills, commands, agents used vs available
4. **Complexity Profile** — Types of complex tasks detected
5. **Daily Activity** — Visual activity chart
6. **Suggestions** — Prioritized improvement recommendations (high/medium/low)
7. **Gaps** — Unused features and missed opportunities
8. **Usage Score** — 0-100 score across 5 dimensions

---

## Example Output

```
### Overview
| Metric | Value |
|--------|-------|
| Total prompts | 127 |
| Total sessions | 8 |
| Avg words/prompt | 18 |
| Peak activity hour | 14:00 |

### Suggestions for Improvement
1. 🔴 **Add testing to your workflow**
   Only 3% of prompts involve testing. Try /test-writer.
2. 🟡 **Use workflows for complex tasks**
   Only 8% of implementation tasks use /workflow:start.
3. 🟢 **Check your learning insights**
   Run /learn:status to see captured patterns.

### Usage Score
**72/100** — Proficient
```

---

## Data Sources

```toon
sources[2]{source,location,format}:
  Prompt logs,".claude/metrics/prompts/{date}.jsonl",JSONL (one entry per prompt)
  Session metrics,".claude/metrics/sessions/{date}-{id}.json",JSON (per session)
```

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `AF_PROMPT_LOGGING` | `true` | Enable/disable prompt logging |

---

## Execution

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/metrics/evaluate-prompts.cjs" [--days N]
```

---

**Related:** `learn:analyze`, `workflow:metrics`, `logs:analyze`
