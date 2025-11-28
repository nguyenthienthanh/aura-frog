# Command: perf:analyze

**Command:** `perf:analyze [target]`
**Agents:** qa-automation, web/mobile agents
**Version:** 5.2.0

---

## 🎯 Purpose

Analyze application performance, identify bottlenecks, and provide optimization recommendations.

---

## 📋 Usage

```bash
# Analyze current project
perf:analyze

# Analyze specific page/screen
perf:analyze --target /dashboard

# Generate Lighthouse report (web)
perf:analyze --lighthouse

# Analyze bundle size
perf:analyze --bundle
```

---

## 🔧 Analysis Types

### 1. Web Performance (Lighthouse)
**Metrics:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

**Tools:**
- Lighthouse CLI
- WebPageTest
- Chrome DevTools

### 2. Mobile Performance
**Metrics:**
- App startup time
- Screen render time
- Memory usage
- CPU usage
- Network requests

**Tools:**
- React Native Performance Monitor
- Flipper
- Xcode Instruments (iOS)
- Android Profiler

### 3. Backend Performance
**Metrics:**
- API response time
- Database query time
- N+1 query detection
- Memory leaks
- CPU usage

**Tools:**
- Node.js Profiler
- New Relic APM
- Datadog

### 4. Bundle Size Analysis
**Metrics:**
- Total bundle size
- Chunk sizes
- Duplicate dependencies
- Tree-shaking effectiveness

**Tools:**
- webpack-bundle-analyzer
- source-map-explorer

---

## 📊 Output Example

```markdown
# Performance Analysis Report

**Project:** MyApp
**Platform:** Web (React)
**Date:** 2024-11-26

## Performance Score: 72/100

### Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| FCP | 1.8s | <1.8s | ✅ Pass |
| LCP | 3.2s | <2.5s | ❌ Fail |
| TTI | 4.5s | <3.8s | ⚠️ Warning |
| TBT | 450ms | <300ms | ❌ Fail |
| CLS | 0.05 | <0.1 | ✅ Pass |

### Issues Found

**Critical (2):**
1. Large images not optimized (reducing LCP by 1.2s)
2. Render-blocking JavaScript (450ms TBT)

**High (3):**
3. Unused JavaScript (320KB)
4. No image lazy loading
5. Missing font preloading

**Medium (5):**
6. Large bundle size (2.1MB)
7. No code splitting
...

### Recommendations

**Quick Wins:**
1. ✅ Enable gzip compression (save 1.5MB)
2. ✅ Optimize images with WebP (save 800KB, improve LCP by 1s)
3. ✅ Add lazy loading for below-fold images

**Medium Effort:**
4. ⚙️ Implement code splitting (reduce initial bundle by 40%)
5. ⚙️ Defer non-critical JavaScript
6. ⚙️ Add CDN for static assets

**Long Term:**
7. 🔧 Migrate to Next.js for SSR/SSG
8. 🔧 Implement service worker caching
```

---

## 🎯 Deliverables

- Performance analysis report
- Bottleneck identification
- Optimization recommendations (prioritized)
- Estimated impact for each fix

---

**Command:** perf:analyze
**Version:** 5.2.0
