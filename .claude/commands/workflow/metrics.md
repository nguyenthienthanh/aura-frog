# Command: workflow:metrics

**Purpose:** Display workflow quality and performance metrics  
**Aliases:** `metrics`, `show metrics`, `quality report`

---

## 🎯 Command Overview

Show comprehensive metrics for code quality, test coverage, performance, and workflow efficiency.

---

## 📊 Usage

```bash
# Show metrics
workflow:metrics

# Or natural language
"Show metrics"
"Quality report"
"How's the quality?"
```

---

## 📋 Metrics Categories

### 1. Code Quality

```typescript
interface CodeQualityMetrics {
  test_coverage: number;        // %
  linter_warnings: number;
  linter_errors: number;
  code_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  complexity: 'Low' | 'Medium' | 'High';
  maintainability: number;      // 0-100
  technical_debt: number;       // hours
}
```

### 2. Test Metrics

```typescript
interface TestMetrics {
  total_tests: number;
  passing_tests: number;
  failing_tests: number;
  skipped_tests: number;
  coverage_percent: number;
  coverage_target: number;
  coverage_delta: number;       // vs target
}
```

### 3. Performance Metrics

```typescript
interface PerformanceMetrics {
  avg_phase_duration: number;   // minutes
  total_time: number;           // minutes
  velocity: number;             // phases/hour
  efficiency_score: number;     // 0-100
  token_efficiency: number;     // tokens/phase
}
```

### 4. Workflow Metrics

```typescript
interface WorkflowMetrics {
  phases_completed: number;
  phases_total: number;
  approval_rate: number;        // % approved first time
  rejection_count: number;
  modification_count: number;
  auto_continue_enabled: boolean;
}
```

---

## 📊 Display Format

```markdown
╔══════════════════════════════════════════════════════════╗
║  📊 WORKFLOW METRICS REPORT                              ║
╚══════════════════════════════════════════════════════════╝

**Workflow:** add-user-authentication
**ID:** add-user-authentication-20251124-120000
**Phase:** 6/9 (Code Review)

---

## 🎯 Code Quality

**Grade:** A ✅
**Test Coverage:** 87% ✅ (Target: 80%)
**Linter:** 0 warnings, 0 errors ✅
**Complexity:** Low ✅
**Maintainability:** 92/100 ✅
**Technical Debt:** 0.5 hours ✅

**Quality Gates:** All Passed ✅

---

## 🧪 Test Metrics

**Tests:**
- Total: 45 tests
- Passing: 45 ✅
- Failing: 0 ✅
- Skipped: 0 ✅

**Coverage:**
```
██████████████████████████████████████░░░░░ 87%
```
- Lines: 87% (Target: 80%) ✅ +7%
- Branches: 85% ✅
- Functions: 90% ✅
- Statements: 88% ✅

**Coverage Delta:** +7% above target ✅

---

## ⚡ Performance Metrics

**Time:**
- Total Elapsed: 1h 15min
- Avg per Phase: 12.5 min
- Current Pace: ✅ Normal

**Velocity:**
- Phases per Hour: 4.8
- Efficiency Score: 92/100 ✅

**Token Usage:**
- Total: 315K / 1M (31.5%)
- Avg per Phase: 52.5K
- Efficiency: ✅ Excellent

**Estimates:**
- Remaining Time: ~25 min
- Remaining Tokens: ~75K
- Total Est: 1h 40min, 390K tokens

---

## 📈 Workflow Metrics

**Progress:**
```
████████████████████████░░░░░░░░░░░░░░░░ 67%
```
- Completed: 6/9 phases
- Success Rate: 100% (all approved first time)
- Rejections: 0 ✅
- Modifications: 1

**Workflow Health:** Excellent ✅

**Auto-Continue:** Enabled ✅

---

## 🏆 Achievement Scores

**Quality:** ⭐⭐⭐⭐⭐ (5/5)
- Coverage above target
- Zero linter issues
- Low complexity
- High maintainability

**Speed:** ⭐⭐⭐⭐☆ (4/5)
- Good velocity
- On schedule
- Efficient token usage

**Process:** ⭐⭐⭐⭐⭐ (5/5)
- No rejections
- Smooth approvals
- TDD followed
- Cross-review done

**Overall:** ⭐⭐⭐⭐⭐ (4.7/5) - Excellent!

---

## 💡 Recommendations

✅ All quality gates passed - Ready to proceed
✅ Coverage exceeds target - Excellent test coverage
✅ Zero technical debt - Clean implementation
💡 Consider adding more edge case tests
```

---

## 🎯 Quality Gates

### Standard Gates

```typescript
const qualityGates = {
  test_coverage: {
    threshold: 80,
    operator: '>=',
    status: state.coverage >= 80 ? 'pass' : 'fail'
  },
  linter_errors: {
    threshold: 0,
    operator: '===',
    status: state.linter.errors === 0 ? 'pass' : 'fail'
  },
  linter_warnings: {
    threshold: 0,
    operator: '===',
    status: state.linter.warnings === 0 ? 'pass' : 'fail'
  },
  failing_tests: {
    threshold: 0,
    operator: '===',
    status: state.tests.failing === 0 ? 'pass' : 'fail'
  },
  code_complexity: {
    threshold: 'Medium',
    operator: '<=',
    status: state.complexity <= 'Medium' ? 'pass' : 'fail'
  }
};
```

