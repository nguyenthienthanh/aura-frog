# Command: workflow:progress

**Purpose:** Show workflow progress and timeline  
**Aliases:** `progress`, `status timeline`, `show progress`

---

## 🎯 Command Overview

Display detailed progress visualization for the active workflow including timeline, phase completion, and estimated time remaining.

---

## 📊 Usage

```bash
# Show progress
workflow:progress

# Or natural language
"Show progress"
"How far are we?"
"Timeline status"
```

---

## 📋 Execution Steps

### 1. Load Workflow State

```typescript
const state = loadWorkflowState();

if (!state || !state.workflow_id) {
  console.log('❌ No active workflow');
  return;
}
```

### 2. Calculate Progress

```typescript
const totalPhases = 9;
const completedPhases = Object.values(state.phases)
  .filter(p => p.status === 'completed').length;
const currentPhase = state.current_phase;
const progressPercent = Math.round((completedPhases / totalPhases) * 100);
```

### 3. Display Progress Report

```markdown
╔══════════════════════════════════════════════════════════╗
║  🚀 WORKFLOW PROGRESS                                    ║
╚══════════════════════════════════════════════════════════╝

**Workflow:** [workflow-name]
**ID:** [workflow-id]

## Overall Progress

```
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 60%
```

**Phase:** 5b/9 - TDD GREEN (Implement)  
**Status:** In Progress  
**Started:** 2 hours ago

## Timeline

**Completed Phases:**
  ✅ Phase 1: Requirements Analysis    (7 min, 25K tokens)
  ✅ Phase 2: Technical Planning       (12 min, 45K tokens)
  ✅ Phase 3: Design Review            (8 min, 30K tokens)
  ✅ Phase 4: Test Planning            (10 min, 35K tokens)
  ✅ Phase 5a: TDD RED                 (11 min, 40K tokens)
  ⏳ Phase 5b: TDD GREEN               (15 min elapsed, 50K tokens)

**Remaining Phases:**
  ⏸️  Phase 5c: TDD REFACTOR           (~12 min)
  ⏸️  Phase 6: Code Review             (~8 min)
  ⏸️  Phase 7: QA Validation           (~7 min)
  ⏸️  Phase 8: Documentation           (~10 min)
  ⏸️  Phase 9: Notification            (~2 min)

## Estimates

**Time:**
- Elapsed: 1h 3min
- Remaining: ~40 min
- Total Est: ~1h 43min

**Tokens:**
- Used: 285K / 1M (28.5%)
- Remaining Est: ~105K
- Total Est: ~390K

## Velocity

**Average per Phase:**
- Time: 10.5 min/phase
- Tokens: 47.5K/phase

**Current Pace:** On track ✅

## Milestones

- [x] Requirements Complete (Phase 1)
- [x] Planning Complete (Phases 2-4)
- [ ] Implementation Complete (Phase 5) - 66% done
- [ ] Validation Complete (Phases 6-7)
- [ ] Deployment Ready (Phases 8-9)
```

---

## 📊 Progress Bar

```typescript
function createProgressBar(percent: number, length: number = 50): string {
  const filled = Math.round((percent / 100) * length);
  const current = Math.min(filled + 1, length);
  
  let bar = '';
  for (let i = 0; i < length; i++) {
    if (i < filled) {
      bar += '█';
    } else if (i === filled) {
      bar += '>';
    } else {
      bar += '░';
    }
  }
  
  return bar;
}

// Example:
// 0%:   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// 25%:  ████████████>░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// 50%:  █████████████████████████>░░░░░░░░░░░░░░░░░░░░░░░░
// 100%: ██████████████████████████████████████████████████
```

---

## ⏱️ Time Estimates

### Typical Phase Durations

| Phase | Avg Duration | Range |
|-------|-------------|-------|
| 1. Requirements | 7 min | 5-15 min |
| 2. Technical Planning | 12 min | 10-20 min |
| 3. Design Review | 8 min | 5-15 min |
| 4. Test Planning | 10 min | 8-15 min |
| 5a. TDD RED | 11 min | 8-15 min |
| 5b. TDD GREEN | 25 min | 15-40 min |
| 5c. TDD REFACTOR | 12 min | 10-20 min |
| 6. Code Review | 8 min | 5-12 min |
| 7. QA Validation | 7 min | 5-10 min |
| 8. Documentation | 10 min | 8-15 min |
| 9. Notification | 2 min | 1-3 min |

**Total:** ~110 min (1h 50min average)

### Calculation

