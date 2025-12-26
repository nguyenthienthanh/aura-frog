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
---

# Skill: Google Stitch Design

**Category:** Design Skill
**Version:** 1.0.0
**Used By:** ui-designer

---

## Overview

Generate professional UI designs using Google Stitch AI. This skill creates optimized prompts, guides users through the Stitch workflow, and processes exported code for integration.

**Stitch URL:** https://stitch.withgoogle.com

```toon
stitch_info[1]{engine,limits,export}:
  Gemini 2.5 Flash/Pro,350 gen/month (Standard),Figma paste or HTML/CSS
```

---

## When to Use

- User requests UI/UX design with AI assistance
- Need quick prototypes for stakeholder review
- Design review workflow with approval gates
- Frontend code generation from AI designs
- Rapid iteration on visual concepts

---

## Workflow

### Step 1: Gather Requirements

Ask user for:
- **App type:** Dashboard, landing page, mobile app, e-commerce, forms
- **Target audience:** B2B, B2C, developers, general users
- **Theme:** Light, dark, gradient, brand colors
- **Key features:** List of screens/components needed
- **Existing brand:** Logo, colors, typography (if any)

### Step 2: Generate Stitch Prompt

Load template from: `references/prompt-templates.md`

Select template matching app type:
- Dashboard → Use dashboard template
- Landing → Use landing template
- Mobile → Use mobile template
- E-commerce → Use ecommerce template
- Forms → Use forms template

Fill template with gathered requirements.

### Step 3: Create Review Document

Generate review document and save to:
`.claude/workflow/stitch-design-review-{project-name}.md`

Include:
- Design specifications
- Acceptance criteria
- Review checklist
- Export instructions

### Step 4: Guide User

Provide:
1. Optimized Stitch prompt (formatted for copy-paste)
2. Link: https://stitch.withgoogle.com
3. Step-by-step instructions
4. Export guidance (Figma vs HTML/CSS)

### Step 5: Process Exported Code

After user provides exported code:
- Review HTML/CSS structure
- Identify design tokens (colors, spacing, typography)
- Map to project's design system
- Generate component files per project conventions
- Apply project coding standards

---

## Review Document Template

```markdown
# Design Review: {project_name}

## Overview
- **Date:** {date}
- **Type:** {design_type}
- **Tool:** Google Stitch AI
- **Status:** Pending Review

---

## Design Specifications

### Requirements Summary
{requirements_summary}

### Stitch Prompt Used
\`\`\`
{stitch_prompt}
\`\`\`

---

## Review Checklist

### Visual Design
- [ ] Color palette matches brand guidelines
- [ ] Typography is consistent and readable
- [ ] Spacing and alignment are uniform
- [ ] Icons are consistent in style
- [ ] Images/illustrations are appropriate

### UX/Usability
- [ ] Navigation is intuitive
- [ ] CTAs are prominent and clear
- [ ] Information hierarchy is logical
- [ ] Forms are user-friendly
- [ ] Error states are considered

### Technical
- [ ] Layout is responsive
- [ ] Components are reusable
- [ ] Accessibility basics covered
- [ ] Performance considerations

### Brand Alignment
- [ ] Matches existing brand identity
- [ ] Consistent with other products
- [ ] Appropriate for target audience

---

## Export Instructions

### Option 1: Figma Export (Recommended)
1. Click "Paste to Figma" in Stitch
2. Open Figma, paste (Cmd/Ctrl+V)
3. Organize layers and frames
4. Share Figma link for review

### Option 2: Code Export
1. Click "Export Code" in Stitch
2. Copy HTML/CSS
3. Share code for integration

---

## Approval

| Stakeholder | Status | Date | Notes |
|-------------|--------|------|-------|
| Design Lead | Pending | | |
| Product Manager | Pending | | |
| Developer | Pending | | |

---

## Next Steps
1. [ ] Review generated designs in Stitch
2. [ ] Select best variant
3. [ ] Export to Figma/Code
4. [ ] Get stakeholder approval
5. [ ] Integrate into codebase
```

---

## Quick Reference

```toon
workflow[5]{step,action,output}:
  1,Gather requirements,Requirements doc
  2,Generate prompt,Optimized Stitch prompt
  3,Create review doc,.claude/workflow/stitch-design-review-*.md
  4,Guide user,Instructions + link
  5,Process export,Component code
```

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

- `references/prompt-templates.md` - Optimized prompts by design type
- `references/design-checklist.md` - Detailed review checklist
- `references/export-guide.md` - How to export from Stitch

---

**Remember:** Stitch has no API - user must manually paste prompt and export results.

**Version:** 1.0.0
