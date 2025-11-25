# Command: workflow:modify

**Version:** 1.0.0  
**Purpose:** Request modifications to current phase without full reject/restart  
**Trigger:** User types `/workflow:modify <instructions>` at approval gate

---

## 🎯 What This Command Does

1. Keeps current phase state
2. Applies specific modifications
3. Updates deliverables
4. Shows updated approval gate

**Faster than reject** - only changes specific things, doesn't restart entire phase.

---

## 📋 Command Format

```
/workflow:modify <instructions>

Examples:
/workflow:modify Add accessibility labels to all buttons
/workflow:modify Change coverage threshold from 85% to 90%
/workflow:modify Extract validation logic into separate utility function
/workflow:modify Update component names to be more descriptive
```

---

## 🔄 Modify vs Reject

### Use `/workflow:reject` when:
- Fundamental approach is wrong
- Need to rethink architecture
- Major changes required
- Want to start over

### Use `/workflow:modify` when:
- Minor adjustments needed
- Specific improvements identified
- Quick fixes required
- Just want to tweak details

---

## ⚙️ Execution Flow

```
User types /workflow:modify <instructions>
    ↓
Parse modification instructions
    ↓
Apply changes to deliverables
    ↓
Update existing files (don't recreate)
    ↓
Show updated approval gate
```

---

## 📊 Modification Examples

### Example 1: Add Missing Test Cases
```
User: /workflow:modify Add test cases for network timeout scenarios

Agent Response:
✏️  Applying modifications...

Changes:
- Added 3 test cases to PostCaptionEditor.test.tsx
  - TC-021: Should handle network timeout
  - TC-022: Should retry on timeout
  - TC-023: Should show timeout error message

Updated test count: 73 → 76 tests

═══════════════════════════════════════════════════════════
🎯 PHASE 4 UPDATED: Test Planning
═══════════════════════════════════════════════════════════

✅ Modifications Applied:
   • Added 3 network timeout test cases
   • Updated test plan document

📊 Updated Stats:
   Total test cases: 76 (was 73)

[Approval gate with updated info...]
```

### Example 2: Change Naming Convention
```
User: /workflow:modify Rename PostCaptionEditor to CaptionEditor for consistency

Agent Response:
✏️  Applying modifications...

Changes:
- Renamed PostCaptionEditor → CaptionEditor
- Updated imports in:
  - SocialMarketingCompositePost.phone.tsx
  - PostCaptionEditor.test.tsx (now CaptionEditor.test.tsx)
- Updated documentation references

Files affected: 3 files

[Shows updated approval gate...]
```

### Example 3: Adjust Coverage Threshold
```
User: /workflow:modify Increase coverage threshold to 90%

Agent Response:
✏️  Applying modifications...

Changes:
- Updated coverage threshold: 85% → 90%
- Updated jest.config.js
- Updated test plan document
- Recalculated required test cases

Impact:
- Need 12 more test cases to reach 90%
- Current: 73 tests (85% coverage)
- Target: 85 tests (90% coverage)

Would you like me to:
a) Generate additional test cases now
b) Update plan only (add tests in Phase 5a)

Your choice: [Enter a or b]
```

### Example 4: Extract Function
```
User: /workflow:modify Extract validation logic from handleSaveCaption into validateCaption utility

Agent Response:
✏️  Applying modifications...

Changes:
- Created utils/validateCaption.ts
- Extracted validation logic (15 lines)
- Updated handleSaveCaption to use utility
- Added tests for validateCaption

Files:
- Created: utils/validateCaption.ts
- Created: utils/validateCaption.test.ts
- Modified: useSocialMarketingLogic.ts

Code quality:
- Complexity reduced: 12 → 8
- Reusability improved ✅

[Shows updated approval gate...]
```

---

## 🔧 Modification Types

### Code Modifications
- Rename components/functions
- Extract functions/utilities
- Add missing functionality
- Fix code issues
- Optimize performance

### Test Modifications
- Add test cases
- Update test data
- Fix flaky tests
- Increase coverage
- Add edge case tests

### Documentation Modifications
- Add missing sections
- Clarify descriptions
- Update diagrams
- Fix typos
- Add examples

### Configuration Modifications
- Change thresholds
- Update settings
- Modify constants
- Adjust parameters

---

## 📊 State Update

```json
{
  "phases": {
    "4": {
      "name": "Test Planning",
      "status": "completed",
      "modifications": [
        {
          "timestamp": "2025-11-24T15:45:00Z",
          "instruction": "Add test cases for network timeout scenarios",
          "changes": [
            "Added 3 test cases",
            "Updated test plan document"
          ],
          "files_affected": 2
        }
      ]
    }
  }
}
```

---

## ⚡ Quick Modifications

Some modifications are so common, they have shortcuts:

```
/workflow:modify +tests    → Add more test cases
/workflow:modify +coverage → Increase coverage threshold
/workflow:modify +docs     → Add more documentation
/workflow:modify +types    → Improve TypeScript types
/workflow:modify +a11y     → Add accessibility improvements
```

---

## 💡 Best Practices

### Be Specific
```
✅ Good: /workflow:modify Add JSDoc comments to all public functions
❌ Vague: /workflow:modify Add comments
```

### One Modification at a Time
```
✅ Good: /workflow:modify Rename PostCaptionEditor to CaptionEditor
✅ Then: /workflow:modify Add accessibility labels
❌ Bad: /workflow:modify Rename component and add accessibility and fix types
```

### Check Impact
```
After modification, agent shows:
- What changed
- Files affected
- Impact on tests/coverage
- Any new issues introduced
```

---

## 🎯 What Happens Next

After modification:
1. Changes applied
2. Tests re-run (if code changed)
3. Updated approval gate shown
4. Can approve, modify again, or reject

---

## 🔄 Modify Multiple Times

You can modify multiple times before approving:

```
User: /workflow:modify Add accessibility labels
Agent: [Makes changes] → Approval gate

User: /workflow:modify Also add loading skeletons
Agent: [Makes changes] → Approval gate

User: /workflow:modify Increase button touch targets to 44pt
Agent: [Makes changes] → Approval gate

User: /workflow:approve → Proceeds to next phase
```

---

**Status:** Active command  
**Related:** workflow:approve, workflow:reject, workflow:status

