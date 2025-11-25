# Command: workflow:tokens

**Purpose:** Display token usage for current workflow  
**Aliases:** `tokens`, `token usage`, `show tokens`
**Trigger:** User types `/workflow:tokens`

---

## 📊 Command Overview

Show detailed token consumption breakdown for the active workflow.

---

## 🎯 Usage

```bash
# Show token usage
workflow:tokens

# Or natural language
"Show token usage"
"How many tokens used?"
"Token consumption?"
```

---

## 📋 Execution Steps

### 1. Check Active Workflow

```typescript
const state = loadWorkflowState();

if (!state || !state.workflow_id) {
  console.log('❌ No active workflow');
  return;
}
```

### 2. Calculate Token Usage

```typescript
const totalTokens = state.total_tokens_used || 0;
const remaining = state.total_tokens_remaining || 1000000;
const contextLimit = 1000000; // 1M tokens for Claude 3.5 Sonnet
const usagePercent = Math.round((totalTokens / contextLimit) * 100);
```

### 3. Display Token Report

```markdown
╔══════════════════════════════════════════════════════════╗
║  📊 TOKEN USAGE REPORT                                   ║
╚══════════════════════════════════════════════════════════╝

**Workflow:** [workflow-name]
**ID:** [workflow-id]

## Overall Usage

```
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25%
```

**Used:** 250,000 tokens (~250K)  
**Remaining:** 750,000 tokens (~750K)  
**Limit:** 1,000,000 tokens (1M)

## Phase Breakdown

| Phase | Name | Status | Tokens | % |
|-------|------|--------|--------|---|
| 1 | Requirements Analysis | ✅ | 25,000 | 2.5% |
| 2 | Technical Planning | ✅ | 45,000 | 4.5% |
| 3 | Design Review | ✅ | 30,000 | 3.0% |
| 4 | Test Planning | ✅ | 35,000 | 3.5% |
| 5a | TDD RED | ✅ | 40,000 | 4.0% |
| 5b | TDD GREEN | ✅ | 55,000 | 5.5% |
| 5c | TDD REFACTOR | ⏳ | 20,000 | 2.0% |
| 6 | Code Review | ⏸️ | - | - |
| 7 | QA Validation | ⏸️ | - | - |
| 8 | Documentation | ⏸️ | - | - |
| 9 | Notification | ⏸️ | - | - |

## Token Efficiency

**Average per phase:** ~35,000 tokens  
**Estimated completion:** ~350,000 tokens total  
**Efficiency score:** Good ✅

## Recommendations

✅ **Sufficient context remaining** - Continue workflow  
⚠️ **Monitor usage** - 25% consumed  
💡 **Optimize prompts** - Keep responses focused
```

### 4. Show Warnings (if needed)

```typescript
if (usagePercent > 80) {
  console.log('\n⚠️  **WARNING: High token usage!**');
  console.log('   - Consider completing workflow soon');
  console.log('   - Or start new conversation context');
  console.log('   - Save important context before limit');
} else if (usagePercent > 60) {
  console.log('\n💡 **Notice: Moderate usage**');
  console.log('   - More than halfway through context');
  console.log('   - Plan to wrap up soon');
}
```

### 5. Provide Actions

```markdown
## Available Actions

- **Continue workflow** - Plenty of context remaining
- **workflow:status** - Check current phase
- **workflow:approve** - Approve current phase
- **help** - Show all commands
```

---

## 📊 Output Format

### Token Display

```typescript
function formatTokens(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  } else if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}K`;
  }
  return tokens.toString();
}
```

### Progress Bar

```typescript
function createProgressBar(percent: number, length: number = 50): string {
  const filled = Math.round((percent / 100) * length);
  const bar = '█'.repeat(filled) + '░'.repeat(length - filled);
  return bar;
}
```

### Color Coding

- **Green (0-40%):** ✅ Good - plenty of context
- **Yellow (40-60%):** ⚠️ Moderate - monitor usage
- **Orange (60-80%):** ⚠️ High - plan to complete
- **Red (80-100%):** 🚨 Critical - wrap up soon

---

## 🎯 Examples

### Low Usage (Early Workflow)

```
📊 Token Usage: 50,000 / 1,000,000 (5%)
████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 5%

✅ Excellent - Continue workflow
```

### Moderate Usage (Mid Workflow)

```
📊 Token Usage: 500,000 / 1,000,000 (50%)
█████████████████████████░░░░░░░░░░░░░░░ 50%

⚠️ Moderate - Monitor remaining phases
```

### High Usage (Late Workflow)

```
📊 Token Usage: 850,000 / 1,000,000 (85%)
██████████████████████████████████████████░ 85%

🚨 High usage - Complete workflow soon
```

---

## 🔧 Script Integration

```bash
# Run token tracking script
bash .claude/scripts/workflow/track-tokens.sh show

# Log token usage
bash .claude/scripts/workflow/track-tokens.sh log

# Estimate tokens from text
bash .claude/scripts/workflow/track-tokens.sh estimate "Your text here"
```

---

## 📝 State File Structure

```json
{
  "workflow_id": "add-authentication-20251124-120000",
  "total_tokens_used": 250000,
  "total_tokens_remaining": 750000,
  "phases": {
    "1": {
      "tokens": {
        "start": 10000,
        "end": 35000,
        "phase_tokens": 25000,
        "cumulative_tokens": 25000
      }
    }
  }
}
```

---

## 💡 Tips

1. **Monitor regularly** - Check after each phase
2. **Optimize prompts** - Be concise but clear
3. **Plan ahead** - Estimate tokens for remaining phases
4. **Save context** - Document important info if near limit
5. **New conversation** - Start fresh if hitting 90%+

---

## 🎯 Success Criteria

✅ Token report displayed clearly  
✅ Phase breakdown shown  
✅ Warnings shown if high usage  
✅ Recommendations provided  
✅ User can make informed decisions

---

**Command:** workflow:tokens  
**Version:** 1.0.0  
**Script:** `.claude/scripts/workflow/track-tokens.sh`

