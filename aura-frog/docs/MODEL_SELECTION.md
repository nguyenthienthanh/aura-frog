# Multi-Model Selection Guide

**Version:** 1.0.0
**Feature:** Phase-Based Model Selection
**Purpose:** Configure different AI models for different workflow phases

---

## Overview

Aura Frog supports using different AI models for different workflow phases. This allows you to:

- Use **Gemini** for deep reasoning and architecture planning (Phases 1-2)
- Use **Claude** for coding and implementation (Phases 3-5c)
- Use **GPT-4** for diverse review perspectives (Phase 6)
- Use **DeepSeek** for cost-effective coding tasks

---

## Quick Start

### Option 1: Environment Variables (Fastest)

```bash
# In your .envrc file
export AURA_PHASE_1_MODEL="gemini"
export AURA_PHASE_2_MODEL="gemini"
export GEMINI_API_KEY="your-gemini-api-key"
```

### Option 2: Project Configuration

```yaml
# In .claude/project-contexts/[project]/project-config.yaml
models:
  phase_models:
    phase_1_understand: "gemini"
    phase_2_design: "gemini"
```

### Option 3: Global Configuration

```yaml
# In ccpm-config.yaml
models:
  phase_models:
    phase_1_understand: "gemini"
    phase_2_design: "gemini"
```

---

## Configuration Hierarchy

Model selection follows this priority order (highest to lowest):

```
1. Environment Variables     (AURA_PHASE_X_MODEL)
        ↓
2. Project Configuration     (project-config.yaml)
        ↓
3. Global Configuration      (ccpm-config.yaml)
        ↓
4. Default Model            (claude)
```

---

## Available Models

### Claude (Default)
```yaml
providers:
  claude:
    type: "anthropic"
    models:
      - "claude-sonnet-4-20250514"    # Balanced performance
      - "claude-opus-4-20250514"       # Most capable
    default_model: "claude-sonnet-4-20250514"
```

**Strengths:**
- Excellent coding abilities
- Strong analysis and reasoning
- Long context window (200K tokens)
- Built-in safety guardrails

**Best for Phases:** 3, 4, 5a, 5b, 5c, 6, 7, 8, 9

**No API key needed** when running in Claude Code.

---

### Gemini
```yaml
providers:
  gemini:
    type: "google"
    models:
      - "gemini-2.0-flash-thinking-exp"  # Deep reasoning mode
      - "gemini-2.0-flash"               # Fast responses
      - "gemini-1.5-pro"                 # Balanced
    default_model: "gemini-2.0-flash-thinking-exp"
    api_key_env: "GEMINI_API_KEY"
```

**Strengths:**
- Strong reasoning capabilities
- Excellent for architecture decisions
- Vision capabilities for design analysis
- Very long context (1M+ tokens)

**Best for Phases:** 1, 2 (especially with design file analysis)

**Setup:**
```bash
# In .envrc
export GEMINI_API_KEY="your-api-key"
```

---

### OpenAI GPT-4
```yaml
providers:
  openai:
    type: "openai"
    models:
      - "gpt-4o"           # Most capable
      - "gpt-4o-mini"      # Fast and efficient
      - "o1-preview"       # Reasoning model
    default_model: "gpt-4o"
    api_key_env: "OPENAI_API_KEY"
```

**Strengths:**
- Broad knowledge base
- Good code review capabilities
- Different perspective from Claude

**Best for Phases:** 6 (code review), 7 (verification)

**Setup:**
```bash
# In .envrc
export OPENAI_API_KEY="your-api-key"
```

---

### DeepSeek
```yaml
providers:
  deepseek:
    type: "deepseek"
    models:
      - "deepseek-chat"
      - "deepseek-coder"
    default_model: "deepseek-coder"
    api_key_env: "DEEPSEEK_API_KEY"
    base_url: "https://api.deepseek.com/v1"
```

**Strengths:**
- Cost-effective
- Good coding capabilities
- Fast response times

**Best for Phases:** 5a, 5b, 5c (high-volume coding)

**Setup:**
```bash
# In .envrc
export DEEPSEEK_API_KEY="your-api-key"
```

---

## Phase Configuration Reference

### All Workflow Phases

| Phase | Name | Default Model | Recommended Alternative |
|-------|------|---------------|------------------------|
| 1 | Understand | claude | gemini (deep reasoning) |
| 2 | Design | claude | gemini (architecture) |
| 3 | UI Breakdown | claude | claude |
| 4 | Plan Tests | claude | claude |
| 5a | TDD Red | claude | deepseek (cost-effective) |
| 5b | Build | claude | deepseek (cost-effective) |
| 5c | Polish | claude | claude |
| 6 | Review | claude | openai (different perspective) |
| 7 | Verify | claude | claude |
| 8 | Document | claude | claude |
| 9 | Share | claude | claude |

### Environment Variable Names

```bash
# Phase-specific model selection
export AURA_PHASE_1_MODEL="gemini"        # phase_1_understand
export AURA_PHASE_2_MODEL="gemini"        # phase_2_design
export AURA_PHASE_3_MODEL="claude"        # phase_3_ui_breakdown
export AURA_PHASE_4_MODEL="claude"        # phase_4_plan_tests
export AURA_PHASE_5A_MODEL="claude"       # phase_5a_tdd_red
export AURA_PHASE_5B_MODEL="claude"       # phase_5b_build
export AURA_PHASE_5C_MODEL="claude"       # phase_5c_polish
export AURA_PHASE_6_MODEL="openai"        # phase_6_review
export AURA_PHASE_7_MODEL="claude"        # phase_7_verify
export AURA_PHASE_8_MODEL="claude"        # phase_8_document
export AURA_PHASE_9_MODEL="claude"        # phase_9_share

# Global default (fallback)
export AURA_DEFAULT_MODEL="claude"
```

