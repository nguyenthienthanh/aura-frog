# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v1.4.1
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** Specialized agents + 9-phase workflow + auto-invoking skills + bundled MCP

---

## Session Start (MANDATORY)

```toon
session_start[5]{step,action,file}:
  1,Show agent banner,rules/agent-identification-banner.md
  2,Load .envrc,rules/env-loading.md
  3,Detect agent,skills/agent-detector/SKILL.md
  4,Load project context,skills/project-context-loader/SKILL.md
  5,Verify MCP servers,commands/mcp/status.md
```

**MCP Verification:** Show loaded MCP servers in first response:
```
🔌 MCP: context7 ✓ | atlassian ✓ | figma ✗ | playwright ✓ | vitest ✓ | slack ✗
```

---

## Agent Banner (REQUIRED EVERY RESPONSE)

```
⚡ 🐸 AURA FROG v1.4.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Details:** `rules/agent-identification-banner.md`

---

## Bundled MCP Servers

```toon
mcp_servers[6]{name,package,purpose}:
  context7,@upstash/context7-mcp,Library docs (MUI Tailwind etc)
  playwright,@playwright/mcp,Browser automation + E2E tests
  vitest,@djankies/vitest-mcp,Test execution + coverage
  atlassian,@anthropic/atlassian-mcp,JIRA + Confluence
  figma,@anthropic/figma-mcp,Figma design fetch
  slack,@anthropic/slack-mcp,Slack notifications
```

**Auto-invocation:** Claude uses these automatically based on context:
- "Build with MUI" → context7 fetches docs
- "Run tests" → vitest executes
- "PROJ-123" → atlassian fetches ticket

**Configuration:** `.mcp.json` | **Guide:** `docs/MCP_GUIDE.md`

---

## Auto-Invoke Skills

```toon
skills[21]{name,trigger,file}:
  agent-detector,Every message,skills/agent-detector/SKILL.md
  project-context-loader,Before code gen,skills/project-context-loader/SKILL.md
  design-system-library,UI/design system,skills/design-system-library/SKILL.md
  workflow-orchestrator,Complex feature,skills/workflow-orchestrator/SKILL.md
  bugfix-quick,Bug fix request,skills/bugfix-quick/SKILL.md
  test-writer,Test request,skills/test-writer/SKILL.md
  code-reviewer,Code review,skills/code-reviewer/SKILL.md
  session-continuation,Token limit/handoff,skills/session-continuation/SKILL.md
  lazy-agent-loader,Agent loading,skills/lazy-agent-loader/SKILL.md
  response-analyzer,Large outputs,skills/response-analyzer/SKILL.md
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
resources[10]{name,location}:
  Agents (14),agents/
  Commands (73),commands/
  Rules (41),rules/
  Skills (32),skills/
  MCP Servers (6),.mcp.json
  MCP Guide,docs/MCP_GUIDE.md
  Phases (9),docs/phases/
  Design Systems,skills/design-system-library/
  Getting Started,GET_STARTED.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
```

---

**Version:** 1.4.1
