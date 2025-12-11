# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v1.2.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** Specialized agents + 9-phase workflow + auto-invoking skills

---

## Session Start (MANDATORY)

```toon
session_start[4]{step,action,file}:
  1,Show agent banner,rules/agent-identification-banner.md
  2,Load .envrc,rules/env-loading.md
  3,Detect agent,skills/agent-detector/SKILL.md
  4,Load project context,skills/project-context-loader/SKILL.md
```

---

## Agent Banner (REQUIRED EVERY RESPONSE)

```
⚡ 🐸 AURA FROG v1.2.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Details:** `rules/agent-identification-banner.md`

---

## Auto-Invoke Skills

```toon
skills[14]{name,trigger,file}:
  agent-detector,Every message,skills/agent-detector/SKILL.md
  project-context-loader,Before code gen,skills/project-context-loader/SKILL.md
  design-system-library,UI/design system,skills/design-system-library/SKILL.md
  jira-integration,Ticket ID (PROJ-123),skills/jira-integration/SKILL.md
  figma-integration,Figma URL,skills/figma-integration/SKILL.md
  confluence-integration,Confluence URL,skills/confluence-integration/SKILL.md
  workflow-orchestrator,Complex feature,skills/workflow-orchestrator/SKILL.md
  bugfix-quick,Bug fix request,skills/bugfix-quick/SKILL.md
  test-writer,Test request,skills/test-writer/SKILL.md
  code-reviewer,Code review,skills/code-reviewer/SKILL.md
  session-continuation,Token limit,skills/session-continuation/SKILL.md
  lazy-agent-loader,Agent loading,skills/lazy-agent-loader/SKILL.md
  response-analyzer,Large outputs,skills/response-analyzer/SKILL.md
  state-persistence,Session handoff,skills/state-persistence/SKILL.md
```

**All skills:** `skills/README.md`

---

## Execution Rules

**ALWAYS:** Show banner → Load context → Follow TDD

**NEVER:** Skip banner, auto-approve, skip tests

**Details:** `rules/execution-rules.md`

---

## Resources

```toon
resources[9]{name,location}:
  Agents (24),agents/
  Commands (70+),commands/
  Rules (36),rules/
  Skills (26+),skills/
  Phases (9),docs/phases/
  Design Systems,skills/design-system-library/
  Getting Started,GET_STARTED.md
  Integrations,docs/INTEGRATION_SETUP_GUIDE.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
```

---

**Version:** 1.2.0
