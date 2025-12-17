# Command: workflow:handoff

**Purpose:** Prepare workflow for continuation in new session
**Aliases:** `handoff`, `save context`, `checkpoint`

---

## Usage

```
workflow:handoff
"Save context for handoff"
"Checkpoint workflow"
```

---

## When to Use

```toon
triggers[4]{condition,action}:
  Token > 150K (75%),Run handoff proactively
  Token > 160K (80%),Warning shown automatically
  Before break,Save progress
  Multi-day project,Regular checkpoints
```

---

## What Gets Saved

```toon
saved_data[5]{category,content}:
  State,workflow-state.json (phase + progress + tokens)
  Context,HANDOFF_CONTEXT.md (summary for next session)
  Git,Branch + commit + uncommitted changes
  Deliverables,All phase outputs so far
  Pending,Outstanding tasks + next steps
```

---

## Output Files

```
.claude/logs/workflows/{workflow-id}/
├── workflow-state.json      # Machine-readable state
├── HANDOFF_CONTEXT.md       # Human-readable summary
├── task-context.md          # Original requirements
└── deliverables/            # All phase outputs
```

---

## HANDOFF_CONTEXT.md Structure

```toon
sections[6]{section,content}:
  Summary,What was accomplished
  Current Phase,Where we stopped
  Pending Tasks,What remains to do
  Key Decisions,Important choices made
  Next Steps,How to continue
  Resume Command,Exact command to run
```

---

## Resume

```
workflow:resume {workflow-id}
```

---

**Version:** 2.0.0
