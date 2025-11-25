# Command: help

**Category:** System  
**Priority:** Low  
**Syntax:** `/help [command|topic]`

---

## Description

Display help information for commands or topics.

---

## Usage

### General Help
```bash
/help
```

### Command Help
```bash
/help workflow:start
/help agent:list
```

### Topic Help
```bash
/help workflows
/help agents
/help approval-gates
```

---

## Output

### General Help
```markdown
## CCPM Team Agents - Command Reference

**Workflow Commands:**
- /workflow:start - Start new workflow
- /workflow:status - Check progress
- /workflow:approve - Approve phase
- /workflow:reject - Reject phase

**Agent Commands:**
- /agent:list - List agents
- /agent:activate - Activate agent
- /agent:info - Agent details

**Project Commands:**
- /project:switch - Switch project
- /project:list - List projects
- /project:info - Current project

**System Commands:**
- /help - Show help
- /version - Show version
- /config - Show config

**Need more help?**
- Read: .claude/README.md
- Conversational: Just ask naturally!
```

---

## Aliases

- `/?` (short form)
- `/docs`

---

**Version:** 1.0.0

