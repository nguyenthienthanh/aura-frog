# Aura Frog Documentation

Central index for all human-readable documentation. AI-consumed docs live in `aura-frog/`.

> **New in v3.7.0:** [The 8 Pillars](../README.md#-the-8-pillars-of-the-planning-first-llm-os) — Hierarchical Planning · Reasoning Trace Audit · Semantic Session Reset · Pre-flight Validation · Semantic Conflict Detection · Self-Healing Orchestrator · MCP Security Layer · Phase-Role Binding. Full marketing breakdown with examples + diagrams in the project README; engineering depth in [BENEFITS.md Part 9](reference/BENEFITS.md#part-9--the-8-pillars-of-the-planning-first-llm-os-v370).

---

## Getting Started

- [Quick Start](getting-started/QUICKSTART.md) — 60-second install and first command
- [Get Started Guide](getting-started/GET_STARTED.md) — Full setup walkthrough with learning system and MCP
- [First Workflow Tutorial](getting-started/FIRST_WORKFLOW_TUTORIAL.md) — Guided hands-on walkthrough

---

## Architecture

- [OS Architecture](architecture/os-architecture.md) — LLM OS mental model (kernel, processes, RAM, drivers)
- [System Overview](architecture/overview.md) — Agent types, responsibilities, and orchestration
- [CLAUDE.md Architecture](architecture/CLAUDE_FILE_ARCHITECTURE.md) — How plugin and project instructions load
- [Config Loading Order](architecture/CONFIG_LOADING_ORDER.md) — Priority chain for configuration files
- [Multi-Session Architecture](architecture/MULTI_SESSION_ARCHITECTURE.md) — Parallel sessions and state management
- [Workflow State Management](architecture/WORKFLOW_STATE_MANAGEMENT.md) — State persistence and handoff
- [Workflow Diagrams](architecture/WORKFLOW_DIAGRAMS.md) — Visual 5-phase workflow reference

---

## Guides

- [Agent Selection Guide](guides/AGENT_SELECTION_GUIDE.md) — How agents are auto-selected per task
- [Agent Teams Guide](guides/AGENT_TEAMS_GUIDE.md) — Multi-agent orchestration with Claude Agent Teams
- [Team Workflow Bridge](guides/TEAM_WORKFLOW_BRIDGE.md) — Cross-team coordination and workflow integration
- [Design System Guide](guides/DESIGN_SYSTEM_GUIDE.md) — UI library selection (MUI, Tailwind, shadcn/ui)
- [Styling Detection Guide](guides/STYLING_DETECTION_GUIDE.md) — CSS framework auto-detection logic
- [TOON Format Guide](guides/TOON_FORMAT_GUIDE.md) — Token-Optimized Object Notation specification
- [Usage Guide](guides/USAGE_GUIDE.md) — Best practices, workflow modes, and pro tips
- [Confluence Operations](guides/CONFLUENCE_OPERATIONS.md) — Confluence integration usage
- [Image Analysis](guides/IMAGE_ANALYSIS.md) — Visual analysis with Figma and screenshots

---

## Operations

- [MCP Guide](operations/MCP_GUIDE.md) — 6 bundled MCP servers, setup, and creating your own
- [Troubleshooting](operations/TROUBLESHOOTING.md) — Common issues and fixes
- [Security & Trust](operations/SECURITY_AND_TRUST.md) — Security model and trust policies
- [Learning System](operations/LEARNING_SYSTEM.md) — Self-improving patterns (local + Supabase)
- [Project Cache](operations/PROJECT_CACHE.md) — Caching strategy and performance
- [Feedback](operations/FEEDBACK.md) — Share your experience

---

## Reference

- [Changelog](reference/CHANGELOG.md) — Full release history
- [Testing Guide](reference/TESTING_GUIDE.md) — Plugin QA and validation procedures

---

## Showcase

- [Example Workflows](showcase/README.md) — Sample workflow outputs (JWT auth, bugfix)

---

## Plugin Internals (AI-consumed)

These live in `aura-frog/` and are optimized for Claude to read:

- [Agents](../aura-frog/agents/README.md) — 15 agents with capabilities
- [Skills](../aura-frog/skills/README.md) — 55 skills (9 auto-invoke + 46 on-demand)
- [Commands](../aura-frog/commands/README.md) — 24 commands (core `/run`, `/check`, `/design`, `/project`, `/af`, `/help` + `/aura-frog:*` hierarchical-planning suite)
- [Rules](../aura-frog/rules/README.md) — 71 rules (3-tier loading: 22 core / 19 agent / 30 workflow)
- [Hooks](../aura-frog/hooks/README.md) — 42 lifecycle hooks
- [Templates](../aura-frog/templates/README.md) — 15 document templates
- [Scripts](../aura-frog/scripts/README.md) — Utility scripts
