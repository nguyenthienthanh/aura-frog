# Frontend Excellence - Actionable UI/UX & Performance Guide

**Category:** Frontend Development
**Priority:** Critical
**Applies To:** web-expert, mobile-expert, ui-designer, all frontend skills
**Version:** 1.0.0

---

## Quick Reference - Must-Have Metrics

```toon
web_targets[6]{metric,target,why}:
  LCP (Largest Contentful Paint),<2.5s,Main content visible
  FID/INP (First Input Delay),<100ms,Responsive to interaction
  CLS (Cumulative Layout Shift),<0.1,No unexpected movement
  TTI (Time to Interactive),<3.8s,Usable quickly
  Bundle Size (initial JS),<150KB gzipped,Fast load
  Lighthouse Score,90+ all categories,Baseline quality
```

```toon
mobile_targets[5]{metric,target,why}:
  App Launch,<2s cold start,First impression
  Frame Rate,60fps constant,Smooth animations
  Touch Response,<100ms feedback,Feels instant
  Memory,<200MB active,No crashes
  Battery,Minimal drain,User trust
```

---

## 1. UX Laws - Apply These Patterns

### Fitts' Law: Size & Distance Matter

```toon
fitts_law[5]{element,minimum_size,placement}:
  Primary CTA button,48x48px (touch) 44x44px (web),Bottom right or center
  Secondary actions,36x36px minimum,Near primary
  Navigation items,44px height,Easy reach zone
  Form inputs,44px height,Full width on mobile
  Close/dismiss buttons,44x44px,Top corners
```

**ALWAYS:**
- Make primary buttons larger than secondary
- Place frequent actions in thumb-reach zone (bottom 40% of mobile screen)
- Increase touch targets on mobile, especially for elderly/accessibility

```tsx
// ✅ DO: Large touch targets with adequate spacing
<Button className="min-h-[48px] min-w-[120px] px-6">Submit</Button>

// ❌ DON'T: Small, hard-to-tap targets
<Button className="h-8 w-16 text-xs">Go</Button>
```

### Jakob's Law: Users Expect Familiar Patterns

**ALWAYS use standard patterns:**

```toon
standard_patterns[8]{action,expected_pattern}:
  Login,Email + Password + "Forgot password?" link + Social options
  Search,Icon left + input + clear button when filled
  Navigation,Logo left (links home) + nav center/right + user menu far right
  Forms,Labels above inputs + clear error states + progress indicator
  Lists,Pull-to-refresh + infinite scroll or pagination
  Modals,X button top-right + click outside to close
  Settings,Grouped sections + toggles for on/off + back navigation
  Checkout,Progress steps + summary sidebar + secure payment indicators
```

**NEVER:**
- Invent new icons for standard actions (use standard hamburger, search, close, back icons)
- Put logo anywhere except top-left (web) or center (mobile)
- Hide navigation in unexpected places

### Hick's Law: Limit Choices

```toon
choice_limits[4]{context,max_options,solution}:
  Primary navigation,5-7 items,Group extras in "More"
  Form selects,7 visible items,Use search for longer lists
  Action buttons,1 primary + 2 secondary,Hide tertiary in menu
  Onboarding steps,3-5 total,Break complex flows into phases
```

```tsx
// ✅ DO: Limited, clear choices
<ButtonGroup>
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <DropdownMenu label="More">
    <MenuItem>Duplicate</MenuItem>
    <MenuItem>Export</MenuItem>
    <MenuItem danger>Delete</MenuItem>
  </DropdownMenu>
</ButtonGroup>

// ❌ DON'T: Overwhelming options
<ButtonGroup>
  <Button>Save</Button>
  <Button>Save as Draft</Button>
  <Button>Duplicate</Button>
  <Button>Export PDF</Button>
  <Button>Export CSV</Button>
  <Button>Share</Button>
  <Button>Delete</Button>
</ButtonGroup>
```

### Miller's Law: Chunk Information (7±2)

```toon
chunking_rules[5]{content_type,chunk_strategy}:
  Phone numbers,xxx-xxx-xxxx (3-3-4)
  Credit cards,xxxx xxxx xxxx xxxx (4-4-4-4)
  Long forms,Group into sections of 3-5 fields
  Navigation menus,Max 7 top-level items
  Settings,Categorize into 5-7 groups
```

---

## 2. Accessibility - Non-Negotiable Standards

### WCAG 2.1 AA Requirements

