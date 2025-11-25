# Command: skill:create

**Category:** Skill Management  
**Syntax:** `skill:create <skill-name> <category>`

---

## Description

Create a new reusable skill for agents.

---

## Usage

```
skill:create authentication-patterns dev-expert
skill:create database-optimization qa-expert
```

---

## Process

1. Prompts for skill details
2. Generates skill template
3. Saves to `.claude/skills/<category>/<skill-name>.md`

---

## Template

```markdown
# Skill: [Skill Name]

**Category:** [Category]  
**Priority:** [High/Medium/Low]  
**Used By:** [Agents]

---

## Overview

[Description of the skill]

---

## Core Capabilities

### 1. [Capability Name]

[Details]

---

## Best Practices

### Do's ✅
- ✅ [Practice 1]

### Don'ts ❌
- ❌ [Avoid 1]

---

**Used by [agent] for [purpose].**
```

---

**Version:** 1.0.0

