# Command: Phase 1 - Understand + Design

**Phase:** 1 of 5
**Duration:** 15-30 minutes
**Tagline:** "What are we building?"
**Last Updated:** 2025-11-26

---

## 🎯 Purpose

Phase 1 is where we understand the task requirements, goals, and success criteria. This phase ensures everyone (agents and user) is aligned on what needs to be built before diving into implementation.

---

## 📋 Phase Objectives

1. **Understand the Task**
   - Read and analyze user requirements
   - Identify goals and deliverables
   - Clarify ambiguous points

2. **Document Requirements**
   - Create structured requirements document
   - Define success criteria
   - Identify constraints and dependencies

3. **Cross-Review**
   - Dev agent reviews technical feasibility
   - QA agent reviews testability
   - UI Designer reviews design requirements (if applicable)

---

## 🤖 Agents Involved

### Primary Agent
- **lead** - Leads requirements analysis

### Cross-Review Agents
- **Development Agent** (mobile, frontend, architect, etc.)
  - Reviews technical feasibility
  - Identifies technical challenges
  - Suggests alternatives if needed

- **tester**
  - Reviews testability
  - Identifies test scenarios
  - Suggests test coverage approach

- **frontend** (if UI/UX involved)
  - Reviews design requirements
  - Identifies UI/UX considerations
  - Suggests design patterns

---

## 📝 Deliverables

### Requirements Analysis Document

**File:** `.claude/logs/workflows/{workflow-id}/phase-1-requirements.md`

**Sections:**
1. **Task Overview**
   - Brief description
   - User story format (if applicable)
   - Business context

2. **Goals & Objectives**
   - What we want to achieve
   - Why it's needed
   - Expected outcomes

3. **Success Criteria**
   - Measurable criteria
   - Acceptance conditions
   - Definition of "done"

4. **Technical Requirements**
   - Technologies involved
   - Integration points
   - Dependencies

5. **Constraints & Assumptions**
   - Technical constraints
   - Time constraints
   - Resource constraints
   - Assumptions made

6. **Risk Assessment**
   - Potential risks
   - Mitigation strategies
   - Contingency plans

