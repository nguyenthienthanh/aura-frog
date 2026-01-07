# /learn:apply

**Category:** Learning
**Purpose:** Apply learned improvements to the plugin

---

## Usage

```bash
/learn:apply                    # Interactive review and apply
/learn:apply --auto             # Auto-apply high-confidence (≥0.8)
/learn:apply --preview          # Preview without applying
/learn:apply --id <pattern_id>  # Apply specific improvement
```

---

## Execution Steps

When user runs `/learn:apply`, Claude should:

### Step 1: Fetch Pending Improvements

Query Supabase for unapplied suggestions:

```bash
curl -s "${SUPABASE_URL}/rest/v1/v_improvement_suggestions?applied=eq.false&order=confidence.desc" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"
```

If empty array `[]`, report "No pending improvements".

### Step 2: Parse and Display Each Suggestion

For each suggestion in the response:

```json
{
  "id": "abc123",
  "pattern_type": "optimization",
  "category": "agent",
  "description": "react-expert has 96% success for React components",
  "suggested_action": "Route .tsx files to react-expert by default",
  "confidence": 0.92,
  "frequency": 28
}
```

Display to user:

```markdown
## Improvement 1/3: Route React to react-expert

**ID:** abc123
**Confidence:** 92% ████████████████████░░
**Frequency:** 28 occurrences
**Category:** agent

### Suggestion
Route .tsx files to react-expert by default

### Proposed Change
File: `agents/smart-agent-detector.md`

Add to file pattern matching section:
```diff
+ - extension: [.tsx, .jsx]
+   agent: react-expert
+   confidence: 90
```

**Action:** [a]pply | [s]kip | [q]uit
```

### Step 3: Apply Changes (if user approves)

1. **Create backup:**
```bash
mkdir -p backups
cp agents/smart-agent-detector.md "backups/smart-agent-detector.md.$(date +%Y%m%d)"
```

2. **Make the edit** using Edit tool

3. **Mark as applied in Supabase:**
```bash
curl -X PATCH "${SUPABASE_URL}/rest/v1/af_learned_patterns?id=eq.abc123" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"applied": true, "applied_at": "2026-01-07T10:30:00Z"}'
```

4. **Confirm to user:**
```
✅ Applied: Route React to react-expert
   Backup: backups/smart-agent-detector.md.20260107
```

### Step 4: Continue to Next Improvement

Repeat steps 2-3 for each pending improvement until:
- User quits with 'q'
- All improvements processed

---

## Auto Mode (--auto)

When `--auto` flag is used:

```bash
# Only fetch high-confidence suggestions
curl -s "${SUPABASE_URL}/rest/v1/v_improvement_suggestions?applied=eq.false&confidence=gte.0.8&order=confidence.desc" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"
```

Apply each without prompting, but:
- Create backups for all changes
- Show summary at end
- Limit to 10 per run

---

## Preview Mode (--preview)

Show what would be applied without making changes:

```markdown
## Preview: Pending Improvements

### Would Apply (high confidence)
1. Route React to react-expert (92%)
2. Increase Phase 5a timeout (85%)

### Would Skip (low confidence)
3. Add test batching (62%) - needs more data

**Total:** 2 would apply, 1 would skip
```

---

## Improvement Types & Target Files

| Category | Target File | Change Type |
|----------|-------------|-------------|
| `agent` | `agents/smart-agent-detector.md` | Add routing rule |
| `workflow` | `ccpm-config.yaml` | Adjust settings |
| `phase` | `skills/workflow-orchestrator/SKILL.md` | Update phase config |
| `rule` | `rules/*.md` | Add/modify rule |
| `knowledge` | Supabase `af_knowledge_base` | Insert entry |

---

## Review Loop (Interactive Mode)

For each improvement:

```markdown
## Improvement {n}/{total}: {title}

**ID:** {pattern_id}
**Confidence:** {confidence}%
**Frequency:** {frequency} occurrences
**Category:** {category}

### Suggestion
{description}

### Evidence
{evidence_summary}

### Proposed Change
File: `{target_file}`

```diff
- {old_content}
+ {new_content}
```

**Action:** [a]pply | [s]kip | [m]odify | [q]uit
```

### 4. Apply Changes

