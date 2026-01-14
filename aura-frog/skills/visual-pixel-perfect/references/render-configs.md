# Render Configurations

**Version:** 1.0.0

---

## Overview

Visual testing uses two render engines:
- **Playwright MCP** - Web rendering (bundled)
- **Puppeteer** - PDF rendering (via script)

---

## Web Rendering (Playwright)

### MCP Usage

Playwright MCP is bundled with Aura Frog. Use directly:

```javascript
// Navigate to URL
await mcp__plugin_aura-frog_playwright__browser_navigate({
  url: "http://localhost:3000"
});

// Resize viewport
await mcp__plugin_aura-frog_playwright__browser_resize({
  width: 1440,
  height: 900
});

// Take screenshot
await mcp__plugin_aura-frog_playwright__browser_take_screenshot({
  path: ".claude/visual/snapshots/current/component.png"
});
```

### Disable Animations

Inject CSS to disable animations before snapshot:

```javascript
await mcp__plugin_aura-frog_playwright__browser_evaluate({
  expression: `
    const style = document.createElement('style');
    style.textContent = \`
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    \`;
    document.head.appendChild(style);
  `
});
```

### Wait for Content

```javascript
// Wait for specific selector
await mcp__plugin_aura-frog_playwright__browser_wait_for({
  selector: "[data-testid='content-loaded']",
  timeout: 10000
});

// Or wait for network idle
await mcp__plugin_aura-frog_playwright__browser_navigate({
  url: "http://localhost:3000",
  waitUntil: "networkidle"
});
```

---

## PDF Rendering (Puppeteer)

### Script Usage

```bash
./scripts/visual/pdf-render.sh <url> <output-path> [config-path]

# Example
./scripts/visual/pdf-render.sh \
  "http://localhost:3000/report" \
  ".claude/visual/snapshots/current/report.pdf" \
  ".claude/visual/config.json"
```

### Configuration

In `.claude/visual/config.json`:

```json
{
  "render": {
    "pdf": {
      "format": "A4",
      "printBackground": true,
      "margin": {
        "top": "24mm",
        "right": "24mm",
        "bottom": "24mm",
        "left": "24mm"
      }
    }
  }
}
```

### PDF Options

| Option | Default | Description |
|--------|---------|-------------|
| format | A4 | Paper format (A4, Letter, Legal, etc.) |
| landscape | false | Landscape orientation |
| printBackground | true | Include background colors/images |
| margin | 24mm all | Page margins |
| scale | 1 | Scale factor (0.1 to 2) |
| displayHeaderFooter | false | Show header/footer |
| preferCSSPageSize | false | Use CSS @page size |

---

## Common Viewport Sizes

```toon
viewports[8]{name,width,height,use_case}:
  Desktop HD,1920,1080,Full HD desktop
  Desktop,1440,900,Standard desktop
  Laptop,1366,768,Common laptop
  Tablet Landscape,1024,768,iPad landscape
  Tablet Portrait,768,1024,iPad portrait
  Mobile Large,414,896,iPhone 11 Pro Max
  Mobile,375,812,iPhone X/11 Pro
  Mobile Small,320,568,iPhone SE
```

### Common PDF Sizes

```toon
pdf_sizes[5]{format,width_mm,height_mm,pixels_72dpi}:
  A4,210,297,595x842
  Letter,216,279,612x792
  Legal,216,356,612x1008
  A3,297,420,842x1191
  A5,148,210,420x595
```

---

## Snapshot Settings

```json
{
  "snapshot": {
    "format": "png",
    "scale": 1,
    "compression": "none",
    "fullPage": false,
    "omitBackground": false
  }
}
```

| Setting | Value | Reason |
|---------|-------|--------|
| format | png | Lossless for accurate comparison |
| scale | 1 | Consistent pixel density |
| compression | none | Prevent compression artifacts |
| fullPage | false | Capture viewport only (unless spec says otherwise) |
| omitBackground | false | Include background for full comparison |

---

## Environment Requirements

### Web Rendering
- Node.js 18+
- Playwright installed via MCP (automatic)
- Local dev server running (e.g., `npm run dev`)

### PDF Rendering
- Node.js 18+
- Puppeteer (`npm install puppeteer`)
- For PNG preview: `pdftoppm` or ImageMagick

---

## Troubleshooting

### Fonts Not Loading

**Problem:** Different fonts in snapshot vs design.

**Solution:** Wait for fonts to load:
```javascript
await mcp__plugin_aura-frog_playwright__browser_evaluate({
  expression: "document.fonts.ready"
});
```

### Images Not Loaded

**Problem:** Blank image placeholders.

**Solution:** Wait for images:
```javascript
await mcp__plugin_aura-frog_playwright__browser_evaluate({
  expression: `
    Promise.all(
      Array.from(document.images)
        .filter(img => !img.complete)
        .map(img => new Promise(resolve => {
          img.onload = img.onerror = resolve;
        }))
    );
  `
});
```

### PDF Page Breaks Wrong

**Problem:** Content split incorrectly.

**Solution:** Use CSS page-break rules:
```css
.section {
  page-break-inside: avoid;
}
.page-break {
  page-break-after: always;
}
```

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
