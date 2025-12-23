---
name: problem-solving
description: "5 techniques for different problem types. Use when stuck or facing complex challenges."
autoInvoke: false
priority: high
model: sonnet
triggers:
  - "stuck"
  - "can't figure out"
  - "need breakthrough"
  - "multiple approaches"
---

# Problem Solving Techniques

**Version:** 1.0.0
**Use When:** Stuck, need breakthrough, or evaluating approaches

---

## 5 Techniques

```toon
techniques[5]{name,when,approach}:
  Simplification Cascades,Complexity spiraling / 5+ attempts failed,Strip to minimal → rebuild
  Collision-Zone Thinking,Innovation blocks / need breakthrough,Combine unrelated concepts
  Meta-Pattern Recognition,Same issue across domains,Find underlying pattern
  Inversion Exercise,Forced into "only way" thinking,Ask "what if opposite?"
  Scale Game,Production readiness unclear,Test at 10x / 100x / 1000x
```

---

## 1. Simplification Cascades

**When:** Complexity spiraling, 5+ implementations tried

**Process:**
```
1. Remove ALL features except core
2. Make it work with hardcoded values
3. Add ONE thing back
4. Repeat until issue appears
5. Fix at that layer
```

**Example:**
```
Problem: Auth + caching + retry + logging all broken

Simplify:
1. Remove retry, logging, caching → just auth
2. Auth works? Yes → add caching
3. Caching breaks it → found the issue
4. Fix caching layer
5. Re-add retry, logging
```

---

## 2. Collision-Zone Thinking

**When:** Need creative breakthrough, conventional approaches failed

**Process:**
```
1. List unrelated domains
2. Find principles from each
3. Combine into novel solution
```

**Example:**
```
Problem: Users abandoning checkout

Domains: Gaming + Psychology + Logistics

Collision:
- Gaming: Progress bars, achievements
- Psychology: Loss aversion
- Logistics: Just-in-time delivery

Solution: "Your items are reserved for 10 min" +
          progress indicator +
          "3 people viewing this item"
```

---

## 3. Meta-Pattern Recognition

**When:** Same issue keeps appearing in different forms

**Process:**
```
1. List all similar issues
2. Find what they share
3. Fix the meta-pattern
```

**Example:**
```
Issues:
- Users table query slow
- Orders table query slow
- Products table query slow

Meta-pattern: All queries filter by date without index

Fix: Add date indexes to all tables
```

---

## 4. Inversion Exercise

**When:** Stuck in "only way" thinking

**Process:**
```
1. State current assumption
2. Ask: "What if the opposite?"
3. Explore inverted approach
```

**Example:**
```
Assumption: "We need to cache API responses"

Inversion: "What if we never cache?"
→ Forces real-time design
→ Discovers: Most data doesn't change
→ Solution: Cache-first with invalidation
   (opposite of assumed API-first)
```

---

## 5. Scale Game

**When:** Production readiness unclear

**Process:**
```
1. Test at 10x current load
2. Test at 100x
3. Test at 1000x
4. Find breaking point
5. Design for 10x actual need
```

**Example:**
```
Current: 100 users/day

Scale test:
- 1,000: Works fine
- 10,000: DB connection pool exhausted
- 100,000: Memory OOM

Breaking point: 10,000 users
Design for: 1,000 (10x buffer)
Fix: Connection pooling + memory optimization
```

---

## Decision Matrix

```toon
decision[5]{symptom,technique,model}:
  "Tried everything",Simplification Cascades,sonnet
  "Need creative idea",Collision-Zone Thinking,opus
  "Keeps happening",Meta-Pattern Recognition,sonnet
  "No other way",Inversion Exercise,sonnet
  "Will it scale?",Scale Game,sonnet
```

---

## Quick Reference

```
Stuck → Simplify first
Creative block → Collision zones
Recurring issues → Meta-patterns
Tunnel vision → Invert assumptions
Scaling fears → Scale game
```

---

**Invoke:** Use when conventional debugging fails or need breakthrough.
