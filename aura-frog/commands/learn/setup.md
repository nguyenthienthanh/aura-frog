# /learn:setup

**Category:** Learning
**Purpose:** Set up the Supabase learning system database schema

---

## Usage

**From Claude Code terminal:**

```bash
./scripts/supabase/setup.sh           # Run setup
./scripts/supabase/setup.sh --check   # Check if schema exists
./scripts/supabase/setup.sh --help    # Show help
```

**Or via command:**

```bash
/learn:setup                    # Interactive setup
/learn:setup --check            # Check if schema exists
```

---

## CRITICAL: Claude MUST Execute

When user runs `/learn:setup`, Claude **MUST actually run the setup script or verify schema**.

**DO NOT** just show instructions. **DO** check if schema exists and run setup if needed.

```bash
# ALWAYS source env first
source .envrc 2>/dev/null || source .claude/.envrc 2>/dev/null || true
```

---

## Setup Flow

### Step 1: Bootstrap (One-time)

Run `bootstrap.sql` in Supabase SQL Editor:

**File:** `scripts/supabase/bootstrap.sql`

```sql
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### Step 2: Run Setup Script

```bash
./scripts/supabase/setup.sh
```

This will:
1. Check environment variables
2. Verify exec_sql function exists
3. Create all tables, views, and functions
4. Show progress and any errors

### Alternative: Manual Setup

Copy and paste `scripts/supabase/schema.sql` into Supabase SQL Editor.

---

## Execution Steps

When user runs `/learn:setup`, Claude should:

### Step 1: Check Environment Variables

```bash
echo "Checking environment..."
echo "SUPABASE_URL: ${SUPABASE_URL:+✓ set}"
echo "SUPABASE_SECRET_KEY: ${SUPABASE_SECRET_KEY:+✓ set}"
```

If either is missing, tell user to:
1. Copy `.envrc.template` to `.envrc`
2. Set the Supabase credentials
3. Run `source .envrc`

### Step 2: Check if Schema Already Exists

```bash
# Test if af_feedback table exists
response=$(curl -s -w "%{http_code}" -o /tmp/schema_check.json \
  "${SUPABASE_URL}/rest/v1/af_feedback?limit=1" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}")

if [ "$response" = "200" ]; then
  echo "✅ Schema already exists"
  exit 0
fi
```

### Step 3: Check if Bootstrap Function Exists

```bash
# Test if exec_sql function exists
response=$(curl -s -w "%{http_code}" -o /tmp/bootstrap_check.json \
  -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT 1"}')

if [ "$response" != "200" ]; then
  echo "❌ Bootstrap function not found"
  echo ""
  echo "Run this SQL in Supabase Dashboard → SQL Editor:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat scripts/supabase/bootstrap.sql
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
```

### Step 4: Run Setup Script

```bash
./scripts/supabase/setup.sh
```

Or if running manually:

```bash
node scripts/supabase/setup-schema.cjs
```

### Step 5: Verify Setup

```bash
# Confirm tables were created
curl -s "${SUPABASE_URL}/rest/v1/af_feedback?limit=1" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}"

echo "✅ Learning system setup complete!"
echo "Run /learn:status to verify"
```

---

## Output

```
🐸 Aura Frog - Supabase Schema Setup

📡 Supabase URL: https://your-project.supabase.co

1. Checking exec_sql function...
   ✓ exec_sql function exists

2. Reading schema file...
   ✓ Read 15234 bytes

3. Parsing SQL statements...
   ✓ Found 42 statements

4. Executing statements...
   [1/42] Executing... ✓
   [2/42] Executing... ✓
   ...
   [42/42] Executing... ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   ✓ Successful: 42

✅ Schema setup complete!

Next steps:
   1. Run /learn:status to verify connection
   2. Run /learn:analyze to check for patterns
```

---

## Tables Created

| Table | Purpose |
|-------|---------|
| `af_feedback` | User corrections, approvals, ratings |
| `af_workflow_metrics` | Workflow execution data |
| `af_agent_performance` | Agent success tracking |
| `af_learned_patterns` | Identified patterns |
| `af_knowledge_base` | Persistent learnings |

## Views Created

| View | Purpose |
|------|---------|
| `v_agent_success_rates` | Agent performance by task |
| `v_common_patterns` | Pattern summary |
| `v_improvement_suggestions` | Actionable suggestions |
| `v_workflow_trends` | Weekly trends |
| `v_feedback_summary` | Feedback statistics |

## Functions Created

| Function | Purpose |
|----------|---------|
| `record_feedback()` | Insert feedback record |
| `update_pattern_frequency()` | Increment pattern count |
| `get_agent_recommendation()` | Get best agent for task |

---

## Troubleshooting

### "exec_sql function does not exist"

Run this in Supabase SQL Editor first:

```sql
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### "Permission denied"

- Verify `SUPABASE_SECRET_KEY` is the **Secret** key (not Publishable)
- Check RLS policies allow service role access

### "Table already exists"

Safe to ignore - the schema uses `CREATE TABLE IF NOT EXISTS`.

---

## Related Commands

- `/learn:status` - Check learning system status
- `/learn:analyze` - Run pattern analysis
- `/learn:apply` - Apply improvements

---

**Version:** 1.0.0
