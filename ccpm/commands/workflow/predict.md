# Command: workflow:predict

**Version:** 5.2.0
**Purpose:** Predict token usage for a workflow before starting
**Category:** Workflow Enhancement
**Last Updated:** 2025-11-26

---

## 🎯 Purpose

Predict how many tokens a workflow will consume before starting, enabling better session planning and preventing unexpected token limit hits.

---

## 📋 Command Format

```bash
workflow:predict "<task-description>"

# Examples:
workflow:predict "Build user authentication with JWT"
workflow:predict "Add social media sharing to mobile app"
workflow:predict "Refactor payment processing module"
workflow:predict "Fix memory leak in dashboard"
```

---

## 🔮 Prediction Algorithm

### Input Analysis

**Step 1: Parse Task**
```typescript
interface TaskAnalysis {
  type: 'feature' | 'bugfix' | 'refactor' | 'optimization';
  complexity: 'simple' | 'medium' | 'complex';
  tech_stack: string[];
  scope: 'frontend' | 'backend' | 'full-stack' | 'infrastructure';
  keywords: string[];
}

function analyzeTask(description: string): TaskAnalysis {
  // Extract keywords
  const keywords = extractKeywords(description);

  // Detect task type
  const type = detectTaskType(keywords);

  // Assess complexity
  const complexity = assessComplexity(keywords, description.length);

  // Identify tech stack
  const tech_stack = identifyTechStack(keywords);

  // Determine scope
  const scope = determineScope(keywords);

  return { type, complexity, tech_stack, scope, keywords };
}
```

**Step 2: Calculate Base Tokens**
```typescript
const BASE_TOKENS = {
  // Planning phases (relatively consistent)
  phase_1: 5000,   // Understand
  phase_2: 8000,   // Design
  phase_3: 6000,   // UI Breakdown
  phase_4: 7000,   // Plan Tests

  // Implementation (highly variable)
  phase_5a: 12000, // Write Tests
  phase_5b: 0,     // Build (calculated)
  phase_5c: 15000, // Polish

  // Review phases
  phase_6: 8000,   // Review
  phase_7: 6000,   // Verify
  phase_8: 10000,  // Document
  phase_9: 2000    // Share
};
```

**Step 3: Complexity Multipliers**
```typescript
const COMPLEXITY_MULTIPLIERS = {
  simple: {
    base: 1.0,
    phase_5b: 40000,  // ~40K tokens for simple implementation
    description: 'Single file, <100 LOC, straightforward logic'
  },
  medium: {
    base: 1.2,
    phase_5b: 90000,  // ~90K tokens for medium implementation
    description: 'Multiple files, 100-500 LOC, some complexity'
  },
  complex: {
    base: 1.5,
    phase_5b: 140000, // ~140K tokens for complex implementation
    description: 'Many files, >500 LOC, intricate logic'
  }
};
```

**Step 4: Scope Multipliers**
```typescript
const SCOPE_MULTIPLIERS = {
  frontend: 1.0,
  backend: 1.0,
  'full-stack': 1.4,      // Both frontend + backend
  infrastructure: 1.2,    // DevOps, config files
  mobile: 1.15,           // Native code, platform variations
  database: 1.1           // Schema, migrations
};
```

**Step 5: Task Type Adjustments**
```typescript
const TASK_TYPE_ADJUSTMENTS = {
  feature: 1.0,           // Standard workflow
  bugfix: 0.6,            // Smaller scope, focused
  refactor: 0.8,          // No new features, restructure only
  optimization: 0.7       // Performance tuning, profiling
};
```

### Calculation Formula

