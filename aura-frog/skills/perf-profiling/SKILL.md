---
name: perf-profiling
description: "Systematic performance profiling and optimization. Use when performance issues are reported or suspected. Measure first, optimize second. Applies Pareto principle — find the 20% of code causing 80% of slowness, fix that, not the rest."
when_to_use: "slow, performance, profile, optimize speed, latency, memory leak, cpu usage, bottleneck, pareto, flamegraph, p95, p99, SLO"
allowed-tools: Read, Grep, Glob, Bash
effort: high
user-invocable: false
---

# Performance Profiling

**Rule 0:** Don't optimize what you haven't measured. Almost all "obvious" optimizations are wrong.

---

## The Protocol

### Step 1 — Define "fast enough"

Performance is relative. Before optimizing:

- **Current metric** (p50, p95, p99 latency / MB memory / % CPU)
- **Target metric** (what's the SLO/SLA/user expectation?)
- **Gap** — what needs to close

If no target → **ask the user**. Don't optimize without a goal — you'll polish forever.

### Step 2 — Measure baseline

Use the appropriate profiler:

| Language | Profiler |
|----------|----------|
| Node.js | `node --prof`, `clinic.js`, `0x` |
| Browser JS | Chrome DevTools Performance tab |
| Python | `cProfile`, `py-spy`, `memory_profiler` |
| Go | `pprof` (built-in) |
| Rust | `cargo flamegraph`, `perf` |
| CLI | `hyperfine` |
| HTTP | `wrk`, `k6`, `vegeta` |

Run the profiler under **realistic load**, not trivial input. Capture for 30–60s minimum — short captures miss long-tail events.

### Step 3 — Analyze (flamegraph / top consumers)

Identify the top 3 functions by:
- **Self time** (function's own CPU, excluding descendants)
- **Total time** (self + descendants)
- **Call count** (high-frequency cold functions add up)

**Pareto check:** Is there a clear 80/20?
- Top function takes 50%+ of time → that's your target
- Time spread evenly across 100 functions → hard to optimize; likely needs architectural change

### Step 4 — Form optimization hypothesis

For the bottleneck:
- What's it doing? (read the code)
- Why is it slow? (algorithm, I/O, allocations, lock contention, cache miss)
- What's a realistic improvement target?

Common bottleneck classes + fixes:

| Bottleneck | Fix |
|-----------|-----|
| O(n²) on large n | Change to O(n log n) or O(n) |
| Sync I/O in hot path | Async, batch, or remove the I/O |
| Allocations in loop | Pre-allocate, object pool, reuse |
| Redundant computation | Memoize, cache result |
| Lock contention | Lock-free structure, sharding, immutable data |
| Large object serialization | Streaming, lazy fields, columnar format |
| Database N+1 | Join, prefetch, dataloader pattern |
| Cold cache / page fault | Warm up, prefetch, locality |

### Step 5 — Implement one change, re-measure

**One change at a time.** Multiple simultaneous changes = unknown which one helped.

Measure the same workload after the change. Compute speedup. If < 10% improvement on the targeted bottleneck: wrong hypothesis — revert, try next.

### Step 6 — Verify no regression elsewhere

Optimization can break correctness OR slow other paths. Run:
- Full test suite (correctness)
- Broader benchmark (other metrics didn't degrade — memory, throughput, p99)

### Step 7 — Document

In PR or commit message:
- Baseline metric
- Change made
- New metric
- Speedup factor
- **Why** this change worked (root cause of slowness, not "just faster")

---

## Anti-Patterns

- **Micro-optimization without measurement** — replacing `map` with a `for` loop "for speed" when the bottleneck is elsewhere
- **Optimizing cold code** — code that runs rarely. Total impact = 0 even if 10× faster per call
- **Premature async** — async has overhead. Sync code often wins for CPU-bound small tasks
- **Cache everything** — caches add memory, invalidation bugs, staleness. Cache when measured benefit > cost
- **One benchmark run** — variance is huge. Run 10+ times, take p50 + std dev
- **Microbenchmarking in isolation** — function is fast in a benchmark, slow in production due to cache/JIT/load differences

---

## When Architecture Change Is Needed

If profiling shows a flat distribution (no single bottleneck), OR if the target is 10× faster: individual optimizations won't close the gap. Options:

- **Algorithm change** — different approach entirely (not a tweak)
- **Move work to a different tier** — client → server, server → precomputed, online → offline
- **Different data structure** — array → tree, hash → trie, sync → event stream
- **Different runtime** — interpreted → compiled, single-threaded → parallel, CPU → GPU

These are architectural calls. Use `self-consistency` for trade-off analysis, `tree-of-thoughts` for exploring design branches.

---

## Output Format

```markdown
## Performance Profile: [task / endpoint / function]

**Baseline:** p50=Xms, p95=Yms, p99=Zms, memory=N MB
**Target:** p95 < Wms (source: [SLO / user request])
**Gap:** Yms − Wms = Kms to close

**Bottleneck:** [function/query/operation] — X% of total time
**Root Cause:** [why it's slow]

**Optimization Applied:** [single change]
**After:** p50=X'ms, p95=Y'ms, p99=Z'ms
**Speedup:** [factor]

**Correctness:** [tests pass]
**Broader Impact:** [other metrics checked, no regressions]
```

---

## Tie-Ins

- `skills/self-consistency/SKILL.md` — for architectural decisions
- `skills/tree-of-thoughts/SKILL.md` — explore optimization branches
- `rules/core/verification.md` — measure before + after, not just after
- `commands/check.md` — `/check perf` uses this skill
- `rules/core/simplicity-over-complexity.md` — the winning optimization is usually "do less," not "do the same thing with a clever structure"
