# Command: perf:optimize

**Command:** `perf:optimize [options]`
**Version:** 5.2.0

---

## 🎯 Purpose

Automatically apply performance optimizations based on analysis results.

---

## 📋 Usage

```bash
# Auto-optimize based on perf:analyze
perf:optimize

# Optimize specific area
perf:optimize --target images
perf:optimize --target bundle
perf:optimize --target code
```

---

## 🔧 Optimizations Applied

### Images
- Convert to WebP/AVIF
- Resize to appropriate dimensions
- Add lazy loading
- Implement responsive images

### Bundle
- Enable code splitting
- Tree-shaking unused code
- Minify JavaScript/CSS
- Enable compression (gzip/brotli)

### Code
- Defer non-critical JavaScript
- Inline critical CSS
- Remove console.log in production
- Optimize re-renders (React.memo)

### Network
- Add CDN configuration
- Enable HTTP/2
- Preload critical resources
- Add service worker caching

---

## 📊 Deliverables

- Optimized code/assets
- Performance improvement report
- Before/after metrics

---

**Command:** perf:optimize
**Version:** 5.2.0
