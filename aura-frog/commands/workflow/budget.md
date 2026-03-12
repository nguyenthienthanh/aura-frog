# Command: workflow:budget

**Version:** 1.0.0
**Purpose:** Show real-time token usage vs prediction during workflow
**Category:** Workflow Enhancement
**Last Updated:** 2025-11-26

---

## 🎯 Purpose

Display current token usage, compare against prediction, and show remaining budget to prevent session timeouts.

---

## 📋 Command Format

```bash
workflow:budget

# Shows current token usage for active workflow
```

---

## 📊 Output Format

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Token Budget - Workflow: "auth-jwt-implementation"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Phase: 3 (Build GREEN) - 65% complete

┌─────────────────────────────────────────────────────────┐
│  Token Usage Overview                                   │
├─────────────────────────────────────────────────────────┤
│  Used:       98,450 tokens  (49% of session limit)     │
│  Predicted:  164,000 tokens (82% total)                │
│  Remaining:  101,550 tokens (51% available)            │
│  Session Limit: 200,000 tokens                         │
└─────────────────────────────────────────────────────────┘

Progress vs Prediction:
[████████████████████████████░░░░░░░░░░] 60% through workflow

Status: ✅ ON TRACK (within 5% of prediction)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase-by-Phase Breakdown:

┌──────┬──────────────┬────────────┬────────────┬────────┐
│Phase │ Name         │ Predicted  │ Actual     │ Status │
├──────┼──────────────┼────────────┼────────────┼────────┤
│  1   │ Understand+Design │ 3.5K    │ 3.4K       │ ✅ -3% │
│  2   │ Test RED          │ 1.5K    │ 1.6K       │ ✅ +7% │
│ *3   │ Build GREEN       │ 126.0K  │ 43.7K (est)│ 🔄 IP  │
│  4   │ Refactor+Review   │ 1.5K    │ -          │ ⏳ Pend│
│  5   │ Finalize          │ 0.8K    │ -          │ ⏳ Pend│
└──────┴──────────────┴────────────┴────────────┴────────┘

* Currently in progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Projection:

  Completed: 98,450 tokens
  Phase 3 remaining (est): 39,000 tokens
  Phases 4-5 (predicted): 2,300 tokens
  ────────────────────────────────────
  Total projected: 194,650 tokens

  Final prediction: 194,650 / 200,000 (97%)
  Safety margin: 5,350 tokens (3%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Recommendations:

  ⚠️ WARNING: Projected to use 97% of session limit

  💡 Suggested Actions:
     1. Continue current phase (Phase 3)
     2. Complete Phase 4 (Refactor + Review)
     3. Run workflow:handoff after Phase 4
     4. Resume in new session for Phase 5

  Alternative:
     • Complete through Phase 5 in this session

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Checkpoints:

  ✅ checkpoint-1: Phase 2 complete (26K tokens)
  ✅ checkpoint-2: Phase 2 complete (46K tokens)
  ✅ checkpoint-3: Phase 3 start (64K tokens)
  🔄 checkpoint-4: Auto-save at 100K tokens (upcoming)

  Last checkpoint: 30 minutes ago
  Next auto-checkpoint: ~1,550 tokens

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commands:
  • workflow:continue - Continue workflow
  • workflow:handoff - Save and handoff to new session
  • workflow:checkpoint create - Create manual checkpoint now
  • workflow:predict - Rerun prediction with current data

═══════════════════════════════════════════════════════════════
```

---

## 🚨 Warning Levels

### Green (0-70%)
```
✅ Safe - Plenty of token budget remaining
```

### Yellow (71-85%)
```
⚠️ Caution - Approaching token limit, plan handoff soon
```

### Orange (86-95%)
```
🚨 Warning - High token usage, handoff recommended
```

### Red (96-100%)
```
🔴 CRITICAL - Near limit, handoff NOW or risk losing progress
```

---

## ⚙️ Related Commands

- `workflow:predict` - Initial token prediction
- `workflow:handoff` - Save and handoff workflow
- `workflow:checkpoint create` - Manual checkpoint
- `workflow:status` - Overall workflow status

---

**Command:** workflow:budget
**Version:** 1.0.0
**Status:** ✅ Ready
**Priority:** High
