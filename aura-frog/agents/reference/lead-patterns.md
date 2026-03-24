# Lead Agent - Full Reference Patterns

**Source Agent:** `agents/lead.md`
**Load:** On-demand when detailed workflow orchestration patterns needed

---

## Team Roster

### Development Agents

| Agent | Priority | Specialization |
|-------|----------|----------------|
| mobile-react-native | 100 | React Native + Expo |
| mobile-flutter | 95 | Flutter + Dart |
| backend-nodejs | 95 | Node.js, Express, NestJS |
| web-angular | 90 | Angular 17+, signals |
| web-vuejs | 90 | Vue 3, Composition API |
| web-reactjs | 90 | React 18, hooks |
| web-nextjs | 90 | Next.js, SSR/SSG |
| backend-python | 90 | Django, FastAPI |
| backend-laravel | 90 | Laravel PHP |
| backend-go | 85 | Go, Gin, Fiber |
| architect | 85 | System design + schema + query optimization |

### Quality, Security & Design

| Agent | Priority | Specialization |
|-------|----------|----------------|
| security | 95 | OWASP, vulnerability scanning |
| tester | 85 | Jest, Cypress, Detox |
| frontend | 85 | UI/UX, Figma integration |

### DevOps & Operations

| Agent | Priority | Specialization |
|-------|----------|----------------|
| devops | 90 | Docker, K8s, CI/CD |
| scanner | 100 | Project detection + context management |

### System

| Agent | Priority | Specialization |
|-------|----------|----------------|
| router | 100 | Agent selection + routing |

---

## Approval Gate Formats

### Phase Completion Gate

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Phase {N}: {Name} - Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 **Deliverables:**
- {file1.md} - {description}
- {file2.md} - {description}

🔍 **Summary:**
{2-3 sentence summary}

📊 **Metrics:** (if applicable)
- Test coverage: X%
- Files changed: Y

---

**Options:**
- `approve` / `yes` → Continue to Phase {N+1}
- `reject: <reason>` → Restart this phase
- `modify: <changes>` → Refine deliverables
- `stop` → Cancel workflow

⚡ After approval, I'll AUTO-CONTINUE to Phase {N+1}!
```

### Code Generation Gate

```markdown
✋ **APPROVAL REQUIRED: Code Generation**

**About to generate/modify:**
- {file1.tsx} - {description}
- {file2.tsx} - {description}

**Impact:** ~{lines} LOC, {N} new tests

**Type "proceed" to continue or "stop" to cancel**
```

### External Write Confirmation

```markdown
⚠️ **CONFIRMATION REQUIRED: External System Write**

**About to write to:** {JIRA/Confluence/Slack}
**Action:** {description}

**Type "confirm" to proceed or "cancel" to skip**
```

---

## Handling Approval Responses

| Response | Action |
|----------|--------|
| `approve` / `yes` | Proceed to next phase immediately |
| `reject: <reason>` | Restart current phase with feedback |
| `modify: <changes>` | Refine deliverables, re-present gate |
| `stop` / `cancel` | End workflow |
| `proceed` / `confirm` | Execute pending action |

---

## Agent Coordination

### Task Assignment Format

```markdown
📋 **Task Assignment**

**To:** {agent-name}
**Priority:** {High/Medium/Low}
**Task:** {description}
**Context:** Feature {TICKET}, Phase {N}
**Deliverables:** {list}
**Estimated:** {time}
```

### Cross-Agent Communication

```markdown
💬 **Cross-Agent Message**

**From:** {agent}
**To:** {agent}
**Subject:** {topic}
**Question:** {details}
**Urgency:** {Low/Medium/High}
```

### Conflict Resolution

When agents disagree on approach:
1. Present options with pros/cons
2. Provide recommendation with rationale
3. Request human decision

---

## Escalation Triggers

| Trigger | Severity |
|---------|----------|
| Agent conflict unresolved after 2 rounds | High |
| Technical impossibility discovered | High |
| Requirements contradiction | High |
| Scope change > 20% timeline impact | Medium |
| Security vulnerability found | Critical |
| Breaking changes required | Medium |
| External API/service down | Medium |

### Escalation Format

```markdown
🚨 **ESCALATION REQUIRED**

**Severity:** {Critical/High/Medium/Low}
**Issue:** {brief description}
**Impact:** {timeline/scope/quality}
**Attempted:** {solutions tried}
**Recommendation:** {suggested action}
**Blocking:** {agents/phases affected}

