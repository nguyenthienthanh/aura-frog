# Performance Commands

Application performance analysis and optimization. Covers web vitals, mobile metrics, backend profiling, bundle analysis, and automated optimization.

---

## /perf:analyze

**Trigger:** `perf:analyze [target]`

Analyze application performance and identify bottlenecks. Web: Lighthouse metrics (FCP, LCP, TTI, TBT, CLS). Mobile: startup time, render time, memory/CPU. Backend: API response time, N+1 queries, memory leaks. Bundle: total size, chunk analysis, duplicates. Outputs scored report (0-100) with prioritized recommendations (quick wins, medium effort, long term) and estimated impact per fix.

**Usage:** `perf:analyze --target /dashboard`, `perf:analyze --lighthouse`, `perf:analyze --bundle`

---

## /perf:bundle

**Trigger:** `perf:bundle [options]`

Analyze JavaScript bundle size using webpack-bundle-analyzer, source-map-explorer, or bundle-buddy. Reports total size (gzipped/uncompressed), per-chunk breakdown, largest dependencies, duplicate detection, and tree-shaking effectiveness. Provides specific replacement suggestions (e.g., moment.js to date-fns) with exact savings.

**Usage:** `perf:bundle --visualize`, `perf:bundle --duplicates`

---

## /perf:lighthouse

**Trigger:** `perf:lighthouse [url]`

Run Lighthouse audit for performance, accessibility, best practices, SEO, and PWA scores (0-100 each). Reports Core Web Vitals (FCP, LCP, TBT, CLS), optimization opportunities with estimated time savings, and diagnostics (next-gen image formats, unused JavaScript, network payloads). Supports mobile and desktop device modes.

**Usage:** `perf:lighthouse https://myapp.com --device mobile`

---

## /perf:optimize

**Trigger:** `perf:optimize [options]`

Automatically apply performance optimizations based on perf:analyze results. Images: convert to WebP/AVIF, resize, add lazy loading, responsive images. Bundle: code splitting, tree-shaking, minification, compression. Code: defer non-critical JS, inline critical CSS, remove console.log, optimize re-renders. Network: CDN config, HTTP/2, preload critical resources, service worker caching. Outputs before/after metrics.

**Usage:** `perf:optimize --target images`, `perf:optimize --target bundle`, `perf:optimize --target code`

---

## Related

- **Skills:** `performance-optimizer`
- **Agents:** `tester` (PID 07), `frontend` (PID 03)
