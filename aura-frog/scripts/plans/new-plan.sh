#!/usr/bin/env bash
# Create the .claude/plans/ skeleton for hierarchical planning (v3.7.3+).
# Idempotent — safe to re-run.
#
# Usage: bash aura-frog/scripts/plans/new-plan.sh [project-root]
# If project-root not given, uses current working directory.
#
# Layout (v3.7.3+):
#   .claude/plans/
#     INDEX.md          — read me first
#     mission.md        — T0
#     initiatives/      — T1
#     features/         — T2 (each is {ID}_{slug}/ folder containing feature.md + stories/)
#     archive/          — compressed completed branches
#     traces/           — append-only event logs per T4
#     checkpoints/      — pre-mutation snapshots
#     history.jsonl     — append-only decision log
#     conflicts.jsonl   — append-only conflict log
#     active.json       — focus pointer
#     .counters.json    — ID counters

set -euo pipefail

PROJECT_ROOT="${1:-$(pwd)}"
CLAUDE_DIR="${PROJECT_ROOT}/.claude"
PLANS_DIR="${CLAUDE_DIR}/plans"
LEGACY_AURA_PLANS="${PROJECT_ROOT}/.aura/plans"

# Migration notice (informational only — we don't auto-move content).
if [ -d "${LEGACY_AURA_PLANS}" ] && [ ! -d "${PLANS_DIR}" ]; then
    cat >&2 <<EOF
ℹ Legacy .aura/plans/ detected at ${LEGACY_AURA_PLANS}
ℹ This script will initialize the new .claude/plans/ next to it.
ℹ Migrate your content manually with:
ℹ   mv .aura/plans .claude/plans
ℹ Or set AF_PLANS_DIR=.aura/plans to keep using the legacy location.
EOF
fi

# Idempotency: if already initialized, exit cleanly
if [ -f "${PLANS_DIR}/.counters.json" ] && [ -f "${PLANS_DIR}/active.json" ]; then
    echo "✓ .claude/plans/ already initialized at ${PLANS_DIR}"
    exit 0
fi

mkdir -p "${PLANS_DIR}/initiatives"
mkdir -p "${PLANS_DIR}/features"
mkdir -p "${PLANS_DIR}/archive"
mkdir -p "${PLANS_DIR}/traces"
mkdir -p "${PLANS_DIR}/checkpoints"
mkdir -p "${CLAUDE_DIR}/memory/archive"
mkdir -p "${PROJECT_ROOT}/.aura/security"  # MCP audit lives under .aura/security/ still

NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# .counters.json — initialize ID counters
if [ ! -f "${PLANS_DIR}/.counters.json" ]; then
    cat > "${PLANS_DIR}/.counters.json" <<EOF
{
  "schema_version": 1,
  "updated_at": "${NOW}",
  "counters": {
    "INIT": 0,
    "FEAT": 0,
    "STORY": 0,
    "TASK": 0,
    "CONFLICT": 0,
    "DEC": 0
  }
}
EOF
fi

# active.json — initial focus pointer
if [ ! -f "${PLANS_DIR}/active.json" ]; then
    cat > "${PLANS_DIR}/active.json" <<EOF
{
  "schema_version": 1,
  "updated_at": "${NOW}",
  "active": {
    "mission": null,
    "initiative": null,
    "feature": null,
    "story": null,
    "task": null
  },
  "ready_queue": [],
  "blocked": [],
  "frozen": [],
  "context_anchors": {}
}
EOF
fi

# mission.md — T0 stub
if [ ! -f "${PLANS_DIR}/mission.md" ]; then
    cat > "${PLANS_DIR}/mission.md" <<EOF
---
id: MISSION
tier: 0
intent: "Edit this — describe what your project exists to do."
created_at: ${NOW}
updated_at: ${NOW}
---

# Mission

