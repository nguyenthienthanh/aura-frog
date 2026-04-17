Hey @nguyenthienthanh 👋

I ran your skills through `tessl skill review` at work and found some targeted improvements. Here's the full before/after:

![score_card](score_card.png)

| Skill | Before | After | Change |
|-------|--------|-------|--------|
| performance-optimizer | 55% | 85% | +30% |
| code-reviewer | 71% | 98% | +27% |
| api-designer | 58% | 85% | +27% |
| typescript-expert | 68% | 92% | +24% |
| react-expert | 62% | 81% | +19% |

<details>
<summary>Changes made</summary>

**Description improvements (biggest impact):**
- **code-reviewer**: Enumerated the 6 review aspects (security, architecture, error handling, test gaps, type safety, simplification) directly in the description; added explicit "Use when..." clause with trigger terms like "review code", "check a PR", "audit changes before merge"
- **api-designer**: Expanded from a generic tagline to concrete capabilities (endpoint naming, versioning strategies, pagination types, error response schemas, OpenAPI conventions); added "Use when..." clause with terms like "REST API design", "Swagger", "OpenAPI specs"
- **performance-optimizer**: Specified three distinct layers (frontend/Core Web Vitals, backend/N+1 queries, database/EXPLAIN ANALYZE) instead of generic "profiling and measurement"; added "Use when..." clause with natural terms like "slow code", "latency issues", "memory leaks"
- **typescript-expert**: Listed specific gotchas (|| vs ??, noUncheckedIndexedAccess, discriminated unions, as const vs enum) instead of high-level topics; added "Use when..." clause with terms like "configuring tsconfig", "debugging null/undefined errors"
- **react-expert**: Called out concrete pitfalls (stale closure bugs, falsy 0/empty string rendering) and specific library choices (useState vs Context vs Zustand vs TanStack Query); added "Use when..." clause covering "debugging re-renders", "useEffect infinite loops"

**Content improvements:**
- **api-designer**: Added a 7-step design workflow (define resources → choose versioning → define endpoints → specify schemas → add pagination → document with OpenAPI → add rate limiting)
- **performance-optimizer**: Replaced flat checklist with explicit 6-step optimization workflow (profile → identify bottleneck → set target → apply fix → re-measure → verify)

</details>

Honest disclosure — I work at @tesslio where we build tooling around skills like these. Not a pitch - just saw room for improvement and wanted to contribute.

Want to self-improve your skills? Just point your agent (Claude Code, Codex, etc.) at [this Tessl guide](https://docs.tessl.io/evaluate/optimize-a-skill-using-best-practices) and ask it to optimize your skill. Ping me - [@yogesh-tessl](https://github.com/yogesh-tessl) - if you hit any snags.

Thanks in advance 🙏
