#!/bin/bash
# Aura Frog Status Line (v3.7.4+)
# Replaces the conversation banner — always visible, 0 tokens
#
# Receives JSON on stdin from Claude Code:
#   { display_name, used_percentage, cwd, ... }
#
# Reads additional state from:
#   .claude/cache/session-start-cache.json   — fallback for agent/phase
#   .claude/logs/runs/<latest>/run-state.json — primary source for mode + step
#
# Format:
#   🐸 AF v{version} │ {mode} {step} │ {agent} │ {model} │ {ctx}% ctx
#
# Examples:
#   🐸 AF v3.7.3 │ deep P3 │ architect │ Sonnet │ 12% ctx
#   🐸 AF v3.7.3 │ bugfix S2 │ tester   │ Sonnet │ 28% ctx
#   🐸 AF v3.7.3 │ idle     │ ready    │ Sonnet │  4% ctx
#
# Mode tokens: quick / standard / deep / project / bugfix / refactor / test / idle
# Step tokens: P1-P5 for 5-phase flows, S1-S4 for bugfix's 4-step TDD,
#              empty for quick/idle flows.

input=$(cat)

# ----- Helpers ---------------------------------------------------------------

parse_str() {
    echo "$input" | grep -o "\"$1\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/'
}
parse_num() {
    echo "$input" | grep -o "\"$1\"[[:space:]]*:[[:space:]]*[0-9.]*" | head -1 | sed 's/.*: *//'
}

# Read a string field from a JSON file (top-level only).
file_str() {
    local file="$1"; local key="$2"
    [ -f "$file" ] || return
    grep -o "\"${key}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" "$file" 2>/dev/null \
        | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/'
}
file_num() {
    local file="$1"; local key="$2"
    [ -f "$file" ] || return
    grep -o "\"${key}\"[[:space:]]*:[[:space:]]*[0-9.]*" "$file" 2>/dev/null \
        | head -1 | sed 's/.*: *//'
}

# ----- Project root resolution (matches hooks/lib/hook-runtime.cjs#findProjectRoot)
# Claude Code passes the project cwd via the JSON `cwd` field. Prefer that.
# Fallback: walk up from $PWD looking for .claude/ or .git/ marker.
find_project_root() {
    if [ -n "$AF_PROJECT_ROOT" ]; then echo "$AF_PROJECT_ROOT"; return; fi
    local start="${1:-$PWD}"
    local d="$start"
    while [ "$d" != "/" ] && [ -n "$d" ]; do
        if [ -d "$d/.claude" ] || [ -d "$d/.git" ]; then echo "$d"; return; fi
        d=$(dirname "$d")
    done
    echo "$start"
}
JSON_CWD=$(parse_str "cwd")
PROJECT_ROOT=$(find_project_root "${JSON_CWD:-$PWD}")

# ----- Claude Code inputs ----------------------------------------------------

MODEL=$(parse_str "display_name")
[ -z "$MODEL" ] && MODEL="unknown"

CTX_PCT=$(parse_num "used_percentage")
[ -z "$CTX_PCT" ] && CTX_PCT="0"
CTX_INT=${CTX_PCT%.*}

# ----- Aura Frog version -----------------------------------------------------

AF_VERSION="?"
for pjson in \
    "$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog/.claude-plugin/plugin.json" \
    "aura-frog/.claude-plugin/plugin.json"; do
    if [ -f "$pjson" ]; then
        v=$(file_str "$pjson" "version")
        [ -n "$v" ] && AF_VERSION="$v" && break
    fi
done

# ----- Run state (mode + step + agent) --------------------------------------

AF_MODE="idle"
AF_STEP=""
AF_AGENT="ready"

