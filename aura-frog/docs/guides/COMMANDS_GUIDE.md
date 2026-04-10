# Aura Frog Commands Guide

**Version:** 3.1.0 | **Total Commands:** 87 | **Categories:** 22

This guide covers every Aura Frog command — what it does, when to use it, and how to call it.

---

## Quick Reference

### Bundled Commands (Start Here)

These 5 commands give you interactive menus — no memorization needed:

| Command | What it does | Example |
|---------|-------------|---------|
| `/workflow` | Feature development lifecycle | `workflow:start "Add auth"` |
| `/test` | Test generation & coverage | `test:unit src/auth/` |
| `/quality` | Linting, complexity, debt | `quality:check` |
| `/bugfix` | Bug fixing (quick/full/hotfix) | `bugfix:quick "Login fails"` |
| `/project` | Project setup & management | `project:init` |

Type any bundled command without a subcommand to see its interactive menu.

---

## Commands by Category

### Workflow (17 commands)

The core of Aura Frog. Every feature follows a 5-phase TDD workflow with 2 approval gates.

#### Starting & Controlling

| Command | Purpose | Usage |
|---------|---------|-------|
| `workflow:start` | Start a new workflow | `workflow:start "JIRA-123 Add user auth"` |
| `workflow:approve` | Approve current phase | `workflow:approve` |
| `workflow:reject` | Reject with feedback | `workflow:reject "Missing edge cases"` |
| `workflow:modify` | Request changes without rejecting | `workflow:modify "Add rate limiting"` |
| `workflow:status` | Show current phase & progress | `workflow:status` |
| `workflow:progress` | Visual progress bar | `workflow:progress` |

#### Phase Navigation

| Command | Phase | What happens |
|---------|-------|-------------|
| `workflow:phase-1` | Understand + Design | Requirements analysis, trade-offs, approval gate |
| `workflow:phase-2` | Test RED | Write failing tests first |
| `workflow:phase-2-test` | Test scaffolding | Detailed test structure setup |
| `workflow:phase-3-green` | Build GREEN | Implement code to pass tests, approval gate |
| `workflow:phase-4-refactor` | Refactor + Review | Optimize, security check, quality review |

#### Session Management

| Command | Purpose | When to use |
|---------|---------|-------------|
| `workflow:handoff` | Save state for later | Before ending a long session |
| `workflow:resume` | Resume saved workflow | `workflow:resume AUTH-123` |
| `workflow:metrics` | Quality metrics | After workflow completes |
| `workflow:budget` | Token usage vs prediction | During long workflows |
| `workflow:predict` | Predict token cost | Before starting complex tasks |

**Typical flow:**
```
workflow:start "Add JWT auth"     # Phase 1 starts
workflow:approve                  # → Phase 2 (tests) → Phase 3 auto
workflow:approve                  # → Phase 4 → Phase 5 auto → Done
```

---

### Bug Fixing (4 commands)

Three modes based on severity:

| Command | When to use | Process |
|---------|-------------|---------|
| `bugfix:quick` | Simple bugs with clear cause | Understand → Test → Fix → Verify |
| `bugfix:fix` | Complex bugs needing investigation | Full 5-phase workflow |
| `bugfix:hotfix` | Production emergencies | Minimal docs, speed-first |

```bash
# Quick fix (most common)
bugfix:quick "Login button returns 401"

# Full investigation
bugfix:fix "Intermittent data loss on save"

# Production emergency
bugfix:hotfix "Payment processing down"
```

---

### Testing (5 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `test:unit` | Generate unit tests | `test:unit src/services/auth.ts` |
| `test:e2e` | Generate E2E tests | `test:e2e "user login flow"` |
| `test:coverage` | Check coverage & gaps | `test:coverage --target 80` |
| `test:document` | Generate test documentation | `test:document JIRA-123` |

Auto-detects your test runner (Jest, Vitest, Pytest, PHPUnit, Go test, Cypress, Playwright, Detox).

```bash
# Generate unit tests for a file
test:unit src/components/LoginForm.tsx

# Check what's missing
test:coverage

# E2E test for a user flow
test:e2e "checkout process"
```

---

### Project Management (10 commands)

