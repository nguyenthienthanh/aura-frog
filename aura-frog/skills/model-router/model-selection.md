# Model Selection Skill

## Purpose

Dynamically select and route to the appropriate AI model based on workflow phase, project configuration, and task requirements.

## Auto-Invoke Conditions

This skill activates when:
- Starting a new workflow phase (phase_1 through phase_9)
- Explicit model selection is requested
- Context handoff between models is needed

## Model Selection Algorithm

### Priority Order (Highest to Lowest)

1. **Environment Variable Override**
   ```bash
   # Phase-specific override
   export AURA_PHASE_1_MODEL="gemini"
   export AURA_PHASE_2_MODEL="gemini"
   export AURA_PHASE_5B_MODEL="claude"

   # Global override (all phases)
   export AURA_DEFAULT_MODEL="claude"
   ```

2. **Project Configuration** (`project-contexts/[project]/project-config.yaml`)
   ```yaml
   models:
     phase_models:
       phase_1_understand: "gemini"
       phase_2_design: "gemini"
   ```

3. **Global Configuration** (`ccpm-config.yaml`)
   ```yaml
   models:
     phase_models:
       phase_1_understand: "claude"
   ```

4. **Default Model**: `claude`

## Phase-to-Model Mapping

### Recommended Configurations

#### Option 1: Gemini for Planning, Claude for Coding
Best for: Complex projects requiring deep architectural reasoning

```yaml
models:
  phase_models:
    # Planning & Design (Gemini - strong reasoning)
    phase_1_understand: "gemini"
    phase_2_design: "gemini"

    # Implementation (Claude - excellent coding)
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

#### Option 2: DeepSeek for Cost-Effective Coding
Best for: High-volume coding tasks with budget constraints

```yaml
models:
  phase_models:
    phase_1_understand: "claude"
    phase_2_design: "claude"
    phase_5a_tdd_red: "deepseek"
    phase_5b_build: "deepseek"
    phase_5c_polish: "deepseek"
```

#### Option 3: Multi-Model Review Pipeline
Best for: Critical code requiring diverse perspectives

```yaml
models:
  phase_models:
    phase_1_understand: "gemini"    # Deep reasoning
    phase_2_design: "gemini"        # Architecture vision
    phase_5b_build: "claude"        # Implementation
    phase_6_review: "openai"        # Different perspective
```

## Model Capabilities Reference

| Model | Strengths | Best For Phases |
|-------|-----------|-----------------|
| **Claude** | Coding, analysis, long context, safety | 3, 4, 5a-c, 6, 7, 8 |
| **Gemini** | Reasoning, vision, long context | 1, 2 (with design files) |
| **GPT-4o** | Code review, broad knowledge | 6, 7 |
| **DeepSeek** | Cost-effective coding | 5a, 5b, 5c |

## Context Handoff Protocol

When switching models between phases:

### 1. Prepare Context Summary
```markdown
## Phase Handoff: Phase X → Phase Y
**Previous Model:** [model_name]
**Next Model:** [model_name]

### Completed Work
- [Summary of completed phase]
- [Key decisions made]
- [Artifacts produced]

### Context for Next Phase
- [Relevant files modified]
- [Outstanding considerations]
- [Constraints to maintain]
```

### 2. Transfer Essential Context
- Current ticket/task details
- Acceptance criteria
- Technical decisions from previous phases
- File paths and code locations
- Test results (if applicable)

### 3. Verify Continuity
The receiving model should:
- Acknowledge understanding of previous work
- Confirm access to referenced files
- Identify any clarifications needed

## Usage Examples

### Check Current Model for Phase
```bash
# In workflow, the orchestrator checks:
# 1. Environment: AURA_PHASE_1_MODEL
# 2. Project config: models.phase_models.phase_1_understand
# 3. Global config: models.phase_models.phase_1_understand
# 4. Default: models.default
```

### Override for Single Task
```bash
# Temporarily use Gemini for phase 1
export AURA_PHASE_1_MODEL="gemini"
workflow:start "PROJ-123"
```

### Project-Level Configuration
```yaml
# In project-contexts/my-project/project-config.yaml
models:
  phase_models:
    phase_1_understand: "gemini"
    phase_2_design: "gemini"
  preferences:
    optimize_for: "quality"  # or "speed", "cost"
```

## Error Handling

### Model Unavailable
If configured model is unavailable:
1. Log warning with reason
2. Check `behavior.fallback_on_error` setting
3. If true, fall back to default model
4. If false, halt and notify user

### API Key Missing
If required API key not found:
1. Check environment variable specified in provider config
2. Log clear error message with required env var name
3. Suggest adding to `.envrc` file
4. Fall back to default model if fallback enabled

### Rate Limiting
If rate limited:
1. Implement exponential backoff
2. Retry up to `behavior.max_retries` times
3. Switch to fallback model if retries exhausted

## Integration Points

### Workflow Orchestrator
The `pm-operations-orchestrator` agent calls this skill:
- At the start of each phase
- When explicit model switch is requested
- For context handoff between phases

### Configuration Loader
The `project-config-loader` agent provides:
- Merged configuration from all sources
- Environment variable overrides
- Project-specific settings

## Logging

Model switches are logged when `behavior.log_switches: true`:

```
[MODEL-ROUTER] Phase 1 → Using gemini (source: project-config)
[MODEL-ROUTER] Phase 2 → Using gemini (source: project-config)
[MODEL-ROUTER] Phase 5b → Using claude (source: global-config)
[MODEL-ROUTER] Context handoff: gemini → claude (2,450 tokens)
```

## Related Documentation

- `docs/MODEL_SELECTION.md` - Complete model selection guide
- `ccpm-config.yaml` - Global model configuration
- `project-contexts/template/project-config.yaml` - Project override template
- `docs/ENV_SETUP_GUIDE.md` - API key configuration
