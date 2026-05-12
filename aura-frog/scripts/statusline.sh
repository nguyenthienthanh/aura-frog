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
RUNS_DIR=".claude/logs/runs"
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
if [ "$AF_AGENT" = "ready" ] && [ -f ".claude/cache/session-start-cache.json" ]; then
    cache_agent=$(file_str ".claude/cache/session-start-cache.json" "agent")
    [ -n "$cache_agent" ] && AF_AGENT="$cache_agent"
fi

# ----- Build output ----------------------------------------------------------
# Cost segment removed in v3.7.4 — Claude Code's `total_cost_usd` is real
# but adds visual noise without per-call breakdown. If you want it back,
# run `/af status` for a richer cost+token report.

MODE_STEP="$AF_MODE"
[ -n "$AF_STEP" ] && MODE_STEP="$AF_MODE $AF_STEP"

echo "🐸 AF v${AF_VERSION} │ ${MODE_STEP} │ ${AF_AGENT} │ ${MODEL} │ ${CTX_INT}% ctx"