#### Setup (run once)

| Command | Purpose | Usage |
|---------|---------|-------|
| `project:init` | Initialize Aura Frog for your project | `project:init` |
| `project:detect` | Auto-detect tech stack | `project:detect` |
| `project:sync-settings` | Merge plugin settings | `project:sync-settings` |

#### Day-to-Day

| Command | Purpose | Usage |
|---------|---------|-------|
| `project:status` | Show project info from cache | `project:status` |
| `project:refresh` | Re-scan project detection | `project:refresh` |
| `project:regen` | Regenerate context files | `project:regen` |
| `project:reload-env` | Reload .envrc variables | `project:reload-env` |
| `project:switch` | Switch between projects | `project:switch my-api` |
| `project:list` | List all configured projects | `project:list` |

```bash
# First time setup
project:init                    # Creates 7 context files
project:sync-settings           # Applies plugin settings

# When you update your stack
project:refresh                 # Re-detect framework/tools
```

---

### Quality Assurance (3 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `quality:check` | Run linters, formatters, type checks | `quality:check` |
| `quality:complexity` | Cyclomatic + cognitive complexity analysis | `quality:complexity src/` |
| `quality:debt` | Find TODOs, FIXMEs, deprecated code | `quality:debt` |

```bash
# Full quality check
quality:check

# Find complex code
quality:complexity src/services/

# Track tech debt
quality:debt
```

---

### Security (3 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `security:audit` | Full OWASP audit | `security:audit` |
| `security:scan` | Static analysis (injection, secrets, XSS) | `security:scan src/` |
| `security:deps` | Dependency vulnerability scan | `security:deps` |

```bash
# Comprehensive audit
security:audit

# Quick scan for secrets/injection
security:scan

# Check npm/pip/composer vulnerabilities
security:deps
```

---

### Performance (4 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `perf:analyze` | Identify bottlenecks | `perf:analyze src/api/` |
| `perf:bundle` | Bundle size analysis | `perf:bundle` |
| `perf:lighthouse` | Lighthouse audit | `perf:lighthouse https://myapp.com` |
| `perf:optimize` | Apply optimizations | `perf:optimize --target images,bundle` |

```bash
# Find slow spots
perf:analyze

# Check bundle bloat
perf:bundle

# Full web audit
perf:lighthouse https://staging.myapp.com
```

---

### API Design (2 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `api:design` | Design endpoints + generate OpenAPI spec | `api:design "User management API"` |
| `api:test` | Generate API test suite | `api:test src/routes/users.ts` |

```bash
# Design a new API
api:design "Product catalog with search, filters, pagination"

# Generate tests for existing endpoints
api:test src/api/
```

---

### Database (2 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `db:design` | Schema design + ERD + migrations | `db:design "E-commerce schema"` |
| `db:optimize` | Query optimization + N+1 detection | `db:optimize` |

```bash
# Design from scratch
db:design "User, Product, Order with relationships"

# Optimize existing queries
db:optimize
```

---

### Deployment (3 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `deploy:setup` | Configure deployment target | `deploy:setup vercel` |
| `deploy:docker-create` | Generate Dockerfile + compose | `deploy:docker-create` |
| `deploy:cicd-create` | Generate CI/CD pipeline | `deploy:cicd-create github-actions` |

```bash
# Setup for Vercel
deploy:setup vercel

# Dockerize your app
deploy:docker-create

# CI/CD for GitHub Actions
deploy:cicd-create github-actions
```

---

### Learning System (5 commands)

Aura Frog learns from your corrections and patterns across sessions.

| Command | Purpose | Usage |
|---------|---------|-------|
| `learn:status` | Show what's been learned | `learn:status` |
| `learn:feedback` | Submit manual feedback | `learn:feedback "Always use arrow functions"` |
| `learn:analyze` | Analyze patterns + generate insights | `learn:analyze --period 30d` |
| `learn:apply` | Apply improvements to plugin | `learn:apply --auto` |
| `learn:setup` | Initialize Supabase schema | `learn:setup` |

```bash
# Check learning status
learn:status

# See what patterns were detected
learn:analyze

# Apply high-confidence improvements
learn:apply --auto
```

---

