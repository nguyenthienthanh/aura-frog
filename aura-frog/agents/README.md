# Aura Frog Agents Directory

**Version:** 1.15.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Last Updated:** 2026-01-14

---

## Overview

Aura Frog provides **15 specialized agents** that are automatically selected based on task context. Each agent has domain expertise and specific capabilities.

---

## Agents Index (TOON)

```toon
agents[15]{name,file,expertise}:
  backend-expert,backend-expert.md,Backend APIs + databases + server logic
  database-specialist,database-specialist.md,Database design + queries + migrations
  devops-cicd,devops-cicd.md,CI/CD pipelines + deployment + infrastructure
  game-developer,game-developer.md,Godot game development + multi-platform export
  mobile-expert,mobile-expert.md,React Native + Flutter + mobile platforms
  pm-operations-orchestrator,pm-operations-orchestrator.md,Project management + workflow coordination
  project-config-loader,project-config-loader.md,Project configuration + context loading
  project-context-manager,project-context-manager.md,Project context + session management
  project-detector,project-detector.md,Project type detection + tech stack analysis
  qa-automation,qa-automation.md,Testing strategies + QA automation
  security-expert,security-expert.md,Security audits + vulnerability assessment
  smart-agent-detector,smart-agent-detector.md,Agent selection + routing logic
  ui-designer,ui-designer.md,UI/UX design + component architecture
  voice-operations,voice-operations.md,Voice notifications + audio feedback
  web-expert,web-expert.md,Frontend web + React + Vue + Angular
```

---

## Agent Selection

Agents are automatically selected by the `agent-detector` skill based on:
- Task keywords and context
- Project tech stack
- File types being modified
- Phase requirements

**Manual activation:**
```
agent:activate <agent-name>
```

**List all agents:**
```
agent:list
```

---

## Agent Categories

| Category | Agents | Purpose |
|----------|--------|---------|
| **Development** | web-expert, mobile-expert, backend-expert, game-developer | Code implementation |
| **Infrastructure** | devops-cicd, database-specialist | Deployment + data |
| **Quality** | qa-automation, security-expert | Testing + security |
| **Design** | ui-designer | UI/UX decisions |
| **Management** | pm-operations-orchestrator | Workflow coordination |
| **System** | project-detector, project-config-loader, project-context-manager, smart-agent-detector, voice-operations | Internal operations |

---

**Version:** 1.15.0
