# Agent Identification Banner

**Version:** 1.20.1
**Priority:** CRITICAL - Must be shown at START of EVERY response

---

## Banner Template

**Show this at the START of EVERY response:**

```
⚡ 🐸 AURA FROG v1.20.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
  Phase,"- (none) | 1-Understand | 2-Design | 3-UI | 4-Test Plan | 5a-RED | 5b-GREEN | 5c-REFACTOR | 6-Review | 7-Verify | 8-Document | 9-Share",Workflow state
  Model,"Haiku 4.5 | Sonnet 4.5 | Opus 4.6 | (external models)",skills/model-router/SKILL.md
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

**Version:** 1.20.1
