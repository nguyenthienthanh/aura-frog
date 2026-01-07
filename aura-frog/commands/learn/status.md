# /learn:status

**Category:** Learning
**Purpose:** Display learning system status and statistics

---

## Usage

```bash
/learn:status           # Full status overview
/learn:status --brief   # Quick one-line status
```

---

## CRITICAL: Claude MUST Execute

When user runs `/learn:status`, Claude **MUST actually query Supabase**.

**DO NOT** just show example output. **DO** run the curl commands and show REAL data.

```bash
# ALWAYS source env first
source .envrc 2>/dev/null || source .claude/.envrc 2>/dev/null || true
```

---

## Execution Steps

When user runs `/learn:status`, Claude should:

### Step 1: Check Environment Variables

Read and verify these environment variables are set:
- `SUPABASE_URL` - Must be set
- `SUPABASE_SECRET_KEY` - Must be set
- `AF_LEARNING_ENABLED` - Should be "true"

### Step 2: Test Supabase Connection

Make a test query to verify connection:

```bash
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/af_feedback?limit=1" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"
```

If returns 200, connection is working.

### Step 3: Query Statistics

Fetch counts from Supabase views:

```bash
# Feedback count
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/v_feedback_summary" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"

# Agent success rates
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/v_agent_success_rates?limit=5" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"

# Pending improvements
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/v_improvement_suggestions" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"
```

### Step 4: Display Status

```markdown
## 🐸 Learning System Status

**Status:** {enabled ? '✅ Active' : '❌ Disabled'}
**Supabase:** {configured ? '✅ Connected' : '❌ Not configured'}

### Collection
- Feedback: {feedbackEnabled ? '✅' : '❌'} ({feedbackCount} items)
- Metrics: {metricsEnabled ? '✅' : '❌'} ({workflowCount} workflows)
- Auto-analyze: {autoAnalyze}

### Statistics (Last 90 days)
| Metric | Value |
|--------|-------|
| Workflows | {count} |
| Success Rate | {rate}% |
| Feedback Items | {count} |
| Active Patterns | {count} |
| Pending Improvements | {count} |

### Top Agents
| Agent | Tasks | Success |
|-------|-------|---------|
| {agent1} | {count} | {rate}% |
| {agent2} | {count} | {rate}% |

### Recent Activity
- Last workflow: {timestamp}
- Last feedback: {timestamp}
- Last analysis: {timestamp}
```

---

## Example Output

```
🐸 Learning System Status

Status: ✅ Active
Supabase: ✅ Connected (clcpzbduqnyjqlupuxkv.supabase.co)

Collection:
- Feedback: ✅ Enabled (47 items)
- Metrics: ✅ Enabled (123 workflows)
- Auto-analyze: weekly

Statistics (Last 90 days):
┌──────────────────┬─────────┐
│ Metric           │ Value   │
├──────────────────┼─────────┤
│ Workflows        │ 123     │
│ Success Rate     │ 81.3%   │
│ Feedback Items   │ 47      │
│ Active Patterns  │ 18      │
│ Pending Improve  │ 5       │
└──────────────────┴─────────┘

Top Agents by Success Rate:
1. react-expert: 96% (42 tasks)
2. typescript-expert: 94% (38 tasks)
3. nodejs-expert: 88% (29 tasks)

Recent Activity:
- Last workflow: 2h ago
- Last feedback: 4h ago
- Last analysis: 3 days ago

💡 Run /learn:analyze to generate new insights
```

---

## Brief Output

With `--brief`:

```
🐸 Learning: ✅ Active | 123 workflows | 81% success | 5 pending improvements
```

---

**Version:** 1.0.0
