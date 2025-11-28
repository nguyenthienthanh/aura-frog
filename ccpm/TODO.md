# CCPM v5.2.0 Optimization Plan ✅ COMPLETE

**Date:** 2025-11-28
**Current Version:** 5.2.0
**Goal:** Reduce token consumption and improve accuracy

---

## Background: How Claude Code Loads Files

### Auto-Loaded (Affects Token Usage)
- `CLAUDE.md` - Always loaded at session start
- `skills/*/SKILL.md` - Loaded when context triggers
- `@ imports` in CLAUDE.md - Loaded if referenced

### NOT Auto-Loaded (No Token Impact)
- `docs/` - Only when Claude reads via tool
- `agents/` - Only when explicitly referenced
- `rules/` - Only when explicitly referenced
- `commands/` - Only when user calls `/command`
- `archive/` - Never loaded

**Conclusion:** Focus optimization on CLAUDE.md and Skills only.

---

## Phase 1: CLAUDE.md Optimization (CRITICAL) ✅ COMPLETE

**Impact:** 100% of interactions
**Before:** 660 lines | **After:** 464 lines | **Reduction:** 30%

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1.1 | Fix version mismatch: "v5.0" → "v5.1.0" in examples | HIGH | ✅ |
| 1.2 | Fix agent count inconsistency (14 vs 23 vs 24) → standardize to 24 | HIGH | ✅ (already consistent) |
| 1.3 | Remove inline agent listings, reference to README instead | MEDIUM | ✅ |
| 1.4 | Reduce verbose sections, keep instructions concise | MEDIUM | ✅ |
| 1.5 | Check and optimize any `@ imports` if present | HIGH | ✅ (none found) |

**Actual Savings:** ~196 lines (~30% reduction)

---

## Phase 2: Skills Optimization (HIGH) ✅ COMPLETE

**Impact:** Every triggered skill interaction
**Before:** 8 skills, 1,567 lines total | **After:** 683 lines | **Reduction:** 56%

| # | Task | Priority | Status |
|---|------|----------|--------|
| 2.1 | Enforce execution order: agent-detector MUST run FIRST | HIGH | ✅ |
| 2.2 | agent-detector skill: Reduce examples (10 → 3-5 examples) | HIGH | ✅ |
| 2.3 | Convert verbose YAML examples to concise Markdown format (~25% token savings) | MEDIUM | ✅ |
| 2.4 | Remove duplicated content between skills | MEDIUM | ✅ |
| 2.5 | Each skill target: 1,000-1,500 tokens max | MEDIUM | ✅ |

### Skills Optimized

| Skill | Before | After | Reduction |
|-------|--------|-------|-----------|
| agent-detector | 304 lines | 89 lines | -71% |
| workflow-orchestrator | 253 lines | 92 lines | -64% |
| project-context-loader | 502 lines | 88 lines | -82% |
| bugfix-quick | 161 lines | 73 lines | -55% |
| test-writer | 185 lines | 88 lines | -52% |
| code-reviewer | 171 lines | 97 lines | -43% |
| jira-integration | 148 lines | 77 lines | -48% |
| figma-integration | 256 lines | 79 lines | -69% |

**Actual Savings:** 884 lines (~56% reduction)

---

## Phase 3: Accuracy Fixes (MEDIUM) ✅ COMPLETE

**Impact:** Quality improvement, no direct token impact

| # | Task | Priority | Status |
|---|------|----------|--------|
| 3.1 | pm-operations-orchestrator.md: Fix outdated team roster | MEDIUM | ✅ |
| 3.2 | smart-agent-detector.md: Remove hardcoded agent count | MEDIUM | ✅ |
| 3.3 | Standardize example format across all files | LOW | ✅ |

---

## Phase 4: Documentation Cleanup (LOW - Optional) ✅ COMPLETE

**Impact:** None on token usage, only maintenance

| # | Task | Priority | Status |
|---|------|----------|--------|
| 4.1 | Remove `archive/` folder (outdated MCP docs) | LOW | ✅ |
| 4.2 | Update outdated version references in docs | LOW | ✅ |
| 4.3 | Fix broken internal links | LOW | ✅ |

---

## Items NOT Needed (Skip)

| Item | Reason |
|------|--------|
| Optimize `theme-consistency.md` | Not auto-loaded, no token impact |
| Optimize `mobile-react-native.md` | Not auto-loaded, no token impact |
| Reduce agent files to 200-300 lines | Not auto-loaded, no token impact |
| Merge duplicate docs | Not auto-loaded, no token impact |
| Implement Lazy Loading Strategy | Claude Code already has built-in lazy loading |
| Tiered Documentation | Docs not auto-loaded, tiers unnecessary |
| Optimize `rules/*.md` | Not auto-loaded, no token impact |

---

## Expected Results

### Token Savings

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| CLAUDE.md | ~6,157 | ~4,000 | -35% |
| Skills (total) | ~15,000 | ~10,000 | -33% |
| Per simple interaction | ~8,000 | ~5,500 | -31% |
| Per workflow interaction | ~15,000 | ~10,000 | -33% |

### Accuracy Improvements

- ✅ Consistent version number (v5.2.0)
- ✅ Consistent agent count (24)
- ✅ Up-to-date team roster
- ✅ Enforced skill execution order

---

## Implementation Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1 | 1-2 days | CLAUDE.md optimization |
| Phase 2 | 2-3 days | Skills optimization |
| Phase 3 | 1 day | Accuracy fixes |
| Phase 4 | Optional | Documentation cleanup |

**Total Estimated Time:** 4-6 days

---

## Checklist Summary

```
Phase 1: CLAUDE.md (CRITICAL) ✅ COMPLETE
- [x] 1.1 Fix version mismatch
- [x] 1.2 Fix agent count
- [x] 1.3 Create reference system
- [x] 1.4 Reduce verbose sections
- [x] 1.5 Check @ imports

Phase 2: Skills (HIGH) ✅ COMPLETE
- [x] 2.1 Enforce agent-detector runs first
- [x] 2.2 Reduce agent-detector examples
- [x] 2.3 Convert verbose YAML to concise Markdown (~25% savings)
- [x] 2.4 Remove skill duplication
- [x] 2.5 Target 1,000-1,500 tokens per skill

Phase 3: Accuracy (MEDIUM) ✅ COMPLETE
- [x] 3.1 Fix pm-operations-orchestrator team roster (make scalable)
- [x] 3.2 Remove hardcoded agent count (make scalable)
- [x] 3.3 Standardize example format

Phase 4: Cleanup (LOW - Optional) ✅ COMPLETE
- [x] 4.1 Remove archive folder
- [x] 4.2 Update outdated docs
- [x] 4.3 Fix broken links
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-28
