# PHASE 5B: TDD GREEN - Implement Feature

**Phase:** 5b of 9  
**Duration:** 16-40 hours  
**Goal:** Write minimum code to make all tests pass

---

## Objectives

1. Implement features to pass ALL tests
2. Achieve 85%+ test coverage
3. Keep code simple (minimum to pass)
4. Run linter (0 warnings)

---

## Process

### 1. Implement Components

```tsx
// ShareModal.tsx - Make tests pass
export function ShareModal({ isOpen, onSubmit }: Props) {
  const [platform, setPlatform] = useState<Platform>()
  const [caption, setCaption] = useState('')
  
  if (!isOpen) return null
  
  const handleSubmit = () => {
    onSubmit({ platform, caption })
  }
  
  return (
    <Dialog role="dialog">
      <PlatformSelector value={platform} onChange={setPlatform} />
      <TextArea label="Caption" value={caption} onChange={setCaption} />
      <Button onClick={handleSubmit}>Post</Button>
    </Dialog>
  )
}
```

### 2. Run Tests - MUST PASS

```bash
$ npm test

PASS  src/components/ShareModal.test.tsx
  ✓ renders modal when open (45ms)
  ✓ does not render when closed (12ms)
  ✓ shows Facebook option (23ms)
  ✓ calls onSubmit with form data (89ms)

PASS  src/hooks/useSharePost.test.ts
  ✓ posts to Facebook (102ms)
  ✓ handles API errors (67ms)

Tests: 53 passed, 53 total
Coverage: 87.3% ✅ (Target: 85%)
Time: 8.234s
```

**✅ SUCCESS: ALL TESTS PASS, COVERAGE MET**

### 3. Run Linter

```bash
$ npm run lint

✔ No ESLint warnings
```

---

## Deliverables

### 1. Implementation Files
```
src/
├── components/
│   ├── ShareModal.tsx
│   └── PlatformSelector.tsx
├── hooks/
│   └── useSharePost.ts
└── api/
    └── shareApi.ts
```

### 2. Test Results
```markdown
# Phase 5b: Implementation Report

## Tests: 53/53 passing ✅
## Coverage: 87.3% ✅ (Target: 85%)
## Linter: 0 warnings ✅

## Coverage by File:
- ShareModal.tsx: 92%
- PlatformSelector.tsx: 88%
- useSharePost.ts: 85%
- shareApi.ts: 83%
```

---

## Approval Gate

```
═══════════════════════════════════════════════════════════
🟢 PHASE 5B COMPLETE: TDD GREEN - Implementation
═══════════════════════════════════════════════════════════

📊 Summary:
All 53 tests passing, 87% coverage achieved ✅

📦 Deliverables:
   📄 4 implementation files
   📄 Test results (53/53 passing)
   📄 Coverage report (87%)

✅ Success Criteria:
   ✅ All tests pass
   ✅ Coverage ≥ 85%
   ✅ ESLint 0 warnings
   ✅ Features working

⏭️  Next Phase: Phase 5c - TDD REFACTOR

───────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

Type "workflow:approve" → Proceed to Phase 5c
Type "workflow:reject <reason>" → Revise implementation

Your response:
═══════════════════════════════════════════════════════════
```

---

**Next:** Phase 5c - TDD REFACTOR

