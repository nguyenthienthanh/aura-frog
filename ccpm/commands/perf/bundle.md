# Command: perf:bundle

**Command:** `perf:bundle [options]`
**Version:** 5.2.0

---

## 🎯 Purpose

Analyze bundle size, identify large dependencies, and provide optimization recommendations.

---

## 📋 Usage

```bash
# Analyze bundle
perf:bundle

# Show treemap
perf:bundle --visualize

# Show duplicates
perf:bundle --duplicates
```

---

## 🔧 Analysis

### Bundle Breakdown
- Total size (gzipped/uncompressed)
- Per-chunk analysis
- Dependency sizes
- Duplicate detection

### Tools
- webpack-bundle-analyzer
- source-map-explorer
- bundle-buddy

---

## 📊 Output

```markdown
# Bundle Size Report

**Total Size:** 2.1MB (720KB gzipped)
**Target:** <500KB gzipped ❌

## Largest Dependencies

1. moment.js - 280KB (replace with date-fns: save 230KB)
2. lodash - 150KB (use lodash-es: save 100KB)
3. unused code - 320KB (tree-shake: save 320KB)

## Recommendations

1. Replace moment.js with date-fns (-230KB)
2. Enable tree-shaking (-320KB)
3. Code split routes (-400KB from initial bundle)
4. Use lodash-es instead of lodash (-100KB)

**Total Savings:** 1.05MB (-50%)
```

---

**Command:** perf:bundle
**Version:** 5.2.0
