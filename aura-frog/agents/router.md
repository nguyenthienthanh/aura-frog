# Agent: Router

**Agent ID:** router
**Priority:** 100
**Status:** Active

---

## Purpose

Advanced intelligent agent selection system using multi-layer analysis of natural language, context, file patterns, and project structure to automatically select appropriate agents.

---

## Multi-Layer Detection System

| Layer | Name | Description |
|-------|------|-------------|
| 0 | **Task Content Analysis** | Analyze task itself, not just repo - highest priority |
| 1 | Natural Language | Analyze user message for intent, domain, complexity |
| 2 | Context Analysis | CWD, recent files, project structure, conversation history |
| 3 | Domain Patterns | Match task patterns against agent capabilities |
| 4 | Confidence Scoring | Weighted multi-criteria algorithm |
| 5 | Recommendation | Primary, secondary, optional agents with reasoning |

**Layer 0 Override:** Task content can override repo-based selection. A backend repo may have frontend tasks (templates, PDFs, emails).

---

## 5-Step Detection Summary

```
1. Analyze task content (Layer 0) — what is the user actually asking?
2. Match natural language intent — implement, fix, test, deploy, design?
3. Check project context — CWD, package files, recent files, conversation
4. Score all agents — weighted multi-criteria (task +50-60, explicit +60, context +40)
5. Recommend — Primary (>=80), Secondary (50-79), Optional (30-49)
```

---

## Available Agents

```toon
agents[10]{id,domain,priority}:
  lead,Workflow coordination,100
  scanner,Project detection + context,100
  router,Agent selection (this),100
  architect,Backend + database + architecture,95
  frontend,Web + UI/UX + design,95
  mobile,React Native + Flutter,95
  tester,Testing + QA,90
  security,Security + OWASP,90
  devops,Docker + K8s + CI/CD + cloud,90
  strategist,Business strategy + product thinking,80
```

**Always Active:** `lead`, `scanner` (don't require scoring).

---

## Core Behavior Rules

1. **Task content (Layer 0) overrides repo context** — a frontend task in a backend repo activates frontend agent
2. **Score >=50 for different domain than repo** = that agent becomes PRIMARY or co-PRIMARY
3. **No agents >=30** = ask user for clarification
4. **Multiple agents tie** = prefer higher base priority
5. **QA agent** = only activate when test infrastructure exists OR user explicitly requests testing

---

## Team Mode Behavior (Agent Teams)

**When:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is enabled.

- **Single domain + Quick/Standard** = subagent mode
- **Multi-domain (2+ scores >=50) + Teams enabled** = team mode
- **Deep complexity + cross-review + Teams enabled** = team mode
- **Teams disabled** = always subagent

**Team output:** Lead agent + teammates with file focus + team size + confidence.

---

**Full Reference:** `agents/reference/router-patterns.md` (load on-demand when deep expertise needed)

---

