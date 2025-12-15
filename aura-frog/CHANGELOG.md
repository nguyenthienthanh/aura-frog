# Aura Frog - Changelog

All notable changes to Aura Frog will be documented in this file.

---

## [1.2.1] - 2025-12-15

### Enhanced Hooks System

Major update to Claude Code lifecycle hooks with security and productivity enhancements.

#### New Hooks (6)
- `PreToolUse - Secrets Protection` - Warns when writing to files that may contain secrets
- `PreToolUse - SAST Security Check` - Detects common security anti-patterns (eval, innerHTML, exec)
- `PostToolUse - Large File Warning` - Warns when reading files >500 lines
- `UserPromptSubmit - Confluence Detection` - Auto-detects Confluence URLs
- `UserPromptSubmit - GitHub Detection` - Auto-detects GitHub PR/Issue URLs
- `SessionEnd - Uncommitted Changes` - Reminds about staged uncommitted changes

#### Updated Hooks
- `SessionStart` - Updated version to 1.2.1, skills count to 26+
- Full documentation for Stop and Notification hooks (previously undocumented)

#### Total Hooks: 15
- SessionStart (1), PreToolUse (4), PostToolUse (2), UserPromptSubmit (4), SessionEnd (2), Stop (1), Notification (1)

---

## [1.2.0] - 2025-12-11

### Token Optimization System

Major update focused on token efficiency and multi-session support.

#### New Skills (3)
- `lazy-agent-loader` - Load agent summaries first, full definitions on demand (~94% token savings)
- `response-analyzer` - Save large outputs to temp files, load summaries (~95% savings)
- `state-persistence` - File-based workflow state for session handoffs

#### New Scripts (5)
- `scripts/validate-toon.sh` - Validate TOON format array declarations
- `scripts/context-compress.sh` - Generate compressed project context
- `scripts/response-save.sh` - Save verbose outputs to /tmp/aura-frog/
- `scripts/session-handoff.sh` - Generate human-readable handoff documents
- `scripts/workflow/workflow-export-toon.sh` - Export workflow state in TOON format

#### New Documentation
- `docs/WORKFLOW_DIAGRAMS.md` - 10 comprehensive Mermaid diagrams
- `docs/MULTI_SESSION_ARCHITECTURE.md` - Token optimization & session handoff guide

#### New Rules (1)
- `rules/diagram-requirements.md` - Mermaid diagrams required for complex features

#### Updated
- `skills/agent-detector/SKILL.md` - Converted to TOON format (~35% token savings)
- `hooks/post-phase.md` - Added diagram validation for Phase 2, 3, 4
- `rules/README.md` - Now 36 total rules

#### Removed Duplicates
- Consolidated duplicate integration scripts
- Removed redundant workflow-state.sh (use workflow-manager.sh)

---

## [1.1.4] - 2025-12-01

### Workflow Navigation

After each phase, agents now show what comes next and what will be skipped.

#### New Rule: `rules/workflow-navigation.md`

**Shows after every phase:**
- Progress bar with percentage
- What phase is next
- What phases will be skipped (and why)
- Remaining phases overview

**Example:**
```
📍 WORKFLOW PROGRESS
Progress: ████████░░░░░░░░ 50% (4/8 phases)

✅ Phase 1-4: Completed
🔄 Phase 5a: TDD RED - UP NEXT
⏩ Phase 3: SKIPPED (backend-only task)
⏳ Phase 5b-9: Pending

After approval → Phase 5a: Write failing tests
```

#### Updated
- `workflow-orchestrator` - Navigation block in approval gates
- Approval gates now show progress and next steps

---

## [1.1.3] - 2025-12-01

### Modern JavaScript Rule

New rule enforcing ES6+ syntax for all JavaScript/TypeScript code.

#### New Rule: `rules/modern-javascript.md`

**Required features:**
- Optional chaining (`?.`) - `user?.profile?.name`
- Nullish coalescing (`??`) - `value ?? 'default'`
- Destructuring - `const { name, email } = user`
- Arrow functions - `items.map(x => x * 2)`
- Template literals - `` `Hello ${name}` ``
- Spread operator - `{ ...defaults, ...options }`
- const/let (no var)
- Object shorthand - `{ name, email }`
- async/await
- Modern array methods (map, filter, find, etc.)

---

## [1.1.2] - 2025-12-01

### Feedback Brainstorming

Agents now brainstorm feedback instead of blindly implementing it.

