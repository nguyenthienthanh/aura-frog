# 🎯 Token Tracking System

**Version:** 1.0.0  
**Purpose:** Track and optimize token consumption in CCPM workflows

---

## 📊 Overview

CCPM v4.1 includes **automatic token tracking** at every phase, helping you:
- Monitor context usage
- Optimize workflow efficiency
- Avoid hitting context limits
- Plan long conversations

---

## 🎮 Usage

### View Token Usage

```bash
# Command style
workflow:tokens

# Natural language
"Show token usage"
"How many tokens used?"
"Token report"
```

### Example Output

```
╔══════════════════════════════════════════════════════════╗
║  📊 TOKEN USAGE REPORT                                   ║
╚══════════════════════════════════════════════════════════╝

Workflow: add-user-authentication
ID: add-user-authentication-20251124-120000

Total Usage:
  █████████████░░░░░░░░░░░░░░░░░░░░░░░░░ 25%
  Used: 250,000 tokens (~250K)
  Remaining: 750,000 tokens (~750K)

Phase Breakdown:

  ✅ Phase 1: Requirements Analysis        25,000 tokens (~25K)
  ✅ Phase 2: Technical Planning           45,000 tokens (~45K)
  ✅ Phase 3: Design Review                30,000 tokens (~30K)
  ✅ Phase 4: Test Planning                35,000 tokens (~35K)
  ✅ Phase 5a: TDD RED                     40,000 tokens (~40K)
  ⏳ Phase 5b: TDD GREEN                   50,000 tokens (~50K)
  ⏸️  Phase 5c: TDD REFACTOR                    0 tokens (~0K)

✅ Sufficient context remaining - Continue workflow
```

---

## 🔧 How It Works

### Automatic Tracking

**1. Pre-Phase Hook**
- Records token count at phase start
- Initializes phase token tracking

**2. Phase Execution**
- Tokens consumed during phase work

**3. Post-Phase Hook**
- Calculates tokens used in phase
- Updates cumulative total
- Displays token usage
- Shows progress bar

### Token Calculation

```typescript
// At phase start
phase.tokens.start = getCurrentTokenUsage();

// At phase end
phase.tokens.end = getCurrentTokenUsage();
phase.tokens.phase_tokens = phase.tokens.end - phase.tokens.start;

// Update workflow total
workflow.total_tokens_used += phase.tokens.phase_tokens;
workflow.total_tokens_remaining = 1000000 - workflow.total_tokens_used;
```

---

## 📋 Workflow State Structure

```json
{
  "workflow_id": "add-auth-20251124-120000",
  "workflow_name": "add-user-authentication",
  "total_tokens_used": 250000,
  "total_tokens_remaining": 750000,
  "auto_continue": true,
  "phases": {
    "1": {
      "name": "Requirements Analysis",
      "status": "completed",
      "tokens": {
        "start": 10000,
        "end": 35000,
        "phase_tokens": 25000,
        "cumulative_tokens": 25000
      },
      "duration_ms": 420000
    },
    "2": {
      "name": "Technical Planning",
      "status": "completed",
      "tokens": {
        "start": 35000,
        "end": 80000,
        "phase_tokens": 45000,
        "cumulative_tokens": 70000
      },
      "duration_ms": 540000
    }
  }
}
```

---

## 🎯 Token Usage Guidelines

### Context Limits

| Model | Context Window (API) | Cursor Limit |
|-------|---------------------|--------------|
| Claude 3.5 Sonnet | 1,000,000 tokens | **200,000 tokens** |
| Claude 3 Opus | 200,000 tokens | 200,000 tokens |
| Claude 3 Haiku | 200,000 tokens | 200,000 tokens |

**⚠️ IMPORTANT: Cursor limits to 200K tokens per session**

**CCPM in Cursor = 200K tokens** (not 1M!)

### Usage Thresholds

| Usage % | Status | Action |
|---------|--------|--------|
| 0-40% (0-80K) | ✅ Good | Continue normally |
| 40-60% (80-120K) | ⚠️ Moderate | Monitor phases |
| 60-75% (120-150K) | ⚠️ High | Plan handoff soon |
| 75-100% (150-200K) | 🚨 Critical | Run workflow:handoff NOW |

### Typical Phase Costs

| Phase | Avg Tokens | Range |
|-------|-----------|-------|
| 1. Requirements | 25K | 15-35K |
| 2. Technical Planning | 45K | 35-60K |
| 3. Design Review | 30K | 20-40K |
| 4. Test Planning | 35K | 25-45K |
| 5a. TDD RED | 40K | 30-50K |
| 5b. TDD GREEN | 55K | 40-80K |
| 5c. TDD REFACTOR | 35K | 25-50K |
| 6. Code Review | 30K | 20-40K |
| 7. QA Validation | 25K | 15-35K |
| 8. Documentation | 20K | 15-30K |
| 9. Notification | 5K | 3-10K |

**Total Workflow:** ~350K tokens average

---

## 💡 Optimization Tips

### Reduce Token Usage

**1. Be Concise**
```
❌ "I need you to analyze this entire codebase and..."
✅ "Analyze UserProfile.tsx for refactoring"
```

**2. Focus Context**
```
❌ Include entire file (1000 lines)
✅ Include relevant sections (50-100 lines)
```

