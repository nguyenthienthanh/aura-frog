# Post-Phase Hook - Phase Completion

**Version:** 1.0.0  
**Purpose:** Execute after each phase completes  
**Trigger:** Automatically run after Phase N execution

---

## 🎯 Purpose

Clean up, validate, and prepare approval after phase execution completes.

---

## 🔄 Execution Flow

```
Phase N Execution
      ↓
[POST-PHASE HOOK] ← YOU ARE HERE
      ↓
Approval Prompt
```

---

## ✅ Post-Phase Checklist

### 1. Stop Phase Timer & Calculate Token Usage
```typescript
const state = loadWorkflowState();
const currentPhase = state.current_phase;
const phaseState = state.phases[currentPhase];

const duration = Date.now() - phaseState.timer_start;
phaseState.duration_ms = duration;
phaseState.completed_at = new Date().toISOString();
phaseState.status = 'completed';

// Calculate token usage
const currentTokens = getCurrentTokenUsage();
const phaseTokens = currentTokens - phaseState.tokens.start;
phaseState.tokens.phase_tokens = phaseTokens;
phaseState.tokens.end = currentTokens;

// Update cumulative
state.total_tokens_used = (state.total_tokens_used || 0) + phaseTokens;
state.total_tokens_remaining = 1000000 - state.total_tokens_used;

console.log(`⏱️  Phase completed in ${formatDuration(duration)}`);
console.log(`🎯 Tokens used: ${phaseTokens.toLocaleString()} (~${Math.round(phaseTokens/1000)}K)`);
console.log(`📊 Total tokens: ${state.total_tokens_used.toLocaleString()} / 1M (${Math.round(state.total_tokens_used/10000)}%)`);
```

### 2. Validate Phase Output
```typescript
// Check if deliverables were created
if (phaseState.deliverables.length === 0) {
  console.warn('⚠️  No deliverables generated in this phase');
}

// Verify deliverables exist
for (const file of phaseState.deliverables) {
  if (!fileExists(file)) {
    throw new Error(`Deliverable not found: ${file}`);
  }
}

console.log(`✅ ${phaseState.deliverables.length} deliverable(s) created`);
```

### 3. Run Phase-Specific Validation
```typescript
const validationResult = await validatePhaseOutput(currentPhase, phaseState);

if (!validationResult.success) {
  console.error(`❌ Phase validation failed:`);
  validationResult.errors.forEach(err => console.error(`   - ${err}`));
  throw new Error('Phase validation failed');
}

console.log(`✅ Phase validation passed`);
```

### 4. Check Success Criteria
```typescript
const phase = PHASES[currentPhase];
const criteriaResults = [];

for (const criteria of phase.success_criteria) {
  const met = await checkCriteria(criteria, phaseState);
  criteriaResults.push({ criteria, met });
  
  const icon = met ? '✅' : '❌';
  console.log(`${icon} ${criteria}`);
}

const allMet = criteriaResults.every(r => r.met);
if (!allMet) {
  console.warn('⚠️  Not all success criteria met');
}

phaseState.success_criteria_met = allMet;
```

### 5. Generate Phase Summary
```typescript
const summary = {
  phase: currentPhase,
  phase_name: phase.name,
  duration: formatDuration(phaseState.duration_ms),
  deliverables: phaseState.deliverables,
  success_criteria_met: phaseState.success_criteria_met,
  metrics: await collectPhaseMetrics(currentPhase, phaseState),
};

phaseState.summary = summary;
```

### 6. Save State
```typescript
saveWorkflowState(state);
console.log(`💾 Workflow state saved`);
```

### 7. Prepare for Approval
```typescript
// Generate approval prompt data
const approvalData = {
  phase: currentPhase,
  summary: phaseState.summary,
  next_phase: currentPhase < 9 ? PHASES[currentPhase + 1] : null,
};

// Save for approval hook
saveApprovalData(approvalData);
```

---

## 📋 Phase-Specific Validation

### Phase 1: Requirements Analysis
```typescript
// Validate requirements document
const requirementsDoc = phaseState.deliverables.find(f => f.includes('requirements'));
if (!requirementsDoc) {
  throw new Error('Requirements document not generated');
}

// Check if scope is defined
const content = readFile(requirementsDoc);
if (!content.includes('## Scope')) {
  throw new Error('Requirements missing scope section');
}
```

### Phase 2: Technical Planning
```typescript
// Validate tech spec
const techSpec = phaseState.deliverables.find(f => f.includes('tech-spec'));
if (!techSpec) {
  throw new Error('Technical specification not generated');
}

// Check for required sections
const requiredSections = ['Architecture', 'Components', 'File Changes'];
const content = readFile(techSpec);

for (const section of requiredSections) {
  if (!content.includes(`## ${section}`)) {
    throw new Error(`Tech spec missing section: ${section}`);
  }
}

