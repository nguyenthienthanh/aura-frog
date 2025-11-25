# Command: workflow:handoff

**Purpose:** Prepare workflow for continuation in new session  
**Aliases:** `handoff`, `save context`, `checkpoint`

---

## 🎯 Overview

When approaching token limit (>150K/200K), save complete workflow state for seamless continuation in a new Cursor session.

---

## ⚠️ When to Use

**Triggers:**
- Token usage > 150K (75%)
- Long complex workflow
- Before taking break
- Multi-day project

**Warning at 80%:**
```
⚠️ Token Warning: 160K / 200K (80%)
   Consider running: workflow:handoff
```

---

## 📋 What Gets Saved

### 1. Workflow State
```json
{
  "workflow_id": "...",
  "current_phase": 5,
  "completed_phases": [1, 2, 3, 4],
  "tokens_used": 160000,
  "handoff_at": "2025-11-24T15:30:00Z"
}
```

### 2. All Deliverables
```
.claude/logs/contexts/[workflow-id]/
├── deliverables/
│   ├── 01-requirements-analysis/
│   ├── 02-technical-planning/
│   ├── 03-design-review/
│   └── 04-test-planning/
└── HANDOFF_CONTEXT.md  ← Created
```

### 3. Key Decisions
```markdown
# Handoff Context

## Decisions Made
- Chose Option A for authentication (JWT)
- Using 3-component architecture
- Test coverage target: 85%

## Files Created
- auth/Login.tsx
- auth/AuthContext.tsx
- auth/__tests__/Login.test.tsx

## Next Steps
- Phase 5: Implement remaining components
- Need to add error handling
- Complete integration tests
```

---

## 🔧 Execution

### Command

```bash
workflow:handoff

# Creates:
# 1. HANDOFF_CONTEXT.md
# 2. Updated workflow-state.json
# 3. Compressed context summary
```

### Output

```markdown
╔══════════════════════════════════════════════════════════╗
║  📦 WORKFLOW HANDOFF PREPARED                            ║
╚══════════════════════════════════════════════════════════╝

**Workflow:** add-user-authentication
**Current Phase:** 4/9 (Test Planning)
**Tokens Used:** 160K / 200K (80%)

## Saved Context

✅ Workflow state saved
✅ 4 phase deliverables preserved
✅ Key decisions documented
✅ Next steps defined

**Location:** `.claude/logs/contexts/[workflow-id]/HANDOFF_CONTEXT.md`

---

## 🔄 To Continue in New Session:

**Step 1:** Open new Cursor chat

**Step 2:** Paste this command:
```
workflow:resume add-user-authentication-20251124-120000
```

**Step 3:** Agent will:
- Load all context from HANDOFF_CONTEXT.md
- Resume at Phase 5
- Continue workflow seamlessly

---

## 📄 Files to Keep Open

Keep these files open in IDE for new session:
- .claude/workflow-state.json
- .claude/logs/contexts/[workflow-id]/HANDOFF_CONTEXT.md
- [Key files from previous phases]

**Context preserved! Ready for new session! ✅**
```

---

## 📄 HANDOFF_CONTEXT.md Template

