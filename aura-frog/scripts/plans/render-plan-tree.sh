#!/usr/bin/env bash
# Render the plan tree as an ASCII tree.
# Usage: bash aura-frog/scripts/plans/render-plan-tree.sh [.aura/plans/ path]

set -euo pipefail

PLANS_DIR="${1:-.aura/plans}"

if [ ! -d "${PLANS_DIR}" ]; then
    echo "✗ Plan tree not found at ${PLANS_DIR}"
    exit 1
fi

get_field() {
    local file="$1"; local field="$2"
    awk -v f="$field" '
        /^---$/ { c++; next }
        c == 1 && $1 == f":" {
            sub(/^[^:]*: */, ""); sub(/^["'"'"']|["'"'"']$/, "")
            print; exit
        }
    ' "$file" 2>/dev/null
}

# Status icon
icon() {
    case "$1" in
        active)   echo "▶" ;;
        done)     echo "✓" ;;
        planned)  echo "○" ;;
        blocked)  echo "■" ;;
        frozen)   echo "❄" ;;
        discarded) echo "✗" ;;
        archived) echo "⌂" ;;
        *)        echo "?" ;;
    esac
}

print_node() {
    local file="$1"; local prefix="$2"
    local id=$(get_field "$file" "id")
    local status=$(get_field "$file" "status")
    local intent=$(get_field "$file" "intent")
    local i=$(icon "${status:-planned}")
    printf '%s%s %s — %s\n' "$prefix" "$i" "$id" "${intent:-(no intent)}"
}

# T0 — Mission
if [ -f "${PLANS_DIR}/mission.md" ]; then
    print_node "${PLANS_DIR}/mission.md" ""
fi

# T1 — Initiatives
if [ -d "${PLANS_DIR}/initiatives" ]; then
    for init in "${PLANS_DIR}/initiatives"/*.md; do
        [ -f "$init" ] || continue
        print_node "$init" "├─ "

        # T2 — Features under this initiative (parent match)
        init_id=$(get_field "$init" "id")
        if [ -d "${PLANS_DIR}/features" ]; then
            for feat_dir in "${PLANS_DIR}/features"/*; do
                [ -d "$feat_dir" ] || continue
                feat_file="${feat_dir}/feature.md"
                [ -f "$feat_file" ] || continue
                feat_parent=$(get_field "$feat_file" "parent")
                [ "$feat_parent" = "$init_id" ] || continue

                print_node "$feat_file" "│  ├─ "

                # T3 — Stories
                if [ -d "${feat_dir}/stories" ]; then
                    for story_dir in "${feat_dir}/stories"/*; do
                        [ -d "$story_dir" ] || continue
                        story_file="${story_dir}/story.md"
                        [ -f "$story_file" ] || continue
                        print_node "$story_file" "│  │  ├─ "

                        # T4 — Tasks
                        if [ -d "${story_dir}/tasks" ]; then
                            for task in "${story_dir}/tasks"/*.md; do
                                [ -f "$task" ] || continue
                                print_node "$task" "│  │  │  └─ "
                            done
                        fi
                    done
                fi
            done
        fi
    done
fi

echo ""
echo "Legend: ○ planned  ▶ active  ✓ done  ■ blocked  ❄ frozen  ✗ discarded  ⌂ archived"
