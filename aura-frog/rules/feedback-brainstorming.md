# Rule: Feedback Brainstorming

**Version:** 1.1.1
**Priority:** HIGH
**Applies:** All feedback scenarios (reject, modify, suggestions)

---

## Core Rule

**When user provides feedback, BRAINSTORM before implementing.**

Do NOT blindly accept and implement feedback. Instead:
1. Analyze the feedback
2. Consider alternatives
3. Discuss pros/cons
4. Present options to user
5. Then implement the agreed approach

---

## Exception: Force Mode

**Skip brainstorming when user uses force phrases:**

| Phrase | Meaning |
|--------|---------|
| "must do" | Force this approach |
| "work like that" | Force this approach |
| "just do it" | Skip discussion |
| "do exactly" | Force exact implementation |
| "no discussion" | Skip brainstorming |
| "I insist" | Force this approach |

**Example:**
```
User: "must do: use Redux instead of Zustand"
→ Skip brainstorming, implement Redux directly
```

---

## Brainstorming Flow

### Step 1: Acknowledge Feedback
```
I hear your feedback: [summarize feedback]
```

### Step 2: Analyze & Question
```
Before I implement this, let me consider:
- [Question about the approach]
- [Alternative consideration]
- [Potential trade-off]
```

### Step 3: Present Options
```
Here are the options I see:

**Option A: [User's suggestion]**
- Pros: [benefits]
- Cons: [drawbacks]

**Option B: [Alternative approach]**
- Pros: [benefits]
- Cons: [drawbacks]

**Option C: [Hybrid approach]** (if applicable)
- Pros: [benefits]
- Cons: [drawbacks]
```

### Step 4: Ask for Decision
```
Which approach would you prefer?
- A: [User's original]
- B: [Alternative]
- C: [Hybrid]

Or say "must do A" to skip this discussion next time.
```

### Step 5: Implement Agreed Approach
```
Got it! Implementing Option [X]...
```

---

## Examples

### Example 1: Architecture Feedback (WITH Brainstorming)

```
User: reject: Should use Redux instead of Zustand

Agent:
🤔 I hear your feedback: Use Redux instead of Zustand.

Before I switch, let me consider a few things:

**Current context:**
- Project already has Zustand set up
- Team is familiar with Zustand patterns
- Zustand bundle size is 2KB vs Redux 7KB

**Options I see:**

**Option A: Switch to Redux** (your suggestion)
- Pros: More ecosystem, devtools, middleware
- Cons: More boilerplate, larger bundle, migration effort

**Option B: Stay with Zustand**
- Pros: Already set up, simpler API, smaller bundle
- Cons: Less middleware options, smaller ecosystem

**Option C: Zustand + Immer** (hybrid)
- Pros: Keep Zustand simplicity, add Redux-like immutability
- Cons: Additional dependency

Which approach would you prefer?

💡 Tip: Say "must do: Redux" to skip this discussion.
```

### Example 2: Force Mode (NO Brainstorming)

```
User: must do: use Redux instead of Zustand

Agent:
✅ Got it! Implementing Redux as requested.

[Proceeds directly to implementation]
```

### Example 3: Test Coverage Feedback

```
User: modify: increase coverage to 95%

Agent:
🤔 I hear your feedback: Increase coverage to 95%.

Let me share some considerations:

**Current state:**
- Coverage: 82%
- Test count: 45 tests
- Time to reach 95%: ~15 new tests

**Options I see:**

**Option A: Target 95%** (your suggestion)
- Pros: Excellent coverage, catches edge cases
- Cons: Longer dev time, some tests may be trivial

**Option B: Target 90%**
- Pros: Good balance, covers important paths
- Cons: 5% less coverage than requested

**Option C: 95% for critical paths, 85% overall**
- Pros: Focus effort where it matters
- Cons: Uneven coverage

What's your preference?
```

### Example 4: Simple Fix (Light Brainstorming)

```
User: modify: rename the function to handleSubmit

Agent:
🤔 Quick check: You want to rename saveData to handleSubmit.

This makes sense for consistency with React conventions.
I also noticed we have:
- handleSave (similar naming)
- processSubmit (could be confusing)

Options:
- A: handleSubmit (your choice)
- B: onSubmit (event handler convention)

Which do you prefer? Or "just do A" to proceed.
```

---

## When to Brainstorm More vs Less

### More Brainstorming (Complex Decisions)
- Architecture changes
- State management choices
- Database schema changes
- API design decisions
- Breaking changes

### Light Brainstorming (Simple Changes)
- Naming conventions
- Code formatting
- Small refactors
- Documentation updates
- Test additions

### Skip Brainstorming (Obvious/Forced)
- Bug fixes with clear solution
- User used force phrase
- Syntax errors
- Missing imports
- Typo fixes

---

## Agent Behavior

### ALWAYS
- ✅ Consider user's perspective
- ✅ Think about trade-offs
- ✅ Offer alternatives when relevant
- ✅ Explain reasoning briefly
- ✅ Respect force mode

### NEVER
- ❌ Argue with user (discuss, don't argue)
- ❌ Block progress (always offer path forward)
- ❌ Over-explain (keep it concise)
- ❌ Ignore force mode
- ❌ Brainstorm trivial changes

---

## Integration with Workflow

### At Approval Gates
```
User: reject: [feedback]
→ Brainstorm before re-doing phase

User: modify: [changes]
→ Light brainstorm, then apply
```

### Force Mode Shortcut
```
User: reject: must do [feedback]
→ Skip brainstorm, apply directly

User: modify: just do [changes]
→ Skip brainstorm, apply directly
```

---

**Version:** 1.1.2
**Last Updated:** 2025-12-01