```markdown
# Workflow Handoff Context

**Workflow ID:** add-user-authentication-20251124-120000  
**Workflow Name:** add-user-authentication  
**Handoff Date:** 2025-11-24T15:30:00Z  
**Current Phase:** 4/9 (Test Planning)  
**Tokens Used:** 160,000 / 200,000 (80%)

---

## 🎯 Project Context

**Task:** Add JWT-based user authentication

**Tech Stack:**
- React Native + Expo
- TypeScript
- Zustand (state)
- React Navigation

**Target:** Mobile app (iOS + Android)

---

## ✅ Completed Phases

### Phase 1: Requirements Analysis ✅
**Duration:** 7 min  
**Tokens:** 25K  
**Key Decisions:**
- Use JWT tokens (not OAuth)
- Store in secure storage
- Auto-refresh on 401

**Deliverables:**
- `deliverables/01-requirements-analysis/requirements.md`

### Phase 2: Technical Planning ✅
**Duration:** 12 min  
**Tokens:** 45K  
**Key Decisions:**
- 3-component architecture:
  1. Login screen
  2. Auth context provider
  3. Secure storage service
- Use react-hook-form for forms
- Yup validation

**Deliverables:**
- `deliverables/02-technical-planning/tech-spec.md`
- `deliverables/02-technical-planning/architecture.md`

### Phase 3: Design Review ✅
**Duration:** 8 min  
**Tokens:** 30K  
**Key Decisions:**
- Use existing Button component
- Follow brand colors
- Add loading states

**Deliverables:**
- `deliverables/03-design-review/ui-breakdown.md`

### Phase 4: Test Planning ✅
**Duration:** 10 min  
**Tokens:** 35K  
**Key Decisions:**
- Target: 85% coverage
- Unit + Integration tests
- Mock API calls

**Deliverables:**
- `deliverables/04-test-planning/test-plan.md`
- `deliverables/04-test-planning/test-cases.md`

---

## 🔄 Next Phase

**Phase 5a: TDD RED (Write Failing Tests)**

**What to do:**
1. Create test files:
   - `auth/__tests__/Login.test.tsx`
   - `auth/__tests__/AuthContext.test.tsx`
   - `auth/__tests__/secureStorage.test.ts`

2. Write tests based on test cases from Phase 4

3. Verify all tests FAIL (RED phase)

**Estimated:** 15 min, ~40K tokens

---

## 📂 Files Created So Far

```
src/
├── auth/
│   ├── Login.tsx           (planned in Phase 2)
│   ├── AuthContext.tsx     (planned in Phase 2)
│   └── secureStorage.ts    (planned in Phase 2)
└── types/
    └── auth.types.ts       (planned in Phase 2)
```

**Note:** Files planned but NOT yet created. Phase 5 will create them.

---

## 🎨 Design Tokens Used

```typescript
colors: {
  primary: '#007AFF',
  error: '#FF3B30',
  background: '#FFFFFF'
}

spacing: {
  sm: 8,
  md: 16,
  lg: 24
}
```

---

## 🧪 Test Strategy

**Coverage Target:** 85%

**Test Types:**
1. **Unit Tests:**
   - Login form validation
   - Token storage/retrieval
   - Auth state management

2. **Integration Tests:**
   - Login flow end-to-end
   - Token refresh flow
   - Logout flow

**Mocking:**
- API calls with MSW
- AsyncStorage
- React Navigation

---

## 💡 Important Notes

1. **DO NOT** modify existing auth flow - it's used elsewhere
2. **MUST** handle offline scenarios
3. **REMEMBER** to add loading states
4. Token refresh should be silent (no user action)

---

## 📊 Progress Summary

**Completed:** 4/9 phases (44%)  
**Time Spent:** 37 min  
**Tokens Used:** 135K / 200K (67.5%)  
**Quality:** All phases approved first time ✅

**Velocity:** Good - on track for 2h total

---

## 🔄 Resume Command

```bash
# In new Cursor session, run:
workflow:resume add-user-authentication-20251124-120000

# Or natural language:
"Continue workflow add-user-authentication-20251124-120000"
```

---

## 📝 Context for Agent

**You are continuing this workflow. Key context:**

1. **Already decided:** JWT auth, 3 components, 85% coverage
2. **Next phase:** Write failing tests (TDD RED)
3. **Files to create:** Tests first, then implementation
4. **Follow:** Test plan from Phase 4 deliverables

**Load these files first:**
- `.claude/workflow-state.json`
- `.claude/logs/contexts/[workflow-id]/deliverables/04-test-planning/test-plan.md`
- `.claude/logs/contexts/[workflow-id]/deliverables/02-technical-planning/tech-spec.md`

**Then proceed with Phase 5a!**

---

*Handoff prepared: 2025-11-24T15:30:00Z*  
*Ready for new session continuation*

