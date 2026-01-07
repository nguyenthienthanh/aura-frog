# Self-Improve Skill

**Type:** Meta
**Trigger:** `/learn:apply`, after analysis
**Auto-invoke:** No (requires user approval)

---

## Purpose

Apply learned improvements to the Aura Frog plugin:
- Update rules based on patterns
- Adjust agent routing
- Modify workflow configurations
- Generate new knowledge base entries

---

## Usage

```bash
/learn:apply                    # Review and apply pending improvements
/learn:apply --auto             # Auto-apply high-confidence (≥0.8) suggestions
/learn:apply --preview          # Preview changes without applying
/learn:apply --id <pattern_id>  # Apply specific pattern
```

---

## Improvement Types

### 1. Rule Updates

When patterns suggest rule modifications:

```yaml
# Before analysis
rules:
  code_coverage_threshold: 80

# After learning shows 85% coverage correlates with fewer bugs
rules:
  code_coverage_threshold: 85
```

Implementation:
1. Identify pattern suggesting rule change
2. Generate rule modification
3. Create backup of current rule
4. Apply modification
5. Mark pattern as applied in Supabase

### 2. Agent Routing

When agent success rates indicate better routing:

```yaml
# Update agent-detector scoring
agent_overrides:
  react_component:
    primary: react-expert
    confidence_boost: 10
  api_endpoint:
    primary: nodejs-expert
    secondary: python-expert
```

Implementation:
1. Query agent success rates by task type
2. Calculate optimal routing
3. Update agent-detector configuration
4. Test with sample tasks

### 3. Workflow Adjustments

When workflow patterns suggest changes:

```yaml
# Add auto-stop threshold adjustment
workflow:
  phase_5a:
    timeout: 300  # increased from 180
    batch_size: 50  # for large test suites
```

### 4. Knowledge Base

When insights should be preserved:

```markdown
# New knowledge entry
Type: tip
Title: Use TDD for API endpoints
Content: Analysis of 47 workflows shows TDD approach for API
         endpoints reduces bug count by 40% compared to non-TDD.
Tags: [workflow, tdd, api]
Priority: 75
```

---

## Safety Guards

### Approval Required

All improvements require explicit approval unless:
- `--auto` flag is used AND
- Confidence ≥ 0.8 AND
- Pattern frequency ≥ 5

### Rollback Support

Every applied improvement:
1. Creates backup of original configuration
2. Logs the change with timestamp
3. Can be rolled back via `/learn:rollback <change_id>`

### Validation

Before applying:
1. Syntax validation of generated rules
2. Conflict detection with existing rules
3. Impact assessment (files affected)

---

## Apply Process

### Step 1: Fetch Pending Improvements

```sql
SELECT * FROM v_improvement_suggestions
WHERE applied = FALSE
ORDER BY confidence DESC;
```

### Step 2: Generate Changes

For each suggestion:
1. Determine target file(s)
2. Generate modification
3. Calculate impact

### Step 3: Present for Review

```markdown
## Pending Improvements

### 1. Increase Phase 5a timeout (ID: abc123)
**Confidence:** 85%
**Frequency:** 8 occurrences
**Impact:** Modifies `ccpm-config.yaml`

**Change:**
```diff
workflow:
  phase_5a:
-   timeout: 180
+   timeout: 300
```

**Evidence:**
- 8 workflows failed with timeout in Phase 5a
- Average test count: 127 files
- Average completion time needed: 245s

[ ] Apply  [ ] Skip  [ ] Modify
```

### Step 4: Apply Changes

1. Create backup: `backups/ccpm-config.yaml.20260107`
2. Apply modification
3. Update Supabase: `UPDATE af_learned_patterns SET applied=TRUE WHERE id=...`
4. Log change

---

## Rollback

```bash
/learn:rollback <change_id>     # Rollback specific change
/learn:rollback --list          # List recent changes
/learn:rollback --all           # Rollback all changes from today
```

---

## Example Session

```
User: /learn:apply

Claude: 🐸 Self-Improve: Found 3 pending improvements

## Improvement 1/3: Agent Routing Update
Confidence: 92% | Frequency: 28

**Suggestion:** Default react-expert for .tsx files

**Evidence:**
- 28 workflows with React component tasks
- react-expert success rate: 96%
- Current default (web-expert) success rate: 78%

**Change to:** `agents/smart-agent-detector.md`
```diff
react_patterns:
- default_agent: web-expert
+ default_agent: react-expert
+ file_extensions: [.tsx, .jsx]
```

Apply this improvement? [y/n/skip/modify]:

User: y

Claude: ✅ Applied improvement 1/3
Backup saved to: backups/smart-agent-detector.md.20260107

## Improvement 2/3: ...
```

---

## Configuration

In `ccpm-config.yaml`:

```yaml
learning:
  self_improve:
    enabled: true
    auto_apply_threshold: 0.8  # Confidence threshold for --auto
    min_frequency: 5           # Minimum occurrences for auto-apply
    backup_dir: backups/       # Where to store backups
    max_auto_per_day: 10       # Limit auto-applies per day
```

---

**Version:** 1.0.0
