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
- mobile (Priority: 100) ⭐ Active
- frontend (Priority: 90)
- frontend (Priority: 90)
- frontend (Priority: 90)
- architect (Priority: 90)

### Quality & Design (2 agents)
- tester (Priority: 85) ⭐ Active
- frontend (Priority: 85) ⭐ Active

### Operations (4 agents)
- jira-operations (Priority: 80)
- confluence-operations (Priority: 80)
- slack-operations (Priority: 70)
- linear-operations (Priority: 75)

### Infrastructure (3 agents)
- lead (Priority: 95) ⭐ Active
- scanner (Priority: 100) ⭐ Active
- scanner (Priority: 100)
- scanner (Priority: 95) ⭐ Active

⭐ Active agents: 6
💤 Inactive agents: 8
```

---

## Related Commands

- `/agent:activate` - Manually activate agent
- `/agent:deactivate` - Deactivate agent
- `/agent:info` - Get agent details

---


