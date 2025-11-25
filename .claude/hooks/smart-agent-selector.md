# Smart Agent Selector - Intelligent Agent Assignment

**Version:** 1.0.0  
**Purpose:** Automatically analyze requirements and assign appropriate agents

---

## 🎯 How It Works

### 1. Requirement Analysis
```
User Input → Parse Keywords → Detect Project Type → Match Capabilities → Score Agents → Select Best Fit
```

### 2. Scoring Algorithm

Each agent gets scored based on:

#### Project Type Match (Weight: 40 points)
```yaml
mobile-react-native: 
  - React Native, Expo, mobile, iOS, Android, phone, tablet
  score: +40 if matches

web-vuejs:
  - Vue, Vue.js, Composition API, Pinia, Nuxt
  score: +40 if matches

web-reactjs:
  - React, CRA, SPA, React app (not Next.js)
  score: +40 if matches

web-nextjs:
  - Next.js, Next, SSR, SSG, App Router, getServerSideProps
  score: +40 if matches

backend-laravel:
  - Laravel, PHP, API, backend, server, database, Eloquent
  score: +40 if matches
```

#### Task Type Match (Weight: 30 points)
```yaml
qa-automation:
  - test, testing, QA, coverage, automation, E2E, unit test
  score: +30 if matches

ui-designer:
  - design, UI, UX, Figma, component, layout, responsive, screenshot
  score: +30 if matches

jira-operations:
  - JIRA, ticket, issue, epic, story
  score: +30 if matches

confluence-operations:
  - Confluence, documentation, doc, wiki, page
  score: +30 if matches

slack-operations:
  - Slack, notify, message, notification, alert
  score: +30 if matches
```

#### Region Detection (Weight: 20 points) - For Mobile
```yaml
region_keywords:
  PH: philippines, PH, manila, filipin
  MY: malaysia, MY, kuala lumpur, malay
  ID: indonesia, ID, jakarta, indonesian
  IB: IB, investment banking
  HK: hong kong, HK, hongkong

score: +20 if region matches project region
```

#### Device Type (Weight: 10 points) - For Mobile
```yaml
phone: phone, mobile, smartphone, iOS, Android
tablet: tablet, iPad, Android tablet

score: +10 if device type mentioned
```

---

## 📊 Agent Selection Examples

### Example 1: Mobile Feature Request
```
Input: "Implement social media sharing for PH mobile app"

Analysis:
- Keywords: mobile, app, sharing, PH
- Project type: mobile-react-native (40 points)
- Region: PH (20 points)
- Device: mobile/phone (10 points)

Selected Agents:
1. mobile-react-native (70 points) ← Primary
2. ui-designer (30 points) - Likely needs UI work
3. qa-automation (30 points) - Always for implementation

Result: Activate mobile-react-native, ui-designer, qa-automation
```

### Example 2: Backend API Request
```
Input: "Create REST API for user management in Laravel"

Analysis:
- Keywords: API, Laravel, user management, backend
- Project type: backend-laravel (40 points)
- Task: API development (30 points)

Selected Agents:
1. backend-laravel (70 points) ← Primary
2. qa-automation (30 points) - Testing required

Result: Activate backend-laravel, qa-automation
```

### Example 3: Web Frontend + Backend
```
Input: "Build dashboard with Vue frontend and Laravel backend"

Analysis:
- Keywords: Vue, Laravel, dashboard, frontend, backend
- Project types: web-vuejs (40), backend-laravel (40)
- Task: Full-stack development

Selected Agents:
1. web-vuejs (40 points) ← Frontend
2. backend-laravel (40 points) ← Backend
3. ui-designer (30 points) - Dashboard UI
4. qa-automation (30 points) - Testing both

Result: Activate web-vuejs, backend-laravel, ui-designer, qa-automation
```

### Example 4: Testing Only
```
Input: "Add unit tests for the payment module"

Analysis:
- Keywords: unit tests, testing, module
- Task type: testing (30 points)
- Need to detect project type from context

Selected Agents:
1. qa-automation (30 points) ← Primary
2. [Project-specific agent] (based on cwd)

Result: Activate qa-automation + detected project agent
```

### Example 5: JIRA Ticket Workflow
```
Input: "/ccpm:ticket https://jira.../PROJ-1234"

Analysis:
- Command: ticket workflow
- JIRA link detected

Selected Agents:
1. pm-operations-orchestrator (95 points) ← Always for workflows
2. jira-operations (80 points) ← Fetch ticket
3. confluence-operations (80 points) ← Check related docs
4. [More agents after reading ticket content]

Result: Activate PM orchestrator + operations agents first
```

---

## 🧠 Intelligent Context Detection

### Current Working Directory Analysis
```javascript
// Detect project from cwd
const cwd = process.cwd();

// Check if path matches configured projects
if (cwd.includes('YOUR_Proj_Frontend')) {
  projectType = 'mobile-react-native';
  agents += ['mobile-react-native'];
}

if (cwd.includes('backend') || cwd.includes('api')) {
  agents += ['backend-laravel'];
}
```

### Recent File Analysis
```javascript
// Check recently opened files
recentFiles = [
  'useSocialMediaPost.tsx',
  'SocialMarketingCompositePost.phone.tsx',
];

// Pattern matching
if (recentFiles.some(f => f.includes('.phone.tsx'))) {
  agents += ['mobile-react-native'];
  deviceType = 'phone';
}

if (recentFiles.some(f => f.includes('.vue'))) {
  agents += ['web-vuejs'];
}
```

