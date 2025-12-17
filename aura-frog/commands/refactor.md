# Command: refactor

**Purpose:** Refactor code with structured workflow (analyze → plan → test → refactor → verify)
**Category:** Code Improvement

---

## Usage

```
refactor <file>
refactor <description>
refactor:component <component-file>
refactor:performance <file>
refactor:analyze <file>    # Analysis only
refactor:plan <file>       # Plan only
```

---

## Workflow

```toon
phases[5]{phase,action,output}:
  1. Analyze,"Measure quality + identify smells","analysis.md"
  2. Plan,"Design refactoring approach","plan.md"
  3. Test,"Add tests for current behavior","tests"
  4. Refactor,"Apply changes incrementally","refactored code"
  5. Verify,"Run tests + measure improvement","report.md"
```

---

## Analysis Phase

**Metrics collected:**
- Lines of code, cyclomatic complexity
- Code smells (long methods, deep nesting)
- Dependency count
- Test coverage

**Output:** `.claude/logs/refactors/{target}-analysis.md`

---

## Plan Phase

**Considerations:**
- Impact on existing tests
- Breaking changes
- Incremental vs. big-bang
- Risk assessment

**Output:** `.claude/logs/refactors/{target}-plan.md`

---

## Refactoring Types

```toon
types[6]{type,when,example}:
  Extract,"Long function/component","Extract helper functions"
  Rename,"Unclear naming","Rename for clarity"
  Move,"Wrong location","Move to appropriate module"
  Simplify,"Over-complex logic","Reduce nesting, early returns"
  Compose,"Repeated patterns","Create reusable abstraction"
  Performance,"Slow code","Optimize algorithms, memoize"
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `refactor <file>` | Full refactoring workflow |
| `refactor:analyze` | Analysis document only |
| `refactor:plan` | Implementation plan only |
| `refactor:component` | React/Vue component refactor |
| `refactor:performance` | Performance-focused refactor |

---

## Safety Rules

- ✅ Always add tests before refactoring
- ✅ Make small, incremental changes
- ✅ Run tests after each change
- ❌ Never refactor without tests
- ❌ Never combine refactoring with new features

---

**Template:** `templates/refactor-analysis.md`
**Version:** 2.0.0
