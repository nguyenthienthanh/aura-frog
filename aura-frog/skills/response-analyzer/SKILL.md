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
user-invocable: false
---

# MCP Response Analyzer

Reduce context bloat: write large outputs to `/tmp/aura-frog/`, load only summaries.

---

## Triggers

```toon
triggers[5]{scenario,threshold,action}:
  Command output,>100 lines,Save to temp + summarize
  API response,>5KB,Save JSON + extract key fields
  File search results,>50 files,Save list + show top 10
  Test output,>50 lines,Save full + summarize pass/fail
  Build output,>100 lines,Save full + show errors only
```

---

## Directory

```
/tmp/aura-frog/
├── responses/   # cmd-*.txt, api-*.json, search-*.txt
├── summaries/   # summary-*.md
└── session/     # per-session data
```

---

## Patterns

### Large Command Output
```bash
npm test > /tmp/aura-frog/responses/test-$(date +%s).txt 2>&1
grep -E "(PASS|FAIL|Tests:|Suites:)" /tmp/aura-frog/responses/test-*.txt | tail -10
```

### API Response
```bash
curl url > /tmp/aura-frog/responses/api-$(date +%s).json
jq '{total: .data | length, first_3: .data[:3] | map(.name)}' /tmp/aura-frog/responses/api-*.json
```

### File Search
```bash
find . -name "*.ts" > /tmp/aura-frog/responses/search-$(date +%s).txt
echo "Found $(wc -l < file) TypeScript files"; head -10 file
```

---

## Token Savings

```toon
savings[4]{scenario,without,with,saved}:
  500-line test output,~2000,~100,95%
  Large JSON response,~5000,~200,96%
  200 file search,~800,~100,87%
  Build log,~3000,~150,95%
```

---

## Integration

```toon
workflow_integration[4]{phase,use_case,pattern}:
  Phase 2 (Test RED),Test output,Command
  Phase 4 (Review),Linter output,Command
  Phase 4 (Review),Coverage report,Command
  Any,Large API responses,API
```

**Cleanup:** `find /tmp/aura-frog -mtime +1 -delete`

---
