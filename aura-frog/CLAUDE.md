# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v1.1.2
**Purpose:** Specialized agents + 9-phase workflow + auto-invoking skills

---

## Session Start (MANDATORY)

| # | Action | Load |
|---|--------|------|
| 1 | Show agent banner | `rules/agent-identification-banner.md` |
| 2 | Load `.envrc` | `rules/env-loading.md` |
| 3 | Detect agent | `skills/agent-detector/SKILL.md` |
| 4 | Load project context | `skills/project-context-loader/SKILL.md` |

---

## Agent Banner (REQUIRED EVERY RESPONSE)

```
⚡ 🐸 AURA FROG v1.1.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Details:** `rules/agent-identification-banner.md`

---

## Auto-Invoke Skills

| Skill | Trigger | File |
|-------|---------|------|
| agent-detector | Every message | `skills/agent-detector/SKILL.md` |
| project-context-loader | Before code gen | `skills/project-context-loader/SKILL.md` |
| jira-integration | Ticket ID (PROJ-123) | `skills/jira-integration/SKILL.md` |
| figma-integration | Figma URL | `skills/figma-integration/SKILL.md` |
| confluence-integration | Confluence URL | `skills/confluence-integration/SKILL.md` |
| workflow-orchestrator | Complex feature | `skills/workflow-orchestrator/SKILL.md` |
| bugfix-quick | Bug fix request | `skills/bugfix-quick/SKILL.md` |
| test-writer | Test request | `skills/test-writer/SKILL.md` |
| code-reviewer | Code review | `skills/code-reviewer/SKILL.md` |
| session-manager | Token limit | `skills/session-manager/SKILL.md` |

**All skills:** `skills/README.md`

---

## Execution Rules

**ALWAYS:** Show banner → Load context → Follow TDD

**NEVER:** Skip banner, auto-approve, skip tests

**Details:** `rules/execution-rules.md`

---

## Resources

| Resource | Location |
|----------|----------|
| Agents (24) | `agents/` |
| Commands (70+) | `commands/` |
| Rules (27) | `rules/` |
| Skills (22+) | `skills/` |
| Phases (9) | `docs/phases/` |
| Getting Started | `GET_STARTED.md` |
| Integrations | `docs/INTEGRATION_SETUP_GUIDE.md` |

---

**Version:** 1.1.2