// DIAGRAM REQUIREMENT: Check for Mermaid diagrams
const hasDiagram = content.includes('```mermaid');
if (!hasDiagram) {
  console.warn('⚠️  DIAGRAM REQUIRED: Tech spec should include architecture diagram');
  console.warn('   See rules/diagram-requirements.md for requirements');
  // Not blocking, but warning
}
```

### Phase 3: Design Review
```typescript
// Validate design analysis
const designDoc = phaseState.deliverables.find(f => f.includes('design'));
if (!designDoc) {
  throw new Error('Design review document not generated');
}
```

### Phase 4: Test Planning
```typescript
// Validate test plan
const testPlan = phaseState.deliverables.find(f => f.includes('test-plan'));
if (!testPlan) {
  throw new Error('Test plan not generated');
}

// Check for test cases
const content = readFile(testPlan);
const testCasesCount = (content.match(/###.*test case/gi) || []).length;

if (testCasesCount === 0) {
  throw new Error('No test cases defined in test plan');
}

console.log(`📝 ${testCasesCount} test case(s) planned`);
```

### Phase 5a: Write Tests (RED)
```typescript
// Run tests - they should FAIL
const testResults = await runTests();

if (testResults.failed === 0) {
  throw new Error('TDD violation: Tests should fail in RED phase');
}

console.log(`🔴 ${testResults.failed} test(s) failing (expected)`);
phaseState.test_results = testResults;
```

### Phase 5b: Implementation (GREEN)
```typescript
// Run tests - they should PASS
const testResults = await runTests();

if (testResults.failed > 0) {
  throw new Error(`Implementation incomplete: ${testResults.failed} test(s) still failing`);
}

// Check coverage
const coverage = await runCoverage();
const threshold = state.context.coverage_threshold || 80;

if (coverage.overall < threshold) {
  console.warn(`⚠️  Coverage ${coverage.overall}% below threshold ${threshold}%`);
}

console.log(`🟢 All ${testResults.passed} test(s) passing`);
console.log(`📊 Coverage: ${coverage.overall}%`);

phaseState.test_results = testResults;
phaseState.coverage = coverage;
```

### Phase 5c: Refactor (REFACTOR)
```typescript
// Verify tests still pass
const testResults = await runTests();

if (testResults.failed > 0) {
  throw new Error('Refactoring broke tests!');
}

// Compare code quality metrics
const currentMetrics = await collectCodeMetrics();
const baselineMetrics = state.context.baseline_metrics;

const improvements = compareMetrics(baselineMetrics, currentMetrics);
console.log('📈 Code Quality Improvements:');
console.log(`   - Complexity: ${improvements.complexity}`);
console.log(`   - Duplication: ${improvements.duplication}`);
console.log(`   - Maintainability: ${improvements.maintainability}`);

phaseState.code_improvements = improvements;
```

### Phase 6: Code Review
```typescript
// Check lint results
const lintResults = await runLinter();

if (lintResults.errors > 0) {
  throw new Error(`${lintResults.errors} linter error(s) found`);
}

if (lintResults.warnings > 0) {
  console.warn(`⚠️  ${lintResults.warnings} linter warning(s)`);
}

console.log(`✅ Code quality check passed`);
phaseState.lint_results = lintResults;
```

### Phase 7: QA Validation
```typescript
// Final test run
const testResults = await runAllTests();

if (testResults.failed > 0) {
  throw new Error(`QA validation failed: ${testResults.failed} test(s) failing`);
}

// Final coverage check
const coverage = await runCoverage();
const threshold = state.context.coverage_threshold || 80;

if (coverage.overall < threshold) {
  throw new Error(`Coverage ${coverage.overall}% below threshold ${threshold}%`);
}

console.log(`✅ All tests passing (${testResults.passed})`);
console.log(`✅ Coverage: ${coverage.overall}%`);

phaseState.final_test_results = testResults;
phaseState.final_coverage = coverage;
```

### Phase 8: Documentation
```typescript
// Validate documentation files
const docs = phaseState.deliverables.filter(f => f.endsWith('.md'));

if (docs.length === 0) {
  throw new Error('No documentation generated');
}

console.log(`📚 ${docs.length} documentation file(s) created`);
```

### Phase 9: Notification
```typescript
// Verify notifications sent
if (state.context.jira_ticket) {
  console.log(`✅ JIRA ticket updated`);
}

if (state.context.slack_channels) {
  console.log(`✅ Slack notifications sent`);
}

console.log(`🎉 Workflow complete!`);
```

---

## 📊 Metrics Collection

```typescript
async function collectPhaseMetrics(phase: number, phaseState: any) {
  const metrics: any = {
    duration_ms: phaseState.duration_ms,
    deliverables_count: phaseState.deliverables.length,
  };

  // Phase-specific metrics
  switch (phase) {
    case 4: // Test Planning
      const testPlan = readFile(phaseState.deliverables[0]);
      metrics.test_cases_count = (testPlan.match(/###.*test case/gi) || []).length;
      break;

    case 5: // Implementation phases
      metrics.test_results = phaseState.test_results;
      metrics.coverage = phaseState.coverage;
      metrics.files_changed = phaseState.deliverables.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).length;
      break;

    case 6: // Code Review
      metrics.lint_errors = phaseState.lint_results?.errors || 0;
      metrics.lint_warnings = phaseState.lint_results?.warnings || 0;
      break;

    case 7: // QA Validation
      metrics.tests_passed = phaseState.final_test_results?.passed || 0;
      metrics.final_coverage = phaseState.final_coverage?.overall || 0;
      break;
  }

  return metrics;
}
```

---

## 🎨 Post-Phase Banner

```typescript
function showCompletionBanner(phase: number, duration: string) {
  const banner = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PHASE ${phase} COMPLETED IN ${duration}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  console.log(banner);
}
```

---

## 📊 Logging

```typescript
interface PostPhaseLog {
  phase: number;
  phase_name: string;
  timestamp: string;
  duration_ms: number;
  deliverables_count: number;
  success_criteria_met: boolean;
  validation_passed: boolean;
  metrics: any;
}

// Log post-phase execution
logPostPhase({
  phase: currentPhase,
  phase_name: phaseState.name,
  timestamp: new Date().toISOString(),
  duration_ms: phaseState.duration_ms,
  deliverables_count: phaseState.deliverables.length,
  success_criteria_met: phaseState.success_criteria_met,
  validation_passed: true,
  metrics: phaseState.summary.metrics,
});
```

---

## 🛡️ Error Handling

```typescript
try {
  await executePostPhaseHook(phaseNumber);
} catch (error) {
  console.error(`❌ Post-phase hook failed: ${error.message}`);
  
  // Mark phase as failed
  state.phases[phaseNumber].status = 'failed';
  state.phases[phaseNumber].error = error.message;
  saveWorkflowState(state);
  
  // Don't show approval prompt
  console.log('\n⚠️  Phase validation failed. Cannot proceed to approval.\n');
  console.log('Please fix the issues and re-run the phase.\n');
  
  throw error;
}
```

---

## ✅ Post-Phase Checklist

- [ ] Timer stopped
- [ ] Duration calculated
- [ ] Deliverables validated
- [ ] **Diagrams validated (Phase 2, 3, 4)** ← NEW
- [ ] Phase-specific validation passed
- [ ] Success criteria checked
- [ ] Metrics collected
- [ ] Summary generated
- [ ] State saved
- [ ] Approval data prepared
- [ ] Logs written

---

## 📊 Diagram Validation (Phase 2, 3, 4)

Complex phases MUST include Mermaid diagrams. See `rules/diagram-requirements.md`.

```typescript
function validateDiagrams(phase: number, deliverables: string[]): DiagramValidation {
  const diagramRequirements = {
    2: { // Technical Planning
      required: ['architecture', 'sequence'],
      message: 'Phase 2 requires architecture diagram and main flow sequence diagram'
    },
    3: { // UI Breakdown
      required: ['component'],
      message: 'Phase 3 should include component hierarchy diagram'
    },
    4: { // Test Planning
      required: ['flowchart'],
      message: 'Phase 4 should include test coverage flowchart'
    }
  };

  const req = diagramRequirements[phase];
  if (!req) return { valid: true, warnings: [] };

  const warnings: string[] = [];

  for (const deliverable of deliverables) {
    const content = readFile(deliverable);
    const hasMermaid = content.includes('```mermaid');

    if (!hasMermaid && req.required.length > 0) {
      warnings.push(`⚠️  ${req.message}`);
      warnings.push(`   Add Mermaid diagrams to: ${deliverable}`);
    }
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

// Usage in post-phase hook
const diagramValidation = validateDiagrams(currentPhase, phaseState.deliverables);
if (!diagramValidation.valid) {
  diagramValidation.warnings.forEach(w => console.warn(w));
  console.warn('   See: rules/diagram-requirements.md');
  console.warn('   Reference: docs/WORKFLOW_DIAGRAMS.md');
}
```

---

**Version:** 1.0.0  
**Trigger:** After each phase execution  
**Critical:** YES - Must complete successfully before approval prompt