#### New Rule: `rules/feedback-brainstorming.md`

**Default behavior:** When user provides feedback (reject/modify), agent will:
1. Analyze the suggestion
2. Consider alternatives
3. Present options with pros/cons
4. Then implement the agreed approach

**Force mode:** Skip brainstorming with phrases:
- "must do: ..." → Implement directly
- "just do: ..." → Skip discussion
- "work like that" → No alternatives
- "I insist" → Force approach

#### Updated Commands
- `workflow:reject` - Now brainstorms before restarting phase
- `workflow:modify` - Now does light brainstorming before applying

#### Updated Skills
- `workflow-orchestrator` - Added feedback handling section

---

## [1.1.1] - 2025-12-01

### Remove Multi-Model Selection Feature

Removed multi-model selection feature (not supported by Claude Code).

See "Removed: Multi-Model Selection Feature" section in v1.1.0 for details.

---

## [1.1.0] - 2025-12-01

### Skills Standardization & Plugin Refactoring

Major update standardizing skill file format and streamlining plugin structure.

#### SKILL.md Standard

**All skills now use standardized `SKILL.md` naming with frontmatter metadata:**

```yaml
---
name: skill-name
description: "Description"
autoInvoke: true|false
priority: highest|high|medium|low
triggers:
  - "trigger phrase"
allowed-tools: Read, Grep, Glob
---
```

**Auto-Invoke Skills (10):**
- agent-detector (highest priority - runs first)
- project-context-loader
- jira-integration, figma-integration, confluence-integration
- workflow-orchestrator, bugfix-quick, test-writer, code-reviewer
- session-manager

**Reference Skills (12+):**
- dev-expert, qa-expert, pm-expert, design-expert (with sub-skills)
- api-designer, documentation, migration-helper, performance-optimizer
- refactor-expert, scalable-thinking, session-continuation, nativewind-generator

#### Plugin CLAUDE.md Simplified

**Before:** ~190 lines → **After:** ~77 lines (60% reduction)

CLAUDE.md now serves as an index pointing to skills, rules, and resources.

#### Other Changes

- Added Model line to agent banner format
- Added Session Start Checklist to project template
- Added Confluence integration with full CRUD operations
- Updated env-loading rule to check `.claude/.envrc`
- Removed archived docs (~2K lines)
- Updated skill counts to 22+ (10 auto-invoking + 12 reference)

#### Removed: Multi-Model Selection Feature

**Removed** the multi-model selection feature introduced in v1.0.2.

**Reason:** Claude Code does not support switching AI models mid-conversation. The feature was aspirational but not functional in practice.

**Removed Files:**
- `skills/model-router/` - Model routing skill
- `docs/MODEL_SELECTION.md` - Model selection guide

**Updated Files:**
- `.envrc.template` - Removed model selection variables
- `rules/env-loading.md` - Removed model-related variable categories
- `commands/project/reload-env.md` - Removed model verification
- `commands/project/init.md` - Removed model section from .envrc template
- `commands/project/regen.md` - Removed model configuration step
- `GET_STARTED.md` - Removed model selection documentation

---

## [1.0.2] - 2025-12-01 (DEPRECATED)

### Multi-Model Selection & CLAUDE.md Refactoring

**NOTE:** Multi-model selection feature was removed in v1.1.0 (not supported by Claude Code).

#### CLAUDE.md Refactoring (Still Applies)

**Before:** ~580 lines → **After:** ~187 lines (68% reduction)

Content moved to modular rules and skills files for better maintainability.

**New Structure:**
- Concise tables with file references
- Session start checklist
- Quick reference sections

#### New Skills (Still Active)

- `session-manager` (Auto-invoking) - Workflow state & token monitoring

#### New Rules (Still Active)

- `env-loading` - Load .envrc at session start
- Total rules: 21 → 27

#### New Command (Still Active)

- `project:reload-env` - Load/reload .envrc variables

---

## [1.0.1] - 2025-11-29

### Voice Notifications: Realtime Streaming Mode

Voice notifications now use **realtime streaming** instead of creating audio files.

#### Key Changes

**Streaming Architecture:**
- Audio streams directly to speakers (ffplay, mpv, or sox)
- No files created - zero disk usage
- Lower latency - starts playing immediately
- No cleanup needed

