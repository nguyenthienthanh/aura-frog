# Skill: Responsive Design Patterns

**Category:** Design Expert  
**Priority:** High  
**Used By:** ui-designer

---

## Overview

Creating adaptive layouts that work seamlessly across all devices and screen sizes.

---

## Breakpoint Strategy

### Standard Breakpoints

```css
/* Mobile First Approach */

/* Extra Small (Mobile Portrait) */
/* Default styles - no media query needed */
.container {
  padding: 16px;
}

/* Small (Mobile Landscape) */
@media (min-width: 576px) {
  .container {
    padding: 20px;
  }
}

/* Medium (Tablet Portrait) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Large (Tablet Landscape / Desktop) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 960px;
  }
}

/* Extra Large (Desktop) */
@media (min-width: 1280px) {
  .container {
    padding: 40px;
    max-width: 1200px;
  }
}
```

### React Native Breakpoints

```typescript
import { Dimensions, Platform } from 'react-native'

export const BREAKPOINTS = {
  PHONE_SMALL: 320,
  PHONE_MEDIUM: 375,
  PHONE_LARGE: 414,
  TABLET_SMALL: 768,
  TABLET_LARGE: 1024
}

export function useDeviceType() {
  const { width } = Dimensions.get('window')
  
  return {
    isPhone: width < BREAKPOINTS.TABLET_SMALL,
    isTablet: width >= BREAKPOINTS.TABLET_SMALL,
    isSmallPhone: width < BREAKPOINTS.PHONE_MEDIUM,
    isLargeTablet: width >= BREAKPOINTS.TABLET_LARGE
  }
}

// Usage
function MyComponent() {
  const { isPhone, isTablet } = useDeviceType()
  
  return (
    <View style={isPhone ? styles.phone : styles.tablet}>
      {/* Content */}
    </View>
  )
}
```

---

## Fluid Typography

### CSS Clamp

```css
/* Responsive font sizes without media queries */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  /* Min: 32px, Preferred: 5vw, Max: 64px */
}

h2 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}

p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
}
```

### Tailwind Responsive Typography

```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base md:text-lg">
  Responsive paragraph text
</p>
```

---

## Flexible Layouts

### CSS Grid

```css
/* Responsive grid - auto-fit columns */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

/* Responsive layout areas */
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
  gap: 16px;
}

@media (min-width: 768px) {
  .layout {
    grid-template-areas:
      "header header"
      "main sidebar"
      "footer footer";
    grid-template-columns: 2fr 1fr;
  }
}
```

### Flexbox

```css
/* Responsive flex direction */
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
  }
}

/* Flexible items */
.item {
  flex: 1 1 100%; /* Mobile: Full width */
}

@media (min-width: 768px) {
  .item {
    flex: 1 1 calc(50% - 16px); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .item {
    flex: 1 1 calc(33.333% - 16px); /* Desktop: 3 columns */
  }
}
```

---

## Container Queries

```css
/* Modern responsive design */
.card-container {
  container-type: inline-size;
}

.card {
  padding: 16px;
}

/* Changes based on container width, not viewport */
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
  }
}

@container (min-width: 600px) {
  .card {
    padding: 24px;
  }
}
```

---

## Responsive Images

### Picture Element

```html
<picture>
  <!-- WebP for modern browsers -->
  <source
    srcset="
      image-small.webp 400w,
      image-medium.webp 800w,
      image-large.webp 1200w
    "
    type="image/webp"
  />
  
  <!-- JPEG fallback -->
  <source
    srcset="
      image-small.jpg 400w,
      image-medium.jpg 800w,
      image-large.jpg 1200w
    "
    type="image/jpeg"
  />
  
  <!-- Fallback img -->
  <img
    src="image-medium.jpg"
    alt="Description"
    loading="lazy"
    width="800"
    height="600"
  />
</picture>
```

### React Native Responsive Images

