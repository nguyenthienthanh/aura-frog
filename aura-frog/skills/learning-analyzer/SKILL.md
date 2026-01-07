# Learning Analyzer Skill

**Type:** Analysis
**Trigger:** `/learn:analyze`, on-demand
**Auto-invoke:** No (manual trigger only)

---

## Purpose

Analyze collected learning data from Supabase to identify:
- Success patterns (what's working well)
- Failure patterns (common issues)
- Optimization opportunities (efficiency improvements)
- Agent performance trends

---

## Usage

```bash
/learn:analyze                      # Full analysis
/learn:analyze --period 30d         # Last 30 days only
/learn:analyze --focus agents       # Focus on agent performance
/learn:analyze --focus workflows    # Focus on workflow patterns
/learn:analyze --focus feedback     # Focus on user feedback
```

---

## Analysis Process

### 1. Data Collection

Query Supabase views:
- `v_agent_success_rates` - Agent performance by task type
- `v_common_patterns` - Identified patterns
- `v_improvement_suggestions` - Actionable suggestions
- `v_workflow_trends` - Weekly workflow trends
- `v_feedback_summary` - Feedback statistics

### 2. Pattern Recognition

Identify patterns using Claude AI:

```
Given the learning data below, identify:
1. Top 3 success patterns (what's consistently working)
2. Top 3 failure patterns (recurring issues)
3. Top 3 optimization opportunities (efficiency gains)
4. Agent recommendations (which agents for which tasks)

Data:
[Insert query results]
```

### 3. Generate Insights

Output format:

```markdown
## Learning Analysis Report
Generated: {timestamp}
Period: {start_date} to {end_date}

### Success Patterns
1. **Pattern**: {description}
   - Frequency: {count} occurrences
   - Confidence: {percentage}%
   - Evidence: {examples}

### Failure Patterns
1. **Pattern**: {description}
   - Impact: {severity}
   - Root Cause: {analysis}
   - Suggested Fix: {recommendation}

### Optimization Opportunities
1. **Opportunity**: {description}
   - Potential Savings: {tokens/time}
   - Implementation: {steps}

### Agent Recommendations
| Task Type | Recommended Agent | Success Rate | Confidence |
|-----------|-------------------|--------------|------------|
| {type}    | {agent}           | {rate}%      | {score}    |

### Suggested Rule Updates
- [ ] {rule_suggestion_1}
- [ ] {rule_suggestion_2}
```

---

## Environment Requirements

```bash
AF_LEARNING_ENABLED=true
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

---

## Query Templates

### Agent Success Rates

```sql
SELECT * FROM v_agent_success_rates
WHERE total_tasks >= 5
ORDER BY success_rate DESC;
```

### Recent Patterns

```sql
SELECT * FROM v_common_patterns
WHERE confidence >= 0.5
ORDER BY frequency DESC
LIMIT 20;
```

### Improvement Suggestions

```sql
SELECT * FROM v_improvement_suggestions
ORDER BY confidence DESC;
```

### Workflow Trends

```sql
SELECT * FROM v_workflow_trends
ORDER BY week DESC
LIMIT 12;
```

### Feedback Summary

```sql
SELECT * FROM v_feedback_summary;
```

---

## AI Analysis Prompt

When generating insights, use this prompt structure:

```
You are analyzing learning data from the Aura Frog plugin.

## Context
- This data represents {period} of plugin usage
- Total workflows: {count}
- Total feedback items: {count}

## Data
{query_results}

## Task
Analyze this data and provide:

1. **Success Patterns** (3-5)
   - What configurations/approaches consistently succeed?
   - Which agent-task combinations work best?

2. **Failure Patterns** (3-5)
   - What commonly causes issues?
   - Which phases have the highest failure rates?

3. **Optimization Opportunities** (3-5)
   - Where are tokens being wasted?
   - Which phases take longest?

4. **Actionable Recommendations**
   - Specific rule changes to suggest
   - Agent routing improvements
   - Workflow adjustments

Format as a structured report with evidence citations.
```

---

## Integration with Self-Improve

After analysis, suggested improvements can be:
1. Reviewed manually via `/learn:review`
2. Applied automatically via `/learn:apply --auto` (high confidence only)
3. Saved as pending via `/learn:save`

---

## Example Output

```markdown
## Learning Analysis Report
Generated: 2026-01-07T10:30:00Z
Period: Last 30 days

### Key Metrics
- Workflows analyzed: 47
- Success rate: 78.7%
- Feedback items: 23
- Patterns identified: 12

### Success Patterns

1. **TDD workflow with Next.js projects**
   - Frequency: 15 occurrences
   - Confidence: 89%
   - Evidence: Projects using full TDD workflow had 95% test pass rate
   - Recommendation: Continue enforcing TDD for Next.js projects

2. **react-expert for component tasks**
   - Frequency: 28 occurrences
   - Confidence: 92%
   - Evidence: react-expert selected for component work succeeded 96% of time

### Failure Patterns

1. **Phase 5a timeout on large test suites**
   - Frequency: 8 occurrences
   - Impact: High (workflow stall)
   - Root Cause: Test generation exceeds timeout for 100+ test files
   - Suggested Fix: Add test batching for large projects

### Agent Recommendations

| Task Type | Agent | Success Rate | Override Rate |
|-----------|-------|--------------|---------------|
| React UI | react-expert | 96% | 2% |
| API routes | nodejs-expert | 88% | 8% |
| Database | database-specialist | 91% | 5% |

### Suggested Improvements

- [ ] Increase Phase 5a timeout for projects with >50 test files
- [ ] Default to react-expert for .tsx file modifications
- [ ] Add pre-check for test file count before Phase 5a
```

---

**Version:** 1.0.0
