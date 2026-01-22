# Rule: Context Management

**Category:** System
**Priority:** High
**Scope:** All sessions

---

## Purpose

Optimize token usage and context efficiency to reduce costs and improve reasoning quality. Less noise = better focus.

---

## Core Principles

### 1. Minimal Initial Context

```toon
context_tiers[3]{tier,tokens,loads}:
  0-always,~500,Banner format + MCP list + core rules
  1-session,~1000,Project detection + tech stack + workflow phase
  2-demand,variable,Framework patterns + detailed rules + full skills
```

**Rule:** Start with Tier 0+1. Load Tier 2 only when task requires it.

### 2. Progressive Loading

```toon
loading_rules[4]{trigger,action,reason}:
  Framework task detected,Load framework bundle,Needed for implementation
  Security concern mentioned,Load security rules,Safety critical
  Test task requested,Load test patterns,Quality assurance
  Design task detected,Load design systems,UI consistency
```

**Don't:** Load all 12 framework expert skills at session start
**Do:** Load only the detected framework's patterns when needed

### 3. Context Cleanup

```toon
cleanup_triggers[4]{trigger,action}:
  Task completed,/clear if switching domains
  Context >80%,/compact with focus instructions
  Switching tech stack,Clear framework-specific context
  Error spiral (3+ failed attempts),/clear and restart fresh
```

---

## Model Selection Guidelines

Use `skills/model-router/SKILL.md` for automatic routing, but understand the principles:

| Task Type | Recommended Model | Reasoning |
|-----------|-------------------|-----------|
| Typo/formatting | Haiku | No deep reasoning needed |
| Bug fixes | Sonnet | Balance of speed and quality |
| New features | Sonnet | Standard implementation |
| Architecture | Opus | Needs deep reasoning |
| Security audit | Opus | Safety critical |
| Refactoring | Sonnet/Opus | Depends on scope |

---

## Token Budget Awareness

### Track Usage

The status bar shows token percentage. Act on these thresholds:

```toon
token_thresholds[4]{percent,action,reason}:
  <50%,Continue normally,Plenty of context remaining
  50-70%,Consider /compact,Preserve important context
  70-85%,Use /compact now,"Focus on [task details]"
  >85%,Finish task then /clear,Prevent mid-task compaction
```

### Compact Instructions

When using `/compact`, provide focus:

```bash
# Good - specific focus
/compact Focus on the auth module implementation and test failures

# Bad - no guidance
/compact
```

---

## Efficient Exploration

### Use Subagents for Verbose Tasks

```toon
subagent_tasks[5]{task,reason}:
  Run full test suite,Keep verbose output out of main context
  Fetch large documentation,Summarize before returning
  Explore unfamiliar codebase,Agent returns summary only
  Generate coverage report,Return metrics not full output
  Lint entire project,Return issue count not all warnings
```

**Pattern:** Verbose output stays in subagent. Summary returns to main.

### Targeted File Reading

```toon
reading_rules[4]{do,dont,reason}:
  Read specific functions,Read entire large files,Reduce noise
  Use line ranges,Read 1000+ line files fully,Focus on relevant
  Grep then read matches,Read all files to find pattern,Efficient search
  Cache detection results,Re-scan project each task,Use project cache
```

---

## Session Boundaries

### When to /clear

```toon
clear_triggers[5]{trigger,reason}:
  Switching projects,Different tech stack and context
  Switching domains (frontend→backend),Different patterns needed
  After major task completion,Fresh context for next task
  Context feels cluttered,Quality of responses degrading
  After architectural discussion,Implementation needs clean start
```

### When NOT to /clear

- Mid-implementation (lose context)
- During debugging (need history)
- Multi-file refactor in progress

---

## Skill Loading Optimization

### Current (Expensive)
```
Session start → Load 12 framework skills → 6000+ tokens used
```

### Optimized (Efficient)
```
Session start → Load framework-expert bundle → Detect tech → Load only needed patterns → 500-1000 tokens
```

**Implementation:** `skills/framework-expert/SKILL.md` provides lazy loading.

---

## Anti-Patterns

```toon
antipatterns[5]{pattern,problem,solution}:
  Load all skills at start,Wastes 5000+ tokens,Use lazy loading
  Read entire codebase,Overwhelms context,Targeted exploration
  Never use /clear,Stale context degrades quality,Clear between tasks
  Ignore token warnings,Mid-task compaction loses context,Act at 70%
  Always use Opus,15x cost for trivial tasks,Use model router
```

---

## Quick Reference

```bash
# Check context usage
# Look at status bar percentage

# Compact with focus
/compact Focus on [specific task details]

# Clear for fresh start
/clear

# Check project detection (avoid re-scanning)
/project:status
```

---

## Related Files

- `skills/model-router/SKILL.md` - Automatic model selection
- `skills/framework-expert/SKILL.md` - Lazy framework loading
- `docs/REFACTOR_ANALYSIS.md` - Full optimization analysis
- `hooks/lib/af-project-cache.cjs` - Project detection caching

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-21
