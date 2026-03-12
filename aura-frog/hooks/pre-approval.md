# Pre-Approval Hook - Approval Prompt Display

**Version:** 1.0.0  
**Purpose:** Display approval prompt and wait for user decision  
**Trigger:** After post-phase hook completes

---

## 🎯 Purpose

Show formatted approval prompt with phase summary and wait for user response.

---

## 🔄 Execution Flow

```
Post-Phase Hook Complete
      ↓
[PRE-APPROVAL HOOK] ← YOU ARE HERE
      ↓
Wait for User Response
      ↓
Process Response (approve/reject/modify/cancel)
```

---

## 📋 Approval Prompt Generation

### 1. Load Approval Data
```typescript
const state = loadWorkflowState();
const currentPhase = state.current_phase;
const phaseState = state.phases[currentPhase];
const phase = PHASES[currentPhase];
```

### 2. Format Phase Summary
```typescript
const summary = formatPhaseSummary(phaseState);
```

### 3. Show Approval Prompt
```typescript
showApprovalPrompt({
  phase: currentPhase,
  phaseName: phase.name,
  summary: phaseState.summary,
  deliverables: phaseState.deliverables,
  successCriteria: phase.success_criteria,
  successCriteriaMet: phaseState.success_criteria_met,
  nextPhase: currentPhase < 5 ? PHASES[currentPhase + 1] : null,
  metrics: phaseState.summary.metrics,
});
```

---

## 🎨 Approval Prompt Template

```typescript
function showApprovalPrompt(data: ApprovalData) {
  const { phase, phaseName, summary, deliverables, successCriteria, 
          successCriteriaMet, nextPhase, metrics } = data;

  console.log('\n');
  console.log('═'.repeat(70));
  console.log(`🎯 PHASE ${phase} COMPLETE: ${phaseName}`);
  console.log('═'.repeat(70));
  console.log('');

  // Summary Section
  console.log('📊 **SUMMARY:**');
  console.log('');
  console.log(summary.description);
  console.log('');
  console.log(`⏱️  Duration: ${summary.duration}`);
  console.log(`📦 Deliverables: ${deliverables.length} file(s)`);
  console.log('');

  // Deliverables Section
  if (deliverables.length > 0) {
    console.log('📦 **DELIVERABLES:**');
    deliverables.forEach(file => {
      const icon = getFileIcon(file);
      console.log(`   ${icon} ${file}`);
    });
    console.log('');
  }

  // Success Criteria Section
  console.log('✅ **SUCCESS CRITERIA:**');
  successCriteria.forEach((criteria, i) => {
    const met = successCriteriaMet || checkCriteriaFromState(criteria, phaseState);
    const icon = met ? '✅' : '❌';
    console.log(`   ${icon} ${criteria}`);
  });
  console.log('');

  // Metrics Section (if available)
  if (metrics && Object.keys(metrics).length > 0) {
    console.log('📈 **METRICS:**');
    for (const [key, value] of Object.entries(metrics)) {
      console.log(`   - ${formatMetricKey(key)}: ${value}`);
    }
    console.log('');
  }

  // Next Phase Section
  if (nextPhase) {
    console.log(`⏭️  **NEXT PHASE:** Phase ${phase + 1} - ${nextPhase.name}`);
    console.log(`   ${nextPhase.description}`);
    console.log('');
  } else {
    console.log('🎉 **WORKFLOW COMPLETE!**');
    console.log('   All phases finished. Ready to notify stakeholders.');
    console.log('');
  }

  // Action Required Section
  console.log('─'.repeat(70));
  console.log('⚠️  **ACTION REQUIRED**');
  console.log('');
  console.log('Please review the above and respond with ONE of:');
  console.log('');
  console.log('  ✅ Type "approve"  → Proceed to next phase');
  console.log('  🔄 Type "reject"   → Restart this phase with feedback');
  console.log('  ✏️  Type "modify"   → Make changes before proceeding');
  console.log('  ❌ Type "cancel"   → Stop workflow (save state)');
  if (phase > 1) {
    console.log('  ⏪ Type "back"     → Return to previous phase');
  }
  console.log('');
  console.log('─'.repeat(70));
  console.log('');
  console.log('**Your response:** ');
  console.log('');
}
```

---

## 🎨 Phase-Specific Summaries

### Phase 1: Understand + Design
```typescript
{
  description: `
Analyzed requirements, created architecture, and reviewed design:
- {requirement_count} requirements identified
- {component_count} components planned
- {file_count} files to be created/modified
- {integration_point_count} integration points identified
`,
  highlights: [
    'Requirements and scope defined',
    'Architecture diagram created',
    'Component hierarchy defined',
    'Design matches requirements'
  ]
}
```

### Phase 2: Test RED
```typescript
{
  description: `
Test plan created and failing tests written (TDD RED):
- {test_case_count} test cases planned
- {test_file_count} test files created
- {test_count} tests written
- {failed_count} tests failing (expected) 🔴
`,
  highlights: [
    'Test strategy defined',
    'Tests cover all requirements',
    'Tests are executable',
    'Ready for implementation'
  ]
}
```

