# Rule: Environment Loading

**Priority:** Critical
**Applies:** Session start, before any workflow or prompt response

---

## Rule

**ALWAYS check environment variables FIRST before responding to any prompt.**

If environment is not configured → Run `project:reload-env` automatically.

---

## Mandatory Check (Every Session)

Before responding to the user's first message, you MUST:

1. **Check if key env vars are set:**
   ```bash
   # Check critical variables
   [ -n "$SUPABASE_URL" ] && [ -n "$FIGMA_API_KEY" ] || echo "ENV NOT LOADED"
   ```

2. **If NOT configured → Auto-run reload:**
   ```bash
   # Locate and source .envrc
   if [ -f ".envrc" ]; then
     source .envrc
   elif [ -f ".claude/.envrc" ]; then
     source .claude/.envrc
   fi
   ```

3. **Show env status in first response:**
   ```
   🔌 MCP: context7 ✓ | figma ✓ | playwright ✓ | vitest ✓ | slack ✗
   🧠 Learning: enabled ✓
   ```

**NEVER skip this check. NEVER respond without loading env first.**

---

## Steps

1. **Check for `.envrc`** in these locations (in order):
   - `.envrc` (project root)
   - `.claude/.envrc` (Claude config directory)
2. **If found, parse** all `export VAR=value` statements
3. **Load variables** into current session context
4. **Verify** critical variables are set before proceeding

**Note:** If both files exist, project root takes priority. Variables from `.claude/.envrc` are loaded first, then overridden by `.envrc` if present.

---

## Variable Categories

### Integration Credentials
```bash
JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY
FIGMA_API_KEY
SLACK_BOT_TOKEN, SLACK_CHANNEL_ID, SLACK_WEBHOOK_URL
CONFLUENCE_URL, CONFLUENCE_EMAIL, CONFLUENCE_API_TOKEN
```

### Workflow Settings
```bash
AURA_FROG_AUTO_APPROVE
AURA_FROG_DEFAULT_COVERAGE
AURA_FROG_TDD_ENFORCE
AURA_FROG_AUTO_NOTIFY
AURA_FROG_TOKEN_WARNING
```

---

## Priority Order

```
Environment Variable > Project Config > Global Config > Default
```

---

## Commands

- `project:reload-env` - Reload after editing .envrc
- `project:init` - Creates .envrc template

---

**Version:** 1.0.0
