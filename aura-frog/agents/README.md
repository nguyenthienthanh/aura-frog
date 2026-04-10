# Aura Frog Agents

**10 specialized agents**, auto-selected by `agent-detector` skill.

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

## Categories

```toon
categories[6]{category,agents}:
  Development,"architect, frontend, mobile"
  Strategy,strategist
  Quality,"tester, security"
  Infrastructure,devops
  Management,lead
  System,"scanner, router"
```

## Selection

Auto-selected via task keywords, project tech stack, file types, and task content analysis.

Manual: `agent:activate <name>` | `agent:list`
