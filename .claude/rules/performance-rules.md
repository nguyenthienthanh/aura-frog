# Performance Rules

**Category:** Code Quality  
**Priority:** High  
**Enforcement:** Code Review + Performance Testing

---

## Performance Targets

### Web Applications
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Mobile Applications
- **App Launch:** < 2s
- **Screen Navigation:** < 300ms
- **List Scrolling:** 60fps (16.67ms per frame)
- **Animation:** 60fps
- **Memory:** < 200MB baseline

---

## React/React Native Optimization

### 1. Memoization

```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>
}, (prev, next) => prev.data.id === next.data.id)

// Memoize expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value)
}, [data])

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### 2. Lazy Loading

```typescript
// Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Image lazy loading
<Image 
  loading="lazy"
  src={imageUrl}
/>
```

### 3. List Virtualization

```typescript
// For long lists (>100 items)
import { FlatList } from 'react-native'

<FlatList
  data={items}
  renderItem={renderItem}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

---

## Vue.js Optimization

### 1. Computed vs Methods

```vue
<script setup>
// ✅ Use computed for reactive calculations
const filteredItems = computed(() => 
  items.value.filter(item => item.active)
)

// ❌ Avoid methods for reactive data
function getFilteredItems() {
  return items.value.filter(item => item.active)
}
</script>
```

### 2. v-memo Directive

```vue
<template>
  <div v-for="item in list" v-memo="[item.id]">
    {{ item.name }}
  </div>
</template>
```

---

## API & Network Optimization

### 1. Request Batching

```typescript
// ❌ Multiple requests
await fetchUser(id1)
await fetchUser(id2)
await fetchUser(id3)

// ✅ Batched request
await fetchUsers([id1, id2, id3])
```

### 2. Caching

```typescript
// React Query caching
const { data } = useQuery('users', fetchUsers, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
})
```

### 3. Pagination

```typescript
// ✅ Paginated requests
fetchUsers({ page: 1, limit: 20 })

// ❌ Fetching all data at once
fetchAllUsers() // 10,000+ records
```

---

## Image Optimization

### 1. Proper Sizing

```typescript
// ✅ Specify dimensions
<Image 
  src={image}
  width={800}
  height={600}
  alt="Description"
/>

// ✅ Responsive images
<picture>
  <source media="(max-width: 768px)" srcSet="small.jpg" />
  <source media="(max-width: 1200px)" srcSet="medium.jpg" />
  <img src="large.jpg" alt="Description" />
</picture>
```

### 2. Format & Compression

- Use WebP format (fallback to JPG)
- Compress images (80-85% quality)
- Use SVG for icons/logos

---

## Bundle Size Optimization

### 1. Tree Shaking

```typescript
// ✅ Named imports
import { Button } from 'components'

// ❌ Import everything
import * as Components from 'components'
```

### 2. Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --analyze

# Set budget limits
# webpack.config.js
performance: {
  maxAssetSize: 300000,     // 300KB
  maxEntrypointSize: 500000 // 500KB
}
```

---

## Memory Management

### 1. Cleanup Side Effects

```typescript
useEffect(() => {
  const subscription = api.subscribe()
  
  // ✅ Cleanup
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

### 2. Avoid Memory Leaks

```typescript
// ❌ Memory leak
const data = []
setInterval(() => {
  data.push(fetchData())
}, 1000)

// ✅ Proper cleanup
useEffect(() => {
  const interval = setInterval(() => {
    fetchAndProcess()
  }, 1000)
  
  return () => clearInterval(interval)
}, [])
```

---

## Database Query Optimization

### 1. N+1 Query Problem

```php
// ❌ N+1 queries
$users = User::all();
foreach ($users as $user) {
    $user->posts; // Query for each user
}

// ✅ Eager loading
$users = User::with('posts')->get();
```

### 2. Indexing

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_post_user_id ON posts(user_id);
```

---

## Performance Testing

### Tools
- Lighthouse (web)
- React DevTools Profiler
- Chrome DevTools Performance
- k6 (load testing)

### Checklist
- [ ] Lighthouse score > 90
- [ ] No render > 16ms (60fps)
- [ ] Bundle size within budget
- [ ] No memory leaks
- [ ] API response < 200ms

---

## Best Practices

### Do's ✅
- ✅ Measure before optimizing
- ✅ Use production builds for testing
- ✅ Optimize critical rendering path
- ✅ Implement proper caching
- ✅ Use CDN for static assets
- ✅ Lazy load non-critical resources

### Don'ts ❌
- ❌ Premature optimization
- ❌ Ignore performance budgets
- ❌ Load everything upfront
- ❌ Forget to cleanup resources
- ❌ Use synchronous operations
- ❌ Ignore bundle size

---

**Applied in:** Phase 5c (Refactoring), Phase 6 (Code Review), Phase 7 (QA Validation)

