# Rule: Environment Loading

**Priority:** Critical
**Applies:** Session start, before any workflow

---

## Rule

**ALWAYS check and load `.envrc` at session start.**

---

## Steps

1. **Check for `.envrc`** in these locations (in order):
   - `.envrc` (project root)
   - `.claude/.envrc` (Claude config directory)
2. **If found, parse** all `export VAR=value` statements
3. **Load variables** into current session context

**Note:** If both files exist, project root takes priority. Variables from `.claude/.envrc` are loaded first, then overridden by `.envrc` if present.

---

## Variable Categories

### AI Model API Keys
```bash
GEMINI_API_KEY      # For Gemini model
OPENAI_API_KEY      # For OpenAI GPT models
DEEPSEEK_API_KEY    # For DeepSeek model
```

### Phase-Specific Model Overrides
```bash
AURA_PHASE_1_MODEL  # Phase 1: Understand
AURA_PHASE_2_MODEL  # Phase 2: Design
AURA_PHASE_5A_MODEL # Phase 5a: TDD Red
AURA_PHASE_5B_MODEL # Phase 5b: Build
AURA_PHASE_6_MODEL  # Phase 6: Review
AURA_DEFAULT_MODEL  # Fallback for all phases
```

### Integration Credentials
```bash
JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY
FIGMA_API_TOKEN
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
