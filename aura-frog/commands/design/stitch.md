# Command: design:stitch

**Command:** `design:stitch "<requirements>"`
**Agents:** ui-expert
**Skill:** stitch-design
**Version:** 1.0.0

---

## Purpose

Generate optimized prompts for Google Stitch AI to create UI designs. Creates review documents and guides users through the Stitch workflow.

**Stitch URL:** https://stitch.withgoogle.com

---

## Usage

```bash
# Dashboard design
design:stitch "crypto portfolio dashboard with dark theme"

# Landing page
design:stitch "SaaS landing page with pricing table"

# Mobile app
design:stitch "fitness tracking app for iOS"

# E-commerce
design:stitch "fashion store product page"

# Forms
design:stitch "loan application multi-step form"
```

---

## Workflow

```toon
workflow[5]{step,action,output}:
  1,Gather requirements,Clarify design type and specs
  2,Select template,Match to dashboard/landing/mobile/ecommerce/forms
  3,Generate prompt,Optimized Stitch prompt for copy-paste
  4,Create review doc,.claude/workflow/stitch-design-review-*.md
  5,Guide user,Instructions to use Stitch
```

---

## Output

### 1. Requirements Summary

```markdown
## Requirements
- **App:** CryptoTracker
- **Type:** Dashboard
- **Theme:** Dark mode
- **Key Features:** Portfolio overview, holdings table, charts
```

### 2. Optimized Stitch Prompt

```
Create a dark-themed dashboard for CryptoTracker with:

**Layout:**
- Top navigation bar with logo, search, notifications, user avatar
- Left sidebar: Dashboard, Portfolio, Markets, News, Settings

**Key Sections:**
1. Overview Cards (4 cards): Total Value, Best Performer, Worst Performer, P&L
2. Holdings Table: Coin, Amount, Value, 24h Change, Allocation
3. Area chart: Portfolio value over time with timeframe selector
4. Activity Feed: Recent transactions

**Style:**
- Background: #0D1117
- Cards: #161B22
- Accent: #58A6FF (positive), #F85149 (negative)
- Typography: Inter
- Border radius: 12px
```

### 3. Instructions

```markdown
## Next Steps

1. **Open Stitch:** https://stitch.withgoogle.com
2. **Paste the prompt** above
3. **Click "Generate designs"**
4. **Review variants** and select best one
5. **Export:** "Paste to Figma" or "Export Code"
6. **Share with me** the exported code/Figma link
```

### 4. Review Document

Saved to: `.claude/workflow/stitch-design-review-{project}.md`

Contains:
- Design specifications
- Review checklist
- Approval workflow
- Export instructions

---

## Options

| Option | Description |
|--------|-------------|
| `--type` | Force design type: dashboard, landing, mobile, ecommerce, forms |
| `--theme` | Light or dark theme |
| `--verbose` | Include detailed instructions |

---

## Design Types

```toon
types[5]{type,best_for,template}:
  dashboard,Admin panels; analytics; monitoring,Dashboard Template
  landing,Marketing; product pages; SaaS,Landing Page Template
  mobile,iOS/Android apps; mobile-first,Mobile App Template
  ecommerce,Product pages; cart; checkout,E-commerce Template
  forms,Multi-step wizards; surveys,Forms Template
```

---

## After User Exports

Once user provides exported code/Figma link, use:

```bash
design:stitch-review [code/link]
```

---

**Command:** design:stitch
**Skill:** skills/stitch-design/SKILL.md
**Version:** 1.0.0