# Prefer the most recently-modified run-state.json with status=in_progress.
# Fall back to session-start cache.
RUNS_DIR="$PROJECT_ROOT/.claude/logs/runs"
if [ -d "$RUNS_DIR" ]; then
    LATEST_RUN=""
    while IFS= read -r f; do
        [ -f "$f" ] || continue
        status=$(file_str "$f" "status")
        if [ "$status" = "in_progress" ]; then
            LATEST_RUN="$f"
            break
        fi
    done < <(ls -1t "$RUNS_DIR"/*/run-state.json 2>/dev/null || true)

    if [ -n "$LATEST_RUN" ]; then
        flow=$(file_str "$LATEST_RUN" "flow")
        complexity=$(file_str "$LATEST_RUN" "complexity")
        phase=$(file_num "$LATEST_RUN" "current_phase")
        step_name=$(file_str "$LATEST_RUN" "current_step")
        active_agent=$(file_str "$LATEST_RUN" "active_agent")

        # Mode: prefer flow (specific), fall back to complexity (general).
        case "$flow" in
            feature-standard)            AF_MODE="standard" ;;
            feature-deep)                AF_MODE="deep" ;;
            bugfix)                      AF_MODE="bugfix" ;;
            refactor)                    AF_MODE="refactor" ;;
            test)                        AF_MODE="test" ;;
            security|review|deploy|quality) AF_MODE="$flow" ;;
            direct)                      AF_MODE="quick" ;;
            *)
                case "$complexity" in
                    Quick)    AF_MODE="quick" ;;
                    Standard) AF_MODE="standard" ;;
                    Deep)     AF_MODE="deep" ;;
                    Project)  AF_MODE="project" ;;
                    *)        AF_MODE="run" ;;
                esac
                ;;
        esac

        # Step: P1-P5 for phase-based flows, S1-S4 for step-based bugfix.
        if [ -n "$phase" ] && [ "$phase" != "0" ]; then
            AF_STEP="P${phase%.*}"
        elif [ -n "$step_name" ]; then
            case "$step_name" in
                investigate)   AF_STEP="S1" ;;
                test-red|red)  AF_STEP="S2" ;;
                fix-green|green) AF_STEP="S3" ;;
                verify)        AF_STEP="S4" ;;
                *)             AF_STEP="${step_name:0:8}" ;;
            esac
        fi

        # Agent: prefer active_agent, fall back to last entry in agents[].
        if [ -n "$active_agent" ]; then
            AF_AGENT="$active_agent"
        else
            last_agent=$(grep -oE '"agents"[[:space:]]*:[[:space:]]*\[[^]]*\]' "$LATEST_RUN" 2>/dev/null \
                | grep -oE '"[a-z-]+"' | tail -1 | tr -d '"')
            [ -n "$last_agent" ] && AF_AGENT="$last_agent"
        fi
    fi
fi

# Legacy fallback: session-start cache (pre-v3.7.4 surface).
if [ "$AF_AGENT" = "ready" ] && [ -f "$PROJECT_ROOT/.claude/cache/session-start-cache.json" ]; then
    cache_agent=$(file_str "$PROJECT_ROOT/.claude/cache/session-start-cache.json" "agent")
    [ -n "$cache_agent" ] && AF_AGENT="$cache_agent"
fi

# ----- Per-step model stack (v3.7.4 follow-up) ------------------------------
# When a Task tool dispatches a subagent with a different model, the
# task-track-model.cjs hook pushes a JSONL entry to the stack file. While the
# stack is non-empty, render the per-step variant: ▶ {phase} {step_model}
# ⏱{duration} │ session: {session_model}. When empty, render the unchanged
# mode/step/agent line.
#
# Disable: rename or chmod -x the hooks at aura-frog/hooks/task-{track,clear}-model.cjs.

STACK_FILE=".aura-frog/runtime/model-stack.jsonl"

# Format an elapsed-seconds count as Ns / MmSs / HhMMm per spec.
fmt_duration() {
    local secs="$1"
    [ -z "$secs" ] || [ "$secs" -lt 0 ] 2>/dev/null && secs=0
    if [ "$secs" -lt 60 ]; then
        printf '%ds' "$secs"
    elif [ "$secs" -lt 3600 ]; then
        printf '%dm%02ds' "$((secs / 60))" "$((secs % 60))"
    else
        printf '%dh%02dm' "$((secs / 3600))" "$(((secs % 3600) / 60))"
    fi
}

# Try the per-step render. Wrapped in a subshell with stderr swallowed so a
# corrupted last line, missing jq, or any other surprise falls through to
# the idle render — per the corruption-resilience invariant.
render_active() {
    [ -s "$STACK_FILE" ] || return 1
    command -v jq >/dev/null 2>&1 || return 1

    local top phase step_model started_iso started_epoch now_epoch elapsed dur
    top=$(tail -n 1 "$STACK_FILE" 2>/dev/null) || return 1
    [ -z "$top" ] && return 1

    phase=$(printf '%s' "$top" | jq -r '.phase // empty' 2>/dev/null) || return 1
    step_model=$(printf '%s' "$top" | jq -r '.model_display // empty' 2>/dev/null) || return 1
    started_iso=$(printf '%s' "$top" | jq -r '.started_at // empty' 2>/dev/null) || return 1
    [ -z "$phase" ] || [ -z "$step_model" ] && return 1

    # Compute duration. Hooks emit `new Date().toISOString()` which is always
    # UTC with trailing Z. Linux date -d "$iso" handles the Z. macOS BSD
    # date -j -f ignores Z and interprets the value as LOCAL time, so we
    # force TZ=UTC for the parse. Strip a trailing Z or +HH:MM offset before
    # passing to BSD date (it doesn't understand them).
    started_epoch=$(date -d "$started_iso" +%s 2>/dev/null \
        || TZ=UTC date -j -f "%Y-%m-%dT%H:%M:%S" "${started_iso%%[+.Z]*}" +%s 2>/dev/null \
        || echo "")
    if [ -n "$started_epoch" ]; then
        now_epoch=$(date +%s)
        elapsed=$((now_epoch - started_epoch))
        dur=" ⏱$(fmt_duration "$elapsed")"
    else
        dur=""
    fi

    echo "🐸 AF v${AF_VERSION} │ ▶ ${phase} │ ${step_model}${dur} │ session: ${MODEL} │ ${CTX_INT}% ctx"
    return 0
}

# ----- Build output ----------------------------------------------------------
# Cost segment removed in v3.7.4 — Claude Code's `total_cost_usd` is real
# but adds visual noise without per-call breakdown. If you want it back,
# run `/af status` for a richer cost+token report.

if render_active 2>/dev/null; then
    exit 0
fi

MODE_STEP="$AF_MODE"
[ -n "$AF_STEP" ] && MODE_STEP="$AF_MODE $AF_STEP"

echo "🐸 AF v${AF_VERSION} │ ${MODE_STEP} │ ${AF_AGENT} │ ${MODEL} │ ${CTX_INT}% ctx"
