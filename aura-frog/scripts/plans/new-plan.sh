#!/usr/bin/env bash
# Create the .aura/plans/ skeleton for hierarchical planning (v3.7.0+).
# Idempotent — safe to re-run.
#
# Usage: bash aura-frog/scripts/plans/new-plan.sh [project-root]
# If project-root not given, uses current working directory.

set -euo pipefail

PROJECT_ROOT="${1:-$(pwd)}"
AURA_DIR="${PROJECT_ROOT}/.aura"
PLANS_DIR="${AURA_DIR}/plans"

# Idempotency: if already initialized, exit cleanly
if [ -f "${PLANS_DIR}/.counters.json" ] && [ -f "${PLANS_DIR}/active.json" ]; then
    echo "✓ .aura/plans/ already initialized at ${PLANS_DIR}"
    exit 0
fi

mkdir -p "${PLANS_DIR}/initiatives"
mkdir -p "${PLANS_DIR}/features"
mkdir -p "${PLANS_DIR}/archive"
mkdir -p "${PLANS_DIR}/traces"
mkdir -p "${PLANS_DIR}/checkpoints"
mkdir -p "${AURA_DIR}/memory/archive"
mkdir -p "${AURA_DIR}/security"

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
touch "${AURA_DIR}/security/mcp-audit.jsonl"

echo "✓ Plan skeleton initialized at ${PLANS_DIR}"
echo "  mission.md, active.json, .counters.json created"
echo ""
echo "Next steps:"
echo "  1. Edit ${PLANS_DIR}/mission.md to describe your project"
echo "  2. Run /aura:plan to interview-bootstrap T1 (Initiative) and T2 (Feature)"
echo "  3. Or manually create initiatives/INIT-001.md per spec §6.3"
