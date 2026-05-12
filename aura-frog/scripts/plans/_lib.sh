#!/usr/bin/env bash
# Shared helpers for plan-tree backing scripts (sourced, not executed).
# All functions are pure-bash + standard POSIX utilities (awk, sed, find, grep, mv).

# ---------------------------------------------------------------------------
# plans_dir [explicit_path]
#   Resolve the plans dir. Resolution order (v3.7.3+):
#     1. Explicit positional arg (caller passed it)
#     2. $AF_PLANS_DIR env var
#     3. Default ".claude/plans"
#     4. Legacy fallback ".aura/plans" (if it exists and .claude/plans does not)
#   The legacy fallback is removed in v4.0.
# ---------------------------------------------------------------------------
plans_dir() {
    if [ -n "${1:-}" ]; then
        echo "$1"
        return 0
    fi
    if [ -n "${AF_PLANS_DIR:-}" ]; then
        echo "${AF_PLANS_DIR}"
        return 0
    fi
    if [ -d ".claude/plans" ]; then
        echo ".claude/plans"
        return 0
    fi
    if [ -d ".aura/plans" ]; then
        # Legacy fallback — warn to stderr but allow.
        echo "⚠ Using legacy .aura/plans — migrate to .claude/plans (removal v4.0)" >&2
        echo ".aura/plans"
        return 0
    fi
    echo ".claude/plans"
}

# ---------------------------------------------------------------------------
# slugify <text>
#   Lower-case, ASCII-only, hyphen-separated. Used in feature/story/task
#   folder names: ${ID}_${slug}/.
# ---------------------------------------------------------------------------
slugify() {
    echo "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' \
        | cut -c1-50
}

# ---------------------------------------------------------------------------
# feature_folder <id> <intent>  →  "{ID}_{slug}"
#   Compose the canonical feature folder name. If id starts with a known
#   ticket prefix (JIRA-/LIN-/ABC-9999), it's used as-is. Otherwise FEAT-N.
# ---------------------------------------------------------------------------
feature_folder() {
    local id="$1"; local intent="${2:-}"
    local slug; slug=$(slugify "$intent")
    [ -z "$slug" ] && slug="unnamed"
    echo "${id}_${slug}"
}

# ---------------------------------------------------------------------------
# now_utc
#   Current time as ISO-8601 UTC.
# ---------------------------------------------------------------------------
now_utc() {
    date -u +%Y-%m-%dT%H:%M:%SZ
}

# ---------------------------------------------------------------------------
# get_field <file> <field>
#   Extract scalar frontmatter field (between first --- pair).
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# get_list <file> <field>
#   Extract inline-list frontmatter field (e.g. children: [A, B]).
# ---------------------------------------------------------------------------
get_list() {
    local file="$1"; local field="$2"
    awk -v f="$field" '
        /^---$/ { c++; next }
        c == 1 && $1 == f":" {
            sub(/^[^:]*: */, "")
            gsub(/[\[\]]/, "")
            gsub(/, */, "\n")
            print; exit
        }
    ' "$file" 2>/dev/null
}

# ---------------------------------------------------------------------------
# set_field <file> <field> <value>
#   Update an existing frontmatter scalar in-place (atomic). Adds if missing.
# ---------------------------------------------------------------------------
set_field() {
    local file="$1"; local field="$2"; local value="$3"
    local tmp="${file}.tmp.$$"
    awk -v f="$field" -v v="$value" '
        BEGIN { in_fm=0; replaced=0 }
        /^---$/ {
            if (in_fm == 0) { in_fm=1; print; next }
            if (in_fm == 1) {
                if (!replaced) print f ": " v
                in_fm=2; print; next
            }
        }
        in_fm == 1 && $1 == f":" {
            print f ": " v
            replaced=1
            next
        }
        { print }
    ' "$file" > "$tmp"
    mv "$tmp" "$file"
}

# ---------------------------------------------------------------------------
# atomic_write <target_file> <content>
#   Write content to a tmp file then rename. Prevents partial writes.
# ---------------------------------------------------------------------------
atomic_write() {
    local target="$1"; local content="$2"
    local tmp="${target}.tmp.$$"
    printf '%s' "$content" > "$tmp"
    mv "$tmp" "$target"
}

