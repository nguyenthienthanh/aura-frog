# Aura Frog Learning System

**Version:** 1.15.0
**Status:** Experimental

The Learning System enables Aura Frog to improve over time by collecting feedback, analyzing patterns, and generating actionable insights stored in Supabase.

**NEW in v1.10:** Memory auto-loads at session start! Learned patterns are fetched from Supabase and cached locally for Claude to apply.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Aura Frog Plugin                          │
├─────────────────────────────────────────────────────────────────┤
│  Hooks (Data Collection)        │  Skills (Analysis)             │
│  ├── feedback-capture.cjs      │  ├── learning-analyzer/        │
│  ├── session-metrics.cjs       │  └── self-improve/             │
│  └── subagent-init.cjs         │                                 │
├─────────────────────────────────┴─────────────────────────────────┤
│  session-start.cjs → af-memory-loader.cjs → Auto-load patterns   │
├─────────────────────────────────────────────────────────────────┤
│  Commands: /learn:analyze, /learn:status, /learn:apply           │
└─────────────────────┬───────────────────────────────────────────┘
                      │ REST API
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                 │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                        │  Views:                        │
│  ├── af_feedback               │  ├── v_agent_success_rates     │
│  ├── af_workflow_metrics       │  ├── v_common_patterns         │
│  ├── af_agent_performance      │  └── v_improvement_suggestions │
│  ├── af_learned_patterns       │                                 │
│  └── af_knowledge_base         │                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Setup

### 1. Environment Variables

Add to your `.envrc` (copy from `.envrc.template`):

```bash
# Supabase Learning System
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_PUBLISHABLE_KEY="your-publishable-key"  # Public key (safe for client)
export SUPABASE_SECRET_KEY="your-secret-key"  # Secret key (keep private!)
export AF_LEARNING_ENABLED="true"
```

**Where to find keys:** Supabase Dashboard → Project Settings → Data API

### 2. Database Schema

**Option A: Automatic Setup (Recommended)**

1. Run `bootstrap.sql` in Supabase SQL Editor (one-time):

   **File:** `scripts/supabase/bootstrap.sql`

2. Run the setup script from Claude Code terminal:

   ```bash
   ./scripts/supabase/setup.sh
   ```

**Option B: Manual Setup**

Copy and paste `scripts/supabase/schema.sql` into Supabase SQL Editor.

### 3. Enable Learning

In your project's `.claude/CLAUDE.md` or global settings:

```yaml
learning:
  enabled: true
  feedback_collection: true
  metrics_collection: true
  auto_analyze: weekly  # Options: disabled, daily, weekly, monthly
```

---

## Automatic Data Collection

The learning system collects data **automatically** via hooks - no manual commands needed for data collection.

### How Auto-Learning Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTOMATIC (Hooks)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Write/Edit → feedback-capture.cjs → Detects corrections        │
│                                                                  │
│  Subagent   → subagent-init.cjs   → Tracks agent usage          │
│                                                                  │
│  Session    → session-metrics.cjs → Sends all metrics           │
│  Stop                               on session end               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     MANUAL (Commands)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /learn:analyze  → Analyze patterns, generate insights          │
│                                                                  │
│  /learn:apply    → Apply learned improvements to plugin         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Memory Auto-Load (NEW in v1.10)

At session start, the `session-start.cjs` hook automatically:

1. **Queries Supabase** for learned patterns, insights, and corrections
2. **Caches locally** to `.claude/cache/memory-context.md`
3. **Sets env vars** for status display:
   - `AF_MEMORY_LOADED` - true/false
   - `AF_MEMORY_COUNT` - number of items
   - `AF_MEMORY_ERROR` - error message (if any)

**What's loaded:**
- Learned patterns (confidence ≥70%)
- Agent success rates
- Recent corrections (last 30 days)
- Recent insights (last 7 days)

**Cache behavior:**
- Cache refreshes if older than 1 hour
- Force refresh: Delete `.claude/cache/memory-context.md`
- Cache location: `.claude/cache/memory-context.md`

**Claude uses memory by:**
1. Reading the cache file at session start
2. Applying patterns to current task
3. Avoiding past mistakes (corrections)

### What's Collected Automatically

| Data | Hook | When |
|------|------|------|
| User corrections | `feedback-capture.cjs` | After every Write/Edit |
| Agent selections | `subagent-init.cjs` | When subagent starts |
| Workflow metrics | `session-metrics.cjs` | On session end |
| Task types | `subagent-init.cjs` | When subagent starts |

---

### Feedback Types

| Type | When Collected | Data Stored |
|------|----------------|-------------|
| **correction** | User corrects AI response | Original + corrected text |
| **approval** | Phase 2/5b approval gate | Approval reason, modifications |
| **rejection** | User rejects at gate | Rejection reason, what was wrong |
| **rating** | User rates response (1-5) | Rating + optional comment |
| **agent_switch** | User overrides agent | Original + selected agent |

### Workflow Metrics

Automatically collected after each workflow:

- Total tokens used per phase
- Duration per phase
- Success/failure status
- Auto-stop triggers (test failures, security issues)
- Code coverage achieved
- Number of retries

### Agent Performance

Tracked for each agent activation:

- Task type handled
- Confidence score
- Success outcome
- User override (did they switch?)

---

## Analysis & Insights

### On-Demand Analysis

```bash
/learn:analyze              # Analyze recent patterns
/learn:analyze --period 30d # Last 30 days
/learn:analyze --focus agents # Focus on agent performance
```

### Generated Insights

The system identifies:

1. **Success Patterns**
   - Which agents perform best for which tasks
   - Optimal workflow configurations
   - Effective prompt patterns

2. **Failure Patterns**
   - Common auto-stop triggers
   - Frequent correction types
   - Problematic phase transitions

3. **Optimization Opportunities**
   - Token usage hotspots
   - Slow phases
   - Underused capabilities

### Applying Learnings

```bash
/learn:apply                # Review and apply suggested improvements
/learn:apply --auto         # Auto-apply high-confidence suggestions
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/learn:status` | Show learning system status and stats |
| `/learn:analyze` | Run pattern analysis |
| `/learn:apply` | Apply learned improvements |
| `/learn:export` | Export learnings to local files |
| `/learn:reset` | Clear learning data (with confirmation) |

---

## Privacy & Data

### What's Stored

- Workflow metadata (not full code)
- Feedback text (corrections, reasons)
- Performance metrics
- Pattern summaries

### What's NOT Stored

- Source code content
- API keys or secrets
- Personal information
- Full conversation logs

### Data Retention

- Feedback: 90 days (configurable)
- Metrics: 1 year
- Patterns: Indefinite (aggregated data)

---

## Troubleshooting

### Learning Not Working

1. Check environment variables: `echo $AF_LEARNING_ENABLED`
2. Verify Supabase connection: `/learn:status`
3. Check logs: `logs/learning/errors.log`

### Missing Data

- Ensure hooks are enabled in `hooks/hooks.json`
- Verify Supabase RLS policies allow inserts
- Check network connectivity

---

## Future Enhancements

- [ ] Real-time pattern alerts
- [ ] Cross-user learning (opt-in, anonymized)
- [ ] ML-based prediction models
- [ ] Integration with project analytics

---

**Version:** 1.15.0 | **Last Updated:** 2026-01-08
