# Pre-Phase Hook - Phase Initialization

**Version:** 1.0.0  
**Purpose:** Execute before each phase starts  
**Trigger:** Automatically run before Phase N execution

---

## 🎯 Purpose

Prepare environment and context before phase execution begins.

---

## 🔄 Execution Flow

```
Phase N-1 Approved
      ↓
[PRE-PHASE HOOK] ← YOU ARE HERE
      ↓
Phase N Execution
```

---

## ✅ Pre-Phase Checklist

### 1. Load Workflow State
```typescript
const state = loadWorkflowState();
const currentPhase = state.current_phase;
const phaseName = PHASES[currentPhase].name;

console.log(`\n${'='.repeat(60)}`);
console.log(`🚀 STARTING PHASE ${currentPhase}: ${phaseName}`);
console.log(`${'='.repeat(60)}\n`);
```

### 2. Verify Prerequisites
```typescript
// Check if previous phase was approved
const prevPhase = state.phases[currentPhase - 1];
if (prevPhase && prevPhase.status !== 'approved') {
  throw new Error(`Cannot start Phase ${currentPhase}: Previous phase not approved`);
}

// Check if required agents are active
const requiredAgents = PHASES[currentPhase].required_agents;
const activeAgents = state.context.agents;
const missingAgents = requiredAgents.filter(a => !activeAgents.includes(a));

if (missingAgents.length > 0) {
  console.warn(`⚠️  Missing agents: ${missingAgents.join(', ')}`);
  // Activate missing agents
  await activateAgents(missingAgents);
}
```

### 3. Initialize Phase State
```typescript
state.phases[currentPhase] = {
  name: phaseName,
  status: 'in_progress',
  started_at: new Date().toISOString(),
  deliverables: [],
  logs: [],
};

saveWorkflowState(state);
```

### 4. Load Phase Context
```typescript
// Load previous phase deliverables
const previousDeliverables = currentPhase > 1 
  ? state.phases[currentPhase - 1].deliverables 
  : [];

// Load project context
const projectContext = await loadProjectContext();

// Prepare phase context
const phaseContext = {
  phase: currentPhase,
  previousDeliverables,
  projectContext,
  workflowState: state,
};
```

### 5. Show Phase Info
```typescript
console.log(`📋 Phase ${currentPhase}: ${phaseName}`);
console.log(`📅 Started: ${new Date().toLocaleString()}`);
console.log(`🤖 Active Agents: ${activeAgents.join(', ')}`);
console.log(`📦 Previous Deliverables: ${previousDeliverables.length} file(s)`);
console.log(`\n🎯 Objectives:`);

PHASES[currentPhase].objectives.forEach((obj, i) => {
  console.log(`   ${i + 1}. ${obj}`);
});

console.log(`\n✅ Success Criteria:`);
PHASES[currentPhase].success_criteria.forEach((criteria, i) => {
  console.log(`   ${i + 1}. ${criteria}`);
});

console.log(`\n${'─'.repeat(60)}\n`);
```

### 6. Start Phase Timer & Token Tracking
```typescript
state.phases[currentPhase].timer_start = Date.now();

// Initialize token tracking
state.phases[currentPhase].tokens = {
  start: getCurrentTokenUsage(),
  phase_tokens: 0,
  cumulative_tokens: state.total_tokens_used || 0,
};

saveWorkflowState(state);
```

---

## 📋 Phase-Specific Setup

### Phase 1: Understand + Design
```typescript
// Load JIRA ticket if provided
if (state.context.jira_ticket) {
  const ticket = await fetchJiraTicket(state.context.jira_ticket);
  state.context.requirements = ticket.description;
}

// Load Confluence docs if provided
if (state.context.confluence_pages) {
  const docs = await fetchConfluenceDocs(state.context.confluence_pages);
  state.context.related_docs = docs;
}

// Load codebase context
const files = await analyzeCodebase(state.context.files_to_change);
state.context.codebase_analysis = files;

// Load architecture patterns
const patterns = await loadArchitecturePatterns();
state.context.available_patterns = patterns;

// Load Figma designs if provided
if (state.context.figma_url) {
  const designs = await extractFigmaDesigns(state.context.figma_url);
  state.context.design_specs = designs;
}

// Load UI components library
const components = await loadUIComponentsLibrary();
state.context.available_components = components;
```

