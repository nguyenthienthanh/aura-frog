# Command: quality:debt

**Command:** `quality:debt [target]`
**Agent:** qa-automation
**Version:** 5.0.0

---

## 🎯 Purpose

Identify and track technical debt including TODOs, FIXMEs, deprecated code, unused imports, dead code, and code smells.

---

## 📋 Usage

```bash
# Analyze entire project
quality:debt

# Analyze specific directory
quality:debt src/components

# Show only high-priority debt
quality:debt --priority high

# Export report
quality:debt --export debt-report.md
```

---

## 🔧 Analysis Types

### 1. TODO/FIXME Comments
```bash
# Grep for TODO, FIXME, HACK, XXX
grep -rn "TODO\|FIXME\|HACK\|XXX" src/
```

### 2. Deprecated Code
```javascript
// @deprecated Use newFunction() instead
function oldFunction() {}

// TypeScript
/** @deprecated */
export function legacyApi() {}
```

### 3. Unused Code
```bash
# JavaScript/TypeScript (ts-unused-exports)
npx ts-unused-exports tsconfig.json

# Python (vulture)
vulture . --min-confidence 80

# Go (deadcode)
deadcode ./...
```

### 4. Code Duplication
```bash
# JavaScript/TypeScript (jscpd)
npx jscpd src/

# Python (pylint duplicate-code)
pylint --disable=all --enable=duplicate-code .
```

### 5. Code Smells
- Long methods (>50 lines)
- Large classes (>500 lines)
- Deep nesting (>4 levels)
- Too many parameters (>5)
- Magic numbers
- Commented-out code

---

## 📊 Output

```markdown
# Technical Debt Report

**Project:** my-project
**Date:** 2025-11-26
**Total Debt Items:** 42

---

## Summary

**Debt Level:** 🟡 MODERATE

| Category | Count | Priority |
|----------|-------|----------|
| TODO Comments | 18 | Medium |
| FIXME Comments | 6 | High |
| Deprecated Code | 4 | High |
| Unused Exports | 8 | Low |
| Code Duplication | 3 | Medium |
| Code Smells | 3 | Medium |

**Estimated Time to Fix:** 12-16 hours

---

## 🔴 High Priority (10 items)

### FIXME Comments (6)

**src/services/auth.ts:45**
```typescript
// FIXME: Token refresh logic is broken, needs proper error handling
async refreshToken() {
  // Temporary workaround
  return localStorage.getItem('token');
}
```
- **Age:** 14 days
- **Impact:** High (authentication failures)
- **Effort:** 2 hours

**src/utils/validation.ts:78**
```typescript
// FIXME: This regex doesn't handle international phone numbers
const phoneRegex = /^[0-9]{10}$/;
```
- **Age:** 7 days
- **Impact:** Medium (validation failures)
- **Effort:** 1 hour

### Deprecated Code (4)

**src/api/v1/users.ts**
```typescript
/**
 * @deprecated Use fetchUserProfile() from v2 API
 * This function will be removed in v3.0
 */
export function getUserData(userId: string) {
  return api.get(`/v1/users/${userId}`);
}
```
- **Used by:** 12 files
- **Migration:** Switch to v2 API
- **Effort:** 4 hours

---

## 🟡 Medium Priority (20 items)

### TODO Comments (18)

**src/components/UserProfile.tsx:120**
```typescript
// TODO: Add loading skeleton
<div>Loading...</div>
```
- **Age:** 21 days
- **Impact:** Low (UX improvement)
- **Effort:** 30 min

**src/hooks/useApi.ts:34**
```typescript
// TODO: Implement request caching
```
- **Age:** 45 days
- **Impact:** Medium (performance)
- **Effort:** 3 hours

### Code Duplication (3)

**src/utils/formatters.ts & src/helpers/format.ts**
- **Lines:** 45-60 duplicated (16 lines)
- **Similarity:** 95%
- **Action:** Extract to shared utility
- **Effort:** 1 hour

---

## 🟢 Low Priority (12 items)

### Unused Exports (8)

**src/utils/helpers.ts**
```typescript
export function formatDate() {} // ❌ Never imported
export function parseDate() {}  // ❌ Never imported
```
- **Action:** Remove or document purpose
- **Effort:** 15 min

### Commented Code (4)

**src/services/api.ts:156-180**
```typescript
// Old implementation (before refactor)
// function oldApiCall() {
//   ...25 lines of commented code...
// }
```
- **Age:** 60+ days
- **Action:** Remove (available in git history)
- **Effort:** 5 min

---

## 📈 Trends

**Debt Growth:**
- Week 1: 35 items
- Week 2: 38 items
- Week 3: 42 items (+7 items/month)

**Most Common:**
- TODO comments: 43% (getting added faster than resolved)
- Unused code: 19%
- Deprecated code: 14%

---

## 🎯 Recommendations

### Immediate Actions (This Sprint)
1. ✅ Fix critical FIXME in auth.ts (2h)
2. ✅ Remove deprecated getUserData() (4h)
3. ✅ Fix phone validation regex (1h)

### Short-term (Next Sprint)
4. Consolidate duplicate formatter code (1h)
5. Implement request caching (3h)
6. Add loading skeletons (2h)

### Long-term (Backlog)
7. Review and resolve all TODO comments (8h)
8. Remove unused exports (1h)
9. Clean up commented code (30m)

---

## 📊 Debt Metrics

**Debt Ratio:** 8.5% (codebase lines with debt / total lines)
- Target: <5%
- Status: ⚠️ Above target

**Debt Age:**
- 0-7 days: 12 items (28%)
- 8-30 days: 18 items (43%)
- 30+ days: 12 items (29%)

**Most Debt-Prone Areas:**
- `src/services/` - 15 items
- `src/utils/` - 12 items
- `src/components/` - 10 items

---

## 🔄 Tracking

**Add to JIRA Backlog:**
- DEBT-001: Fix auth token refresh (High, 2h)
- DEBT-002: Migrate to v2 API (High, 4h)
- DEBT-003: Implement request caching (Medium, 3h)

**Next Review:** 2025-12-10 (2 weeks)
```

---

## 🎨 Configuration

**.debtignore:**
```
node_modules/
dist/
build/
*.test.ts
*.spec.ts
```

**debt-rules.yaml:**
```yaml
priorities:
  FIXME: high
  TODO: medium
  HACK: high
  XXX: low

age_thresholds:
  high: 30  # days
  medium: 60
  low: 90

debt_ratio_target: 5  # percent
```

---

**Command:** quality:debt
**Version:** 5.0.0