```toon
accessibility_musts[10]{requirement,how_to_implement}:
  Color contrast,Text 4.5:1 ratio (large text 3:1) - use contrast checker
  Focus indicators,Visible outline on all interactive elements (2px solid)
  Keyboard navigation,Tab through all actions - Enter/Space to activate
  Alt text,Descriptive alt for images - empty alt="" for decorative
  Form labels,Every input has associated label (htmlFor matches id)
  Error identification,Text explanation not just color
  Skip links,"Skip to content" link as first focusable element
  Heading hierarchy,h1→h2→h3 in order - never skip levels
  Touch targets,48x48dp minimum on mobile
  Motion,Respect prefers-reduced-motion
```

### ARIA Patterns - Use Correctly

```tsx
// ✅ DO: Proper ARIA for custom components
<button
  role="tab"
  aria-selected={isActive}
  aria-controls="panel-1"
  tabIndex={isActive ? 0 : -1}
>
  Tab 1
</button>

// ✅ DO: Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// ✅ DO: Modals with proper focus management
<dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Confirm Action</h2>
</dialog>

// ❌ DON'T: ARIA where native HTML works
<div role="button" tabIndex={0} onClick={handleClick}>Click</div>
// Use: <button onClick={handleClick}>Click</button>
```

### Keyboard Navigation Checklist

```toon
keyboard_patterns[6]{component,keys}:
  Buttons,"Enter or Space to activate"
  Links,"Enter to follow"
  Dropdowns,"Arrow keys to navigate + Enter to select + Escape to close"
  Modals,"Tab cycles within + Escape closes + Focus returns on close"
  Forms,"Tab between fields + Enter submits"
  Tabs,"Arrow keys switch tabs + Tab into panel content"
```

---

## 3. Mobile-Specific UX

### One-Handed Use (49% of Users)

```toon
thumb_zones[3]{zone,placement,use_for}:
  Easy (green),Bottom center,Primary actions - submit - add - next
  OK (yellow),Middle and sides,Secondary actions - navigation
  Hard (red),Top corners,Rarely used - settings - close
```

**Mobile Layout Priority:**
1. Primary CTA → Bottom of screen (within thumb reach)
2. Navigation → Bottom tab bar (not hamburger when possible)
3. Destructive actions → Require deliberate reach (top or confirmation)

```tsx
// ✅ DO: Bottom sheet with actions in easy reach
<BottomSheet>
  <Content />
  <View className="flex-row gap-3 pb-safe">
    <Button variant="secondary" className="flex-1">Cancel</Button>
    <Button variant="primary" className="flex-1">Confirm</Button>
  </View>
</BottomSheet>

// ❌ DON'T: Actions at top requiring stretch
<Modal>
  <View className="flex-row justify-end gap-2">
    <Button>Cancel</Button>
    <Button>Confirm</Button>
  </View>
  <LongContent />
</Modal>
```

### Platform Conventions

```toon
ios_conventions[6]{element,ios_pattern}:
  Navigation,Large titles + back text + swipe to go back
  Buttons,System blue (#007AFF) + SF Symbols icons
  Tabs,Bottom with labels + no more than 5
  Modals,Sheet from bottom + swipe to dismiss
  Alerts,Center modal + destructive in red
  Switches,Rounded pill + green when on
```

```toon
android_conventions[6]{element,android_pattern}:
  Navigation,Top app bar + back arrow + FAB for primary
  Buttons,Material buttons + ripple effect
  Tabs,Top tabs with indicator + swipe between
  Modals,Full screen or bottom sheet
  Alerts,Dialog centered + buttons right-aligned
  Switches,Track + thumb + primary color when on
```

### Gesture Patterns

```toon
gestures[6]{gesture,common_use,implementation}:
  Swipe right,Go back / reveal actions,react-native-gesture-handler
  Swipe down,Refresh / dismiss,Pull-to-refresh / sheet dismiss
  Swipe left,Delete / archive (with confirmation),Swipeable row
  Long press,Context menu / selection,500ms delay + haptic feedback
  Pinch,Zoom images,react-native-gesture-handler or zoom library
  Double tap,Like / zoom,Toggle action or zoom to point
```

---

## 4. Loading & Feedback States

### Timing Guidelines

```toon
feedback_timing[5]{delay,feedback_type}:
  0-100ms,None needed - feels instant
  100-300ms,Subtle indicator (button state change)
  300-1000ms,Spinner or progress indicator
  1000ms+,Skeleton screen or progress bar with estimate
  10s+,Background with notification when complete
```

### Skeleton Screens (Not Spinners)

