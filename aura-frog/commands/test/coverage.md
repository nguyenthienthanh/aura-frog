# Command: test:coverage

**Purpose:** Check current test coverage and identify gaps  
**Aliases:** `coverage`, `check coverage`, `coverage report`

---

## 🎯 Overview

Analyze test coverage and provide recommendations for improvement.

**Supports:**
- React Native (Jest)
- Laravel (PHPUnit)
- Vue.js (Vitest)
- React.js (Jest)
- Next.js (Jest)

---

## 📋 Usage

```bash
# Check overall coverage
test:coverage

# Check specific file
test:coverage "src/components/UserProfile.tsx"

# Check directory
test:coverage "src/features/auth/"

# With target
test:coverage --target=85
```

---

## 📊 Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TEST COVERAGE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📈 Overall Coverage

| Metric      | Coverage | Target | Status |
|-------------|----------|--------|--------|
| Statements  | 78.5%    | 80%    | ❌ Below |
| Branches    | 72.3%    | 80%    | ❌ Below |
| Functions   | 85.2%    | 80%    | ✅ Met   |
| Lines       | 79.1%    | 80%    | ❌ Below |

**Overall:** 78.7% (Target: 80%)

---

## 📁 Coverage by Directory

| Directory           | Coverage | Status |
|---------------------|----------|--------|
| src/components/     | 85.2%    | ✅ Good |
| src/features/auth/  | 45.8%    | ❌ Low  |
| src/features/home/  | 92.1%    | ✅ Excellent |
| src/utils/          | 68.4%    | ⚠️  Fair |
| src/hooks/          | 78.9%    | ⚠️  Fair |

---

## 🔴 Files Below Target (< 80%)

### Critical (< 50%)

1. **src/features/auth/AuthContext.tsx** - 32.5%
   - Missing: Error handling, logout flow
   - Impact: High (used everywhere)
   - Recommendation: Add 15 test cases

2. **src/api/userApi.ts** - 41.2%
   - Missing: Network errors, retry logic
   - Impact: High (critical API)
   - Recommendation: Add API tests

### Moderate (50-79%)

3. **src/utils/validation.ts** - 65.8%
   - Missing: Edge cases
   - Impact: Medium
   - Recommendation: Add 8 test cases

4. **src/hooks/useForm.ts** - 72.1%
   - Missing: Complex validation scenarios
   - Impact: Medium
   - Recommendation: Add hook tests

---

## 📋 Uncovered Lines

### src/features/auth/AuthContext.tsx

**Lines not covered:**
- Lines 45-52: Error boundary catch block
- Line 68: Logout timeout handler
- Lines 89-95: Token refresh edge case

**Suggested tests:**
```typescript
it('should handle error boundary catch')
it('should timeout logout after 30s')
it('should refresh token when expired')
```

---

## 🎯 Recommendations

### Quick Wins (30 min)

1. Add tests for `src/utils/validation.ts`
   - 8 test cases needed
   - Will increase coverage by 3.2%

2. Add error tests for `src/api/userApi.ts`
   - 5 test cases needed
   - Will increase coverage by 2.8%

### High Impact (1 hour)

3. Add comprehensive tests for `AuthContext`
   - 15 test cases needed
   - Will increase coverage by 8.5%
   - **Highest priority** (critical code)

### Full Coverage (2 hours)

4. Add all missing tests
   - 35 test cases total
   - Will reach 85% coverage

---

## 🚀 Next Steps

**Option 1: Auto-generate missing tests**
```bash
test:unit "src/features/auth/AuthContext.tsx" --coverage=80
```

**Option 2: Generate for directory**
```bash
test:unit "src/features/auth/" --coverage=85
```

**Option 3: Generate for all low coverage files**
```bash
test:unit --below=80 --coverage=85
```

---

## 📊 Coverage Trends

**Last 7 days:**
```
Day 1: 72.3%
Day 2: 73.8% ↑
Day 3: 75.1% ↑
Day 4: 76.2% ↑
Day 5: 77.5% ↑
Day 6: 78.1% ↑
Day 7: 78.7% ↑

Trend: Improving (+6.4%)
```

---

## 🎯 Coverage Goals

**Current:** 78.7%  
**Target:** 80% (95% to goal)  
**Excellent:** 85%  
**Outstanding:** 90%+

**To reach 80%:** Add 28 test cases  
**To reach 85%:** Add 52 test cases  
**To reach 90%:** Add 85 test cases

---

**Generated:** 2025-11-24 18:30:00  
**Next check:** Run `test:coverage` after adding tests
```

---

## 💡 Features

### Coverage Analysis
- Overall metrics
- Per-directory breakdown
- Per-file details
- Uncovered lines

### Recommendations
- Prioritized by impact
- Time estimates
- Specific test suggestions
- Quick wins highlighted

### Trend Tracking
- Historical coverage data
- Progress visualization
- Goal tracking

---

## 🎯 Options

### Target Coverage

```bash
test:coverage --target=80
test:coverage --target=85
test:coverage --target=90
```

### Output Format

```bash
# Summary only
test:coverage --format=summary

# Detailed report
test:coverage --format=detailed

# JSON export
test:coverage --format=json > coverage.json
```

### Filter by Status

```bash
# Only show files below target
test:coverage --below-target

# Only show critical files
test:coverage --critical

# Show all
test:coverage --all
```

---

## 🔗 Integration

### With test:unit

```bash
# Check coverage
test:coverage

# Generate missing tests
test:unit "src/features/auth/" --coverage=85

# Verify improvement
test:coverage
```

### With Workflow

```bash
# During Phase 4 (Refactor + Review)
# Coverage is automatically checked
# Reports shown in deliverables
```

---

## ✅ Success Criteria

✅ Coverage report generated  
✅ Gaps identified  
✅ Recommendations provided  
✅ Action items clear  
✅ Easy to act on  

---

**Command:** test:coverage  
**Version:** 1.0.0  
**Added:** Aura Frog v1.3

