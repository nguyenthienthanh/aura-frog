# Agent Identification System

**Version:** 5.2.0
**Purpose:** Guide Claude to always identify which agent is speaking
**Last Updated:** 2025-11-26

---

## 🎯 Purpose

Every message from Claude MUST include clear agent identification so users know which specialized agent is handling their request.

---

## 📋 Agent Signature Format

### Standard Signature

**At the start of every conversation turn:**

```markdown
**─────────────────────────────────────────────────────────**
🤖 **Agent:** [agent-name] | 📋 **System:** CCPM v5.2.0 | 🎯 **Phase:** [current-phase]
**─────────────────────────────────────────────────────────**
```

### Examples

**During Workflow Phase:**
```markdown
**─────────────────────────────────────────────────────────**
🤖 **Agent:** mobile-react-native | 📋 **System:** CCPM v5.2.0 | 🎯 **Phase:** 2 (Design)
**─────────────────────────────────────────────────────────**
```

**General Conversation:**
```markdown
**─────────────────────────────────────────────────────────**
🤖 **Agent:** Claude (General) | 📋 **System:** Claude Code
**─────────────────────────────────────────────────────────**
```

**Cross-Review:**
```markdown
**─────────────────────────────────────────────────────────**
🤖 **Agent:** qa-automation (Cross-Review) | 📋 **System:** CCPM v5.2.0 | 🎯 **Phase:** 2 (Design)
**─────────────────────────────────────────────────────────**
```

---

## 🎭 Agent Roles by Phase

### Phase 1: Understand 🎯
- **Primary:** pm-operations-orchestrator
- **Cross-Review:** [dev agent], qa-automation, ui-designer

### Phase 2: Design 🏗️
- **Primary:** [dev agent] (mobile-react-native, web-reactjs, backend-laravel, etc.)
- **Cross-Review:** qa-automation, secondary dev agent

### Phase 3: UI Breakdown 🎨
- **Primary:** ui-designer
- **Consulting:** [dev agent]

### Phase 4: Plan Tests 🧪
- **Primary:** qa-automation
- **Cross-Review:** [dev agent]

### Phase 5a: Write Tests 🔴
- **Primary:** qa-automation
- **Supporting:** [dev agent]

### Phase 5b: Build 🟢
- **Primary:** [dev agent]
- **Monitoring:** qa-automation

### Phase 5c: Polish ♻️
- **Primary:** [dev agent]
- **Review:** qa-automation

### Phase 6: Review 👀
- **Primary:** [dev agent] (self-review) + secondary dev agent
- **Cross-Review:** qa-automation

### Phase 7: Verify ✅
- **Primary:** qa-automation
- **Monitoring:** [dev agent]

### Phase 8: Document 📚
- **Primary:** pm-operations-orchestrator
- **Optional:** voice-operations (if narration enabled)

### Phase 9: Share 🔔
- **Primary:** pm-operations-orchestrator
- **Supporting:** jira-operations, confluence-operations, slack-operations

---

## 🤝 Agent Collaboration Format

When multiple agents work together:

```markdown
**👤 Agents Working:**
- 🎯 **Primary:** mobile-react-native (Lead Developer)
- 🤝 **Cross-Review:** qa-automation (Testability Check)
- 🎨 **Consulting:** ui-designer (Component Guidance)
- 🔧 **Supporting:** backend-laravel (API Integration)

**Current Agent Speaking:** mobile-react-native
```

---

## 🔄 Agent Handoff Messages

When transitioning between phases/agents:

```markdown
**─────────────────────────────────────────────────────────**
🔄 **Agent Handoff**
**From:** mobile-react-native (Phase 2: Design)
**To:** ui-designer (Phase 3: UI Breakdown)
**Reason:** Design approved, ready for UI analysis
**─────────────────────────────────────────────────────────**

🤖 **Agent:** ui-designer | 📋 **System:** CCPM v5.2.0 | 🎯 **Phase:** 3 (UI Breakdown)

Hello! I'm the UI Designer agent. Let me analyze the design...
```

---

## 📦 Compact Signature (Progress Updates)

For short progress messages:

```markdown
**[🤖 mobile-react-native | Phase 5b: Build]**

Writing implementation code for UserProfile component...
```

---

## ✅ Benefits

**For Users:**
- Always know who's speaking
- Understand agent responsibilities
- See collaboration patterns
- Track agent performance

**For Workflows:**
- Clear accountability per phase
- Transparent cross-review process
- Auditable agent activities
- Better debugging

**For Teams:**
- Understand expertise applied
- Learn agent capabilities
- See collaboration patterns
- Improve agent utilization

---

## 📚 Related Documentation

- **Agent List:** `README.md` - All available agents
- **Agent Selection:** `agents/smart-agent-detector.md` - How agents are chosen
- **CCPM Instructions:** `CLAUDE.md` - Core system guide

---

**Document Version:** 5.2.0
**Last Updated:** 2025-11-26
**Extracted from:** CLAUDE.md (optimization)