### Gate Status Display

```markdown
## Quality Gates

- ✅ Test Coverage ≥ 80%     (87%)
- ✅ Linter Errors = 0       (0)
- ✅ Linter Warnings = 0     (0)
- ✅ Failing Tests = 0       (0)
- ✅ Complexity ≤ Medium     (Low)

**Status:** All Gates Passed ✅
```

---

## 📊 Grade Calculation

### Code Grade Formula

```typescript
function calculateGrade(metrics: CodeQualityMetrics): Grade {
  let score = 0;
  
  // Test coverage (40 points)
  score += Math.min(40, (metrics.test_coverage / 100) * 40);
  
  // Linter (20 points)
  if (metrics.linter_errors === 0 && metrics.linter_warnings === 0) {
    score += 20;
  } else if (metrics.linter_errors === 0) {
    score += 10;
  }
  
  // Complexity (20 points)
  if (metrics.complexity === 'Low') score += 20;
  else if (metrics.complexity === 'Medium') score += 10;
  
  // Maintainability (20 points)
  score += (metrics.maintainability / 100) * 20;
  
  // Grade
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
```

### Efficiency Score

```typescript
function calculateEfficiency(metrics: PerformanceMetrics): number {
  let score = 0;
  
  // Time efficiency (50 points)
  const avgPhase = metrics.avg_phase_duration;
  if (avgPhase <= 10) score += 50;
  else if (avgPhase <= 15) score += 40;
  else if (avgPhase <= 20) score += 30;
  else score += 20;
  
  // Token efficiency (50 points)
  const avgTokens = metrics.token_efficiency;
  if (avgTokens <= 40000) score += 50;
  else if (avgTokens <= 50000) score += 40;
  else if (avgTokens <= 60000) score += 30;
  else score += 20;
  
  return score;
}
```

---

## 🏆 Achievement System

### Badges

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: () => boolean;
}

const achievements = [
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Grade A with 100% coverage',
    icon: '🏆',
    criteria: () => grade === 'A' && coverage === 100
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete workflow in under 1 hour',
    icon: '⚡',
    criteria: () => totalTime < 60
  },
  {
    id: 'zero-defects',
    name: 'Zero Defects',
    description: 'No linter issues, all tests passing',
    icon: '🎯',
    criteria: () => linter.errors === 0 && tests.failing === 0
  },
  {
    id: 'efficient',
    name: 'Token Efficient',
    description: 'Use less than 300K tokens',
    icon: '💡',
    criteria: () => totalTokens < 300000
  },
  {
    id: 'smooth-operator',
    name: 'Smooth Operator',
    description: 'No phase rejections',
    icon: '✨',
    criteria: () => rejections === 0
  }
];
```

### Display Earned Badges

```markdown
## 🏆 Achievements Earned

🏆 Perfect Score - Grade A with high coverage!
⚡ Speed Demon - Completed in record time!
🎯 Zero Defects - Flawless implementation!
✨ Smooth Operator - No rejections!

**4/5 achievements unlocked!**
```

---

## 📈 Trend Analysis

### Historical Comparison

```markdown
## 📈 Trends (vs Previous Workflows)

**Quality:** 
  This: A grade ✅
  Avg: B+ grade
  Trend: ↗️ Improving

**Coverage:**
  This: 87% ✅
  Avg: 82%
  Trend: ↗️ +5%

**Speed:**
  This: 1h 15min
  Avg: 1h 30min
  Trend: ↗️ 15% faster

**Tokens:**
  This: 315K
  Avg: 350K
  Trend: ↗️ 10% more efficient
```

---

## 🔧 Integration

### With Other Commands

```bash
workflow:metrics   # This command
workflow:progress  # Timeline view
workflow:tokens    # Token details
workflow:status    # Current phase
```

### In Approval Gates

```markdown
## Phase 6 Complete

**Metrics:**
- Quality: A grade ✅
- Coverage: 87% ✅
- Linter: 0 issues ✅

approve → Continue to Phase 7
```

---

## 💡 Recommendations Engine

```typescript
function generateRecommendations(metrics: AllMetrics): string[] {
  const recommendations = [];
  
  if (metrics.coverage < 80) {
    recommendations.push('⚠️ Increase test coverage to meet 80% target');
  }
  
  if (metrics.linter.warnings > 0) {
    recommendations.push(`⚠️ Fix ${metrics.linter.warnings} linter warning(s)`);
  }
  
  if (metrics.complexity === 'High') {
    recommendations.push('⚠️ Refactor to reduce code complexity');
  }
  
  if (metrics.technical_debt > 2) {
    recommendations.push(`⚠️ Address ${metrics.technical_debt}h technical debt`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All quality gates passed - Excellent work!');
    recommendations.push('💡 Consider adding more edge case tests');
  }
  
  return recommendations;
}
```

---

## ✅ Success Criteria

✅ All metrics categories displayed  
✅ Quality gates status shown  
✅ Grade calculated correctly  
✅ Achievements tracked  
✅ Recommendations provided  
✅ Trends analyzed  
✅ Integration with other commands  

---

**Command:** workflow:metrics  
**Version:** 1.0.0  
**Added:** CCPM v4.2

