---
name: self-improve
description: "Apply learned improvements to the Aura Frog plugin. Updates rules, adjusts agent routing, modifies workflow configurations, and generates knowledge base entries."
autoInvoke: false
priority: 30
triggers:
  - "/learn apply"
  - "self improve"
  - "apply improvements"
---

# Self-Improve Skill

Apply learned improvements: update rules, adjust agent routing, modify workflow configs, generate knowledge entries.

---

## Usage

```bash
/learn apply                    # Review and apply pending
/learn apply --auto             # Auto-apply high-confidence (>=0.8)
/learn apply --preview          # Preview without applying
/learn apply --id <pattern_id>  # Apply specific pattern
```

---

## Improvement Types

```toon
types[4]{type,target,example}:
  Rule updates,rules/*.md,Increase coverage threshold 80→85
  Agent routing,agent-detector config,Default react-expert for .tsx
  Workflow adjustments,workflow config,Increase Phase 2 timeout
  Knowledge base,knowledge entries,TDD reduces bugs by 40% for APIs
```

---

## Safety Guards

**Approval required** unless: `--auto` AND confidence >= 0.8 AND frequency >= 5.

**Rollback:** Every change creates backup + log. `/learn rollback <id>` or `--all`.

**Validation:** Syntax check, conflict detection, impact assessment before applying.

---

## Apply Process

1. **Fetch:** Query `v_improvement_suggestions WHERE applied = FALSE`
2. **Generate:** Determine target files, create modifications, calculate impact
3. **Review:** Present diff with confidence, frequency, evidence. User chooses: Apply / Skip / Modify
4. **Apply:** Create backup, apply modification, mark applied in Supabase, log change

---

## Rollback

```bash
/learn rollback <change_id>     # Specific change
/learn rollback --list          # List recent changes
/learn rollback --all           # All changes from today
```

---

## Configuration

```yaml
learning:
  self_improve:
    enabled: true
    auto_apply_threshold: 0.8
    min_frequency: 5
    backup_dir: backups/
    max_auto_per_day: 10
```

---
