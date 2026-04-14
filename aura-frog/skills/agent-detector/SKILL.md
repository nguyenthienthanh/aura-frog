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
---

# Agent Detector

**Runs FIRST for every message.**

## Complexity

```toon
complexity[3]{level,criteria,approach}:
  Quick,"Single file / simple fix / clear scope","Direct implementation"
  Standard,"2-5 files / feature / some unknowns","Scout then implement"
  Deep,"6+ files / architecture / vague scope","workflow-orchestrator"
```

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
