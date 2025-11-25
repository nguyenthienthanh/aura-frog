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
1. **Phase 1: Bug Analysis** - Auto-analyze, no approval
2. **Phase 2: Fix Planning** - Auto-plan, no approval

### Manual Approval Required
3. **Phase 3: TDD RED** - Write tests → Show approval
4. **Phase 4: TDD GREEN** - Implement → Show approval
5. **Phase 5: TDD REFACTOR** - Refactor → Show approval
6. **Phase 6: Code Review** - Review → Show approval
7. **Phase 7: QA Validation** - Validate → Show approval
8. **Phase 8: Documentation** - Document → Show approval
9. **Phase 9: Notification** - Auto-execute

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

Phase 1: Analyzing... ✅ (auto)
Phase 2: Planning... ✅ (auto)

╔════════════════════════════════════════╗
║  APPROVAL REQUIRED: TDD RED           ║
╚════════════════════════════════════════╝

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
| Phase 2 | 20-40 min + approval | 10-15 min (auto) |
| Phase 3-9 | Same | Same |
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

