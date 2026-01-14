# DesignSpec Schema

**Version:** 1.0.0

---

## Overview

DesignSpec files define the visual testing requirements for each component/page. They specify viewport, frozen/flexible regions, reference images, and rendering type.

---

## Schema (JSON Schema Draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aura-frog.dev/schemas/design-spec.json",
  "title": "DesignSpec",
  "description": "Visual testing specification for a component or page",
  "type": "object",
  "required": ["id", "viewport", "referenceImage"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "Unique kebab-case identifier for this spec"
    },
    "viewport": {
      "type": "object",
      "required": ["width", "height"],
      "properties": {
        "width": {
          "type": "integer",
          "minimum": 320,
          "maximum": 3840,
          "description": "Viewport width in pixels"
        },
        "height": {
          "type": "integer",
          "minimum": 480,
          "maximum": 2160,
          "description": "Viewport height in pixels"
        },
        "deviceScaleFactor": {
          "type": "number",
          "minimum": 1,
          "maximum": 3,
          "default": 1,
          "description": "Device pixel ratio (1 for standard, 2 for retina)"
        }
      }
    },
    "frozen": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Properties/regions that must match exactly (zero tolerance)"
    },
    "flexible": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Properties/regions that can vary within threshold"
    },
    "tokens": {
      "type": "string",
      "description": "Relative path to design tokens JSON file"
    },
    "referenceImage": {
      "type": "string",
      "description": "Relative path to baseline reference image"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL to render for snapshot"
    },
    "renderType": {
      "type": "string",
      "enum": ["web", "pdf"],
      "default": "web",
      "description": "Rendering engine to use"
    },
    "waitForSelector": {
      "type": "string",
      "description": "CSS selector to wait for before taking snapshot"
    },
    "delay": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10000,
      "default": 0,
      "description": "Additional delay in ms before snapshot"
    },
    "pdfOptions": {
      "type": "object",
      "description": "PDF-specific rendering options",
      "properties": {
        "format": {
          "type": "string",
          "enum": ["A4", "Letter", "Legal", "A3", "A5"],
          "default": "A4"
        },
        "landscape": {
          "type": "boolean",
          "default": false
        },
        "margin": {
          "type": "object",
          "properties": {
            "top": { "type": "string" },
            "right": { "type": "string" },
            "bottom": { "type": "string" },
            "left": { "type": "string" }
          }
        }
      }
    },
    "clip": {
      "type": "object",
      "description": "Clip snapshot to specific region",
      "properties": {
        "x": { "type": "integer" },
        "y": { "type": "integer" },
        "width": { "type": "integer" },
        "height": { "type": "integer" }
      }
    }
  }
}
```

---

## Examples

### Web Component Spec

```json
{
  "id": "header-bar",
  "viewport": {
    "width": 1440,
    "height": 900
  },
  "frozen": [
    "height",
    "divider-thickness",
    "logo-size",
    "font-size"
  ],
  "flexible": [
    "text-content",
    "menu-items-count",
    "user-avatar"
  ],
  "tokens": "../tokens/design-tokens.json",
  "referenceImage": "../design/header.png",
  "url": "http://localhost:3000",
  "renderType": "web",
  "waitForSelector": "[data-testid='header']",
  "clip": {
    "x": 0,
    "y": 0,
    "width": 1440,
    "height": 64
  }
}
```

### PDF Report Spec

```json
{
  "id": "invoice-pdf",
  "viewport": {
    "width": 794,
    "height": 1123
  },
  "frozen": [
    "header-height",
    "logo-position",
    "table-column-widths",
    "font-sizes"
  ],
  "flexible": [
    "line-items-count",
    "total-amount",
    "date"
  ],
  "tokens": "../tokens/design-tokens.json",
  "referenceImage": "../design/invoice.png",
  "url": "http://localhost:3000/invoice/preview",
  "renderType": "pdf",
  "pdfOptions": {
    "format": "A4",
    "margin": {
      "top": "20mm",
      "right": "15mm",
      "bottom": "20mm",
      "left": "15mm"
    }
  }
}
```

### Mobile Viewport Spec

```json
{
  "id": "mobile-nav",
  "viewport": {
    "width": 375,
    "height": 812,
    "deviceScaleFactor": 2
  },
  "frozen": [
    "icon-sizes",
    "bottom-bar-height",
    "touch-target-sizes"
  ],
  "flexible": [
    "badge-count",
    "active-tab"
  ],
  "tokens": "../tokens/design-tokens.json",
  "referenceImage": "../design/mobile-nav.png",
  "url": "http://localhost:3000/mobile",
  "renderType": "web"
}
```

---

## Frozen vs Flexible

### Frozen Properties

Properties in `frozen[]` must match pixel-for-pixel with zero tolerance:

```toon
frozen_examples[6]{property,why}:
  height,Component height must be exact (e.g., 64px header)
  divider-thickness,Border/line widths must match exactly (1px)
  font-size,Text sizes must match design (14px not 13px)
  icon-sizes,Icons must be exact dimensions (24x24)
  logo-size,Brand assets must not be scaled
  spacing-between,Critical spacing relationships
```

### Flexible Properties

Properties in `flexible[]` can vary within the diff threshold:

```toon
flexible_examples[5]{property,why}:
  text-content,Dynamic text that changes
  user-avatar,User-specific content
  timestamps,Time-based data
  item-counts,Variable length lists
  responsive-width,Fluid containers
```

---

## File Location

Spec files live in `.claude/visual/spec/`:

```
.claude/visual/spec/
├── header.spec.json
├── sidebar.spec.json
├── login-form.spec.json
├── invoice-pdf.spec.json
└── mobile-nav.spec.json
```

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
