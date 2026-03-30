#!/bin/bash
# Aura Frog Hook Profiler
# Measures execution time and output size for all registered hooks
#
# Usage: bash aura-frog/scripts/profile-hooks.sh [iterations]

set -e
ITERATIONS="${1:-3}"
PLUGIN_DIR="aura-frog"
HOOKS_DIR="$PLUGIN_DIR/hooks"

echo "🪝 Hook Performance Profile ($ITERATIONS iterations avg)"
echo "=================================================="
echo ""

total_hooks=0
slow_hooks=0

for hook in "$HOOKS_DIR/"*.cjs; do
  name=$(basename "$hook")
  # Skip lib directory entries
  [ ! -f "$hook" ] && continue

  total_hooks=$((total_hooks + 1))
  total_ms=0
  total_bytes=0

  for i in $(seq 1 "$ITERATIONS"); do
    start_ms=$(( 10#$(date +%s%3N 2>/dev/null || echo "$(date +%s)000") ))

    # Run hook with empty JSON input, capture output
    output=$(echo '{}' | timeout 5 node "$hook" 2>&1 || true)

    end_ms=$(( 10#$(date +%s%3N 2>/dev/null || echo "$(date +%s)000") ))

    ms=$((end_ms - start_ms))
    [ "$ms" -lt 0 ] && ms=0
    bytes=${#output}

    total_ms=$((total_ms + ms))
    total_bytes=$((total_bytes + bytes))
  done

  avg_ms=$((total_ms / ITERATIONS))
  avg_bytes=$((total_bytes / ITERATIONS))
  avg_tokens=$((avg_bytes / 6))  # rough estimate: ~6 bytes per token

  if [ "$avg_ms" -gt 1000 ]; then
    icon="🔴"
    slow_hooks=$((slow_hooks + 1))
  elif [ "$avg_ms" -gt 100 ]; then
    icon="🟡"
  else
    icon="✅"
  fi

  token_note=""
  [ "$avg_tokens" -gt 500 ] && token_note=" ⚠️ BLOAT"

  printf "  %s %-30s %4dms  %5d bytes  ~%d tokens%s\n" "$icon" "$name" "$avg_ms" "$avg_bytes" "$avg_tokens" "$token_note"
done

echo ""
echo "Total: $total_hooks hooks, $slow_hooks slow (>1s)"
echo "=================================================="
