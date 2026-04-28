---
name: learning-analyzer
description: "Analyze collected learning data from Supabase to identify success patterns, failure patterns, optimization opportunities, and agent performance trends."
autoInvoke: false
priority: 30
triggers:
  - "/learn analyze"
  - "learning analysis"
  - "pattern analysis"
context: fork
user-invocable: false
---

# Learning Analyzer Skill

Analyze learning data from Supabase: success/failure patterns, optimization opportunities, agent performance.

---

## Usage

```bash
/af learn analyze                      # Full analysis
/af learn analyze --period 30d         # Last 30 days
/af learn analyze --focus agents       # Agent performance
/af learn analyze --focus workflows    # Workflow patterns
/af learn analyze --focus feedback     # User feedback
```

---

## Process

### 1. Query Supabase Views

```toon
views[5]{view,purpose}:
  v_agent_success_rates,Agent performance by task type
  v_common_patterns,Identified patterns
  v_improvement_suggestions,Actionable suggestions
  v_workflow_trends,Weekly workflow trends
  v_feedback_summary,Feedback statistics
```

### 2. AI Pattern Recognition

Identify: Top 3 success patterns, top 3 failure patterns, top 3 optimization opportunities, agent recommendations.

### 3. Output Report

```markdown
## Learning Analysis Report
Generated: {timestamp} | Period: {dates}

### Success Patterns
1. **Pattern:** {description} — Frequency: {N}, Confidence: {%}

### Failure Patterns
1. **Pattern:** {description} — Impact: {severity}, Suggested Fix: {fix}

### Optimization Opportunities
1. **Opportunity:** {description} — Savings: {tokens/time}

### Agent Recommendations
| Task Type | Agent | Success Rate | Confidence |

### Suggested Rule Updates
- [ ] {suggestion}
```

---

## Environment

```bash
AF_LEARNING_ENABLED=true
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

---

## Integration

After analysis, improvements can be: reviewed (`/af learn review`), auto-applied (`/af learn apply --auto`, high confidence only), or saved as pending (`/af learn save`).

---