(Edit me. State the project's reason for existing in 1–3 sentences.)
EOF
fi

# Touch append-only logs so they exist
touch "${PLANS_DIR}/history.jsonl"
touch "${PLANS_DIR}/conflicts.jsonl"
touch "${PLANS_DIR}/conflict_cache.jsonl"
touch "${PROJECT_ROOT}/.aura/security/mcp-audit.jsonl"

# INDEX.md — read-me-first for the plans directory.
if [ ! -f "${PLANS_DIR}/INDEX.md" ]; then
    cat > "${PLANS_DIR}/INDEX.md" <<'EOF'
# `.claude/plans/` — Hierarchical Plan Tree

This directory holds your project's plan tree. Layout:

```
.claude/plans/
├── INDEX.md                          ← you are here
├── mission.md                        ← T0: project's reason for existing
├── active.json                       ← focus pointer (mission/initiative/feature/story/task)
├── .counters.json                    ← ID counters (INIT, FEAT, STORY, TASK, etc.)
├── history.jsonl                     ← append-only decision log
├── conflicts.jsonl                   ← append-only conflict log
├── initiatives/                      ← T1: multi-feature efforts
│   └── INIT-001.md
├── features/                         ← T2: user-facing capabilities
│   └── {ID}_{slug}/                  ← e.g. FEAT-A_oauth-flow/ or JIRA-1234_login-redesign/
│       ├── feature.md                ← spec + status + runs[] link
│       ├── REQUIREMENTS.md           ← /run Phase 1 deliverable (optional)
│       ├── DESIGN.md                 ← /run Phase 1 deliverable (optional)
│       └── stories/
│           └── {ID}_{slug}/          ← e.g. STORY-0001_login-form/
│               ├── story.md
│               └── tasks/
│                   └── {ID}_{slug}.md  ← e.g. TASK-00042_password-input.md
├── archive/                          ← compressed completed branches
├── traces/                           ← per-task append-only event log (forensic audit)
└── checkpoints/                      ← pre-mutation snapshots (undo target)
```

## Naming convention

| Tier | ID prefix | Folder name | Example |
|---|---|---|---|
| T1 | `INIT-NNN` | (none — flat file) | `INIT-001.md` |
| T2 | `FEAT-N` or ticket-ID | `{ID}_{kebab-slug}/feature.md` | `JIRA-1234_oauth-flow/feature.md` |
| T3 | `STORY-NNNN` | `{ID}_{kebab-slug}/story.md` | `STORY-0042_login-form/story.md` |
| T4 | `TASK-NNNNN` | `{ID}_{kebab-slug}.md` | `TASK-00101_password-input.md` |

If a JIRA / Linear / GitHub ticket ID is attached to a feature, use it as the prefix. Otherwise plan-orchestrator mints `FEAT-N`.

## How to read a feature folder

1. Start with `feature.md` — frontmatter has `id`, `status`, `intent`, `children: [STORY-*]`, `runs: [...]`.
2. If `## Runs` section is non-empty, scroll there to see `/run` invocations against this feature (in_progress / done / discarded) and their run-state.json paths.
3. Walk into `stories/` for T3 decomposition, `tasks/` for T4 atoms.
4. `REQUIREMENTS.md` / `DESIGN.md` / `TEST_PLAN.md` are per-feature `/run` deliverables (scaffolded when a Standard/Deep run anchors here).

## Commands

```bash
/aura-frog:plan                          # bootstrap T0/T1/T2 (interview)
/aura-frog:plan expand FEAT-A            # decompose one tier down
/aura-frog:plan next                     # claim next ready T4
/aura-frog:plan status                   # render tree
/run feature: FEAT-A "task description"  # anchor a new run to this feature
/run resume FEAT-A                       # list + resume runs under this feature
```

## Run ↔ Feature linking

Two-sided:

* `run-state.json` carries `feature_id` and `feature_slug` so a run knows its feature.
* `feature.md` body has a `## Runs` section listing every `/run` invocation that anchored here.

Update both ends through `run-orchestrator` (writes both on Step 0b) and `scripts/plans/link-run.sh` (helper invoked when a run starts or finishes).

## Legacy location

Pre-v3.7.3 used `.aura/plans/`. If you have content there, migrate via:

```bash
mv .aura/plans .claude/plans
```

Or override via `AF_PLANS_DIR=.aura/plans` to keep using the old location. The legacy fallback is removed in v4.0.

---

Generated by `aura-frog/scripts/plans/new-plan.sh`. Edit freely.
EOF
fi

echo "✓ Plan skeleton initialized at ${PLANS_DIR}"
echo "  INDEX.md, mission.md, active.json, .counters.json created"
echo ""
echo "Next steps:"
echo "  1. Read ${PLANS_DIR}/INDEX.md to understand the layout"
echo "  2. Edit ${PLANS_DIR}/mission.md to describe your project"
echo "  3. Run /aura-frog:plan to interview-bootstrap T1 (Initiative) and T2 (Feature)"