```typescript
function predictTokens(task: string): TokenPrediction {
  // Analyze task
  const analysis = analyzeTask(task);

  // Calculate base tokens
  let tokens = { ...BASE_TOKENS };

  // Phase 5b calculation
  const complexity = COMPLEXITY_MULTIPLIERS[analysis.complexity];
  tokens.phase_5b = complexity.phase_5b;

  // Apply scope multiplier
  const scopeMultiplier = SCOPE_MULTIPLIERS[analysis.scope] || 1.0;

  // Apply task type adjustment
  const typeAdjustment = TASK_TYPE_ADJUSTMENTS[analysis.type] || 1.0;

  // Calculate per-phase estimates
  const phases = Object.entries(tokens).map(([phase, base]) => {
    const min = Math.round(base * scopeMultiplier * typeAdjustment * 0.8);
    const max = Math.round(base * scopeMultiplier * typeAdjustment * 1.2);
    const avg = Math.round(base * scopeMultiplier * typeAdjustment);

    return {
      phase,
      min,
      max,
      avg,
      confidence: calculateConfidence(analysis, phase)
    };
  });

  // Calculate totals
  const total_min = phases.reduce((sum, p) => sum + p.min, 0);
  const total_max = phases.reduce((sum, p) => sum + p.max, 0);
  const total_avg = phases.reduce((sum, p) => sum + p.avg, 0);

  return {
    analysis,
    phases,
    total: { min: total_min, max: total_max, avg: total_avg },
    confidence: calculateOverallConfidence(analysis),
    recommendations: generateRecommendations(total_avg, analysis)
  };
}
```

---

## 📊 Output Format

```markdown
🔮 Analyzing task: "Build user authentication with JWT"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Task Analysis:
  Type: Feature
  Complexity: Medium
  Scope: Full-stack
  Tech Stack: React, Node.js, JWT
  Keywords: authentication, jwt, user, login, register

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Token Usage Prediction:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Estimate: 145K - 182K tokens (avg: 164K)
Session Limit: 200K tokens
Safety Margin: 18K - 55K tokens (9% - 28%)

Phase Breakdown:
┌─────────────┬─────────┬─────────┬─────────┬──────────┐
│ Phase       │ Min     │ Max     │ Avg     │ % Total  │
├─────────────┼─────────┼─────────┼─────────┼──────────┤
│ 1: Understand    │ 5.6K    │ 8.4K    │ 7.0K    │ 4%      │
│ 2: Design        │ 9.0K    │ 13.4K   │ 11.2K   │ 7%      │
│ 3: UI Breakdown  │ 6.7K    │ 10.1K   │ 8.4K    │ 5%      │
│ 4: Plan Tests    │ 7.8K    │ 11.8K   │ 9.8K    │ 6%      │
│ 5a: Write Tests  │ 13.4K   │ 20.2K   │ 16.8K   │ 10%     │
│ 5b: Build        │ 100.8K  │ 151.2K  │ 126.0K  │ 77% ⚠️  │
│ 5c: Polish       │ 16.8K   │ 25.2K   │ 21.0K   │ 13%     │
│ 6: Review        │ 9.0K    │ 13.4K   │ 11.2K   │ 7%      │
│ 7: Verify        │ 6.7K    │ 10.1K   │ 8.4K    │ 5%      │
│ 8: Document      │ 11.2K   │ 16.8K   │ 14.0K   │ 9%      │
│ 9: Share         │ 2.2K    │ 3.4K    │ 2.8K    │ 2%      │
├─────────────┼─────────┼─────────┼─────────┼──────────┤
│ **TOTAL**   │ **145K**│ **182K**│ **164K**│ **100%** │
└─────────────┴─────────┴─────────┴─────────┴──────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Warnings:
  • Phase 5b will consume ~77% of total tokens
  • This is a full-stack task (+40% token usage)
  • Authentication features require security considerations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Recommendations:
  ✅ This workflow fits comfortably in one session
  ✅ Safety margin: 18K-55K tokens remaining
  ⚠️ Consider handoff after Phase 5b if you need iterations
  💾 Auto-checkpoint will save progress every 25K tokens

  Optimal Strategy:
  1. Complete Phases 1-4 (planning)
  2. Complete Phase 5a-5b (implementation)
  3. Checkpoint automatically created
  4. Complete 5c-9 or handoff if needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Confidence Level: 82%
  Based on 23 similar workflows in history

  Similar workflows:
  • auth-oauth-implementation: 158K tokens (actual)
  • jwt-authentication-api: 171K tokens (actual)
  • user-login-system: 149K tokens (actual)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to proceed?

Options:
  → "yes" or "workflow:start" - Start workflow with prediction tracking
  → "no" - Cancel
  → "explain" - Show detailed calculation breakdown
  → "lightweight" - Suggest lightweight alternative (if applicable)

Your choice:
═════════════════════════════════════════════════════════════
```

