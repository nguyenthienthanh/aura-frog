# Command: workflow:metrics

**Purpose:** Display workflow quality and performance metrics
**Aliases:** `metrics`, `show metrics`, `quality report`

---

## Usage

```
workflow:metrics
workflow:metrics --detailed
"Show metrics"
"Quality report"
```

---

## Metrics Categories

```toon
metrics[4]{category,measures}:
  Code Quality,"Test coverage + linter errors + code grade + complexity"
  Tests,"Total/passing/failing + coverage % vs target"
  Performance,"Phase duration + velocity + token efficiency"
  Workflow,"Phases completed + approval rate + rejections"
```

---

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 WORKFLOW METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Code Quality
Grade: A │ Coverage: 92% │ Linter: 0 errors

## Tests
Total: 45 │ Passing: 45 ✅ │ Coverage: 92%/80% ✅

## Performance
Duration: 2.5h │ Velocity: 3.6 phases/hr │ Efficient

## Workflow
Progress: 7/9 phases │ Approval: 100% first-time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Quality Thresholds

```toon
thresholds[5]{metric,pass,warn,fail}:
  Coverage,≥80%,60-79%,<60%
  Linter Errors,0,1-5,>5
  Grade,A-B,C,D-F
  Approval Rate,≥80%,60-79%,<60%
  Velocity,≥3/hr,2-3/hr,<2/hr
```

---

**Version:** 2.0.0