# ---------------------------------------------------------------------------
# read_active_field <plans_dir> <field>
#   Read active.<field> from active.json (mission|initiative|feature|story|task).
# ---------------------------------------------------------------------------
read_active_field() {
    local plans="$1"; local field="$2"
    local file="${plans}/active.json"
    [ -f "$file" ] || return 1
    local val
    val=$(grep -oE "\"${field}\"[[:space:]]*:[[:space:]]*\"[^\"]+\"" "$file" | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
    [ "$val" = "null" ] && return 1
    [ -z "$val" ] && return 1
    echo "$val"
}

# ---------------------------------------------------------------------------
# set_active_field <plans_dir> <field> <value>
#   Mutate active.<field>. Falsy value (- or "" or null) sets JSON null.
#   Uses python if available for safety; falls back to two-step sed.
# ---------------------------------------------------------------------------
set_active_field() {
    local plans="$1"; local field="$2"; local value="$3"
    local file="${plans}/active.json"
    [ -f "$file" ] || return 1
    local tmp="${file}.tmp.$$"
    local now; now=$(now_utc)

    if command -v python3 >/dev/null 2>&1; then
        python3 - "$file" "$field" "$value" "$now" "$tmp" <<'PYEOF'
import json, sys
src, field, value, now, dst = sys.argv[1:6]
with open(src) as fh:
    data = json.load(fh)
data.setdefault("active", {})
if value in ("", "null", "-"):
    data["active"][field] = None
else:
    data["active"][field] = value
data["updated_at"] = now
with open(dst, "w") as fh:
    json.dump(data, fh, indent=2)
PYEOF
        mv "$tmp" "$file"
        return 0
    fi

    # Pure-sed fallback. Two passes: replace string value, then null value.
    local replacement
    if [ -z "$value" ] || [ "$value" = "null" ] || [ "$value" = "-" ]; then
        replacement="\"${field}\": null"
    else
        replacement="\"${field}\": \"${value}\""
    fi
    sed -E "s#\"${field}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"#${replacement}#" "$file" | \
        sed -E "s#\"${field}\"[[:space:]]*:[[:space:]]*null#${replacement}#" | \
        sed -E "s#\"updated_at\"[[:space:]]*:[[:space:]]*\"[^\"]+\"#\"updated_at\": \"${now}\"#" \
        > "$tmp"
    mv "$tmp" "$file"
}

# ---------------------------------------------------------------------------
# append_history <plans_dir> <event_json>
#   Append a single JSON line to history.jsonl. Caller passes the full record.
# ---------------------------------------------------------------------------
append_history() {
    local plans="$1"; local event="$2"
    local file="${plans}/history.jsonl"
    touch "$file"
    printf '%s\n' "$event" >> "$file"
}

# ---------------------------------------------------------------------------
# save_checkpoint <plans_dir> <node_id> <node_file>
#   Snapshot a node's pre-mutation state to checkpoints/<id>.<ISO8601>.json.
#   Returns the checkpoint path on stdout.
# ---------------------------------------------------------------------------
save_checkpoint() {
    local plans="$1"; local node_id="$2"; local node_file="$3"
    local ckpt_dir="${plans}/checkpoints"
    mkdir -p "$ckpt_dir"
    local ts; ts=$(now_utc)
    local safe_ts; safe_ts=$(echo "$ts" | tr ':' '-')
    local ckpt="${ckpt_dir}/${node_id}.${safe_ts}.json"
    local git_sha=""
    if command -v git >/dev/null 2>&1 && git rev-parse HEAD >/dev/null 2>&1; then
        git_sha=$(git rev-parse HEAD)
    fi
    local body_b64=""
    if [ -f "$node_file" ]; then
        body_b64=$(base64 < "$node_file" | tr -d '\n')
    fi
    cat > "$ckpt" <<EOF
{
  "schema_version": 1,
  "node_id": "${node_id}",
  "node_file": "${node_file}",
  "saved_at": "${ts}",
  "git_sha": "${git_sha}",
  "node_state_before_b64": "${body_b64}"
}
EOF
    echo "$ckpt"
}

# ---------------------------------------------------------------------------
# validate_tree <plans_dir>
#   Run validate-plan-tree.sh — returns its exit code.
# ---------------------------------------------------------------------------
validate_tree() {
    local plans="$1"
    local script_dir; script_dir=$(dirname "${BASH_SOURCE[0]}")
    bash "${script_dir}/validate-plan-tree.sh" "$plans"
}

# ---------------------------------------------------------------------------
# tree_violation_count <plans_dir>
#   Count current invariant violations (exit-1 lines from validator). Returns 0
#   if tree is valid, N if N violations. Used by mutators to detect REGRESSIONS
#   rather than pre-existing damage: only roll back if (after > before).
# ---------------------------------------------------------------------------
tree_violation_count() {
    local plans="$1"
    local script_dir; script_dir=$(dirname "${BASH_SOURCE[0]}")
    bash "${script_dir}/validate-plan-tree.sh" "$plans" 2>/dev/null | grep -c '^✗ INVARIANT' || true
}

# ---------------------------------------------------------------------------
# require_no_regression <plans_dir> <before_count>
#   Compare current violation count vs baseline. Echo "regression" + return 1
#   if increased. Otherwise return 0.
# ---------------------------------------------------------------------------
require_no_regression() {
    local plans="$1"; local before="$2"
    local after; after=$(tree_violation_count "$plans")
    if [ "$after" -gt "$before" ]; then
        echo "validation REGRESSED: ${before} → ${after} violations" >&2
        return 1
    fi
    return 0
}

# ---------------------------------------------------------------------------
# next_counter <plans_dir> <kind>
#   Atomically increment .counters.json counter for INIT|FEAT|STORY|TASK|CONFLICT|DEC.
#   Returns the NEW counter value on stdout.
# ---------------------------------------------------------------------------
next_counter() {
    local plans="$1"; local kind="$2"
    local file="${plans}/.counters.json"
    [ -f "$file" ] || { echo "no .counters.json" >&2; return 1; }
    local current
    current=$(grep -oE "\"${kind}\"[[:space:]]*:[[:space:]]*[0-9]+" "$file" | head -1 | grep -oE '[0-9]+$')
    local next=$((current + 1))
    local now; now=$(now_utc)
    local tmp="${file}.tmp.$$"
    sed -E "s|\"${kind}\"[[:space:]]*:[[:space:]]*[0-9]+|\"${kind}\": ${next}|" "$file" | \
        sed -E "s|\"updated_at\"[[:space:]]*:[[:space:]]*\"[^\"]+\"|\"updated_at\": \"${now}\"|" \
        > "$tmp"
    mv "$tmp" "$file"
    echo "$next"
}

# ---------------------------------------------------------------------------
# bump_revision <node_file>
#   Increment the `revision` field by 1 (or set to 1 if missing).
# ---------------------------------------------------------------------------
bump_revision() {
    local file="$1"
    local rev; rev=$(get_field "$file" "revision")
    local next
    if [ -z "$rev" ] || ! echo "$rev" | grep -qE '^[0-9]+$'; then
        next=1
    else
        next=$((rev + 1))
    fi
    if grep -qE '^revision:' "$file"; then
        set_field "$file" "revision" "$next"
    else
        # Insert after last frontmatter line — append before second ---
        local tmp="${file}.tmp.$$"
        awk -v r="$next" '
            BEGIN { c=0; added=0 }
            /^---$/ { c++ }
            c==2 && !added && $0=="---" { print "revision: " r; added=1 }
            { print }
        ' "$file" > "$tmp"
        mv "$tmp" "$file"
    fi
    echo "$next"
}

# ---------------------------------------------------------------------------
# resolve_id <plans_dir> <input>
#   Wrap resolve-node.sh — returns node ID on stdout, or empty + exit 1/2.
# ---------------------------------------------------------------------------
resolve_id() {
    local plans="$1"; local input="$2"
    local script_dir; script_dir=$(dirname "${BASH_SOURCE[0]}")
    local result rc
    result=$(bash "${script_dir}/resolve-node.sh" "$input" "$plans" 2>/dev/null) || rc=$?
    rc="${rc:-0}"
    [ "$rc" = "0" ] || return $rc
    echo "$result" | head -1 | awk -F'\t' '{print $1}'
}

# ---------------------------------------------------------------------------
# resolve_file <plans_dir> <input>
#   Same as resolve_id but returns file path.
# ---------------------------------------------------------------------------
resolve_file() {
    local plans="$1"; local input="$2"
    local script_dir; script_dir=$(dirname "${BASH_SOURCE[0]}")
    local result rc
    result=$(bash "${script_dir}/resolve-node.sh" "$input" "$plans" 2>/dev/null) || rc=$?
    rc="${rc:-0}"
    [ "$rc" = "0" ] || return $rc
    echo "$result" | head -1 | awk -F'\t' '{print $2}'
}
