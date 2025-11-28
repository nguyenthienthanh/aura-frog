# Approval Gates Guide

**Version:** 5.2.0
**Purpose:** Define approval gate format and usage in CCPM workflows
**Last Updated:** 2025-11-26

---

## 🎯 Purpose

Approval gates ensure user control and oversight at critical workflow checkpoints. Claude must ALWAYS show approval gates and wait for explicit user confirmation before proceeding.

---

## 🚦 When to Show Approval Gate

**REQUIRED for:**
- ✅ After every phase completion
- ✅ Before code generation
- ✅ Before file modifications
- ✅ Before external system writes (JIRA, Confluence, Slack)

**NOT REQUIRED for:**
- ❌ Reading files or gathering information
- ❌ Analyzing code or documentation
- ❌ Research and exploration tasks

---

## 📋 Approval Gate Format (v5.2.0)

### New Friendly Format

```markdown
╔══════════════════════════════════════════════════════════╗
║  🏗️  Phase 2: Design - Approval Needed                  ║
╚══════════════════════════════════════════════════════════╝

## We've designed the solution! ✨

*"How will we build it?"*

**👤 Agents Working:**
- 🎯 **Primary:** mobile-react-native (Lead Developer)
- 🤝 **Cross-Review:** qa-automation (Testability Check)
- 🎨 **Consulting:** ui-designer (Component Guidance)

**🤖 System:** CCPM Team Agents v5.0
**📋 Mode:** Workflow Phase Execution

---

**What We Did:**
[Brief summary of design decisions]

**Deliverables:**
- ✅ Technical Design Document
- ✅ Architecture Diagram
- ✅ Component Structure

**Key Decisions:**
- [Decision 1]
- [Decision 2]
- [Decision 3]

**Cross-Review:**
- ✅ QA Agent (qa-automation): Testability confirmed ✓
- ✅ Secondary Dev: Code structure approved ✓

**Next Phase:** Phase 3: UI Breakdown 🎨
**Next Agent:** ui-designer (Primary)
We'll analyze the UI and break it into components.

**Token Usage:**
- This phase: 2,450 tokens (~2.5K)
- Total used: 5,230 / 200,000 (2.6%)
- Remaining: 194,770 tokens

---

**Options:**
- "approve" → Continue to Phase 3 (UI Breakdown)
- "reject: [reason]" → Redesign with feedback
- "modify: [changes]" → Adjust specific parts

⚡ After approval, I'll AUTO-CONTINUE to Phase 3!

**─────────────────────────────────────────────────────────**
🤖 **Agent:** mobile-react-native | 📋 **System:** CCPM v5.0
**─────────────────────────────────────────────────────────**

Your response:
═══════════════════════════════════════════════════════════
```

### Legacy Format (Still Supported)

```markdown
╔══════════════════════════════════════════════════════════╗
║  APPROVAL REQUIRED: Phase 2 Technical Planning          ║
╚══════════════════════════════════════════════════════════╝

## Phase 2 Complete: Technical Planning

**Summary:**
[Brief overview of what was done]

**Deliverables:**
- ✅ [file1.md] - [description]
- ✅ [file2.md] - [description]

**Preview:**
[Show key content or code snippets]

**Cross-Review Status:**
- ✅ Dev Review: Approved
- ✅ QA Review: Approved

**Next Steps:**
[What happens after approval]

**Token Usage:**
- Phase tokens: [X] tokens (~[Y]K)
- Total used: [A] / 200,000 ([B]%)
- Remaining: [C] tokens

---

**Options:**
- "approve" → [IMMEDIATELY execute next phase]
- "reject: [reason]" → [Restart phase]
- "modify: [changes]" → [Adjust deliverables]

**⚡ After approval, I will AUTO-CONTINUE to next phase without waiting!**

**⚠️ Token Limit:**
- Cursor session limit: **200,000 tokens**
- At 150K tokens (75%): Show handoff warning
- At 160K+ tokens (80%): Recommend workflow:handoff
```

---

## 🗣️ Valid User Responses

| Response | Action |
|----------|--------|
| `approve` / `yes` / `approved` | Proceed to next phase & AUTO-CONTINUE |
| `proceed` | Execute code generation & AUTO-CONTINUE |
| `reject: <reason>` | Restart phase with user feedback |
| `modify: <instructions>` | Adjust deliverables without full restart |
| `stop` / `cancel` | Cancel workflow immediately |

---

## ⚡ AUTO-CONTINUE Behavior

**After user approves:**
1. ✅ IMMEDIATELY execute next phase
2. ✅ No waiting for next user prompt
3. ✅ Continue through phases until:
   - Implementation complete (Phase 5c)
   - User rejection
   - Blocking error
   - Token limit reached
4. ✅ Show token usage at each phase completion

