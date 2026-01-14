# Diff Engine Configuration

**Version:** 1.0.0
**Engine:** Pixelmatch

---

## Overview

Pixelmatch is used to compare snapshots against baselines. Configuration affects diff sensitivity and output.

---

## Thresholds

```toon
diff_thresholds[2]{type,max_percent,rationale}:
  web,0.5%,Standard web rendering is consistent
  pdf,1.0%,PDF rendering has slight font/spacing variations
```

### Threshold Calculation

```
mismatchPercent = (mismatchPixels / totalPixels) * 100

PASS: mismatchPercent <= threshold
FAIL: mismatchPercent > threshold
```

---

## Pixelmatch Options

```javascript
const options = {
  threshold: 0.1,        // Per-pixel color diff threshold (0-1)
  includeAA: false,      // Ignore anti-aliasing differences
  alpha: 0.1,            // Blending factor for unchanged pixels in diff
  aaColor: [255, 255, 0], // Color for anti-aliased pixels
  diffColor: [255, 0, 0], // Color for different pixels (red)
  diffColorAlt: null,     // Alternate diff color (for dithering)
  diffMask: false        // Output only diff pixels
};
```

### Recommended Settings

```javascript
// Strict comparison (for frozen regions)
const strictOptions = {
  threshold: 0.05,
  includeAA: false,
  alpha: 0.1
};

// Lenient comparison (for flexible regions)
const lenientOptions = {
  threshold: 0.2,
  includeAA: true,
  alpha: 0.3
};
```

---

## Configuration File

In `.claude/visual/config.json`:

```json
{
  "thresholds": {
    "web": 0.5,
    "pdf": 1.0
  },
  "pixelmatch": {
    "threshold": 0.1,
    "includeAA": false,
    "alpha": 0.1
  },
  "maxAttempts": 5
}
```

---

## Understanding Diff Output

### Diff Image Colors

| Color | Meaning |
|-------|---------|
| **Red** | Pixels that differ between baseline and current |
| **Yellow** | Anti-aliased pixels (if includeAA: true) |
| **Gray** | Unchanged pixels (semi-transparent) |

### Example Output

```json
{
  "mismatchPixels": 1234,
  "totalPixels": 1382400,
  "mismatchPercent": "0.0893",
  "threshold": 0.5,
  "pass": true,
  "diffImage": ".claude/visual/snapshots/diff/header-diff.png",
  "dimensions": {
    "width": 1440,
    "height": 960
  }
}
```

---

## Troubleshooting

### High Diff Due to Anti-Aliasing

**Problem:** Different browsers/OS render fonts differently.

**Solution:**
```json
{
  "pixelmatch": {
    "includeAA": true,
    "threshold": 0.15
  }
}
```

### Diff Always Fails on Small Changes

**Problem:** Threshold too strict.

**Solution:** Increase threshold for flexible components:
```json
{
  "thresholds": {
    "web": 1.0,
    "pdf": 1.5
  }
}
```

### Viewport Mismatch

**Problem:** Baseline and current have different dimensions.

**Solution:** Ensure DesignSpec viewport matches render settings.

---

## Script Usage

```bash
# Basic comparison (0.5% threshold)
./scripts/visual/snapshot-compare.sh baseline.png current.png diff.png 0.5

# Strict comparison (0.1% threshold)
./scripts/visual/snapshot-compare.sh baseline.png current.png diff.png 0.1

# Lenient comparison (2% threshold)
./scripts/visual/snapshot-compare.sh baseline.png current.png diff.png 2.0
```

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
