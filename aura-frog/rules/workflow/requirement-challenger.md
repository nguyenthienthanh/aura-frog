# Rule: Requirement Challenger

**Priority:** HIGH
**Applies:** Phase 1, /workflow modify, /workflow start

---

## Core Rule

**Think critically before accepting requirements. Analyze gaps, assumptions, and ambiguities.**

---

## Skip Challenge When

- Override phrases: "just do it", "skip challenge", "no questions", "I've thought it through", "exactly as described"
- Trivial tasks (typo fixes, formatting, config)
- Quick complexity (per agent-detector)

---

## Challenge Framework

```toon
challenge_areas[6]{area,question_pattern,example}:
  Clarity,"Specific enough to implement?","'Add auth' → What type? OAuth? JWT? Session?"
  Scope,"What are we NOT building?","'Add user management' → CRUD only? Or roles/permissions?"
  Assumptions,"What's assumed but not stated?","'Use the database' → Which one? New table or existing?"
  Edge Cases,"What could go wrong?","'Handle payments' → Refunds? Failed charges? Currency?"
  Feasibility,"Works within constraints?","'Real-time sync' → Stack supports WebSockets?"
  Simpler Alternative,"Simpler way to achieve this?","'Build custom chart lib' → Use Recharts/D3 instead?"
```

### Challenge Depth

```toon
depth[3]{complexity,level,max_questions}:
  Quick,Skip,0
  Standard,Light (1-2 key questions),2
  Deep,Full (3-5 across areas),5
```

---

## Flow

1. **Analyze** what was asked
2. **Identify** gaps with specific questions
3. **Present** observations (potential issues, simpler alternatives)
4. **Confirm**: "If these assumptions are correct, I'll proceed with [approach]. Say 'go ahead' to proceed."

---

## Integration

- **Phase 1:** Fires BEFORE generating requirements output
- **/workflow modify:** Fires when modification could expand scope
- **/workflow start:** Fires immediately after task description

Complements `feedback-brainstorming.md`: Challenger validates WHAT, brainstorming validates HOW.

---

## Behavior

- Challenge vague requirements, ask about scope, surface assumptions
- Keep challenges concise (not interrogation), max 5 questions
- Always offer "proceed with defaults" option
- Never re-challenge after user confirms

---
