# Skill: Requirement Analysis

**Skill ID:** `requirement-analysis`  
**Category:** Planning  
**Priority:** High

---

## Purpose

Gather, parse, and structure requirements from various sources (JIRA, Confluence, user input) into actionable specifications.

---

## Capabilities

### 1. Requirement Gathering
- Fetch JIRA/Linear tickets
- Search Confluence documentation
- Parse user descriptions
- Find related issues

### 2. Requirement Parsing
- Extract functional requirements
- Extract non-functional requirements
- Identify acceptance criteria
- Detect constraints

### 3. Requirement Structuring
- Categorize by priority (High, Medium, Low)
- Map to user stories
- Define success metrics
- Identify dependencies

---

## Agents with This Skill

- `pm-operations-orchestrator` (Primary)
- `jira-operations` (Context gathering)
- `confluence-operations` (Documentation)
- `project-context-manager` (Persistence)

---

## Auto-Invoked When

- `/workflow:start` command
- Phase 1: Requirement Analysis
- New JIRA ticket linked
- User says "analyze requirements"

---

## Inputs

```typescript
interface RequirementInput {
  source: 'jira' | 'confluence' | 'user' | 'linear';
  ticketId?: string;
  description?: string;
  context?: Record<string, any>;
}
```

---

## Outputs

```typescript
interface RequirementOutput {
  functionalRequirements: Requirement[];
  nonFunctionalRequirements: Requirement[];
  acceptanceCriteria: AcceptanceCriterion[];
  constraints: string[];
  dependencies: string[];
  estimatedComplexity: 'low' | 'medium' | 'high';
}

interface Requirement {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  source: string;
}
```

---

## Deliverables

- `requirements.md` - Structured requirements
- `user_stories.md` - User stories breakdown
- `acceptance_criteria.md` - Clear AC with checkboxes

---

## Example Usage

### In PM Orchestrator
```typescript
// Phase 1: Requirement Analysis
async function executePhase1(context: WorkflowContext) {
  // Invoke requirement-analysis skill
  const requirements = await skills.requirementAnalysis.analyze({
    source: 'jira',
    ticketId: context.jiraTicket,
    context: context.metadata,
  });
  
  // Generate deliverables
  await generateRequirementsDoc(requirements);
  await generateUserStories(requirements);
  await generateAcceptanceCriteria(requirements);
  
  // Request approval
  await requestApproval('Phase 1 Complete');
}
```

---

## Quality Checks

- [ ] All requirements have priority
- [ ] Acceptance criteria are measurable
- [ ] No conflicting requirements
- [ ] Dependencies identified
- [ ] Non-functional requirements included

---

## Related Skills

- `context-gathering` - Fetch external context
- `planning` - Convert requirements to plan
- `estimation` - Estimate effort

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-23