**Updated Scripts:**
- `voice-notify.sh` - Complete rewrite for streaming API
- `test-voice.sh` - Updated for streaming tests
- `setup-voice.sh` - Added streaming player checks
- `debug-voice.sh` - Updated for streaming diagnostics

**Removed:**
- `cleanup-voice.sh` - No longer needed (no files to clean)
- `logs/audio/` directory - No longer created

**Documentation Updates:**
- `VOICEOVER_SETUP.md` - Streaming setup guide
- `docs/VOICE_COMMANDS.md` - Streaming command reference
- `docs/guides/elevenlabs-integration.md` - Streaming integration guide
- `docs/VOICEOVER_NOTIFICATIONS.md` - Streaming notifications
- `agents/voice-operations.md` - Streaming agent documentation

**Streaming API:**
- Endpoint: `/v1/text-to-speech/{voice_id}/stream`
- Model: `eleven_turbo_v2_5` (optimized for low latency)

**Prerequisites:**
```bash
# Install streaming player (macOS)
brew install ffmpeg  # Recommended

# Linux
sudo apt install ffmpeg
```

---

## [1.0.0] - 2025-11-28

### 🐸 Rebranding: CCPM → Aura Frog

**"Code with main character energy!"** ✨

This release marks the official rebranding from CCPM (Claude Code Project Management) to **Aura Frog**.

#### What Changed

**New Identity:**
- Project renamed from "CCPM" to "Aura Frog"
- New tagline: "Code with main character energy! 🐸✨"
- Fresh visual identity with frog mascot

**File/Folder Renames:**
- `ccpm/` → `aura-frog/`
- `ccpm-config.yaml` → `ccpm-config.yaml`
- `ccpm-config.example.yaml` → `ccpm-config.example.yaml`

**Configuration Updates:**
- Marketplace name: `aurafrog`
- Plugin name: `aura-frog`
- Version reset to `1.0.0`

**New Assets (assets/logo/):**
- `github_banner.png` - Repository banner
- `main.png` - Main logo
- `mascot_full.png` - Full mascot illustration
- `mascot_coding_scene.png` - Coding scene illustration
- `logo_icon.png` - Icon version
- `favicon.png` - Favicon
- `character_sheet.png` - Character reference
- `breakthrough_moment.png` - Hero moment illustration

**Image Assignments:**
- README.md → github_banner.png
- CLAUDE.md → main.png
- GET_STARTED.md → mascot_full.png
- CONTRIBUTING.md → mascot_coding_scene.png
- skills/README.md → logo_icon.png

