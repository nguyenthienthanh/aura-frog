# Aura Frog - Plugin for Claude Code

**System:** Aura Frog v1.9.1
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Purpose:** Specialized agents + 9-phase workflow + auto-invoking skills + bundled MCP

---

## Session Start (MANDATORY)

```toon
session_start[5]{step,action,file}:
  1,Check & load .envrc (AUTO-RUN if not loaded),rules/env-loading.md
  2,Show agent banner,rules/agent-identification-banner.md
  3,Detect agent,skills/agent-detector/SKILL.md
  4,Load project context,skills/project-context-loader/SKILL.md
  5,Verify MCP servers,commands/mcp/status.md
```

**CRITICAL: Always check env FIRST.** If env vars not loaded → run `project:reload-env` before continuing.

**Show status in first response:**
```
🔌 MCP: context7 ✓ | figma ✗ | playwright ✓ | vitest ✓ | slack ✗
🧠 Learning: enabled ✓
```

---

## Agent Banner (REQUIRED EVERY RESPONSE)

```
⚡ 🐸 AURA FROG v1.9.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ Model: [model] │ 🔥 [aura-message]                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Details:** `rules/agent-identification-banner.md`

---

## Bundled MCP Servers

```toon
mcp_servers[5]{name,package,purpose}:
  context7,@upstash/context7-mcp,Library docs (MUI Tailwind etc)
  playwright,@playwright/mcp,Browser automation + E2E tests
  vitest,@djankies/vitest-mcp,Test execution + coverage
  figma,figma-developer-mcp,Figma design fetch
  slack,@modelcontextprotocol/server-slack,Slack notifications
```

**Auto-invocation:** Claude uses these automatically based on context:
- "Build with MUI" → context7 fetches docs
- "Run tests" → vitest executes
- "Get Figma design" → figma fetches components

**Atlassian (Jira/Confluence):** Use bash scripts instead (simpler):
- `./scripts/jira-fetch.sh PROJ-123`
- `./scripts/confluence-fetch.sh 123456789`

**Configuration:** `.mcp.json` | **Guide:** `docs/MCP_GUIDE.md`

---

## Auto-Invoke Skills

```toon
skills[26]{name,trigger,file}:
  agent-detector,Every message,skills/agent-detector/SKILL.md
  project-context-loader,Before code gen,skills/project-context-loader/SKILL.md
  design-system-library,UI/design system,skills/design-system-library/SKILL.md
  stitch-design,AI design/Stitch,skills/stitch-design/SKILL.md
  workflow-orchestrator,Complex feature,skills/workflow-orchestrator/SKILL.md
  workflow-fasttrack,Pre-approved specs,skills/workflow-fasttrack/SKILL.md
  bugfix-quick,Bug fix request,skills/bugfix-quick/SKILL.md
  test-writer,Test request,skills/test-writer/SKILL.md
  code-reviewer,Code review,skills/code-reviewer/SKILL.md
  session-continuation,Token limit/handoff,skills/session-continuation/SKILL.md
  lazy-agent-loader,Agent loading,skills/lazy-agent-loader/SKILL.md
  response-analyzer,Large outputs,skills/response-analyzer/SKILL.md
  learning-analyzer,/learn:analyze,skills/learning-analyzer/SKILL.md
  self-improve,/learn:apply,skills/self-improve/SKILL.md
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
  godot-expert,Godot/GDScript/game,skills/godot-expert/SKILL.md
```

**All skills:** `skills/README.md`

---

## Execution Rules

**ALWAYS:** Show banner → Load context → Follow TDD → Show deliverables

**NEVER:** Skip banner, skip approval gates (Phase 2 & 5b), skip auto-continue phases, skip tests

**2-Gate Workflow:** Only Phase 2 & 5b require approval. Other phases auto-continue (execute → show → continue).

**Details:** `rules/execution-rules.md`

---

## Resources

```toon
resources[11]{name,location}:
  Agents (15),agents/
  Commands (79),commands/
  Rules (44),rules/
  Skills (37),skills/
  MCP Servers (5),.mcp.json
  MCP Guide,docs/MCP_GUIDE.md
  Learning System,docs/LEARNING_SYSTEM.md
  Phases (9),docs/phases/
  Design Systems,skills/design-system-library/
  Getting Started,GET_STARTED.md
  Workflow Diagrams,docs/WORKFLOW_DIAGRAMS.md
```

---

## Learning System (NEW)

Self-improvement through feedback collection and pattern analysis.

```bash
/learn:status       # Check learning system status
/learn:feedback     # Submit manual feedback (optional)
/learn:analyze      # Analyze patterns and generate insights
/learn:apply        # Apply learned improvements
```

**Requirements:** Supabase (free tier works)
**Setup:** `docs/LEARNING_SYSTEM.md`

---

**Version:** 1.9.1