### Metrics & Monitoring (6 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `metrics:dashboard` | Token usage + workflow metrics | `metrics:dashboard` |
| `metrics:hooks` | Profile hook execution times | `metrics:hooks` |
| `metrics:performance` | Context overhead measurement | `metrics:performance` |
| `prompts:evaluate` | Evaluate your Claude Code usage | `prompts:evaluate --days 30` |
| `monitor:setup` | Setup error monitoring | `monitor:setup sentry` |
| `monitor:errors` | Query error tracking | `monitor:errors --level error --last 24h` |

```bash
# See your usage patterns
prompts:evaluate

# Check token consumption
metrics:dashboard

# Profile hook performance
metrics:hooks
```

---

### Logs (2 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `logs:analyze` | Analyze app logs for patterns | `logs:analyze --level error --last 24h` |
| `logs:cleanup` | Clean old logs and workflow data | `logs:cleanup --days 30` |

---

### Design (2 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `design:stitch` | Generate prompts for Google Stitch AI | `design:stitch "Dashboard with analytics"` |
| `design:stitch-review` | Process exported Stitch designs | `design:stitch-review` |

---

### Agent Management (4 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `agent:list` | List all 10 agents | `agent:list` |
| `agent:info` | Agent details + capabilities | `agent:info architect` |
| `agent:activate` | Manually activate an agent | `agent:activate security` |
| `agent:deactivate` | Deactivate current agent | `agent:deactivate` |

Agents auto-activate based on your task — manual control is rarely needed.

---

### Planning (3 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `planning` | Create a plan without starting workflow | `planning "Migrate to microservices"` |
| `planning:list` | List saved plans | `planning:list` |
| `planning:refine` | Update existing plan | `planning:refine --plan auth-migration` |
| `plan:set` | Set active plan for session | `plan:set plans/241223-auth` |

Use `planning` when you want to think through a task before committing to a workflow.

---

### Setup & Configuration (3 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `setup:activate` | Quick-activate Aura Frog for project | `setup:activate` |
| `setup:integrations` | Configure JIRA/Slack/Figma | `setup:integrations` |
| `setup:cli` | Install `af` CLI globally | `setup:cli` |

---

### MCP & Plugin (2 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `mcp:status` | Show MCP server status | `mcp:status` |
| `plugin:update` | Check for plugin updates | `plugin:update` |

---

### Standalone Commands (4 commands)

| Command | Purpose | Usage |
|---------|---------|-------|
| `document` | Generate feature/API documentation | `document "Authentication module"` |
| `execute` | Execute a saved plan (skip Phase 1) | `execute plans/241223-auth` |
| `refactor` | Structured code refactoring | `refactor src/services/legacy.ts` |
| `help` | Show help and command reference | `help workflow` |

---

## Common Workflows

### New Feature
```
workflow:start "Add user profiles"   → Full 5-phase TDD
```

### Quick Bug Fix
```
bugfix:quick "Cart total wrong"      → Understand → Test → Fix → Verify
```

### Add Tests to Existing Code
```
test:unit src/services/              → Auto-detect runner, generate tests
test:coverage                        → Check gaps
```

### Security Review Before Release
```
security:audit                       → Full OWASP + deps + SAST
security:deps                        → Vulnerability scan
```

### Evaluate Your Usage
```
prompts:evaluate --days 30           → Usage report + suggestions
learn:analyze                        → Pattern insights
```

### Project Setup (First Time)
```
project:init                         → Detect stack, create context files
project:sync-settings                → Apply plugin settings
```

### Resume After Break
```
workflow:resume AUTH-123              → Pick up where you left off
```

---

## Tips

1. **Start with bundled commands** — `/workflow`, `/test`, `/quality`, `/bugfix`, `/project` cover 80% of usage
2. **Let agents auto-detect** — You rarely need `agent:activate` manually
3. **Use `bugfix:quick` for most bugs** — Full workflow is overkill for simple fixes
4. **Run `prompts:evaluate` monthly** — See what features you're missing
5. **`workflow:handoff` before long breaks** — Saves everything for next session
6. **`quality:check` before commits** — Catches issues before review
7. **Plans without workflows** — Use `planning` to think through complex tasks without committing
