# Command: project:list

**Category:** Project Management  
**Syntax:** `project:list`

---

## Description

List all configured projects in CCPM with their status and details.

---

## Output

```markdown
# Configured Projects

## 1. your-project ⭐ (Active)
**Type:** mobile-react-native  
**Path:** /Users/.../your-project  
**Status:** ✅ Configured  
**Last Used:** 2025-11-24

**Team:**
- PH: Tech Lead
- MY: Lucas Mok
- ID: Stephen Leung

**Integrations:**
- JIRA: ⏸️  Not configured
- Confluence: ⏸️  Not configured

---

## 2. Backend_API
**Type:** backend-laravel  
**Path:** /Users/.../Backend_API  
**Status:** ✅ Configured  
**Last Used:** 2025-11-20

---

## Add New Project

To add a new project, navigate to its directory and run:
`project:init`
```

---

**Version:** 1.0.0

