# Command: design:stitch-review

**Command:** `design:stitch-review [code/figma-link]`
**Agents:** ui-designer
**Skill:** stitch-design
**Version:** 1.0.0

---

## Purpose

Process exported Stitch designs (HTML/CSS or Figma), review against checklist, and integrate into project codebase.

---

## Usage

```bash
# Review Figma export
design:stitch-review https://figma.com/file/abc123

# Review code export (paste code after command)
design:stitch-review

# Review with specific design system target
design:stitch-review --target mui

# Review with project context
design:stitch-review --project "CryptoTracker"
```

---

## Workflow

```toon
workflow[6]{step,action,output}:
  1,Receive export,Get HTML/CSS or Figma link
  2,Analyze structure,Identify components and tokens
  3,Run checklist,Score against design checklist
  4,Map to design system,Match to MUI/Tailwind/etc.
  5,Generate components,Create framework-specific code
  6,Update review doc,Add integration notes
```

---

## Input Formats

### HTML/CSS Code

```html
<!-- Paste Stitch-exported HTML -->
<div class="card">
  <img src="..." class="card-image">
  <h3 class="card-title">Product</h3>
  <p class="card-price">$99</p>
  <button class="btn-primary">Add to Cart</button>
</div>
```

```css
/* Paste Stitch-exported CSS */
.card { padding: 16px; border-radius: 12px; }
.card-title { font-size: 18px; font-weight: 600; }
.btn-primary { background: #6366F1; color: white; }
```

### Figma Link

```
https://figma.com/file/abc123/Stitch-Export?node-id=0-1
```

---

## Output

### 1. Design Analysis

```markdown
## Design Analysis

### Extracted Tokens
- **Colors:** #6366F1 (primary), #EC4899 (secondary), #F9FAFB (bg)
- **Typography:** Inter, 14-24px, 500-700 weight
- **Spacing:** 8px, 16px, 24px, 32px
- **Border Radius:** 8px, 12px, 16px
- **Shadows:** 0 4px 6px rgba(0,0,0,0.1)

### Components Identified
1. Card - product display
2. Button - primary CTA
3. Image - product image
4. Typography - title, price
```

### 2. Checklist Score

```markdown
## Checklist Score: 24/30

| Category | Score | Notes |
|----------|-------|-------|
| Visual Design | 4/5 | Good spacing, needs contrast fix |
| UX/Usability | 5/5 | Clear hierarchy |
| Accessibility | 3/5 | Missing focus states |
| Responsive | 4/5 | Works on mobile |
| Technical | 4/5 | Easy to implement |
| Brand | 4/5 | Matches guidelines |
```

### 3. Framework Integration

```tsx
// Generated React component (MUI)
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

export function ProductCard({ title, price, image, onAddToCart }: ProductCardProps) {
  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardMedia component="img" image={image} alt={title} />
      <CardContent>
        <Typography variant="h6" fontWeight={600}>{title}</Typography>
        <Typography variant="body1" color="primary">${price}</Typography>
      </CardContent>
      <Button variant="contained" onClick={onAddToCart}>
        Add to Cart
      </Button>
    </Card>
  );
}
```

### 4. Updated Review Document

Updates `.claude/workflow/stitch-design-review-{project}.md` with:
- Integration status
- Components generated
- Remaining tasks

---

## Options

| Option | Description |
|--------|-------------|
| `--target` | Target design system: mui, tailwind, shadcn, chakra, nativewind |
| `--project` | Project name for review doc lookup |
| `--components-only` | Only generate components, skip review |
| `--tokens-only` | Only extract design tokens |

---

## Design System Mapping

```toon
mapping[5]{stitch_style,mui,tailwind}:
  padding: 16px,p: 2,p-4
  border-radius: 12px,borderRadius: 3,rounded-xl
  font-size: 18px,variant="h6",text-lg
  background: #6366F1,color="primary",bg-indigo-500
  box-shadow,elevation={2},shadow-md
```

---

## Integration Checklist

After running this command:

- [ ] Components generated in project structure
- [ ] Design tokens added to theme
- [ ] Responsive behavior verified
- [ ] Accessibility attributes added
- [ ] Tests created (if TDD enabled)
- [ ] Review document updated

---

**Command:** design:stitch-review
**Skill:** skills/stitch-design/SKILL.md
**Version:** 1.0.0
