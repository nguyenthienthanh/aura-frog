#!/bin/bash
# envrc-guarded-source.sh
#
# Source-only helper (NEVER execute directly — must be `. "<this>"` or
# `source "<this>"` from a hook's command line). Replaces the unsafe
# pattern `if [ -f .envrc ]; then set -a; source .envrc; set +a; fi`
# that would auto-execute arbitrary code from any cloned repository.
#
# Behavior:
#   1. If $PWD/.envrc does not exist → do nothing (silent).
#   2. If a per-user trust file maps $PWD/.envrc to a sha256 that matches
#      the file's current hash → source it with `set -a; source; set +a`.
#   3. Otherwise → skip + emit a one-time stderr hint.
#
# Trust file: ~/.config/aura-frog/envrc-trust.json
# Schema:     { "/abs/path/to/.envrc": { "sha256": "<hex>", "approved_at": "<iso>" } }
# Approve:    af envrc allow     (computes hash + writes entry)
# Revoke:     af envrc revoke
# Status:     af envrc status
#
# Disable the gate (auto-source as before — NOT RECOMMENDED):
#   export AF_ENVRC_UNSAFE_AUTO_SOURCE=true
#
# Rationale: closes the HIGH-severity finding where cloning a hostile
# repo with a crafted .envrc would execute arbitrary code as the user
# on SessionStart / PreToolUse / UserPromptSubmit hooks.

af_envrc_guarded_source() {
  local envrc_path="$PWD/.envrc"
  [ ! -f "$envrc_path" ] && return 0

  # Opt-out for users who explicitly want the old behavior.
  if [ "${AF_ENVRC_UNSAFE_AUTO_SOURCE:-}" = "true" ]; then
    set -a; . "$envrc_path" 2>/dev/null; set +a
    return 0
  fi

  local trust_file="${HOME}/.config/aura-frog/envrc-trust.json"
  if [ ! -f "$trust_file" ]; then
    _af_envrc_warn_once
    return 0
  fi

  # Compute current hash (BSD shasum or GNU sha256sum).
  local current_hash=""
  if command -v sha256sum >/dev/null 2>&1; then
    current_hash=$(sha256sum "$envrc_path" 2>/dev/null | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    current_hash=$(shasum -a 256 "$envrc_path" 2>/dev/null | awk '{print $1}')
  else
    # No hash tool — fail closed (do NOT source).
    return 0
  fi
  [ -z "$current_hash" ] && return 0

  # Look up expected hash in trust file.
  local expected_hash=""
  if command -v jq >/dev/null 2>&1; then
    expected_hash=$(jq -r --arg p "$envrc_path" '.[$p].sha256 // empty' "$trust_file" 2>/dev/null)
  else
    # Fallback: line-based extraction. Works with the canonical pretty-printed
    # JSON our writer produces; brittle on hand-edited files (which is fine —
    # we recommend using `af envrc allow` to write the file).
    expected_hash=$(awk -v path="\"$envrc_path\":" '
      $0 ~ path { in_block=1 }
      in_block && /"sha256":/ { gsub(/.*"sha256": *"/, ""); gsub(/".*/, ""); print; exit }
    ' "$trust_file" 2>/dev/null)
  fi

  if [ -n "$expected_hash" ] && [ "$current_hash" = "$expected_hash" ]; then
    set -a; . "$envrc_path" 2>/dev/null; set +a
  else
    _af_envrc_warn_once
  fi
}

_af_envrc_warn_once() {
  # One stderr line per shell — prevents log spam on rapid-fire hooks.
  if [ -z "${AF_ENVRC_WARN_SHOWN:-}" ]; then
    echo "[af] .envrc found but not trusted — auto-source skipped. To approve: af envrc allow" >&2
    export AF_ENVRC_WARN_SHOWN=1
  fi
}

af_envrc_guarded_source
