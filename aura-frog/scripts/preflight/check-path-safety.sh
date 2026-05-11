#!/usr/bin/env bash
# Aura Frog Pre-flight: path safety
# Reject path traversals (../../../etc/passwd) and absolute paths outside the repo
# (except known-safe dirs: /tmp, /var/tmp, the user's home).
#
# Exit codes:
#   0 — pass
#   1 — warn (path is suspicious but allowed; warn user)
#   2 — fail (block — clear traversal or hostile target)
#
# Usage:
#   check-path-safety.sh <path>
#   echo "$CLAUDE_TOOL_ARGS" | check-path-safety.sh --from-tool-args

set -e

TARGET=""
SOURCE=""

if [ "$1" = "--from-tool-args" ]; then
  ARGS_JSON=$(cat)
  TARGET=$(echo "$ARGS_JSON" | jq -r '.file_path // .path // ""' 2>/dev/null || echo "")
  SOURCE="tool-args"
elif [ -n "$1" ]; then
  TARGET="$1"
  SOURCE="cli"
fi

[ -z "$TARGET" ] && exit 0

# Reject obvious traversal patterns
if [[ "$TARGET" =~ \.\.\/.*\.\.\/ ]] || [[ "$TARGET" =~ ^\.\.\/\.\.\/ ]]; then
  echo "preflight:path-safety FAIL: traversal pattern in $TARGET" >&2
  exit 2
fi

# Hostile targets (system files)
case "$TARGET" in
  /etc/passwd|/etc/shadow|/etc/sudoers|/etc/sudoers.d/*|/root/*|/proc/*|/sys/*|/dev/*)
    echo "preflight:path-safety FAIL: system path $TARGET" >&2
    exit 2
    ;;
  ~/.ssh/*|*.ssh/id_rsa|*.ssh/id_ed25519|*/.aws/credentials|*/.config/gcloud/*)
    echo "preflight:path-safety FAIL: credential path $TARGET" >&2
    exit 2
    ;;
esac

# Resolve to absolute and check it stays within repo OR a safe sandbox
case "$TARGET" in
  /*) ABS="$TARGET" ;;
  *)  ABS="$(pwd)/$TARGET" ;;
esac

REPO_ROOT="$(pwd)"
case "$ABS" in
  "$REPO_ROOT"*|/tmp/*|/var/tmp/*|"$HOME"/*) : ;;
  *)
    echo "preflight:path-safety WARN: $TARGET resolves outside repo + sandbox dirs" >&2
    exit 1
    ;;
esac

exit 0
