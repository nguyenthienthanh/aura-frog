---
name: phase1-lite
description: "Ultra-compact Phase 1 requirements output. HARD CAP: 500 tokens."
autoInvoke: false
priority: normal
triggers:
  - "phase 1 lite"
allowed-tools: NONE
user-invocable: false
---

# Phase 1 LITE — Requirements Analysis

**Token Cap:** 500 tokens MAX.

## Pre-Step

Apply `rules/workflow/requirement-challenger.md`: Quick→skip, Standard→1-2 questions, Deep→3-5 questions. Skip with "just do it" / "skip challenge".

## Output Template

```toon
# Phase 1: Requirements
# Task: {one-line description}

scope[3-5]{item,type,priority}:
  {feature},{new|change|fix},{must|should|nice}

acceptance[3-5]{id,criteria}:
  AC1,{testable criterion}

tech_notes[1-3]{area,constraint}:
  {area},{constraint or decision}

risks[0-2]{risk,mitigation}:
  {risk},{mitigation}

# Phase 1 COMPLETE | Next: Phase 2 (Test RED) | Gate: APPROVAL
```

## Rules

- TOON tables only — NO prose paragraphs
- MAX 5 items per table, ONE line per item
- No repetition, no explanations — data only
- Under 500 tokens or it's wrong
