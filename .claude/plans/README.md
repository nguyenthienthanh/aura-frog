# 📋 Plans Directory

**Purpose:** Stores execution plans created with `planning` command

---

## 📁 Structure

```
plans/
├── README.md
├── refactor-userprofile-20251124-150000.md
├── add-dark-mode-20251123-140000.md
└── implement-auth-20251120-100000.md
```

---

## 📝 Plan Format

Each plan file contains:
- Problem analysis
- Solution options (with decision matrix)
- Selected solution details
- Technical approach
- Implementation steps
- File structure
- Testing strategy
- Risk assessment

---

## 🎯 Usage

### Create Plan
```bash
planning "Refactor UserProfile component"
# Creates: refactor-userprofile-YYYYMMDD-HHMMSS.md
```

### List Plans
```bash
planning:list
# Shows all plans with status
```

### Refine Plan
```bash
planning:refine refactor-userprofile-20251124-150000
# Updates existing plan
```

### Execute Plan
```bash
execute refactor-userprofile-20251124-150000
# Skips Phase 1-4, goes straight to implementation
```

---

## 📊 Plan Lifecycle

```
Created → Pending → Executed → Completed
                 ↓
              Refined (optional)
                 ↓
              Archived (when outdated)
```

---

## 🔍 Finding Plans

**By status:**
```bash
planning:list --status=pending
```

**By date:**
```bash
planning:list --date=week
```

**By risk:**
```bash
planning:list --risk=high
```

---

**Note:** Plans are separate from workflows. One plan can be executed multiple times or serve as reference documentation.