7. **Initial Estimation**
   - **Story Points** (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
   - **Complexity Assessment** (Trivial, Simple, Moderate, Complex, Very Complex)
   - **Time Estimate Range** (optimistic, likely, pessimistic)
   - **Confidence Level** (High, Medium, Low)

8. **Questions & Clarifications**
   - Open questions
   - Items needing user input
   - Ambiguous requirements

9. **Cross-Review Feedback**
   - Dev review comments
   - QA review comments
   - UI review comments (if applicable)

---

## 🔄 Execution Flow

```
1. PM Orchestrator reads task
   ↓
2. Analyze requirements
   ↓
3. Identify goals & success criteria
   ↓
4. Ask clarifying questions (if needed)
   ↓
5. Document findings
   ↓
6. Cross-Review:
   - Dev Agent reviews technical feasibility
   - QA Agent reviews testability
   - UI Designer reviews design needs (if applicable)
   ↓
7. Incorporate feedback
   ↓
8. Finalize requirements document
   ↓
9. Show deliverables summary
   ↓
10. Auto-continue to Phase 2 (no approval wait)
```

---

## ✅ Cross-Review Checklist

### Development Agent Review
- [ ] Requirements are technically feasible
- [ ] No major technical blockers identified
- [ ] Dependencies are clear
- [ ] Integration points defined
- [ ] Tech stack is appropriate

### QA Agent Review
- [ ] Requirements are testable
- [ ] Success criteria are measurable
- [ ] Test scenarios can be defined
- [ ] Edge cases identified
- [ ] Coverage goals are realistic

### UI Designer Review (if applicable)
- [ ] UI/UX requirements are clear
- [ ] Design patterns are appropriate
- [ ] Accessibility considered
- [ ] Responsive design needs defined
- [ ] Design system integration planned

---

## 🚦 Approval Gate

After completing Phase 1, show this approval gate:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Phase 1: Understand - Approval Needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## We understand what we're building! ✨

*"What are we building?"*

**👤 Agents Working:**
- 🎯 **Primary:** lead (Requirements Lead)
- 🤝 **Cross-Review:** [dev-agent] (Technical Feasibility)
- ✅ **Cross-Review:** tester (Testability Check)
- 🎨 **Cross-Review:** frontend (Design Review) [if applicable]

**🤖 System:** Aura Frog Team Agents v1.0.0
**📋 Mode:** Workflow Phase Execution

---

**What We Did:**
- Analyzed task requirements
- Identified goals and success criteria
- Documented technical requirements
- Assessed risks and constraints
- Cross-reviewed with dev, QA, and UI teams

**Deliverables:**
- ✅ Requirements Analysis Document
- ✅ Success Criteria Defined
- ✅ Risk Assessment Complete

**Key Findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Initial Estimation:**
- Story Points: X points (Complexity Level)
- Time Estimate: Y-Z hours (~W days)
- Confidence: High/Medium/Low

**Cross-Review:**
- ✅ Dev Agent: Technically feasible ✓
- ✅ QA Agent: Testable requirements ✓
- ✅ UI Designer: Design requirements clear ✓ [if applicable]

**Clarifying Questions:** [if any]
- Question 1?
- Question 2?

**Next Phase:** Phase 2: Test RED 🔴
**Next Agent:** [dev-agent] (Primary)
We'll write failing tests before implementation (TDD RED phase).

**Token Usage:**
- This phase: [X] tokens (~[Y]K)
- Total used: [A] / 200,000 ([B]%)
- Remaining: [C] tokens

---

**Options:**
- "approve" → Continue to Phase 2 (Test RED)
- "reject: [reason]" → Re-analyze requirements
- "modify: [changes]" → Adjust requirements
- "answer: [responses]" → Answer clarifying questions

⚡ After approval, I'll AUTO-CONTINUE to Phase 2!

**─────────────────────────────────────────────────────────**
🤖 **Agent:** lead | 📋 **System:** Aura Frog {version}
**─────────────────────────────────────────────────────────**

Your response:
═══════════════════════════════════════════════════════════
```

---

## 🎯 Success Criteria

Phase 1 is complete when:
- [ ] Requirements are clearly documented
- [ ] Goals and success criteria defined
- [ ] Technical feasibility confirmed
- [ ] Testability confirmed
- [ ] Design requirements clear (if applicable)
- [ ] All clarifying questions answered
- [ ] Cross-review feedback incorporated
- [ ] User approves requirements

---

## ⚠️ Common Issues & Solutions

### Issue: Requirements are too vague
**Solution:** Ask specific clarifying questions before proceeding

### Issue: Technical feasibility is uncertain
**Solution:** Dev agent suggests investigation or proof-of-concept in Phase 2

### Issue: Requirements conflict
**Solution:** Document trade-offs and ask user to prioritize

### Issue: Scope is too large
**Solution:** Suggest breaking into smaller tasks/workflows

---

## 📚 Related Documentation

- **Phase Guide:** `docs/phases/PHASE_1_UNDERSTAND_DESIGN.MD`
- **Next Phase:** `commands/workflow/phase-2.md`
- **Workflow Start:** `commands/workflow/start.md`

---

## 🎓 Tips for Success

**For PM Orchestrator:**
- Ask clarifying questions early
- Be specific about success criteria
- Involve right agents in cross-review
- Document assumptions clearly

**For Cross-Review Agents:**
- Focus on your domain (tech feasibility, testability, design)
- Raise concerns early
- Suggest alternatives when needed
- Be constructive in feedback

**For Users:**
- Provide clear requirements
- Answer clarifying questions promptly
- Approve only when requirements are clear
- Use "modify" for small adjustments

---

**Phase:** 1 of 5
**Status:** Active
**Last Updated:** 2026-03-12

**Old Name:** Requirements Analysis (v4.x compatibility maintained)
