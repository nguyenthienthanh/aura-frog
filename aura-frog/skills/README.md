<div align="center">

![Aura Frog Skills](../../assets/logo/logo_icon.png)

# 🐸 Aura Frog Skills

### For [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

> **Auto-invoking capabilities that give you main character energy** ✨

</div>

---

**Version:** 1.1.4
**Total Skills:** 22+ (10 auto-invoking + 12 reference)
**Platform:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) Plugin
**Purpose:** Auto-invoking capabilities that extend Claude Code's Aura Frog functionality

---

## 🎯 What Are Skills?

Skills are **model-invoked** capabilities that Claude automatically activates based on context matching. Unlike commands (which you explicitly call), Skills are discovered and used by Claude when your message matches their description.

---

## 📚 Available Skills

### 1. **workflow-orchestrator** (Priority: CRITICAL)

**Auto-invokes when:** User requests to implement new features, build functionality, or create something complex

**Triggers:**
- "implement", "build", "create feature", "add new", "develop"
- "workflow:start <task>"
- Complex tasks requiring multiple phases

**What it does:**
- Executes Aura Frog's 9-phase workflow
- Enforces TDD (RED → GREEN → REFACTOR)
- Multi-agent collaboration
- Quality gates at every phase

---

### 2. **agent-detector** (Priority: HIGHEST - ALWAYS RUNS)

**Auto-invokes when:** EVERY single user message

**Triggers:** ALL messages (no exceptions)

**What it does:**
- Analyzes message for keywords and intent
- Scores all available agents
- Selects Primary (≥80), Secondary (50-79), Optional (30-49)
- Shows agent identification banner
- Proceeds as detected agent

**⚠️ CRITICAL:** This skill MUST run FIRST before any other action

---

### 3. **project-context-loader** (Priority: HIGH)

**Auto-invokes when:** Before workflows, implementations, or code generation

**Triggers:**
- Before "workflow:start"
- Before "implement", "build", "create"
- When project-specific behavior needed

**What it does:**
- Loads `.claude/project-contexts/[project]/`
- Reads conventions.md, rules.md, examples.md
- Applies YOUR project standards (not generic defaults)
- Merges project rules with Aura Frog core rules

---

### 4. **bugfix-quick** (Priority: MEDIUM)

**Auto-invokes when:** Bug fixes and issues mentioned

**Triggers:**
- "fix bug", "error", "not working", "broken", "issue"
- "crash", "fails", "problem"
- "bugfix:quick" command

**What it does:**
- Lightweight fix process (skips full 9-phase workflow)
- Still enforces TDD: write failing test → implement fix → verify
- 3 approval gates (vs 9 in full workflow)
- Much faster for simple bugs

---

### 5. **test-writer** (Priority: MEDIUM)

**Auto-invokes when:** Test-related requests

**Triggers:**
- "add tests", "write tests", "test coverage"
- "unit test", "integration test", "E2E test"
- "test:unit", "test:e2e" commands

**What it does:**
- Creates comprehensive tests (unit, integration, E2E)
- Enforces TDD when possible
- Supports Jest, Cypress, Detox, PHPUnit, PyTest
- Ensures coverage meets target (default 80%)

---

### 6. **code-reviewer** (Priority: HIGH)

**Auto-invokes when:** After code implementation or review requested

**Triggers:**
- "review code", "code review", "check my code"
- After Phase 5c in workflow
- Before merging pull requests

**What it does:**
- Multi-agent review (Security, Performance, Quality, Testing)
- OWASP Top 10 security checks
- Performance analysis
- Test coverage verification
- Generates comprehensive review report

---

### 7. **jira-integration** (Priority: MEDIUM)

**Auto-invokes when:** JIRA ticket mentioned

**Triggers:**
- Ticket IDs: "PROJ-1234", "IGNT-567"
- JIRA URLs: `https://company.atlassian.net/browse/PROJ-1234`
- "jira:fetch <ticket-id>"

**What it does:**
- Auto-fetches ticket details via Bash script
- Loads requirements into workflow
- Updates ticket status throughout development
- Saves data to `.claude/logs/jira/`

