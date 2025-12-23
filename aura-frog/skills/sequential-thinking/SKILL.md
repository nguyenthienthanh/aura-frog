---
name: sequential-thinking
description: "Structured thinking process for complex analysis. Supports revision, branching, and dynamic adjustment."
autoInvoke: false
priority: high
model: sonnet
triggers:
  - "complex problem"
  - "need to think through"
  - "analyze step by step"
  - "deep analysis"
---

# Sequential Thinking

**Version:** 1.0.0
**Use When:** Complex problems requiring structured analysis

---

## Core Pattern

```toon
thought_structure[5]{step,format,purpose}:
  1,Initial analysis,Understand the problem space
  2,Build on previous,Deepen understanding
  3,[REVISION],Correct earlier assumptions
  4,[BRANCH],Explore alternatives
  5,[FINAL],Synthesize solution
```

---

## Output Format

```
Thought 1/N: [Initial analysis of the problem]
  - Key observations
  - Initial assumptions

Thought 2/N: [Building on Thought 1]
  - Deeper analysis
  - Connections discovered

Thought 3/N [REVISION of Thought 1]: [Corrected understanding]
  - What was wrong
  - Corrected view

Thought 4/N [BRANCH A]: [Alternative approach]
  - Different angle
  - Trade-offs

Thought 5/N [FINAL]: [Solution synthesis]
  - Recommended approach
  - Key decisions
```

---

## Dynamic Adjustment

```toon
adjustment[3]{action,when,how}:
  Expand,Complexity increases,Add more thoughts (N+1)
  Contract,Simpler than expected,Skip to FINAL
  Branch,Multiple valid paths,Create BRANCH A/B/C
```

---

## When to Use

```toon
use_cases[5]{scenario,thoughts,model}:
  Architecture design,5-8,opus
  Bug root cause,3-5,sonnet
  Performance optimization,4-6,sonnet
  Security analysis,5-7,opus
  Refactoring strategy,4-6,sonnet
```

---

## Integration

```toon
phase_integration[4]{phase,use,focus}:
  Phase 1,Requirements analysis,Understand scope and constraints
  Phase 2,Technical planning,Evaluate approaches
  Phase 5b,Complex implementation,Debug tricky issues
  Phase 6,Code review,Deep analysis of changes
```

---

## Example

```
User: "The login is slow but I don't know why"

Thought 1/4: [Initial analysis]
  - Login involves: UI → API → Auth → DB
  - "Slow" is vague - need metrics
  - Possible bottlenecks: network, DB, auth provider

Thought 2/4: [Building on observations]
  - Auth provider (external) is most likely
  - DB queries should be fast (indexed)
  - Network latency is user-dependent

Thought 3/4 [REVISION of Thought 2]: [After checking logs]
  - Actually, DB query is taking 2.3s
  - Missing index on users.email
  - Auth provider is fine (50ms)

Thought 4/4 [FINAL]: [Solution]
  - Add index: CREATE INDEX idx_users_email ON users(email)
  - Expected improvement: 2.3s → 50ms
  - Verify with EXPLAIN ANALYZE
```

---

**Invoke:** Use for problems requiring structured exploration before solution.
