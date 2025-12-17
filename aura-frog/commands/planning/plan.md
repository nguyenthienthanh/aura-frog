# Command: planning

**Purpose:** Create comprehensive plan without starting full workflow
**Aliases:** `plan`, `create plan`, `brainstorm plan`

---

## Usage

```
planning "Refactor UserProfile component"
planning "Add authentication system"
"Create a plan for adding dark mode"
```

---

## Workflow

```toon
steps[5]{step,action}:
  1. Context,Load project context + analyze existing code
  2. Brainstorm,Generate 2-3 solution options
  3. Evaluate,Compare options by effort/risk/maintainability
  4. Plan,Create step-by-step implementation plan
  5. Estimate,Add story points + time estimates
```

---

## Output Structure

```toon
plan_sections[7]{section,content}:
  Problem,What needs to be solved
  Current State,Existing code analysis
  Options,2-3 solution approaches with pros/cons
  Recommendation,Best option with justification
  Implementation,Step-by-step tasks
  Risks,Potential issues + mitigations
  Estimate,Story points + time + confidence
```

---

## Options Evaluation

```toon
criteria[5]{criterion,weight}:
  Implementation Effort,High
  Risk Level,High
  Maintainability,Medium
  Performance Impact,Medium
  Breaking Changes,High
```

---

## Output File

```
.claude/logs/plans/
└── {task-name}-plan.md
```

---

## When to Use

- Before committing to full 9-phase workflow
- Complex tasks needing upfront design
- When multiple approaches are possible
- To get estimates before starting

---

**Version:** 2.0.0