**Requires:** `JIRA_API_TOKEN` in `.envrc`

---

### 8. **figma-integration** (Priority: MEDIUM)

**Auto-invokes when:** Figma URL detected

**Triggers:**
- Figma URLs: `https://figma.com/file/ABC123/Design`
- "figma:fetch <file-id>"
- "implement this Figma design"

**What it does:**
- Auto-fetches design data via Bash script
- Extracts components and design tokens
- Generates styling constants
- Loads into Phase 3 (UI Breakdown)
- Downloads design images

**Requires:** `FIGMA_API_TOKEN` in `.envrc`

---

### 9. **confluence-integration** (Priority: MEDIUM)

**Auto-invokes when:** Confluence page or documentation needed

**Triggers:**
- Confluence URLs: `https://company.atlassian.net/wiki/...`
- "confluence page", "wiki page", "documentation"
- Phase 8 (Documentation) - for publishing
- Phase 9 (Share) - for team notifications

**What it does:**
- Fetches Confluence pages by ID or title
- Searches pages across spaces
- Creates new pages (with confirmation)
- Updates existing pages (with confirmation)
- Saves data to `.claude/logs/confluence/`

**Operations:**
```bash
# Fetch page
bash scripts/confluence-operations.sh fetch 123456
bash scripts/confluence-operations.sh fetch "API Documentation" DEV

# Search pages
bash scripts/confluence-operations.sh search "deployment guide" PROJ

# Create page (requires confirmation)
bash scripts/confluence-operations.sh create DEV "New Page" content.md

# Update page (requires confirmation)
bash scripts/confluence-operations.sh update 123456 updated-content.md
```

**Requires:** `CONFLUENCE_API_TOKEN` in `.envrc`

---

### 10. **session-manager** (Priority: HIGH)

**Auto-invokes when:** Token limit warning triggered

**Triggers:**
- Token count exceeds 150K (75% of limit)
- User requests `workflow:handoff`
- User requests `workflow:resume`
- Long-running workflow needs state save

**What it does:**
- Monitors token usage
- Saves workflow state to `.claude/context/`
- Enables workflow resume across sessions
- Warns user before token exhaustion

**Thresholds:**
- 150K tokens - Consider handoff
- 175K tokens - Recommend handoff
- 190K tokens - Urgent handoff

**📚 Details:** `skills/session-manager/SKILL.md`

---

## 🎭 Skill Invocation Flow

```
1. User sends message
   ↓
2. agent-detector skill auto-invokes (ALWAYS)
   ↓
3. Detects appropriate agent
   ↓
4. Checks message intent
   ↓
5. Other skills auto-invoke based on context:
   - "implement feature" → workflow-orchestrator
   - "fix bug" → bugfix-quick
   - "add tests" → test-writer
   - "PROJ-1234" → jira-integration
   - Figma URL → figma-integration
   - Confluence URL → confluence-integration
   ↓
6. Skills load project-context-loader if needed
   ↓
7. Execute skill logic
   ↓
8. code-reviewer auto-invokes after implementation
```

---

## 🔧 How Skills Work

### Auto-Invocation

Claude reads all skill descriptions and uses LLM reasoning to match your message to the appropriate skill(s). Multiple skills can activate for a single message.

**Example 1:**
```
User: "Implement user profile screen from PROJ-1234 Figma design"

Auto-invokes:
1. agent-detector (ALWAYS)
2. jira-integration (ticket detected)
3. figma-integration (Figma URL detected)
4. project-context-loader (before implementation)
5. workflow-orchestrator (complex feature)
```

**Example 2:**
```
User: "Fix the login button bug"

Auto-invokes:
1. agent-detector (ALWAYS)
2. project-context-loader (before fix)
3. bugfix-quick (bug detected)
```

### Skill Loading Sequence

1. **Claude reads skill description** from plugin.json
2. **Matches context** using LLM reasoning
3. **Loads SKILL.md** with full instructions
4. **Injects as user message** into conversation
5. **Executes skill logic** following instructions
6. **Returns results** to user

---

