---
name: workflow-fasttrack
description: "Fast-track workflow for pre-approved specs. Skips phases 1-3, auto-executes 4-9 without approvals. Use: 'fasttrack: <specs>'"
autoInvoke: true
priority: high
triggers:
  - "fasttrack:"
  - "fast-track"
  - "workflow:fasttrack"
  - "specs ready"
  - "just build it"
  - "execute from specs"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Aura Frog Workflow Fast-Track

**Priority:** HIGH - Use when design/specs are already complete
**Version:** 1.0.0

---

## When to Use

**USE when user provides:**
- Complete design document
- Detailed tech specs
- API specifications
- Component breakdown
- Any pre-approved requirements

**DON'T use when:**
- Requirements are vague
- Design needs clarification
- User wants to discuss approach
- Task complexity is unclear

---

## How to Invoke

```
fasttrack: [paste specs or path to specs file]
```

or

```
workflow:fasttrack <path-to-specs.md>
```

or

```
Here are my specs: [detailed specs]
Just build it.
```

---

## Fast-Track Phases (4-9 Only)

| Phase | Name | Action | Stop Condition |
|-------|------|--------|----------------|
| 4 | Plan Tests | Auto-generate test strategy | Never |
| 5a | Write Tests (RED) | Write failing tests | Tests pass (error!) |
| 5b | Build (GREEN) | Implement to pass tests | Tests fail after 3 attempts |
| 5c | Polish (REFACTOR) | Clean code | Tests break |
| 6 | Review | Security + quality scan | Critical security issue |
| 7 | Verify | Run all tests | Coverage <80% |
| 8 | Document | Update docs | Never |
| 9 | Share | Notify team | Never |

---

## Spec Validation

Before starting, validate specs contain:

```toon
required_sections[6]{section,purpose}:
  Overview,What we're building
  Requirements,Functional requirements
  Technical Design,Architecture/approach
  API/Interfaces,Endpoints or component APIs
  Data Model,Database/state structure
  Acceptance Criteria,Definition of done
```

**If missing sections:** Ask user to provide them, don't start without.

---

## Execution Mode

### No Approval Gates

```
STANDARD WORKFLOW:
Phase 4 → ✋ Wait → Phase 5a → ✋ Wait → Phase 5b → ...

FAST-TRACK WORKFLOW:
Phase 4 → Phase 5a → Phase 5b → Phase 5c → Phase 6 → Phase 7 → Phase 8 → Phase 9
         ↑                                                                      ↑
       START                                                                  END
       (No stops unless error)
```

### Only Stop On

1. **Tests unexpectedly pass in Phase 5a** (RED phase)
   - Tests should fail initially
   - If they pass, specs may be incomplete

2. **Tests fail after 3 implementation attempts** (GREEN phase)
   - May need spec clarification

3. **Critical security vulnerability found** (Phase 6)
   - Must fix before proceeding

4. **Coverage below 80%** (Phase 7)
   - Need more tests

5. **Token limit warning** (Any phase)
   - Save state and handoff

---

## Progress Reporting

Show condensed progress after each phase:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 FAST-TRACK Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Phase 4: Test Strategy (12 tests planned)
✅ Phase 5a: Tests Written (12 failing)
🔄 Phase 5b: Implementing... (8/12 passing)
⬜ Phase 5c: Refactor
⬜ Phase 6: Review
⬜ Phase 7: Verify
⬜ Phase 8: Document
⬜ Phase 9: Notify
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Input Format

### Option 1: Inline Specs

```
fasttrack:

## Overview
User authentication with JWT tokens

## Requirements
- Login with email/password
- Token refresh
- Logout

## Technical Design
- Use bcrypt for passwords
- JWT with RS256
- Redis for token blacklist

## API
POST /auth/login
POST /auth/refresh
POST /auth/logout

## Data Model
users: id, email, password_hash, created_at

## Acceptance Criteria
- [ ] User can login and receive token
- [ ] Token refreshes before expiry
- [ ] Logout invalidates token
```

### Option 2: File Reference

```
fasttrack: .claude/specs/auth-feature.md
```

### Option 3: Natural Language

```
I have the complete design ready:
[paste design]

Just build it without stopping for approvals.
```

---

## Critical Rules

### TDD Still Applies

```
Phase 5a (RED): Tests MUST fail initially
Phase 5b (GREEN): Implement until tests pass
Phase 5c (REFACTOR): Tests MUST still pass
```

### KISS Still Applies

- No over-engineering
- Follow specs exactly
- Don't add features not in specs

### Quality Still Applies

- 80% coverage minimum
- No critical security issues
- Clean, documented code

---

## Error Recovery

### Test Failure (Phase 5b)

```
Attempt 1: Implement → Tests fail
Attempt 2: Fix issues → Tests fail
Attempt 3: Different approach → Tests fail
→ STOP: Ask user for clarification
```

### Security Issue (Phase 6)

```
Critical issue found:
→ STOP: Show issue and proposed fix
→ Wait for user confirmation
→ Then continue
```

### Coverage Below 80% (Phase 7)

```
Coverage: 65%
Missing: auth.service.ts lines 45-67
→ Add tests for missing coverage
→ Re-run verification
→ If still <80% after 2 attempts, ask user
```

---

## Integration with Standard Workflow

Fast-track is a mode, not a replacement:

```toon
workflow_modes[2]{mode,phases,approvals}:
  standard,1-9,8 gates (all phases)
  fasttrack,4-9,0 gates (errors only)
```

### Switching Modes

```
# Start standard, switch to fast-track after Phase 3:
User: "approve phase 3, then fasttrack the rest"

# Start fast-track, switch to standard on error:
[Error in Phase 5b]
Claude: "Switching to standard mode for debugging..."
```

---

## Example Execution

```
User: fasttrack: [complete specs]

Claude:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 FAST-TRACK Mode Activated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Specs validated ✅
Starting Phase 4...

✅ Phase 4: Test Strategy
   - 15 unit tests planned
   - 3 integration tests planned
   - Coverage targets: 85%

✅ Phase 5a: Tests Written (RED)
   - 18 tests written
   - All failing as expected ✅

✅ Phase 5b: Implementation (GREEN)
   - auth.service.ts created
   - auth.controller.ts created
   - 18/18 tests passing ✅

✅ Phase 5c: Refactored
   - Extracted token utilities
   - Added error types
   - Tests still passing ✅

✅ Phase 6: Review
   - No security issues
   - Performance OK
   - Code quality: A

✅ Phase 7: Verification
   - Coverage: 87%
   - All tests passing

✅ Phase 8: Documentation
   - API docs updated
   - README updated

✅ Phase 9: Notification
   - Slack notified (or skipped if not configured)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 FAST-TRACK Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files created: 5
Tests: 18 passing
Coverage: 87%
Time: ~15 minutes

Ready to commit? (confirm to proceed)
```

---

## Commands

| Command | Action |
|---------|--------|
| `fasttrack: <specs>` | Start fast-track with inline specs |
| `workflow:fasttrack <file>` | Start fast-track from spec file |
| `fasttrack:stop` | Stop and switch to standard mode |
| `fasttrack:status` | Show current progress |

---

## Related Skills

- **workflow-orchestrator** - Full 9-phase with approvals
- **bugfix-quick** - Lightweight bug fix workflow
- **test-writer** - Just write tests
- **code-reviewer** - Just review code

---

**Remember:**
- Validate specs before starting
- TDD is still mandatory
- Only stop on errors, not approvals
- Show progress after each phase
- Final commit still requires user confirmation
