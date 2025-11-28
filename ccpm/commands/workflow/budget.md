# Command: workflow:budget

**Version:** 5.2.0
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

Current Phase: 5b (Build) - 65% complete

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
│  1   │ Understand   │ 7.0K       │ 6.8K       │ ✅ -3% │
│  2   │ Design       │ 11.2K      │ 12.1K      │ ✅ +8% │
│  3   │ UI Breakdown │ 8.4K       │ 8.0K       │ ✅ -5% │
│  4   │ Plan Tests   │ 9.8K       │ 10.3K      │ ✅ +5% │
│  5a  │ Write Tests  │ 16.8K      │ 17.5K      │ ✅ +4% │
│ *5b  │ Build        │ 126.0K     │ 43.7K (est)│ 🔄 IP  │
│  5c  │ Polish       │ 21.0K      │ -          │ ⏳ Pend│
│  6   │ Review       │ 11.2K      │ -          │ ⏳ Pend│
│  7   │ Verify       │ 8.4K       │ -          │ ⏳ Pend│
│  8   │ Document     │ 14.0K      │ -          │ ⏳ Pend│
│  9   │ Share        │ 2.8K       │ -          │ ⏳ Pend│
└──────┴──────────────┴────────────┴────────────┴────────┘

* Currently in progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Projection:

  Completed: 98,450 tokens
  Phase 5b remaining (est): 39,000 tokens
  Phases 5c-9 (predicted): 57,200 tokens
  ────────────────────────────────────
  Total projected: 194,650 tokens

  Final prediction: 194,650 / 200,000 (97%)
  Safety margin: 5,350 tokens (3%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Recommendations:

  ⚠️ WARNING: Projected to use 97% of session limit

  💡 Suggested Actions:
     1. Continue current phase (Phase 5b)
     2. Complete Phase 5c (Polish)
     3. Run workflow:handoff after Phase 5c
     4. Resume in new session for Phases 6-9

  Alternative:
     • Skip Phase 5c polish (save ~21K tokens)
     • Complete through Phase 9 in this session

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Checkpoints:

  ✅ checkpoint-1: Phase 2 complete (26K tokens)
  ✅ checkpoint-2: Phase 4 complete (46K tokens)
  ✅ checkpoint-3: Phase 5a complete (64K tokens)
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
**Version:** 5.2.0
**Status:** ✅ Ready
**Priority:** High