**New Agent Banner:**
```
⚡ 🐸 AURA FROG v1.0.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Agent: [agent-name] │ Phase: [phase] - [name]          ┃
┃ 🔥 [aura-message]                                       ┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Aura Messages:** Short, fun, contextual phrases with main character energy (e.g., "Let's cook", "Bug hunter mode", "Galaxy brain time")

**New Installation Commands:**
```bash
/plugin marketplace add nguyenthienthanh/aura-frog
/plugin install aura-frog@aurafrog
```

#### What Stayed the Same

All functionality remains intact:
- 24 specialized agents
- 20 skills (9 auto-invoking + 11 reference)
- 25 quality rules
- 9-phase TDD workflow
- 70 commands
- JIRA, Figma, Slack, Confluence integrations

---

## [5.2.0] - 2025-11-28 (Pre-Rebranding)

### 🎯 Token Optimization & Skills Enhancement Release

This release focuses on reducing token consumption, improving documentation accuracy, and rebuilding skills with comprehensive information.

#### Skills Rebuilt (Critical Enhancement)

**agent-detector** (skills/agent-detector/agent-selection.md):
- Added Multi-Layer Detection System (4 layers)
- Layer 1: Explicit Technology Detection (+60 pts)
- Layer 2: Intent Detection Patterns (+50 pts)
- Layer 3: Project Context Detection (+40 pts)
- Layer 4: File Pattern Detection (+20 pts)
- Added comprehensive Scoring Weights table
- Added Agent Thresholds (Primary ≥80, Secondary 50-79, Optional 30-49)
- Added QA Agent Conditional Activation rules
- Added 6 detailed examples with scoring breakdowns
- Lines: 89 → 330 (+271%)

**workflow-orchestrator** (skills/workflow-orchestrator/workflow-execution.md):
- Added Phase Transition Rules (valid/invalid)
- Added AUTO-CONTINUE Behavior explanation
- Added Token Awareness thresholds (75%/85%/90%)
- Added Phase Skip Rules (automatic + user-requested)
- Added detailed Example Workflow Execution
- Lines: 92 → 340 (+270%)

**test-writer** (skills/test-writer/test-generation.md):
- Added PHPUnit examples (unit + Laravel feature tests)
- Added PyTest examples (unit + FastAPI integration tests)
- Added Go testing examples (unit + table-driven tests)
- Added React Native Testing Library examples
- Added Detox E2E examples
- Added Test File Naming Conventions table
- Added Running Tests by Framework commands
- Lines: 88 → 510 (+480%)

#### Token Reductions (Initial Optimization)

**CLAUDE.md Optimization:**
- Reduced from 660 → 464 lines (-30%)
- Fixed version references (v5.0 → v5.2.0)
- Removed duplicate sections
- Condensed agent listings to reference

**Initial Skills Optimization (56% reduction):**
| Skill | Before | After | Reduction |
|-------|--------|-------|-----------|
| agent-detector | 304 | 89 | -71% |
| workflow-orchestrator | 253 | 92 | -64% |
| project-context-loader | 502 | 88 | -82% |
| bugfix-quick | 161 | 73 | -55% |
| test-writer | 185 | 88 | -52% |
| code-reviewer | 171 | 97 | -43% |
| jira-integration | 148 | 77 | -48% |
| figma-integration | 256 | 79 | -69% |

**Note:** agent-detector, workflow-orchestrator, and test-writer were subsequently rebuilt with comprehensive content as they were over-optimized initially.

#### Accuracy Fixes

- **Scalable Agent Counts:** Removed hardcoded "24 agents" references across 20+ files
  - Changed to generic terms like "specialized agents", "available agents"
  - Makes documentation future-proof for agent additions
- **pm-operations-orchestrator:** Updated team roster table with all agents
- **smart-agent-detector:** Removed hardcoded counts in selection logic

#### Documentation Cleanup

- **Removed:** `archive/` folder (outdated MCP migration docs)
- **Updated:** Version references across all docs (4.5.0, 5.0.0-beta → 5.2.0)
- **Professionalized:** README.md with badges, statistics table, collapsible sections

#### README Enhancements

- Added professional header with badges
- Statistics table: Agents | Skills | Phases | Commands | Integrations
- Collapsible sections for agent categories
- Visual workflow and TDD diagrams
- Comparison table (Traditional vs Aura Frog)

---

## [5.1.0] - 2025-11-27

### 🆕 Major Features

#### 1. Skills System

**8 Auto-Invoking Skills:**
1. **agent-detector** - ALWAYS runs first, selects appropriate specialized agent
2. **workflow-orchestrator** - Executes 9-phase workflow for complex features
3. **project-context-loader** - Loads project conventions before code generation
4. **bugfix-quick** - Fast bug fixes with TDD enforcement
5. **test-writer** - Comprehensive test creation (unit, integration, E2E)
6. **code-reviewer** - Multi-agent quality review (security, performance, quality)
7. **jira-integration** - Auto-fetches JIRA tickets when mentioned
8. **figma-integration** - Auto-extracts Figma designs when URLs shared

**How It Works:**
- Skills use **LLM reasoning** to match context
- Auto-invoke based on user intent (no manual commands)
- Multiple skills can activate for one message
- Natural language triggers: "implement", "fix bug", "add tests", "PROJ-1234", Figma URLs

**Benefits:**
- ✅ No command memorization needed
- ✅ Natural conversation ("fix the login bug" → bugfix-quick skill)
- ✅ Intelligent capability discovery
- ✅ Model-invoked (Claude decides when to use)
- ✅ Educational approach (skills inject detailed instructions)

**Plugin Configuration Enhanced:**
- **plugin.json** expanded to 382 lines
- Added agents registry (24 agents with priorities/types)
- Added commands registry (70 commands in 15 categories)
- Added workflows definitions (9-phase + quick-fix)
- Added rules registry (core + project)
- Added integrations config (JIRA, Figma, Slack, Confluence)
- Added templates and documentation references

**Dual-File Loader Architecture:**
- Project `.claude/CLAUDE.md` (loader) - tells Claude to read plugin
- Plugin `aura-frog/CLAUDE.md` (system) - contains ALL instructions
- Fixed issue where Claude didn't load Aura Frog without project CLAUDE.md
- `project:init` now creates lightweight loader file

**Changed:**
- CLAUDE.md version: 5.0.0-beta → 5.1.0
- Added Skills section to CLAUDE.md
- Updated README.md with Skills information
- Skills file naming: SKILL.md → descriptive names (workflow-execution.md, agent-selection.md, etc.)

**Impact:**
- Dramatically improved user experience (natural language vs commands)
- Better capability discovery (Skills auto-activate)
- Fixed critical loading issue (project CLAUDE.md loader)
- More maintainable plugin configuration

---

#### 2. Automatic Voiceover Notifications (✨ NEW)

**Voice notifications for user action requirements**

**Added:**
- **scripts/voice-notify.sh** - ElevenLabs TTS integration script
- **Stop hook** - Automatic voiceover when approval needed
- **Notification hook** - Voice alerts for critical errors
- **Audio auto-play** - Plays notification sound (macOS: afplay)

**How It Works:**
1. Workflow reaches approval gate
2. Claude stops for user approval
3. Stop hook triggers automatically
4. ElevenLabs generates audio: "Attention please. Your attention is needed. Your approval is required to continue."
5. Audio plays automatically
6. User hears notification even if not watching screen

**Configuration:**
```bash
# Simple setup - just add API key
export ELEVENLABS_API_KEY="your_key"

