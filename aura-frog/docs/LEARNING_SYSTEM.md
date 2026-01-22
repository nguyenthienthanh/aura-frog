# Aura Frog Learning System

**Version:** 1.17.0
**Status:** Production Ready

The Learning System enables Aura Frog to improve over time by collecting feedback, analyzing patterns, and generating actionable insights. **Works out of the box with local storage**, optionally syncs to Supabase for cross-machine memory.

**NEW in v1.16.0:**
- **Local storage by default** - No setup required!
- **Smart Learn** - Auto-detect patterns from successful operations (no feedback needed)
- **Workflow Edit Detection** - Learn from your direct edits to workflow files
- **Learned Rules MD** - Human-readable file auto-linked to instructions

---

## Storage Modes

| Mode | Setup Required | Persistence | Best For |
|------|----------------|-------------|----------|
| **Local** (default) | None | Per-project | Individual developers, quick start |
| **Supabase** | 5 min setup | Cross-machine, cross-project | Teams, multiple machines |

### Local Storage (Default)

**No configuration needed!** Learning works immediately.

Files created in `.claude/learning/`:
```
.claude/learning/
├── feedback.json      # All feedback entries (max 500)
├── patterns.json      # Learned patterns
├── metrics.json       # Workflow metrics
└── learned-rules.md   # Human-readable rules
```

Plus a link file at `.claude/LEARNED_PATTERNS.md` that points Claude to the learned rules.

### Supabase Storage (Optional)

For cross-machine and team memory:

```bash
# Add to .envrc
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SECRET_KEY="your-secret-key"
export AF_LEARNING_ENABLED="true"
```

Then run: `./scripts/supabase/setup.sh`

---

## How Learning Works

### 1. Smart Learn (Automatic, No Feedback)

Detects patterns from **successful operations** - no user feedback required.

**What It Detects:**
| Language | Patterns |
|----------|----------|
| TypeScript/JS | arrow_functions, prefer_const, async_await, explicit_types, react_hooks, error_handling |
| Python | python_type_hints, python_async |
| Bash | Command patterns, pipe usage, chaining |

**How It Works:**
1. After every successful Write/Edit/Bash
2. Analyzes the content/command for patterns
3. Tracks success counts per pattern
4. After 3+ successes, creates a learned pattern

**Example:**
```
🧠 Smart Learn: Pattern detected! "prefer_const" in .ts files
🧠 Smart Learn: Bash pattern! "npm" is frequently used
```

**Hook:** `hooks/smart-learn.cjs`

---

### 2. Auto-Learn (From User Corrections)

Detects corrections in user messages and learns from them.

**Detection Patterns:**
- Direct negations: "no", "nope", "wrong", "incorrect"
- Corrections: "actually", "should be", "shouldn't", "instead of"
- Modifications: "change that", "fix that", "don't do that", "remove that"
- Preferences: "I prefer", "always use", "never use", "don't add"
- Approvals: "good job", "great", "perfect", "looks good"

**How It Works:**
1. On every user message submission
2. Detects correction/approval patterns
3. Categorizes (code_style, testing, security, etc.)
4. Stores with deduplication (24h window)
5. After 3+ similar corrections, creates a learned pattern

**Example:**
```
🧠 Learning: Captured correction [code_style:minimal_comments] (1x)
# After 3 similar corrections:
🧠 Learning: Pattern detected! "code_style:minimal_comments" (3 occurrences)
```

**Hook:** `hooks/auto-learn.cjs`

---

### 3. Workflow Edit Detection (From Direct User Edits)

Learns from your direct edits to workflow MD files (outside Claude sessions).

**Monitored Files:**
- `.claude/cache/workflow-state.json`
- `.claude/logs/workflows/*.md`
- `docs/workflow/*.md`
- Any `phase-*.md`, `plan.md`, `spec.md`, `requirements.md`

**What It Detects:**
- Structure preferences (headers, bullet points, code blocks)
- Verbosity preferences (content added/removed)
- Tone preferences (filler phrases removed)
- Documentation style

