#!/usr/bin/env bash
# Validate plan tree integrity per spec §6.7 — enforces all 8 invariants.
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

# Helper — extract a frontmatter scalar field
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

# Helper — extract a frontmatter list field (e.g., children: [A, B, C])
get_list() {
    local file="$1"
    local field="$2"
    awk -v f="$field" '
        /^---$/ { c++; next }
        c == 1 && $1 == f":" {
            sub(/^[^:]*: */, "")
            gsub(/[\[\]]/, "")
            gsub(/, */, "\n")
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

echo "Validating ${NODE_COUNT} plan nodes (8 invariants)..."

# Build ID → file map
TMP_MAP=$(mktemp)
TMP_CLAIMED=$(mktemp)
trap 'rm -f "$TMP_MAP" "$TMP_CLAIMED"' EXIT

for f in ${ALL_NODES}; do
    id=$(get_field "$f" "id")
    if [ -n "$id" ]; then
        echo "$id $f" >> "$TMP_MAP"
    fi
done

file_for_id() {
    awk -v id="$1" '$1 == id { $1 = ""; sub(/^ */, ""); print; exit }' "$TMP_MAP"
}

id_exists() {
    grep -qm1 "^$1 " "$TMP_MAP"
}

# ------------------------------------------------------------------
# INVARIANT 1: Every non-T0 node has existing parent
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    id=$(get_field "$f" "id")
    tier=$(get_field "$f" "tier")
    parent=$(get_field "$f" "parent")
    [ -z "$id" ] && continue
    [ "$tier" = "0" ] && continue
    if [ -z "$parent" ]; then
        report 1 "node ${id} missing 'parent' field"
        continue
    fi
    if ! id_exists "$parent"; then
        report 1 "node ${id} parent '${parent}' does not exist"
    fi
done

# ------------------------------------------------------------------
# INVARIANT 2: Parent's children[] references only existing children
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    id=$(get_field "$f" "id")
    children=$(get_list "$f" "children")
    [ -z "$children" ] && continue
    while IFS= read -r child_id; do
        [ -z "$child_id" ] && continue
        child_id=$(echo "$child_id" | tr -d ' "'"'"'')
        [ -z "$child_id" ] && continue
        if ! id_exists "$child_id"; then
            report 2 "node ${id} children includes '${child_id}' which does not exist"
        fi
    done <<< "$children"
done

# ------------------------------------------------------------------
# INVARIANT 3: No orphan nodes
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    children=$(get_list "$f" "children")
    while IFS= read -r child_id; do
        [ -z "$child_id" ] && continue
        child_id=$(echo "$child_id" | tr -d ' "'"'"'')
        [ -z "$child_id" ] && continue
        echo "$child_id" >> "$TMP_CLAIMED"
    done <<< "$children"
done

for f in ${ALL_NODES}; do
    id=$(get_field "$f" "id")
    tier=$(get_field "$f" "tier")
    [ -z "$id" ] && continue
    [ "$tier" = "0" ] && continue
    if ! grep -qx "$id" "$TMP_CLAIMED" 2>/dev/null; then
        # Verify via parent's children too
        parent=$(get_field "$f" "parent")
        if [ -n "$parent" ]; then
            parent_file=$(file_for_id "$parent")
            if [ -n "$parent_file" ]; then
                pc=$(get_list "$parent_file" "children" | tr -d ' "'"'"'')
                if echo "$pc" | grep -qx "$id"; then
                    continue
                fi
            fi
        fi
        report 3 "node ${id} is orphan — not in any parent's children"
    fi
done

# ------------------------------------------------------------------
# INVARIANT 4: Status in allowed set
# ------------------------------------------------------------------
ALLOWED_STATUS="planned active done blocked discarded frozen archived"
for f in ${ALL_NODES}; do
    status=$(get_field "$f" "status")
    [ -z "$status" ] && continue
    if ! echo "${ALLOWED_STATUS}" | grep -wq "$status"; then
        id=$(get_field "$f" "id")
        report 4 "node ${id} has invalid status '${status}'"
    fi
done

# ------------------------------------------------------------------
# INVARIANT 5: revision is non-negative integer
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    rev=$(get_field "$f" "revision")
    [ -z "$rev" ] && continue
    if ! echo "$rev" | grep -qE '^[0-9]+$'; then
        id=$(get_field "$f" "id")
        report 5 "node ${id} revision '${rev}' is not a non-negative integer"
    fi
done

# ------------------------------------------------------------------
# INVARIANT 6: T3 acceptance test_ref exists when status >= active
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    tier=$(get_field "$f" "tier")
    [ "$tier" = "3" ] || continue
    status=$(get_field "$f" "status")
    [ "$status" = "active" ] || [ "$status" = "done" ] || continue
    test_refs=$(grep -E '^\s*test_ref:' "$f" 2>/dev/null | sed 's/.*test_ref: *//' | tr -d '"' || true)
    if [ -z "$test_refs" ]; then
        id=$(get_field "$f" "id")
        report 6 "T3 ${id} status=${status} but no test_ref in acceptance"
        continue
    fi
    while IFS= read -r ref; do
        [ -z "$ref" ] && continue
        file_part="${ref%%::*}"
        if [ ! -f "$file_part" ]; then
            id=$(get_field "$f" "id")
            report 6 "T3 ${id} test_ref '${file_part}' does not exist"
        fi
    done <<< "$test_refs"
done

# ------------------------------------------------------------------
# INVARIANT 7: T4 depends_on forms DAG (no cycles)
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    tier=$(get_field "$f" "tier")
    [ "$tier" = "4" ] || continue
    id=$(get_field "$f" "id")
    deps=$(get_list "$f" "depends_on")
    [ -z "$deps" ] && continue
    while IFS= read -r dep; do
        [ -z "$dep" ] && continue
        dep=$(echo "$dep" | tr -d ' "'"'"'')
        [ -z "$dep" ] && continue
        if [ "$dep" = "$id" ]; then
            report 7 "T4 ${id} self-references in depends_on (cycle)"
            continue
        fi
        dep_file=$(file_for_id "$dep")
        if [ -n "$dep_file" ]; then
            dep_deps=$(get_list "$dep_file" "depends_on" | tr -d ' "'"'"'')
            if echo "$dep_deps" | grep -qx "$id"; then
                report 7 "T4 ${id} ↔ ${dep} mutual dependency (cycle)"
            fi
        fi
    done <<< "$deps"
done

# ------------------------------------------------------------------
# INVARIANT 8: frozen status must have freeze_reason
# ------------------------------------------------------------------
for f in ${ALL_NODES}; do
    status=$(get_field "$f" "status")
    if [ "$status" = "frozen" ]; then
        if ! grep -q "^freeze_reason:" "$f" 2>/dev/null; then
            id=$(get_field "$f" "id")
            report 8 "node ${id} is 'frozen' but missing freeze_reason"
        fi
    fi
done

# ------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------
if [ "${VIOLATIONS}" -gt 0 ]; then
    echo ""
    echo "✗ ${VIOLATIONS} invariant violation(s) — plan tree is invalid"
    exit 1
fi

echo "✓ Plan tree valid (all 8 invariants pass)"
exit 0
