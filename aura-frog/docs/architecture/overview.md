# Aura Frog Team Agents - Architecture Overview

**Version:** 3.0.0 Plugin-Based  
**Last Updated:** 2025-11-23  
**Reference:** [duongdev/ccpm Architecture](https://github.com/duongdev/ccpm)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude Code / Claude                     │
│                   (AI Assistant Interface)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  Aura Frog                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │          PM Operations Orchestrator                   │ │
│  │  (Workflow manager, agent coordinator)                │ │
│  └───────────────┬───────────────────────────────────────┘ │
│                  │                                           │
│      ┌───────────┼───────────┐                             │
│      ↓           ↓           ↓                             │
│  ┌────────┐ ┌────────┐ ┌──────────┐                       │
│  │  Dev   │ │Support │ │Integration│                       │
│  │ Agents │ │ Agents │ │  Agents  │                       │
│  └────────┘ └────────┘ └──────────┘                       │
│      │           │           │                             │
└──────┼───────────┼───────────┼─────────────────────────────┘
       │           │           │
       ↓           ↓           ↓
┌─────────────────────────────────────────────────────────────┐
│                    MCP Gateway Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   JIRA   │ │Confluence│ │  Linear  │ │  Figma   │     │
│  │   MCP    │ │   MCP    │ │   MCP    │ │   MCP    │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Systems                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   JIRA   │ │Confluence│ │  Linear  │ │  Figma   │     │
│  │    API   │ │    API   │ │   API    │ │   API    │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎭 Agent Types & Responsibilities

### 1. Development Agents (5)

**Purpose:** Code implementation

```
mobile-react-native
├── React Native + Expo
├── Multi-region support (PH, MY, ID, IB, HK)
├── Phone & Tablet responsive
└── Zustand state management

web-vuejs
├── Vue.js 3 + Composition API
├── Pinia state management
└── Vite build tooling

web-reactjs
├── React 18+ with hooks
├── Context API / Redux
└── Create React App / Vite

web-nextjs
├── Next.js 14+ (App Router)
├── SSR / SSG / ISR
└── Server Components

backend-laravel
├── Laravel 10+ REST API
├── Eloquent ORM
└── PHP 8.2+
```

**Collaboration:**
- Share code review feedback
- Coordinate on API contracts
- Align on data models

---

### 2. Support Agents (4)

**Purpose:** Quality & design

```
qa-automation
├── Test planning & execution
├── TDD enforcement (80% coverage)
├── Jest + React Testing Library
└── Detox E2E testing

ui-expert
├── Design analysis (Figma)
├── Component breakdown
├── Design token extraction
└── Accessibility (WCAG AA)

project-detector
├── Auto-detect project type
├── Load correct configuration
└── Switch contexts

project-context-manager
├── Persist workflow state
├── Maintain agent memory
└── Cross-session context
```

---

### 3. Integration Agents (5)

**Purpose:** External system integration

```
jira-operations
├── Fetch tickets via MCP
├── Update status (with approval)
├── Add comments
└── Track progress

confluence-operations
├── Read documentation
├── Create pages (with approval)
├── Generate tech specs
└── Store artifacts

linear-operations
├── Issue tracking
├── Status updates
└── Comment management

slack-operations
├── Notifications
├── Status updates
└── Alert on completion

project-config-loader
├── Load ccpm-config.yaml
├── Per-project settings
└── Environment validation
```

---

### 4. Orchestrator (1)

**Purpose:** Workflow coordination

```
pm-operations-orchestrator
├── Manage 5-phase workflow
├── Coordinate agents
├── Approval gates (2 gates)
├── Smart agent selection
├── Progress tracking
└── Error recovery
```

---

## 🔄 Workflow Architecture

### 5-Phase Workflow

```
Phase 1: Understand + Design
   │
   ├─→ Agents: pm-orchestrator, jira-operations, dev agents, ui-expert
   ├─→ Input: JIRA ticket, Figma designs
   ├─→ Output: requirements.md, tech_spec.md, component_breakdown.md
   ├─→ Approval Gate ✋
   │
   ↓
Phase 2: Test RED
   │
   ├─→ Agents: qa-automation
   ├─→ Input: Tech spec from Phase 1
   ├─→ Output: test_plan.md, failing test files
   ├─→ Auto-continue ⚡
   │
   ↓
Phase 3: Build GREEN
   │
   ├─→ Agents: dev agents, qa-automation
   ├─→ Output: Source code, passing tests
   ├─→ Approval Gate ✋
   │
   ↓
Phase 4: Refactor + Review
   │
   ├─→ Agents: All dev agents (cross-review), security-expert, qa-automation
   ├─→ Output: code_review_report.md, test_execution_report.md, coverage_report.html
   ├─→ Auto-continue ⚡
   │
   ↓
Phase 5: Finalize
   │
   ├─→ Agents: confluence-operations, slack-operations, jira-operations
   ├─→ Output: implementation_summary.md, deployment_guide.md
   ├─→ Actions: Update JIRA, notify team
   └─→ Done ✅
```

---

## 🧩 Plugin Architecture

### Plugin Components

```
~/.claude/plugins/marketplaces/aurafrog/
└── aura-frog/                 # Plugin directory
    │
    ├── agents/                # Agent definitions (plugins)
    │   └── *.md               # Each agent is a markdown plugin
    │
    ├── commands/              # CLI commands (plugins)
    │   └── *.md               # Command definitions
    │
    ├── skills/                # Reusable skills (plugins)
    │   └── *.md               # Skill modules
    │
    ├── scripts/               # Helper scripts (plugins)
    │   └── *.sh               # Automation tools
    │
    ├── hooks/                 # Smart hooks
    │   └── *.md               # Trigger logic
    │
    └── ccpm-config.yaml       # Configuration (plugin registry)
```

### Plugin Loading Sequence

```
1. User starts Claude Code
   ↓
2. Claude reads plugin root folder
   ↓
3. Load ccpm-config.yaml
   ↓
4. Detect active project
   ↓
5. Load project-specific agents
   ↓
6. Register commands
   ↓
7. Initialize MCP servers
   ↓
8. Ready for user prompt
```

---

## 🔌 MCP Integration Architecture

### MCP Gateway Layer

```
Claude AI
    ↓
[MCP Gateway]
    ↓
┌────────────┬────────────┬────────────┬────────────┐
│ JIRA MCP   │Confluence  │ Linear MCP │ Figma MCP  │
│            │    MCP     │            │            │
└─────┬──────┴─────┬──────┴─────┬──────┴─────┬──────┘
      │            │            │            │
      ↓            ↓            ↓            ↓
  JIRA API   Confluence API  Linear API  Figma API
```

### MCP Tools Available

#### JIRA MCP
```typescript
- jira_issue_get(issueKey)
- jira_issue_search(jql)
- jira_issue_update(issueKey, fields)
- jira_issue_transition(issueKey, status)
- jira_issue_comment_add(issueKey, comment)
```

#### Confluence MCP
```typescript
- confluence_page_get(id)
- confluence_page_search(cql)
- confluence_page_create(space, title, content)
- confluence_page_update(id, content)
```

#### Figma MCP
```typescript
- figma_file_get(fileId)
- figma_design_tokens_extract(fileId)
- figma_components_list(fileId)
```

---

## 💾 State Management

### Context Persistence

```
Workflow State:
  Location: .claude/logs/workflows/{workflow-id}.json
  Contains:
    - Current phase
    - Completed phases
    - Approval history
    - Agent activities
    - Generated artifacts

Agent Context:
  Location: .claude/logs/workflows/{agent-name}.json
  Contains:
    - Recent tasks
    - Decision history
    - Learning data
    - Performance metrics

Project State:
  Location: ccpm-config.yaml
  Contains:
    - Active project
    - Project settings
    - Integration configs
    - Agent preferences
```

---

## 🚦 Approval Gate System

### Gate Architecture

```
Agent completes phase
    ↓
Generate deliverables
    ↓
Present summary to user
    ↓
┌─────────────────────────┐
│   Approval Gate ✋      │
│                         │
│  User Options:          │
│  - approve              │
│  - reject + feedback    │
│  - clarify + questions  │
└─────────────────────────┘
    ↓
User input
    ↓
If approved → Next phase
If rejected → Revise current phase
If clarify → Answer questions, stay in phase
```

### Safety Mechanisms

```yaml
Before External Writes:
  - Show confirmation prompt
  - Preview changes
  - Wait for explicit "confirm"
  - Log action
  - Audit trail

Forbidden Operations:
  - Delete JIRA tickets
  - Delete Confluence pages
  - Force push to Git
  - Modify production data
```

---

## 📊 Smart Agent Selection

### Selection Algorithm

```typescript
function selectAgents(prompt: string, context: Context): Agent[] {
  const scores = [];
  
  for (const agent of allAgents) {
    let score = 0;
    
    // 1. Keyword matching (+10 per keyword)
    score += matchKeywords(prompt, agent.keywords) * 10;
    
    // 2. Task type matching (+20)
    if (isTaskType(prompt, agent.specialty)) {
      score += 20;
    }
    
    // 3. Tech stack matching (+15)
    score += matchTechStack(context.project, agent.techStack) * 15;
    
    // 4. Project context (+25 if project-specific agent)
    if (agent.projectSpecific && agent.project === context.project) {
      score += 25;
    }
    
    // 5. Historical success (+5)
    score += agent.successRate * 5;
    
    scores.push({ agent, score });
  }
  
  // Return top N agents (score > 30)
  return scores
    .filter(s => s.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.agent);
}
```

---

## 🔒 Security Architecture

### Token Management

```
Tokens stored in:
  - Environment variables (.envrc)
  - System Keychain (macOS)
  - Credential Manager (Windows)
  - Never in code or config files

Token encryption:
  - At rest: OS-level encryption
  - In transit: HTTPS only
  - In memory: Cleared after use

Token rotation:
  - JIRA/Confluence: 90 days
  - Figma: 90 days
  - Slack: Never expires (revoke manually)
```

### Access Control

```yaml
Read-Only Operations (No approval):
  - Fetch JIRA tickets
  - Read Confluence pages
  - List Linear issues
  - Get Figma designs

Write Operations (Approval required):
  - Update JIRA status
  - Create Confluence page
  - Add comments
  - Send Slack notifications

Forbidden Operations:
  - Delete anything
  - Modify permissions
  - Access production databases
```

---

## 📈 Performance Optimization

### Caching Strategy

```yaml
Figma Design Data:
  TTL: 1 hour (3600s)
  Location: JIRA comments
  Invalidation: Manual refresh

JIRA Tickets:
  TTL: 5 minutes
  Location: Memory
  Invalidation: On status change

Confluence Pages:
  TTL: 10 minutes
  Location: Memory
  Invalidation: On update

Agent Context:
  TTL: Session (until restart)
  Location: Memory + disk
  Invalidation: On workflow complete
```

### Parallel Processing

```typescript
// Agents work in parallel when possible
await Promise.all([
  mobileAgent.generateCode(),
  qaAgent.writeTests(),
  uiDesigner.analyzeDesign(),
]);

// Sequential when dependencies exist
await requirementsAgent.analyze();  // Must complete first
await technicalAgent.plan();        // Depends on requirements
await devAgent.implement();         // Depends on planning
```

---

## 🌐 Multi-Project Architecture

### Project Detection

```
User opens folder → Detect project type
    ↓
Check ccpm-config.yaml for project ID
    ↓
Load project-specific configuration
    ↓
Activate project-specific agents
    ↓
Ready
```

### Project Isolation

```yaml
Project A:
  agents: [mobile-react-native, qa-automation]
  integrations: [jira, figma]
  conventions: React Native style guide
  
Project B:
  agents: [web-vuejs, backend-laravel, qa-automation]
  integrations: [linear, confluence]
  conventions: Vue.js style guide

No cross-contamination!
```

---

## ✅ Scalability

### Horizontal Scaling

```
Add more agents:
  1. Create agents/new-agent.md
  2. Add to ccpm-config.yaml
  3. Define keywords, specialty
  4. Ready (auto-discovered)

Add more projects:
  1. Add project block to ccpm-config.yaml
  2. Define project-specific settings
  3. Switch via project-detector
  
Add more integrations:
  1. Install MCP server
  2. Configure in claude_desktop_config.json
  3. Add to ccpm-config.yaml
  4. Ready
```

---

**Architecture Status:** 🟢 Production Ready  
**Scalability:** ✅ Horizontal (add agents/projects)  
**Performance:** ✅ Optimized (caching, parallel processing)  
**Security:** ✅ Enterprise-grade (token management, approval gates)

