# Accessibility (a11y) Rules

**Category:** Code Quality
**Priority:** High
**Version:** 1.0.0
**Applies To:** All UI development

---

## Overview

Ensure applications are usable by everyone, including users with disabilities.

**Full Guide:** See `skills/qa-expert/accessibility-testing.md`

---

## 1. WCAG Compliance Levels

| Level | Required | Target |
|-------|----------|--------|
| A | Minimum | All projects |
| AA | Recommended | Production apps |
| AAA | Enhanced | When specified |

---

## 2. Core Requirements

### Semantic HTML
```html
<!-- ✅ Good -->
<button type="submit">Submit</button>
<nav><ul><li><a href="/">Home</a></li></ul></nav>
<main><article><h1>Title</h1></article></main>

<!-- ❌ Bad -->
<div onclick="submit()">Submit</div>
<div class="nav"><div class="link">Home</div></div>
```

### Keyboard Navigation
```
✅ All interactive elements focusable
✅ Visible focus indicators
✅ Logical tab order
✅ Escape closes modals
✅ Arrow keys in menus
```

### Color Contrast
| Text Size | Minimum Ratio (AA) |
|-----------|-------------------|
| Normal (<18px) | 4.5:1 |
| Large (≥18px bold, ≥24px) | 3:1 |

---

## 3. ARIA Essentials

### Labels
```html
<!-- Icon buttons -->
<button aria-label="Close dialog"><CloseIcon /></button>

<!-- Form fields -->
<input aria-label="Search" type="search" />
<input aria-labelledby="label-id" />
```

### States
```html
<!-- Expandable -->
<button aria-expanded="false" aria-controls="panel">Toggle</button>

<!-- Loading -->
<button aria-busy="true">Loading...</button>

<!-- Invalid -->
<input aria-invalid="true" aria-describedby="error" />
```

### Live Regions
```html
<!-- Polite (waits) -->
<div aria-live="polite">5 new messages</div>

<!-- Assertive (interrupts) -->
<div aria-live="assertive" role="alert">Error occurred</div>
```

---

## 4. Images & Media

```html
<!-- Informative images -->
<img src="chart.png" alt="Sales increased 20% in Q4" />

<!-- Decorative images -->
<img src="border.svg" alt="" role="presentation" />

<!-- Complex images -->
<figure>
  <img src="diagram.png" alt="System architecture" aria-describedby="desc" />
  <figcaption id="desc">Detailed description...</figcaption>
</figure>
```

---

## 5. Forms

```html
<!-- Labels -->
<label for="email">Email</label>
<input id="email" type="email" required />

<!-- Error messages -->
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email format</span>

<!-- Required fields -->
<input aria-required="true" />
```

---

## 6. Mobile Accessibility

| Requirement | Minimum |
|-------------|---------|
| Touch target size | 44×44px |
| Touch target spacing | 8px |
| Text scaling | Support up to 200% |

```tsx
// React Native
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Submit form"
  accessibilityRole="button"
  style={{ minWidth: 44, minHeight: 44 }}
>
```

---

## 7. Testing Checklist

### Automated
- [ ] axe DevTools: 0 violations
- [ ] Lighthouse accessibility: ≥90
- [ ] Jest-axe tests pass

### Manual
- [ ] Tab through entire page
- [ ] Test with screen reader
- [ ] Zoom to 200%
- [ ] Check color contrast
- [ ] Test without mouse

---

## 8. Quick Rules

| Rule | Implementation |
|------|----------------|
| Button ≠ div | Use `<button>` |
| Links have text | Include visible or aria-label |
| Images have alt | Describe or mark decorative |
| Forms have labels | Use `<label>` or aria-label |
| Focus visible | Don't remove outline |
| Color not only | Add icons/text |

---

## Anti-Patterns

```html
<!-- ❌ Bad -->
<div onclick="...">Click me</div>          <!-- Not focusable -->
<input placeholder="Email" />               <!-- Placeholder ≠ label -->
<img src="info.png" />                      <!-- Missing alt -->
<a href="#"><img src="arrow.svg" /></a>     <!-- Empty link text -->
<button style="outline: none">Click</button> <!-- No focus indicator -->
```

---

## Best Practices

### Do's
- Use semantic HTML first
- Test with keyboard only
- Provide text alternatives
- Maintain focus management
- Use ARIA sparingly

### Don'ts
- Disable zoom
- Remove focus outlines
- Rely on color alone
- Use placeholder as label
- Create keyboard traps

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
