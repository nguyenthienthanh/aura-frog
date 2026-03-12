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
const totalPhases = 5;
const completedPhases = Object.values(state.phases)
  .filter(p => p.status === 'completed').length;
const currentPhase = state.current_phase;
const progressPercent = Math.round((completedPhases / totalPhases) * 100);
```

### 3. Display Progress Report

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 WORKFLOW PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Workflow:** [workflow-name]
**ID:** [workflow-id]

## Overall Progress

```
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 60%
```

**Phase:** 3/5 - Build GREEN
**Status:** In Progress
**Started:** 2 hours ago

## Timeline

**Completed Phases:**
  ✅ Phase 1: Understand + Design      (20 min, 25K tokens)
  ✅ Phase 2: Test RED                 (11 min, 40K tokens)
  ⏳ Phase 3: Build GREEN              (15 min elapsed, 50K tokens)

**Remaining Phases:**
  ⏸️  Phase 4: Refactor + Review       (~12 min)
  ⏸️  Phase 5: Finalize                (~5 min)

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

- [x] Planning Complete (Phase 1)
- [x] Tests Written (Phase 2)
- [ ] Implementation Complete (Phase 3) - 66% done
- [ ] Review Complete (Phase 4)
- [ ] Finalized (Phase 5)
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
| 1. Understand + Design | 20 min | 15-35 min |
| 2. Test RED | 11 min | 8-15 min |
| 3. Build GREEN | 25 min | 15-40 min |
| 4. Refactor + Review | 15 min | 10-25 min |
| 5. Finalize | 5 min | 3-10 min |

**Total:** ~76 min (1h 16min average)

### Calculation

```typescript
function estimateRemaining(state: WorkflowState): TimeEstimate {
  const avgDurations = {
    1: 20, 2: 11, 3: 25, 4: 15, 5: 5
  };

  let remaining = 0;
  for (let i = state.current_phase + 1; i <= 5; i++) {
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
    name: 'Planning Complete',
    phases: [1],
    weight: 20
  },
  {
    name: 'Tests Written',
    phases: [2],
    weight: 15
  },
  {
    name: 'Implementation Complete',
    phases: [3],
    weight: 40
  },
  {
    name: 'Review Complete',
    phases: [4],
    weight: 15
  },
  {
    name: 'Finalized',
    phases: [5],
    weight: 10
  }
];
```

### Milestone Status

```markdown
## Milestones

- [x] ✅ Planning Complete (100%)
- [x] ✅ Tests Written (100%)
- [ ] ⏳ Implementation Complete (66%)
      └─ Phase 3 in progress
- [ ] ⏸️  Review Complete (0%)
- [ ] ⏸️  Finalized (0%)
```

---

## 📊 Output Examples

### Early Stage (Phase 1)

```
🚀 Workflow Progress

[=====>               ] 20%
Phase 1/5: Understand + Design

⏳ Phase 1: In progress (10 min elapsed)
⏸️  Phase 2-5: Pending

ETA: ~66 min remaining
Pace: ✅ Normal
```

### Mid Stage (Phase 3)

```
🚀 Workflow Progress

[===================> ] 60%
Phase 3/5: Build GREEN

✅ Phase 1-2: Complete (31 min)
⏳ Phase 3: In progress (15 min)
⏸️  Phase 4-5: Pending (~20 min)

ETA: ~20 min remaining
Pace: ✅ Normal
Tokens: 285K / 1M (28.5%)
```

### Late Stage (Phase 5)

```
🚀 Workflow Progress

[========================================>] 90%
Phase 5/5: Finalize

✅ Phase 1-4: Complete (71 min)
⏳ Phase 5: In progress (3 min)

ETA: ~2 min remaining
Pace: ✅ Normal
Quality: ✅ All gates passed
```

---

## 🎨 Visualization

### Timeline Chart

```
Time: |-----|-----|-----|-----|-----|-----|-----|
      0     10    20    30    40    50    60    70

P1:   |=========>|
P2:              |====>|
P3:                    |=============>| [NOW]
P4:                                  |======>|
P5:                                          |==>|
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
## Phase 3 Complete

**Progress:** 60% (Phase 3/5)
**Time:** 46min elapsed, ~20min remaining
**Tokens:** 285K used (28.5%)

[Deliverables...]

Options:
- approve → Continue to Phase 4
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
**Added:** Aura Frog v1.2

