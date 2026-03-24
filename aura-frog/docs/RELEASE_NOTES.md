# Release Notes

Human-readable summary of each release. For full technical changelog, see [CHANGELOG.md](../CHANGELOG.md).

---

## v2.0.0 — Major Refactor (March 24, 2026)

**Breaking:** Agent names renamed, 10 skills removed, SEO/Godot externalized.

### Highlights
- **Agent rename:** cleaner names (ui-expert → frontend, qa-automation → tester, etc.)
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