### User Intent Detection
```javascript
// Common patterns
const intentPatterns = {
  implement: ['implement', 'create', 'add', 'build', 'develop'],
  fix: ['fix', 'bug', 'error', 'issue', 'problem'],
  refactor: ['refactor', 'improve', 'optimize', 'clean'],
  test: ['test', 'coverage', 'QA', 'validate'],
  design: ['design', 'UI', 'UX', 'layout', 'component'],
  document: ['document', 'doc', 'write spec', 'documentation'],
};

// Adjust agent priorities based on intent
if (intent === 'implement') {
  primaryAgents = devAgents;
  secondaryAgents = [qa, ui-designer];
}

if (intent === 'test') {
  primaryAgents = [qa-automation];
  secondaryAgents = [relevantDevAgent];
}
```

---

## ⚙️ Configuration

### Scoring Weights (Adjustable)
```yaml
weights:
  project_type: 40      # Project type match
  task_type: 30         # Task/keyword match
  region: 20            # Region match (mobile)
  device: 10            # Device type (mobile)
  
thresholds:
  activate: 20          # Minimum score to activate agent
  primary: 50           # Score to be primary agent
```

### Agent Priorities (Base)
```yaml
# From config
mobile-react-native: 100
pm-operations-orchestrator: 95
project-context-manager: 95
project-detector: 100
web-vuejs: 90
web-reactjs: 90
web-nextjs: 90
backend-laravel: 90
qa-automation: 85
ui-designer: 85
jira-operations: 80
confluence-operations: 80
linear-operations: 75
slack-operations: 70
```

### Always Active Agents
```yaml
always_active:
  - pm-operations-orchestrator    # Workflow coordination
  - project-detector              # Auto-detect project
  - project-context-manager       # Context tracking
```

---

## 🔄 Selection Flow

```
User Input Received
    ↓
1. Always Activate:
   - pm-operations-orchestrator
   - project-detector
   - project-context-manager
    ↓
2. Analyze Input:
   - Extract keywords
   - Detect project type
   - Identify task type
   - Check for region/device
    ↓
3. Score All Agents:
   - Project type match (+40)
   - Task type match (+30)
   - Region match (+20)
   - Device match (+10)
   - Base priority (from config)
    ↓
4. Filter & Sort:
   - Keep agents with score >= 20
   - Sort by total score (desc)
    ↓
5. Select Agents:
   - Primary: Score >= 50
   - Secondary: Score 30-49
   - Optional: Score 20-29
    ↓
6. Activate & Notify User:
   "Activated agents:
   - mobile-react-native (Primary)
   - ui-designer (Secondary)
   - qa-automation (Always)"
```

---

## 💬 User Notification Format

### Clear Agent Assignment
```markdown
📋 **Task Received:** [Brief summary]

🤖 **Agents Activated:**

**Primary (Lead Development):**
- mobile-react-native (Score: 70) - React Native + Expo expert

**Secondary (Supporting Roles):**
- ui-designer (Score: 30) - UI/UX analysis
- qa-automation (Score: 30) - Testing & QA

**Infrastructure (Always Active):**
- pm-operations-orchestrator - Workflow coordination
- project-context-manager - Context tracking

---

**Proceeding with Phase 1: Requirement Analysis...**
```

---

## 🎛️ Override Mechanisms

### Manual Agent Selection
```
User: "Use only qa-automation agent for this task"

System: Override automatic selection.
Activated: qa-automation (manual), pm-operations-orchestrator (always)
```

### Project-Specific Defaults
```yaml
# In .claude/ccpm-config.yaml
projects:
  your-proj-mobile:
    agents_priority:
      - mobile-react-native
      - ui-designer
      - qa-automation
    
    # These get +25 bonus in scoring
```

---

## 🔍 Debug Mode

### Verbose Agent Selection
```
User: /ccpm:debug on

System shows detailed scoring:

Agent Selection Debug:
----------------------
mobile-react-native:
  - Project type match (React Native): +40
  - Region match (PH): +20
  - Device match (phone): +10
  - Base priority: +100
  → Total: 170 ✅ PRIMARY

web-vuejs:
  - Project type match: 0
  - Base priority: +90
  → Total: 90 (not selected)

qa-automation:
  - Task type match (testing implied): +30
  - Base priority: +85
  → Total: 115 ✅ SECONDARY

ui-designer:
  - Task type match (UI implied): +30
  - Base priority: +85
  → Total: 115 ✅ SECONDARY

Selected: mobile-react-native (primary), qa-automation, ui-designer
```

---

## 📚 Integration with Workflow

### Phase 1: Requirement Analysis
```
PM Orchestrator receives task
    ↓
Smart Agent Selector analyzes
    ↓
Agents selected & activated
    ↓
PM Orchestrator coordinates selected agents
```

### Dynamic Agent Addition
```
During Phase 2 (Technical Planning):
mobile-react-native: "This requires backend API changes"
    ↓
PM Orchestrator: Activating backend-laravel agent
    ↓
backend-laravel joins the workflow
```

---

## ✅ Success Criteria

- **Accuracy:** > 90% correct agent selection
- **Coverage:** All major use cases covered
- **Flexibility:** Easy to override if needed
- **Transparency:** Clear explanation of selection
- **Adaptability:** Learns from context

---

**Version:** 1.0.0  
**Status:** ✅ Ready for Implementation  
**Last Updated:** 2025-11-23

