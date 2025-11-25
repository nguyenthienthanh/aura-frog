# Skill: Accessibility Testing

**Category:** QA Expert  
**Priority:** High  
**Used By:** qa-automation, ui-designer

---

## Overview

Ensuring applications are accessible to all users, including those with disabilities.

---

## WCAG 2.1 Guidelines

### Level A (Minimum)
- ✅ Text alternatives for non-text content
- ✅ Captions for audio/video
- ✅ Keyboard accessible
- ✅ Sufficient time to read content
- ✅ No seizure-inducing flashes

### Level AA (Recommended)
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Resizable text up to 200%
- ✅ Multiple ways to find pages
- ✅ Visible focus indicators
- ✅ Consistent navigation

### Level AAA (Enhanced)
- ✅ Color contrast ratio ≥ 7:1
- ✅ Sign language for videos
- ✅ Extended audio descriptions

---

## Semantic HTML

```html
<!-- ❌ Bad: Non-semantic -->
<div class="button" onclick="submit()">Submit</div>

<!-- ✅ Good: Semantic -->
<button type="submit">Submit</button>

<!-- ❌ Bad: Divs everywhere -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>

<!-- ✅ Good: Proper structure -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
```

---

## ARIA Attributes

### 1. Roles

```html
<!-- Navigation -->
<nav role="navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Main content -->
<main role="main">
  <article role="article">
    <h1>Article Title</h1>
  </article>
</main>

<!-- Custom widgets -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Confirm Action</h2>
  <button>OK</button>
</div>
```

### 2. States and Properties

```html
<!-- Expandable section -->
<button
  aria-expanded="false"
  aria-controls="content"
  onclick="toggleContent()"
>
  Show More
</button>
<div id="content" hidden>
  Content here
</div>

<!-- Form validation -->
<input
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email
</span>

<!-- Loading state -->
<button aria-busy="true">
  <span aria-live="polite">Loading...</span>
</button>
```

### 3. Labels

```html
<!-- Form labels -->
<label for="username">Username</label>
<input id="username" type="text" />

<!-- Icon buttons -->
<button aria-label="Close dialog">
  <CloseIcon />
</button>

<!-- Image alt text -->
<img src="profile.jpg" alt="John Doe profile picture" />

<!-- Decorative images -->
<img src="decoration.svg" alt="" role="presentation" />
```

---

## Keyboard Navigation

### Focus Management

```typescript
// React example
function Dialog({ isOpen, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement>()
  
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocus.current = document.activeElement as HTMLElement
      
      // Focus dialog
      dialogRef.current?.focus()
      
      // Trap focus
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          // Handle focus trap logic
        }
      }
      
      document.addEventListener('keydown', handleTab)
      return () => document.removeEventListener('keydown', handleTab)
    } else {
      // Restore focus
      previousFocus.current?.focus()
    }
  }, [isOpen])
  
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Dialog content */}
    </div>
  )
}
```

### Keyboard Shortcuts

```typescript
// Global keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Command/Ctrl + K for search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openSearch()
    }
    
    // Escape to close
    if (e.key === 'Escape') {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleKeyPress)
  return () => document.removeEventListener('keydown', handleKeyPress)
}, [])
```

---

## Color Contrast

### Testing Contrast Ratios

```typescript
// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Check if colors meet WCAG AA
function meetsWCAG_AA(fg: string, bg: string, isLargeText: boolean): boolean {
  const ratio = getContrastRatio(fg, bg)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

// Usage
const textColor = '#333333'
const bgColor = '#ffffff'
const passes = meetsWCAG_AA(textColor, bgColor, false) // true (15.9:1)
```

### Color-Blind Friendly Patterns

```typescript
// Don't rely on color alone
// ❌ Bad
<span style={{ color: 'red' }}>Error</span>

// ✅ Good
<span className="error" aria-label="Error">
  <ErrorIcon /> Error
</span>
```

---

## Screen Reader Testing

### Live Regions

```html
<!-- Polite (waits for pause) -->
<div aria-live="polite" aria-atomic="true">
  5 new messages
</div>

<!-- Assertive (interrupts) -->
<div aria-live="assertive" role="alert">
  Error: Form submission failed
</div>

<!-- Status updates -->
<div role="status" aria-live="polite">
  Uploading... 75% complete
</div>
```

### Skip Links

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<nav>...</nav>

<main id="main-content" tabindex="-1">
  <!-- Content -->
</main>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>
```

---

## Automated Testing

### Jest + jest-axe

```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from './Button'

expect.extend(toHaveNoViolations)

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### React Testing Library

```typescript
import { render, screen } from '@testing-library/react'

describe('Accessibility', () => {
  it('has accessible name', () => {
    render(<button aria-label="Close">X</button>)
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
  
  it('is keyboard accessible', () => {
    const handleClick = jest.fn()
    render(<button onClick={handleClick}>Click</button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalled()
  })
})
```

---

## Mobile Accessibility

### Touch Targets

```css
/* Minimum 44x44px touch targets */
button, a, input {
  min-width: 44px;
  min-height: 44px;
}

/* Adequate spacing */
.button-group button {
  margin: 8px;
}
```

### Screen Reader Support

```typescript
// React Native
import { AccessibilityInfo } from 'react-native'

// Check if screen reader is enabled
const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)

useEffect(() => {
  AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled)
  
  const subscription = AccessibilityInfo.addEventListener(
    'screenReaderChanged',
    setScreenReaderEnabled
  )
  
  return () => subscription.remove()
}, [])

// Usage
<View accessible={true} accessibilityLabel="User profile">
  <Image source={avatar} accessibilityRole="image" />
  <Text accessibilityRole="text">{name}</Text>
</View>
```

---

## Testing Checklist

### Manual Testing
- [ ] Navigate entire site with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200% and verify layout
- [ ] Test with high contrast mode
- [ ] Verify color contrast ratios
- [ ] Test with reduced motion
- [ ] Verify all images have alt text
- [ ] Check focus indicators are visible

### Automated Testing
- [ ] Run axe DevTools
- [ ] Run Lighthouse accessibility audit
- [ ] Jest accessibility tests pass
- [ ] WAVE tool shows no errors

---

## Best Practices

### Do's ✅
- ✅ Use semantic HTML
- ✅ Provide text alternatives
- ✅ Ensure keyboard navigation
- ✅ Maintain focus management
- ✅ Use sufficient color contrast
- ✅ Test with assistive technologies
- ✅ Provide skip links
- ✅ Use ARIA when needed

### Don'ts ❌
- ❌ Rely on color alone
- ❌ Use div/span for buttons
- ❌ Forget focus indicators
- ❌ Disable zoom
- ❌ Use placeholder as label
- ❌ Auto-play audio/video
- ❌ Create keyboard traps

---

**Used by QA and UI agents for accessibility compliance.**

