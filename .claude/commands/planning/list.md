# Command: planning:list

**Purpose:** List all saved plans  
**Aliases:** `plans`, `list plans`, `plan:list`

---

## 🎯 Overview

Display all plans created with the `planning` command, showing status, dates, and quick actions.

---

## 📋 Usage

```bash
# List all plans
planning:list

# Filter by status
planning:list --status=pending

# Sort by date
planning:list --sort=date

# Show details
planning:list --detailed
```

---

## 📊 Output

```markdown
╔══════════════════════════════════════════════════════════╗
║  📋 SAVED PLANS                                          ║
╚══════════════════════════════════════════════════════════╝

## Active Plans (2)

### 1. refactor-userprofile-20251124-150000
**Task:** Refactor UserProfile component  
**Status:** ⏸️  Pending execution  
**Created:** 2025-11-24 15:00:00  
**Updated:** 2025-11-24 16:30:00 (v2)  
**Estimated:** 4.5 hours  
**Risk:** Low  

**Actions:**
- `execute refactor-userprofile-20251124-150000`
- `planning:refine refactor-userprofile-20251124-150000`
- `document spec refactor-userprofile-20251124-150000`

---

### 2. add-dark-mode-20251123-140000
**Task:** Add dark mode support  
**Status:** ⏸️  Pending execution  
**Created:** 2025-11-23 14:00:00  
**Estimated:** 6 hours  
**Risk:** Medium  

**Actions:**
- `execute add-dark-mode-20251123-140000`
- `planning:refine add-dark-mode-20251123-140000`

---

## Executed Plans (3)

### 3. implement-authentication-20251120-100000
**Task:** Implement user authentication  
**Status:** ✅ Executed & completed  
**Created:** 2025-11-20 10:00:00  
**Executed:** 2025-11-20 11:00:00  
**Completed:** 2025-11-20 15:30:00  
**Actual Time:** 4.5 hours (estimated: 5 hours)  

**Workflow:** `execute-implement-authentication-20251120-100000`

---

### 4. optimize-performance-20251118-090000
**Task:** Optimize app performance  
**Status:** ✅ Executed & completed  
**Created:** 2025-11-18 09:00:00  
**Executed:** 2025-11-18 10:00:00  
**Completed:** 2025-11-18 17:00:00  
**Actual Time:** 7 hours (estimated: 8 hours)  

**Workflow:** `execute-optimize-performance-20251118-090000`

---

### 5. refactor-api-layer-20251115-130000
**Task:** Refactor API layer  
**Status:** ❌ Executed but abandoned  
**Created:** 2025-11-15 13:00:00  
**Executed:** 2025-11-15 14:00:00  
**Abandoned:** 2025-11-15 16:00:00  
**Reason:** Scope changed, created new plan

---

## Archived Plans (1)

### 6. migrate-to-typescript-20251110-110000
**Task:** Migrate codebase to TypeScript  
**Status:** 📦 Archived  
**Created:** 2025-11-10 11:00:00  
**Archived:** 2025-11-12 10:00:00  
**Reason:** Completed outside CCPM

---

**Total Plans:** 6  
**Pending:** 2  
**Executed:** 3 (2 completed, 1 abandoned)  
**Archived:** 1

---

**Quick Actions:**
- Create new: `planning "Task description"`
- Execute: `execute [plan-id]`
- Refine: `planning:refine [plan-id]`
- Archive: `planning:archive [plan-id]`
```

---

## 🎯 Filter Options

### By Status

```bash
# Pending plans only
planning:list --status=pending

# Executed plans only
planning:list --status=executed

# Completed plans only
planning:list --status=completed

# All plans
planning:list --status=all
```

### By Date

```bash
# This week
planning:list --date=week

# This month
planning:list --date=month

# Last 7 days
planning:list --date=7d

# Custom range
planning:list --from=2025-11-01 --to=2025-11-24
```

### By Risk

```bash
# High risk plans
planning:list --risk=high

# Medium risk plans
planning:list --risk=medium

# Low risk plans
planning:list --risk=low
```

---

## 📊 Statistics

```bash
planning:list --stats
```

**Output:**

```markdown
## 📊 Planning Statistics

**Total Plans:** 6

**By Status:**
- Pending: 2 (33%)
- Completed: 2 (33%)
- Abandoned: 1 (17%)
- Archived: 1 (17%)

**Accuracy:**
- On-time: 2/3 (67%)
- Under estimate: 2/3 (67%)
- Over estimate: 0/3 (0%)
- Average variance: -8% (faster than estimated)

**Success Rate:**
- Completed: 2/3 (67%)
- Abandoned: 1/3 (33%)

**Most Common:**
- Risk Level: Low (4 plans)
- Duration: 4-6 hours (3 plans)
- Type: Refactoring (3 plans)
```

---

## 🔗 Related Commands

```bash
planning "Task"              # Create new plan
planning:list                # List all plans
planning:refine [plan-id]    # Update plan
planning:archive [plan-id]   # Archive plan
execute [plan-id]            # Execute plan
```

---

**Command:** planning:list  
**Version:** 1.0.0  
**Added:** CCPM v4.3