---

## Common Configurations

### 1. Gemini for Planning, Claude for Coding

Best for complex projects requiring deep architectural reasoning.

```yaml
# project-config.yaml
models:
  phase_models:
    # Gemini for planning (deep reasoning)
    phase_1_understand: "gemini"
    phase_2_design: "gemini"

    # Claude for implementation
    phase_3_ui_breakdown: "claude"
    phase_4_plan_tests: "claude"
    phase_5a_tdd_red: "claude"
    phase_5b_build: "claude"
    phase_5c_polish: "claude"
    phase_6_review: "claude"
    phase_7_verify: "claude"
    phase_8_document: "claude"
    phase_9_share: "claude"
```

### 2. DeepSeek for Cost-Effective Coding

Best for high-volume coding with budget constraints.

```yaml
# project-config.yaml
models:
  phase_models:
    phase_1_understand: "claude"
    phase_2_design: "claude"
    phase_5a_tdd_red: "deepseek"
    phase_5b_build: "deepseek"
    phase_5c_polish: "deepseek"
```

### 3. Multi-Model Review Pipeline

Best for critical code requiring diverse perspectives.

```yaml
# project-config.yaml
models:
  phase_models:
    phase_1_understand: "gemini"    # Deep reasoning
    phase_2_design: "gemini"        # Architecture vision
    phase_5b_build: "claude"        # Implementation
    phase_6_review: "openai"        # Different perspective
```

### 4. Speed-Optimized

Best for rapid prototyping.

```yaml
# project-config.yaml
models:
  phase_models:
    phase_1_understand: "claude"
    phase_2_design: "claude"
    phase_5a_tdd_red: "deepseek"
    phase_5b_build: "deepseek"
  preferences:
    optimize_for: "speed"
```

---

## Context Handoff

When switching between models, context is automatically transferred:

### What Gets Transferred
- Current ticket/task details
- Acceptance criteria
- Technical decisions from previous phases
- File paths and code locations
- Test results (if applicable)

### Handoff Format
```markdown
## Phase Handoff: Phase X → Phase Y
**Previous Model:** gemini
**Next Model:** claude

### Completed Work
- Requirements analyzed and documented
- Architecture decision: Use Redux for state management
- Key constraints identified

### Context for Next Phase
- Files modified: src/store/*, src/components/*
- Design decisions: Component-based architecture
- Testing approach: Jest + RTL
```

---

## Behavior Settings

```yaml
# In ccpm-config.yaml
models:
  behavior:
    # Pass context between models
    context_handoff: true

    # Log model switches for debugging
    log_switches: true

    # Fall back to default if model unavailable
    fallback_on_error: true

    # Retry attempts before fallback
    max_retries: 2
```

---

## Error Handling

### Model Unavailable

```
[MODEL-ROUTER] Warning: gemini unavailable (API error)
[MODEL-ROUTER] Falling back to default: claude
```

### Missing API Key

```
[MODEL-ROUTER] Error: GEMINI_API_KEY not found
[MODEL-ROUTER] Add to .envrc: export GEMINI_API_KEY="your-key"
[MODEL-ROUTER] Falling back to default: claude
```

### Rate Limiting

```
[MODEL-ROUTER] Rate limited by gemini (429)
[MODEL-ROUTER] Retry 1/2 in 5 seconds...
[MODEL-ROUTER] Retry 2/2 in 15 seconds...
[MODEL-ROUTER] Falling back to default: claude
```

---

## Logging

When `behavior.log_switches: true`, model switches are logged:

```
[MODEL-ROUTER] Starting workflow: PROJ-123
[MODEL-ROUTER] Phase 1 → Using gemini (source: project-config)
[MODEL-ROUTER] Phase 2 → Using gemini (source: project-config)
[MODEL-ROUTER] Context handoff: gemini → claude (2,450 tokens)
[MODEL-ROUTER] Phase 3 → Using claude (source: global-config)
[MODEL-ROUTER] Phase 5b → Using deepseek (source: env-var)
```

---

## Best Practices

### 1. Start Simple
Begin with default (all Claude), then optimize specific phases as needed.

### 2. Match Model to Task
- Use reasoning-focused models (Gemini) for planning
- Use coding-focused models (Claude/DeepSeek) for implementation
- Use diverse models for critical reviews

### 3. Consider Costs
- DeepSeek is cost-effective for high-volume coding
- Claude is balanced for most tasks
- Gemini/GPT-4 for specialized reasoning

### 4. Monitor Performance
- Check logs for model switches
- Compare output quality across models
- Adjust configuration based on results

### 5. Secure API Keys
- Store API keys in `.envrc` (git-ignored)
- Never commit API keys
- Use environment variables for CI/CD

---

## Troubleshooting

### Model Not Switching

**Check:**
1. Environment variable spelling (case-sensitive)
2. YAML indentation in config files
3. API key availability

### Context Lost Between Phases

**Check:**
1. `behavior.context_handoff: true` is set
2. Token limits not exceeded
3. No errors in model switch

### API Errors

**Check:**
1. API key is valid and not expired
2. Rate limits not exceeded
3. Model name is correct

---

## Related Documentation

- `ccpm-config.yaml` - Global configuration
- `project-contexts/template/project-config.yaml` - Project template
- `skills/model-router/model-selection.md` - Model router skill
- `docs/ENV_SETUP_GUIDE.md` - Environment setup

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-29
