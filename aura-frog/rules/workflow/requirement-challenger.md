# Rule: Requirement Challenger

**Priority:** HIGH
**Applies:** Phase 1 (Understand), workflow:modify, workflow:start, any requirement/feedback entry point

---

## Core Rule

**When requirements or feedback enter the system, THINK CRITICALLY before accepting.**

Do NOT blindly accept requirements as stated. Instead:
1. Analyze what was asked
2. Identify gaps, assumptions, and ambiguities
3. Challenge with specific questions
4. Confirm understanding before proceeding

---

## Exception: Skip Challenge

**Skip when user uses override phrases:**

| Phrase | Meaning |
|--------|---------|
| "just do it" | Skip challenge |
| "skip challenge" | Skip challenge |
| "no questions" | Accept as-is |
| "I've thought it through" | Trust user's analysis |
| "exactly as described" | No questioning |

**Also skip for:**
- Typo fixes, formatting, config changes (trivial tasks)
- Tasks the agent-detector classifies as "Quick" complexity

---

## Challenge Framework

### What to Challenge

```toon
challenge_areas[6]{area,question_pattern,example}:
  Clarity,"Is this specific enough to implement?","'Add auth' → What type? OAuth? JWT? Session?"
  Scope,"What are we explicitly NOT building?","'Add user management' → CRUD only? Or also roles/permissions?"
  Assumptions,"What's being assumed but not stated?","'Use the database' → Which one? New table or existing?"
  Edge Cases,"What could go wrong or be missed?","'Handle payments' → Refunds? Failed charges? Currency?"
  Feasibility,"Can this work within current constraints?","'Real-time sync' → Current stack supports WebSockets?"
  Simpler Alternative,"Is there a simpler way to achieve this?","'Build custom chart lib' → Use Recharts/D3 instead?"
```

### Challenge Depth by Complexity

```toon
depth[3]{complexity,challenge_level,max_questions}:
  Quick,Skip (no challenge),0
  Standard,Light challenge (1-2 key questions),2
  Deep,Full challenge (3-5 questions across areas),5
```

---

## Challenge Flow

### Step 1: Analyze Requirements
```
Received: [summarize what user asked]
```

### Step 2: Identify Gaps
```
Before proceeding, I want to make sure we're aligned:

1. [Specific question about clarity/scope]
2. [Specific question about assumptions/edge cases]
```

### Step 3: Present Observations (if any)
```
I also noticed:
- [Potential issue or consideration]
- [Simpler alternative if applicable]
```

### Step 4: Confirm and Proceed
```
If these assumptions are correct, I'll proceed with:
- [Stated approach]

Let me know if you'd like to adjust anything, or say "go ahead" to proceed.
```

---

## Examples

### Example 1: Vague Requirement (Standard Complexity)

```
User: "workflow:start Add authentication"

Agent:
Before I start Phase 1, a couple of quick questions:

1. **What type of auth?** JWT tokens, session-based, OAuth/social login, or a combination?
2. **Scope boundary:** Login + registration only, or also password reset, email verification, MFA?

This will help me scope Phase 1 accurately. Or say "just do it" if you want me to make reasonable defaults.
```

### Example 2: Clear Requirement (Light Challenge)

```
User: "workflow:start Add JWT authentication with refresh tokens to the Express API"

Agent:
Clear requirement. One quick check:

1. **Token storage:** Redis for blacklist/refresh tokens, or database-only?

Everything else is clear. Say "go ahead" or answer above, and I'll start Phase 1.
```

### Example 3: Feedback That Could Be Over-Scoped

```
User: "modify: also add social login with Google, Facebook, Apple, GitHub, and Twitter"

Agent:
That's 5 OAuth providers. Before I add all of them:

1. **Priority order?** Most apps start with 1-2 providers. Which are must-have vs nice-to-have?
2. **Scope impact:** This significantly expands the auth scope. Should this be a separate task/workflow?

Or say "must do: all 5" to proceed with everything.
```

### Example 4: Skip Challenge (Quick Task)

```
User: "workflow:start Fix typo in login error message"

Agent:
[Proceeds directly to Phase 1 - no challenge needed for trivial fix]
```

---

## Integration Points

### Phase 1 (Understand)
- Challenge fires BEFORE generating TOON requirements output
- Questions appear inline, not as a separate phase
- User's answers feed into the Phase 1 scope/acceptance tables

### workflow:modify
- Challenge fires when modification could expand scope significantly
- Works alongside `feedback-brainstorming.md` (challenge is about WHAT, brainstorming is about HOW)

### workflow:start
- Challenge fires immediately after task description is provided
- Before any Phase 1 analysis begins

---

## Relationship to Feedback Brainstorming

| Rule | When | Focus |
|------|------|-------|
| **requirement-challenger** | Requirements enter system | Challenge WHAT is being built |
| **feedback-brainstorming** | User rejects/modifies | Brainstorm HOW to implement |

These rules complement each other. Challenger validates the requirement, brainstorming validates the approach.

---

## Agent Behavior

### ALWAYS
- Challenge vague or ambiguous requirements
- Ask about scope boundaries
- Surface hidden assumptions
- Keep challenges concise (not interrogation)
- Accept user's final answer

### NEVER
- Challenge trivial/obvious tasks
- Ask more than 5 questions
- Block progress (always offer "proceed with defaults" option)
- Re-challenge after user confirms
- Challenge force-mode responses

---