### Phase 3: Build GREEN
```typescript
{
  description: `
Implementation complete, tests passing:
- {file_count} files implemented
- {test_count} tests passing 🟢
- Coverage: {coverage}%
- Linter: {lint_status}
`,
  highlights: [
    'All tests pass',
    'Coverage threshold met',
    'No linter errors'
  ]
}
```

### Phase 4: Refactor + Review
```typescript
{
  description: `
Code refactored, reviewed, and validated:
- Complexity reduced by {complexity_improvement}%
- {file_count} files reviewed
- {test_count} tests passed ✅
- Coverage: {coverage}% (threshold: {threshold}%)
- Code quality score: {quality_score}/10
`,
  highlights: [
    'Code quality improved',
    'No behavior changes',
    'All tests still pass',
    'Coverage meets threshold'
  ]
}
```

### Phase 5: Finalize
```typescript
{
  description: `
Documentation complete and notifications sent:
- {doc_count} documentation files created
- JIRA ticket updated: {jira_ticket}
- Slack notifications sent: {channel_count} channel(s)
`,
  highlights: [
    'Implementation documented',
    'Stakeholders notified',
    'Documentation linked',
    'Workflow closed'
  ]
}
```

---

## 🎯 Visual Enhancements

### File Icons
```typescript
function getFileIcon(filename: string): string {
  if (filename.includes('.test.')) return '🧪';
  if (filename.endsWith('.md')) return '📄';
  if (filename.endsWith('.tsx')) return '⚛️';
  if (filename.endsWith('.ts')) return '📘';
  if (filename.endsWith('.json')) return '📋';
  if (filename.endsWith('.sh')) return '🔧';
  if (filename.includes('diagram')) return '📊';
  return '📁';
}
```

### Metric Formatting
```typescript
function formatMetricKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
```

### Duration Formatting
```typescript
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
```

---

## 💬 Input Handling

### Wait for User Input
```typescript
async function waitForUserResponse(): Promise<string> {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question('', (answer: string) => {
      readline.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}
```

### Validate Response
```typescript
function validateResponse(response: string, currentPhase: number): ValidationResult {
  const validResponses = ['approve', 'reject', 'modify', 'cancel'];
  
  if (currentPhase > 1) {
    validResponses.push('back');
  }

  // Accept variations
  const normalizedResponse = normalizeResponse(response);

  if (validResponses.includes(normalizedResponse)) {
    return { valid: true, normalized: normalizedResponse };
  }

  return { 
    valid: false, 
    error: `Invalid response: "${response}". Please type one of: ${validResponses.join(', ')}` 
  };
}

function normalizeResponse(response: string): string {
  const aliases = {
    'approved': 'approve',
    'ok': 'approve',
    'proceed': 'approve',
    'continue': 'approve',
    'yes': 'approve',
    'y': 'approve',
    'go': 'approve',
    
    'rejected': 'reject',
    'no': 'reject',
    'restart': 'reject',
    'redo': 'reject',
    
    'edit': 'modify',
    'change': 'modify',
    'update': 'modify',
    
    'stop': 'cancel',
    'abort': 'cancel',
    'quit': 'cancel',
    
    'previous': 'back',
    'return': 'back',
  };

  return aliases[response] || response;
}
```

---

## 🔄 Response Processing Loop

```typescript
async function getValidUserResponse(currentPhase: number): Promise<string> {
  while (true) {
    const response = await waitForUserResponse();
    const validation = validateResponse(response, currentPhase);

    if (validation.valid) {
      return validation.normalized;
    } else {
      console.log(`\n❌ ${validation.error}\n`);
      console.log('**Your response:** ');
    }
  }
}
```

---

## 📊 Logging

```typescript
interface PreApprovalLog {
  phase: number;
  phase_name: string;
  timestamp: string;
  prompt_shown: boolean;
  deliverables_count: number;
  success_criteria_met: boolean;
}

// Log approval prompt display
logPreApproval({
  phase: currentPhase,
  phase_name: phase.name,
  timestamp: new Date().toISOString(),
  prompt_shown: true,
  deliverables_count: phaseState.deliverables.length,
  success_criteria_met: phaseState.success_criteria_met,
});
```

---

## 🛡️ Error Handling

```typescript
try {
  await showApprovalPromptAndWait(currentPhase);
} catch (error) {
  console.error(`❌ Approval prompt failed: ${error.message}`);
  
  // Save error state
  state.status = 'error';
  state.error = error.message;
  saveWorkflowState(state);
  
  throw error;
}
```

---

## ✅ Pre-Approval Checklist

- [ ] Approval data loaded
- [ ] Phase summary formatted
- [ ] Deliverables listed
- [ ] Success criteria displayed
- [ ] Metrics shown (if available)
- [ ] Next phase previewed
- [ ] Action options shown
- [ ] Prompt displayed
- [ ] Waiting for user input

---

**Version:** 1.0.0  
**Trigger:** After post-phase hook, before processing user response  
**Critical:** YES - Core of approval gate mechanism