**Benefits:**
- Faster workflow completion
- Reduced back-and-forth
- Maintains momentum
- User retains control via approval gates

---

## 🎯 Phase-Specific Approval Requirements

### Phase 1: Understand 🎯
**Before approval, must show:**
- Requirements analysis document
- Success criteria
- Clarifying questions answered
- Cross-review feedback

### Phase 2: Design 🏗️
**Before approval, must show:**
- Technical design document
- Architecture decisions
- Component structure
- Cross-review approval

### Phase 3: UI Breakdown 🎨
**Before approval, must show:**
- Component breakdown
- Design token extraction
- UI flow documentation
- Implementation strategy

### Phase 4: Plan Tests 🧪
**Before approval, must show:**
- Test strategy
- Test case descriptions
- Coverage goals
- Edge cases identified

### Phase 5a: Write Tests 🔴
**Before approval, must show:**
- Test files created
- Tests FAIL confirmation ❌
- No implementation code
- Ready for GREEN phase

### Phase 5b: Build 🟢
**Before approval, must show:**
- Implementation complete
- Tests PASS confirmation ✅
- Code follows conventions
- Ready for refactoring

### Phase 5c: Polish ♻️
**Before approval, must show:**
- Refactoring complete
- Tests STILL PASS ✅
- Code quality improved
- Ready for review

### Phase 6: Review 👀
**Before approval, must show:**
- Self-review checklist
- Linter results (0 warnings)
- Security scan results
- Cross-agent review feedback

### Phase 7: Verify ✅
**Before approval, must show:**
- All tests passing
- Coverage report (≥80%)
- Quality metrics
- Test result documentation

### Phase 8: Document 📚
**Before approval, must show:**
- Implementation summary
- Deployment guide
- Changelog
- Optional: Voice narration

### Phase 9: Share 🔔
**Special:** Auto-executes, no approval needed
- Updates JIRA
- Posts to Slack
- Uploads to Confluence
- Archives workflow

---

## 🔒 Security Considerations

**NEVER auto-approve:**
- ❌ External system writes
- ❌ Code deployment
- ❌ Database modifications
- ❌ File deletions
- ❌ Security-sensitive operations

**ALWAYS require explicit approval for:**
- ✅ Committing code
- ✅ Publishing packages
- ✅ Modifying production configs
- ✅ Accessing external APIs
- ✅ Writing to shared resources

---

## 📊 Token Tracking in Approval Gates

### Why Track Tokens?

**Purpose:**
- Prevent session timeout
- Enable timely handoff
- Maintain workflow continuity
- User awareness of resource usage

### Token Limits

| Session Type | Limit | Handoff Warning | Critical |
|-------------|-------|-----------------|----------|
| **Cursor** | 200,000 | 150,000 (75%) | 160,000 (80%) |
| **Standard Claude** | 200,000 | 150,000 (75%) | 160,000 (80%) |

### Display Format

```markdown
**Token Usage:**
- This phase: 2,450 tokens (~2.5K)
- Total used: 5,230 / 200,000 (2.6%)
- Remaining: 194,770 tokens
```

### Handoff Recommendation

When reaching 160K tokens:

```markdown
⚠️ **Token Usage Alert**

Current usage: 162,450 / 200,000 (81.2%)

**Recommendation:** Consider using `workflow:handoff` to save progress and continue in new session.

**Options:**
1. Continue (may hit limit soon)
2. Handoff now (safe option)
3. Complete current phase then handoff
```

---

## 🎨 Approval Gate Customization

### For Different Workflows

**Bug Fix (Quick):**
- Simplified format
- Focus on changes made
- Single approval for test + fix

**Feature Development (Full):**
- Comprehensive format
- Show all deliverables
- Multiple cross-reviews

**Refactoring:**
- Emphasize code quality
- Before/after comparisons
- Performance metrics

---

## ✅ Best Practices

### For Claude

1. **Always wait** for explicit approval
2. **Never skip** approval gates
3. **Clear communication** of what's being approved
4. **Show preview** of changes when possible
5. **Explain next steps** clearly

### For Users

1. **Review carefully** before approving
2. **Use "modify"** for small adjustments
3. **Use "reject"** with clear feedback
4. **Ask questions** if unclear
5. **Cancel early** if direction is wrong

---

## 📚 Related Documentation

- **Workflow Guide:** `docs/WORKFLOW_GUIDE.md` - Complete workflow documentation
- **Phase Guides:** `docs/phases/` - Detailed phase requirements
- **Agent Identification:** `docs/AGENT_IDENTIFICATION.md` - Agent signature format
- **CCPM Instructions:** `CLAUDE.md` - Core system guide

---

**Document Version:** 5.2.0
**Last Updated:** 2025-11-26
**Extracted from:** CLAUDE.md (optimization)