```tsx
// ✅ DO: Skeleton that matches content layout
function UserCardSkeleton() {
  return (
    <View className="flex-row items-center gap-3 p-4">
      <View className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
      <View className="flex-1 gap-2">
        <View className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        <View className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
      </View>
    </View>
  );
}

// ✅ DO: Show skeleton immediately, not after delay
{isLoading ? <UserCardSkeleton /> : <UserCard user={user} />}

// ❌ DON'T: Generic spinner that doesn't indicate content shape
{isLoading && <Spinner />}
```

### Optimistic Updates

```tsx
// ✅ DO: Update UI immediately, revert on error
async function handleLike() {
  // Optimistic update
  setLiked(true);
  setLikeCount(prev => prev + 1);

  try {
    await api.likePost(postId);
  } catch (error) {
    // Revert on failure
    setLiked(false);
    setLikeCount(prev => prev - 1);
    showError('Failed to like. Please try again.');
  }
}
```

### Progress Indication

```tsx
// ✅ DO: Show progress for multi-step operations
<ProgressBar current={currentStep} total={totalSteps} />
<Text>Step {currentStep} of {totalSteps}: {stepName}</Text>

// ✅ DO: Determinate progress when possible
<ProgressBar value={uploadProgress} max={100} />
<Text>{uploadProgress}% uploaded</Text>

// Use indeterminate only when progress can't be measured
<ProgressBar indeterminate />
```

---

## 5. Form UX - Beyond Validation

### Field Design

```toon
form_best_practices[8]{practice,implementation}:
  Label position,Above input (not placeholder as label)
  Required indicator,Asterisk after label text
  Helper text,Below input - always visible if needed
  Error messages,Replace helper text + red text + icon
  Input size,Full width on mobile + appropriate for content on desktop
  Autofill,Enable autocomplete attributes for all standard fields
  Input types,Use correct type (email/tel/url) for keyboard
  Grouping,Logical groups of 3-5 fields with headings
```

```tsx
// ✅ DO: Complete field pattern
<FormField>
  <Label htmlFor="email">Email address *</Label>
  <Input
    id="email"
    type="email"
    autoComplete="email"
    aria-describedby="email-error email-help"
    aria-invalid={Boolean(error)}
    className={error ? "border-red-500" : "border-gray-300"}
  />
  {error ? (
    <ErrorMessage id="email-error" role="alert">
      <ErrorIcon /> {error}
    </ErrorMessage>
  ) : (
    <HelperText id="email-help">We'll never share your email</HelperText>
  )}
</FormField>
```

### Validation Timing

```toon
validation_timing[4]{event,behavior}:
  On blur (leave field),Validate that field - show error if invalid
  On change (while typing),Clear error if now valid - DON'T show new errors
  On submit,Validate all - focus first error - scroll into view
  Real-time (optional),Only for format hints (password strength)
```

### Error Messages

```toon
error_message_patterns[5]{bad_message,good_message}:
  "Invalid input","Email must include @ symbol"
  "Required","Please enter your name"
  "Error","Password must be at least 8 characters"
  "Invalid format","Phone number should be 10 digits"
  "Failed","Couldn't save. Check connection and try again."
```

---

## 6. Visual Hierarchy & Layout

### Spacing System

```toon
spacing_scale[6]{name,size,use_for}:
  xs,4px,Tight inline elements
  sm,8px,Related elements (icon + text)
  md,16px,Default component padding
  lg,24px,Section separation
  xl,32px,Major sections
  2xl,48px,Page sections
```

### Typography Hierarchy

```toon
type_scale[6]{level,web_size,mobile_size,use_for}:
  h1,32-48px,28-36px,Page title (one per page)
  h2,24-32px,22-28px,Section headers
  h3,20-24px,18-22px,Card titles - subsections
  body,16px,16px,Main content (never smaller)
  small,14px,14px,Secondary text - captions
  xs,12px,12px,Legal - timestamps (sparingly)
```

### Visual Weight Priority

```toon
visual_priority[4]{priority,treatment}:
  Primary action,Solid background + contrasting text + larger size
  Secondary action,Outline or ghost + smaller than primary
  Tertiary/links,Text only + underline or color
  Disabled,Reduced opacity (0.5) + no pointer cursor
```

---

## 7. Performance Implementation

### Image Optimization