```typescript
import { Image, Dimensions } from 'react-native'

function ResponsiveImage({ source }: Props) {
  const { width } = Dimensions.get('window')
  
  // Select appropriate image size
  const imageSource = width < 400
    ? require('./image-small.png')
    : width < 800
    ? require('./image-medium.png')
    : require('./image-large.png')
  
  return (
    <Image
      source={imageSource}
      style={{ width: '100%', aspectRatio: 16/9 }}
      resizeMode="cover"
    />
  )
}
```

---

## Adaptive Components

### React Responsive Component

```typescript
interface ButtonProps {
  label: string
  icon?: React.ReactNode
}

function ResponsiveButton({ label, icon }: ButtonProps) {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 })
  
  if (isSmallScreen) {
    // Show icon only on small screens
    return (
      <button className="btn-icon" aria-label={label}>
        {icon}
      </button>
    )
  }
  
  // Show icon + label on larger screens
  return (
    <button className="btn-full">
      {icon}
      <span>{label}</span>
    </button>
  )
}
```

### Vue Responsive Component

```vue
<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(min-width: 1024px)')
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
const isMobile = useMediaQuery('(max-width: 767px)')
</script>

<template>
  <div>
    <DesktopLayout v-if="isDesktop" />
    <TabletLayout v-else-if="isTablet" />
    <MobileLayout v-else />
  </div>
</template>
```

---

## Touch-Friendly Design

### Touch Target Sizes

```css
/* Minimum 44x44px for touch targets */
button,
a,
input[type="checkbox"],
input[type="radio"] {
  min-width: 44px;
  min-height: 44px;
  
  /* Visual padding for larger touch area */
  padding: 12px 24px;
}

/* Increase spacing on mobile */
@media (max-width: 768px) {
  .button-group {
    gap: 16px; /* Adequate spacing between targets */
  }
}
```

### Hover vs Touch

```css
/* Hover effects only on devices that support it */
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
}

/* Touch feedback for mobile */
.card:active {
  opacity: 0.8;
}
```

---

## Viewport Units

```css
/* Full viewport height sections */
.hero {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height (accounts for mobile browser UI) */
}

/* Viewport-based typography */
.title {
  font-size: 5vw;
  font-size: clamp(2rem, 5vw, 4rem); /* Better: with min/max */
}

/* Responsive spacing */
.section {
  padding: 5vh 5vw; /* Scales with viewport */
}
```

---

## Print Styles

```css
@media print {
  /* Hide non-essential elements */
  .no-print,
  nav,
  footer,
  .sidebar {
    display: none;
  }
  
  /* Optimize for print */
  body {
    font-size: 12pt;
    line-height: 1.5;
    color: black;
    background: white;
  }
  
  /* Page breaks */
  h1, h2, h3 {
    page-break-after: avoid;
  }
  
  /* Show URLs in print */
  a[href]:after {
    content: " (" attr(href) ")";
  }
}
```

---

## Dark Mode

```css
/* Respect system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-color: #ffffff;
    --text-color: #000000;
  }
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

---

## Testing Responsive Design

### Testing Checklist
- [ ] Test all breakpoints (320px, 375px, 768px, 1024px, 1440px)
- [ ] Test orientation changes (portrait/landscape)
- [ ] Test on real devices (iOS, Android)
- [ ] Verify touch targets are adequate (44x44px minimum)
- [ ] Check text readability at all sizes
- [ ] Verify images scale properly
- [ ] Test with browser zoom (50%-200%)
- [ ] Check print styles
- [ ] Test with slow network
- [ ] Verify responsive navigation

---

## Best Practices

### Do's ✅
- ✅ Use mobile-first approach
- ✅ Test on real devices
- ✅ Use flexible units (rem, em, %, vw, vh)
- ✅ Optimize images for each breakpoint
- ✅ Use system fonts for performance
- ✅ Implement progressive enhancement
- ✅ Consider touch interactions
- ✅ Test with different text sizes

### Don'ts ❌
- ❌ Use fixed pixel widths
- ❌ Rely on hover states for mobile
- ❌ Forget about landscape orientation
- ❌ Make touch targets too small
- ❌ Test only in browser
- ❌ Ignore system preferences (dark mode)
- ❌ Use too many breakpoints
- ❌ Forget about print styles

---

**Used by UI Designer for responsive design implementation.**

