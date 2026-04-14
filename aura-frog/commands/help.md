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
## Aura Frog Team Agents - Command Reference

**Workflow Commands:**
- /workflow start - Start new workflow
- /workflow status - Check progress
- /workflow approve - Approve phase
- /workflow reject - Reject phase
- /workflow modify - Modify phase deliverables

**Agent Commands:**
- /agent:list - List agents
- /agent:info - Agent details

**Project Commands:**
- /project init - Initialize project
- /project status - Current project
- /project detect - Detect tech stack

**System Commands:**
- /help - Show help

**Need more help?**
- Read: README.md
- Conversational: Just ask naturally!
```

---

## Aliases

- `/?` (short form)
- `/docs`

---


