# Learn Commands

Learning system commands for collecting feedback, analyzing patterns, and applying improvements via Supabase.

**Prerequisites:** Set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `AF_LEARNING_ENABLED=true` in `.envrc`.

---

## /learn:setup

**Trigger:** `learn:setup` -- first-time database setup.

Creates the Supabase schema (5 tables, 5 views, 3 functions). Requires running `bootstrap.sql` in Supabase SQL Editor first to create the `exec_sql` helper function. The setup script checks environment variables, verifies bootstrap exists, executes all schema statements, and confirms success. Tables: `af_feedback`, `af_workflow_metrics`, `af_agent_performance`, `af_learned_patterns`, `af_knowledge_base`. Uses `CREATE TABLE IF NOT EXISTS` so re-running is safe.

---

## /learn:status

**Trigger:** `learn:status [--brief]` -- show system status and statistics.

Queries Supabase to display connection status, feedback/workflow counts, agent success rates, active patterns, and pending improvements. Shows top agents by success rate and recent activity timestamps. Brief mode outputs a single status line. Claude must actually query Supabase and show real data, not example output.

---

## /learn:feedback

**Trigger:** `learn:feedback [--type <type>] [--message <msg>] [--severity <1-5>]`

Submit manual feedback to Supabase. Five types: **success** (approval), **correction** (you modified output), **agent-issue** (wrong agent selected), **workflow-issue** (phase problem), **suggestion** (improvement idea). Interactive mode prompts for type, details, and severity. Quick mode accepts `--type` and `--message` flags. Auto-detects current agent, recent files, and session ID to reduce manual input.

---

## /learn:analyze

**Trigger:** `learn:analyze [--period 30d] [--focus agents|workflows|feedback]`

Fetches data from all Supabase views (agent rates, workflow trends, patterns, feedback, suggestions) and generates an insight report. Identifies success patterns, failure patterns with root causes, optimization opportunities, and agent routing recommendations. Saves newly discovered patterns back to Supabase. Focus modes narrow analysis to agents, workflows, or feedback specifically.

---

## /learn:apply

**Trigger:** `learn:apply [--auto] [--preview] [--id <pattern_id>]`

Reviews pending improvements from Supabase and applies them interactively. For each suggestion, shows confidence score, frequency, evidence, and a diff of the proposed change. Creates backup before each edit, then marks as applied in Supabase. Auto mode applies all suggestions with confidence >= 80% and frequency >= 5 (max 10/run). Preview mode shows what would change without modifying files. Supports rollback via `/learn:rollback --id <id>`.

---
