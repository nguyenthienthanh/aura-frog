# Token & Time Awareness

**Version:** 1.0.0
**Priority:** HIGH - Monitor throughout every session
**Type:** Rule (Always Enforced)

---

## Core Rule

**ALWAYS be aware of token usage and processing time. Show status periodically.**

---

## Token Awareness

### Thresholds

| Level | Tokens | % of 200K | Action |
|-------|--------|-----------|--------|
| Normal | 0-100K | 0-50% | Continue normally |
| Moderate | 100K-150K | 50-75% | Show usage occasionally |
| Warning | 150K-175K | 75-87% | **Warn user**, suggest handoff |
| Critical | 175K-200K | 87-100% | **Strongly recommend** handoff |

### When to Show Token Status

**MUST show at:**
- End of each workflow phase
- After complex operations
- When user asks about tokens/usage
- At warning threshold (150K)
- At critical threshold (175K)

**Format:**
```
📊 Token Usage: ~[X]K / 200K ([Y]%)
```

### Estimation Method

Since Claude Code doesn't expose exact token counts:

```
Estimate = (conversation_length_chars / 4) + (code_generated_chars / 3)
```

**Rules of thumb:**
- Short response: ~500 tokens
- Medium response: ~1,500 tokens
- Long response with code: ~3,000-5,000 tokens
- Full phase completion: ~5,000-15,000 tokens

---

## Time Awareness

### Show Processing Time For

| Operation | Show Time? |
|-----------|------------|
| Quick answer | No |
| File read/search | No |
| Code generation | Yes |
| Phase completion | Yes |
| Multi-file changes | Yes |
| Test execution | Yes |

### Format

```
⏱️ Completed in ~[X] minutes
```

Or at phase completion:
```
📊 Phase 2 Complete
⏱️ Duration: ~15 minutes
📊 Tokens: ~12K used this phase
```

---

## Phase Completion Summary

**At end of EVERY phase, show:**

```
═══════════════════════════════════════════════════════════
📊 PHASE [N] SUMMARY
═══════════════════════════════════════════════════════════

⏱️  Duration: ~[X] minutes
📊 Tokens (estimated):
   • This phase: ~[X]K
   • Total session: ~[Y]K / 200K ([Z]%)

[If > 75%:]
⚠️  Token usage is high. Consider `workflow:handoff` to save state.

───────────────────────────────────────────────────────────
```

---

## Handoff Triggers

**Auto-suggest `workflow:handoff` when:**

1. Token estimate > 150K (75%)
2. Complex workflow with 3+ phases remaining
3. User has been working > 2 hours
4. Multiple large file operations

**Handoff suggestion format:**
```
⚠️ Token Usage Alert
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimated usage: ~[X]K / 200K ([Y]%)

Recommendation: Save workflow state to continue in new session.

Type `workflow:handoff` to save, or continue if near completion.
```

---

## User Commands

| Command | Action |
|---------|--------|
| `tokens` or `token usage` | Show current estimate |
| `workflow:handoff` | Save state for later |
| `workflow:resume <id>` | Resume saved workflow |

---

## Integration with Session Continuation

When token threshold reached:
1. Show warning (this rule)
2. Trigger `session-continuation` skill
3. Save workflow state
4. Provide resume instructions

**See:** `skills/session-continuation/session-management.md`

---

## Examples

### Normal Usage (50%)
```
📊 Token Usage: ~100K / 200K (50%) ✅
```

### Warning Level (75%)
```
⚠️ Token Usage: ~150K / 200K (75%)
Consider saving workflow state with `workflow:handoff`
```

### Critical Level (90%)
```
🚨 Token Usage: ~180K / 200K (90%)
STRONGLY RECOMMEND: Run `workflow:handoff` NOW to avoid losing progress.
```

---

## Why This Matters

1. **Prevent Lost Work** - Handoff before hitting limits
2. **User Awareness** - Know when to wrap up
3. **Better Planning** - Understand time investment
4. **Session Management** - Smooth continuation across sessions

---

## Enforcement

| Scenario | Action |
|----------|--------|
| Every phase completion | Show summary with tokens/time |
| Token > 75% | Show warning |
| Token > 87% | Show critical alert |
| User asks | Show detailed status |
| Long operation | Show time taken |

---

**Version:** 1.0.0
**Last Updated:** 2025-11-29
