---
name: visual-pixel-perfect
description: "Pixel-perfect visual testing with auto-fix loop. Implement → Render → Snapshot → Compare → Fix until pass."
autoInvoke: true
priority: high
triggers:
  - "visual test"
  - "pixel perfect"
  - "design match"
  - "visual regression"
  - "screenshot test"
  - ".claude/visual"
  - "match the design"
  - "looks like the mockup"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, mcp__plugin_aura-frog_playwright
model: sonnet
---

# Visual Pixel-Perfect Testing

**Version:** 1.0.0
**Category:** Quality / Testing
**Priority:** HIGH

---

## Overview

Automated visual regression testing with implement → render → snapshot → compare → fix loop. Ensures pixel-perfect match between implementation and design reference.

**Core Loop:**
```
IMPLEMENT → RENDER → SNAPSHOT → COMPARE → FIX (repeat until pass or max attempts)
```

---

## When to Use

```toon
use_when[6]{trigger,example}:
  Design implementation,Implementing UI from Figma/design spec
  Visual regression,Checking changes don't break existing UI
  Pixel-perfect requirements,Client requires exact design match
  Visual QA,Automated visual quality assurance
  Screenshot testing,Comparing rendered output to reference
  PDF generation,Ensuring PDF output matches expected format
```

---

## When NOT to Use

- Unit testing (use test-writer skill)
- Functional E2E tests (use qa-automation agent)
- Component behavior testing (use Playwright directly)
- Quick prototyping (visual tests slow down iteration)

---

## Prerequisites

### 1. Initialize Visual Testing Structure

```bash
# From project root
./scripts/visual/init-claude-visual.sh

# Or if aura-frog is installed globally
~/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/visual/init-claude-visual.sh .
```

### 2. Required npm Packages (in user project)

```bash
npm install --save-dev puppeteer pngjs pixelmatch
```

### 3. Playwright MCP (bundled with Aura Frog)

Already configured in `.mcp.json` - no setup needed.

---

## Folder Structure

```
.claude/visual/
├── design/           # Reference images (Figma exports)
├── spec/             # DesignSpec JSON files
├── tokens/           # Design tokens
├── snapshots/
│   ├── baseline/     # Approved reference snapshots
│   ├── current/      # Current test run snapshots
│   └── diff/         # Diff images (when comparison fails)
├── tests/            # Visual test files
└── config.json       # Visual testing configuration
```

---

## Workflow

### Phase 1: IMPLEMENT

Claude writes/modifies frontend code using design tokens.

**MUST:**
- Use design tokens from `.claude/visual/tokens/`
- Never hardcode colors, spacing, fonts
- Reference DesignSpec for exact values

**Example:**
```typescript
// CORRECT - using tokens
import tokens from '../.claude/visual/tokens/design-tokens.json';

const Button = styled.button`
  background: ${tokens.color.primary};
  padding: ${tokens.spacing.md};
  font-size: ${tokens.font.size.base};
`;
```

### Phase 2: RENDER

Use Playwright MCP for web, Puppeteer script for PDF.

**Web Rendering:**
```javascript
// Playwright MCP auto-handles this
// Viewport locked, animations disabled
await mcp__plugin_aura-frog_playwright__browser_navigate({ url: "http://localhost:3000" });
await mcp__plugin_aura-frog_playwright__browser_take_screenshot({
  path: ".claude/visual/snapshots/current/component.png"
});
```

**PDF Rendering:**
```bash
./scripts/visual/pdf-render.sh "http://localhost:3000/report" ".claude/visual/snapshots/current/report.pdf"
```

### Phase 3: SNAPSHOT

- Format: PNG
- Scale: 1x (no retina)
- Compression: none
- Location: `.claude/visual/snapshots/current/`

### Phase 4: COMPARE

Run Pixelmatch comparison against baseline.

```bash
./scripts/visual/snapshot-compare.sh \
  .claude/visual/snapshots/baseline/component.png \
  .claude/visual/snapshots/current/component.png \
  .claude/visual/snapshots/diff/component-diff.png \
  0.5  # threshold %
```

