# Learning Commands

Commands for the Aura Frog Learning System.

---

## Overview

The learning system enables Aura Frog to improve over time by:
- **Automatic:** Collecting feedback, metrics, agent usage via hooks
- **Manual:** Analyzing patterns and applying improvements via commands

**Full Guide:** `docs/LEARNING_SYSTEM.md`

---

## Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/learn:setup` | Create database schema | First time setup |
| `/learn:status` | Show status and stats | Check if working |
| `/learn:analyze` | Generate insights | Weekly or on-demand |
| `/learn:apply` | Apply improvements | After analysis |

---

## Command Details

### `/learn:setup`

Sets up the Supabase database schema.

**Prerequisites:**
1. Run `bootstrap.sql` in Supabase SQL Editor first
2. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.envrc`

**What it does:**
1. Checks environment variables
2. Verifies bootstrap function exists
3. Creates all tables, views, functions
4. Confirms success

---

### `/learn:status`

Shows learning system status and statistics.

**What it shows:**
- Connection status
- Feedback count
- Workflow metrics count
- Agent success rates
- Pending improvements

---

### `/learn:analyze`

Analyzes collected data and generates insights.

**What it does:**
1. Fetches data from Supabase views
2. Identifies success/failure patterns
3. Generates optimization suggestions
4. Saves new patterns to database
5. Shows analysis report

**Options:**
- `--focus agents` - Focus on agent performance
- `--focus workflows` - Focus on workflow patterns
- `--focus feedback` - Focus on user corrections

---

### `/learn:apply`

Reviews and applies learned improvements.

**What it does:**
1. Fetches pending suggestions
2. Shows each with proposed change
3. Applies if user approves
4. Creates backup before changes
5. Marks as applied in database

**Options:**
- `--auto` - Auto-apply high confidence (≥80%)
- `--preview` - Show without applying
- `--id <id>` - Apply specific suggestion

---

## Quick Start

```bash
# 1. First time setup
/learn:setup

# 2. Verify it's working
/learn:status

# 3. After using Aura Frog for a while...
/learn:analyze

# 4. Apply improvements
/learn:apply
```

---

## Auto vs Manual

| What | How | When |
|------|-----|------|
| Data collection | **Automatic** (hooks) | Every session |
| Send to Supabase | **Automatic** (on session end) | Every session |
| Analysis | **Manual** (`/learn:analyze`) | Weekly recommended |
| Apply changes | **Manual** (`/learn:apply`) | After analysis |

---

## Configuration

Required in `.envrc`:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SECRET_KEY="your-secret-key"
export AF_LEARNING_ENABLED="true"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not configured" | Set env vars, run `source .envrc` |
| "Bootstrap not found" | Run `bootstrap.sql` in Supabase SQL Editor |
| "Table not found" | Run `/learn:setup` |
| Empty results | Use Aura Frog more to collect data |

---

**Version:** 1.0.0
