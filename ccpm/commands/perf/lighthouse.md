# Command: perf:lighthouse

**Command:** `perf:lighthouse [url]`
**Version:** 5.2.0

---

## 🎯 Purpose

Run Lighthouse audit and generate comprehensive performance, accessibility, SEO, and best practices report.

---

## 📋 Usage

```bash
# Lighthouse audit on localhost
perf:lighthouse

# Audit production URL
perf:lighthouse https://myapp.com

# Mobile audit
perf:lighthouse --device mobile

# Desktop audit
perf:lighthouse --device desktop
```

---

## 🔧 Audit Categories

- **Performance** (0-100)
- **Accessibility** (0-100)
- **Best Practices** (0-100)
- **SEO** (0-100)
- **PWA** (0-100)

---

## 📊 Output

```markdown
# Lighthouse Report

**URL:** https://myapp.com
**Date:** 2024-11-26

## Scores

- Performance: 78/100 ⚠️
- Accessibility: 92/100 ✅
- Best Practices: 85/100 ✅
- SEO: 90/100 ✅
- PWA: 50/100 ❌

## Performance Metrics

- FCP: 1.2s ✅
- LCP: 2.8s ⚠️
- TBT: 320ms ⚠️
- CLS: 0.02 ✅

## Opportunities

1. Eliminate render-blocking resources (save 830ms)
2. Properly size images (save 450KB)
3. Enable text compression (save 320KB)

## Diagnostics

- Serve images in next-gen formats
- Reduce unused JavaScript
- Avoid enormous network payloads
```

---

**Command:** perf:lighthouse
**Version:** 5.2.0
