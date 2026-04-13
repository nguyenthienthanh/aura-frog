# Metrics Commands

Token usage tracking, hook profiling, plugin performance measurement, and prompt evaluation.

---

## /metrics:dashboard

**Trigger:** `metrics:dashboard`

Show cumulative token usage and workflow metrics from `.claude/metrics/` data. Aggregates session JSON files over last 7 days. Displays: total sessions, total tokens, avg tokens/session, workflows completed/failed, tokens by phase vs budget (with over-budget warnings), and top agents by usage. Data source: `.claude/metrics/sessions/*.json`.

---

## /metrics:hooks

**Trigger:** `metrics:hooks [--iterations N]`

Profile all registered hooks: execution time, output size, token estimate. Runs `aura-frog/scripts/profile-hooks.sh` with configurable iterations (default 3). Color-coded results: green <100ms, yellow 100-1000ms, red >1000ms. Flags hooks whose output exceeds 500 tokens (context bloat risk).

**Usage:** `metrics:hooks --iterations 5`

---

## /metrics:performance

**Trigger:** `metrics:performance`

Run plugin performance measurement via `aura-frog/scripts/measure-performance.sh`. Reports context overhead, token estimates, component inventory, and codebase stats. All numbers are real, measured from installed plugin files.

---

## /prompts:evaluate

**Trigger:** `prompts:evaluate [options]`

Evaluate how you use Claude Code. Analyzes prompt quality (length, detail, context), feature utilization (skills/commands/agents used vs available), intent distribution (implement/debug/review/test/question), session efficiency (prompts per session, correction rate), workflow adoption, and gaps (unused features). Outputs a scored report (0-100) with prioritized improvement suggestions. Data: `.claude/metrics/prompts/*.jsonl`.

**Usage:** `prompts:evaluate --days 30 --focus efficiency`

---

## Related

- **Skills:** `prompt-evaluator`, `learning-analyzer`
- **Commands:** `learn:status`, `learn:analyze`
