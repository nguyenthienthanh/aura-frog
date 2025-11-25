# Image Analysis Guide

**Visual analysis of screenshots, Figma exports, and design mockups**

---

## 🎯 Overview

Image analysis enables agents to:
- Extract design tokens from screenshots
- Identify UI components visually
- Analyze layout patterns
- Detect colors, fonts, spacing
- Generate implementation specs

---

## 📸 When to Use

### Phase 3: Design Review
```
User provides:
- Figma screenshots
- Design mockups  
- Competitor app screenshots
- Existing UI references

Agent analyzes:
- Visual hierarchy
- Component structure
- Design system patterns
- Spacing & alignment
```

### Use Cases
1. **No Figma access** - Analyze screenshots instead
2. **Quick design review** - Paste image, get analysis
3. **Competitor analysis** - Learn from other apps
4. **Existing UI** - Analyze current implementation

---

## 🚀 Usage

### Basic Analysis
```
User: "Analyze this login screen design"
[Pastes screenshot]

Agent extracts:
1. Components identified:
   - Logo (centered, top)
   - Email input (rounded corners, 12px radius)
   - Password input (with eye icon)
   - Login button (primary blue, 48px height)
   - Forgot password link
   - Social login buttons

2. Colors detected:
   - Primary: #0066FF
   - Text: #1A1A1A
   - Border: #E5E5E5
   - Background: #FFFFFF

3. Typography:
   - Title: 24px, Bold
   - Body: 16px, Regular
   - Caption: 14px, Regular
   - Font family: Inter (detected)

4. Spacing:
   - Vertical gaps: 16px, 24px
   - Horizontal padding: 20px
   - Button height: 48px
   - Input height: 56px
```

### Component Breakdown
```
Agent generates:
```typescript
// From visual analysis
const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Logo size={80} style={styles.logo} />
      
      <TextInput
        placeholder="Email"
        style={styles.input}
      />
      
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      
      <Button
        title="Login"
        style={styles.button}
      />
      
      <Link text="Forgot Password?" />
      
      <SocialButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
  },
  button: {
    height: 48,
    backgroundColor: '#0066FF',
    borderRadius: 12,
  },
});
```
```

### Design Token Extraction
```
From screenshot → Generate design tokens:

```typescript
export const colors = {
  primary: '#0066FF',
  secondary: '#6B6B6B',
  background: '#FFFFFF',
  border: '#E5E5E5',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B6B6B',
    disabled: '#9B9B9B',
  },
};