## 📂 Skill File Structure

Each skill follows this structure:

```
skills/
└── [skill-name]/
    ├── SKILL.md (required) - Main skill instructions with frontmatter
    ├── [reference].md (optional) - Additional reference docs
    └── scripts/ (optional) - Bash scripts for integrations
```

**Skill file format (SKILL.md):**
```markdown
---
name: skill-name
description: "Clear description with TRIGGER words"
autoInvoke: true|false
priority: highest|high|medium|low
triggers:
  - "trigger phrase 1"
  - "trigger phrase 2"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Skill Name

## Overview
## When to Use This Skill
## When NOT to Use
## How It Works
## Examples
## Related Skills
```

---

## 🎯 Skill Descriptions - The Key to Auto-Invocation

**Good descriptions (80%+ success rate):**
- ✅ Use action words: "PROACTIVELY use when..."
- ✅ List specific triggers: "Triggers: 'implement', 'build', 'create'"
- ✅ Specify WHEN to use
- ✅ Specify WHEN NOT to use
- ✅ Include example phrases users say

**Bad descriptions (20% success rate):**
- ❌ Vague: "Helps with coding"
- ❌ No triggers listed
- ❌ No examples
- ❌ Doesn't specify exclusions

---

## 🔗 Skill Dependencies

**Skill usage patterns:**

```
agent-detector (ALWAYS FIRST)
↓
project-context-loader (Before major actions)
↓
workflow-orchestrator, bugfix-quick, or test-writer
↓
code-reviewer (After implementation)
↓
jira-integration / figma-integration / confluence-integration (When mentioned)
```

---

## 📊 Skill Priorities

| Skill | Priority | Auto-Invoke |
|-------|----------|-------------|
| agent-detector | HIGHEST | ALWAYS (100%) |
| workflow-orchestrator | CRITICAL | Complex tasks |
| project-context-loader | HIGH | Before code generation |
| code-reviewer | HIGH | After implementation |
| session-manager | HIGH | Token limit warning |
| bugfix-quick | MEDIUM | Bug mentions |
| test-writer | MEDIUM | Test requests |
| jira-integration | MEDIUM | Ticket detected |
| figma-integration | MEDIUM | Figma URL detected |
| confluence-integration | MEDIUM | Confluence URL/docs |
---

## 🚀 Using Skills

**You don't need to call skills explicitly!** Just describe what you want in natural language:

**Instead of:**
```
/workflow-orchestrator implement user profile
```

**Just say:**
```
Implement a user profile screen
```

Claude will automatically invoke the `workflow-orchestrator` skill.

---

## 📚 Documentation

- **Skills Overview:** `skills/README.md` (this file)
- **Individual Skills:** `skills/[skill-name]/SKILL.md`
- **Main CLAUDE.md:** Overview and skill coordination
- **Plugin Manifest:** `.claude-plugin/plugin.json` (skill registration)

---

## ⚠️ Important Notes

1. **agent-detector ALWAYS runs first** - No exceptions
2. **Multiple skills can activate** for a single message
3. **Skills are auto-invoked** - You don't call them manually
4. **project-context-loader should run** before code generation
5. **Integration skills require setup** - Check `.envrc` for tokens

---

## 📖 Reference Skills (Non-Auto-Invoking)

These skills provide guidance documents that agents reference during workflows:

| Skill | Purpose | Location |
|-------|---------|----------|
| **refactor-expert** | Safe refactoring patterns | `skills/refactor-expert/` |
| **api-designer** | RESTful API design | `skills/api-designer/` |
| **performance-optimizer** | Performance profiling & optimization | `skills/performance-optimizer/` |
| **migration-helper** | Database/code migrations | `skills/migration-helper/` |
| **phase-skipping** | Smart phase skip rules | `skills/workflow-orchestrator/` |
| **estimation** | Effort estimation techniques | `skills/pm-expert/` |
| **documentation** | ADR & Runbook templates | `skills/documentation/` |

---

**Version:** 1.1.4
**Last Updated:** 2025-12-01
**Total Skills:** 22+ (10 auto-invoking + 12 reference)
