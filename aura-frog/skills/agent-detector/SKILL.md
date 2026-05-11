---
name: agent-detector
description: "CRITICAL: MUST run for EVERY message. Detects agent, complexity, AND model automatically. Without this, tasks route to wrong agents and use wrong models, degrading quality and wasting tokens."
autoInvoke: true
priority: highest
model: haiku
triggers:
  - "every message"
  - "always first"
allowed-tools: NONE
user-invocable: false
---

# Agent Detector

**Runs FIRST for every message.**

## Complexity

```toon
complexity[4]{level,criteria,approach}:
  Quick,"Single file / simple fix / clear scope","Direct implementation"
  Standard,"2-5 files / feature / some unknowns","Scout then implement"
  Deep,"6+ files / architecture / vague scope","run-orchestrator"
  Project,"Multi-feature / multi-session / weight ≥ 3 on bridge heuristic AND no active plan","/aura-frog:plan bootstrap then per-task /run anchored"
```

**Project (v3.7.2+):** Emitted when `rules/workflow/run-plan-bridge.md` triggers sum to weight ≥ 3 AND `.aura/plans/active.json` is absent. `run-orchestrator` Step 0 owns the user prompt (`plan` / `deep` / `details`) and the scratch-file handoff. Otherwise Quick/Standard/Deep classification is unchanged.

## Model Selection

Quick→haiku, Standard→sonnet (opus for architecture/design), Deep→sonnet (opus for planning).

## Detection (Priority Order)

1. **Task content** (highest): Analyze task keywords — backend repo may have frontend tasks. Score ≥50 overrides repo detection.
2. **Explicit tech** (+60): User mentions react-native/flutter/angular/vue/react/next/node/python/go/laravel → agent.
3. **Intent** (+50): Action keywords: implement/fix/test/design/database/security/deploy → agent.
4. **Project context** (+40): Package files/configs. Use cached detection when valid (<24h).
5. **File patterns** (+20): Recent file naming: *.vue→frontend, *.go→architect, etc.

## Scoring

Primary ≥80 (leads), Secondary 50-79 (supports), Optional 30-49, Skip <30.
**tester:** Always secondary unless explicit test request.

## Cache

`.claude/cache/agent-detection-cache.json` — reuse within workflow (phase >1). Invalidate on new workflow, phase 1, or user override.
