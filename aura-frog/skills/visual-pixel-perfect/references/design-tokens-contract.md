# Design Tokens Contract

**Version:** 1.0.0

---

## Overview

Design tokens are the single source of truth for visual values. Claude MUST use tokens from `.claude/visual/tokens/` and NEVER hardcode values.

---

## Token Structure

```json
{
  "font": {
    "family": {},
    "size": {},
    "weight": {},
    "lineHeight": {}
  },
  "color": {
    "primary": "",
    "secondary": "",
    "success": "",
    "warning": "",
    "error": "",
    "background": {},
    "text": {},
    "border": {}
  },
  "spacing": {},
  "divider": {},
  "borderRadius": {},
  "shadow": {}
}
```

---

## Full Example

```json
{
  "$schema": "https://aura-frog.dev/schemas/design-tokens.json",
  "font": {
    "family": {
      "primary": "Inter",
      "secondary": "Source Code Pro",
      "display": "Poppins"
    },
    "size": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "weight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "none": 1,
      "tight": 1.25,
      "snug": 1.375,
      "normal": 1.5,
      "relaxed": 1.625,
      "loose": 2
    }
  },
  "color": {
    "primary": "#3B82F6",
    "primaryHover": "#2563EB",
    "primaryActive": "#1D4ED8",
    "secondary": "#6366F1",
    "secondaryHover": "#4F46E5",
    "success": "#10B981",
    "successLight": "#D1FAE5",
    "warning": "#F59E0B",
    "warningLight": "#FEF3C7",
    "error": "#EF4444",
    "errorLight": "#FEE2E2",
    "background": {
      "primary": "#FFFFFF",
      "secondary": "#F9FAFB",
      "tertiary": "#F3F4F6",
      "dark": "#111827"
    },
    "text": {
      "primary": "#111827",
      "secondary": "#4B5563",
      "tertiary": "#6B7280",
      "muted": "#9CA3AF",
      "inverse": "#FFFFFF"
    },
    "border": {
      "light": "#F3F4F6",
      "default": "#E5E7EB",
      "dark": "#D1D5DB"
    }
  },
  "spacing": {
    "0": "0",
    "px": "1px",
    "0.5": "2px",
    "1": "4px",
    "1.5": "6px",
    "2": "8px",
    "2.5": "10px",
    "3": "12px",
    "3.5": "14px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "7": "28px",
    "8": "32px",
    "9": "36px",
    "10": "40px",
    "12": "48px",
    "14": "56px",
    "16": "64px",
    "20": "80px",
    "24": "96px"
  },
  "divider": {
    "color": "#E5E7EB",
    "width": "1px",
    "style": "solid"
  },
  "borderRadius": {
    "none": "0",
    "sm": "2px",
    "default": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "2xl": "16px",
    "3xl": "24px",
    "full": "9999px"
  },
  "shadow": {
    "xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "sm": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "default": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    "none": "none"
  }
}
```

---

## Usage in Code

### React/Styled Components

```typescript
import tokens from '../.claude/visual/tokens/design-tokens.json';

const Button = styled.button`
  background-color: ${tokens.color.primary};
  color: ${tokens.color.text.inverse};
  padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
  font-size: ${tokens.font.size.base};
  font-weight: ${tokens.font.weight.medium};
  border-radius: ${tokens.borderRadius.md};
  box-shadow: ${tokens.shadow.sm};

  &:hover {
    background-color: ${tokens.color.primaryHover};
  }
`;
```

### CSS Variables

```css
:root {
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --font-size-base: 16px;
  --spacing-4: 16px;
  --border-radius-md: 6px;
}

.button {
  background-color: var(--color-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

### Tailwind Config

```javascript
// tailwind.config.js
const tokens = require('./.claude/visual/tokens/design-tokens.json');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: tokens.color.primary,
        secondary: tokens.color.secondary,
      },
      fontSize: tokens.font.size,
      spacing: tokens.spacing,
    },
  },
};
```

---

## Rules

```toon
token_rules[5]{rule,enforcement}:
  ALWAYS use tokens,BLOCKING - code review fails without tokens
  NEVER hardcode hex colors,BLOCKING - immediate rejection
  NEVER use magic numbers for spacing,WARNING - must justify
  Extend tokens if needed,Add to tokens file first
  Document custom values,Comment why token doesn't exist
```

---

## Extracting from Figma

If you have Figma access, export design tokens:

1. Use Figma Tokens plugin
2. Export as JSON
3. Map to `.claude/visual/tokens/design-tokens.json`

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