```tsx
// ✅ DO: Responsive images with proper sizing
<Image
  src={imageUrl}
  width={400}
  height={300}
  alt="Descriptive alt text"
  loading="lazy"           // Lazy load below fold
  decoding="async"         // Non-blocking decode
  sizes="(max-width: 768px) 100vw, 400px"
  srcSet={`${imageUrl}?w=400 400w, ${imageUrl}?w=800 800w`}
/>

// ✅ DO: Use next/image or similar for automatic optimization
import Image from 'next/image';
<Image src={src} fill placeholder="blur" blurDataURL={blurHash} />

// For mobile: Use FastImage with caching
import FastImage from 'react-native-fast-image';
<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### Bundle Optimization

```toon
bundle_rules[5]{practice,implementation}:
  Code splitting,Lazy load routes + dynamic import heavy components
  Tree shaking,Import specific functions not whole libraries
  Image formats,WebP with fallback + proper sizing
  Font loading,font-display: swap + preload critical fonts
  Third-party,Analyze with bundlephobia before adding
```

### Render Optimization

```tsx
// ✅ DO: Virtualize long lists
<VirtualizedList
  data={items}
  renderItem={renderItem}
  getItemCount={() => items.length}
  getItem={(data, index) => data[index]}
/>

// ✅ DO: Debounce expensive operations
const debouncedSearch = useMemo(
  () => debounce((query) => search(query), 300),
  []
);

// ✅ DO: Memoize expensive computations
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);
```

---

## 8. Error Prevention & Recovery

### Prevent Errors

```toon
error_prevention[6]{technique,example}:
  Constraints,Date picker instead of text input for dates
  Confirmation,Double-check destructive actions with modal
  Undo,Provide undo for 5 seconds after delete
  Auto-save,Save drafts automatically every 30 seconds
  Smart defaults,Pre-fill known values (country from IP)
  Format masks,Show expected format as user types (phone/card)
```

### Error Recovery

```tsx
// ✅ DO: Actionable error messages
<ErrorBanner>
  <ErrorIcon />
  <ErrorText>Payment failed. Your card was declined.</ErrorText>
  <ButtonGroup>
    <Button onClick={retry}>Try Again</Button>
    <Button variant="link" onClick={changeCard}>Use Different Card</Button>
  </ButtonGroup>
</ErrorBanner>

// ✅ DO: Graceful degradation
{error ? (
  <OfflineCard
    message="Unable to load latest data"
    cachedData={cachedData}
    onRetry={refetch}
  />
) : (
  <DataCard data={data} />
)}
```

---

## 9. Checklist Before Shipping

### Accessibility Audit

- [ ] Tab through entire flow - all actions reachable by keyboard
- [ ] Screen reader test (VoiceOver/TalkBack) - content makes sense
- [ ] Color contrast checked - 4.5:1 for text, 3:1 for large text
- [ ] Focus indicators visible on all interactive elements
- [ ] Forms have labels, errors are announced
- [ ] No information conveyed by color alone

### Performance Audit

- [ ] Lighthouse score 90+ on all categories
- [ ] LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Images optimized (WebP, proper sizes, lazy loading)
- [ ] Bundle analyzed (no unused large dependencies)
- [ ] Mobile performance within 30% of desktop

### UX Audit

- [ ] Touch targets 48x48dp minimum on mobile
- [ ] Primary actions in thumb-reach zone
- [ ] Loading states for all async operations
- [ ] Error states with recovery actions
- [ ] Empty states with guidance
- [ ] Forms validate on blur, clear on fix

---

## Quick Decision Trees

### "How should this button look?"

```
Is it the main action on the page?
├── Yes → Primary (solid, prominent color, large)
└── No → Is it an alternative to primary?
    ├── Yes → Secondary (outline or ghost)
    └── No → Is it destructive?
        ├── Yes → Danger (red, requires confirmation)
        └── No → Tertiary (text link style)
```

### "Where should I put this action?"

```
How often will users need it?
├── Very often → Persistent (bottom tab, toolbar)
├── Sometimes → On-screen button (in content area)
└── Rarely → Menu (hamburger, overflow, settings)

Is it on mobile?
├── Yes → Bottom of screen (within thumb reach)
└── No → Follow F-pattern (top-left to right, then down)
```

### "Should I show a loading spinner?"

```
How long will it take?
├── <100ms → No indicator
├── 100-1000ms → Subtle (button disabled state, small spinner)
├── 1-10s → Skeleton screen matching expected content
└── >10s → Progress bar + background processing
```

---

**Sources:**
- [React & Next.js Best Practices 2025](https://talent500.com/blog/modern-frontend-best-practices-with-react-and-next-js-2025/)
- [UI/UX Design Principles 2025](https://uxplaybook.org/articles/10-ui-ux-fundamental-laws-2025)
- [React Native Performance Checklist](https://medium.com/@baheer224/react-native-performance-checklist-for-2025-a86d18c0c856)
- [Mobile UX Design Guide](https://uxcam.com/blog/mobile-ux/)
- [Web Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version:** 1.0.0
**Last Updated:** 2026-01-14
