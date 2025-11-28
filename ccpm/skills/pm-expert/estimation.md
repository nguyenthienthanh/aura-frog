# Skill: Estimation

**Category:** PM Expert
**Version:** 5.2.0
**Used By:** pm-operations-orchestrator

---

## Overview

Accurate effort estimation using proven techniques. This is the definitive estimation reference for CCPM.

---

## 1. Estimation Techniques

### Story Points (Fibonacci)

| Points | Complexity | Typical Duration |
|--------|------------|------------------|
| 1 | Trivial | 2-4 hours |
| 2 | Simple | Half day |
| 3 | Moderate | 1-2 days |
| 5 | Complex | 2-4 days |
| 8 | Very Complex | 1 week |
| 13 | Epic-size | Needs breakdown |
| 21+ | Too large | Must split |

**Rule:** If > 8 points, break into smaller tasks.

### T-Shirt Sizing (Quick)

| Size | Points Equiv | Use Case |
|------|--------------|----------|
| XS | 1 | Config change, typo fix |
| S | 2-3 | Small feature, bug fix |
| M | 5 | Standard feature |
| L | 8 | Complex feature |
| XL | 13+ | Epic, needs breakdown |

### Three-Point Estimation (Risk-aware)

```
Estimate = (O + 4M + P) / 6

O = Optimistic (best case)
M = Most Likely (realistic)
P = Pessimistic (worst case)
```

**Example:**
- Optimistic: 4 hours
- Most Likely: 8 hours
- Pessimistic: 20 hours
- Estimate: (4 + 32 + 20) / 6 = **9.3 hours**

---

## 2. Estimation by Task Type

| Task Type | Base Estimate | Multiplier |
|-----------|---------------|------------|
| Bug fix (known cause) | 2-4h | 1x |
| Bug fix (unknown cause) | 4h + investigation | 1.5x |
| New API endpoint | 4-8h | 1x |
| UI component | 4-8h | 1x |
| Integration | 8-16h | 1.5x |
| Database migration | 4-8h | 1.5x |
| New feature (full) | Sum of parts | 1.2x buffer |

---

## 3. CCPM Phase Estimates

| Phase | Small | Medium | Large |
|-------|-------|--------|-------|
| 1. Understand | 1h | 2h | 4h |
| 2. Design | 1h | 3h | 6h |
| 3. UI Breakdown | 1h | 2h | 4h |
| 4. Plan Tests | 1h | 2h | 3h |
| 5a. Write Tests | 2h | 4h | 8h |
| 5b. Implementation | 4h | 8h | 16h |
| 5c. Refactor | 1h | 2h | 4h |
| 6. Review | 1h | 2h | 3h |
| 7. Verify | 1h | 2h | 4h |
| 8. Document | 1h | 2h | 3h |
| 9. Share | 0.5h | 0.5h | 1h |
| **Total** | **14.5h** | **29.5h** | **56h** |

---

## 4. Estimation Adjustments

### Multipliers

| Factor | Multiplier |
|--------|------------|
| New developer | 1.5x |
| Unfamiliar tech | 1.5x |
| Legacy code | 1.3x |
| Third-party integration | 1.5x |
| Unclear requirements | 1.5x |
| Multiple combined | Multiply together |

### Buffer Guidelines

| Confidence | Buffer |
|------------|--------|
| High (done before) | 10% |
| Medium (similar work) | 20% |
| Low (new territory) | 30-50% |

---

## 5. Quick Estimation Template

```markdown
## Task: [Name]

**Complexity:** [1-13 points]
**Confidence:** [High/Medium/Low]

| Phase | Estimate | Adjusted |
|-------|----------|----------|
| Understand | Xh | Xh |
| Design | Xh | Xh |
| Implement | Xh | Xh |
| Test | Xh | Xh |
| Review | Xh | Xh |
| **Subtotal** | **Xh** | - |
| Buffer (X%) | - | **Xh** |
| **Total** | - | **Xh** |
```

---

## 6. Estimation Anti-patterns

| Anti-pattern | Problem | Fix |
|--------------|---------|-----|
| Padding excessively | Distrust, delays | Use explicit buffer |
| Single point estimate | Ignores risk | Use three-point |
| Copying estimates | Different contexts | Estimate fresh |
| Not tracking actuals | No learning | Track and compare |
| Estimating alone | Bias | Team estimation |

---

## 7. Tracking & Learning

After completion, record:
```markdown
## Estimate Review: [Task]

- Estimated: 8h
- Actual: 12h
- Variance: +50%
- Reason: Third-party API docs were outdated
- Learning: Add 1.5x for external integrations
```

Use variance data to improve future estimates.

---

## Best Practices

### Do's
- Break large tasks (> 8 points)
- Use team estimation (Planning Poker)
- Track actual vs estimated
- Include explicit buffer
- Re-estimate when scope changes

### Don'ts
- Estimate in exact hours initially
- Pad secretly
- Estimate without understanding
- Ignore historical data
- Promise estimates as deadlines

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