```javascript
const fs = require('fs');
const path = require('path');

// Create backup
const backupDir = 'backups';
const timestamp = new Date().toISOString().slice(0, 10);
const backupPath = path.join(backupDir, `${filename}.${timestamp}`);
fs.copyFileSync(targetFile, backupPath);

// Apply change
fs.writeFileSync(targetFile, newContent);

// Mark as applied in Supabase
await supabaseRequest(
  'af_learned_patterns',
  'PATCH',
  { applied: true, applied_at: new Date().toISOString() },
  { id: `eq.${patternId}` }
);

console.log(`✅ Applied: ${title}`);
console.log(`   Backup: ${backupPath}`);
```

---

## Auto Mode (`--auto`)

Automatically applies improvements that meet ALL criteria:
- Confidence ≥ 0.8 (80%)
- Frequency ≥ 5 occurrences
- Not already applied
- Daily limit not exceeded (default: 10)

```javascript
const autoThreshold = 0.8;
const minFrequency = 5;
const dailyLimit = 10;

const autoApplicable = suggestions.filter(s =>
  s.confidence >= autoThreshold &&
  s.frequency >= minFrequency
);

console.log(`Found ${autoApplicable.length} auto-applicable improvements`);

let applied = 0;
for (const suggestion of autoApplicable) {
  if (applied >= dailyLimit) {
    console.log(`⚠️ Daily limit (${dailyLimit}) reached`);
    break;
  }

  // Apply with backup
  await applyImprovement(suggestion);
  applied++;
}

console.log(`✅ Auto-applied ${applied} improvements`);
```

---

## Preview Mode (`--preview`)

Shows what would be applied without making changes:

```markdown
## Preview: Pending Improvements

### Would Apply (--auto eligible)

1. **Route React to react-expert** (92% confidence)
   - File: agents/smart-agent-detector.md
   - Lines affected: 3

2. **Increase Phase 5a timeout** (85% confidence)
   - File: ccpm-config.yaml
   - Lines affected: 1

### Would Skip (below threshold)

3. **Add test batching** (62% confidence)
   - Reason: Below 80% threshold
   - Needs: 3 more occurrences

### Summary
- Auto-applicable: 2
- Manual review: 1
- Total pending: 3
```

---

## Change Types

### Rule File Updates

```yaml
# Target: rules/some-rule.md
type: rule_update
file: rules/some-rule.md
section: "Thresholds"
old: "coverage_threshold: 80"
new: "coverage_threshold: 85"
```

### Agent Configuration

```yaml
# Target: agents/smart-agent-detector.md
type: agent_routing
file: agents/smart-agent-detector.md
section: "Pattern Matching"
addition: |
  - pattern: "*.tsx"
    agent: react-expert
    confidence_boost: 10
```

### Workflow Configuration

```yaml
# Target: ccpm-config.yaml
type: workflow_config
file: ccpm-config.yaml
path: "workflow.phase_5a.timeout"
old: 180
new: 300
```

### Knowledge Entry

```yaml
# Target: Supabase af_knowledge_base
type: knowledge_entry
table: af_knowledge_base
entry:
  knowledge_type: tip
  title: "Use TDD for API endpoints"
  content: "Analysis shows 40% fewer bugs with TDD approach"
  tags: [tdd, api, quality]
  priority: 75
```

---

## Rollback

If an applied change causes issues:

```bash
/learn:rollback --id <change_id>    # Rollback specific
/learn:rollback --list              # List recent changes
/learn:rollback --last              # Rollback most recent
```

Rollback process:
1. Find backup file
2. Restore original content
3. Update Supabase: `applied = false`
4. Log rollback

---

## Example Session

```
User: /learn:apply

🐸 Learning: Found 3 pending improvements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Improvement 1/3: Route React to react-expert

ID: abc12345
Confidence: 92% ████████████████████░░░░
Frequency: 28 occurrences

### Description
Default react-expert agent for React component files (.tsx, .jsx)

### Evidence
- 28 React component tasks analyzed
- react-expert: 96% success rate
- web-expert (current): 78% success rate

### Change
File: `agents/smart-agent-detector.md`

```diff
  file_patterns:
+   - extension: [.tsx, .jsx]
+     agent: react-expert
+     confidence: 90
```

[a]pply | [s]kip | [m]odify | [q]uit: a

✅ Applied improvement
   Backup: backups/smart-agent-detector.md.2026-01-07

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Improvement 2/3: Increase Phase 5a timeout
...
```

---

**Version:** 1.0.0
