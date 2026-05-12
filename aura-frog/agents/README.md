# Aura Frog Agents

**15 specialized agents**, auto-selected by `agent-detector` skill.

```toon
agents[15]{name,file,expertise}:
  architect,architect.md,System design + database + backend architecture
  frontend,frontend.md,Frontend frameworks + design systems + accessibility
  mobile,mobile.md,React Native + Flutter + mobile platforms
  strategist,strategist.md,Business strategy + ROI + T0/T1 hierarchical-planning
  tester,tester.md,Testing strategies + QA + TDD enforcement
  security,security.md,Security audits + vulnerability assessment
  devops,devops.md,CI/CD pipelines + deployment + infrastructure
  lead,lead.md,Workflow coordination + team lead
  scanner,scanner.md,Project detection + config + context
  master-planner,master-planner.md,Plan tree owner — .claude/plans/ + decision audit
  feature-architect,feature-architect.md,T2 (Feature) → T3 (Story) decomposition
  story-planner,story-planner.md,T3 (Story) → T4 (Task) decomposition
  replanner,replanner.md,F2-F4 mutation proposals (re-decompose / discard / promote)
  epic-summarizer,epic-summarizer.md,T2 done → permanent_memory.md distillation
  conflict-arbiter,conflict-arbiter.md,Adjudicates L1-L4 conflicts (auto/manual decisions per spec §21.5)
```

**Routing:** `skills/agent-detector/SKILL.md` (haiku, auto-invoke every message) handles agent + complexity + model selection. The former `router` agent was removed in favor of this skill.

## Frontmatter Schema (MAINTAIN when editing agent files)

Every agent file must start with YAML frontmatter:

```yaml
---
name: agent-id
description: "One sentence — what it does + when to use it."
tools: Read, Grep, Glob[, Edit, Write, Bash]  # allowlist
model: sonnet|haiku  # optional — omit to inherit
color: red|blue|green|yellow|purple|orange|pink|cyan
---
```

Rules: read-only agents (security, strategist) omit Edit/Write/Bash. Fast-path agents (scanner) use haiku. Orchestrator (lead) inherits model.

## Categories

```toon
categories[7]{category,agents}:
  Development,"architect, frontend, mobile"
  Strategy,strategist
  Quality,"tester, security"
  Infrastructure,devops
  Management,lead
  System,scanner
  Hierarchical-Planning,"master-planner, feature-architect, story-planner, replanner, epic-summarizer, conflict-arbiter"
```

## Selection

Auto-selected via task keywords, project tech stack, file types, and task content analysis.

Manual: `agent:activate <name>` | `agent:list`