**3. Clear Requirements**
```
❌ "Make it better"
✅ "Split into 3 components: Header, Content, Footer"
```

**4. Incremental Approvals**
```
✅ Approve each phase → auto-continue
❌ Long discussions between phases
```

### Maximize Efficiency

**1. Use Project Context**
- Store conventions in `project-contexts/`
- Reference once, reuse throughout

**2. Leverage Templates**
- Use CCPM templates
- Consistent structure = fewer tokens

**3. Smart Phase Planning**
- Skip unnecessary phases
- Combine when appropriate
- Focus on implementation

---

## 🔍 Monitoring

### During Workflow

**After Each Phase:**
```
⏱️  Phase completed in 7 minutes
🎯 Tokens used: 45,000 (~45K)
📊 Total tokens: 115,000 / 1M (11%)
```

### Check Anytime

```bash
workflow:tokens
```

### Token Logs

```bash
# View execution log with token data
tail .claude/logs/workflows/[workflow-id]/execution.log

# Check tokens log
cat .claude/logs/workflows/[workflow-id]/tokens.log
```

---

## 📊 Reports

### Phase Summary Report

Shows at phase completion:

```markdown
## Phase 2: Technical Planning Complete

**Summary:** Created technical specification with...

**Deliverables:**
- ✅ tech-spec.md
- ✅ architecture-diagram.md

**Metrics:**
- Duration: 9 minutes
- Tokens: 45,000 (~45K)
- Cumulative: 70,000 / 1M (7%)

**Next:** Phase 3 - Design Review
```

### Workflow Complete Report

Shows at workflow end (Phase 9):

```markdown
🎉 Workflow Complete!

**Metrics:**
- Total Duration: 3.5 hours
- Total Tokens: 345,000 (~345K / 34%)
- Phases Completed: 9/9
- Test Coverage: 87%

**Token Breakdown:**
- Planning (1-4): 135K (39%)
- Implementation (5): 130K (38%)
- Validation (6-8): 75K (22%)
- Notification (9): 5K (1%)

**Efficiency:** Excellent ✅
```

---

## 🛠️ Scripts

### track-tokens.sh

```bash
# Show token report
bash .claude/scripts/workflow/track-tokens.sh show

# Log token usage
bash .claude/scripts/workflow/track-tokens.sh log

# Estimate tokens
bash .claude/scripts/workflow/track-tokens.sh estimate "Text to estimate"
```

### Features
- ✅ Colored output
- ✅ Progress bars
- ✅ Phase breakdown
- ✅ Warnings & recommendations
- ✅ Token estimation

---

## 🎯 Best Practices

### 1. Monitor Regularly
- Check after each phase
- Watch for sudden spikes
- Plan remaining phases

### 2. Optimize Prompts
- Be specific and concise
- Provide focused context
- Use clear requirements

### 3. Use Auto-Continue
- Approve phases to continue
- Reduces conversation overhead
- More efficient token usage

### 4. Save Important Context
- Document key decisions
- Store in deliverables
- Reference later if needed

### 5. Start Fresh When Needed
- If approaching 90%+
- Complex workflows need space
- Better than hitting limit

---

## ⚠️ Warnings

### High Usage Alert

```
⚠️  Warning: High token usage (82%)
   - Consider completing workflow soon
   - Or start new conversation context
   - Save important context before limit
```

### Context Limit Approaching

```
🚨 CRITICAL: Token limit approaching (75%+/150K+)
   - Run: workflow:handoff
   - Save all context
   - Open new Cursor session
   - Resume with: workflow:resume [workflow-id]
```

### Handoff Strategy

**At 150K tokens (75%):**
```bash
# Prepare handoff
workflow:handoff

# Output shows:
✅ Context saved to HANDOFF_CONTEXT.md
✅ Resume command: workflow:resume [id]

# Open NEW Cursor session
# Run: workflow:resume [id]
# Continue seamlessly!
```

---

## 📈 Analytics

### Token Efficiency Score

```typescript
// Calculate efficiency
const avgPerPhase = totalTokens / completedPhases;
const efficiency = avgPerPhase < 40000 ? 'Excellent' :
                   avgPerPhase < 50000 ? 'Good' :
                   avgPerPhase < 60000 ? 'Fair' : 'Needs Improvement';
```

### Metrics Tracked

- Total tokens consumed
- Tokens per phase
- Average per phase
- Cumulative usage
- Remaining capacity
- Efficiency score
- Time per 1K tokens

---

## 🔄 Integration

### CLAUDE.md

Token tracking integrated into:
- Pre-phase hooks
- Post-phase hooks
- Approval gates
- Status reports

### Commands

New command added:
- `workflow:tokens` - Show usage report

### Scripts

New script added:
- `track-tokens.sh` - CLI token tracking

---

## 🎉 Benefits

✅ **Visibility** - Always know token usage  
✅ **Planning** - Estimate remaining capacity  
✅ **Efficiency** - Optimize prompts  
✅ **Prevention** - Avoid hitting limits  
✅ **Insights** - Understand patterns  
✅ **Control** - Make informed decisions  

---

**Token tracking helps you make the most of CCPM workflows! 🚀**

---

*Version: 1.0.0*  
*Added: 2025-11-24*  
*Part of: CCPM v4.1*

