---
name: phase1-lite
description: "Ultra-compact Phase 1 requirements output. HARD CAP: 500 tokens."
autoInvoke: false
priority: normal
triggers:
  - "/workflow:phase1-lite"
  - "phase 1 lite"
allowed-tools: NONE
---

# Phase 1 LITE - Requirements Analysis

**Purpose:** Ultra-compact requirements output for Phase 1.
**Token Cap:** 500 tokens MAX (hard limit).
**Version:** 1.0.0

---

## Output Template (COPY EXACTLY)

```toon
# Phase 1: Requirements
# Task: {one-line description}

---

scope[3-5]{item,type,priority}:
  {feature1},{new|change|fix},{must|should|nice}
  {feature2},{new|change|fix},{must|should|nice}
  {feature3},{new|change|fix},{must|should|nice}

acceptance[3-5]{id,criteria}:
  AC1,{testable criterion}
  AC2,{testable criterion}
  AC3,{testable criterion}

tech_notes[1-3]{area,constraint}:
  {area1},{constraint or decision}
  {area2},{constraint or decision}

risks[0-2]{risk,mitigation}:
  {risk1},{mitigation}

---

# Phase 1 COMPLETE | Next: Phase 2 (Design) | Gate: APPROVAL
```

---

## Rules

1. **NO prose paragraphs** - TOON tables only
2. **NO explanations** - data only
3. **NO repetition** - each item once
4. **MAX 5 items** per table
5. **ONE line** per item

---

## Example Output

```toon
# Phase 1: Requirements
# Task: Add JWT authentication to API

---

scope[4]{item,type,priority}:
  JWT token generation,new,must
  Token refresh endpoint,new,must
  Auth middleware,new,must
  Logout/invalidation,new,should

acceptance[4]{id,criteria}:
  AC1,Login returns valid JWT (200 OK)
  AC2,Protected routes reject invalid tokens (401)
  AC3,Refresh extends session without re-login
  AC4,Logout invalidates token immediately

tech_notes[2]{area,constraint}:
  storage,Redis for token blacklist
  expiry,15min access / 7d refresh

risks[1]{risk,mitigation}:
  token_theft,Short expiry + refresh rotation

---

# Phase 1 COMPLETE | Next: Phase 2 (Design) | Gate: APPROVAL
```

**Token count:** ~180 tokens (well under 500 cap).

---

## When to Use

- **Always** for Phase 1 of any workflow
- Replace verbose requirements documents
- Use when `/workflow:start` begins Phase 1

---

## Anti-Patterns (DO NOT)

```toon
anti_patterns[5]{pattern,why_bad}:
  Prose paragraphs,Wastes 300+ tokens
  Bullet lists with explanations,Redundant context
  Repeating task description,Already in header
  Detailed risk analysis,Save for Phase 2
  Multiple formatting styles,Inconsistent parsing
```

---

**Remember:** Under 500 tokens or it's wrong.
