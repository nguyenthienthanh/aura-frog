#!/usr/bin/env bash
#
# audit-refs.sh — reference-integrity gate for the Aura Frog plugin.
#
# Runs the zero-orphan + zero-dead-link + user-invocable checks that used to
# live inline in .claude/CLAUDE.md. Run BEFORE any commit that touches
# agents/ · skills/ · rules/ · commands/ · hooks/.
#
#   ./scripts/audit/audit-refs.sh        # from repo root
#
# Exit 0 = clean. Exit 1 = at least one violation (do NOT commit).
#
# See docs/reference/MAINTENANCE.md for the full maintainer contract.

set -uo pipefail

# Resolve repo root from this script's location, then operate inside aura-frog/.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT/aura-frog" || { echo "FATAL: aura-frog/ not found"; exit 1; }

fail=0

echo "▶ Orphan rules (rule with zero inbound references)…"
while IFS= read -r rule; do
  count=$(grep -r --include="*.md" "$rule" . \
            --exclude-dir=rules --exclude-dir=.git 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" = "0" ]; then
    echo "  ORPHAN: $rule"
    fail=1
  fi
done < <(find rules -name "*.md" ! -name "README.md" -exec basename {} .md \;)

echo "▶ Dead links (referenced path that does not exist)…"
while IFS= read -r path; do
  # Skip prose enumerations like "(agents/skills/rules)" — the regex fragments
  # them, producing a token whose 2nd segment is itself a component dir name.
  case "$path" in
    */agents|*/skills|*/rules|*/commands|*/hooks|*/workflows|*/phases|*/metrics|*/observer|*/feedback) continue ;;
  esac
  # A reference is alive if the dir, the file, or the file+'.md' exists.
  # (Refs are written both as 'agents/architect' and 'agents/architect.md'.)
  if [ ! -e "$path" ] && [ ! -d "$path" ] && [ ! -e "$path.md" ]; then
    echo "  DEAD: $path"
    fail=1
  fi
done < <(grep -rhoE '(rules/[a-z]+|skills/[a-z-]+|agents/[a-z-]+)' --include="*.md" . | sort -u)

echo "▶ Dead file references (path with an extension that does not exist)…"
# The check above only sees narrow component/dir refs. This one catches refs
# written WITH an explicit file extension (rules/core/x.md, scripts/plans/y.sh)
# — the class the old regex truncated to a dir and reported "alive". Skips:
# glob/variable tokens, doc templates (NNN / service-name / -description), and an
# allowlist of intentional refs to not-yet-created / removed / example files
# (each documented as 'future' / 'removed' / example in its source line).
# docs/specs/*V3.7.0* = the authoritative V3.7.0 design spec, cited by section
# across core files; it lives outside the shipped repo (never committed), so the
# citations stay as provenance and resolve if the spec is added later.
ALLOW_MISSING='^(scripts/jira-fetch\.sh|scripts/preflight/install-opa\.sh|scripts/reproduce-bug\.sh|hooks/recursion-guard\.cjs|agents/observer\.md|docs/specs/AURA_FROG_V3\.7\.0_TECH_SPEC\.md|docs/specs/V3\.7\.0_DECISIONS\.md)$'
while IFS= read -r ref; do
  case "$ref" in
    *'*'*|*'$'*|*'{'*) continue ;;                     # glob / variable
    *NNN*|*service-name*|*-description*) continue ;;   # doc templates
  esac
  echo "$ref" | grep -qE "$ALLOW_MISSING" && continue  # intentional missing
  # scripts/ and docs/ live at the repo root, one level above aura-frog/.
  if [ ! -e "$ref" ] && [ ! -e "../$ref" ]; then
    echo "  DEAD FILE: $ref"
    fail=1
  fi
done < <(grep -rhoE '(rules|skills|agents|commands|hooks|scripts|docs)/[A-Za-z0-9_./-]+\.(md|sh|cjs|js|json|ya?ml)' \
           --include="*.md" . | sed -E 's/[.,:;)]+$//' | sort -u)

echo "▶ Skills missing 'user-invocable: false'…"
for f in skills/*/SKILL.md; do
  [ -e "$f" ] || continue
  grep -q "user-invocable: false" "$f" || { echo "  MISSING: $f"; fail=1; }
done

if [ "$fail" = "0" ]; then
  echo "✓ Reference integrity clean — zero orphans, zero dead links, all skills flagged."
else
  echo "✗ Reference integrity FAILED — fix the above before committing."
fi
exit "$fail"
