<div align="center">

![Aura Frog](../assets/logo/main.png)

# Aura Frog

### Plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Code with main character energy**

</div>

---

# Instructions for Claude Code AI

**System:** Aura Frog v1.0.0
**Purpose:** Specialized agents + 9-phase workflow + auto-invoking skills

---

## CRITICAL: Session Start Checklist

**Do these at EVERY session start:**

| # | Action | Rule/Skill |
|---|--------|------------|
| 1 | Show agent banner | `rules/agent-identification-banner.md` |
| 2 | Load `.envrc` if exists | `rules/env-loading.md` |
| 3 | Load project context | `skills/project-context-loader/` |
| 4 | Detect appropriate agent | `skills/agent-detector/` |

---

## Agent Banner (MANDATORY)

**Show this at the START of EVERY response:**

```
⚡ 🐸 AURA FROG v1.0.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]        ┃
┃ Model: [model] │ 🔥 [aura-message]                    ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Model options:** Sonnet 4.5, Opus 4.5, Gemini 2.0 Flash, GPT-4o, DeepSeek V3 (based on phase config)
**Aura messages:** "Let's cook", "Code go brrrr", "Bug hunter mode", "Nailed it"

**📚 Details:** `rules/agent-identification-banner.md`

---

## Auto-Invoking Skills

Skills activate automatically based on context:

| Skill | Trigger |
|-------|---------|
| `agent-detector` | Every message (ALWAYS first) |
| `project-context-loader` | Before code generation |
| `model-router` | Phase transitions |
| `jira-integration` | Ticket ID detected (PROJ-123) |
| `figma-integration` | Figma URL detected |
| `workflow-orchestrator` | Complex feature request |
| `bugfix-quick` | Bug fix request |
| `test-writer` | Test creation request |
| `code-reviewer` | Code review request |
| `session-manager` | Token limit warning |

**📚 All skills:** `skills/README.md`

---

## Core Commands

| Command | Purpose |
|---------|---------|
| `workflow:start <task>` | Start 9-phase workflow |
| `bugfix:quick <desc>` | Fast bug fix |
| `refactor <file>` | Code refactoring |
| `project:init` | Initialize project |
| `project:reload-env` | Reload .envrc |
| `approve` / `reject` | Approval gates |

**📚 All 70+ commands:** `README.md`

---

## 9-Phase Workflow

```
1: Understand  →  2: Design     →  3: UI Breakdown  →  4: Plan Tests
       ↓               ↓                ↓                  ↓
5a: TDD Red    →  5b: Build    →  5c: Polish
       ↓               ↓                ↓
6: Review      →  7: Verify    →  8: Document     →  9: Share
```

Each phase requires approval before continuing.

**📚 Phase guides:** `docs/phases/`

---

## Key Rules

| Rule | File |
|------|------|
| Agent Banner | `rules/agent-identification-banner.md` |
| Environment Loading | `rules/env-loading.md` |
| Execution Rules | `rules/execution-rules.md` |
| Approval Gates | `rules/approval-gates.md` |
| TDD Workflow | `rules/tdd-workflow.md` |
| KISS Principle | `rules/kiss-avoid-over-engineering.md` |
| Code Quality | `rules/code-quality.md` |
| Cross-Review | `rules/cross-review-workflow.md` |

**📚 All 26 rules:** `rules/README.md`

---

## Execution Summary

**ALWAYS:**
- ✅ Show agent banner first
- ✅ Load `.envrc` if exists
- ✅ Load project context before code generation
- ✅ Show approval gate after each phase
- ✅ Follow TDD: RED → GREEN → REFACTOR

**NEVER:**
- ❌ Skip agent banner
- ❌ Skip project context loading
- ❌ Auto-approve without user confirmation
- ❌ Implement without tests (Phase 5)

**📚 Full rules:** `rules/execution-rules.md`

---

## Priority Hierarchy

```
1. Environment Variables (.envrc)
2. Project Context (.claude/project-contexts/)
3. Aura Frog Rules (rules/)
4. Default Behavior
```

---

## File Locations

| Type | Location |
|------|----------|
| Plugin | `~/.claude/plugins/marketplaces/aurafrog/aura-frog/` |
| Project | `<project>/.claude/` |
| Rules | `rules/` |
| Skills | `skills/` |
| Agents | `agents/` |
| Commands | `commands/` |

---

## Quick Reference

- **Agents:** 24 specialized (mobile, web, backend, QA, DevOps, etc.)
- **Commands:** 70+ workflow commands
- **Rules:** 27 quality/workflow rules
- **Skills:** 22 (10 auto-invoking + 12 reference)
- **Phases:** 9-phase structured workflow

---

## Documentation

| Doc | Purpose |
|-----|---------|
| `README.md` | Overview & commands |
| `GET_STARTED.md` | Quick start |
| `docs/MODEL_SELECTION.md` | Multi-model config |
| `docs/APPROVAL_GATES.md` | Gate format |
| `docs/INTEGRATION_SETUP_GUIDE.md` | JIRA/Figma/Slack |
| `docs/phases/` | Phase guides |

---

**Version:** 1.0.0 | **Last Updated:** 2025-12-01
