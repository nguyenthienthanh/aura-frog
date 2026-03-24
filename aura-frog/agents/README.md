# Aura Frog Agents Directory

**Version:** 2.0.0
**Format:** [TOON](https://github.com/toon-format/toon) (Token-Optimized)
**Last Updated:** 2026-02-09

---

## Overview

Aura Frog provides **10 specialized agents** (reduced from 15 in v1.17.0 through consolidation, voice-operations removed in v1.18.1, strategist added in v2.0.0, gamedev externalized in v1.23.0).

---

## New in 1.17.0 - Consolidated Agents

| New Agent | Replaces | Purpose |
|-----------|----------|---------|
| **scanner** | project-detector, project-config-loader, project-context-manager | Unified project detection, config, and context |
| **architect** | backend-expert, database-specialist | System design + database architecture |
| **frontend** | web-expert, ui-designer | Frontend + design systems |

---

## Agents Index (TOON)

```toon
agents[10]{name,file,expertise}:
  architect,architect.md,System design + database + backend architecture
  frontend,frontend.md,Frontend frameworks + design systems + accessibility
  mobile,mobile.md,React Native + Flutter + mobile platforms
  strategist,strategist.md,Business strategy + product thinking + ROI evaluation
  tester,tester.md,Testing strategies + QA + TDD enforcement
  security,security.md,Security audits + vulnerability assessment
  devops,devops.md,CI/CD pipelines + deployment + infrastructure
  lead,lead.md,Workflow coordination + team lead
  scanner,scanner.md,Project detection + config + context
  router,router.md,Agent selection + routing logic
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
| **Development** | architect, frontend, mobile | Code implementation |
| **Strategy** | strategist | Business thinking + product decisions |
| **Quality** | tester, security | Testing + security |
| **Infrastructure** | devops | Deployment + CI/CD |
| **Management** | lead | Workflow coordination |
| **System** | scanner, router | Internal operations |

---

## Reduction Summary

| Version | Agents | Change |
|---------|--------|--------|
| v1.16.0 | 15 | - |
| v1.17.0 | 11 | -4 (consolidated) |
| v1.18.1 | 10 | -1 (voice-operations removed) |
| v2.0.0 | 11 | +1 (strategist added) |
| v1.23.0 | 10 | -1 (gamedev externalized as addon) |

**Removed files (consolidated):**
- backend-expert.md → architect
- database-specialist.md → architect
- web-expert.md → frontend
- ui-designer.md → frontend
- project-detector.md → scanner
- project-config-loader.md → scanner
- project-context-manager.md → scanner

---

## Related Files

- **Agent Detector:** `skills/agent-detector/SKILL.md`
- **Lazy Agent Loader:** `skills/lazy-agent-loader/SKILL.md`
- **Agent Selection Guide:** `docs/AGENT_SELECTION_GUIDE.md`
- **Refactor Analysis:** `docs/REFACTOR_ANALYSIS.md`

---

**Version:** 2.0.0 | **Last Updated:** 2026-02-09
