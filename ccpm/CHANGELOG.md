# CCPM Team Agents System - Changelog

## [5.2.0] - 2025-11-28

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
- Comparison table (Traditional vs CCPM)

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
- Plugin `ccpm/CLAUDE.md` (system) - contains ALL instructions
- Fixed issue where Claude didn't load CCPM without project CLAUDE.md
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
- Initial CCPM Team Agents System
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
