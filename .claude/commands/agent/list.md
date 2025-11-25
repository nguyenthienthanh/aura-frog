# Command: agent:list

**Category:** Agent  
**Priority:** Medium  
**Syntax:** `/agent:list [filter]`

---

## Description

List all available agents or filter by criteria.

---

## Usage

### List All
```bash
/agent:list
```

### Filter by Type
```bash
/agent:list development
/agent:list operations
```

### Filter by Active
```bash
/agent:list active
```

---

## Output

```markdown
## Available Agents (14 total)

### Development (5 agents)
- mobile-react-native (Priority: 100) ⭐ Active
- web-vuejs (Priority: 90)
- web-reactjs (Priority: 90)
- web-nextjs (Priority: 90)
- backend-laravel (Priority: 90)

### Quality & Design (2 agents)
- qa-automation (Priority: 85) ⭐ Active
- ui-designer (Priority: 85) ⭐ Active

### Operations (4 agents)
- jira-operations (Priority: 80)
- confluence-operations (Priority: 80)
- slack-operations (Priority: 70)
- linear-operations (Priority: 75)

### Infrastructure (3 agents)
- pm-operations-orchestrator (Priority: 95) ⭐ Active
- project-detector (Priority: 100) ⭐ Active
- project-config-loader (Priority: 100)
- project-context-manager (Priority: 95) ⭐ Active

⭐ Active agents: 6
💤 Inactive agents: 8
```

---

## Related Commands

- `/agent:activate` - Manually activate agent
- `/agent:deactivate` - Deactivate agent
- `/agent:info` - Get agent details

---

**Version:** 1.0.0

