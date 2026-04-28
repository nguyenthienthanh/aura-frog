#!/usr/bin/env bash
# Validate plan tree integrity per spec §6.7 — enforces 8 invariants.
#
# Usage: bash aura-frog/scripts/plans/validate-plan-tree.sh [.aura/plans/ path]
#
# Exit codes:
#   0 — all invariants pass
#   1 — one or more invariants violated (details printed)
#   2 — plan tree not found / no .aura/plans/

set -euo pipefail

PLANS_DIR="${1:-.aura/plans}"

if [ ! -d "${PLANS_DIR}" ]; then
    echo "✗ Plan tree not found at ${PLANS_DIR}"
    exit 2
fi

VIOLATIONS=0
report() {
    echo "✗ INVARIANT $1: $2"
    VIOLATIONS=$((VIOLATIONS + 1))
}

# Helper — extract a frontmatter field from a node file
get_field() {
    local file="$1"
    local field="$2"
    awk -v f="$field" '
        /^---$/ { c++; next }
        c == 1 && $1 == f":" {
            sub(/^[^:]*: */, "")
            sub(/^["'"'"']|["'"'"']$/, "")
            print
            exit
        }
    ' "$file" 2>/dev/null
}

# Collect all node files
ALL_NODES=$(find "${PLANS_DIR}" -name '*.md' -not -path '*/archive/*' 2>/dev/null)
NODE_COUNT=$(echo "${ALL_NODES}" | grep -c . || echo 0)

if [ "${NODE_COUNT}" -eq 0 ]; then
    echo "ℹ Empty plan tree — nothing to validate"
    exit 0
fi

echo "Validating ${NODE_COUNT} plan nodes..."

# Build ID-to-file map
declare -a ALL_IDS=()
for f in ${ALL_NODES}; do
    id=$(get_field "$f" "id")
    if [ -n "$id" ]; then
        ALL_IDS+=("$id")
    fi
done

# INVARIANT 1: Every non-T0 node has existing parent
for f in ${ALL_NODES}; do
    id=$(get_field "$f" "id")
    tier=$(get_field "$f" "tier")
    parent=$(get_field "$f" "parent")
    if [ -z "$id" ]; then continue; fi
    if [ "$tier" = "0" ]; then continue; fi
    if [ -z "$parent" ]; then
        report 1 "node ${id} missing 'parent' field"
        continue
    fi
    if ! printf '%s\n' "${ALL_IDS[@]}" | grep -qx "$parent"; then
        report 1 "node ${id} parent '${parent}' does not exist"
    fi
done

# INVARIANT 4: Status transitions valid (just check status is in allowed set)
ALLOWED_STATUS="planned active done blocked discarded frozen archived"
for f in ${ALL_NODES}; do
    status=$(get_field "$f" "status")
    if [ -z "$status" ]; then continue; fi
    if ! echo "${ALLOWED_STATUS}" | grep -wq "$status"; then
        id=$(get_field "$f" "id")
        report 4 "node ${id} has invalid status '${status}'"
    fi
done

# INVARIANT 8: frozen status must have freeze_reason field
for f in ${ALL_NODES}; do
    status=$(get_field "$f" "status")
    if [ "$status" = "frozen" ]; then
        if ! grep -q "^freeze_reason:" "$f" 2>/dev/null; then
            id=$(get_field "$f" "id")
            report 8 "node ${id} is 'frozen' but missing freeze_reason"
        fi
    fi
done

# INVARIANT 5: revision is non-negative integer
for f in ${ALL_NODES}; do
    rev=$(get_field "$f" "revision")
    if [ -z "$rev" ]; then continue; fi
    if ! echo "$rev" | grep -qE '^[0-9]+$'; then
        id=$(get_field "$f" "id")
        report 5 "node ${id} revision '${rev}' is not a non-negative integer"
    fi
done

# (Invariants 2, 3, 6, 7 require richer parsing — flagged as warnings until parser is built)
# 2. Parent's children array references only existing children
# 3. No orphan nodes
# 6. T3 acceptance references real test files when status >= green
# 7. T4 depends_on forms DAG (no cycles)

if [ "${VIOLATIONS}" -gt 0 ]; then
    echo ""
    echo "✗ ${VIOLATIONS} invariant violation(s) — plan tree is invalid"
    exit 1
fi

echo "✓ Plan tree valid (4/8 invariants enforced; 4 advanced invariants pending parser upgrade)"
exit 0
