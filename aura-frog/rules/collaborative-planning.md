# Rule: Collaborative Planning (Multi-Team Deliberation)

**Version:** 1.0.0
**Applies to:** Phase 1 (Understand + Design) for Deep complexity tasks
**Gate:** Only when `agent-detector` classifies task as **Deep** complexity

---

## When This Activates

```toon
activation_gate[3]{condition,value,result}:
  Complexity,Deep,Activate collaborative planning
  Complexity,Standard/Quick,Skip → use single-agent Phase 1
  Teams enabled,false,Use subagents instead of teammates (same flow)
```

**Key insight:** This rule works regardless of whether Agent Teams is enabled. With teams → real parallel teammates. Without teams → sequential subagent analysis (same deliberation, just sequential).

---

## The Process: 4 Rounds

```
Round 1: Independent Analysis    (4 perspectives, parallel)
Round 2: Cross-Review + Debate   (each reviews the other three)
Round 3: Use Case Simulation     (adversarial testing of the plan)
Round 4: Convergence             (lead synthesizes final plan)
```

---

## Round 1: Independent Analysis

Spawn 4 agents with the **same task** but **different perspectives**:

```toon
perspectives[4]{agent,perspective,focus}:
  architect,"Builder" — How to implement,Architecture / tech choices / data model / API design / performance
  tester,"Breaker" — How it can fail,Edge cases / test strategy / error scenarios / security gaps / load
  frontend OR domain-expert,"User" — How it's experienced,UX flow / user stories / accessibility / business logic gaps
  strategist,"Why" — Should we build this,Business case / ROI / MVP scope / opportunity cost / phasing
```

**Each agent independently produces:**

```toon
analysis_output[5]{section,content}:
  Requirements,Interpreted requirements + assumptions made
  Proposed Approach,Architecture / implementation strategy
  Risks & Concerns,What could go wrong + blind spots identified
  Estimated Effort,Story points + breakdown by component
  Open Questions,Things that need clarification before building
```

**Prompt template for each agent:**

```
You are [AGENT] analyzing this task from the [PERSPECTIVE] perspective.

Task: [TASK_DESCRIPTION]
Project context: [PROJECT_CONFIG + CONVENTIONS]

Produce an independent analysis with these sections:
1. Requirements (as you understand them — note any assumptions)
2. Proposed Approach (your recommended architecture/strategy)
3. Risks & Concerns (what could go wrong, blind spots, edge cases)
4. Estimated Effort (story points + component breakdown)
5. Open Questions (what needs clarification)

Be opinionated. Disagree with obvious approaches if you see a better way.
Flag anything that smells like over-engineering or under-engineering.
```

---

## Round 2: Cross-Review + Debate

Each agent reviews the **other two** analyses and produces:

```toon
review_output[4]{section,content}:
  Agreements,What I agree with in their analysis
  Disagreements,"What I disagree with + why + my alternative"
  Gaps Found,Things they missed that I caught
  Revised Position,"Updated view after seeing their analysis (if changed)"
```

**Prompt template:**

```
You are [AGENT]. You produced Analysis A. Now review Analysis B and Analysis C.

Your analysis:
[ANALYSIS_A]

Analysis from [AGENT_B]:
[ANALYSIS_B]

Analysis from [AGENT_C]:
[ANALYSIS_C]

Produce a cross-review:
1. Agreements — what they got right
2. Disagreements — where you disagree + why + your alternative
3. Gaps Found — things they missed
4. Revised Position — has your own view changed after seeing theirs?

Be constructive but honest. The goal is the best plan, not consensus for its own sake.
```

---

## Round 3: Use Case Simulation

The PM orchestrator collects all analyses and reviews, then runs **adversarial use case testing**:

```toon
simulation_scenarios[5]{type,what_to_test}:
  Happy Path,Does the proposed approach handle the main user flow end-to-end?
  Edge Cases,What happens with empty data / max limits / concurrent users / network failure?
  Security,Can the approach be exploited? Auth bypass / injection / data leak?
  Scale,Does it work with 10x / 100x the expected load?
  Integration,How does it interact with existing systems? Breaking changes?
```

**For each scenario, evaluate:**
- Does the proposed architecture handle this?
- Which agent's approach handles it best?
- What modifications are needed?

**Output format:**

```toon
simulation_results[N]{scenario,status,notes}:
  "User signs up with email",PASS,All 3 approaches handle this
  "User signs up with duplicate email",PARTIAL,"architect handles it / qa flagged it / ui-expert missed it"
  "10K concurrent signups",FAIL,"None addressed connection pooling — add to requirements"
```

---

## Round 4: Convergence

The PM orchestrator synthesizes the **final plan** by:

1. **Merging the best ideas** from each perspective
2. **Resolving disagreements** (pick the approach with strongest justification)
3. **Incorporating simulation findings** (add requirements the simulation revealed)
4. **Documenting dissent** (if an agent still disagrees, note it as a risk)

**Final deliverable structure:**

