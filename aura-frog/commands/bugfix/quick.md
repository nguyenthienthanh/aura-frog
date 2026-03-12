# Command: bugfix:quick

**Purpose:** Quick bug fix for obvious issues (simplified workflow)

**Category:** Bug Fixing

**Usage:**
```
bugfix:quick <description>
bugfix:quick <file> <issue>
```

---

## 🚀 Quick Fix Workflow

**Difference from full `bugfix`:**
- ❌ Skip approval gates for Phase 1-2 (auto-execute)
- ✅ Still enforce TDD (RED → GREEN → REFACTOR)
- ✅ Auto-approve analysis and planning
- ✅ Show approval only at implementation gates

---

## 🔄 Simplified Phases

### Auto-Execute (No Approval)
1. **Phase 1: Understand + Design** - Auto-analyze and plan, no approval

### Manual Approval Required
2. **Phase 2: Test RED** - Write tests → Show approval
3. **Phase 3: Build GREEN** - Implement → Show approval
4. **Phase 4: Refactor + Review** - Refactor and review → Show approval
5. **Phase 5: Finalize** - Document and notify → Auto-execute

---

## 🎯 When to Use

**Use `bugfix:quick` for:**
- ✅ Typos
- ✅ Obvious logic errors
- ✅ Simple validation fixes
- ✅ Console.log removal
- ✅ Import fixes
- ✅ Simple null checks

**Use full `bugfix` for:**
- ❌ Complex bugs
- ❌ Performance issues
- ❌ Security vulnerabilities
- ❌ Architecture changes
- ❌ Multi-file changes

---

## 📋 Execution

```markdown
User: bugfix:quick Login button not disabled during loading

AI:
🔄 Quick Bug Fix Mode

Phase 1: Understand + Design... ✅ (auto)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ APPROVAL REQUIRED: Test RED (Phase 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Tests Written

**Issue:** Login button not disabled
**Fix:** Add `disabled={isLoading}` prop
**Test:** Button should be disabled when loading

Options: "approve" → Implement fix
```

---

## ⚡ Speed Comparison

| Phase | Full bugfix | Quick bugfix |
|-------|-------------|--------------|
| Phase 1 | 15-30 min + approval | 5-10 min (auto) |
| Phase 2-5 | Same | Same |
| **Total** | 2-4 hours | 1-2 hours |

**Time saved:** ~30-60 minutes ⚡

---

## ✅ Success Criteria

Same as full `bugfix`:
- ✅ Tests written (RED)
- ✅ Fix implemented (GREEN)
- ✅ Code refactored (REFACTOR)
- ✅ Reviewed and validated
- ✅ Documented and notified

