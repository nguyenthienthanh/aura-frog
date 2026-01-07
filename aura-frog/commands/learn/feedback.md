# /learn:feedback

**Category:** Learning
**Purpose:** Manually submit feedback to the learning system

---

## Usage

```bash
/learn:feedback                           # Interactive feedback
/learn:feedback --type correction         # Report a correction
/learn:feedback --type success            # Report what worked well
/learn:feedback --type agent-issue        # Report agent selection issue
/learn:feedback --type workflow-issue     # Report workflow issue
```

---

## Execution Steps

When user runs `/learn:feedback`, Claude should:

### Step 1: Check Environment

```bash
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SECRET_KEY" ]; then
  echo "❌ Learning system not configured"
  echo "Set SUPABASE_URL and SUPABASE_SECRET_KEY in .envrc"
  exit 1
fi
```

### Step 2: Gather Feedback (Interactive)

Ask the user:

```markdown
## 📝 Submit Feedback

**What type of feedback?**

1. ✅ **Success** - Something worked really well
2. ❌ **Correction** - I had to fix/redo something
3. 🤖 **Agent Issue** - Wrong agent was selected
4. 🔄 **Workflow Issue** - Problem with workflow phases
5. 💡 **Suggestion** - General improvement idea

**Select (1-5):**
```

### Step 3: Collect Details Based on Type

#### For Success (type=success)
```markdown
**What worked well?**
- Agent used: [auto-detect or ask]
- Task type: [e.g., "React component", "API endpoint"]
- Why it worked: [user input]

**Rate effectiveness (1-5):**
```

#### For Correction (type=correction)
```markdown
**What needed correction?**
- What was the issue: [user input]
- What did you change: [user input]
- File(s) affected: [auto-detect recent edits or ask]
- Agent used: [auto-detect or ask]

**Severity (1-5):** 1=minor tweak, 5=complete redo
```

#### For Agent Issue (type=agent-issue)
```markdown
**Agent Selection Problem**
- Task description: [user input]
- Agent selected: [auto-detect or ask]
- Better agent would be: [user input or suggest from list]
- Why: [user input]
```

#### For Workflow Issue (type=workflow-issue)
```markdown
**Workflow Problem**
- Phase where issue occurred: [1-9]
- What happened: [user input]
- Expected behavior: [user input]
```

#### For Suggestion (type=suggestion)
```markdown
**Improvement Suggestion**
- Category: [agent/workflow/rule/skill/other]
- Suggestion: [user input]
- Expected benefit: [user input]
```

### Step 4: Submit to Supabase

```bash
# Determine feedback_type based on user selection
# success → approval
# correction → correction
# agent-issue → agent_override
# workflow-issue → rejection
# suggestion → suggestion

curl -X POST "${SUPABASE_URL}/rest/v1/af_feedback" \
  -H "apikey: ${SUPABASE_SECRET_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback_type": "'"$feedback_type"'",
    "context": {
      "task_type": "'"$task_type"'",
      "agent_used": "'"$agent_used"'",
      "details": "'"$details"'"
    },
    "user_comment": "'"$user_comment"'",
    "severity": '"$severity"',
    "session_id": "'"$SESSION_ID"'"
  }'
```

### Step 5: Confirm Submission

```markdown
✅ Feedback submitted!

**Type:** Correction
**Severity:** 3/5
**Agent:** react-expert
**Details:** Component state management approach was overcomplicated

💡 Run `/learn:analyze` to see how your feedback improves the system.
```

---

## Quick Feedback (Non-Interactive)

For fast feedback submission:

```bash
# Quick success
/learn:feedback --type success --message "TDD approach worked great for API"

# Quick correction
/learn:feedback --type correction --severity 3 --message "Had to simplify state logic"

# Quick agent issue
/learn:feedback --type agent-issue --agent react-expert --better nodejs-expert --message "Was backend task"
```

---

## Feedback Types Reference

| Type | feedback_type | When to Use |
|------|---------------|-------------|
| Success | `approval` | Agent/approach worked well |
| Correction | `correction` | You modified AI output |
| Agent Issue | `agent_override` | Wrong agent selected |
| Workflow Issue | `rejection` | Phase/workflow problem |
| Suggestion | `suggestion` | General improvement idea |

---

## Examples

### Example 1: Report Successful Approach

```
User: /learn:feedback

Claude:
## 📝 Submit Feedback

What type of feedback?
1. ✅ Success
2. ❌ Correction
3. 🤖 Agent Issue
4. 🔄 Workflow Issue
5. 💡 Suggestion

User: 1

Claude: What worked well?

User: The react-expert agent's approach to form validation was perfect

Claude: Rate effectiveness (1-5):

User: 5

Claude:
✅ Feedback submitted!

Type: Success (approval)
Rating: 5/5
Agent: react-expert
Context: Form validation approach

💡 This positive feedback helps identify successful patterns!
```

### Example 2: Report Correction

```
User: /learn:feedback --type correction

Claude: What needed correction?

User: The API error handling was too verbose, had to simplify

Claude: Severity (1=minor, 5=complete redo):

User: 2

Claude:
✅ Feedback submitted!

Type: Correction
Severity: 2/5
Details: API error handling too verbose, simplified

💡 This helps identify patterns to avoid.
```

### Example 3: Quick Feedback

```
User: /learn:feedback --type success --message "Vue composition API pattern was exactly right"

Claude:
✅ Feedback submitted!

Type: Success
Message: Vue composition API pattern was exactly right
Agent: vue-expert (auto-detected)

💡 Quick feedback recorded!
```

---

## Auto-Detection

The command will try to auto-detect:
- **Current agent** from session state
- **Recent files** from git status
- **Task type** from conversation context
- **Session ID** from environment

This reduces manual input needed.

---

## Related Commands

- `/learn:status` - Check feedback count and system status
- `/learn:analyze` - Analyze feedback patterns
- `/learn:apply` - Apply improvements based on feedback

---

**Version:** 1.0.0
