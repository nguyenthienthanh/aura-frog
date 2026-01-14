# Aura Frog - Changelog

All notable changes to Aura Frog will be documented in this file.

---

## [1.14.0] - 2026-01-14

### Visual Pixel-Perfect Testing

New skill for automated visual regression testing with implement → render → snapshot → compare → fix loop.

#### Added
- **visual-pixel-perfect skill** - `skills/visual-pixel-perfect/SKILL.md`
  - Auto-invokes on "visual test", "pixel perfect", "design match", "visual regression"
  - Implement → Render → Snapshot → Compare → Fix loop (max 5 attempts)
  - Thresholds: web <0.5%, PDF <1.0%
  - References: design-spec-schema, design-tokens-contract, diff-engine-config, render-configs, ci-integration
- **visual-pixel-accuracy rule** - `rules/visual-pixel-accuracy.md` (CRITICAL)
  - No guessing (use tokens only)
  - Pixel accuracy over code style
  - No success without diff pass
  - Frozen regions immutable
- **visual-pixel-init hook** - `hooks/visual-pixel-init.cjs`
  - Detects `.claude/visual/` folder on session start
  - Injects AF_VISUAL_TESTING, AF_VISUAL_PATH, AF_VISUAL_WEB_THRESHOLD, AF_VISUAL_PDF_THRESHOLD
- **Visual scripts** - `scripts/visual/`
  - `init-claude-visual.sh` - Initialize .claude/visual/ folder structure
  - `pdf-render.sh` - Puppeteer PDF rendering
  - `snapshot-compare.sh` - Pixelmatch diff comparison
  - `visual-test.sh` - Main test runner (npm run claude:visual-test)

#### Updated
- **`hooks/hooks.json`** - Added visual-pixel-init to SessionStart
- **`hooks/README.md`** - Documented visual-pixel-init hook, count: 15 → 16
- **`rules/README.md`** - Added visual-pixel-accuracy rule, count: 45 → 46
- **`skills/README.md`** - Added visual-pixel-perfect skill, count: 38 → 39
- **`CLAUDE.md`** - Added visual-pixel-perfect to auto-invoke skills list

#### Project Folder Structure
```
.claude/visual/
├── design/           # Reference images
├── spec/             # DesignSpec JSON files
├── tokens/           # Design tokens
├── snapshots/
│   ├── baseline/     # Approved snapshots
│   ├── current/      # Test run snapshots
│   └── diff/         # Diff images
├── tests/            # Visual test files
└── config.json       # Visual testing config
```

#### Stats
- Rules: 46 (was 45)
- Skills: 39 (was 38)
- Hooks: 16 (was 15)
- Scripts: +4 new visual scripts

---

## [1.13.0] - 2026-01-14

### Frontend Excellence + Lint Auto-Fix + Hooks Cleanup

Major frontend optimization with actionable UX/UI guidance, plus automatic linting!

#### Cleanup
- **Merged `workflow-metrics.cjs` into `session-metrics.cjs`** - Pattern extraction now happens on session stop
- **Removed unused `workflow-metrics.cjs`** - Was documented but never registered in hooks.json
- **Fixed hooks count** - Accurate count now: 15 hooks (was incorrectly 16)

#### Added
- **frontend-excellence rule** - `rules/frontend-excellence.md` (CRITICAL)
  - **UX Laws**: Fitts' (touch targets), Jakob's (standard patterns), Hick's (limit choices), Miller's (chunking)
  - **Performance Targets**: LCP <2.5s, CLS <0.1, INP <200ms, 60fps mobile, Lighthouse 90+
  - **Accessibility Checklist**: 4.5:1 contrast, 48dp touch targets, keyboard nav, ARIA patterns
  - **Mobile UX**: Thumb zones, one-handed use (49% users), iOS/Android conventions
  - **Loading States**: Skeleton screens, optimistic updates, timing guidelines
  - **Form UX**: Validation timing, error messages, autofill support
  - **Decision Trees**: Button styling, action placement, loading indicators
- **code-simplifier skill** - `skills/code-simplifier/SKILL.md`
  - Auto-invokes on "simplify", "too complex", "KISS", "over-engineered"
  - References `rules/kiss-avoid-over-engineering.md` (avoids duplication)
  - Quick reference for complexity targets and checklist
  - Links to `quality:complexity` command
- **Lint auto-fix hook** - `hooks/lint-autofix.cjs`
  - Auto-detects file type and available linters
  - Runs linter with --fix flag after Write/Edit
  - Supports: ESLint, Prettier, PHP CS Fixer, Pint, Ruff, Black, gofmt, Rubocop, rustfmt, dart format
  - Non-blocking - reports results but doesn't fail operations
  - Disable with `AF_LINT_AUTOFIX=false`

