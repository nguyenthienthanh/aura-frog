# Command: metrics:dashboard

**Category:** Metrics
**Priority:** Low
**Syntax:** `metrics:dashboard`

---

## Purpose

Show cumulative token usage and workflow metrics from `.claude/metrics/` data.

---

## Data Source

Token tracker hook saves per-session data to `.claude/metrics/sessions/`:
```
.claude/metrics/
├── sessions/
│   ├── 2026-03-24-abc123.json
│   └── 2026-03-25-def456.json
└── summary.json  (aggregated)
```

---

## Output Format

```markdown
## Aura Frog Metrics Dashboard

### Session Summary (Last 7 Days)

| Metric | Value |
|--------|-------|
| Total sessions | 12 |
| Total tokens | ~485,000 |
| Avg tokens/session | ~40,400 |
| Workflows completed | 8 |
| Workflows failed | 1 |

### Tokens by Phase (Avg)

| Phase | Avg Tokens | Budget | Status |
|-------|-----------|--------|--------|
| 1 - Plan | 2,100 | 2,000 | ⚠️ Over |
| 2 - Test RED | 1,200 | 1,500 | ✅ |
| 3 - Build GREEN | 3,800 | 4,000 | ✅ |
| 4 - Review | 900 | 1,500 | ✅ |
| 5 - Finalize | 400 | 800 | ✅ |

### Top Agents by Usage

| Agent | Sessions | Avg Tokens |
|-------|----------|-----------|
| architect | 6 | 42,000 |
| frontend | 4 | 38,000 |
| tester | 3 | 25,000 |
```

---

## Execution

1. Read all JSON files from `.claude/metrics/sessions/`
2. Aggregate: total tokens, tokens per phase, tokens per agent
3. Calculate averages over last 7 days
4. Compare against token budget from workflow-orchestrator
5. Display as markdown table

---

