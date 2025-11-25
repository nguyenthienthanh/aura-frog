# Command: project:switch

**Category:** Project  
**Priority:** Medium  
**Syntax:** `/project:switch <project-id>`

---

## Description

Switch to a different project configuration.

---

## Usage

```bash
/project:switch my-mobile-app
/project:switch my-web-app
```

---

## What It Does

1. Load project configuration from ccpm-config.yaml
2. Update active project context
3. Load project-specific conventions
4. Activate project-specific agents

---

## Output

```markdown
✅ Switched to: YOUR Proj Mobile

**Project Info:**
- Type: mobile-react-native
- Path: /Users/.../my-mobile-app
- Regions: PH, MY, ID, IB, HK
- Status: Active

**Conventions:**
- Branch: feature/<TICKET>-<desc>
- Components: PascalCase.{phone|tablet}.tsx
- Test Coverage: 80%

**Active Agents:**
- mobile-react-native (+25 project bonus)
- qa-automation
- ui-designer
```

---

## Aliases

- `/project` (short form)
- `/switch`

---

## Related Commands

- `/project:list` - List all projects
- `/project:info` - Show current project
- `/project:create` - Add new project

---

**Version:** 1.0.0

