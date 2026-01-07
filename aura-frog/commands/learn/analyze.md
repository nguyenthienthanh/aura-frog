# /learn:analyze

**Category:** Learning
**Purpose:** Analyze collected data and generate improvement insights

---

## Usage

```bash
/learn:analyze                      # Full analysis
/learn:analyze --period 30d         # Last 30 days
/learn:analyze --focus agents       # Agent performance focus
/learn:analyze --focus workflows    # Workflow patterns focus
/learn:analyze --focus feedback     # User feedback focus
```

---

## CRITICAL: Claude MUST Execute

When user runs `/learn:analyze`, Claude **MUST actually fetch and analyze real data from Supabase**.

**DO NOT** just show example analysis. **DO** run the curl commands, read the JSON, and analyze REAL data.

```bash
# ALWAYS source env first
source .envrc 2>/dev/null || source .claude/.envrc 2>/dev/null || true
```

---

## Execution Steps

When user runs `/learn:analyze`, Claude should:

### Step 1: Verify Connection

First, check that learning system is configured:

```bash
# Check env vars exist
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SECRET_KEY" ]; then
  echo "❌ Learning system not configured"
  echo "Set SUPABASE_URL and SUPABASE_SECRET_KEY in .envrc"
  exit 1
fi
```

### Step 2: Fetch Data from Supabase

Query all the learning views:

```bash
# Agent success rates
curl -s "${SUPABASE_URL}/rest/v1/v_agent_success_rates" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" > /tmp/agent_rates.json

# Workflow trends
curl -s "${SUPABASE_URL}/rest/v1/v_workflow_trends" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" > /tmp/workflow_trends.json

# Existing patterns
curl -s "${SUPABASE_URL}/rest/v1/v_common_patterns" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" > /tmp/patterns.json

# Feedback summary
curl -s "${SUPABASE_URL}/rest/v1/v_feedback_summary" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" > /tmp/feedback.json

# Pending suggestions
curl -s "${SUPABASE_URL}/rest/v1/v_improvement_suggestions" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" > /tmp/suggestions.json
```

### Step 3: Read and Analyze Data

Read the fetched JSON files and analyze:

```bash
# Read the data
cat /tmp/agent_rates.json
cat /tmp/workflow_trends.json
cat /tmp/patterns.json
cat /tmp/feedback.json
cat /tmp/suggestions.json
```

### Step 4: Generate Insights

Based on the data, Claude should analyze and identify:

1. **Success Patterns** - What's working well?
   - High success rate agents for specific task types
   - Workflow configurations with best outcomes

2. **Failure Patterns** - What's causing issues?
   - Common auto-stop triggers
   - Agents with low success rates
   - Phases that frequently fail

3. **Optimization Opportunities** - Where can we improve?
   - High token usage phases
   - Slow phases
   - Underperforming agents

4. **Recommendations** - Actionable suggestions
   - Agent routing changes
   - Rule updates
   - Workflow adjustments

### Step 5: Save New Patterns to Supabase

For any new patterns discovered, save them:

```bash
curl -X POST "${SUPABASE_URL}/rest/v1/af_learned_patterns" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "pattern_type": "success",
    "category": "agent",
    "description": "react-expert has 95% success rate for React component tasks",
    "confidence": 0.85,
    "suggested_action": "Route React component tasks to react-expert by default"
  }'
```

### Step 6: Display Report

Output the analysis report (see Output Format below).

---

## Analysis Prompt Template

Claude should use this mental framework:

```markdown
Analyze this learning data from Aura Frog plugin usage:

## Agent Performance
{agentRates}

## Existing Patterns
{patterns}

## Pending Suggestions
{suggestions}

## Workflow Trends
{trends}

## Feedback Summary
{feedback}

Provide:
1. Top 3 success patterns with evidence
2. Top 3 failure patterns with root cause
3. Top 3 optimization opportunities
4. Agent routing recommendations
5. Suggested rule updates (specific, actionable)
```

### 4. Generate Report

Output structured report following `skills/learning-analyzer/SKILL.md` format.

### 5. Save Patterns to Supabase

New patterns discovered during analysis:

```javascript
const { recordPattern } = require('./hooks/lib/af-learning.cjs');

for (const pattern of newPatterns) {
  await recordPattern({
    type: pattern.type,
    category: pattern.category,
    description: pattern.description,
    evidence: pattern.evidence,
    suggestedAction: pattern.action,
    suggestedRule: pattern.rule
  });
}
```

---

## Output Format

```markdown
## 🐸 Learning Analysis Report
Generated: 2026-01-07T10:30:00Z
Period: Last 30 days
Data Points: 123 workflows, 47 feedback items

---

### 📊 Key Metrics

| Metric | Value | Trend |
|--------|-------|-------|
| Workflow Success | 81.3% | ↑ 3.2% |
| Avg Token Usage | 45,200 | ↓ 12% |
| Feedback Ratio | 0.38/workflow | → stable |

---

### ✅ Success Patterns

**1. TDD workflow for Next.js projects**
- Confidence: 89%
- Frequency: 15 workflows
- Evidence: 95% test pass rate when full TDD used
- Recommendation: Continue enforcing TDD for Next.js

**2. react-expert for component tasks**
- Confidence: 92%
- Frequency: 28 tasks
- Evidence: 96% success rate vs 78% for web-expert
- Recommendation: Update agent routing

---

### ❌ Failure Patterns

**1. Phase 5a timeout on large test suites**
- Frequency: 8 workflows
- Impact: Workflow stall, manual intervention needed
- Root Cause: Default 180s timeout insufficient for 100+ tests
- Fix: Increase timeout to 300s, add batching

---

### ⚡ Optimization Opportunities

**1. Reduce Phase 2 token usage**
- Current: Avg 12,500 tokens
- Potential: 8,000 tokens (-36%)
- Method: Use TOON format for technical specs

---

### 🤖 Agent Recommendations

| Task Type | Current | Recommended | Expected Gain |
|-----------|---------|-------------|---------------|
| React UI | web-expert | react-expert | +18% success |
| API routes | general | nodejs-expert | +10% success |

---

### 📝 Suggested Improvements

1. **Update Phase 5a timeout** (Confidence: 85%)
   - File: `ccpm-config.yaml`
   - Change: timeout 180 → 300
   - Run: `/learn:apply --id abc123`

2. **Route React to react-expert** (Confidence: 92%)
   - File: `agents/smart-agent-detector.md`
   - Change: Add .tsx/.jsx file pattern
   - Run: `/learn:apply --id def456`

---

💡 Apply improvements: `/learn:apply`
📊 View full data: `/learn:export --full`
```

---

## Focus Modes

### `--focus agents`

Detailed agent analysis:
- Success/failure rates by agent
- Task type suitability
- User override patterns
- Token efficiency by agent

### `--focus workflows`

Workflow pattern analysis:
- Phase duration distribution
- Auto-stop triggers
- Success by project type
- Token usage trends

### `--focus feedback`

User feedback analysis:
- Correction patterns
- Approval/rejection reasons
- Common user overrides
- Satisfaction trends

---

**Version:** 1.0.0