**Thresholds:**
| Type | Max Mismatch |
|------|--------------|
| Web  | 0.5%         |
| PDF  | 1.0%         |

### Phase 5: FIX or PASS

**If PASS (diff within threshold):**
- Visual test complete
- Can claim implementation done
- Proceed to next component

**If FAIL (diff exceeds threshold):**
- Analyze diff image
- Fix visual issues ONLY (CSS, layout, spacing)
- Do NOT refactor or change functionality
- Loop back to Phase 1
- Max 5 attempts

---

## Auto-Fix Loop

```
┌─────────────────────────────────────────┐
│  attempt = 0                            │
│  while (!pass && attempt < 5) {         │
│    1. Analyze diff image                │
│    2. Identify visual discrepancies     │
│    3. Fix CSS/layout only               │
│    4. Re-render snapshot                │
│    5. Re-compare                         │
│    attempt++                            │
│  }                                      │
│                                         │
│  if (!pass) → HARD FAIL with report     │
└─────────────────────────────────────────┘
```

**Fix Constraints:**
- Visual fixes only (CSS, styling, layout)
- No functional changes
- No refactoring
- No "improvements"
- Match the design, nothing more

---

## Hard Rules

**Read:** `rules/visual-pixel-accuracy.md`

```toon
hard_rules[4]{rule,meaning}:
  NO_GUESSING,Never approximate - use exact token values
  PIXEL_OVER_STYLE,Visual match > code elegance
  NO_SUCCESS_WITHOUT_PASS,Block completion until diff passes
  FROZEN_IMMUTABLE,Zero tolerance for frozen region diffs
```

---

## DesignSpec Schema

Create spec files in `.claude/visual/spec/`:

```json
{
  "id": "header-bar",
  "viewport": {
    "width": 1440,
    "height": 120
  },
  "frozen": [
    "height",
    "divider-thickness",
    "font-size"
  ],
  "flexible": [
    "text-content",
    "menu-count"
  ],
  "tokens": "../tokens/design-tokens.json",
  "referenceImage": "../design/header.png",
  "url": "http://localhost:3000",
  "renderType": "web"
}
```

**See:** `references/design-spec-schema.md`

---

## Commands

```bash
# Initialize visual testing
./scripts/visual/init-claude-visual.sh

# Run all visual tests
./scripts/visual/visual-test.sh

# Run specific spec
./scripts/visual/visual-test.sh --spec=header

# Update baselines (approve current as reference)
./scripts/visual/visual-test.sh --update-baseline

# CI mode (exit 1 on failure)
./scripts/visual/visual-test.sh --ci

# Web only
./scripts/visual/visual-test.sh --web-only

# PDF only
./scripts/visual/visual-test.sh --pdf-only
```

---

## Integration

### With Workflow Orchestrator

Visual testing integrates into:
- **Phase 5b (GREEN):** After implementation, run visual tests
- **Phase 7 (Verify):** Final verification includes visual regression

### With Test Writer

When UI components detected, test-writer can generate visual test specs alongside unit tests.

### With CI/CD

```yaml
# GitHub Actions
- name: Visual Tests
  run: ./scripts/visual/visual-test.sh --ci

- name: Upload Diff Artifacts
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-diff
    path: .claude/visual/snapshots/diff/
```

**See:** `references/ci-integration.md`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No baseline exists | Run with `--update-baseline` first |
| Puppeteer not found | `npm install puppeteer` |
| pngjs not found | `npm install pngjs pixelmatch` |
| Diff always fails | Check viewport matches spec |
| PDF rendering fails | Install `pdftoppm` or ImageMagick |

---

## References

- `references/design-spec-schema.md` - Full DesignSpec JSON schema
- `references/design-tokens-contract.md` - Design tokens specification
- `references/diff-engine-config.md` - Pixelmatch configuration
- `references/render-configs.md` - Playwright/Puppeteer settings
- `references/ci-integration.md` - CI/CD pipeline setup

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