# Optional: Choose voice
export ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # Rachel (default)
```

**Notification Types:**
- `approval-gate` - Phase completion, approval needed
- `error` - Critical errors and failures
- `warning` - Important warnings
- `completion` - Successful task completion
- `general` - Generic notifications

**Features:**
- ✅ **Zero configuration** - Works out of the box with API key
- ✅ **Non-blocking** - Gracefully skips if not configured
- ✅ **Auto-play** - Plays audio automatically (macOS, Linux, Windows)
- ✅ **Customizable voices** - 25+ ElevenLabs voices available
- ✅ **Multilingual** - 70+ languages supported
- ✅ **Cost-effective** - Free tier: 200 notifications/month

**Benefits:**
- ✅ Never miss an approval gate
- ✅ Work on other tasks while workflow runs
- ✅ Accessibility for vision-impaired users
- ✅ Hands-free workflow monitoring
- ✅ Multi-tasking friendly

**Files:**
- `scripts/voice-notify.sh` - TTS notification script
- `docs/VOICEOVER_NOTIFICATIONS.md` - Complete documentation
- `hooks/hooks.json` - Stop and Notification hooks
- `agents/voice-operations.md` - Updated with automatic notifications

---

#### 3. Hooks System

**7 Lifecycle Hooks:**
1. **SessionStart** - Welcome message, show available commands
2. **PreToolUse (Bash)** - Block dangerous commands (rm -rf, mkfs, etc.)
3. **PreToolUse (Write|Edit)** - Remind about project context
4. **PostToolUse (Bash)** - Log commands to .claude/logs/workflows/commands.log
5. **UserPromptSubmit** - Detect JIRA tickets and Figma URLs
6. **SessionEnd** - Suggest workflow:handoff if active workflow
7. **Stop** - Voiceover notification when approval needed (NEW)
8. **Notification** - Voice alerts for critical errors (NEW)

**Safety Features:**
- Blocks destructive bash commands
- Prevents accidental system damage
- Logs all command execution

**Workflow Helpers:**
- JIRA ticket detection (e.g., PROJ-1234)
- Figma URL detection (e.g., figma.com/file/...)
- Workflow handoff reminders
- Voice notifications for approval gates

---

#### 4. Plugin Configuration Corrections

**Fixed plugin.json structure:**
- ✅ Corrected to standard Claude Code format
- ✅ Commands: 70 actual command files listed
- ✅ Agents: 24 explicit agent paths (not glob pattern)
- ✅ Hooks: Reference to hooks/hooks.json
- ✅ Keywords added for discoverability

**Size reduction:**
- Before: 382 lines (custom structure)
- After: 112 lines (standard format)
- Reduction: 70% smaller, cleaner structure

---

### Changed

- **plugin.json** - Fixed structure, validated paths
- **hooks.json** - Added Stop and Notification hooks for voiceover
- **agents/voice-operations.md** - Documented automatic voiceover feature
- **CLAUDE.md** - Skills system integration

---

### Documentation

**Added:**
- `docs/VOICEOVER_NOTIFICATIONS.md` - Complete voiceover guide
- `hooks/README.md` - Hooks system documentation
- `skills/README.md` - Skills system guide

**Updated:**
- `README.md` - Skills and voiceover features
- `GET_STARTED.md` - Natural language workflow
- `CLAUDE_FILE_ARCHITECTURE.md` - Dual-file loader architecture

---

### Impact Summary

**User Experience:**
- ✅ Natural language commands (Skills)
- ✅ Never miss approval gates (Voiceover)
- ✅ Safer operations (Hooks)
- ✅ Better visibility (Notifications)

**Accessibility:**
- ✅ Voice notifications for vision-impaired
- ✅ Audio feedback for multi-tasking
- ✅ Hands-free workflow monitoring

**Reliability:**
- ✅ Validated plugin structure
- ✅ Non-blocking notifications
- ✅ Graceful failure handling

---

## [5.0.0-beta] - 2025-11-26

### Major Release - Security, DevOps & Performance

**Added:**

**New Agents (3):**
1. **backend-nodejs** (Priority: 95)
   - Express.js, NestJS, Fastify, Koa support
   - GraphQL APIs (Apollo Server)
   - Prisma, TypeORM, Sequelize ORMs
   - JWT authentication, Passport.js
   - Jest, Supertest testing

2. **security-expert** (Priority: 95)
   - OWASP Top 10 security audits
   - Dependency vulnerability scanning
   - Static code analysis (SAST)
   - Secret detection (TruffleHog)
   - Container security (Trivy)
   - Compliance support (GDPR, HIPAA, PCI DSS)

3. **devops-cicd** (Priority: 90)
   - Docker containerization
   - Kubernetes orchestration
   - CI/CD pipelines (GitHub Actions, GitLab CI, Azure, CircleCI)
   - Infrastructure as Code (Terraform, CloudFormation)
   - Cloud platforms (AWS, GCP, Azure)
   - Monitoring & logging

**New Commands (11):**
- **Security:** `security:audit`, `security:deps`, `security:scan`
- **Performance:** `perf:analyze`, `perf:optimize`, `perf:lighthouse`, `perf:bundle`
- **Deployment:** `deploy:setup`, `docker:create`, `cicd:create`

### Changed
- Total agents: 15 → 24 (+60%)
- Total commands: 47 → 70 (+49%)
- Backend framework support: 1 (Laravel) → 4 (Laravel, Node.js, Python, Go)

### Impact
- Security auditing now available for all projects
- DevOps automation for containerization and deployment
- Performance optimization tools for web and mobile
- Node.js backend development fully supported

---

## [4.6.0] - 2025-11-26

### Added
- **Auto-approval permissions** - Configure file operations (Read/Edit/Write) to auto-approve without prompts
- **Agent Identification System** - Every message now shows which agent is responding, system in use, and current phase
- **Adaptive Styling Detection** - Mobile agent now detects and adapts to project's existing styling approach (NativeWind, Emotion, StyleSheet, etc.)
- **Styling Detection Guide** - Comprehensive guide for agents to detect and use correct styling approach per project

### Changed
- **Mobile React Native Agent** - Changed from enforcing NativeWind to being adaptive based on project context
- **Project Config Template** - Added comprehensive styling configuration section
- **Settings Configuration** - Improved with relative paths (./**) for better portability

### Removed
- Removed planning/proposal documentation files (MIGRATION_V4_TO_V5.md, PHASE_OPTIMIZATION_PROPOSAL.md, INTEGRATION_SUMMARY.md)
- Cleaned up redundant documentation after implementation

### Fixed
- Mobile agent no longer strictly enforces NativeWind when project uses different styling
- Improved project context detection and adaptation

---

## [4.5.0] - 2025-11-25

### Added
- **NativeWind Integration** - Tailwind CSS styling for React Native applications
- **ElevenLabs Voice Operations** - AI voice generation for documentation narration
- **Voice Commands** - Complete voice operations with 70+ language support
- **NativeWind Component Generator** - Skill for rapid component generation

### Changed
- Enhanced mobile-react-native agent with NativeWind support
- Updated Phase 8 with optional voice narration
- Added voice-operations agent

---

## [4.4.0] - 2025-11-24

### Added
- Initial Aura Frog
- 14 specialized agents
- 9-phase workflow with TDD enforcement
- Project context management
- Cross-agent collaboration
- Quality gates and approval system

### Features
- Multi-agent architecture
- Test-Driven Development workflow
- JIRA, Confluence, Slack integrations
- Project-specific conventions and rules
- Token tracking and session management
