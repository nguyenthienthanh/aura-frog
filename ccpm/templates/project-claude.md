# CCPM Project Instructions

**Project:** [PROJECT_NAME]
**Tech Stack:** [TECH_STACK]
**CCPM Version:** 5.2.0

---

## 🚨 CRITICAL: Load CCPM Plugin Instructions

**⚠️ YOU MUST DO THIS FIRST:**

Read the complete CCPM plugin CLAUDE.md file at:
```
~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/CLAUDE.md
```

**This file contains:**
- ALL core CCPM system instructions
- Specialized agents
- 9-phase workflow execution
- Agent detection logic
- Quality rules and TDD enforcement
- Command execution flow

**Without reading the plugin CLAUDE.md, you will NOT function as CCPM!**

---

## 📂 Project Context Location

After reading the plugin CLAUDE.md, load this project's context from:
```
.claude/project-contexts/[PROJECT_NAME]/
├── project-config.yaml    # Tech stack, team config
├── conventions.md         # Naming, structure, patterns
├── rules.md               # Project-specific rules
└── examples.md            # Code examples
```

---

## 🎯 Execution Order

1. **Read plugin CLAUDE.md** (contains ALL CCPM instructions)
2. **Load project context** (this project's conventions and rules)
3. **Detect appropriate agent** (using smart-agent-detector logic)
4. **Show agent identification banner**
5. **Execute workflow/command** (following CCPM protocols)

---

## 📚 Why This Architecture?

**Project CLAUDE.md (this file):**
- ✅ Loaded first by Claude Code (highest priority)
- ✅ Tells you to read plugin CLAUDE.md
- ✅ Points to project context location

**Plugin CLAUDE.md:**
- ✅ Contains all CCPM system instructions
- ✅ Specialized agents, commands, 9-phase workflow
- ✅ Updated when plugin updates

**Project Context:**
- ✅ Your project-specific conventions
- ✅ Your tech stack and team config
- ✅ Your code examples and patterns

---

**Remember: Always read the plugin CLAUDE.md first!**