**How It Works:**
1. At session start, scans monitored files
2. Compares with last known state (hash-based)
3. If user edited file, extracts changes
4. Analyzes changes for patterns
5. Records learnings automatically

**Example:**
```
🧠 Workflow Edit: Detected 2 pattern(s) from user edits to plan.md
```

**Hook:** `hooks/workflow-edit-learn.cjs`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Aura Frog Plugin                          │
├─────────────────────────────────────────────────────────────────┤
│  Learning Hooks                    │  Storage                    │
│  ├── smart-learn.cjs (NEW)        │  ├── Local (default)        │
│  ├── auto-learn.cjs               │  │   └── .claude/learning/  │
│  ├── workflow-edit-learn.cjs (NEW)│  └── Supabase (optional)    │
│  ├── feedback-capture.cjs         │      └── af_* tables        │
│  └── session-metrics.cjs          │                              │
├─────────────────────────────────────────────────────────────────┤
│  Library: hooks/lib/af-learning.cjs (v2.0.0 - dual-mode)        │
├─────────────────────────────────────────────────────────────────┤
│  Output: .claude/learning/learned-rules.md → Instructions        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Learned Rules File

The system auto-generates `.claude/learning/learned-rules.md` containing:

```markdown
# Learned Patterns & Rules

## Summary
- **Total Patterns:** 5
- **Total Feedback:** 23

## Code Style
*8 corrections in this category*

### User prefers: arrow_functions in .ts files
**Frequency:** 12 occurrences

### User prefers: minimal_comments
**Examples:**
- Don't add comments everywhere, only when needed
**Frequency:** 4 occurrences

## Recent Corrections
- **code_style:** Stop adding JSDoc to every function...
- **testing:** Always use describe blocks for grouping...
```

This file is **automatically linked** via `.claude/LEARNED_PATTERNS.md`, ensuring Claude reads and applies learned patterns.

---

## Commands

| Command | Description |
|---------|-------------|
| `/learn:status` | Show learning system status and stats |
| `/learn:analyze` | Run pattern analysis |
| `/learn:apply` | Apply learned improvements |
| `/learn:feedback` | Submit manual feedback |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AF_LEARNING_ENABLED` | (auto) | Force enable learning (Supabase mode) |
| `AF_LOCAL_LEARNING` | `true` | Enable local learning fallback |
| `AF_FORCE_LOCAL` | `false` | Force local mode even with Supabase |
| `AF_FEEDBACK_COLLECTION` | `true` | Enable feedback collection |
| `AF_METRICS_COLLECTION` | `true` | Enable metrics collection |
| `SUPABASE_URL` | - | Supabase project URL |
| `SUPABASE_SECRET_KEY` | - | Supabase secret key |

---

## Disable Learning

To disable all learning:
```bash
export AF_LOCAL_LEARNING="false"
export AF_LEARNING_ENABLED="false"
```

---

## Privacy & Data

### What's Stored

- Feedback text (corrections, reasons)
- Pattern summaries
- Performance metrics
- Workflow metadata

### What's NOT Stored

- Full source code content
- API keys or secrets
- Personal information
- Full conversation logs

### Data Retention (Supabase)

- Feedback: 90 days
- Metrics: 1 year
- Patterns: Indefinite

### Data Retention (Local)

- Feedback: Last 500 entries
- Patterns: Indefinite
- Cache: Last 200 entries

---

## Troubleshooting

### Check Learning Status

```bash
learn:status
```

Should show:
- `Mode: local` or `Mode: supabase`
- `Patterns: X`
- `Feedback: Y`

### Learning Not Working

1. Check mode: Is it local or Supabase?
2. For local: Check `.claude/learning/` directory exists
3. For Supabase: Verify `SUPABASE_URL` and `SUPABASE_SECRET_KEY`

### Missing Patterns

- Smart Learn requires 3+ successful operations
- Auto-Learn requires 3+ similar corrections
- Deduplication skips identical feedback within 24h

### Reset Learning (Local)

```bash
rm -rf .claude/learning/
```

---

**Version:** 1.17.0 | **Last Updated:** 2026-01-20
