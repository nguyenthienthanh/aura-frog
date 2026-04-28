---
name: stitch-design
description: Generate UI designs using Google Stitch AI with optimized prompts
autoInvoke: false
priority: medium
triggers:
  - "stitch"
  - "AI design"
  - "generate UI"
  - "design with AI"
  - "stitch design"
user-invocable: false
---

# Skill: Google Stitch Design

Generate UI designs using Google Stitch AI (https://stitch.withgoogle.com).

```toon
stitch_info[1]{engine,limits,export}:
  Gemini 2.5 Flash/Pro,350 gen/month (Standard),Figma paste or HTML/CSS
```

---

## Workflow

```toon
workflow[5]{step,action,output}:
  1,Gather requirements,Requirements doc
  2,Generate prompt,Optimized Stitch prompt
  3,Create review doc,.claude/workflow/stitch-design-review-*.md
  4,Guide user,Instructions + link
  5,Process export,Component code
```

### 1. Gather Requirements

Ask: app type (dashboard/landing/mobile/ecommerce/forms), target audience, theme, key features, existing brand.

### 2. Generate Prompt

Load template from `references/prompt-templates.md` matching app type. Fill with gathered requirements.

### 3. Create Review Document

Save to `.claude/workflow/stitch-design-review-{project-name}.md` with specs, acceptance criteria, and checklists for: visual design, UX, technical, brand alignment.

### 4. Guide User

Provide optimized prompt (copy-paste ready), link to Stitch, step-by-step instructions, export guidance (Figma recommended vs HTML/CSS).

### 5. Process Exported Code

Review HTML/CSS, extract design tokens, map to project design system, generate component files per conventions.

---

## Design Types

```toon
design_types[5]{type,use_case,template}:
  dashboard,Admin panels; analytics,references/prompt-templates.md#dashboard
  landing,Marketing; product pages,references/prompt-templates.md#landing
  mobile,iOS/Android screens,references/prompt-templates.md#mobile
  ecommerce,Product; cart; checkout,references/prompt-templates.md#ecommerce
  forms,Multi-step wizards,references/prompt-templates.md#forms
```

---

## Related Files

- `references/prompt-templates.md` - Optimized prompts by type
- `references/design-checklist.md` - Detailed review checklist
- `references/export-guide.md` - Export from Stitch

**Note:** Stitch has no API -- user must manually paste prompt and export results.

---