#### Updated
- **`agents/web-expert.md`** v3.0 - Added performance targets, UX laws, accessibility checklist, loading/error patterns
- **`agents/mobile-expert.md`** v3.0 - Added touch targets, thumb zones, iOS/Android conventions, FlashList, haptics
- **`agents/ui-designer.md`** v2.0 - Added UX laws application, accessibility checks in analysis
- **`rules/README.md`** - Added frontend-excellence rule, count: 44 → 45
- **`skills/README.md`** - Added code-simplifier skill, count: 37 → 38
- **`CLAUDE.md`** - Added code-simplifier to auto-invoke skills list
- **`hooks.json`** - Added lint-autofix to PostToolUse (Write|Edit)
- **`hooks/README.md`** - Documented lint-autofix hook (#7), count: 15 → 16

#### Supported Linters
| Language | Linters |
|----------|---------|
| JS/TS/Vue | ESLint, Prettier |
| CSS/SCSS | Prettier, Stylelint |
| PHP | PHP CS Fixer, Laravel Pint |
| Python | Ruff, Black |
| Go | gofmt, goimports |
| Ruby | Rubocop |
| Rust | rustfmt |
| Dart | dart format |

#### Stats
- Rules: 45 (was 44)
- Skills: 38 (was 37)
- Hooks: 15 (was 14, +1 new, -1 removed duplicate)

---

## [1.11.1] - 2026-01-08

### Auto-Learn v2.0: Deduplication & Pattern Detection

Enhanced auto-learn hook with smart deduplication and pattern detection.

#### Updated
- **`hooks/auto-learn.cjs`** v2.0.0 - Added deduplication, pattern detection, local cache
- **`hooks/README.md`** - Updated auto-learn documentation

---

## [1.11.0] - 2026-01-08

### Auto-Learn: Automatic Feedback Detection with Deduplication & Patterns

Learning system now automatically detects corrections and approvals from your messages - no need to run `/learn:feedback` manually!

#### Added
- **Auto-learn hook v2.0** - `hooks/auto-learn.cjs`
  - Fires on every UserPromptSubmit
  - Detects correction patterns: "no", "wrong", "actually", "don't do that", "should be"
  - Detects approval patterns: "good", "great", "perfect", "looks good"
  - Auto-categorizes: code_style, testing, security, code_quality
  - **Deduplication** - Skips identical feedback within 24 hours (MD5 hash)
  - **Pattern detection** - Auto-creates learned patterns after 3+ similar corrections
  - **Local cache** - `.claude/cache/auto-learn-cache.json` for deduplication
  - **Local patterns** - `.claude/cache/learned-patterns.md` human-readable file
  - Non-blocking - never interrupts your flow

#### Updated
- **`hooks.json`** - Added auto-learn hook to UserPromptSubmit
- **`hooks/README.md`** - Documented auto-learn hook (hook #8), updated count to 15 hooks

#### How It Works
```
User: "Don't add comments everywhere"
         ↓
   [Auto-Learn Hook]
         ↓
   Hash: abc123... (check dedup cache)
         ↓
   Not duplicate → increment pattern count
         ↓
   🧠 Learning: Captured correction [code_style:minimal_comments] (2x)
         ↓
   → Recorded to Supabase + local cache

# After 3rd correction about comments:
   🧠 Learning: Pattern detected! "code_style:minimal_comments" (3 occurrences)
         ↓
   → Auto-creates learned pattern in Supabase
```

#### Stats
- Hooks: 15 (was 14)

---

## [1.10.1] - 2026-01-08

### Bug Fix: Session Hooks Not Loading Environment Variables

#### Fixed
- **Session hooks not loading .envrc** - Hooks that use Supabase (session-start, feedback-capture, session-metrics) now properly source `.envrc` before executing
  - Root cause: Node.js hooks ran as separate processes without inheriting environment variables
  - Memory auto-load was failing silently with "Learning disabled" or "Missing Supabase config"
  - Added `source .envrc` to SessionStart, PostToolUse (Write|Edit), and Stop hooks

#### How It Works Now
```bash
# Before (broken)
node "hooks/session-start.cjs"  # No env vars!

# After (fixed)
if [ -f .envrc ]; then set -a; source .envrc; set +a; fi; node "hooks/session-start.cjs"
```

---

## [1.10.0] - 2026-01-08

### Memory Auto-Load from Supabase

Learned patterns and insights now automatically load at session start!

#### Added
- **Memory auto-loader** - `hooks/lib/af-memory-loader.cjs`
  - Queries Supabase for learned patterns at session start
  - Caches results to `.claude/cache/memory-context.md`
  - 1-hour cache TTL, auto-refreshes when stale
  - Non-blocking (fails gracefully if Supabase unavailable)

- **Memory environment variables**
  - `AF_MEMORY_LOADED` - true/false
  - `AF_MEMORY_COUNT` - number of items loaded
  - `AF_MEMORY_ERROR` - error message if failed

- **Memory status in banner**
  - Shows `Memory: X items loaded` in first response
  - Shows `Memory: X items (cached)` when using cache

#### Updated
- **`session-start.cjs`** v1.1.0 - Now calls memory loader
- **`agent-identification-banner.md`** v1.10.0 - Added memory status section
- **`LEARNING_SYSTEM.md`** v1.10.0 - Documented auto-load feature
- **`CLAUDE.md`** - Added memory loading to session start steps

#### How It Works
```
Session Start
    │
    ├── 1. Check env vars
    ├── 2. Load memory from Supabase (NEW!)
    │      └── Caches to .claude/cache/memory-context.md
    ├── 3. Show banner with memory status
    └── ... rest of session start
```

#### What's Loaded
- Learned patterns (confidence ≥70%)
- Agent success rates (last 15 agents)
- Recent corrections (last 30 days)
- Recent insights (last 7 days)

---

## [1.9.3] - 2026-01-07

### Version Sync & Learn Command Execution Fixes

#### Fixed
- **Learn commands not executing** - All `/learn:*` commands now have CRITICAL execution notes
  - Commands were showing documentation but Claude wasn't executing the curl commands
  - Added explicit "MUST Execute" sections to ensure data is sent to Supabase
  - Created `scripts/learn/submit-feedback.sh` as standalone backup

- **Version sync script** - Improved `scripts/sync-version.sh`:
  - Added more files to update list (global CLAUDE.md, docs with banners)
  - Improved pattern matching for different version string formats
  - Now handles: `System: Aura Frog vX.Y.Z`, `Plugin: Aura Frog vX.Y.Z`, banner headers

#### Updated
- **`/learn:feedback`** - Added CRITICAL execution note
- **`/learn:status`** - Added CRITICAL execution note
- **`/learn:analyze`** - Added CRITICAL execution note
- **`/learn:apply`** - Added CRITICAL execution note
- **`/learn:setup`** - Added CRITICAL execution note
- **All version references** - Updated to v1.9.3 across all files

---

## [1.9.2] - 2026-01-07

### Auto-Check Environment at Session Start

#### Added
- **Mandatory env check** - Always check env vars FIRST before responding
- **Auto-reload** - Run `project:reload-env` automatically if not configured
- **Status display** - Show MCP and Learning status in first response

#### Updated
- **Session start order** - Env check is now step 1 (was step 2)
- **`rules/env-loading.md`** - Added mandatory check section

---

## [1.9.1] - 2026-01-07

### Version Consistency & Manual Feedback

#### Added
- **`/learn:feedback`** - Manual feedback submission command
  - Report successes, corrections, agent issues, workflow problems
  - Quick feedback mode with `--type` and `--message` flags
  - Interactive mode for detailed feedback

#### Fixed
- **Version references** - Updated all v1.0.0 references to v1.9.1
  - Fixed global `~/.claude/CLAUDE.md`
  - Fixed banner examples in `setup/activate.md`
  - Fixed docs: STYLING_DETECTION_GUIDE.md, AGENT_SELECTION_GUIDE.md
  - Fixed workflow/phase-1.md examples

#### Updated
- **Commands count** - Now 79 (was 77)
  - Added: `/learn:setup`, `/learn:feedback`

---

## [1.9.0] - 2026-01-07

### Learning System - Self-Improvement via Supabase

Aura Frog can now learn and improve over time by collecting feedback, tracking metrics, and applying learned patterns.

#### Added

- **Learning System** - Cloud-based learning with Supabase
  - `docs/LEARNING_SYSTEM.md` - Full setup and usage guide
  - `scripts/supabase/schema.sql` - Database schema for learning tables
  - Feedback collection (corrections, approvals, rejections)
  - Workflow metrics tracking
  - Agent performance monitoring
  - Pattern recognition and insights

- **New Skills**
  - `skills/learning-analyzer/` - Analyze patterns and generate insights
  - `skills/self-improve/` - Apply learned improvements to plugin

- **New Commands** (5)
  - `/learn:setup` - Automatic schema setup via API
  - `/learn:status` - Display learning system status
  - `/learn:feedback` - Manually submit feedback (success, correction, agent issue)
  - `/learn:analyze` - Run pattern analysis
  - `/learn:apply` - Apply learned improvements

- **Setup Script**
  - `scripts/supabase/setup-schema.cjs` - Automated schema creation

- **New Hooks**
  - `hooks/feedback-capture.cjs` - Capture user corrections (auto on Write/Edit)
  - `hooks/workflow-metrics.cjs` - Send metrics to Supabase
  - `hooks/session-metrics.cjs` - Auto-send metrics on session end
  - `hooks/lib/af-learning.cjs` - Learning system utilities

- **Updated Hooks**
  - `hooks/subagent-init.cjs` - Now tracks agent usage for learning
  - `hooks/hooks.json` - Added session-metrics to Stop event

- **Environment Variables**
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_PUBLISHABLE_KEY` - Public key (safe for client)
  - `SUPABASE_SECRET_KEY` - Secret key (server-side only)
  - `AF_LEARNING_ENABLED` - Enable/disable learning
  - `AF_FEEDBACK_COLLECTION` - Enable feedback capture
  - `AF_METRICS_COLLECTION` - Enable metrics tracking
  - `AF_AUTO_ANALYZE` - Auto-analysis schedule

#### Features

1. **Feedback Collection**
   - Detects user corrections to AI output
   - Captures approval/rejection reasons at gates
   - Optional quality ratings

2. **Metrics Tracking**
   - Workflow success/failure rates
   - Token usage per phase
   - Agent performance by task type
   - Test coverage trends

3. **Pattern Analysis**
   - Success patterns (what works)
   - Failure patterns (common issues)
   - Optimization opportunities
   - Agent routing recommendations

4. **Self-Improvement**
   - Review and apply suggestions
   - Auto-apply high-confidence improvements
   - Rollback support with backups

#### Stats
- Skills: 37 (was 35)
- Commands: 79 (was 73)
- Hooks: 14 (was 11)

---

## [1.8.1] - 2026-01-02

### Fix: Auto-Continue Phases Being Skipped

Fixed documentation inconsistency where auto-continue phases were being skipped entirely instead of executing and showing deliverables.

#### Fixed
- **`rules/approval-gates.md`** - Updated to v2.0.0
  - Clarified 2-gate workflow (Phase 2 & 5b only)
  - Auto-continue phases now clearly defined: Execute → Show → Continue
  - Added "Common Mistakes to Avoid" section
  - Removed old 9-gate language

- **`rules/execution-rules.md`** - Updated to v2.0.0
  - Split phase completion rules into Approval vs Auto-Continue
  - Clarified NEVER rules: "Skip auto-continue phases entirely" is forbidden
  - Added Phase Behavior Summary quick reference

- **`rules/safety-rules.md`** - Updated approval gates section
  - Shows 2-gate model with auto-continue phases
  - Added auto-stop conditions explanation

- **`README.md`** - Updated quality gates description
  - "Only 2 approval gates (Phase 2 & 5b)"

- **`CLAUDE.md`** - Updated execution rules
  - Added 2-Gate Workflow note
  - Clarified NEVER rules

- **`commands/workflow/phase-1.md`** - Fixed step 10
  - Changed "Wait for user approval" to "Auto-continue to Phase 2"

#### Key Clarification
```
Auto-continue ≠ Skip!

Approval Phases (2, 5b):     Execute → Show → WAIT → User approves → Continue
Auto-Continue Phases:        Execute → Show → Continue automatically
Auto-Stop (on blockers):     Execute → Issue found → STOP for fix
```

---

## [1.8.0] - 2026-01-01

### Streamlined Workflow with 2 Approval Gates

Reduced approval gates from 8 to 2 for faster workflow execution while maintaining quality.

#### Updated
- **`skills/workflow-orchestrator/SKILL.md`** - Streamlined workflow
  - Only 2 approval gates: Phase 2 (Design) and Phase 5b (Implementation)
  - All other phases auto-continue unless blockers hit
  - Auto-stop triggers: test failures, security issues, coverage < 80%
  - Flow: `START → Phase 1 (auto) → Phase 2 ✋ → Phases 3-5a (auto) → Phase 5b ✋ → Phases 5c-9 (auto) → DONE`

- **`rules/workflow-navigation.md`** - Updated approval gate documentation
  - Reflects new 2-gate workflow
  - Updated example showing auto-continue paths

- **`templates/project-claude.md`** - Updated template
  - Version 1.8.0
  - Removed atlassian MCP (replaced with bash scripts in 1.6.0)

#### Why This Change
- Faster feature delivery with fewer interruptions
- Critical decisions (architecture, implementation) still require approval
- Auto-stop on errors ensures quality is maintained
- TDD still enforced throughout

---

## [1.7.0] - 2025-12-26

### Fast-Track Workflow for Pre-Approved Specs

New workflow mode for executing phases 4-9 without approval gates when design/specs are already complete.

#### Added
- **`skills/workflow-fasttrack/`** - New skill for fast-track execution
  - `SKILL.md` - Full skill with spec validation, auto-execution, error handling
  - Skips phases 1-3 (requirements, design, UI breakdown)
  - Auto-executes phases 4-9 without approval gates
  - Only stops on errors (test failures, security issues, coverage < 80%)
  - TDD still enforced (RED → GREEN → REFACTOR)

#### How to Use
```
fasttrack: [paste your specs]
```
or
```
workflow:fasttrack path/to/specs.md
```
or
```
Here's my complete design. Just build it.
[specs content]
```

#### Required Spec Sections
- Overview - What we're building
- Requirements - Functional requirements
- Technical Design - Architecture/approach
- API/Interfaces - Endpoints or component APIs
- Data Model - Database/state structure
- Acceptance Criteria - Definition of done

#### Execution Flow
```
Spec Validation → Phase 4 (Test Plan) → Phase 5a (RED) →
Phase 5b (GREEN) → Phase 5c (REFACTOR) → Phase 6 (Review) →
Phase 7 (Verify) → Phase 8 (Document) → Phase 9 (Notify)
```

#### Stop Conditions
- Tests unexpectedly pass in Phase 5a (RED phase should fail)
- Tests fail after 3 implementation attempts
- Critical security vulnerability found
- Coverage below 80%
- Token limit warning

#### Stats
- **Skills:** 35 (was 34) - 24 auto-invoking + 11 reference

---

## [1.6.0] - 2025-12-26

### Godot Game Development Support

Comprehensive Godot engine support for multi-platform game development (HTML5, Android, iOS, Desktop).

#### Added
- **`skills/godot-expert/`** - New skill for Godot game development
  - `SKILL.md` - Main skill with 10 content sections (~600 lines)
  - `references/export-platforms.md` - HTML5, Android, iOS, Desktop export guides
  - `references/ui-patterns.md` - Game UI (HUD, menus, dialogs, touch controls)
  - `references/testing-gdunit.md` - GDUnit testing patterns

- **`agents/game-developer.md`** - New agent for game development
  - Detects Godot projects from `project.godot`
  - Routes to `godot-expert` skill
  - Future support for Phaser.js, Unity, Unreal

- **`rules/godot-scene-composition.md`** - Scene vs node patterns
  - When to create scenes vs add nodes
  - Composition and inheritance patterns
  - Anti-patterns to avoid

- **`rules/godot-gdscript-typing.md`** - GDScript typing rules
  - Type hints for variables, functions, signals
  - Static typing best practices
  - Performance benefits

#### Updated
- **Session-start hook** - Added Godot version detection
  - Detects `project.godot` file
  - Parses `config_version` for Godot 3.x vs 4.x
  - Sets `AF_GODOT_VERSION` environment variable

- **Documentation**
  - `CLAUDE.md` - Added godot-expert to skills (23 auto-invoking)
  - `skills/README.md` - Added skill documentation, updated counts
  - `agents/README.md` - Added game-developer agent (15 agents)
  - `rules/README.md` - Added 2 Godot rules (44 total)

#### Skill Content (godot-expert)
1. Project Structure - Directory layout, res:// paths
2. Scenes & Nodes - Composition, inheritance, instancing
3. GDScript Patterns - Typing, signals, async, classes
4. Physics & Collision - Bodies, areas, layers
5. Input Handling - Actions, events, touch
6. UI/Control Nodes - HUD, menus, themes
7. Animation & Audio - AnimationPlayer, Tweens, AudioStreamPlayer
8. Performance - Object pooling, LOD, profiling
9. Export Targets - HTML5, Android, iOS, Desktop
10. Testing - GDUnit, scene testing, mocking

#### Stats
- **Skills:** 34 (was 33) - 23 auto-invoking + 11 reference
- **Agents:** 15 (was 14)
- **Rules:** 44 (was 42)

---

## [1.5.0] - 2025-12-26

### Google Stitch AI Design Integration

New skill and commands for generating UI designs using Google Stitch AI.

#### Added
- **`skills/stitch-design/`** - New skill for AI-powered UI design generation
  - `SKILL.md` - Main skill definition with workflow instructions
  - `references/prompt-templates.md` - 5 optimized prompt templates (Dashboard, Landing, Mobile, E-commerce, Forms)
  - `references/design-checklist.md` - Comprehensive design review checklist
  - `references/export-guide.md` - How to export from Stitch to Figma/code

- **`commands/design/`** - New design command category
  - `design:stitch` - Generate optimized Stitch prompts from requirements
  - `design:stitch-review` - Process exported code and create review documents

- **Phase 3 Enhancement** - Added Step 0 "Design Approach Selection"
  - Option 1: Manual design (Figma/wireframes)
  - Option 2: AI-assisted (Google Stitch)
  - Option 3: Hybrid (Stitch prototype + manual refinement)

#### Updated
- `CLAUDE.md` - Added stitch-design to skills list (22 auto-invoking skills)
- `skills/README.md` - Added stitch-design documentation, updated counts
- `commands/README.md` - Added design category with 2 commands, updated counts
- `docs/phases/PHASE_3_DESIGN_REVIEW.MD` - Added design approach selection step

#### Workflow
```
Requirements → Generate Stitch prompt → User pastes in Stitch →
Export to Figma/code → Review & integrate → Save review doc
```

#### Review Doc Output
`.claude/workflow/stitch-design-review-{project}.md`

#### Stats
- **Skills:** 33 (was 32) - 22 auto-invoking + 11 reference
- **Commands:** 74 (was 72)
- **Command Categories:** 20 (was 19)

---

## [1.4.4] - 2025-12-25

### Cleanup & Simplification

Removed unused MCP server files, keeping only simple bash scripts for Atlassian.

#### Removed
- **`mcp-servers/`** - Removed entire folder (unused MCP server attempt)

#### Updated
- All version references updated to 1.4.4

---

## [1.4.3] - 2025-12-25

### Atlassian Scripts with TOON Format

Bash scripts for Jira and Confluence with TOON format output.

#### Added
- **`scripts/confluence-fetch.sh`** - Fetch Confluence pages in TOON format
  - By page ID: `./scripts/confluence-fetch.sh 123456789`
  - By space/title: `./scripts/confluence-fetch.sh --space PROJ --title "API Docs"`
  - `--verbose` flag for comments

#### Updated
- **`scripts/jira-fetch.sh`** - Now outputs TOON format:
  - `ticket[1]{key,summary,type,status,priority}:` - Core ticket data
  - `metadata[1]{assignee,reporter,created,updated}:` - Ticket metadata
  - `subtasks[N]{key,summary,status}:` - Child issues
  - `links[N]{type,key,summary}:` - Issue links
  - `--verbose` flag for comments
- **`docs/MCP_GUIDE.md`** - Atlassian section with script usage

#### Example Output (TOON)
```toon
ticket[1]{key,summary,type,status,priority}:
  PROJ-123,Fix login bug,Bug,In Progress,High

metadata[1]{assignee,reporter,created,updated}:
  John Doe,Jane Smith,2025-01-15,2025-01-20

labels[2]: frontend;auth
subtasks[2]{key,summary,status}:
  PROJ-124,Write tests,Done
  PROJ-125,Update docs,To Do
```

---

## [1.4.2] - 2025-12-24

### Remove Atlassian MCP

Removed Atlassian MCP from default bundled servers due to OAuth stability issues.

#### Removed
- **Atlassian MCP** - OAuth tokens expire every 55 mins, browser auth doesn't work in Claude Code's non-interactive subprocess environment

#### Added
- **`scripts/jira-fetch.sh`** - Bash script alternative for fetching Jira tickets via REST API (requires `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`)

#### Updated
- `.mcp.json` - Reduced from 6 to 5 bundled MCP servers
- `docs/MCP_GUIDE.md` - Removed Atlassian references
- `rules/agent-identification-banner.md` - Removed Atlassian examples
- `commands/mcp/status.md` - Removed Atlassian from status output

#### Stats
- **MCP Servers:** 5 (was 6)

---

## [1.4.1] - 2025-12-23

### Fixes & Code Cleanup

Code quality improvements and documentation fixes.

#### Fixed
- **Removed duplicate session state functions** - `session-state.cjs` now imports from `af-config-utils.cjs` instead of duplicating code
- **Fixed hook count mismatch** - README documented 14 hooks but only 11 exist (removed ghost JIRA/Figma/Confluence/GitHub detection sections)
- **Removed unused import** - `set-active-plan.cjs` no longer imports unused `getSessionTempPath`
- **Fixed duplicate section numbering** - hooks/README.md had two section "3"s
- **Fixed MCP package names** - Replaced non-existent `@anthropic/*` packages with real packages:
  - `atlassian`: `@anthropic/atlassian-mcp` → Official Atlassian Remote MCP (OAuth, no env vars needed)
  - `figma`: `@anthropic/figma-mcp` → `figma-developer-mcp` (maps `FIGMA_API_TOKEN` internally)
  - `slack`: `@anthropic/slack-mcp` → `@modelcontextprotocol/server-slack` (added `SLACK_TEAM_ID`)

#### Updated
- `hooks/lib/session-state.cjs` - v1.1.0: Uses `af-config-utils.cjs` for core operations
- `hooks/subagent-init.cjs` - v1.2.0: Removed fallback duplication, uses `af-config-utils.cjs`
- `hooks/prompt-reminder.cjs` - v1.1.0: Uses `af-config-utils.cjs` for session state
- `hooks/README.md` - Fixed to show correct 11 hooks, removed ghost sections

#### Stats
- **Hooks:** 11 (corrected from incorrect 14)
- **Skills:** 32 (corrected from 33)

---

## [1.4.0] - 2025-12-23

### Token Efficiency & Auto-Detection Improvements

Major improvements focused on token efficiency and automatic complexity detection.

#### New Features
- **SessionStart hook** - Environment injection on session startup:
  - Auto-detect project type (monorepo, library, single-repo)
  - Auto-detect package manager (npm, pnpm, yarn, bun, composer, poetry, go, cargo)
  - Auto-detect framework (Next.js, React, Vue, Laravel, Django, etc.)
  - Inject 20+ `AF_*` environment variables
  - Fires once per session (startup, resume, clear, compact)
- **Plan resolution** - Branch-matching and active plan management:
  - `AF_ACTIVE_PLAN` - Explicitly set via session (`/plan:set`)
  - `AF_SUGGESTED_PLAN` - Branch-matched hint (no stale pollution)
  - `AF_REPORTS_PATH` - Dynamic path tied to active plan
- **Cascading config** - `.af.json` configuration with precedence:
  - DEFAULT → `~/.claude/.af.json` (global) → `.claude/.af.json` (local)
  - Supports plan naming format, paths, project overrides
  - `.af.json.example` included as reference
- **set-active-plan command** - `/plan:set` to explicitly set active plan
- **SubagentStart hook** - Auto-inject context for subagents:
  - Injects current workflow phase, active plan, pending approvals
  - Passes project context automatically
  - Session state management via `/tmp/af-session-{id}.json`
  - ~200 tokens per subagent (efficient)
- **Prompt reminder hook** - Inject reminders each user prompt:
  - TDD reminder for code-related tasks
  - Security reminder for auth/password/token operations
  - Approval gate reminder for relevant phases
- **sequential-thinking skill** - Structured thinking for complex analysis:
  - Dynamic adjustment (expand/contract)
  - Revision capability
  - Branching for alternatives
  - Perfect for Phase 1 and debugging
- **problem-solving skill** - 5 techniques for different problem types:
  - Simplification Cascades (complexity spiraling)
  - Collision-Zone Thinking (innovation blocks)
  - Meta-Pattern Recognition (recurring issues)
  - Inversion Exercise (tunnel vision)
  - Scale Game (production readiness)
- **Session state library** - Shared state across hooks:
  - `hooks/lib/session-state.cjs` - CLI and programmatic interface
  - Track phase, plan, approvals, active agents
- **Model auto-selection** - Agent-detector now selects optimal model:
  - haiku for quick tasks (typo fixes, orchestration)
  - sonnet for standard implementation (coding, testing, bug fixes)
  - opus for deep analysis (architecture, security audits, migrations)
  - Detection result includes: Agent, Model, Complexity, Reason
  - Model passed to Task tool when spawning subagents
- **TOON format convention** - All structured data must use TOON:
  - Added to `rules/naming-conventions.md` (v1.2.0)
  - Converted critical rule files from markdown tables to TOON
- **git-workflow skill** - Token-efficient git operations:
  - Single compound command gathers all data (staging, security, metrics, file groups)
  - Auto-split commits into logical groups (deps, code, docs, tests)
  - Security scanning for secrets before commit
  - 2-4 tool calls vs 15 baseline (73-80% fewer)
- **scout-block hook** - Prevents wasteful token usage:
  - Blocks scanning of node_modules, dist, build, vendor, .git
  - Custom patterns via `.afignore` file
  - Cross-platform support (Node.js)
- **Auto-complexity detection** - AI detects task complexity automatically:
  - Quick (1-2 tools): Simple fixes, clear scope
  - Standard (3-6 tools): New feature, bug with context
  - Deep (7+ tools): Architecture, vague requirements
  - No need for `:fast` or `:hard` variants
- **Plan state management** - Session-based plan context:
  - `AF_ACTIVE_PLAN` - Current active plan
  - `AF_SUGGESTED_PLAN` - Branch-matched hint
  - Persists across agent handoffs

#### Updated Features
- **debugging skill** - Now with reference documents:
  - `references/systematic-debugging.md` - Four-phase process
  - `references/root-cause-tracing.md` - Call stack tracing
  - `references/verification.md` - Iron law of verification
- **Agent model specifications** - Agents now specify recommended models:
  - haiku for orchestration and simple tasks
  - sonnet for implementation
  - opus for architecture decisions
- **state-persistence skill** - Enhanced with plan state variables

#### New Files
- `hooks/session-start.cjs` - SessionStart hook with env injection
- `hooks/lib/af-config-utils.cjs` - Cascading config + project detection utils
- `hooks/set-active-plan.cjs` - Set active plan CLI command
- `.af.json.example` - Example config file with all options
- `commands/plan/set.md` - Plan set command documentation
- `skills/git-workflow/SKILL.md` - Token-efficient git operations
- `skills/debugging/references/*.md` - Debugging reference docs
- `skills/sequential-thinking/SKILL.md` - Structured thinking process
- `skills/problem-solving/SKILL.md` - 5 problem-solving techniques
- `hooks/scout-block.cjs` - Block wasteful directory scanning
- `hooks/subagent-init.cjs` - SubagentStart context injection
- `hooks/prompt-reminder.cjs` - UserPromptSubmit reminders
- `hooks/lib/session-state.cjs` - Session state management library
- `.afignore` - Custom patterns for scout-block

#### Updated Files
- `skills/agent-detector/SKILL.md` - Auto-complexity detection + model selection (v3.0.0)
- `skills/session-continuation/SKILL.md` - Merged state-persistence, added plan state variables (v2.0.0)
- `skills/dev-expert/SKILL.md` - References expert skills, keeps generic patterns only (v2.0.0)
- `rules/naming-conventions.md` - Added TOON format convention (v1.2.0)
- `rules/estimation.md` - Converted tables to TOON
- `rules/verification.md` - Converted tables to TOON
- `rules/error-handling-standard.md` - Converted tables to TOON
- `rules/api-design-rules.md` - Converted tables to TOON
- `rules/logging-standards.md` - Converted tables to TOON
- `rules/sast-security-scanning.md` - Converted tables to TOON
- `hooks/hooks.json` - Added SessionStart, scout-block, SubagentStart, UserPromptSubmit hooks
- `hooks/README.md` - Updated with new hooks (7 → 11)
- `hooks/subagent-init.cjs` - Now uses af-config-utils, shows framework/PM (v1.1.0)
- `hooks/lib/session-state.cjs` - Added projectType, packageManager, framework fields
- `skills/README.md` - Added new skills (35 → 37)
- `agents/backend-expert.md` - Model specification
- `agents/qa-automation.md` - Model specification
- `agents/ui-designer.md` - Model specification

#### Documentation Cleanup
- **Deleted obsolete docs:**
  - `TODO.md` - Optimization complete
  - `docs/RELEASE_NOTES_V5.md` - Outdated versioning
  - `docs/SETTINGS_GUIDE.md` - Redundant with CONFIG_LOADING_ORDER
  - `docs/STORY_POINTS_GUIDE.md` - Niche agile doc
  - `docs/TOKEN_TRACKING.md` - Merged into session-continuation skill
  - `docs/RULES_COMBINATION.md` - Covered by CONFIG_LOADING_ORDER
  - `docs/SYSTEM_CLARIFICATIONS.md` - Internal implementation details
  - `docs/WORKFLOW_NAMING.md` - Niche workflow doc
  - `docs/examples/AGENT_SELECTION_EXAMPLES.md` - Merged into agent-detector
- **Deleted verbose templates:**
  - `templates/tech-spec.md` - Keeping TOON version only
  - `templates/test-plan.md` - Keeping TOON version only
- **Fixed broken cross-references** in remaining docs

#### Removed/Merged (Redundancy Cleanup)
- **Skill consolidation:**
  - `skills/state-persistence/` - Merged into `session-continuation` (90% overlap)
  - `SESSION_CONTINUATION_GUIDE.md` - Redundant with skill
- **dev-expert pattern files** (covered by individual expert skills):
  - `skills/dev-expert/react-patterns.md` - Covered by `react-expert`
  - `skills/dev-expert/vue-patterns.md` - Covered by `vue-expert`
  - `skills/dev-expert/react-native-patterns.md` - Covered by `react-native-expert`
  - `skills/dev-expert/laravel-patterns.md` - Covered by `laravel-expert`
  - `skills/dev-expert/nextjs-patterns.md` - Covered by `nextjs-expert`
- **Documentation slimmed:**
  - `docs/PLUGIN_INSTALLATION.md` - From 515 lines to 57 lines (references GET_STARTED.md)
- **Total removed:** ~1,800 lines of redundant content

#### Stats
- **Skills:** 33 → 32 (net -1: +4 new, -1 merged, -5 redundant pattern files removed)
- **Hooks:** 7 → 11 (+SessionStart, +scout-block, +SubagentStart, +UserPromptSubmit)
- **Commands:** +1 (`/plan:set`)
- **Docs:** 24 → 15 (cleanup)
- **Templates:** 16 → 14 (TOON only)
- **Token savings:** Up to 80% reduction in git operations
- **Lines removed:** ~4,800+ lines of redundant documentation and patterns

---

## [1.3.2] - 2025-12-22

### MCP Response Logging in TOON Format

Auto-save JIRA/Figma responses to logs in token-efficient TOON format.

#### New Features
- **TOON format for MCP responses** - JSON automatically converted to TOON
- **Auto-save rule** - `mcp-response-logging.md` instructs Claude to save after fetch

#### Updated Files
- **scripts/workflow/save-mcp-response.sh** - Added `json_to_toon()` converter
- **rules/README.md** - Updated rule count (39 → 40)

#### Example Output
```toon
ticket[1]{key,summary,type,status,priority}:
  PROJ-123,Fix bug,Bug,In Progress,High
```

---

## [1.3.1] - 2025-12-22

### Documentation Cleanup

Removed obsolete documentation that referenced deleted integration scripts.

#### Removed Files
- **docs/BASH_INTEGRATIONS_REFERENCE.md** - Obsolete (scripts replaced by MCP)
- **docs/INTEGRATION_SETUP_GUIDE.md** - Obsolete (1,419 lines, now use MCP_GUIDE.md)
- **docs/JIRA_WEBFETCH_SOLUTION.md** - Obsolete (MCP handles JIRA)
- **docs/PLUGIN_TROUBLESHOOTING.md** - Obsolete (moved to PLUGIN_INSTALLATION.md)
- **docs/guides/JIRA_INTEGRATION.md** - Obsolete (MCP handles JIRA)
- **docs/AGENT_IDENTIFICATION.md** - Duplicate of rules/agent-identification-banner.md
- **docs/APPROVAL_GATES.md** - Duplicate of rules/approval-gates.md
- **skills/jira-integration/** - Empty directory (dangling symlinks)
- **skills/figma-integration/** - Empty directory (dangling symlinks)

#### Updated Files
- **docs/PLUGIN_INSTALLATION.md** - Troubleshooting now references MCP
- **CONTRIBUTING.md** - Testing section uses `mcp:status` instead of jira-fetch.sh
- **hooks/hooks.json** - Removed redundant UserPromptSubmit hooks
- **commands/mcp/status.md** - New command to verify MCP server loading
- **CLAUDE.md** - Session start now includes MCP verification (step 5)

#### Stats
- **Lines removed:** ~3,500+
- **Skills:** 35 → 33 (removed empty integration dirs)
- **Docs:** Consolidated troubleshooting into PLUGIN_INSTALLATION.md

---

## [1.3.0] - 2025-12-19

### Major Cleanup - MCP Integration & Agent Consolidation

Streamlined the plugin by replacing custom integration scripts with bundled MCP servers and merging related agents.

#### New Features
- **Workflow Deliverable Saving** - Save phase deliverables (MD files) to workflow logs:
  - `save-deliverable.sh` - Save markdown content to phase folders
  - `workflow-manager.sh save` - Wrapper command for easy access
  - Tracks deliverables in workflow-state.json
- **MCP Response Logging** - Save JIRA, Figma, Confluence responses for reference:
  - `save-mcp-response.sh` - Save MCP responses to logs/{type}/
  - `workflow-manager.sh mcp-save/mcp-list/mcp-get` - Easy access commands
  - Auto-keeps "latest" file for each identifier
- **MCP in Agent Banner** - Show which MCP servers are active (single or multiple)
- **Sectioned CLAUDE.md Template** - Auto-update plugin sections, preserve user content:
  - `<!-- AURA-FROG:START -->` / `<!-- AURA-FROG:END -->` - Plugin-managed
  - `<!-- USER-CUSTOM:START -->` / `<!-- USER-CUSTOM:END -->` - User-preserved
- **claude-md-update.sh Script** - Sync plugin sections without losing customizations
- **project:init/regen Integration** - Automatically uses update script
- **Bundled MCP Servers** - `.mcp.json` auto-configures:
  - `context7` - Library documentation (MUI, Tailwind, lodash, etc.)
  - `playwright` - Browser automation and E2E testing
  - `vitest` - Test execution and coverage analysis
  - `atlassian` - JIRA + Confluence integration
  - `figma` - Design system fetching
  - `slack` - Notifications

#### Consolidated Agents (24 → 14)
- **backend-expert** - Merged: backend-go, backend-laravel, backend-nodejs, backend-python
- **web-expert** - Merged: web-angular, web-nextjs, web-reactjs, web-vuejs
- **mobile-expert** - Merged: mobile-flutter, mobile-react-native
- **Removed** - jira-operations, confluence-operations, slack-operations (use MCP)

#### Removed Files
- **Scripts** - jira-fetch.sh, jira-sync.sh, figma-fetch.sh, confluence-operations.sh, slack-notify.sh
- **Skills** - jira-integration, figma-integration, confluence-integration (replaced by MCP)
- **Agents** - 10 individual backend/web/mobile agents (merged into 3)

#### New Files
- **docs/MCP_GUIDE.md** - Complete guide for using and creating MCP servers
- **scripts/claude-md-update.sh** - Update AURA-FROG sections in project CLAUDE.md
- **scripts/workflow/save-deliverable.sh** - Save phase deliverables (MD files) to logs
- **scripts/workflow/save-mcp-response.sh** - Save MCP responses (JIRA, Figma, etc.) to logs
- **templates/project-claude.md** - Sectioned template with auto-update markers

#### Updated Documentation
- CLAUDE.md - Added MCP servers section with auto-invocation examples
- GET_STARTED.md - Added MCP section with trigger examples
- skills/README.md - Updated skill count and MCP references
- rules/README.md - Updated version

#### Benefits
- **Cleaner plugin** - 10 fewer agents, 5 fewer scripts, 3 fewer skills
- **Native MCP** - Official MCP servers for integrations
- **Merged agents** - Still access detailed patterns via expert skills
- **Better UX** - Users don't need separate MCP installation

#### Migration
- Set env vars in `.envrc` for MCP servers:
  - `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
  - `FIGMA_API_TOKEN`
  - `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID`

---

## [1.2.6] - 2025-12-18

### Context7 Integration - Library Documentation Optimization

Replaced static design system documentation with Context7 MCP server integration for live, up-to-date library docs.

#### Removed Files (~6,100 lines)
- **skills/design-system-library/** - Deleted 10 static documentation files:
  - ant-design.md, bootstrap.md, chakra-ui.md, headless-ui.md
  - mantine.md, material-ui.md, nativewind.md, radix-ui.md
  - shadcn-ui.md, tailwind-css.md

#### Updated Files
- **skills/design-system-library/SKILL.md** - Now references Context7 for live docs
- **rules/prefer-established-libraries.md** - Condensed with Context7 integration

#### Benefits
- **Context7 provides:** Up-to-date, version-specific library documentation
- **No more stale docs:** Always fetches current API references
- **Massive reduction:** ~6,100 lines removed from plugin

#### How to Use Context7
```
"Build a login form with Material UI" use context7
"Create dashboard with Ant Design" use context7
"lodash groupBy usage" use context7
```

---

## [1.2.5] - 2025-12-17

### Workflow & Comment Quality Improvements

Enhanced workflow visibility and comment quality standards.

#### New Features
- **Phase transition banner** - Show agent banner before each workflow phase
- **Agent visibility** - Users see which agent handles each phase

#### Rule Updates
- **smart-commenting.md** - Strengthened to "meaningful comments only"
  - Priority raised: Medium → High
  - Added anti-patterns: "new test", "new branch", "add coverage"
  - Added JSDoc rules section
- **execution-rules.md** - Added "show banner before each phase" requirement
- **agent-identification-banner.md** - Added "Phase Transition Banner" section

---

## [1.2.4] - 2025-12-17

### Plugin Optimization - Massive Token Reduction

Condensed verbose agents and commands to reduce plugin size by ~60%.

#### Condensed Agents (5 files)
- **backend-nodejs.md** - 1,182 → 100 lines (92% reduction)
- **backend-python.md** - 781 → 91 lines (88% reduction)
- **backend-laravel.md** - 766 → 95 lines (88% reduction)
- **backend-go.md** - 753 → 79 lines (89% reduction)
- **mobile-react-native.md** - 1,318 → 109 lines (92% reduction)

#### Condensed Commands (10 files)
- **project/init.md** - 1,095 → 115 lines (89% reduction)
- **refactor.md** - 932 → 95 lines (90% reduction)
- **test/document.md** - 808 → 87 lines (89% reduction)
- **review/fix.md** - 799 → 93 lines (88% reduction)
- **test/unit.md** - 702 → 102 lines (85% reduction)
- **document.md** - 697 → 87 lines (88% reduction)
- **bugfix/fix.md** - 645 → 93 lines (86% reduction)
- **setup/integrations.md** - 646 → 94 lines (85% reduction)
- **workflow/start.md** - 137 → 81 lines (41% reduction)
- **test/e2e.md** - 638 → 97 lines (85% reduction)

#### Architecture
- Agents now defer to expert skills for detailed patterns
- Commands use TOON format for compact structured data
- Removed redundant examples (users can ask for examples)
- Focused on essential information only

#### Stats (Before → After)
- **Agent lines:** ~8,500 → ~4,800 (44% reduction)
- **Command lines:** ~22,000 → ~16,600 (25% reduction)
- **Total estimated:** ~5,100 fewer lines

---

## [1.2.3] - 2025-12-16

### Session Context & Codebase Consistency

Token-efficient session context with TOON format and codebase pattern learning.

#### New Features
- **codebase-consistency rule** - Learn patterns before writing code
- **session-context.toon** - Cached codebase patterns (~150 tokens vs ~600)
- **TOON state format** - 73% token savings for workflow state

#### Updated Skills
- **project-context-loader** - Now generates session-context.toon automatically
- **state-persistence** - Migrated to TOON format for all state files

#### Updated Scripts
- **context-compress.sh** - Generates session-context.toon with pattern detection

#### Architecture
- `.claude/session-context.toon` - Cached patterns + workflow state
- `.claude/workflow-state.toon` - Detailed workflow (TOON format)
- Dynamic pattern scanning with caching (regenerate if > 1 hour)

#### Stats
- **Total Skills:** 38+ (25 auto-invoking + 13 reference)
- **Total Rules:** 38
- **Total Hooks:** 15

---

## [1.2.2] - 2025-12-15

### Backend Expert Skills & Rule Optimization

Expanded expert skills system with backend frameworks and significantly condensed verbose rules.

#### New Expert Skills (6)
- **nodejs-expert** - Express, NestJS, Fastify, async patterns, Prisma/TypeORM
- **python-expert** - Django, FastAPI, Flask, SQLAlchemy 2.0, async/await
- **laravel-expert** - Eloquent, service pattern, DTOs, queues, caching
- **go-expert** - Gin, Echo, Fiber, goroutines, channels, interfaces
- **flutter-expert** - Widgets, Riverpod, Bloc, GoRouter, forms
- **angular-expert** - Signals, RxJS, NgRx, reactive forms, OnPush

#### Rule Optimization (~85% reduction in verbose rules)
- Condensed `theme-consistency.md`: 961 → 134 lines
- Condensed `direct-hook-access.md`: 820 → 131 lines
- Condensed `smart-commenting.md`: 769 → 130 lines
- Condensed `correct-file-extensions.md`: 732 → 117 lines
- Total savings: ~2,770 lines

#### Stats
- **Total Skills:** 38+ (25 auto-invoking + 13 reference)
- **Total Rules:** 37
- **Total Hooks:** 15

---

## [1.2.1] - 2025-12-15

### Expert Skills System & Enhanced Hooks

Major update introducing framework-specific expert skills for on-demand loading and enhanced lifecycle hooks.

#### New Expert Skills (5)
- **typescript-expert** - Strict types, ESLint config, nullish handling, modern patterns
- **react-expert** - Components, hooks, performance, state management, forms
- **react-native-expert** - FlatList optimization, navigation, platform code, animations
- **vue-expert** - Composition API, script setup, Pinia, reactivity patterns
- **nextjs-expert** - App Router, Server Components, caching, Server Actions

#### New Hooks (6)
- **PreToolUse - Secrets Protection** - Warns when writing to files containing secrets
- **PreToolUse - SAST Security** - Detects security anti-patterns
- **PostToolUse - Large File Warning** - Warns when reading files >500 lines
- **UserPromptSubmit - Confluence Detection** - Auto-detects Confluence URLs
- **UserPromptSubmit - GitHub Detection** - Auto-detects GitHub PR/Issue URLs
- **SessionEnd - Uncommitted Changes** - Reminds about staged changes

#### Architecture Change
- Migrated framework-specific rules to expert skills for on-demand loading
- Removed `modern-javascript.md` and `typescript-strict-practices.md` (now in skills)
- Expert skills auto-invoke based on project context

#### Stats
- **Total Skills:** 30+ (19 auto-invoking + 12 reference)
- **Total Rules:** 37
- **Total Hooks:** 15

---

## [1.2.0] - 2025-12-11

### Token Optimization & New Rules

Major update focused on token efficiency, security rules, and multi-session support.

#### New Skills (3)
- **lazy-agent-loader** - Load agent summaries first, full definitions on demand (~94% token savings)
- **response-analyzer** - Save large outputs to temp files, load summaries (~95% savings)
- **state-persistence** - File-based workflow state for session handoffs

#### New Rules (3)
- **diagram-requirements** - Mermaid diagrams required for complex features
- **sast-security-scanning** - OWASP Top 10 + SAST scanning enforcement
- **prefer-established-libraries** - Use lodash/es-toolkit over custom utilities

#### New Documentation
- `docs/WORKFLOW_DIAGRAMS.md` - 10 comprehensive Mermaid diagrams
- `docs/MULTI_SESSION_ARCHITECTURE.md` - Token optimization & session handoff guide

#### New Scripts (5)
- `scripts/validate-toon.sh` - Validate TOON format
- `scripts/context-compress.sh` - Generate compressed project context
- `scripts/response-save.sh` - Save verbose outputs to /tmp/aura-frog/
- `scripts/session-handoff.sh` - Generate human-readable handoff documents
- `scripts/workflow/workflow-export-toon.sh` - Export workflow state in TOON

#### Stats
- **Total Rules:** 38
- **Total Skills:** 26+ (14 auto-invoking + 12 reference)

---

## [1.1.4] - 2025-12-01

### Workflow Navigation

- **New Rule:** `rules/workflow-navigation.md` - Progress bar and next phase visibility after each phase

---

## [1.1.3] - 2025-12-01

### Modern JavaScript

- **New Rule:** `rules/modern-javascript.md` - ES6+ syntax enforcement (optional chaining, nullish coalescing, destructuring, arrow functions, etc.)

---

## [1.1.2] - 2025-12-01

### Feedback Brainstorming

- **New Rule:** `rules/feedback-brainstorming.md` - Agents brainstorm feedback before implementing
- Force mode with "must do:", "just do:", "I insist"

---

## [1.1.1] - 2025-12-01

### Cleanup

- Removed multi-model selection feature (not supported by Claude Code)

---

## [1.1.0] - 2025-12-01

### Skills Standardization

Major update standardizing skill file format and streamlining plugin structure.

#### Changes
- All skills now use `SKILL.md` with frontmatter metadata
- CLAUDE.md reduced from ~190 to ~77 lines (60% reduction)
- Added Confluence integration with full CRUD operations
- Removed multi-model selection feature

#### Stats
- **Auto-Invoke Skills:** 10
- **Reference Skills:** 12+

---

## [1.0.2] - 2025-12-01

### CLAUDE.md Refactoring

- CLAUDE.md reduced from ~580 to ~187 lines (68% reduction)
- New skill: `session-manager`
- New rule: `env-loading`
- New command: `project:reload-env`

---

## [1.0.1] - 2025-11-29

### Voice Notifications: Realtime Streaming

- Voice notifications now use realtime streaming (no files created)
- Lower latency, zero disk usage
- Removed cleanup scripts (no longer needed)

---

## [1.0.0] - 2025-11-28

### Rebranding: CCPM to Aura Frog

**"Code with main character energy!"**

#### Changes
- Project renamed from "CCPM" to "Aura Frog"
- New visual identity with frog mascot
- New agent banner format with aura messages

#### Stats at Launch
- **24** Specialized Agents
- **20** Skills (9 auto-invoking + 11 reference)
- **25** Quality Rules
- **9** Workflow Phases
- **70** Commands
- **4** Integrations (JIRA, Figma, Slack, Confluence)

---

## Pre-1.0 History

### [5.2.0] - 2025-11-28
- Token optimization (30-70% reductions)
- Skills rebuilt with comprehensive content
- README professionalized with badges

### [5.1.0] - 2025-11-27
- Skills system introduced (8 auto-invoking)
- Voiceover notifications (ElevenLabs)
- Hooks system (7 lifecycle hooks)
- Dual-file loader architecture

### [5.0.0-beta] - 2025-11-26
- New agents: backend-nodejs, security-expert, devops-cicd
- 11 new commands (security, performance, deployment)

### [4.6.0] - 2025-11-26
- Auto-approval permissions
- Agent identification system
- Adaptive styling detection

### [4.5.0] - 2025-11-25
- NativeWind integration
- ElevenLabs voice operations
- 70+ language support

### [4.4.0] - 2025-11-24
- Initial release
- 14 specialized agents
- 9-phase workflow with TDD
