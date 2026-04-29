# /aura:trace

**Render the reasoning trace for a task** — file_reads, output_claims, tool_calls, decisions. Surfaces hallucinations (claims with `grounded: false`).

---

## Usage

```
/aura:trace <TASK_ID>                          # full trace, table format
/aura:trace <TASK_ID> --filter file_read       # one event type only
/aura:trace <TASK_ID> --hallucinations         # only output_claim events with grounded:false
/aura:trace <TASK_ID> --tail 50                # last N events
/aura:trace <TASK_ID> --since 2026-04-29T12:00:00Z
/aura:trace --active                            # use the active.task from .aura/plans/active.json
```

## Protocol

1. **Resolve** TASK_ID. If `--active`, read `.aura/plans/active.json` → `active.task`. Refuse if no active task.
2. **Read** `.aura/plans/traces/{TASK_ID}.jsonl`. If file missing → exit with message "no trace yet for {TASK_ID}".
3. **Parse** each line as JSON. Filter by `--filter` and `--since` flags.
4. **Render table** (columns: ts, event_id, type, summary). For long payloads (>80 chars), truncate with `…`.
5. **Halluciation summary**: count of `output_claim` with `grounded:false`. If > 0 in non-`--hallucinations` mode, print: `⚠️  N potential hallucinations — re-run with --hallucinations to see them`.
6. **Storage warning**: if trace file > 10 MB or > 1000 events → suggest `/aura:plan:archive` (Milestone C).

## Output format

```
TR-00101-001  2026-04-29T14:32:00Z  file_read     src/auth/jwt.ts (sha256:abc…)
TR-00101-002  2026-04-29T14:32:01Z  tool_call     Read({path: "src/auth/jwt.ts"})
TR-00101-003  2026-04-29T14:32:01Z  tool_result   exit=0 duration=12ms
TR-00101-004  2026-04-29T14:32:05Z  output_claim  "exports verifyToken" grounded:✓ (by TR-00101-001)
TR-00101-005  2026-04-29T14:32:08Z  output_claim  "uses HS256 algorithm" grounded:✗

Summary: 5 events | 2 file_reads | 2 output_claims | 1 hallucination flagged

⚠️  1 potential hallucination — re-run with --hallucinations to see them
```

## --hallucinations mode

Prints only `output_claim` events where `grounded == false`. For each, shows:
- The unsupported claim text
- The closest matching file_read events (Levenshtein distance on path/symbol)
- A pointer to grounding-discipline rule

## Constraints

- Read-only — never mutates trace files
- Exits 0 if trace file is missing (not an error; just no trace yet)
- Exits 1 if `--active` and no active task is set
- Limits output to `--tail 200` by default; full trace rendered only on `--all`

## Tie-Ins

- **Spec:** §10.3, §11.1 (grounding-discipline)
- **Skill:** `reasoning-trace-recorder` — produces the .jsonl files
- **Rule:** `rules/core/grounding-discipline.md` — defines what counts as "grounded"
- **Hook:** `hooks/tool-call-tracer.cjs` — appends tool_call/tool_result events
- **Companion command:** `/aura:plan:status` — high-level plan view
