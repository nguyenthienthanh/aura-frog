#!/usr/bin/env bash
# Pop the next ready T4 task and mark it active.
#
# Algorithm (per Tech Spec §6.2):
#   1. Read active.json.
#   2. If ready_queue non-empty → pop first.
#   3. Else: walk active.story → collect T4 children with status=planned AND all
#      depends_on satisfied (each dep status ∈ done|active). Refill ready_queue.
#      Pop first.
#   4. Mutate task: status=active, started_at=now, revision+=1.
#   5. Update active.json: active.task=ID, ready_queue=tail.
#   6. Append history.jsonl event=task_dispatch.
#
# Usage:
#   next-task.sh [--plans-dir <path>] [--dry-run]
#
# Exit codes:
#   0 success — prints "TASK-NNNNN\t<file_path>"
#   2 no story active OR no ready task
#   4 validation failed
#   5 bad input

set -euo pipefail

SCRIPT_DIR=$(dirname "$0")
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/_lib.sh"

PLANS_DIR=""  # resolved below via plans_dir
DRY_RUN=0
while [ $# -gt 0 ]; do
    case "$1" in
        --plans-dir) PLANS_DIR="$2"; shift 2 ;;
        --plans-dir=*) PLANS_DIR="${1#--plans-dir=}"; shift ;;
        --dry-run) DRY_RUN=1; shift ;;
        *) echo "unknown arg: $1" >&2; exit 5 ;;
    esac
done

PLANS_DIR=$(plans_dir "$PLANS_DIR")

[ -f "${PLANS_DIR}/active.json" ] || { echo "no active.json — run /aura-frog:plan first" >&2; exit 5; }

ACTIVE_STORY=$(read_active_field "$PLANS_DIR" "story" 2>/dev/null || true)
if [ -z "${ACTIVE_STORY:-}" ]; then
    echo "no active story — set one with /aura-frog:plan-next on a feature first, or expand a feature into stories" >&2
    exit 2
fi

STORY_FILE=$(resolve_file "$PLANS_DIR" "$ACTIVE_STORY") || {
    echo "active story ${ACTIVE_STORY} not found on disk" >&2; exit 2;
}
STORY_DIR=$(dirname "$STORY_FILE")
TASKS_DIR="${STORY_DIR}/tasks"
[ -d "$TASKS_DIR" ] || { echo "story has no tasks/ — run /aura-frog:plan-expand ${ACTIVE_STORY}" >&2; exit 2; }

# Collect candidates: T4, status=planned, all depends_on in {done, active}.
# v3.7.3+: tasks live in folders — `tasks/{ID}_{slug}/task.md`. Pre-v3.7.3
# layout was flat — `tasks/{ID}_{slug}.md`. Support both for transition.
CANDIDATES=""
TASK_CANDIDATES=$(find "$TASKS_DIR" -maxdepth 2 -name 'task.md' 2>/dev/null)
TASK_CANDIDATES="${TASK_CANDIDATES}
$(find "$TASKS_DIR" -maxdepth 1 -name '*.md' -not -name 'task.md' 2>/dev/null)"
for f in $TASK_CANDIDATES; do
    [ -f "$f" ] || continue
    tier=$(get_field "$f" "tier")
    [ "$tier" = "4" ] || continue
    status=$(get_field "$f" "status")
    [ "$status" = "planned" ] || continue
    id=$(get_field "$f" "id")
    [ -z "$id" ] && continue

    deps=$(get_list "$f" "depends_on" | tr -d ' "'"'"'' | grep -v '^$' || true)
    ready=1
    while IFS= read -r dep; do
        [ -z "$dep" ] && continue
        dep_file=$(resolve_file "$PLANS_DIR" "$dep" 2>/dev/null || true)
        [ -z "$dep_file" ] && { ready=0; break; }
        dep_status=$(get_field "$dep_file" "status")
        case "$dep_status" in
            done|active) ;;
            *) ready=0; break ;;
        esac
    done <<< "$deps"
    [ "$ready" = "1" ] && CANDIDATES="${CANDIDATES}${id}	${f}
"
done

if [ -z "$CANDIDATES" ]; then
    echo "no ready T4 under ${ACTIVE_STORY} — all tasks done or blocked by deps" >&2
    exit 2
fi

PICK_LINE=$(printf '%s' "$CANDIDATES" | head -1)
PICK_ID=$(echo "$PICK_LINE" | awk -F'\t' '{print $1}')
PICK_FILE=$(echo "$PICK_LINE" | awk -F'\t' '{print $2}')

if [ "$DRY_RUN" = "1" ]; then
    echo "DRY RUN — would dispatch ${PICK_ID} (${PICK_FILE})"
    exit 0
fi

# Save checkpoint, mutate, validate.
VIOLATIONS_BEFORE=$(tree_violation_count "$PLANS_DIR")
CKPT=$(save_checkpoint "$PLANS_DIR" "$PICK_ID" "$PICK_FILE")
NOW=$(now_utc)
set_field "$PICK_FILE" "status" "active"
set_field "$PICK_FILE" "started_at" "$NOW"
NEW_REV=$(bump_revision "$PICK_FILE")

# Detect regression. Roll back the task file if violations increased. active.task
# is set ONLY after the check passes (below), so a rollback never leaves
# active.json pointing at a task that was just reverted to `planned`.
if ! require_no_regression "$PLANS_DIR" "$VIOLATIONS_BEFORE"; then
    if [ -s "$CKPT" ]; then
        body=$(grep -oE '"node_state_before_b64":[[:space:]]*"[^"]*"' "$CKPT" | sed 's/.*"\([^"]*\)"$/\1/')
        echo "$body" | base64 -d > "$PICK_FILE"
    fi
    echo "restored ${PICK_ID}" >&2
    exit 4
fi

set_active_field "$PLANS_DIR" "task" "$PICK_ID"

EVENT="{\"ts\":\"${NOW}\",\"verb\":\"next\",\"target\":\"${PICK_ID}\",\"story\":\"${ACTIVE_STORY}\",\"checkpoint\":\"${CKPT}\",\"revision\":${NEW_REV}}"
append_history "$PLANS_DIR" "$EVENT"

printf '%s\t%s\n' "$PICK_ID" "$PICK_FILE"
