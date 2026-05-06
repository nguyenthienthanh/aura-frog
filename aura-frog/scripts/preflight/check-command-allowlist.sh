#!/usr/bin/env bash
# Aura Frog Pre-flight: Bash command allowlist / blocklist
# Blocks unconditionally destructive commands. Warns on potentially-destructive
# patterns. Pass anything else.
#
# Exit codes: 0 pass / 1 warn / 2 fail (block)
#
# Usage:
#   check-command-allowlist.sh "<bash command>"
#   echo "$CLAUDE_TOOL_INPUT" | check-command-allowlist.sh --from-tool-input

set -e

CMD=""
if [ "$1" = "--from-tool-input" ]; then
  CMD=$(cat)
elif [ -n "$1" ]; then
  CMD="$*"
fi

[ -z "$CMD" ] && exit 0

# Hard-block patterns — destruction without recourse
HARD_BLOCK=(
  'rm[[:space:]]+-rf?[[:space:]]+/(\s|$)'         # rm -rf /
  'rm[[:space:]]+-rf?[[:space:]]+/\*'             # rm -rf /*
  'rm[[:space:]]+-rf?[[:space:]]+~(\s|$|/)'       # rm -rf ~
  'rm[[:space:]]+-rf?[[:space:]]+\$HOME'
  'mkfs\.[a-z0-9]+'                                # mkfs.* (filesystem create)
  'dd[[:space:]]+if=/dev/(zero|random|urandom)[[:space:]]+of='
  ':\(\)\{[[:space:]]*:\|:&[[:space:]]*\};:'      # fork bomb
  'shutdown'
  'reboot([[:space:]]|$)'
  'halt([[:space:]]|$)'
  'init[[:space:]]+0'
  'chmod[[:space:]]+-R[[:space:]]+777[[:space:]]+/'
  'chown[[:space:]]+-R[[:space:]]+root'
  '>[[:space:]]*/dev/sda'
  'curl.+\|[[:space:]]*sudo[[:space:]]+(bash|sh)'  # pipe-to-sudo-shell
  'curl.+\|[[:space:]]*(bash|sh)[[:space:]]+-c'    # pipe-to-shell-c
)

for pat in "${HARD_BLOCK[@]}"; do
  if [[ "$CMD" =~ $pat ]]; then
    echo "preflight:cmd-allowlist FAIL: hard-blocked pattern matched ($pat)" >&2
    echo "  command: $CMD" >&2
    exit 2
  fi
done

# Warn patterns — risky but valid in some contexts
WARN_PATTERNS=(
  'git[[:space:]]+push[[:space:]]+.*--force([[:space:]]|$)'
  'git[[:space:]]+push[[:space:]]+.*-f([[:space:]]|$)'
  'git[[:space:]]+reset[[:space:]]+--hard'
  'git[[:space:]]+clean[[:space:]]+-[a-z]*f'
  'rm[[:space:]]+-rf?[[:space:]]+\.\/'             # rm -rf ./
  'rm[[:space:]]+-rf?[[:space:]]+(node_modules|dist|build|\.next|\.aura)'
  'DROP[[:space:]]+(TABLE|DATABASE)'
  'TRUNCATE[[:space:]]+TABLE'
  'DELETE[[:space:]]+FROM[[:space:]]+[a-z_]+[[:space:]]*;'    # DELETE without WHERE
  'sudo'
  'eval[[:space:]]+'
)

for pat in "${WARN_PATTERNS[@]}"; do
  if [[ "$CMD" =~ $pat ]]; then
    echo "preflight:cmd-allowlist WARN: $pat — verify intent" >&2
    exit 1
  fi
done

exit 0
