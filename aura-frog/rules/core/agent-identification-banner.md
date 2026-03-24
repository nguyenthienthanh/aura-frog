# Agent Identification Banner

**Priority:** CRITICAL - Must be shown at session start, phase transitions, and agent switches

---

## When to Show Banner

```toon
banner_display[4]{when,required}:
  First response of session,YES
  Phase transition (entering new phase),YES
  Agent switch (different agent activated),YES
  Regular mid-conversation response,NO — skip to save tokens
```

---

## Banner Template

```
⚡ 🐸 AURA FROG v{version} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent] │ Phase: [phase] - [name]               ┃
┃ Model: [model] │ Teams: [✓/✗]                           ┃
┃ 🔥 [aura-message]                                      ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Multi-agent variant:** Replace `Agent:` with `Agents: [primary] + [secondary]`

**MCP active:** Append `│ 🔌 MCP: [name]` to the Model/Teams line

**Team mode:** Replace `Agent:` with `Teammate:` for non-lead agents, add `Lead: [name]`

---

## Field Reference

```toon
banner_fields[6]{field,values,source}:
  Agent,Auto-detected agent name,skills/agent-detector/SKILL.md
  Phase,"- (none) | 1-Understand+Design | 2-Test RED | 3-Build GREEN | 4-Refactor+Review | 5-Finalize",Workflow state
  Model,"Haiku 4.5 | Sonnet 4.5 | Opus 4.6 | (external models)",Auto-detected from environment
  Teams,"✓ enabled | ✗ off | ✓ (N active)",CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS env
  MCP,"context7 | playwright | vitest | figma | firebase | slack",Active MCP servers
  Aura,"2-4 word contextual phrase (fun/gen-z energy)",Context of current action
```

---

## Agent Selection (Quick Reference)

```toon
agent_map[10]{context,agent}:
  General/Unknown,pm-operations-orchestrator
  React Native/Flutter,mobile-expert
  Vue/Angular/React/Next.js,ui-expert or web-* specific
  Node.js/Python/Laravel/Go,backend-* or architect
  Database/Architecture,architect
  Security,security-expert
  Testing/QA,qa-automation
  DevOps/CI-CD,devops-cicd
  Godot/Game,game-developer
  UI/Design,ui-expert
```

**Full logic:** `agents/smart-agent-detector.md`

---

## Enforcement

```toon
enforcement[6]{scenario,show_banner}:
  Start of response,YES (always)
  Before each workflow phase,YES (mandatory)
  After tool use,NO (continue without)
  Multi-part response,First part only
  Error response,YES
  Short answer,YES
```

---

## Aura Messages

Short (2-4 words), fun, contextual, unique per response.

| Context | Examples |
|---------|----------|
| Starting | "Let's cook", "Locked in" |
| Coding | "Code go brrrr", "Shipping heat" |
| Debugging | "Bug hunter mode", "On the case" |
| Testing | "Test warrior", "Breaking things" |
| Success | "Nailed it", "GG", "Ez clap" |

---

## Session Start Status (First response only)

```
🔌 MCP: context7 ✓ | figma ✗ | playwright ✓ | vitest ✓ | slack ✗
🧠 Learning: enabled ✓ | Memory: N items loaded
👥 Teams: ✓ enabled | Mode: ready
```

---

## Response Structure

```
Banner (START) → Response Content → Next Step Guidance (END)
```

**See:** `rules/next-step-guidance.md` for end-of-response format.

**Examples:** `docs/BANNER_EXAMPLES.md` for full examples with MCP, teams, and multi-agent variants.

---

