---
name: sequential-thinking
description: "Structured thinking process for complex analysis. Supports revision, branching, and dynamic adjustment."
autoInvoke: false
priority: high
model: sonnet
triggers:
  - "complex problem"
  - "need to think through"
  - "analyze step by step"
user-invocable: false
---

# Sequential Thinking

Use for complex problems requiring structured analysis before solution.

## Pattern

```
Thought 1/N: [Initial analysis — observations, assumptions]
Thought 2/N: [Build on previous — deeper analysis, connections]
Thought 3/N [REVISION of 1]: [Correct earlier assumptions — what was wrong, corrected view]
Thought 4/N [BRANCH A]: [Alternative approach — different angle, trade-offs]
Thought 5/N [FINAL]: [Synthesize solution — recommended approach, key decisions]
```

## Dynamic Adjustment

- **Expand** (complexity increases): add thoughts (N+1)
- **Contract** (simpler than expected): skip to FINAL
- **Branch** (multiple valid paths): create BRANCH A/B/C

## When to Use

```toon
use_cases[5]{scenario,thoughts}:
  Architecture design,5-8
  Bug root cause,3-5
  Performance optimization,4-6
  Security analysis,5-7
  Refactoring strategy,4-6
```

Use for problems requiring exploration before solution. Not for straightforward tasks.
