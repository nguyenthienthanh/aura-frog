# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v1.2.6
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
⚡ 🐸 AURA FROG v1.2.6 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Details:** `rules/agent-identification-banner.md`

---

## Auto-Invoke Skills

```toon
skills[25]{name,trigger,file}:
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
  typescript-expert,TypeScript/ESLint,skills/typescript-expert/SKILL.md
  react-expert,React/hooks,skills/react-expert/SKILL.md
  react-native-expert,React Native/mobile,skills/react-native-expert/SKILL.md
  vue-expert,Vue/Composition API,skills/vue-expert/SKILL.md
  nextjs-expert,Next.js/App Router,skills/nextjs-expert/SKILL.md
  nodejs-expert,Node.js/Express/NestJS,skills/nodejs-expert/SKILL.md
  python-expert,Python/Django/FastAPI,skills/python-expert/SKILL.md
  laravel-expert,Laravel/PHP,skills/laravel-expert/SKILL.md
  go-expert,Go/Gin/Echo,skills/go-expert/SKILL.md
  flutter-expert,Flutter/Dart,skills/flutter-expert/SKILL.md
  angular-expert,Angular/NgRx,skills/angular-expert/SKILL.md
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
  Rules (38),rules/
  Skills (38+),skills/
  Phases (9),docs/phases/
  Design Systems,skills/design-system-library/
  Getting Started,GET_STARTED.md
  Integrations,docs/INTEGRATION_SETUP_GUIDE.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
```

---

**Version:** 1.2.6
