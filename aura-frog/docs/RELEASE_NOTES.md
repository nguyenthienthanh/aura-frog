# Release Notes

Human-readable summary of each release. For full technical changelog, see [CHANGELOG.md](../CHANGELOG.md).

---

## v2.3.2 — README Rewrite + Fixes (March 30, 2026)

- **README marketing rewrite** — Benefit-first headings, side-by-side before/after, ~37% shorter
- **sync-settings fix** — `statusLine` config now properly merged from plugin defaults
- **CI scripts reorganized** — Validation scripts moved to `scripts/ci/`, added `generate-stats.sh`

---

## v2.3.1 — Banner Removed (March 30, 2026)

- **Status line only** — Banner deleted entirely. Agent/phase/model/context shown in CLI status bar (0 token overhead)
- Rules: 45 → 44 (banner rule removed)

---

## v2.3.0 — Status Line (March 30, 2026)

- **CLI status line** replaces conversation banner. Format: `🐸 AF v2.3.0 │ lead │ P1 │ Opus │ 12% ctx │ $0.05`
- `statusline.sh` script + `project:sync-settings` command
- 0 tokens used for agent identification (was ~80 tokens per banner)

---

## v2.2.2 — Consistency Pass (March 30, 2026)

- **116 files cleaned** — agent references, version footers, naming consistency
- All 67 command files: renamed agents, removed hardcoded versions, fixed cross-refs

---

## v2.2.1 — Command Cleanup (March 30, 2026)

- **67 command files** cleaned: agent names, version footers, stale references
- `af` CLI: corrected marketplace path, added setup guides (remote, channels, slack, schedule)

---

## v2.2.0 — ClaudeKit Learnings (March 24, 2026)

- **Thinking-boost hook** — Silent reasoning enhancement (4 levels, phase-aware)
- **6-aspect code review** — Security, types, errors, tests, quality, simplification
- **Performance tools** — `measure-performance.sh`, `profile-hooks.sh`, `af` CLI
- **CI workflow** — Plugin validation + performance reporting on push
- Showcase page deployed at ethannguyenlabs.xyz/aura-frog/

---

## v2.1.2 — Scout-block Fix (March 24, 2026)

- **scout-block.cjs** — Fixed false positives on heredoc content (only checks first line)

---

## v2.1.1 — Version Sync (March 24, 2026)

- **Version files reduced** from 60+ to 4 (single source of truth: plugin.json)
- `sync-version.sh` simplified

---

## v2.1.0 — Performance Release (March 24, 2026)

- **3-tier rule architecture** — core (always) / agent (per-type) / workflow (per-phase)
- **7 caching layers** — Agent detection, session start, test patterns, compact state
- **Conditional hooks** — Skip processing for non-code files (~40-60% fewer executions)
- **Smart compact** — Preserve Phase 1 decisions across /compact
- **Phase checkpoints + rollback**
- Context overhead: 29K → 6.4K lines (~78% reduction)

---

## v2.0.0 — Major Refactor (March 24, 2026)

**Breaking:** Agent names renamed, 10 skills removed, SEO/Godot externalized.

### Highlights
- **Agent rename:** cleaner names (frontend → frontend, tester → tester, etc.)
- **76% less context overhead:** auto-invoke skills reduced from 27 to 8
- **Git worktree support:** isolate workflow changes on separate branches
- **Phase checkpoints + rollback:** undo any phase with `workflow:rollback`
- **Collaborative planning:** 4-perspective analysis for complex tasks
- **New strategist agent:** business-level thinking (ROI, MVP scoping)
- **311 unit tests** across 8 hook test files

### Removed
- Model router (couldn't actually switch models mid-session)
- SEO/GEO suite (available as separate addon)
- Godot game engine support (available as separate addon)
- Visual pixel perfect module
- NativeWind generator

### Migration
- Update any custom configs using old agent names
- SEO commands no longer available
- Run `project:init` to regenerate project context files

---

## v1.21.0 — 5-Phase Consolidation (March 12, 2026)

### Highlights
- **9 → 5 phases:** simpler workflow, same 2 approval gates
- **Requirement challenger:** proactively questions assumptions
- **Logs cleanup:** `logs:cleanup` command

---

*For older releases, see [CHANGELOG.md](../CHANGELOG.md)*