### Phase 2: Test RED
```typescript
// Load existing tests
const existingTests = await findExistingTests(state.context.files_to_change);
state.context.existing_tests = existingTests;

// Load test patterns
const testPatterns = await loadTestPatterns();
state.context.test_patterns = testPatterns;

// Verify no test files exist yet
const testFiles = state.phases[1].deliverables.filter(f => f.includes('.test.'));
if (testFiles.length === 0) {
  console.warn('⚠️  No test files planned. Cannot proceed with TDD.');
  throw new Error('Test planning incomplete');
}
```

### Phase 3: Build GREEN
```typescript
// Verify tests exist and are failing
const testResults = await runTests();
if (testResults.passed > 0 && testResults.failed === 0) {
  console.warn('⚠️  All tests passing. Not following TDD RED phase.');
}
```

### Phase 4: Refactor + Review
```typescript
// Verify tests pass before refactoring
const testResults = await runTests();
if (testResults.failed > 0) {
  throw new Error('Cannot refactor: Tests failing. Fix tests first.');
}

// Save baseline metrics
state.context.baseline_metrics = await collectCodeMetrics();

// Load code quality rules
const rules = await loadCodeQualityRules();
state.context.code_quality_rules = rules;

// Run linter
const lintResults = await runLinter();
state.context.lint_results = lintResults;

// Run all tests + coverage
const allTestResults = await runAllTests();
state.context.test_results = allTestResults;
const coverage = await runCoverage();
state.context.coverage = coverage;
```

### Phase 5: Finalize
```typescript
// Load documentation templates
const templates = await loadDocTemplates();
state.context.doc_templates = templates;

// Collect changes summary
const changes = await collectChangesSummary();
state.context.changes_summary = changes;

// Prepare notification data
state.context.notification_data = {
  jira_ticket: state.context.jira_ticket,
  slack_channels: state.context.slack_channels || [],
  summary: generateWorkflowSummary(state),
};
```

---

## 🎨 Pre-Phase Banner

```typescript
function showPhaseBanner(phaseNumber: number, phaseName: string) {
  const banner = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PHASE ${phaseNumber}: ${phaseName.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  console.log(banner);
}
```

---

## 📊 Logging

```typescript
interface PrePhaseLog {
  phase: number;
  phase_name: string;
  timestamp: string;
  prerequisites_met: boolean;
  agents_activated: string[];
  context_loaded: boolean;
  duration_ms: number;
}

// Log pre-phase execution
logPrePhase({
  phase: currentPhase,
  phase_name: phaseName,
  timestamp: new Date().toISOString(),
  prerequisites_met: true,
  agents_activated: activeAgents,
  context_loaded: true,
  duration_ms: Date.now() - startTime,
});
```

---

## 🛡️ Error Handling

```typescript
try {
  await executePrePhaseHook(phaseNumber);
} catch (error) {
  console.error(`❌ Pre-phase hook failed: ${error.message}`);
  
  // Save error state
  state.phases[phaseNumber].status = 'error';
  state.phases[phaseNumber].error = error.message;
  saveWorkflowState(state);
  
  // Notify user
  console.log('\n⚠️  Cannot start phase. Please fix the error and try again.\n');
  
  // Don't proceed to phase execution
  throw error;
}
```

---

## ✅ Pre-Phase Checklist

- [ ] Workflow state loaded
- [ ] Previous phase verified (approved)
- [ ] Required agents activated
- [ ] Phase state initialized
- [ ] Phase context prepared
- [ ] Phase info displayed
- [ ] Timer started
- [ ] Phase-specific setup complete
- [ ] Logs written

---

**Version:** 1.0.0  
**Trigger:** Before each phase execution  
**Critical:** YES - Must complete successfully before phase runs

