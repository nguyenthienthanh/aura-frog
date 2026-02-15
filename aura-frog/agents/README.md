# Aura Frog Agents Directory

**Version:** 1.19.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Last Updated:** 2026-02-09

---

## Overview

Aura Frog provides **10 specialized agents** (reduced from 15 in v1.17.0 through consolidation, voice-operations removed in v1.18.1).

---

## New in 1.17.0 - Consolidated Agents

| New Agent | Replaces | Purpose |
|-----------|----------|---------|
| **project-manager** | project-detector, project-config-loader, project-context-manager | Unified project detection, config, and context |
| **architect** | backend-expert, database-specialist | System design + database architecture |
| **ui-expert** | web-expert, ui-designer | Frontend + design systems |

---

## Agents Index (TOON)

```toon
agents[10]{name,file,expertise}:
  project-manager,project-manager.md,Project detection + config + context
  architect,architect.md,System design + database + backend architecture
  ui-expert,ui-expert.md,Frontend frameworks + design systems + accessibility
  mobile-expert,mobile-expert.md,React Native + Flutter + mobile platforms
  game-developer,game-developer.md,Godot game development + multi-platform export
  devops-cicd,devops-cicd.md,CI/CD pipelines + deployment + infrastructure
  qa-automation,qa-automation.md,Testing strategies + QA automation
  security-expert,security-expert.md,Security audits + vulnerability assessment
  pm-operations-orchestrator,pm-operations-orchestrator.md,Project management + workflow coordination
  smart-agent-detector,smart-agent-detector.md,Agent selection + routing logic
```

---

## Agent Selection

Agents are automatically selected by the `agent-detector` skill based on:
- Task keywords and context
- Project tech stack (from cache)
- File types being modified
- Task content analysis (Layer 0)

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
| **Development** | ui-expert, mobile-expert, architect, game-developer | Code implementation |
| **Infrastructure** | devops-cicd | Deployment + CI/CD |
| **Quality** | qa-automation, security-expert | Testing + security |
| **Management** | pm-operations-orchestrator | Workflow coordination |
| **System** | project-manager, smart-agent-detector | Internal operations |

---

## Reduction Summary

| Version | Agents | Change |
|---------|--------|--------|
| v1.16.0 | 15 | - |
| v1.17.0 | 11 | -4 (consolidated) |
| v1.18.1 | 10 | -1 (voice-operations removed) |

**Removed files (consolidated):**
- backend-expert.md → architect
- database-specialist.md → architect
- web-expert.md → ui-expert
- ui-designer.md → ui-expert
- project-detector.md → project-manager
- project-config-loader.md → project-manager
- project-context-manager.md → project-manager

---

## Related Files

- **Agent Detector:** `skills/agent-detector/SKILL.md`
- **Lazy Agent Loader:** `skills/lazy-agent-loader/SKILL.md`
- **Model Router:** `skills/model-router/SKILL.md`
- **Agent Selection Guide:** `docs/AGENT_SELECTION_GUIDE.md`
- **Refactor Analysis:** `docs/REFACTOR_ANALYSIS.md`

---

**Version:** 1.19.0 | **Last Updated:** 2026-02-09
