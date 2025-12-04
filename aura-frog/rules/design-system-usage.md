# Rule: Design System Usage

**Priority:** High
**Enforcement:** Code Generation + Code Review Phase
**Applies To:** All UI code (React, Vue, Angular, React Native, Next.js)

---

## Core Principle

**Use the project's established design system consistently. Never mix design systems or create custom styles that bypass the design system.**

---

## Detection Requirements

Before generating UI code, detect the design system:

1. **Check package.json** for design system dependencies
2. **Check config files** (tailwind.config.js, components.json, etc.)
3. **Analyze existing imports** in the codebase
4. **Ask user** if multiple or no systems detected

---

## What NOT to Do

### 1. Mixing Design Systems

```tsx
// BAD: Mixing MUI and Ant Design
import { Button } from '@mui/material';
import { Input } from 'antd';

<Button variant="contained">
  <Input placeholder="Don't do this" />
</Button>
```

### 2. Bypassing the Design System

```tsx
// BAD: Custom CSS when Tailwind is the design system
<div className="flex items-center" style={{ marginTop: '17px', color: '#333' }}>

// BAD: Creating custom components that ignore the design system
const MyButton = styled.button`
  background: blue;  // Should use theme colors
  padding: 12px;     // Should use spacing scale
`;
```

### 3. Inconsistent Component Usage

```tsx
// BAD: Using native HTML when component library exists
// Project has shadcn/ui but using native button
<button className="bg-blue-500">Click me</button>

// GOOD: Use the design system component
import { Button } from "@/components/ui/button"
<Button>Click me</Button>
```

### 4. Hardcoding Values

```tsx
// BAD: Hardcoded colors/spacing
<div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>

// GOOD: Use theme/design tokens
<div className="p-4 bg-gray-100">  // Tailwind
<Box p={4} bg="gray.100">           // Chakra
<Box sx={{ p: 2, bgcolor: 'grey.100' }}>  // MUI
```

---

## What TO Do

### 1. Detect Before Generating

```markdown
Before writing UI code:
1. Check package.json for: @mui/material, antd, tailwindcss, @chakra-ui/react, etc.
2. Look for config files: tailwind.config.js, components.json
3. Examine existing component imports
4. Load appropriate design system sub-skill
```

### 2. Use Design System Components

```tsx
// Material UI project
import { Button, TextField, Card } from '@mui/material';

// Ant Design project
import { Button, Input, Card } from 'antd';

// shadcn/ui project
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Chakra UI project
import { Button, Input, Card } from '@chakra-ui/react';
```

### 3. Follow Design System Patterns

```tsx
// TAILWIND: Use utility classes
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">

// MUI: Use sx prop or styled
<Button variant="contained" sx={{ borderRadius: 2 }}>

// CHAKRA: Use style props
<Button colorScheme="blue" size="md" borderRadius="lg">

// ANT DESIGN: Use component props
<Button type="primary" size="middle">
```

### 4. Use Theme Tokens

```tsx
// Access theme values correctly per design system

// Tailwind: Use config-defined values
className="text-primary-600 bg-secondary-100"

// MUI: Use theme object
const theme = useTheme();
<Box sx={{ color: theme.palette.primary.main }}>

// Chakra: Use color scheme
<Text color="blue.600">

// Ant Design: Use token
const { token } = theme.useToken();
<div style={{ color: token.colorPrimary }}>
```

---

## Design System Selection Guide

| Project Type | Recommended | Alternative |
|--------------|-------------|-------------|
| Enterprise Web | Ant Design | MUI |
| Modern SaaS | shadcn/ui + Tailwind | Mantine |
| Quick Prototype | Bootstrap | Chakra UI |
| Mobile-First Web | Tailwind | Chakra UI |
| React Native | NativeWind | React Native Paper |
| Headless/Custom | Radix UI | Headless UI |

---

## Multi-System Projects