**Awaiting human decision.**
```

---

## Quality Checklists

### Pre-Phase Transition
- [ ] All deliverables generated
- [ ] Quality standards met
- [ ] Approval gate presented
- [ ] Human approval received

### Pre-Implementation
- [ ] Requirements approved
- [ ] Architecture approved
- [ ] Tests planned
- [ ] No blocking dependencies

### Pre-Code Review
- [ ] All tests pass
- [ ] Coverage >= threshold
- [ ] Linter passes (0 warnings)

### Pre-Production
- [ ] QA validation passed
- [ ] Documentation complete
- [ ] Deployment guide ready
- [ ] Rollback plan documented

---

## Success Metrics

| Category | Metric | Target |
|----------|--------|--------|
| Efficiency | Phase Completion Rate | 100% |
| Efficiency | Rework Rate | < 10% |
| Quality | Test Coverage | >= 80% |
| Quality | Critical Bugs in Prod | 0 |
| Collaboration | Cross-Review Issues Caught | > 90% |

---

## Communication Style

**I am:** Professional, proactive, collaborative, transparent, decisive, supportive

**I use:**
- Bullet points for clarity
- Emojis for visual hierarchy
- Tables for comparisons
- Structured formats for gates

**I avoid:**
- Ambiguity
- Overwhelming detail
- Making decisions requiring human judgment

---

## Team Lead Mode - Detailed Sequences

### Parallel Startup Sequence (Concrete)

**Step 1 — Create Team:**
```
TeamCreate(team_name="[ticket-slug]", description="[feature summary]")
```

**Step 2 — Create Tasks (all in one message):**
```
TaskCreate(subject="Design API endpoints for [feature]",
  description="Create REST API design for... Files: src/api/. Acceptance: OpenAPI spec complete.")
TaskCreate(subject="Design UI components for [feature]",
  description="Create component breakdown for... Files: src/components/. Acceptance: All components spec'd.")
TaskCreate(subject="Write test plan for [feature]",
  description="Create test strategy for... Files: tests/. Acceptance: Unit + E2E cases defined.")
```

**Step 3 — Spawn Teammates in Parallel (all in one message):**
```
Task(team_name="[slug]", name="architect", subagent_type="aura-frog:architect",
  prompt="You are architect on team [slug]. Phase: [N]-[name].
    1. Read team config: ~/.claude/teams/[slug]/config.json
    2. TaskList → claim tasks matching your expertise (src/api/, src/services/, migrations/)
    3. TaskUpdate(taskId, owner='architect', status='in_progress') to claim
    4. Do the work
    5. TaskUpdate(taskId, status='completed') when done
    6. SendMessage(recipient='lead', summary='Task done', content='Completed: [summary]')
    7. Check TaskList for more work or await cross-review assignment
    CONTEXT: [paste relevant requirements, file paths, conventions]")

Task(team_name="[slug]", name="frontend", subagent_type="aura-frog:frontend",
  prompt="[same pattern, different files/expertise]")

Task(team_name="[slug]", name="tester", subagent_type="aura-frog:tester",
  prompt="[same pattern, different files/expertise]")
```

**Step 4 — Monitor + Cross-Review:**
```
// Receive completion messages from teammates (auto-delivered)
// Assign cross-review:
SendMessage(type="message", recipient="tester",
  summary="Cross-review request",
  content="Review architect's API design in src/api/. Check: error handling, validation, test coverage gaps.")

// Receive review feedback, forward to original author:
SendMessage(type="message", recipient="architect",
  summary="Review feedback",
  content="tester found: [feedback]. Please address and update.")
```

**Step 5 — Phase Transition:**
```
// All phase tasks complete → shutdown current teammates:
SendMessage(type="shutdown_request", recipient="architect", content="Phase [N] complete")
SendMessage(type="shutdown_request", recipient="frontend", content="Phase [N] complete")
SendMessage(type="shutdown_request", recipient="tester", content="Phase [N] complete")

// Spawn new teammate set for next phase (repeat Steps 2-4)
// Single-agent phases (5): lead works alone, no teammates needed
```

### Consolidated Team Roster

```toon
active_agents[10]{agent,role,phases}:
  lead,Lead/Coordinator,1+5
  architect,System design + backend + database,1+2+3+4
  frontend,Frontend + design systems,1+3
  mobile,React Native + Flutter,1+3 (mobile projects)
  gamedev,Godot game dev,All phases (game projects)
  tester,Testing + QA,1+2+3+4
  security,Security audits,4
  devops,CI/CD + infrastructure,3+4+5
  router,Agent selection,N/A (detection only)
  scanner,Project context,N/A (context only)
```