export const typography = {
  h1: { size: 24, weight: 'bold' },
  body: { size: 16, weight: 'regular' },
  caption: { size: 14, weight: 'regular' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};
```
```

---

## 🎨 Analysis Capabilities

### Visual Elements
```yaml
Can detect:
  Colors:
    - Hex values (#RRGGBB)
    - RGB values
    - Dominant colors
    - Color palette (up to 10 colors)
  
  Typography:
    - Font sizes (approximate)
    - Font weights (bold, regular, light)
    - Line heights
    - Text alignment
  
  Layout:
    - Component positions
    - Spacing patterns
    - Alignment (center, left, right)
    - Grid system (if visible)
  
  Components:
    - Buttons (primary, secondary, text)
    - Inputs (text, search, dropdown)
    - Cards
    - Lists
    - Navigation bars
    - Tabs
    - Modals
```

### Limitations
```yaml
Cannot detect:
  - Exact font family (only approximate)
  - Animations or interactions
  - State changes (hover, pressed)
  - Hidden elements
  - Exact pixel-perfect measurements
  
Requires manual specification:
  - Interactive behaviors
  - Error states
  - Loading states
  - Empty states
```

---

## 📊 Workflow Integration

### Phase 3: Design Review
```
1. User provides Figma screenshot
   ↓
2. Agent analyzes visually
   ↓
3. Extract design tokens
   ↓
4. Identify components
   ↓
5. Generate component breakdown
   ↓
6. Create implementation specs
   ↓
7. User approves Phase 3
```

### Example Output
```markdown
## Component Breakdown (from screenshot)

### Screen: Login

**Components Identified:**
1. Logo (80x80px, centered)
2. EmailInput (height: 56px, radius: 12px)
3. PasswordInput (with eye icon)
4. PrimaryButton (height: 48px, full width)
5. TextLink (14px, underlined)
6. SocialButtons (3 buttons, horizontal)

**Layout:**
- Container padding: 20px
- Vertical spacing: 16px between elements
- Logo margin bottom: 24px

**Design Tokens:**
[Generated from visual analysis]

**Implementation Notes:**
- Use controlled components for inputs
- Validate email format client-side
- Show/hide password toggle
- Disable button while submitting
```

---

## 💡 Best Practices

### Provide Clear Screenshots
```yaml
Good screenshots:
  - High resolution (at least 1080px width)
  - Full screen visible
  - No overlapping elements
  - Good lighting/contrast
  - Clean, unobstructed view

Bad screenshots:
  - Low resolution (< 720px)
  - Partial view
  - Overlapping popups
  - Poor contrast
  - Blurry or pixelated
```

### Multiple States
```
Provide screenshots for:
1. Default state
2. Focused state (input active)
3. Error state (validation fail)
4. Success state
5. Loading state
6. Empty state
```

### Annotations
```
Add annotations if needed:
- "This is 16px font size"
- "Primary button color"
- "24px spacing here"
- "Rounded corners 12px"
```

---

## 🔄 Comparison: Figma MCP vs Screenshot Analysis

| Feature | Figma MCP | Screenshot Analysis |
|---------|-----------|---------------------|
| **Access** | Requires token | No setup needed |
| **Accuracy** | 100% accurate | ~80-90% accurate |
| **Colors** | Exact hex values | Approximate values |
| **Fonts** | Exact font family | Approximate only |
| **Components** | Structured data | Visual recognition |
| **Measurements** | Precise pixels | Approximate pixels |
| **Speed** | API call (~2s) | Instant analysis |
| **Offline** | Requires internet | Works offline |

**Use Figma MCP when:**
- Have Figma file access
- Need pixel-perfect accuracy
- Working with design system

**Use Screenshot Analysis when:**
- No Figma access
- Quick analysis needed
- Competitor research
- Legacy designs

---

## 🆘 Troubleshooting

### "Cannot detect colors accurately"
```
Solution:
- Provide higher resolution screenshot
- Ensure good contrast
- Manually specify if needed
```

### "Components not recognized"
```
Solution:
- Provide cleaner screenshot
- Add annotations
- Describe components manually
```

### "Font size detection off"
```
Solution:
- Screenshots may have different DPI
- Manually verify and adjust
- Use relative sizes (em/rem)
```

---

## 📝 Example Workflow

```
User: "Analyze this checkout screen"
[Pastes screenshot of checkout UI]

Agent:
1. Visual Analysis:
   ✅ Detected 12 components
   ✅ Extracted 8 colors
   ✅ Identified layout pattern
   ✅ Measured spacing (approximate)

2. Components:
   - CartSummary card
   - ItemList (3 items)
   - PriceBreakdown
   - PaymentMethodSelector
   - CheckoutButton

3. Design Tokens:
   ```typescript
   colors: { primary: '#FF6B35', ... }
   spacing: { base: 16, lg: 24, ... }
   ```

4. Implementation Plan:
   - Create CartSummary component
   - Use FlatList for items
   - Calculate totals dynamically
   - Validate payment selection
   - Show confirmation modal

User: "approve"

Agent: ✅ Proceeding to Phase 4: Test Planning
```

---

## 🎯 Tips for Better Analysis

1. **Multiple screenshots** - Different states, different screens
2. **Zoom in** - Show details for complex components
3. **Annotate** - Add notes for unclear elements
4. **Reference existing** - Compare with similar designs
5. **Iterate** - Refine analysis based on feedback

---

**Capability:** Visual design analysis from screenshots  
**Accuracy:** 80-90% (depends on image quality)  
**Speed:** Instant (no API calls needed)  
**Best for:** Quick design review, no Figma access, competitor analysis