---

## 🎯 Confidence Calculation

```typescript
function calculateConfidence(analysis: TaskAnalysis, phase: string): number {
  let confidence = 0.7; // Base confidence

  // Increase confidence based on historical data
  const historicalMatches = findSimilarWorkflows(analysis);
  if (historicalMatches.length > 20) confidence += 0.15;
  else if (historicalMatches.length > 10) confidence += 0.10;
  else if (historicalMatches.length > 5) confidence += 0.05;

  // Planning phases are more predictable
  if (['phase_1', 'phase_2', 'phase_3', 'phase_4'].includes(phase)) {
    confidence += 0.10;
  }

  // Phase 5b (implementation) is least predictable
  if (phase === 'phase_5b') {
    confidence -= 0.15;
  }

  // Well-defined tasks are more predictable
  if (analysis.keywords.length > 5) confidence += 0.05;

  return Math.min(0.95, confidence); // Cap at 95%
}
```

---

## 📝 Historical Data Collection

After each workflow completes, save metrics:

```typescript
interface WorkflowMetrics {
  id: string;
  timestamp: string;
  task_description: string;
  task_type: string;
  complexity: string;
  scope: string;
  tech_stack: string[];

  predicted_tokens: number;
  actual_tokens: {
    phase_1: number;
    phase_2: number;
    // ... all phases
    total: number;
  };

  prediction_accuracy: number; // predicted vs actual
  duration_minutes: number;
  lines_of_code_added: number;
  lines_of_code_modified: number;
  files_modified: number;
}

// Save to: data/metrics/YYYY-MM/workflow-metrics-{id}.json
```

---

## 🔄 Integration with workflow:start

When user runs `workflow:start`, automatically show prediction:

```typescript
// In workflow:start command
async function workflowStart(task: string) {
  // Step 1: Predict tokens
  const prediction = await predictTokens(task);

  // Step 2: Show prediction
  displayPrediction(prediction);

  // Step 3: Ask user confirmation
  const proceed = await askUser("Ready to proceed? (yes/no/explain)");

  if (proceed === 'yes') {
    // Step 4: Start workflow with tracking
    startWorkflowWithTracking(task, prediction);
  }
}
```

---

## ⚙️ Related Commands

- `workflow:start <task>` - Auto-shows prediction before starting
- `workflow:budget` - Show current token usage vs prediction
- `workflow:metrics` - View historical workflow metrics
- `workflow:accuracy` - Check prediction model accuracy

---

## 📚 Data Files

```
data/
├── predictions/
│   └── model-v1.json (prediction parameters)
├── metrics/
│   ├── 2025-11/
│   │   ├── workflow-001.json
│   │   ├── workflow-002.json
│   │   └── summary.json
│   └── 2025-12/
│       └── ...
└── model-version.txt
```

---

## ✅ Success Criteria

- [ ] Prediction shown before workflow start
- [ ] Accuracy ≥85% for similar tasks
- [ ] Accuracy ≥70% for new task types
- [ ] Confidence level displayed
- [ ] Recommendations provided
- [ ] Historical data collected
- [ ] Model improves over time

---

**Command:** workflow:predict
**Version:** 5.2.0
**Status:** ✅ Ready for Implementation
**Priority:** High
**Dependencies:** Historical metrics collection

**Related:**
- `commands/workflow/start.md`
- `commands/workflow/budget.md`
- `docs/WORKFLOW_ENHANCEMENTS_DESIGN.md`