```toon
final_plan[8]{section,source}:
  Requirements (Final),Merged from all 3 analyses + simulation findings
  Architecture Decision,Best approach from debate (with justification)
  Dissenting Views,"Logged disagreements that weren't resolved"
  Risk Register,Combined from all 3 + simulation failures
  Test Strategy Outline,From tester's analysis
  UX Considerations,From frontend's analysis
  Business Case,From strategist's analysis (MVP scope + ROI + phasing)
  Effort Estimate,Averaged from 4 estimates with variance noted
  Open Questions (Final),Unresolved items requiring user input
```

---

## Implementation with Agent Teams

When `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`:

```
# Round 1: Spawn 4 teammates in parallel
Agent(name="architect", prompt="[Builder perspective prompt]")
Agent(name="tester", prompt="[Breaker perspective prompt]")
Agent(name="frontend", prompt="[User perspective prompt]")
Agent(name="strategist", prompt="[Why perspective prompt]")

# Round 2: Send cross-review tasks via SendMessage
SendMessage(to="architect", "Review these three analyses: [tester + frontend + strategist]")
SendMessage(to="tester", "Review these three analyses: [architect + frontend + strategist]")
SendMessage(to="frontend", "Review these three analyses: [architect + tester + strategist]")
SendMessage(to="strategist", "Review these three analyses: [architect + tester + frontend]")

# Round 3-4: lead runs simulation + convergence
# (Single agent — lead synthesizes everything)
```

## Implementation without Agent Teams

Sequential subagent analysis (same quality, ~2x slower):

```
# Round 1: 4 sequential subagents
Agent(prompt="[Builder perspective]") → save result
Agent(prompt="[Breaker perspective]") → save result
Agent(prompt="[User perspective]") → save result
Agent(prompt="[Why perspective]") → save result

# Round 2: 4 sequential cross-reviews
Agent(prompt="[Builder reviews Breaker + User + Why]") → save result
Agent(prompt="[Breaker reviews Builder + User + Why]") → save result
Agent(prompt="[User reviews Builder + Breaker + Why]") → save result
Agent(prompt="[Why reviews Builder + Breaker + User]") → save result

# Round 3-4: lead (inline, no subagent needed)
```

---

## Token Budget

```toon
token_budget[4]{round,budget,notes}:
  Round 1 (4 analyses),4000 total (1000 each),TOON format — no prose
  Round 2 (4 reviews),2000 total (500 each),Focus on disagreements only
  Round 3 (simulation),1000,Table format for results
  Round 4 (convergence),1500,Final plan in TOON
```

**Total: ~8500 tokens** for collaborative Phase 1 (vs ~2000 for single-agent Phase 1).

**Justified because:** Deep tasks benefit from multiple perspectives. The 4x token cost prevents expensive mistakes caught in later phases (where fixing costs 10-50x more). The strategist alone often saves 50%+ of wasted effort by scoping down to MVP.

---

## When NOT to Use

- **Quick tasks** — always single agent
- **Standard tasks** — always single agent
- **Deep but single-domain** — single agent with deeper analysis is sufficient
- **User says "just do it"** — skip deliberation, go single agent

---

## Example Output (Condensed)

```
━━━ COLLABORATIVE PLANNING: 4 perspectives ━━━

📐 ARCHITECT (Builder):
  Approach: Microservice with dedicated auth DB
  Effort: 8 SP
  Risk: Over-engineered for current scale

🔍 TESTER (Breaker):
  Approach: Agrees with JWT, but flags refresh token rotation missing
  Effort: 5 SP (simpler than architect's proposal)
  Risk: No rate limiting in any proposal

👤 FRONTEND (User):
  Approach: Social login needed (Google/Apple), not just email
  Effort: 8 SP (adding social login)
  Risk: Password reset flow not mentioned in requirements

💼 STRATEGIST (Why):
  Business Case: Moderate — auth is table stakes, not a differentiator
  MVP: Email+password only. Social login Phase 2 IF signup conversion < 60%
  Effort: 3 SP (MVP) vs 8 SP (full) — ship faster, validate first
  Risk: Building social login before proving demand

━━━ CROSS-REVIEW HIGHLIGHTS ━━━

  architect vs tester: "Microservice is overkill" → architect concedes, adopts monolith
  tester vs frontend: "Social login adds attack surface" → add OAuth security review
  strategist vs all: "Start with email-only MVP" → architect agrees, frontend pushes back
  frontend vs strategist: "Competitors have social login" → compromise: Phase 2

━━━ SIMULATION RESULTS ━━━

  Happy path signup:           PASS (all 4)
  Duplicate email:             PASS (architect + tester caught it)
  Brute force login:           FAIL → Added rate limiting requirement
  Token expiry mid-session:    PARTIAL → Added silent refresh spec
  Social login callback fail:  N/A → Deferred to Phase 2 (strategist's recommendation)
  Low signup conversion:       FLAGGED → Strategist added conversion tracking requirement

━━━ FINAL PLAN (Converged) ━━━

  Architecture: Monolith (not microservice) — tester's simpler approach wins
  Auth method: JWT email+password (MVP) — strategist's phasing wins
  Phase 2: Social login IF conversion < 60% — compromise with frontend
  Added: Rate limiting, refresh token rotation, conversion tracking
  Dissent: Frontend wants social login now (logged, revisit after data)
  Effort: 5 SP MVP (was 8 SP before strategist challenged scope)
  Open: Confirm social login providers with product team
```

---

**Version:** 1.0.0
