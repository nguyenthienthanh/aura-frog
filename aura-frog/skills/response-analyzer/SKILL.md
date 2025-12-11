---
name: response-analyzer
description: "MCP Response Analyzer pattern - Write large responses to temp files, load summaries into context"
autoInvoke: false
priority: medium
triggers:
  - "large response"
  - "analyze output"
  - "response:save"
allowed-tools: Read, Write, Bash
---

# MCP Response Analyzer

**Priority:** MEDIUM - Use for large outputs
**Version:** 1.0.0

---

## Purpose

Reduce context bloat by:
1. Writing large responses to `/tmp/aura-frog/`
2. Loading only **summaries** into conversation context
3. Referencing full data only when needed

---

## When to Use

```toon
triggers[5]{scenario,threshold,action}:
  Command output,>100 lines,Save to temp + summarize
  API response,>5KB,Save JSON + extract key fields
  File search results,>50 files,Save list + show top 10
  Test output,>50 lines,Save full + summarize pass/fail
  Build output,>100 lines,Save full + show errors only
```

---

## Temp Directory Structure

```
/tmp/aura-frog/
├── responses/
│   ├── cmd-{timestamp}.txt      # Command outputs
│   ├── api-{timestamp}.json     # API responses
│   └── search-{timestamp}.txt   # Search results
├── summaries/
│   └── summary-{timestamp}.md   # Generated summaries
└── session/
    └── {session-id}/            # Session-specific data
```

---

## Usage Patterns

### Pattern 1: Large Command Output

**Before (bloats context):**
```bash
npm test
# 500 lines of output loaded into context
```

**After (optimized):**
```bash
# Run and save
npm test > /tmp/aura-frog/responses/test-$(date +%s).txt 2>&1

# Load summary only
echo "Test Results Summary:"
grep -E "(PASS|FAIL|Tests:|Suites:)" /tmp/aura-frog/responses/test-*.txt | tail -10
```

### Pattern 2: API Response Analysis

**Before:**
```bash
curl https://api.example.com/users
# Large JSON response in context
```

**After:**
```bash
# Save full response
curl https://api.example.com/users > /tmp/aura-frog/responses/api-$(date +%s).json

# Extract summary
jq '{total: .data | length, first_3: .data[:3] | map(.name)}' /tmp/aura-frog/responses/api-*.json
```

### Pattern 3: File Search Results

**Before:**
```bash
find . -name "*.ts"
# 200+ files listed in context
```

**After:**
```bash
# Save full list
find . -name "*.ts" > /tmp/aura-frog/responses/search-$(date +%s).txt

# Show summary
echo "Found $(wc -l < /tmp/aura-frog/responses/search-*.txt) TypeScript files"
echo "Sample:"
head -10 /tmp/aura-frog/responses/search-*.txt
```

---

## Commands

### Save Response
```bash
# Save command output
bash scripts/response-save.sh "npm test" "test-results"

# Output:
# Saved to: /tmp/aura-frog/responses/test-results-1234567890.txt
# Summary: 150 tests, 148 passed, 2 failed
```

### Load Summary
```bash
# Get summary of saved response
bash scripts/response-summary.sh test-results-1234567890

# Output:
# File: test-results-1234567890.txt
# Size: 45KB
# Lines: 500
# Key findings: 2 failed tests in auth.test.ts
```

### Reference Full Data
```bash
# When full data needed
cat /tmp/aura-frog/responses/test-results-1234567890.txt
```

---

## Integration with Workflow

```toon
workflow_integration[4]{phase,use_case,pattern}:
  Phase 5a (Tests),Save test output,Pattern 1
  Phase 6 (Review),Save linter output,Pattern 1
  Phase 7 (Verify),Save coverage report,Pattern 1
  Any,Large API responses,Pattern 2
```

---

## Cleanup

```bash
# Auto-cleanup old files (run daily)
find /tmp/aura-frog -mtime +1 -delete

# Manual cleanup
rm -rf /tmp/aura-frog/responses/*
```

---

## Token Savings

```toon
savings[4]{scenario,without,with,saved}:
  500-line test output,~2000 tokens,~100 tokens,95%
  Large JSON response,~5000 tokens,~200 tokens,96%
  200 file search,~800 tokens,~100 tokens,87%
  Build log,~3000 tokens,~150 tokens,95%
```

---

## Best Practices

1. **Always summarize first** - Load full data only if needed
2. **Use timestamps** - Prevent file collisions
3. **Clean up regularly** - Don't let temp grow
4. **Reference by ID** - "See test-results-1234567890 for full output"

---

**Note:** This pattern is especially useful during TDD phases where test output can be verbose.