If a project uses multiple systems (e.g., Tailwind + Radix):

```tsx
// CORRECT: Tailwind for styling, Radix for behavior
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Content className="bg-white rounded-xl p-6 shadow-xl">
  <Dialog.Title className="text-lg font-semibold">
    Title
  </Dialog.Title>
</Dialog.Content>

// CORRECT: shadcn/ui (combines Radix + Tailwind)
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

<Dialog>
  <DialogContent>
    <DialogTitle>Title</DialogTitle>
  </DialogContent>
</Dialog>
```

---

## Detection Script

Run this mental checklist:

```markdown
1. package.json dependencies:
   - @mui/material → Material UI
   - antd → Ant Design
   - tailwindcss → Tailwind CSS
   - @chakra-ui/react → Chakra UI
   - nativewind → NativeWind
   - bootstrap → Bootstrap
   - @mantine/core → Mantine

2. Config files:
   - tailwind.config.js → Tailwind
   - components.json → shadcn/ui
   - nativewind.config.js → NativeWind

3. Import patterns:
   - from '@mui/' → MUI
   - from 'antd' → Ant Design
   - from '@chakra-ui/' → Chakra
   - from '@/components/ui/' → shadcn/ui
```

---

## Code Review Checklist

During Phase 6 (Code Review), verify:

- [ ] Design system correctly detected
- [ ] Only one primary design system used
- [ ] All components from design system (not native HTML)
- [ ] Theme/design tokens used (no hardcoded values)
- [ ] Consistent styling approach throughout
- [ ] No inline styles bypassing the system
- [ ] Responsive utilities from design system used
- [ ] Accessibility features preserved
- [ ] Dark mode considerations (if applicable)

---

## Exceptions

### Exception 1: Transition Period

During migration from one design system to another:

```tsx
// ALLOWED during migration with TODO
// TODO: Migrate to shadcn/ui Button
<button className="old-button">Legacy</button>
```

### Exception 2: Third-Party Integrations

External libraries may have their own styles:

```tsx
// ALLOWED: Third-party chart library
import { LineChart } from 'recharts';
<LineChart ... />  // Uses its own styling
```

### Exception 3: One-off Customizations

For unique, unrepeatable UI elements:

```tsx
// ALLOWED: Truly unique element with comment
{/* Custom hero animation - not part of design system */}
<div className="custom-hero-animation" style={{ ... }}>
```

---

## Training Examples

### Example 1: New Form Component

**User Request:** "Add a login form"

**Correct Approach:**
```markdown
1. Detect design system (check package.json)
2. Found: @mui/material
3. Load material-ui.md skill
4. Generate using MUI components:
```

```tsx
import { TextField, Button, Box, Typography } from '@mui/material';

export function LoginForm() {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" component="h1">Sign In</Typography>
      <TextField label="Email" type="email" fullWidth required />
      <TextField label="Password" type="password" fullWidth required />
      <Button variant="contained" type="submit" fullWidth>
        Sign In
      </Button>
    </Box>
  );
}
```

### Example 2: Card List

**User Request:** "Create a card grid for products"

**Correct Approach:**
```markdown
1. Detect design system (check package.json)
2. Found: tailwindcss + components.json (shadcn/ui)
3. Load shadcn-ui.md skill
4. Generate using shadcn components:
```

```tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-2xl font-bold mt-4">${product.price}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

---

## Enforcement

**Phase 3 (UI Breakdown):** Identify design system
**Phase 5 (Implementation):** Use correct design system
**Phase 6 (Code Review):** Verify consistency

**Linter Warning:**
```
warning: Detected mixed design system usage
  Line 5: import { Button } from '@mui/material'
  Line 6: import { Input } from 'antd'

  Use only one design system per project.
```

---

**Rule:** design-system-usage
**Version:** 1.0.0
**Added:** Aura Frog v1.2
**Priority:** High
**Impact:** UI consistency, maintainability, developer experience
