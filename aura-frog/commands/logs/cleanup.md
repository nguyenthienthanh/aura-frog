# Command: logs:cleanup

**Command:** `logs:cleanup [days]`
**Agent:** lead

---

## Purpose

Clean old log files, workflow data, and session artifacts older than X days.

---

## Usage

```bash
# Clean logs older than 30 days (default)
logs:cleanup

# Clean logs older than 7 days
logs:cleanup 7

# Preview what would be deleted (no actual deletion)
logs:cleanup 14 --dry-run
```

---

## Parameters

```toon
params[2]{name,type,default,description}:
  days,number,30,Delete files older than this many days
  --dry-run,flag,false,Preview only - no files deleted
```

---

## Targets

```toon
targets[6]{path,content,action}:
  .claude/logs/workflows/{id}/,Workflow state + deliverables + phase logs,Delete entire directory
  .claude/logs/workflows/commands.log,Bash command history,Truncate entries older than X days
  .claude/logs/audio/,Audio recordings,Delete old files
  .claude/logs/figma/,Design file logs,Delete old files
  .claude/logs/jira/,JIRA issue tracking,Delete old files
  aura-frog/logs/,Plugin contexts + JIRA + workflow logs,Delete old files
```

---

## Execution Flow

```toon
steps[6]{step,action}:
  1,Parse days parameter (default: 30) and flags
  2,Scan all target directories for files older than X days
  3,Calculate total files and size to be cleaned
  4,Show preview summary table
  5,If --dry-run: stop. Otherwise: delete files and directories
  6,Show cleanup summary with freed space
```

---

## Implementation

When this command is invoked, execute the following bash operations:

### 1. Set Parameters
```bash
DAYS=${1:-30}
DRY_RUN=false
[[ "$*" == *"--dry-run"* ]] && DRY_RUN=true
LOG_BASE=".claude/logs"
PLUGIN_LOGS="aura-frog/logs"
```

### 2. Find Old Files
```bash
# Find all files older than X days in log directories
find "$LOG_BASE" -type f -mtime +$DAYS -not -name ".gitkeep" 2>/dev/null
find "$PLUGIN_LOGS" -type f -mtime +$DAYS -not -name ".gitkeep" 2>/dev/null

# Find old workflow directories (by modification time of workflow-state.json)
find "$LOG_BASE/workflows" -maxdepth 1 -mindepth 1 -type d -mtime +$DAYS 2>/dev/null
```

### 3. Truncate commands.log
```bash
# Remove lines older than X days from commands.log
# Lines are formatted: [YYYY-MM-DD HH:MM:SS] ...
CUTOFF_DATE=$(date -v-${DAYS}d '+%Y-%m-%d' 2>/dev/null || date -d "${DAYS} days ago" '+%Y-%m-%d')
# Keep only lines with dates >= cutoff
```

### 4. Delete or Preview
```bash
if [ "$DRY_RUN" = true ]; then
  echo "DRY RUN - No files will be deleted"
  # Show files that would be deleted with sizes
else
  # Delete files and empty directories (preserve .gitkeep)
  find "$LOG_BASE" -type f -mtime +$DAYS -not -name ".gitkeep" -delete
  find "$PLUGIN_LOGS" -type f -mtime +$DAYS -not -name ".gitkeep" -delete
  # Remove empty workflow directories
  find "$LOG_BASE/workflows" -maxdepth 1 -mindepth 1 -type d -empty -delete
fi
```

---

## Output

### Dry Run
```
🧹 Log Cleanup Preview (dry run)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Threshold: 30 days (before 2026-02-08)

| Category         | Files | Size    |
|------------------|-------|---------|
| Workflow dirs    | 12    | 2.4 MB  |
| Command logs     | 1     | 450 KB  |
| Audio logs       | 3     | 1.2 MB  |
| Figma logs       | 0     | 0 B     |
| JIRA logs        | 5     | 120 KB  |
| Plugin logs      | 8     | 340 KB  |
| **Total**        | **29**| **4.5 MB** |

Run without --dry-run to delete these files.
```

### Actual Cleanup
```
🧹 Log Cleanup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Threshold: 30 days (before 2026-02-08)

Deleted: 29 files (4.5 MB freed)
Preserved: .gitkeep files, files newer than 30 days
```

---

**Command:** logs:cleanup