```typescript
function estimateRemaining(state: WorkflowState): TimeEstimate {
  const avgDurations = {
    1: 7, 2: 12, 3: 8, 4: 10,
    5: 48, // 5a + 5b + 5c combined
    6: 8, 7: 7, 8: 10, 9: 2
  };
  
  let remaining = 0;
  for (let i = state.current_phase + 1; i <= 9; i++) {
    remaining += avgDurations[i] || 10;
  }
  
  // Add current phase remaining time
  const currentElapsed = Date.now() - state.phases[state.current_phase].started_at;
  const currentAvg = avgDurations[state.current_phase] || 10;
  const currentRemaining = Math.max(0, currentAvg - (currentElapsed / 60000));
  
  return {
    remaining: remaining + currentRemaining,
    total: state.total_elapsed + remaining + currentRemaining
  };
}
```

---

## 📈 Velocity Tracking

### Metrics

```typescript
interface VelocityMetrics {
  avg_phase_duration: number;    // minutes
  avg_tokens_per_phase: number;  // tokens
  phases_per_hour: number;
  current_pace: 'fast' | 'normal' | 'slow';
  eta_accuracy: number;          // %
}
```

### Pace Calculation

```typescript
function calculatePace(state: WorkflowState): string {
  const completedPhases = Object.values(state.phases)
    .filter(p => p.status === 'completed');
  
  const avgDuration = completedPhases.reduce((sum, p) => 
    sum + p.duration_ms, 0) / completedPhases.length / 60000;
  
  if (avgDuration < 8) return '⚡ Fast';
  if (avgDuration < 12) return '✅ Normal';
  return '🐌 Slow';
}
```

---

## 🎯 Milestones

### Milestone Definitions

```typescript
const milestones = [
  {
    name: 'Requirements Complete',
    phases: [1],
    weight: 10
  },
  {
    name: 'Planning Complete',
    phases: [2, 3, 4],
    weight: 30
  },
  {
    name: 'Implementation Complete',
    phases: [5],  // 5a, 5b, 5c
    weight: 40
  },
  {
    name: 'Validation Complete',
    phases: [6, 7],
    weight: 15
  },
  {
    name: 'Deployment Ready',
    phases: [8, 9],
    weight: 5
  }
];
```

### Milestone Status

```markdown
## Milestones

- [x] ✅ Requirements Complete (100%)
- [x] ✅ Planning Complete (100%)
- [ ] ⏳ Implementation Complete (66%)
      └─ Phase 5b in progress
- [ ] ⏸️  Validation Complete (0%)
- [ ] ⏸️  Deployment Ready (0%)
```

---

## 📊 Output Examples

### Early Stage (Phase 2)

```
🚀 Workflow Progress

[=====>               ] 22%
Phase 2/9: Technical Planning

✅ Phase 1: Requirements (7 min)
⏳ Phase 2: In progress (5 min elapsed)
⏸️  Phase 3-9: Pending

ETA: ~90 min remaining
Pace: ✅ Normal
```

### Mid Stage (Phase 5b)

```
🚀 Workflow Progress

[===================> ] 60%
Phase 5b/9: TDD GREEN

✅ Phase 1-5a: Complete (48 min)
⏳ Phase 5b: In progress (15 min)
⏸️  Phase 5c-9: Pending (~40 min)

ETA: ~40 min remaining
Pace: ✅ Normal
Tokens: 285K / 1M (28.5%)
```

### Late Stage (Phase 8)

```
🚀 Workflow Progress

[========================================>] 89%
Phase 8/9: Documentation

✅ Phase 1-7: Complete (95 min)
⏳ Phase 8: In progress (5 min)
⏸️  Phase 9: Notification (~2 min)

ETA: ~7 min remaining
Pace: ✅ Normal
Quality: ✅ All gates passed
```

---

## 🎨 Visualization

### Timeline Chart

```
Time: |-----|-----|-----|-----|-----|-----|-----|-----|-----|
      0     20    40    60    80   100   120   140   160   180
      
P1:   |==>|
P2:        |=======>|
P3:                 |===>|
P4:                      |====>|
P5a:                           |====>|
P5b:                                 |=============>| [NOW]
P5c:                                              |=====>|
P6:                                                     |==>|
P7:                                                        |==>|
P8:                                                           |====>|
P9:                                                                |>|
```

---

## 🔧 Integration

### With workflow:status

```bash
workflow:status    # Shows current phase details
workflow:progress  # Shows overall timeline
workflow:tokens    # Shows token usage
workflow:metrics   # Shows quality metrics
```

### With Approval Gates

Show progress in approval prompt:

```markdown
## Phase 5b Complete

**Progress:** 60% (Phase 5b/9)
**Time:** 1h 3min elapsed, ~40min remaining
**Tokens:** 285K used (28.5%)

[Deliverables...]

Options:
- approve → Continue to Phase 5c
```

---

## ✅ Success Criteria

✅ Progress percentage displayed  
✅ Timeline visualization shown  
✅ Phase completion status clear  
✅ Time estimates provided  
✅ Token usage integrated  
✅ Milestones tracked  
✅ Velocity calculated  
✅ ETA accuracy good

---

**Command:** workflow:progress  
**Version:** 1.0.0  
**Added:** CCPM v4.2

